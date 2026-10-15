#!/usr/bin/env bash
# ============================================================================
# FILE: deploy.sh (CÓ HEALTHCHECK, KHÔNG BỎ QUA LOCKFILE & COPY ĐỦ STANDALONE)
# ============================================================================
set -euo pipefail

echo "🚀 [1/5] Cài đặt dependencies nghiêm ngặt từ package-lock.json..."
npm ci --include=dev

echo "🔍 [2/5] Kiểm tra TypeScript & Build Production..."
npx tsc --noEmit
npm run build

echo "📦 [3/5] Đồng bộ public/, static/ và data/kami/ vào .next/standalone/..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
mkdir -p .next/standalone/data
[ -d data/kami ] && cp -r data/kami .next/standalone/data/kami || true

echo "🔄 [4/5] Khởi động lại PM2 với --env-file=.env..."
pm2 startOrReload ecosystem.config.js --update-env

echo "🩺 [5/5] Kiểm tra Healthcheck sau khi khởi động..."
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/profile || echo "000")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "❌ Healthcheck thất bại (HTTP $HTTP_STATUS)! Vui lòng kiểm tra: pm2 logs data-analyst-portfolio"
  exit 1
fi
echo "✅ Triển khai thành công (HTTP 200 OK)!"

