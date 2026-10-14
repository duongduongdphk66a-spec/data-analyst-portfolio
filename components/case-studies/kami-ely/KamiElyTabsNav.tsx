'use client';

import React from 'react';
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
      activeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sky-950/50'
    },
    {
      id: 'creator',
      title: { vi: '2. Phân Hệ Kênh Chính Chủ (@kamielyhn)', en: '2. Official Channel (@kamielyhn)' },
      subtitle: {
        vi: '470–475 Phiên LIVE • Nghịch lý GPM 4,5x • A/B Testing Live Ads',
        en: '470–475 LIVEs • 4.5x GPM Paradox • Live Ads A/B Testing'
      },
      badge: '49,3% GMV • 4,5x GPM',
      activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50'
    },
    {
      id: 'science',
      title: { vi: '3. Thống Kê Ứng Dụng & Mô Phỏng ROI', en: '3. Applied Statistics & ROI Simulator' },
      subtitle: {
        vi: 'Kiểm định Giả thuyết • Tương quan • What-If Optimizer',
        en: 'Hypothesis Testing • Correlation • What-If Optimizer'
      },
      badge: 'Jupyter • Simulator',
      activeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-pink-950/50'
    }
  ];

  return (
    <nav
      aria-label="Kami Ely Case Study Navigation"
      className="sticky top-3 z-30 w-full rounded-2xl border border-slate-800/90 bg-slate-950/95 backdrop-blur-md p-3 sm:p-4 shadow-xl space-y-3"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* OPTIONAL BACK BUTTON & EMBEDDED NOTICE */}
        {handleBack && !isEmbedded && (
          <button
            type="button"
            onClick={handleBack}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            title={lang === 'vi' ? 'Quay lại danh mục dự án' : 'Back to projects'}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Dự án' : 'Projects'}</span>
          </button>
        )}

        {/* 3 DEEP-DIVE TABS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1">
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
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                  isSelected
                    ? `${tab.activeClass} shadow-lg ring-1 ring-sky-400/30`
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">{tab.title[lang]}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-950/80 text-slate-300 border border-slate-800 shrink-0">
                    {tab.badge}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 line-clamp-1">{tab.subtitle[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIONS: 3-MINUTE HR EXECUTIVE SCAN TOGGLE BUTTON & PROOF GALLERY */}
        <div className="flex items-center justify-end gap-2 shrink-0 border-t xl:border-t-0 xl:border-l border-slate-800 pt-2.5 xl:pt-0 xl:pl-3">
          {toggleExec && (
            <button
              type="button"
              onClick={toggleExec}
              className={`w-full xl:w-auto px-4 py-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isExecActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/40'
                  : 'bg-slate-900 hover:bg-slate-850 text-amber-300 border-amber-500/30'
              }`}
            >
              <span>⚡</span>
              <span>
                {isExecActive
                  ? lang === 'vi'
                    ? 'Đang bật: Đọc lướt 3 phút (Bấm để xem đầy đủ)'
                    : 'Active: 3-Min HR Scan (Click for Full View)'
                  : lang === 'vi'
                  ? 'Chế độ Đọc lướt 3 phút cho HR'
                  : '3-Min Executive Scan Mode'}
              </span>
            </button>
          )}

          {onOpenProofModal && (
            <button
              type="button"
              onClick={onOpenProofModal}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 transition cursor-pointer shrink-0"
              title={lang === 'vi' ? 'Kho 36 ảnh gốc kiểm chứng FastMoss' : 'FastMoss Proof Gallery (36 Captures)'}
              aria-label="FastMoss Proof Gallery"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CHAPTER SUBNAV PILLS (Visible in full explorer mode when currentNavItems are available) */}
      {!isExecActive && currentNavItems && currentNavItems.length > 0 && handleNavClick && (
        <div
          ref={subnavContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-2.5 text-xs"
        >
          {currentNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleNavClick(item.id, e)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
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
  );
}
