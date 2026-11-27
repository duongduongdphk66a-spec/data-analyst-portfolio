# Ma Văn Hùng — Fresher Data Analyst & Business Analyst Portfolio

Portfolio tương tác dành cho vị trí **Fresher Data Analyst / Business Analyst**, kết hợp phân tích dữ liệu (SQL MySQL 8.0, Python/SciPy, đối soát đa nguồn, kiểm định thống kê, đặc tả BI) với phân tích nghiệp vụ (Mini-BRD, BPMN 2.0, User Stories, ERD, Wireframe và Tracking Plan).

Xây dựng trên Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, MySQL 8.0 và Recharts.

---

## 3 Case Study Chính

1. **Kami Ely — Phân tích TikTok Shop, Mạng lưới Affiliate & Đặc tả BI (DA + BA Hybrid)**
   - **Quy mô:** 231 ngày vận hành ước tính từ 10 bảng FastMoss (09/03 – 25/10/2026: `15,01 tỷ đ` GMV, `101.896` sản phẩm bán ra).
   - **Phân tích DA:** Phát hiện và loại trừ `+7,59 tỷ đ` trùng nguồn giữa `CrLive` và `AffLive`; kiểm định Panel FE trên cửa sổ sau mở bán (`n = 1.422`, `Within R² = 0,302`); phân tầng Live `>10h` theo tháng chỉ ra Nghịch lý Simpson (`8,48 Tr/h` T6 vs. `0,73 Tr/h` T8); kiểm định Mann-Whitney U / Fisher Exact cho Video Ads (`0,84×` GPM Organic); workbook Excel 5 sheet có công thức sống (`SUMIFS`, `INDEX/MATCH`, mô phỏng Break-Even, Power Query M) và gói 4 CSV Star Schema sẵn sàng nạp lên Power BI / Looker Studio / Tableau.
   - **Giải pháp BA & BI:** Cây chỉ số KPI Tree, phân tích nguyên nhân gốc **5 Whys & Fishbone 4M**, quy trình As-Is → To-Be, **Ma trận RACI**, 4 User Stories (`US-KE-01..04`), wireframe màn hình cảnh báo vận hành, **6 kịch bản UAT (`UAT-KE-01..06`)**, và BI Dashboard tương tác có Cross-Filter Slicer + Đặc tả Star Schema (`4 Fact · 3 Dim · DAX`).

2. **Du lịch Di sản Nhật Bản (2013–2022) — Kiểm toán Dữ liệu & Chuỗi Thời gian (DA)**
   - **Quy mô:** 6 chuỗi dữ liệu gốc tiếng Nhật giai đoạn 2003–2022 từ JNTO, MLIT, TP. Kyoto và TP. Nara (trọng tâm 2013–2022, kèm cập nhật 2023).
   - **Kết quả chính:** Tự kiểm toán và sửa 5 sai lệch nguồn trong niên luận gốc (lệch năm +1 Kyoto từ 2012, lỗi `×10` đơn vị `億円/万人` ở Nara, trộn đơn vị GDP); chỉ ra chi tiêu khách quốc tế đạt `4,81 nghìn tỷ Yên` (`~0,86% GDP`, tách khỏi toàn ngành `7,5% GDP` WTTC) nhưng chi tiêu/khách giảm `-14,6%` sau 2015; lượng hóa mật độ quá tải `3.000 lượt/cư dân khu lõi Ogimachi/năm` tại Shirakawa-go.

3. **Library Bus — Technical BA, Mô hình Dữ liệu Lõi & Tracking Plan (BA + Product Telemetry)**
   - **Quy mô:** Hồ sơ Technical BA trước Go-Live đối chiếu với bản mẫu đồ án Django 5.2 / MySQL 8.0 / Redis 7 / Celery Beat (`171 unit tests`).
   - **Đầu ra BA & Dữ liệu:** KPI Tree, As-Is/To-Be, 3 ràng buộc thực địa (offline 4G, trả chéo tuyến `IN_TRANSIT`, hủy chuyến), 5 Stakeholder + **Ma trận RACI**, MoSCoW, 4 quy tắc `BR-01..04` (trần phạt `100%` giá thay thế sách), 5 User Stories + **Sprint Backlog chuẩn Jira (`LB-101..105`)** + **2 đặc tả Use Case (`UC-01..02`)** + **6 UAT Test Cases (`UAT-LB-01..06`)** + RTM, lưu đồ BPMN 2.0 kèm tệp nguồn **`.drawio`**, ERD lõi 7 thực thể + **Data Dictionary**, Tracking Plan 8 sự kiện, SQL 30 ngày lọc cohort 7 ngày chín (`borrows_per_visit` không chặn trần), khung 5 ngưỡng Pilot 4 tuần và 11 cặp màn hình Wireframe–UI.

---

## Giới hạn Dữ liệu (Data Limitations & Scope Disclosures)

