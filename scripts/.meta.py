#!/usr/bin/env python3
"""Helper da Graph API (Marketing API) do Meta. Chamado por scripts/meta.sh.

Puxa insights no nivel de ANUNCIO (level=ad) por periodo + os links de cada
anuncio (preview do Meta e permalink do post no Instagram), e normaliza para o
formato que o painel (scripts/dashboard.py) consome.

Shape de cada anuncio:
    {id, name, amount_spent, ctr, impressions, clicks, link_clicks, cpc, cpm,
     video_plays, video_3s, video_p75, preview_link, instagram_link}

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
    "ad_id", "ad_name", "spend", "impressions", "clicks", "inline_link_clicks",
    "ctr", "cpc", "cpm",
    "video_play_actions", "video_p75_watched_actions", "actions",
])


def _get(path, params):
    params = {**params, "access_token": TOKEN}
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def _raw(full_url):
    req = urllib.request.Request(full_url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


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


def fetch_ad_links():
    """Mapa {ad_id: {"preview": preview_shareable_link, "instagram": permalink}}.

    instagram_permalink_url vem do creative e abre o post do anuncio no Instagram
    (link tipo https://www.instagram.com/p/XXX/). Nem todo anuncio tem (ex: so no FB).
    """
    ads = _paginate(f"{ACCOUNT}/ads", {
        "fields": "id,preview_shareable_link,creative{instagram_permalink_url}",
        "limit": 200,
    })
    out = {}
    for a in ads:
        cr = a.get("creative") or {}
        out[str(a["id"])] = {
            "preview": a.get("preview_shareable_link", "") or "",
            "instagram": cr.get("instagram_permalink_url", "") or "",
        }
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
        links = fetch_ad_links()
        print(json.dumps(normalize(fetch_insights(PRESETS[preset]), links),
                         indent=2, ensure_ascii=False))
        return

    if cmd == "build":
        data_dir = sys.argv[2] if len(sys.argv) > 2 else "."
        os.makedirs(data_dir, exist_ok=True)
        links = fetch_ad_links()  # 1x para todos os periodos
        for period, preset in PRESETS.items():
            rows = normalize(fetch_insights(preset), links)
            path = os.path.join(data_dir, f"meta_{period}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
            print(f"  {period:5s} -> {path} ({len(rows)} anuncios)")
        return

    print("comando desconhecido:", cmd, file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
