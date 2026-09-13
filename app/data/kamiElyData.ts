/**
 * Kami Ely TikTok Shop & Creator Kamielyn: Telemetry Data
 * Extracted and normalized from FastMoss platform exports in /public/kami.
 */

export const PALETTE = ['#9BE7FA', '#FFD14C', '#C8EEF7', '#FFE485', '#074553', '#E5B830'];

export { KAMI_MATH_STATS } from './kamiElyMathStats';

// ============================================================================
// PART 1: SHOP DATA (KAMI ELY OFFICIAL STORE)
// ============================================================================

export const shopOverviewKPIs = {
  totalGmvAllTime: '31,6 Tỷ đ',
  totalUnitsAllTime: '238.4k',
  activeSkus: 179,
  historicalSkus: 338,
  nationalRank: '#7.5k',
  categoryRank: '#259',
  categoryName: 'Sports & Outdoor',
  inclusionDate: '18/08/2022',
  priceRange: '1.0k đ - 1,1M đ',
  totalLiveStreams: '12.4k',
  totalVideos: '11.2k',
  totalAffiliates: '6.0k',
  rating: '3.9 / 5.0',
  positiveRate: '99%',
  qualityScore: 92,
  responseRate24h: '98%',
  shipWithin48h: '82%',
  period180dUnits: '85.5k',
  period180dGmv: '12,7 Tỷ đ',
};

