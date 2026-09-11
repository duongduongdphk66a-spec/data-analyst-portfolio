'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { scrollToSection, centerTabInContainer, useCaseStudyActions } from '@/app/lib/uiHelpers';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import SectionHeader from '@/components/ui/SectionHeader';

// Subcomponents
import { LibraryBusNav } from './library-bus/LibraryBusNav';
import { LibraryBusHero } from './library-bus/LibraryBusHero';
import { Chapter1UxResearch } from './library-bus/Chapter1UxResearch';
import { Chapter2BrandIdentity } from './library-bus/Chapter2BrandIdentity';
import { Chapter3GridAndWireframe } from './library-bus/Chapter3GridAndWireframe';
import { Chapter3InteractiveShowcase } from './library-bus/Chapter3InteractiveShowcase';
import { Chapter3TechnicalArchitecture } from './library-bus/Chapter3TechnicalArchitecture';

// Dynamic import for the 20-Screen Master Visual Comparison (1.9k lines)
const LibraryBusVisualComparison = dynamic(
  () => import('./LibraryBusVisualComparison'),
  {
    loading: () => (
      <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="animate-spin w-8 h-8 border-3 border-[#0D7287] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs font-bold font-mono">Đang tải bảng đối chuẩn 20 màn hình (Wireframe vs UI)...</p>
      </div>
    ),
  }
);

interface LibraryBusProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function LibraryBusProject({ onBack, isEmbedded }: LibraryBusProjectProps = {}) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';
  const { showToast, copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);

  const handleCopyDeepLink = (id: string, title = '') => {
    copyDeepLink(id, title);
  };

  // Navigation Items matching the 3 Chapters
  const navItems = useMemo(() => [
    { id: 'sec-about', label: isEn ? '1.1 About Us' : '1.1 Về chúng tôi', chapter: '01' },
    { id: 'sec-research', label: isEn ? '1.2 UX Research' : '1.2 Nghiên cứu UX', chapter: '01' },
    { id: 'sec-logo', label: isEn ? '2.1 Logo System' : '2.1 Hệ thống Logo', chapter: '02' },
    { id: 'sec-components', label: isEn ? '2.2 UI Components' : '2.2 UI Components', chapter: '02' },
    { id: 'sec-grid-wireframe', label: isEn ? '3.1 Grid & Wireframe' : '3.1 Lưới & Wireframe', chapter: '03' },
    { id: 'sec-screens', label: isEn ? '3.2 20 UI Screens & Boards' : '3.2 20 Màn hình & Bảng Wireframe/UI', chapter: '03' },
    { id: 'sec-interactive', label: isEn ? '3.3 Live Demos' : '3.3 Trình diễn tương tác', chapter: '03' },
    { id: 'sec-tech', label: isEn ? '3.4 Tech & Telemetry' : '3.4 Kỹ thuật & Telemetry', chapter: '03' },
  ], [isEn]);

  // Unified ScrollSpy
  const sectionIds = useMemo(() => navItems.map(item => item.id), [navItems]);
  const { activeSection, scrollProgress, setActiveSection } = useScrollSpy(sectionIds, 130);
  const subnavContainerRef = useRef<HTMLDivElement>(null);

  // Center active tab on taskbar horizontally only
  useEffect(() => {
    if (activeSection) {
      centerTabInContainer(subnavContainerRef.current, `nav-tab-${activeSection}`);
    }
  }, [activeSection]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSection(id);
    scrollToSection(id, 16);
  };

  useEffect(() => {
    trackVisitorAction('Xem hồ sơ thiết kế & phân tích: Tủ Sách Lưu Động (Library Bus)', 'proj-library-bus', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDFE] font-sans text-[#1A2332] selection:bg-[#9BE7FA]/60 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar & Sub-navigation bar */}
      <LibraryBusNav
        onBack={handleBack}
        isEmbedded={isEmbedded}
        isEn={isEn}
        setLanguage={setLanguage}
        navItems={navItems}
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        onNavClick={handleNavClick}
        subnavContainerRef={subnavContainerRef}
      />

      {/* Main Hero Header & Bento Telemetry */}
      <LibraryBusHero
        isEn={isEn}
        onNavClick={handleNavClick}
      />

      {/* Body Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* Chapter 01: About Us & UX Research */}
        <Chapter1UxResearch
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
        />

        {/* Chapter 02: Logo & UI Components */}
        <Chapter2BrandIdentity
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
        />

        {/* Chapter 03: Grid & Wireframe */}
        <Chapter3GridAndWireframe
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
        />

        {/* Chapter 03: 20 UI Screens & Master Boards (Lazy Loaded) */}
        <section id="sec-screens" className="space-y-6 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-screens"
            chapter="CHAPTER 03"
            subtitle={isEn ? '3.2 Master 20-Screen System (Wireframe & UI Design)' : '3.2 Hệ thống 20 màn hình Wireframe & Giao diện UI hoàn chỉnh'}
            badge="3.2"
            title={isEn ? '20-Screen Master Boards & Side-by-Side Visual Comparison' : 'Bảng Tổng Hợp 20 Màn Hình Wireframe vs Giao Diện Thật (Chuẩn Mẫu Hồ Sơ Thiết Kế)'}
            onCopy={handleCopyDeepLink}
          />
          <LibraryBusVisualComparison isEn={isEn} />
        </section>

        {/* Chapter 03: Interactive Showcase & Live Demos */}
        <Chapter3InteractiveShowcase
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
        />

        {/* Chapter 03: Technical Architecture & Telemetry */}
        <Chapter3TechnicalArchitecture
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
          onExportChart={handleExportChart}
          showToast={showToast}
        />
      </main>
    </div>
  );
}
