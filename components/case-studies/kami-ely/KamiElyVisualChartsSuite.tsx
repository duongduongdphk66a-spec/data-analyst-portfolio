'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import FastMossHtmlMockupCard from '@/components/case-studies/kami-ely/FastMossHtmlMockupCard';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShoppingBag, 
  Video, 
  Users 
} from 'lucide-react';

export interface KamiElyVisualChartsSuiteProps {
  onOpenProofModal?: (_screenshotId?: string) => void;
  isEn?: boolean;
}

export default function KamiElyVisualChartsSuite({
  onOpenProofModal,
  isEn: propIsEn
}: KamiElyVisualChartsSuiteProps) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const [activeChartIdx, setActiveChartIdx] = useState<number>(0);

  const charts = [
    {
      id: 'channel-attribution-90d',
      title: {
        vi: '1. Cơ Cấu 3 Kênh Doanh Số 90 Ngày',
        en: '1. 90-Day 3-Channel GMV Attribution'
      },
      subtitle: {
        vi: 'Bóc tách sự phụ thuộc: Kênh chính chủ tự gánh 49,31% GMV vs. Kệ hàng tự nhiên 22,85%',
        en: 'Self-operated channel drives 49.31% of GMV vs. Organic Showcase at 22.85%'
      },
      icon: PieChart,
      color: 'sky',
      screenshotId: '073520',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073520.png',
      screenshotCaption: {
        vi: '90 Ngày: Chính chủ 3,03 Tỉ đ (49,3%) • Affiliate 1,71 Tỉ đ (27,8%) • Kệ hàng 1,40 Tỉ đ (22,9%)',
        en: '90 Days: Self 3.03B VND (49.3%) • Affiliate 1.71B VND (27.8%) • Showcase 1.40B VND (22.9%)'
      },
      kpis: [
        { label: isEn ? 'Total 90d Sales' : 'Tổng bán 90 Ngày', val: '6,14 Tỉ đ', sub: '40.229 SP' },
        { label: isEn ? 'Self-Channel Share' : 'Tỷ trọng Chính chủ', val: '49,31%', sub: '20.027 SP' },
        { label: isEn ? 'Passive Showcase' : 'Kệ hàng tự nhiên', val: '1,40 Tỉ đ', sub: '0đ chi phí Ads' }
      ],
      bars: [
        { label: isEn ? 'Self-operated (@kamielyhn)' : 'Kênh chính chủ (@kamielyhn)', pct: 49.31, val: '49,31% (3.026.026.869 đ • 20.027 SP)', color: 'bg-sky-400' },
        { label: isEn ? 'Affiliate Network (5,712 KOCs)' : 'Mạng lưới Affiliate (5.712 KOC)', pct: 27.84, val: '27,84% (1.708.159.874 đ • 11.572 SP)', color: 'bg-emerald-400' },
        { label: isEn ? 'Showcase / Product Cards' : 'Thẻ sản phẩm / Kệ hàng', pct: 22.85, val: '22,85% (1.402.019.230 đ • 8.630 SP)', color: 'bg-amber-400' }
      ]
    },
    {
      id: 'seasonality-timeseries-180d',
      title: {
        vi: '2. Chuỗi Thời Gian 180 Ngày & Cú Rơi Sau Đỉnh',
        en: '2. 180-Day Seasonality Trend & Cliff'
      },
      subtitle: {
        vi: 'Đỉnh 3,77 Tỉ đ (Tháng 6) rơi xuống 645 Tr đ (Tháng 8) do 43% khách Hà Nội hết mùa biển',
        en: 'June Peak (3.77B VND) drops to August Trough (645M VND) as 43% Hanoi followers exit beach season'
      },
      icon: TrendingUp,
      color: 'emerald',
      screenshotId: '080547',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080547.png',
      screenshotCaption: {
        vi: 'Biến động GMV 180 ngày: Đỉnh 16/06 đạt 315,05 Tr đ → Đáy 04/09 chỉ còn 5,44 Tr đ',
        en: '180d GMV curve: Jun 16 peak at 315.05M VND → Sep 04 trough at 5.44M VND'
      },
      kpis: [
        { label: isEn ? '180-Day Total GMV' : 'Tổng GMV 180 Ngày', val: '12,74 Tỉ đ', sub: 'TB 70,75M/ngày' },
        { label: isEn ? 'June Peak Month' : 'Đỉnh Tháng 6/2026', val: '3,77 Tỉ đ', sub: '29,6% toàn kỳ' },
        { label: isEn ? 'Peak-to-Trough Drop' : 'Tỷ lệ sụt giảm T8', val: '-82,9%', sub: '43% tại Hà Nội' }
      ],
      bars: [
        { label: 'Tháng 03/2026 (09–31/03)', pct: 25.2, val: '949,81 Tr đ (Index = 100,0)', color: 'bg-sky-400' },
        { label: 'Tháng 04/2026', pct: 65.2, val: '2.459,11 Tr đ (Index = 258,9 • +158,9%)', color: 'bg-cyan-400' },
        { label: 'Tháng 05/2026', pct: 72.8, val: '2.747,32 Tr đ (Index = 289,2 • +11,7%)', color: 'bg-teal-400' },
        { label: 'Tháng 06/2026 (ĐỈNH HÈ)', pct: 100.0, val: '3.772,43 Tr đ (Index = 397,2 • Đỉnh vụ)', color: 'bg-emerald-400' },
        { label: 'Tháng 07/2026', pct: 56.3, val: '2.125,85 Tr đ (Index = 223,8 • -43,6%)', color: 'bg-amber-400' },
        { label: 'Tháng 08/2026 (RƠI TỰ DO)', pct: 17.1, val: '645,53 Tr đ (Index = 68,0 • -69,6%)', color: 'bg-rose-500' }
      ]
    },
    {
      id: 'price-sweet-spot',
      title: {
        vi: '3. Vùng Giá Vàng 100k–200k & Top SKU Chân Váy CV11',
        en: '3. 100k–200k Sweet Spot & Hero SKU CV11'
      },
      subtitle: {
        vi: 'Vùng giá 100k–200k chiếm 67,37% GMV; Chân váy chữ A CV11 dẫn đầu với 6.375 đơn',
        en: '100k–200k VND tier generates 67.37% of GMV; A-line skirt CV11 ranks #1 with 6,375 units'
      },
      icon: ShoppingBag,
      color: 'amber',
      screenshotId: '080800',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080800.png',
      screenshotCaption: {
        vi: '331 SKUs: Đồ bơi chiếm 69,3% GMV • Top 1: Chân váy CV11 (6.375 SP / 735M đ)',
        en: '331 SKUs: Swimwear drives 69.3% GMV • #1 SKU: CV11 Skirt (6,375 units / 735M VND)'
      },
      kpis: [
        { label: isEn ? 'Sweet Spot Share' : 'Vùng giá vàng', val: '67,37%', sub: '4,13 Tỉ đ' },
        { label: isEn ? '#1 Hero SKU (CV11)' : 'Top 1 SKU Toàn Shop', val: '6.375 SP', sub: 'Chân váy chữ A' },
        { label: isEn ? 'Swimwear GMV Share' : 'Tỷ trọng Đồ bơi', val: '69,31%', sub: '4,25 Tỉ đ' }
      ],
      bars: [
        { label: isEn ? '100,000đ – 200,000đ (Sweet Spot)' : '100.000đ – 200.000đ (Vùng giá vàng)', pct: 67.37, val: '67,37% GMV (4,13 Tỉ đ • 27.276 SP)', color: 'bg-sky-400' },
        { label: isEn ? '< 100,000đ (Entry-level Mass)' : '< 100.000đ (Phân khúc phổ thông)', pct: 20.8, val: '20,80% GMV (1,28 Tỉ đ • 10.158 SP)', color: 'bg-amber-400' },
        { label: isEn ? '> 200,000đ (Mid-range Premium)' : '> 200.000đ (Phân khúc trung cấp)', pct: 11.83, val: '11,83% GMV (726,07 Tr đ • 2.795 SP)', color: 'bg-emerald-400' }
      ]
    },
    {
      id: 'video-live-gpm-paradox',
      title: {
        vi: '4. Nghịch Lý GPM: Video (135,2k) Gấp 4,5x LIVE (30,2k)',
        en: '4. GPM Paradox: Video (135.2k) is 4.5x Higher than LIVE (30.2k)'
      },
      subtitle: {
        vi: 'Video có hiệu suất doanh thu trên 1.000 view vượt trội nhưng 94,7% GMV phụ thuộc Paid Ads',
        en: 'Shoppable video delivers superior revenue per 1k views, yet 94.7% of video GMV relies on Ads'
      },
      icon: Video,
      color: 'pink',
      screenshotId: '080124',
      screenshotSrc: '/kami/Screenshot 2026-09-05 080124.png',
      screenshotCaption: {
        vi: 'GPM 28 ngày: Video đạt 134,8k–135,2k đ vs. LIVE chỉ đạt 29,2k–30,2k đ/1.000 views',
        en: '28-day GPM: Video reaches 134.8k–135.2k VND vs. LIVE at 29.2k–30.2k VND per 1k views'
      },
      kpis: [
        { label: isEn ? 'Shoppable Video GPM' : 'GPM Video 28d', val: '135,2k đ', sub: 'Gấp 4,5x LIVE' },
        { label: isEn ? 'Livestream GPM' : 'GPM LIVE 28d', val: '30,2k đ', sub: '208 phiên' },
        { label: isEn ? 'Paid Ads Share in Video' : 'Video chạy Ads', val: '94,70%', sub: '2,056 Tỉ đ' }
      ],
      bars: [
        { label: isEn ? 'Shoppable Video GPM (/1k views)' : 'GPM Video thương mại (/1.000 views)', pct: 100, val: '135,2k đ (Đỉnh hiệu suất)', color: 'bg-pink-400' },
        { label: isEn ? 'Livestream GPM (/1k views)' : 'GPM Phiên LIVE (/1.000 views)', pct: 22.3, val: '30,2k đ (Bão hòa ca trưa/sau 3h)', color: 'bg-slate-500' },
        { label: isEn ? 'Paid Ads GMV Share (3,482 videos)' : 'GMV Video chạy Ads (3.482 videos)', pct: 94.7, val: '94,70% GMV (2.055.758.301 đ)', color: 'bg-amber-400' },
        { label: isEn ? 'Organic Video GMV Share (935 videos)' : 'GMV Video tự nhiên (935 videos)', pct: 5.3, val: '5,30% GMV (115.082.025 đ)', color: 'bg-emerald-400' }
      ]
    },
    {
      id: 'pareto-affiliate-koc',
      title: {
        vi: '5. Phân Tầng KOC Pareto: Top 1% = 91,49% Doanh Số',
        en: '5. KOC Pareto Distribution: Top 1% = 91.49% GMV'
      },
      subtitle: {
        vi: 'Chỉ 292/5.713 KOC có đơn (5,1%); riêng @girlstyle.vn gánh 42,9% GMV toàn mạng lưới',
        en: 'Only 292 of 5,713 KOCs convert (5.1%); @girlstyle.vn alone carries 42.9% of affiliate GMV'
      },
      icon: Users,
      color: 'indigo',
      screenshotId: '073657',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073657.png',
      screenshotCaption: {
        vi: '5.713 KOC: Top 58 KOC (1%) gánh 91,49% GMV • Nhóm Nano/Micro (<5k) tạo 96,09% GMV',
        en: '5,713 KOCs: Top 58 KOCs (1%) drive 91.49% GMV • Nano/Micro (<5k) generate 96.09% GMV'
      },
      kpis: [
        { label: isEn ? 'Converting KOC Rate' : 'Tỷ lệ KOC có đơn', val: '5,11%', sub: '292 / 5.713' },
        { label: isEn ? 'Top 1% GMV Share' : 'Top 1% KOC gánh', val: '91,49%', sub: '58 Creators' },
        { label: isEn ? '@girlstyle.vn GMV' : 'Siêu KOC @girlstyle.vn', val: '732,8 Tr đ', sub: '42,9% Affiliate' }
      ],
      bars: [
        { label: isEn ? 'Top 1 KOC (@girlstyle.vn)' : 'Siêu KOC #1 (@girlstyle.vn)', pct: 42.9, val: '42,90% GMV Affiliate (732,77 Tr đ)', color: 'bg-amber-400' },
        { label: isEn ? 'Remaining 57 KOCs in Top 1%' : '57 KOC tiếp theo trong Top 1%', pct: 48.59, val: '48,59% GMV Affiliate (830,03 Tr đ)', color: 'bg-sky-400' },
        { label: isEn ? 'Dormant Creators (0 orders)' : 'KOC ngủ đông (0 đơn bán)', pct: 94.89, val: '94,89% (5.421 tài khoản)', color: 'bg-rose-500' }
      ]
    },
    {
      id: 'live-funnel-telemetry',
      title: {
        vi: '6. Phễu Vào Phòng LIVE: Tìm Kiếm (25,68%) Gấp 5x Ô Live (5,09%)',
        en: '6. LIVE Room Entry Funnel: Search (25.68%) is 5x Higher than Feed (5.09%)'
      },
      subtitle: {
        vi: '46% lượt xem đến từ Bảng tin nhưng 95% khách lướt qua; nguồn Tìm kiếm có ý định mua sắm vượt trội',
        en: '46% PV comes from Feed Live Preview but 95% bounce; Search traffic demonstrates 5x higher intent'
      },
      icon: BarChart3,
      color: 'cyan',
      screenshotId: '073543',
      screenshotSrc: '/kami/Screenshot 2026-09-05 073543.png',
      screenshotCaption: {
        vi: 'Phễu phòng LIVE Seller Center: Bảng tin 5,09% • Tìm kiếm 25,68% • Hợp nhất Live 41,41%',
        en: 'LIVE room funnel from Seller Center: Feed 5.09% • Search 25.68% • Live Merge 41.41%'
      },
      kpis: [
        { label: isEn ? 'Feed Preview Rate' : 'Vào từ Ô Live', val: '5,09%', sub: '46% PV hiển thị' },
        { label: isEn ? 'Search Entry Rate' : 'Vào từ Tìm kiếm', val: '25,68%', sub: 'Gấp 5x Ô Live' },
        { label: isEn ? 'A/B Ads Velocity Lift' : 'Tốc độ phiên A/B Ads', val: '3,16x', sub: '1,81M/h → 5,73M/h' }
      ],
      bars: [
        { label: isEn ? 'Feed Live Preview (46% PV - Low CVR)' : 'Bảng tin - Ô Live (46% PV - CVR thấp)', pct: 12.3, val: '5,09% vào phòng (Cần sửa Hook 3s)', color: 'bg-rose-500' },
        { label: isEn ? 'Search Intent (43% PV - High CVR)' : 'Nguồn Tìm kiếm (43% PV - Ý định cao)', pct: 62.0, val: '25,68% vào phòng (SEO tiêu đề tốt)', color: 'bg-emerald-400' },
        { label: isEn ? 'Live Merge (2% PV - Peak CVR)' : 'Hợp nhất Live (2% PV - CVR cao nhất)', pct: 100.0, val: '41,41% vào phòng (PK giờ vàng)', color: 'bg-sky-400' }
      ]
    }
  ];

  const current = charts[activeChartIdx];
  const Icon = current.icon;

  return (
    <section className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/95 p-5 sm:p-7 shadow-2xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
              {isEn ? 'EXECUTIVE VISUAL SUITE' : 'BỘ BIỂU ĐỒ TRỰC QUAN CẤP CAO'}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              {isEn ? '6 Interactive Findings + FastMoss Evidence' : '6 Biểu Đồ Đối Soát + 6 Bằng Chứng FastMoss'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {lang === 'vi'
              ? 'Toàn Cảnh Dữ Liệu Vận Hành TikTok Shop Qua 6 Góc Nhìn Thị Giác'
              : 'TikTok Shop Operational Reality Across 6 Interactive Visual Angles'}
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400">
          {lang === 'vi' ? 'Chọn 1 trong 6 góc nhìn bên dưới để xem đồ thị:' : 'Select any visual angle below:'}
        </div>
      </div>

      {/* 6 SELECTOR PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
        {charts.map((c, i) => {
          const isSelected = activeChartIdx === i;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveChartIdx(i)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-500/60 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-sky-400">
                {isEn ? `ANGLE 0${i + 1}` : `GÓC NHÌN 0${i + 1}`}
              </span>
              <span className="text-xs font-bold truncate mt-1 text-slate-100">
                {c.title[lang].split('. ')[1] || c.title[lang]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CHART CARD (7 COLS BARS + 5 COLS SCREENSHOT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT 7 COLS: KPIS & PROPORTIONAL BARS */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">{current.title[lang]}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{current.subtitle[lang]}</p>
              </div>
            </div>

            {/* 3 COMPACT KPIS */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {current.kpis.map((k, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 truncate">{k.label}</div>
                  <div className="text-base sm:text-lg font-extrabold font-mono text-white mt-0.5">{k.val}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">{k.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL PROPORTIONAL BARS */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            {current.bars.map((b, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{b.label}</span>
                  <span className="font-mono font-bold text-sky-300">{b.val}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.color} transition-all duration-500`}
                    style={{ width: `${Math.max(5, Math.min(100, b.pct))}%` }}
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
    </section>
  );
}
