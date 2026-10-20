// FILE: app/data/kami-ely/reconciliation.ts
// MA TRẬN ĐỐI SOÁT ĐA TẦNG & ĐỒNG BỘ HÓA DỮ LIỆU KAMI ELY (@kamielyhn)
// Bảo toàn 100% số liệu gốc của 8 bảng CSV/XLSX & Đồng bộ khung 180 ngày

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
    totalRawTables: 8,
    totalCsvFiles: 9,
    totalDatabaseRows: 18778,
    hanoiFollowersSharePct: 43.0,
    femaleAudienceSharePct: 73.0,
    age18To24SharePct: 60.0
  },

  // 2. Bảng Đối Chiếu Tổng Quan: Toàn Shop vs. Kênh Chính Chủ (@kamielyhn) qua 3 Khung Thời Gian
  multiWindowMatrix: [
    {
      metricId: 'total-gmv',
      metricName: { vi: 'Tổng Doanh Thu (GMV)', en: 'Total GMV' },
      shopAllTime: { vi: '31,6 Tỉ đ', en: '31.6B VND' },
      creatorAllTime: { vi: '9,2 Tỉ đ (29,1%)', en: '9.2B VND (29.1%)' },
      shop180d: { vi: '12.735.128.067 đ (~12,74 Tỉ)', en: '12,735,128,067 VND (~12.74B)' },
      creator180d: {
        vi: '5,80 Tỉ đ Net (45,7%) | 7,89 Tỉ đ Gross CSV',
        en: '5.80B Net (45.7%) | 7.89B Gross CSV'
      },
      shop90d: { vi: '6.136.205.973 đ (~6,14 Tỉ)', en: '6,136,205,973 VND (~6.14B)' },
      creator90d: { vi: '3.026.026.869 đ (49,31%)', en: '3,026,026,869 VND (49.31%)' },
      auditNote: {
        vi: 'Tỷ trọng tự gánh của kênh @kamielyhn tăng mạnh từ 29,1% (All-time) lên 45,7% (180d) và 49,31% (90d).',
        en: '@kamielyhn share rose from 29.1% (All-time) to 45.7% (180d) and 49.31% (90d).'
      }
    },
    {
      metricId: 'units-sold',
      metricName: { vi: 'Tổng Sản Lượng Bán (Units)', en: 'Total Units Sold' },
      shopAllTime: { vi: '238,4k SP (Store: 238,2k)', en: '238.4k units (Store: 238.2k)' },
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
      creator90d: { vi: 'GPM 134,8k–135,2k đ (Gấp 4,5x LIVE)', en: 'GPM 134.8k–135.2k VND (4.5x LIVE)' },
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
        vi: 'Top 1% KOC (58 người) tạo ra 91,49% GMV Affiliate (1.562,8 Tr đ); riêng @girlstyle.vn chiếm 42,9% (732,77 Tr đ / 5.009 SP).',
        en: 'Top 1% KOCs (58 accounts) drive 91.49% of Affiliate GMV (1,562.8M VND); @girlstyle.vn alone drives 42.9% (732.77M VND / 5,009 units).'
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
      granularity: { vi: 'Cấp phiên LIVE kênh chính chủ @kamielyhn', en: 'Self-operated LIVE Sessions (@kamielyhn)' },
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
      granularity: { vi: 'Cấp video đăng trên kênh @kamielyhn', en: 'Post-level Videos on @kamielyhn' },
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
        vi: 'Gồm Kênh chính chủ @kamielyhn (3.026.026.869 đ / 20.027 SP = 63,92% khối Creator) và 5.712 KOC ngoài (1.708.159.874 đ / 11.572 SP = 36,08% khối Creator). Phần chênh với _product data đúng bằng Kệ hàng (1.402.019.230 đ = 22,85%).',
        en: 'Includes @kamielyhn (3,026,026,869 VND / 20,027 units = 63.92% of Creators) and 5,712 external KOCs (1,708,159,874 VND / 11,572 units = 36.08%). Remainder vs. _product data equals Product Card (1,402,019,230 VND = 22.85%).'
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
        vi: '4,734 Tỉ đ là gộp cả Chính chủ (3,026 Tỉ đ) + 5.712 KOC ngoài (1,708 Tỉ đ); phần dư 1,402 Tỉ đ khớp 100% Kệ hàng',
        en: '4.734B VND combines Official Channel (3.026B) + 5,712 external KOCs (1.708B); the 1.402B remainder matches Product Card'
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
        vi: 'Đồng bộ Hóa Cửa Sổ 28 Ngày Seller Center Về Đầu Chu Kỳ 180 Ngày (09/03 – 05/04/2026)',
        en: 'Synchronizing Seller Center 28d Window to Early 180d Cycle (Mar 09 – Apr 05, 2026)'
      },
      sourceAValue: {
        vi: 'Tổng 28 dòng đầu trong CSV Store Overview (09/03 – 05/04/2026): 1.376.597.102 đ (~1,38 Tỉ đ) và 11.051 SP',
        en: 'Sum of first 28 rows in Store Overview CSV (Mar 09 – Apr 05, 2026): 1,376,597,102 VND (~1.38B) and 11,051 units'
      },
      sourceBValue: {
        vi: 'Báo cáo Seller Center 28 ngày: Net GMV 1,35 Tỉ đ (+56,24%), Doanh thu gộp 1,40 Tỉ đ (+36,29%), 10.554 SP (+40,31%)',
        en: 'Seller Center 28d Report: Net GMV 1.35B VND (+56.24%), Gross Revenue 1.40B VND (+36.29%), 10,554 units (+40.31%)'
      },
      deltaSummary: {
        vi: 'Khớp 98,1% về quy mô doanh thu (1,35 Tỉ Net / 1,38 Tỉ CSV / 1,40 Tỉ Gross) và sản lượng (10.554 Net / 11.051 Gross)',
        en: '98.1% alignment in revenue (1.35B Net / 1.38B CSV / 1.40B Gross) and volume (10,554 Net / 11,051 Gross)'
      },
      technicalResolution: {
        vi: 'Chuẩn hóa nhãn thời gian của báo cáo Seller Center 28 ngày thành "09/03/2026 – 05/04/2026 (28 ngày đầu chu kỳ 180d)", giữ nguyên toàn bộ chỉ số CR 1,68%, AOV 128.600 đ và Kệ hàng 442,36 Tr đ (CVR 0,25% trên 1,17M người xem).',
        en: 'Standardized Seller Center 28d label to "Mar 09 – Apr 05, 2026 (First 28d of 180d cycle)", preserving CR 1.68%, AOV 128,600 VND, and Product Card 442.36M VND (0.25% CVR on 1.17M viewers).'
      },
      status: 'WINDOW_SYNCED'
    },
    {
      ruleCode: 'REC-04',
      title: {
        vi: 'Đồng bộ Thực Nghiệm A/B Testing 2 Phiên LIVE Vào Ngày 22/03 & 28/03/2026',
        en: 'Synchronizing LIVE Ads A/B Testing Sessions to Mar 22 & Mar 28, 2026'
      },
      sourceAValue: {
        vi: 'CSV Store Overview: Ngày 22/03 đạt 24,53 Tr đ (215 SP); Ngày 28/03 bùng nổ đạt 81,72 Tr đ (734 SP)',
        en: 'CSV Store Overview: Mar 22 reached 24.53M VND (215 units); Mar 28 surged to 81.72M VND (734 units)'
      },
      sourceBValue: {
        vi: 'Live Workbench: Phiên A (Ads 678,75K -> 9,25 Tr đ, 1,81M/giờ) vs. Phiên B (Ads 2,17M -> 20,65 Tr đ, 5,73M/giờ)',
        en: 'Live Workbench: Profile A (Ads 678.75K -> 9.25M VND, 1.81M/hr) vs. Profile B (Ads 2.17M -> 20.65M VND, 5.73M/hr)'
      },
      deltaSummary: {
        vi: 'Trong 188 đơn vị xuất kho của Phiên B có 134 SP thương mại (130 Chân váy CV11 = 20,34 Tr đ + 4 SP phụ) và 54 quà tặng 0đ',
        en: 'Out of 188 dispatched units in Profile B, 134 are commercial units (130 CV11 Skirts = 20.34M + 4 aux) and 54 are 0-VND gift bows'
      },
      technicalResolution: {
        vi: 'Ánh xạ Phiên A vào ngày 22/03/2026 và Phiên B vào ngày 28/03/2026 trong chuỗi 180 ngày; bóc tách rõ 134 SP thương mại chính + 54 phụ kiện quà tặng kèm ([TẶNG NƠ CÀI ÁO]) để triệt tiêu sai số đơn giá.',
        en: 'Mapped Profile A to Mar 22, 2026 and Profile B to Mar 28, 2026 within the 180d timeline; separated 134 commercial units + 54 free gift bows ([FREE BOW GIFT]) to eliminate unit price discrepancy.'
      },
      status: 'WINDOW_SYNCED'
    },
    {
      ruleCode: 'REC-05',
      title: {
        vi: 'Đối soát Chuỗi Kích Hoạt Siêu KOC @girlstyle.vn (Từ 0 đ Đầu Tháng 3 Lên 732,77 Tr đ Mùa Hè)',
        en: 'Reconciling Super-KOC @girlstyle.vn Activation (From 0 VND in Mid-March to 732.77M VND in 90d)'
      },
      sourceAValue: {
        vi: 'Ảnh Chẩn đoán Tài khoản 7 ngày (12/03 – 18/03/2026): @kamielyhn đạt 33.011.731 đ; @girlstyle.vn ghi nhận 0 đ',
        en: '7d Account Diagnostics (Mar 12 – Mar 18, 2026): @kamielyhn reached 33,011,731 VND; @girlstyle.vn recorded 0 VND'
      },
      sourceBValue: {
        vi: 'CSV _Creators_merged (90 ngày cao điểm hè): @girlstyle.vn đứng Top 1 KOC với 732.771.719 đ (5.009 SP = 42,9% Affiliate)',
        en: 'CSV _Creators_merged (90d summer peak): @girlstyle.vn ranks #1 KOC with 732,771,719 VND (5,009 units = 42.9% Affiliate)'
      },
      deltaSummary: {
        vi: 'Chuyển trạng thái từ KOC ngủ đông (tuần 12–18/03) sang Siêu KOC gánh 42,9% mạng lưới Affiliate trong 90 ngày hè',
        en: 'Transitioned from dormant account (Mar 12–18 week) to #1 Super-KOC driving 42.9% of Affiliate GMV in the 90d summer window'
      },
      technicalResolution: {
        vi: 'Minh chứng thực tế cho quy trình KOC Activation: Phát hiện tài khoản liên kết ngủ đông ở đầu chu kỳ 180 ngày (tháng 3) và cấp mẫu thử/hoa hồng kích hoạt trong 90 ngày cao điểm hè.',
        en: 'Provides empirical proof of KOC Activation workflow: Identifying dormant linked accounts in early March and activating them with samples/commissions during the 90d peak season.'
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
        vi: 'Giỏ hàng của kênh @kamielyhn chứa nhiều hơn toàn shop Kami Ely 63 dòng niêm yết (394 vs. 331)',
        en: '@kamielyhn showcase contains 63 more listing rows than Kami Ely shop catalog (394 vs. 331)'
      },
      technicalResolution: {
        vi: 'Tài khoản @kamielyhn liên kết bán hàng cho 4 gian hàng: Kami Ely (177 SP active - 9,1 Tỉ đ All-time), Havi Bikini (4 SP - 71,8 Tr đ), KamiBiii (55 SP bán - 6,2 Tr đ) và KamiBiki (0 đ), cộng các link sản phẩm đổi giá/tách mã.',
        en: '@kamielyhn sells across 4 collaborative stores: Kami Ely (177 active SKUs - 9.1B All-time), Havi Bikini (4 SKUs - 71.8M), KamiBiii (55 units - 6.2M), and KamiBiki (0 VND), plus re-listed/variant links.'
      },
      status: 'VERIFIED_EXACT'
    }
  ] as ReconciliationRuleItem[],

  // 5. Dữ Liệu Telemetry TikTok Seller Center & Live Workbench Đã Đồng Bộ Vào Khung 180 Ngày
  synchronizedTelemetryModules: [
    {
      moduleId: 'telemetry-growth-28d',
      moduleName: {
        vi: '1. Đà Tăng Trưởng Khởi Động 28 Ngày (09/03 – 05/04/2026)',
        en: '1. Early-Cycle 28-Day Growth Momentum (Mar 09 – Apr 05, 2026)'
      },
      synchronizedWindow: '09/03/2026 – 05/04/2026',
      csvAnchorMetric: {
        vi: 'Khớp tổng 28 dòng đầu bảng kami_store_daily_overview: 1.376.597.102 VNĐ (~1,38 Tỉ đ) & 11.051 SP',
        en: 'Matches sum of first 28 rows in kami_store_daily_overview: 1,376,597,102 VND (~1.38B) & 11,051 units'
      },
      telemetryMetrics: [
        {
          vi: 'Net GMV: 1,35 Tỉ VNĐ (+56,24%) | Doanh thu gộp: 1,40 Tỉ VNĐ (+36,29%) | Số món bán: 10.554 SP (+40,31%)',
          en: 'Net GMV: 1.35B VND (+56.24%) | Gross Revenue: 1.40B VND (+36.29%) | Units Sold: 10,554 (+40.31%)'
        },
        {
          vi: 'Snapshot trong ngày (13:12): GMV 17,37 Tr đ | 135 món | 7.250 khách truy cập | 122 người mua | CR = 1,68% | AOV = 128.600 đ',
          en: 'Intraday Snapshot (13:12): GMV 17.37M VND | 135 units | 7,250 visitors | 122 buyers | CR = 1.68% | AOV = 128,600 VND'
        }
      ],
      strategicTakeaway: {
        vi: 'Tỷ lệ chuyển đổi cửa hàng (1,68%) đang bị kìm hãm do lẻ size các mẫu hot và thiếu Freeship Xtra.',
        en: 'Store conversion rate (1.68%) is constrained by broken sizes on hot SKUs and missing Freeship Xtra.'
      }
    },
    {
      moduleId: 'telemetry-shopping-tab',
      moduleName: {
        vi: '2. Phễu Thẻ Sản Phẩm & Kệ Hàng (09/03 – 05/04/2026 & Tuần 25/03 – 31/03/2026)',
        en: '2. Product Card & Shopping Tab Funnel (Mar 09 – Apr 05 & Mar 25 – Mar 31, 2026)'
      },
      synchronizedWindow: '25/03/2026 – 31/03/2026 (7d) & 09/03 – 05/04/2026 (28d)',
      csvAnchorMetric: {
        vi: 'Khớp tuần 25/03 – 31/03/2026 toàn shop đạt 355,28 Tr đ & Kệ hàng 90d đạt 1.402.019.230 đ (22,85% GMV)',
        en: 'Matches Mar 25–31 shop GMV of 355.28M VND & 90d Product Card GMV of 1,402,019,230 VND (22.85% share)'
      },
      telemetryMetrics: [
        {
          vi: 'Phễu 28 ngày: 1,17 Triệu người xem (+34,46% - Top 20% ngành) | GMV: 442,36 Tr đ (-11,93%) | CVR: 0,25% (-38,4%)',
          en: '28d Funnel: 1.17M viewers (+34.46% - Top 20% peers) | GMV: 442.36M VND (-11.93%) | CVR: 0.25% (-38.4%)'
        },
        {
          vi: 'Nguồn Kệ hàng: Khác/Shopping Ads 192,55 Tr đ (17,04% PV) | Tìm kiếm 74,65 Tr đ (25,03% PV) | Đề xuất 58,12 Tr đ (29,23% PV - 1,71M PV)',
          en: 'Card Sources: Others/Ads 192.55M (17.04% PV) | Search 74.65M (25.03% PV) | Recommendations 58.12M (29.23% PV - 1.71M PV)'
        },
        {
          vi: 'Hero Card 7 ngày: Chân Váy Chữ A (CV11) đạt 161,42K người xem, 10,08K click (CTR 6,25%), 782 khách; Chân váy dài viền ren tăng +471,28% GMV (4,03 Tr đ)',
          en: '7d Hero Cards: A-Line Skirt (CV11) hit 161.42K viewers, 10.08K clicks (6.25% CTR), 782 buyers; Lace Midi Skirt surged +471.28% GMV (4.03M VND)'
        }
      ],
      strategicTakeaway: {
        vi: 'Nâng CVR Kệ hàng từ 0,25% lên 1,0% trên nền 1,17M người xem sẽ mở khóa +1,32 Tỉ đ/tháng mà không tốn hoa hồng KOC.',
        en: 'Lifting Card CVR from 0.25% to 1.0% across 1.17M viewers unlocks +1.32B VND/month with zero KOC commission.'
      }
    },
    {
      moduleId: 'telemetry-live-funnel-ab',
      moduleName: {
        vi: '3. Phễu Lưu Lượng Phòng LIVE (12/03 – 18/03) & A/B Testing Live Ads (22/03 vs. 28/03/2026)',
        en: '3. LIVE Room Traffic Funnel (Mar 12–18) & Live Ads A/B Testing (Mar 22 vs. Mar 28, 2026)'
      },
      synchronizedWindow: '12/03 – 18/03/2026 & 22/03 vs. 28/03/2026',
      csvAnchorMetric: {
        vi: 'Khớp trực tiếp các phiên ngày 16–18/03 (33,01 Tr đ) và cú bùng nổ ngày 28/03 (81,72 Tr đ toàn shop)',
        en: 'Directly matches Mar 16–18 sessions (33.01M VND) and the Mar 28 surge (81.72M VND shop-wide)'
      },
      telemetryMetrics: [
        {
          vi: 'Điểm nghẽn Bảng tin - Ô Live: Chiếm 46% PV nhưng tỷ lệ vào phòng chỉ đạt 5,09% vs. Tìm kiếm chiếm 43% PV đạt tỷ lệ vào phòng 25,68%',
          en: 'Feed Live Preview Bottleneck: 46% PV share but only 5.09% room entry rate vs. Search with 43% PV and 25.68% entry rate'
        },
        {
          vi: 'Phiên Tiêu Chuẩn (22/03 - Ads 678,75K): 53,52K hiển thị | GMV 9,25 Tr đ (83 SP) | Tốc độ 1,81M đ/giờ | Search chiếm 8,26% GMV',
          en: 'Baseline Session (Mar 22 - Ads 678.75K): 53.52K impressions | GMV 9.25M VND (83 units) | 1.81M/hr velocity | Search 8.26% GMV'
        },
        {
          vi: 'Phiên Bùng Nổ (28/03 - Ads 2,17M): 94,76K hiển thị | GMV 20,65 Tr đ (134 SP chính + 54 quà tặng) | Tốc độ 5,73M đ/giờ (Gấp 3,16x) | Search chiếm 15,97% GMV',
          en: 'Breakout Session (Mar 28 - Ads 2.17M): 94.76K impressions | GMV 20.65M VND (134 paid units + 54 gifts) | 5.73M/hr velocity (3.16x) | Search 15.97% GMV'
        }
      ],
      strategicTakeaway: {
        vi: 'Tăng ngân sách Ads có kiểm soát (3,2x) kết hợp bắt luồng Tìm kiếm và ghim Chân váy CV11 giúp nhân 3,16 lần tốc độ doanh thu mỗi giờ LIVE.',
        en: 'Controlled 3.2x Ads scaling paired with Search intent capture and pinning CV11 Skirt multiplies hourly LIVE GMV velocity by 3.16x.'
      }
    },
    {
      moduleId: 'telemetry-marketing-late-season',
      moduleName: {
        vi: '4. Công Cụ Khuyến Mãi & Suy Thoái Chuyển Mùa 28 Ngày Cuối (08/08 – 04/09/2026)',
        en: '4. Promotion Tools & Late-Season 28d Transition Drop (Aug 08 – Sep 04, 2026)'
      },
      synchronizedWindow: '08/08/2026 – 04/09/2026',
      csvAnchorMetric: {
        vi: 'Khớp đà suy giảm tháng 8 (645,53 Tr đ) và 4 ngày đầu tháng 9 (35,08 Tr đ) khi miền Bắc (43% Hà Nội) hết mùa biển',
        en: 'Matches August decline (645.53M VND) and Sep 01–04 trough (35.08M VND) as Northern Vietnam (43% Hanoi) exits beach season'
      },
      telemetryMetrics: [
        {
          vi: 'Khuyến mãi: Tạo 35,86% GMV (123,3 Tr đ), nâng AOV lên 150.991 đ nhưng tốn 62,2 Tr đ chi phí giảm giá (50,45% chiết khấu); 96,35% lệ thuộc Giảm giá cố định, Flash Sale LIVE chỉ 19,65%',
          en: 'Promotions: Drives 35.86% GMV (123.3M VND), lifts AOV to 150,991 VND but costs 62.2M in discounts (50.45% rate); 96.35% relies on Fixed Discounts, LIVE Flash Sale is only 19.65%'
        },
        {
          vi: 'Suy thoái 28 ngày cuối vụ: Nhánh nội dung chuyển mùa giảm -81,26% (còn 93.504.198 đ | 846 món | 712 khách), CTOR rơi xuống 1,44% (-81,51%), giảm -260 followers',
          en: 'Late-season 28d drop: Transition content branch fell -81.26% (to 93,504,198 VND | 846 units | 712 buyers), CTOR dropped to 1.44% (-81.51%), net -260 followers'
        }
      ],
      strategicTakeaway: {
        vi: 'Xoay trục ngay danh mục ghim LIVE từ Bikini sang Chân váy chữ A (CV11) & Thời trang Thu – Đông cho tệp 43% khách Hà Nội.',
        en: 'Immediately pivot pinned LIVE catalog from Bikinis to A-Line Skirts (CV11) & Autumn/Winter apparel for the 43% Hanoi audience.'
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
