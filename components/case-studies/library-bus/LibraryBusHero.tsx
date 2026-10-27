'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusHeroProps {
  isEn?: boolean;
  onNavClick?: (_id: string, _e?: React.MouseEvent) => void;
}

export function LibraryBusHero({ 
  isEn: propIsEn, 
  onNavClick: _onNavClick,
}: LibraryBusHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const libraryBusKpiCards = [
    {
      id: 'kpi-bus-desktop',
      badge: { vi: 'HỆ THỐNG GIAO DIỆN • 20 SCREENS', en: 'UI SYSTEM • 20 SCREENS' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: { vi: 'Quy Chuẩn Wireframe & UI Desktop', en: 'Desktop Wireframes & UI Standards' },
      primaryValue: '20 Màn Hình',
      exactSubValue: 'Lưới 12 Cột (Desktop 1440px)',
      comparisonNote: {
        vi: 'Thiết kế chuẩn hóa từ wireframe khung dây đến UI hoàn thiện, đáp ứng các luồng tra cứu sách, lịch trình xe và mượn trả.',
        en: 'Standardized from wireframes to high-fidelity UI, covering book search, real-time bus tracking, and lending flows.'
      },
      accentBorder: 'hover:border-[#9BE7FA]/60'
    },
    {
      id: 'kpi-bus-mobile',
      badge: { vi: 'THIẾT KẾ ĐA NỀN TẢNG • MOBILE UX', en: 'CROSS-PLATFORM • MOBILE UX' },
      badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: { vi: 'Bố Cục Responsive Chuẩn Mobile', en: 'Responsive Mobile Screen Set' },
      primaryValue: '20 Bản Mobile',
      exactSubValue: 'Bố Cục 1 Cột Tối Ưu Cảm Ứng',
      comparisonNote: {
        vi: 'Tối ưu hóa thao tác một tay với nút bấm tối thiểu 44px, điều hướng thanh bar phía dưới và thời gian tải nhanh trên 4G/5G.',
        en: 'Optimized for single-hand use with 44px touch targets, bottom bar navigation, and rapid lightweight loading on cellular.'
      },
      accentBorder: 'hover:border-[#FFD14C]/60'
    },
    {
      id: 'kpi-bus-palette',
      badge: { vi: 'BẢNG MÀU THƯƠNG HIỆU • 6 TÔNG', en: 'BRAND PALETTE • 6 TONES' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: { vi: 'Hệ Màu Bản Sắc Tiệm Bánh & Tri Thức', en: 'Bakery Warmth & Brand Colors' },
      primaryValue: '6 Tông Màu',
      exactSubValue: 'Molasses Ink → Butter Cream',
      comparisonNote: {
        vi: 'Phối màu ấm áp gợi cảm giác tiệm bánh cổ điển (Warm Bakery), tạo sự gần gũi, ấm áp và khuyến khích văn hóa đọc cộng đồng.',
        en: 'Warm tones inspired by vintage bakery aesthetics, creating a welcoming atmosphere that fosters community reading habits.'
      },
      accentBorder: 'hover:border-[#9BE7FA]/60'
    },
    {
      id: 'kpi-bus-typography',
      badge: { vi: 'HỆ THỐNG TYPOGRAPHY • DUAL FONT', en: 'TYPOGRAPHY SYSTEM • DUAL FONT' },
      badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: { vi: 'Phông Chữ Tiêu Đề & Nội Dung', en: 'Heading & Body Typography Hierarchy' },
      primaryValue: 'Lora + Outfit',
      exactSubValue: 'Serif Cổ Điển + Sans Hiện Đại',
      comparisonNote: {
        vi: 'Lora mang nét trang nhã tri thức cho đề mục; Outfit mang tính trực quan, rõ nét cho văn bản chỉ dẫn và thông số vận hành.',
        en: 'Lora delivers literary elegance for headings; Outfit provides geometric clarity for UI labels, guidance, and metrics.'
      },
      accentBorder: 'hover:border-[#FFD14C]/60'
    }
  ];

  return (
    <header className="relative w-full rounded-3xl border border-slate-200 bg-white dark:border-slate-800/90 p-6 sm:p-10 overflow-hidden space-y-8 dark:bg-slate-950 transition-colors duration-200">
      {/* BACKGROUND GLOW DECORATION */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#9BE7FA]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FFE485]/10 blur-3xl" />

      {/* HERO HEADLINE */}
      <div className="relative space-y-4 max-w-5xl">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          {isEn ? (
            <>
              Library Bus System:{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Website Design Guidelines
              </span>
              : Research, Logo & UI Components, Wireframes
            </>
          ) : (
            <>
              Hệ Thống Xe Thư Viện Lưu Động (Library Bus):{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Bộ Quy Chuẩn Thiết Kế Website
              </span>
              : Nghiên Cứu UX, Logo & UI, Wireframe
            </>
          )}
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {isEn
            ? 'End-to-end UX/UI website architecture for mobile library service: reader user flows, real-time bus route tracking, modular 12-column grid, and automated borrowing pipelines.'
            : 'Thiết kế kiến trúc UX/UI website xe thư viện lưu động: nghiên cứu luồng độc giả, định vị lịch trình xe, hệ thống lưới 12 cột và quy trình số hóa mượn sách tự động.'}
        </p>
      </div>

      {/* 4 BENTO KPI CARDS - UNIFIED KAMI ELY STYLE */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {libraryBusKpiCards.map((card) => (
          <div
            key={card.id}
            className={`p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800/90 transition duration-200 flex flex-col justify-between space-y-3 ${card.accentBorder}`}
          >
            <div className="space-y-2">
              <div className="min-h-[42px] flex items-start">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-md text-xs tabular-nums font-bold border ${card.badgeColor}`}
                >
                  {card.badge[lang]}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-h-[34px] flex items-start leading-snug">
                {card.title[lang]}
              </h2>
              <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-950 dark:text-white tracking-tight min-h-[72px] flex items-center">
                {card.primaryValue}
              </div>
              <div className="text-sm tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA] min-h-[34px] flex items-start leading-snug">
                {card.exactSubValue}
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-3 mt-auto">
              {card.comparisonNote[lang]}
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}

export default LibraryBusHero;
