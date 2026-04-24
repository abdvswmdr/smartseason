#!/bin/bash
# Run on the server: bash scripts/deploy.sh
set -e

cd /root/smartseason

git pull
docker compose up mysql backend frontend -d --build

echo "Deployed. Live at http://206.189.63.155:5173"
