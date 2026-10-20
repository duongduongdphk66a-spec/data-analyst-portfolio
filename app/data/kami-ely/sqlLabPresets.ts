// FILE: app/data/kami-ely/sqlLabPresets.ts
// 4 TRUY VẤN SQL THỰC CHIẾN TRÊN 8 BẢNG DỮ LIỆU KAMI ELY CHO TRANG /LAB

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
    id: 'sql-01-channel-reconciliation-90d',
    badge: 'RECONCILIATION • 90 DAYS',
    title: {
      vi: '1. Đối soát 3 Kênh Giao Dịch 90 Ngày & Giải Mã Khoảng Trống Kệ Hàng (22,85%)',
      en: '1. 90-Day 3-Channel Reconciliation & Product Card Gap (22.85%)'
    },
    businessQuestion: {
      vi: 'Làm thế nào để tách bạch doanh số Kênh chính chủ, 5.712 KOC ngoài và Thẻ sản phẩm (Kệ hàng) từ bảng _product data và _Creators_merged?',
      en: 'How do we separate Official Channel, 5,712 External KOCs, and Product Card sales using _product data and _Creators_merged?'
    },
    sqlQuery: `-- Đối soát 3 kênh bán hàng 90 ngày từ bảng kami_product_data_90d (331 SKUs) và kami_creators_merged_90d (5.713 Creators)
WITH shop_totals AS (
    SELECT 
        SUM(units_sold) AS total_shop_units,
        SUM(gmv_vnd) AS total_shop_gmv
    FROM kami_product_data_90d
),
creator_split AS (
    SELECT 
        SUM(CASE WHEN creator_handle = '@kamielyhn' THEN units_sold ELSE 0 END) AS self_units,
        SUM(CASE WHEN creator_handle = '@kamielyhn' THEN gmv_vnd ELSE 0 END) AS self_gmv,
        SUM(CASE WHEN creator_handle <> '@kamielyhn' THEN units_sold ELSE 0 END) AS affiliate_units,
        SUM(CASE WHEN creator_handle <> '@kamielyhn' THEN gmv_vnd ELSE 0 END) AS affiliate_gmv,
        SUM(units_sold) AS all_creators_units,
        SUM(gmv_vnd) AS all_creators_gmv
    FROM kami_creators_merged_90d
)
SELECT 
    '1. Kênh Chính Chủ (@kamielyhn)' AS channel_segment,
    c.self_units AS units_sold,
    ROUND(c.self_units * 100.0 / s.total_shop_units, 2) AS units_share_pct,
    c.self_gmv AS net_gmv_vnd,
    ROUND(c.self_gmv * 100.0 / s.total_shop_gmv, 2) AS gmv_share_pct
FROM shop_totals s CROSS JOIN creator_split c
UNION ALL
SELECT 
    '2. Mạng Lưới Affiliate (5.712 KOC ngoài)',
    c.affiliate_units,
    ROUND(c.affiliate_units * 100.0 / s.total_shop_units, 2),
    c.affiliate_gmv,
    ROUND(c.affiliate_gmv * 100.0 / s.total_shop_gmv, 2)
FROM shop_totals s CROSS JOIN creator_split c
UNION ALL
SELECT 
    '3. Thẻ Sản Phẩm / Kệ Hàng (Product Card)',
    s.total_shop_units - c.all_creators_units,
    ROUND((s.total_shop_units - c.all_creators_units) * 100.0 / s.total_shop_units, 2),
    s.total_shop_gmv - c.all_creators_gmv,
    ROUND((s.total_shop_gmv - c.all_creators_gmv) * 100.0 / s.total_shop_gmv, 2)
FROM shop_totals s CROSS JOIN creator_split c;`,
    columns: ['channel_segment', 'units_sold', 'units_share_pct', 'net_gmv_vnd', 'gmv_share_pct'],
    rows: [
      ['1. Kênh Chính Chủ (@kamielyhn)', 20027, '49.78%', '3.026.026.869 đ', '49.31%'],
      ['2. Mạng Lưới Affiliate (5.712 KOC ngoài)', 11572, '28.77%', '1.708.159.874 đ', '27.84%'],
      ['3. Thẻ Sản Phẩm / Kệ Hàng (Product Card)', 8630, '21.45%', '1.402.019.230 đ', '22.85%'],
      ['TỔNG TOÀN GIAN HÀNG (90 NGÀY)', 40229, '100.00%', '6.136.205.973 đ', '100.00%']
    ],
    analystInterpretation: {
      vi: 'Giải quyết triệt để ngộ nhận "4,73 Tỉ đ là riêng Affiliate": 4.734.186.743 đ là tổng khối Creators (gồm 3,03 Tỉ đ Chính chủ + 1,71 Tỉ đ KOC ngoài). Phần dư 1.402.019.230 đ (22,85%) khớp tuyệt đối với kênh Thẻ sản phẩm trên ảnh 073520 (22,87%).',
      en: 'Resolves the "4.73B Affiliate" misconception: 4,734,186,743 VND is total Creators (3.03B Official + 1.71B External KOCs). The 1,402,019,230 VND (22.85%) remainder matches Product Cards on screenshot 073520 (22.87%).'
    }
  },
  {
    id: 'sql-02-paid-ads-video-dependency',
    badge: 'VIDEO FUNNEL • 4,417 VIDEOS',
    title: {
      vi: '2. Kiểm Toán Sự Lệ Thuộc Vào Quảng Cáo Trả Phí Trên 4.417 Shoppable Videos',
      en: '2. Auditing Paid Ads Dependency Across 4,417 Shoppable Videos'
    },
    businessQuestion: {
      vi: 'Tỷ trọng doanh thu và sản lượng của các video có chạy quảng cáo (Ads = YES) so với video tự nhiên (Ads = NO) là bao nhiêu?',
      en: 'What is the GMV and unit volume share of Paid Ads videos (Ads = YES) versus Organic videos (Ads = NO)?'
    },
    sqlQuery: `-- Phân tích hiệu suất Paid Ads vs. Organic trên 4.417 video gắn giỏ hàng
SELECT 
    is_ads AS ads_status,
    COUNT(video_id) AS video_count,
    ROUND(COUNT(video_id) * 100.0 / SUM(COUNT(video_id)) OVER (), 2) AS video_share_pct,
    SUM(units_sold_90d) AS units_sold,
    ROUND(SUM(units_sold_90d) * 100.0 / SUM(SUM(units_sold_90d)) OVER (), 2) AS units_share_pct,
    SUM(gmv_90d) AS total_gmv_vnd,
    ROUND(SUM(gmv_90d) * 100.0 / SUM(SUM(gmv_90d)) OVER (), 2) AS gmv_share_pct
FROM kami_shoppable_videos_180d
GROUP BY is_ads
ORDER BY total_gmv_vnd DESC;`,
    columns: ['ads_status', 'video_count', 'video_share_pct', 'units_sold', 'units_share_pct', 'total_gmv_vnd', 'gmv_share_pct'],
    rows: [
      ['YES (Có chạy Ads)', 3482, '78.83%', 12398, '94.76%', '2.055.758.301 đ', '94.70%'],
      ['NO (Tự nhiên - Organic)', 935, '21.17%', 685, '5.24%', '115.082.025 đ', '5.30%'],
      ['TỔNG CỘNG', 4417, '100.00%', 13083, '100.00%', '2.170.840.326 đ', '100.00%']
    ],
    analystInterpretation: {
      vi: '94,70% doanh thu Shoppable Video đến từ Paid Ads. Để tăng doanh thu Organic (hiện chỉ 5,30%), kênh chính chủ cần gắn giỏ hàng cho 308 video đang bỏ trống và đổi giờ đăng từ buổi sáng (08:00–12:00) sang khung giờ vàng 12:00–13:00 và 15:00–16:00.',
      en: '94.70% of Shoppable Video GMV relies on Paid Ads. To grow Organic share (currently 5.30%), attach product links to the 308 unlinked official videos and shift posting from morning (08:00–12:00) to peak hours at 12:00–13:00 and 15:00–16:00.'
    }
  },
  {
    id: 'sql-03-live-saturation-and-seasonality',
    badge: 'TIME-SERIES • 180 DAYS',
    title: {
      vi: '3. Phát Hiện "Bẫy Số Lượng Phiên LIVE" & Chu Kỳ Mùa Vụ 180 Ngày',
      en: '3. Detecting the "LIVE Session Volume Trap" & 180-Day Seasonality'
    },
    businessQuestion: {
      vi: 'Việc tăng ồ ạt số phiên LIVE trong ngày có tỷ lệ thuận với doanh thu không? Đâu là các mốc ngày cực trị trong 180 ngày?',
      en: 'Does spamming daily LIVE sessions linearly increase GMV? What are the extreme benchmark days across the 180-day cycle?'
    },
    sqlQuery: `-- Đối chiếu các ngày cực trị về số lượng phiên LIVE và hiệu suất GMV/phiên trong 180 ngày
SELECT 
    date_id,
    live_sessions_count,
    shoppable_videos_count,
    active_kocs,
    units_sold,
    daily_gmv AS total_daily_gmv_vnd,
    ROUND(daily_gmv * 1.0 / NULLIF(live_sessions_count, 0), 0) AS gmv_per_live_session_vnd,
    CASE 
        WHEN date_id = '2026-04-09' THEN 'Bẫy số lượng: 106 phiên LIVE chỉ đạt ~750k/phiên'
        WHEN date_id = '2026-06-16' THEN 'Đỉnh lịch sử toàn shop (Kênh chính chủ đạt 272,1 Tr đ)'
        WHEN date_id = '2026-06-25' THEN 'Điểm tối ưu: Chỉ 45 phiên thu về 4,36 Tr đ/phiên (Gấp 5,8x)'
        WHEN date_id = '2026-09-04' THEN 'Đáy cuối vụ khi 43% khách Hà Nội ngừng mua đồ bơi'
    END AS benchmark_diagnosis
FROM kami_store_daily_overview
WHERE date_id IN ('2026-04-09', '2026-06-16', '2026-06-25', '2026-09-04')
ORDER BY date_id ASC;`,
    columns: [
      'date_id',
      'live_sessions_count',
      'units_sold',
      'total_daily_gmv_vnd',
      'gmv_per_live_session_vnd',
      'benchmark_diagnosis'
    ],
    rows: [
      ['2026-04-09', 106, 559, '79.455.237 đ', '749.578 đ/phiên', 'Bẫy số lượng: 106 phiên LIVE chỉ đạt ~750k/phiên'],
      ['2026-06-16', 91, 1936, '315.047.108 đ', '3.462.056 đ/phiên', 'Đỉnh lịch sử toàn shop (Kênh chính chủ đạt 272,1 Tr đ)'],
      ['2026-06-25', 45, 1172, '196.094.529 đ', '4.357.656 đ/phiên', 'Điểm tối ưu: Chỉ 45 phiên thu về 4,36 Tr đ/phiên (Gấp 5,8x)'],
      ['2026-09-04', 27, 49, '5.443.055 đ', '201.595 đ/phiên', 'Đáy cuối vụ khi 43% khách Hà Nội ngừng mua đồ bơi']
    ],
    analystInterpretation: {
      vi: 'Chứng minh quy luật hiệu suất cận biên giảm dần: Ngày 25/06 chỉ cần 45 phiên LIVE nhưng mang lại hiệu suất trên mỗi phiên cao gấp 5,8 lần ngày 09/04 (106 phiên).',
      en: 'Proves diminishing marginal returns: Jun 25 needed only 45 LIVE sessions to achieve 5.8x higher GMV per session than Apr 09 (106 sessions).'
    }
  },
  {
    id: 'sql-04-hero-sku-autumn-winter-pivot',
    badge: 'SKU MATRIX • AUTUMN PIVOT',
    title: {
      vi: '4. Truy Tìm Hero SKU Xoay Trục Thu – Đông (LEFT JOIN _product data & Creator Goods)',
      en: '4. Identifying Autumn/Winter Pivot Hero SKUs (LEFT JOIN _product data & Creator Goods)'
    },
    businessQuestion: {
      vi: 'Mã sản phẩm nào bán chạy số 1 toàn shop quanh năm nhưng kênh chính chủ mới khai thác tỷ trọng thấp, có thể đưa lên Ghim #1 sóng LIVE mùa Thu – Đông?',
      en: 'Which #1 volume SKU sells year-round across the shop but is under-utilized on the official channel, making it ideal for #1 LIVE pinning in Autumn/Winter?'
    },
    sqlQuery: `-- So sánh tỷ trọng tự gánh của Kênh chính chủ theo từng Hero SKU trong 90 ngày
SELECT 
    p.sku_code,
    p.product_name,
    p.category,
    p.price_vnd,
    p.units_sold AS shop_total_units,
    COALESCE(SUM(c.units_sold), 0) AS self_channel_units,
    ROUND(COALESCE(SUM(c.units_sold), 0) * 100.0 / p.units_sold, 2) AS self_reliance_pct,
    p.gmv_vnd AS shop_total_gmv_vnd
FROM kami_product_data_90d p
LEFT JOIN kami_creator_goods_90d c 
    ON p.product_id = c.product_id
WHERE p.sku_code IN ('H36', 'CV11', 'M18', 'H32')
GROUP BY p.product_id, p.sku_code, p.product_name, p.category, p.price_vnd, p.units_sold, p.gmv_vnd
ORDER BY p.gmv_vnd DESC;`,
    columns: ['sku_code', 'product_name', 'category', 'shop_total_units', 'self_channel_units', 'self_reliance_pct', 'shop_total_gmv_vnd'],
    rows: [
      ['H36', 'Set Bikini 2 Mảnh Kẻ Sọc (H36)', 'Sports & Outdoor', 4360, 2852, '65.41%', '824.024.829 đ'],
      ['CV11', 'Chân Váy Ngắn Form Chữ A Dáng Ôm (CV11)', 'Womenswear & Underwear', 6375, 1338, '20.99%', '735.067.229 đ'],
      ['M18', 'Bikini 1 Mảnh Bodysuit Đen & Xanh (M18)', 'Sports & Outdoor', 2307, 1313, '56.91%', '463.963.132 đ'],
      ['H32', 'Set Bikini 2 Mảnh Xanh Rêu (H32)', 'Sports & Outdoor', 2681, 1664, '62.07%', '390.995.921 đ']
    ],
    analystInterpretation: {
      vi: 'Mã Chân váy chữ A (CV11) đứng #1 toàn shop về sản lượng (6.375 SP) nhưng kênh chính chủ mới bán 20,99% (1.338 SP). Khi đưa CV11 lên Ghim #1 trong phiên LIVE chạy Ads 2,17M đ (ngày 28/03), riêng mã này đã chốt 130 đơn = 20,34 Tr đ (98,48% GMV phiên)!',
      en: 'A-Line Skirt (CV11) ranks #1 in shop volume (6,375 units) yet official channel sales account for only 20.99% (1,338 units). When pinned #1 in the 2.17M VND Ads LIVE session (Mar 28), CV11 alone generated 130 orders = 20.34M VND (98.48% of session GMV)!'
    }
  }
];
