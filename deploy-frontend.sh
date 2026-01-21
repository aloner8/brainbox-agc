#!/bin/bash
set -e

echo "🔨 Building frontend..."
cd frontend
npm run build

echo "🔁 Restarting nginx..."
cd ..
docker compose restart nginx

echo "✅ Frontend deployed successfully"
