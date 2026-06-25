#!/usr/bin/env bash
#
# deploy-painel.sh — Regenera o painel HTML e publica na Vercel num comando.
#
# Pre-requisitos no .env: VERCEL_TOKEN
# Dados em docs/outputs/performance/data/ (meta_*.json + guru_*.json).
# URL de producao: https://painel-nutri.vercel.app
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SCOPE="datalincks-8877s-projects"
DATA="docs/outputs/performance/data"
SITE="painel-nutri"

# Token via env (CI) ou .env (local)
TOKEN="${VERCEL_TOKEN:-}"
if [[ -z "${TOKEN}" && -f .env ]]; then
  TOKEN="$(grep '^VERCEL_TOKEN=' .env | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
if [[ -z "${TOKEN}" ]]; then
  echo "ERRO: VERCEL_TOKEN não definido (env nem .env)" >&2; exit 1
fi

echo "1/2 Gerando painel..."
python3 scripts/dashboard.py "$DATA" "$SITE/index.html" "$(date '+%d/%m/%Y %H:%M')" "$(date '+%Y-%m-%d')"

echo "2/2 Publicando na Vercel..."
npx --yes vercel@latest deploy "$SITE" --prod --yes --scope "$SCOPE" --token="$TOKEN"

echo "Pronto: https://painel-nutri.vercel.app"
