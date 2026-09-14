'use client';

import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Store,
  UserCheck,
  ImageIcon,
  ExternalLink
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
  handleTabChange: (tab: 'science' | 'shop' | 'creator') => void;
  handleBack: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  onOpenProofModal: () => void;
  currentNavItems: NavItemDef[];
  activeSection: string;
  scrollProgress: number;
  subnavContainerRef: React.RefObject<HTMLDivElement | null>;
  handleNavClick: (id: string, e: React.MouseEvent) => void;
}

export default function KamiElyTabsNav({
  activeTab,
  handleTabChange,
  handleBack,
  isEmbedded,
  isEn,
  onOpenProofModal,
  currentNavItems,
  activeSection,
  scrollProgress,
  subnavContainerRef,
  handleNavClick
}: KamiElyTabsNavProps) {
  const { setLanguage, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFDFE]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all dark:bg-[#0B0F17]/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-xs sm:text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white shrink-0"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#074553] dark:text-[#9BE7FA]" />
          <span className="hidden sm:inline">{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          <span className="sm:hidden">{isEn ? 'Back' : 'Quay lại'}</span>
        </button>

        {/* Major Triple Tab Selector */}
        <div className="flex bg-[#C8EEF7]/30 p-1 rounded-2xl border border-[#9BE7FA]/60 dark:bg-slate-800 dark:border-slate-700 shrink-0">
          <button
            onClick={() => handleTabChange('science')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'science'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-md border border-[#9BE7FA] font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 dark:text-slate-900" />
            <span>{isEn ? 'Data Science' : 'Khoa Học Dữ Liệu'}</span>
          </button>
          <button
            onClick={() => handleTabChange('shop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-md border border-[#9BE7FA] dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#074553] dark:text-[#9BE7FA]" />
            <span>{isEn ? 'Shop BI' : 'Toàn Shop'}</span>
          </button>
          <button
            onClick={() => handleTabChange('creator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-md font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#074553] dark:text-slate-900" />
            <span>{isEn ? 'Creator' : 'Creator KOC'}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">

          {/* Open Standalone Page if Embedded */}
          {isEmbedded && (
            <a
              href="/projects/proj-kami-ely"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Quick Language Toggle */}
          <button
            onClick={() => setLanguage(isEn ? 'vi' : 'en')}
            className="px-2.5 py-1.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-[#FFD14C] dark:text-slate-950 dark:hover:bg-[#FFE485]"
            title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
          >
            <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar with Dynamic ScrollSpy Active Effect */}
      <div 
        ref={subnavContainerRef}
        className="bg-[#C8EEF7]/25 backdrop-blur-md border-t border-[#9BE7FA]/40 py-2 px-4 overflow-x-auto dark:bg-[#0B0F17]/90 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            <span className="text-[11px] font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] mr-1 shrink-0 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] animate-ping" />
              {activeTab === 'science' 
                ? (isEn ? 'Data Science Sections:' : 'Mục Khoa Học Dữ Liệu:') 
                : activeTab === 'shop' 
                  ? (isEn ? 'Shop Sections:' : 'Mục Shop:') 
                  : (isEn ? 'Creator Sections:' : 'Mục Creator:')
              }
            </span>
            {currentNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <React.Fragment key={item.id}>
                  {item.dividerBefore && (
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0 mx-1 self-center" />
                  )}
                  <button
                    id={`nav-tab-${item.id}`}
                    type="button"
                    onClick={(e) => handleNavClick(item.id, e)}
                    className={`group relative px-3.5 py-1.5 rounded-xl transition-all duration-200 ease-out cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${
                      isActive
                        ? 'bg-[#9BE7FA] text-slate-950 font-black shadow-xs dark:bg-[#9BE7FA] dark:text-slate-950'
                        : 'hover:bg-white/80 hover:text-slate-950 text-slate-600 font-semibold dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {isActive && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#074553] opacity-75 dark:bg-[#0B0F17]" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#074553] dark:bg-[#0B0F17]" />
                      </span>
                    )}
                    <span>
                      {item.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Reading progress metric on wide screen */}
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
