'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';

import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import KamiElyNav from '@/components/case-studies/kami-ely/KamiElyNav';
import KamiElyCommercialTab from '@/components/case-studies/kami-ely/commercial/KamiElyCommercialTab';

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

  const [activeSection, setActiveSection] = useState<string>('sec-stage-1-architecture');

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

  // Update active section on scroll across 7 unified stages
  useEffect(() => {
    const sectionIds = [
      'sec-stage-1-architecture',
      'sec-stage-2-profile-clean',
      'sec-stage-3-timeseries',
      'sec-stage-4-creator-cohorts',
      'sec-stage-5-funnels-channels',
      'sec-stage-6-anomalies',
      'sec-stage-7-etl-pii',
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
        {/* TOÀN BỘ 7 GIAI ĐOẠN PHÂN TÍCH CHUẨN SSOT */}
        <KamiElyCommercialTab
          isEn={isEn}
          telemetryData={props.initialData}
        />
      </main>

      {/* 3. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-kami-ely"
        attribution={{
          datasetVi: 'TikTok Seller Center & FastMoss Telemetry',
          datasetEn: 'TikTok Seller Center & FastMoss Telemetry',
          scopeVi: '226 ngày (09/03–20/10/2026) · 9 bảng · 21.569 dòng SSOT',
          scopeEn: '226 days (Mar 09 – Oct 20, 2026) · 9 tables · 21,569 SSOT rows',
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
