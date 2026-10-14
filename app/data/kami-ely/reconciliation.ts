/**
 * Kami Ely Cross-Table Data Reconciliation & Attribution Windows
 * Đối soát sai lệch liên bảng giữa 8 tệp dữ liệu FastMoss, Seller Center & Bằng chứng ảnh
 */

export interface DataReconciliationCase {
  id: string;
  badge: { vi: string; en: string };
  title: { vi: string; en: string };
  timeWindow: { vi: string; en: string };
  tablesInvolved: string[];
  observedPhenomenon: {
    vi: string;
    en: string;
  };
  metricsComparison: {
    sourceA: { name: string; value: string; rawValue?: number };
    sourceB: { name: string; value: string; rawValue?: number };
    variance: { label: string; value: string; pct?: string };
  };
  dataDrivenExplanation: {
    vi: string;
    en: string;
  };
  technicalTakeaway: {
    vi: string;
    en: string;
  };
  formula: string;
  sqlPresetId?: string;
  sqlJoinHint: string;
  reconciliationStatus: 'verified' | 'reconciled';
}

export const KAMI_RECONCILIATION_CASES: DataReconciliationCase[] = [
  {
    id: 'reconciliation-three-time-horizons',
    badge: {
      vi: '1. PHÂN TÁCH 3 TẦNG THỜI GIAN (ALL-TIME VS. 180D VS. 90D)',
      en: '1. THREE-TIER TIME-HORIZON AUDIT (ALL-TIME VS. 180D VS. 90D)'
    },
    title: {
      vi: 'Chuẩn Hóa Phạm Vi: Tích Lũy Lịch Sử (All-Time) vs. Chu Kỳ Mùa Vụ (180d) vs. Quy Nạp Kênh (90d)',
      en: 'Standardizing Time Horizons: Cumulative All-Time vs. 180d Seasonality vs. 90d Attribution'
    },
    timeWindow: {
      vi: 'All-Time (từ 18/08/2022) | 180 ngày (09/03 – 04/09/2026) | 90 ngày (06/06 – 04/09/2026)',
      en: 'All-Time (since 2022-08-18) | 180 Days (Mar 09 – Sep 04) | 90 Days (Jun 06 – Sep 04)'
    },
    tablesInvolved: [
      'FastMoss Overview Screenshot 073329 (Toàn Shop All-time)',
      'FastMoss Creator Profile Screenshot 080124 (Kênh Chính chủ All-time)',
      'Kami Ely_Store Detail Page_Data Overview (180 ngày).csv',
      '_shop LIVE (180 ngày) [Tập 1 & Tập 2]',
      '_ product data (90 ngày).xlsx'
    ],
    observedPhenomenon: {
      vi: 'Người đọc dễ nhầm lẫn giữa số liệu tích lũy toàn lịch sử từ ngày 18/08/2022 (31,6 Tỉ đ / 238,4k SP / 12,4k LIVEs toàn shop và 9,2 Tỉ đ / 2,5k LIVEs kênh chính chủ) với số liệu 180 ngày chuỗi thời gian thực tế (12,74 Tỉ đ / 85,5k SP / 7.046 LIVEs toàn shop và 5,8 Tỉ đ Net kênh chính chủ).',
      en: 'Readers often conflate all-time cumulative figures since 2022-08-18 (31.6B VND / 238.4k units / 12.4k LIVEs shop-wide, 9.2B VND / 2.5k LIVEs self-channel) with the actual 180-day seasonal time series (12.74B VND / 85.5k units / 7,046 LIVEs shop-wide, 5.8B VND Net self-channel).'
    },
    metricsComparison: {
      sourceA: {
        name: 'Toàn Shop All-Time (Ảnh 073329)',
        value: '31,6 Tỉ đ (238,4k SP | 12,4k LIVEs)'
      },
      sourceB: {
        name: 'Toàn Shop 180 Ngày (Chuỗi CSV)',
        value: '12,74 Tỉ đ (85,5k SP | 7.046 LIVEs)'
      },
      variance: {
        label: 'Cửa sổ Phân tích Mùa vụ 180 ngày',
        value: '12,74 Tỉ đ (~40,3% quy mô lịch sử)',
        pct: '35,9% sản lượng tích lũy'
      }
    },
    dataDrivenExplanation: {
      vi: 'Việc tách bạch 3 tầng thời gian là nguyên tắc sống còn trong Analytics: (1) All-Time (31,6 Tỉ đ) chứng minh năng lực nền tảng và thứ hạng ngành (#259); (2) 180 ngày (12,74 Tỉ đ) theo dõi chu kỳ bùng nổ mùa hè tháng 6 và suy giảm mùa thu tháng 9; (3) 90 ngày (6,14 Tỉ đ) là cửa sổ quy nạp chi tiết cấp SKU, KOC và chiến dịch quảng cáo.',
      en: 'Strictly decoupling 3 time horizons is fundamental: (1) All-Time (31.6B VND) proves domain authority and category rank (#259); (2) 180-day (12.74B VND) tracks the full summer boom and autumn cooldown; (3) 90-day (6.14B VND) serves as the granular attribution window for SKUs, creators, and ad sets.'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Luôn gắn Badge thời gian cố định (ALL-TIME, 180 NGÀY, 90 NGÀY) trên mọi thẻ KPI để loại bỏ hoàn toàn nhận thức sai lệch của ban điều hành và nhà tuyển dụng.',
      en: 'Analytics Principle: Pin explicit time-window badges (ALL-TIME, 180D, 90D) to every KPI card to prevent cognitive confusion among stakeholders.'
    },
    formula: 'Historical Inception (31,6B / 238k units) ➔ Seasonality Macro (12,74B / 85,5k units) ➔ Granular Attribution (6,14B / 40,2k units)',
    sqlPresetId: 'kami-channels',
    sqlJoinHint: 'SELECT "All-Time" AS horizon, 31600.0 AS gmv_m, 238400 AS units UNION ALL SELECT "180d Macro", 12735.1, 85500 UNION ALL SELECT "90d Attribution", 6136.2, 40229;',
    reconciliationStatus: 'verified'
  },
  {
    id: 'reconciliation-gross-vs-net-live',
    badge: {
      vi: '2. ĐỐI SOÁT GROSS VS. NET REVENUE (180 NGÀY)',
      en: '2. GROSS VS. NET REVENUE RECONCILIATION (180D)'
    },
    title: {
      vi: 'Đối Soát Doanh Thu Gộp Cấp Phiên (Gross GMV) vs. Doanh Thu Thuần Quy Nạp (Net Attributed GMV)',
      en: 'Reconciling Gross Session-Level GMV vs. Net Attributed Channel GMV'
    },
    timeWindow: {
      vi: '180 ngày (09/03/2026 – 04/09/2026)',
      en: '180 days (09/03/2026 – 04/09/2026)'
    },
    tablesInvolved: [
      "[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx",
      'Kami Ely_Store Detail Page_Data Overview (180 ngày).csv',
      'TikTok Shop Seller Center 28d Overview (Doanh thu gộp vs. thực nhận)'
    ],
    observedPhenomenon: {
      vi: 'Tổng cộng dồn 475 phiên LIVE chính chủ trong file CSV chi tiết đạt 7.023.530.158 VNĐ (49.817 SP), nhưng báo cáo 180 ngày chuẩn hóa chỉ ghi nhận 4,90 Tỉ VNĐ (34,1k SP qua 470 phiên; tổng kênh đạt 5,80 Tỉ VNĐ bao gồm Video).',
      en: 'Summing all 475 self-operated LIVE sessions in detailed CSV yields 7,023,530,158 VND (49,817 units), whereas normalized 180-day telemetry records 4.90B VND (34,100 units across 470 sessions; total channel reaches 5.80B VND including videos).'
    },
    metricsComparison: {
      sourceA: {
        name: 'CSV 475 Phiên LIVE (Gross Session GMV)',
        value: '7,02 Tỉ đ (49.817 SP)'
      },
      sourceB: {
        name: 'Dashboard Kênh 180d (Net Settled GMV)',
        value: '4,90 Tỉ đ (34.100 SP)'
      },
      variance: {
        label: 'Tỷ lệ Hủy/Hoàn & Đơn chưa thanh toán',
        value: '~2,12 Tỉ đ (15.717 SP)',
        pct: '-30,2% quy nạp ròng'
      }
    },
    dataDrivenExplanation: {
      vi: 'Khoảng chênh 2,12 Tỉ đ (-30,2%) phản ánh độ trễ thanh toán và tỷ lệ hủy đơn/hoàn hàng/bom hàng COD phát sinh sau 7–14 ngày đối soát. Cơ chế này tương đồng hoàn hảo với số liệu Seller Center 28 ngày: GMV đặt hàng tăng nóng +56,24% (1,35 Tỉ đ) nhưng Doanh thu gộp thực tế tăng +36,29% (1,40 Tỉ đ / 10.554 món bán ra, khớp 1,38 Tỉ đ 28 dòng đầu CSV).',
      en: 'The 2.12B VND gap (-30.2%) reflects post-broadcast cancellations, COD rejections, and settlement deductions across the 7-14 day reconciliation window. This matches Seller Center 28-day data: placed GMV surged +56.24% (1.35B VND) while recognized revenue grew +36.29% (1.40B VND across 10,554 units).'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Luôn phân định Gross GMV (đo lường sức hút phiên phát sóng) và Net Settled GMV (đo lường dòng tiền tài chính). Dùng Gross GMV để tính KPI nhân sự sẽ thổi phồng hiệu quả kinh doanh lên 30%.',
      en: 'Analytics Principle: Always decouple Gross GMV (session momentum) from Net Settled GMV (financial cashflow). Measuring operational KPIs solely on Gross GMV inflates performance by ~30%.'
    },
    formula: 'CSV 475 Sessions Gross (7,02B / 49,8k units) ➔ Normalized 470 Sessions Net (4,90B / 34,1k units) [Delta: -30,2%]',
    sqlPresetId: 'kami-live-fatigue',
    sqlJoinHint: 'SELECT COUNT(DISTINCT session_id) AS sessions, SUM(gross_gmv) AS gross, SUM(net_settled_gmv) AS net, ROUND((SUM(gross_gmv) - SUM(net_settled_gmv)) * 100.0 / SUM(gross_gmv), 2) AS cancellation_rate FROM tiktok_shop_livestreams;',
    reconciliationStatus: 'verified'
  },
  {
    id: 'reconciliation-product-card-gap',
    badge: {
      vi: '3. GIẢI MÃ KHOẢNG TRỐNG KỆ HÀNG (90 NGÀY)',
      en: '3. DEMYSTIFYING THE 22.85% PRODUCT CARD GAP (90D)'
    },
    title: {
      vi: 'Giải Mã "Khoảng Trống 22,85%" Giữa Bảng Danh Mục Sản Phẩm & Bảng Nhà Sáng Tạo',
      en: 'Reconciling the 22.85% Volume Gap Between Product Data and Creator Attribution'
    },
    timeWindow: {
      vi: '90 ngày gần nhất (06/06/2026 – 04/09/2026)',
      en: 'Last 90 days (06/06/2026 – 04/09/2026)'
    },
    tablesInvolved: [
      '_ product data (90 ngày).xlsx (331 SKUs)',
      '_Creators_merged (90 ngày).xlsx (5.713 Creators)',
      'FastMoss Screenshot 073520 (Cơ cấu Kênh giao dịch)'
    ],
    observedPhenomenon: {
      vi: 'Bảng _product data (90d) ghi nhận 40.229 sản phẩm bán ra (6.136.205.973 VNĐ). Tuy nhiên, bảng _Creators_merged (gộp kênh chính chủ 3,03 Tỉ đ + 5.712 KOC ngoài 1,71 Tỉ đ) chỉ đạt 31.599 sản phẩm (4.734.186.743 VNĐ), tạo độ lệch 8.630 sản phẩm và 1.402.019.230 VNĐ.',
      en: 'The _product data catalog records 40,229 units (6,136,205,973 VND). However, _Creators_merged (self-channel 3.03B VND + 5,712 KOCs 1.71B VND) totals only 31,599 units (4,734,186,743 VND), creating a discrepancy of 8,630 units and 1,402,019,230 VND.'
    },
    metricsComparison: {
      sourceA: {
        name: '_product data (Toàn bộ SKU shop)',
        value: '40.229 SP (6,14 Tỉ đ)'
      },
      sourceB: {
        name: '_Creators_merged (Chính chủ + 5.712 KOC)',
        value: '31.599 SP (4,73 Tỉ đ)'
      },
      variance: {
        label: 'Khoảng trống Thẻ sản phẩm / Kệ hàng',
        value: '+8.630 SP (~1,40 Tỉ đ)',
        pct: '22,85% GMV / 21,45% sản lượng'
      }
    },
    dataDrivenExplanation: {
      vi: 'Khoảng chênh lệch 1.402.019.230 VNĐ (22,85% GMV) và 8.630 SP (21,45% SP) khớp tuyệt đối với tỷ trọng Thẻ sản phẩm / Kệ hàng (Product Card Showcase: 22,87% GMV / 21,49% SP) trên ảnh 073520. Đây là các giao dịch tự nhiên từ Tìm kiếm thuật toán và Kệ hàng gian hàng mà không phát sinh qua bất kỳ link Creator nào.',
      en: 'The 1,402,019,230 VND (22.85% GMV) and 8,630 unit (21.45% volume) gap reconciles 100% with Product Card Showcase share (22.87% GMV / 21.49% volume) on Screenshot 073520. These are passive sales generated via Algorithmic Search and Shopping Mall shelves without creator attribution.'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Không bao giờ đồng nhất "Doanh số Toàn Shop" với "Doanh số Creator/Affiliate". Kênh Thẻ sản phẩm là trụ cột bán hàng thụ động biên lợi nhuận cao giúp giảm phụ thuộc KOC.',
      en: 'Analytics Principle: Never equate "Store-Wide Sales" with "Creator/Affiliate Sales". Product Card is a high-margin passive pillar mitigating creator dependency.'
    },
    formula: 'Store Catalog Units (40.229) − Creator Units (31.599) = Product Card Showcase (8.630 SP = 21,45% Units / 22,85% GMV)',
    sqlPresetId: 'kami-channels',
    sqlJoinHint: 'SELECT p.product_id, p.product_name, p.units_sold AS total_units, COALESCE(c.creator_units, 0) AS creator_units, p.units_sold - COALESCE(c.creator_units, 0) AS showcase_card_units FROM dim_products p LEFT JOIN (SELECT product_id, SUM(units_sold) AS creator_units FROM fact_creator_sales GROUP BY product_id) c USING (product_id);',
    reconciliationStatus: 'verified'
  },
  {
    id: 'reconciliation-video-ads-leverage',
    badge: {
      vi: '4. NGHỊCH LÝ GPM 4,5X & PHỤ THUỘC 94,7% PAID ADS',
      en: '4. 4.5X GPM PARADOX & 94.7% PAID ADS DEPENDENCY'
    },
    title: {
      vi: 'Giải Quyết Mâu Thuẫn "Video GPM Cao 4,5x" vs. "94,70% Doanh Thu Phụ Thuộc Vào Quảng Cáo Trả Phí"',
      en: 'Reconciling 4.5x Video GPM Superiority vs. 94.70% Paid Ads Dependency'
    },
    timeWindow: {
      vi: '180 ngày đăng tải vs. 90 ngày cửa sổ theo dõi chuyển đổi',
      en: '180-day publishing window vs. 90-day tracking window'
    },
    tablesInvolved: [
      '[Kami Ely]_Shoppable_Videos (180 ngày).xlsx (4.417 video)',
      'TikTok Shop Seller Center Video Performance (3.482 Paid vs. 935 Organic)',
      'Screenshot 075207 & 080124 (GPM Video 135,2k vs. LIVE 30,2k)'
    ],
    observedPhenomenon: {
      vi: 'Kênh chính chủ có GPM Video đạt 134,8k–135,2k đ/1.000 views (gấp 4,5 lần LIVE 29,2k–30,2k đ). Tuy nhiên, bảng Shoppable_Videos chỉ ra 94,70% GMV video (2,055 Tỉ đ / 3.482 video) đến từ Ads = YES, còn Organic (935 video) chỉ đạt 5,30% GMV (115,08 Tr đ).',
      en: 'Self-operated channel achieves 134.8k–135.2k VND Video GPM (4.5x higher than LIVE at 29.2k–30.2k VND). However, Shoppable_Videos shows 94.70% of video GMV (2.055B VND across 3,482 videos) relies on Ads = YES, while Organic (935 videos) generates only 5.30% (115.08M VND).'
    },
    metricsComparison: {
      sourceA: {
        name: 'Paid Ads Video (3.482 video, Ads = YES)',
        value: '2.055.758.301 đ (94,70% GMV)'
      },
      sourceB: {
        name: 'Organic Video (935 video, Ads = NO)',
        value: '115.082.025 đ (5,30% GMV)'
      },
      variance: {
        label: 'Đòn bẩy Quảng cáo Shopping Ads',
        value: '17,86x doanh số Organic',
        pct: '94,76% sản lượng video'
      }
    },
    dataDrivenExplanation: {
      vi: 'GPM Video vượt trội không phải hoàn toàn do nội dung tự nhiên viral, mà nhờ thuật toán nhắm chọn chính xác của Video Shopping Ads. Trong khi đó, hiệu suất Organic đang bị tắc nghẽn nghiêm trọng do lịch đăng 54% video vào buổi sáng (08:00–12:00, lệch với đỉnh tương tác 15:00–16:00 và 12:00–13:00) và kênh chính chủ bỏ quên 308/859 video chưa gắn giỏ hàng.',
      en: 'Superior Video GPM stems from targeted Video Shopping Ads algorithms rather than organic virality. Meanwhile, Organic efficiency is severely throttled because 54% of videos are published in the morning (08:00–12:00, missing the 15:00–16:00 and 12:00–13:00 audience peaks) and 308 of 859 videos lack shoppable product links.'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Luôn phân rã kênh Video thành 2 cụm Paid vs. Organic. Giải pháp chiến lược là gắn giỏ hàng cho 308 video còn lại và dời lịch đăng sang khung giờ vàng để nâng tỷ trọng Organic lên 20%–25%.',
      en: 'Analytics Principle: Always decompose short video performance into Paid vs. Organic. Commercializing the 308 dormant videos and shifting post times to golden hours can lift organic share to 20%–25%.'
    },
    formula: 'Shoppable Video GMV (2,17B) = Paid Ads (94,70% = 2,056B) + Organic (5,30% = 115M) [GPM: 135,2k vs. LIVE 30,2k]',
    sqlPresetId: 'kami-video-ads',
    sqlJoinHint: 'SELECT is_ads, COUNT(*) AS videos, SUM(views_k) AS views, SUM(gmv_million_vnd) AS gmv_m, ROUND(SUM(gmv_million_vnd) * 100.0 / 2170.8, 2) AS gmv_share_pct FROM tiktok_shop_videos GROUP BY is_ads;',
    reconciliationStatus: 'verified'
  }
];
