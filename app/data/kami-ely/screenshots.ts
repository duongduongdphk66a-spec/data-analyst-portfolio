/**
 * Kami Ely Telemetry Proof & Screenshots Manifest
 */
export interface DataScopeItem {
  id: string;
  scope: 'shop' | 'creator';
  scopeLabelVi: string;
  scopeLabelEn: string;
  timeframeVi: string;
  timeframeEn: string;
  timeframeBadge: string;
  periodVi: string;
  periodEn: string;
  isAllTime: boolean;
  totalGmv: string;
  totalUnits: string;
  keyHighlightsVi: string[];
  keyHighlightsEn: string[];
  screenshotIds: string[];
}

export const KAMI_DATA_SCOPES: DataScopeItem[] = [
  {
    id: 'scope-shop-alltime',
    scope: 'shop',
    scopeLabelVi: 'Dữ liệu Toàn Shop',
    scopeLabelEn: 'Store-Wide Data',
    timeframeVi: 'Tích lũy Toàn thời gian (Từ khi thành lập shop)',
    timeframeEn: 'Lifetime Accumulated (Since Store Foundation)',
    timeframeBadge: 'Toàn thời gian (Từ 18/08/2022)',
    periodVi: '18/08/2022 - Nay (~2 năm vận hành)',
    periodEn: 'Aug 18, 2022 - Present (~2 years operating)',
    isAllTime: true,
    totalGmv: '31,6 Tỷ đ',
    totalUnits: '238.4k SP',
    keyHighlightsVi: [
      'Tổng sản lượng 238.4k sản phẩm và 31,6 Tỷ đ GMV toàn sàn TikTok Shop',
      'Tích lũy 12.4k phiên LIVE và 11.2k video gắn link giỏ hàng',
      'Mạng lưới 6.0k nhà sáng tạo (Affiliates) từng liên kết bán hàng',
      'Xếp hạng #7.5k toàn quốc và #259 ngành Thể thao & Dã ngoại (Sports & Outdoor)',
      'LƯU Ý QUAN TRỌNG: Đây là số liệu TÍCH LŨY TOÀN THỜI GIAN, không phải 180 ngày gần nhất'
    ],
    keyHighlightsEn: [
      'Total 238.4k units sold & 31.6B VND GMV on TikTok Shop platform',
      '12.4k total shoppable LIVEs & 11.2k shoppable videos published',
      '6.0k total affiliate creators historically linked with the store',
      'Ranked #7.5k nationally & #259 in Sports & Outdoor category',
      'CRITICAL NOTE: This represents LIFETIME data since inception, NOT last 180 days'
    ],
    screenshotIds: ['sc-073329']
  },
  {
    id: 'scope-shop-180d',
    scope: 'shop',
    scopeLabelVi: 'Dữ liệu Toàn Shop',
    scopeLabelEn: 'Store-Wide Data',
    timeframeVi: 'Chu kỳ 180 Ngày gần nhất',
    timeframeEn: 'Last 180 Days Window',
    timeframeBadge: '180 ngày (09/03 - 04/09)',
    periodVi: '09/03/2026 - 04/09/2026 (26 tuần liên tiếp)',
    periodEn: 'Mar 09, 2026 - Sep 04, 2026 (26 consecutive weeks)',
    isAllTime: false,
    totalGmv: '12,7 Tỷ đ',
    totalUnits: '85.5k SP',
    keyHighlightsVi: [
      '85.5k sản phẩm bán ra với 12,7 Tỷ đ GMV trong 180 ngày',
      '7.0k phiên LIVE diễn ra (đóng góp 9,3 Tỷ đ GMV và 67.2k sản phẩm)',
      '4.8k video gắn giỏ hàng được đăng tải trên toàn shop',
      '2.3k KOC đối tác tham gia bán hàng tích cực, tiêu thụ 169 mã SKU'
    ],
    keyHighlightsEn: [
      '85.5k units sold generating 12.7B VND GMV across 180 days',
      '7.0k LIVE sessions held (contributing 9.3B VND GMV & 67.2k units)',
      '4.8k shoppable videos published store-wide',
      '2.3k active affiliate KOCs promoting 169 distinct SKUs'
    ],
    screenshotIds: ['sc-073418', 'sc-074300']
  },
  {
    id: 'scope-shop-90d',
    scope: 'shop',
    scopeLabelVi: 'Dữ liệu Toàn Shop',
    scopeLabelEn: 'Store-Wide Data',
    timeframeVi: 'Chu kỳ 90 Ngày gần nhất',
    timeframeEn: 'Last 90 Days Window',
    timeframeBadge: '90 ngày gần nhất',
    periodVi: '90 ngày gần nhất (Tháng 6 - Tháng 9/2026)',
    periodEn: 'Last 90 days (June - September 2026)',
    isAllTime: false,
    totalGmv: '4,7 Tỷ đ (Affiliate) + 2,4 Tỷ đ (Video)',
    totalUnits: '31.6k SP (Affiliate) + 15.2k SP (Video)',
    keyHighlightsVi: [
      'Kênh tự vận hành dẫn đầu: chiếm 49.76% sản lượng và 49.30% doanh thu GMV',
      'Mạng lưới KOC Nano (1k-5k followers) tạo ra 52.67% GMV affiliate (2,5 Tỷ đ)',
      'Ngành Thể thao & Dã ngoại áp đảo 60.46% sản lượng và 66.48% GMV toàn shop',
      'Phân khúc giá >75k đ chiếm 94.95% sản lượng và 98.90% tổng doanh thu',
      'Video giỏ hàng 90 ngày đạt 15.2k sản phẩm, mang về 2,4 Tỷ đ GMV chuyển đổi tự nhiên'
    ],
    keyHighlightsEn: [
      'Self-operated account leads: 49.76% volume and 49.30% total GMV',
      'Nano KOC tier (1k-5k followers) drives 52.67% of affiliate GMV (2.5B VND)',
      'Sports & Outdoor dominates with 60.46% units sold and 66.48% shop GMV',
      'Price tier >75k VND accounts for 94.95% volume and 98.90% total revenue',
      'Shoppable videos generated 15.2k units and 2.4B VND organic GMV'
    ],
    screenshotIds: ['sc-073520', 'sc-073528', 'sc-073543', 'sc-073549', 'sc-073557', 'sc-073657', 'sc-073705', 'sc-073713']
  },
  {
    id: 'scope-creator-alltime',
    scope: 'creator',
    scopeLabelVi: 'Kênh Chính Chủ @kamielyhn',
    scopeLabelEn: 'Official Account @kamielyhn',
    timeframeVi: 'Tích lũy Toàn thời gian (Từ khi lập kênh)',
    timeframeEn: 'Lifetime Accumulated (Since Account Creation)',
    timeframeBadge: 'Toàn thời gian (Từ 28/05/2023)',
    periodVi: '28/05/2023 - Nay (Kể từ video đầu tiên)',
    periodEn: 'May 28, 2023 - Present (Since 1st Video)',
    isAllTime: true,
    totalGmv: '9,2 Tỷ đ',
    totalUnits: '69.9k SP (Bán tích lũy)',
    keyHighlightsVi: [
      'Tổng GMV tích lũy 9,2 Tỷ đ (Kênh Video đóng góp 3,2 Tỷ đ; Kênh LIVE đóng góp 5,9 Tỷ đ)',
      'Đã đăng 859 video (551 video có giỏ hàng, 308 video xây kênh) với 34.3 Triệu lượt xem',
      'Đã tổ chức 2.5k phiên livestream bán hàng (trung bình 2.4k lượt xem/phiên)',
      'Hiệu suất sinh lời (28 ngày): Video GPM đạt 134,8k - 135,2k đ vs Live GPM đạt 29,2k - 30,2k đ',
      'LƯU Ý QUAN TRỌNG: Đây là số liệu TÍCH LŨY TOÀN THỜI GIAN của kênh, không phải 180 ngày gần nhất'
    ],
    keyHighlightsEn: [
      'Total lifetime GMV 9.2B VND (Video 3.2B VND; LIVE 5.9B VND)',
      '859 videos published (551 shoppable, 308 branding) with 34.3M total views',
      '2.5k livestream sessions held (averaging 2.4k viewers/session)',
      'Commercial efficiency (28d): Video GPM 135k VND vs Live GPM 30k VND',
      'CRITICAL NOTE: This represents LIFETIME creator data, NOT last 180 days'
    ],
    screenshotIds: ['sc-080124']
  },
  {
    id: 'scope-creator-180d',
    scope: 'creator',
    scopeLabelVi: 'Kênh Chính Chủ @kamielyhn',
    scopeLabelEn: 'Official Account @kamielyhn',
    timeframeVi: 'Chu kỳ 180 Ngày gần nhất',
    timeframeEn: 'Last 180 Days Window',
    timeframeBadge: '180 ngày (09/03 - 24/08)',
    periodVi: '09/03/2026 - 24/08/2026',
    periodEn: 'Mar 09, 2026 - Aug 24, 2026',
    isAllTime: false,
    totalGmv: '5,8 Tỷ đ',
    totalUnits: '39.3k SP',
    keyHighlightsVi: [
      'Đóng góp 45.7% GMV (5,8 / 12,7 Tỷ đ) và 46.0% sản lượng (39.3k / 85.5k SP) của toàn shop',
      'LIVE là kênh chốt đơn chủ lực: 34.1k SP (86.8%) và 4,9 Tỷ đ GMV (84.5%)',
      'Video giữ vai trò nuôi dưỡng & tạo đơn tự nhiên: 5.1k SP và 872,2 Triệu đ GMV',
      'Thu hút +9.4k follower mới, đạt 6.6M lượt xem video, 18.8k likes, 4.8k saves, 4.7k shares'
    ],
    keyHighlightsEn: [
      'Drives 45.7% of store GMV (5.8 / 12.7B) & 46.0% of store units (39.3k / 85.5k)',
      'LIVE serves as core deal closer: 34.1k units (86.8%) & 4.9B VND GMV (84.5%)',
      'Shoppable videos provide organic momentum: 5.1k units & 872.2M VND GMV',
      'Gained +9.4k new followers, 6.6M video views, 18.8k likes, 4.8k saves, 4.7k shares'
    ],
    screenshotIds: ['sc-074300', 'sc-080501', 'sc-080510', 'sc-080517', 'sc-080526', 'sc-080537', 'sc-080547', 'sc-080553', 'sc-080559', 'sc-080608', 'sc-080616', 'sc-080622', 'sc-080628', 'sc-080633', 'sc-080640']
  },
  {
    id: 'scope-creator-28d',
    scope: 'creator',
    scopeLabelVi: 'Kênh Chính Chủ @kamielyhn',
    scopeLabelEn: 'Official Account @kamielyhn',
    timeframeVi: 'Chu kỳ 28 Ngày & Hoạt động Vận hành',
    timeframeEn: '28-Day Operating Metrics & Cadence',
    timeframeBadge: '28 ngày gần nhất',
    periodVi: '28 ngày gần nhất (07/08 - 03/09/2026)',
    periodEn: 'Last 28 days (Aug 07 - Sep 03, 2026)',
    isAllTime: false,
    totalGmv: 'GPM Video 135k đ vs LIVE 30k đ',
    totalUnits: '41 Video · 73 Phiên LIVE',
    keyHighlightsVi: [
      'Đăng tải 41 video mới và tổ chức 73 phiên LIVE trong 28 ngày gần nhất',
      'Đỉnh đăng video tập trung vào buổi sáng: 08:00 (8 video) và 11:00 (7 video)',
      'Khung giờ tương tác cao nhất của khán giả: 15:00 - 16:00 (0.74%) và 12:00 - 13:00 (0.71%)',
      'Khán giả mục tiêu: 73% Nữ, 60% từ 18-24 tuổi, 41% tại TP. Hồ Chí Minh',
      'Sự trung thành đối tác: 98.9% doanh số của Creator dồn cho shop Kami Ely (9,1 Tỷ đ GMV)'
    ],
    keyHighlightsEn: [
      '41 new videos published & 73 LIVE sessions hosted in last 28 days',
      'Video publishing peaks in morning: 08:00 (8 videos) & 11:00 (7 videos)',
      'Peak audience engagement windows: 15:00 - 16:00 (0.74%) & 12:00 - 13:00 (0.71%)',
      'Audience demographic: 73% Female, 60% aged 18-24, 41% in Ho Chi Minh City',
      'Store loyalty: 98.9% of creator revenue concentrated on Kami Ely store (9.1B VND)'
    ],
    screenshotIds: ['sc-074244', 'sc-075207', 'sc-080014', 'sc-080705', 'sc-080726', 'sc-080749', 'sc-080800', 'sc-081026', 'sc-081041', 'sc-081121']
  }
];