// 180-day 26-week trajectory data (from Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx)
export const shopWeeklyTrendData = [
  { date: '09/03', units: 2231, gmv: 265.3, live: 78, video: 25 },
  { date: '16/03', units: 2153, gmv: 257.7, live: 236, video: 28 },
  { date: '23/03', units: 3167, gmv: 366.8, live: 176, video: 148 },
  { date: '30/03', units: 3500, gmv: 486.8, live: 427, video: 322 },
  { date: '06/04', units: 3517, gmv: 500.9, live: 651, video: 317 },
  { date: '13/04', units: 4522, gmv: 650.0, live: 427, video: 230 },
  { date: '20/04', units: 4761, gmv: 655.2, live: 334, video: 214 },
  { date: '27/04', units: 2703, gmv: 400.0, live: 333, video: 32 },
  { date: '04/05', units: 3798, gmv: 554.7, live: 353, video: 5 },
  { date: '11/05', units: 3984, gmv: 630.4, live: 332, video: 5 },
  { date: '18/05', units: 3948, gmv: 643.8, live: 160, video: 210 },
  { date: '25/05', units: 4380, gmv: 744.6, live: 392, video: 206 },
  { date: '01/06', units: 4178, gmv: 709.9, live: 447, video: 175 },
  { date: '08/06', units: 5337, gmv: 952.3, live: 438, video: 36 },
  { date: '15/06', units: 6363, gmv: 1058.2, live: 283, video: 22 },
  { date: '22/06', units: 5050, gmv: 850.2, live: 301, video: 31 },
  { date: '29/06', units: 3762, gmv: 640.1, live: 177, video: 31 },
  { date: '06/07', units: 3673, gmv: 594.2, live: 203, video: 32 },
  { date: '13/07', units: 2980, gmv: 469.1, live: 198, video: 30 },
  { date: '20/07', units: 2382, gmv: 363.3, live: 195, video: 42 },
  { date: '27/07', units: 1792, gmv: 260.6, live: 187, video: 33 },
  { date: '03/08', units: 1546, gmv: 214.3, live: 195, video: 18 },
  { date: '10/08', units: 1673, gmv: 232.0, live: 211, video: 38 },
  { date: '17/08', units: 1478, gmv: 211.5, live: 214, video: 32 },
  { date: '24/08', units: 1426, gmv: 198.8, live: 226, video: 28 },
  { date: '31/08', units: 1003, gmv: 139.0, live: 181, video: 17 }
];

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
export const shopTopSKUs = [
  {
    code: 'CV11',
    name: 'Chân Váy Ngắn Form Chữ A Dáng Ôm, Basic Dễ Mix Đồ - Nỉ 2 Da',
    category: 'Skirts / Womenswear',
    price: 125000,
    units: 6375,
    gmv: 735.1,
    commission: 8
  },
  {
    code: 'H36',
    name: 'Set Bikini 2 Mảnh Kẻ Sọc - Đồ Bơi Nữ Áo Yếm + Quần Short',
    category: 'Bikinis / Swimwear',
    price: 194019,
    units: 4360,
    gmv: 824.0,
    commission: 8
  },
  {
    code: 'H32',
    name: 'Set Bikini 2 Mảnh Xanh Rêu Free Size - Áo Cúp Ngực Tôn Dáng',
    category: 'Bikinis / Swimwear',
    price: 162682,
    units: 2681,
    gmv: 391.0,
    commission: 8
  },
  {
    code: 'M18',
    name: 'Bikini 1 Mảnh Bodysuit Đen & Xanh Viền Trắng Sexy KAMI ELY',
    category: 'One-Pieces / Swimwear',
    price: 99000,
    units: 2307,
    gmv: 464.0,
    commission: 8
  },
  {
    code: 'KV01',
    name: 'Khăn quấn voan tơ hai màu đen trắng dễ phối kích thước 75x145cm',
    category: 'Accessories',
    price: 56703,
    units: 1870,
    gmv: 110.2,
    commission: 10
  },
  {
    code: 'H34',
    name: 'Set Bikini 2 Mảnh Đi Biển Nữ Màu Trắng Đen Thiết Kế Nơ Trước Ngực',
    category: 'Bikinis / Swimwear',
    price: 182740,
    units: 1419,
    gmv: 242.0,
    commission: 8
  }
];

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
export const topAffiliatesList = [
  {
    id: 'girlstyle.vn',
    name: 'Girl Style',
    type: 'Clothing & Accessories',
    followers: 3215,
    units: 5009,
    gmv: 732.8,
    liveGpm: '45,5k - 47,5k đ',
    videoGpm: '55,0k đ'
  },
  {
    id: 'dayboisinhtonbmt',
    name: '🏊sinh tồn 🏊thực chiến',
    type: 'Sports / Other',
    followers: 89407,
    units: 305,
    gmv: 73.0,
    liveGpm: '0 đ',
    videoGpm: '95,4k - 141,5k đ'
  },
  {
    id: 'pahavt',
    name: 'Phương Anhh 🦢✨',
    type: 'Clothing & Accessories',
    followers: 34651,
    units: 500,
    gmv: 58.7,
    liveGpm: '0 đ',
    videoGpm: '163k - 753k đ'
  },
  {
    id: 'lolystudio.official',
    name: 'Loly Studio',
    type: 'Clothing & Accessories',
    followers: 58267,
    units: 336,
    gmv: 43.9,
    liveGpm: '197k - 215k đ',
    videoGpm: '215k - 234k đ'
  },
  {
    id: '_thzy.tien',
    name: 'đẹp và điên',
    type: 'Personal Blog / Other',
    followers: 18391,
    units: 240,
    gmv: 40.9,
    liveGpm: '0 đ',
    videoGpm: '90,0k - 108,5k đ'
  },
  {
    id: 'trammacgido',
    name: 'Trâm mặc gì đó',
    type: 'Fashion Creator',
    followers: 41254,
    units: 179,
    gmv: 35.1,
    liveGpm: '0 đ',
    videoGpm: '292k - 295k đ'
  }
];

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
// PART 2: CREATOR DATA (KAMIELYN / @kamielyhn)
// ============================================================================

