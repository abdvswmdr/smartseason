#!/bin/bash
set -e # fail fast 

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE="docker compose -f $SCRIPT_DIR/../docker-compose.yml"

stop() {
  echo "Killing Vite processes..."
  fuser -k 5173/tcp 5174/tcp 5175/tcp 2>/dev/null || true
  echo "Stopping Docker services..."
  $COMPOSE down
  echo "Done."
  exit 0
}

if [ "$1" = "--stop" ]; then
  stop
fi

cleanup() {
  echo ""
  echo "Stopping frontend..."
  kill "$FRONTEND_PID" 2>/dev/null || true
  echo "Docker services left running. Run ./scripts/dev.sh --stop to tear down."
}

trap cleanup EXIT INT TERM

# stray Vite procs
fuser -k 5173/tcp 5174/tcp 5175/tcp 2>/dev/null || true

echo "Starting MySQL + backend..."
$COMPOSE up mysql backend -d

echo "Waiting for backend health check..."
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
  sleep 1
done
echo "Backend ready."

# setsid detaches Vite from shell prevent tty suspend
cd "$SCRIPT_DIR/../frontend"
setsid npm run dev < /dev/null &
FRONTEND_PID=$!

echo "Dev stack up — http://localhost:5173"
echo "Ctrl+C stops frontend only. Use --stop to tear everything down."

wait "$FRONTEND_PID"
