#!/usr/bin/env python3
"""Gera o painel HTML de performance de criativos (Max).

Lê, por período, os dados do Meta (spend/ctr por ad) e da Guru (receita por
utm_content) de um diretório de dados, cruza por ad id (dígitos após o '|' no
utm_content) e emite um HTML auto-contido com abas de período, cards de resumo,
tabela ordenável com ROAS colorido, split por produto e avisos de UTM.

Uso:
  python3 scripts/dashboard.py <data_dir> <saida.html>

Espera no data_dir, por período P (hoje|ontem|7d|14d|mes):
  meta_<P>.json  -> lista de {id, name, amount_spent, ctr, impressions}
  guru_<P>.json  -> lista de {utm_content, vendas, receita}
"""
import datetime
import json
import os
import re
import sys

PERIODS = [
    ("hoje", "Hoje"),
    ("ontem", "Ontem"),
    ("7d", "7 dias"),
    ("14d", "14 dias"),
    ("mes", "Este mês"),
    ("mespassado", "Mês passado"),
]

# Conta de anuncios (Webnutri) — usada para montar o link do Gerenciador de Anuncios
ACCOUNT_ID = os.environ.get("META_ACCOUNT_ID", "168028315098298")

AD_ID_RE = re.compile(r"(\d{15,})")


def money(s):
    """'R$1.101,65 BRL' -> 1101.65 ; aceita número."""
    if isinstance(s, (int, float)):
        return float(s)
    if not s:
        return 0.0
    s = s.replace(" ", " ").replace("R$", "").replace("BRL", "").strip()
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


def pct(s):
    if not s or "available" in str(s).lower():
        return None
    s = str(s).replace(" ", " ").replace("%", "").replace("%", "").strip()
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def product_of(name):
    m = re.match(r"\s*\[?(WN|MDA|GCN|ANC)\]?", name or "", re.I)
    return m.group(1).upper() if m else "OUTRO"


def ad_id_of(text):
    ids = AD_ID_RE.findall(text or "")
    return ids[-1] if ids else None


def load(data_dir, period):
    meta_p = os.path.join(data_dir, f"meta_{period}.json")
    guru_p = os.path.join(data_dir, f"guru_{period}.json")
    meta = json.load(open(meta_p)) if os.path.exists(meta_p) else []
    guru = json.load(open(guru_p)) if os.path.exists(guru_p) else []
    return meta, guru


