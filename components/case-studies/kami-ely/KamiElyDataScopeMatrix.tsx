'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

type MatrixViewTab = 'windows' | 'datasets' | 'reconciliation';
type DatasetLayerFilter = 'all' | 'macro-180d' | 'micro-90d';

export interface KamiElyDataScopeMatrixProps {
  scopeType?: 'shop' | 'creator';
  isEn?: boolean;
  openProofScreenshot?: (_id: string) => void;
  openProofModalWithGroup?: (_group: 'shop' | 'creator') => void;
  onOpenProofModal?: (_screenshotId?: string) => void;
}

interface MultiWindowComparisonRow {
  id: string;
  metric: { vi: string; en: string };
  shopAllTime: { value: string; sub: { vi: string; en: string } };
  creatorAllTime: { value: string; sub: { vi: string; en: string } };
  shop180d: { value: string; sub: { vi: string; en: string } };
  creator180d: { value: string; sub: { vi: string; en: string } };
  shop90d: { value: string; sub: { vi: string; en: string } };
  creator90d: { value: string; sub: { vi: string; en: string } };
}

interface DatasetSchemaRow {
  id: string;
  fileName: string;
  layer: 'macro-180d' | 'micro-90d';
  timeScope: { vi: string; en: string };
  entityScope: { vi: string; en: string };
  granularity: { vi: string; en: string };
  primaryKeys: string[];
  recordCount: { vi: string; en: string };
  totalGmv: string;
  totalUnits: { vi: string; en: string };
  analyticalRole: { vi: string; en: string };
}

interface ReconciliationCard {
  id: string;
  badge: { vi: string; en: string };
  title: { vi: string; en: string };
  formula: string;
  leftMetric: { label: { vi: string; en: string }; value: string; sub: string };
  rightMetric: { label: { vi: string; en: string }; value: string; sub: string };
  deltaHighlight: { vi: string; en: string };
  explanation: { vi: string; en: string };
  sqlJoinHint: string;
}

