/**
 * Kami Ely Cross-Table Data Reconciliation & Attribution Windows
 * Đối soát sai lệch liên bảng giữa 8 tệp dữ liệu FastMoss & Seller Center
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
  reconciliationStatus: 'verified' | 'reconciled';
}

export const KAMI_RECONCILIATION_CASES: DataReconciliationCase[] = [
  {
    id: 'reconciliation-product-card-gap',
    badge: {
      vi: 'ĐỐI SOÁT SẢN PHẨM VS. CREATOR (90 NGÀY)',
      en: 'PRODUCT VS. CREATOR RECONCILIATION (90D)'
    },
    title: {
      vi: 'Giải Mã "Khoảng Trống 21,49%" Giữa Bảng Sản Phẩm & Bảng Nhà Sáng Tạo',
      en: 'Demystifying the 21.49% Volume Gap Between Product & Creator Datasets'
    },
    timeWindow: {
      vi: '90 ngày gần nhất (06/06/2026 – 04/09/2026)',
      en: 'Last 90 days (06/06/2026 – 04/09/2026)'
    },
    tablesInvolved: [
      '_ product data (90 ngày).xlsx',
      '_Creators_merged (90 ngày) .xlsx',
      'Screenshot 073520 (Kênh giao dịch)'
    ],
    observedPhenomenon: {
      vi: 'Trong 90 ngày, bảng _product data ghi nhận toàn shop bán 40.229 sản phẩm (6.136.205.973 VNĐ). Tuy nhiên, bảng _Creators_merged (gộp cả kênh chính chủ và 5.712 KOC) chỉ ghi nhận 31.599 sản phẩm (4.734.186.743 VNĐ), tạo ra độ lệch 8.630 sản phẩm và ~1,40 tỷ VNĐ.',
      en: 'Across 90 days, the _product data catalog records 40,229 units sold (6,136,205,973 VND). However, the _Creators_merged table (combining self-operated and 5,712 KOCs) accounts for only 31,599 units (4,734,186,743 VND), creating a discrepancy of 8,630 units and ~1.40B VND.'
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
        pct: '+21,45% sản lượng'
      }
    },
    dataDrivenExplanation: {
      vi: 'Khoảng chênh lệch 8.630 sản phẩm (~21,45% sản lượng) và ~1,40 tỷ VNĐ chính là doanh số đến từ Thẻ sản phẩm / Kệ hàng (Product Card Showcase). Dữ liệu đối chiếu hoàn hảo với Screenshot 073520 của FastMoss: kênh "Thẻ sản phẩm / Giỏ hàng" đóng góp chính xác 21,49% sản lượng và 22,87% GMV mà không đi qua bất kỳ đường link Creator hay phiên LIVE nào.',
      en: 'The variance of 8,630 units (~21.45% volume) and ~1.40B VND represents organic Showcase / Product Card sales. This reconciles 100% with FastMoss Screenshot 073520: Product Cards drive exactly 21.49% of store volume and 22.87% of GMV via Organic Search and Algorithm Recommendations without creator attribution.'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Không bao giờ đồng nhất "Doanh số Toàn Shop" với "Doanh số từ Creator/Affiliate". Thẻ sản phẩm là kênh bán thụ động cực kỳ quan trọng giúp giảm thiểu rủi ro phụ thuộc Creator.',
      en: 'Analytics Principle: Never equate "Store-Wide Sales" with "Creator/Affiliate Sales". The Product Card showcase is a crucial passive channel mitigating creator dependency risk.'
    },
    reconciliationStatus: 'verified'
  },
  {
    id: 'reconciliation-gross-vs-net-live',
    badge: {
      vi: 'ĐỐI SOÁT GROSS VS. NET REVENUE (180 NGÀY)',
      en: 'GROSS VS. NET REVENUE RECONCILIATION (180D)'
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
      'Kami Ely_Store Detail Page_Data Overview (180 ngày).xlsx',
      'TikTok Shop Seller Center 28d Overview'
    ],
    observedPhenomenon: {
      vi: "Cộng tổng 475 phiên trong file CSV Creator's Live Streaming đạt 7.023.530.158 VNĐ (49.817 sản phẩm). Tuy nhiên, bảng tổng hợp kênh Store Detail Page 180 ngày ghi nhận mảng LIVE chính chủ chỉ đóng góp 4,9 Tỉ VNĐ (470 phiên chuẩn hóa, 34.100 sản phẩm).",
      en: "Summing 475 detailed sessions from Creator's Live Streaming yields 7,023,530,158 VND (49,817 units). However, the Store Detail Page 180-day telemetry attributes 4.9B VND (470 normalized sessions, 34,100 units) to self-operated LIVE."
    },
    metricsComparison: {
      sourceA: {
        name: 'CSV 475 Phiên LIVE (Gross Session GMV)',
        value: '7,02 Tỉ đ (49.817 SP)'
      },
      sourceB: {
        name: 'Dashboard Kênh 180d (Net Recognized GMV)',
        value: '4,90 Tỉ đ (34.100 SP)'
      },
      variance: {
        label: 'Tỷ lệ Hủy/Hoàn & Đơn chưa thanh toán',
        value: '~2,12 Tỉ đ (15.717 SP)',
        pct: '-30,2% quy nạp ròng'
      }
    },
    dataDrivenExplanation: {
      vi: 'Đây là sự khác biệt kinh điển giữa Gross Order Value (tổng giá trị đặt hàng phát sinh trong phiên phát sóng) và Net Attributed GMV (doanh thu thực nhận sau khi trừ tỷ lệ hủy đơn, hoàn hàng và đơn COD không nhận sau 7–14 ngày đối soát). Cơ chế này khớp 100% với cảnh báo tại Seller Center 28 ngày: GMV tăng nóng +56,24% nhưng doanh thu thực tế chỉ tăng +36,29%.',
      en: 'This reflects the classic gap between in-session Gross Order Value and Net Attributed GMV after deductions for cancellations, returns, and failed COD deliveries across the 7-14 day settlement window. This mirrors the Seller Center 28-day anomaly: GMV surged +56.24% while net recognized revenue only grew +36.29%.'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Luôn phân định Gross GMV (đo lường sức hút phiên) và Net GMV (đo lường dòng tiền tài chính). Việc dùng Gross GMV để tính toán KPI nhân sự sẽ gây thổi phồng hiệu quả kinh doanh 30%.',
      en: 'Analytics Principle: Strictly decouple Gross GMV (session momentum) from Net GMV (financial cashflow). Measuring operational KPIs solely on Gross GMV inflates performance by ~30%.'
    },
    reconciliationStatus: 'verified'
  },
  {
    id: 'reconciliation-video-attribution-lag',
    badge: {
      vi: 'CỬA SỔ QUY NẠP & ĐỘ TRỄ CHUYỂN ĐỔI VIDEO',
      en: 'VIDEO ATTRIBUTION WINDOW & CONVERSION LAG'
    },
    title: {
      vi: 'Cửa Sổ Độ Trễ Chuyển Đổi (Attribution Lag) & Phễu Paid Ads Của Video Ngắn',
      en: 'Shoppable Video Conversion Lag & Paid Ads Leverage Attribution Window'
    },
    timeWindow: {
      vi: '180 ngày xuất bản video vs. 90 ngày cửa sổ theo dõi chuyển đổi',
      en: '180-day publishing window vs. 90-day conversion tracking window'
    },
    tablesInvolved: [
      '[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx',
      'Shoppable Video Ads Breakdown (3.482 Paid Ads vs. 935 Organic)',
      'Screenshot 075207 & 080124'
    ],
    observedPhenomenon: {
      vi: 'Tệp [Kami Ely]_Shoppable_Videos quét 4.417 video xuất bản trong 180 ngày, nhưng đo lường chuyển đổi đạt 13.083 sản phẩm (2.170.840.326 VNĐ) trong 90 ngày gần nhất. Trong đó 3.482 video gắn quảng cáo (Ads = YES) chiếm tới 94,70% GMV, trong khi 935 video tự nhiên (Ads = NO) chỉ đóng góp 5,30% GMV.',
      en: 'The [Kami Ely]_Shoppable_Videos catalog spans 4,417 videos published over 180 days, recording 13,083 units (2,170,840,326 VND) in the recent 90-day tracking window. 3,482 promoted videos (Ads = YES) generated 94.70% of GMV, while 935 organic videos (Ads = NO) accounted for only 5.30%.'
    },
    metricsComparison: {
      sourceA: {
        name: 'Paid Ads Video (3.482 video)',
        value: '2.055.758.301 đ (94,70% GMV)'
      },
      sourceB: {
        name: 'Organic Video (935 video)',
        value: '115.082.025 đ (5,30% GMV)'
      },
      variance: {
        label: 'Đòn bẩy Quảng cáo Trả phí (Ads Leverage)',
        value: '17,86x doanh số',
        pct: '94,76% sản lượng'
      }
    },
    dataDrivenExplanation: {
      vi: 'Không giống như Livestream chỉ phát sinh đơn khi phòng đang LIVE, Video ngắn có hiệu ứng phân phối đuôi dài (Long-tail Traffic). Việc gắn Shopping Ads (Spark Ads / Video Shopping Ads) giúp duy trì vòng đời video lên tới nhiều tuần sau ngày xuất bản, biến video thành cỗ máy tạo đơn thụ động với GPM đạt 135,2k VNĐ (cao gấp 4,5 lần so với LIVE).',
      en: 'Unlike Livestreams which only convert during active broadcasts, short shoppable videos possess long-tail attribution. Promoting winning creatives via Spark Ads / Video Shopping Ads sustains their distribution across multiple weeks, driving passive order flow at a superior 135.2k VND GPM (4.5x higher than LIVE).'
    },
    technicalTakeaway: {
      vi: 'Quy tắc Analytics: Phân tích Video Ecommerce bắt buộc phải bóc tách biến số Paid Ads vs. Organic. Một video đạt 100 triệu GMV nếu không kiểm tra gắn Ads thì không thể kết luận là do sáng tạo nội dung viral.',
      en: 'Analytics Principle: Short-form video analytics must separate Paid Ads vs. Organic attribution. Attributing a 100M VND video to creative virality without auditing Spark Ads tags leads to false attribution.'
    },
    reconciliationStatus: 'verified'
  }
];
