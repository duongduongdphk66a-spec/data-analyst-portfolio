#!/bin/bash
# ==========================================
# Script tự động triển khai / cập nhật dự án trên Server
# ==========================================

set -e

echo "🚀 [1/4] Kéo mã nguồn mới nhất từ GitHub..."
git pull origin main

echo "📦 [2/4] Cài đặt dependencies..."
npm ci --legacy-peer-deps || npm install

echo "🔨 [3/4] Build ứng dụng Next.js..."
npm run build

echo "🔄 [4/4] Khởi động lại ứng dụng với PM2..."
if pm2 describe data-analyst-portfolio > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js --env production
else
    pm2 start ecosystem.config.js --env production
fi

echo "✅ Triển khai hoàn tất! Ứng dụng đang chạy mượt mà."