const MULTI_WINDOW_ROWS: MultiWindowComparisonRow[] = [
  {
    id: 'total-gmv',
    metric: { vi: 'Tổng Doanh thu (GMV)', en: 'Total GMV' },
    shopAllTime: {
      value: '31,6 Tỉ đ',
      sub: { vi: 'Ảnh 073329 (Từ 18/08/2022)', en: 'Img 073329 (Since 2022-08-18)' }
    },
    creatorAllTime: {
      value: '9,2 Tỉ đ',
      sub: { vi: 'Chiếm 29,1% GMV toàn shop (Ảnh 080124)', en: '29.1% of shop GMV (Img 080124)' }
    },
    shop180d: {
      value: '12,74 Tỉ đ',
      sub: { vi: '12.735.128.067 đ (TB 70,75 Tr/ngày)', en: '12,735,128,067 VND (Avg 70.75M/day)' }
    },
    creator180d: {
      value: '5,8 Tỉ đ',
      sub: { vi: 'Chiếm 45,7% toàn shop (Gross CSV: 7,89 Tỉ)', en: '45.7% of shop (CSV Gross: 7.89B)' }
    },
    shop90d: {
      value: '6,14 Tỉ đ',
      sub: { vi: '6.136.205.973 đ (~6,08 Tỉ trên Overview)', en: '6,136,205,973 VND (~6.08B Overview)' }
    },
    creator90d: {
      value: '3,03 Tỉ đ',
      sub: { vi: '3.026.026.869 đ (Chiếm 49,3% toàn shop)', en: '3,026,026,869 VND (49.3% of shop)' }
    }
  },
  {
    id: 'units-sold',
    metric: { vi: 'Sản lượng bán (Units Sold)', en: 'Total Units Sold' },
    shopAllTime: {
      value: '238,4k SP',
      sub: { vi: '238,2k trên bảng Collaborative Store', en: '238.2k on Collaborative Store table' }
    },
    creatorAllTime: {
      value: '69,9k SP',
      sub: { vi: 'Chiếm 29,3% tổng sản lượng shop', en: '29.3% of total shop volume' }
    },
    shop180d: {
      value: '85,5k SP',
      sub: { vi: '85.500 sản phẩm (Đỉnh 16/06: 1.936 SP)', en: '85,500 units (Jun 16 Peak: 1,936 units)' }
    },
    creator180d: {
      value: '39,3k SP',
      sub: { vi: 'Chiếm 46,0% shop (CSV Gross: 54.961 SP)', en: '46.0% of shop (CSV Gross: 54,961 units)' }
    },
    shop90d: {
      value: '40,23k SP',
      sub: { vi: '40.229 sản phẩm (331 mã SKU phát sinh đơn)', en: '40,229 units across 331 active SKUs' }
    },
    creator90d: {
      value: '20,03k SP',
      sub: { vi: '20.027 SP — Tự gánh 49,76% sản lượng shop', en: '20,027 units — 49.76% of shop volume' }
    }
  },
  {
    id: 'live-performance',
    metric: { vi: 'Hiệu suất Livestream (LIVE)', en: 'Livestream Performance' },
    shopAllTime: {
      value: '12,4k phiên',
      sub: { vi: 'Toàn bộ lịch sử phát sóng toàn sàn', en: 'Cumulative shoppable LIVE sessions' }
    },
    creatorAllTime: {
      value: '5,9 Tỉ đ',
      sub: { vi: '2,5k phiên LIVE | TB 02:26:18/phiên', en: '2.5k sessions | Avg 02:26:18/session' }
    },
    shop180d: {
      value: '9,26 Tỉ đ',
      sub: { vi: '7.046 phiên | 67.254 SP (~9,3 Tỉ đ)', en: '7,046 sessions | 67,254 units (~9.3B)' }
    },
    creator180d: {
      value: '4,90 Tỉ đ',
      sub: { vi: '470 phiên (52,7% LIVE sàn) | CSV: 7,02 Tỉ (475 phiên)', en: '470 sessions (52.7% share) | CSV: 7.02B' }
    },
    shop90d: {
      value: '55,93% GMV',
      sub: { vi: 'Chiếm 59,01% tổng sản lượng toàn shop', en: 'Drives 59.01% of total shop unit volume' }
    },
    creator90d: {
      value: '208 phiên',
      sub: { vi: 'GPM 28d: 29,2k–30,2k đ | TB 2,4k views/phiên', en: '28d GPM: 29.2k–30.2k | Avg 2.4k views' }
    }
  },
  {
    id: 'video-performance',
    metric: { vi: 'Hiệu suất Video Ngắn (Video)', en: 'Short-Video Performance' },
    shopAllTime: {
      value: '11,2k video',
      sub: { vi: 'Tổng video gắn giỏ hàng toàn hệ thống', en: 'Total shoppable videos across ecosystem' }
    },
    creatorAllTime: {
      value: '3,2 Tỉ đ',
      sub: { vi: '859 video (551 gắn giỏ) | 34,3M views', en: '859 videos (551 shoppable) | 34.3M views' }
    },
    shop180d: {
      value: '2,17 Tỉ đ',
      sub: { vi: '4.417 Shoppable Videos (Đo lường 90 ngày)', en: '4,417 Shoppable Videos (90d metrics)' }
    },
    creator180d: {
      value: '870,2 Tr đ',
      sub: { vi: '222 video | 5.144 SP | 7,97M views (~872,2 Tr)', en: '222 videos | 5,144 units | 7.97M views' }
    },
    shop90d: {
      value: '2,4 Tỉ đ',
      sub: { vi: 'Chiếm 21,21% GMV & 19,50% sản lượng shop', en: '21.21% of GMV & 19.50% of unit volume' }
    },
    creator90d: {
      value: '147 video',
      sub: { vi: 'GPM 28d: 134,8k–135,2k đ (Gấp 4,5x LIVE)', en: '28d GPM: 134.8k–135.2k (4.5x vs LIVE)' }
    }
  },
  {
    id: 'network-catalog',
    metric: { vi: 'Mạng lưới Affiliate & Kệ hàng', en: 'Affiliate Network & Catalog' },
    shopAllTime: {
      value: '6,0k KOCs',
      sub: { vi: '179 SKUs đang bán | Top 259 Ngành hàng', en: '179 active SKUs | Rank #259 in Category' }
    },
    creatorAllTime: {
      value: '4 Shop hợp tác',
      sub: { vi: 'Kami Ely (69,2k SP / 9,1 Tỉ), Havi, KamiBiii...', en: 'Kami Ely (69.2k / 9.1B), Havi, KamiBiii...' }
    },
    shop180d: {
      value: '2,3k Active',
      sub: { vi: 'Trung bình 33,9 KOC hoạt động/ngày', en: 'Avg 33.9 active KOCs per day' }
    },
    creator180d: {
      value: '177 SKUs',
      sub: { vi: 'LIVE gắn 375 mã vs. Video tập trung 137 mã', en: 'LIVE pins 375 SKUs vs. Video 137 SKUs' }
    },
    shop90d: {
      value: '5.713 Creators',
      sub: { vi: 'Affiliate: 27,83% GMV | Kệ hàng: 22,87% GMV', en: 'Affiliates: 27.83% GMV | Card: 22.87% GMV' }
    },
    creator90d: {
      value: '394 Niêm yết',
      sub: { vi: '48,7k–48,8k Followers (43% tại Hà Nội)', en: '48.7k–48.8k Followers (43% in Hanoi)' }
    }
  }
];

