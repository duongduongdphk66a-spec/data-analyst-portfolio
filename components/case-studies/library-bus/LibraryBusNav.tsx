'use client';

import React from 'react';
import { ArrowLeft, Bus, ExternalLink, Code, FileText } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusNavItem {
  id: string;
  label: string;
  chapter: string;
}

interface LibraryBusNavProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  setLanguage: (_lang: 'vi' | 'en') => void;
  navItems: LibraryBusNavItem[];
  activeSection: string;
  scrollProgress: number;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
  subnavContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function LibraryBusNav({
  onBack,
  isEmbedded,
  isEn,
  setLanguage,
  navItems,
  activeSection,
  scrollProgress,
  onNavClick,
  subnavContainerRef,
}: LibraryBusNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-xs sm:text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white shrink-0"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
          <span className="hidden sm:inline">{t('nav_back_to_portfolio', 'Quay lß║íi Portfolio')}</span>
          <span className="sm:hidden">{isEn ? 'Back' : 'Quay lß║íi'}</span>
        </button>

        {/* Project Identity Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#C8EEF7]/40 border border-[#9BE7FA]/60 text-xs font-black text-[#0D7287] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA] shrink-0">
          <Bus className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span className="hidden md:inline">Tß╗º S├ích L╞░u ─Éß╗Öng ┬╖ Website Guidelines & Architecture</span>
          <span className="md:hidden">Library Bus Guidelines</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download/View HTML Spec */}
          <a
            href="/library-bus/website.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            title={isEn ? 'View Interactive 20-Screen Spec (HTML)' : 'Xem t├ái liß╗çu ─æß║╖c tß║ú 20 m├án h├¼nh (HTML)'}
          >
            <FileText className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span className="hidden sm:inline">HTML Spec (20 Screens)</span>
          </a>

          {/* GitHub Repo */}
          <a
            href="https://github.com/duongduongdphk66a-spec/prj"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
            title={isEn ? 'View GitHub Repository' : 'Xem m├ú nguß╗ôn tr├¬n GitHub'}
          >
            <Code className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span className="hidden sm:inline font-mono">GitHub</span>
          </a>

          {/* Open Standalone Page if Embedded */}
          {isEmbedded && (
            <a
              href="/projects/proj-library-bus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'Open standalone page in new tab' : 'Mß╗ƒ to├án trang trong tab mß╗¢i'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(isEn ? 'vi' : 'en')}
            className="px-2.5 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#0D7287]"
            title={isEn ? 'Chuyß╗ân sang Tiß║┐ng Viß╗çt' : 'Switch to English'}
          >
            <span>{isEn ? '≡ƒç¼≡ƒçº EN' : '≡ƒç╗≡ƒç│ VI'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar with Dynamic ScrollSpy Active Effect */}
      <div 
        ref={subnavContainerRef}
        className="bg-[#F0F9FB]/95 backdrop-blur-md border-t border-[#D2EDF6] py-2 px-4 overflow-x-auto dark:bg-slate-900/90 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            <span className="text-[11px] font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] mr-1 shrink-0 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] animate-ping" />
              {isEn ? 'Chapters:' : 'Ch╞░╞íng mß╗Ñc:'}
            </span>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  type="button"
                  onClick={(e) => onNavClick(item.id, e)}
                  className={`group relative px-3 py-1.5 rounded-xl transition-all duration-200 ease-out cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${
                    isActive
                      ? 'bg-[#9BE7FA] text-slate-950 font-black shadow-sm border-2 border-[#0D7287] scale-105 dark:bg-[#0D7287] dark:text-white dark:border-[#9BE7FA]'
                      : 'hover:bg-white hover:text-slate-950 text-slate-600 font-semibold border-2 border-transparent dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80'
                  }`}
                >
                  {isActive && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D7287] opacity-75 dark:bg-[#9BE7FA]" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    </span>
                  )}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reading progress tracker */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
            <span>{Math.round(scrollProgress)}%</span>
            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full transition-all duration-150 bg-[#0D7287] dark:bg-[#9BE7FA]" 
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic reading progress line */}
      <div className="h-0.5 w-full bg-slate-200/80 overflow-hidden dark:bg-slate-800">
        <div 
          className="h-full transition-all duration-150 ease-out bg-gradient-to-r from-[#0D7287] via-[#9BE7FA] to-[#FFD14C]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}
