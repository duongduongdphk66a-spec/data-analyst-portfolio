'use client';

import React from 'react';
import { ArrowLeft, Github } from 'lucide-react';
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
      className="sticky top-3 z-30 w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 backdrop-blur-md p-3 shadow-xl"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer mr-1"
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
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                {sec.label[lang]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-end xl:self-auto">
          <a
            href="https://github.com/duongduongdphk66a-spec/prj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title={lang === 'en' ? 'View Django Codebase on GitHub' : 'Xem mã nguồn Django trên GitHub'}
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Django GitHub</span>
          </a>

          {onToggleExecutiveScanMode && (
            <button
              type="button"
              onClick={onToggleExecutiveScanMode}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                isExecutiveScanMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
              }`}
            >
              <span>⚡</span>
              <span>
                {isExecutiveScanMode
                  ? lang === 'vi'
                    ? 'Đang bật: Đọc lướt 3 phút (Bấm xem toàn bộ Hệ thống)'
                    : 'Active: 3-Min HR Scan (Click for Full Case Study)'
                  : lang === 'vi'
                  ? 'Chế độ Đọc lướt 3 phút cho HR'
                  : '3-Min HR Executive Scan'}
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export { LibraryBusNav };
