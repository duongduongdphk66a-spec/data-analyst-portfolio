// FILE: app/data/kami-ely/reconciliation.ts
// MA TRẬN ĐỐI SOÁT ĐA TẦNG & ĐỒNG BỘ HÓA DỮ LIỆU KAMI ELY (@shop_official)
// Bảo toàn 100% số liệu gốc của 10 tệp Excel & Đồng bộ chu kỳ 231 ngày

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface TimeWindowComparisonRow {
  metricId: string;
  metricName: LocalizedText;
  shopAllTime: LocalizedText;
  creatorAllTime: LocalizedText;
  shop180d: LocalizedText;
  creator180d: LocalizedText;
  shop90d: LocalizedText;
  creator90d: LocalizedText;
  auditNote: LocalizedText;
}

export interface DatasetCatalogItem {
  id: string;
  fileName: string;
  tableName: string;
  timeWindow: LocalizedText;
  scope: 'SHOP_WIDE' | 'SELF_CHANNEL' | 'HYBRID';
  granularity: LocalizedText;
  joinKeys: string;
  rowCount: number;
  totalUnits: number;
  totalGmvVnd: number;
  formattedGmv: string;
  keyInsight: LocalizedText;
}

export interface ReconciliationRuleItem {
  ruleCode: string;
  title: LocalizedText;
  sourceAValue: LocalizedText;
  sourceBValue: LocalizedText;
  deltaSummary: LocalizedText;
  technicalResolution: LocalizedText;
  status: 'VERIFIED_EXACT' | 'GROSS_VS_NET' | 'WINDOW_SYNCED';
}

export interface SynchronizedTelemetryItem {
  moduleId: string;
  moduleName: LocalizedText;
  synchronizedWindow: string;
  csvAnchorMetric: LocalizedText;
  telemetryMetrics: LocalizedText[];
  strategicTakeaway: LocalizedText;
}

