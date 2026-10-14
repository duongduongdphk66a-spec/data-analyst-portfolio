'use client';

import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

// Khối Điều hành & Bộ Biểu đồ Trực quan Cấp cao
import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import KamiElyTabsNav, { KamiElyTabKey } from '@/components/case-studies/kami-ely/KamiElyTabsNav';
import KamiElyVisualChartsSuite from '@/components/case-studies/kami-ely/KamiElyVisualChartsSuite';
import KamiElySqlBookVisualFlow from '@/components/case-studies/kami-ely/KamiElySqlBookVisualFlow';
import KamiElyExecutiveStory from '@/components/case-studies/kami-ely/KamiElyExecutiveStory';
import KamiElyDataScopeMatrix from '@/components/case-studies/kami-ely/KamiElyDataScopeMatrix';
import KamiElySqlLabWorkbench from '@/components/case-studies/kami-ely/KamiElySqlLabWorkbench';
import KamiElyProofModal from '@/components/case-studies/kami-ely/KamiElyProofModal';

// 3 Phân hệ Tab Chuyên sâu (Shop • Creator • Science)
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

  // Quản lý Tab chuyên sâu ('shop' | 'creator' | 'science')
  const [activeTab, setActiveTab] = useState<KamiElyTabKey>('shop');

  // Chế độ "Đọc lướt 3 phút cho HR" (Chỉ hiện Biểu đồ + Hình ảnh + Simulator, ẩn bảng chữ dài)
  const [isExecutiveScanMode, setIsExecutiveScanMode] = useState<boolean>(false);

  // Bật/tắt hiển thị Khung 8 Giai đoạn SQL for Data Analysis
  const [showSqlBookPipeline, setShowSqlBookPipeline] = useState<boolean>(true);

  // Quản lý Modal phóng to 22 Ảnh chụp màn hình gốc
  const [proofModalOpen, setProofModalOpen] = useState<boolean>(false);
  const [selectedProofId, setSelectedProofId] = useState<string | undefined>(undefined);

  const handleOpenProofModal = useCallback((screenshotId?: string) => {
    setSelectedProofId(screenshotId);
    setProofModalOpen(true);
  }, []);

  const handleCloseProofModal = useCallback(() => {
    setProofModalOpen(false);
  }, []);

  // Cuộn mượt về đầu vùng nội dung khi đổi giữa 3 Tab lớn
  const handleSelectMainTab = useCallback((tab: KamiElyTabKey) => {
    setActiveTab(tab);
    const contentEl = document.getElementById('kami-ely-active-tab-content');
    if (contentEl && typeof window !== 'undefined') {
      const yOffset = -95;
      const y = contentEl.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. HERO BENTO GRID: Định vị All-Time (31,6 Tỉ) • 180 Ngày (12,74 Tỉ) • 90 Ngày (6,14 Tỉ) */}
      <KamiElyHero onOpenProofModal={handleOpenProofModal} />

      {/* 2. BỘ 6 BIỂU ĐỒ TƯƠNG TÁC & DẢI 6 ẢNH CHỤP MÀN HÌNH THẬT (VISUAL-FIRST SUITE) */}
      <KamiElyVisualChartsSuite onOpenProofModal={handleOpenProofModal} />

      {/* 3. LỘ TRÌNH 8 GIAI ĐOẠN "SQL FOR DATA ANALYSIS" BẰNG BIỂU ĐỒ & ẢNH BẰNG CHỨNG */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              {lang === 'vi'
                ? 'Khung Phân Tích Chuẩn: SQL for Data Analysis (Chương 1 → Chương 9)'
                : 'Standard Framework: SQL for Data Analysis (Ch. 1 → Ch. 9)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSqlBookPipeline((prev) => !prev)}
            className="text-xs font-mono text-sky-400 hover:text-sky-300 underline cursor-pointer"
          >
            {showSqlBookPipeline
              ? lang === 'vi'
                ? 'Thu gọn khung 8 giai đoạn ▲'
                : 'Collapse 8-Stage Pipeline ▲'
              : lang === 'vi'
              ? 'Mở khung 8 giai đoạn SQL ▼'
              : 'Expand 8-Stage Pipeline ▼'}
          </button>
        </div>

        {showSqlBookPipeline && <KamiElySqlBookVisualFlow onOpenProofModal={handleOpenProofModal} />}
      </div>

      {/* 4. THANH ĐIỀU HƯỚNG CỐ ĐỊNH 3 PHÂN HỆ & NÚT CHẾ ĐỘ ĐỌC LƯỚT 3 PHÚT CHO HR */}
      <KamiElyTabsNav
        activeTab={activeTab}
        onTabChange={handleSelectMainTab}
        isExecutiveScanMode={isExecutiveScanMode}
        onToggleExecutiveScanMode={() => setIsExecutiveScanMode((prev) => !prev)}
      />

      {/* 5. NỘI DUNG HIỂN THỊ THEO CHẾ ĐỘ (3-MIN SCAN MODE VS. FULL 3-TAB DEEP DIVE) */}
      {isExecutiveScanMode ? (
        <div className="space-y-8 animate-fadeIn">
          <ScienceOptimizerSection />
          <KamiElyExecutiveStory />
          <KamiElyDataScopeMatrix onOpenProofModal={handleOpenProofModal} />
          <KamiElySqlLabWorkbench />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Nội dung chuyên sâu của từng Tab */}
          <div id="kami-ely-active-tab-content" className="pt-1 space-y-8">
            {activeTab === 'shop' && (
              <KamiElyShopTab
                openProofScreenshot={handleOpenProofModal}
                handleTabChange={handleSelectMainTab}
              />
            )}
            {activeTab === 'creator' && (
              <KamiElyCreatorTab
                openProofScreenshot={handleOpenProofModal}
                handleTabChange={handleSelectMainTab}
              />
            )}
            {activeTab === 'science' && <KamiElyScienceCaseStudy />}
          </div>

          {/* Ma trận Kiểm toán 8 Bảng gốc & Phòng thí nghiệm SQL đặt gọn ở cuối trang */}
          <KamiElyDataScopeMatrix onOpenProofModal={handleOpenProofModal} />
          <KamiElySqlLabWorkbench />
          <KamiElyExecutiveStory />
        </div>
      )}

      {/* 6. MODAL XEM ẢNH CHỤP MÀN HÌNH ĐỘ PHÂN GIẢI GỐC (22 SCREENSHOTS) */}
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
