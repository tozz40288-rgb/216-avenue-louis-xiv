#!/bin/sh
set -e

echo "→ Applying database migrations..."
pnpm --filter @workspace/db run push

echo "→ Starting server..."
exec node --enable-source-maps artifacts/api-server/dist/index.mjs
