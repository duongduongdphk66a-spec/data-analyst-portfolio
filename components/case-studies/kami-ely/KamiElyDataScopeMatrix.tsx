'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Terminal, Copy, Check, Database, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { KAMI_RECONCILIATION_CASES } from '@/app/data/kami-ely/reconciliation';

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
      sub: { vi: 'Net Kênh (Gross CSV: 7,89 Tỉ đ / 54,9k SP)', en: 'Net Settled (CSV Gross: 7.89B / 54.9k units)' }
    },
    shop90d: {
      value: '6,14 Tỉ đ',
      sub: { vi: '6.136.205.973 đ (~6,08 Tỉ trên Overview)', en: '6,136,205,973 VND (~6.08B Overview)' }
    },
    creator90d: {
      value: '3,03 Tỉ đ',
      sub: { vi: '3.026.026.869 đ (Chiếm 49,3% GMV shop)', en: '3,026,026,869 VND (49.3% shop GMV)' }
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
      sub: { vi: 'Affiliate: 27,84% GMV | Kệ hàng: 22,85% GMV', en: 'Affiliates: 27.84% GMV | Card: 22.85% GMV' }
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
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const handleOpenProof = (scId?: string) => {
    if (scId && openProofScreenshot) {
      openProofScreenshot(scId);
    } else if (onOpenProofModal) {
      onOpenProofModal(scId);
    } else if (openProofModalWithGroup) {
      openProofModalWithGroup(scopeType);
    }
  };

  const handleCopySql = (id: string, sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 2000);
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
              {lang === 'vi' ? 'Kiến trúc & Kiểm Toán Dữ Liệu' : 'Data Architecture & Reconciliation'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              {lang === 'vi'
                ? '8 Bảng Dữ Liệu + 22 Ảnh Bằng Chứng FastMoss + Seller Center'
                : '8 Datasets + 22 FastMoss Proof Captures + Seller Center'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
              {lang === 'vi' ? '4 Quy Tắc Kiểm Toán Liên Bảng' : '4 Cross-Table Audit Rules'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {lang === 'vi'
              ? 'Ma Trận Đối Soát Đa Tầng: Toàn Shop vs. Kênh Chính Chủ (@kamielyhn)'
              : 'Multi-Tier Data Scope Matrix: Shop-Wide vs. Self-Operated (@kamielyhn)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            {lang === 'vi'
              ? 'Chuẩn hóa minh bạch 3 khung thời gian (Nền tảng All-time từ 18/08/2022, Chu kỳ mùa vụ 180 ngày 03–09/2026 và Cửa sổ quy nạp 90 ngày) cùng 4 trường hợp đối soát liên bảng thực chiến.'
              : 'Decouples 3 distinct time horizons (Historical All-time since 2022-08-18, 180-day Seasonality 03–09/2026, and 90-day Attribution) with 4 production-grade cross-table audit cases.'}
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
            {lang === 'vi' ? '3. Đối Soát Liên Bảng & SQL Lab' : '3. Cross-Table & SQL Lab'}
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
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'vi' ? 'Quy tắc Kiểm toán Thời gian (Time-Window Audit Rule):' : 'Time-Window Audit Methodology Rule:'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {lang === 'vi'
                  ? 'Ảnh Screenshot 073329 (31,6 Tỉ đ / 238,4k SP / 12,4k LIVE) và Screenshot 080124 (9,2 Tỉ đ / 2,5k LIVE / 859 Video) là số liệu tích lũy Toàn thời gian từ 18/08/2022, KHÔNG phải 180 ngày. Trong 180 ngày gần nhất (09/03 – 04/09/2026), toàn shop đạt 12,74 Tỉ đ / 85,5k SP qua 7.046 phiên LIVE và kênh chính chủ đạt 4,9 Tỉ đ Net (7,02 Tỉ đ Gross) qua 470–475 phiên.'
                  : 'Screenshots 073329 (31.6B VND / 238.4k units / 12.4k LIVEs) and 080124 (9.2B VND / 2.5k LIVEs / 859 Videos) capture cumulative All-Time performance since 2022-08-18, NOT 180-day metrics. Over the 180-day seasonal window (09/03 – 04/09/2026), shop-wide GMV is 12.74B VND / 85.5k units across 7,046 LIVEs and self-operated LIVE reached 4.90B VND Net (7.02B VND Gross).'}
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

          {/* Bảng ma trận 6 cột dữ liệu với Badge thời gian cố định */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/95 border-b border-slate-800 text-slate-300">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider w-44">
                    {lang === 'vi' ? 'Chỉ Số Đối Chiếu' : 'Metric'}
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60 border-l border-slate-800">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px] uppercase font-bold">
                        ALL-TIME
                      </span>
                      <span className="text-sky-400 font-bold">
                        {lang === 'vi' ? 'Toàn Shop' : 'Shop-Wide'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Từ 18/08/2022 (Ảnh 073329)</span>
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase font-bold">
                        ALL-TIME
                      </span>
                      <span className="text-indigo-400 font-bold">
                        {lang === 'vi' ? 'Chính Chủ' : 'Self-Channel'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">@kamielyhn (Ảnh 080124)</span>
                  </th>
                  <th className="py-3.5 px-4 border-l border-slate-800">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] uppercase font-bold">
                        180 NGÀY
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {lang === 'vi' ? 'Toàn Shop' : 'Shop-Wide'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">09/03 – 04/09/2026 (CSV)</span>
                  </th>
                  <th className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[9px] uppercase font-bold">
                        180 NGÀY
                      </span>
                      <span className="text-teal-400 font-bold">
                        {lang === 'vi' ? 'Chính Chủ' : 'Self-Channel'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Net Settled (5,80 Tỉ đ)</span>
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60 border-l border-slate-800">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] uppercase font-bold">
                        90 NGÀY
                      </span>
                      <span className="text-amber-400 font-bold">
                        {lang === 'vi' ? 'Toàn Shop' : 'Shop-Wide'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Quy nạp SKU (6,14 Tỉ đ)</span>
                  </th>
                  <th className="py-3.5 px-4 bg-slate-900/60">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[9px] uppercase font-bold">
                        90 NGÀY
                      </span>
                      <span className="text-pink-400 font-bold">
                        {lang === 'vi' ? 'Chính Chủ' : 'Self-Channel'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">3,03 Tỉ đ (49,76% SP)</span>
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
                  ? '1. Trụ cột Kênh Chính Chủ (@kamielyhn)'
                  : '1. Self-Operated Channel Dependency'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'vi'
                  ? 'Tỷ trọng GMV kênh chính chủ tăng từ 29,1% (All-time) lên 45,7% (180 ngày) và đạt 49,3% GMV / 49,76% sản lượng trong 90 ngày (3,03 Tỉ đ / 20.027 SP).'
                  : 'Self-operated channel (@kamielyhn) GMV share rose from 29.1% (All-time) to 45.7% (180d) and reached 49.3% GMV / 49.76% volume in 90 days (3.03B VND / 20,027 units).'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-pink-400">
                {lang === 'vi'
                  ? '2. Nghịch lý GPM Video vs. LIVE (4,5x)'
                  : '2. Video vs. Livestream GPM Paradox (4.5x)'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'vi'
                  ? 'Video mua sắm đạt GPM 134,8k–135,2k đ/1.000 views (gấp 4,5 lần LIVE 29,2k–30,2k đ) nhờ 94,70% GMV được thúc đẩy bởi Video Shopping Ads (3.482 video Ads).'
                  : 'Shoppable Video reached 134.8k–135.2k VND GPM (4.5x higher than LIVE at 29.2k–30.2k VND) powered by 94.70% Paid Ads leverage (3,482 ad-boosted videos).'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="font-bold text-emerald-400">
                {lang === 'vi'
                  ? '3. Rủi ro Mùa vụ & Địa lý (43% Hà Nội)'
                  : '3. Seasonality & Geo Concentration (43% Hanoi)'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'vi'
                  ? 'Do ngành hàng Đồ bơi chiếm ~70% GMV và 43% follower tại Hà Nội, doanh số rơi tự do từ đỉnh 315,0 Tr đ (16/06) xuống đáy 5,44 Tr đ (04/09), đòi hỏi xoay trục sang thời trang Thu–Đông.'
                  : 'With Swimwear driving ~70% GMV and 43% followers in Hanoi, daily revenue plunged from 315.0M peak (Jun 16) to 5.44M trough (Sep 04), demanding an Autumn-Winter catalog pivot.'}
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
      {/* TAB 3: ĐỐI SOÁT LIÊN BẢNG & TRUY VẤN SQL LAB TRỰC TIẾP              */}
      {/* =================================================================== */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          {/* Quick Preset SQL Launchpad */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>{lang === 'vi' ? 'Phòng Thí Nghiệm SQL Khách Tham Quan (SQL Lab)' : 'Visitor SQL Telemetry Lab'}</span>
              </div>
              <p className="text-xs text-slate-300">
                {lang === 'vi'
                  ? 'Kiểm chứng trực tiếp các truy vấn đối soát dữ liệu thực tế của Kami Ely ngay trong SQL Lab với 0ms độ trễ.'
                  : 'Verify real Kami Ely reconciliation and telemetry queries live in SQL Lab with 0ms execution lag.'}
              </p>
            </div>
            <Link
              href="/lab?scenario=kami-channels"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer shrink-0"
            >
              <Terminal className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Khởi Động SQL Lab Toàn Màn Hình' : 'Launch Full SQL Lab'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Reconciliation Cards Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {KAMI_RECONCILIATION_CASES.map((card) => (
              <div
                key={card.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between space-y-4 hover:border-sky-500/40 transition shadow-lg"
              >
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md">
                      {card.badge[lang]}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ✓ {card.reconciliationStatus === 'verified' ? (lang === 'vi' ? 'Đã kiểm toán & khớp 100%' : 'Audited & 100% Verified') : 'Reconciled'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{card.title[lang]}</h3>

                  {/* Cửa sổ thời gian & Tệp dữ liệu liên quan */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-300">{lang === 'vi' ? 'Cửa sổ thời gian: ' : 'Time Horizon: '}</span>
                      <span className="font-mono text-amber-300">{card.timeWindow[lang]}</span>
                    </div>
                    <div className="text-slate-400 line-clamp-1">
                      <span className="font-semibold text-slate-300">{lang === 'vi' ? 'Tệp đối soát: ' : 'Files involved: '}</span>
                      <span className="font-mono text-sky-300">{card.tablesInvolved.join(' | ')}</span>
                    </div>
                  </div>

                  {/* Công thức đối soát */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-sky-500/25 font-mono text-[11px] text-sky-300 shadow-inner overflow-x-auto">
                    {card.formula}
                  </div>

                  {/* 2 Cột Metric So sánh */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400">{card.metricsComparison.sourceA.name}</div>
                      <div className="text-sm sm:text-base font-mono font-extrabold text-white mt-1">
                        {card.metricsComparison.sourceA.value}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400">{card.metricsComparison.sourceB.name}</div>
                      <div className="text-sm sm:text-base font-mono font-extrabold text-emerald-400 mt-1">
                        {card.metricsComparison.sourceB.value}
                      </div>
                    </div>
                  </div>

                  {/* Kết quả khớp số liệu */}
                  <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 flex items-center justify-between">
                    <span>✓ {card.metricsComparison.variance.label}: {card.metricsComparison.variance.value}</span>
                    {card.metricsComparison.variance.pct && (
                      <span className="font-mono text-[11px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200">
                        {card.metricsComparison.variance.pct}
                      </span>
                    )}
                  </div>

                  {/* Hiện tượng & Giải mã chi tiết */}
                  <p className="text-xs text-slate-300 leading-relaxed">{card.dataDrivenExplanation[lang]}</p>

                  {/* Technical Takeaway */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed space-y-1">
                    <span className="font-bold text-sky-400 block font-mono">
                      {lang === 'vi' ? '⚡ NGUYÊN TẮC ANALYTICS THỰC CHIẾN:' : '⚡ PRACTICAL ANALYTICS PRINCIPLE:'}
                    </span>
                    <span>{card.technicalTakeaway[lang]}</span>
                  </div>
                </div>

                {/* SQL Query & Actions */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono uppercase text-slate-400 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-sky-400" />
                      <span>{lang === 'vi' ? 'Câu lệnh SQL Kiểm Toán:' : 'SQL Audit Query:'}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopySql(card.id, card.sqlJoinHint)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[10px] transition cursor-pointer"
                      >
                        {copiedQueryId === card.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                      {card.sqlPresetId && (
                        <Link
                          href={`/lab?scenario=${card.sqlPresetId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 font-mono text-[10px] font-semibold transition cursor-pointer"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>{lang === 'vi' ? 'Chạy Trong SQL Lab' : 'Run in Lab'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-900">
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
