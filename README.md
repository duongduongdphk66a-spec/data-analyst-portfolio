# 📊 Ma Văn Hùng — Data Analyst Portfolio

An interactive, high-performance web portfolio showcasing data analysis case studies, business intelligence dashboards, and in-browser SQL querying capabilities with full-stack MySQL CMS integration.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS 4**, **MySQL Backend**, and **Recharts**, adhering to modern **`taste-skill` design principles** with curated typography and responsive layout.

---

## 🌟 Key Features

- **In-Browser SQL Engine & CSV Upload**: Client-side in-memory SQL execution supporting a dedicated SQL subset (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, `SUM`, `AVG`, `COUNT`, `LIMIT`) with live Recharts visualization and custom user CSV uploads.
- **Spotlight Command Palette (`Ctrl + K` / `Cmd + K`)**: Quick keyboard navigation across case studies, skills, theme toggling, language switching, and CMS editing shortcuts.
- **Secure Admin CMS Portal (`Ctrl + E`)**:
  - **Password-Protected Authentication Gate**: Protected with session tokens, timing-safe validation, and HTTP 401 API guards.
  - **Multi-Tab CMS Management**: Dynamic Profile editor, Page Texts CMS, and Project Manager.
  - **Relational MySQL Database Integration**: Synchronized with `portfolio_profile`, `portfolio_texts`, and `portfolio_projects` tables.
- **Executive Business Intelligence Dashboard**: Interactive KPI scorecards, multi-dimension time horizon filtering (H1 vs H2), and 2x Retina PNG chart export.
- **Interactive Case Studies**:
  1. **Kami Ely TikTok Shop & Affiliate Performance**: E-commerce funnel, creator matrix, peak live stream analysis.
  2. **Heritage Tourism in Japan (1990–2024)**: Time-series modeling of 36.8M tourist inflow and regional spending divergence.
  3. **Real-time Library Bus IoT / Data Pipeline**: High-throughput distributed scheduling with Redis & Celery Beat.
- **Internationalization (i18n)**: Instant switching between Vietnamese (`vi`) and English (`en`).
- **SEO & Performance**: Pre-rendered SSG pages, dynamic `sitemap.xml`, `robots.txt`, and Schema.org JSON-LD structured data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- MySQL 8.0+ (Optional: XAMPP, Laragon, Docker MySQL, or Cloud MySQL: Aiven/Railway)

### Installation
```bash
# Clone the repository
git clone https://github.com/duongduongdphk66a-spec/data-analyst-portfolio.git
cd data-analyst-portfolio

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the portfolio.

---

## 🔒 Security & Admin Configuration

Set your admin password in `.env.local`:
```env
ADMIN_PASSWORD="your_secure_password_here"
```

To access the CMS Admin Panel, press `Ctrl + E` or click **"Chỉnh Sửa CMS"** in the sidebar, then enter your admin password.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4+ (App Router, Server Components & Route Handlers)
- **Database**: MySQL (Connection Pool via `mysql2/promise`)
- **UI Library**: React 19, Lucide Icons, GSAP
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Properties
- **Visualizations**: Recharts, html2canvas
- **Data Parsing**: PapaParse (CSV)
- **Typography**: Google Fonts (Lora, JetBrains Mono)
- **CI/CD**: GitHub Actions

---

## 🚢 Hướng Dẫn Triển Khai (Deployment Guide)

Dự án hỗ trợ 3 phương án triển khai tùy theo nhu cầu vận hành:

### Phương án 1: Vercel + Cloud MySQL (Khuyên dùng — Khởi chạy nhanh nhất)
Phương án tối ưu nhất cho portfolio cá nhân: zero-config, tự động CI/CD từ GitHub và tích hợp CDN toàn cầu.
1. Tạo database MySQL miễn phí trên [Aiven](https://aiven.io), [PlanetScale](https://planetscale.com), hoặc [Railway](https://railway.app).
2. Import repository vào tài khoản [Vercel](https://vercel.com).
3. Cấu hình các biến môi trường trong Vercel Project Settings:
   - `DATABASE_URL`: URI kết nối MySQL từ nhà cung cấp cloud (ví dụ: `mysql://user:pass@host:port/db?ssl-mode=REQUIRED`)
   - `ADMIN_PASSWORD`: Mật khẩu quản trị an toàn (≥ 16 ký tự)
   - `NEXT_PUBLIC_SITE_URL`: Domain thực tế (ví dụ: `https://mavanhung.dev`)
4. Bấm **Deploy**. Sau khi deploy xong, truy cập `/api/db` hoặc đăng nhập Admin (`Ctrl + E`) một lần để hệ thống tự động khởi tạo bảng và seed dữ liệu.

---

### Phương án 2: VPS Ubuntu + PM2 Cluster + Nginx (Tự lưu trữ / DevOps)
Phương án cho người muốn làm chủ hoàn toàn hạ tầng, chạy đa tiến trình Next.js Standalone tối ưu RAM:
1. SSH vào server VPS, clone repository và chuẩn bị file `.env`:
   ```bash
   git clone https://github.com/duongduongdphk66a-spec/data-analyst-portfolio.git
   cd data-analyst-portfolio
   cp .env.example .env
   nano .env # Điền ADMIN_PASSWORD, MYSQL_*, NEXT_PUBLIC_SITE_URL
   ```
2. Phân quyền và chạy script triển khai tự động `deploy.sh`:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
   > **Lưu ý kỹ thuật**: `deploy.sh` đã được cấu hình tự động sao chép `public/` và `.next/static/` vào `.next/standalone/`, giải quyết triệt để lỗi 404 static assets của chế độ Next.js standalone.
3. Cấu hình Nginx reverse proxy trỏ về `http://127.0.0.1:3000` kèm SSL Certbot.

---

### Phương án 3: Docker & Docker Compose (Container hóa)
Triển khai cô lập kèm container MySQL 8.0:
```bash
# Khởi chạy cả Web App và MySQL database
docker compose up -d --build

# Xem nhật ký hoạt động
docker compose logs -f web
```

---

## 📋 Checklist Trước Khi Go-Live

Trước khi công bố portfolio ra môi trường production:
- [x] **Static Assets**: Đã cấu hình bước copy assets vào `.next/standalone` trong `deploy.sh` (nếu dùng VPS/PM2).
- [ ] **Bảo mật**: Đặt `ADMIN_PASSWORD` an toàn (≥ 16 ký tự ngẫu nhiên).
- [ ] **Tên miền**: Đặt `NEXT_PUBLIC_SITE_URL` trùng khớp domain chính thức để đảm bảo OpenGraph và sitemap chính xác.
- [ ] **Proxy**: Chỉ bật `TRUST_PROXY=true` khi app đứng sau Reverse Proxy tin cậy (Cloudflare, Nginx) để rate limiting nhận diện đúng IP client.
- [ ] **Khởi tạo CSDL**: Sau khi deploy, truy cập `/api/db` hoặc nhấn `Ctrl + E` đăng nhập Admin một lần để hệ thống tự tạo bảng và seed dữ liệu.

## 📜 License
MIT License © 2026 Ma Văn Hùng.
