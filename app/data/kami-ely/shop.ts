/**
 * Kami Ely Shop Telemetry & Sales Analytics Data
 */
import { shopOverviewKPIs, shopWeeklyTrendData, shopTopSKUs, topAffiliatesList } from '@/app/lib/seedKamiData';

export const PALETTE = ['#9BE7FA', '#FFD14C', '#C8EEF7', '#FFE485', '#074553', '#E5B830'];

export { shopOverviewKPIs, shopWeeklyTrendData, shopTopSKUs, topAffiliatesList };

// PART 1: SHOP DATA (KAMI ELY OFFICIAL STORE)

// Transaction channel distribution (from Screenshot 073520 & 073528)
export const getShopChannelData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Self-operated account' : 'Kênh tự vận hành', value: 49.76 },
    { name: isEn ? 'E-commerce creators' : 'Mạng lưới Affiliate', value: 28.75 },
    { name: isEn ? 'Product Card / Showcase' : 'Thẻ sản phẩm / Giỏ hàng', value: 21.49 }
  ],
  gmv: [
    { name: isEn ? 'Self-operated account' : 'Kênh tự vận hành', value: 49.30 },
    { name: isEn ? 'E-commerce creators' : 'Mạng lưới Affiliate', value: 27.83 },
    { name: isEn ? 'Product Card / Showcase' : 'Thẻ sản phẩm / Giỏ hàng', value: 22.87 }
  ]
});

// Content distribution (from Screenshot 073520 & 073528)
export const getShopContentData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Livestream (LIVE)' : 'Livestream (LIVE)', value: 59.01 },
    { name: isEn ? 'Product Card' : 'Thẻ sản phẩm', value: 21.49 },
    { name: isEn ? 'Shoppable Video' : 'Video gắn giỏ hàng', value: 19.50 }
  ],
  gmv: [
    { name: isEn ? 'Livestream (LIVE)' : 'Livestream (LIVE)', value: 55.93 },
    { name: isEn ? 'Product Card' : 'Thẻ sản phẩm', value: 22.87 },
    { name: isEn ? 'Shoppable Video' : 'Video gắn giỏ hàng', value: 21.21 }
  ]
});

// Product category distribution (from Screenshot 073543, 073549 & 073557)
export const getShopCategoryData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Sports & Outdoor' : 'Thể thao & Dã ngoại', value: 60.46 },
    { name: isEn ? 'Womenswear & Underwear' : 'Thời trang nữ & Đồ lót', value: 37.85 },
    { name: isEn ? 'Fashion Accessories' : 'Phụ kiện thời trang', value: 1.80 }
  ],
  gmv: [
    { name: isEn ? 'Sports & Outdoor' : 'Thể thao & Dã ngoại', value: 66.48 },
    { name: isEn ? 'Womenswear & Underwear' : 'Thời trang nữ & Đồ lót', value: 33.22 },
    { name: isEn ? 'Fashion Accessories' : 'Phụ kiện thời trang', value: 0.31 }
  ],
  byCount: [
    { name: isEn ? 'Womenswear & Underwear' : 'Thời trang nữ & Đồ lót', value: 46.75 },
    { name: isEn ? 'Sports & Outdoor' : 'Thể thao & Dã ngoại', value: 39.35 },
    { name: isEn ? 'Fashion Accessories' : 'Phụ kiện thời trang', value: 2.66 },
    { name: isEn ? 'Menswear & Underwear' : 'Thời trang nam', value: 2.37 }
  ]
});