export const creatorProfile = {
  name: 'Kami Ely',
  id: 'kamielyhn',
  bio: 'Chọn những điều xinh đẹp cho tủ đồ của Nàng. Livestream 11:30-13:30; 16:30 - 22:00',
  category: 'Clothing & Accessories',
  sellingCategories: ['Fashion', 'Mom & Babies', 'Electronics'],
  contractedByCap: 'Non-contracted',
  firstVideoDate: '28/05/2023',
  latestCreationDate: '03/09/2026',
  nationalRank: '83.8k',
  categoryRank: '8.6k',
  trafficIndex: 39,
  ecomPotentialIndex: 67,
  followers: '48.8k',
  followersGained180d: '9.4k',
  totalGmv: '9,2 Tỷ đ',
  totalUnitsSold: '69.9k',
  videoGmv: '3,2 Tỷ đ',
  liveGmv: '5,9 Tỷ đ',
  videoGpm: '134,8k - 135,2k đ',
  liveGpm: '29,2k - 30,2k đ',
  collaborativeShopsCount: 4,
  showcasedProductsCount: 394
};

// Creator Active Period: 24h Video Posting Curve (from Screenshot 080726 & 080749)
export const creatorHourlyActivity = [
  { hour: '00:00', posts: 0, engagement: 0.1 },
  { hour: '02:00', posts: 0, engagement: 0.1 },
  { hour: '04:00', posts: 0, engagement: 0.1 },
  { hour: '06:00', posts: 1, engagement: 0.3 },
  { hour: '07:00', posts: 1, engagement: 0.4 },
  { hour: '08:00', posts: 8, engagement: 0.66 }, // Morning peak
  { hour: '09:00', posts: 1, engagement: 0.5 },
  { hour: '10:00', posts: 6, engagement: 0.55 },
  { hour: '11:00', posts: 7, engagement: 0.60 }, // Lunch peak
  { hour: '12:00', posts: 1, engagement: 0.71 }, // High engagement
  { hour: '13:00', posts: 1, engagement: 0.5 },
  { hour: '14:00', posts: 3, engagement: 0.45 },
  { hour: '15:00', posts: 3, engagement: 0.74 }, // Peak engagement rate
  { hour: '16:00', posts: 4, engagement: 0.68 },
  { hour: '17:00', posts: 5, engagement: 0.55 },
  { hour: '18:00', posts: 1, engagement: 0.35 },
  { hour: '20:00', posts: 0, engagement: 0.2 },
  { hour: '22:00', posts: 0, engagement: 0.1 }
];

export const creatorActivityHighlights = {
  peakPostingWindow: '06:00 - 12:00 (54% bài đăng)',
  avgDailyPosts: 2,
  monthlyLiveSessions: 73,
  topPostingHours: ['08:00 (8 posts)', '11:00 (7 posts)', '10:00 (6 posts)'],
  topEngagementWindows: [
    { time: '15:00 - 16:00', rate: '0.74%' },
    { time: '12:00 - 13:00', rate: '0.71%' },
    { time: '08:00 - 09:00', rate: '0.66%' }
  ],
  avgEngagementRate: '0.42%'
};

// Creator Audience Demographics (from Screenshot 080705)
export const creatorDemographics = {
  gender: [
    { name: 'Nữ (Female)', value: 73, color: '#FFD14C' },
    { name: 'Nam (Male)', value: 27, color: '#0D7287' }
  ],
  age: [
    { group: '18 - 24', value: 60, color: '#0D7287' },
    { group: '25 - 34', value: 31, color: '#9BE7FA' },
    { group: '35 - 44', value: 6, color: '#FFD14C' },
    { group: '45 - 54', value: 1, color: '#FFE485' },
    { group: '55+', value: 2, color: '#C8EEF7' }
  ],
  locations: [
    { city: 'TP. Hồ Chí Minh', value: 41 },
    { city: 'Đồng Nai', value: 6 },
    { city: 'Hải Phòng', value: 5 },
    { city: 'Bình Dương', value: 4 },
    { city: 'Hà Nội & Tỉnh khác', value: 44 }
  ]
};

