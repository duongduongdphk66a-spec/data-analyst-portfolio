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
import Chapter4BackendLogic from './library-bus/Chapter4BackendLogic';
import Chapter2BrandIdentity from './library-bus/Chapter2BrandIdentity';
import CaseStudyFooter from './shared/CaseStudyFooter';

const LibraryBusVisualComparison = dynamic(
  () => import('./LibraryBusVisualComparison'),
  {
    loading: () => (
      <div className="p-10 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div
          className="animate-spin w-7 h-7 border-3 border-[#074553] border-t-transparent rounded-full mx-auto mb-3 dark:border-[#9BE7FA]" /* taste-skill-ignore: spinner ring */
        />
        <p className="text-xs font-medium">
          Đang tải khung Master–Detail 11 cặp màn hình cốt lõi (Wireframe vs UI)...
        </p>
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
  initialData: _initialData,
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
    trackVisitorAction(
      'Xem chi tiết dự án: Library Bus BA & Telemetry Architecture (Ma Văn Hùng)',
      'proj-library-bus',
      'project'
    );
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 min-h-[100dvh] bg-ground font-sans text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO + 4 KPI CARDS + 60-SECOND SUMMARY */}
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

      <div className="space-y-9">
        {/* PHẦN 01: BÀI TOÁN NGHIỆP VỤ, 4 QUY TẮC BR-01..04, SWIMLANE & BIỂU ĐỒ BẬC THANG PHÍ PHẠT */}
        <div id="chapter-1-ux">
          <Chapter1UxResearch
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </div>

        {/* PHẦN 02: KIẾN TRÚC DỮ LIỆU (MYSQL 8.0 + REDIS 7 + CELERY) & HỆ THỐNG TELEMETRY (ĐẨY LÊN VỊ TRÍ SỐ 2) */}
        <div id="chapter-4-backend">
          <Chapter4BackendLogic
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </div>

        {/* PHẦN 03: KHUNG MASTER-DETAIL 11 CẶP MÀN HÌNH CỐT LÕI & ACCORDION DESIGN SYSTEM */}
        <div id="visual-comparison" className="space-y-5">
          <LibraryBusVisualComparison isEn={isEn} />
          <div id="chapter-2-brand">
            <Chapter2BrandIdentity
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
            />
          </div>
        </div>
      </div>

      {/* 3. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-library-bus"
        attribution={{
          datasetVi:
            'Mã nguồn thật: Django 5.2 (7 Apps • 36 Models • 97 Templates • 171 Unit Tests) + MySQL 8.0 + Redis 7 + Celery Beat (9 Cron Jobs)',
          datasetEn:
            'Actual Codebase: Django 5.2 (7 Apps • 36 Models • 97 Templates • 171 Unit Tests) + MySQL 8.0 + Redis 7 + Celery Beat (9 Cron Jobs)',
          scopeVi:
            '4 bộ quy tắc BR-01..04 (khóa bi quan select_for_update()), phân hệ Telemetry analytics và khung Master–Detail 11 cặp màn hình (Desktop 1440px & Mobile 390px)',
          scopeEn:
            '4 BA rule sets BR-01..04 (pessimistic select_for_update() locking), analytics Telemetry module, and Master–Detail 11 core screen pairs (Desktop 1440px & Mobile 390px)',
        }}
      />
    </div>
  );
}
