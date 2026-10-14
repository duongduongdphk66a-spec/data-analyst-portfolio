'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  TrendingDown, 
  Users2, 
  CheckCircle2, 
  Zap,
  ShoppingBag,
  Video,
  Radio
} from 'lucide-react';

interface KamiElyHeroProps {
  isEn: boolean;
  activeTab: 'science' | 'shop' | 'creator';
  onJumpToStory?: () => void;
  isExecutiveMode?: boolean;
  onToggleExecutiveMode?: () => void;
}

export default function KamiElyHero({ 
  isEn, 
  activeTab: _activeTab, 
  onJumpToStory,
  isExecutiveMode = false,
  onToggleExecutiveMode
}: KamiElyHeroProps) {
  const scrollToStory = () => {
    if (onJumpToStory) {
      onJumpToStory();
      return;
    }
    const el = document.getElementById('executive-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative bg-gradient-to-b from-[#C8EEF7]/40 via-[#FFE485]/10 to-[#FAFDFE] text-slate-900 pt-8 pb-10 overflow-hidden border-b border-[#9BE7FA]/40 dark:from-[#0B0F17] dark:via-slate-900 dark:to-[#0B0F17] dark:text-white dark:border-slate-800 transition-colors">
      {/* Decorative Glow */}
      <div className="absolute right-[5%] top-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#9BE7FA]/25 to-[#FFE485]/20 blur-3xl pointer-events-none hidden md:block" />
      <div className="absolute left-[2%] bottom-0 w-72 h-72 rounded-full bg-gradient-to-tr from-[#0D7287]/15 to-transparent blur-3xl pointer-events-none hidden md:block" />

      <div className="relative z-10 page-container space-y-6">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/80 border border-[#9BE7FA] rounded-full text-xs font-bold tracking-wide text-[#0D7287] shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEn ? 'FASTMOSS TELEMETRY AUDIT · 180-DAY DATASET' : 'KIỂM CHỨNG DỮ LIỆU THỰC TẾ FASTMOSS · 180 NGÀY'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/30">
              {isEn ? '4 Audit Rules Reconciled' : '4 Quy Tắc Đối Soát Khớp 100%'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-mono font-black uppercase border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
              {isEn ? 'All-Time: 31.6B VND (238k Units)' : 'Tích lũy: 31,6 Tỷ ₫ (238k Đơn)'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-800 text-[11px] font-bold dark:bg-slate-800 dark:text-slate-300">
              #259 Sports &amp; Outdoor VN
            </span>
          </div>
        </div>

        {/* Main Title & Executive 30-Second Hook */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.18] tracking-tight text-slate-950 dark:text-white">
            {isEn ? (
              <>
                Kami Ely TikTok Shop: <span className="text-[#0D7287] dark:text-[#9BE7FA]">Auditing the 83% Summer Revenue Cliff</span> &amp; Dual-Channel In-House Operations
              </>
            ) : (
              <>
                TikTok Shop Kami Ely: <span className="text-[#0D7287] dark:text-[#9BE7FA]">Giải Mã Cú Sụt Giảm -83% Sau Đỉnh Hè</span> &amp; Kiểm Toán Mô Hình Dual-Channel Nội Bộ
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {isEn
              ? 'An end-to-end data audit of 8 raw telemetry files (12.74B VND GMV). Reconciles 3 distinct time horizons, demystifies the 22.85% product card volume gap, exposes the 94.70% Paid Ads reliance on video, and formulates an Autumn-Winter catalog pivot.'
              : 'Kiểm toán chuyên sâu 8 tệp dữ liệu viễn trắc FastMoss & Seller Center (12,74 tỷ VNĐ GMV 180N). Chuẩn hóa 3 khung thời gian, giải mã khoảng trống kệ hàng 22,85%, bóc trần sự phụ thuộc 94,70% vào Paid Ads của Video và vạch lộ trình xoay trục danh mục Thu–Đông.'}
          </p>
        </div>

        {/* =================================================================== */}
        {/* 4 THẺ BENTO KPI ĐA TẦNG (BENTO GRID 4 KPIS)                        */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Card 1: Quy mô Toàn Shop (180 ngày) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-sky-400/50 shadow-md hover:shadow-xl transition-all dark:bg-slate-900/95 dark:border-sky-500/30 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 font-mono text-[10px] uppercase font-black">
                  {isEn ? '180-Day Macro Scope' : 'Quy Mô 180 Ngày'}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">09/03 – 04/09</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono tracking-tight">
                {isEn ? '12.74' : '12,74'} <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{isEn ? 'Billion VND' : 'Tỉ VNĐ'}</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>85.500 SP · 7.046 LIVEs · 4.417 Videos</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              {isEn ? (
                <>Historical All-time: <strong>31.6B VND</strong> / 238.4k units across 12.4k LIVEs since 2022-08-18 (Rank #259).</>
              ) : (
                <>Nền tảng All-time: <strong>31,6 Tỉ đ</strong> / 238,4k SP qua 12,4k LIVEs từ 18/08/2022 (Top 259 Ngành).</>
              )}
            </div>
          </div>

          {/* Card 2: Trụ cột Kênh Chính Chủ (@kamielyhn) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-indigo-400/50 shadow-md hover:shadow-xl transition-all dark:bg-slate-900/95 dark:border-indigo-500/30 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] uppercase font-black">
                  {isEn ? 'Core Driver (90d)' : 'Trụ Cột Chính Chủ'}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">
                  49,76% Volume
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono tracking-tight">
                {isEn ? '3.03' : '3,03'} <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{isEn ? 'Billion VND (90d)' : 'Tỉ đ (90N)'}</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <Users2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>20.027 SP tự gánh (49,3% GMV)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              {isEn ? (
                <>180-day telemetry: <strong>5.80B Net</strong> (7.89B Gross CSV / 54.9k units across 470 LIVE sessions).</>
              ) : (
                <>Chuỗi 180 ngày: <strong>5,80 Tỉ Net</strong> (7,89 Tỉ Gross CSV / 54,9k SP qua 470 phiên LIVE chuẩn hóa).</>
              )}
            </div>
          </div>

          {/* Card 3: Nghịch lý Chuyển đổi (GPM Gap 4,5x) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-purple-400/50 shadow-md hover:shadow-xl transition-all dark:bg-slate-900/95 dark:border-purple-500/30 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 font-mono text-[10px] uppercase font-black">
                  {isEn ? '4.5x GPM Disparity' : 'Nghịch Lý GPM 4,5x'}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold">
                  94,7% Paid Ads
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono tracking-tight">
                135,2k <span className="text-sm font-bold text-purple-600 dark:text-purple-400">₫ / 1k views</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Video 135,2k vs. LIVE 30,2k đ</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              {isEn ? (
                <>High Video GPM relies 94.7% on Paid Ads (2.05B VND), while organic video is choked by 08-12h morning posting &amp; 308 non-cart videos.</>
              ) : (
                <>GPM Video vượt trội nhờ 94,7% Shopping Ads (2,05 Tỉ đ); Organic bị nghẽn do đăng sáng (08h–12h) và 308 video chưa gắn giỏ.</>
              )}
            </div>
          </div>

          {/* Card 4: Cú sốc Mùa vụ & Địa lý */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-rose-400/50 shadow-md hover:shadow-xl transition-all dark:bg-slate-900/95 dark:border-rose-500/30 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono text-[10px] uppercase font-black">
                  {isEn ? 'Seasonality Collapse' : 'Cú Sốc Mùa Vụ & Địa Lý'}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px] font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> -98,3%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                315M ➔ 5,4M <span className="text-xs font-bold text-slate-500">₫/ngày</span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>43% Follower Hà Nội · 69,3% Bikini</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              {isEn ? (
                <>Daily GMV collapsed from 315M (Jun 16) to 5.44M (Sep 04); requires urgent Autumn-Winter pivot to Hero SKU CV11 (6,375 units).</>
              ) : (
                <>Rơi tự do từ đỉnh 315M (16/06) xuống đáy 5,44M (04/09); cần xoay trục khẩn cấp sang thời trang Thu–Đông như Hero SKU CV11 (6.375 SP).</>
              )}
            </div>
          </div>
        </div>

        {/* 30-SECOND TAKEAWAYS & ACTION BAR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm dark:bg-slate-900/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isEn ? 'Dual-Channel In-House drives 89.4% of total LIVE GMV' : 'Mô hình Dual-Channel nội bộ tạo 89,4% GMV LIVE toàn shop'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isEn ? 'Product Card Showcase passive sales: 22.85% GMV / 21.45% volume' : 'Thẻ sản phẩm / Kệ hàng thụ động gánh 22,85% GMV / 21,45% sản lượng'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isEn ? 'Spamming LIVE sessions in off-season yields zero statistically significant lift' : 'Bác bỏ giả thuyết: Tăng live mùa thấp điểm không thể đảo ngược sức mua'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            {onToggleExecutiveMode && (
              <button
                type="button"
                onClick={onToggleExecutiveMode}
                className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-heading font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  isExecutiveMode
                    ? 'bg-[#FFD14C] text-slate-950 ring-2 ring-amber-400'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-700'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                <span>{isExecutiveMode ? (isEn ? 'Exit 3-Min Mode' : 'Tắt Chế Độ 3 Phút') : (isEn ? '⚡ 3-Min Executive Scan' : '⚡ Chế Độ Tóm Tắt 3 Phút')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToStory}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#0D7287] hover:bg-[#095262] text-white dark:bg-[#9BE7FA] dark:hover:bg-[#78daf0] dark:text-slate-950 text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{isEn ? 'Read Executive Audit ↓' : 'Đọc Báo Cáo Thực Nghiệm ↓'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