// Creator Video Performance (from Screenshot 080124, 080800 & 081041)
export const creatorVideoStats = {
  totalVideos: 859,
  shoppableVideos: 551,
  brandingVideos: 308,
  totalViews: '34.3M',
  views180d: '6.6M',
  likes180d: '18.8k',
  comments180d: 381,
  collections180d: '4.8k',
  forwards180d: '4.7k',
  avgEngagementRate: '0.62%',
  ratingRatio: '102%',
  videoUnitsSold: '5.1k',
  videoGmv: '872,2 Triệu đ',
  categories: {
    units: [
      { name: 'Sports & Outdoor', value: 79.31 },
      { name: 'Womenswear & Underwear', value: 20.69 }
    ],
    gmv: [
      { name: 'Sports & Outdoor', value: 98.33 },
      { name: 'Womenswear & Underwear', value: 1.67 }
    ]
  },
  topHashtags: [
    { tag: '#kamiely', value: 24.24 },
    { tag: '#bikini', value: 20.71 },
    { tag: '#summer', value: 16.93 },
    { tag: '#xuhuongtiktok', value: 11.21 },
    { tag: '#xuhuong', value: 10.48 }
  ]
};

export const creatorTopVideos = [
  {
    title: 'KamiEly_ Chính Thức Mở Bán_ Thiết kế croptop yếm buộc dây tôn dáng...',
    publishDate: '13/05/2026',
    views: 529000,
    likes: 892,
    interactionRate: '0.22%',
    units: 856,
    gmv: 170.2
  },
  {
    title: '| BEACH READY FIT_ ☀️ Set bikini caro vintage tôn dáng mặc đi biển hè',
    publishDate: '08/04/2026',
    views: 755000,
    likes: 1824,
    interactionRate: '0.34%',
    units: 288,
    gmv: 56.9
  },
  {
    title: '| Hot- Hit Bikini_ Set Bikini 2 mảnh hot trend mùa du lịch',
    publishDate: '14/05/2026',
    views: 149947,
    likes: 682,
    interactionRate: '0.45%',
    units: 262,
    gmv: 42.9
  },
  {
    title: '| Swimwear Goals This Summer Season_ Đi biển rạng rỡ với Kami Ely',
    publishDate: '14/04/2026',
    views: 218900,
    likes: 598,
    interactionRate: '0.31%',
    units: 189,
    gmv: 37.8
  },
  {
    title: '| SĂN SALE HÈ, CHÁY HẾT MÌNH_ Bikini tôn dáng cực hack eo',
    publishDate: '06/04/2026',
    views: 345700,
    likes: 682,
    interactionRate: '0.28%',
    units: 209,
    gmv: 33.1
  }
];

// Creator LIVE Performance (from Screenshot 080124 & [Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx)
export const creatorLiveKPIs = {
  totalSessionsLifetime: '470',
  avgDuration: '02h:26m',
  peakViewersAccumulated: '93.8k',
  avgViewers: '2.4k',
  concurrentPeak: '1.2k',
  units180d: '49.8k',
  gmv180d: '7,02 Tỷ đ',
  liveGpm: '29,2k - 30,2k đ'
};

export const creatorTopLiveStreams = [
  {
    title: 'Sale KamiELy (Đại tiệc sinh nhật shop)',
    startTime: '16/06 20:08',
    duration: '16.9h',
    viewers: 25535,
    units: 1850,
    gmv: 272.1,
    uv: 10656.0
  },
  {
    title: 'Chào mừng bạn đến với phiên LIVE của tôi',
    startTime: '05/06 20:44',
    duration: '18.3h',
    viewers: 32166,
    units: 1795,
    gmv: 245.3,
    uv: 7625.6
  },
  {
    title: 'Sale KamiEly (Mega Live đầu tuần)',
    startTime: '12/06 20:29',
    duration: '16.4h',
    viewers: 23096,
    units: 1495,
    gmv: 216.8,
    uv: 9388.0
  },
  {
    title: 'Phiên săn deal đêm muộn cùng Kami Ely',
    startTime: '17/06 23:01',
    duration: '14.0h',
    viewers: 19090,
    units: 1432,
    gmv: 214.1,
    uv: 11213.3
  },
  {
    title: 'Chào mừng bạn đến với phiên LIVE',
    startTime: '08/06 02:01',
    duration: '11.0h',
    viewers: 27389,
    units: 1519,
    gmv: 209.6,
    uv: 7652.0
  }
];