const DATASET_SCHEMA_ROWS: DatasetSchemaRow[] = [
  {
    id: 'store-daily-180d',
    fileName: 'Kami Ely_Store Detail Page_Data Overview (180 ngày)',
    layer: 'macro-180d',
    timeScope: { vi: '180 ngày (03/2026 – 09/2026)', en: '180 Days (03/2026 – 09/2026)' },
    entityScope: { vi: 'Toàn gian hàng (Cấp ngày)', en: 'Shop-wide (Day-level)' },
    granularity: { vi: '1 dòng / Ngày giao dịch', en: '1 row / Calendar Day' },
    primaryKeys: ['Date (PK)'],
    recordCount: { vi: '180 ngày', en: '180 days' },
    totalGmv: '12.735.128.067 VNĐ',
    totalUnits: { vi: '85.500 sản phẩm', en: '85,500 units' },
    analyticalRole: {
      vi: 'Phân tích chuỗi thời gian (Time-Series), xác định đỉnh lịch sử 16/06 (315,0 Tr đ / 1.936 SP), đáy 04/09 (5,4 Tr đ / 49 SP) và nghịch lý 09/04 (106 LIVE chỉ đạt 79,4 Tr đ) vs 25/06 (45 LIVE đạt 196,1 Tr đ).',
      en: 'Time-series trend analysis, pinpointing Jun 16 peak (315.0M VND / 1,936 units), Sep 04 trough (5.4M VND / 49 units), and Apr 09 spam (106 LIVEs = 79.4M) vs Jun 25 optimization (45 LIVEs = 196.1M).'
    }
  },
  {
    id: 'shop-live-180d',
    fileName: '_shop LIVE (180 ngày) [Tập 1 & Tập 2]',
    layer: 'macro-180d',
    timeScope: { vi: '180 ngày', en: '180 Days' },
    entityScope: { vi: 'Toàn sàn (Chính chủ + Affiliate)', en: 'All Sessions (Self + Affiliate)' },
    granularity: { vi: '1 dòng / Phiên LIVE toàn sàn', en: '1 row / Shop-wide LIVE Session' },
    primaryKeys: ['Session ID (PK)', 'Creator ID (FK)'],
    recordCount: { vi: '7.046 phiên Live', en: '7,046 Live sessions' },
    totalGmv: '9.262.277.940 VNĐ',
    totalUnits: { vi: '67.254 sản phẩm', en: '67,254 units' },
    analyticalRole: {
      vi: 'Bóc tách tỷ trọng đóng góp giữa LIVE chính chủ (chiếm 52,7% GMV LIVE toàn sàn ~ 4,9 Tỉ đ) và mạng lưới 234 KOC phát sóng trực tiếp.',
      en: 'Separates self-operated LIVE contribution (52.7% of shop LIVE GMV ~ 4.9B VND) from the external network of 234 LIVE KOCs.'
    }
  },
  {
    id: 'creator-live-180d',
    fileName: "[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày)",
    layer: 'macro-180d',
    timeScope: { vi: '180 ngày', en: '180 Days' },
    entityScope: { vi: 'Kênh chính chủ (@kamielyhn)', en: 'Self-operated (@kamielyhn)' },
    granularity: { vi: '1 dòng / Phiên LIVE chính chủ', en: '1 row / Self-operated Session' },
    primaryKeys: ['Session ID (PK)', 'Start Time'],
    recordCount: { vi: '475 phiên (470 chuẩn hóa)', en: '475 sessions (470 normalized)' },
    totalGmv: '7.023.530.158 VNĐ',
    totalUnits: { vi: '49.817 sản phẩm', en: '49,817 units' },
    analyticalRole: {
      vi: 'Đo lường 3.292.698 lượt xem (TB 6.932 views & 14,79 Tr đ/phiên; 95,58% phiên có đơn). Truy vết các phiên marathon tháng 6 (16/06 đạt 272,1 Tr đ / 1.850 đơn) và sự suy kiệt đầu tháng 9 (0đ – 119k đ).',
      en: 'Tracks 3,292,698 viewers (avg 6,932 views & 14.79M VND/session; 95.58% converting). Traces June marathon peaks (Jun 16: 272.1M / 1,850 units) and early September exhaustion (0 – 119k VND).'
    }
  },
  {
    id: 'creator-video-180d',
    fileName: "[Kami Ely]-Creator's Video List (180 ngày)",
    layer: 'macro-180d',
    timeScope: { vi: '180 ngày', en: '180 Days' },
    entityScope: { vi: 'Kênh chính chủ (@kamielyhn)', en: 'Self-operated (@kamielyhn)' },
    granularity: { vi: '1 dòng / Video đăng tải', en: '1 row / Published Video' },
    primaryKeys: ['Video ID (PK)', 'Post Time'],
    recordCount: { vi: '222 Video', en: '222 Videos' },
    totalGmv: '870.200.806 VNĐ',
    totalUnits: { vi: '5.144 sản phẩm', en: '5,144 units' },
    analyticalRole: {
      vi: 'Đánh giá hiệu suất nội dung tự sản xuất (TB 16,4k views/video), xác định khung giờ đăng bài và tỷ lệ thương mại hóa video trên kênh chính.',
      en: 'Evaluates in-house short-video production (avg 16.4k views/video), posting schedule efficiency, and video commercialization rate.'
    }
  },
  {
    id: 'shoppable-videos-hybrid',
    fileName: '[Kami Ely]_Shoppable_Videos (180 ngày)',
    layer: 'micro-90d',
    timeScope: { vi: 'Đăng 180d / Thu thập 90d', en: 'Posted 180d / Measured 90d' },
    entityScope: { vi: 'Video gắn giỏ hàng (Chính chủ + KOC)', en: 'Shoppable Videos (Self + KOC)' },
    granularity: { vi: '1 dòng / Video thương mại', en: '1 row / Shoppable Video' },
    primaryKeys: ['Video ID (PK)', 'Product ID (FK)'],
    recordCount: { vi: '4.417 Video', en: '4,417 Videos' },
    totalGmv: '2.170.840.326 VNĐ',
    totalUnits: { vi: '13.083 sản phẩm', en: '13,083 units' },
    analyticalRole: {
      vi: 'Chứng minh 94,70% GMV video (2.055.758.301 đ / 12.398 SP từ 3.482 video) phụ thuộc vào Quảng cáo trả phí (Ads = YES), trong khi Organic (935 video) chỉ chiếm 5,30% GMV (115.082.025 đ).',
      en: 'Proves 94.70% of video GMV (2,055,758,301 VND / 12,398 units across 3,482 videos) relies on Paid Ads (Ads = YES), while Organic (935 videos) accounts for only 5.30% (115,082,025 VND).'
    }
  },
  {
    id: 'product-data-90d',
    fileName: '_ product data (90 ngày)',
    layer: 'micro-90d',
    timeScope: { vi: '90 ngày gần nhất', en: 'Last 90 Days' },
    entityScope: { vi: 'Toàn bộ gian hàng (Cấp SKU)', en: 'Shop-wide Catalog (SKU-level)' },
    granularity: { vi: '1 dòng / Mã sản phẩm (SKU)', en: '1 row / Product ID (SKU)' },
    primaryKeys: ['Product ID / SKU (PK)'],
    recordCount: { vi: '331 sản phẩm', en: '331 products' },
    totalGmv: '6.136.205.973 VNĐ',
    totalUnits: { vi: '40.229 sản phẩm', en: '40,229 units' },
    analyticalRole: {
      vi: 'Phân tích danh mục: Đồ bơi & Bikini (Sports & Outdoor) chiếm ~66,5%–70% GMV (60,5% đơn), Thời trang nữ chiếm 28% GMV; vùng giá vàng 100k–200k đ mang lại 67,4% doanh thu.',
      en: 'Catalog analysis: Swimwear (Sports & Outdoor) drives ~66.5%–70% GMV (60.5% units), Womenswear drives 28% GMV; the 100k–200k VND sweet spot generates 67.4% of revenue.'
    }
  },
  {
    id: 'creator-goods-90d',
    fileName: "[Kami Ely]-Creator's Goods for Sale List (90 ngày)",
    layer: 'micro-90d',
    timeScope: { vi: '90 ngày gần nhất', en: 'Last 90 Days' },
    entityScope: { vi: 'Kênh chính chủ (@kamielyhn)', en: 'Self-operated (@kamielyhn)' },
    granularity: { vi: '1 dòng / Niêm yết sản phẩm', en: '1 row / Product Listing' },
    primaryKeys: ['Product ID / SKU (FK)'],
    recordCount: { vi: '394 niêm yết', en: '394 listings' },
    totalGmv: '3.026.026.869 VNĐ',
    totalUnits: { vi: '20.027 sản phẩm', en: '20,027 units' },
    analyticalRole: {
      vi: 'Xác định Hero SKUs trên kênh chính chủ (Top 1: Set Bikini 2 Mảnh Kẻ Sọc đạt 2.852 lượt bán / 500,2 Tr đ). Đối chiếu với _product data để đo tỷ lệ tự gánh 49,76% sản lượng.',
      en: 'Identifies self-channel Hero SKUs (Top 1: Striped 2-Piece Bikini Set with 2,852 units / 500.2M VND). Joins with _product data to verify the 49.76% self-reliance ratio.'
    }
  },
  {
    id: 'creators-merged-90d',
    fileName: '_Creators_merged (90 ngày)',
    layer: 'micro-90d',
    timeScope: { vi: '90 ngày gần nhất', en: 'Last 90 Days' },
    entityScope: { vi: 'Chính chủ + Mạng lưới Affiliate', en: 'Self-channel + Affiliate Network' },
    granularity: { vi: '1 dòng / Nhà sáng tạo (Creator)', en: '1 row / Creator Account' },
    primaryKeys: ['Creator ID (PK)', 'Category'],
    recordCount: { vi: '5.713 Creators', en: '5,713 Creators' },
    totalGmv: '4.734.186.743 VNĐ',
    totalUnits: { vi: '31.599 sản phẩm', en: '31,599 units' },
    analyticalRole: {
      vi: 'Phát hiện chỉ 5,1% Creators phát sinh đơn hàng; nhóm Nano/Micro (<5k followers) tạo phần lớn doanh số và riêng KOC @girlstyle.vn chiếm >40% GMV toàn mạng lưới Affiliate.',
      en: 'Reveals only 5.1% of Creators generate orders; Nano/Micro KOCs (<5k followers) drive the bulk of sales, with @girlstyle.vn alone accounting for >40% of Affiliate GMV.'
    }
  }
];

