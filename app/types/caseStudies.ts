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
  commercialStages?: KamiEly7StagesPayload;
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

// ---------------------------------------------------------------------------
// KAMI ELY 7-STAGE COMMERCIAL DATA PAYLOADS
// ---------------------------------------------------------------------------

export interface BilingualText {
  vi: string;
  en: string;
}

export interface Stage1Payload {
  tableRows: Array<{ key: string; rows: number; columns: number; label: BilingualText }>;
  totalRows: number;
  pipelineMeta: { generator: string; generatedAt: string; tables: number; rows: number };
  subQuestions: Array<{
    id: number;
    question: BilingualText;
    metrics: BilingualText;
    table: string;
    decision: BilingualText;
    iconName: string;
    tone: 'cyan' | 'amber';
  }>;
  architectureLayers: Array<{
    layer: string;
    badge: string;
    title: BilingualText;
    subtitle: BilingualText;
    schemas: string[];
    responsibilities: BilingualText[];
    tone: 'cyan' | 'amber' | 'slate';
  }>;
  dataFlowSteps: Array<{
    step: number;
    phase: BilingualText;
    action: BilingualText;
    tables: string;
    cadence: BilingualText;
  }>;
  pipelineChecklist: Array<{
    id: number;
    area: BilingualText;
    status: 'passed' | 'warning' | 'audit';
    detail: BilingualText;
    evidence: string;
  }>;
  dataGrains: Array<{
    grain: BilingualText;
    table: string;
    key: string;
    desc: BilingualText;
  }>;
  reconciliationRules: Array<{
    check: BilingualText;
    expected: BilingualText;
    actual: BilingualText;
    status: 'pass' | 'warn' | 'info';
    statusLabel: BilingualText;
    note: BilingualText;
  }>;
  pipelineSteps: Array<{
    step: string;
    title: BilingualText;
    detail: BilingualText;
    iconName: string;
    badge: string;
  }>;
}

export interface Stage2Payload {
  dataModelTables: Array<{
    name: string;
    window: BilingualText;
    rows: number;
    grain: BilingualText;
    joinKey: string | BilingualText;
    desc: BilingualText;
    tag: string;
  }>;
  profilingFindings: Array<{
    entity: string;
    badge: BilingualText;
    tone: 'cyan' | 'amber' | 'rose';
    finding: BilingualText;
    stat: string;
    detail: BilingualText;
  }>;
  crossReconciliations: Array<{
    test: BilingualText;
    metric: string;
    detail: BilingualText;
    status: 'pass' | 'info' | 'warn';
    statusLabel: BilingualText;
  }>;
  reconciliationChecks: Array<{ code: string; status: string; title: BilingualText }>;
  cleaningRules: Array<{
    ruleNumber: number;
    title: BilingualText;
    severity: 'critical' | 'high' | 'medium';
    targetTable: string;
    rawIssue: BilingualText;
    transformLogic: string;
    impact: BilingualText;
  }>;
  legacyCorrections: Array<{
    caseNumber: string;
    title: BilingualText;
    flawedClaim: BilingualText;
    empiricalProof: BilingualText;
    correctedFact: BilingualText;
  }>;
  priceBands: Array<{ band: string; sku: number; units: number; gmv: number; skus: number }>;
  paretoCurve: Array<{ sku: number; gmv: number }>;
  skuHealthByCategory: Array<{ category: string; withSales: number; dead: number }>;
  productFacts: Record<string, any>;
}

export interface Stage3LagRow {
  lag: string;
  rLives: number;
  rKoc: number;
  desc?: BilingualText | string;
}

export interface Stage3Payload {
  dailySeries: Array<{ date: string; label: string; gmv: number; ma7: number | null; cumulativeB: number }>;
  weeklySeries: Array<{ label: string; gmv: number; lives: number; koc: number; gmvPerLive: number }>;
  monthlyTable: Array<{
    ym: string;
    label: string;
    days: number;
    isPartial: boolean;
    gmv: number;
    share: number;
    gmvPerDay: number;
    units: number;
    aov: number;
    momRaw: number | null;
    momDay: number | null;
  }>;
  dowSeasonality: Array<{
    dow: string;
    mean: number;
    median: number;
    index: number;
    growthMed: number;
    peakMed: number;
    declineMed: number;
  }>;
  monthlySeries: Array<{ month: string; label: string; gmvPerDay: number; momPerDayPct: number | null; isPartial: boolean; days: number }>;
  dowSeries: Array<{ day: string; dayEn: string; medianGmv: number }>;
  lagData: Stage3LagRow[];
  storeFacts: Record<string, any>;
  dailyMean: number;
  dailyStd: number;
}

