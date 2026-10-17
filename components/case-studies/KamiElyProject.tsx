'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

// Khối Điều hành & Bộ Biểu đồ Trực quan Cấp cao
import KamiElyHero from '@/components/case-studies/kami-ely/KamiElyHero';
import KamiElyTabsNav, { KamiElyTabKey } from '@/components/case-studies/kami-ely/KamiElyTabsNav';
import KamiElyVisualChartsSuite from '@/components/case-studies/kami-ely/KamiElyVisualChartsSuite';
import KamiElyExecutiveStory from '@/components/case-studies/kami-ely/KamiElyExecutiveStory';
import KamiElyDataScopeMatrix from '@/components/case-studies/kami-ely/KamiElyDataScopeMatrix';
import KamiElySqlLabWorkbench from '@/components/case-studies/kami-ely/KamiElySqlLabWorkbench';
import KamiElySqlPlaybook from '@/components/case-studies/kami-ely/playbook/KamiElySqlPlaybook';

// 3 Phân hệ Tab Chuyên sâu (Shop • Creator • Science)
import KamiElyShopTab from '@/components/case-studies/kami-ely/shop/KamiElyShopTab';
import KamiElyCreatorTab from '@/components/case-studies/kami-ely/creator/KamiElyCreatorTab';
import KamiElyScienceCaseStudy from '@/components/case-studies/kami-ely/science/KamiElyScienceCaseStudy';
import ScienceOptimizerSection from '@/components/case-studies/kami-ely/science/ScienceOptimizerSection';
import KamiElyProofModal from '@/components/case-studies/kami-ely/KamiElyProofModal';
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

  // Quản lý Tab chuyên sâu ('shop' | 'creator' | 'science')
  const [activeTab, setActiveTab] = useState<KamiElyTabKey>('shop');

  // Chế độ "Đọc lướt 3 phút cho HR" (Chỉ hiện Biểu đồ + Hình ảnh + Simulator, ẩn bảng chữ dài)
  const [isExecutiveScanMode, setIsExecutiveScanMode] = useState<boolean>(false);


  // Quản lý Modal Xem Bằng Chứng Dữ Liệu Gốc Telemetry
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [initialScreenshotId, setInitialScreenshotId] = useState<string | undefined>(undefined);

  const handleOpenProofModal = useCallback((id?: string) => {
    setInitialScreenshotId(id);
    setIsProofModalOpen(true);
  }, []);

  // Cuộn mượt về đầu vùng nội dung tương ứng khi chọn giữa 3 Phân hệ
  const handleSelectMainTab = useCallback((tab: KamiElyTabKey) => {
    setActiveTab(tab);
    if (isExecutiveScanMode) {
      setIsExecutiveScanMode(false);
    }
    setTimeout(() => {
      const targetId = tab === 'shop' ? 'sec-shop' : tab === 'creator' ? 'sec-creator' : 'sec-science';
      const el = document.getElementById(targetId);
      if (el && typeof window !== 'undefined') {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 40);
  }, [isExecutiveScanMode]);

  // ScrollSpy theo dõi vị trí cuộn để cập nhật tab tương ứng
  useEffect(() => {
    if (isExecutiveScanMode) return;
    const sectionIds: { id: string; key: KamiElyTabKey }[] = [
      { id: 'sec-shop', key: 'shop' },
      { id: 'sec-creator', key: 'creator' },
      { id: 'sec-science', key: 'science' },
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sectionIds[i].key);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExecutiveScanMode]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. HERO BENTO GRID: Định vị All-Time (31,6 Tỉ) • 180 Ngày (12,74 Tỉ) • 90 Ngày (6,14 Tỉ) */}
      <KamiElyHero
        onOpenProofModal={handleOpenProofModal}
        onJumpToStory={() => setIsExecutiveScanMode(true)}
      />

      {/* 2. BỘ 6 BIỂU ĐỒ TƯƠNG TÁC & DẢI 6 ẢNH CHỤP MÀN HÌNH THẬT (VISUAL-FIRST SUITE) */}
      <KamiElyVisualChartsSuite />


      {/* 4. THANH ĐIỀU HƯỚNG CỐ ĐỊNH 3 PHÂN HỆ & NÚT CHẾ ĐỘ ĐỌC LƯỚT 3 PHÚT CHO HR */}
      <KamiElyTabsNav
        activeTab={activeTab}
        onTabChange={handleSelectMainTab}
        isExecutiveScanMode={isExecutiveScanMode}
        onToggleExecutiveScanMode={() => setIsExecutiveScanMode((prev) => !prev)}
        onOpenProofModal={() => handleOpenProofModal()}
      />

      {/* 5. NỘI DUNG HIỂN THỊ THEO CHẾ ĐỘ (3-MIN SCAN MODE VS. FULL 3-TAB DEEP DIVE) */}
      {isExecutiveScanMode ? (
        <div className="space-y-8 animate-fadeIn">
          <KamiElySqlPlaybook />
          <ScienceOptimizerSection />
          <KamiElyExecutiveStory />
          <KamiElyDataScopeMatrix onOpenProofModal={handleOpenProofModal} />
          <KamiElySqlLabWorkbench />
        </div>
      ) : (
        <div className="space-y-16">
          {/* 1. PHÂN HỆ TOÀN GIAN HÀNG */}
          <section id="sec-shop" className="scroll-mt-28 space-y-8">
            <KamiElyShopTab handleTabChange={handleSelectMainTab} />
          </section>

          {/* 2. PHÂN HỆ KÊNH CHÍNH CHỦ */}
          <section id="sec-creator" className="scroll-mt-28 space-y-8 pt-10 border-t border-slate-200 dark:border-slate-800">
            <KamiElyCreatorTab handleTabChange={handleSelectMainTab} />
          </section>

          {/* 3. THỐNG KÊ & MÔ PHỎNG ROI */}
          <section id="sec-science" className="scroll-mt-28 space-y-8 pt-10 border-t border-slate-200 dark:border-slate-800">
            <KamiElyScienceCaseStudy />
          </section>

          {/* 4. SQL PLAYBOOK 7 GIAI ĐOẠN (BIỂU ĐỒ TRƯỚC, SQL MỞ KHI CẦN) */}
          <KamiElySqlPlaybook />

          {/* Ma trận Kiểm toán 8 Bảng gốc & Phòng thí nghiệm SQL đặt gọn ở cuối trang */}
          <KamiElyDataScopeMatrix onOpenProofModal={handleOpenProofModal} />
          <KamiElySqlLabWorkbench />
          <KamiElyExecutiveStory />
        </div>
      )}

      {/* FOOTER ĐIỀU HƯỚNG */}
      <CaseStudyFooter
        isEn={lang === 'en'}
        currentProjectId="proj-kami-ely"
        attribution={{
          datasetVi: 'Dữ liệu E-Commerce Analytics, TikTok Seller Center & Live Workbench',
          datasetEn: 'E-Commerce Analytics, TikTok Seller Center & Live Workbench Telemetry',
          scopeVi: '180 ngày (09/03/2026 – 04/09/2026), 8 tập dữ liệu và 18.778 bản ghi đối soát SSOT',
          scopeEn: '180-day window (Mar 09 – Sep 04, 2026), 8 raw datasets, 18,778 audited rows SSOT',
        }}
      />

      {/* MODAL XEM 22 BẰNG CHỨNG DỮ LIỆU GỐC TELEMETRY */}
      <KamiElyProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        initialScreenshotId={initialScreenshotId}
        isEn={lang === 'en'}
      />
    </div>
  );
}
