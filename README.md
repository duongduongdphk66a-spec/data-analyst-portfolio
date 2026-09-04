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

## 📋 Production Deployment Checklist

Khi deploy lên môi trường Production (Vercel, VPS, PM2 Cluster, Docker):

1. **`NEXT_PUBLIC_SITE_URL`**: Cấu hình domain thực tế của bạn (ví dụ: `https://yourdomain.com`) để đảm bảo sitemap.xml, robots.txt và metadata SEO / OpenGraph trỏ chính xác.
2. **`ADMIN_PASSWORD`**: Thiết lập mật khẩu quản trị mạnh (tối thiểu 16 ký tự ngẫu nhiên). Trong môi trường production, ứng dụng sẽ chặn khởi động nếu thiếu mật khẩu an toàn.
3. **`TRUST_PROXY`**: Mặc định là `false`. Chỉ đặt `TRUST_PROXY=true` khi ứng dụng đứng sau Reverse Proxy uy tín (Cloudflare, Nginx, ALB) và cổng ứng dụng đã được firewall bảo vệ tránh truy cập trực tiếp.
4. **`MYSQL_HOST` / `DATABASE_URL`**: Kết nối tới cơ sở dữ liệu MySQL đã cấp quyền. Hệ thống sẽ tự động khởi tạo bảng (`portfolio_profile`, `portfolio_texts`, `portfolio_projects`, `portfolio_rate_limits`, `portfolio_cache`) và đồng bộ cache tức thời giữa tất cả các tiến trình PM2 worker.

---

## 📜 License
MIT License © 2026 Ma Văn Hùng.
