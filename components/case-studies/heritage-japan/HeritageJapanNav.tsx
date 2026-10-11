'use client';

import React from 'react';
import CaseStudyNav from '../shared/CaseStudyNav';

interface HeritageJapanNavProps {
  onBack: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  /** Kept for backward compatibility; the shared LanguageToggle reads the context directly. */
  setLanguage?: (_lang: 'vi' | 'en') => void;
  navItems: Array<{ id: string; label: string }>;
  activeSection: string;
  scrollProgress?: number;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
}

/** Heritage Japan navbar = shared CaseStudyNav (now with the same reading-progress bar as the other case studies). */
export function HeritageJapanNav({
  onBack,
  isEmbedded,
  isEn,
  navItems,
  activeSection,
  scrollProgress = 0,
  onNavClick,
}: HeritageJapanNavProps) {
  return (
    <CaseStudyNav
      isEn={isEn}
      projectTitle={isEn ? 'Japan Heritage Tourism' : 'Du lịch Di sản Nhật Bản'}
      onBack={onBack}
      isEmbedded={isEmbedded}
      standaloneHref="/projects/proj-heritage-japan"
      navItems={navItems}
      activeSection={activeSection}
      scrollProgress={scrollProgress}
      onNavClick={onNavClick}
      tocTitle={isEn ? 'Heritage Tourism Chapters' : 'Các chương Du lịch Di sản'}
    />
  );
}
