'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import FastMossHtmlMockupCard from '@/components/case-studies/kami-ely/FastMossHtmlMockupCard';

export interface KamiElySqlBookVisualFlowProps {
  onOpenProofModal?: (_screenshotId?: string) => void;
  isEn?: boolean;
}

export default function KamiElySqlBookVisualFlow({
  onOpenProofModal,
  isEn: propIsEn
}: KamiElySqlBookVisualFlowProps) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const [activeStage, setActiveStage] = useState<number>(0);
  const [showSql, setShowSql] = useState<boolean>(false);

  const stages = [
    {
      stageNum: 'I',
      chapter: {
        vi: 'Chương 1 • Luồng & Chỉ Số (KPIs)',
        en: 'Chapter 1 • Workflow & Core KPIs'
      },
      title: {
        vi: 'Kiến Trúc Luồng Dữ Liệu 4 Bước & 3 Câu Hỏi Kinh Doanh Cốt Lõi',
        en: '4-Step Analysis Workflow & 3 Core Business Questions'
      },
      screenshotId: '073329',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073329.png',
      screenshotCaption: {
        vi: 'All-Time: 31,6 Tỉ đ • 238,4k SP • 12,4k LIVE • 6,0k KOCs',
        en: 'All-Time: 31.6B VND • 238.4k Units • 12.4k LIVEs • 6.0k KOCs'
      },
      kpis: [
        {
          label: isEn ? 'New Traffic (28d)' : 'Thu hút mới (28d)',
          value: '2,90K Khách',
          sub: isEn ? 'From 1.17M Showcase views (+983 KOCs)' : 'Từ 1,17M views Kệ hàng (+983 KOCs)'
        },
        {
          label: isEn ? '180-Day GMV Scope' : 'Xu hướng 180 Ngày',
          value: '12,74 Tỉ đ',
          sub: isEn ? '85,500 units • Jun Peak: 3.77B VND' : '85.500 SP • Đỉnh T6: 3,77 Tỉ đ'
        },
        {
          label: isEn ? 'Converting LIVE Rate' : 'Tỷ lệ LIVE có đơn',
          value: '95,58%',
          sub: isEn ? '454 of 475 self-operated streams converted' : '454/475 phiên chính chủ ra đơn'
        }
      ],
      visualBars: [
        {
          label: isEn ? '1. Source Systems (8 CSVs + 22 Seller Center Captures)' : '1. Source Systems (8 CSV + 22 Ảnh Seller Center)',
          pct: 100,
          val: isEn ? '18,778 raw records' : '18.778 bản ghi gốc',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? '2. Data Warehouse ELT (MySQL / SQLite Relational Schema)' : '2. Data Warehouse ELT (MySQL / SQLite Schema)',
          pct: 100,
          val: isEn ? '8 normalized tables' : '8 Bảng chuẩn hóa',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? '3. SQL 5-Step Loop (Explore → Profile → Clean → Shape → Analyze)' : '3. SQL 5-Step Loop (Explore → Profile → Clean → Shape → Analyze)',
          pct: 100,
          val: isEn ? '6 reconciliation rules' : '6 Rules đối soát',
          color: 'bg-amber-400'
        },
        {
          label: isEn ? '4. BI & What-If Simulator (Next.js Interactive Dashboard)' : '4. BI & What-If Simulator (Next.js Interactive Dashboard)',
          pct: 100,
          val: isEn ? '+1.18B VND/mo unlock' : '+1,18 Tỉ đ/tháng',
          color: 'bg-pink-400'
        }
      ],
      sqlSnippet: `-- Kiểm toán tổng quy mô 8 bảng dữ liệu gốc trong Data Warehouse (18.778 dòng)
SELECT '1. Store Daily (180d)' AS table_name, COUNT(*) AS rows, SUM(units_sold) AS units, SUM(daily_gmv) AS gmv FROM fact_store_daily_180d
UNION ALL
SELECT '2. Shop LIVE (180d)', COUNT(*), SUM(units_sold), SUM(gross_session_gmv) FROM fact_shop_live_180d
UNION ALL
SELECT '3. Product SKUs (90d)', COUNT(*), SUM(shop_total_units_90d), SUM(shop_total_gmv_90d) FROM dim_product_sales_90d;`
    },
    {
      stageNum: 'II',
      chapter: {
        vi: 'Chương 2 • Hồ Sơ & Định Hình (Shaping)',
        en: 'Chapter 2 • Profiling & Shaping'
      },
      title: {
        vi: 'Lập Hồ Sơ Phân Khúc Giá (Binning/NTILE) & Xoay Bảng 3 Kênh (Pivoting)',
        en: 'Price Tier Profiling (Binning/NTILE) & 3-Channel Pivoting'
      },
      screenshotId: '073520',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073520.png',
      screenshotCaption: {
        vi: '90 Ngày: Chính chủ 49,31% • Affiliate 27,84% • Kệ hàng 22,85%',
        en: '90 Days: Self 49.31% • Affiliate 27.84% • Showcase 22.85%'
      },
      kpis: [
        {
          label: isEn ? '100k–200k Sweet Spot' : 'Vùng giá vàng 100k–200k',
          value: '67,37% GMV',
          sub: isEn ? '4.13B VND • 27,276 units (331 SKUs)' : '4,13 Tỉ đ • 27.276 SP (331 SKUs)'
        },
        {
          label: isEn ? 'Self-Operated (90d)' : 'Kênh Chính Chủ (90d)',
          value: '49,31% GMV',
          sub: isEn ? '3,026,026,869 VND • 20,027 units' : '3.026.026.869 đ • 20.027 SP'
        },
        {
          label: isEn ? 'Organic Product Card' : 'Kệ Hàng Tự Nhiên (90d)',
          value: '22,85% GMV',
          sub: isEn ? '1,402,019,230 VND • 8,630 units (0 VND Ads)' : '1.402.019.230 đ • 8.630 SP (0đ hoa hồng)'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'Sweet spot price bin (100k - 200k VND)' : 'Vùng giá vàng (100.000đ – 200.000đ)',
          pct: 67.37,
          val: isEn ? '67.37% GMV (4.13B VND)' : '67,37% GMV (4,13 Tỉ đ)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'Mass-market entry tier (< 100k VND)' : 'Phân khúc Phổ thông (< 100.000đ)',
          pct: 20.8,
          val: isEn ? '20.80% GMV (1.28B VND)' : '20,80% GMV (1,28 Tỉ đ)',
          color: 'bg-amber-400'
        },
        {
          label: isEn ? 'Mid-range tier (200k - 300k VND)' : 'Phân khúc Trung cấp (200.000đ – 300.000đ)',
          pct: 11.83,
          val: isEn ? '11.83% GMV (726.07M VND)' : '11,83% GMV (726,07 Tr đ)',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'Swimwear & Beachwear Category Share' : 'Tỷ trọng Ngành Đồ bơi (Sports & Outdoor)',
          pct: 69.31,
          val: isEn ? '69.31% GMV (4.25B VND)' : '69,31% GMV (4,25 Tỉ đ)',
          color: 'bg-pink-400'
        }
      ],
      sqlSnippet: `-- Binning phân khúc giá bằng CASE WHEN & Phân vị NTILE(4) trên 331 SKUs
SELECT 
    CASE 
        WHEN price_vnd < 100000 THEN '1. < 100k VNĐ (20,80%)'
        WHEN price_vnd BETWEEN 100000 AND 200000 THEN '2. 100k - 200k VNĐ (Sweet Spot 67,37%)'
        ELSE '3. > 200k VNĐ (11,83%)'
    END AS price_bin,
    COUNT(DISTINCT product_id) AS skus,
    SUM(shop_total_units_90d) AS units,
    SUM(shop_total_gmv_90d) AS gmv_vnd
FROM dim_product_sales_90d
GROUP BY 1 ORDER BY gmv_vnd DESC;`
    },
    {
      stageNum: 'III',
      chapter: {
        vi: 'Chương 3 • Chuỗi Thời Gian & LAG',
        en: 'Chapter 3 • Time-Series & LAG'
      },
      title: {
        vi: 'Chuỗi Thời Gian 180 Ngày, Cửa Sổ Trượt 7D/28D & Chu Kỳ Mùa Vụ (43% Hà Nội)',
        en: '180d Time-Series Indexing, 7D/28D Rolling Windows & Hanoi Seasonality'
      },
      screenshotId: '080547',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080547.png',
      screenshotCaption: {
        vi: 'Đỉnh Tháng 6: 3,77 Tỉ đ (Index 397,2) → Tháng 8: 645,5 Tr đ (-82,9%)',
        en: 'June Peak: 3.77B VND (Index 397.2) → August: 645.5M VND (-82.9%)'
      },
      kpis: [
        {
          label: isEn ? 'First 28d (09/03–05/04)' : '28 Ngày Đầu (09/03–05/04)',
          value: '1,38 Tỉ đ CSV',
          sub: isEn ? 'Aligns with Seller Center 1.35B Net (+56.24%)' : 'Khớp Seller Center 1,35 Tỉ Net (+56,24%)'
        },
        {
          label: isEn ? 'All-Time Peak (16/06/2026)' : 'Đỉnh Lịch Sử (16/06/2026)',
          value: '315,05 Tr đ',
          sub: isEn ? '1,936 shop units (Self-channel: 272.1M)' : '1.936 SP toàn shop (Chính chủ 272,1 Tr)'
        },
        {
          label: isEn ? 'Season Trough (04/09/2026)' : 'Đáy Cuối Vụ (04/09/2026)',
          value: '5,44 Tr đ',
          sub: isEn ? '49 units as 43% Hanoi followers exit swimwear' : '49 SP khi 43% khách Hà Nội ngừng mua đồ bơi'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'March 2026 (09–31/03 • Index = 100.0)' : 'Tháng 03/2026 (09–31/03 • Index = 100,0)',
          pct: 25.2,
          val: isEn ? '949.81M VND (8,039 units)' : '949,81 Tr đ (8.039 SP)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'April 2026 (Index = 258.9 • +158.9% MoM)' : 'Tháng 04/2026 (Index = 258,9 • +158,9% MoM)',
          pct: 65.2,
          val: isEn ? '2,459.11M VND (17,358 units)' : '2.459,11 Tr đ (17.358 SP)',
          color: 'bg-cyan-400'
        },
        {
          label: isEn ? 'May 2026 (Index = 289.2 • +11.7% MoM)' : 'Tháng 05/2026 (Index = 289,2 • +11,7% MoM)',
          pct: 72.8,
          val: isEn ? '2,747.32M VND (17,267 units)' : '2.747,32 Tr đ (17.267 SP)',
          color: 'bg-teal-400'
        },
        {
          label: isEn ? 'June 2026 (SUMMER PEAK • Index = 397.2)' : 'Tháng 06/2026 (ĐỈNH MÙA VỤ • Index = 397,2)',
          pct: 100.0,
          val: isEn ? '3,772.43M VND (22,096 units)' : '3.772,43 Tr đ (22.096 SP)',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'July 2026 (Index = 223.8 • -43.6% MoM)' : 'Tháng 07/2026 (Index = 223,8 • -43,6% MoM)',
          pct: 56.3,
          val: isEn ? '2,125.85M VND (13,358 units)' : '2.125,85 Tr đ (13.358 SP)',
          color: 'bg-amber-400'
        },
        {
          label: isEn ? 'August 2026 (Index = 68.0 • -69.6% MoM)' : 'Tháng 08/2026 (Index = 68,0 • -69,6% MoM)',
          pct: 17.1,
          val: isEn ? '645.53M VND (7,014 units)' : '645,53 Tr đ (7.014 SP)',
          color: 'bg-rose-500'
        }
      ],
      sqlSnippet: `-- Tính Trung bình trượt 7 ngày (7D MA), Tổng trượt 28 ngày & Tăng trưởng cùng kỳ (LAG)
SELECT 
    date_id, daily_gmv,
    AVG(daily_gmv) OVER (ORDER BY date_id ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS gmv_7d_ma,
    SUM(daily_gmv) OVER (ORDER BY date_id ROWS BETWEEN 27 PRECEDING AND CURRENT ROW) AS gmv_28d_rolling_sum
FROM fact_store_daily_180d;`
    },
    {
      stageNum: 'IV',
      chapter: {
        vi: 'Chương 4 & 9 • Cohort & Pareto',
        en: 'Chapter 4 & 9 • Cohort & Pareto'
      },
      title: {
        vi: 'Phân Tích Cohort KOC, Đường Cong Pareto (Top 1% = 91,49%) & Unit Economics',
        en: 'KOC Cohort Retention, Pareto Concentration (Top 1% = 91.49%) & CLTV'
      },
      screenshotId: '073657',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073657.png',
      screenshotCaption: {
        vi: '5.713 Creators: Chỉ 292 có đơn (5,1%) • @girlstyle.vn chiếm 42,9% Affiliate',
        en: '5,713 Creators: Only 292 converting (5.1%) • @girlstyle.vn drives 42.9% Affiliate'
      },
      kpis: [
        {
          label: isEn ? 'Active Converting KOCs' : 'Tỷ lệ KOC Có Đơn (Active)',
          value: '5,11% (292)',
          sub: isEn ? '94.89% dormant creators (5,421 accounts = 0 VND)' : '94,89% KOC ngủ đông (5.421 tài khoản = 0đ)'
        },
        {
          label: isEn ? 'Top 1 KOC (@girlstyle.vn)' : 'Top 1 KOC (@girlstyle.vn)',
          value: '732,77 Tr đ',
          sub: isEn ? '5,009 units • 42.9% of affiliate network GMV' : '5.009 SP • Chiếm 42,9% toàn mạng lưới KOC'
        },
        {
          label: isEn ? 'Promo vs. Base AOV' : 'AOV Khuyến Mãi vs Cơ Sở',
          value: '150,9k vs 128,6k',
          sub: isEn ? '1.004 items/order • 1.184 orders/customer' : '1,004 món/đơn • 1,184 đơn/khách'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'Super KOC #1: @girlstyle.vn (5,009 units)' : 'Siêu KOC #1: @girlstyle.vn (5.009 SP)',
          pct: 42.9,
          val: isEn ? '42.90% Affiliate GMV (732.77M VND)' : '42,90% GMV Affiliate (732,77 Tr đ)',
          color: 'bg-amber-400'
        },
        {
          label: isEn ? 'Remaining 57 KOCs in Top 1% (Total 58 KOCs)' : '57 KOC tiếp theo trong Top 1% (Tổng 58 KOC)',
          pct: 48.59,
          val: isEn ? '48.59% Affiliate GMV (830.03M VND)' : '48,59% GMV Affiliate (830,03 Tr đ)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'Nano/Micro KOC tier (< 5,000 followers)' : 'Nhóm Nano/Micro KOC (< 5.000 followers)',
          pct: 96.09,
          val: isEn ? 'Drives 96.09% of affiliate revenue' : 'Đóng góp 96,09% tổng doanh thu KOC',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'Dormant KOC rate needing re-activation' : 'Tỷ lệ KOC ngủ đông cần kích hoạt (Units = 0)',
          pct: 94.89,
          val: isEn ? '94.89% (5,421 / 5,713 Creators)' : '94,89% (5.421 / 5.713 Creators)',
          color: 'bg-rose-500'
        }
      ],
      sqlSnippet: `-- Phân tích Pareto KOC bằng Window Function SUM() OVER() và PERCENT_RANK()
WITH affiliate_ranked AS (
    SELECT creator_handle, units_sold_90d, gmv_90d,
           SUM(gmv_90d) OVER (ORDER BY gmv_90d DESC) * 100.0 / SUM(gmv_90d) OVER () AS cum_gmv_pct
    FROM dim_creators_90d WHERE is_self_operated = FALSE
)
SELECT * FROM affiliate_ranked LIMIT 5;`
    },
    {
      stageNum: 'V',
      chapter: {
        vi: 'Chương 5 • Khai Phá Tiêu Đề & Regex',
        en: 'Chapter 5 • Text Mining & Regex'
      },
      title: {
        vi: 'Khai Phá Văn Bản Tiêu Đề Video, Bóc Tách Cấu Trúc SKU & SEO Tìm Kiếm',
        en: 'Video Title Text Mining, SKU String Parsing & Search SEO'
      },
      screenshotId: '080553',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080553.png',
      screenshotCaption: {
        vi: '222 Video Chính Chủ (870,2 Tr đ): 101 video có đơn (45,5%)',
        en: '222 Self-Operated Videos (870.2M VND): 101 videos with sales (45.5%)'
      },
      kpis: [
        {
          label: isEn ? 'Launch Hook "Mở Bán / Croptop"' : 'Hook "Mở Bán / Croptop"',
          value: '170,16 Tr đ',
          sub: isEn ? 'May 13 Video: 529k views • 856 units sold' : 'Video 13/05: 529.000 views • Bán 856 SP'
        },
        {
          label: isEn ? 'Beach Hook "BEACH READY FIT"' : 'Hook "BEACH READY FIT"',
          value: '56,93 Tr đ',
          sub: isEn ? 'Apr 08 Video: 755k views • 288 units sold' : 'Video 08/04: 755.000 views • Bán 288 SP'
        },
        {
          label: isEn ? 'Search Room Entry Rate' : 'Tỷ lệ vào phòng từ Search',
          value: '25,68%',
          sub: isEn ? '5x higher than Feed Preview (5.09%)' : 'Gấp 5x Ô Live (5,09%) nhờ SEO tiêu đề'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'Video #1 (May 13): "Official Launch_ Croptop Set..."' : 'Video #1 (13/05): "Chính Thức Mở Bán_ Thiết kế croptop yếm..."',
          pct: 100,
          val: isEn ? '170.16M VND (856 units • 529k views)' : '170,16 Tr đ (856 SP • 529k views)',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'Video #2 (Apr 08): "| BEACH READY FIT_ Plaid Bikini..."' : 'Video #2 (08/04): "| BEACH READY FIT_ Set bikini caro..."',
          pct: 33.5,
          val: isEn ? '56.93M VND (288 units • 755k views)' : '56,93 Tr đ (288 SP • 755k views)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'Video #3 (May 14): "| Hot-Hit Bikini_ 2-Piece Set..."' : 'Video #3 (14/05): "| Hot- Hit Bikini_ Set Bikini 2 mảnh..."',
          pct: 25.2,
          val: isEn ? '42.87M VND (262 units • 149.9k views)' : '42,87 Tr đ (262 SP • 149,9k views)',
          color: 'bg-pink-400'
        }
      ],
      sqlSnippet: `-- Khai phá văn bản tiêu đề Video bằng ILIKE & Tính GPM theo nhóm Hook
SELECT 
    CASE 
        WHEN video_title ILIKE '%Mở Bán%' THEN '1. Hook Mở Bán Thiết Kế Mới'
        WHEN video_title ILIKE '%BEACH READY%' THEN '2. Hook Đi Biển (Beach Vibe)'
        ELSE '3. Tiêu đề thông thường'
    END AS hook_type,
    COUNT(*) AS videos, SUM(units_sold) AS units, SUM(gmv) AS gmv_vnd
FROM fact_self_video_180d GROUP BY 1 ORDER BY gmv_vnd DESC;`
    },
    {
      stageNum: 'VI',
      chapter: {
        vi: 'Chương 6 • Phát Hiện Bất Thường',
        en: 'Chapter 6 • Anomaly Detection'
      },
      title: {
        vi: 'Phát Hiện Bất Thường: Bẫy 106 Phiên LIVE (09/04) vs. 45 Phiên Tối Ưu (25/06)',
        en: 'Anomaly Detection: 106 LIVE Spam Trap (Apr 09) vs. 45 Optimal LIVEs (Jun 25)'
      },
      screenshotId: '080510',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080510.png',
      screenshotCaption: {
        vi: 'Ngày 25/06 (45 phiên) đạt hiệu suất 4,36 Tr/phiên — Gấp 5,8x ngày 09/04 (106 phiên)',
        en: 'Jun 25 (45 streams) generated 4.36M/stream — 5.8x higher than Apr 09 (106 streams)'
      },
      kpis: [
        {
          label: isEn ? 'Spam Anomaly (09/04)' : 'Bất thường Spam (09/04)',
          value: '749k đ/phiên',
          sub: isEn ? '106 shop-wide streams generated only 79.46M VND' : '106 phiên LIVE toàn sàn chỉ thu về 79,46 Tr đ'
        },
        {
          label: isEn ? 'Optimized Peak (25/06)' : 'Điểm Tối Ưu (25/06)',
          value: '4,36 Tr đ/phiên',
          sub: isEn ? 'Only 45 streams generated 196.09M VND (5.8x lift)' : 'Chỉ 45 phiên LIVE thu về 196,09 Tr đ (Gấp 5,8x)'
        },
        {
          label: isEn ? 'LIVE View Distribution' : 'Phân phối Lượt xem LIVE',
          value: 'Median: 948',
          sub: isEn ? 'Mean: 2,400 views/stream (Right-skewed outlier distribution)' : 'Mean: 2.400 views/phiên (Lệch phải do cực trị)'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'Apr 09, 2026: 106 LIVE streams (Quantity trap)' : 'Ngày 09/04/2026: Phát 106 phiên LIVE (Bẫy số lượng)',
          pct: 17.2,
          val: isEn ? '749,578 VND / stream (Total 79.46M VND)' : '749.578 đ / phiên (Tổng 79,46 Tr đ)',
          color: 'bg-rose-500'
        },
        {
          label: isEn ? 'Jun 16, 2026: 91 LIVE streams (All-time peak)' : 'Ngày 16/06/2026: Phát 91 phiên LIVE (Đỉnh lịch sử)',
          pct: 79.4,
          val: isEn ? '3,462,056 VND / stream (Total 315.05M VND)' : '3.462.056 đ / phiên (Tổng 315,05 Tr đ)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'Jun 25, 2026: 45 LIVE streams (Optimized quality)' : 'Ngày 25/06/2026: Phát 45 phiên LIVE (Tối ưu chất lượng)',
          pct: 100.0,
          val: isEn ? '4,357,656 VND / stream (Total 196.09M VND)' : '4.357.656 đ / phiên (Tổng 196,09 Tr đ)',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'Sep 04, 2026: 27 LIVE streams (End-of-season inertia)' : 'Ngày 04/09/2026: Phát 27 phiên LIVE (Quán tính cuối vụ)',
          pct: 4.6,
          val: isEn ? '201,595 VND / stream (Total 5.44M VND)' : '201.595 đ / phiên (Tổng 5,44 Tr đ)',
          color: 'bg-amber-400'
        }
      ],
      sqlSnippet: `-- Phát hiện ngày bất thường bằng Z-Score và Winsorizing phân vị 95% (PERCENTILE_CONT)
WITH stats AS (
    SELECT AVG(daily_gmv) AS m, STDDEV_SAMP(daily_gmv) AS sd FROM fact_store_daily_180d
)
SELECT d.date_id, d.live_sessions_count, d.daily_gmv,
       ROUND((d.daily_gmv - s.m) / s.sd, 2) AS z_score,
       ROUND(d.daily_gmv * 1.0 / NULLIF(d.live_sessions_count, 0), 0) AS gmv_per_session
FROM fact_store_daily_180d d CROSS JOIN stats s
WHERE d.date_id IN ('2026-04-09', '2026-06-16', '2026-06-25', '2026-09-04');`
    },
    {
      stageNum: 'VII',
      chapter: {
        vi: 'Chương 7 & 9 • Phễu & Thử Nghiệm A/B',
        en: 'Chapter 7 & 9 • Funnel & A/B Testing'
      },
      title: {
        vi: 'Phễu Chuyển Đổi (Ô Live 5,09% vs. Search 25,68%) & Thực Nghiệm A/B Live Ads',
        en: 'Conversion Funnel (Feed 5.09% vs. Search 25.68%) & Live Ads A/B Testing'
      },
      screenshotId: '080124',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080124.png',
      screenshotCaption: {
        vi: 'GPM Video (135,2k) gấp 4,5x LIVE (30,2k) • A/B Ads tăng tốc độ bán gấp 3,16x',
        en: 'Video GPM (135.2k) is 4.5x LIVE (30.2k) • A/B Ads accelerated sales by 3.16x'
      },
      kpis: [
        {
          label: isEn ? 'Feed Preview Bottleneck' : 'Điểm nghẽn Ô Live (46% PV)',
          value: '5,09% Vào phòng',
          sub: isEn ? '95% bounce rate vs. Search at 25.68%' : '95% khách lướt qua vs. Tìm kiếm đạt 25,68%'
        },
        {
          label: isEn ? 'Showcase CVR Bottleneck' : 'Điểm nghẽn Kệ hàng (1,17M)',
          value: 'CVR 0,25% 🚨',
          sub: isEn ? '442.36M VND • Discount burn 50.45% (62.2M)' : '442,36 Tr đ • Chiết khấu KM ngốn 50,45% (62,2Tr)'
        },
        {
          label: isEn ? 'Live Ads A/B Test (3.2x Ads)' : 'A/B Test Live Ads (3,2x Ads)',
          value: '5,73M đ/giờ',
          sub: isEn ? '3.16x faster than organic control stream (1.81M/h)' : 'Tăng gấp 3,16x so với phiên chuẩn (1,81M đ/giờ)'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'Feed Live Preview (46% PV): Room entry rate severely depressed' : 'Phễu Ô Live (46% PV): Tỷ lệ bấm vào phòng quá thấp',
          pct: 12.3,
          val: isEn ? '5.09% entry rate (Must revamp 3s hook)' : '5,09% vào phòng (Cần sửa Hook 3s đầu)',
          color: 'bg-rose-500'
        },
        {
          label: isEn ? 'Search Discovery (43% PV): High buying intent' : 'Phễu Tìm kiếm (43% PV): Ý định mua sắm cao gấp 5 lần',
          pct: 62.0,
          val: isEn ? '25.68% entry rate (Optimize Title SEO)' : '25,68% vào phòng (Tối ưu SEO Tiêu đề)',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'Live Merge (2% PV): Highest conversion room entry' : 'Phễu Hợp nhất Live (2% PV): Tỷ lệ vào phòng cao nhất',
          pct: 100.0,
          val: isEn ? '41.41% entry rate (Leverage golden-hour PK)' : '41,41% vào phòng (Đẩy mạnh PK giờ vàng)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'Hero SKU CV11 Skirt in Ad-boosted session (Mar 28)' : 'Hero SKU Chân váy CV11 trong Phiên Bùng nổ Ads (28/03)',
          pct: 98.48,
          val: isEn ? '130 units = 20.34M VND (98.48% session GMV)' : '130 đơn = 20,34 Tr đ (98,48% GMV phiên)',
          color: 'bg-amber-400'
        }
      ],
      sqlSnippet: `-- Tổng hợp dữ liệu đầu vào cho Kiểm định Two-Sample t-test: Video Paid Ads vs. Organic
SELECT 
    is_ads,
    COUNT(video_id) AS n_observations,
    ROUND(AVG(gmv_90d), 0) AS mean_gmv_per_video,
    ROUND(STDDEV_SAMP(gmv_90d), 0) AS sd_gmv_per_video,
    SUM(gmv_90d) AS total_gmv_vnd
FROM fact_shoppable_videos_90d GROUP BY is_ads;`
    },
    {
      stageNum: 'VIII',
      chapter: {
        vi: 'Chương 8 • ETL, Bảo Mật & ROI',
        en: 'Chapter 8 • ETL, Privacy & ROI'
      },
      title: {
        vi: 'Tự Động Hóa ETL Bằng Regex, Lấy Mẫu Nhất Quán (MOD) & Bảo Mật PII (MD5)',
        en: 'Regex ETL Automation, Consistent Sampling (MOD) & PII Masking (MD5)'
      },
      screenshotId: '073418',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073418.png',
      screenshotCaption: {
        vi: 'Zero Manual Steps • Bảo toàn 100% 8 bảng gốc • Mở khóa +1,18 Tỉ đ/tháng',
        en: 'Zero Manual Steps • 100% Data Ground Truth • Unlocking +1.18B VND/month'
      },
      kpis: [
        {
          label: isEn ? 'Vietnamese Diacritics Regex' : 'Quét File Lỗi Dấu Tiếng Việt',
          value: '100% Regex',
          sub: isEn ? 'Auto-maps "(180 ng y) .xlsx" on Docker/Linux' : 'Tự động khớp "(180 ng y) .xlsx" trên Docker/Linux'
        },
        {
          label: isEn ? 'Consistent Sampling & PII' : 'Giảm Tải & Bảo Mật PII',
          value: 'MOD 10 • MD5',
          sub: isEn ? 'Removed 22 duplicate captures & anonymized KOCs' : 'Xóa 22 ảnh trùng (-50% size) & Băm ẩn danh KOC'
        },
        {
          label: isEn ? 'Monthly Growth Potential' : 'Tiềm Năng Mở Khóa / Tháng',
          value: '+1,18 Tỉ VNĐ',
          sub: isEn ? 'Lift Showcase CVR to 0.75% + Tag 220 videos' : 'Nâng CVR Kệ hàng 0,75% + Gắn giỏ 220 videos'
        }
      ],
      visualBars: [
        {
          label: isEn ? 'Lever 1: Lift Showcase CVR from 0.25% to 0.75% (1.17M views)' : 'Đòn bẩy 1: Nâng CVR Kệ hàng từ 0,25% lên 0,75% (1,17M views)',
          pct: 100,
          val: isEn ? '+884.7M VND/month (0 VND Ads)' : '+884,7 Tr đ / tháng (0đ chi phí Ads)',
          color: 'bg-sky-400'
        },
        {
          label: isEn ? 'Lever 2: Activate dormant KOCs from 5.1% to 8.0% (+165 KOCs)' : 'Đòn bẩy 2: Kích hoạt KOC có đơn từ 5,1% lên 8,0% (+165 KOCs)',
          pct: 41.0,
          val: isEn ? '+363.0M VND/month' : '+363,0 Tr đ / tháng',
          color: 'bg-emerald-400'
        },
        {
          label: isEn ? 'Lever 3: Tag 220/308 empty videos + Schedule at golden hours' : 'Đòn bẩy 3: Gắn giỏ hàng 220/308 video trống + Đăng giờ vàng',
          pct: 24.8,
          val: isEn ? '+219.5M VND/month (135.2k GPM)' : '+219,5 Tr đ / tháng (GPM 135,2k)',
          color: 'bg-pink-400'
        },
        {
          label: isEn ? 'Lever 4: Capping promo discount burn rate from 50.45% to 35.0%' : 'Đòn bẩy 4: Giảm tỷ lệ chiết khấu KM từ 50,45% về 35,0%',
          pct: 15.0,
          val: isEn ? '+19.1M VND retained cash margin' : '+19,1 Tr đ biên lợi nhuận giữ lại',
          color: 'bg-amber-400'
        }
      ],
      sqlSnippet: `-- Đóng gói View chuẩn hóa cho BI: Cờ hiệu Boolean, Lấy mẫu nhất quán (MOD) & Bảo mật MD5
CREATE OR REPLACE VIEW vw_bi_creator_mart AS
SELECT 
    creator_id,
    CASE WHEN is_self_operated OR gmv_90d >= 40000000 THEN creator_handle
         ELSE CONCAT(LEFT(creator_handle, 4), '***_', SUBSTRING(MD5(creator_handle), 1, 6))
    END AS masked_handle,
    (units_sold_90d > 0) AS is_converting_flag,
    gmv_90d,
    MOD(ABS(HASHTEXT(creator_id)), 10) AS sample_bucket_10pct
FROM dim_creators_90d;`
    }
  ];

  const current = stages[activeStage];

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/95 dark:shadow-2xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
            {isEn
              ? 'SQL FOR DATA ANALYSIS FRAMEWORK • 8 VISUAL STAGES'
              : 'SQL FOR DATA ANALYSIS FRAMEWORK • 8 GIAI ĐOẠN TRỰC QUAN'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {lang === 'vi'
              ? 'Lộ Trình 8 Bước Phân Tích E-Commerce Bằng Biểu Đồ & Hình Ảnh Thực Tế'
              : '8-Stage Visual E-Commerce Analytics Pipeline (SQL for Data Analysis)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {lang === 'vi'
              ? 'Mô hình hóa toàn bộ 8 chương phương pháp luận từ sách SQL for Data Analysis bằng biểu đồ thanh tỉ lệ, ảnh chụp FastMoss thực tế và truy vấn SQL có thể mở rộng.'
              : 'End-to-end operationalization of all 8 chapters from SQL for Data Analysis via proportional bar charts, real FastMoss captures, and executable SQL snippets.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSql((prev) => !prev)}
          className="self-start lg:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-800 border border-emerald-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-mono font-bold transition cursor-pointer shrink-0"
        >
          💻 {showSql
            ? (isEn ? 'Hide SQL Query' : 'Ẩn Truy Vấn SQL')
            : (isEn ? 'View Stage SQL Query' : 'Xem Truy Vấn SQL Của Giai Đoạn Này')}
        </button>
      </div>

      {/* 8-STAGE STEPPER PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
        {stages.map((st, idx) => {
          const isSelected = activeStage === idx;
          const chapterText = st.chapter[lang];
          const chapterTitle = chapterText.includes('•') ? chapterText.split('•')[1].trim() : chapterText.trim();
          return (
            <button
              key={st.stageNum}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`p-2.5 rounded-xl border text-center transition flex items-center justify-center min-h-[58px] cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs dark:bg-sky-500/20 dark:border-sky-500/60 dark:text-white dark:shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <span className="text-xs font-semibold leading-snug text-slate-900 dark:text-slate-200">
                {chapterTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN VISUAL CONTENT: 7 COLS CHART & KPIs + 5 COLS REAL SCREENSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT 7 COLS: KPIs + VISUAL BAR CHART */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between space-y-5 dark:bg-slate-900/70 dark:border-slate-800">
          <div className="space-y-3">
            <div className="text-xs font-mono text-sky-700 dark:text-sky-400 font-bold uppercase">{current.chapter[lang]}</div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">{current.title[lang]}</h3>

            {/* 3 COMPACT KPI PILLS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {current.kpis.map((k, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-950/90 dark:border-slate-800/90">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{k.label}</div>
                  <div className="text-base sm:text-lg font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">{k.value}</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 line-clamp-1">{k.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL HORIZONTAL PROGRESS BARS (REPLACING LONG TEXT) */}
          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            {current.visualBars.map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{bar.label}</span>
                  <span className="font-mono font-bold text-sky-700 dark:text-sky-300">{bar.val}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                    style={{ width: `${Math.max(5, Math.min(100, bar.pct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT 5 COLS: LIVE HTML TELEMETRY CARD (NO STATIC IMAGES) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <FastMossHtmlMockupCard
            screenshotId={current.screenshotId}
            caption={current.screenshotCaption[lang]}
            onOpenProofModal={onOpenProofModal}
            isEn={isEn}
            className="h-full"
          />
        </div>
      </div>

      {/* TOGGLEABLE SQL CODE BLOCK */}
      {showSql && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 animate-in fade-in duration-200 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>
              {isEn 
                ? `📌 Executable SQL Query for Stage ${current.stageNum} (${current.chapter[lang]})` 
                : `📌 Truy vấn SQL thực thi cho Phần ${current.stageNum} (${current.chapter[lang]})`}
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">SQL for Data Analysis</span>
          </div>
          <pre className="text-xs font-mono text-slate-800 dark:text-sky-200 overflow-x-auto leading-relaxed p-3 bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
            <code>{current.sqlSnippet}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
