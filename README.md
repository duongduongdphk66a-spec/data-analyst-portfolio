# 📊 Ma Văn Hùng — Data Analyst Portfolio

An interactive, high-performance web portfolio showcasing data analysis case studies, business intelligence dashboards, and in-browser SQL querying capabilities.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS 4**, and **Recharts**, adhering to modern **`taste-skill` anti-slop design principles** with the **Lora** serif typography and curated brand palette.

---

## 🌟 Key Features

- **In-Browser SQL Engine & CSV Upload**: Client-side in-memory SQL execution (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`, `SUM`, `AVG`, `COUNT`, `LIMIT`) with support for custom user CSV uploads.
- **Spotlight Command Palette (`Ctrl + K` / `Cmd + K`)**: Quick keyboard navigation across case studies, skills, theme toggling, language switching, and admin authentication.
- **Executive Business Intelligence Dashboard**: Interactive KPI scorecards, multi-dimension time horizon filtering (H1 vs H2), and 2x Retina PNG chart export.
- **Interactive Case Studies**:
  1. **Kami Ely TikTok Shop & Affiliate Performance**: E-commerce funnel, creator matrix, peak live stream analysis.
  2. **Heritage Tourism in Japan (1990–2024)**: Time-series modeling of 36.8M tourist inflow and regional spending divergence.
  3. **Real-time Library Bus IoT / Data Pipeline**: High-throughput distributed scheduling with Redis & Celery Beat.
- **Single-Admin Portal**: Custom project manager, live scorecard editor, visitor telemetry tracking, and encrypted JSON state backup/restore.
- **Internationalization (i18n)**: Instant switching between Vietnamese (`vi`) and English (`en`).
- **SEO & Performance**: Pre-rendered SSG pages, dynamic `sitemap.xml`, `robots.txt`, and Schema.org JSON-LD structured data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm / yarn / pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/duongduongdphk66a-spec/data-analyst-portfolio.git
cd data-analyst-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the portfolio.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4+ (App Router, Static Site Generation)
- **UI Library**: React 19, Lucide Icons, GSAP
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Properties
- **Visualizations**: Recharts, html2canvas
- **Data Parsing**: PapaParse (CSV)
- **Typography**: Google Fonts (Lora, JetBrains Mono, Merriweather)
- **CI/CD**: GitHub Actions

---

## 📜 License
MIT License © 2026 Ma Văn Hùng.