// Price Tier breakdown (from Screenshot 073543, 073549 & 073557)
export const shopPriceTierData = {
  units: [
    { range: '> 75.0k đ', value: 94.95, label: '94.95%' },
    { range: '60.0k - 75.0k đ', value: 0, label: '0% (-0.25%)' },
    { range: '45.0k - 60.0k đ', value: 4.11, label: '4.11%' },
    { range: '30.0k - 45.0k đ', value: 0.09, label: '0.09%' },
    { range: '15.0k - 30.0k đ', value: 1.11, label: '1.11%' },
    { range: '0 - 15.0k đ', value: 0, label: '0% (-0.01%)' }
  ],
  gmv: [
    { range: '> 75.0k đ', value: 98.90, label: '98.90%' },
    { range: '60.0k - 75.0k đ', value: 0, label: '0% (-0.32%)' },
    { range: '45.0k - 60.0k đ', value: 1.29, label: '1.29%' },
    { range: '30.0k - 45.0k đ', value: 0.03, label: '0.03%' },
    { range: '15.0k - 30.0k đ', value: 0.10, label: '0.10%' },
    { range: '0 - 15.0k đ', value: 0, label: '0%' }
  ],
  byCount: [
    { range: '> 75.0k đ', value: 88.75, label: '88.75% (159 SKU)' },
    { range: '60.0k - 75.0k đ', value: 2.89, label: '2.89% (5 SKU)' },
    { range: '45.0k - 60.0k đ', value: 4.50, label: '4.50% (8 SKU)' },
    { range: '30.0k - 45.0k đ', value: 2.25, label: '2.25% (4 SKU)' },
    { range: '15.0k - 30.0k đ', value: 1.29, label: '1.29% (2 SKU)' },
    { range: '0 - 15.0k đ', value: 0.32, label: '0.32% (1 SKU)' }
  ]
};

// Top 6 SKUs from _ product data (90 ngày).xlsx

// Affiliates stats & tiers (from Screenshot 073657, 073705, 073713)
export const affiliateOverview = {
  totalInfluencers: '5.7k',
  liveInfluencers: 234,
  videoInfluencers: '5.4k',
  last90dUnits: '31.6k',
  last90dGmv: '4,7 Tỷ đ',
  newInfluencers90d: 983
};

export const affiliateFollowerTiers = {
  units: [
    { tier: '<= 1k', value: 16.0, label: '16.0k SP (50.7%)' },
    { tier: '1k - 5k (Nano)', value: 16.6, label: '16.6k SP (52.7%)' },
    { tier: '5k - 10k', value: 2.0, label: '2.0k SP (6.6%)' },
    { tier: '10k - 50k (Micro)', value: 7.2, label: '7.2k SP (22.9%)' },
    { tier: '50k - 100k', value: 2.9, label: '2.9k SP (9.2%)' },
    { tier: '> 100k (Macro)', value: 1.8, label: '1.8k SP (5.8%)' }
  ],
  gmv: [
    { tier: '<= 1k', value: 2.1, label: '2,1 Tỷ đ (43.4%)' },
    { tier: '1k - 5k (Nano)', value: 2.5, label: '2,5 Tỷ đ (52.7%)' },
    { tier: '5k - 10k', value: 0.34, label: '341 Triệu đ (7.2%)' },
    { tier: '10k - 50k (Micro)', value: 1.0, label: '1,0 Tỷ đ (21.5%)' },
    { tier: '50k - 100k', value: 0.51, label: '508 Triệu đ (10.7%)' },
    { tier: '> 100k (Macro)', value: 0.25, label: '251 Triệu đ (5.3%)' }
  ],
  count: [
    { tier: '<= 1k', value: 191, label: '191 KOC (19.4%)' },
    { tier: '1k - 5k (Nano)', value: 474, label: '474 KOC (48.2%)' },
    { tier: '5k - 10k', value: 99, label: '99 KOC (10.1%)' },
    { tier: '10k - 50k (Micro)', value: 145, label: '145 KOC (14.8%)' },
    { tier: '50k - 100k', value: 34, label: '34 KOC (3.5%)' },
    { tier: '> 100k (Macro)', value: 38, label: '38 KOC (3.9%)' }
  ]
};

