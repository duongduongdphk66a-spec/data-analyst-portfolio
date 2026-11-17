// FILE: app/data/kami-ely/sqlLabPresets.ts
// 4 TRUY VẤN SQL TRÊN 10 BẢNG DỮ LIỆU KAMI ELY (231 NGÀY, 23.364 DÒNG)

export interface KamiSqlPresetItem {
  id: string;
  badge: string;
  title: { vi: string; en: string };
  businessQuestion: { vi: string; en: string };
  sqlQuery: string;
  columns: string[];
  rows: (string | number)[][];
  analystInterpretation: { vi: string; en: string };
}

export const KAMI_ELY_SQL_LAB_PRESETS: KamiSqlPresetItem[] = [
  {
    id: 'sql-01-channel-reconciliation-231d',
    badge: 'RECONCILIATION • 231 DAYS',
    title: {
      vi: '1. Đối soát Cơ Cấu Doanh Thu 231 Ngày: Kênh Chính Chủ, Vệ Tinh & 301 Đối Tác Ngoài',
      en: '1. 231-Day Revenue Reconciliation: Official Shop, In-House Satellite & 301 Partners'
    },
    businessQuestion: {
      vi: 'Làm thế nào để khử trùng 595 phiên @shop_official giữa AffLive và CrLive, tách riêng kênh vệ tinh @koc_sat01 và xác định phần đóng góp của Video + Kệ hàng trên tổng 15,01 tỷ đ?',
      en: 'How do we deduplicate 595 @shop_official sessions across AffLive and CrLive, isolate satellite @koc_sat01, and reconcile Video + Product Card revenue within the 15.01B VND total?'
    },
    sqlQuery: `-- Đối soát cơ cấu kênh 231 ngày từ stg_store_daily (231 ngày) và stg_affiliate_live (8.355 phiên đã khử trùng CrLive)
WITH store_totals AS (
    SELECT 
        SUM(units_sold) AS total_shop_units,
        SUM(daily_gmv_vnd) AS total_shop_gmv
    FROM stg_store_daily
),
live_split AS (
    SELECT 
        SUM(CASE WHEN creator_alias = '@shop_official' THEN shop_gmv_vnd ELSE 0 END) AS official_live_gmv,
        SUM(CASE WHEN creator_alias = '@koc_sat01' THEN shop_gmv_vnd ELSE 0 END) AS satellite_live_gmv,
        SUM(CASE WHEN creator_alias NOT IN ('@shop_official', '@koc_sat01') THEN shop_gmv_vnd ELSE 0 END) AS partner_live_gmv,
        SUM(shop_gmv_vnd) AS dedup_live_gmv
    FROM stg_affiliate_live
)
SELECT 
    '1. Live Chính Chủ (@shop_official · 595 phiên)' AS channel_segment,
    ROUND(l.official_live_gmv / 1e9, 2) AS gmv_billion_vnd,
    ROUND(l.official_live_gmv * 100.0 / l.dedup_live_gmv, 1) AS share_of_live_pct,
    ROUND(l.official_live_gmv * 100.0 / s.total_shop_gmv, 1) AS share_of_store_pct
FROM store_totals s CROSS JOIN live_split l
UNION ALL
SELECT 
    '2. Live Vệ Tinh Nội Bộ (@koc_sat01 · 261 phiên)',
    ROUND(l.satellite_live_gmv / 1e9, 2),
    ROUND(l.satellite_live_gmv * 100.0 / l.dedup_live_gmv, 1),
    ROUND(l.satellite_live_gmv * 100.0 / s.total_shop_gmv, 1)
FROM store_totals s CROSS JOIN live_split l
UNION ALL
SELECT 
    '3. Live 301 Đối Tác Độc Lập (7.499 phiên)',
    ROUND(l.partner_live_gmv / 1e9, 2),
    ROUND(l.partner_live_gmv * 100.0 / l.dedup_live_gmv, 1),
    ROUND(l.partner_live_gmv * 100.0 / s.total_shop_gmv, 1)
FROM store_totals s CROSS JOIN live_split l
UNION ALL
SELECT 
    '4. Video Gắn Giỏ & Kệ Hàng Tự Nhiên (Non-Live)',
    ROUND((s.total_shop_gmv - l.dedup_live_gmv) / 1e9, 2),
    NULL,
    ROUND((s.total_shop_gmv - l.dedup_live_gmv) * 100.0 / s.total_shop_gmv, 1)
FROM store_totals s CROSS JOIN live_split l;`,
    columns: ['channel_segment', 'gmv_billion_vnd', 'share_of_live_pct', 'share_of_store_pct'],
    rows: [
      ['1. Live Chính Chủ (@shop_official · 595 phiên)', '7,59 tỷ đ', '72.5%', '50.6%'],
      ['2. Live Vệ Tinh Nội Bộ (@koc_sat01 · 261 phiên)', '1,26 tỷ đ', '12.0%', '8.4%'],
      ['3. Live 301 Đối Tác Độc Lập (7.499 phiên)', '1,62 tỷ đ', '15.5%', '10.8%'],
      ['4. Video Gắn Giỏ & Kệ Hàng Tự Nhiên (Non-Live)', '4,54 tỷ đ', '—', '30.2%'],
      ['TỔNG TOÀN GIAN HÀNG (231 NGÀY)', '15,01 tỷ đ', '100.0% (Live = 10,47 tỷ)', '100.0%']
    ],
    analystInterpretation: {
      vi: 'Cộng thẳng AffLive (10,47 tỷ) và CrLive (7,59 tỷ) sẽ rơi vào bẫy cộng đôi 18,06 tỷ đ (vượt cả GMV shop 15,01 tỷ). Sau khi khử trùng 595 phiên @shop_official, Live chiếm 69,8% GMV toàn shop, trong đó hệ thống nội bộ (@shop_official + @koc_sat01) nắm giữ 84,5% doanh thu kênh Live.',
      en: 'Naively summing AffLive (10.47B) and CrLive (7.59B) creates an 18.06B VND double-counting trap (exceeding 15.01B store GMV). After deduplicating 595 @shop_official sessions, Live drives 69.8% of store GMV, with in-house streams (@shop_official + @koc_sat01) generating 84.5% of Live revenue.'
    }
  },
  {
    id: 'sql-02-paid-ads-video-dependency',
    badge: 'VIDEO FOREST • 4,796 CLIPS',
    title: {
      vi: '2. Kiểm Định Hiệu Suất Ads vs. Organic Trên 4.796 Video Sau Khử Trùng Khóa Phức Hợp',
      en: '2. Auditing Paid Ads vs. Organic Efficiency Across 4,796 Deduplicated Videos'
    },
    businessQuestion: {
      vi: 'Sau khi gộp chuẩn hóa nhãn YES/có và NO/không trên 4.796 video, cờ Ads làm thay đổi tỷ lệ ra đơn và doanh thu trên 1.000 lượt xem (GPM) như thế nào ở toàn mẫu và trong cùng 192 KOC?',
      en: 'After unifying YES/có and NO/không labels across 4,796 clips, how does the Ads flag affect conversion rate and GPM across the full sample versus within the same 192 creators?'
    },
    sqlQuery: `-- Đối chiếu hiệu suất Ads vs. Organic toàn mẫu (4.796 clip) và kiểm soát nội bộ cùng KOC (192 creator có cả hai loại)
WITH dual_creators AS (
    SELECT creator_hash
    FROM stg_affiliate_videos
    GROUP BY creator_hash
    HAVING SUM(CASE WHEN is_ads_auth = 1 THEN 1 ELSE 0 END) > 0
       AND SUM(CASE WHEN is_ads_auth = 0 THEN 1 ELSE 0 END) > 0
)
SELECT 
    'Toàn mẫu (4.796 clip)' AS analysis_slice,
    CASE WHEN is_ads_auth = 1 THEN 'Ads (YES/có)' ELSE 'Organic (NO/không)' END AS ads_status,
    COUNT(*) AS clip_count,
    ROUND(SUM(CASE WHEN contributed_gmv_vnd > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS conv_rate_pct,
    ROUND(SUM(contributed_gmv_vnd) * 1.0 / NULLIF(SUM(views_cnt), 0), 1) AS vnd_per_view
FROM stg_affiliate_videos
GROUP BY is_ads_auth
UNION ALL
SELECT 
    'Cùng KOC (192 creator)',
    CASE WHEN v.is_ads_auth = 1 THEN 'Ads (YES/có)' ELSE 'Organic (NO/không)' END,
    COUNT(*),
    ROUND(SUM(CASE WHEN v.contributed_gmv_vnd > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1),
    ROUND(SUM(v.contributed_gmv_vnd) * 1.0 / NULLIF(SUM(v.views_cnt), 0), 1)
FROM stg_affiliate_videos v
JOIN dual_creators d ON v.creator_hash = d.creator_hash
GROUP BY v.is_ads_auth;`,
    columns: ['analysis_slice', 'ads_status', 'clip_count', 'conv_rate_pct', 'vnd_per_view'],
    rows: [
      ['Toàn mẫu (4.796 clip)', 'Ads (YES/có)', 3775, '30.3%', '65,7 đ/view (GPM 0,84x)'],
      ['Toàn mẫu (4.796 clip)', 'Organic (NO/không)', 1021, '10.2%', '77,8 đ/view (Baseline 1,00x)'],
      ['Cùng KOC (192 creator)', 'Ads (YES/có)', 1131, '36.5%', '89,0 đ/view (GPM 0,73x)'],
      ['Cùng KOC (192 creator)', 'Organic (NO/không)', 340, '12.9%', '121,4 đ/view (Baseline 1,00x)']
    ],
    analystInterpretation: {
      vi: 'Cờ Ads giúp tăng xác suất video có đơn thêm +20,1 đ% toàn mẫu (+23,6 đ% trong cùng KOC, OR = 3,8–3,9), nhưng GPM trên mỗi 1.000 lượt xem của Ads lại thấp hơn Organic (0,84x toàn mẫu và 0,73x trong cùng KOC). Do đó chỉ nên cấp quyền Ads có chọn lọc cho clip đã có đơn tự nhiên kèm hashtag mã SP (BR-02).',
      en: 'Ad authorization lifts order conversion probability by +20.1 pp overall (+23.6 pp within-creator, OR = 3.8–3.9), yet Ads GPM trails Organic (0.84x overall and 0.73x within-creator). Ad boosting should be gated to organically converting clips with product hashtags (BR-02).'
    }
  },
  {
    id: 'sql-03-live-saturation-and-seasonality',
    badge: 'TIME-SERIES • 231 DAYS',
    title: {
      vi: '3. Phân Rã Hai Pha Suy Giảm Mùa Vụ (T6 → T8) & Hồi Phục Hiệu Suất Tháng 10',
      en: '3. Two-Phase Seasonal Contraction Decomposition (Jun → Aug) & October Yield Rebound'
    },
    businessQuestion: {
      vi: 'Cú rơi -83,1% GMV từ đỉnh tháng 6 (3,77 tỷ) xuống đáy tháng 8 (0,64 tỷ) và nhịp hồi phục tháng 10 (1,62 tỷ/25 ngày) đến từ số lượng ca Live hay năng suất mỗi ca?',
      en: 'Was the -83.1% GMV drop from June (3.77B) to August (0.64B) and the October rebound (1.62B in 25d) driven by Live session count or yield per session?'
    },
    sqlQuery: `-- Tổng hợp chuỗi tháng 231 ngày trên stg_store_daily và stg_affiliate_live
SELECT 
    SUBSTR(s.record_date, 1, 7) AS ym,
    COUNT(s.record_date) AS observed_days,
    ROUND(SUM(s.daily_gmv_vnd) / 1e9, 2) AS store_gmv_b,
    SUM(s.new_lives_cnt) AS store_lives_cnt,
    ROUND((SUM(s.daily_gmv_vnd) / 1e6) / NULLIF(SUM(s.new_lives_cnt), 0), 2) AS store_gmv_per_live_m,
    CASE 
        WHEN SUBSTR(s.record_date, 1, 7) = '2026-04' THEN 'Đỉnh cung nội dung: 1.957 ca Live & 80 KOC mới'
        WHEN SUBSTR(s.record_date, 1, 7) = '2026-06' THEN 'Đỉnh cầu mùa Hè: 3,77 tỷ đ (Đỉnh ngày 16/06 = 315,0 Tr)'
        WHEN SUBSTR(s.record_date, 1, 7) = '2026-07' THEN 'Pha 1 suy giảm: Số ca Live giảm -46,4% (1.560 -> 836 ca)'
        WHEN SUBSTR(s.record_date, 1, 7) = '2026-08' THEN 'Pha 2 chạm đáy: Năng suất Store/ca sụp -61,0% về 0,99 Tr'
        WHEN SUBSTR(s.record_date, 1, 7) = '2026-10' THEN 'Xoay trục Thu Đông: 1,62 tỷ/25N nhờ năng suất 2,33 Tr/ca'
    END AS phase_diagnosis
FROM stg_store_daily s
WHERE SUBSTR(s.record_date, 1, 7) IN ('2026-04', '2026-06', '2026-07', '2026-08', '2026-10')
GROUP BY SUBSTR(s.record_date, 1, 7)
ORDER BY ym ASC;`,
    columns: [
      'ym',
      'observed_days',
      'store_gmv_b',
      'store_lives_cnt',
      'store_gmv_per_live_m',
      'phase_diagnosis'
    ],
    rows: [
      ['2026-04', '30 ngày', '2,50 tỷ đ', 1957, '1,28 Tr đ/ca', 'Đỉnh cung nội dung: 1.957 ca Live & 80 KOC mới'],
      ['2026-06', '30 ngày', '3,77 tỷ đ', 1560, '2,42 Tr đ/ca', 'Đỉnh cầu mùa Hè: 3,77 tỷ đ (Đỉnh ngày 16/06 = 315,0 Tr)'],
      ['2026-07', '31 ngày', '2,12 tỷ đ', 836, '2,54 Tr đ/ca', 'Pha 1 suy giảm: Số ca Live giảm -46,4% (1.560 -> 836 ca)'],
      ['2026-08', '31 ngày', '0,64 tỷ đ', 645, '0,99 Tr đ/ca', 'Pha 2 chạm đáy: Năng suất Store/ca sụp -61,0% về 0,99 Tr'],
      ['2026-10*', '25 ngày', '1,62 tỷ đ', 694, '2,33 Tr đ/ca', 'Xoay trục Thu Đông: 1,62 tỷ/25N nhờ năng suất 2,33 Tr/ca']
    ],
    analystInterpretation: {
      vi: 'Tách bạch rõ 2 pha suy giảm: Tháng 7 giảm do sụt cung số lượng ca (-46,4%) trong khi doanh thu Video và kệ hàng giữ nhịp GMV toàn shop/ca ở mức 2,54 Tr đ; đến tháng 8 mới sụp hiệu suất mỗi ca (-61,0% về 0,99 Tr đ). Ngược lại, đợt hồi phục tháng 10 đạt 1,62 tỷ đ chỉ với 694 ca nhờ xoay trục sang hàng Thu Đông (năng suất 2,33 Tr đ/ca).',
      en: 'Separates the contraction into two distinct phases: July contracted via session supply (-46.4%) while non-Live sales buffered Store GMV/session at 2.54M VND; August then suffered a -61.0% yield collapse to 0.99M VND. Conversely, October rebounded to 1.62B VND across 694 sessions via Autumn-Winter catalog rotation (2.33M VND/session).'
    }
  },
  {
    id: 'sql-04-hero-sku-autumn-winter-pivot',
    badge: 'SKU PARETO & ROTATION • 339 SKUS',
    title: {
      vi: '4. Đảo Chiều Danh Mục Tuần W36 (31/08) & Sàng Lọc 339 SKU (12 Mã Tạo 80,6% GMV)',
      en: '4. Week W36 (Aug 31) Seasonal Catalog Crossover & 339-SKU Pareto Screening'
    },
    businessQuestion: {
      vi: 'Khi nào tỷ trọng 5 mã Thu Đông chính thức vượt 5 mã Đồ bơi Hè trên chuỗi 10 SKU chủ lực, và vì sao có 206/339 SKU ghi nhận 0 đơn?',
      en: 'When did the 5 Autumn-Winter SKUs overtake the 5 Summer Swimwear SKUs across the 10-SKU panel, and why do 206 of 339 catalog SKUs record zero orders?'
    },
    sqlQuery: `-- Kiểm tra điểm giao cắt mùa vụ tuần ISO trên stg_sku10_daily (1.790 dòng) và phân tầng năm lên sàn 339 SKU
SELECT 
    YEARWEEK(record_date, 3) AS iso_week,
    MIN(record_date) AS week_monday,
    ROUND(SUM(CASE WHEN season_affinity = 'Hàng Bán Hè' THEN daily_gmv_vnd ELSE 0 END) / 1e6, 2) AS summer_5sku_m,
    ROUND(SUM(CASE WHEN season_affinity = 'Hàng Bán Đông' THEN daily_gmv_vnd ELSE 0 END) / 1e6, 2) AS winter_5sku_m,
    ROUND(SUM(CASE WHEN season_affinity = 'Hàng Bán Đông' THEN daily_gmv_vnd ELSE 0 END) * 100.0 / SUM(daily_gmv_vnd), 1) AS winter_share_pct,
    ROUND(SUM(CASE WHEN sku_code = 'AT06' THEN daily_gmv_vnd ELSE 0 END) * 100.0 / SUM(daily_gmv_vnd), 1) AS at06_share_pct
FROM stg_sku10_daily
WHERE YEARWEEK(record_date, 3) IN (202624, 202635, 202636, 202641, 202642)
GROUP BY YEARWEEK(record_date, 3)
ORDER BY iso_week ASC;`,
    columns: ['iso_week', 'week_monday', 'summer_5sku_m', 'winter_5sku_m', 'winter_share_pct', 'at06_share_pct'],
    rows: [
      ['2026-W24 (Đỉnh Hè)', '2026-06-08', '280,14 Tr đ', '26,41 Tr đ', '8.6%', '0.0%'],
      ['2026-W35 (Trước xoay trục)', '2026-08-24', '14,76 Tr đ', '12,59 Tr đ', '46.0%', '0.0%'],
      ['2026-W36 (Mốc đảo chiều)', '2026-08-31', '10,16 Tr đ', '24,57 Tr đ', '70.8%', '0.0% (CV11 & CV02 dẫn sóng)'],
      ['2026-W41 (Cao điểm Thu)', '2026-10-05', '3,55 Tr đ', '334,26 Tr đ', '98.9%', '88.1% (AT06 bùng nổ)'],
      ['2026-W42 (Cao điểm Thu)', '2026-10-12', '4,47 Tr đ', '519,70 Tr đ', '99.1%', '91.6% (AT06 chủ lực)']
    ],
    analystInterpretation: {
      vi: 'Danh mục đảo chiều sang Thu Đông ngay tại tuần W36 (31/08: từ 46,0% vọt lên 70,8%), mở đường cho mã áo giữ nhiệt AT06 đóng góp 1,30 tỷ đ (89,2% GMV 10 mã trong tháng 10). Trên bảng Shop_Products (339 SKU), 12/133 mã có đơn tạo 80,6% GMV; trong 206 mã 0 đơn có tới 204 mã niêm yết cũ trước năm 2026 (43/45 mã ra mắt năm 2026 đều có đơn).',
      en: 'The catalog flipped to Autumn-Winter in week W36 (Aug 31: surging from 46.0% to 70.8%), paving the way for thermal top AT06 to generate 1.30B VND (89.2% of 10-SKU GMV in October). Across Shop_Products (339 SKUs), 12 of 133 active SKUs drive 80.6% of GMV, while 204 of the 206 zero-sale SKUs are pre-2026 legacy listings (43 of 45 2026 launches converted).'
    }
  }
];
