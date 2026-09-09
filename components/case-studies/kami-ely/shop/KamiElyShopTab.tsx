'use client';

import React from 'react';
import ShopOverviewSection from './ShopOverviewSection';
import ShopSalesSection from './ShopSalesSection';
import ShopCatalogPricingSection from './ShopCatalogPricingSection';
import ShopAffiliateSection from './ShopAffiliateSection';
import ShopLiveVideoSection from './ShopLiveVideoSection';

interface KamiElyShopTabProps {
  isEn: boolean;
  copyDeepLink: (id: string) => void;
  handleExportChart: (id: string, name: string) => void;
  openProofScreenshot: (id: string) => void;
  renderDataScopeMatrix: (scope: 'shop' | 'creator') => React.ReactNode;
  handleTabChange: (tab: 'science' | 'shop' | 'creator') => void;
  channelData: Record<string, any[]>;
  contentData: Record<string, any[]>;
  shopCategoryData: Record<string, any[]>;
  channelMetric: 'units' | 'gmv';
  setChannelMetric: (m: 'units' | 'gmv') => void;
  contentMetric: 'units' | 'gmv';
  setContentMetric: (m: 'units' | 'gmv') => void;
  categoryMetric: 'units' | 'gmv' | 'byCount';
  setCategoryMetric: (m: 'units' | 'gmv' | 'byCount') => void;
  priceMetric: 'units' | 'gmv' | 'byCount';
  setPriceMetric: (m: 'units' | 'gmv' | 'byCount') => void;
  affMetric: 'units' | 'gmv' | 'count';
  setAffMetric: (m: 'units' | 'gmv' | 'count') => void;
  affCatMetric: 'units' | 'gmv' | 'count';
  setAffCatMetric: (m: 'units' | 'gmv' | 'count') => void;
}

export default function KamiElyShopTab({
  isEn,
  copyDeepLink,
  handleExportChart,
  openProofScreenshot,
  renderDataScopeMatrix,
  handleTabChange,
  channelData,
  contentData,
  shopCategoryData,
  channelMetric,
  setChannelMetric,
  contentMetric,
  setContentMetric,
  categoryMetric,
  setCategoryMetric,
  priceMetric,
  setPriceMetric,
  affMetric,
  setAffMetric,
  affCatMetric,
  setAffCatMetric
}: KamiElyShopTabProps) {
  return (
    <div className="space-y-16">
      <ShopOverviewSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        renderDataScopeMatrix={renderDataScopeMatrix}
      />

      {/* GROUP DIVIDER: DOANH SỐ & SẢN PHẨM */}
      <div className="pt-6 pb-2 flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 shadow-xs">
          {isEn ? 'Group II: Sales & Product Matrix' : 'Nhóm II: Doanh Số & Ma Trận Sản Phẩm'}
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
      </div>

      <ShopSalesSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        handleExportChart={handleExportChart}
        channelData={channelData}
        contentData={contentData}
        channelMetric={channelMetric}
        setChannelMetric={setChannelMetric}
        contentMetric={contentMetric}
        setContentMetric={setContentMetric}
      />

      <ShopCatalogPricingSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        shopCategoryData={shopCategoryData}
        categoryMetric={categoryMetric}
        setCategoryMetric={setCategoryMetric}
        priceMetric={priceMetric}
        setPriceMetric={setPriceMetric}
      />

      <ShopAffiliateSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        affMetric={affMetric}
        setAffMetric={setAffMetric}
        affCatMetric={affCatMetric}
        setAffCatMetric={setAffCatMetric}
      />

      {/* GROUP DIVIDER: KÊNH TỰ VẬN HÀNH CHÍNH CHỦ */}
      <div className="pt-6 pb-2 flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 shadow-xs">
          {isEn ? 'Group IV: Anchor Host & Brand Synergy' : 'Nhóm IV: Kênh Sáng Tạo Tự Vận Hành & Cộng Hưởng Thương Hiệu'}
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
      </div>

      <ShopLiveVideoSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        handleTabChange={handleTabChange}
      />
    </div>
  );
}