const RECONCILIATION_CARDS: ReconciliationCard[] = [
  {
    id: 'reconcile-product-card',
    badge: {
      vi: 'Đối soát 01 • Chênh lệch Kệ hàng (90 Ngày)',
      en: 'Reconciliation 01 • Product Card Gap (90 Days)'
    },
    title: {
      vi: 'Giải mã khoảng trống 8.630 sản phẩm giữa Bảng Sản Phẩm và Bảng Creators',
      en: 'Explaining the 8,630-Unit Gap Between Product Data and Creators Merged'
    },
    formula: 'Shop Total Units (40.229) − All Creators Units (31.599) = Product Card Units (8.630 SP ~ 21,45%)',
    leftMetric: {
      label: { vi: 'Tổng bán toàn shop (_product data)', en: 'Shop-wide Sales (_product data)' },
      value: '40.229 SP',
      sub: '6.136.205.973 VNĐ (331 SKUs)'
    },
    rightMetric: {
      label: { vi: 'Tổng bán qua Creators (_Creators_merged)', en: 'Creator Sales (_Creators_merged)' },
      value: '31.599 SP',
      sub: '4.734.186.743 VNĐ (5.713 Creators)'
    },
    deltaHighlight: {
      vi: 'Khoảng chênh lệch: 8.630 SP (21,45% sản lượng) & 1.402.019.230 VNĐ (22,85% GMV)',
      en: 'Reconciled Delta: 8,630 units (21.45% volume) & 1,402,019,230 VND (22.85% GMV)'
    },
    explanation: {
      vi: 'Khớp hoàn toàn với cơ cấu kênh trên báo cáo tổng quan 90 ngày: Kênh Chính chủ chiếm 49,76% sản lượng (20.027 SP), Affiliate chiếm 28,75% (11.572 SP), và phần còn lại chính là Thẻ sản phẩm / Kệ hàng (Product Card chiếm 21,49% sản lượng & 22,87% GMV). Tiêu biểu trên Seller Center, thẻ sản phẩm "Chân Váy Ngắn Form Chữ A" thu hút 161,42K người xem, 10,08K lượt nhấp (CTR 6,25%) và 782 khách/ngày hoàn toàn không tốn phí hoa hồng.',
      en: 'Matches the 90-day channel attribution breakdown: Self-operated accounts for 49.76% (20,027 units), Affiliates 28.75% (11,572 units), and the exact remainder is Product Card / Shopping Mall (21.49% units & 22.87% GMV). On Seller Center, the "A-Line Short Skirt" card alone drew 161.42K viewers, 10.08K clicks (6.25% CTR), and 782 daily visitors with zero commission cost.'
    },
    sqlJoinHint: 'SELECT p.product_id, p.units_sold - COALESCE(c.units_sold, 0) AS card_and_aff_units FROM product_data_90d p LEFT JOIN creator_goods_90d c USING (product_id);'
  },
  {
    id: 'reconcile-gross-vs-net-live',
    badge: {
      vi: 'Đối soát 02 • Gross vs. Net GMV (180 Ngày)',
      en: 'Reconciliation 02 • Gross vs. Net GMV (180 Days)'
    },
    title: {
      vi: 'Đối soát Doanh thu Gộp cấp Phiên (7,02 Tỉ đ) vs. Doanh thu Quy nạp Kênh (4,9 Tỉ đ)',
      en: 'Reconciling Session-Level Gross GMV (7.02B) vs. Net Attributed LIVE GMV (4.9B)'
    },
    formula: 'CSV Session Gross (7,02 Tỉ đ / 475 phiên) ➔ Net Attributed LIVE (4,9 Tỉ đ / 470 phiên = 52,7% Toàn sàn)',
    leftMetric: {
      label: { vi: 'Tổng gộp cấp phiên (CSV 475 phiên)', en: 'Session-level Gross Sum (475 sessions)' },
      value: '7,02 Tỉ đ',
      sub: '49.817 SP | 454/475 phiên có đơn (95,58%)'
    },
    rightMetric: {
      label: { vi: 'Doanh thu LIVE quy nạp (470 phiên)', en: 'Net Attributed LIVE GMV (470 sessions)' },
      value: '4,90 Tỉ đ',
      sub: 'Chiếm 52,7% trong 9,26–9,3 Tỉ LIVE toàn sàn'
    },
    deltaHighlight: {
      vi: 'Hệ số hao hụt đặt hàng – thanh toán thực nhận & lọc 5 phiên test/trùng lặp',
      en: 'Order-to-settlement realization factor & deduplication of 5 test/overlapping sessions'
    },
    explanation: {
      vi: 'File CSV cấp phiên ghi nhận tổng giá trị đơn đặt hàng phát sinh trực tiếp trong lúc phát sóng (Gross Session GMV = 7.023.530.158 đ), trong khi báo cáo tổng hợp kênh 180 ngày chuẩn hóa về 470 phiên với 4,9 Tỉ đ sau khi loại trừ đơn hủy/hoàn và đồng bộ cửa sổ thanh toán. Hiện tượng này đồng nhất với dữ liệu Seller Center 28 ngày: GMV đặt hàng đạt 1,35B đ (+56,24%) trong khi Tổng doanh thu thực nhận đạt 1,40B đ (+36,29% trên 10.554 món bán ra).',
      en: 'The session-level CSV logs gross in-stream order value (7,023,530,158 VND across 475 sessions), whereas the 180-day channel overview normalizes to 470 sessions and 4.9B VND after accounting for cancellations/returns and settlement windows. This aligns with Seller Center 28-day telemetry where GMV grew +56.24% (1.35B VND) while recognized revenue grew +36.29% (1.40B VND across 10,554 items).'
    },
    sqlJoinHint: 'SELECT COUNT(DISTINCT s.session_id), SUM(s.gmv) FROM shop_live_180d s INNER JOIN creator_live_180d c ON s.session_id = c.session_id;'
  },
  {
    id: 'reconcile-funnel-telemetry',
    badge: {
      vi: 'Đối soát 03 • Phễu Phòng LIVE & Độ trễ Video',
      en: 'Reconciliation 03 • LIVE Funnel & Video Attribution'
    },
    title: {
      vi: 'Kết nối Nghịch lý GPM (135,2k vs 30,2k đ) với Nguồn Lưu Lượng Phòng LIVE & Paid Ads',
      en: 'Linking the 4.5x GPM Paradox (135.2k vs 30.2k) to LIVE Room Traffic & Paid Ads'
    },
    formula: 'Feed Live Preview (46% PV ➔ 5,09% Vào phòng) vs. Search (43% PV ➔ 25,68% Vào phòng)',
    leftMetric: {
      label: { vi: 'LIVE GPM vs. Video GPM (28 ngày)', en: 'LIVE GPM vs. Video GPM (Last 28d)' },
      value: '30,2k vs 135,2k',
      sub: 'Video GPM gấp 4,5x LIVE (Ảnh 080124)'
    },
    rightMetric: {
      label: { vi: 'Tỷ trọng Video chạy Ads (4.417 video)', en: 'Paid Ads Share in Shoppable Videos' },
      value: '94,70% GMV',
      sub: '2,056 Tỉ đ (3.482 video Ads) vs 115 Tr đ Organic'
    },
    deltaHighlight: {
      vi: 'Chẩn đoán 7 ngày (@kamielyhn: 33.011.731 đ): Tìm kiếm có tỷ lệ vào phòng cao gấp 5 lần Ô Live',
      en: '7-day diagnosis (@kamielyhn: 33,011,731 VND): Search entry rate (25.68%) is 5x higher than Feed Preview (5.09%)'
    },
    explanation: {
      vi: 'Tại sao GPM của LIVE chỉ đạt 29,2k–30,2k đ? Dữ liệu chẩn đoán tài khoản kết nối trên Seller Center chỉ ra 46% lượt hiển thị phòng LIVE đến từ "Bảng tin - Ô Live" nhưng tỷ lệ khách bấm vào phòng chỉ đạt 5,09%, trong khi nguồn "Tìm kiếm" (43% PV) đạt tỷ lệ vào phòng 25,68% và "Hợp nhất Live" (2% PV) đạt 41,41%. Ngược lại, kênh Shoppable Video đạt GPM 134,8k–135,2k đ nhờ vòng đời tích lũy 90 ngày và đòn bẩy từ 3.482 video chạy Ads.',
      en: 'Why is LIVE GPM only 29.2k–30.2k VND? Seller Center account diagnostics reveal that 46% of LIVE PV comes from "Feed Live Preview" with only a 5.09% room entry rate, whereas "Search" (43% PV) achieves a 25.68% entry rate and "Live Merge" (2% PV) hits 41.41%. Conversely, Shoppable Video achieves 134.8k–135.2k VND GPM thanks to a 90-day cumulative attribution tail and paid boost across 3,482 ad-backed videos.'
    },
    sqlJoinHint: 'SELECT ads_status, COUNT(video_id), SUM(units_sold), SUM(gmv) FROM shoppable_videos_180d GROUP BY ads_status;'
  }
];

