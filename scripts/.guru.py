#!/usr/bin/env python3
"""Helper da API v2 do Digital Manager Guru. Chamado por scripts/gateway.sh.

Filtra por confirmed_at (data de aprovacao) + transaction_status=approved e
pagina por cursor. A chave de atribuicao e trackings.utm_content, que carrega
"<nome do criativo>|<id do ad no Meta>".
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

BASE = "https://digitalmanager.guru/api/v2/transactions"
TOKEN = os.environ.get("GURU_API_TOKEN", "")


def _req(params):
    url = BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_all(ini, fim, status="approved"):
    """Pagina todas as transacoes aprovadas no periodo (por confirmed_at)."""
    out, cursor = [], None
    while True:
        params = {
            "confirmed_at_ini": ini,
            "confirmed_at_end": fim,
            "transaction_status[]": status,
            "per_page": 100,
        }
        if cursor:
            params["cursor"] = cursor
        data = _req(params)
        out.extend(data.get("data", []))
        if not data.get("has_more_pages"):
            break
        cursor = data.get("next_cursor")
        if not cursor:
            break
        time.sleep(0.2)  # respeita o rate limit (360/min)
    return out


def _val(t):
    pay = t.get("payment") or {}
    for k in ("total", "net", "gross"):
        v = pay.get(k)
        if isinstance(v, (int, float)):
            return float(v)
    return 0.0


def _utm_content(t):
    tr = t.get("trackings") or {}
    return tr.get("utm_content") or "sem_utm"


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "help"
    ini = sys.argv[2] if len(sys.argv) > 2 else None
    fim = sys.argv[3] if len(sys.argv) > 3 else None

    if cmd == "ping":
        data = _req({"confirmed_at_ini": ini, "confirmed_at_end": fim,
                     "transaction_status[]": "approved", "per_page": 1})
        n = data.get("total_rows", "?")
        print(f"OK — autenticado. Vendas aprovadas em {ini}..{fim}: {n}")
        return

    if cmd == "sample":
        data = _req({"confirmed_at_ini": ini, "confirmed_at_end": fim,
                     "transaction_status[]": "approved", "per_page": 1})
        rows = data.get("data", [])
        print(json.dumps(rows[0] if rows else data, indent=2, ensure_ascii=False))
        return

    if cmd == "orders":
        print(json.dumps(fetch_all(ini, fim), indent=2, ensure_ascii=False))
        return

    if cmd == "revenue-by-utm":
        # Considera SOMENTE vendas vindas dos anuncios: trackings.utm_source == "FB".
        # Exclui direto/organico/recompra (sem_utm) e outras origens.
        agg = {}
        for t in fetch_all(ini, fim):
            src = ((t.get("trackings") or {}).get("utm_source") or "").strip().upper()
            if src != "FB":
                continue
            key = _utm_content(t)
            row = agg.setdefault(key, {"utm_content": key, "vendas": 0, "receita": 0.0})
            row["vendas"] += 1
            row["receita"] += _val(t)
        ranked = sorted(agg.values(), key=lambda r: -r["receita"])
        for r in ranked:
            r["receita"] = round(r["receita"], 2)
        print(json.dumps(ranked, indent=2, ensure_ascii=False))
        return

    print("comando desconhecido:", cmd, file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
