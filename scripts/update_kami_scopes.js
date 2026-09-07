const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/data/kamiElyData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Insert KAMI_DATA_SCOPES right before FastMossScreenshotItem
const scopesCode = `
// ============================================================================
// DATA COLLECTION SCOPES & TIMEFRAMES DEFINITIONS
// Phân định chuẩn xác 2 nhóm dữ liệu và các chu kỳ thời gian thu thập
// ============================================================================
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
    periodVi: '18/08/2022 — Nay (~2 năm vận hành)',
    periodEn: 'Aug 18, 2022 — Present (~2 years operating)',
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
    periodVi: '09/03/2026 — 04/09/2026 (26 tuần liên tiếp)',
    periodEn: 'Mar 09, 2026 — Sep 04, 2026 (26 consecutive weeks)',
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
    screenshotIds: ['sc-073520', 'sc-073528', 'sc-073543', 'sc-073549', 'sc-073557', 'sc-073657', 'sc-073705', 'sc-073713', 'sc-074244', 'sc-075207']
  },
  {
    id: 'scope-creator-alltime',
    scope: 'creator',
    scopeLabelVi: 'Kênh Chính Chủ @kamielyhn',
    scopeLabelEn: 'Official Account @kamielyhn',
    timeframeVi: 'Tích lũy Toàn thời gian (Từ khi lập kênh)',
    timeframeEn: 'Lifetime Accumulated (Since Account Creation)',
    timeframeBadge: 'Toàn thời gian (Từ 28/05/2023)',
    periodVi: '28/05/2023 — Nay (Kể từ video đầu tiên)',
    periodEn: 'May 28, 2023 — Present (Since 1st Video)',
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
    periodVi: '09/03/2026 — 24/08/2026',
    periodEn: 'Mar 09, 2026 — Aug 24, 2026',
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
    screenshotIds: ['sc-080501', 'sc-080510', 'sc-080517', 'sc-080526', 'sc-080537', 'sc-080547', 'sc-080553', 'sc-080559', 'sc-080608', 'sc-080616', 'sc-080622', 'sc-080628', 'sc-080633', 'sc-080640']
  },
  {
    id: 'scope-creator-28d',
    scope: 'creator',
    scopeLabelVi: 'Kênh Chính Chủ @kamielyhn',
    scopeLabelEn: 'Official Account @kamielyhn',
    timeframeVi: 'Chu kỳ 28 Ngày & Hoạt động Vận hành',
    timeframeEn: '28-Day Operating Metrics & Cadence',
    timeframeBadge: '28 ngày gần nhất',
    periodVi: '28 ngày gần nhất (07/08 — 03/09/2026)',
    periodEn: 'Last 28 days (Aug 07 — Sep 03, 2026)',
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
    screenshotIds: ['sc-080014', 'sc-080705', 'sc-080726', 'sc-080749', 'sc-080800', 'sc-081026', 'sc-081041', 'sc-081121']
  }
];
`;

content = content.replace(
  '// Full Manifest of 36 FastMoss Screenshots for Proof Gallery & Verification Modal\nexport interface FastMossScreenshotItem {',
  `${scopesCode}\n// Full Manifest of 36 FastMoss Screenshots for Proof Gallery & Verification Modal\nexport interface FastMossScreenshotItem {`
);

// 2. Update FastMossScreenshotItem interface to add timeframe fields
content = content.replace(
  `  titleEn: string;
  descriptionVi: string;`,
  `  titleEn: string;
  timeframeVi?: string;
  timeframeEn?: string;
  isAllTime?: boolean;
  descriptionVi: string;`
);

