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
  isExecutiveScanMode: _isExecutiveScanMode = false,
  onToggleExecutiveScanMode: _onToggleExecutiveScanMode,
  onBack
}: LibraryBusNavProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const sections = [
    { id: 'chapter-1-ux', label: { vi: '01. Giới thiệu & Nghiên cứu', en: '01. Introduction & Research' } },
    { id: 'chapter-2-brand', label: { vi: '02. Logo & Thành phần UI', en: '02. Logo & UI Components' } },
    { id: 'chapter-3-design', label: { vi: '03. Thiết kế Website', en: '03. Website Design' } },
    { id: 'visual-comparison', label: { vi: '3.3 Wireframe & UI 20 màn hình', en: '3.3 Wireframe & UI: 20 Screens' } }
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
      className="sticky top-3 z-30 w-full rounded-2xl border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/90 backdrop-blur-md p-1.5 sm:p-2 shadow-lg"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center gap-2 shrink-0 cursor-pointer mr-1 min-h-[40px]"
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border cursor-pointer shrink-0 min-h-[40px] flex items-center ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 border-sky-400 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/50 shadow-xs'
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