export const kamiReconciliationData = {
  // 1. Metadata Tổng quan Kiểm toán Dữ liệu
  auditSummary: {
    collectionDate: '2026-09-05',
    storeFoundedDate: '2022-08-18',
    master180dPeriod: '09/03/2026 – 04/09/2026 (180 ngày)',
    attribution90dPeriod: '90 ngày gần nhất (Trong chu kỳ 180 ngày)',
    totalRawTables: 10,
    totalCsvFiles: 10,
    totalDatabaseRows: 23364,
    hanoiFollowersSharePct: 43.0,
    femaleAudienceSharePct: 73.0,
    age18To24SharePct: 60.0
  },

  // 2. Bảng Đối Chiếu Tổng Quan: Toàn Shop vs. Kênh Chính Chủ (@shop_official) qua 3 Khung Thời Gian
  multiWindowMatrix: [
    {
      metricId: 'total-gmv',
      metricName: { vi: 'Tổng Doanh Thu (GMV)', en: 'Total GMV' },
      shopAllTime: { vi: '31,6 Tỉ đ (All-time) | 15,01 Tỉ đ (231d)', en: '31.6B (All-time) | 15.01B (231d)' },
      creatorAllTime: { vi: '9,2 Tỉ đ (29,1%)', en: '9.2B VND (29.1%)' },
      shop180d: { vi: '12.735.128.067 đ (~12,74 Tỉ)', en: '12,735,128,067 VND (~12.74B)' },
      creator180d: {
        vi: '5,80 Tỉ đ Net (45,7%) | 7,89 Tỉ đ Gross CSV',
        en: '5.80B Net (45.7%) | 7.89B Gross CSV'
      },
      shop90d: { vi: '6.136.205.973 đ (~6,14 Tỉ)', en: '6,136,205,973 VND (~6.14B)' },
      creator90d: { vi: '3.026.026.869 đ (49,31%)', en: '3,026,026,869 VND (49.31%)' },
      auditNote: {
        vi: 'Tỷ trọng tự gánh của kênh @shop_official tăng mạnh từ 29,1% (All-time 31,6 Tỉ) lên 45,7% (180d 12,74 Tỉ) và 49,31% (90d 6,14 Tỉ). Tập mẫu phân tích 231 ngày (09/03–25/10/2026) đạt 15,01 Tỉ đ (101.896 SP).',
        en: '@shop_official share rose from 29.1% (All-time 31.6B) to 45.7% (180d 12.74B) and 49.31% (90d 6.14B). The 231-day analysis sample (Mar 09–Oct 25, 2026) totals 15.01B VND (101,896 units).'
      }
    },
    {
      metricId: 'units-sold',
      metricName: { vi: 'Tổng Sản Lượng Bán (Units)', en: 'Total Units Sold' },
      shopAllTime: { vi: '238,4k SP (All-time) | 101.896 SP (231d)', en: '238.4k (All-time) | 101,896 (231d)' },
      creatorAllTime: { vi: '69,9k SP (29,3%)', en: '69.9k units (29.3%)' },
      shop180d: { vi: '85.500 SP (TB 475 SP/ngày)', en: '85,500 units (Avg 475/day)' },
      creator180d: {
        vi: '39,3k SP Net (46,0%) | 54.961 SP Gross CSV',
        en: '39.3k Net (46.0%) | 54,961 Gross CSV'
      },
      shop90d: { vi: '40.229 SP (331 SKUs)', en: '40,229 units (331 SKUs)' },
      creator90d: { vi: '20.027 SP (49,78% CSV | 49,76% UI)', en: '20,027 units (49.78% CSV | 49.76% UI)' },
      auditNote: {
        vi: 'Khớp chính xác giữa bảng _product data (40.229 SP) và Creator Goods (20.027 SP).',
        en: 'Exact match between _product data (40,229 units) and Creator Goods (20,027 units).'
      }
    },
    {
      metricId: 'live-gmv',
      metricName: { vi: 'Doanh Thu Livestream', en: 'Livestream GMV' },
      shopAllTime: { vi: 'Không tách riêng trên UI', en: 'Not split on All-time UI' },
      creatorAllTime: { vi: '5,9 Tỉ đ (43,9k SP)', en: '5.9B VND (43.9k units)' },
      shop180d: { vi: '9.262.277.940 đ (67.254 SP)', en: '9,262,277,940 VND (67,254 units)' },
      creator180d: {
        vi: '4,90 Tỉ đ Net (34,1k SP) | 7.023.530.158 đ Gross (49.817 SP)',
        en: '4.90B Net (34.1k units) | 7.02B Gross (49,817 units)'
      },
      shop90d: { vi: '55,93% GMV (~3,43 Tỉ đ | 59,01% SP)', en: '55.93% GMV (~3.43B | 59.01% units)' },
      creator90d: { vi: 'Đầu tàu chốt đơn trực tiếp', en: 'Primary direct conversion engine' },
      auditNote: {
        vi: 'CSV ghi nhận Gross GMV lúc kết thúc phiên (7,02 Tỉ đ), còn UI 080547 ghi nhận Net GMV sau hủy/hoàn (4,90 Tỉ đ).',
        en: 'CSV records Gross session order GMV (7.02B), while UI 080547 reports Net settled GMV (4.90B).'
      }
    },
    {
      metricId: 'video-gmv',
      metricName: { vi: 'Doanh Thu Video Ngắn', en: 'Short Video GMV' },
      shopAllTime: { vi: 'Không tách riêng trên UI', en: 'Not split on All-time UI' },
      creatorAllTime: { vi: '3,2 Tỉ đ (26,0k SP)', en: '3.2B VND (26.0k units)' },
      shop180d: {
        vi: '2.170.840.326 đ (13.083 SP - Đo trong 90d)',
        en: '2,170,840,326 VND (13,083 units - Measured in 90d)'
      },
      creator180d: {
        vi: '872,2 Tr đ UI | 870.200.806 đ CSV (5.144 SP)',
        en: '872.2M UI | 870,200,806 VND CSV (5,144 units)'
      },
      shop90d: {
        vi: '21,21% Net (~1,30 Tỉ) | 2,17 Tỉ CSV | 2,40 Tỉ Gross UI',
        en: '21.21% Net (~1.30B) | 2.17B CSV | 2.40B Gross UI'
      },
      creator90d: { vi: 'GPM 28N UI: 134,8k–135,2k đ (4,5x LIVE 28N UI)', en: '28d UI GPM: 134.8k–135.2k VND (4.5x 28d UI LIVE)' },
      auditNote: {
        vi: '94,70% GMV của 4.417 Shoppable Videos đến từ Paid Ads (2.055.758.301 đ), Organic chỉ chiếm 5,30% (115.082.025 đ).',
        en: '94.70% of 4,417 Shoppable Videos GMV comes from Paid Ads (2.055B VND); Organic is only 5.30% (115.08M VND).'
      }
    },
    {
      metricId: 'content-volume',
      metricName: { vi: 'Quy Mô Phiên LIVE & Video', en: 'LIVE & Video Content Volume' },
      shopAllTime: { vi: '12,4k LIVE | 11,2k Video', en: '12.4k LIVEs | 11.2k Videos' },
      creatorAllTime: {
        vi: '2,5k LIVE (TB 2h26p) | 859 Video (551 gắn giỏ)',
        en: '2.5k LIVEs (Avg 2h26m) | 859 Videos (551 shoppable)'
      },
      shop180d: { vi: '7.046 LIVE | 4,8k Video (4.417 gắn giỏ)', en: '7,046 LIVEs | 4.8k Videos (4,417 shoppable)' },
      creator180d: {
        vi: '475 LIVE CSV (470 UI - 95,58% có đơn) | 222 Video',
        en: '475 LIVEs CSV (470 UI - 95.58% converting) | 222 Videos'
      },
      shop90d: { vi: '234 KOC LIVE | 5,4k KOC Video', en: '234 LIVE KOCs | 5.4k Video KOCs' },
      creator90d: {
        vi: '208 LIVE (TB 5,4k views) | 147 Video (TB 16,4k views)',
        en: '208 LIVEs (Avg 5.4k views) | 147 Videos (Avg 16.4k views)'
      },
      auditNote: {
        vi: '2,5k phiên LIVE trên ảnh 080124 là lũy kế All-time từ 2022; trong 180 ngày kênh chính chủ phát 470–475 phiên (~2,6 phiên/ngày).',
        en: '2.5k LIVEs on screenshot 080124 is All-time since 2022; in 180d the official channel hosted 470–475 sessions (~2.6/day).'
      }
    },
    {
      metricId: 'partner-network',
      metricName: { vi: 'Mạng Lưới Đối Tác & Danh Mục', en: 'Partner Network & Catalog' },
      shopAllTime: { vi: '6,0k Affiliates | 179 SP đang bán', en: '6.0k Affiliates | 179 active SKUs' },
      creatorAllTime: { vi: 'Liên kết 4 cửa hàng hợp tác', en: 'Linked to 4 collaborative stores' },
      shop180d: { vi: '2,3k Affiliates hoạt động | 169 SKUs có đơn', en: '2.3k active Affiliates | 169 converting SKUs' },
      creator180d: { vi: '177 SP liên kết (Ghim >375 mã/phiên)', en: '177 linked SKUs (>375 pinned/session)' },
      shop90d: {
        vi: '5.713 Creators (292 có đơn = 5,1%) | 331 SKUs',
        en: '5,713 Creators (292 converting = 5.1%) | 331 SKUs'
      },
      creator90d: { vi: '394 mã niêm yết giỏ hàng chính chủ', en: '394 listings in official creator showcase' },
      auditNote: {
        vi: 'Top 1% KOC (58 người) tạo ra 91,49% GMV Affiliate (1.562,8 Tr đ); riêng @koc_sat01 chiếm 42,9% (732,77 Tr đ / 5.009 SP).',
        en: 'Top 1% KOCs (58 accounts) drive 91.49% of Affiliate GMV (1,562.8M VND); @koc_sat01 alone drives 42.9% (732.77M VND / 5,009 units).'
      }
    }
  ] as TimeWindowComparisonRow[],

  // 3. Danh Mục 8 Bảng Dữ Liệu Gốc (Giữ nguyên 100% số liệu trong MySQL / CSV)
  eightDatasetsCatalog: [
    {
      id: 'ds-01',
      fileName: 'Kami Ely_Store Detail Page_Data Overview (180 ngày).csv',
      tableName: 'kami_store_daily_overview',
      timeWindow: { vi: '180 ngày (09/03 – 04/09/2026)', en: '180 Days (Mar 09 – Sep 04, 2026)' },
      scope: 'SHOP_WIDE',
      granularity: { vi: 'Cấp ngày toàn shop (Daily Time-series)', en: 'Shop-wide Daily Time-series' },
      joinKeys: 'date_id (YYYY-MM-DD)',
      rowCount: 180,
      totalUnits: 85500,
      totalGmvVnd: 12735128067,
      formattedGmv: '12.735.128.067 VNĐ',
      keyInsight: {
        vi: 'Đỉnh tháng 6 đạt 3,77 Tỉ đ (ngày 16/06 lập kỷ lục 315,05 Tr đ / 1.936 SP); đáy ngày 04/09 rơi xuống 5,44 Tr đ (49 SP). Ngày 09/04 spam 106 phiên LIVE chỉ đạt 79,46 Tr đ vs. ngày 25/06 tối ưu 45 phiên đạt 196,09 Tr đ.',
        en: 'June peak reached 3.77B VND (Jun 16 record: 315.05M VND / 1,936 units); Sep 04 trough hit 5.44M VND (49 units). Apr 09 spammed 106 LIVEs for only 79.46M vs. Jun 25 with 45 LIVEs yielding 196.09M VND.'
      }
    },
    {
      id: 'ds-02',
      fileName: '_shop LIVE (180 ngày) [Tập 1: 4.998 + Tập 2: 2.048].xlsx',
      tableName: 'kami_shop_live_180d',
      timeWindow: { vi: '180 ngày (09/03 – 04/09/2026)', en: '180 Days (Mar 09 – Sep 04, 2026)' },
      scope: 'SHOP_WIDE',
      granularity: { vi: 'Cấp phiên LIVE (Chính chủ + Affiliate)', en: 'Session-level (Self + Affiliate LIVE)' },
      joinKeys: 'session_id, creator_id',
      rowCount: 7046,
      totalUnits: 67254,
      totalGmvVnd: 9262277940,
      formattedGmv: '9.262.277.940 VNĐ',
      keyInsight: {
        vi: 'Đóng góp 72,73% tổng GMV 180 ngày toàn shop; trung bình toàn sàn đạt ~1,31 triệu đ và 10 sản phẩm/phiên.',
        en: 'Contributes 72.73% of 180d shop GMV; shop-wide average is ~1.31M VND and 10 units per session.'
      }
    },
    {
      id: 'ds-03',
      fileName: "[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx",
      tableName: 'kami_creator_live_180d',
      timeWindow: { vi: '180 ngày (09/03 – 04/09/2026)', en: '180 Days (Mar 09 – Sep 04, 2026)' },
      scope: 'SELF_CHANNEL',
      granularity: { vi: 'Cấp phiên LIVE kênh chính chủ @shop_official', en: 'Self-operated LIVE Sessions (@shop_official)' },
      joinKeys: 'session_id, start_time',
      rowCount: 475,
      totalUnits: 49817,
      totalGmvVnd: 7023530158,
      formattedGmv: '7.023.530.158 VNĐ (Gross) | 4,90 Tỉ (Net)',
      keyInsight: {
        vi: 'Thu hút 3.292.698 viewers (TB 6.932/phiên); 454/475 phiên có đơn (95,58%). Duy trì lịch ~7,5h/ngày nhưng GPM chỉ đạt 29,2k–30,2k đ.',
        en: 'Attracted 3,292,698 viewers (avg 6,932/session); 454/475 converting sessions (95.58%). ~7.5h/day schedule but GPM is only 29.2k–30.2k VND.'
      }
    },
    {
      id: 'ds-04',
      fileName: "[Kami Ely]-Creator's Video List (180 ngày).xlsx",
      tableName: 'kami_creator_videos_180d',
      timeWindow: { vi: '180 ngày (09/03 – 04/09/2026)', en: '180 Days (Mar 09 – Sep 04, 2026)' },
      scope: 'SELF_CHANNEL',
      granularity: { vi: 'Cấp video đăng trên kênh @shop_official', en: 'Post-level Videos on @shop_official' },
      joinKeys: 'video_id, post_time',
      rowCount: 222,
      totalUnits: 5144,
      totalGmvVnd: 870200806,
      formattedGmv: '870.200.806 VNĐ (UI: 872,2 Tr đ)',
      keyInsight: {
        vi: 'Thu hút 7.971.037 tổng views (6,6M views thương mại); 101/222 video ra đơn (45,5%). Video Top 1 ngày 13/05 bán 856 SP (170,16 Tr đ).',
        en: 'Generated 7,971,037 total views (6.6M commercial views); 101/222 converting videos (45.5%). Top 1 video on May 13 sold 856 units (170.16M VND).'
      }
    },
    {
      id: 'ds-05',
      fileName: '[Kami Ely]_Shoppable_Videos (180 ngày).xlsx',
      tableName: 'kami_shoppable_videos_180d',
      timeWindow: { vi: 'Đăng 180 ngày / Đo lường GMV 90 ngày', en: 'Posted in 180d / GMV Measured in 90d' },
      scope: 'HYBRID',
      granularity: { vi: 'Cấp video gắn giỏ hàng toàn sàn', en: 'Shop-wide Shoppable Videos' },
      joinKeys: 'video_id, product_id, is_ads',
      rowCount: 4417,
      totalUnits: 13083,
      totalGmvVnd: 2170840326,
      formattedGmv: '2.170.840.326 VNĐ',
      keyInsight: {
        vi: '3.482 video chạy Ads (78,83%) tạo ra 2.055.758.301 đ (94,70% GMV, 12.398 SP); 935 video Organic (21,17%) chỉ đạt 115.082.025 đ (5,30% GMV, 685 SP).',
        en: '3,482 Ads videos (78.83%) drove 2,055,758,301 VND (94.70% GMV, 12,398 units); 935 Organic videos (21.17%) yielded only 115,082,025 VND (5.30% GMV, 685 units).'
      }
    },
    {
      id: 'ds-06',
      fileName: '_ product data (90 ngày).xlsx',
      tableName: 'kami_product_data_90d',
      timeWindow: { vi: '90 ngày gần nhất', en: 'Last 90 Days' },
      scope: 'SHOP_WIDE',
      granularity: { vi: 'Cấp mã sản phẩm toàn shop (SKU-level)', en: 'Shop-wide Product SKU-level' },
      joinKeys: 'product_id (SKU)',
      rowCount: 331,
      totalUnits: 40229,
      totalGmvVnd: 6136205973,
      formattedGmv: '6.136.205.973 VNĐ',
      keyInsight: {
        vi: 'Sports & Outdoor chiếm 69,31% GMV (27.208 SP); Womenswear chiếm 28,00% GMV (10.764 SP). Mã Chân váy chữ A (CV11) đứng #1 sản lượng toàn shop với 6.375 SP (735,07 Tr đ).',
        en: 'Sports & Outdoor drives 69.31% GMV (27,208 units); Womenswear drives 28.00% GMV (10,764 units). A-line Skirt (CV11) ranks #1 in volume with 6,375 units (735.07M VND).'
      }
    },
    {
      id: 'ds-07',
      fileName: "[Kami Ely]-Creator's Goods for Sale List (90 ngày).xlsx",
      tableName: 'kami_creator_goods_90d',
      timeWindow: { vi: '90 ngày gần nhất', en: 'Last 90 Days' },
      scope: 'SELF_CHANNEL',
      granularity: { vi: 'Cấp niêm yết sản phẩm trên kênh chính chủ', en: 'Official Channel Product Listings' },
      joinKeys: 'product_id (LEFT JOIN kami_product_data_90d)',
      rowCount: 394,
      totalUnits: 20027,
      totalGmvVnd: 3026026869,
      formattedGmv: '3.026.026.869 VNĐ',
      keyInsight: {
        vi: 'Tự gánh 49,78% sản lượng (49,76% UI) và 49,31% GMV toàn shop. Tự gánh >60% các mã Bikini (H36, H32) nhưng mới chỉ khai thác 21,0% mã Chân váy CV11 (1.338 / 6.375 SP).',
        en: 'Carries 49.78% volume (49.76% UI) and 49.31% shop GMV. Drives >60% of Bikini SKUs (H36, H32) but only 21.0% of CV11 Skirt (1,338 / 6,375 units).'
      }
    },
    {
      id: 'ds-08',
      fileName: '_Creators_merged (90 ngày).xlsx',
      tableName: 'kami_creators_merged_90d',
      timeWindow: { vi: '90 ngày gần nhất', en: 'Last 90 Days' },
      scope: 'HYBRID',
      granularity: { vi: 'Cấp Nhà sáng tạo (1 Chính chủ + 5.712 KOCs)', en: 'Creator-level (1 Official + 5,712 KOCs)' },
      joinKeys: 'creator_id, creator_handle',
      rowCount: 5713,
      totalUnits: 31599,
      totalGmvVnd: 4734186743,
      formattedGmv: '4.734.186.743 VNĐ',
      keyInsight: {
        vi: 'Gồm Kênh chính chủ @shop_official (3.026.026.869 đ / 20.027 SP = 63,92% khối Creator) và 5.712 KOC ngoài (1.708.159.874 đ / 11.572 SP = 36,08% khối Creator). Phần chênh với _product data đúng bằng Kệ hàng (1.402.019.230 đ = 22,85%).',
        en: 'Includes @shop_official (3,026,026,869 VND / 20,027 units = 63.92% of Creators) and 5,712 external KOCs (1,708,159,874 VND / 11,572 units = 36.08%). Remainder vs. _product data equals Product Card (1,402,019,230 VND = 22.85%).'
      }
    }
  ] as DatasetCatalogItem[],

  // 4. Sáu Quy Tắc Kiểm Toán & Giải Mã Mâu Thuẫn Liên Bảng (Reconciliation Rules)
  reconciliationRules: [
    {
      ruleCode: 'REC-01',
      title: {
        vi: 'Đối soát Gross GMV (CSV Cấp Phiên) vs. Net Settled GMV (Biểu đồ UI 180 Ngày)',
        en: 'Gross Session GMV (CSV) vs. Net Settled GMV (180d UI Dashboard)'
      },
      sourceAValue: {
        vi: 'CSV Chính chủ (Live + Video): 7.893.730.964 đ (54.961 SP) | Riêng Live: 7.023.530.158 đ (475 phiên)',
        en: 'Official CSV (Live + Video): 7,893,730,964 VND (54,961 units) | Live: 7,023,530,158 VND (475 sessions)'
      },
      sourceBValue: {
        vi: 'Ảnh 080547 & 080553 (180d UI): 5,80 Tỉ đ (39,3k SP) | Riêng Live: 4,90 Tỉ đ (470 phiên chuẩn hóa)',
        en: 'Screenshots 080547 & 080553 (180d UI): 5.80B VND (39.3k units) | Live: 4.90B VND (470 normalized sessions)'
      },
      deltaSummary: {
        vi: 'Chênh lệch 2,09 Tỉ đ (-26,5% toàn kênh; -30,2% riêng mảng LIVE) và 5 phiên thử nghiệm/lỗi kỹ thuật',
        en: 'Delta of 2.09B VND (-26.5% channel-wide; -30.2% on LIVE) and 5 test/aborted sessions'
      },
      technicalResolution: {
        vi: 'CSV xuất trực tiếp tổng giá trị đơn đặt hàng gộp tại thời điểm kết thúc phiên (Gross Order GMV), còn biểu đồ tổng hợp đã khấu trừ đơn hủy, hoàn trả hoặc chưa thanh toán (Net Attributed GMV). Không sửa số trong bảng MySQL, hiển thị song song cả Gross và Net.',
        en: 'CSV exports Gross Order GMV at session end, whereas the summary dashboard deducts cancellations, returns, and unpaid orders (Net Attributed GMV). Both metrics are preserved side-by-side without altering MySQL tables.'
      },
      status: 'GROSS_VS_NET'
    },
    {
      ruleCode: 'REC-02',
      title: {
        vi: 'Giải mã "Ảo giác 4,73 Tỉ đ Affiliate" & Khớp nối Ba Kênh Giao Dịch 90 Ngày',
        en: 'Resolving the "4.73B Affiliate Illusion" & 3-Channel 90d Reconciliation'
      },
      sourceAValue: {
        vi: '_product data (90d): 6.136.205.973 đ (40.229 SP) | Ảnh 073520: Chính chủ 49,3% - Affiliate 27,83% - Kệ hàng 22,87%',
        en: '_product data (90d): 6,136,205,973 VND (40,229 units) | UI 073520: Self 49.3% - Affiliate 27.83% - Card 22.87%'
      },
      sourceBValue: {
        vi: '_Creators_merged (90d) & Ảnh 073657: Ghi nhận tổng khối Creators = 4.734.186.743 đ (31.599 SP)',
        en: '_Creators_merged (90d) & UI 073657: Reports total Creators = 4,734,186,743 VND (31,599 units)'
      },
      deltaSummary: {
        vi: '4,734 Tỉ đ là gộp cả Chính chủ (3,026 Tỉ đ) + 5.712 KOC ngoài (1,708 Tỉ đ); phần dư 1,402 Tỉ đ khớp phần Kệ hàng (1.402.019.230 đ)',
        en: '4.734B VND combines Official Channel (3.026B) + 5,712 external KOCs (1.708B); the 1.402B remainder matches Product Card (1,402,019,230 VND)'
      },
      technicalResolution: {
        vi: 'Tách bạch rõ trên UI và SQL View: (1) Kênh chính chủ = 3.026.026.869 đ (49,31% GMV | 49,78% SP); (2) 5.712 KOC ngoài = 1.708.159.874 đ (27,84% GMV | 28,77% SP); (3) Thẻ sản phẩm = 6.136.205.973 - 4.734.186.743 = 1.402.019.230 đ (22,85% GMV | 21,45% SP).',
        en: 'Explicitly separated in UI & SQL View: (1) Official Channel = 3,026,026,869 VND (49.31% GMV | 49.78% units); (2) 5,712 External KOCs = 1,708,159,874 VND (27.84% GMV | 28.77% units); (3) Product Card = 1,402,019,230 VND (22.85% GMV | 21.45% units).'
      },
      status: 'VERIFIED_EXACT'
    },
    {
      ruleCode: 'REC-03',
      title: {
        vi: 'Đối soát Cửa Sổ 28 Ngày Đầu Chu Kỳ (09/03 – 05/04/2026) Trong Chuỗi FastMoss',
        en: 'Reconciling the Opening 28-Day FastMoss Window (Mar 09 – Apr 05, 2026)'
      },
      sourceAValue: {
        vi: 'Tổng 28 dòng đầu trong FastMoss Store Overview (09/03 – 05/04/2026): 1.376.597.102 đ (~1,38 Tỉ đ) và 11.051 SP',
        en: 'Sum of first 28 rows in FastMoss Store Overview (Mar 09 – Apr 05, 2026): 1,376,597,102 VND (~1.38B) and 11,051 units'
      },
      sourceBValue: {
        vi: 'Ảnh chụp tổng quan FastMoss 28 ngày đầu kỳ: ~1,35–1,40 Tỉ đ và ~10,5k–11,1k SP (làm tròn hiển thị UI)',
        en: 'FastMoss 28-day UI summary snapshot: ~1.35–1.40B VND and ~10.5k–11.1k units (UI display rounding)'
      },
      deltaSummary: {
        vi: 'Sai lệch ước tính 0,05–3,3% giữa ảnh chụp giao diện FastMoss và tệp xuất Excel/CSV theo ngày',
        en: '0.05–3.3% estimation variance between FastMoss UI summaries and daily Excel/CSV exports'
      },
      technicalResolution: {
        vi: 'Chốt bảng Store_Daily_Overview 231 ngày từ tệp xuất FastMoss làm nguồn chuẩn duy nhất (SSOT); không gộp trộn với dữ liệu nội bộ bên ngoài phạm vi 10 tệp FastMoss.',
        en: 'Standardized on the 231-day FastMoss Store_Daily_Overview export as the Single Source of Truth (SSOT), excluding any out-of-scope internal shop data.'
      },
      status: 'WINDOW_SYNCED'
    },
    {
      ruleCode: 'REC-04',
      title: {
        vi: 'Khử Trùng 595 Phiên LIVE Giữa Affiliate_Livestreams và Creator_Livestreams (Tránh Cộng Đôi +3,05 Tỷ)',
        en: 'Deduplicating 595 Overlapping LIVE Sessions Between Affiliate_Livestreams and Creator_Livestreams'
      },
      sourceAValue: {
        vi: 'Affiliate_Livestreams (8.355 phiên) = 10,47 Tỉ đ | Creator_Livestreams (600 phiên, 595 phiên trong khung) = 7,59 Tỉ đ',
        en: 'Affiliate_Livestreams (8,355 sessions) = 10.47B VND | Creator_Livestreams (600 sessions, 595 in window) = 7.59B VND'
      },
      sourceBValue: {
        vi: 'Cộng gộp thô = 18,06 Tỉ đ (120% GMV toàn shop 15,01 Tỉ đ); mốc đồng bộ 226 ngày đến 20/10 đạt 14,84 Tỉ đ',
        en: 'Naive sum = 18.06B VND (120% of 15.01B store GMV); synchronized 226-day cutoff through Oct 20 = 14.84B VND'
      },
      deltaSummary: {
        vi: 'Loại trừ bẫy cộng trùng 595 phiên của kênh chính chủ @shop_official (nằm sẵn trong cả 2 bảng xuất FastMoss)',
        en: 'Eliminates double-counting of 595 @shop_official sessions present in both FastMoss exports'
      },
      technicalResolution: {
        vi: 'Giữ Affiliate_Livestreams làm nguồn tổng kênh LIVE (10,47 Tỉ đ = 69,8% GMV 231d / 70,5% GMV 226d) và dùng Creator_Livestreams làm bảng chi tiết riêng cho 600 phiên kênh chính chủ sau khi bù múi giờ +13h về UTC+7.',
        en: 'Uses Affiliate_Livestreams as the deduplicated LIVE total (10.47B = 69.8% of 231d / 70.5% of 226d GMV) and Creator_Livestreams solely for official-channel session drill-down after +13h UTC+7 alignment.'
      },
      status: 'VERIFIED_EXACT'
    },
    {
      ruleCode: 'REC-05',
      title: {
        vi: 'Đối Soát Kênh Vệ Tinh @koc_sat01 Qua Hai Kỳ FastMoss (Hợp Nhất 2 Tên Hiển Thị Theo KOC ID Ẩn Danh)',
        en: 'Reconciling In-House Satellite @koc_sat01 Across FastMoss Snapshots (Merging 2 Display Names by Pseudonymized ID)'
      },
      sourceAValue: {
        vi: 'Kỳ đầu chu kỳ FastMoss (tháng 3/2026): @koc_sat01 mới khởi động lịch phát sóng vệ tinh',
        en: 'Early FastMoss cycle (Mar 2026): @koc_sat01 ramping up satellite broadcast cadence'
      },
      sourceBValue: {
        vi: 'Tổng hợp 231 ngày FastMoss Affiliate_Livestreams: @koc_sat01 đạt 261 phiên LIVE, đóng góp 1,26 Tỉ đ (12,0% tổng Live)',
        en: '231-day FastMoss Affiliate_Livestreams rollup: @koc_sat01 ran 261 LIVE sessions generating 1.26B VND (12.0% of Live GMV)'
      },
      deltaSummary: {
        vi: 'Khi gộp đúng KOC ID ẩn danh, @koc_sat01 cùng @shop_official tạo 84,5% doanh thu Livestream (72,5% + 12,0%)',
        en: 'Under a unified pseudonymized KOC ID, @koc_sat01 and @shop_official generate 84.5% of Livestream GMV (72.5% + 12.0%)'
      },
      technicalResolution: {
        vi: 'Gắn khóa định danh Salted SHA-256 nhất quán để không tách nhầm @koc_sat01 thành 2 KOC ngoài khác nhau; tách rõ nhóm In-house khỏi 301 đối tác KOC độc lập.',
        en: 'Applies deterministic Salted SHA-256 hashing so @koc_sat01 is never split into two external accounts, cleanly isolating in-house rooms from 301 independent KOCs.'
      },
      status: 'VERIFIED_EXACT'
    },
    {
      ruleCode: 'REC-06',
      title: {
        vi: 'Đối soát 394 Niêm Yết Kênh Chính Chủ vs. 331 SKUs Toàn Shop & Hệ Sinh Thái 4 Cửa Hàng',
        en: 'Reconciling 394 Official Channel Listings vs. 331 Shop SKUs & 4 Collaborative Stores'
      },
      sourceAValue: {
        vi: '_product data (90d): 331 SKUs | Ảnh 073329: 179 SP đang bán | Ảnh 073418: 169 SKUs phát sinh đơn trong 180d',
        en: '_product data (90d): 331 SKUs | UI 073329: 179 active products | UI 073418: 169 SKUs with orders in 180d'
      },
      sourceBValue: {
        vi: "Creator's Goods (90d): 394 dòng niêm yết | Ảnh 080124 & 080800: Liên kết 4 cửa hàng hợp tác (177 SP thuộc Kami Ely)",
        en: "Creator's Goods (90d): 394 listing rows | UI 080124 & 080800: Linked to 4 collaborative stores (177 SKUs from Kami Ely)"
      },
      deltaSummary: {
        vi: 'Giỏ hàng của kênh @shop_official chứa nhiều hơn toàn shop Kami Ely 63 dòng niêm yết (394 vs. 331)',
        en: '@shop_official showcase contains 63 more listing rows than Kami Ely shop catalog (394 vs. 331)'
      },
      technicalResolution: {
        vi: 'Tài khoản @shop_official liên kết bán hàng cho 4 gian hàng: Kami Ely (177 SP active - 9,1 Tỉ đ All-time), Havi Bikini (4 SP - 71,8 Tr đ), KamiBiii (55 SP bán - 6,2 Tr đ) và KamiBiki (0 đ), cộng các link sản phẩm đổi giá/tách mã.',
        en: '@shop_official sells across 4 collaborative stores: Kami Ely (177 active SKUs - 9.1B All-time), Havi Bikini (4 SKUs - 71.8M), KamiBiii (55 units - 6.2M), and KamiBiki (0 VND), plus re-listed/variant links.'
      },
      status: 'VERIFIED_EXACT'
    }
  ] as ReconciliationRuleItem[],

  // 5. Các Khung Thời Gian Đối Soát Trên Bộ Dữ Liệu Ước Tính FastMoss (10 Tệp, 231 Ngày)
  synchronizedTelemetryModules: [
    {
      moduleId: 'telemetry-growth-28d',
      moduleName: {
        vi: '1. Đà Tăng Trưởng Khởi Động 28 Ngày Đầu Kỳ FastMoss (09/03 – 05/04/2026)',
        en: '1. Early-Cycle 28-Day FastMoss Growth Momentum (Mar 09 – Apr 05, 2026)'
      },
      synchronizedWindow: '09/03/2026 – 05/04/2026',
      csvAnchorMetric: {
        vi: 'Khớp tổng 28 dòng đầu bảng Store_Daily_Overview: 1.376.597.102 VNĐ (~1,38 Tỉ đ) & 11.051 SP',
        en: 'Matches sum of first 28 rows in Store_Daily_Overview: 1,376,597,102 VND (~1.38B) & 11,051 units'
      },
      telemetryMetrics: [
        {
          vi: 'Tổng 28 ngày đầu chu kỳ (FastMoss): 1,38 Tỉ VNĐ | 11.051 sản phẩm | Bình quân ~49,2 Tr đ/ngày',
          en: 'Opening 28-day FastMoss total: 1.38B VND | 11,051 units | Daily avg ~49.2M VND/day'
        },
        {
          vi: 'Đơn giá bán trung bình ước tính (ASP): ~124.568 đ/sản phẩm (không có mã đơn order_id để tính AOV giỏ hàng)',
          en: 'Estimated Average Selling Price (ASP): ~124,568 VND/unit (no order_id available for basket AOV)'
        }
      ],
      strategicTakeaway: {
        vi: 'Giai đoạn khởi động tháng 3–4 tạo bước đệm cung nội dung trước khi doanh thu bứt phá lên đỉnh tháng 6 (3,77 Tỉ đ).',
        en: 'Early Mar–Apr content volume established the runway before store GMV peaked in June (3.77B VND).'
      }
    },
    {
      moduleId: 'telemetry-channel-split-226d',
      moduleName: {
        vi: '2. Phân Rã 3 Kênh Trên Khung Đồng Bộ 226 Ngày (09/03 – 20/10/2026)',
        en: '2. 3-Channel Decomposition at Shared 226-Day Cutoff (Mar 09 – Oct 20, 2026)'
      },
      synchronizedWindow: '09/03/2026 – 20/10/2026 (226d)',
      csvAnchorMetric: {
        vi: 'Toàn shop 226 ngày = 14,84 Tỉ đ (đủ 231 ngày đến 25/10 = 15,01 Tỉ đ)',
        en: 'Whole-shop 226d GMV = 14.84B VND (full 231d through Oct 25 = 15.01B VND)'
      },
      telemetryMetrics: [
        {
          vi: 'Livestream (8.355 phiên khử trùng): 10,47 Tỉ đ (70,5%) — trong đó @shop_official 72,5% + @koc_sat01 12,0%',
          en: 'Livestream (8,355 deduped sessions): 10.47B VND (70.5%) — @shop_official 72.5% + @koc_sat01 12.0%'
        },
        {
          vi: 'Video ngắn (4.796 clip khử trùng): 2,20 Tỉ đ (14,8%) — KOC bên ngoài chiếm 58,4% (1,28 Tỉ đ)',
          en: 'Short Video (4,796 deduped clips): 2.20B VND (14.8%) — external KOCs drive 58.4% (1.28B VND)'
        },
        {
          vi: 'Phần còn lại (Kệ hàng / Shop Tab / Tự nhiên): 2,18 Tỉ đ (14,7%)',
          en: 'Residual (Product Card / Shop Tab / Organic): 2.18B VND (14.7%)'
        }
      ],
      strategicTakeaway: {
        vi: 'Cơ cấu kênh lệch chiều rõ rệt: Livestream dựa vào đội In-house (84,5%), trong khi Video ngắn dựa vào mạng lưới KOC ngoài (58,4%).',
        en: 'Channel structure is sharply asymmetric: In-house rooms anchor Livestream (84.5%) while external KOCs drive Short Video (58.4%).'
      }
    },
    {
      moduleId: 'telemetry-content-efficiency',
      moduleName: {
        vi: '3. Hiệu Suất Phiên LIVE Chính Chủ (600 Phiên) & Cờ Quảng Cáo Video (4.796 Clip)',
        en: '3. Official LIVE Efficiency (600 Sessions) & Video Ad Authorization (4,796 Clips)'
      },
      synchronizedWindow: '07/03/2026 – 20/10/2026',
      csvAnchorMetric: {
        vi: 'Khớp trực tiếp bảng Creator_Livestreams (600 phiên) và Affiliate_Videos (4.796 clip sau khử trùng khóa phức hợp)',
        en: 'Directly aligned with Creator_Livestreams (600 sessions) and Affiliate_Videos (4,796 deduplicated clips)'
      },
      telemetryMetrics: [
        {
          vi: '67 ca Mega-Live >10h đạt bình quân 4,55 Tr đ/giờ (gấp 4,1× ca <2h); lưu ý khả năng nhân quả ngược vào ngày sale lớn',
          en: '67 >10h Mega-Lives averaged 4.55M VND/hr (4.1x <2h sessions); subject to reverse causality on promo days'
        },
        {
          vi: 'Video bật cờ Ads (3.775 clip) đạt 30,3% có đơn (vs. 10,2% Organic), nhưng GPM/1k views lại thấp hơn (0,84× toàn mẫu; 0,73× trong cùng 192 KOC)',
          en: 'Ad-tagged videos (3,775 clips) converted at 30.3% (vs. 10.2% Organic), yet GPM per 1k views trailed Organic (0.84x overall; 0.73x within 192 dual KOCs)'
        }
      ],
      strategicTakeaway: {
        vi: 'Chỉ nên cấp ngân sách Spark Ads có chọn lọc cho clip đã chứng minh chuyển đổi tự nhiên và theo dõi ROAS biên khi có dữ liệu chi phí Ads thực.',
        en: 'Deploy Spark Ads selectively on organically converting clips and track marginal ROAS once internal ad-spend data is available.'
      }
    },
    {
      moduleId: 'telemetry-seasonal-transition',
      moduleName: {
        vi: '4. Chuyển Giao Mùa Vụ Hè → Thu Đông Trên 10 SKU Chủ Lực (T5 – T10/2026)',
        en: '4. Summer-to-Autumn Transition Across 10 Core SKUs (May – Oct 2026)'
      },
      synchronizedWindow: '30/04/2026 – 25/10/2026 (179d)',
      csvAnchorMetric: {
        vi: 'Khớp đà giảm Tháng 8 (0,64 Tỉ đ, -83,1% vs Tháng 6) và nhịp hồi phục Tháng 10 (1,62 Tỉ đ trong 25 ngày)',
        en: 'Matches August contraction (0.64B VND, -83.1% vs June) and October rebound (1.62B VND across 25 days)'
      },
      telemetryMetrics: [
        {
          vi: '6 mã Đồ bơi Hè (gồm AQ1) rơi 90% từ 1,57 Tỉ (T6) xuống 0,15 Tỉ (T8), trong khi 2 mã Thu Đông AT06 (09/09) và AG01 (14/09) lên kệ trễ gần 1 tháng',
          en: '6 Summer Swimwear SKUs (incl. AQ1) fell 90% from 1.57B (Jun) to 0.15B (Aug), while autumn heroes AT06 (Sep 09) and AG01 (Sep 14) launched nearly 1 month late'
        },
        {
          vi: 'Tháng 10 hồi phục lên 64,7 Tr/ngày (+214,9% vs T8), nhưng riêng mã AT06 chiếm 80,5% GMV tháng (rủi ro phụ thuộc đơn mã)',
          en: 'October rebounded to 64.7M/day (+214.9% vs Aug), but single SKU AT06 drove 80.5% of monthly GMV (single-SKU concentration risk)'
        }
      ],
      strategicTakeaway: {
        vi: 'Đẩy lịch ra mắt hàng Thu Đông sớm 4 tuần từ đầu tháng 8 và ghép bán chéo AT06 cùng CV11/CV02/AG01 để giảm phụ thuộc đơn mã.',
        en: 'Advance autumn SKU launches by 4 weeks to early August and bundle AT06 with CV11/CV02/AG01 to diversify revenue.'
      }
    }
  ] as SynchronizedTelemetryItem[]
};

