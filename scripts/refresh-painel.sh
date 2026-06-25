#!/usr/bin/env bash
#
# refresh-painel.sh — Atualiza o painel do Max de ponta a ponta, num comando.
#
# Pipeline completo (o que o cron chama):
#   1. meta.sh build    -> meta_<periodo>.json   (gasto/CTR por anuncio, Meta API ao vivo)
#   2. gateway.sh build -> guru_<periodo>.json   (venda real atribuida por UTM, Guru)
#   3. deploy-painel.sh -> gera HTML e publica na Vercel
#
# Sem este passo de rebuild, o painel fica congelado no ultimo deploy (modelo estatico).
#
# Uso:
#   ./scripts/refresh-painel.sh            # build das 2 pernas + deploy
#   ./scripts/refresh-painel.sh --no-deploy  # so regenera os JSONs (sem publicar)
#
# Log: cada execucao anexa em docs/outputs/performance/refresh.log (util p/ o cron).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

LOG="docs/outputs/performance/refresh.log"
DEPLOY=1
[[ "${1:-}" == "--no-deploy" ]] && DEPLOY=0

_ts() { date '+%Y-%m-%d %H:%M:%S'; }
_say() { echo "[$(_ts)] $*" | tee -a "$LOG"; }

mkdir -p "$(dirname "$LOG")"
_say "===== refresh-painel iniciado ====="

_say "1/3 Meta (gasto/CTR por anuncio)..."
./scripts/meta.sh build 2>&1 | tee -a "$LOG"

_say "2/3 Guru (venda real por UTM)..."
./scripts/gateway.sh build 2>&1 | tee -a "$LOG"

if [[ "$DEPLOY" == "1" ]]; then
  _say "3/3 Gerando HTML e publicando na Vercel..."
  ./scripts/deploy-painel.sh 2>&1 | tee -a "$LOG"
  _say "OK — publicado: https://painel-nutri.vercel.app"
else
  _say "3/3 --no-deploy: JSONs atualizados, deploy pulado."
fi

_say "===== refresh-painel concluido ====="
