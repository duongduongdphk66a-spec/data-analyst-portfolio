'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface KamiElyHeroProps {
  isEn: boolean;
  activeTab: 'science' | 'shop' | 'creator';
}

export default function KamiElyHero({ isEn, activeTab }: KamiElyHeroProps) {
  if (activeTab === 'science') return null;

  return (
    <header className="relative bg-gradient-to-b from-[#C8EEF7]/40 via-[#FFE485]/10 to-slate-50 text-slate-900 pt-8 pb-8 overflow-hidden border-b border-[#9BE7FA]/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:border-slate-800">
      {/* Subtle Glow */}
      <div className="absolute right-[5%] top-0 w-56 h-56 rounded-full bg-gradient-to-br from-[#9BE7FA]/30 to-[#FFE485]/20 blur-3xl pointer-events-none hidden md:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Row 1: Badge + Title */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-xl text-xs font-bold tracking-wide text-[#0D7287] shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <Flame className="w-3.5 h-3.5 text-[#FFD14C]" />
              <span>
                {isEn 
                  ? 'FASTMOSS TELEMETRY ┬╖ 180-DAY REAL DATASET' 
                  : 'Dß╗« LIß╗åU TELEMETRY 180 NG├ÇY ┬╖ PH├éN T├ìCH CHUY├èN S├éU Tß╗¬ FASTMOSS'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
              {activeTab === 'shop' ? (
                <>
                  {isEn ? 'Kami Ely TikTok Shop: ' : 'TikTok Shop Kami Ely: '}
                  <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                    {isEn ? 'Growth via LIVE & Nano-Affiliates' : 'Bß╗⌐t Ph├í Nhß╗¥ LIVE Shopping & KOC'}
                  </span>
                </>
              ) : (
                <>
                  {isEn ? 'Creator @kamielyhn: ' : 'Creator @kamielyhn: '}
                  <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                    {isEn ? '9.2B VND GMV Powerhouse' : 'N─âng Lß╗▒c Th╞░╞íng Mß║íi 9,2 Tß╗╖ ─æ'}
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-400 max-w-2xl">
              {activeTab === 'shop' ? (
                isEn 
                  ? '338 products ┬╖ 5.7k affiliates ┬╖ 11.2k videos ┬╖ 7.0k live sessions. Real commercial metrics from FastMoss.'
                  : '338 m├ú SP ┬╖ 5.700 KOC ┬╖ 11.200 video ┬╖ 7.000 phi├¬n live. Dß╗» liß╗çu th╞░╞íng mß║íi thß╗▒c tß║┐ tß╗½ FastMoss.'
              ) : (
                isEn
                  ? '73% Female ┬╖ 60% Gen Z audience ┬╖ 0.74% peak engagement ┬╖ High-converting video/live sales matrix.'
                  : '73% Nß╗» ┬╖ 60% Gen Z ┬╖ T╞░╞íng t├íc ─æß╗ënh 0.74% ┬╖ Ma trß║¡n doanh thu video & mega-live.'
              )}
            </p>
          </div>

          {/* Compact Lifetime GMV Badge */}
          <div className="bg-white border-2 border-[#9BE7FA] rounded-2xl p-4 shadow-md min-w-[240px] dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold dark:text-slate-400">
                {activeTab === 'shop' ? (isEn ? 'ALL-TIME GMV' : 'GMV T├ìCH L┼¿Y') : (isEn ? 'CREATOR GMV' : 'GMV CREATOR')}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-black uppercase border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
                {isEn ? 'Lifetime' : 'To├án thß╗¥i gian'}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {activeTab === 'shop' ? '31,6' : '9,2'} <span className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? 'B VND' : 'Tß╗╖ ─æ'}</span>
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
              <span>ΓÜá∩╕Å</span>
              <span>
                {activeTab === 'shop'
                  ? (isEn ? 'Since 2022 (not 180d)' : 'Tß╗½ 2022 (kh├┤ng phß║úi 180N)')
                  : (isEn ? 'Since 2023 (not 180d)' : 'Tß╗½ 2023 (kh├┤ng phß║úi 180N)')}
              </span>
            </div>
          </div>
        </div>

        {/* Inline Metrics Row */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          {activeTab === 'shop' ? (
            <>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-slate-950 dark:text-white">85.5k / 12,7T─æ</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? '180d Units & GMV' : 'SP & GMV 180N'}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-[#0D7287] dark:text-[#9BE7FA]">#7.5k / #259</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Rank' : 'Xß║┐p hß║íng'}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFE485] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-slate-950 dark:text-white">5.7k KOCs</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Affiliates</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFD14C] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-slate-950 dark:text-[#FFD14C]">3.9/5.0 (99%)</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Rating' : '─É├ính gi├í'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-slate-950 dark:text-white">48.8k</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Followers (+9.4k)' : 'Follow (+9.4k)'}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-[#0D7287] dark:text-[#9BE7FA]">135k─æ / 30k─æ</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">GPM Video/LIVE</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFE485] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-slate-950 dark:text-white">34.3M</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Views' : 'L╞░ß╗út xem'}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFD14C] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                <span className="text-sm font-black text-slate-950 dark:text-[#FFD14C]">67 Index</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">E-com</span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
