'use client';

import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { MINTO_NARRATIVE } from '@/app/data/kami-ely/mintoNarrative';

// Executive Header Components
import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import ExecutiveSummary from '@/components/case-studies/ExecutiveSummary';
import KamiElyTabsNav, { KamiElyTabKey } from '@/components/case-studies/kami-ely/KamiElyTabsNav';

// 3 Minto Logic Tabs
import KamiElyCommercialTab from '@/components/case-studies/kami-ely/commercial/KamiElyCommercialTab';
import KamiElyScienceCaseStudy from '@/components/case-studies/kami-ely/science/KamiElyScienceCaseStudy';
import KamiElySqlPlaybook from '@/components/case-studies/kami-ely/playbook/KamiElySqlPlaybook';
import KamiElySqlLabWorkbench from '@/components/case-studies/kami-ely/KamiElySqlLabWorkbench';

// Modals & Footer
import KamiElyProofModal from '@/components/case-studies/kami-ely/KamiElyProofModal';
import ScienceNotebookModal from '@/components/case-studies/kami-ely/science/ScienceNotebookModal';
import CaseStudyFooter from './shared/CaseStudyFooter';

export interface KamiElyProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  initialData?: any;
}

export default function KamiElyProject({
  onBack: _onBack,
  isEmbedded: _isEmbedded,
  initialData: _initialData
}: KamiElyProjectProps = {}) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';
  const isEn = lang === 'en';
  const headerContent = MINTO_NARRATIVE.header;

  // Quản lý 3 Tab cốt lõi theo tư duy Data Analyst (Minto Pyramid)
  const [activeTab, setActiveTab] = useState<KamiElyTabKey>('commercial');

  // Quản lý Modal Xem Bằng Chứng FastMoss & Đối Soát Telemetry
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [initialScreenshotId, setInitialScreenshotId] = useState<string | undefined>(undefined);

  // Quản lý Modal Xem Jupyter Notebook & Code Python
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleOpenProofModal = useCallback((id?: string) => {
    setInitialScreenshotId(id);
    setIsProofModalOpen(true);
  }, []);

  const handleTabChange = useCallback((tab: KamiElyTabKey) => {
    // Map legacy tab keys if received
    const normalizedTab: KamiElyTabKey =
      tab === 'shop' || tab === 'creator' ? 'commercial' : tab;
    setActiveTab(normalizedTab);

    setTimeout(() => {
      const targetId =
        normalizedTab === 'commercial'
          ? 'sec-commercial'
          : normalizedTab === 'science'
          ? 'sec-science'
          : 'sec-sql';
      const el = document.getElementById(targetId);
      if (el && typeof window !== 'undefined') {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 40);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* ==================================================================== */}
      {/* 1. TẦNG CỐ ĐỊNH: TÓM TẮT ĐIỀU HÀNH (110 chữ | 2 Biểu đồ)            */}
      {/* ==================================================================== */}
      <KamiElyHero
        onOpenProofModal={handleOpenProofModal}
        onJumpToStory={() => handleTabChange('commercial')}
      />

      {/* Biểu đồ #1: Dải 4 thẻ KPI cốt lõi & Khối Executive Summary */}
      <ExecutiveSummary
        isEn={isEn}
        readingTime={isEn ? '~3 min scan' : '~3 phút tóm tắt'}
        problem={headerContent.context[lang]}
        method={
          isEn
            ? 'Unified 8 raw relational datasets (18,778 rows), audited with SSOT rules, multivariate statistical tests, time-series decomposition, and What-If portfolio optimization.'
            : 'Hợp nhất 8 bảng dữ liệu thô (18.778 bản ghi), làm sạch và đối soát quy tắc SSOT; kết hợp kiểm định thống kê đa biến, phân rã chuỗi thời gian và mô phỏng tối ưu hóa danh mục What-If.'
        }
        insight={headerContent.conclusion[lang]}
        metrics={headerContent.kpiStrip.map((kpi) => ({
          label: kpi.label[lang],
          value: kpi.value,
          change: kpi.change[lang],
          isPositive: true
        }))}
        tools={[
          'TikTok Seller Center',
          'FastMoss Telemetry',
          'MySQL (portfolio_db)',
          'Python (scipy.stats & statsmodels)',
          'SQL CTEs & Window Functions'
        ]}
      />

      {/* Biểu đồ #2: Thanh đối soát độ chính xác dữ liệu (FastMoss Telemetry Card) */}
      <div className="p-4 sm:p-5 rounded-3xl border border-[#9BE7FA]/80 bg-gradient-to-r from-[#C8EEF7]/30 via-white to-[#9BE7FA]/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-mono font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              {headerContent.telemetry.verifiedRate}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              {headerContent.telemetry.tablesCount} · {headerContent.telemetry.rowsCount}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isEn ? 'CRYPTOGRAPHIC HASH VERIFIED' : 'MÃ BĂM ĐỐI SOÁT CHUẨN'}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            {headerContent.telemetry.title[lang]}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {headerContent.telemetry.description[lang]}
          </p>
        </div>

        {/* Nút hành động mở 19 ảnh bằng chứng FastMoss */}
        <button
          type="button"
          onClick={() => handleOpenProofModal()}
          className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-[#9BE7FA] text-slate-900 font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white"
        >
          <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>{headerContent.proofCta[lang]}</span>
          <ArrowRight className="w-4 h-4 ml-0.5 text-[#0D7287] dark:text-[#9BE7FA]" />
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 2. THANH ĐIỀU HƯỚNG 3 TAB LOGIC (MINTO PYRAMID)                      */}
      {/* ==================================================================== */}
      <KamiElyTabsNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenProofModal={() => handleOpenProofModal()}
      />

      {/* ==================================================================== */}
      {/* 3. NỘI DUNG TỪNG TAB (RENDER THEO TAB ĐỂ TRANG NGẮN GỌN & TẬP TRUNG)  */}
      {/* ==================================================================== */}
      <main className="w-full">
        {/* TAB 1: HIỆU SUẤT THƯƠNG MẠI & NỘI DUNG (#3 -> #12) */}
        {(activeTab === 'commercial' || activeTab === 'shop' || activeTab === 'creator') && (
          <section id="sec-commercial" className="scroll-mt-28 animate-fadeIn">
            <KamiElyCommercialTab
              isEn={isEn}
              handleTabChange={handleTabChange}
              onOpenProofModal={handleOpenProofModal}
            />
          </section>
        )}

        {/* TAB 2: THỐNG KÊ KIỂM ĐỊNH & TỐI ƯU HÓA (#13 -> #18) */}
        {activeTab === 'science' && (
          <section id="sec-science" className="scroll-mt-28 animate-fadeIn">
            <KamiElyScienceCaseStudy
              onOpenNotebook={() => setIsNotebookModalOpen(true)}
            />
          </section>
        )}

        {/* TAB 3: KỸ THUẬT DỮ LIỆU & PHÒNG LAB SQL (#19 -> #22 + SQL WORKBENCH) */}
        {activeTab === 'sql' && (
          <section id="sec-sql" className="scroll-mt-28 space-y-12 animate-fadeIn">
            <KamiElySqlPlaybook compactMode />
            <KamiElySqlLabWorkbench />
          </section>
        )}
      </main>

      {/* ==================================================================== */}
      {/* 4. FOOTER ĐIỀU HƯỚNG & GHI NHẬN DỮ LIỆU                              */}
      {/* ==================================================================== */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-kami-ely"
        attribution={{
          datasetVi: 'Dữ liệu E-Commerce Analytics, TikTok Seller Center & Live Workbench',
          datasetEn: 'E-Commerce Analytics, TikTok Seller Center & Live Workbench Telemetry',
          scopeVi: '180 ngày (09/03/2026 – 04/09/2026), 8 tập dữ liệu và 18.778 bản ghi đối soát SSOT',
          scopeEn: '180-day window (Mar 09 – Sep 04, 2026), 8 raw datasets, 18,778 audited rows SSOT',
        }}
      />

      {/* ==================================================================== */}
      {/* 5. MODALS (ẨN ẢNH CHỤP MÀN HÌNH & SOURCE CODE DÀI)                   */}
      {/* ==================================================================== */}
      <KamiElyProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        initialScreenshotId={initialScreenshotId}
        isEn={isEn}
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
