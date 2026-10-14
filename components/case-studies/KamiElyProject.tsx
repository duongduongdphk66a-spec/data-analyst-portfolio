'use client';

import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

// Các Component Điều hành & Đối soát Cấp cao (Bước 1 & Bước 2)
import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import KamiElyTabsNav, { KamiElyTabKey } from '@/components/case-studies/kami-ely/KamiElyTabsNav';
import KamiElyExecutiveStory from '@/components/case-studies/kami-ely/KamiElyExecutiveStory';
import KamiElyDataScopeMatrix from '@/components/case-studies/kami-ely/KamiElyDataScopeMatrix';
import KamiElyProofModal from '@/components/case-studies/kami-ely/KamiElyProofModal';

// 3 Phân hệ Tab Chuyên sâu (Bước 3)
import KamiElyShopTab from '@/components/case-studies/kami-ely/shop/KamiElyShopTab';
import KamiElyCreatorTab from '@/components/case-studies/kami-ely/creator/KamiElyCreatorTab';
import KamiElyScienceCaseStudy from '@/components/case-studies/kami-ely/science/KamiElyScienceCaseStudy';
import ScienceOptimizerSection from '@/components/case-studies/kami-ely/science/ScienceOptimizerSection';

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

  // Quản lý Tab đang mở ('shop' | 'creator' | 'science')
  const [activeTab, setActiveTab] = useState<KamiElyTabKey>('shop');

  // Chế độ "Đọc lướt 3 phút cho HR" (Thu gọn toàn bộ bảng phụ, chỉ hiển thị Insights + What-If Simulator)
  const [isExecutiveScanMode, setIsExecutiveScanMode] = useState<boolean>(false);

  // Quản lý Modal Bằng chứng Ảnh chụp màn hình gốc (22 Screenshots)
  const [proofModalOpen, setProofModalOpen] = useState<boolean>(false);
  const [selectedProofId, setSelectedProofId] = useState<string | undefined>(undefined);

  const handleOpenProofModal = useCallback((screenshotId?: string) => {
    setSelectedProofId(screenshotId);
    setProofModalOpen(true);
  }, []);

  const handleCloseProofModal = useCallback(() => {
    setProofModalOpen(false);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. HERO BENTO GRID: Định vị Quy mô All-Time (31,6 Tỉ) vs. 180 Ngày (12,74 Tỉ) vs. 90 Ngày (6,14 Tỉ) */}
      <KamiElyHero onOpenProofModal={handleOpenProofModal} />

      {/* 2. THANH ĐIỀU HƯỚNG CỐ ĐỊNH & NÚT BẬT/TẮT CHẾ ĐỘ ĐỌC LƯỚT 3 PHÚT CHO HR */}
      <KamiElyTabsNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isExecutiveScanMode={isExecutiveScanMode}
        onToggleExecutiveScanMode={() => setIsExecutiveScanMode((prev) => !prev)}
      />

      {/* 3. CHẾ ĐỘ ĐỌC LƯỚT 3 PHÚT (EXECUTIVE SCAN MODE) HOẶC CHẾ ĐỘ PHÂN TÍCH ĐẦY ĐỦ */}
      {isExecutiveScanMode ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Banner thông báo đang ở chế độ đọc nhanh 3 phút */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <strong className="text-amber-700 dark:text-amber-400">
                ⚡ {lang === 'vi' ? 'Chế độ Đọc lướt 3 phút cho HR:' : '3-Minute HR Executive Scan:'}
              </strong>{' '}
              {lang === 'vi'
                ? 'Hiển thị cô đọng 4 Phát hiện Thực nghiệm, Ma trận Đối soát 8 Bảng dữ liệu (18.778 dòng) và Bộ Mô phỏng ROI.'
                : 'Displaying condensed 4 Empirical Findings, 8-Dataset Reconciliation Matrix (18,778 rows), and Interactive ROI Simulator.'}
            </div>
            <button
              type="button"
              onClick={() => setIsExecutiveScanMode(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-mono font-bold shrink-0 transition cursor-pointer"
            >
              {lang === 'vi' ? 'Mở toàn bộ 3 Tab chi tiết →' : 'Expand All 3 Deep-Dive Tabs →'}
            </button>
          </div>

          <KamiElyExecutiveStory />
          <KamiElyDataScopeMatrix />
          <ScienceOptimizerSection />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tóm tắt điều hành & Ma trận đối soát phạm vi dữ liệu */}
          <KamiElyExecutiveStory />
          <KamiElyDataScopeMatrix />

          {/* Nội dung chi tiết của từng phân hệ Tab */}
          <div id="kami-ely-active-tab-content" className="pt-2">
            {activeTab === 'shop' && (
              <KamiElyShopTab
                openProofScreenshot={handleOpenProofModal}
                handleTabChange={(t) => setActiveTab(t as any)}
              />
            )}
            {activeTab === 'creator' && (
              <KamiElyCreatorTab
                openProofScreenshot={handleOpenProofModal}
                handleTabChange={(t) => setActiveTab(t as any)}
              />
            )}
            {activeTab === 'science' && <KamiElyScienceCaseStudy />}
          </div>
        </div>
      )}

      {/* 4. MODAL BẰNG CHỨNG ẢNH CHỤP MÀN HÌNH GỐC (22 SCREENSHOTS) */}
      {proofModalOpen && (
        <KamiElyProofModal
          isOpen={proofModalOpen}
          onClose={handleCloseProofModal}
          initialScreenshotId={selectedProofId}
        />
      )}
    </div>
  );
}
