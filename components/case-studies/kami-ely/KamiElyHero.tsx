'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  ArrowDown, 
  TrendingDown, 
  Users2, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import metrics from '@/app/data/kami-ely/generated/metrics.json';

interface KamiElyHeroProps {
  isEn: boolean;
  activeTab: 'science' | 'shop' | 'creator';
  onJumpToStory?: () => void;
}

export default function KamiElyHero({ isEn, activeTab, onJumpToStory }: KamiElyHeroProps) {
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
    <header className="relative bg-gradient-to-b from-[#C8EEF7]/40 via-[#FFE485]/10 to-[#FAFDFE] text-slate-900 pt-8 pb-10 overflow-hidden border-b border-[#9BE7FA]/40 dark:from-[#0B0F17] dark:via-slate-900 dark:to-[#0B0F17] dark:text-white dark:border-slate-800">
      {/* Decorative Glow */}
      <div className="absolute right-[5%] top-0 w-72 h-72 rounded-full bg-gradient-to-br from-[#9BE7FA]/30 to-[#FFE485]/20 blur-3xl pointer-events-none hidden md:block" />
      <div className="absolute left-[2%] bottom-0 w-64 h-64 rounded-full bg-gradient-to-tr from-[#0D7287]/15 to-transparent blur-3xl pointer-events-none hidden md:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8EEF7]/80 border border-[#9BE7FA] rounded-full text-xs font-bold tracking-wide text-[#0D7287] shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <Flame className="w-3.5 h-3.5 text-[#FFD14C]" />
            <span>{isEn ? 'FASTMOSS TELEMETRY AUDIT · 180-DAY DATASET' : 'KIỂM CHỨNG DỮ LIỆU THỰC TẾ FASTMOSS · 180 NGÀY'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-black uppercase border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
              {isEn ? 'All-Time: 31.6B VND (238k Units)' : 'Tích lũy: 31,6 Tỷ ₫ (238k Đơn)'}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-200/80 text-slate-800 text-[11px] font-bold dark:bg-slate-800 dark:text-slate-300">
              #259 Sports &amp; Outdoor VN
            </span>
          </div>
        </div>

        {/* Main Title & Executive 30-Second Hook */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-slate-950 dark:text-white">
            {isEn ? (
              <>
                Kami Ely TikTok Shop: <span className="text-[#0D7287] dark:text-[#9BE7FA]">Auditing the 83% Summer Revenue Cliff</span> &amp; Dual-Channel In-House Operations
              </>
            ) : (
              <>
                TikTok Shop Kami Ely: <span className="text-[#0D7287] dark:text-[#9BE7FA]">Giải Mã Cú Sụt Giảm -83% Sau Đỉnh Hè</span> &amp; Mô Hình Dual-Channel Nội Bộ
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {isEn
              ? 'A data-driven investigation of 8 raw telemetry files (12.74B VND GMV). Discovered that Girl Style is an in-house satellite channel driving 89.4% of total Live GMV, debunked marketing-correlation fallacies, and restructured catalog strategy for Q4 low-season recovery.'
              : 'Phân tích chuyên sâu 8 nguồn dữ liệu FastMoss (12,74 tỷ VNĐ GMV 180N). Bóc tách bản chất kênh vệ tinh Girl Style cùng cỗ máy Livestream nội bộ gánh 89,4% doanh thu, bác bỏ tương quan marketing ngụy tạo và tái cấu trúc danh mục sản phẩm đối phó mùa thấp điểm.'}
          </p>
        </div>

        {/* 30-SECOND SCAN: 3 IMPACT METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#9BE7FA]/80 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">{isEn ? '180d Real GMV' : 'Doanh Thu 180 Ngày'}</span>
              <span className="text-rose-500 flex items-center gap-1 font-mono font-bold">
                <TrendingDown className="w-3.5 h-3.5" /> -82.9%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
              12,74 <span className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">Tỷ VNĐ</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Đỉnh T6 đạt <strong>3,77 tỷ</strong> (ngày 16/06 đạt 315M), rơi tự do xuống <strong>645M</strong> ở T8 do đứt gãy mùa vụ đồ bơi &amp; phụ thuộc mùa hè.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#FFD14C]/90 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">{isEn ? 'In-House Live Share' : 'Cỗ Máy Live Nội Bộ'}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">2 Kênh</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
              8,28 <span className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">Tỷ VNĐ (89.4%)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kami Ely (7,02 tỷ) + Girl Style (1,26 tỷ) cùng do team in-house vận hành. Affiliate ngoài thực thụ chỉ đóng góp <strong>982 triệu (10.6%)</strong>.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">{isEn ? 'Catalog Pareto' : 'Quy Luật Pareto SKU'}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Gini: 0.92</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
              6.3% <span className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">Tạo 80% GMV</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chỉ <strong>21 Hero SKU</strong> gánh phần lớn shop; <strong>197 SKU (59.5%)</strong> là tồn kho chết không có đơn hàng nào suốt 90 ngày.
            </p>
          </div>
        </div>

        {/* 30-SECOND TAKEAWAYS & ACTION BAR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200 shadow-sm dark:bg-slate-900/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Team in-house tạo 11,4M/phiên (gấp 73,5× affiliate ngoài)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Bác bỏ giả thuyết: Tăng live mùa thấp điểm không thể đảo ngược sức mua</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Cần xả kho 197 SKU chết &amp; xoay trục đồ Thu-Đông</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={scrollToStory}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#0D7287] hover:bg-[#095262] text-white dark:bg-[#9BE7FA] dark:hover:bg-[#78daf0] dark:text-slate-950 text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{isEn ? 'Read 3-Min Executive Audit' : 'Đọc Báo Cáo 3 Phút ↓'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
