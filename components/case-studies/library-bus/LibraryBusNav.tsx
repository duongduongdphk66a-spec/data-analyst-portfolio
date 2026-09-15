'use client';

import React, { useState } from 'react';
import { ArrowLeft, Bus, ExternalLink, Code, List, ChevronDown } from 'lucide-react';
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
  const [isTocOpen, setIsTocOpen] = useState(false);

  const activeItem = navItems.find((item) => item.id === activeSection) || navItems[0];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFDFE]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs dark:bg-[#0B0F17]/95 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-xs sm:text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white shrink-0"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#074553] dark:text-[#9BE7FA]" />
          <span className="hidden sm:inline">{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          <span className="sm:hidden">{isEn ? 'Back' : 'Quay lại'}</span>
        </button>

        {/* Project Identity Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#C8EEF7]/40 border border-[#9BE7FA]/60 text-xs font-black text-[#074553] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA] shrink-0">
          <Bus className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA]" />
          <span className="hidden md:inline">Tủ Sách Lưu Động · Website Guidelines & Architecture</span>
          <span className="md:hidden">Library Bus Guidelines</span>
        </div>

        <div className="flex items-center gap-2">
          {/* GitHub Repo */}
          <a
            href="https://github.com/duongduongdphk66a-spec/prj"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
            title={isEn ? 'View GitHub Repository' : 'Xem mã nguồn trên GitHub'}
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
              title={isEn ? 'Open standalone page in new tab' : 'Mở toàn trang trong tab mới'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(isEn ? 'vi' : 'en')}
            className="px-2.5 py-1.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-[#FFD14C] dark:text-slate-950"
            title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
          >
            <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar: Compact Table of Contents Dropdown */}
      <div 
        ref={subnavContainerRef}
        className="bg-slate-50/90 backdrop-blur-md border-t border-slate-200/80 py-1.5 px-4 dark:bg-[#0B0F17]/90 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Table of Contents Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-[#9BE7FA] transition-all cursor-pointer"
              aria-expanded={isTocOpen}
            >
              <List className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
              <span className="font-extrabold">{isEn ? 'Chapters:' : 'Mục lục:'}</span>
              <span className="max-w-[160px] sm:max-w-[240px] truncate text-[#074553] dark:text-[#9BE7FA] font-black">
                {activeItem?.label || (isEn ? 'Select chapter' : 'Chọn chương')}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTocOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isTocOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsTocOpen(false)} 
                />
                <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>{isEn ? 'Library Bus Architecture Chapters' : 'Các Chương Kiến Trúc Thư Viện'}</span>
                    <span className="font-mono text-[9px]">{navItems.length} {isEn ? 'chapters' : 'chương'}</span>
                  </div>
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-tab-${item.id}`}
                        type="button"
                        onClick={(e) => {
                          onNavClick(item.id, e);
                          setIsTocOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/15 text-[#074553] dark:text-[#9BE7FA] font-black'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#074553] dark:bg-[#9BE7FA] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Reading progress tracker */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
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