// 3. Update Screenshot 073329 (Shop All-time)
content = content.replace(
  `    id: 'sc-073329',
    filename: 'Screenshot 2026-09-05 073329.png',
    src: '/kami/Screenshot 2026-09-05 073329.png',
    group: 'shop',
    sectionId: 'shop-overview',
    titleVi: 'Hồ Sơ Toàn Thời Gian & Xếp Hạng Shop',
    titleEn: 'Lifetime Profile & Store Rankings',
    descriptionVi: 'Tổng GMV 31,6 Tỷ đ, bán 238.4k SP, 179 SKU đang bán, Top #7.5k toàn quốc, Top #259 Thể thao & Dã ngoại, Đánh giá 3.9/5, Tỷ lệ phản hồi 98%.',
    descriptionEn: '31.6B VND GMV, 238.4k units sold, 179 active SKUs, #7.5k National Rank, #259 Sports & Outdoor, 3.9/5 Rating, 98% 24h response rate.',
    keyMetric: '31,6 Tỷ đ GMV · 238.4k SP'`,
  `    id: 'sc-073329',
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
    keyMetric: '31,6 Tỷ đ GMV · 238.4k SP (Toàn thời gian)'`
);

// 4. Update Screenshot 073418 (Shop 180d)
content = content.replace(
  `    id: 'sc-073418',
    filename: 'Screenshot 2026-09-05 073418.png',
    src: '/kami/Screenshot 2026-09-05 073418.png',
    group: 'shop',
    sectionId: 'shop-overview',
    titleVi: 'Xu Hướng Bán Hàng 180 Ngày Của Shop',
    titleEn: '180-Day Store Sales Trends',`,
  `    id: 'sc-073418',
    filename: 'Screenshot 2026-09-05 073418.png',
    src: '/kami/Screenshot 2026-09-05 073418.png',
    group: 'shop',
    sectionId: 'shop-overview',
    timeframeVi: '180 ngày gần nhất (09/03/2026 - 04/09/2026)',
    timeframeEn: 'Last 180 Days (2026-03-09 ~ 2026-09-04)',
    titleVi: 'Xu Hướng Bán Hàng 180 Ngày Của Toàn Shop',
    titleEn: '180-Day Store-Wide Sales Trends',`
);

// 5. Update Screenshot 074300 (Shop Live 180d)
content = content.replace(
  `    id: 'sc-074300',
    filename: 'Screenshot 2026-09-05 074300.png',
    src: '/kami/Screenshot 2026-09-05 074300.png',
    group: 'shop',
    sectionId: 'shop-live',
    titleVi: 'Phân Tích Toàn Bộ Livestream Của Shop (180 Ngày)',`,
  `    id: 'sc-074300',
    filename: 'Screenshot 2026-09-05 074300.png',
    src: '/kami/Screenshot 2026-09-05 074300.png',
    group: 'shop',
    sectionId: 'shop-live',
    timeframeVi: '180 ngày gần nhất (09/03/2026 - 04/09/2026)',
    timeframeEn: 'Last 180 Days (2026-03-09 ~ 2026-09-04)',
    titleVi: 'Phân Tích Toàn Bộ Livestream Của Shop (180 Ngày)',`
);

// 6. Update Screenshot 080014 (Creator 28d)
content = content.replace(
  `    id: 'sc-080014',
    filename: 'Screenshot 2026-09-05 080014.png',
    src: '/kami/Screenshot 2026-09-05 080014.png',
    group: 'creator',
    sectionId: 'creator-overview',
    titleVi: 'Hồ Sơ Creator Chính Chủ: Kami Ely (@kamielyhn)',`,
  `    id: 'sc-080014',
    filename: 'Screenshot 2026-09-05 080014.png',
    src: '/kami/Screenshot 2026-09-05 080014.png',
    group: 'creator',
    sectionId: 'creator-overview',
    timeframeVi: '28 ngày gần nhất & Hồ sơ KOC',
    timeframeEn: 'Last 28 Days & KOC Profile',
    titleVi: 'Hồ Sơ Creator Chính Chủ: Kami Ely (@kamielyhn)',`
);

