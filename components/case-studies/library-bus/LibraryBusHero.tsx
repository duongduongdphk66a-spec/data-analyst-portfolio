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
      id: 'kpi-bus-screens',
      badge: { vi: 'ĐỐI CHIẾU LO-FI & HI-FI • 11 PAIRS', en: 'LO-FI & HI-FI PAIRS • 11 SCREENS' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: { vi: 'Hệ Thống Wireframe & UI Cốt Lõi', en: 'Core Desktop & Mobile Screen Pairs' },
      primaryValue: isEn ? '11 Screen Pairs' : '11 Cặp Màn Hình',
      exactSubValue: isEn ? 'Desktop 1440px & Mobile 390px' : 'Desktop 1440px & Mobile 390px',
      comparisonNote: {
        vi: 'Chuẩn hóa 11 màn hình cốt lõi (44 bản thiết kế): đối chiếu trực tiếp từng cặp Wireframe khung xám với giao diện hoàn chỉnh trên cả Desktop và Mobile.',
        en: 'Standardized 11 core screens (44 views total): side-by-side structural wireframes paired with high-fidelity UI across Desktop and Mobile viewports.'
      },
      accentBorder: 'hover:border-[#9BE7FA]/60'
    },
    {
      id: 'kpi-bus-ba',
      badge: { vi: 'ĐẶC TẢ NGHIỆP VỤ • BA WORKFLOWS', en: 'BA SPECIFICATION • 4 WORKFLOWS' },
      badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: { vi: 'Luồng Nghiệp Vụ & Quy Tắc Kinh Doanh', en: 'Business Rules & User Flows' },
      primaryValue: isEn ? '4 BA Flows' : '4 Luồng BA',
      exactSubValue: isEn ? 'BR-01..04 & Given/When/Then' : 'BR-01..04 & Given/When/Then',
      comparisonNote: {
        vi: 'Bao phủ trọn vẹn 4 luồng: Tra cứu tồn kho theo xe, Đặt giữ sách tại điểm dừng, Quản lý mượn trả & quá hạn, và Tiếp nhận quyên góp cộng đồng.',
        en: 'Covers 4 end-to-end flows: Bus-level catalog lookup, Stop-based reservation, Circulation & overdue tracking, and Community book donation intake.'
      },
      accentBorder: 'hover:border-[#FFD14C]/60'
    },
    {
      id: 'kpi-bus-backend',
      badge: { vi: 'TOÀN VẸN GIAO DỊCH • POSTGRESQL', en: 'TRANSACTION INTEGRITY • POSTGRESQL' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: { vi: 'Kiểm Soát Tranh Chấp Tồn Kho', en: 'Concurrency & Inventory Locking' },
      primaryValue: 'ACID + Row Lock',
      exactSubValue: 'select_for_update() • Celery',
      comparisonNote: {
        vi: 'Khóa bản ghi cuốn sách khi có nhiều yêu cầu mượn đồng thời, tự động chuyển sang hàng đợi đặt trước khi tồn kho về 0 và đẩy thông báo bất đồng bộ qua Redis.',
        en: 'Applies row-level locks during concurrent borrow requests, auto-falls back to the reservation queue at zero stock, and dispatches async alerts via Redis.'
      },
      accentBorder: 'hover:border-[#9BE7FA]/60'
    },
    {
      id: 'kpi-bus-analytics',
      badge: { vi: 'PHÂN TÍCH VẬN HÀNH & DESIGN SYSTEM', en: 'ANALYTICS & DESIGN SYSTEM' },
      badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: { vi: 'Chỉ Số Vận Hành & Bản Sắc Thương Hiệu', en: 'Operational KPIs & Brand Tokens' },
      primaryValue: 'Bayesian + Cosine',
      exactSubValue: isEn ? '6 Neo-Bakery Tones • Lora + Outfit' : '6 Tông Neo-Bakery • Lora + Outfit',
      comparisonNote: {
        vi: 'Kết hợp bảng điều khiển phân tích (xếp hạng Bayesian, gợi ý Cosine Similarity, KPI đội xe) với hệ màu ấm Neo-Bakery và cặp phông chữ Lora + Outfit.',
        en: 'Pairs operational analytics (Bayesian ranking, Cosine Similarity recommendations, fleet KPIs) with the 6-tone Neo-Bakery palette and Lora + Outfit typography.'
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
                BA Specification, UX/UI &amp; System Architecture
              </span>
              {' '}for Mobile Library Service
            </>
          ) : (
            <>
              Hệ Thống Xe Thư Viện Lưu Động (Library Bus):{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Phân Tích Nghiệp Vụ (BA), Thiết Kế UX/UI &amp; Kiến Trúc Dữ Liệu
              </span>
            </>
          )}
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {isEn
            ? 'End-to-end product specification and Django web architecture for a mobile library network: business rules (BR), Sitemap & User Flows, 11 core Desktop & Mobile Wireframe-to-UI screen pairs, PostgreSQL ACID concurrency control, and operational analytics.'
            : 'Đặc tả nghiệp vụ và kiến trúc ứng dụng web Django cho mạng lưới xe thư viện lưu động: quy tắc nghiệp vụ (Business Rules), Sitemap & User Flow, 11 cặp màn hình cốt lõi (Wireframe đối chiếu UI trên Desktop & Mobile), kiểm soát giao dịch PostgreSQL ACID và bảng điều khiển phân tích dữ liệu.'}
        </p>
      </div>

      {/* 4 BENTO KPI CARDS */}
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
