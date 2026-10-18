'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { scrollToSection, useCaseStudyActions } from '@/app/lib/uiHelpers';

import LibraryBusHero from './library-bus/LibraryBusHero';
import LibraryBusNav from './library-bus/LibraryBusNav';
import Chapter1UxResearch from './library-bus/Chapter1UxResearch';
import Chapter2BrandIdentity from './library-bus/Chapter2BrandIdentity';
import Chapter3GridAndWireframe from './library-bus/Chapter3GridAndWireframe';
import Chapter3DeckEmbed from './library-bus/Chapter3DeckEmbed';
import Chapter4BackendLogic from './library-bus/Chapter4BackendLogic';
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
  initialData?: unknown;
}

export default function LibraryBusProject({ 
  onBack, 
  isEmbedded: _isEmbedded, 
  initialData: _initialData 
}: LibraryBusProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const { copyDeepLink } = useCaseStudyActions(isEn);
  const handleCopyDeepLink = (id: string, title = '') => {
    copyDeepLink(id, title);
  };

  const [activeSection, setActiveSection] = useState<string>('chapter-1-ux');

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Library Bus UX/UI (Ma Văn Hùng)', 'proj-library-bus', 'project');
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

      {/* 2. STICKY NAVIGATION */}
      <LibraryBusNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onBack={handleBack}
      />

      <div className="space-y-10">
        {/* CHAPTER 01: INTRODUCTION AND RESEARCH */}
        <div id="chapter-1-ux">
          <Chapter1UxResearch
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </div>

        {/* CHAPTER 02: LOGO AND UI COMPONENTS */}
        <div id="chapter-2-brand">
          <Chapter2BrandIdentity
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </div>

        {/* CHAPTER 03: WEBSITE DESIGN */}
        <div className="space-y-8">
          <Chapter3GridAndWireframe
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
          <div id="visual-comparison">
            <LibraryBusVisualComparison isEn={isEn} />
          </div>
          <Chapter3DeckEmbed
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </div>

        {/* CHAPTER 04: BACKEND LOGIC & INTERACTIVE FLOWS */}
        <div id="chapter-4-backend">
          <Chapter4BackendLogic
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </div>
      </div>

      {/* 3. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-library-bus"
        attribution={{
          datasetVi: 'Dự án thiết kế UX/UI: dữ liệu hiển thị trong giao diện là dữ liệu mẫu',
          datasetEn: 'UX/UI design project: data shown in the interface is sample data',
          scopeVi: '20 màn hình desktop và bản mobile, mỗi màn hình có wireframe và UI design',
          scopeEn: '20 desktop screens and mobile versions, each with a wireframe and UI design',
        }}
      />
    </div>
  );
}
