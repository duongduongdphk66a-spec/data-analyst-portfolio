'use client';

import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, List, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

interface HeritageJapanNavProps {
  onBack: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  setLanguage: (_lang: 'vi' | 'en') => void;
  navItems: Array<{ id: string; label: string }>;
  activeSection: string;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
}

export function HeritageJapanNav({
  onBack,
  isEmbedded,
  isEn,
  setLanguage,
  navItems,
  activeSection,
  onNavClick,
}: HeritageJapanNavProps) {
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
        
        {/* Table of Contents Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-[#9BE7FA] transition-all cursor-pointer"
            aria-expanded={isTocOpen}
          >
            <List className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
            <span className="font-extrabold">{isEn ? 'Chapters:' : 'Mục lục:'}</span>
            <span className="max-w-[130px] sm:max-w-[200px] truncate text-[#074553] dark:text-[#9BE7FA] font-black">
              {activeItem?.label || (isEn ? 'Select chapter' : 'Chọn mục')}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTocOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTocOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsTocOpen(false)} 
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1.5 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>{isEn ? 'Heritage Tourism Chapters' : 'Các Chương Du Lịch Di Sản'}</span>
                  <span className="font-mono text-[9px]">{navItems.length} {isEn ? 'chapters' : 'chương'}</span>
                </div>
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
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
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEmbedded && (
            <a
              href="/projects/proj-heritage-japan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'Open full page in new tab' : 'Mở toàn trang trong tab mới'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => setLanguage(isEn ? 'vi' : 'en')}
            className="px-3 py-1.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700"
            title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
          >
            <span>{isEn ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