// Affiliate KOC category distribution (from Screenshot 073657, 073705, 073713)
export const shopAffiliateCategoryDistribution = {
  units: [
    { name: 'Clothing & Accessories', value: 68.69, label: '21.7k SP (68.69%)' },
    { name: 'Other', value: 25.51, label: '8.0k SP (25.51%)' },
    { name: 'Baby', value: 2.23, label: '705 SP (2.23%)' },
    { name: 'Personal Blog', value: 1.64, label: '518 SP (1.64%)' },
    { name: 'Beauty', value: 1.52, label: '480 SP (1.52%)' },
    { name: 'Health & Wellness', value: 0.41, label: '130 SP (0.41%)' }
  ],
  gmv: [
    { name: 'Clothing & Accessories', value: 66.08, label: '3,1 Tỷ đ (66.08%)' },
    { name: 'Other', value: 28.83, label: '1,3 Tỷ đ (28.83%)' },
    { name: 'Baby', value: 1.86, label: '88.0 Tr đ (1.86%)' },
    { name: 'Personal Blog', value: 1.61, label: '76.2 Tr đ (1.61%)' },
    { name: 'Beauty', value: 1.26, label: '59.6 Tr đ (1.26%)' },
    { name: 'Health & Wellness', value: 0.36, label: '17.0 Tr đ (0.36%)' }
  ],
  count: [
    { name: 'Other', value: 57.48, label: '566 KOC (57.48%)' },
    { name: 'Clothing & Accessories', value: 32.00, label: '315 KOC (32.00%)' },
    { name: 'Beauty', value: 4.62, label: '45 KOC (4.62%)' },
    { name: 'Personal Blog', value: 2.29, label: '23 KOC (2.29%)' },
    { name: 'Shopping & Retail', value: 2.19, label: '22 KOC (2.19%)' },
    { name: 'Home & Furniture', value: 1.42, label: '14 KOC (1.42%)' }
  ]
};

// Top 3rd-party Affiliates (from _Creators_merged (90 ngày) .xlsx)

// Shop LIVE Analytics (from Screenshot 074300 & _shop LIVE (180 ngày) 1.xlsx)
export const shopLiveKPIs = {
  sessions: '7.0k',
  unitsSold: '67.2k',
  totalGmv: '9,3 Tỷ đ',
  avgViewers: '5.5k',
  avgUnitsPerSession: 10,
  avgGmvPerSession: '1,3 Triệu đ',
  affiliateLiveRatio: '93.3% (6.576 phiên)',
  shopLiveRatio: '6.7% (470 phiên)'
};

export const topShopLiveSessions = [
  {
    title: 'Sale KamiELy (Mega Marathon 16.9h)',
    creator: 'Kami Ely',
    type: 'Shop LIVE',
    duration: '16.9h',
    viewers: 25535,
    units: 1850,
    gmv: 272.1,
    startTime: '16/06 20:08'
  },
  {
    title: 'Chào mừng bạn đến với phiên LIVE của tôi',
    creator: 'Kami Ely',
    type: 'Shop LIVE',
    duration: '18.3h',
    viewers: 32166,
    units: 1795,
    gmv: 245.3,
    startTime: '05/06 20:44'
  },
  {
    title: 'Sale KamiEly (Mega Deal hè bùng nổ)',
    creator: 'Kami Ely',
    type: 'Shop LIVE',
    duration: '16.4h',
    viewers: 23096,
    units: 1495,
    gmv: 216.8,
    startTime: '12/06 20:29'
  },
  {
    title: 'Phiên LIVE đêm bùng nổ đơn hàng',
    creator: 'Kami Ely',
    type: 'Shop LIVE',
    duration: '14.0h',
    viewers: 19090,
    units: 1432,
    gmv: 214.1,
    startTime: '17/06 23:01'
  },
  {
    title: 'Chào mừng bạn đến với phiên LIVE Kami',
    creator: 'Kami Ely',
    type: 'Shop LIVE',
    duration: '11.0h',
    viewers: 27389,
    units: 1519,
    gmv: 209.6,
    startTime: '08/06 02:01'
  }
];

// Shop Video Analytics (from Screenshot 075207 & [Kami Ely]_Shoppable_Videos (180 ngày) .xlsx)
export const shopVideoKPIs = {
  totalShoppableVideos: '11.2k',
  units90d: '15.2k',
  gmv90d: '2,4 Tỷ đ',
  paidAdsShare: '94.7%', // Reconciled with shoppableVideoAdsBreakdown
  organicShare: '5.3%'
};

