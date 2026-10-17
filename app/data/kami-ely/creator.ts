/**
 * Kami Ely Creator Telemetry & Content Performance Data
 */
import { creatorProfile } from '@/app/lib/seedKamiData';
export { creatorProfile };

// PART 2: CREATOR DATA (KAMIELYN / @kamielyhn)
// ============================================================================


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
    { city: 'TP. Hồ Chí Minh', cityEn: 'Ho Chi Minh City', value: 41 },
    { city: 'Hà Nội', cityEn: 'Hanoi', value: 41 },
    { city: 'Đồng Nai', cityEn: 'Dong Nai', value: 6 },
    { city: 'Hải Phòng', cityEn: 'Hai Phong', value: 5 },
    { city: 'Bình Dương', cityEn: 'Binh Duong', value: 4 },
    { city: 'Tỉnh khác', cityEn: 'Others', value: 3 }
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

  // 14-point bi-weekly trend matching telemetry curve in Screenshots 080501 - 080640
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
// DỮ LIỆU CHẨN ĐOÁN PHÒNG LIVE & HIỆU SUẤT KÊNH CHÍNH CHỦ (ĐỒNG BỘ 180 NGÀY & 90 NGÀY)
// Tệp đích: app/data/kami-ely/creator.ts
// Khung thời gian chuẩn: 180 ngày (09/03/2026 – 04/09/2026) & 90 ngày gần nhất
// ============================================================================

export interface CreatorFormatComparisonItem {
  formatId: 'self-live' | 'affiliate-live' | 'self-video';
  formatName: { vi: string; en: string };
  contentVolume: { vi: string; en: string };
  gmvContribution: { vi: string; en: string };
  costStructure: { vi: string; en: string };
  conversionEfficiency: { vi: string; en: string };
  gpmRange: string;
}

export interface LiveTrafficSourceItem {
  source: { vi: string; en: string };
  pvSharePct: number;
  roomEntryRatePct: number;
  status: 'high-efficiency' | 'bottleneck' | 'secondary';
  diagnosis: { vi: string; en: string };
}

export interface SynchronizedLiveSessionTelemetry {
  sessionCode: string;
  datasetSource: string;
  sessionType: { vi: string; en: string };
  duration: string;
  totalGmv: string;
  rawGmv: number;
  unitsSold: number;
  viewers: string;
  views: string;
  impressions: string;
  gmvPerHour: string;
  impressionGpm: string;
  avgWatchTimeSec: number;
  viewsOver1Min: number;
  previewEntryRatePct: number;
  productClickRatePct: number;
  liveCtrPct: number;
  skuOrderCvrPct: number;
  commentRatePct: number;
  likeRatePct: number;
  adSpend: string;
  rawAdSpend: number;
  roas: number;
  trafficBreakdown: {
    feedProposalGmvPct: number;
    livePreviewGmvPct: number;
    searchGmvPct: number;
    searchViewsPct?: number;
  };
  nonFollowerGmvSharePct: number;
  followerGmvSharePct: number;
  heroSku: {
    productId: string;
    productName: string;
    clicks: number;
    ctrPct: number;
    orders: number;
    gmv: string;
    gmvShareOfSessionPct: number;
  };
}

