'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';

import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import KamiElyNav, { KAMI_SECTION_IDS } from '@/components/case-studies/kami-ely/KamiElyNav';
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

  const [activeSection, setActiveSection] = useState<string>('sec-exec-summary');
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    trackVisitorAction(
      'Xem chi tiết dự án: Kami Ely E-Commerce & Affiliate Analytics (Ma Văn Hùng)',
      'proj-kami-ely',
      'project'
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = KAMI_SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(KAMI_SECTION_IDS[i]);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(KAMI_SECTION_IDS[i]);
          break;
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

  const handleJumpToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      if (sectionId === 'sec-appendix') {
        el.dispatchEvent(new CustomEvent('kami-open-appendix'));
      }
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 min-h-[100dvh] bg-ground font-sans text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      <KamiElyHero
        isEn={isEn}
        onOpenNotebook={() => setIsNotebookModalOpen(true)}
        onJumpToSection={handleJumpToSection}
      />

      <KamiElyNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onBack={handleBack}
      />

      <main className="w-full">
        <KamiElyCommercialTab
          isEn={isEn}
          telemetryData={props.initialData}
          onOpenNotebook={() => setIsNotebookModalOpen(true)}
        />
      </main>

      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-kami-ely"
        attribution={{
          datasetVi: 'Dữ liệu ước tính bên thứ ba (FastMoss Market Intelligence)',
          datasetEn: 'Third-party Market Intelligence Estimate (FastMoss)',
          scopeVi: '231 ngày (09/03 - 25/10/2026) · 9 bảng chính + 1 bảng phụ trợ SKU · Đã giả danh hóa PII KOC',
          scopeEn: '231 days (Mar 09 - Oct 25, 2026) · 9 core + 1 SKU panel tables · Pseudonymized creator IDs',
        }}
      />

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
