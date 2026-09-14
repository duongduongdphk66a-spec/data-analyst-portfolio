'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { scrollToSection, centerTabInContainer, useCaseStudyActions } from '@/app/lib/uiHelpers';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import ExecutiveSummary from './ExecutiveSummary';
import {
  fastmossScreenshotsManifest,
  FastMossScreenshotItem,
  getShopChannelData,
  getShopContentData,
  getShopCategoryData
} from '@/app/data/kamiElyData';

import KamiElyTabsNav, { NavItemDef } from './kami-ely/KamiElyTabsNav';
import KamiElyHero from './kami-ely/KamiElyHero';
import KamiElyProofModal from './kami-ely/KamiElyProofModal';
import KamiElyDataScopeMatrix from './kami-ely/KamiElyDataScopeMatrix';
import KamiElyScienceCaseStudy from './kami-ely/science/KamiElyScienceCaseStudy';
import KamiElyShopTab from './kami-ely/shop/KamiElyShopTab';
import KamiElyCreatorTab from './kami-ely/creator/KamiElyCreatorTab';

interface KamiElyProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function KamiElyProject({ onBack, isEmbedded = false }: KamiElyProjectProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const router = useRouter();

  // Active Major Tab state: 'science' (data science) vs 'shop' (store) vs 'creator' (seller)
  const [activeTab, setActiveTab] = useState<'science' | 'shop' | 'creator'>('science');

  // FastMoss Proof screenshots modal & inspector lightbox
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedProofGroup, setSelectedProofGroup] = useState<'all' | 'shop' | 'creator'>('all');
  const [activeScreenshot, setActiveScreenshot] = useState<FastMossScreenshotItem | null>(null);

  // Dynamic filter toggles for Shop tab
  const [channelMetric, setChannelMetric] = useState<'units' | 'gmv'>('units');
  const [contentMetric, setContentMetric] = useState<'units' | 'gmv'>('units');
  const [categoryMetric, setCategoryMetric] = useState<'units' | 'gmv' | 'byCount'>('units');
  const [priceMetric, setPriceMetric] = useState<'units' | 'gmv' | 'byCount'>('units');
  const [affMetric, setAffMetric] = useState<'units' | 'gmv' | 'count'>('units');
  const [affCatMetric, setAffCatMetric] = useState<'units' | 'gmv' | 'count'>('units');

  const subnavContainerRef = useRef<HTMLDivElement>(null);

  const openProofScreenshot = (id: string) => {
    const sc = fastmossScreenshotsManifest.find((s) => s.id === id);
    if (sc) {
      setActiveScreenshot(sc);
      setIsProofModalOpen(true);
    }
  };

  const openProofModalWithGroup = (group: 'shop' | 'creator') => {
    setActiveScreenshot(null);
    setSelectedProofGroup(group);
    setIsProofModalOpen(true);
  };

  const { copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);
  const handleCopyDeepLink = (id: string, title = '') => copyDeepLink(id, title);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeScreenshot) {
          setActiveScreenshot(null);
        } else if (isProofModalOpen) {
          setIsProofModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProofModalOpen, activeScreenshot]);

  const channelData = getShopChannelData(isEn);
  const contentData = getShopContentData(isEn);
  const shopCategoryData = getShopCategoryData(isEn);

  const scienceNavItems: NavItemDef[] = useMemo(() => [
    { id: 'sec-hero', label: isEn ? '1. Executive Overview' : '1. Tổng quan phân tích', badge: '1' },
    { id: 'sec-eda', label: isEn ? '2. Outlier Detection' : '2. Lọc điểm dị biệt', badge: '2' },
    { id: 'sec-hypothesis', label: isEn ? '3. Video vs Live GPM' : '3. Hiệu suất Video vs Live', badge: '3' },
    { id: 'sec-correlation', label: isEn ? '4. Live Duration Limit' : '4. Giới hạn giờ Live', badge: '4' },
    { id: 'sec-timeseries', label: isEn ? '5. Seasonality Analysis' : '5. Chu kỳ mùa vụ 180N', badge: '5' },
    { id: 'sec-optimization', label: isEn ? '6. Resource Optimization' : '6. Chiến lược tối ưu', badge: '6' },
  ], [isEn]);

  const shopNavItems: NavItemDef[] = useMemo(() => [
    { id: 'shop-overview', label: isEn ? '1.1 Overview' : '1.1 Tổng quan', badge: '1.1' },
    { id: 'shop-sales', label: isEn ? '1.2 Sales' : '1.2 Bán hàng', badge: '1.2', dividerBefore: true },
    { id: 'shop-products', label: isEn ? '1.3 Products' : '1.3 Sản phẩm', badge: '1.3' },
    { id: 'shop-affiliates', label: isEn ? '1.4 Affiliates' : '1.4 Affiliates', badge: '1.4', dividerBefore: true },
    { id: 'shop-live', label: isEn ? '1.5 Livestream' : '1.5 Livestream', badge: '1.5' },
    { id: 'shop-video', label: isEn ? '1.6 Video' : '1.6 Video', badge: '1.6' },
    { id: 'shop-self-operated', label: isEn ? '1.7 Self-Operated' : '1.7 Tự vận hành', badge: '1.7', dividerBefore: true },
  ], [isEn]);

  const creatorNavItems: NavItemDef[] = useMemo(() => [
    { id: 'creator-overview', label: isEn ? '2.1 Overview' : '2.1 Tổng quan', badge: '2.1' },
    { id: 'creator-activity', label: isEn ? '2.2 Activity' : '2.2 Hoạt động', badge: '2.2' },
    { id: 'creator-followers', label: isEn ? '2.3 Followers' : '2.3 Người theo dõi', badge: '2.3' },
    { id: 'creator-video', label: isEn ? '2.4 Video' : '2.4 Video', badge: '2.4', dividerBefore: true },
    { id: 'creator-live', label: isEn ? '2.5 Livestream' : '2.5 Livestream', badge: '2.5' },
    { id: 'creator-sales', label: isEn ? '2.6 Sales & 180d' : '2.6 Bán hàng & 180N', badge: '2.6', dividerBefore: true },
    { id: 'creator-collaborative', label: isEn ? '2.7 Top Stores' : '2.7 Cửa hàng hợp tác', badge: '2.7' },
  ], [isEn]);

  const currentNavItems = useMemo(() => {
    if (activeTab === 'science') return scienceNavItems;
    if (activeTab === 'shop') return shopNavItems;
    return creatorNavItems;
  }, [activeTab, scienceNavItems, shopNavItems, creatorNavItems]);

  const currentSectionIds = useMemo(() => currentNavItems.map(item => item.id), [currentNavItems]);
  const { activeSection, scrollProgress, setActiveSection } = useScrollSpy(currentSectionIds, 130);

  const handleTabChange = (tab: 'science' | 'shop' | 'creator') => {
    setActiveTab(tab);
    if (tab === 'science') {
      setActiveSection('sec-hero');
    } else if (tab === 'shop') {
      setActiveSection('shop-overview');
    } else {
      setActiveSection('creator-overview');
    }
  };

  // Auto-scroll horizontal taskbar to keep active tab centered
  useEffect(() => {
    if (activeSection) {
      centerTabInContainer(subnavContainerRef.current, `nav-tab-${activeSection}`);
    }
  }, [activeSection]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSection(id);
    scrollToSection(id, 16);
  };

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Kami Ely TikTok Shop & Creator Analytics', 'proj-kami-ely', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  const renderDataScopeMatrix = (scopeType: 'shop' | 'creator') => (
    <KamiElyDataScopeMatrix
      scopeType={scopeType}
      isEn={isEn}
      openProofScreenshot={openProofScreenshot}
      openProofModalWithGroup={openProofModalWithGroup}
    />
  );

  return (
    <div className="min-h-screen bg-[#FAFDFE] font-sans text-slate-900 selection:bg-[#9BE7FA]/60 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar + Subnav */}
      <KamiElyTabsNav
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        handleBack={handleBack}
        isEmbedded={isEmbedded}
        isEn={isEn}
        onOpenProofModal={() => {
          setActiveScreenshot(null);
          setSelectedProofGroup(activeTab === 'shop' ? 'shop' : 'creator');
          setIsProofModalOpen(true);
        }}
        currentNavItems={currentNavItems}
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        subnavContainerRef={subnavContainerRef}
        handleNavClick={handleNavClick}
      />

      {/* Main Hero Header */}
      <KamiElyHero isEn={isEn} activeTab={activeTab} />

      {/* BODY CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Executive Summary — 60-second overview */}
        <ExecutiveSummary
          isEn={isEn}
          readingTime={isEn ? '~3 min deep dive' : '~3 phút đọc chi tiết'}
          problem={isEn
            ? 'Resource allocation paradox: Live channel consumes most broadcast hours but yields only 30.2k VND GPM, while Short-video achieves 135.2k VND. Need to isolate whether the Aug-Sep revenue dip is seasonal or operational.'
            : 'Nghịch lý phân bổ tài nguyên: Kênh Live chiếm đa số thời lượng nhưng chỉ đạt GPM 30,2k VNĐ, trong khi Short-video đạt 135,2k VNĐ. Cần bóc tách sụt giảm doanh số tháng 8-9 do mùa vụ hay lỗi vận hành.'}
          method={isEn
            ? 'Compare 551 video vs 470 live sessions (independent samples), model saturation curves to find optimal live duration (~3.1h/day), and decompose 180-day time series into Trend + Seasonality + Residual components.'
            : 'So sánh 2 nhóm mẫu độc lập (551 video và 470 phiên live), mô hình hóa đường cong hiệu suất xác định điểm bão hòa ~3.1h/ngày, và phân rã 3 thành phần chuỗi thời gian 180 ngày.'}
          insight={isEn
            ? 'Video outperforms Live by 4.48x GPM with high statistical significance (p<0.0001). Summer travel seasonality explains 85% of the post-July drop. Cutting 50% excess live hours and adding shopping carts to 100% of videos optimizes cash flow.'
            : 'Video sinh lời vượt trội 4.48 lần có ý nghĩa thống kê cao (p<0.0001). Chu kỳ mùa vụ du lịch hè lý giải 85% mức sụt giảm. Cắt giảm 50% giờ live dư thừa và phủ 100% giỏ hàng video tối ưu dòng tiền.'}
          metrics={[
            { label: isEn ? 'Total Ecosystem GMV' : 'Tổng GMV Hệ Sinh Thái', value: isEn ? '31.6B' : '31.6 Tỷ', change: isEn ? '238.4k items' : '238.4k sản phẩm', isPositive: true },
            { label: isEn ? 'Self-Operated GMV' : 'Kênh Tự Vận Hành', value: isEn ? '9.2B' : '9.2 Tỷ', change: isEn ? '49.3% Shop GMV' : '49.3% GMV shop', isPositive: true },
            { label: isEn ? 'Video vs Live GPM' : 'Chênh Lệch GPM', value: '4.5x', change: isEn ? '135k vs 30k VND' : '135k vs 30k VNĐ', isPositive: true },
            { label: isEn ? 'Affiliate Leverage' : 'Mạng Lưới Affiliate', value: '5.7k', change: isEn ? '>95% Nano/Micro KOC' : '>95% DS từ Nano/Micro', isPositive: true },
          ]}
          tools={['Python (scipy.stats & statsmodels)', 'Statistical Analysis', 'Time-Series Modeling', 'Recharts']}
        />
        {/* TAB 1: KHOA HỌC DỮ LIỆU */}
        {activeTab === 'science' && (
          <div className="space-y-12">
            <KamiElyScienceCaseStudy onBack={onBack} isEmbedded={isEmbedded} />

            {/* Cross-Tab Navigation CTA: Science -> Shop & Creator */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#F0FBFE] to-[#C8EEF7]/40 border-2 border-[#0D7287] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 dark:bg-slate-900 dark:border-slate-700">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8EEF7] text-[#0D7287] text-xs font-black uppercase tracking-wider dark:bg-slate-800 dark:text-[#9BE7FA]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'BUSINESS INTELLIGENCE DASHBOARDS' : 'DASHBOARD DỮ LIỆU THƯƠNG MẠI THỰC TẾ'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                    {isEn 
                      ? 'Explore Full FastMoss Telemetry Dashboards' 
                      : 'Khám Phá Dữ Liệu Thực Tế FastMoss Của Toàn Shop & Creator'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'View detailed breakdowns of 338 SKUs, 5.7k affiliate creators, 7,000 live streams, and independent audit screenshot proofs.'
                      : 'Trực quan hóa chi tiết 338 mã sản phẩm, mạng lưới 5.700 KOC affiliate, 7.000 phiên livestream cùng kho bằng chứng viễn trắc 36 ảnh gốc FastMoss.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      handleTabChange('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#0D7287] hover:bg-[#095262] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'View Shop Analysis (Part 1)' : 'Xem Phân Tích Shop (Phần 1)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange('creator');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-[#FFD14C] hover:bg-[#f5c332] text-slate-950 font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'View Creator (Part 2)' : 'Xem Creator (Phần 2)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHOP (KAMI ELY OFFICIAL STORE) */}
        {activeTab === 'shop' && (
          <KamiElyShopTab
            isEn={isEn}
            copyDeepLink={handleCopyDeepLink}
            handleExportChart={handleExportChart}
            openProofScreenshot={openProofScreenshot}
            renderDataScopeMatrix={renderDataScopeMatrix}
            handleTabChange={handleTabChange}
            channelData={channelData}
            contentData={contentData}
            shopCategoryData={shopCategoryData}
            channelMetric={channelMetric}
            setChannelMetric={setChannelMetric}
            contentMetric={contentMetric}
            setContentMetric={setContentMetric}
            categoryMetric={categoryMetric}
            setCategoryMetric={setCategoryMetric}
            priceMetric={priceMetric}
            setPriceMetric={setPriceMetric}
            affMetric={affMetric}
            setAffMetric={setAffMetric}
            affCatMetric={affCatMetric}
            setAffCatMetric={setAffCatMetric}
          />
        )}

        {/* TAB 3: CREATOR (KAMIELYN - @kamielyhn) */}
        {activeTab === 'creator' && (
          <KamiElyCreatorTab
            isEn={isEn}
            copyDeepLink={handleCopyDeepLink}
            openProofScreenshot={openProofScreenshot}
            handleExportChart={handleExportChart}
            handleTabChange={handleTabChange}
            renderDataScopeMatrix={renderDataScopeMatrix}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-[#9BE7FA]/40 text-center text-xs text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            Dự Án Phân Tích Hiệu Suất TikTok Shop & Người Bán Kamielyn
          </p>
          <p>
            Dữ liệu tổng hợp từ FastMoss · Portfolio Data Analyst · Ma Văn Hùng
          </p>
        </div>
      </footer>

      {/* FastMoss Proof Gallery Modal */}
      <KamiElyProofModal
        isEn={isEn}
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        selectedProofGroup={selectedProofGroup}
        setSelectedProofGroup={setSelectedProofGroup}
        activeScreenshot={activeScreenshot}
        setActiveScreenshot={setActiveScreenshot}
      />
    </div>
  );
}
