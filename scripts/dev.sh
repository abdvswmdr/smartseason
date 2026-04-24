#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Stopping frontend..."
  kill "$FRONTEND_PID" 2>/dev/null || true
  echo "Docker services left running. To stop: docker compose down"
}

trap cleanup EXIT INT TERM

# Kill any stray Vite processes holding the ports
fuser -k 5173/tcp 5174/tcp 5175/tcp 2>/dev/null || true

# Start DB + backend
echo "Starting MySQL + backend..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up mysql backend -d

# Wait for backend health check
echo "Waiting for backend..."
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
  sleep 1
done
echo "Backend ready."

# Start Vite in foreground, detached from terminal's job control
# setsid prevents SIGTSTP from suspending it when focus shifts
cd "$SCRIPT_DIR/frontend"
setsid npm run dev < /dev/null &
FRONTEND_PID=$!

echo "Dev stack up — http://localhost:5173"
echo "Press Ctrl+C to stop frontend (Docker keeps running)."

wait "$FRONTEND_PID"