// 7. Update Screenshot 080124 (Creator All-time)
content = content.replace(
  `    id: 'sc-080124',
    filename: 'Screenshot 2026-09-05 080124.png',
    src: '/kami/Screenshot 2026-09-05 080124.png',
    group: 'creator',
    sectionId: 'creator-overview',
    titleVi: 'Năng Lực Bán Hàng Cốt Lõi (Core Data Market Overview)',
    titleEn: 'Creator Core Commercial Capacity (Market Overview)',
    descriptionVi: 'GMV tích lũy 9,2 Tỷ đ (Video 3,2 Tỷ đ, LIVE 5,9 Tỷ đ), GPM video 135k đ, GPM LIVE 30k đ, 859 video (34.3M views), 2.5k phiên LIVE.',
    descriptionEn: '9.2B VND GMV (Video 3.2B, LIVE 5.9B), Video GPM 135k, LIVE GPM 30k, 859 videos (34.3M views), 2.5k LIVE sessions.',
    keyMetric: '9,2 Tỷ đ GMV Tích Lũy'`,
  `    id: 'sc-080124',
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
    keyMetric: '9,2 Tỷ đ GMV Tích Lũy Kênh'`
);

// 8. Add 90d timeframe to remaining shop screenshots if not set
const shop90dIds = ['sc-073520', 'sc-073528', 'sc-073543', 'sc-073549', 'sc-073557', 'sc-073657', 'sc-073705', 'sc-073713', 'sc-074244', 'sc-075207'];
shop90dIds.forEach(id => {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?sectionId: '[^']*',)([\\s\\S]*?titleVi:)`);
  content = content.replace(regex, `$1\n    timeframeVi: '90 ngày gần nhất',\n    timeframeEn: 'Last 90 Days',$2`);
});

// 9. Add 180d timeframe to creator 180d screenshots
const creator180dIds = ['sc-080501', 'sc-080510', 'sc-080517', 'sc-080526', 'sc-080537', 'sc-080547', 'sc-080553', 'sc-080559', 'sc-080608', 'sc-080616', 'sc-080622', 'sc-080628', 'sc-080633', 'sc-080640'];
creator180dIds.forEach(id => {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?sectionId: '[^']*',)([\\s\\S]*?titleVi:)`);
  content = content.replace(regex, `$1\n    timeframeVi: '180 ngày gần nhất (09/03 - 24/08)',\n    timeframeEn: 'Last 180 Days (Mar 09 - Aug 24)',$2`);
});

// 10. Add 28d / analytics timeframe to remaining creator screenshots
const creator28dIds = ['sc-080726', 'sc-080749'];
creator28dIds.forEach(id => {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?sectionId: '[^']*',)([\\s\\S]*?titleVi:)`);
  content = content.replace(regex, `$1\n    timeframeVi: '28 ngày gần nhất',\n    timeframeEn: 'Last 28 Days',$2`);
});

const creatorMisc = [
  { id: 'sc-080705', vi: 'Nhân khẩu học khán giả', en: 'Audience Demographics' },
  { id: 'sc-080800', vi: 'Phân tích hashtag & nội dung', en: 'Hashtag & Content Analytics' },
  { id: 'sc-081026', vi: 'Phân tích bán hàng E-commerce tổng thể', en: 'Overall E-commerce Sales' },
  { id: 'sc-081041', vi: 'Cơ cấu ngành hàng video', en: 'Video Category Analytics' },
  { id: 'sc-081121', vi: 'Top 5 cửa hàng hợp tác', en: 'Top 5 Collaborative Stores' }
];
creatorMisc.forEach(item => {
  const regex = new RegExp(`(id: '${item.id}',[\\s\\S]*?sectionId: '[^']*',)([\\s\\S]*?titleVi:)`);
  content = content.replace(regex, `$1\n    timeframeVi: '${item.vi}',\n    timeframeEn: '${item.en}',$2`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated all screenshot timeframes and added KAMI_DATA_SCOPES in kamiElyData.ts');