export const creatorLiveDiagnosticsData = {
  // 1. Tổng hợp Đa khung thời gian chuẩn hóa của Kênh Chính Chủ (@kamielyhn)
  multiWindowSummary: {
    allTime: {
      totalGmv: '9,2 Tỉ VNĐ',
      rawGmv: 9200000000,
      shopGmvSharePct: 29.1,
      unitsSold: '69,9k đơn',
      liveGmv: '5,9 Tỉ VNĐ',
      liveSessions: '2,5k phiên (Lũy kế toàn thời gian)',
      avgLiveDuration: '02:26:18',
      videoGmv: '3,2 Tỉ VNĐ',
      totalVideos: 859,
      shoppableVideos: 551,
      totalVideoViews: '34,3M views'
    },
    last180Days: {
      period: '09/03/2026 – 04/09/2026 (180 ngày)',
      channelTotalGmv: '5,8 Tỉ VNĐ',
      channelTotalUnits: '39,3k đơn',
      shopGmvSharePct: 45.7,
      // Số liệu đối chiếu giữa Dashboard 180d (4,9 Tỉ đ / 470 phiên) và File CSV chi tiết phiên (7,02 Tỉ đ / 475 phiên)
      liveDashboardGmv: '4,9 Tỉ VNĐ (52,7% GMV LIVE toàn sàn)',
      liveCsvGrossGmv: '7.023.530.158 VNĐ (~7,02 Tỉ VNĐ)',
      liveCsvTotalUnits: 49817,
      liveCsvTotalViewers: 3292698,
      liveSessionsCount: 470,
      liveCsvSessionsCount: 475,
      convertingSessionsCount: 454,
      convertingSessionRatePct: 95.58,
      avgViewersPerSession: 6932,
      avgGmvPerSession: '12,55 – 14,79 Tr VNĐ/phiên',
      videoGmv180d: '870,2 Tr – 872,2 Tr VNĐ'
    },
    last90Days: {
      period: '90 ngày gần nhất (Trong chuỗi 180 ngày)',
      totalGmv: '3,0 Tỉ VNĐ',
      unitsSold: '20,0k đơn',
      shopUnitsSharePct: 49.76,
      shopGmvSharePct: 49.3,
      liveSessionsCount: 208,
      videosPublishedCount: 147,
      avgVideoViews: '16,4k views/video'
    }
  },

  // 2. Bóc tách 3 trụ cột nội dung & Nghịch lý GPM 4,5x (Đồng bộ bảng 180 ngày & 90 ngày)
  formatComparison: [
    {
      formatId: 'self-live',
      formatName: { vi: 'LIVE Chính chủ (@kamielyhn)', en: 'Self-Operated LIVE (@kamielyhn)' },
      contentVolume: {
        vi: '470 – 475 phiên (180 ngày) / 208 phiên (90 ngày)',
        en: '470 – 475 sessions (180d) / 208 sessions (90d)'
      },
      gmvContribution: {
        vi: '4,9 – 7,02 Tỉ VNĐ (180 ngày) / 3,0 Tỉ VNĐ (90 ngày)',
        en: '4.9B – 7.02B VND (180d) / 3.0B VND (90d)'
      },
      costStructure: {
        vi: 'Chi phí cố định cao: Setup phòng live, lương cứng + KPI host, lịch live ~7,5h/ngày (11:30–13:30 & 16:30–22:00).',
        en: 'High fixed cost: Studio setup, host base salary + KPI, fixed ~7.5h/day schedule (11:30–13:30 & 16:30–22:00).'
      },
      conversionEfficiency: {
        vi: 'GPM thấp (29,2k – 30,2k VNĐ); 95,58% phiên có đơn (454/475 phiên); gắn dàn trải 375 SKUs gây loãng nhận diện.',
        en: 'Low GPM (29.2k – 30.2k VND); 95.58% converting sessions (454/475); diluted by 375 pinned SKUs.'
      },
      gpmRange: '29,2k – 30,2k VNĐ'
    },
    {
      formatId: 'affiliate-live',
      formatName: { vi: 'LIVE Tiếp thị Liên kết (Affiliate)', en: 'Affiliate Creator LIVE' },
      contentVolume: {
        vi: 'Phần còn lại trong 7.046 phiên toàn sàn (234 KOC chuyên LIVE / 5,7k Creators)',
        en: 'Remainder of 7,046 shop sessions (234 LIVE KOCs out of 5.7k Creators)'
      },
      gmvContribution: {
        vi: 'Khoảng 3,4 Tỉ VNĐ (180 ngày) / 28,75% sản lượng shop (90 ngày)',
        en: '~3.4B VND (180d) / 28.75% of shop volume (90d)'
      },
      costStructure: {
        vi: 'Chi phí biến đổi: Thuần trả hoa hồng (8% – 12%) theo đơn phát sinh thành công.',
        en: 'Variable cost: Pure commission (8% – 12%) paid on successful orders.'
      },
      conversionEfficiency: {
        vi: 'Doanh thu trung bình toàn sàn đạt 1,3 Tr VNĐ/phiên (10 sản phẩm/phiên; 5,5k viewers/phiên).',
        en: 'Shop-wide average of 1.3M VND/session (10 units/session; 5.5k viewers/session).'
      },
      gpmRange: 'TB 1,3 Tr đ / phiên'
    },
    {
      formatId: 'self-video',
      formatName: { vi: 'Shoppable Video (Chính chủ)', en: 'Self-Operated Shoppable Video' },
      contentVolume: {
        vi: '551 video gắn giỏ hàng (All-time) / 147 video xuất bản (90 ngày)',
        en: '551 shoppable videos (All-time) / 147 videos published (90d)'
      },
      gmvContribution: {
        vi: '3,2 Tỉ VNĐ (All-time) / ~872,2 Tr VNĐ (180 ngày)',
        en: '3.2B VND (All-time) / ~872.2M VND (180d)'
      },
      costStructure: {
        vi: 'Chi phí sản xuất 1 lần, phân phối hiển thị tự động 24/7 (tập trung 137 SKUs chủ lực).',
        en: 'One-time production cost, 24/7 distribution (focused on 137 core SKUs).'
      },
      conversionEfficiency: {
        vi: 'GPM vượt trội (134,8k – 135,2k VNĐ), cao gấp 4,5 lần so với Livestream.',
        en: 'Superior GPM (134.8k – 135.2k VND), 4.5x higher than Livestream.'
      },
      gpmRange: '134,8k – 135,2k VNĐ (4,5x)'
    }
  ] as CreatorFormatComparisonItem[],

  // 3. Chẩn đoán Phễu Lưu Lượng & Phiên Thực Nghiệm (Đồng bộ trực tiếp vào bảng 475 phiên 180 ngày)
  inWindowLiveDiagnostics: {
    // Chỉ số phễu 28 ngày của các phiên trong giai đoạn thấp điểm/chuyển mùa thuộc chuỗi 180 ngày
    lowSeason28dFunnel: {
      scopeNote: {
        vi: 'Chỉ số chẩn đoán 28 ngày của các phiên LIVE trong giai đoạn thấp điểm (thuộc chuỗi 180 ngày)',
        en: '28-day diagnostic funnel of LIVE sessions during off-peak window (within the 180-day dataset)'
      },
      gmv: '93.504.198 đ',
      skuOrders: 843,
      customers: 712,
      itemsSold: 846,
      ctorPct: 1.44,
      ctrPct: 5.49,
      recent28dAvgPerSession: {
        avgOrders: 47,
        avgGmv: '5,2 Tr VNĐ/phiên',
        followerNetChange: -260
      }
    },

    // Bảng "Nơi khán giả tìm thấy bạn" (Trích xuất từ các phiên tuần 16/03 – 18/03/2026 trong bảng 180 ngày)
    trafficSourcesDistribution: [
      {
        source: { vi: 'Bảng tin - Ô Live (Feed Live Preview)', en: 'For You Feed - Live Preview' },
        pvSharePct: 46,
        roomEntryRatePct: 5.09,
        status: 'bottleneck',
        diagnosis: {
          vi: 'Chiếm 46% tổng hiển thị của các phiên LIVE trong bảng 180 ngày nhưng tỷ lệ vào phòng chỉ đạt 5,09% (95% khách lướt qua).',
          en: 'Accounts for 46% of PV across sessions in the 180d dataset, but room entry rate is only 5.09% (95% scroll past).'
        }
      },
      {
        source: { vi: 'Tìm kiếm (Search)', en: 'Search' },
        pvSharePct: 43,
        roomEntryRatePct: 25.68,
        status: 'high-efficiency',
        diagnosis: {
          vi: 'Chiếm 43% hiển thị với tỷ lệ vào phòng lên tới 25,68% — nguồn lưu lượng có ý định mua hàng cao nhất của kênh.',
          en: 'Accounts for 43% of PV with a 25.68% room entry rate — the highest-intent traffic source for the channel.'
        }
      },
      {
        source: { vi: 'Hợp nhất Live (Live Merge)', en: 'Live Merge' },
        pvSharePct: 2,
        roomEntryRatePct: 41.41,
        status: 'high-efficiency',
        diagnosis: {
          vi: 'Đạt tỷ lệ vào phòng cao nhất (41,41%) trên tập phiên được chẩn đoán.',
          en: 'Highest room entry rate (41.41%) among diagnosed sessions.'
        }
      },
      {
        source: { vi: 'Bảng tin - Đầu video & Nguồn khác', en: 'Video Header, Shop Tab & Others' },
        pvSharePct: 9,
        roomEntryRatePct: 6.45,
        status: 'secondary',
        diagnosis: {
          vi: 'Gồm Đầu video (3% PV - 3,24% vào phòng), Khác (2% PV - 9,99%), Tin nhắn (2% PV - 0,77%), Tab Cửa hàng (1% PV - 2,90%) và Bảng tin khác (1% PV - 19,93%).',
          en: 'Includes Video Header (3% PV - 3.24% entry), Others (2% PV - 9.99%), Messages (2% PV - 0.77%), Shop Tab (1% PV - 2.90%), and Other Feed (1% PV - 19.93%).'
        }
      }
    ] as LiveTrafficSourceItem[],

    // Các phiên thực tế khớp trực tiếp ngày giờ trong bảng Creator's Live Streaming (180 ngày: 09/03 - 04/09/2026)
    verifiedInWindowSessions: [
      { date: '16/06/2026 (Đỉnh mùa vụ)', gmv: '272.100.000 đ', units: 1850, note: 'Phiên kỷ lục 180 ngày (Marathon 13–16h)' },
      { date: '12/06/2026 (Cao điểm hè)', gmv: '216.800.000 đ', units: 1495, note: 'Phiên bùng nổ mùa du lịch biển' },
      { date: '15/06/2026 (Cao điểm hè)', gmv: '194.900.000 đ', units: 1305, note: 'Phiên cao điểm liền kề trước đỉnh 16/06' },
      { date: '17/03/2026 20:29', gmv: '6.705.758 đ', viewers: 4032, note: 'Top 1 phiên yêu thích tuần giữa tháng 3/2026' },
      { date: '16/03/2026 19:20', gmv: '6.526.649 đ', viewers: 5203, note: 'Top 2 phiên yêu thích tuần giữa tháng 3/2026' },
      { date: '18/03/2026 10:09', gmv: '5.046.672 đ', viewers: 2500, note: 'Top 3 phiên yêu thích tuần giữa tháng 3/2026' },
      { date: '23/03/2026 (Phiên tối)', gmv: '1.319.779 đ', viewers: 1885, note: 'Phiên ghi nhận trên bảng Chỉ số chính' },
      { date: '24/03/2026 (Phiên trưa)', gmv: '947.569 đ', viewers: 1409, note: 'Phiên ghi nhận trên bảng Chỉ số chính' },
      { date: '04/09/2026 (Đáy cuối vụ)', gmv: '119.000 đ', units: 1, note: 'Phiên suy kiệt doanh thu cuối chu kỳ 180 ngày' }
    ],

    // 2 Mẫu Phiên Thực Nghiệm (Baseline vs. Ads-Boosted) chuẩn hóa làm Hồ sơ Kỹ thuật của các phiên trong bảng 180 ngày
    sampledSessionTelemetryProfiles: [
      {
        sessionCode: 'LIVE-PROFILE-A (Baseline Session)',
        datasetSource: '[Kami Ely]-Creator\'s Live Streaming for Goods Promotion List (180 ngày)',
        sessionType: {
          vi: 'Mẫu Phiên Tiêu Chuẩn (Ngân sách Ads tối thiểu - 5h07m)',
          en: 'Baseline Session Profile (Minimal Ads Spend - 5h07m)'
        },
        duration: '5 giờ 07 phút 26 giây',
        totalGmv: '9.250.675 VNĐ',
        rawGmv: 9250675,
        unitsSold: 83,
        viewers: '1.620 người',
        views: '2,37K lượt xem',
        impressions: '53,52K lượt (10,44K/giờ)',
        gmvPerHour: '1,81 triệu VNĐ/giờ',
        impressionGpm: '172,86K VNĐ',
        avgWatchTimeSec: 30,
        viewsOver1Min: 229,
        previewEntryRatePct: 2.62,
        productClickRatePct: 4.43,
        liveCtrPct: 48.57,
        skuOrderCvrPct: 3.5,
        commentRatePct: 9.9,
        likeRatePct: 52.91,
        adSpend: '678.750 VNĐ',
        rawAdSpend: 678750,
        roas: 13.63,
        trafficBreakdown: {
          feedProposalGmvPct: 49.71,
          livePreviewGmvPct: 41.14,
          searchGmvPct: 8.26
        },
        nonFollowerGmvSharePct: 92.0,
        followerGmvSharePct: 8.0,
        heroSku: {
          productId: '1732394234571031644',
          productName: 'Chân Váy Ngắn Form Chữ A Dáng Ôm (CV11)',
          clicks: 17900,
          ctrPct: 5.51,
          orders: 57,
          gmv: '9.091.674 VNĐ',
          gmvShareOfSessionPct: 98.28
        }
      },
      {
        sessionCode: 'LIVE-PROFILE-B (Ads-Boosted Session)',
        datasetSource: '[Kami Ely]-Creator\'s Live Streaming for Goods Promotion List (180 ngày)',
        sessionType: {
          vi: 'Mẫu Phiên Bùng Nổ Đòn Bẩy Ads (Tối ưu Search & Ads 3,2x - 3h36m)',
          en: 'Ads-Scaled Session Profile (Search & 3.2x Ads Leverage - 3h36m)'
        },
        duration: '3 giờ 36 phút 07 giây',
        totalGmv: '20.649.761 VNĐ',
        rawGmv: 20649761,
        unitsSold: 188,
        viewers: '3.020 người',
        views: '4,33K lượt xem',
        impressions: '94,76K lượt (26,31K/giờ)',
        gmvPerHour: '5,73 triệu VNĐ/giờ',
        impressionGpm: '217,92K VNĐ',
        avgWatchTimeSec: 24,
        viewsOver1Min: 363,
        previewEntryRatePct: 3.17,
        productClickRatePct: 4.57,
        liveCtrPct: 46.51,
        skuOrderCvrPct: 4.3,
        commentRatePct: 7.73,
        likeRatePct: 50.93,
        adSpend: '2.170.000 VNĐ',
        rawAdSpend: 2170000,
        roas: 9.52,
        trafficBreakdown: {
          feedProposalGmvPct: 37.4,
          livePreviewGmvPct: 25.09,
          searchGmvPct: 15.97,
          searchViewsPct: 40.56
        },
        nonFollowerGmvSharePct: 94.0,
        followerGmvSharePct: 6.0,
        heroSku: {
          productId: '1732394234571031644',
          productName: 'Chân Váy Ngắn Form Chữ A Dáng Ôm (CV11)',
          clicks: 24093,
          ctrPct: 7.43,
          orders: 130,
          gmv: '20.335.121 VNĐ',
          gmvShareOfSessionPct: 98.48
        }
      }
    ] as SynchronizedLiveSessionTelemetry[]
  }
};
