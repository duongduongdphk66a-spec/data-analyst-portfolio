'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection, useCaseStudyActions } from '@/app/lib/uiHelpers';

// Subcomponents
import { HeritageJapanNav } from './heritage-japan/HeritageJapanNav';
import { HeritageJapanHero } from './heritage-japan/HeritageJapanHero';
import { IntroductionSection } from './heritage-japan/IntroductionSection';
import { Chapter1HeritageSection } from './heritage-japan/Chapter1HeritageSection';
import { Chapter2PolicySection } from './heritage-japan/Chapter2PolicySection';
import { Chapter3AnalyticsSection } from './heritage-japan/Chapter3AnalyticsSection';
import { Chapter3CaseStudiesSection } from './heritage-japan/Chapter3CaseStudiesSection';
import { ConclusionSection } from './heritage-japan/ConclusionSection';
import SectionHeader from '@/components/ui/SectionHeader';

const HERITAGE_JAPAN_SECTIONS = [
  'mo-dau',
  'chuong-1',
  'chuong-2',
  'chuong-3',
  'ket-luan'
];

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function HeritageJapanProject({ onBack, isEmbedded }: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';
  const { copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);

  const handleCopyDeepLink = (id: string, title = '') => {
    copyDeepLink(id, title);
  };

  const { activeSection } = useScrollSpy(HERITAGE_JAPAN_SECTIONS, 130);

  const navItems = useMemo(() => [
    { id: 'mo-dau', label: isEn ? 'Introduction' : 'Mở đầu' },
    { id: 'chuong-1', label: isEn ? 'Ch1: Heritage Concept' : 'Chương 1' },
    { id: 'chuong-2', label: isEn ? 'Ch2: Policies' : 'Chương 2' },
    { id: 'chuong-3', label: isEn ? 'Ch3: Analytics & Cases' : 'Chương 3' },
    { id: 'ket-luan', label: isEn ? 'Conclusion' : 'Kết luận' },
  ], [isEn]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-slate-50 font-lora text-slate-900 selection:bg-[#FFE485]/40 dark:bg-slate-950 dark:text-slate-100">
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
      />

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

      {/* 4. Chương 3: Sự phát triển của Du lịch Di sản (#chuong-3) */}
      <section id="chuong-3" className="py-16 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            variant="stacked"
            id="chuong-3"
            badge={isEn ? 'Chapter 3 • Quantitative Telemetry & In-depth Case Studies' : 'Chương 3 • Dữ liệu Định lượng & Khảo sát Thực tiễn'}
            title={isEn ? 'Development of Heritage Tourism: Efficiency & Conservation' : 'Sự Phát Triển của Du Lịch Di Sản tại Nhật Bản'}
            onCopy={handleCopyDeepLink}
          />

          {/* 3.1 Tiêu chí Hiệu quả Du lịch (Analytics Hub) */}
          <Chapter3AnalyticsSection
            isEn={isEn}
            onExportChart={handleExportChart}
          />

          {/* 3.2 Tiêu chí Bảo tồn & Quản lý Di sản (5 Case Studies) */}
          <Chapter3CaseStudiesSection />
        </div>
      </section>

      {/* 5. Kết luận & Footer (#ket-luan) */}
      <ConclusionSection
        isEn={isEn}
        onCopyDeepLink={handleCopyDeepLink}
      />
    </div>
  );
}