export default function KamiElyDataScopeMatrix({
  scopeType = 'shop',
  isEn: propIsEn,
  openProofScreenshot,
  openProofModalWithGroup,
  onOpenProofModal
}: KamiElyDataScopeMatrixProps) {
  const { language } = useLanguage();
  const lang = (propIsEn !== undefined ? propIsEn : language === 'en') ? 'en' : 'vi';

  const [activeTab, setActiveTab] = useState<MatrixViewTab>('windows');
  const [layerFilter, setLayerFilter] = useState<DatasetLayerFilter>('all');

  const handleOpenProof = (scId?: string) => {
    if (scId && openProofScreenshot) {
      openProofScreenshot(scId);
    } else if (onOpenProofModal) {
      onOpenProofModal(scId);
    } else if (openProofModalWithGroup) {
      openProofModalWithGroup(scopeType);
    }
  };

  const filteredDatasets = DATASET_SCHEMA_ROWS.filter((row) =>
    layerFilter === 'all' ? true : row.layer === layerFilter
  );

  return (
    <section
      id="data-scope-matrix"
      className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/90 p-5 sm:p-8 shadow-2xl space-y-6"
    >
      {/* HEADER & QUICK BADGES */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-2">
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded-md">
              {lang === 'vi' ? 'Kiến trúc & Phạm vi Dữ liệu' : 'Data Architecture & Scope Matrix'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              {lang === 'vi'
                ? '8 Tập Dữ liệu (9 CSV) + 22 Ảnh FastMoss + Seller Center'
                : '8 Datasets (9 CSVs) + 22 FastMoss Captures + Seller Center'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'Ma Trận Đối Soát Đa Tầng: Toàn Shop vs. Kênh Chính Chủ (@kamielyhn)'
              : 'Multi-Tier Data Scope Matrix: Shop-Wide vs. Self-Operated (@kamielyhn)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            {lang === 'vi'
              ? 'Phân tách minh bạch 3 khung thời gian (Toàn thời gian từ 18/08/2022, Chu kỳ mùa vụ 180 ngày 03–09/2026 và Cửa sổ quy nạp chuyển đổi 90 ngày) nhằm loại bỏ hoàn toàn sai lệch số liệu giữa báo cáo tổng quan và log giao dịch chi tiết.'
              : 'Clearly separates 3 time horizons (All-time since 2022-08-18, 180-day seasonality cycle 03–09/2026, and 90-day attribution window) to reconcile overview dashboards with granular transaction logs.'}
          </p>
        </div>

        {/* NAVIGATION PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('windows')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'windows'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {lang === 'vi' ? '1. Đối chiếu 3 Khung Thời Gian' : '1. 3-Window Comparison'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('datasets')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'datasets'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {lang === 'vi' ? '2. Danh mục 8 Bảng CSV (Schema)' : '2. 8 CSV Datasets & Keys'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'reconciliation'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {lang === 'vi' ? '3. Đối soát Liên Bảng & Phễu' : '3. Cross-Table Reconciliation'}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: BẢNG ĐỐI CHIẾU TOÀN SHOP VS KÊNH CHÍNH CHỦ (3 KHUNG THỜI GIAN) */}
      {/* =================================================================== */}
      {activeTab === 'windows' && (
        <div className="space-y-4">
          {/* Callout giải thích ảnh All-time vs 180 ngày */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span>⚠️ {lang === 'vi' ? 'Lưu ý Chuẩn hóa Phương pháp Luận (Time-Window Audit):' : 'Methodology Audit Note (Time-Window Separation):'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'vi'
                  ? 'Ảnh Screenshot 073329 (31,6 Tỉ đ | 238,4k SP | 12,4k LIVE) và Screenshot 080124 (9,2 Tỉ đ | 2,5k LIVE | 859 Video) là dữ liệu tích lũy Toàn thời gian từ khi lập shop, KHÔNG phải dữ liệu 180 ngày. Trong 180 ngày gần nhất, toàn shop thực hiện 7.046 phiên LIVE (9,26 Tỉ đ) và kênh chính chủ thực hiện 470–475 phiên LIVE (4,9–7,02 Tỉ đ).'
                  : 'Screenshots 073329 (31.6B VND | 238.4k units | 12.4k LIVEs) and 080124 (9.2B VND | 2.5k LIVEs | 859 Videos) represent cumulative All-Time metrics since inception, NOT 180-day metrics. Over the last 180 days, the shop ran 7,046 LIVEs (9.26B VND) and the self-operated channel ran 470–475 LIVEs (4.9B–7.02B VND).'}
              </p>
            </div>
            {(onOpenProofModal || openProofScreenshot || openProofModalWithGroup) && (
              <button
                type="button"
                onClick={() => handleOpenProof('073329')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-mono font-semibold transition cursor-pointer"
              >
                {lang === 'vi' ? 'Xem Ảnh Gốc (073329 / 080124)' : 'View Raw Captures'}
              </button>
            )}
          </div>

          {/* Bảng ma trận 6 cột dữ liệu */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/95 border-b border-slate-800 text-slate-300">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider w-44">
                    {lang === 'vi' ? 'Chỉ Số Đối Chiếu' : 'Metric'}
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60 border-l border-slate-800">
                    <span className="text-sky-400 font-bold block">
                      {lang === 'vi' ? 'Toàn Shop (All-Time)' : 'Shop-Wide (All-Time)'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Screenshot 073329</span>
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60">
                    <span className="text-indigo-400 font-bold block">
                      {lang === 'vi' ? 'Chính Chủ (All-Time)' : 'Self-Channel (All-Time)'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Screenshot 080124</span>
                  </th>
                  <th className="py-3.5 px-4 border-l border-slate-800">
                    <span className="text-emerald-400 font-bold block">
                      {lang === 'vi' ? 'Toàn Shop (180 Ngày)' : 'Shop-Wide (180 Days)'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">03/2026 – 09/2026</span>
                  </th>
                  <th className="py-3.5 px-4">
                    <span className="text-teal-400 font-bold block">
                      {lang === 'vi' ? 'Chính Chủ (180 Ngày)' : 'Self-Channel (180 Days)'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">@kamielyhn (180d)</span>
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60 border-l border-slate-800">
                    <span className="text-amber-400 font-bold block">
                      {lang === 'vi' ? 'Toàn Shop (90 Ngày)' : 'Shop-Wide (90 Days)'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Attribution Window</span>
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60">
                    <span className="text-pink-400 font-bold block">
                      {lang === 'vi' ? 'Chính Chủ (90 Ngày)' : 'Self-Channel (90 Days)'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">49,76% Core Driver</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {MULTI_WINDOW_ROWS.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white bg-slate-950/60">
                      {row.metric[lang]}
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-800/70">
                      <div className="font-mono font-bold text-sm text-sky-300">{row.shopAllTime.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.shopAllTime.sub[lang]}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sm text-indigo-300">{row.creatorAllTime.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.creatorAllTime.sub[lang]}</div>
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-800/70">
                      <div className="font-mono font-bold text-sm text-emerald-300">{row.shop180d.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.shop180d.sub[lang]}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sm text-teal-300">{row.creator180d.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.creator180d.sub[lang]}</div>
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-800/70">
                      <div className="font-mono font-bold text-sm text-amber-300">{row.shop90d.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.shop90d.sub[lang]}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sm text-pink-300">{row.creator90d.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.creator90d.sub[lang]}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3 Chỉ báo Nhận định Nhanh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-sky-400">
                {lang === 'vi'
                  ? '1. Độ tập trung vào Kênh Chính Chủ tăng mạnh'
                  : '1. Rising Self-Operated Channel Dependency'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'vi'
                  ? 'Tỷ trọng GMV của kênh chính chủ @kamielyhn tăng từ 29,1% (Toàn thời gian) lên 45,7% (180 ngày) và đạt 49,3% GMV / 49,76% sản lượng trong 90 ngày gần nhất.'
                  : 'Self-operated channel (@kamielyhn) GMV share rose from 29.1% (All-time) to 45.7% (180d) and reached 49.3% of GMV / 49.76% of units in the last 90 days.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-pink-400">
                {lang === 'vi'
                  ? '2. Nghịch lý GPM Video vs. Livestream (4,5x)'
                  : '2. Video vs. Livestream GPM Paradox (4.5x)'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'vi'
                  ? 'Trong 28 ngày gần nhất, Video mua sắm đạt GPM 134,8k–135,2k đ/1.000 views (gấp 4,5 lần mức 29,2k–30,2k đ của LIVE), nhưng kênh vẫn còn 308/859 video chưa gắn giỏ hàng.'
                  : 'Over the last 28 days, Shoppable Video achieved 134.8k–135.2k VND GPM (4.5x higher than LIVE at 29.2k–30.2k VND), yet 308 of 859 videos remain non-shoppable.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-emerald-400">
                {lang === 'vi'
                  ? '3. Rủi ro Mùa vụ & Nhân khẩu học (43% Hà Nội)'
                  : '3. Seasonality & Audience Concentration (43% Hanoi)'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'vi'
                  ? 'Do ngành hàng Đồ bơi chiếm ~70% GMV và 43% người theo dõi ở Hà Nội, doanh số lập đỉnh 315,0 Tr đ ngày 16/06 nhưng rơi xuống 5,4 Tr đ ngày 04/09 (28 ngày cuối giảm -260 followers).'
                  : 'Because Swimwear drives ~70% of GMV and 43% of followers reside in Hanoi, daily GMV peaked at 315.0M VND on Jun 16 before dropping to 5.4M VND on Sep 04 (-260 followers in 28d).'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: KIẾN TRÚC 8 TẬP DỮ LIỆU CSV & KHÓA LIÊN KẾT (SCHEMA & KEYS)  */}
      {/* =================================================================== */}
      {activeTab === 'datasets' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              {lang === 'vi'
                ? 'Bộ lọc tầng dữ liệu: Tầng Vĩ mô (180 ngày - Chuỗi thời gian & Phiên) vs. Tầng Vi mô (90 ngày - Quy nạp SKU & KOC)'
                : 'Filter by analytical layer: Macro Layer (180d Time-series & Sessions) vs. Micro Layer (90d SKU & Creator Attribution)'}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setLayerFilter('all')}
                className={`px-3 py-1 rounded-md font-mono transition cursor-pointer ${
                  layerFilter === 'all'
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {lang === 'vi' ? 'Tất cả (8 Bảng)' : 'All (8 Tables)'}
              </button>
              <button
                type="button"
                onClick={() => setLayerFilter('macro-180d')}
                className={`px-3 py-1 rounded-md font-mono transition cursor-pointer ${
                  layerFilter === 'macro-180d'
                    ? 'bg-sky-500 text-white font-bold'
                    : 'bg-slate-900 text-sky-400 border border-slate-800'
                }`}
              >
                {lang === 'vi' ? 'Vĩ mô 180 Ngày (4)' : 'Macro 180d (4)'}
              </button>
              <button
                type="button"
                onClick={() => setLayerFilter('micro-90d')}
                className={`px-3 py-1 rounded-md font-mono transition cursor-pointer ${
                  layerFilter === 'micro-90d'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-slate-900 text-emerald-400 border border-slate-800'
                }`}
              >
                {lang === 'vi' ? 'Vi mô 90 Ngày (4)' : 'Micro 90d (4)'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/95 border-b border-slate-800 text-slate-300">
                  <th className="py-3 px-4">{lang === 'vi' ? 'Tên Bảng Dữ Liệu (CSV)' : 'Dataset File Name'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Phạm Vi & Cấp Độ' : 'Scope & Granularity'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Khóa Liên Kết (Keys)' : 'Join Keys'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Bản Ghi' : 'Records'}</th>
                  <th className="py-3 px-3">{lang === 'vi' ? 'Tổng GMV & Sản Lượng' : 'Total GMV & Units'}</th>
                  <th className="py-3 px-4">{lang === 'vi' ? 'Vai Trò Phân Tích Trong Dự Án' : 'Analytical Role'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredDatasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-sky-400 max-w-xs">
                      <div>{ds.fileName}</div>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded font-sans ${
                          ds.layer === 'macro-180d'
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {ds.timeScope[lang]}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-200">
                      <div className="font-semibold">{ds.entityScope[lang]}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{ds.granularity[lang]}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      <div className="flex flex-col gap-1">
                        {ds.primaryKeys.map((k) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 w-fit"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                      {ds.recordCount[lang]}
                    </td>
                    <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                      <div className="font-bold text-emerald-400">{ds.totalGmv}</div>
                      <div className="text-[11px] text-slate-300">{ds.totalUnits[lang]}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 leading-relaxed min-w-[260px]">
                      {ds.analyticalRole[lang]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: ĐỐI SOÁT LIÊN BẢNG & CHẨN ĐOÁN TELEMETRY SELLER CENTER       */}
      {/* =================================================================== */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {RECONCILIATION_CARDS.map((card) => (
              <div
                key={card.id}
                className="p-5 rounded-2xl bg-slate-900/75 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md">
                    {card.badge[lang]}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug">{card.title[lang]}</h3>

                  {/* Công thức đối soát */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-sky-300">
                    {card.formula}
                  </div>

                  {/* 2 Cột Metric So sánh */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">{card.leftMetric.label[lang]}</div>
                      <div className="text-base font-mono font-extrabold text-white mt-1">
                        {card.leftMetric.value}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{card.leftMetric.sub}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">{card.rightMetric.label[lang]}</div>
                      <div className="text-base font-mono font-extrabold text-emerald-400 mt-1">
                        {card.rightMetric.value}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{card.rightMetric.sub}</div>
                    </div>
                  </div>

                  {/* Kết quả khớp số liệu */}
                  <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
                    ✓ {card.deltaHighlight[lang]}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{card.explanation[lang]}</p>
                </div>

                {/* SQL Join Hint */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                    SQL Reconciliation Query:
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-300 overflow-x-auto">
                    <code>{card.sqlJoinHint}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
