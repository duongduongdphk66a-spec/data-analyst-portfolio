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
   - `ADMIN_PASSWORD`: Mật khẩu quản trị an toàn (≥ 16 ký tự ngẫu nhiên)
   - `ADMIN_VERIFY_CODE`: Mã xác thực bảo mật 2 lớp khi đăng nhập Admin (≥ 8 ký tự)
   - `NEXT_PUBLIC_SITE_URL`: Domain thực tế chính thức (ví dụ: `https://mavanhung.dev` hoặc URL Vercel)
   - `TRUST_PROXY`: Đặt `true` trên Vercel để nhận diện đúng IP Client qua header `x-forwarded-for`
4. Bấm **Deploy**.
5. **Khởi tạo và nạp dữ liệu ban đầu**:
   - Truy cập `/api/db` để kiểm tra kết nối CSDL (endpoint trả về `{ appHealthy: true, database: true }` ở chế độ read-only).
   - Nhấn `Ctrl + E` trên website để đăng nhập Admin CMS.
   - Chuyển sang tab **Cơ sở dữ liệu** và bấm nút **Khởi tạo bảng & Nạp mẫu** (hệ thống sẽ tự động tạo toàn bộ cấu trúc bảng và seed dữ liệu chuẩn).
   - *Cách khác qua CLI*: Chạy `node scripts/seed_all_mysql_data.js` hoặc import file `database/schema.sql`.

---

### Phương án 2: VPS Ubuntu + PM2 Cluster + Nginx (Tự lưu trữ / DevOps)
Phương án cho người muốn làm chủ hoàn toàn hạ tầng, chạy đa tiến trình Next.js Standalone tối ưu RAM:
1. SSH vào server VPS, clone repository và chuẩn bị file `.env`:
   ```bash
   git clone https://github.com/duongduongdphk66a-spec/data-analyst-portfolio.git
   cd data-analyst-portfolio
   cp .env.example .env
   nano .env # Điền ADMIN_PASSWORD, ADMIN_VERIFY_CODE, MYSQL_*, NEXT_PUBLIC_SITE_URL
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

## 📋 Danh Sách Kiểm Tra Sẵn Sàng Triển Khai (Production Readiness Checklist)

Trước khi công bố portfolio ra môi trường production thực tế:

- [x] **1. Cấu hình biến môi trường production**:
  - `ADMIN_PASSWORD`: Mật khẩu quản trị độ dài cao, tránh brute-force.
  - `ADMIN_VERIFY_CODE`: Mã bảo vệ 2 lớp cố định cho CMS.
  - `DATABASE_URL` hoặc bộ thông số `MYSQL_*`: Kết nối an toàn đến database production.
  - `NEXT_PUBLIC_SITE_URL`: Domain chính thức phục vụ SEO sitemap, canonical links và OpenGraph metadata.
  - `TRUST_PROXY`: `true` khi đứng sau Reverse Proxy (Cloudflare, Nginx, Vercel), `false` khi chạy trực tiếp.

- [x] **2. Chuẩn hóa database initialization & migration**:
  - `GET /api/db`: Kiểm tra sức khỏe kết nối (read-only, an toàn).
  - Khởi tạo bảng & seed dữ liệu qua: Admin CMS (`DatabaseTab` -> "Khởi tạo bảng & Nạp mẫu") hoặc script `node scripts/seed_all_mysql_data.js` hoặc file `database/schema.sql`.

- [x] **3. Kiểm tra bảo mật**:
  - Firewall MySQL: Chỉ lắng nghe `127.0.0.1` hoặc mạng nội bộ Docker, chặn truy cập cổng `3306` từ Internet.
  - Phân quyền MySQL: Sử dụng user riêng biệt chỉ có quyền trên database chỉ định.
  - Cookie: `admin_token` với cờ `HttpOnly`, `Secure` (môi trường production), `SameSite=lax`.
  - Rate Limiting: Tự động khóa IP sau 10 lần nhập sai trong 15 phút, đồng bộ đa luồng qua MySQL cluster.
  - Content Security Policy (CSP): Cấu hình nonce và strict policy trong `middleware.ts`.

- [x] **4. Chạy lint, test và build**:
  - `npm run lint`: Hoàn tất không có cảnh báo hoặc lỗi.
  - `npm run test`: 100% test suites (67/67 tests) vượt qua thành công.
  - `npm run build`: Hoàn thành biên dịch và prerender 30/30 static pages.

- [x] **5. Kiểm thử end-to-end**:
  - Đăng nhập Admin (`Ctrl + E`), sửa dữ liệu CMS, xóa cache API.
  - Tải CV bản in PDF qua nút tải chuyên dụng.
  - Xem và tương tác 3 case study: Kami Ely, Library Bus và Di sản Kyoto.

- [x] **6. Kiểm tra responsive và hiệu năng**:
  - Hiển thị hoàn hảo trên Mobile, Tablet và Desktop.
  - Biểu đồ Recharts co giãn tự động theo kích thước màn hình.
  - SQL Analytics Lab hiển thị rõ ràng trên mọi độ phân giải.
  - Cơ chế dữ liệu dự phòng (Graceful Degradation) tự động kích hoạt nếu mất kết nối CSDL.

- [x] **7. Thiết lập vận hành**:
  - Cấu hình HTTPS (SSL Certbot / Cloudflare SSL).
  - Lịch sao lưu định kỳ: `mysqldump` tự động qua cron job.
  - Health check probe: Endpoint `/api/db` phục vụ uptime monitoring.
  - Quy trình rollback nhanh chóng qua Git commit / Docker image backup.

## 📜 License
MIT License © 2026 Ma Văn Hùng.