// Top Collaborative Stores for Kamielyn (from Screenshot 081121)
export const creatorCollaborativeStores = [
  {
    rank: 1,
    name: 'Kami Ely',
    storeName: 'Kami Ely',
    category: 'Sports & Outdoor',
    totalShopUnits: '238.2k',
    affiliatedProducts: 177,
    bestSeller: 'KAMI BiKINI BestSeller (15.7k sold)',
    creatorUnitsSold: 69100,
    unitsSold: '69.1k SP',
    unitsShare: '98.86%',
    creatorGmv: 9100.0,
    gmv: '9,1 Tỷ đ',
    gmvDisplay: '9,1 Tỷ đ',
    gmvShare: '98.92%',
    liveSessions: 208,
    videosCount: 147
  },
  {
    rank: 2,
    name: 'Havi Bikini',
    storeName: 'Havi Bikini',
    category: 'Womenswear & Underwear',
    totalShopUnits: '2.1k',
    affiliatedProducts: 4,
    bestSeller: 'Combo GIÁ SHOCK: Bikini (548 sold)',
    creatorUnitsSold: 578,
    unitsSold: '578 SP',
    unitsShare: '0.83%',
    creatorGmv: 71.8,
    gmv: '71,8 Triệu đ',
    gmvDisplay: '71,8 Triệu đ',
    gmvShare: '0.78%',
    liveSessions: 12,
    videosCount: 0
  },
  {
    rank: 3,
    name: 'KamiBiii',
    storeName: 'KamiBiii',
    category: 'Womenswear & Underwear',
    totalShopUnits: '966',
    affiliatedProducts: 0,
    bestSeller: 'DEAL MUA 1 TẶNG 1: M... (251 sold)',
    creatorUnitsSold: 62,
    unitsSold: '62 SP',
    unitsShare: '0.09%',
    creatorGmv: 6.2,
    gmv: '6,2 Triệu đ',
    gmvDisplay: '6,2 Triệu đ',
    gmvShare: '0.07%',
    liveSessions: 4,
    videosCount: 1
  },
  {
    rank: 4,
    name: 'KamiBiki',
    storeName: 'KamiBiki',
    category: 'Womenswear & Underwear',
    totalShopUnits: '14',
    affiliatedProducts: 0,
    bestSeller: 'Bikini 2 mảnh phối vòng',
    creatorUnitsSold: 0,
    unitsSold: '0 SP',
    unitsShare: '0.00%',
    creatorGmv: 0.0,
    gmv: '0 đ',
    gmvDisplay: '0 đ',
    gmvShare: '0.00%',
    liveSessions: 0,
    videosCount: 0
  }
];

// Creator Sales Capacity & Ecommerce Analysis (from Screenshot 081026 & 081041)
export const creatorSalesCapacity = {
  collaborativeShopsCount: 4,
  collaborativeShopsByChannel: { video: 2, live: 4 },
  showcasedProductsCount: 394,
  showcasedProductsByChannel: { video: 137, live: 375 },
  totalUnitsSold: '69.9k',
  unitsSoldByChannel: { video: '26.0k', live: '43.9k' },
  totalGmv: '9,2 Tỷ đ',
  gmvByChannel: { video: '3,2 Tỷ đ', live: '5,9 Tỷ đ' },
  promotedCategories: [
    { name: 'Sports & Outdoor', value: 65.98, color: '#0D7287', label: '65.98% (Thể thao & Dã ngoại)' },
    { name: 'Womenswear & Underwear', value: 29.90, color: '#FFD14C', label: '29.90% (Thời trang nữ)' },
    { name: 'Fashion Accessories', value: 4.12, color: '#9BE7FA', label: '4.12% (Phụ kiện)' }
  ],
  videoCategoryProportion: {
    units: [
      { name: 'Sports & Outdoor', value: 79.31 },
      { name: 'Womenswear & Underwear', value: 20.69 }
    ],
    gmv: [
      { name: 'Sports & Outdoor', value: 98.33 },
      { name: 'Womenswear & Underwear', value: 1.67 }
    ]
  },
  // Added for direct metric toggles (Screenshots 081026 & 081041)
  gmv: [
    { name: 'Sports & Outdoor', value: 98.92, label: '98.92% (5,7 Tỷ đ)' },
    { name: 'Womenswear & Underwear', value: 0.76, label: '0.76% (44,0 Triệu đ)' },
    { name: 'Beauty & Personal Care', value: 0.31, label: '0.31% (18,0 Triệu đ)' }
  ],
  units: [
    { name: 'Sports & Outdoor', value: 99.07, label: '99.07% (39.0k SP)' },
    { name: 'Womenswear & Underwear', value: 0.73, label: '0.73% (286 SP)' },
    { name: 'Beauty & Personal Care', value: 0.20, label: '0.20% (78 SP)' }
  ]
};