export interface CohortRetentionMonth {
  count: number;
  pct: number;
  censored?: boolean;
}

export interface Stage4Payload {
  cohortScaleData: Array<{ ym: string; newCreators: number; activeAppear: number; activeSales: number; note: BilingualText }>;
  creatorTiers: Array<{ tier: string; creators: number; creatorsPct: number; activationPct: number; gmvPct: number; gmvPctExTop1: number | null }>;
  affiliateTop10: Array<{ rank: string; name: string; sharePct: number; cumulativePct: number; sessions: number }>;
  affiliateTopExGirlStyle: Array<{ rank: string; name: string; sharePct: number; cumulativePct: number; sessions: number }>;
  topCreatorMonthly: Array<{ month: string; label: string; gmvM: number; sessions: number; liveHours: number; gmvPerHourM: number }>;
  shopWideLiveMonthly: Array<{ month: string; label: string; gmvM: number; sessions: number; liveHours: number; gmvPerHourM: number }>;
  retentionMatrix: Array<{
    cohort: string;
    size: number;
    m0: CohortRetentionMonth | null;
    m1: CohortRetentionMonth | null;
    m2: CohortRetentionMonth | null;
    m3: CohortRetentionMonth | null;
    m4: CohortRetentionMonth | null;
    m5: CohortRetentionMonth | null;
  }>;
  cohortGmvData: Array<{ cohort: string; withGs: number; withoutGs: number; size: number; note: BilingualText }>;
  creatorFacts: Record<string, any>;
}

export interface Stage5Payload {
  funnels: Record<string, { title: BilingualText; steps: Array<{ label: BilingualText; value: number }> }>;
  donutFunnels: Record<string, any>;
  liveDuration: Array<{ bucket: string; sessions: number; conversionPct: number; gmvPerHourM: number }>;
  gpmCompare: Record<string, any>;
  monthlyOwnLiveFunnel: Array<{ ym: string; sessions: number; orderRate: number; avgViewers: number; unitsPer1k: number; gmvPerView: number; gmvM: number }>;
  adsComparisonCards: Record<string, any>;
  timeSlotData: Array<{ slot: string; n: number; viewers: number; gmvM: number; gmvPerViewer: number; gmvPerHourM: number; medianDur: number; note: BilingualText }>;
  heatmapMatrix: Array<{ slot: string; d1: { n: number; gmvPerV: number }; d2: { n: number; gmvPerV: number }; d3: { n: number; gmvPerV: number }; d4: { n: number; gmvPerV: number } }>;
  funnelFacts: Record<string, any>;
}

export interface Stage6Payload {
  categoryData: Array<{ name: BilingualText; n: number; orderRate: number; gmvM: number; gmvShare: number; color: string }>;
  topHashtags: Array<{ tag: string; count: number; type: 'generic' | 'product' }>;
  anomalyRegistry: Array<{ type: BilingualText; target: string; metric: string; rootCause: BilingualText; treatment: BilingualText; status: string }>;
  zScoreSeries: Array<{ date: string; label: string; z: number; isOutlier: boolean }>;
  outlierDays: Array<{ date: string; label: string; z: number; isOutlier: boolean }>;
  treatmentComparison: Array<{ key: string; label: BilingualText; mean: number; std: number; meanM: number; stdM: number }>;
  categoryMatch: Record<string, any>;
}

export interface Stage7Payload {
  qualityGates: Array<{ gate: BilingualText; scope: string; expected: BilingualText | string; actual: BilingualText | string; level: 'error' | 'warn'; status: 'passed' | 'failed'; note: BilingualText }>;
  piiInventory: Array<{ field: BilingualText | string; type: BilingualText; risk: BilingualText; treatment: BilingualText }>;
  kAnonymity: Array<{ tier: string; creators: number; passes: boolean }>;
  hashAudit: Array<{ stage: string; table: string; records: number; hashMethod: string; saltStatus: string }>;
  schemaTables: Array<{ tableName: string; grain: BilingualText; records: number; columns: number; description: BilingualText }>;
  cronCadence: Array<{ pipeline: string; cadence: string; window: string; trigger: string; targetTable: string }>;
}

export interface KamiEly7StagesPayload {
  stage1: Stage1Payload;
  stage2: Stage2Payload;
  stage3: Stage3Payload;
  stage4: Stage4Payload;
  stage5: Stage5Payload;
  stage6: Stage6Payload;
  stage7: Stage7Payload;
}
