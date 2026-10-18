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
  onOpenProofModal: _onOpenProofModal, 
  onJumpToSection: _onJumpToSection,
  isEn: propIsEn,
  activeTab: _activeTab,
  isExecutiveMode: _isExecutiveMode = false,
  onToggleExecutiveMode: _onToggleExecutiveMode,
  onJumpToStory: _onJumpToStory
}: KamiElyHeroProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  const kpiCards = [
    {
      id: 'kpi-shop-180d',
      badge: { vi: 'TOÀN SHOP • 180 NGÀY', en: 'SHOP-WIDE • 180 DAYS' },
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
      title: { vi: 'Tổng Doanh Thu & Sản Phẩm Bán (180 Ngày)', en: 'Total Net GMV & Volume Sold (180d)' },
      primaryValue: '12,74 Tỉ VNĐ',
      exactSubValue: '85.500 Sản Phẩm (12.735.128.067 đ)',
      comparisonNote: {
        vi: 'Bình quân 70,75 Tr đ/ngày (475 SP/ngày) • LIVE chiếm 72,7% (9,26 Tỉ đ) | Lũy kế All-Time: 31,6 Tỉ đ (238,4k SP)',
        en: 'Average 70.75M VND/day (475 units/day) • LIVE drives 72.7% (9.26B) | All-Time: 31.6B VND (238.4k units)'
      },
      accentBorder: 'hover:border-sky-500/50'
    },
    {
      id: 'kpi-dual-channel',
      badge: { vi: 'KÊNH CHÍNH CHỦ & ĐỒNG VẬN HÀNH', en: 'OFFICIAL & SATELLITE CHANNELS' },
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
      title: { vi: 'Tỷ Trọng Gánh: @kamielyhn & Girl Style', en: 'Carrying Share: @kamielyhn & Girl Style' },
      primaryValue: '65,02% GMV Shop',
      exactSubValue: 'Kami Ely (55,16%) + Girl Style (9,86%)',
      comparisonNote: {
        vi: 'Hai kênh in-house tạo 8,28 Tỉ đ LIVE (gánh 89,39% doanh số livestream sàn); affiliate ngoài thực tế chỉ chiếm 7,71% (982 Tr đ)',
        en: 'Two in-house channels generate 8.28B VND LIVE (89.39% of all live GMV); true external affiliates only drive 7.71% (982M VND)'
      },
      accentBorder: 'hover:border-emerald-500/50'
    },
    {
      id: 'kpi-gpm-paradox',
      badge: { vi: 'NGHỊCH LÝ CHUYỂN ĐỔI • GPM 4,5X', en: 'CONVERSION PARADOX • 4.5X GPM' },
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30',
      title: { vi: 'Hiệu Suất Video Ngắn vs. Livestream', en: 'Shoppable Video vs. LIVE GPM' },
      primaryValue: '135,2k vs. 30,2k đ',
      exactSubValue: 'GPM Video gấp 4,5 lần LIVE (₫/1k views)',
      comparisonNote: {
        vi: '470–475 phiên LIVE (~7,5h/ngày) gây bào mòn sức host; 94,70% GMV Video lệ thuộc Shopping Ads (2,05 Tỉ đ)',
        en: '470–475 LIVEs (~7.5h/day) cause host burnout; 94.70% of Video GMV relies on Shopping Ads (2.05B VND)'
      },
      accentBorder: 'hover:border-purple-500/50'
    },
    {
      id: 'kpi-seasonality-june-august',
      badge: { vi: 'CHU KỲ MÙA VỤ • BIẾN ĐỘNG DOANH THU', en: 'SEASONALITY CYCLE • SUMMER DROP' },
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      title: { vi: 'Đỉnh Tháng 6 Bán Nhiều vs. Tháng 8 Tụt Sâu', en: 'June Peak vs. August Seasonal Drop' },
      primaryValue: '3,77 Tỉ → 645,5 Tr đ',
      exactSubValue: 'Tháng 8 giảm -82,9% (Đỉnh 315,05 Tr/ngày → Đáy 5,44 Tr/ngày)',
      comparisonNote: {
        vi: 'Tháng 6 lập đỉnh 3,77 Tỉ đ (ngày 16/06 đạt 1.936 SP). Sang tháng 8 rơi xuống 645,5 Tr đ và ngày 04/09 chỉ còn 49 SP do miền Bắc hết mùa biển',
        en: 'June peaked at 3.77B VND (Jun 16 hit 1,936 units). By August revenue dropped to 645.5M VND, hitting a low of 49 units on Sep 04 as beach season ended'
      },
      accentBorder: 'hover:border-amber-500/50'
    }
  ];

  return (
    <section className="relative w-full rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800/90 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-950 p-6 sm:p-10 dark:shadow-2xl overflow-hidden space-y-8">
      {/* BACKGROUND GLOW DECORATION */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

      {/* HERO HEADLINE & EXECUTIVE VALUE PROPOSITION */}
      <div className="relative space-y-4 max-w-5xl">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          {lang === 'vi' ? (
            <>
              Phân Tích Toàn Diện TikTok Shop & Creator{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-pink-600 dark:from-sky-400 dark:via-emerald-300 dark:to-pink-400 bg-clip-text text-transparent">
                Kami Ely (@kamielyhn)
              </span>
              : Từ Vận Hành Thương Mại Đến Tối Ưu Hóa Thống Kê
            </>
          ) : (
            <>
              Comprehensive TikTok Shop & Creator Analysis for{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-pink-600 dark:from-sky-400 dark:via-emerald-300 dark:to-pink-400 bg-clip-text text-transparent">
                Kami Ely (@kamielyhn)
              </span>
              : From Commercial Operations to Statistical Optimization
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {lang === 'vi'
            ? 'Đánh giá hiệu suất tạo doanh thu (GMV), hành vi chuyển đổi nội dung (Video vs. Livestream) và cấu trúc danh mục sản phẩm (SKU) của thương hiệu Kami Ely trên TikTok Shop để tìm ra đòn bẩy tăng trưởng bền vững.'
            : 'Evaluate GMV generation, content conversion behavior (Video vs. Livestream), and product SKU architecture for the Kami Ely brand on TikTok Shop to unlock sustainable growth levers.'}
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
                className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${card.badgeColor}`}
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
