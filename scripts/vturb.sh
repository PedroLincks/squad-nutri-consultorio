#!/usr/bin/env bash
#
# vturb.sh — Helper para a vTurb Analytics API (https://analytics.vturb.net)
#
# Autenticacao: usa VTURB_API_TOKEN do .env (header X-Api-Token) + X-Api-Version: v1.
# Requer: curl. Usa jq para formatar a saida quando disponivel.
#
# Uso:
#   ./scripts/vturb.sh players [nome]                         # lista players (VSLs), filtro opcional por nome
#   ./scripts/vturb.sh sessions <player_id> <inicio> <fim> <duracao_s> <pitch_s>
#   ./scripts/vturb.sh retention <player_id> <duracao_s> <inicio> <fim>   # curva de retencao (seg a seg)
#   ./scripts/vturb.sh turbo <player_id> <inicio> <fim> <duracao_s> <pitch_s>
#   ./scripts/vturb.sh custom-metrics <player_id> <inicio> <fim>
#   ./scripts/vturb.sh quota
#
# Datas no formato "YYYY-MM-DD" ou "YYYY-MM-DD HH:MM:SS". Timezone fixo: America/Sao_Paulo.

set -euo pipefail

BASE_URL="https://analytics.vturb.net"
API_VERSION="v1"
TZ_DEFAULT="America/Sao_Paulo"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

# Carrega VTURB_API_TOKEN do .env (compativel com bash 3.2 do macOS)
if [[ -z "${VTURB_API_TOKEN:-}" && -f "$ENV_FILE" ]]; then
  _line="$(grep -E '^VTURB_API_TOKEN=' "$ENV_FILE" | tail -1 || true)"
  VTURB_API_TOKEN="${_line#VTURB_API_TOKEN=}"
  VTURB_API_TOKEN="${VTURB_API_TOKEN%\"}"; VTURB_API_TOKEN="${VTURB_API_TOKEN#\"}"
  export VTURB_API_TOKEN
fi

if [[ -z "${VTURB_API_TOKEN:-}" ]]; then
  echo "ERRO: VTURB_API_TOKEN nao encontrado no .env" >&2
  echo "Adicione a linha:  VTURB_API_TOKEN=seu_token_aqui" >&2
  exit 1
fi

# Formata JSON se jq existir, senao imprime cru
_out() { if command -v jq >/dev/null 2>&1; then jq .; else cat; fi; }

_get() {
  curl -sS -X GET "${BASE_URL}$1" \
    -H "X-Api-Token: ${VTURB_API_TOKEN}" \
    -H "X-Api-Version: ${API_VERSION}" | _out
}

_post() {
  curl -sS -X POST "${BASE_URL}$1" \
    -H "X-Api-Token: ${VTURB_API_TOKEN}" \
    -H "X-Api-Version: ${API_VERSION}" \
    -H "Content-Type: application/json" \
    -d "$2" | _out
}

cmd="${1:-help}"; shift || true

case "$cmd" in
  players)
    if [[ -n "${1:-}" ]]; then
      _get "/players/list?name=$(printf '%s' "$1" | sed 's/ /%20/g')"
    else
      _get "/players/list"
    fi
    ;;

  sessions)
    pid="${1:?player_id}"; ini="${2:?inicio}"; fim="${3:?fim}"; dur="${4:?duracao_s}"; pitch="${5:?pitch_s}"
    _post "/sessions/stats" "$(cat <<JSON
{"player_id":"${pid}","start_date":"${ini}","end_date":"${fim}","timezone":"${TZ_DEFAULT}","video_duration":${dur},"pitch_time":${pitch}}
JSON
)"
    ;;

  retention)
    pid="${1:?player_id}"; dur="${2:?duracao_s}"; ini="${3:?inicio}"; fim="${4:?fim}"
    _post "/times/user_engagement" "$(cat <<JSON
{"player_id":"${pid}","video_duration":${dur},"start_date":"${ini}","end_date":"${fim}","timezone":"${TZ_DEFAULT}"}
JSON
)"
    ;;

  turbo)
    pid="${1:?player_id}"; ini="${2:?inicio}"; fim="${3:?fim}"; dur="${4:?duracao_s}"; pitch="${5:?pitch_s}"
    _post "/turbo/stats_by_player" "$(cat <<JSON
{"player_id":"${pid}","start_date":"${ini}","end_date":"${fim}","video_duration":${dur},"pitch_time":${pitch}}
JSON
)"
    ;;

  custom-metrics)
    pid="${1:?player_id}"; ini="${2:?inicio}"; fim="${3:?fim}"
    _post "/custom_metrics/list" "$(cat <<JSON
{"player_id":"${pid}","start_date":"${ini}","end_date":"${fim}","timezone":"${TZ_DEFAULT}"}
JSON
)"
    ;;

  quota)
    _get "/quota/usage"
    ;;

  help|*)
    grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//'
    ;;
esac
