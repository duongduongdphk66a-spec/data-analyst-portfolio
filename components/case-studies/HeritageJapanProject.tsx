'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useCaseStudyActions } from '@/app/lib/uiHelpers';
import { useCaseStudyData } from '@/hooks/useCaseStudyData';
import type { HeritageJapanDataPayload } from '@/app/types/caseStudies';

import HeritageJapanHero from '@/components/case-studies/heritage-japan/HeritageJapanHero';
import HeritageJapanNav from '@/components/case-studies/heritage-japan/HeritageJapanNav';
import HeritageJapanVisualSuite from '@/components/case-studies/heritage-japan/HeritageJapanVisualSuite';
import HeritageJapanExecutiveStory from '@/components/case-studies/heritage-japan/HeritageJapanExecutiveStory';
import IntroductionSection from '@/components/case-studies/heritage-japan/IntroductionSection';
import Chapter1HeritageSection from '@/components/case-studies/heritage-japan/Chapter1HeritageSection';
import Chapter2PolicySection from '@/components/case-studies/heritage-japan/Chapter2PolicySection';
import Chapter3AnalyticsSection from '@/components/case-studies/heritage-japan/Chapter3AnalyticsSection';
import Chapter3CaseStudiesSection from '@/components/case-studies/heritage-japan/Chapter3CaseStudiesSection';
import PolicyEvaluationSection from '@/components/case-studies/heritage-japan/PolicyEvaluationSection';
import DataAuditSection from '@/components/case-studies/heritage-japan/DataAuditSection';
import ConclusionSection from '@/components/case-studies/heritage-japan/ConclusionSection';
import CaseStudyFooter from './shared/CaseStudyFooter';

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  initialData?: HeritageJapanDataPayload;
}

export default function HeritageJapanProject({ 
  onBack, 
  isEmbedded: _isEmbedded, 
  initialData 
}: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const { copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);
  const handleCopyDeepLink = (id: string, title = '') => {
    copyDeepLink(id, title);
  };
  const [activeSection, setActiveSection] = useState<string>('visual-suite');
  const [isExecutiveScanMode, setIsExecutiveScanMode] = useState<boolean>(false);

  const { data: heritageData } = useCaseStudyData<HeritageJapanDataPayload>({
    projectId: 'proj-heritage-japan',
    endpoint: '/api/case-studies/heritage-japan',
    initialData,
  });

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Niên luận Du lịch Di sản Nhật Bản (Ma Văn Hùng)', 'proj-heritage-japan', 'project');
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
      <HeritageJapanHero
        isEn={isEn}
        viewMode={isExecutiveScanMode ? 'executive' : 'academic'}
        onToggleViewMode={(mode) => setIsExecutiveScanMode(mode === 'executive')}
      />

      {/* 2. STICKY NAVIGATION + 3-MINUTE HR SCAN TOGGLE */}
      <HeritageJapanNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        isExecutiveScanMode={isExecutiveScanMode}
        onToggleExecutiveScanMode={() => setIsExecutiveScanMode((prev) => !prev)}
        onBack={handleBack}
      />

      {/* 3. INTERACTIVE CHARTS, POLICY SIMULATOR & 6 THESIS FIGURES GALLERY */}
      <div id="visual-suite">
        <HeritageJapanVisualSuite isEn={isEn} />
      </div>

      {/* 4. CHẾ ĐỘ ĐỌC LƯỚT 3 PHÚT CHO HR VS. CHẾ ĐỘ TOÀN BỘ LUẬN VĂN */}
      {isExecutiveScanMode ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-amber-200">
              <strong className="text-amber-400">
                ⚡ {lang === 'vi' ? 'Chế độ Đọc lướt 3 phút cho HR:' : '3-Minute HR Executive Scan:'}
              </strong>{' '}
              {lang === 'vi'
                ? 'Đã thu gọn 3 chương lý thuyết dài, chỉ hiển thị Bộ Biểu đồ Tương tác, Mô phỏng Chính sách, Tóm tắt Điều hành và Kiểm toán Dữ liệu.'
                : 'Condensed 3 theoretical chapters to highlight Interactive Charts, Policy Simulator, Executive Summary, and Data Audit.'}
            </div>
            <button
              type="button"
              onClick={() => setIsExecutiveScanMode(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-mono font-bold shrink-0 cursor-pointer"
            >
              {lang === 'vi' ? 'Mở toàn bộ 3 Chương chi tiết →' : 'Expand All 3 Thesis Chapters →'}
            </button>
          </div>

          <div id="executive-story">
            <HeritageJapanExecutiveStory isEn={isEn} />
          </div>
          <div id="policy-eval">
            <PolicyEvaluationSection
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
              touristsData={heritageData?.tourists}
              isLiveDb={heritageData?.isLiveDb}
            />
          </div>
          <div id="data-audit">
            <DataAuditSection isEn={isEn} onCopyDeepLink={handleCopyDeepLink} />
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div id="executive-story">
            <HeritageJapanExecutiveStory isEn={isEn} />
          </div>
          <div id="intro">
            <IntroductionSection isEn={isEn} onCopyDeepLink={handleCopyDeepLink} />
          </div>
          <div id="chapter-1">
            <Chapter1HeritageSection isEn={isEn} onCopyDeepLink={handleCopyDeepLink} />
          </div>
          <div id="chapter-2">
            <Chapter2PolicySection isEn={isEn} onCopyDeepLink={handleCopyDeepLink} />
          </div>
          <div id="chapter-3" className="space-y-8">
            <Chapter3AnalyticsSection
              isEn={isEn}
              onExportChart={handleExportChart}
              liveData={heritageData}
            />
            <Chapter3CaseStudiesSection />
          </div>
          <div id="policy-eval">
            <PolicyEvaluationSection
              isEn={isEn}
              onCopyDeepLink={handleCopyDeepLink}
              touristsData={heritageData?.tourists}
              isLiveDb={heritageData?.isLiveDb}
            />
          </div>
          <div id="data-audit">
            <DataAuditSection isEn={isEn} onCopyDeepLink={handleCopyDeepLink} />
          </div>
          <div id="conclusion">
            <ConclusionSection isEn={isEn} onCopyDeepLink={handleCopyDeepLink} />
          </div>
        </div>
      )}

      {/* 5. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-heritage-japan"
        attribution={{
          datasetVi: 'Dữ liệu chuỗi thời gian MLIT (Bộ Đất đai, Cơ sở hạ tầng, Giao thông & Du lịch Nhật Bản) & JNTO',
          datasetEn: 'MLIT (Ministry of Land, Infrastructure, Transport & Tourism) & JNTO Telemetry',
          scopeVi: 'Chuỗi thời gian 2003–2023, 25 di sản UNESCO và 47 tỉnh thành Nhật Bản',
          scopeEn: '2003–2023 time-series, 25 UNESCO sites across 47 Japanese prefectures',
        }}
      />
    </div>
  );
}
