/**
 * Case Study Unified Backend Data Payloads & Domain Models
 */

export interface KamiElyWeeklyTrend {
  date: string;
  units: number;
  gmv: number;
  live: number;
  video: number;
}

export interface KamiElyTopSKU {
  code: string;
  name: string;
  category: string;
  price: number;
  units: number;
  gmv: number;
  commission: number;
}

export interface KamiElyTopAffiliate {
  id: string;
  name: string;
  type: string;
  followers: number;
  units: number;
  gmv: number;
  liveGpm: string;
  videoGpm: string;
}

export interface KamiElyTimeSeriesRow {
  date: string;
  dateLabel: string;
  original: number;
  trend: number;
  seasonal: number;
  residual: number;
  liveStreams: number;
}

export interface KamiElyLiveStream {
  id?: number;
  channelType: 'shop' | 'creator';
  title: string;
  creator?: string;
  duration?: string;
  viewers: number;
  units: number;
  gmv: number;
  sessionDate?: string;
}

export interface KamiElyVideo {
  id?: number;
  channelType: 'shop' | 'creator';
  title: string;
  author?: string;
  views: string | number;
  likes?: string | number;
  units: number;
  gmv: number;
  interactionRate?: string;
  videoDate?: string;
}

export interface KamiElyCollaborativeStore {
  rank: number;
  name: string;
  storeName: string;
  category: string;
  totalShopUnits: string;
  affiliatedProducts: number;
  bestSeller: string;
  creatorUnitsSold: number;
  unitsSold: string;
  unitsShare: string;
  creatorGmv: number;
  gmv: string;
  gmvDisplay: string;
  gmvShare: string;
  liveSessions: number;
  videosCount: number;
}

export interface KamiElyDataScope {
  id?: number;
  scopeCode: string;
  scopeType: 'shop' | 'creator';
  titleVi: string;
  titleEn: string;
  timeframeVi: string;
  timeframeEn: string;
  timeframeBadge: string;
  periodVi: string;
  periodEn: string;
  totalGmv: string;
  totalUnits: string;
  keyHighlights: string[];
  screenshotIds: string[];
}

export interface KamiElyDataPayload {
  weeklyTrends: KamiElyWeeklyTrend[];
  topSkus: KamiElyTopSKU[];
  topAffiliates: KamiElyTopAffiliate[];
  timeSeries?: KamiElyTimeSeriesRow[] | null;
  dapStats?: any;
  shopOverview?: Record<string, any>;
  creatorProfile?: Record<string, any>;
  collaborativeStores?: any[];
  dataScopes?: any[];
  livestreams?: any[];
  videos?: any[];
  hourlyActivity?: { hour: string; posts: number; engagement: number }[];
  activityHighlights?: Record<string, any>;
  demographics?: {
    gender: { name: string; value: number; color: string }[];
    age: { group: string; value: number; color: string }[];
    locations: { city: string; cityEn: string; value: number }[];
  };
  videoStats?: Record<string, any>;
  isLiveDb?: boolean;
}

export interface HeritageJapanTouristRow {
  year: string;
  value: number;
  counterfactual?: number;
  isThesis: boolean;
  policyEvent?: string;
  source?: string;
}

export interface HeritageJapanSpendRow {
  year: string;
  value: number;
  isThesis: boolean;
  source?: string;
}

export interface HeritageJapanRegionalRow {
  year: string;
  kyoto: number;
  nara: number;
}

export interface HeritageJapanDataPayload {
  tourists: HeritageJapanTouristRow[];
  spend: HeritageJapanSpendRow[];
  regional: HeritageJapanRegionalRow[];
  isLiveDb?: boolean;
}

export interface LibraryBusLatencyBenchmark {
  endpoint: string;
  withoutCache: number;
  withCache: number;
  reduction: string;
}

export interface LibraryBusWeeklyActivity {
  day: string;
  borrows: number;
  returns: number;
  activeUsers: number;
}

export interface LibraryBusFleetItem {
  id?: string;
  name: string;
  licensePlate: string;
  status: string;
  capacity: number;
  bookCount: number;
  locationName?: string;
}

export interface LibraryBusDataPayload {
  latencyBenchmarks: LibraryBusLatencyBenchmark[];
  weeklyActivity: LibraryBusWeeklyActivity[];
  fleet: LibraryBusFleetItem[];
  inventoryStats?: {
    totalBooks: number;
    totalBuses: number;
    totalBorrows: number;
  } | null;
  isLiveDb?: boolean;
}
