'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { TrendingUp, Video, Layers, Users, Lightbulb } from 'lucide-react';
import { MINTO_NARRATIVE } from '@/app/data/kami-ely/mintoNarrative';
import { getShopChannelData, getShopContentData, getShopCategoryData } from '@/app/data/kamiElyData';

// Sub-components
import ShopOverviewSection from '../shop/ShopOverviewSection';
import ShopSalesSection from '../shop/ShopSalesSection';
import ShopLiveVideoSection from '../shop/ShopLiveVideoSection';
import ShopCatalogPricingSection from '../shop/ShopCatalogPricingSection';
import ShopAffiliateSection from '../shop/ShopAffiliateSection';

import CreatorSalesSection from '../creator/CreatorSalesSection';
import CreatorActivitySection from '../creator/CreatorActivitySection';
import CreatorContentSection from '../creator/CreatorContentSection';
import CreatorAudienceSection from '../creator/CreatorAudienceSection';
import CreatorProfileSection from '../creator/CreatorProfileSection';

import type { KamiElyDataPayload } from '@/app/types/caseStudies';
import type { KamiElyTabKey } from '../KamiElyTabsNav';

export interface KamiElyCommercialTabProps {
  isEn?: boolean;
  handleTabChange?: (_tab: KamiElyTabKey) => void;
  onOpenProofModal?: (_screenshotId?: string) => void;
  copyDeepLink?: (_id: string) => void;
  telemetryData?: KamiElyDataPayload | null;
}

export default function KamiElyCommercialTab({
  isEn: propIsEn,
  handleTabChange = () => {},
  onOpenProofModal = () => {},
  copyDeepLink = () => {},
  telemetryData
}: KamiElyCommercialTabProps) {
  const { language } = useLanguage();
  const isEn = propIsEn ?? (language === 'en');
  const lang = isEn ? 'en' : 'vi';
  const text = MINTO_NARRATIVE.tab1;

  // Controlled metrics state for shop sections
  const [channelMetric, setChannelMetric] = useState<'units' | 'gmv'>('gmv');
  const [contentMetric, setContentMetric] = useState<'units' | 'gmv'>('gmv');
  const [affMetric, setAffMetric] = useState<'units' | 'gmv' | 'count'>('gmv');
  const [affCatMetric, setAffCatMetric] = useState<'units' | 'gmv' | 'count'>('gmv');

  const channelData = getShopChannelData(isEn);
  const contentData = getShopContentData(isEn);
  const shopCategoryData = getShopCategoryData(isEn);

  return (
    <div className="w-full space-y-16">
      {/* ==================================================================== */}
      {/* MỤC 1.1: BỨC TRANH DOANH THU & TĂNG TRƯỞNG (#3, #4)                */}
      {/* ==================================================================== */}
      <section id="sec-1-1-revenue" className="space-y-6 scroll-mt-28">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec1_1.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec1_1.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec1_1.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #3: Diễn biến GMV & Đơn hàng + Biểu đồ #4: Cơ cấu nguồn tạo đơn */}
        <ShopSalesSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          handleExportChart={() => {}}
          channelData={channelData}
          contentData={contentData}
          channelMetric={channelMetric}
          setChannelMetric={setChannelMetric}
          contentMetric={contentMetric}
          setContentMetric={setContentMetric}
        />

        <ShopOverviewSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          renderDataScopeMatrix={() => null}
        />
      </section>

      {/* ==================================================================== */}
      {/* MỤC 1.2: CHUYỂN ĐỔI NỘI DUNG: VIDEO NGẮN VS. LIVESTREAM (#5, #6, #7) */}
      {/* ==================================================================== */}
      <section id="sec-1-2-content" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec1_2.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec1_2.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec1_2.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #5: So sánh song song GMV và CVR giữa Livestream và Video ngắn */}
        <ShopLiveVideoSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          openProofScreenshot={onOpenProofModal}
          handleTabChange={(tab) => handleTabChange(tab as KamiElyTabKey)}
        />

        {/* Biểu đồ #6: Tương quan Views, Engagement và Sales */}
        <CreatorSalesSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          handleTabChange={(tab) => handleTabChange(tab as KamiElyTabKey)}
          collaborativeStores={telemetryData?.collaborativeStores as any}
        />

        {/* Biểu đồ #7: Bản đồ nhiệt (Activity Heatmap) & Khung giờ vàng */}
        <CreatorActivitySection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          handleExportChart={() => {}}
          hourlyActivity={telemetryData?.hourlyActivity as any}
          activityHighlights={telemetryData?.activityHighlights as any}
        />

        <CreatorContentSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          topVideos={telemetryData?.videos as any}
          topLiveStreams={telemetryData?.livestreams as any}
        />
      </section>

      {/* ==================================================================== */}
      {/* MỤC 1.3: CHIẾN LƯỢC DANH MỤC SKU & ĐỊNH GIÁ (#8, #9)               */}
      {/* ==================================================================== */}
      <section id="sec-1-3-sku" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec1_3.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec1_3.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec1_3.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #8: Pareto Top SKU + Biểu đồ #9: Dải giá Price Tier */}
        <ShopCatalogPricingSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          openProofScreenshot={onOpenProofModal}
          shopCategoryData={shopCategoryData}
        />
      </section>

      {/* ==================================================================== */}
      {/* MỤC 1.4: MẠNG LƯỚI AFFILIATE & CHÂN DUNG KHÁN GIẢ (#10, #11, #12)  */}
      {/* ==================================================================== */}
      <section id="sec-1-4-affiliate" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec1_4.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec1_4.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec1_4.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #10: Xếp hạng GMV theo Affiliate Tiers */}
        <ShopAffiliateSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          openProofScreenshot={onOpenProofModal}
          affMetric={affMetric}
          setAffMetric={setAffMetric}
          affCatMetric={affCatMetric}
          setAffCatMetric={setAffCatMetric}
        />

        {/* Biểu đồ #11: Phân bổ Độ tuổi & Giới tính */}
        <CreatorAudienceSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
        />

        {/* Biểu đồ #12: Chỉ số sức khỏe kênh Creator */}
        <CreatorProfileSection
          isEn={isEn}
          copyDeepLink={copyDeepLink}
          renderDataScopeMatrix={() => null}
          profile={telemetryData?.creatorProfile as any}
          collaborativeStores={telemetryData?.collaborativeStores as any}
        />
      </section>
    </div>
  );
}