// Full Manifest of 36 Telemetry Screenshots for Proof Gallery & Verification Modal
export interface FastMossScreenshotItem {
  id: string;
  filename: string;
  src: string;
  group: 'shop' | 'creator';
  sectionId: string;
  titleVi: string;
  titleEn: string;
  timeframeVi?: string;
  timeframeEn?: string;
  isAllTime?: boolean;
  descriptionVi: string;
  descriptionEn: string;
  keyMetric: string;
  contextVi?: string;
  contextEn?: string;
  metrics?: string;
}

export const fastmossScreenshotsManifest: FastMossScreenshotItem[] = [
  // SHOP GROUP (10 screenshots: 073329 - 073713)
  {
    id: 'sc-073329',
    filename: 'Screenshot 2026-09-05 073329.png',
    src: '/kami/Screenshot 2026-09-05 073329.png',
    group: 'shop',
    sectionId: 'shop-overview',
    timeframeVi: 'Toàn thời gian (Từ khi thành lập shop 18/08/2022)',
    timeframeEn: 'Lifetime (Since Inclusion Date: Aug 18, 2022)',
    isAllTime: true,
    titleVi: 'Hồ Sơ Toàn Thời Gian & Xếp Hạng Toàn Shop (Từ 18/08/2022)',
    titleEn: 'Lifetime Profile & Store Rankings (Since Aug 18, 2022)',
    descriptionVi: 'DỮ LIỆU TÍCH LŨY TOÀN THỜI GIAN từ khi thành lập shop (18/08/2022, KHÔNG PHẢI 180 ngày). Tổng GMV 31,6 Tỷ đ, bán 238.4k SP, 179 SKU đang bán (338 SKU lịch sử), 12.4k phiên LIVE, 11.2k video, 6.0k affiliates.',
    descriptionEn: 'LIFETIME ACCUMULATED DATA since store inception (Aug 18, 2022, NOT last 180 days). 31.6B VND GMV, 238.4k units sold, 179 active SKUs (338 historical), 12.4k LIVEs, 11.2k videos, 6.0k affiliates.',
    keyMetric: '31,6 Tỷ đ GMV · 238.4k SP (Toàn thời gian)'
  },
  {
    id: 'sc-073418',
    filename: 'Screenshot 2026-09-05 073418.png',
    src: '/kami/Screenshot 2026-09-05 073418.png',
    group: 'shop',
    sectionId: 'shop-overview',
    timeframeVi: '180 ngày gần nhất (09/03/2026 - 04/09/2026)',
    timeframeEn: 'Last 180 Days (2026-03-09 ~ 2026-09-04)',
    titleVi: 'Xu Hướng Bán Hàng 180 Ngày Của Toàn Shop',
    titleEn: '180-Day Store-Wide Sales Trends',
    descriptionVi: 'Chu kỳ 180 ngày (09/03 - 04/09): 85.5k SP bán ra, 12,7 Tỷ đ GMV, 2.3k KOC đối tác, 7.0k phiên LIVE, 4.8k video gắn giỏ, 169 SKU bán chạy.',
    descriptionEn: '180-day cycle: 85.5k units, 12.7B VND GMV, 2.3k affiliates, 7.0k LIVE sessions, 4.8k shoppable videos, 169 SKUs sold.',
    keyMetric: '12,7 Tỷ đ GMV 180 Ngày'
  },
  {
    id: 'sc-073520',
    filename: 'Screenshot 2026-09-05 073520.png',
    src: '/kami/Screenshot 2026-09-05 073520.png',
    group: 'shop',
    sectionId: 'shop-sales',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Cơ Cấu Kênh Giao Dịch & Định Dạng (Theo Sản Lượng)',
    titleEn: 'Transaction Channel & Content Mix (By Units Sold)',
    descriptionVi: 'Kênh tự vận hành dẫn đầu 49.76%, KOC Affiliate 28.75%, Thẻ sản phẩm 21.49%. LIVE chiếm 59.01%, Thẻ SP 21.49%, Video 19.50%.',
    descriptionEn: 'Self-operated leads with 49.76%, Affiliates 28.75%, Product card 21.49%. LIVE accounts for 59.01%, Product card 21.49%, Video 19.50%.',
    keyMetric: 'Tự vận hành 49.76% SL'
  },
  {
    id: 'sc-073528',
    filename: 'Screenshot 2026-09-05 073528.png',
    src: '/kami/Screenshot 2026-09-05 073528.png',
    group: 'shop',
    sectionId: 'shop-sales',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Cơ Cấu Kênh Giao Dịch & Định Dạng (Theo Doanh Thu GMV)',
    titleEn: 'Transaction Channel & Content Mix (By GMV)',
    descriptionVi: 'Kênh tự vận hành mang về 49.30% GMV, Mạng lưới Affiliate 27.83%, Thẻ sản phẩm 22.87%. LIVE chiếm 55.93%, Thẻ SP 22.87%, Video 21.21%.',
    descriptionEn: 'Self-operated delivers 49.30% GMV, Affiliates 27.83%, Product card 22.87%. LIVE generates 55.93%, Product card 22.87%, Video 21.21%.',
    keyMetric: 'Tự vận hành 49.30% GMV'
  },
  {
    id: 'sc-073543',
    filename: 'Screenshot 2026-09-05 073543.png',
    src: '/kami/Screenshot 2026-09-05 073543.png',
    group: 'shop',
    sectionId: 'shop-products',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Phân Tích Sản Phẩm Theo Ngành Hàng & Mức Giá (Sản Lượng)',
    titleEn: 'Product Category & Price Tier (By Units Sold)',
    descriptionVi: 'Thể thao & Dã ngoại chiếm 60.46% lượng bán, Thời trang nữ 37.85%. Mức giá >75k đ chiếm áp đảo 94.95% sản lượng.',
    descriptionEn: 'Sports & Outdoor represents 60.46% volume, Womenswear 37.85%. Price >75k VND accounts for 94.95% of units.',
    keyMetric: 'Thể thao 60.46% · Giá >75k 94.95%'
  },
  {
    id: 'sc-073549',
    filename: 'Screenshot 2026-09-05 073549.png',
    src: '/kami/Screenshot 2026-09-05 073549.png',
    group: 'shop',
    sectionId: 'shop-products',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Phân Tích Sản Phẩm Theo Ngành Hàng & Mức Giá (Doanh Thu GMV)',
    titleEn: 'Product Category & Price Tier (By GMV)',
    descriptionVi: 'Thể thao & Dã ngoại mang lại 66.48% GMV, Thời trang nữ 33.22%. Phân khúc giá >75k đ chiếm tới 98.90% tổng doanh thu.',
    descriptionEn: 'Sports & Outdoor yields 66.48% GMV, Womenswear 33.22%. Price tier >75k VND contributes 98.90% of revenue.',
    keyMetric: 'Thể thao 66.48% GMV · Giá >75k 98.90%'
  },
  {
    id: 'sc-073557',
    filename: 'Screenshot 2026-09-05 073557.png',
    src: '/kami/Screenshot 2026-09-05 073557.png',
    group: 'shop',
    sectionId: 'shop-products',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Cơ Cấu Danh Mục SKU Theo Số Lượng Mã Sản Phẩm',
    titleEn: 'Product Catalog Breakdown (By Product Number)',
    descriptionVi: 'Thời trang nữ chiếm 46.75% số mã, Thể thao & Dã ngoại 39.35%, Phụ kiện 2.66%. 88.75% mã SKU có mức giá niêm yết trên 75k đ.',
    descriptionEn: 'Womenswear accounts for 46.75% SKUs, Sports & Outdoor 39.35%, Accessories 2.66%. 88.75% SKUs priced above 75k VND.',
    keyMetric: 'Thời trang nữ 46.75% mã SKU'
  },
  {
    id: 'sc-073657',
    filename: 'Screenshot 2026-09-05 073657.png',
    src: '/kami/Screenshot 2026-09-05 073657.png',
    group: 'shop',
    sectionId: 'shop-affiliates',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Mạng Lưới KOC Affiliate: Phân Bố Theo Follower & Ngành (Sản Lượng)',
    titleEn: 'Affiliate Network: Follower & Category Distribution (Units)',
    descriptionVi: '5.7k KOC tích lũy, bán 31.6k SP (90 ngày). Nhóm Nano (1k-5k followers) áp đảo 52.69% lượng bán, KOC Thời trang đóng góp 68.69%.',
    descriptionEn: '5.7k KOCs sold 31.6k units. Nano tier (1k-5k) dominates with 52.69% volume, Fashion KOCs deliver 68.69%.',
    keyMetric: 'KOC Nano 52.69% Sản Lượng'
  },
  {
    id: 'sc-073705',
    filename: 'Screenshot 2026-09-05 073705.png',
    src: '/kami/Screenshot 2026-09-05 073705.png',
    group: 'shop',
    sectionId: 'shop-affiliates',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Mạng Lưới KOC Affiliate: Doanh Thu GMV Theo Tệp Follower',
    titleEn: 'Affiliate Network: GMV Distribution by Follower Tier',
    descriptionVi: 'KOC Nano (1k-5k) mang về 2,5 Tỷ đ (52.67%), KOC <=1k mang về 2,1 Tỷ đ (43.42%), trong khi nhóm Macro >100k chỉ đóng góp 251 Tr đ (5.31%).',
    descriptionEn: 'Nano KOCs generate 2.5B VND (52.67%), <=1k delivers 2.1B (43.42%), while Macro >100k only contributes 251M (5.31%).',
    keyMetric: 'KOC Nano 2,5 Tỷ đ GMV (52.67%)'
  },
  {
    id: 'sc-073713',
    filename: 'Screenshot 2026-09-05 073713.png',
    src: '/kami/Screenshot 2026-09-05 073713.png',
    group: 'shop',
    sectionId: 'shop-affiliates',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Mạng Lưới KOC Affiliate: Số Lượng KOC Theo Tệp Follower',
    titleEn: 'Affiliate Network: KOC Headcount by Follower Tier',
    descriptionVi: 'Có 474 KOC Nano 1k-5k (48.17%), 191 KOC <=1k (19.38%), 145 KOC 10k-50k (14.76%), 99 KOC 5k-10k (10.12%), 38 KOC Macro >100k (3.9%).',
    descriptionEn: '474 Nano KOCs (48.17%), 191 <=1k (19.38%), 145 Micro (14.76%), 99 5k-10k (10.12%), 38 Macro >100k (3.9%).',
    keyMetric: '474 KOC Nano (48.17%)'
  },
  // CREATOR GROUP (26 screenshots: 074244, 074300, 075207, 080014 - 081121)
  {
    id: 'sc-074244',
    filename: 'Screenshot 2026-09-05 074244.png',
    src: '/kami/Screenshot 2026-09-05 074244.png',
    group: 'creator',
    sectionId: 'creator-collaborative',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Phân Tích Kênh Tự Vận Hành: Tài Khoản Chính Chủ @kamielyhn',
    titleEn: 'Self-Operated Account Analytics: Official @kamielyhn',
    descriptionVi: 'Độc quyền 1 tài khoản chính chủ @kamielyhn (48.7k followers) bán 20.0k SP, mang về 3,0 Tỷ đ GMV qua 147 video và 208 phiên LIVE.',
    descriptionEn: 'Exclusive single official account @kamielyhn (48.7k followers) sold 20.0k units, generating 3.0B VND GMV via 147 videos and 208 LIVEs.',
    keyMetric: '1 Kênh Tự Vận Hành: 3,0 Tỷ đ GMV'
  },
  {
    id: 'sc-074300',
    filename: 'Screenshot 2026-09-05 074300.png',
    src: '/kami/Screenshot 2026-09-05 074300.png',
    group: 'shop',
    sectionId: 'shop-live',
    timeframeVi: '180 ngày gần nhất (09/03/2026 - 04/09/2026)',
    timeframeEn: 'Last 180 Days (2026-03-09 ~ 2026-09-04)',
    titleVi: 'Phân Tích Toàn Bộ Livestream Của Shop (180 Ngày)',
    titleEn: 'Comprehensive Store-Wide LIVE Analytics (180 Days)',
    descriptionVi: '7.0k phiên LIVE toàn shop ghi nhận 67.2k SP bán ra, tổng 9,3 Tỷ đ GMV, trung bình 5.5k người xem và 1,3 Triệu đ doanh số mỗi phiên.',
    descriptionEn: '7.0k store-wide LIVE sessions achieved 67.2k units sold, 9.3B VND GMV, averaging 5.5k viewers and 1.3M VND per session.',
    keyMetric: '9,3 Tỷ đ GMV LIVE · 7.0k Phiên'
  },
  {
    id: 'sc-075207',
    filename: 'Screenshot 2026-09-05 075207.png',
    src: '/kami/Screenshot 2026-09-05 075207.png',
    group: 'creator',
    sectionId: 'creator-video',
    timeframeVi: '90 ngày gần nhất',
    timeframeEn: 'Last 90 Days',
    titleVi: 'Tổng Thể Video Gắn Giỏ Hàng Của Kênh (90 Ngày)',
    titleEn: 'Shoppable Video Analytics (90 Days)',
    descriptionVi: '15.2k sản phẩm bán trực tiếp qua video trong 90 ngày, tạo ra 2,4 Tỷ đ GMV chuyển đổi tự nhiên không phụ thuộc quảng cáo trả phí.',
    descriptionEn: '15.2k units sold directly via videos over 90 days, generating 2.4B VND organic GMV without paid ads.',
    keyMetric: '2,4 Tỷ đ GMV Video (90 Ngày)'
  },
  {
    id: 'sc-080014',
    filename: 'Screenshot 2026-09-05 080014.png',
    src: '/kami/Screenshot 2026-09-05 080014.png',
    group: 'creator',
    sectionId: 'creator-overview',
    timeframeVi: '28 ngày gần nhất & Hồ sơ KOC',
    timeframeEn: 'Last 28 Days & KOC Profile',
    titleVi: 'Hồ Sơ Creator Chính Chủ: Kami Ely (@kamielyhn)',
    titleEn: 'Official Creator Profile: Kami Ely (@kamielyhn)',
    descriptionVi: 'ID kamielyhn, 48.8k followers, Top #83.8k quốc gia, Top #8.6k ngành thời trang, Traffic Index 39, Ecom Index 67, 28 ngày: 41 video, 73 phiên LIVE.',
    descriptionEn: 'ID kamielyhn, 48.8k followers, #83.8k National rank, #8.6k Fashion rank, Traffic Index 39, Ecom Index 67, 28d: 41 videos, 73 LIVEs.',
    keyMetric: '48.8k Followers · Top #8.6k Ngành'
  },
  {
    id: 'sc-080124',
    filename: 'Screenshot 2026-09-05 080124.png',
    src: '/kami/Screenshot 2026-09-05 080124.png',
    group: 'creator',
    sectionId: 'creator-overview',
    timeframeVi: 'Toàn thời gian (Từ khi lập kênh 28/05/2023)',
    timeframeEn: 'Lifetime (Since Channel Creation: May 28, 2023)',
    isAllTime: true,
    titleVi: 'Năng Lực Bán Hàng Cốt Lõi Tích Lũy Toàn Thời Gian (Từ 28/05/2023)',
    titleEn: 'Lifetime Core Commercial Capacity (Since May 28, 2023)',
    descriptionVi: 'DỮ LIỆU TÍCH LŨY TOÀN THỜI GIAN từ khi thành lập kênh chính chủ (28/05/2023, KHÔNG PHẢI 180 ngày). GMV tích lũy 9,2 Tỷ đ (Video 3,2 Tỷ đ, LIVE 5,9 Tỷ đ), 859 video (34.3M views), 2.5k phiên LIVE. GPM tính trên 28 ngày: Video 134,8k - 135,2k đ vs LIVE 29,2k - 30,2k đ.',
    descriptionEn: 'LIFETIME ACCUMULATED DATA since channel inception (May 28, 2023, NOT last 180 days). 9.2B VND GMV (Video 3.2B, LIVE 5.9B), 859 videos (34.3M views), 2.5k LIVE sessions. GPM calculated on last 28 days: Video 135k vs LIVE 30k VND.',
    keyMetric: '9,2 Tỷ đ GMV Tích Lũy Kênh'
  },
  {
    id: 'sc-080501',
    filename: 'Screenshot 2026-09-05 080501.png',
    src: '/kami/Screenshot 2026-09-05 080501.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Tăng Trưởng Follower Creator 180 Ngày (+9.4k)',
    titleEn: 'Creator 180-Day Followers Gained Trend (+9.4k)',
    descriptionVi: 'Thu hút thêm +9.4k người theo dõi mới trong 180 ngày với đỉnh điểm bùng nổ xung quanh chiến dịch hè tháng 06/2026 (+290 followers/ngày).',
    descriptionEn: '+9.4k new followers gained in 180 days with a summer peak spike in June 2026 (+290 followers/day).',
    keyMetric: '+9.4k Followers Mới'
  },
  {
    id: 'sc-080510',
    filename: 'Screenshot 2026-09-05 080510.png',
    src: '/kami/Screenshot 2026-09-05 080510.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Lượt Xem Video Creator 180 Ngày (6.6M Views)',
    titleEn: 'Creator 180-Day Video Views Trend (6.6M Views)',
    descriptionVi: 'Đạt 6.6M lượt xem video trong 180 ngày, đỉnh cao viral đạt gần 500,000 lượt xem trong 1 ngày duy nhất vào tháng 08/2026.',
    descriptionEn: '6.6M video views in 180 days, with a viral high of ~500k views in a single day in August 2026.',
    keyMetric: '6.6M Lượt Xem Video'
  },
  {
    id: 'sc-080517',
    filename: 'Screenshot 2026-09-05 080517.png',
    src: '/kami/Screenshot 2026-09-05 080517.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Lượt Thích Video Creator 180 Ngày (18.8k Likes)',
    titleEn: 'Creator 180-Day Video Likes Trend (18.8k Likes)',
    descriptionVi: 'Tích lũy 18.8k lượt thích video trong chu kỳ 180 ngày, đỉnh điểm đạt gần 1,200 likes/ngày khi mở bán bộ sưu tập hè.',
    descriptionEn: '18.8k total video likes across 180 days, peaking at nearly 1,200 likes/day during summer collection launches.',
    keyMetric: '18.8k Lượt Thích'
  },
  {
    id: 'sc-080526',
    filename: 'Screenshot 2026-09-05 080526.png',
    src: '/kami/Screenshot 2026-09-05 080526.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Bình Luận Video Creator 180 Ngày (381 Comments)',
    titleEn: 'Creator 180-Day Video Comments Trend (381 Comments)',
    descriptionVi: '381 bình luận tương tác trực tiếp về tư vấn size, phối đồ bikini và mua sắm trên video trong 180 ngày.',
    descriptionEn: '381 user comments focusing on size consultation, outfit matching, and shopping inquiries in 180 days.',
    keyMetric: '381 Bình Luận Tương Tác'
  },
  {
    id: 'sc-080537',
    filename: 'Screenshot 2026-09-05 080537.png',
    src: '/kami/Screenshot 2026-09-05 080537.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Lưu Trữ / Yêu Thích Video 180 Ngày (4.8k Collections)',
    titleEn: 'Creator 180-Day Video Collections (4.8k Saves)',
    descriptionVi: '4.8k lượt lưu video vào danh sách yêu thích, phản ánh ý định mua sắm và lưu lại outfit đi biển cực cao của phái đẹp.',
    descriptionEn: '4.8k video saves, reflecting exceptionally high purchase intent and beach outfit bookmarking by female shoppers.',
    keyMetric: '4.8k Lượt Lưu Yêu Thích'
  },
  {
    id: 'sc-080547',
    filename: 'Screenshot 2026-09-05 080547.png',
    src: '/kami/Screenshot 2026-09-05 080547.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Chia Sẻ Video Creator 180 Ngày (4.7k Forwards)',
    titleEn: 'Creator 180-Day Video Forwards Trend (4.7k Shares)',
    descriptionVi: '4.7k lượt chia sẻ video cho bạn bè và hội nhóm, chứng minh sức hút viral tự nhiên (Organic Virality) của thương hiệu.',
    descriptionEn: '4.7k video forwards and shares to peers, highlighting strong organic viral word-of-mouth momentum.',
    keyMetric: '4.7k Lượt Chia Sẻ'
  },
  {
    id: 'sc-080553',
    filename: 'Screenshot 2026-09-05 080553.png',
    src: '/kami/Screenshot 2026-09-05 080553.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Tổng Sản Lượng E-commerce Của Creator (39.3k SP)',
    titleEn: 'Creator Total E-commerce Units Sold (39.3k Units)',
    descriptionVi: 'Creator chính chủ trực tiếp tạo ra 39.3k đơn hàng trong 180 ngày, chiếm 46.0% tổng sản lượng của toàn bộ shop Kami Ely (85.5k SP).',
    descriptionEn: 'The creator directly drove 39.3k units sold in 180 days, accounting for 46.0% of Kami Ely store total volume (85.5k).',
    keyMetric: '39.3k SP Bán Ra (180 Ngày)'
  },
  {
    id: 'sc-080559',
    filename: 'Screenshot 2026-09-05 080559.png',
    src: '/kami/Screenshot 2026-09-05 080559.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Tổng Doanh Thu GMV Của Creator 180 Ngày (5,8 Tỷ đ)',
    titleEn: 'Creator Total GMV 180-Day Telemetry (5.8B VND)',
    descriptionVi: 'Creator mang về 5,8 Tỷ đ GMV trong 180 ngày (chiếm 45.7% GMV toàn shop 12,7 Tỷ đ). Đỉnh điểm ngày bán hàng cao nhất tháng 06/2026 đạt ~175 Triệu đ/ngày.',
    descriptionEn: 'Creator generated 5.8B VND GMV in 180 days (45.7% of shop 12.7B GMV), peaking at ~175M VND/day on the single highest day in June 2026.',
    keyMetric: '5,8 Tỷ đ GMV Creator (180 Ngày)'
  },
  {
    id: 'sc-080608',
    filename: 'Screenshot 2026-09-05 080608.png',
    src: '/kami/Screenshot 2026-09-05 080608.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Sản Lượng Bán Qua Video Của Creator (5.1k SP)',
    titleEn: 'Creator Video Units Sold (5.1k Units)',
    descriptionVi: 'Video gắn giỏ hàng đóng góp 5.1k SP (13.0% sản lượng creator), giữ vai trò nuôi dưỡng và chuyển đổi khách hàng xem lại.',
    descriptionEn: 'Shoppable videos contributed 5.1k units (13.0% of creator volume), serving as consistent retargeting conversion.',
    keyMetric: '5.1k SP Bán Qua Video'
  },
  {
    id: 'sc-080616',
    filename: 'Screenshot 2026-09-05 080616.png',
    src: '/kami/Screenshot 2026-09-05 080616.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Doanh Thu GMV Qua Video Của Creator (872,2 Triệu đ)',
    titleEn: 'Creator Video GMV 180-Day Telemetry (872.2M VND)',
    descriptionVi: 'Doanh thu video đạt 872,2 Triệu đ (15.0% GMV creator), ghi nhận đỉnh doanh thu ngày gần 40 Triệu đ/video vào tháng 06/2026.',
    descriptionEn: 'Video revenue reached 872.2M VND (15.0% creator GMV), peaking at nearly 40M VND/day in June 2026.',
    keyMetric: '872,2 Triệu đ GMV Video'
  },
  {
    id: 'sc-080622',
    filename: 'Screenshot 2026-09-05 080622.png',
    src: '/kami/Screenshot 2026-09-05 080622.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Sản Lượng Bán Qua LIVE Của Creator (34.1k SP)',
    titleEn: 'Creator LIVE Units Sold (34.1k Units)',
    descriptionVi: 'Livestream là động cơ chốt đơn áp đảo tuyệt đối, mang lại 34.1k SP (86.8% tổng sản lượng của creator) trong 180 ngày.',
    descriptionEn: 'Livestream acts as the definitive sales closer, delivering 34.1k units (86.8% of creator total) in 180 days.',
    keyMetric: '34.1k SP Bán Qua LIVE (86.8%)'
  },
  {
    id: 'sc-080628',
    filename: 'Screenshot 2026-09-05 080628.png',
    src: '/kami/Screenshot 2026-09-05 080628.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Doanh Thu GMV Qua LIVE Của Creator (4,9 Tỷ đ)',
    titleEn: 'Creator LIVE GMV 180-Day Telemetry (4.9B VND)',
    descriptionVi: 'Kênh LIVE mang lại 4,9 Tỷ đ (84.5% GMV creator), chứng minh sức mạnh của các phiên marathon livestream bán hàng mùa hè.',
    descriptionEn: 'LIVE generated 4.9B VND (84.5% of creator GMV), highlighting the sheer impact of summer marathon live sales.',
    keyMetric: '4,9 Tỷ đ GMV LIVE (84.5%)'
  },
  {
    id: 'sc-080633',
    filename: 'Screenshot 2026-09-05 080633.png',
    src: '/kami/Screenshot 2026-09-05 080633.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Sản Lượng Thẻ Sản Phẩm/Showcase Của Creator (0 SP)',
    titleEn: 'Creator Featured Showcase Sales Units (0 Units)',
    descriptionVi: 'Doanh số thẻ sản phẩm chọn lọc ghi nhận bằng 0, cho thấy Creator dồn 100% tài nguyên thúc đẩy bán qua LIVE & Video.',
    descriptionEn: 'Showcase featured sales recorded zero, demonstrating 100% resource dedication to active LIVE and video conversions.',
    keyMetric: '0 SP Showcase'
  },
  {
    id: 'sc-080640',
    filename: 'Screenshot 2026-09-05 080640.png',
    src: '/kami/Screenshot 2026-09-05 080640.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',
    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',
    titleVi: 'Doanh Thu Thẻ Sản Phẩm/Showcase Của Creator (0 đ)',
    titleEn: 'Creator Featured Showcase Revenue (0 VND)',
    descriptionVi: 'Khẳng định chiến lược tập trung: Khách hàng mua hàng từ Creator thông qua tương tác trực quan thời gian thực chứ không mua thụ động.',
    descriptionEn: 'Confirms tactical strategy: Customers buy from this creator via live interactive visual demonstrations rather than passive browsing.',
    keyMetric: '0 đ Doanh Thu Showcase'
  },
  {
    id: 'sc-080705',
    filename: 'Screenshot 2026-09-05 080705.png',
    src: '/kami/Screenshot 2026-09-05 080705.png',
    group: 'creator',
    sectionId: 'creator-followers',
    timeframeVi: 'Nhân khẩu học khán giả',
    timeframeEn: 'Audience Demographics',
    titleVi: 'Nhân Khẩu Học Khán Giả: Giới Tính, Độ Tuổi & Tỉnh Thành',
    titleEn: 'Audience Demographics: Gender, Age & Geographic Distribution',
    descriptionVi: '73% Nữ, 60% độ tuổi 18 - 24, 31% độ tuổi 25 - 34 (91% Gen Z/Y trẻ). TP.HCM & Hà Nội đồng dẫn đầu 41%, Đồng Nai 6%, Hải Phòng 5%, Bình Dương 4%.',
    descriptionEn: '73% Female, 60% aged 18-24, 31% aged 25-34 (91% young Gen Z/Y). HCMC & Hanoi co-lead with 41% each, Dong Nai 6%, Hai Phong 5%.',
    keyMetric: '73% Nữ · 60% Tuổi 18-24 · 82% TP.HCM & Hà Nội'
  },
  {
    id: 'sc-080726',
    filename: 'Screenshot 2026-09-05 080726.png',
    src: '/kami/Screenshot 2026-09-05 080726.png',
    group: 'creator',
    sectionId: 'creator-activity',
    timeframeVi: '28 ngày gần nhất',
    timeframeEn: 'Last 28 Days',
    titleVi: 'Biểu Đồ Tần Suất Đăng Video Theo 24 Giờ Trong Ngày',
    titleEn: '24-Hour Video Posting Frequency Curve',
    descriptionVi: 'Thống kê 28 ngày: Tần suất đăng bài tập trung dồn dập vào buổi sáng với 2 đỉnh nhọn lúc 08:00 (8 video) và 11:00 (7 video).',
    descriptionEn: '28-day data: Posting activity heavily concentrates in the morning, peaking sharply at 08:00 (8 videos) and 11:00 (7 videos).',
    keyMetric: 'Đỉnh đăng 08:00 & 11:00'
  },
  {
    id: 'sc-080749',
    filename: 'Screenshot 2026-09-05 080749.png',
    src: '/kami/Screenshot 2026-09-05 080749.png',
    group: 'creator',
    sectionId: 'creator-activity',
    timeframeVi: '28 ngày gần nhất',
    timeframeEn: 'Last 28 Days',
    titleVi: 'Khung Giờ Tương Tác Cao & Phân Tích Thói Quen Hoạt Động',
    titleEn: 'High Engagement Windows & Active Posting Patterns',
    descriptionVi: 'Khung giờ tương tác cao nhất: 15:00-16:00 (0.74%), 12:00-13:00 (0.71%), 08:00-09:00 (0.66%). 54% video đăng trong khung 06:00-12:00.',
    descriptionEn: 'Peak engagement: 15:00-16:00 (0.74%), 12:00-13:00 (0.71%), 08:00-09:00 (0.66%). 54% posts published between 06:00-12:00.',
    keyMetric: 'Đỉnh tương tác 15:00-16:00 (0.74%)'
  },
  {
    id: 'sc-080800',
    filename: 'Screenshot 2026-09-05 080800.png',
    src: '/kami/Screenshot 2026-09-05 080800.png',
    group: 'creator',
    sectionId: 'creator-video',
    timeframeVi: 'Phân tích hashtag & nội dung',
    timeframeEn: 'Hashtag & Content Analytics',
    titleVi: 'Phân Tích Hashtag Video: WordCloud & Top 5 Thẻ Thịnh Hành',
    titleEn: 'Video Hashtag Analytics: Word Cloud & Top 5 Tags',
    descriptionVi: 'Hashtag thương hiệu #kamiely dẫn đầu 24.24%, tiếp theo là #bikini 20.71%, #summer 16.93%, #xuhuongtiktok 11.21%, #xuhuong 10.48%.',
    descriptionEn: 'Branded tag #kamiely leads with 24.24%, followed by #bikini 20.71%, #summer 16.93%, #xuhuongtiktok 11.21%, #xuhuong 10.48%.',
    keyMetric: '#kamiely 24.24% · #bikini 20.71%'
  },
  {
    id: 'sc-081026',
    filename: 'Screenshot 2026-09-05 081026.png',
    src: '/kami/Screenshot 2026-09-05 081026.png',
    group: 'creator',
    sectionId: 'creator-sales',
    timeframeVi: 'Phân tích bán hàng E-commerce tổng thể',
    timeframeEn: 'Overall E-commerce Sales',
    titleVi: 'Phân Tích Bán Hàng E-commerce Của Creator (Sales Analysis)',
    titleEn: 'Creator E-commerce Sales Analysis (Channel & Product Overview)',
    descriptionVi: '4 shop hợp tác, 394 SKU quảng bá, tổng 69.9k SP (Video 26.0k, LIVE 43.9k), GMV 9,2 Tỷ đ (Video 3,2 Tỷ, LIVE 5,9 Tỷ). Ngành Thể thao 65.98%.',
    descriptionEn: '4 shops, 394 SKUs, 69.9k units (Video 26k, LIVE 43.9k), 9.2B VND GMV (Video 3.2B, LIVE 5.9B). Sports & Outdoor 65.98%.',
    keyMetric: '69.9k SP · 9,2 Tỷ đ GMV Tổng'
  },
  {
    id: 'sc-081041',
    filename: 'Screenshot 2026-09-05 081041.png',
    src: '/kami/Screenshot 2026-09-05 081041.png',
    group: 'creator',
    sectionId: 'creator-video',
    timeframeVi: 'Cơ cấu ngành hàng video',
    timeframeEn: 'Video Category Analytics',
    titleVi: 'Cơ Cấu Ngành Bán Qua Video (Category Video Analytics)',
    titleEn: 'Creator Video Category Breakdown (Units & GMV)',
    descriptionVi: 'Kênh video của creator tập trung cực đoan vào Thể thao & Đồ bơi: chiếm 79.31% lượng bán và chiếm tới 98.33% tổng doanh thu GMV.',
    descriptionEn: 'Creator video channel intensely concentrates on Sports & Swimwear: 79.31% units sold and 98.33% of total video GMV.',
    keyMetric: 'Thể thao 98.33% GMV Video'
  },
  {
    id: 'sc-081121',
    filename: 'Screenshot 2026-09-05 081121.png',
    src: '/kami/Screenshot 2026-09-05 081121.png',
    group: 'creator',
    sectionId: 'creator-collaborative',
    timeframeVi: 'Top 5 cửa hàng hợp tác',
    timeframeEn: 'Top 5 Collaborative Stores',
    titleVi: 'Top 5 Cửa Hàng Hợp Tác: Sự Tập Trung Tuyệt Đối Vào Kami Ely',
    titleEn: 'Top 5 Collaborative Stores: Absolute Focus on Kami Ely',
    descriptionVi: 'Shop Kami Ely chiếm 9,1 Tỷ đ GMV (69.2k SP) - tương đương 98.9% toàn bộ doanh số của Creator. Havi Bikini chỉ chiếm 71,8 Tr đ, KamiBiii 6,2 Tr đ.',
    descriptionEn: 'Kami Ely shop accounts for 9.1B VND GMV (69.2k units) - representing 98.9% of creator revenue. Havi Bikini at 71.8M, KamiBiii at 6.2M.',
    keyMetric: 'Kami Ely chiếm 98.9% Doanh Số'
  }
];