// Creator 180-Day Telemetry Breakdown (from Screenshots 080501 to 080640)
export const creator180dTelemetry = {
  // GMV metrics
  gmvTotal: '5,8 Tỷ đ',
  totalGmv: '5,8 Tỷ đ',
  gmvLive: '4,9 Tỷ đ',
  gmvLiveShare: 84.5,
  gmvVideo: '872,2 Triệu đ',
  gmvVideoShare: 15.0,
  gmvFeatured: '0 đ',
  gmvFeaturedShare: 0,

  // Units metrics
  unitsTotal: '39.3k',
  totalUnitsSold: '39.3k',
  unitsLive: '34.1k',
  unitsLiveShare: 86.8,
  unitsVideo: '5.1k',
  unitsVideoShare: 13.0,
  unitsFeatured: '0',
  unitsFeaturedShare: 0,

  // Video Engagement Totals (180d)
  followersGained: '+9.4k',
  followerGrowth: '+9.4k',
  videoViews: '6.6M',
  totalVideoViews: '6.6M',
  videoLikes: '18.8k',
  likes: '18.8k',
  videoComments: 381,
  comments: 381,
  videoCollections: '4.8k',
  saves: '4.8k',
  videoForwards: '4.7k',
  shares: '4.7k',

  // Channel structured objects
  liveSales: { gmv: '4,9 Tỷ đ', shareGmv: '84.51%', units: '34.1k SP', shareUnits: '86.76%' },
  videoSales: { gmv: '872,2 Triệu đ', shareGmv: '15.04%', units: '5.2k SP', shareUnits: '13.24%' },
  showcaseSales: { gmv: '0 đ', shareGmv: '0%', units: '0 SP', shareUnits: '0%' },

  // 14-point bi-weekly trend matching FastMoss telemetry curve in Screenshots 080501 - 080640
  weeklyTrajectory: [
    { period: '09/03', liveGmv: 4.5, videoGmv: 0.8, totalGmv: 5.3, units: 35, views: 8200 },
    { period: '23/03', liveGmv: 42.0, videoGmv: 12.0, totalGmv: 54.0, units: 360, views: 75000 },
    { period: '06/04', liveGmv: 265.0, videoGmv: 55.0, totalGmv: 320.0, units: 2150, views: 295000 },
    { period: '20/04', liveGmv: 320.0, videoGmv: 78.0, totalGmv: 398.0, units: 2680, views: 430000 },
    { period: '04/05', liveGmv: 395.0, videoGmv: 102.0, totalGmv: 497.0, units: 3250, views: 525000 },
    { period: '18/05', liveGmv: 510.0, videoGmv: 130.0, totalGmv: 640.0, units: 4280, views: 695000 },
    { period: '01/06', liveGmv: 920.0, videoGmv: 190.0, totalGmv: 1110.0, units: 7150, views: 1180000 },
    { period: '15/06', liveGmv: 1450.0, videoGmv: 262.0, totalGmv: 1712.0, units: 11500, views: 2020000 }, // Mega Peak week
    { period: '29/06', liveGmv: 420.0, videoGmv: 44.0, totalGmv: 464.0, units: 3320, views: 610000 },
    { period: '13/07', liveGmv: 290.0, videoGmv: 19.0, totalGmv: 309.0, units: 2240, views: 435000 },
    { period: '27/07', liveGmv: 205.0, videoGmv: 8.5, totalGmv: 213.5, units: 1610, views: 255000 },
    { period: '10/08', liveGmv: 140.0, videoGmv: 5.0, totalGmv: 145.0, units: 1180, views: 170000 },
    { period: '24/08', liveGmv: 80.0, videoGmv: 3.5, totalGmv: 83.5, units: 720, views: 92000 },
    { period: '04/09', liveGmv: 22.0, videoGmv: 1.4, totalGmv: 23.4, units: 220, views: 38000 }
  ],
  trajectory: [
    { dateRange: '09/03 - 23/03', gmv: 54.0, units: 395 },
    { dateRange: '23/03 - 06/04', gmv: 320.0, units: 2150 },
    { dateRange: '06/04 - 20/04', gmv: 398.0, units: 2680 },
    { dateRange: '20/04 - 04/05', gmv: 497.0, units: 3250 },
    { dateRange: '04/05 - 18/05', gmv: 640.0, units: 4280 },
    { dateRange: '18/05 - 01/06', gmv: 955.5, units: 6420 },
    { dateRange: '01/06 - 15/06', gmv: 1061.6, units: 7150 },
    { dateRange: '15/06 - 29/06', gmv: 880.0, units: 5900 },
    { dateRange: '29/06 - 13/07', gmv: 464.0, units: 3320 },
    { dateRange: '13/07 - 27/07', gmv: 309.0, units: 2240 },
    { dateRange: '27/07 - 10/08', gmv: 213.5, units: 1610 },
    { dateRange: '10/08 - 24/08', gmv: 145.0, units: 1180 },
    { dateRange: '24/08 - 04/09', gmv: 83.5, units: 720 },
    { dateRange: '04/09 - Hiện tại', gmv: 23.4, units: 220 }
  ]
};


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

