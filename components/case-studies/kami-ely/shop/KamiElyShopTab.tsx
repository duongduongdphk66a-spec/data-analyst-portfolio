'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { getShopChannelData, getShopContentData, getShopCategoryData } from '@/app/data/kamiElyData';
import ShopOverviewSection from './ShopOverviewSection';
import ShopSalesSection from './ShopSalesSection';
import ShopCatalogPricingSection from './ShopCatalogPricingSection';
import ShopAffiliateSection from './ShopAffiliateSection';
import ShopLiveVideoSection from './ShopLiveVideoSection';
import ShopAnalysisNarrative from './ShopAnalysisNarrative';

import type { KamiElyDataPayload } from '@/app/types/caseStudies';

export interface KamiElyShopTabProps {
  isEn?: boolean;
  copyDeepLink?: (_id: string) => void;
  handleExportChart?: (_id: string, _name: string) => void;
  openProofScreenshot?: (_id: string) => void;
  renderDataScopeMatrix?: (_scope: 'shop' | 'creator') => React.ReactNode;
  handleTabChange?: (_tab: 'science' | 'shop' | 'creator') => void;
  channelData?: Record<string, any[]>;
  contentData?: Record<string, any[]>;
  shopCategoryData?: Record<string, any[]>;
  channelMetric?: 'units' | 'gmv';
  setChannelMetric?: (_m: 'units' | 'gmv') => void;
  contentMetric?: 'units' | 'gmv';
  setContentMetric?: (_m: 'units' | 'gmv') => void;
  categoryMetric?: 'units' | 'gmv' | 'byCount';
  setCategoryMetric?: (_m: 'units' | 'gmv' | 'byCount') => void;
  priceMetric?: 'units' | 'gmv' | 'byCount';
  setPriceMetric?: (_m: 'units' | 'gmv' | 'byCount') => void;
  affMetric?: 'units' | 'gmv' | 'count';
  setAffMetric?: (_m: 'units' | 'gmv' | 'count') => void;
  affCatMetric?: 'units' | 'gmv' | 'count';
  setAffCatMetric?: (_m: 'units' | 'gmv' | 'count') => void;
  telemetryData?: KamiElyDataPayload | null;
}

export default function KamiElyShopTab({
  isEn: propIsEn,
  copyDeepLink = () => {},
  handleExportChart = () => {},
  openProofScreenshot = () => {},
  renderDataScopeMatrix = () => null,
  handleTabChange = () => {},
  channelData: propChannelData,
  contentData: propContentData,
  shopCategoryData: propShopCategoryData,
  channelMetric: controlledChannelMetric,
  setChannelMetric: controlledSetChannelMetric,
  contentMetric: controlledContentMetric,
  setContentMetric: controlledSetContentMetric,
  categoryMetric: controlledCategoryMetric,
  setCategoryMetric: controlledSetCategoryMetric,
  priceMetric: controlledPriceMetric,
  setPriceMetric: controlledSetPriceMetric,
  affMetric: controlledAffMetric,
  setAffMetric: controlledSetAffMetric,
  affCatMetric: controlledAffCatMetric,
  setAffCatMetric: controlledSetAffCatMetric,
  telemetryData
}: KamiElyShopTabProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn ?? (language === 'en');

  const channelData = propChannelData || getShopChannelData(isEn);
  const contentData = propContentData || getShopContentData(isEn);
  const shopCategoryData = propShopCategoryData || getShopCategoryData(isEn);

  const [channelMetric, setChannelMetric] = useState<'units' | 'gmv'>('units');
  const [contentMetric, setContentMetric] = useState<'units' | 'gmv'>('units');
  const [categoryMetric, setCategoryMetric] = useState<'units' | 'gmv' | 'byCount'>('units');
  const [priceMetric, setPriceMetric] = useState<'units' | 'gmv' | 'byCount'>('units');
  const [affMetric, setAffMetric] = useState<'units' | 'gmv' | 'count'>('units');
  const [affCatMetric, setAffCatMetric] = useState<'units' | 'gmv' | 'count'>('units');

  const activeChannelMetric = controlledChannelMetric ?? channelMetric;
  const activeSetChannelMetric = controlledSetChannelMetric ?? setChannelMetric;

  const activeContentMetric = controlledContentMetric ?? contentMetric;
  const activeSetContentMetric = controlledSetContentMetric ?? setContentMetric;

  const activeCategoryMetric = controlledCategoryMetric ?? categoryMetric;
  const activeSetCategoryMetric = controlledSetCategoryMetric ?? setCategoryMetric;

  const activePriceMetric = controlledPriceMetric ?? priceMetric;
  const activeSetPriceMetric = controlledSetPriceMetric ?? setPriceMetric;

  const activeAffMetric = controlledAffMetric ?? affMetric;
  const activeSetAffMetric = controlledSetAffMetric ?? setAffMetric;

  const activeAffCatMetric = controlledAffCatMetric ?? affCatMetric;
  const activeSetAffCatMetric = controlledSetAffCatMetric ?? setAffCatMetric;

  const [dynamicData, setDynamicData] = useState<KamiElyDataPayload | null>(telemetryData || null);

  useEffect(() => {
    if (telemetryData) {
      setDynamicData(telemetryData);
      return;
    }
    let active = true;
    fetch('/api/case-studies/kami-ely')
      .then((r) => r.json())
      .then((res) => {
        if (active && res.success && res.data) {
          setDynamicData(res.data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [telemetryData]);

  const activeData = telemetryData || dynamicData;

  return (
    <div className="space-y-16">
      <ShopOverviewSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        renderDataScopeMatrix={renderDataScopeMatrix}
        overviewKPIs={activeData?.shopOverview as any}
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
        channelMetric={activeChannelMetric}
        setChannelMetric={activeSetChannelMetric}
        contentMetric={activeContentMetric}
        setContentMetric={activeSetContentMetric}
        weeklyTrendData={activeData?.weeklyTrends}
      />

      <ShopCatalogPricingSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        shopCategoryData={shopCategoryData}
        categoryMetric={activeCategoryMetric}
        setCategoryMetric={activeSetCategoryMetric}
        priceMetric={activePriceMetric}
        setPriceMetric={activeSetPriceMetric}
        topSkus={activeData?.topSkus}
        isLiveDb={Boolean(activeData?.isLiveDb)}
      />

      <ShopAffiliateSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        affMetric={activeAffMetric}
        setAffMetric={activeSetAffMetric}
        affCatMetric={activeAffCatMetric}
        setAffCatMetric={activeSetAffCatMetric}
        topAffiliates={activeData?.topAffiliates}
        isLiveDb={Boolean(activeData?.isLiveDb)}
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

      {/* STRATEGIC NARRATIVE & RECOMMENDATIONS */}
      <ShopAnalysisNarrative isEn={isEn} />
    </div>
  );
}
