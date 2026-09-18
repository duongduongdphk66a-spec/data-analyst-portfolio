'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Store,
  UserCheck,
  ExternalLink,
  List,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface NavItemDef {
  id: string;
  label: string;
  badge: string;
  dividerBefore?: boolean;
}

interface KamiElyTabsNavProps {
  activeTab: 'science' | 'shop' | 'creator';
  handleTabChange: (_tab: 'science' | 'shop' | 'creator') => void;
  handleBack: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  onOpenProofModal: () => void;
  currentNavItems: NavItemDef[];
  activeSection: string;
  scrollProgress: number;
  subnavContainerRef: React.RefObject<HTMLDivElement | null>;
  handleNavClick: (_id: string, _e: React.MouseEvent) => void;
}

export default function KamiElyTabsNav({
  activeTab,
  handleTabChange,
  handleBack,
  isEmbedded,
  isEn,
  onOpenProofModal: _onOpenProofModal,
  currentNavItems,
  activeSection,
  scrollProgress,
  subnavContainerRef,
  handleNavClick
}: KamiElyTabsNavProps) {
  const { setLanguage, t } = useLanguage();
  const [isTocOpen, setIsTocOpen] = useState(false);

  const activeItem = currentNavItems.find((item) => item.id === activeSection) || currentNavItems[0];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFDFE]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all dark:bg-[#0B0F17]/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        <button 
          onClick={handleBack}
          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-950 transition-colors font-bold text-xs sm:text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white shrink-0"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#074553] dark:text-[#9BE7FA]" />
          <span className="hidden md:inline">{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          <span className="md:hidden">{isEn ? 'Back' : 'Lại'}</span>
        </button>

        {/* Major Triple Tab Selector - Optimized for mobile affordance */}
        <div className="flex bg-[#C8EEF7]/30 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-[#9BE7FA]/60 dark:bg-slate-800 dark:border-slate-700 shrink-0">
          <button
            onClick={() => handleTabChange('science')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'science'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-md border border-[#9BE7FA] font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-slate-950 dark:text-slate-900 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Data Science' : 'Khoa Học Dữ Liệu'}</span>
            <span className="sm:hidden">{isEn ? 'Science' : 'Khoa Học'}</span>
          </button>
          <button
            onClick={() => handleTabChange('shop')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-md border border-[#9BE7FA] dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Store className="w-3 h-3 sm:w-4 sm:h-4 text-[#074553] dark:text-[#9BE7FA] shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Shop BI' : 'Toàn Shop'}</span>
            <span className="sm:hidden">{isEn ? 'Shop' : 'Shop'}</span>
          </button>
          <button
            onClick={() => handleTabChange('creator')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-md font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#074553] dark:text-slate-900 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Creator' : 'Creator KOC'}</span>
            <span className="sm:hidden">{isEn ? 'Creator' : 'KOC'}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Open Standalone Page if Embedded */}
          {isEmbedded && (
            <a
              href="/projects/proj-kami-ely"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          )}

          {/* Quick Language Toggle */}
          <button
            onClick={() => setLanguage(isEn ? 'vi' : 'en')}
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-[11px] sm:text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-[#FFD14C] dark:text-slate-950 dark:hover:bg-[#FFE485]"
            title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
          >
            <span>{isEn ? '🇬🇧' : '🇻🇳'}</span>
            <span className="hidden xs:inline">{isEn ? 'EN' : 'VI'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar: Compact Table of Contents Dropdown */}
      <div 
        ref={subnavContainerRef}
        className="bg-slate-50/90 backdrop-blur-md border-t border-slate-200/80 py-1 px-3 sm:px-4 dark:bg-[#0B0F17]/90 dark:border-slate-800/80"
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
              <List className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className="font-extrabold">{isEn ? 'TOC:' : 'Mục lục:'}</span>
              <span className="max-w-[160px] sm:max-w-[240px] truncate text-[#0D7287] dark:text-[#9BE7FA] font-black">
                {activeItem?.label || (isEn ? 'Select chapter' : 'Chọn mục')}
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
                    <span>
                      {activeTab === 'science' 
                        ? (isEn ? 'Data Science Chapters' : 'Các Mục Khoa Học Dữ Liệu') 
                        : activeTab === 'shop' 
                          ? (isEn ? 'Shop Chapters' : 'Các Mục Toàn Shop') 
                          : (isEn ? 'Creator Chapters' : 'Các Mục Creator')}
                    </span>
                    <span className="font-mono text-[9px]">{currentNavItems.length} {isEn ? 'sections' : 'mục'}</span>
                  </div>
                  {currentNavItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-tab-${item.id}`}
                        type="button"
                        onClick={(e) => {
                          handleNavClick(item.id, e);
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
                          <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Reading progress metric */}
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

      {/* Dynamic reading progress line on taskbar */}
      <div className="h-0.5 w-full bg-[#9BE7FA]/20 overflow-hidden dark:bg-slate-800">
        <div 
          className="h-full transition-all duration-150 ease-out bg-gradient-to-r from-[#0D7287] to-[#9BE7FA]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}
