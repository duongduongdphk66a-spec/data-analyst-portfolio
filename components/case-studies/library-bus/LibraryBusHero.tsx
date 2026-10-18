'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusHeroProps {
  isEn?: boolean;
  onNavClick?: (_id: string, _e?: React.MouseEvent) => void;
}

export function LibraryBusHero({ 
  isEn: propIsEn, 
  onNavClick = (id, e) => {
    e?.preventDefault?.();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  } 
}: LibraryBusHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <header className="py-16 md:py-24 border-b border-slate-200/80 dark:border-slate-800">
      <div className="page-container space-y-8">
        <div className="max-w-5xl space-y-6">
          <h1 className="editorial-section-title text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            {isEn ? 'Library Bus System:' : 'Tủ Sách Lưu Động (Library Bus):'} <br />
            <span className="text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'Website Design Guidelines: Research, Logo & UI Components, Wireframes' : 'Bộ Quy Chuẩn Thiết Kế Website: Nghiên Cứu, Logo & UI, Wireframe'}
            </span>
          </h1>
          
          <p className="editorial-lead text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-4xl dark:text-slate-300">
            {isEn
              ? 'A UX/UI design project for the website of a mobile library service. Readers search for books, see the buses on a map and reserve in advance. Librarians create borrow slips and follow dashboards. Books, buses and users shown in the interface are sample data.'
              : 'Dự án thiết kế UX/UI cho website của dịch vụ xe thư viện lưu động. Người đọc tra cứu sách, xem xe trên bản đồ và đặt mượn trước. Thủ thư tạo phiếu mượn và theo dõi dashboard. Sách, xe và người dùng trong giao diện là dữ liệu mẫu.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#visual-comparison"
              onClick={(e) => onNavClick('visual-comparison', e)}
              className="btn-primary flex items-center gap-2.5 cursor-pointer font-bold text-sm sm:text-base px-6 py-3 min-h-[46px] rounded-2xl shadow-md"
            >
              <Eye className="w-5 h-5" />
              <span>{isEn ? 'View 20 UI Screens' : 'Xem 20 Màn Hình Giao Diện'}</span>
            </a>
            <a
              href="/projects/library-bus/presentation"
              className="btn-secondary-editorial flex items-center gap-2.5 font-bold text-sm sm:text-base px-6 py-3 min-h-[46px] rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-[#0D7287]"
            >
              <Eye className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{isEn ? 'View Presentation Deck (30 Slides)' : 'Xem Bản Trình Chiếu (30 Slide)'}</span>
            </a>
          </div>
        </div>

        {/* Key facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-[#9BE7FA]/60 transition-colors">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
              {isEn ? 'DESKTOP SCREENS' : 'MÀN HÌNH DESKTOP'}
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">20</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">{isEn ? 'Wireframe + UI design' : 'Wireframe + UI design'}</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-[#9BE7FA]/60 transition-colors">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
              {isEn ? 'MOBILE VERSIONS' : 'BẢN MOBILE'}
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">20</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">{isEn ? 'Single-column layouts' : 'Bố cục một cột'}</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-[#9BE7FA]/60 transition-colors">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block text-slate-500 dark:text-slate-400">
              {isEn ? 'COLOR PALETTE' : 'BẢNG MÀU'}
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">{isEn ? '6 tones' : '6 tông'}</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">Molasses Ink → Butter Cream</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA] border-y border-r border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 hover:border-[#9BE7FA]/60 transition-colors">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'TYPEFACES' : 'PHÔNG CHỮ'}
            </span>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Lora + Outfit</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">{isEn ? 'Headings + body text' : 'Tiêu đề + nội dung'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LibraryBusHero;