export const topShoppableVideos = [
  {
    title: 'KamiEly_ Chính Thức Mở Bán_ Thiết kế croptop yếm buộc dây tôn dáng...',
    creator: 'Kami Ely',
    views: '529.0k',
    likes: '892',
    units: 856,
    gmv: 170.2,
    ads: 'NO (Organic)'
  },
  {
    title: 'Set bikini phối caro retro vintage tôn dáng mặc đi biển hè 2026',
    creator: 'Vẫn là Lê Na',
    views: '513.3k',
    likes: '1.2k',
    units: 390,
    gmv: 75.3,
    ads: 'NO (Organic)'
  },
  {
    title: '️Đi biển thì mặc gì? Gợi ý outfit cực xinh cho nàng',
    creator: 'Nước lọc 7 mào',
    views: '465.3k',
    likes: '950',
    units: 299,
    gmv: 55.9,
    ads: 'NO (Organic)'
  },
  {
    title: 'Đồ bơi liền mảnh kín đáo che khuyết điểm bụng cực đỉnh',
    creator: 'Thuỵ Du Closet',
    views: '308.9k',
    likes: '640',
    units: 187,
    gmv: 45.7,
    ads: 'NO (Organic)'
  },
  {
    title: 'Hot-Hit Bikini: Set bikini 2 mảnh bán chạy nhất tuần này',
    creator: 'Kami Ely',
    views: '149.9k',
    likes: '682',
    units: 262,
    gmv: 42.9,
    ads: 'NO (Organic)'
  }
];

// Shop Self-Operated Accounts Analytics (from Screenshot 074244)
export const shopSelfOperatedAccount = {
  accountName: 'Kami Ely',
  creatorName: 'Kami Ely',
  accountId: 'kamielyhn',
  handle: '@kamielyhn',
  bindingDate: '02/02/2024',
  accountCount: 1,
  followers: '48.7k',
  unitsSold90d: '20.0k',
  unitsSold: '20.0k SP',
  unitsShareOfShop: '49.76%', // Matching Screenshot 073520 Self-operated account share
  unitsShare: '49.76%',
  gmv90d: '3,0 Tỷ đ',
  gmv: '3,0 Tỷ đ',
  gmvShareOfShop: '49.30%', // Matching Screenshot 073528 Self-operated account share
  gmvShare: '49.30%',
  videosCount: 147,
  avgViewsPerVideo: '16.4k',
  livesCount: 208,
  liveSessionsCount: 208,
  avgViewersPerLive: '5.4k',
  avgUnitsSoldPerVideo: 0,
  avgLiveSales: 0,
  relationType: 'Shop-Linked Official Account (Tài khoản liên kết chính thức duy nhất)',
  strategicInsightVi: 'Kênh tự vận hành độc quyền @kamielyhn đóng vai trò "cỗ máy doanh thu" chủ lực, gánh gần 50% tổng doanh số và sản lượng của toàn bộ shop (3,0 Tỷ đ / 90 ngày) mà không phải chịu chi phí hoa hồng affiliate ngoại.',
  strategicInsightEn: 'The single self-operated channel @kamielyhn serves as the primary revenue engine, contributing ~50% of the entire store GMV (3.0B VND / 90 days) free from third-party affiliate commission margins.'
};

// BỔ SUNG DỮ LIỆU TIKTOK SHOP SELLER CENTER (1ST-PARTY DATA) & ĐỐI SOÁT CSV
// Tệp đích: app/data/kami-ely/shop.ts

export interface SellerCenterMetricItem {
  id: string;
  label: { vi: string; en: string };
  value: string;
  rawValue: number;
  unit: string;
  growthPct?: number;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
  insight: { vi: string; en: string };
}

export interface ShoppingTabTrafficSource {
  sourceName: { vi: string; en: string };
  pageViews?: string;
  gmv: string;
  rawGmv: number;
  sharePct: number;
  intentLevel: 'High' | 'Low-Mid' | 'Paid/External';
  note: { vi: string; en: string };
}

