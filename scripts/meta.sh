#!/usr/bin/env bash
#
# meta.sh — Helper para puxar GASTO + métricas de criativo do Meta Ads (Marketing API).
#
# Esta é a perna do INVESTIMENTO do squad de performance (agente Max).
# Cruza com a venda real da Guru (gateway.sh) pelo ad id que vai no utm_content:
#   trackings.utm_content = "<nome do criativo>|<id do ad no Meta>"
#
# API: Meta Graph / Marketing API (insights, level=ad).
# Autenticação: META_ACCESS_TOKEN (token de longa duração) + META_ACCOUNT_ID do .env.
# Sem dependências externas: usa python3 (stdlib) para HTTP/JSON. jq não é necessário.
#
# Uso:
#   ./scripts/meta.sh ping                          # testa auth (nome/status da conta)
#   ./scripts/meta.sh ads <periodo>                 # insights por anúncio (JSON), período: hoje|ontem|7d|14d|mes
#   ./scripts/meta.sh build [data_dir]              # gera meta_<periodo>.json p/ todos os períodos (alimenta o painel)
#
# O 'build' grava em docs/outputs/performance/data/ por padrão — o mesmo dir lido
# pelo dashboard.py / deploy-painel.sh.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
DATA_DIR_DEFAULT="${SCRIPT_DIR}/docs/outputs/performance/data"

# Carrega chaves do .env (compatível com bash 3.2 do macOS)
_load_env() {
  local key="$1"
  if [[ -z "${!key:-}" && -f "$ENV_FILE" ]]; then
    local line
    line="$(grep -E "^${key}=" "$ENV_FILE" | tail -1 || true)"
    local val="${line#${key}=}"
    val="${val%\"}"; val="${val#\"}"
    val="${val%\'}"; val="${val#\'}"
    export "${key}=${val}"
  fi
}

_load_env META_ACCESS_TOKEN
_load_env META_ACCOUNT_ID

if [[ -z "${META_ACCESS_TOKEN:-}" ]]; then
  echo "ERRO: META_ACCESS_TOKEN não encontrado no .env" >&2
  echo "Adicione a linha:  META_ACCESS_TOKEN=seu_token_de_longa_duracao" >&2
  echo "(Meta Business → Configurações → Usuários do sistema → Gerar token com ads_read.)" >&2
  echo "Opcional:          META_ACCOUNT_ID=168028315098298  (default já aponta p/ a conta Nutri)" >&2
  exit 1
fi

_py() {
  META_ACCESS_TOKEN="$META_ACCESS_TOKEN" META_ACCOUNT_ID="${META_ACCOUNT_ID:-}" \
    python3 "${SCRIPT_DIR}/scripts/.meta.py" "$@"
}

cmd="${1:-help}"; shift || true

case "$cmd" in
  ping)   _py ping ;;
  ads)    _py ads "${1:-7d}" ;;
  build)  _py build "${1:-$DATA_DIR_DEFAULT}" ;;
  help|*) grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//' ;;
esac
