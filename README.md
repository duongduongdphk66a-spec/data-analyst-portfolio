# Ma Văn Hùng: Data Analyst Portfolio

An interactive web portfolio for data analysis case studies, business intelligence dashboards, and in-browser SQL querying with full-stack MySQL CMS integration.

Built with Next.js 15 (App Router), React 19, Tailwind CSS 4, MySQL, and Recharts.

---

## Key Features

- **In-Browser SQL Engine & CSV Upload**: Client-side in-memory SQL execution supporting `SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, `SUM`, `AVG`, `COUNT`, and `LIMIT` with live Recharts visualization and custom CSV uploads.
- **Spotlight Command Palette (`Ctrl + K` / `Cmd + K`)**: Keyboard navigation across case studies, skills, theme toggling, language switching, and CMS shortcuts.
- **Admin CMS Portal (`Ctrl + E`)**:
  - Password authentication with session tokens, timing-safe validation, and HTTP 401 API guards.
  - Multi-tab management: Dynamic Profile editor, Page Texts CMS, and Project Manager.
  - MySQL database synchronization with `portfolio_profile`, `portfolio_texts`, and `portfolio_projects` tables.
- **Business Intelligence Dashboard**: Interactive KPI scorecards, multi-dimension time horizon filtering (H1 vs H2), and 2x Retina PNG chart export.
- **Interactive Case Studies**:
  1. Kami Ely TikTok Shop & Affiliate Performance: E-commerce funnel, creator matrix, and peak live stream analysis.
  2. Heritage Tourism in Japan (1990–2024): Time-series modeling of 36.8M tourist inflow and regional spending divergence.
  3. Real-time Library Bus IoT / Data Pipeline: Distributed scheduling with Redis and Celery Beat.
- **SEO & Performance**: Dynamic SSR với Per-Request Cryptographic Nonce CSP (30 routes), dynamic `sitemap.xml`, `robots.txt`, và Schema.org JSON-LD structured data.

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- MySQL 8.0+ (Optional: XAMPP, Laragon, Docker MySQL, or Cloud MySQL like Aiven or Railway)

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

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## Security & Admin Configuration

Set your admin password in `.env.local`:
```env
ADMIN_PASSWORD="your_secure_password_here"
```

To access the CMS Admin Panel, press `Ctrl + E` or click "Chỉnh Sửa CMS" in the sidebar, then enter your admin password.

---

## Tech Stack

- **Framework**: Next.js 15.4+ (App Router, Server Components, and Route Handlers)
- **Database**: MySQL (Connection Pool via `mysql2/promise`)
- **UI Library**: React 19, Lucide Icons, GSAP
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Properties
- **Visualizations**: Recharts, html2canvas
- **Data Parsing**: PapaParse (CSV)
- **Typography**: Google Fonts (Lora, JetBrains Mono)
- **CI/CD**: GitHub Actions

---

## Hướng Dẫn Triển Khai (Deployment Guide)

Dự án hỗ trợ 3 phương án triển khai tùy theo nhu cầu vận hành:

### Phương án 1: Vercel + Cloud MySQL (Khuyên dùng cho việc khởi chạy nhanh)
Phương án phù hợp cho portfolio cá nhân với zero-config, CI/CD tự động từ GitHub và CDN toàn cầu.
1. Tạo database MySQL miễn phí trên [Aiven](https://aiven.io), [PlanetScale](https://planetscale.com), hoặc [Railway](https://railway.app).
2. Import repository vào tài khoản [Vercel](https://vercel.com).
3. Cấu hình các biến môi trường trong Vercel Project Settings:
   - `DATABASE_URL`: URI kết nối MySQL từ nhà cung cấp cloud (ví dụ: `mysql://user:pass@host:port/db?ssl-mode=REQUIRED`)
   - `ADMIN_PASSWORD`: Mật khẩu quản trị an toàn (≥ 16 ký tự ngẫu nhiên)
   - `ADMIN_VERIFY_CODE`: Mã xác thực 2 lớp khi đăng nhập Admin (bắt buộc ≥ 8 ký tự trên Production)
   - `NEXT_PUBLIC_SITE_URL`: Domain thực tế chính thức (ví dụ: `https://mavanhung.dev` hoặc URL Vercel)
   - `TRUST_PROXY`: Cấu hình nguồn proxy tin cậy (`vercel`, `cloudflare`, `nginx`, `true`, hoặc `false` khi chạy trực tiếp). Trên Vercel, hệ thống tự động nhận diện `VERCEL=1`.
   - `MYSQL_SSL_CA` *(Tùy chọn)*: Đường dẫn tệp CA `.pem`, chuỗi nội dung PEM hoặc Base64 PEM cho Cloud DB có CA riêng.
   - `MYSQL_CONNECTION_LIMIT` *(Tùy chọn)*: Số kết nối tối đa trong pool (mặc định 5, trên Vercel tự tối ưu 3).