// Full Manifest of 36 FastMoss Screenshots for Proof Gallery & Verification Modal
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
    group: 'creator',
    sectionId: 'creator-live',
    timeframeVi: '180 ngày gần nhất (09/03/2026 - 04/09/2026)',
    timeframeEn: 'Last 180 Days (2026-03-09 ~ 2026-09-04)',
    titleVi: 'Phân Tích Toàn Bộ Livestream Của Kênh (180 Ngày)',
    titleEn: 'Comprehensive Channel LIVE Analytics (180 Days)',
    descriptionVi: '7.0k phiên LIVE ghi nhận 67.2k SP bán ra, tổng 9,3 Tỷ đ GMV, trung bình 5.5k người xem và 1,3 Triệu đ doanh số mỗi phiên.',
    descriptionEn: '7.0k LIVE sessions achieved 67.2k units sold, 9.3B VND GMV, averaging 5.5k viewers and 1.3M VND per session.',
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
    descriptionVi: 'Creator mang về 5,8 Tỷ đ GMV trong 180 ngày (chiếm 45.7% GMV toàn shop 12,7 Tỷ đ). Đỉnh điểm tuần tháng 06/2026 đạt ~1,7 Tỷ đ.',
    descriptionEn: 'Creator generated 5.8B VND GMV in 180 days (45.7% of shop 12.7B GMV), peaking at ~1.7B in peak week June 2026.',
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
    descriptionVi: '73% Nữ, 60% độ tuổi 18 - 24, 31% độ tuổi 25 - 34 (91% Gen Z/Y trẻ). TP.HCM dẫn đầu 41%, Đồng Nai 6%, Hải Phòng 5%, Bình Dương 4%.',
    descriptionEn: '73% Female, 60% aged 18-24, 31% aged 25-34 (91% young Gen Z/Y). Ho Chi Minh City leads with 41%, Dong Nai 6%, Hai Phong 5%.',
    keyMetric: '73% Nữ · 60% Tuổi 18-24 · 41% TP.HCM'
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

