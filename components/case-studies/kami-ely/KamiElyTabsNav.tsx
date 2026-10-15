'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { ArrowLeft, Camera } from 'lucide-react';

export type KamiElyTabKey = 'shop' | 'creator' | 'science';

export interface NavItemDef {
  id: string;
  label: string;
  badge: string;
  dividerBefore?: boolean;
}

export interface KamiElyTabsNavProps {
  activeTab?: KamiElyTabKey;
  onTabChange?: (_tab: KamiElyTabKey) => void;
  setActiveTab?: (_tab: KamiElyTabKey) => void;
  handleTabChange?: (_tab: KamiElyTabKey) => void;
  handleBack?: () => void;
  isEmbedded?: boolean;
  isEn?: boolean;
  onOpenProofModal?: () => void;
  currentNavItems?: NavItemDef[];
  activeSection?: string;
  scrollProgress?: number;
  subnavContainerRef?: React.RefObject<HTMLDivElement | null>;
  handleNavClick?: (_id: string, _e: React.MouseEvent) => void;
  isExecutiveMode?: boolean;
  onToggleExecutiveMode?: () => void;
  isExecutiveScanMode?: boolean;
  onToggleExecutiveScanMode?: () => void;
}

export default function KamiElyTabsNav({
  activeTab = 'shop',
  onTabChange,
  setActiveTab,
  handleTabChange,
  handleBack,
  isEmbedded,
  isEn: propIsEn,
  onOpenProofModal,
  currentNavItems,
  activeSection,
  scrollProgress: _scrollProgress = 0,
  subnavContainerRef,
  handleNavClick,
  isExecutiveMode = false,
  onToggleExecutiveMode,
  isExecutiveScanMode,
  onToggleExecutiveScanMode
}: KamiElyTabsNavProps) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  // Combined executive scan mode check
  const isExecActive = isExecutiveScanMode !== undefined ? isExecutiveScanMode : isExecutiveMode;
  const toggleExec = onToggleExecutiveScanMode || onToggleExecutiveMode;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        // Since sticky top is top-2 (8px), when the wrapper's top passes 16px, it is stuck!
        setIsScrolledPast(rect.top <= 16);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectTab = (tab: KamiElyTabKey) => {
    if (onTabChange) onTabChange(tab);
    if (handleTabChange) handleTabChange(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const mainTabs: {
    id: KamiElyTabKey;
    title: { vi: string; en: string };
    subtitle: { vi: string; en: string };
    badge: string;
    activeClass: string;
  }[] = [
    {
      id: 'shop',
      title: { vi: '1. Phân Hệ Toàn Gian Hàng (Shop-Wide)', en: '1. Shop-Wide Analytics' },
      subtitle: {
        vi: 'Chu kỳ 180d (12,74 Tỉ) • Kệ hàng (1,17M views) • 5.712 KOCs',
        en: '180d Cycle (12.74B) • Product Cards (1.17M views) • 5,712 KOCs'
      },
      badge: '12,74 Tỉ • 85,5k SP',
      activeClass: 'bg-sky-50 text-sky-950 border-sky-400 ring-1 ring-sky-300 shadow-sm dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/50 dark:shadow-sky-950/50'
    },
    {
      id: 'creator',
      title: { vi: '2. Phân Hệ Kênh Chính Chủ (@kamielyhn)', en: '2. Official Channel (@kamielyhn)' },
      subtitle: {
        vi: '470–475 Phiên LIVE • Nghịch lý GPM 4,5x • A/B Testing Live Ads',
        en: '470–475 LIVEs • 4.5x GPM Paradox • Live Ads A/B Testing'
      },
      badge: '49,3% GMV • 4,5x GPM',
      activeClass: 'bg-emerald-50 text-emerald-950 border-emerald-400 ring-1 ring-emerald-300 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/50 dark:shadow-emerald-950/50'
    },
    {
      id: 'science',
      title: { vi: '3. Thống Kê Ứng Dụng & Mô Phỏng ROI', en: '3. Applied Statistics & ROI Simulator' },
      subtitle: {
        vi: 'Kiểm định Giả thuyết • Tương quan • What-If Optimizer',
        en: 'Hypothesis Testing • Correlation • What-If Optimizer'
      },
      badge: 'Jupyter • Simulator',
      activeClass: 'bg-pink-50 text-pink-950 border-pink-400 ring-1 ring-pink-300 shadow-sm dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/50 dark:shadow-pink-950/50'
    }
  ];

  return (
    <div ref={wrapperRef} className="w-full">
      <nav
        aria-label="Kami Ely Case Study Navigation"
        className={`sticky top-2 z-30 w-full border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300 ease-out ${
          isScrolledPast
            ? 'p-2 sm:p-2.5 rounded-2xl shadow-md space-y-1.5'
            : 'p-3 sm:p-4 rounded-3xl shadow-lg space-y-3'
        }`}
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
          {/* OPTIONAL BACK BUTTON & EMBEDDED NOTICE */}
          {handleBack && !isEmbedded && (
            <button
              type="button"
              onClick={handleBack}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-950 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white transition cursor-pointer shrink-0 ${
                isScrolledPast ? 'px-2.5 py-1.5' : 'px-3 py-2.5'
              }`}
              title={lang === 'vi' ? 'Quay lại danh mục dự án' : 'Back to projects'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Dự án' : 'Projects'}</span>
            </button>
          )}

          {/* 3 DEEP-DIVE TABS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
            {mainTabs.map((tab) => {
              const isSelected = activeTab === tab.id && !isExecActive;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (isExecActive && toggleExec) {
                      toggleExec();
                    }
                    handleSelectTab(tab.id);
                  }}
                  title={tab.subtitle[lang]}
                  className={`border text-left transition-all cursor-pointer ${
                    isScrolledPast
                      ? `px-3 py-1.5 sm:py-2 rounded-xl flex items-center justify-between gap-2 ${
                          isSelected
                            ? `${tab.activeClass} shadow-xs`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                        }`
                      : `p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between space-y-1.5 ${
                          isSelected
                            ? `${tab.activeClass} shadow-md`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                        }`
                  }`}
                >
                  {isScrolledPast ? (
                    <>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {tab.title[lang]}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white text-slate-700 border border-slate-200 dark:bg-slate-950/80 dark:text-slate-300 dark:border-slate-800 shrink-0">
                        {tab.badge}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {tab.title[lang]}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                          {tab.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-sans line-clamp-1">
                        {tab.subtitle[lang]}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAPTER SUBNAV PILLS (Visible in full explorer mode when currentNavItems are available) */}
        {!isExecActive && currentNavItems && currentNavItems.length > 0 && handleNavClick && (
          <div
            ref={subnavContainerRef}
            className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-200 dark:border-slate-800/80 transition-all ${
              isScrolledPast ? 'pt-1.5 pb-0.5 text-xs' : 'pt-2.5 pb-1 text-xs'
            }`}
          >
            {currentNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isScrolledPast ? 'px-2.5 py-0.5 rounded-md text-[11px]' : 'px-3 py-1 rounded-lg text-xs'
                  } ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-xs dark:bg-sky-500 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white font-bold dark:bg-slate-950/20 dark:text-slate-950' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