def build_period(data_dir, period):
    meta, guru = load(data_dir, period)

    # Receita por ad id (a partir do utm_content da Guru)
    rev_by_id, vendas_by_id = {}, {}
    unattributed_rev = unattributed_v = 0.0
    hygiene = []  # avisos de UTM
    for row in guru:
        utm = row.get("utm_content", "")
        rev = float(row.get("receita", 0) or 0)
        v = int(row.get("vendas", 0) or 0)
        aid = ad_id_of(utm)
        if aid:
            rev_by_id[aid] = rev_by_id.get(aid, 0) + rev
            vendas_by_id[aid] = vendas_by_id.get(aid, 0) + v
            if "{{" in utm or "5B" in utm or "7C" in utm:
                hygiene.append({"utm": utm, "receita": rev, "tipo": "UTM malformada (encoding/macro)"})
        else:
            unattributed_rev += rev
            unattributed_v += v

    rows, seen = [], set()
    rate = lambda a, b: round(100 * a / b, 1) if b else None
    for ad in meta:
        aid = str(ad.get("id"))
        seen.add(aid)
        spend = money(ad.get("amount_spent"))
        rev = rev_by_id.get(aid, 0.0)
        v = vendas_by_id.get(aid, 0)
        roas = (rev / spend) if spend > 0 else None
        cac = (spend / v) if v > 0 else None
        impressions = int(ad.get("impressions", 0) or 0)
        plays = int(ad.get("video_plays", 0) or 0)
        v3 = int(ad.get("video_3s", 0) or 0)
        p75 = int(ad.get("video_p75", 0) or 0)
        link_clicks = int(ad.get("link_clicks", 0) or 0)
        rows.append({
            "id": aid,
            "name": ad.get("name", ""),
            "product": product_of(ad.get("name", "")),
            "spend": round(spend, 2),
            "impressions": impressions,
            "frequency": round(float(ad.get("frequency", 0) or 0), 2),
            "clicks": int(ad.get("clicks", 0) or 0),
            "ctr": round(float(ad.get("ctr", 0) or 0), 2),
            "cpc": round(float(ad.get("cpc", 0) or 0), 2),
            "cpm": round(float(ad.get("cpm", 0) or 0), 2),
            "vendas": v,
            "receita": round(rev, 2),
            "roas": round(roas, 2) if roas is not None else None,
            "cac": round(cac, 2) if cac is not None else None,
            "preview": ad.get("preview_link", ""),
            "instagram": ad.get("instagram_link", ""),
            "play_rate": rate(plays, impressions),
            "ret_hook": rate(v3, plays),
            "ret_body": rate(p75, plays),
            "conv_body": rate(v, p75),
            "cta": rate(link_clicks, p75),
        })

    # Vendas com ad id que não estão no top de spend do Meta (spend desconhecido)
    outros_rev = sum(r for i, r in rev_by_id.items() if i not in seen)
    outros_v = sum(v for i, v in vendas_by_id.items() if i not in seen)

    spend_total = sum(r["spend"] for r in rows)
    rev_rastreada = sum(r["receita"] for r in rows)
    rev_total = rev_rastreada + unattributed_rev + outros_rev
    roas_geral = (rev_rastreada / spend_total) if spend_total > 0 else None

    rows.sort(key=lambda r: -r["receita"])
    return {
        "rows": rows,
        "hygiene": hygiene,
        "summary": {
            "spend_total": round(spend_total, 2),
            "rev_rastreada": round(rev_rastreada, 2),
            "rev_sem_atrib": round(unattributed_rev, 2),
            "rev_outros": round(outros_rev, 2),
            "vendas_sem_atrib": int(unattributed_v),
            "vendas_outros": int(outros_v),
            "rev_total": round(rev_total, 2),
            "roas_geral": round(roas_geral, 2) if roas_geral is not None else None,
            "cobertura": round(100 * rev_rastreada / rev_total, 1) if rev_total > 0 else 0,
        },
    }


def date_ranges(today):
    """Intervalo de datas (label) de cada periodo, relativo a `today` (date)."""
    f = lambda d: d.strftime("%d/%m")
    td = datetime.timedelta
    last_prev = today.replace(day=1) - td(days=1)   # último dia do mês passado
    first_prev = last_prev.replace(day=1)           # primeiro dia do mês passado
    return {
        "hoje": f(today),
        "ontem": f(today - td(days=1)),
        "7d": f(today - td(days=6)) + "–" + f(today),
        "14d": f(today - td(days=13)) + "–" + f(today),
        "mes": f(today.replace(day=1)) + "–" + f(today),
        "mespassado": f(first_prev) + "–" + f(last_prev),
    }


