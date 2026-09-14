/**
 * Kami Ely Shop Telemetry & Sales Analytics Data
 */
import { shopOverviewKPIs, shopWeeklyTrendData, shopTopSKUs, topAffiliatesList } from '@/app/lib/seedKamiData';

export const PALETTE = ['#9BE7FA', '#FFD14C', '#C8EEF7', '#FFE485', '#074553', '#E5B830'];

export { shopOverviewKPIs, shopWeeklyTrendData, shopTopSKUs, topAffiliatesList };

// ============================================================================
// PART 1: SHOP DATA (KAMI ELY OFFICIAL STORE)
// ============================================================================

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
    { name: isEn ? 'Fashion Accessories' : 'Phụ kiện thời trang', value: 1.69 }
  ],
  gmv: [
    { name: isEn ? 'Sports & Outdoor' : 'Thể thao & Dã ngoại', value: 66.48 },
    { name: isEn ? 'Womenswear & Underwear' : 'Thời trang nữ & Đồ lót', value: 33.22 },
    { name: isEn ? 'Fashion Accessories' : 'Phụ kiện thời trang', value: 0.30 }
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
  paidAdsShare: '0%',
  organicShare: '100%'
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
    title: '🩱⛱️🕶️☀️ Đi biển thì mặc gì? Gợi ý outfit cực xinh cho nàng',
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

// ============================================================================
