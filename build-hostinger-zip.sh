#!/usr/bin/env bash
set -e

OUT="suryadietfit-hostinger-deploy.zip"

echo "==> Building frontend for production (npm run build)..."
export PATH='/Users/akhilesh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin':"$PATH"
npm run build

echo "==> Removing old $OUT ..."
rm -f "$OUT"

echo "==> Packaging deploy zip for Hostinger (excluding live data and secrets)..."
zip -r "$OUT" \
  dist server scripts public \
  package.json package-lock.json ecosystem.config.cjs .env.example README.md \
  -x "data/*" \
  -x "data/**" \
  -x ".env" \
  -x "*.env" \
  -x "node_modules/*" \
  -x "node_modules/**" \
  -x "work/*" \
  -x "work/**" \
  -x "backups/*" \
  -x "backups/**" \
  -x "**/.DS_Store" \
  -x "*.zip" \
  -x ".git/*" \
  -x ".git/**"

echo ""
echo "==> Done: $OUT"
echo "    Ready to upload to Hostinger for suryadietfit.com"
