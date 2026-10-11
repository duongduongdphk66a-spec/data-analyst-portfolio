'use client';

import React from 'react';
import { Sparkles, Store, UserCheck } from 'lucide-react';
import CaseStudyNav from '../shared/CaseStudyNav';

export interface NavItemDef {
  id: string;
  label: string;
  badge: string;
  dividerBefore?: boolean;
}

type KamiTab = 'science' | 'shop' | 'creator';

interface KamiElyTabsNavProps {
  activeTab: KamiTab;
  handleTabChange: (_tab: KamiTab) => void;
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

/** Kami Ely navbar = shared CaseStudyNav + the Science / Shop / Creator tab switch in the center slot. */
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
  handleNavClick,
}: KamiElyTabsNavProps) {
  const tabs: Array<{ id: KamiTab; icon: typeof Sparkles; label: string; short: string }> = [
    { id: 'science', icon: Sparkles, label: isEn ? 'Data Science' : 'Khoa Học Dữ Liệu', short: isEn ? 'Science' : 'Khoa học' },
    { id: 'shop', icon: Store, label: isEn ? 'Shop BI' : 'Toàn Shop', short: 'Shop' },
    { id: 'creator', icon: UserCheck, label: isEn ? 'Creator' : 'Creator KOC', short: isEn ? 'Creator' : 'KOC' },
  ];

  const tocTitle =
    activeTab === 'science'
      ? isEn ? 'Data Science Chapters' : 'Các mục Khoa học Dữ liệu'
      : activeTab === 'shop'
        ? isEn ? 'Shop Chapters' : 'Các mục Toàn Shop'
        : isEn ? 'Creator Chapters' : 'Các mục Creator';

  const tabSwitch = (
    <div
      role="tablist"
      aria-label={isEn ? 'Case study views' : 'Góc nhìn phân tích'}
      className="inline-flex items-center p-0.5 rounded-xl border border-brand-blue-light bg-white dark:bg-slate-900 dark:border-slate-700"
    >
      {tabs.map(({ id, icon: Icon, label, short }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabChange(id)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              isActive
                ? 'bg-brand-teal text-white dark:text-slate-950'
                : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{short}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <CaseStudyNav
      isEn={isEn}
      projectTitle="Kami Ely TikTok Shop"
      onBack={handleBack}
      isEmbedded={isEmbedded}
      standaloneHref="/projects/proj-kami-ely"
      centerSlot={tabSwitch}
      navItems={currentNavItems}
      activeSection={activeSection}
      scrollProgress={scrollProgress}
      onNavClick={handleNavClick}
      tocTitle={tocTitle}
      subnavContainerRef={subnavContainerRef}
    />
  );
}
