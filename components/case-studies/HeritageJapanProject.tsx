'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection, useCaseStudyActions } from '@/app/lib/uiHelpers';
import HeritageJapanExecutiveStory from './heritage-japan/HeritageJapanExecutiveStory';
import HeritagePolicySimulator from './heritage-japan/HeritagePolicySimulator';

// Subcomponents
import { HeritageJapanNav } from './heritage-japan/HeritageJapanNav';
import { HeritageJapanHero } from './heritage-japan/HeritageJapanHero';
import { IntroductionSection } from './heritage-japan/IntroductionSection';
import { Chapter1HeritageSection } from './heritage-japan/Chapter1HeritageSection';
import { Chapter2PolicySection } from './heritage-japan/Chapter2PolicySection';
import { Chapter3AnalyticsSection } from './heritage-japan/Chapter3AnalyticsSection';
import { Chapter3CaseStudiesSection } from './heritage-japan/Chapter3CaseStudiesSection';
import { DataAuditSection } from './heritage-japan/DataAuditSection';
import { PolicyEvaluationSection } from './heritage-japan/PolicyEvaluationSection';
import { ConclusionSection } from './heritage-japan/ConclusionSection';
import SectionHeader from '@/components/ui/SectionHeader';
import CaseStudyFooter from './shared/CaseStudyFooter';
import { BookOpen, Sparkles } from 'lucide-react';

const HERITAGE_JAPAN_SECTIONS = [
  'mo-dau',
  'chuong-1',
  'chuong-2',
  'chuong-3',
  'mo-phong-chinh-sach',
  'kiem-dinh-du-lieu',
  'danh-gia-hieu-qua',
  'ket-luan'
];

import type { HeritageJapanDataPayload } from '@/app/types/caseStudies';
import { useCaseStudyData } from '@/hooks/useCaseStudyData';

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  initialData?: HeritageJapanDataPayload;
}

