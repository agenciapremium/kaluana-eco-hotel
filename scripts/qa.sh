#!/usr/bin/env bash
# QA de uma fase: build, servidor, capturas e Lighthouse.
# Uso: scripts/qa.sh pre|full [etapa-N] [rotas separadas por vírgula] [rotas do Lighthouse]
set -euo pipefail
PHASE="${1:-pre}"
ETAPA="${2:-etapa-1}"
PATHS="${3:-/}"
LH_PATHS="${4:-/}"
PORT="${PORT:-3100}"
export NEXT_PUBLIC_SITE_PHASE="$PHASE"
npm run build
npx next start -p "$PORT" >/tmp/kaluana-next-"$PHASE".log 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
for i in $(seq 1 40); do
  curl -sf "http://localhost:$PORT/" >/dev/null && break
  sleep 0.5
done
npm run screenshots -- --phase="$PHASE" --url="http://localhost:$PORT" --paths="$PATHS" --out="docs/screenshots/$ETAPA"
IFS=',' read -ra LH <<< "$LH_PATHS"
for p in "${LH[@]}"; do
  npm run lighthouse -- --phase="$PHASE" --url="http://localhost:$PORT" --path="$p" --out="docs/lighthouse/$ETAPA"
  npm run lighthouse -- --phase="$PHASE" --url="http://localhost:$PORT" --path="$p" --out="docs/lighthouse/$ETAPA" --preset=desktop
done
