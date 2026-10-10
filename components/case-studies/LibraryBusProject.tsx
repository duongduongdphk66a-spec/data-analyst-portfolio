'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { scrollToSection, centerTabInContainer, useCaseStudyActions } from '@/app/lib/uiHelpers';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import ExecutiveSummary from './ExecutiveSummary';
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
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      const mainContainer = document.querySelector('main.overflow-y-auto') || document.querySelector('main');
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-ground font-sans text-slate-900 selection:bg-[#9BE7FA]/60 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
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

      {/* Executive Summary - 60-second overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <ExecutiveSummary
          isEn={isEn}
          readingTime={isEn ? '~3 min deep dive' : '~3 phút đọc chi tiết'}
          problem={isEn
            ? 'Distributed library system faces inventory desynchronization, transaction conflicts during concurrent reservations, and high query latency.'
            : 'Hệ thống phân tán gặp lỗi không đồng bộ tồn kho, xung đột giao dịch khi đặt sách và độ trễ truy vấn cao.'}
          method={isEn
            ? 'Design 3NF ERD with ACID constraints, implement Redis distributed cache, and deploy Celery workers for CPU-intensive operations.'
            : 'Thiết kế ERD 3NF chuẩn ACID, áp dụng Redis Cache và Celery Background Worker giảm tải CPU.'}
          insight={isEn
            ? 'Reduced query latency by 93.7%, sustained 500 concurrent connections, and eliminated 100% of reservation conflicts.'
            : 'Giảm 93.7% độ trễ, chịu tải ổn định 500 kết nối và loại bỏ hoàn toàn xung đột dữ liệu.'}
          metrics={[
            { label: isEn ? 'Users Served' : 'Quy Mô Người Dùng Phục Vụ', value: '50,000+', change: 'Active Accounts', isPositive: true },
            { label: isEn ? 'Query Response Latency' : 'Độ Trễ Phản Hồi Truy Vấn', value: '28ms', change: '-93.7% Latency', isPositive: true },
            { label: isEn ? 'Concurrent Connections' : 'Kết Nối Đồng Thời', value: '500 RPS', change: 'Zero Downtime', isPositive: true },
            { label: isEn ? 'Data Conflict Rate' : 'Tỷ Lệ Xung Đột Dữ Liệu', value: '0.0%', change: 'ACID Enforced', isPositive: true },
          ]}
          tools={['MySQL', 'Django ORM', 'Redis', 'Celery', 'Docker Architecture']}
        />
      </div>

      {/* Body Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 space-y-20">
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
