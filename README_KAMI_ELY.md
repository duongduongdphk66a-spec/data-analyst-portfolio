# Kami Ely: Phân tích Hiệu suất TikTok Shop & Mạng lưới Affiliate

## 1. Giới thiệu dự án
Case study phân tích thực nghiệm dữ liệu thương mại điện tử TikTok Shop cho thương hiệu thời trang nữ & đồ bơi **Kami Ely** (@kami_official).
- **Phạm vi quan sát**: 231 ngày liên tục (09/03/2026 - 25/10/2026).
- **Quy mô dữ liệu**: 15,01 tỷ VNĐ GMV toàn shop, 101.896 sản phẩm, 8.355 phiên Live, 1.077 video, 302 KOC ngoài và 133 SKU.
- **Nguồn dữ liệu**: Dữ liệu ước tính bên thứ ba (FastMoss Market Intelligence), đã khử trùng lặp và ẩn danh PII.

---

## 2. Cấu trúc mã nguồn module Kami Ely

```text
├── components/case-studies/
│   ├── KamiElyProject.tsx                    # Root Container điều phối Case Study
│   └── kami-ely/
│       ├── KamiElyHero.tsx                   # Hero section (4 KPI + 3 câu trả lời một dòng)
│       ├── KamiElyNav.tsx                    # Thanh điều hướng sticky 8 mốc
│       ├── commercial/
│       │   ├── KamiElyCommercialTab.tsx      # Tab tổng hợp nối các chương
│       │   ├── Tier1ExecutiveSummary.tsx     # Chương 0: Tóm tắt điều hành & GMV 8 tháng (Hình 0.1)
│       │   ├── Chapter1ContextAndData.tsx    # Chương 1: Bẫy dữ liệu (Hình 1.2), Bảng 4 quần thể
│       │   ├── Chapter2RevenueAndSku.tsx     # Chương 2: Cơ cấu Live (2.1), Pareto 12 SKU (2.2), Lorenz (2.3)
│       │   ├── Chapter3SeasonalityAndRegression.tsx # Chương 3: Chuỗi ngày 4 pha (3.1), Năng suất ca (3.2), OLS (3.4)
│       │   ├── Chapter4KocNetwork.tsx        # Chương 4: Cohort giữ chân (4.1), Kaplan-Meier 90N (4.2)
│       │   ├── Chapter5LiveVideoAds.tsx      # Chương 5: Bóc tách kênh Live (5.1), Forest plot Ads (5.2)
│       │   ├── Chapter6EarlyWarningAndPlaybook.tsx # Chương 6: Tín hiệu sớm (6.1), Backtest (6.2), Playbook & Đèn giao thông
│       │   ├── Tier3EngineeringAppendix.tsx  # Phụ lục A (Kiểm định), B (SQL MySQL 8.0+), C (Giới hạn)
│       │   └── kamiOutlineV2Metrics.ts       # Hằng số, dữ liệu phân tích và màu thương hiệu
│       ├── playbook/                         # Giao diện thẻ, định dạng bảng & ngôn ngữ song ngữ
│       └── science/                          # Modal hiển thị mã nguồn Python Applied Statistics
├── app/data/
│   ├── kamiElyData.ts                        # Entry point xuất dữ liệu phân tích
│   └── kami-ely/                             # Toàn bộ dữ liệu telemetry bóc tách theo domain
│       ├── shop/                             # Doanh số, chuỗi thời gian shop
│       ├── creator/                          # Telemetry KOC & phiên Live
│       ├── stats/                            # Kết quả thống kê OLS, Z-score, Kaplan-Meier
│       └── reconciliation/                   # Bảng đối soát dữ liệu
└── scripts/kami/
    ├── import_kami_all_timeframes.py         # Pipeline hợp nhất dữ liệu 2 khung thời gian vào MySQL
    └── import_kami_supplementary.py          # Script nạp dữ liệu bổ trợ FastMoss
```

---

## 3. Các quy chuẩn phân tích đã thống nhất
1. **Quần thể Creator**:
   - Creator ngoài chủ shop: 302 tài khoản (7.760 phiên).
   - Đối tác độc lập: 301 tài khoản.
   - Kênh vệ tinh nội bộ: 1 tài khoản (`@koc_sat01` - 261 phiên, tạo 12,0% GMV Live).
   - Danh bạ KOL: 329 tài khoản có đơn (328 tài khoản ngoài chủ shop).
2. **Dải giá**: Thống nhất dùng giá niêm yết (75.000 - 150.000 đ chiếm 62,6% doanh thu; giá thực bán ASP chiếm 75,4%).
3. **Z-score**: Thống nhất Z-score duy nhất của đỉnh 16/06 là **+6,81**.
4. **Năng suất ca**: Phân biệt rõ giữa *GMV toàn shop trên mỗi ca Live* (thước Store) và *GMV trong phiên trên mỗi ca Live* (thước Live).

