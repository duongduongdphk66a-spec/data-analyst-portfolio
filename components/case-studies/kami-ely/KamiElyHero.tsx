'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface KamiElyHeroProps {
  onOpenProofModal?: (_screenshotId?: string) => void;
  onJumpToSection?: (_sectionId: string) => void;
  isEn?: boolean;
  activeTab?: 'science' | 'shop' | 'creator';
  isExecutiveMode?: boolean;
  onToggleExecutiveMode?: () => void;
  onJumpToStory?: () => void;
}

export default function KamiElyHero({ 
  onOpenProofModal, 
  onJumpToSection: _onJumpToSection,
  isEn: propIsEn,
  activeTab: _activeTab,
  isExecutiveMode: _isExecutiveMode = false,
  onToggleExecutiveMode: _onToggleExecutiveMode,
  onJumpToStory
}: KamiElyHeroProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  const kpiCards = [
    {
      id: 'kpi-shop-180d',
      badge: { vi: 'TOÀN SHOP • 180 NGÀY', en: 'SHOP-WIDE • 180 DAYS' },
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      title: { vi: 'Tổng Quy Mô Doanh Thu (Net GMV)', en: 'Total Shop Net GMV (180d)' },
      primaryValue: '12,74 Tỉ VNĐ',
      exactSubValue: '12.735.128.067 đ • 85.500 SP',
      comparisonNote: {
        vi: 'LIVE toàn sàn: 9,26 Tỉ đ (7.046 phiên) | Lũy kế All-Time: 31,6 Tỉ đ (238,4k SP)',
        en: 'Shop LIVE: 9.26B VND (7,046 sessions) | All-Time: 31.6B VND (238.4k units)'
      },
      accentBorder: 'hover:border-sky-500/50'
    },
    {
      id: 'kpi-creator-pillar',
      badge: { vi: 'KÊNH CHÍNH CHỦ • @kamielyhn', en: 'OFFICIAL CHANNEL • @kamielyhn' },
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      title: { vi: 'Tỷ Trọng Tự Gánh & Đối Soát Gross/Net', en: 'Self-Operated Share & Gross/Net' },
      primaryValue: '49,31% GMV (90d)',
      exactSubValue: '3.026.026.869 đ • 20.027 SP (49,78%)',
      comparisonNote: {
        vi: '180d: 5,80 Tỉ đ Net (39,3k SP) vs. 7,89 Tỉ đ Gross CSV | All-Time: 9,2 Tỉ đ (69,9k SP)',
        en: '180d: 5.80B Net (39.3k units) vs. 7.89B Gross CSV | All-Time: 9.2B VND (69.9k units)'
      },
      accentBorder: 'hover:border-emerald-500/50'
    },
    {
      id: 'kpi-gpm-paradox',
      badge: { vi: 'NGHỊCH LÝ CHUYỂN ĐỔI • GPM 4,5X', en: 'CONVERSION PARADOX • 4.5X GPM' },
      badgeColor: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
      title: { vi: 'Hiệu Suất Video Ngắn vs. Livestream', en: 'Shoppable Video vs. LIVE GPM' },
      primaryValue: '135,2k vs. 30,2k đ',
      exactSubValue: 'GPM Video cao gấp 4,5 lần GPM LIVE',
      comparisonNote: {
        vi: '470–475 phiên LIVE (~7,5h/ngày) gây bào mòn sức host; 94,70% GMV Video lệ thuộc Paid Ads',
        en: '470–475 LIVEs (~7.5h/day) cause host burnout; 94.70% of Video GMV relies on Paid Ads'
      },
      accentBorder: 'hover:border-pink-500/50'
    },
    {
      id: 'kpi-seasonality-hanoi',
      badge: { vi: '43% KHÁCH HÀ NỘI • CHU KỲ MÙA VỤ', en: '43% HANOI AUDIENCE • SEASONALITY' },
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      title: { vi: 'Biên Độ Đỉnh Mùa Hè vs. Đáy Thu Đông', en: 'Summer Peak vs. Late-Season Trough' },
      primaryValue: '315,05 Tr → 5,44 Tr/ngày',
      exactSubValue: 'Đỉnh 16/06 (1.936 SP) • Đáy 04/09 (49 SP)',
      comparisonNote: {
        vi: '73% Nữ • 60% (18–24t) • 69,31% GMV là Đồ bơi -> Cần xoay trục sang Chân váy CV11 (6.375 SP)',
        en: '73% Female • 60% (18–24) • 69.31% Swimwear -> Pivot to CV11 A-Line Skirt (6,375 units)'
      },
      accentBorder: 'hover:border-amber-500/50'
    }
  ];

  return (
    <section className="relative w-full rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800/90 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-950 p-6 sm:p-10 dark:shadow-2xl overflow-hidden space-y-8">
      {/* BACKGROUND GLOW DECORATION */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

      {/* TOP METADATA BAR */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200 dark:bg-gradient-to-r dark:from-sky-500/20 dark:to-emerald-500/20 dark:text-sky-300 dark:border-sky-500/30">
            TikTok Shop E-Commerce Analytics
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
            {lang === 'vi' ? 'Chu kỳ chuẩn: 09/03/2026 – 04/09/2026 (180 Ngày)' : 'Master Window: Mar 09 – Sep 04, 2026 (180d)'}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-500/20">
            {lang === 'vi' ? '8 Tập Dữ Liệu • 18.778 Bản Ghi • 22 Ảnh Bằng Chứng' : '8 Datasets • 18,778 Rows • 22 Proof Screenshots'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onJumpToStory && (
            <button
              type="button"
              onClick={onJumpToStory}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span>
              <span>{lang === 'vi' ? 'Bản Tóm Tắt 3 Phút' : '3-Min Story'}</span>
            </button>
          )}

          {onOpenProofModal && (
            <button
              type="button"
              onClick={() => onOpenProofModal('073418')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔍</span>
              <span>{lang === 'vi' ? 'Xem Bằng Chứng Dữ Liệu Gốc' : 'View Raw Data Proof'}</span>
            </button>
          )}
        </div>
      </div>

      {/* HERO HEADLINE & EXECUTIVE VALUE PROPOSITION */}
      <div className="relative space-y-4 max-w-5xl">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          {lang === 'vi' ? (
            <>
              Kiểm Toán Đa Chiều & Tối Ưu Hóa Chuyển Đổi Gian Hàng{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-pink-600 dark:from-sky-400 dark:via-emerald-300 dark:to-pink-400 bg-clip-text text-transparent">
                Kami Ely (@kamielyhn)
              </span>
            </>
          ) : (
            <>
              Multi-Tier Data Audit & Conversion Optimization for{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-pink-600 dark:from-sky-400 dark:via-emerald-300 dark:to-pink-400 bg-clip-text text-transparent">
                Kami Ely (@kamielyhn)
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {lang === 'vi'
            ? 'Dự án phân tích toàn diện hệ sinh thái thương mại điện tử TikTok Shop kết hợp giữa dữ liệu Toàn Shop (12,74 Tỉ đ / 180 ngày; 31,6 Tỉ đ Toàn thời gian), dữ liệu Kênh Chính Chủ @kamielyhn (tự gánh 49,31% GMV 90 ngày) và Telemetry chẩn đoán nội bộ từ TikTok Seller Center & Live Workbench.'
            : 'End-to-end TikTok Shop E-Commerce analytics combining Shop-Wide performance (12.74B VND in 180d; 31.6B VND All-Time), Official Channel @kamielyhn metrics (carrying 49.31% of 90d GMV), and internal diagnostics from TikTok Seller Center & Live Workbench.'}
        </p>
      </div>

      {/* 4 BENTO KPI CARDS */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.id}
            className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/90 transition duration-200 flex flex-col justify-between space-y-3 dark:shadow-lg ${card.accentBorder}`}
          >
            <div className="space-y-2">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${card.badgeColor}`}
              >
                {card.badge[lang]}
              </span>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.title[lang]}</h2>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 dark:text-white tracking-tight">
                {card.primaryValue}
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">{card.exactSubValue}</div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
              {card.comparisonNote[lang]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