// TƯƠNG THÍCH NGƯỢC (BACKWARD COMPATIBILITY)
export interface DataReconciliationCase {
  id: string;
  badge: { vi: string; en: string };
  title: { vi: string; en: string };
  timeWindow: { vi: string; en: string };
  tablesInvolved: string[];
  observedPhenomenon: { vi: string; en: string };
  metricsComparison: {
    sourceA: { name: string; value: string; rawValue?: number };
    sourceB: { name: string; value: string; rawValue?: number };
    variance: { label: string; value: string; pct?: string };
  };
  dataDrivenExplanation: { vi: string; en: string };
  technicalTakeaway: { vi: string; en: string };
  formula: string;
  sqlPresetId?: string;
  sqlJoinHint: string;
  reconciliationStatus: 'verified' | 'reconciled';
}

export const KAMI_RECONCILIATION_CASES: DataReconciliationCase[] = kamiReconciliationData.reconciliationRules.map((rule) => ({
  id: rule.ruleCode.toLowerCase(),
  badge: { vi: rule.ruleCode, en: rule.ruleCode },
  title: rule.title,
  timeWindow: { vi: '180 ngày / 90 ngày', en: '180d / 90d' },
  tablesInvolved: ['kami_store_daily_overview', 'kami_shop_live_180d', 'kami_creator_live_180d', 'kami_product_data_90d'],
  observedPhenomenon: rule.deltaSummary,
  metricsComparison: {
    sourceA: { name: 'Source A', value: rule.sourceAValue.vi },
    sourceB: { name: 'Source B', value: rule.sourceBValue.vi },
    variance: { label: 'Delta', value: rule.deltaSummary.vi }
  },
  dataDrivenExplanation: rule.technicalResolution,
  technicalTakeaway: rule.technicalResolution,
  formula: rule.ruleCode,
  sqlJoinHint: 'JOIN on date_id / session_id / product_id',
  reconciliationStatus: rule.status === 'VERIFIED_EXACT' ? 'verified' : 'reconciled'
}));

// Export alias tương thích ngược với mọi lệnh import trong dự án
export const RECONCILIATION_DATA = kamiReconciliationData;
export default kamiReconciliationData;
