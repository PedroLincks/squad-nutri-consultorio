#!/usr/bin/env python3
"""Helper da Graph API (Marketing API) do Meta. Chamado por scripts/meta.sh.

Puxa insights no nivel de ANUNCIO (level=ad) por periodo e normaliza os campos
para o formato que o painel (scripts/dashboard.py) espera:

    {id, name, amount_spent, ctr, impressions}

A chave de cruzamento com a venda real (Guru) e o ad id (os digitos apos o '|'
no utm_content). Por isso o 'id' aqui DEVE ser o ad_id do Meta.

Autenticacao: META_ACCESS_TOKEN (token de longa duracao) + META_ACCOUNT_ID.
Sem dependencias externas: usa urllib (stdlib).
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

API_VERSION = "v21.0"
TOKEN = os.environ.get("META_ACCESS_TOKEN", "")
# Aceita com ou sem o prefixo "act_"; normaliza para o formato da API.
_ACC = os.environ.get("META_ACCOUNT_ID", "168028315098298").strip()
ACCOUNT = _ACC if _ACC.startswith("act_") else f"act_{_ACC}"

BASE = f"https://graph.facebook.com/{API_VERSION}"

# Periodo do painel -> date_preset da Graph API
PRESETS = {
    "hoje": "today",
    "ontem": "yesterday",
    "7d": "last_7d",
    "14d": "last_14d",
    "mes": "this_month",
}

FIELDS = "ad_id,ad_name,spend,ctr,impressions"


def _get(path, params):
    params = {**params, "access_token": TOKEN}
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_insights(preset):
    """Pagina todos os insights de anuncio do periodo (date_preset)."""
    out = []
    params = {
        "level": "ad",
        "fields": FIELDS,
        "date_preset": preset,
        "limit": 200,
    }
    path = f"{ACCOUNT}/insights"
    next_url = None
    while True:
        data = _get(path, params) if next_url is None else _raw(next_url)
        out.extend(data.get("data", []))
        nxt = (data.get("paging") or {}).get("next")
        if not nxt:
            break
        next_url = nxt
        time.sleep(0.2)  # respeita o rate limit
    return out


def _raw(full_url):
    req = urllib.request.Request(full_url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def normalize(rows):
    """Mapeia o insight cru para o shape consumido pelo dashboard."""
    out = []
    for r in rows:
        out.append({
            "id": str(r.get("ad_id", "")),
            "name": r.get("ad_name", ""),
            "amount_spent": float(r.get("spend", 0) or 0),
            "ctr": float(r.get("ctr", 0) or 0),
            "impressions": int(r.get("impressions", 0) or 0),
        })
    return out


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"

    if not TOKEN:
        print("ERRO: META_ACCESS_TOKEN vazio no .env", file=sys.stderr)
        sys.exit(1)

    if cmd == "ping":
        data = _get(ACCOUNT, {"fields": "name,account_status,currency"})
        nome = data.get("name", "?")
        status = data.get("account_status", "?")
        moeda = data.get("currency", "?")
        print(f"OK — autenticado. Conta {ACCOUNT}: {nome} (status {status}, {moeda})")
        return

    if cmd == "ads":
        preset = sys.argv[2] if len(sys.argv) > 2 else "7d"
        if preset not in PRESETS:
            print(f"periodo invalido: {preset} (use: {', '.join(PRESETS)})", file=sys.stderr)
            sys.exit(1)
        rows = normalize(fetch_insights(PRESETS[preset]))
        print(json.dumps(rows, indent=2, ensure_ascii=False))
        return

    if cmd == "build":
        data_dir = sys.argv[2] if len(sys.argv) > 2 else "."
        os.makedirs(data_dir, exist_ok=True)
        for period, preset in PRESETS.items():
            rows = normalize(fetch_insights(preset))
            path = os.path.join(data_dir, f"meta_{period}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
            print(f"  {period:5s} -> {path} ({len(rows)} anuncios)")
        return

    print("comando desconhecido:", cmd, file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
