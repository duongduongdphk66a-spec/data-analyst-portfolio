# Kami Ely: Phân tích Hiệu suất TikTok Shop & Mạng lưới Affiliate

## 1. Giới thiệu dự án
Case study phân tích dữ liệu thương mại điện tử TikTok Shop cho gian hàng thời trang nữ & đồ bơi **Kami Ely** (`@shop_official`, đã ẩn danh PII).
- Phạm vi quan sát: 231 ngày liên tục (`09/03/2026 - 25/10/2026`).
- Quy mô dữ liệu: `15,01 tỷ VNĐ` GMV toàn shop (Net), `101.896` sản phẩm, `8.355` phiên Live (khử trùng 595 phiên chính chủ trùng lặp `+7,59 tỷ`), `4.796` video gắn giỏ, `302` KOC Live ngoài và `133/339` link sản phẩm có đơn.
- Nguồn dữ liệu: 10 tệp xuất ước tính bên thứ ba (FastMoss Market Intelligence, `23.364` dòng thô), độc lập hoàn toàn với kinh nghiệm vận hành giai đoạn 2022–2023.

---

## 2. Cấu trúc mã nguồn module Kami Ely

```text
├── components/case-studies/
│   ├── KamiElyProject.tsx                              # Root container điều phối Case Study
│   └── kami-ely/
│       ├── KamiElyHero.tsx                             # Hero (4 KPI + CTA Notebook, BI Spec, Phụ lục)
│       ├── KamiElyNav.tsx                              # Thanh điều hướng sticky 7 mục
│       ├── commercial/
│       │   ├── KamiElyCommercialTab.tsx                # Ghép 7 khối theo trình tự câu hỏi -> khuyến nghị
│       │   ├── Tier1ExecutiveSummary.tsx               # Tổng quan & Xu hướng GMV 8 tháng / tuần / ngày
│       │   ├── Chapter1ContextAndData.tsx              # Đối soát 10 bảng, bẫy cộng trùng & cơ cấu từng kênh
│       │   ├── Chapter3SeasonalityAndRegression.tsx    # Mùa vụ 10 SKU, Pareto 2 lớp, HHI/Winsorize/MW-U & Panel FE
│       │   ├── Chapter5LiveVideoAds.tsx                # Live >10h phân tầng theo tháng (Simpson) & Video Ads 6 lát cắt
│       │   ├── Chapter4KocNetwork.tsx                  # Cohort 302 KOC & Luật sàng lọc 2 tầng bảo toàn nhóm ra đơn muộn
│       │   ├── Chapter6EarlyWarningAndPlaybook.tsx     # 4 sáng kiến hành động ưu tiên & Backtest MA7/MA28
│       │   ├── Tier3EngineeringAppendix.tsx            # Phụ lục A (9 Cổng QA), B (6 SQL MySQL 8.0), C (Giới hạn)
│       │   └── kamiOutlineV2Metrics.ts                 # Bridge tải SSOT metrics_v2.json
│       ├── playbook/                                   # Giao diện thẻ & tiện ích song ngữ
│       └── science/                                    # Modal xem 5 cell Python Applied Statistics
├── app/projects/kami-ely/bi-spec/page.tsx              # BI Dashboard tương tác (Slicer) & Đặc tả Star Schema 4 Fact · 3 Dim, 6 DAX
├── app/data/kami-ely/generated/metrics_v2.json         # SSOT được sinh tự động từ 10 tệp Excel
├── public/kami/
│   ├── kami_ely_analytics_workbook.xlsx                # Workbook Excel 5 sheet (SUMIFS, INDEX/MATCH, Break-Even, Power Query M)
│   ├── kami_ely_applied_statistics.ipynb               # Notebook Python kiểm định thống kê chạy trực tiếp trên 10 tệp Excel
│   └── bi-pack/*.csv                                   # 4 tệp CSV sạch sẵn sàng nạp lên Looker Studio / Tableau Public / Power BI
└── scripts/kami/
    ├── generate_outline_v2_metrics.mjs                 # ETL 10 tệp .xlsx -> metrics_v2.json
    ├── generate_excel_workbook.py                      # Sinh workbook Excel công thức sống & 4 CSV BI
    └── run_quality_gates.py                            # Kiểm tra động 9 cổng chất lượng trên MySQL
```

---

## 3. Các quy chuẩn phân tích đã thống nhất
1. **Quần thể Creator**:
   - KOC Live ngoài `@shop_official`: `302` tài khoản (`7.760` phiên), gồm `1` kênh vệ tinh nội bộ (`@koc_sat01`, 261 phiên, `1,26 tỷ` = `12,0%` GMV Live) và `301` KOC độc lập (`1,62 tỷ`).
   - Danh bạ KOL cuốn chiếu 90 ngày: `329/6.086` kênh có đơn (`5,4%`), `HHI = 3.842` (loại chính chủ còn kênh vệ tinh `@koc_sat01`: `1.471`; loại cả 2 kênh nội bộ thuần ngoài: `246`; riêng Live 226N bỏ vệ tinh: `761`).
2. **Dải giá thực bán (Realized ASP)**: Dải `75k–250k đ` chiếm `95,4%` GMV (`75k–150k` đạt `75,4%`, `150k–250k` đạt `20,0%`; đối chiếu theo cận dưới giá niêm yết là `94,8%` và trung điểm khoảng giá là `93,1%`); ASP trung bình toàn shop `147.298 đ/sp`.
3. **Đỉnh 16/06 & Winsorization**: Đỉnh `315,0 triệu` có `Z = +6,81` theo cửa sổ lùi 28 ngày (`Z = 5,83` toàn chuỗi 231 ngày); khi cắt P99/P95/trung vị T6, giao cắt `MA7 < MA28` vẫn ổn định ở `26–27/06`.
4. **Kiểm tra độ vững & đánh đổi**:
   - Phân tầng ca Live `>10h` theo tháng chỉ ra Simpson's Paradox (`T6: 8,48 Tr/h` vs `T7: 1,43 Tr/h` vs `T8: 0,73 Tr/h`).
   - Panel FE hậu mở bán (`n = 1.422`, loại 338 ngày 0 trước khi SKU lên kệ) giữ nguyên ý nghĩa thống kê ở 2 biến Livestream với `Within R² = 0,302`.
   - Sàng lọc KOC áp luật 2 tầng để bảo toàn `51` KOC chuyển đổi ở phiên 4+ (`304,9 triệu` = `18,8%` Live độc lập).