def main():
    data_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    out = sys.argv[2] if len(sys.argv) > 2 else "dashboard.html"
    generated = sys.argv[3] if len(sys.argv) > 3 else ""
    today = sys.argv[4] if len(sys.argv) > 4 else ""

    today_d = datetime.date(*map(int, today.split("-"))) if today else datetime.date.today()
    ranges = date_ranges(today_d)

    data = {p: build_period(data_dir, p) for p, _ in PERIODS}
    payload = json.dumps({"periods": PERIODS, "data": data, "generated": generated,
                          "account": ACCOUNT_ID, "ranges": ranges}, ensure_ascii=False)

    html = HTML_TEMPLATE.replace("/*__DATA__*/", payload)
    out_dir = os.path.dirname(out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Painel gerado: {out}")


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel de Performance — Nutri de Consultório</title>
<style>
  :root{--bg:#0f1115;--card:#1a1d24;--line:#2a2e38;--txt:#e6e8ec;--mut:#8b909c;
        --green:#1f9d55;--greenbg:#11341f;--yellow:#b8860b;--yellowbg:#33290a;--red:#c0392b;--redbg:#3a1714;--accent:#4f8cff;}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  header{padding:20px 28px 8px}
  h1{margin:0;font-size:20px}
  .sub{color:var(--mut);font-size:12px;margin-top:4px}
  .tabs{display:flex;gap:6px;padding:14px 28px 0;flex-wrap:wrap}
  .tab{padding:8px 16px;border:1px solid var(--line);border-radius:8px 8px 0 0;background:var(--card);
       color:var(--mut);cursor:pointer;font-weight:600}
  .tab.active{color:var(--txt);border-bottom-color:var(--accent);box-shadow:inset 0 -2px 0 var(--accent)}
  .wrap{padding:0 28px 40px}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0}
  .c{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
  .c .k{color:var(--mut);font-size:11px;text-transform:uppercase;letter-spacing:.4px}
  .c .v{font-size:22px;font-weight:700;margin-top:4px}
  .c small{color:var(--mut);font-weight:400;font-size:12px}
  .filters{display:flex;gap:8px;margin:8px 0;flex-wrap:wrap;align-items:center}
  .chip{padding:5px 12px;border:1px solid var(--line);border-radius:20px;background:var(--card);color:var(--mut);cursor:pointer;font-size:12px}
  .chip.on{color:#fff;border-color:var(--accent);background:#1b2740}
  .search{position:relative;display:inline-flex;align-items:center}
  .search input{padding:6px 28px 6px 30px;border:1px solid var(--line);border-radius:20px;background:var(--card);color:var(--txt);font-size:12px;width:220px;outline:none}
  .search input:focus{border-color:var(--accent);background:#161a22}
  .search input::placeholder{color:var(--mut)}
  .search .ico{position:absolute;left:11px;color:var(--mut);font-size:12px;pointer-events:none}
  .search .clr{position:absolute;right:9px;color:var(--mut);cursor:pointer;font-size:14px;line-height:1;padding:0 2px}
  .search .clr:hover{color:var(--txt)}
  table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
  th,td{padding:9px 12px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}
  th{color:var(--mut);font-size:11px;text-transform:uppercase;cursor:pointer;user-select:none;position:sticky;top:0;background:var(--card)}
  th:first-child,td:first-child{text-align:left;white-space:normal;max-width:380px}
  th.idx,td.idx{width:34px;max-width:34px;text-align:right;color:var(--mut);padding-right:6px;cursor:default}
  td.idx{font-variant-numeric:tabular-nums}
  .pill{display:inline-block;padding:1px 7px;border-radius:6px;font-size:10px;font-weight:700;margin-right:6px}
  .WN{background:#13314a;color:#7fb6ff}.MDA{background:#3a2a13;color:#f0b95f}.GCN{background:#2a1340;color:#c08bff}.OUTRO{background:#23262e;color:#9aa}
  .roas{font-weight:700;padding:2px 8px;border-radius:6px}
  .good{background:var(--greenbg);color:#56d98a}.mid{background:var(--yellowbg);color:#e7c463}.bad{background:var(--redbg);color:#ff8a7a}.na{color:var(--mut)}
  tr.win td{background:#10271a}
  tr.win td:first-child{box-shadow:inset 3px 0 0 var(--green)}
  tr.lose td{background:#2a1411}
  tr.lose td:first-child{box-shadow:inset 3px 0 0 var(--red)}
  tr:hover td{background:#21252e}
  .badge{font-size:13px;margin-right:5px}
  .legend{color:var(--mut);font-size:11px;margin-left:14px}
  .legend b{color:var(--txt)}
  .warn{background:#241a12;border:1px solid #4a3318;border-radius:10px;padding:12px 16px;margin:14px 0;color:#f0c98a}
  .warn b{color:#ffd9a0}
  .muted{color:var(--mut)}
  a.adlink{color:var(--txt);text-decoration:none}
  a.adlink:hover{color:var(--accent);text-decoration:underline}
  a.adlink .go{color:var(--accent);font-size:11px;margin-left:5px;opacity:.7}
  .bar{height:6px;background:#23262e;border-radius:4px;overflow:hidden;margin-top:6px}
  .bar>i{display:block;height:100%;background:var(--accent)}
  .tscroll{overflow-x:auto;border-radius:12px}
  .tscroll table{min-width:1360px}
</style>
</head>
<body>
<header>
  <h1>📊 Painel de Performance — Criativos</h1>
  <div class="sub">Meta Ads (spend) × Digital Manager Guru (venda real) cruzados por ad id · Conta 01 - Nutri de Consultório · <b>somente vendas atribuídas ao Meta (utm_source=FB)</b> · <span id="gen"></span></div>
</header>
<div class="tabs" id="tabs"></div>
<div class="wrap" id="wrap"></div>
<script>
const DB = /*__DATA__*/;
let cur = '7d', prod = 'TODOS', sortKey='receita', sortDir=-1, search='', searchCaret=null;
const fmt = n => n==null ? '—' : 'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const num = n => n==null ? '—' : n.toLocaleString('pt-BR');
const roasClass = r => r==null?'na':(r>=2?'good':(r>=1?'mid':'bad'));
// Gasto mínimo (R$) p/ um criativo ser classificado como winner/loser. Abaixo disso = pouco dado, fica neutro.
const SPEND_MIN = 50;
// 🏆 escalar (ROAS>=2) · ⚠️ matar (ROAS<1, gastou e não retornou) · '' = neutro
const tier = r => (r.spend < SPEND_MIN || r.roas==null) ? '' : (r.roas>=2 ? 'win' : (r.roas<1 ? 'lose' : ''));
const badgeOf = t => t==='win' ? '<span class="badge">🏆</span>' : (t==='lose' ? '<span class="badge">⚠️</span>' : '');
const adLink = id => `https://adsmanager.facebook.com/adsmanager/manage/ads?act=${DB.account}&selected_ad_ids=${id}`;
const rate = n => n==null ? '—' : n.toLocaleString('pt-BR',{maximumFractionDigits:2})+'%';
// Frequencia (impr/alcance): saturacao do publico. <2 saudavel · 2–3 atencao · ≥3 saturado.
const freq = f => (f==null||f===0) ? '<span class="na">—</span>'
  : `<span style="color:${f>=3?'#ff8a7a':(f>=2?'#e7c463':'var(--txt)')};font-weight:${f>=2?600:400}">${f.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}x</span>`;

function tabs(){
  document.getElementById('tabs').innerHTML = DB.periods.map(([k,l])=>
    `<div class="tab ${k===cur?'active':''}" onclick="setP('${k}')">${l}</div>`).join('');
  document.getElementById('gen').textContent = DB.generated ? ('última atualização: '+DB.generated) : '';
}
function setP(k){cur=k;render()}
function setProd(p){prod=p;render()}
function setSort(k){ if(sortKey===k) sortDir*=-1; else {sortKey=k;sortDir=-1;} render() }
function setSearch(v,caret){ search=v; searchCaret=(caret==null?v.length:caret); render() }
function clearSearch(){ search=''; searchCaret=null; render() }

function render(){
  tabs();
  const d = DB.data[cur], s = d.summary;
  const isAll = prod==='TODOS';
  const q = search.trim().toLowerCase();
  const searching = q.length>0;
  let rows = d.rows.filter(r=> (isAll || r.product===prod) && (!searching || (r.name||'').toLowerCase().includes(q)));
  rows.sort((a,b)=>{const x=a[sortKey],y=b[sortKey];
    if(x==null)return 1; if(y==null)return -1; return (x>y?1:x<y?-1:0)*sortDir;});
  const prods = ['TODOS',...Array.from(new Set(d.rows.map(r=>r.product)))];
  const range = (DB.ranges&&DB.ranges[cur])||'';
  // Agregados recalculados sobre as linhas filtradas (refletem o produto selecionado)
  const agg = rows.reduce((a,r)=>{a.spend+=r.spend||0;a.rev+=r.receita||0;a.vendas+=r.vendas||0;return a;},{spend:0,rev:0,vendas:0});
  const aRoas = agg.spend>0 ? agg.rev/agg.spend : null;
  const aCac = agg.vendas>0 ? agg.spend/agg.vendas : null;
  const periodLine = `<div class="muted" style="margin:14px 0 -2px">📅 Período: <b style="color:var(--txt)">${range}/2026</b> · só vendas atribuídas ao Meta (utm_source=FB)${isAll?'':` · filtro: <b style="color:var(--txt)">${prod}</b>`}${searching?` · busca: <b style="color:var(--txt)">"${search}"</b>`:''}</div>`;
  const cards = `
   <div class="cards">
     <div class="c"><div class="k">Investido (Meta)</div><div class="v">${fmt(agg.spend)}</div></div>
     <div class="c"><div class="k">Receita FB${isAll?' (por criativo)':' · '+prod}</div><div class="v">${fmt(agg.rev)}</div><small>ROAS ${aRoas==null?'—':aRoas.toFixed(2)+'x'}</small></div>
     <div class="c"><div class="k">Vendas</div><div class="v">${num(agg.vendas)}</div><small>CAC ${fmt(aCac)}</small></div>
     ${isAll&&!searching?`<div class="c"><div class="k">FB sem criativo</div><div class="v">${fmt(s.rev_sem_atrib)}</div><small>${s.vendas_sem_atrib} vendas · UTM/macro quebrada</small></div>
     <div class="c"><div class="k">Atribuída a criativo</div><div class="v">${s.cobertura}%</div><div class="bar"><i style="width:${s.cobertura}%"></i></div></div>`:''}
   </div>`;
  const warn = (isAll && !searching && (s.rev_sem_atrib>0 || d.hygiene.length)) ? `<div class="warn">
     ${s.rev_sem_atrib>0?`<b>🔴 ${fmt(s.rev_sem_atrib)} de receita FB sem criativo</b> (${s.vendas_sem_atrib} vendas) — UTM/macro <code>{{ad.id}}</code> não renderizada ou colchetes/pipe quebrando o encoding. Corrigir o parâmetro de URL recupera essa atribuição.`:''}
   </div>`:'';
  const filters = `<div class="filters">${prods.map(p=>`<span class="chip ${p===prod?'on':''}" onclick="setProd('${p}')">${p}</span>`).join('')}
     <span class="search"><span class="ico">🔍</span><input id="search" type="text" placeholder="filtrar por nome (ex: HK03)" value="${search.replace(/"/g,'&quot;')}" oninput="setSearch(this.value,this.selectionStart)" autocomplete="off">${searching?`<span class="clr" onclick="clearSearch()" title="limpar">×</span>`:''}</span>
     <span class="legend">🏆 <b>ROAS ≥ 2</b> (escalar) · ⚠️ <b>ROAS < 1</b> (matar) · gasto ≥ R$ ${SPEND_MIN}</span>
     <span class="muted" style="margin-left:auto">${rows.length} criativos · clique no cabeçalho pra ordenar</span></div>`;
  const th = (k,l)=>`<th onclick="setSort('${k}')">${l}${sortKey===k?(sortDir<0?' ▼':' ▲'):''}</th>`;
  const head = `<tr><th class="idx">#</th>${th('name','Criativo')}${th('spend','Investido')}${th('receita','Receita')}${th('vendas','Vendas')}${th('roas','ROAS')}${th('cac','CAC')}${th('clicks','Cliques')}${th('ctr','CTR')}${th('cpc','CPC')}${th('cpm','CPM')}${th('impressions','Impr.')}${th('frequency','Freq.')}${th('play_rate','Play%')}${th('ret_hook','Ret.Hook')}${th('ret_body','Ret.Body')}${th('conv_body','Conv.Body')}${th('cta','CTA')}</tr>`;
  const body = rows.map((r,i)=>{const t=tier(r);return `<tr class="${t}">
     <td class="idx">${i+1}</td>
     <td>${badgeOf(t)}<span class="pill ${r.product}">${r.product}</span><a class="adlink" href="${r.instagram||r.preview||adLink(r.id)}" target="_blank" rel="noopener">${r.name}<span class="go">↗ ${r.instagram?'ver no Instagram':'ver anúncio'}</span></a></td>
     <td>${fmt(r.spend)}</td><td>${fmt(r.receita)}</td><td>${num(r.vendas)}</td>
     <td><span class="roas ${roasClass(r.roas)}">${r.roas==null?'—':r.roas+'x'}</span></td>
     <td>${fmt(r.cac)}</td><td>${num(r.clicks)}</td><td>${rate(r.ctr)}</td><td>${fmt(r.cpc)}</td><td>${fmt(r.cpm)}</td><td>${num(r.impressions)}</td><td>${freq(r.frequency)}</td>
     <td>${rate(r.play_rate)}</td><td>${rate(r.ret_hook)}</td><td>${rate(r.ret_body)}</td><td>${rate(r.conv_body)}</td><td>${rate(r.cta)}</td>
   </tr>`}).join('');
  document.getElementById('wrap').innerHTML = periodLine + cards + warn + filters + `<div class="tscroll"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  if(searchCaret!==null){ const el=document.getElementById('search'); if(el){ el.focus(); try{ el.setSelectionRange(searchCaret,searchCaret); }catch(e){} } }
}
render();
</script>
</body>
</html>"""


if __name__ == "__main__":
    main()
