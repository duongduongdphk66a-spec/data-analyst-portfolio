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
import { Sparkles, ArrowRight } from 'lucide-react';

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
  openProofScreenshot: _openProofScreenshot = () => {},
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
        handleTabChange={handleTabChange}
      />

      {/* STRATEGIC NARRATIVE & RECOMMENDATIONS */}
      <ShopAnalysisNarrative isEn={isEn} />

      {/* CROSS-TAB NAVIGATION CTA (Placed at bottom of page) */}
      <div className="pt-6 border-t border-[#9BE7FA]/60 dark:border-slate-800">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-[#FFF9E6] to-[#FFE485]/40 border-2 border-[#FFD14C] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 dark:bg-gradient-to-br dark:from-[#041E24] dark:via-slate-900 dark:to-[#0D7287]/40 dark:border-[#9BE7FA] dark:shadow-xl transition-colors">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider dark:bg-[#9BE7FA] dark:text-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'DEEP-DIVE INTO THE ANCHOR CREATOR' : 'TIẾP TỤC KHÁM PHÁ: KÊNH CHÍNH CHỦ'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? 'Discover How @kamielyhn Generates 50% of Shop GMV' 
                : 'Tìm Hiểu Cách Kênh @kamielyhn Tạo Ra 50% Doanh Số Của Toàn Shop'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Analyze audience demographics, video conversion rates, 208 live sessions, and the 9.2B VND commercial capacity of the host.'
                : 'Khám phá nhân khẩu học khán giả, tỷ lệ chuyển đổi video, 208 phiên live và năng lực bán hàng 9,2 tỷ của host.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                handleTabChange('creator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#0D7287] hover:bg-[#095262] text-white dark:bg-[#9BE7FA] dark:hover:bg-[#72dbf3] dark:text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'View Creator Analysis (Part 2)' : 'Xem Phân Tích Creator (Phần 2)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleTabChange('science');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0D7287] text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'Data Science Case Study' : 'Nghiên Cứu Khoa Học Dữ Liệu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
