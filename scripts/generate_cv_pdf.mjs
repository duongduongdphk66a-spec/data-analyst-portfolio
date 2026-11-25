#!/usr/bin/env node
/**
 * Generate ATS-friendly, single-page A4 CV PDF synchronized with Portfolio data.
 * Output: public/Ma_Van_Hung_CV_Data_Analyst_2026.pdf
 * Usage: node scripts/generate_cv_pdf.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_PDF = path.join(ROOT_DIR, 'public', 'Ma_Van_Hung_CV_Data_Analyst_2026.pdf');

const CV_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Ma Văn Hùng - CV Data Analyst / Business Analyst 2026</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 210mm;
      height: 297mm;
      padding: 8.5mm 11.5mm 8mm;
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 8.8pt;
      line-height: 1.32;
      font-variant-numeric: tabular-nums;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* Header */
    .header {
      border-bottom: 2px solid #074553;
      padding-bottom: 5px;
      margin-bottom: 7px;
    }

    .name {
      font-size: 18.5pt;
      font-weight: 800;
      letter-spacing: 0.4px;
      color: #0f172a;
      line-height: 1.1;
    }

    .role {
      margin-top: 1.5px;
      font-size: 9.5pt;
      font-weight: 700;
      letter-spacing: 0.45px;
      color: #0d7287;
    }

    .contact {
      margin-top: 3px;
      font-size: 8.15pt;
      color: #475569;
      line-height: 1.4;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1px 6px;
    }

    .contact a,
    .contact .item {
      white-space: nowrap;
    }

    .contact span.sep {
      color: #94a3b8;
    }

    /* Section */
    .section {
      margin-bottom: 7px;
    }

    .section-title {
      font-size: 9.2pt;
      font-weight: 800;
      color: #074553;
      text-transform: uppercase;
      letter-spacing: 0.35px;
      border-bottom: 1.25px solid #c8eef7;
      padding-bottom: 2px;
      margin-bottom: 4.5px;
    }

    .summary-text {
      font-size: 8.65pt;
      color: #334155;
      text-align: justify;
    }

    /* Skills Table */
    .skills-grid {
      display: table;
      width: 100%;
      border-collapse: collapse;
    }

    .skill-row {
      display: table-row;
    }

    .skill-label {
      display: table-cell;
      width: 150px;
      font-weight: 700;
      color: #0f172a;
      padding: 1.5px 8px 1.5px 0;
      vertical-align: top;
      font-size: 8.55pt;
    }

    .skill-value {
      display: table-cell;
      color: #334155;
      padding: 1.5px 0;
      vertical-align: top;
      font-size: 8.55pt;
    }

    /* Experience & Education Items */
    .entry {
      margin-bottom: 5.5px;
    }

    .entry:last-child {
      margin-bottom: 0;
    }

    .entry-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
    }

    .entry-title {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
    }

    .entry-period {
      font-size: 8.3pt;
      font-weight: 700;
      color: #0d7287;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .entry-sub {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-top: 0.5px;
      margin-bottom: 2px;
    }

    .entry-org {
      font-size: 8.4pt;
      font-style: italic;
      color: #475569;
    }

    .entry-loc {
      font-size: 8.1pt;
      font-style: italic;
      color: #64748b;
      white-space: nowrap;
      flex-shrink: 0;
    }

    ul.bullets {
      list-style: none;
      padding-left: 0;
    }

    ul.bullets li {
      position: relative;
      padding-left: 10px;
      margin-bottom: 1.8px;
      font-size: 8.5pt;
      color: #334155;
      text-align: justify;
    }

    ul.bullets li::before {
      content: "•";
      position: absolute;
      left: 0;
      top: 0;
      color: #0d7287;
      font-weight: 700;
    }

    ul.bullets li:last-child {
      margin-bottom: 0;
    }

    /* Project Cards */
    .project-card {
      border-left: 2.5px solid #9be7fa;
      padding-left: 8px;
      margin-bottom: 6px;
    }

    .project-card:last-child {
      margin-bottom: 0;
    }

    .project-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 2px;
    }

    .project-title {
      font-size: 8.95pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
    }

    .project-tags {
      background: #e6f7fc;
      border: 0.75px solid #9be7fa;
      color: #074553;
      font-size: 7.4pt;
      font-weight: 700;
      padding: 1.5px 5.5px;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .project-desc {
      font-size: 8.45pt;
      color: #334155;
      text-align: justify;
      margin-bottom: 3px;
    }

    .impact-box {
      background: #f0f9fb;
      border: 0.75px solid #c8eef7;
      border-radius: 4px;
      padding: 3px 6.5px;
      font-size: 8.3pt;
      color: #1e293b;
      line-height: 1.3;
    }

    .impact-label {
      font-weight: 800;
      color: #074553;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1 class="name">MA VĂN HÙNG</h1>
    <p class="role">FRESHER DATA ANALYST / BUSINESS ANALYST</p>
    <div class="contact">
      <span class="item">Hà Nội, Việt Nam</span><span class="sep">•</span>
      <a href="mailto:mavanhung.da@gmail.com">mavanhung.da@gmail.com</a><span class="sep">•</span>
      <a href="https://github.com/duongduongdphk66a-spec/data-analyst-portfolio">github.com/duongduongdphk66a-spec/data-analyst-portfolio</a><span class="sep">•</span>
      <a href="https://www.linkedin.com/in/ma-van-hung">linkedin.com/in/ma-van-hung</a><span class="sep">•</span>
      <a href="https://mavanhung-portfolio.vercel.app">mavanhung-portfolio.vercel.app</a>
    </div>
  </header>

  <section class="section">
    <h2 class="section-title">Tóm tắt chuyên môn (Professional Summary)</h2>
    <p class="summary-text">
      Fresher Data Analyst tốt nghiệp Cử nhân Nhật Bản học (ĐHQGHN) với nền tảng nghiên cứu định lượng và kinh nghiệm làm việc full-time hỗ trợ vận hành E-Commerce. Sử dụng SQL, Python, Thống kê ứng dụng và Recharts để làm sạch dữ liệu đa nguồn, đối soát số liệu (Data Reconciliation), kiểm định giả thuyết (OLS, Mann-Whitney U, HHI, Cohort) và phân tích nghiệp vụ (BA) phục vụ quyết định vận hành.
    </p>
  </section>

  <section class="section">
    <h2 class="section-title">Kỹ năng &amp; Công cụ (Core Skills)</h2>
    <div class="skills-grid">
      <div class="skill-row">
        <div class="skill-label">Querying &amp; Programming:</div>
        <div class="skill-value">SQL (PostgreSQL, MySQL 8.0: Joins, CTEs, Window Functions, Cohort, Funnel) • Python (Pandas, NumPy, SciPy, Statsmodels)</div>
      </div>
      <div class="skill-row">
        <div class="skill-label">Visualization &amp; Data Prep:</div>
        <div class="skill-value">Recharts Interactive Dashboards • Đặc tả BI (Power BI / Looker Studio: Star Schema, DAX) • Xử lý &amp; Đối soát dữ liệu bảng (CSV/Excel, Google Sheets) • ERD</div>
      </div>
      <div class="skill-row">
        <div class="skill-label">Statistics &amp; Business Analysis:</div>
        <div class="skill-value">Data Reconciliation • EDA • Hồi quy OLS • Kiểm định Mann-Whitney U • Chỉ số tập trung HHI • BA (Mini-BRD, Quy tắc BR, User Flow, Wireframe, Product Telemetry)</div>
      </div>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">Kinh nghiệm làm việc &amp; Nghiên cứu (Work Experience &amp; Academic Research)</h2>

    <div class="entry">
      <div class="entry-top">
        <div class="entry-title">Nhân viên Hỗ trợ Vận hành &amp; Báo cáo Dữ liệu E-Commerce (Full-time)</div>
        <div class="entry-period">2022 - 2023</div>
      </div>
      <div class="entry-sub">
        <div class="entry-org">Steve x Kami Company</div>
        <div class="entry-loc">Hà Nội, Việt Nam</div>
      </div>
      <ul class="bullets">
        <li>Theo dõi đơn hàng hằng ngày, tỷ lệ giao thành công, tỷ lệ hoàn/hủy và biến động tồn kho theo mã SKU trên TikTok Shop.</li>
        <li>Tổng hợp báo cáo doanh số định kỳ bằng Excel và Google Sheets hỗ trợ đội vận hành so sánh hiệu quả giữa kênh livestream nội bộ và cộng tác viên affiliate (độc lập với dự án nghiên cứu cá nhân Kami Ely năm 2026).</li>
      </ul>
    </div>

    <div class="entry">
      <div class="entry-top">
        <div class="entry-title">Nghiên cứu Khoa học: Phân tích Du lịch Di sản tại Nhật Bản (Giai đoạn 2013 - 2023)</div>
        <div class="entry-period">2023 - 01/2024</div>
      </div>
      <div class="entry-sub">
        <div class="entry-org">Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN (GVHD: TS Võ Minh Vũ)</div>
        <div class="entry-loc">Hà Nội, Việt Nam</div>
      </div>
      <ul class="bullets">
        <li>Thu thập, kiểm toán độ lệch số liệu (Data Audit) và chuẩn hóa 6 bộ dữ liệu chuỗi thời gian 20 năm (2003 - 2022) từ JNTO, MLIT, UNWTO và WTTC để đánh giá giai đoạn chính sách 2013 - 2023.</li>
        <li>Xây dựng mô hình xu thế đối chứng log-linear (đường nền mô tả 2003 - 2012) và phân tích đối sánh đa điểm đến (Kyoto, Shirakawa-go, Himeji) nhằm lượng hóa đóng góp kinh tế vĩ mô và áp lực quá tải di sản.</li>
      </ul>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">Dự án phân tích độc lập (Featured Portfolio Case Studies)</h2>

    <div class="project-card">
      <div class="project-head">
        <div class="project-title">Kami Ely: Phân tích TikTok Shop &amp; Mạng lưới Affiliate (Dữ liệu ước tính FastMoss 03 - 10/2026)</div>
        <div class="project-tags">SQL • Python • SciPy • BI Spec</div>
      </div>
      <p class="project-desc">
        Dự án cá nhân phân tích 231 ngày vận hành (09/03 - 25/10/2026) với 15,01 tỷ VNĐ GMV ước tính và 101.896 sản phẩm bán ra từ 10 bảng dữ liệu ước tính của bên thứ ba FastMoss (23.364 dòng; đối chiếu cửa sổ 180 ngày đạt 12,74 tỷ VNĐ / 85.500 sản phẩm; lũy kế toàn thời gian đạt 31,6 tỷ VNĐ / 238,4k sản phẩm; không dùng số liệu nội bộ). Thực hiện kiểm định OLS, Mann-Whitney U, HHI, Cohort 302 KOC và biên soạn đặc tả BI Dashboard (Power BI / Looker Studio: Star Schema, 6 nhóm DAX).
      </p>
      <div class="impact-box">
        <span class="impact-label">IMPACT:</span> Giải mã bẫy cộng trùng 595 phiên LIVE (tránh thổi phồng +3,05 tỷ VNĐ); chứng minh Live chính chủ &amp; kênh vệ tinh chiếm 84,5% GMV Live, 12/133 SKU có đơn tạo 80,6% GMV và đề xuất cấp quyền Video Ads có chọn lọc kèm ngưỡng kiểm soát GPM/ROAS biên.
      </div>
    </div>

    <div class="project-card">
      <div class="project-head">
        <div class="project-title">Heritage Tourism in Japan: Phân tích Chuỗi Thời gian (Trọng tâm 2013 - 2023 • Nền 2003 - 2022)</div>
        <div class="project-tags">Python • Time-Series • Data Audit</div>
      </div>
      <p class="project-desc">
        Phân tích tác động của chính sách mở cửa thị thực và bảo tồn di sản UNESCO tại Nhật Bản giai đoạn 2013 - 2023 dựa trên chuỗi dữ liệu 20 năm (2003 - 2022) từ JNTO &amp; MLIT, đánh giá cú sốc đại dịch COVID-19 (-99,2% lượng khách năm 2021) và kiểm toán hiệu đính 5 nhóm sai lệch đơn vị/trục năm từ niên luận gốc.
      </p>
      <div class="impact-box">
        <span class="impact-label">IMPACT:</span> Lượng khách quốc tế đạt đỉnh 31,9 triệu lượt năm 2019 (+206,7% so với 2013), chi tiêu đạt 4,81 nghìn tỷ Yên (3,41x so với 2013), đóng góp 7,5% GDP (&gt;4 triệu việc làm); lượng hóa tỷ lệ quá tải 3.000 : 1 tại làng cổ Shirakawa-go.
      </div>
    </div>

    <div class="project-card">
      <div class="project-head">
        <div class="project-title">Library Bus: Phân tích Nghiệp vụ (BA), Kiến trúc Telemetry (MySQL 8.0 / Redis / Celery) &amp; UX/UI</div>
        <div class="project-tags">BA • MySQL 8.0 • Telemetry • UI</div>
      </div>
      <p class="project-desc">
        Đặc tả 4 bộ quy tắc nghiệp vụ (BR-01..04: hạn mức mượn, khóa bi quan select_for_update() theo Lock Ordering chống Race Condition &amp; Deadlock, hàng đợi FIFO 7 ngày, phí phạt lũy tiến 3 bậc), thiết kế lược đồ Product Telemetry (UserActivity, BookAnalytics, BusAnalytics, DailyStats) và 11 cặp màn hình đối chiếu Wireframe - UI (Desktop 1440px &amp; Mobile 390px) trên dữ liệu mẫu.
      </p>
      <div class="impact-box">
        <span class="impact-label">IMPACT:</span> Xác nhận logic nghiệp vụ qua prototype Django 5.2 (7 apps, 36 models, 97 templates, 9 tác vụ Celery Beat + Redis 7 và 171 unit tests tự động) cùng bộ tài liệu Mini-BRD &amp; RTM gắn dấu vết từng màn hình.
      </div>
    </div>
  </section>

  <section class="section" style="margin-bottom: 0;">
    <h2 class="section-title">Học vấn (Education)</h2>
    <div class="entry">
      <div class="entry-top">
        <div class="entry-title">Cử nhân Ngành Nhật Bản học (Khoa Đông Phương học)</div>
        <div class="entry-period">2021 - 2025</div>
      </div>
      <div class="entry-sub">
        <div class="entry-org">Trường Đại học Khoa học Xã hội và Nhân văn - Đại học Quốc gia Hà Nội (VNU-USSH)</div>
        <div class="entry-loc">Hà Nội, Việt Nam</div>
      </div>
      <ul class="bullets">
        <li>Niên luận nghiên cứu định lượng: "Sự phát triển của Du lịch Di sản tại Nhật Bản giai đoạn từ năm 2013 đến nay" (GVHD: TS Võ Minh Vũ).</li>
      </ul>
    </div>
  </section>
</body>
</html>`;

async function launchBrowser() {
  for (const opts of [{ headless: true, channel: 'chrome' }, { headless: true, channel: 'msedge' }, { headless: true }]) {
    try {
      return await chromium.launch(opts);
    } catch {
      // try next browser channel
    }
  }
  throw new Error('No Chromium/Chrome/Edge browser available for Playwright PDF generation.');
}

async function generatePdf() {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(CV_HTML, { waitUntil: 'networkidle' });

    const metrics = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollHeight: body.scrollHeight,
        clientHeight: body.clientHeight,
        overflowPx: body.scrollHeight - body.clientHeight,
      };
    });

    await page.pdf({
      path: OUTPUT_PDF,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: true,
    });

    console.log('Generated CV PDF:', OUTPUT_PDF);
    console.log('Layout check:', metrics);
    if (metrics.overflowPx > 2) {
      throw new Error(`CV content overflowed single A4 page by ${metrics.overflowPx}px`);
    }
  } finally {
    await browser.close();
  }
}

generatePdf().catch((err) => {
  console.error(err);
  process.exit(1);
});
