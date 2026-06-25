#!/usr/bin/env bash
#
# gateway.sh — Helper para puxar VENDA REAL atribuida por UTM do Digital Manager Guru.
#
# Esta e a FONTE DA VERDADE de receita/LTV do squad de performance (agente Max).
# Cruza com os criativos do Meta Ads pela chave UTM:
#   trackings.utm_content = "<nome do criativo>|<id do ad no Meta>"
#
# Gateway: Digital Manager Guru (https://digitalmanager.guru) — API v2.
# Autenticacao: GURU_API_TOKEN do .env (User Token), header Authorization: Bearer.
# Sem dependencias externas: usa python3 (stdlib) para HTTP/JSON. jq nao e necessario.
#
# Uso:
#   ./scripts/gateway.sh ping                               # testa auth (ultimos 7 dias)
#   ./scripts/gateway.sh sample                             # dump cru de 1 transacao
#   ./scripts/gateway.sh orders <inicio> <fim>              # transacoes aprovadas no periodo (JSON)
#   ./scripts/gateway.sh revenue-by-utm <inicio> <fim>      # receita por utm_content (SOMENTE utm_source=FB, i.e. vendas vindas dos anuncios)
#   ./scripts/gateway.sh build [data_dir]                   # gera guru_<periodo>.json p/ todos os periodos (alimenta o painel)
#
# Datas no formato "YYYY-MM-DD". Periodo maximo: 180 dias (limite da API).
# Filtro: confirmed_at (data de aprovacao) + transaction_status=approved.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

# Carrega GURU_API_TOKEN do .env (compativel com bash 3.2 do macOS)
if [[ -z "${GURU_API_TOKEN:-}" && -f "$ENV_FILE" ]]; then
  _line="$(grep -E '^GURU_API_TOKEN=' "$ENV_FILE" | tail -1 || true)"
  GURU_API_TOKEN="${_line#GURU_API_TOKEN=}"
  GURU_API_TOKEN="${GURU_API_TOKEN%\"}"; GURU_API_TOKEN="${GURU_API_TOKEN#\"}"
  export GURU_API_TOKEN
fi

if [[ -z "${GURU_API_TOKEN:-}" ]]; then
  echo "ERRO: GURU_API_TOKEN nao encontrado no .env" >&2
  echo "Adicione a linha:  GURU_API_TOKEN=seu_user_token_da_guru" >&2
  echo "(Painel Guru -> Integracoes -> Token de API. Use o USER token, nao o Account token.)" >&2
  exit 1
fi

# Datas default para ping/sample: ultimos 7 dias (macOS date)
_today="$(date +%F)"
_week_ago="$(date -v-7d +%F 2>/dev/null || date -d '7 days ago' +%F)"

# Calcula uma data relativa a hoje (compativel macOS -v e GNU -d)
_dt() { date -v"$1" +%F 2>/dev/null || date -d "$2" +%F; }

_py() {
  GURU_API_TOKEN="$GURU_API_TOKEN" python3 "${SCRIPT_DIR}/scripts/.guru.py" "$@"
}

cmd="${1:-help}"; shift || true

case "$cmd" in
  ping)            _py ping "$_week_ago" "$_today" ;;
  sample)          _py sample "$_week_ago" "$_today" ;;
  orders)          _py orders "${1:?inicio YYYY-MM-DD}" "${2:?fim YYYY-MM-DD}" ;;
  revenue-by-utm)  _py revenue-by-utm "${1:?inicio YYYY-MM-DD}" "${2:?fim YYYY-MM-DD}" ;;
  build)
    DATA_DIR="${1:-${SCRIPT_DIR}/docs/outputs/performance/data}"
    mkdir -p "$DATA_DIR"
    _mes_ini="$(_dt 1d 'first day of this month' 2>/dev/null || date +%Y-%m-01)"
    _ontem="$(_dt -1d '1 day ago')"
    # periodo:inicio:fim
    for spec in \
      "hoje:${_today}:${_today}" \
      "ontem:${_ontem}:${_ontem}" \
      "7d:$(_dt -6d '6 days ago'):${_today}" \
      "14d:$(_dt -13d '13 days ago'):${_today}" \
      "mes:${_mes_ini}:${_today}"; do
      p="${spec%%:*}"; rest="${spec#*:}"; ini="${rest%%:*}"; fim="${rest##*:}"
      out="${DATA_DIR}/guru_${p}.json"
      _py revenue-by-utm "$ini" "$fim" > "$out"
      n="$(grep -c '"utm_content"' "$out" 2>/dev/null || true)"
      echo "  ${p}: ${ini}..${fim} -> ${out} (${n} criativos c/ venda)"
    done
    ;;
  help|*)          grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//' ;;
esac
