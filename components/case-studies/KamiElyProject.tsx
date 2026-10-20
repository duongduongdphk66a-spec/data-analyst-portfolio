'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';

import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import KamiElyNav from '@/components/case-studies/kami-ely/KamiElyNav';
import KamiElyCommercialTab from '@/components/case-studies/kami-ely/commercial/KamiElyCommercialTab';
import KamiElyScienceCaseStudy from '@/components/case-studies/kami-ely/science/KamiElyScienceCaseStudy';
import KamiElySqlPlaybook from '@/components/case-studies/kami-ely/playbook/KamiElySqlPlaybook';

import ScienceNotebookModal from '@/components/case-studies/kami-ely/science/ScienceNotebookModal';
import CaseStudyFooter from './shared/CaseStudyFooter';

export interface KamiElyProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  initialData?: any;
  initialShopData?: any;
  initialCreatorData?: any;
}

export default function KamiElyProject(props: KamiElyProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeSection, setActiveSection] = useState<string>('part-1-commercial');

  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    trackVisitorAction(
      'Xem chi tiết dự án: Kami Ely (@kamielyhn) E-Commerce & Affiliate Analytics (Ma Văn Hùng)',
      'proj-kami-ely',
      'project'
    );
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const sectionIds = [
      'part-1-commercial',
      'sec-stage-3-time-series',
      'part-2-science',
      'sec-stage-4-cohort-cltv',
      'sec-stage-5-funnel-basket',
      'part-3-playbook',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (props.onBack) {
      props.onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 min-h-[100dvh] bg-ground font-sans text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <KamiElyHero
        isEn={isEn}
        onOpenNotebook={() => setIsNotebookModalOpen(true)}
      />

      {/* 2. STICKY NAVIGATION */}
      <KamiElyNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onBack={handleBack}
      />

      <main className="w-full space-y-12">
        {/* PHẦN 1: KIẾN TRÚC DỮ LIỆU & CHUỖI THỜI GIAN */}
        <div id="part-1-commercial" className="space-y-8 scroll-mt-28">
          <KamiElyCommercialTab
            isEn={isEn}
          />
        </div>

        {/* PHẦN 2: KHOA HỌC DỮ LIỆU & THỬ NGHIỆM */}
        <div id="part-2-science" className="space-y-8 scroll-mt-28">
          <KamiElyScienceCaseStudy
            onOpenNotebook={() => setIsNotebookModalOpen(true)}
          />
        </div>

        {/* PHẦN 3: SỔ TAY SQL & BẢO MẬT DỮ LIỆU */}
        <div id="part-3-playbook" className="space-y-8 scroll-mt-28">
          <KamiElySqlPlaybook compactMode />
        </div>
      </main>

      {/* 3. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-kami-ely"
        attribution={{
          datasetVi: 'TikTok Seller Center & FastMoss Telemetry',
          datasetEn: 'TikTok Seller Center & FastMoss Telemetry',
          scopeVi: '180 ngày (09/03–04/09/2026) · 8 bảng · 18.778 dòng SSOT',
          scopeEn: '180 days (Mar 09 – Sep 04, 2026) · 8 tables · 18,778 SSOT rows',
        }}
      />

      {/* MODALS */}
      <ScienceNotebookModal
        isOpen={isNotebookModalOpen}
        onClose={() => setIsNotebookModalOpen(false)}
        isEn={isEn}
        selectedSnippetIdx={selectedSnippetIdx}
        setSelectedSnippetIdx={setSelectedSnippetIdx}
        copiedCode={copiedCode}
        handleCopyCode={(code: string) => {
          navigator.clipboard.writeText(code);
          setCopiedCode(true);
          setTimeout(() => setCopiedCode(false), 2000);
        }}
      />
    </div>
  );
}
