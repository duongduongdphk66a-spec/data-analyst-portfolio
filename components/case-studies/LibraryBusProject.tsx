'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Presentation } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { scrollToSection, useCaseStudyActions } from '@/app/lib/uiHelpers';

import LibraryBusHero from './library-bus/LibraryBusHero';
import LibraryBusNav from './library-bus/LibraryBusNav';
import Chapter1UxResearch from './library-bus/Chapter1UxResearch';
import Chapter4BackendLogic from './library-bus/Chapter4BackendLogic';
import CaseStudyFooter from './shared/CaseStudyFooter';

const LIBRARY_BUS_SECTION_IDS = [
  'chapter-1-ux',
  'chapter-4-backend',
  'visual-comparison',
] as const;

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
}

export default function LibraryBusProject({
  onBack,
  isEmbedded: _isEmbedded,
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
      'Xem chi tiết dự án: Library Bus Technical BA & Tracking Spec (Ma Văn Hùng)',
      'proj-library-bus',
      'project'
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = LIBRARY_BUS_SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(LIBRARY_BUS_SECTION_IDS[i]);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(LIBRARY_BUS_SECTION_IDS[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        {/* PHẦN 01: PHÂN TÍCH NGHIỆP VỤ (AS-IS/TO-BE, STAKEHOLDERS, MOSCOW, BR-01..04 & USER STORIES) */}
        <Chapter1UxResearch
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
        />

        {/* PHẦN 02: MÔ HÌNH DỮ LIỆU LÕI (ERD), TRACKING PLAN & KIẾN TRÚC XÁC NHẬN */}
        <Chapter4BackendLogic
          isEn={isEn}
          onCopyDeepLink={handleCopyDeepLink}
        />

        {/* PHẦN 03: KHUNG MASTER-DETAIL 11 CẶP MÀN HÌNH CỐT LÕI (WIREFRAME <-> UI) */}
        <div className="space-y-4">
          <LibraryBusVisualComparison isEn={isEn} />
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              {isEn
                ? 'Legacy academic UX/Brand slide deck (30 slides) archived separately so this page stays focused on BA & data modeling.'
                : 'Tài liệu trình chiếu UX & nhận diện đồ án gốc (30 slide) được tách riêng để giữ trọng tâm phân tích nghiệp vụ và dữ liệu trên trang này.'}
            </span>
            <Link
              href="/projects/library-bus/presentation"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-[#074553] dark:text-[#9BE7FA] hover:border-[#0D7287] transition-colors cursor-pointer shrink-0"
            >
              <Presentation className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEn ? 'Open Archive UX Deck' : 'Xem Slide UX gốc (Lưu trữ)'}</span>
            </Link>
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
