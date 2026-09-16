#!/bin/bash
# ==========================================
# Script tự động triển khai / cập nhật dự án trên Server
# ==========================================

set -e

echo "🚀 [1/5] Kéo mã nguồn mới nhất từ GitHub..."
git pull origin main

echo "📦 [2/5] Cài đặt dependencies..."
npm ci --legacy-peer-deps || npm install

echo "🔨 [3/5] Build ứng dụng Next.js..."
npm run build

echo "📋 [4/5] Sao chép static assets vào .next/standalone..."
mkdir -p .next/standalone/.next
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "🔄 [5/5] Khởi động lại ứng dụng với PM2..."
if pm2 describe data-analyst-portfolio > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js --env production
else
    pm2 start ecosystem.config.js --env production
fi

echo "✅ Triển khai hoàn tất! Ứng dụng đang chạy mượt mà."
