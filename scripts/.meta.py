#!/usr/bin/env python3
"""Helper da Graph API (Marketing API) do Meta. Chamado por scripts/meta.sh.

Puxa insights no nivel de ANUNCIO (level=ad) por periodo + os links de cada
anuncio (preview do Meta e permalink do post no Instagram), e normaliza para o
formato que o painel (scripts/dashboard.py) consome.

Shape de cada anuncio:
    {id, name, amount_spent, ctr, impressions, reach, frequency, clicks,
     link_clicks, cpc, cpm, video_plays, video_3s, video_p75, preview_link,
     instagram_link}

  frequency     = impressions / reach no periodo (medidor de saturacao do
                  criativo/publico; quanto maior, mais o mesmo publico ja viu)

  id            = ad_id do Meta (chave de cruzamento com a venda real da Guru:
                  os digitos apos o '|' no utm_content)
  video_plays   = video_play_actions (reproducoes de video)
  video_3s      = action_type "video_view" (reproducoes de 3s)
  video_p75     = video_p75_watched_actions (assistiu 75%)
  preview_link  = preview_shareable_link (abre o anuncio renderizado, sem login)
  instagram_link= instagram_permalink_url do creative + "#advertiser" (abre o
                  post do anuncio no Instagram). Vazio se o anuncio nao tem post
                  no Instagram (ex: roda so no Facebook).

As metricas derivadas (Play Rate, Retencao do Hook/Body, Conversao do Body,
Medidor de CTA) sao calculadas no dashboard.py, que tambem tem a venda da Guru.

Autenticacao: META_ACCESS_TOKEN + META_ACCOUNT_ID. Sem deps externas (urllib stdlib).
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

API_VERSION = "v21.0"
TOKEN = os.environ.get("META_ACCESS_TOKEN", "")
_ACC = os.environ.get("META_ACCOUNT_ID", "168028315098298").strip()
ACCOUNT = _ACC if _ACC.startswith("act_") else f"act_{_ACC}"

BASE = f"https://graph.facebook.com/{API_VERSION}"

PRESETS = {
    "hoje": "today",
    "ontem": "yesterday",
    "7d": "last_7d",
    "14d": "last_14d",
    "mes": "this_month",
    "mespassado": "last_month",
}

FIELDS = ",".join([
    "ad_id", "ad_name", "spend", "impressions", "reach", "frequency",
    "clicks", "inline_link_clicks", "ctr", "cpc", "cpm",
    "video_play_actions", "video_p75_watched_actions", "actions",
])


# Codigos de erro do Meta que significam "desacelere" (rate limit) — vale a pena
# tentar de novo com backoff em vez de morrer. 80004 = "too many calls to this
# ad-account"; 4/17/32/613 = throttling geral por app/usuario.
_RATE_LIMIT_CODES = {4, 17, 32, 613, 80000, 80003, 80004}


def _open(req):
    """Abre a request com retry exponencial em rate limit do Meta."""
    delay = 5
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            code = 0
            try:
                code = int((json.loads(body).get("error") or {}).get("code", 0))
            except Exception:
                pass
            if (code in _RATE_LIMIT_CODES or e.code == 429) and attempt < 3:
                print(f"  rate limit do Meta (code {code}); aguardando {delay}s "
                      f"e tentando de novo...", file=sys.stderr)
                time.sleep(delay)
                delay *= 2
                continue
            # Anexa o corpo da resposta pra o erro ser diagnosticavel no log do CI.
            raise urllib.error.HTTPError(e.url, e.code, f"{e.reason} — {body[:300]}",
                                         e.headers, None)


def _get(path, params):
    params = {**params, "access_token": TOKEN}
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    return _open(req)


def _raw(full_url):
    req = urllib.request.Request(full_url, headers={"Accept": "application/json"})
    return _open(req)


def _paginate(path, params):
    """Itera todas as paginas de um endpoint de lista."""
    out, next_url = [], None
    while True:
        data = _get(path, params) if next_url is None else _raw(next_url)
        out.extend(data.get("data", []))
        nxt = (data.get("paging") or {}).get("next")
        if not nxt:
            break
        next_url = nxt
        time.sleep(0.2)
    return out


def fetch_insights(preset):
    return _paginate(f"{ACCOUNT}/insights", {
        "level": "ad", "fields": FIELDS, "date_preset": preset, "limit": 200,
    })


def fetch_ad_links(ad_ids):
    """Mapa {ad_id: {"preview": preview_shareable_link, "instagram": permalink}}.

    Busca SOMENTE os ad_ids que aparecem nos insights (anuncios com dado no
    periodo), em lotes via ?ids= — em vez de paginar a conta inteira (600+
    anuncios). preview_shareable_link e um campo caro no rate limit da conta;
    paginar tudo estourava o limite 80004 e derrubava o pipeline.

    instagram_permalink_url vem do creative e abre o post do anuncio no Instagram
    (link tipo https://www.instagram.com/p/XXX/). Nem todo anuncio tem (ex: so no FB).

    Nao-fatal: os links sao enriquecimento. Se um lote falhar (rate limit apos os
    retries, etc.), seguimos sem os links daquele lote — o painel atualiza igual.
    """
    ids = [i for i in {str(a) for a in ad_ids} if i]
    fields = "preview_shareable_link,creative{instagram_permalink_url}"
    out = {}
    for i in range(0, len(ids), 50):  # ?ids= aceita ate 50 por chamada
        batch = ids[i:i + 50]
        try:
            data = _get("", {"ids": ",".join(batch), "fields": fields})
        except Exception as e:
            print(f"  aviso: links do lote {i // 50 + 1} falharam ({e}); "
                  f"seguindo sem eles", file=sys.stderr)
            continue
        for aid, a in (data.items() if isinstance(data, dict) else []):
            cr = (a or {}).get("creative") or {}
            out[str(aid)] = {
                "preview": (a or {}).get("preview_shareable_link", "") or "",
                "instagram": cr.get("instagram_permalink_url", "") or "",
            }
        time.sleep(0.3)
    return out


def _first(v):
    """Campo de action que vem como lista [{action_type,value}] -> soma dos values."""
    if isinstance(v, list):
        return sum(float(x.get("value", 0) or 0) for x in v)
    return float(v or 0)


def _action(actions, action_type):
    for a in actions or []:
        if a.get("action_type") == action_type:
            return float(a.get("value", 0) or 0)
    return 0.0


def _instagram_link(permalink):
    """Permalink do Instagram -> link da visao do anunciante (.../p/CODE/#advertiser)."""
    if not permalink:
        return ""
    if "#" in permalink:
        return permalink
    return permalink.rstrip("/") + "/#advertiser"


def normalize(rows, links):
    out = []
    for r in rows:
        aid = str(r.get("ad_id", ""))
        lk = links.get(aid, {})
        out.append({
            "id": aid,
            "name": r.get("ad_name", ""),
            "amount_spent": float(r.get("spend", 0) or 0),
            "ctr": float(r.get("ctr", 0) or 0),
            "impressions": int(r.get("impressions", 0) or 0),
            "reach": int(r.get("reach", 0) or 0),
            "frequency": float(r.get("frequency", 0) or 0),
            "clicks": int(float(r.get("clicks", 0) or 0)),
            "link_clicks": int(float(r.get("inline_link_clicks", 0) or 0)),
            "cpc": float(r.get("cpc", 0) or 0),
            "cpm": float(r.get("cpm", 0) or 0),
            "video_plays": int(_first(r.get("video_play_actions"))),
            "video_3s": int(_action(r.get("actions"), "video_view")),
            "video_p75": int(_first(r.get("video_p75_watched_actions"))),
            "preview_link": lk.get("preview", ""),
            "instagram_link": _instagram_link(lk.get("instagram", "")),
        })
    return out


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"

    if not TOKEN:
        print("ERRO: META_ACCESS_TOKEN vazio no .env", file=sys.stderr)
        sys.exit(1)

    if cmd == "ping":
        data = _get(ACCOUNT, {"fields": "name,account_status,currency"})
        print(f"OK — autenticado. Conta {ACCOUNT}: {data.get('name','?')} "
              f"(status {data.get('account_status','?')}, {data.get('currency','?')})")
        return

    if cmd == "ads":
        preset = sys.argv[2] if len(sys.argv) > 2 else "7d"
        if preset not in PRESETS:
            print(f"periodo invalido: {preset} (use: {', '.join(PRESETS)})", file=sys.stderr)
            sys.exit(1)
        rows = fetch_insights(PRESETS[preset])
        links = fetch_ad_links({r.get("ad_id", "") for r in rows})
        print(json.dumps(normalize(rows, links),
                         indent=2, ensure_ascii=False))
        return

    if cmd == "build":
        data_dir = sys.argv[2] if len(sys.argv) > 2 else "."
        os.makedirs(data_dir, exist_ok=True)
        # Puxa os insights de todos os periodos primeiro, junta os ad_ids com dado
        # e busca os links so desses (em lotes) — 1x para todos os periodos.
        insights = {period: fetch_insights(preset)
                    for period, preset in PRESETS.items()}
        ad_ids = {str(r.get("ad_id", ""))
                  for rows in insights.values() for r in rows}
        links = fetch_ad_links(ad_ids)
        for period, rows in insights.items():
            norm = normalize(rows, links)
            path = os.path.join(data_dir, f"meta_{period}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(norm, f, ensure_ascii=False, indent=2)
            print(f"  {period:5s} -> {path} ({len(norm)} anuncios)")
        return

    print("comando desconhecido:", cmd, file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