export default function HeritageJapanProject({ onBack, isEmbedded, initialData }: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';
  const { copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);
  const [viewMode, setViewMode] = useState<'executive' | 'academic'>('executive');
  const [isAcademicExpanded, setIsAcademicExpanded] = useState<boolean>(false);

  const handleCopyDeepLink = (id: string, title = '') => {
    copyDeepLink(id, title);
  };

  const { activeSection } = useScrollSpy(HERITAGE_JAPAN_SECTIONS, 130);
  const { data: heritageData } = useCaseStudyData<HeritageJapanDataPayload>({
    projectId: 'proj-heritage-japan',
    endpoint: '/api/case-studies/heritage-japan',
    initialData,
  });

  const navItems = useMemo(() => [
    { id: 'mo-dau', label: isEn ? 'Introduction' : 'Mở đầu' },
    { id: 'chuong-1', label: isEn ? 'Ch1: Heritage Concept' : 'Chương 1' },
    { id: 'chuong-2', label: isEn ? 'Ch2: Policies' : 'Chương 2' },
    { id: 'chuong-3', label: isEn ? 'Ch3: Analytics & Cases' : 'Chương 3' },
    { id: 'mo-phong-chinh-sach', label: isEn ? 'Policy Simulator' : 'Mô phỏng Chính sách' },
    { id: 'kiem-dinh-du-lieu', label: isEn ? 'Data Audit' : 'Kiểm định Data' },
    { id: 'danh-gia-hieu-qua', label: isEn ? 'Policy Evaluation' : 'Đánh giá Hiệu quả' },
    { id: 'ket-luan', label: isEn ? 'Conclusion' : 'Kết luận' },
  ], [isEn]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (viewMode === 'executive' && (id === 'mo-dau' || id === 'chuong-1' || id === 'chuong-2' || id === 'ket-luan')) {
      setViewMode('academic');
      setTimeout(() => {
        scrollToSection(id, 16);
      }, 60);
      return;
    }
    scrollToSection(id, 16);
  };

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
    <div className="min-h-screen bg-ground font-sans text-slate-900 selection:bg-[#9BE7FA]/60 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <HeritageJapanNav
        onBack={handleBack}
        isEmbedded={isEmbedded}
        isEn={isEn}
        setLanguage={setLanguage}
        navItems={navItems}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />

      {/* Hero Header & Bento Telemetry */}
      <HeritageJapanHero
        isEn={isEn}
        onNavClick={handleNavClick}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 3-Minute Executive Story */}
      <div className="page-container pt-12 md:pt-16">
        <HeritageJapanExecutiveStory
          isEn={isEn}
          onJumpToSection={(secId) => scrollToSection(secId, 16)}
        />
      </div>

      {/* Interactive What-If Policy Scenario Simulator */}
      <section id="mo-phong-chinh-sach" className="page-container py-12 md:py-16">
        <HeritagePolicySimulator isEn={isEn} />
      </section>

      {/* ACADEMIC FULL-TEXT CHAPTERS (Shown in academic mode) */}
      {viewMode === 'academic' && (
        <>
          {/* 1. Phần Mở Đầu (#mo-dau) */}
          <IntroductionSection
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />

          {/* 2. Chương 1: Di sản & Du lịch Di sản (#chuong-1) */}
          <Chapter1HeritageSection
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />

          {/* 3. Chương 2: Chính sách Du lịch Di sản Nhật Bản (#chuong-2) */}
          <Chapter2PolicySection
            isEn={isEn}
            onCopyDeepLink={handleCopyDeepLink}
          />
        </>
      )}

      {/* 4. Chương 3: Sự phát triển của Du lịch Di sản (#chuong-3) */}
      <section id="chuong-3" className="py-20 md:py-28 bg-ground border-b border-slate-200/80 dark:bg-[#0B0F17] dark:border-slate-800">
        <div className="page-container">
          <SectionHeader
            variant="stacked"
            id="chuong-3"
            badge={isEn ? 'Chapter 3 • Quantitative Telemetry & In-depth Analytics' : 'Chương 3 • Dữ liệu Định lượng & Khảo sát Thực tiễn'}
            title={isEn ? 'Development of Heritage Tourism: Efficiency & Conservation' : 'Sự Phát Triển của Du Lịch Di Sản tại Nhật Bản'}
            onCopy={handleCopyDeepLink}
          />

          {/* 3.1 Tiêu chí Hiệu quả Du lịch (Analytics Hub) */}
          <Chapter3AnalyticsSection
            isEn={isEn}
            onExportChart={handleExportChart}
            liveData={heritageData}
          />

          {/* 3.2 Tiêu chí Bảo tồn & Quản lý Di sản (5 Case Studies) */}
          {(viewMode === 'academic' || isAcademicExpanded) && (
            <Chapter3CaseStudiesSection />
          )}
        </div>
      </section>

      {/* In executive mode: Option to unroll or inspect full thesis chapters */}
      {viewMode === 'executive' && (
        <div className="page-container py-8">
          <div className="p-6 rounded-3xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 text-[#0D7287] dark:text-[#9BE7FA] shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                  {isEn ? 'Looking for Full 10 Academic Thesis Chapters & 5 Case Studies?' : 'Bạn muốn đọc toàn bộ 10 Chương Luận văn & 5 Case Studies thực địa?'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEn
                    ? 'Explore complete UNESCO theoretical frameworks, Miyajima/Shirakawa-go cases, and institutional policy timelines.'
                    : 'Bao gồm cơ sở lý luận UNESCO, 25 di sản vật thể/thiên nhiên, khảo sát Miyajima, Shirakawa-go, Himeji & Yakushima.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewMode('academic');
                setIsAcademicExpanded(true);
                scrollToSection('mo-dau', 16);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
            >
              <span>{isEn ? 'Switch to Full Academic Mode' : 'Chuyển sang Chế độ Toàn văn Niên luận'}</span>
              <Sparkles className="w-4 h-4 text-sky-400 dark:text-sky-600" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Kiểm định Dữ liệu & Phát hiện Bất thường (#kiem-dinh-du-lieu) */}
      <DataAuditSection
        isEn={isEn}
        onCopyDeepLink={handleCopyDeepLink}
      />

      {/* 6. Đánh giá Hiệu quả Chính sách & Mô hình Phản thực tế (#danh-gia-hieu-qua) */}
      <PolicyEvaluationSection
        isEn={isEn}
        onCopyDeepLink={handleCopyDeepLink}
        touristsData={heritageData?.tourists}
        isLiveDb={heritageData?.isLiveDb}
      />

      {/* 7. Kết luận & Footer (#ket-luan) */}
      <ConclusionSection
        isEn={isEn}
        onCopyDeepLink={handleCopyDeepLink}
      />

      {/* Unified Case Study Footer */}
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
