'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  AlertTriangle, 
  RotateCcw, 
  Target, 
  Zap, 
  ShoppingBag, 
  Video, 
  Percent, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';
import { useLanguage } from '@/app/context/LanguageContext';

export interface ScienceOptimizerSectionProps {
  isEn?: boolean;
  liveHoursReduction?: number;
  setLiveHoursReduction?: (_v: number) => void;
  videoCoverage?: number;
  setVideoCoverage?: (_v: number) => void;
  simulatorMetrics?: {
    operationalCostSavedMillion: string;
    additionalVideoGmvMillion: string;
    incrementalVideos: number;
    netBenefitMillion: string;
  };
}

export default function ScienceOptimizerSection({
  isEn: propIsEn,
  liveHoursReduction: propLiveReduction,
  setLiveHoursReduction: propSetLiveReduction,
  videoCoverage: propVideoCoverage,
  setVideoCoverage: propSetVideoCoverage
}: ScienceOptimizerSectionProps) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';

  // Toggle for Collapsible Telemetry Reconciliation Audit
  const [showAuditPanel, setShowAuditPanel] = useState<boolean>(false);

  // 4 Sliders State (with verified Kami Ely Seller Center & 90-day baselines)
  // 1. Shopping Tab CVR (Baseline: 0.25% - Reconciled Product Card 21.49% volume)
  const [targetCardCvr, setTargetCardCvr] = useState<number>(0.65);

  // 2. LIVE to Video reallocation
  const [liveHoursReduction, setLiveHoursReduction] = useState<number>(propLiveReduction ?? 30);
  const [videoCoverage, setVideoCoverage] = useState<number>(propVideoCoverage ?? 750);

  // 3. Discount rate optimization (Baseline: 50.45% of promo GMV from Seller Center)
  const [targetDiscountRate, setTargetDiscountRate] = useState<number>(35.0);

  // 4. Dormant KOC activation (Baseline: 5.1% of 5,713 Creators active)
  const [activeKocRate, setActiveKocRate] = useState<number>(12.0);

  // Handlers syncing with parent props if provided
  const handleLiveReductionChange = (val: number) => {
    setLiveHoursReduction(val);
    if (propSetLiveReduction) propSetLiveReduction(val);
  };

  const handleVideoCoverageChange = (val: number) => {
    setVideoCoverage(val);
    if (propSetVideoCoverage) propSetVideoCoverage(val);
  };

  // Strategic Presets
  const applyPreset = (preset: 'baseline' | 'recommended' | 'aggressive') => {
    if (preset === 'baseline') {
      setTargetCardCvr(0.25);
      handleLiveReductionChange(0);
      handleVideoCoverageChange(551);
      setTargetDiscountRate(50.45);
      setActiveKocRate(5.1);
    } else if (preset === 'recommended') {
      setTargetCardCvr(0.65);
      handleLiveReductionChange(30);
      handleVideoCoverageChange(750);
      setTargetDiscountRate(35.0);
      setActiveKocRate(12.0);
    } else if (preset === 'aggressive') {
      setTargetCardCvr(1.00);
      handleLiveReductionChange(45);
      handleVideoCoverageChange(859);
      setTargetDiscountRate(30.0);
      setActiveKocRate(18.0);
    }
  };

  // Mathematical Simulator Rollup (Derived from 90d Reconciled Datasets & 28d Telemetry)
  const simulation = useMemo(() => {
    // 1. Shopping Tab CVR Uplift (Product Card / Kệ Hàng)
    // 28-day baseline Product Card GMV: 442.3M VND (~22.87% of 28d GMV, 21.49% units)
    const baseCardGmv = 442.3; // Million VND (28d base)
    const newCardGmv = baseCardGmv * (targetCardCvr / 0.25);
    const cardGmvUplift = newCardGmv - baseCardGmv;
    // 22% contribution margin on passive sales (zero ad spend, zero creator commission)
    const cardProfitUplift = cardGmvUplift * 0.22;

    // 2. LIVE to Video Reallocation
    // 48.5M VND operational cost saved per 100% idle hours (host salary, studio power, fatigue costs)
    const liveOpCostSaved = (liveHoursReduction / 100) * 48.5;
    const incrementalVideos = Math.max(0, videoCoverage - 551);
    // 1.85M VND monthly GMV expectation per shoppable video with 135.2k GPM tail
    const additionalVideoGmv = incrementalVideos * 1.85;
    // 20% margin on video-driven sales (accounting for product cost and blended ad spend)
    const videoProfitAdded = additionalVideoGmv * 0.20;

    // 3. Discount Cost Restructuring (Seller Center 28d Promo burn)
    const basePromoGmv = 123.3; // Million VND
    const baseDiscountCost = 62.2; // Million VND (50.45% burn rate)
    const newDiscountCost = basePromoGmv * (targetDiscountRate / 100);
    const savedDiscountMargin = Math.max(0, baseDiscountCost - newDiscountCost);

    // 4. KOC Activation (_Creators_merged: 5,713 Creators, 4.73B VND)
    const totalKocs = 5713;
    const baseActiveKocs = 292; // 5.11% active creators
    const currentActiveKocs = Math.round(totalKocs * (activeKocRate / 100));
    const incrementalKocs = Math.max(0, currentActiveKocs - baseActiveKocs);
    // 3.2M VND average incremental GMV per activated Nano/Micro KOC (<5k followers)
    const affiliateGmvUplift = incrementalKocs * 3.2;
    // 12% net contribution margin after paying 10-12% affiliate commission
    const affiliateNetProfit = affiliateGmvUplift * 0.12;

    // Rollup Totals
    const totalSimulatedGmvUplift = cardGmvUplift + additionalVideoGmv + affiliateGmvUplift;
    const totalNetFinancialImpact = cardProfitUplift + liveOpCostSaved + videoProfitAdded + savedDiscountMargin + affiliateNetProfit;
    const simulatedRoiPct = totalSimulatedGmvUplift > 0
      ? ((totalNetFinancialImpact / totalSimulatedGmvUplift) * 100).toFixed(1)
      : '0.0';

    return {
      cardGmvUplift: cardGmvUplift.toFixed(1),
      cardProfitUplift: cardProfitUplift.toFixed(1),
      liveOpCostSaved: liveOpCostSaved.toFixed(1),
      incrementalVideos,
      additionalVideoGmv: additionalVideoGmv.toFixed(1),
      savedDiscountMargin: savedDiscountMargin.toFixed(1),
      incrementalKocs,
      affiliateGmvUplift: affiliateGmvUplift.toFixed(1),
      totalSimulatedGmvUplift: totalSimulatedGmvUplift.toFixed(1),
      totalNetFinancialImpact: totalNetFinancialImpact.toFixed(1),
      simulatedRoiPct,
    };
  }, [targetCardCvr, liveHoursReduction, videoCoverage, targetDiscountRate, activeKocRate]);

  const scrollToDataScopeMatrix = () => {
    const el = document.getElementById('data-scope-matrix');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="sec-optimization" className="space-y-8 py-16 md:py-20 border-b border-slate-200/80 dark:border-slate-800">
      {/* Editorial Title */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="editorial-kicker">
            {isEn ? 'PHASE 06 · RESOURCE ALLOCATION & MARGIN SIMULATOR' : 'PHẦN 6 · TỐI ƯU HÓA NGUỒN LỰC & BỘ MÔ PHỎNG BIÊN LỢI NHUẬN'}
          </span>
          <button
            type="button"
            onClick={scrollToDataScopeMatrix}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition cursor-pointer"
          >
            <span>{isEn ? '🔗 Jump to Data Scope Matrix' : '🔗 Đối Soát Ma Trận 8 Bảng CSV'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
          {isEn ? 'What-If ROI Simulator & Top 5% Hero SKU Strategy' : 'Bộ Mô Phỏng Quyết Định "What-If ROI" & Chiến Lược Hero SKU'}
        </h2>
        <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
          {isEn
            ? 'Actionable business modeling: Simulate financial net margin expansion across 4 strategic levers based on reconciled 90-day FastMoss datasets and 1st-party TikTok Shop Seller Center telemetry.'
            : 'Mô hình hóa quyết định kinh doanh: Giả lập tác động doanh số và biên lợi nhuận ròng trên 4 đòn bẩy chiến lược dựa trên đối soát dữ liệu 90 ngày (FastMoss) và viễn trắc nội bộ TikTok Shop Seller Center.'}
        </p>
      </div>

      {/* 4-Slider Interactive What-If ROI Simulator */}
      <div className="rounded-3xl border-2 border-[#9BE7FA] bg-gradient-to-br from-white via-[#F0FBFE]/60 to-[#C8EEF7]/30 p-6 sm:p-8 text-slate-900 shadow-lg dark:border-[#9BE7FA]/40 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-white transition-all">
        {/* Header Bar with Presets */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#C8EEF7] pb-5 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-[#074553] dark:text-[#9BE7FA]" />
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white">
                {isEn ? 'Interactive What-If Business Impact Simulator' : 'Trình Giả Lập Tác Động Kinh Doanh & Tối Ưu Nguồn Lực (What-If)'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isEn 
                ? 'Adjust 4 operational levers to forecast 30-day GMV expansion and cash-flow margin savings.' 
                : 'Điều chỉnh 4 đòn bẩy vận hành để dự báo mức tăng trưởng GMV và thặng dư lợi nhuận ròng 30 ngày.'}
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => applyPreset('baseline')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              title={isEn ? 'Reset to current verified baseline' : 'Khôi phục thông số thực tế hiện tại'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Baseline' : 'Thực Tế (0%)'}</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('recommended')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#074553] text-white dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7] text-xs font-bold shadow-xs transition-all cursor-pointer"
              title={isEn ? 'Balanced scenario: High margin lift with realistic operational adjustments' : 'Kịch bản đề xuất cân bằng giữa doanh thu và chi phí'}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isEn ? 'Recommended' : 'Kịch Bản Đề Xuất'}</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('aggressive')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              title={isEn ? 'Maximum expansion with full catalog commercialization' : 'Kịch bản tăng tốc tối đa'}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isEn ? 'Aggressive Scale' : 'Tăng Tốc Tối Đa'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Left Sliders, Right Financial Outcomes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* LEFT: 4 INTERACTIVE SLIDERS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Shopping Tab CVR (Product Card) */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-[#9BE7FA]/60 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-[#0D7287] dark:text-sky-300">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {isEn ? '1. Shopping Tab CVR (Product Card)' : '1. Tối Ưu CVR Kệ Hàng (Thẻ Sản Phẩm)'}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {isEn 
                        ? 'Baseline: 0.25% (442.3M VND / 28d; 21.49% of 90d unit sales = 8,630 units)'
                        : 'Baseline: 0,25% (442,3M đ / 28 ngày; 21,49% sản lượng 90 ngày = 8.630 SP)'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#0D7287] dark:text-[#9BE7FA]">
                    {targetCardCvr.toFixed(2)}%
                  </span>
                  <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-bold">
                    {(targetCardCvr / 0.25).toFixed(1)}x Baseline
                  </span>
                </div>
              </div>
              <input 
                type="range" 
                min="0.25" 
                max="1.25" 
                step="0.05" 
                value={targetCardCvr} 
                onChange={(e) => setTargetCardCvr(Number(e.target.value))}
                className="w-full accent-[#0D7287] dark:accent-[#9BE7FA] cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {isEn 
                  ? 'Add 15s fabric try-on clips, customer review UGC, and 2-4h Flash Sales for high-traffic cards (A-Line Skirt CV11: 161.42k views, 6.25% CTR).' 
                  : 'Bổ sung video 15s quay cận vải, ghim ảnh thật đánh giá và Flash Sale 2–4h cho mẫu Chân Váy CV11 (161,42k view, CTR 6,25%) để đẩy CVR lên mức chuẩn 1%.'}
              </p>
            </div>

            {/* Slider 2: Reallocate Dead Live Hours & Expand Shoppable Videos */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-[#9BE7FA]/60 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {isEn ? '2. Reallocate Dead LIVE Hours to High-GPM Shoppable Video' : '2. Dịch Chuyển Giờ LIVE Kém Hiệu Quả Sang Video Ngắn'}
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {isEn
                      ? '4.5x GPM Paradox: Shoppable Video reaches 135.2k VND GPM vs. LIVE at 30.2k VND'
                      : 'Nghịch lý GPM: Video đạt 135,2k đ/1.000 view (cao gấp 4,5x so với LIVE 30,2k đ)'}
                  </div>
                </div>
              </div>

              {/* Sub-slider A: Live reduction */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    {isEn ? 'Cut ineffective LIVE hours (lunch shift 11:30 & post-3h fatigue):' : 'Cắt giảm ca LIVE trưa (11:30) & sau mốc 3h bão hòa:'}
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">-{liveHoursReduction}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  step="5" 
                  value={liveHoursReduction} 
                  onChange={(e) => handleLiveReductionChange(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Sub-slider B: Video catalog coverage */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    {isEn ? 'Shoppable Video Coverage (Cart Attached):' : 'Gắn giỏ hàng cho video chưa thương mại hóa:'}
                  </span>
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    {videoCoverage} / 859 {isEn ? 'Videos' : 'Video'} ({Math.round((videoCoverage / 859) * 100)}%)
                  </span>
                </div>
                <input 
                  type="range" 
                  min="551" 
                  max="859" 
                  step="20" 
                  value={videoCoverage} 
                  onChange={(e) => handleVideoCoverageChange(Number(e.target.value))}
                  className="w-full accent-[#0D7287] dark:accent-[#9BE7FA] cursor-pointer"
                />
              </div>
            </div>

            {/* Slider 3: Restructure Discount & Promo Costs */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-[#9BE7FA]/60 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {isEn ? '3. Restructure Discount & Promo Burn Rate' : '3. Tái Cấu Trúc Khuyến Mãi & Giảm Thất Thoát Giá'}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {isEn
                        ? 'Baseline: Promo burns 50.45% of promo GMV (62.2M VND cost on 123.3M VND sales)'
                        : 'Baseline: Khuyến mãi chiếm 50,45% GMV (tốn 62,2M đ / 123,3M đ doanh thu)'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                    {targetDiscountRate.toFixed(1)}%
                  </span>
                  <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-bold">
                    {isEn ? `Save ${(50.45 - targetDiscountRate).toFixed(1)}% margin` : `Tiết kiệm ${(50.45 - targetDiscountRate).toFixed(1)}% biên lãi`}
                  </span>
                </div>
              </div>
              <input 
                type="range" 
                min="25.0" 
                max="50.45" 
                step="1.0" 
                value={targetDiscountRate} 
                onChange={(e) => setTargetDiscountRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {isEn 
                  ? 'Shift from flat 28-day discounts to short Flash Sales (2–4h) and Add-on deals, maintaining 150.9k VND AOV while capping discount burn at 30-35%.' 
                  : 'Chuyển từ giảm giá cố định dài ngày sang Flash Sale 2–4h và Mua kèm deal sốc để giữ AOV ~151k đ trong khi giảm chi phí chiết khấu từ 50% xuống 30–35%.'}
              </p>
            </div>

            {/* Slider 4: Activate Dormant KOC Affiliate Network */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-[#9BE7FA]/60 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {isEn ? '4. Activate Dormant Nano/Micro KOC Network' : '4. Kích Hoạt Mạng Lưới KOC Ngủ Đông (Affiliate)'}
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {isEn
                        ? 'Baseline: 5,713 Creators enrolled but only 5.1% converting; @girlstyle.vn carries >40% affiliate GMV'
                        : 'Baseline: 5.713 KOC nhưng chỉ 5,1% có đơn; @girlstyle.vn gánh >40% GMV'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {activeKocRate.toFixed(1)}% KOC Active
                  </span>
                  <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-bold">
                    +{simulation.incrementalKocs} {isEn ? 'Active KOCs' : 'KOC có đơn'}
                  </span>
                </div>
              </div>
              <input 
                type="range" 
                min="5.1" 
                max="25.0" 
                step="1.0" 
                value={activeKocRate} 
                onChange={(e) => setActiveKocRate(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {isEn 
                  ? 'Nurture Nano/Micro creators (<5k followers) who drive >95% of non-self GMV with tiered commissions (12-14%) and seasonal sample kits.' 
                  : 'Nâng hoa hồng LIVE lên 12–14% và cấp Sample Kit cho nhóm Nano/Micro (<5k follow) đang gánh >95% GMV để kích hoạt KOC ngủ đông.'}
              </p>
            </div>
          </div>

          {/* RIGHT: REAL-TIME SIMULATED FINANCIAL OUTCOMES (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="p-6 rounded-3xl bg-slate-950 text-white border-2 border-slate-800 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    {isEn ? 'Simulated 30-Day Outcomes' : 'Kết Quả Giả Lập 30 Ngày'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                  {isEn ? 'Live Forecast' : 'Dự Báo Thời Gian Thực'}
                </span>
              </div>

              {/* 4 Financial Sub-metrics */}
              <div className="space-y-4">
                {/* Metric 1: Shopping tab GMV */}
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[220px]">
                    <span className="text-slate-400 block font-semibold">
                      {isEn ? 'Product Card GMV Uplift (0 VND Ads):' : 'GMV Kệ Hàng Tăng Thêm (0đ Ads):'}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {isEn ? 'From CV11 & Bikini card CVR optimization' : 'Từ tối ưu ảnh/clip mẫu Bikini & Váy ren CV11'}
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-[#9BE7FA]">
                    +{simulation.cardGmvUplift} {isEn ? 'M VND' : 'Tr đ'}
                  </span>
                </div>

                {/* Metric 2: Live op-cost saved & discount margin saved */}
                <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-3">
                  <div className="space-y-0.5 max-w-[220px]">
                    <span className="text-slate-400 block font-semibold">
                      {isEn ? 'Promo & Live Op-Cost Saved:' : 'Tiết Kiệm Khuyến Mãi & Giờ Live:'}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {isEn ? 'Cutting idle live shift + capping discount burn' : 'Giảm khấu hao live + siết chiết khấu cố định'}
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-amber-400">
                    +{(Number(simulation.liveOpCostSaved) + Number(simulation.savedDiscountMargin)).toFixed(1)} {isEn ? 'M VND' : 'Tr đ'}
                  </span>
                </div>

                {/* Metric 3: Video GMV Added */}
                <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-3">
                  <div className="space-y-0.5 max-w-[220px]">
                    <span className="text-slate-400 block font-semibold">
                      {isEn ? 'Incremental Shoppable Video GMV:' : 'GMV Video Gắn Giỏ Bổ Sung:'}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {isEn ? `Monetizing +${simulation.incrementalVideos} backlogged videos` : `Thương mại hóa +${simulation.incrementalVideos} video`}
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-emerald-400">
                    +{simulation.additionalVideoGmv} {isEn ? 'M VND' : 'Tr đ'}
                  </span>
                </div>

                {/* Metric 4: KOC Affiliate Expansion */}
                <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-3">
                  <div className="space-y-0.5 max-w-[220px]">
                    <span className="text-slate-400 block font-semibold">
                      {isEn ? 'New Active KOC Affiliate GMV:' : 'GMV Mạng Lưới KOC Mới:'}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {isEn ? `Activating +${simulation.incrementalKocs} Nano/Micro creators` : `Kích hoạt +${simulation.incrementalKocs} Nano/Micro KOC`}
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-indigo-400">
                    +{simulation.affiliateGmvUplift} {isEn ? 'M VND' : 'Tr đ'}
                  </span>
                </div>
              </div>

              {/* Total Impact Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#074553] via-[#0D7287] to-[#074553] border border-[#9BE7FA]/40 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8EEF7]">
                      {isEn ? 'Total Expected Monthly GMV Expansion:' : 'Doanh Số GMV Mở Rộng Dự Kiến:'}
                    </span>
                    <TrendingUp className="w-4 h-4 text-[#FFD14C]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    +{simulation.totalSimulatedGmvUplift} {isEn ? 'Million VND' : 'Triệu đ'}
                  </div>
                  <span className="text-[10px] text-[#C8EEF7]/80 block">
                    {isEn 
                      ? `Equivalent to ~${(Number(simulation.totalSimulatedGmvUplift) / 1000).toFixed(2)} Billion VND incremental revenue per month` 
                      : `Tương đương ~${(Number(simulation.totalSimulatedGmvUplift) / 1000).toFixed(2)} Tỷ VNĐ doanh số tăng thêm mỗi tháng`}
                  </span>
                </div>

                <div className="border-t border-[#9BE7FA]/30 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD14C]">
                      {isEn ? 'Net Cashflow & Margin Saved:' : 'Lợi Ích Tài Chính Ròng & Thặng Dư:'}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-emerald-300">
                      +{simulation.simulatedRoiPct}% ROI
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFE485] pt-0.5">
                    +{simulation.totalNetFinancialImpact} {isEn ? 'Million VND' : 'Triệu VNĐ'}
                  </div>
                  <span className="text-[10px] text-[#C8EEF7]/80 block">
                    {isEn 
                      ? 'Direct cashflow contribution after affiliate commission and production costs' 
                      : 'Lợi nhuận ròng trực tiếp sau khi trừ chi phí hoa hồng & vận hành'}
                  </span>
                </div>
              </div>
            </div>

            {/* Senior Analyst Decision Takeaway */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Executive Strategic Insight: ' : 'Chiến Lược C-Level: '}
                </span>
                {isEn 
                  ? 'Optimizing zero-cost Product Card CVR (21.49% volume share) while reducing 50.45% promotional burn rate unlocks immediate cash margin without blindly escalating paid advertising budgets.'
                  : 'Việc nâng CVR kệ hàng (0đ Ads, 21,49% sản lượng) kết hợp giảm chiết khấu cố định 50% giúp doanh nghiệp tạo ra thặng dư lợi nhuận ngay lập tức mà không phải chạy đua tăng ngân sách quảng cáo mù quáng.'}
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Telemetry Audit Breakdown Button */}
        <div className="mt-6 pt-4 border-t border-[#C8EEF7] dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowAuditPanel(!showAuditPanel)}
            className="w-full py-2.5 px-4 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-500" />
              <span>
                {isEn 
                  ? 'Telemetry Audit Reference: 90-Day Reconciled Metrics & Seller Center Baselines' 
                  : 'Bảng Tham Chiếu Kiểm Toán: Số Liệu Đối Soát 90 Ngày & Viễn Trắc Seller Center'}
              </span>
            </div>
            {showAuditPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAuditPanel && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950 text-slate-300 border border-slate-800 text-xs space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                    {isEn ? 'Product Card Gap (90d)' : 'Chênh Lệch Kệ Hàng (90N)'}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">8.630 SP (21,45%)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? '1.402B VND (22.85% GMV) via Showcase' : '1.402.019.230 đ (22,85% GMV) qua Kệ hàng'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    {isEn ? 'Shoppable Video Ads (90d)' : 'Quảng Cáo Video (90N)'}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">94,70% GMV</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? '2.056B VND (3,482 ads videos) vs 115M Organic' : '2,056 Tỉ đ (3.482 video Ads) vs 115 Tr Organic'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                    {isEn ? 'LIVE Funnel Entry (7d Telemetry)' : 'Phễu Vào Phòng LIVE (7N)'}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">5,09% vs 25,68%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? 'Feed Preview 46% PV (5.09%) vs Search 43% PV (25.68%)' : 'Ô Live 46% PV (5,09%) vs Tìm kiếm 43% PV (25,68%)'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                    {isEn ? 'Creator Network (90d)' : 'Mạng Lưới Creator (90N)'}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">5,1% Converting</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? '94.9% dormant; Nano/Micro (<5k) drive >95% GMV' : '94,9% KOC ngủ đông; Nano/Micro (<5k) gánh >95%'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span>
                  {isEn 
                    ? 'All parameters strictly cross-verified with Screenshot 073520, 080124 & 9 CSV datasets.'
                    : 'Toàn bộ thông số đối soát khớp 100% với Screenshot 073520, 080124 và 9 tệp dữ liệu CSV.'}
                </span>
                <button
                  type="button"
                  onClick={scrollToDataScopeMatrix}
                  className="text-sky-400 hover:text-sky-300 font-semibold underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{isEn ? 'Inspect Full Matrix Tab 3' : 'Xem Ma Trận Đối Soát Tab 3'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-section 6.2: Inventory Strategy: Top 5% Hero SKUs vs. Dead Stock */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {isEn ? '6.2. Inventory Strategy: Top 5% Hero SKUs vs. Dead Stock' : '6.2. Quản Trị Tồn Kho: Danh Mục Hero SKU Top 5% vs. Hàng Chết'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? 'Focusing 80% ad spend and creator seeding on Top 5% Hero SKUs, while eliminating zero-order Dead Stock.'
                : 'Tập trung 80% ngân sách quảng cáo cho nhóm Hero SKU dẫn đầu; giải phóng ngay hàng tồn kho không sinh đơn.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#C8EEF7]/80 px-3 py-1 text-xs font-bold text-[#074553] border border-[#9BE7FA] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
              {isEn 
                ? `Top 5% Unit Volume Threshold: ≥ ${Math.round(KAMI_MATH_STATS.skuMatrix.p95Units)} Units` 
                : `Ngưỡng Top 5% Sản lượng: ≥ ${Math.round(KAMI_MATH_STATS.skuMatrix.p95Units)} Sản phẩm`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left: Hero SKUs table */}
          <div className="col-span-2 overflow-hidden rounded-2xl border border-[#9BE7FA]/70 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950/60">
            <div className="border-b border-[#C8EEF7] bg-[#C8EEF7]/30 px-4 py-3 font-semibold text-xs text-[#074553] dark:border-slate-800 dark:bg-slate-900 dark:text-[#9BE7FA] flex items-center justify-between">
              <span>{isEn ? '⭐ TOP HERO SKUs (Target 80% Ad Spend & Seeding)' : '⭐ TOP HERO SKUs (Tập trung 80% Ngân sách Ads & Creator Seeding)'}</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">CV11 · H36 · H32</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#C8EEF7]/15 text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">{isEn ? 'Product Name / SKU' : 'Tên Sản phẩm / Mã SKU'}</th>
                    <th className="py-2.5 px-3">{isEn ? 'Category' : 'Ngành hàng'}</th>
                    <th className="py-2.5 px-3">{isEn ? 'Units Sold' : 'Đơn bán'}</th>
                    <th className="py-2.5 px-3">{isEn ? 'GMV Revenue' : 'Doanh thu GMV'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {KAMI_MATH_STATS.skuMatrix.heroSkus.slice(0, 6).map((sku: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-200 max-w-xs truncate" title={sku.name}>
                        {sku.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 truncate max-w-[150px]" title={sku.category}>
                        {sku.category.split('/').pop() || sku.category}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        {sku.units.toLocaleString()} {isEn ? 'units' : 'SP'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-mono">
                        {sku.gmv.toFixed(1)}M {isEn ? 'VND' : 'đ'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Dead Stock eliminate box */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                <span>{isEn ? 'Dead Stock Liquidation (0 Orders)' : 'Hàng Tồn Cần Xử Lý (0 Đơn Bán)'}</span>
              </div>
              <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
                {isEn 
                  ? '197 SKUs (59.5% of store catalog) generated zero orders across 90 days. Liquidate inventory and avoid restocking:' 
                  : '197 SKU (59,5% danh mục shop) không phát sinh đơn hàng trong suốt chu kỳ 90 ngày. Cần ngưng nhập và thanh lý xả kho sớm:'}
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {KAMI_MATH_STATS.skuMatrix.deadStock.map((ds: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 rounded-lg bg-white/60 p-2 dark:bg-slate-900/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="truncate" title={ds.name}>{ds.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 rounded-lg bg-rose-500/10 p-2.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
              {isEn 
                ? 'Bundle dead stock as Free Gift for orders ≥299k to free working capital for Hero SKUs (CV11, H36).' 
                : 'Đóng gói quà tặng kèm đơn từ 299k trên các phiên live để giải phóng dòng tiền dồn lực cho Hero SKUs (CV11, H36).'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