export interface HighPotentialProductCard {
  id: string;
  productName: { vi: string; en: string };
  category: string;
  weeklyViews: string;
  gmv7d?: string;
  currentCvr: string;
  targetCvr: string;
  expectedMultiplier: string;
  bottleneck: { vi: string; en: string };
  actionPlan: { vi: string; en: string };
}

export interface CollaborativeStoreItem {
  rank: number;
  shopName: string;
  category: string;
  shopTotalUnitsSold: string;
  affiliatedProducts: number;
  bestSellingProduct: string;
  bestSellingUnits: string;
  channelUnitsSold: string;
  channelGmv: string;
}

export const synchronizedShopTelemetryLabels = {
  overviewWindow: {
    vi: 'Chu kỳ 28 ngày thuộc phạm vi bảng dữ liệu 180 ngày (09/03/2026 – 04/09/2026)',
    en: '28-day cycle within the 180-day dataset scope (09/03/2026 – 04/09/2026)'
  },
  productCardWindow: {
    vi: 'Dữ liệu Thẻ sản phẩm đồng bộ với bảng _product data (90 ngày gần nhất)',
    en: 'Product Card telemetry synchronized with _product data (Last 90 days)'
  }
};

export const sellerCenterShopData = {
  // 1. Tổng quan hiệu suất 28 ngày (Chu kỳ thuộc phạm vi bảng 180 ngày: 09/03/2026 – 04/09/2026)
  overview28d: {
    period: '24/02/2026 – 23/03/2026 (Chu kỳ 28 ngày thuộc phạm vi 180 ngày)',
    periodLabel: synchronizedShopTelemetryLabels.overviewWindow,
    metrics: [
      {
        id: 'sc-gmv-28d',
        label: { vi: 'GMV (Tổng giá trị hàng hóa)', en: 'Gross Merchandise Value (GMV)' },
        value: '1,35 tỷ đ',
        rawValue: 1350000000,
        unit: 'VNĐ',
        growthPct: 56.24,
        status: 'positive',
        insight: {
          vi: 'Tăng trưởng nóng (+56,24% so với 28 ngày trước), nhu cầu đặt đơn mới đầu mùa rất lớn.',
          en: 'Rapid growth (+56.24% MoM), indicating strong early-season order demand.'
        }
      },
      {
        id: 'sc-rev-28d',
        label: { vi: 'Tổng doanh thu thực nhận', en: 'Total Recognized Revenue' },
        value: '1,40 tỷ đ',
        rawValue: 1400000000,
        unit: 'VNĐ',
        growthPct: 36.29,
        status: 'warning',
        insight: {
          vi: 'Tốc độ tăng doanh thu (+36,29%) thấp hơn tốc độ tăng GMV (+56,24%), cảnh báo tỷ lệ đơn hủy/hoàn hoặc chưa thanh toán tăng.',
          en: 'Revenue growth (+36.29%) lags behind GMV growth (+56.24%), signaling rising cancellation/return or unpaid order rates.'
        }
      },
      {
        id: 'sc-units-28d',
        label: { vi: 'Số món bán ra (28 ngày)', en: 'Items Sold (28 Days)' },
        value: '10.554',
        rawValue: 10554,
        unit: 'món',
        growthPct: 40.31,
        status: 'positive',
        insight: {
          vi: 'Sản lượng tăng +40,31% với AOV 28 ngày duy trì ổn định ở mức ~127.900 đ/món.',
          en: 'Volume grew +40.31% with 28-day AOV remaining stable at ~127,900 VND/item.'
        }
      }
    ] as SellerCenterMetricItem[],

    // Snapshot vận hành trong ngày (tính đến 13:12)
    intradaySnapshot: {
      timestamp: '13:12',
      gmvToday: '17,37M đ',
      rawGmvToday: 17370000,
      unitsToday: 135,
      buyersToday: 122,
      visitorsToday: 7250,
      aovToday: 128600,
      aov28dAvg: 127900,
      conversionRatePct: 1.68,
      benchmarkCrPct: '2,0% – 3,0%',
      diagnosis: {
        vi: 'Lượt truy cập đạt 7.250 lượt với 122 người mua (CR = 1,68%). Phân khúc giá ổn định (~128,6k đ) nhưng cần rà soát tình trạng đứt size/hết kho (out of stock) để nâng CR lên ngưỡng 2–3%.',
        en: '7,250 visits yielded 122 buyers (1.68% CR). Price positioning is stable (~128.6k VND), but stockout checks are required to lift CR toward the 2–3% top-shop benchmark.'
      }
    }
  },

  // 2. Chẩn đoán Thẻ sản phẩm / Kệ hàng (Shopping Tab - Đồng bộ bảng 90 ngày)
  shoppingTabDiagnostics: {
    period: '90 ngày gần nhất (Đồng bộ bảng _product data)',
    periodLabel: synchronizedShopTelemetryLabels.productCardWindow,
    summaryMetrics: [
      {
        id: 'card-viewers-28d',
        label: { vi: 'Người xem Thẻ sản phẩm', en: 'Product Card Viewers' },
        value: '1,17 Triệu',
        rawValue: 1170000,
        unit: 'lượt xem',
        growthPct: 34.46,
        status: 'positive',
        insight: {
          vi: 'Tăng 34,46% — sản phẩm được thuật toán TikTok đề xuất rất tốt và SEO từ khóa hiệu quả.',
          en: 'Up 34.46% — strong algorithmic recommendation and effective keyword SEO.'
        }
      },
      {
        id: 'card-gmv-28d',
        label: { vi: 'GMV Thẻ sản phẩm', en: 'Product Card GMV' },
        value: '442,3 Triệu đ',
        rawValue: 442300000,
        unit: 'VNĐ',
        growthPct: -11.93,
        status: 'warning',
        insight: {
          vi: 'Giảm 11,93% bất chấp lượng người xem tăng mạnh do nghẽn ở bước chuyển đổi thanh toán (giảm 38%).',
          en: 'Down 11.93% despite surging traffic due to checkout conversion drop-offs (-38%).'
        }
      },
      {
        id: 'card-cvr-28d',
        label: { vi: 'Tỷ lệ chuyển đổi Kệ hàng (CVR)', en: 'Product Card CVR' },
        value: '0,25%',
        rawValue: 0.25,
        unit: '%',
        growthPct: -38.4,
        status: 'critical',
        insight: {
          vi: 'Báo động đỏ: Giảm 38,4% (chỉ vượt qua 10% người bán khác). Trung bình 400 người xem mới có 1 người mua.',
          en: 'Red alert: Down 38.4% (outperforming only 10% of peers). Only 1 in 400 viewers completes a purchase.'
        }
      }
    ] as SellerCenterMetricItem[],

    trafficSources: [
      {
        sourceName: { vi: 'Nguồn Khác (Shopping Ads / Link ngoại sàn / Affiliate)', en: 'Other Sources (Shopping Ads / External / Affiliate)' },
        gmv: '192,0 triệu đ',
        rawGmv: 192000000,
        sharePct: 44.5,
        intentLevel: 'Paid/External',
        note: {
          vi: 'Đóng góp gần 45% doanh thu thẻ sản phẩm nhờ luồng quảng cáo Shopping Ads và link Affiliate đổ về.',
          en: 'Contributes nearly 45% of card GMV driven by Shopping Ads and external Affiliate links.'
        }
      },
      {
        sourceName: { vi: 'Tìm kiếm chủ động (Search)', en: 'Organic Search' },
        gmv: '74,6 triệu đ',
        rawGmv: 74600000,
        sharePct: 17.3,
        intentLevel: 'High',
        note: {
          vi: 'Nhóm khách hàng chủ động gõ từ khóa (chiếm 43% lượng tìm kiếm toàn shop), có ý định mua cao nhất.',
          en: 'High-intent shoppers actively searching keywords (accounting for 43% of shop search discovery).'
        }
      },
      {
        sourceName: { vi: 'Đề xuất của TikTok (Recommendations)', en: 'TikTok Recommendations' },
        pageViews: '1,71 triệu PV',
        gmv: '58,0 triệu đ',
        rawGmv: 58000000,
        sharePct: 13.4,
        intentLevel: 'Low-Mid',
        note: {
          vi: 'Lưu lượng hiển thị khổng lồ (1,71M PV) nhưng rò rỉ chuyển đổi lớn vì thiếu video thực tế và feedback ảnh thật.',
          en: 'Massive impression volume (1.71M PV) but high leakage due to lack of try-on videos and photo reviews.'
        }
      }
    ] as ShoppingTabTrafficSource[],

    highPotentialCards: [
      {
        id: 'card-lace-skirt',
        productName: { vi: 'Chân váy dài phối viền ren', en: 'Lace-Trimmed Long Skirt' },
        category: 'Womenswear & Underwear',
        weeklyViews: '23,6k+ lượt xem/tuần',
        gmv7d: '4,0 triệu đ (7 ngày)',
        currentCvr: 'Tốt nhất kệ hàng',
        targetCvr: '1,5% – 2,0%',
        expectedMultiplier: 'Mũi nhọn thời trang ứng dụng',
        bottleneck: {
          vi: 'Sản phẩm hiệu quả nhất trên Thẻ sản phẩm trong 7 ngày qua, cần thêm combo mua kèm (Add-on Deal).',
          en: 'Top-performing product card over the past 7 days; needs Add-on Deal bundling.'
        },
        actionPlan: {
          vi: 'Ghép combo cùng áo croptop/áo lưới và đẩy mạnh Flash Sale khung giờ vàng.',
          en: 'Bundle with croptops/mesh tops and feature in peak-hour Flash Sales.'
        }
      },
      {
        id: 'card-bikini-2pc',
        productName: { vi: 'Bikini 2 chi tiết / Bikini 2 mảnh đi biển', en: '2-Piece Beach Bikini Set' },
        category: 'Sports & Outdoor',
        weeklyViews: '65.000 lượt xem/tuần',
        currentCvr: '0,25%',
        targetCvr: '1,00%',
        expectedMultiplier: 'Tăng gấp 4 lần GMV (4x)',
        bottleneck: {
          vi: 'Lượt xem cực cao (65k/tuần) nhưng khách thoát ra vì thiếu video quay cận chất vải/mút ngực và thiếu voucher chốt đơn.',
          en: 'High traffic (65k/week) but high bounce rate due to missing fabric/padding close-up videos and closing vouchers.'
        },
        actionPlan: {
          vi: 'Bổ sung clip 15s quay form thật, ghim đánh giá có ảnh thực tế và tạo Flash Sale 2–4 tiếng.',
          en: 'Add 15s real-model clip, pin photo reviews, and run 2–4 hour Flash Sales.'
        }
      },
      {
        id: 'card-mesh-voile-jumpsuit',
        productName: { vi: 'Áo lưới xuyên thấu, Set áo voan & Jumpsuit', en: 'Mesh Top, Voile Set & Jumpsuit' },
        category: 'Womenswear & Underwear',
        weeklyViews: '25.000 – 44.000 lượt xem/tuần',
        currentCvr: '0,25%',
        targetCvr: '0,80% – 1,00%',
        expectedMultiplier: 'Tăng 3x – 4x GMV thụ động',
        bottleneck: {
          vi: 'Khách hàng ngại rủi ro lệch size và hình mạng khác thực tế (tỷ lệ xem đến thanh toán giảm 38%).',
          en: 'Shoppers hesitate over sizing and photo accuracy (view-to-checkout rate dropped 38%).'
        },
        actionPlan: {
          vi: 'Chuẩn hóa bảng size (chiều cao/cân nặng), kích hoạt Freeship Xtra và Mua kèm deal sốc giảm 50% cho Áo lưới.',
          en: 'Standardize height/weight size chart, enable Freeship Xtra, and set 50% off Add-on Deals for Mesh Tops.'
        }
      }
    ] as HighPotentialProductCard[]
  },

  // 3. Phân tích Marketing & Công cụ Khuyến mãi (Promotions Engine)
  marketingPromotions: {
    promoGmvContributionPct: 35.86,
    promoGmvValue: '123,3 triệu đ',
    rawPromoGmv: 123300000,
    discountCostValue: '62,2 triệu đ',
    rawDiscountCost: 62200000,
    effectiveDiscountRatePct: 50.45,
    promoAov: 150991,
    shopBaseAov: 128600,
    aovUpliftPct: 17.41,
    livePreviewEntryRatePct: 5.09,
    searchDiscoverySharePct: 43.0,
    insights: {
      vi: 'Khuyến mãi đóng góp 35,86% tổng GMV (123,3 triệu đ) và kéo AOV lên 150.991 đ (+17,4% so với AOV cơ sở 128,6k đ). Tuy nhiên, chi phí giảm giá đang chiếm tới 62,2 triệu đ (~50% doanh thu khuyến mãi), cần chuyển từ giảm giá cố định dài ngày sang Flash Sale ngắn hạn và Combo để bảo vệ biên lợi nhuận.',
      en: 'Promotions drive 35.86% of total GMV (123.3M VND) and lift AOV to 150,991 VND (+17.4% vs 128.6k base AOV). However, discount costs reached 62.2M VND (~50% of promo revenue), requiring a shift from flat 28-day discounts to short Flash Sales and Bundles to protect margins.'
    }
  },

  // 4. Đối soát Quảng cáo Trả phí vs. Tự nhiên trên 4.417 Shoppable Videos (CSV 180d/90d)
  shoppableVideoAdsBreakdown: {
    totalVideos: 4417,
    totalUnits90d: 13083,
    totalGmv90d: 2170840326,
    paidAds: {
      videoCount: 3482,
      videoSharePct: 78.83,
      unitsSold: 12398,
      unitsSharePct: 94.76,
      gmv: 2055758301,
      gmvSharePct: 94.70
    },
    organic: {
      videoCount: 935,
      videoSharePct: 21.17,
      unitsSold: 685,
      unitsSharePct: 5.24,
      gmv: 115082025,
      gmvSharePct: 5.30
    }
  },

  // 5. Hệ sinh thái TOP 4 Cửa hàng Hợp tác (Collaborative Store Ecosystem)
  collaborativeStores: [
    {
      rank: 1,
      shopName: 'Kami Ely',
      category: 'Sports & Outdoor',
      shopTotalUnitsSold: '238,2k',
      affiliatedProducts: 177,
      bestSellingProduct: 'KAMI BiKINI BestSeller - ...',
      bestSellingUnits: '15,7k',
      channelUnitsSold: '69,2k',
      channelGmv: '9,1 Tỉ đ'
    },
    {
      rank: 2,
      shopName: 'Havi Bikini',
      category: 'Womenswear & Underwear',
      shopTotalUnitsSold: '2,1k',
      affiliatedProducts: 4,
      bestSellingProduct: 'Combo GIÁ SHOCK: Biki...',
      bestSellingUnits: '548',
      channelUnitsSold: '668',
      channelGmv: '71,8 Tr đ'
    },
    {
      rank: 3,
      shopName: 'KamiBiii',
      category: 'Womenswear & Underwear',
      shopTotalUnitsSold: '966',
      affiliatedProducts: 0,
      bestSellingProduct: 'DEAL MUA 1 TẶNG 1: M...',
      bestSellingUnits: '251',
      channelUnitsSold: '55',
      channelGmv: '6,2 Tr đ'
    },
    {
      rank: 4,
      shopName: 'KamiBiki',
      category: 'Womenswear & Underwear',
      shopTotalUnitsSold: '14',
      affiliatedProducts: 0,
      bestSellingProduct: 'Bikini 2 mảnh phối vòng...',
      bestSellingUnits: '0',
      channelUnitsSold: '0',
      channelGmv: '0 đ'
    }
  ] as CollaborativeStoreItem[]
};