| Dự án | Nguồn dữ liệu | Giới hạn đã công bố minh bạch |
| --- | --- | --- |
| **Kami Ely** | 10 tệp xuất FastMoss (bên thứ ba, không phải sổ nội bộ) | Không có giá vốn (COGS), chi phí quảng cáo thực chi (ROAS ròng), tỷ lệ hoàn/hủy, chi phí gửi mẫu KOC và tồn kho ERP. Bảng `LiveProd` chỉ phủ `4,3%` GMV Live nên chỉ dùng tham khảo định tính; mọi ước lượng tác động trong Action Plan đều gắn nhãn minh họa. |
| **Du lịch Di sản Nhật Bản** | JNTO, MLIT, Cục Du lịch Kyoto & Nara (2003–2022) | Đứt gãy phương pháp thống kê TP. Kyoto từ năm R1/2019; mô hình ngoại suy log-linear trên mẫu nhỏ (`R² = 0,347`, `p = 0,073`) chịu tác động đồng thời của tỷ giá JPY (Abenomics) và cơ cấu khách Đông Á ngắn ngày; biểu đồ cơ cấu Kyoto 2017 ghép tổng lượt nội địa với khách nước ngoài lưu trú. |
| **Library Bus** | Hồ sơ đặc tả trước Go-Live + bản mẫu Django/MySQL | Chưa có lưu lượng vận hành thực địa; tỷ trọng Persona (`48% / 32% / 20%`) và dữ liệu trên ảnh chụp màn hình là dữ liệu mẫu thiết kế. Toàn bộ giả định được kiểm chứng qua khung quyết định Pilot 4 tuần trên 2 tuyến xe. |

---

## Cấu trúc Thư mục (Directory Structure)

```text
data-analyst-portfolio/
├── app/
│   ├── (site)/                 # Trang chủ, About, Experience, Blog, Project Detail
│   ├── api/                    # REST routes (profile, projects, case-studies, auth, db)
│   ├── data/                   # Dữ liệu chuẩn hóa (kami-ely/, heritageJapanData.ts, libraryBusData.ts, blogData.ts)
│   ├── projects/               # Trang nhúng chuyên biệt (/kami-ely/bi-spec, /library-bus/brd, /presentation)
│   └── defaultData.ts          # Metadata & dữ liệu dự phòng khi không kết nối MySQL
├── components/
│   ├── case-studies/
│   │   ├── kami-ely/           # Executive Summary + KPI Tree, 4 chương phân tích, Playbook + BA Spec + Wireframe, Appendix
│   │   ├── library-bus/        # Hero, BA Tabs + BPMN 2.0, ERD 7 bảng + Tracking Plan + Pilot 4W, 11 Screen Pairs
│   │   ├── HeritageJapanProject.tsx
│   │   └── charts/             # AboutSqlChart (8 bước SQL MySQL 8.0)
│   ├── site/                   # HeroSection, AboutSection, Sidebar, MainLayoutClient
│   └── ui/                     # CommandPalette (Ctrl+K), Theme/Language controls
├── public/
│   ├── kami/                   # kami-ely-bi-spec.html, kami_ely_applied_statistics.ipynb, kami_ely_analytics_workbook.xlsx, bi-pack/*.csv
│   ├── library-bus/            # mini-brd-library-bus.html, library_bus_bpmn_tobe.drawio, borrowing-workflow.html, analytics-dataflow.html, screens/
│   └── Ma_Van_Hung_CV_Data_Analyst_2026.pdf
├── scripts/
│   ├── generate_cv_pdf.mjs     # Xuất CV PDF 1 trang A4 (Playwright, kiểm soát overflow = 0px)
│   ├── seed_all_mysql_data.js  # Nạp dữ liệu chuẩn hóa vào MySQL 8.0
│   └── kami/                   # Pipeline ETL & 9 cổng kiểm soát chất lượng dữ liệu (run_quality_gates.py)
└── tests/                      # 9 bộ kiểm thử Vitest (99 unit tests)
```

---

## Cài đặt & Chạy Local

### Yêu cầu
- Node.js 18+ hoặc 20+
- MySQL 8.0+ *(Tùy chọn — ứng dụng tự fallback sang dữ liệu tĩnh đã xác minh nếu không cấu hình MySQL)*

```bash
git clone https://github.com/duongduongdphk66a-spec/data-analyst-portfolio.git
cd data-analyst-portfolio

npm install
cp .env.example .env.local
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Kiểm thử, Build & Xuất lại CV PDF

```bash
npm test -- --run              # 9 test suites / 99 unit tests (Vitest)
npx tsc --noEmit               # Kiểm tra kiểu TypeScript
npm run lint                   # Kiểm tra ESLint
npm run build                  # Biên dịch production Next.js 15
node scripts/generate_cv_pdf.mjs # Xuất lại CV PDF 1 trang A4 (overflowPx: 0)
```

---

## Triển khai (Deployment)

Hỗ trợ 3 phương án:
1. **Vercel + Cloud MySQL** (Aiven / Railway): cấu hình `DATABASE_URL`, `ADMIN_PASSWORD` (≥16 ký tự), `ADMIN_VERIFY_CODE` (≥8 ký tự), `NEXT_PUBLIC_SITE_URL`, `TRUST_PROXY=vercel`.
2. **VPS Ubuntu + PM2 + Nginx**: chạy `./deploy.sh` (tự sao chép `public/` và `.next/static/` vào standalone bundle).
3. **Docker Compose**: chạy `docker compose up -d --build` (khởi tạo kèm container MySQL 8.0).

---

## Trạng thái Xác minh (Verification)

- `npm test -- --run`: **9/9 test files · 99/99 unit tests pass**
- `npx tsc --noEmit`: **0 lỗi TypeScript**
- `npm run lint`: **0 lỗi, 0 cảnh báo ESLint**
- `npm run build`: **Biên dịch thành công 29/29 trang tĩnh & route Next.js 15**
- `node scripts/generate_cv_pdf.mjs`: **CV 1 trang A4 chuẩn (`scrollHeight: 1123`, `overflowPx: 0`)**

---

## License
MIT License © 2026 Ma Văn Hùng.
