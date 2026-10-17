'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface HeritageJapanNavProps {
  activeSection?: string;
  onSelectSection?: (_sectionId: string) => void;
  isExecutiveScanMode?: boolean;
  onToggleExecutiveScanMode?: () => void;
  onBack?: () => void;
  isEmbedded?: boolean;
  isEn?: boolean;
  setLanguage?: (_lang: 'vi' | 'en') => void;
  navItems?: Array<{ id: string; label: string | { vi: string; en: string } }>;
  scrollProgress?: number;
  onNavClick?: (_id: string, _e: React.MouseEvent) => void;
}

export default function HeritageJapanNav({
  activeSection = 'visual-suite',
  onSelectSection,
  isExecutiveScanMode: _isExecutiveScanMode = false,
  onToggleExecutiveScanMode: _onToggleExecutiveScanMode,
  onBack
}: HeritageJapanNavProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const defaultNavItems = [
    { id: 'visual-suite', label: { vi: '📊 Biểu đồ & Mô phỏng', en: '📊 Charts & Simulator' } },
    { id: 'executive-story', label: { vi: '1. Tóm tắt Điều hành', en: '1. Executive Story' } },
    { id: 'chapter-1', label: { vi: '2. Chương 1: Hệ thống Di sản', en: '2. Ch.1: Heritage System' } },
    { id: 'chapter-2', label: { vi: '3. Chương 2: Chính sách & Luật', en: '3. Ch.2: Policy & Law' } },
    { id: 'chapter-3', label: { vi: '4. Chương 3: Kinh tế lượng', en: '4. Ch.3: Econometrics' } },
    { id: 'data-audit', label: { vi: '5. Kiểm toán Dữ liệu', en: '5. Data Audit' } }
  ];

  const handleJump = (id: string) => {
    if (onSelectSection) onSelectSection(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Heritage Japan Case Study Navigation"
      className="sticky top-3 z-30 w-full rounded-2xl border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/90 backdrop-blur-md p-3 shadow-xl"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer mr-1"
              title={lang === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}

          {defaultNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleJump(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-900 border-sky-400 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/50'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-900'
                }`}
              >
                {item.label[lang]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export { HeritageJapanNav };
