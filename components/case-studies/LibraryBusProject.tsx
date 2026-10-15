'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { scrollToSection, useCaseStudyActions } from '@/app/lib/uiHelpers';
import { useCaseStudyData } from '@/hooks/useCaseStudyData';
import type { LibraryBusDataPayload } from '@/app/types/caseStudies';

import LibraryBusHero from './library-bus/LibraryBusHero';
import LibraryBusNav from './library-bus/LibraryBusNav';
import LibraryBusVisualSuite from './library-bus/LibraryBusVisualSuite';
import LibraryBusExecutiveStory from './library-bus/LibraryBusExecutiveStory';
import Chapter1UxResearch from './library-bus/Chapter1UxResearch';
import Chapter2BrandIdentity from './library-bus/Chapter2BrandIdentity';
import Chapter3GridAndWireframe from './library-bus/Chapter3GridAndWireframe';
import Chapter3InteractiveShowcase from './library-bus/Chapter3InteractiveShowcase';
import Chapter3TechnicalArchitecture from './library-bus/Chapter3TechnicalArchitecture';
import CaseStudyFooter from './shared/CaseStudyFooter';

// Dynamic import for the 20-Screen Master Visual Comparison (1.5k lines)
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
  initialData?: LibraryBusDataPayload;
}

export default function LibraryBusProject({ 
  onBack, 
  isEmbedded: _isEmbedded, 
  initialData 
}: LibraryBusProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const { showToast, copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);
  const handleCopyDeepLink = (id: string, title = '') => {
    copyDeepLink(id, title);
  };

  const [activeSection, setActiveSection] = useState<string>('visual-suite');
  const [isExecutiveScanMode, setIsExecutiveScanMode] = useState<boolean>(false);

  const { data: busData } = useCaseStudyData<LibraryBusDataPayload>({
    projectId: 'proj-library-bus',
    endpoint: '/api/case-studies/library-bus',
    initialData,
  });

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Tủ Sách Lưu Động Library Bus (Ma Văn Hùng)', 'proj-library-bus', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 min-h-screen bg-ground font-sans text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <LibraryBusHero
        isEn={isEn}
        onNavClick={(id) => scrollToSection(id, 16)}
      />

      {/* 2. STICKY NAVIGATION + 3-MINUTE HR SCAN TOGGLE */}
      <LibraryBusNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        isExecutiveScanMode={isExecutiveScanMode}
        onToggleExecutiveScanMode={() => setIsExecutiveScanMode((prev) => !prev)}
        onBack={handleBack}
      />

      {/* 3. VISUAL CHARTS, FLEET SIMULATOR & 6-APP DJANGO ARCHITECTURE */}
      <div id="visual-suite">
        <LibraryBusVisualSuite isEn={isEn} />
      </div>

      {/* 4. CHẾ ĐỘ ĐỌC LƯỚT 3 PHÚT CHO HR VS. CHẾ ĐỘ TOÀN BỘ DỰ ÁN */}
      {isExecutiveScanMode ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <strong className="text-amber-950 dark:text-amber-400">
                ⚡ {lang === 'vi' ? 'Chế độ Đọc lướt 3 phút cho HR:' : '3-Minute HR Executive Scan:'}
              </strong>{' '}
              {lang === 'vi'
                ? 'Đã thu gọn các chương Brand Identity và Wireframe chi tiết để tập trung vào Số liệu Phân tích Sản phẩm, Mô phỏng Đội xe, Kiến trúc 6 Django Apps và Tóm tắt Điều hành.'
                : 'Condensed Brand Identity and Wireframe chapters to highlight Product Analytics Metrics, Fleet Simulator, 6-App Django Architecture, and Executive Summary.'}
            </div>
            <button
              type="button"
              onClick={() => setIsExecutiveScanMode(false)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white dark:border-slate-700 text-xs font-mono font-bold shrink-0 cursor-pointer shadow-sm"
            >
              {lang === 'vi' ? 'Mở toàn bộ các chương UX/UI →' : 'Expand All UX/UI Chapters →'}
            </button>
          </div>

          <div id="executive-story">
            <LibraryBusExecutiveStory 
              isEn={isEn} 
              onJumpToSection={(secId) => scrollToSection(secId, 16)} 
            />
          </div>
          <div id="chapter-3-arch">
            <Chapter3TechnicalArchitecture
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
              onExportChart={handleExportChart}
              showToast={showToast}
              liveData={busData}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div id="executive-story">
            <LibraryBusExecutiveStory 
              isEn={isEn} 
              onJumpToSection={(secId) => scrollToSection(secId, 16)} 
            />
          </div>
          <div id="chapter-1-ux">
            <Chapter1UxResearch
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
            />
          </div>
          <div id="chapter-2-brand">
            <Chapter2BrandIdentity
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
            />
          </div>
          <div id="chapter-3-arch" className="space-y-8">
            <Chapter3TechnicalArchitecture
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
              onExportChart={handleExportChart}
              showToast={showToast}
              liveData={busData}
            />
            <Chapter3InteractiveShowcase
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
            />
            <Chapter3GridAndWireframe
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
            />
          </div>
          <div id="visual-comparison">
            <LibraryBusVisualComparison isEn={isEn} />
          </div>
        </div>
      )}

      {/* 5. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-library-bus"
        attribution={{
          datasetVi: 'Dữ liệu đo kiểm hiệu năng Django, Celery Beat & Redis Benchmarks (Arena Multimedia & Production Telemetry)',
          datasetEn: 'Django, Celery Beat & Redis Latency Benchmarks (Arena Multimedia & Production Telemetry)',
          scopeVi: '5 tuyến xe buýt, 30 điểm đỗ, 55+ templates, 20 màn hình UI/Wireframe đối chuẩn',
          scopeEn: '5 bus routes, 30 stops, 55+ templates, 20 UI/Wireframe verified screens',
        }}
      />
    </div>
  );
}