4. Chọn **Deploy**.
5. **Khởi tạo và nạp dữ liệu ban đầu**:
   - Truy cập `/api/db` để kiểm tra kết nối CSDL (endpoint trả về `{ appHealthy: true, database: true }` ở chế độ read-only).
   - Nhấn `Ctrl + E` trên website để đăng nhập Admin CMS.
   - Chuyển sang tab **Cơ sở dữ liệu (DatabaseTab)** và chọn nút **Khởi Tạo Bảng & Nạp Mẫu** (hệ thống sẽ tạo bảng thiếu và nạp dữ liệu mẫu ban đầu mà không xóa bảng hiện có) hoặc **Khôi Phục Dữ Liệu Gốc (Reset DB)** nếu cần làm sạch.
   - *Cách khác qua CLI*: Chạy `node scripts/seed_all_mysql_data.js` hoặc import file `database/schema.sql`.

---

### Phương án 2: VPS Ubuntu + PM2 Cluster + Nginx (Tự lưu trữ / DevOps)
Phương án cho người muốn quản lý hạ tầng riêng, chạy đa tiến trình Next.js Standalone tối ưu RAM:
1. SSH vào server VPS, clone repository và chuẩn bị file `.env`:
   ```bash
   git clone https://github.com/duongduongdphk66a-spec/data-analyst-portfolio.git
   cd data-analyst-portfolio
   cp .env.example .env
   nano .env # Điền ADMIN_PASSWORD (>=16), ADMIN_VERIFY_CODE (>=8), TRUST_PROXY="nginx", MYSQL_*, NEXT_PUBLIC_SITE_URL
   ```
2. Phân quyền và chạy script triển khai tự động `deploy.sh`:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
   > **Lưu ý kỹ thuật**: `deploy.sh` tự động sao chép `public/` và `.next/static/` vào `.next/standalone/`, tránh lỗi 404 static assets của chế độ Next.js standalone. Cấu hình PM2 sử dụng `--env-file=.env` để nạp trực tiếp `TRUST_PROXY="nginx"` từ `.env`.
3. Cấu hình Nginx reverse proxy trỏ về `http://127.0.0.1:3000` (bắt buộc cấu hình `proxy_set_header X-Real-IP $remote_addr;` để ghi đè `X-Real-IP`, đảm bảo cơ chế chống giả mạo IP hoạt động chính xác) kèm SSL Certbot.

---

### Phương án 3: Docker & Docker Compose (Container hóa)
Triển khai cô lập kèm container MySQL 8.0:
```bash
# Khởi chạy cả Web App và MySQL database (tự động truyền NEXT_PUBLIC_SITE_URL vào build args)
docker compose up -d --build

# Xem nhật ký hoạt động
docker compose logs -f app
```

---

## Danh Sách Kiểm Tra Sẵn Sàng Triển Khai (Production Readiness Checklist)

Trước khi công bố portfolio ra môi trường production thực tế:

- [x] **1. Cấu hình biến môi trường production**:
  - `ADMIN_PASSWORD`: Mật khẩu quản trị độ dài cao (bắt buộc ≥ 16 ký tự trên Production).
  - `ADMIN_VERIFY_CODE`: Mã bảo vệ 2 lớp cố định cho CMS (bắt buộc ≥ 8 ký tự trên Production).
  - `DATABASE_URL` hoặc bộ thông số `MYSQL_*`: Kết nối an toàn đến database production, hỗ trợ SSL CA qua `MYSQL_SSL_CA`.
  - `NEXT_PUBLIC_SITE_URL`: Domain chính thức phục vụ SEO sitemap, canonical links và OpenGraph metadata.
  - `TRUST_PROXY`: Tường minh theo hạ tầng (`nginx`, `cloudflare`, `vercel`, `true`, hoặc `false` chống giả mạo IP khi chạy trực tiếp).

- [x] **2. Chuẩn hóa database initialization & migration**:
  - `GET /api/db`: Kiểm tra sức khỏe kết nối (read-only, an toàn).
  - Khởi tạo bảng & seed dữ liệu qua: Admin CMS (`DatabaseTab` -> "Khởi Tạo Bảng & Nạp Mẫu") hoặc script `node scripts/seed_all_mysql_data.js` hoặc file `database/schema.sql`.

- [x] **3. Kiểm tra bảo mật**:
  - Firewall MySQL: Chỉ lắng nghe `127.0.0.1` hoặc mạng nội bộ Docker, chặn truy cập cổng `3306` từ Internet.
  - Phân quyền MySQL: Sử dụng user riêng biệt chỉ có quyền trên database chỉ định.
  - Cookie: `admin_token` với cờ `HttpOnly`, `Secure` (môi trường production), `SameSite=lax`.
  - Rate Limiting: Chống giả mạo IP (IP Spoofing / Header Poisoning), tự động khóa IP sau 10 lần nhập sai trong 15 phút, đồng bộ qua MySQL cluster.
  - Content Security Policy (CSP): Cấu hình Nonce động per-request và `strict-dynamic` trong `middleware.ts`, ngoại lệ an toàn cho các sơ đồ HTML tĩnh trong `/library-bus/`.

- [x] **4. Chạy lint, test và build**:
  - `npm run lint`: Hoàn tất không có cảnh báo hoặc lỗi (0 warnings, 0 errors).
  - `npm run test`: 100% test suites (78/78 tests) vượt qua thành công.
  - `npm run build`: Hoàn thành biên dịch production Next.js.

- [x] **5. Kiểm thử end-to-end**:
  - Đăng nhập Admin (`Ctrl + E`), sửa dữ liệu CMS, kiểm tra phiên làm việc không ghi nhận lỗi 401 giả vào console.
  - Tải CV bản in PDF qua nút tải chuyên dụng.
  - Xem và tương tác 3 case study: Kami Ely, Library Bus và Di sản Kyoto.

- [x] **6. Kiểm tra tương thích và hiệu năng**:
  - Bố cục responsive trên thiết bị di động, tablet và máy tính để bàn.
  - Biểu đồ Recharts co giãn tự động theo kích thước màn hình.
  - SQL Analytics Lab hiển thị rõ ràng trên mọi độ phân giải.
  - Cơ chế dữ liệu dự phòng (Graceful Degradation) tự động kích hoạt nếu mất kết nối CSDL.

- [x] **7. Thiết lập vận hành**:
  - Cấu hình HTTPS (SSL Certbot / Cloudflare SSL).
  - Lịch sao lưu định kỳ: `mysqldump` tự động qua cron job.
  - Health check probe: Endpoint `/api/db` phục vụ uptime monitoring.
  - Quy trình rollback nhanh chóng qua Git commit / Docker image backup.

---

## License
MIT License © 2026 Ma Văn Hùng.
