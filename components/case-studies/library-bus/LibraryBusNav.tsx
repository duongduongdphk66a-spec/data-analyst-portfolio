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
  activeSection = 'visual-suite',
  onSelectSection,
  isExecutiveScanMode = false,
  onToggleExecutiveScanMode,
  onBack
}: LibraryBusNavProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const sections = [
    { id: 'visual-suite', label: { vi: '📊 Biểu đồ & Mô phỏng Đội xe', en: '📊 Charts & Fleet Simulator' } },
    { id: 'executive-story', label: { vi: '1. Tóm tắt Điều hành', en: '1. Executive Story' } },
    { id: 'chapter-1-ux', label: { vi: '2. Nghiên cứu Độc giả & UX', en: '2. Reader & UX Research' } },
    { id: 'chapter-3-arch', label: { vi: '3. Kiến trúc 6 Django Apps', en: '3. 6-App Django Architecture' } },
    { id: 'visual-comparison', label: { vi: '4. Đối sánh Giao diện & Luồng', en: '4. UI & Workflow Comparison' } }
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
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer mr-0.5"
            title={lang === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-sky-50 text-sky-900 border-sky-400 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/50'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              {sec.label[lang]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { LibraryBusNav };
