'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusNavProps {
  activeSection?: string;
  onSelectSection?: (_sectionId: string) => void;
  isExecutiveScanMode?: boolean;
  onToggleExecutiveScanMode?: () => void;
  onBack?: () => void;
  isEmbedded?: boolean;
  isEn?: boolean;
  setLanguage?: (_lang: 'vi' | 'en') => void;
  navItems?: Array<{ id: string; label: string | { vi: string; en: string }; chapter?: string }>;
  scrollProgress?: number;
  onNavClick?: (_id: string, _e: React.MouseEvent) => void;
  subnavContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function LibraryBusNav({
  activeSection = 'chapter-1-ux',
  onSelectSection,
  onBack,
}: LibraryBusNavProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const sections = [
    {
      id: 'chapter-1-ux',
      label: {
        vi: '01. Nghiệp vụ BA & Quy tắc BR-01..04',
        en: '01. BA Rules (BR-01..04) & Flows',
      },
    },
    {
      id: 'chapter-4-backend',
      label: {
        vi: '02. Kiến trúc MySQL/Redis & Telemetry',
        en: '02. MySQL/Redis Architecture & Telemetry',
      },
    },
    {
      id: 'visual-comparison',
      label: {
        vi: '03. Master–Detail 11 Màn hình (Wireframe & UI)',
        en: '03. Master–Detail 11 Screens (Wireframe & UI)',
      },
    },
    {
      id: 'chapter-2-brand',
      label: {
        vi: '04. Hệ thống Thiết kế (Accordion)',
        en: '04. Design System (Accordion)',
      },
    },
  ];

  const handleScrollTo = (id: string) => {
    if (onSelectSection) onSelectSection(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Library Bus Case Study Navigation"
      className="sticky top-3 z-30 w-full rounded-2xl border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/90 backdrop-blur-md p-1.5 sm:p-2"
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-0.5">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center gap-2 shrink-0 cursor-pointer min-h-[44px]"
              title={lang === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}

          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleScrollTo(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border cursor-pointer shrink-0 min-h-[44px] flex items-center ${
                  isActive
                    ? 'bg-[#9BE7FA] text-slate-950 border-[#9BE7FA]'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-900'
                }`}
              >
                {sec.label[lang]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export { LibraryBusNav };
