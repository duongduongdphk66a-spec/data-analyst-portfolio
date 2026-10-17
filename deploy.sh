#!/usr/bin/env bash
# ==============================================================================
# FILE: deploy.sh (CHẶN TRIỂN KHAI NẾU THIẾU .ENV HOẶC DÙNG MẬT KHẨU MẪU)
# ==============================================================================
set -euo pipefail

echo "🚀 Bắt đầu quy trình triển khai Data Analyst Portfolio..."

# 1. Kiểm tra bắt buộc file .env phải tồn tại (TUYỆT ĐỐI KHÔNG cp .env.example .env)
if [ ! -f .env ]; then
  echo "❌ LỖI BẢO MẬT: Không tìm thấy tệp .env!"
  echo "👉 Hãy tạo tệp .env từ .env.example và thay thế toàn bộ mật khẩu/mã xác nhận trước khi chạy deploy.sh."
  exit 1
fi

# 2. Chặn đứng nếu .env vẫn còn chứa các chuỗi mẫu từ .env.example
if grep -Eqi "(your_admin_password_here|your_security_verify_code_here|your_session_secret_here|your_.*_here|changeme)" .env; then
  echo "❌ LỖI BẢO MẬT: Tệp .env vẫn đang chứa giá trị mẫu (your_..._here / changeme)!"
  echo "👉 Vui lòng đặt ADMIN_PASSWORD (>=16 ký tự), ADMIN_VERIFY_CODE (>=8 ký tự) và SESSION_SECRET độc lập trong .env."
  exit 1
fi

echo "📦 Cài đặt dependencies từ package-lock.json..."
npm ci

echo "🔍 Kiểm tra TypeScript, ESLint (0 warnings) & Unit Tests..."
npx tsc --noEmit
npm run lint -- --max-warnings=0
npm test

echo "🏗️ Build ứng dụng Next.js Standalone..."
npm run build

echo "📂 Đồng bộ tài nguyên tĩnh vào .next/standalone..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
mkdir -p .next/standalone/data
[ -d data/kami ] && cp -r data/kami .next/standalone/data/kami || true
cp .env .next/standalone/.env

echo "🔄 Khởi động / Reload PM2..."
pm2 startOrReload ecosystem.config.js --update-env

echo "⏳ Kiểm tra Healthcheck..."
sleep 3
curl -fsS http://127.0.0.1:3000/api/auth/verify > /dev/null
echo "✅ Triển khai hoàn tất và vượt qua kiểm tra bảo mật!"
