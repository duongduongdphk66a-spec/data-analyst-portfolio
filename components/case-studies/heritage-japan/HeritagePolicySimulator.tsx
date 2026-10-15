'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Landmark, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Sparkles, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface HeritagePolicySimulatorProps {
  isEn?: boolean;
}

interface ScenarioPreset {
  id: string;
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
  tax: number; // JPY per night
  reinvestRatio: number; // percentage (0.10 to 0.60)
  dispersionRate: number; // percentage (0 to 0.40)
  badge: { vi: string; en: string };
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'preset-kyoto-2026',
    name: {
      vi: 'Cải Cách Kyoto 2026 (Khuyến Nghị Luận Văn)',
      en: 'Kyoto 2026 Reform (Thesis Recommendation)'
    },
    desc: {
      vi: 'Tăng thuế lưu trú lũy tiến, phân bổ 40% cho quỹ bảo tồn di tích gỗ và trợ giá xe buýt điện cho người dân.',
      en: 'Progressive accommodation tax, allocating 40% to wooden heritage trust & resident electric transit subsidy.'
    },
    tax: 1000,
    reinvestRatio: 40,
    dispersionRate: 25,
    badge: { vi: 'Khuyến nghị tối ưu', en: 'Recommended' }
  },
  {
    id: 'preset-strict-conservation',
    name: {
      vi: 'Ưu Tiên Bảo Tồn Tuyệt Đối & Dân Sinh',
      en: 'Strict Conservation & Resident Livability'
    },
    desc: {
      vi: 'Mức thuế cao nhất ¥2,000 để hạn chế khách đại trà giá rẻ, giãn mạnh dòng khách sang Uji, Nara và Asuka.',
      en: 'High ¥2,000 tax ceiling filtering low-spend mass tourism, aggressively dispersing crowds to Uji, Nara & Asuka.'
    },
    tax: 1800,
    reinvestRatio: 55,
    dispersionRate: 35,
    badge: { vi: 'Bảo vệ di sản', en: 'Conservation-first' }
  },
  {
    id: 'preset-volume-growth',
    name: {
      vi: 'Mở Rộng Tăng Trưởng Doanh Thu Quy Mô',
      en: 'High-Volume Revenue Expansion'
    },
    desc: {
      vi: 'Giữ mức thuế thấp ¥300 để kích thích lượng khách tối đa, chấp nhận đánh đổi áp lực hạ tầng đô thị.',
      en: 'Low ¥300 tax rate stimulating maximum visitor arrivals, trading off urban congestion.'
    },
    tax: 300,
    reinvestRatio: 15,
    dispersionRate: 10,
    badge: { vi: 'Tăng trưởng số lượng', en: 'Volume-led' }
  }
];

export default function HeritagePolicySimulator({ isEn: propIsEn }: HeritagePolicySimulatorProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  // Simulator Sliders State
  const [taxRate, setTaxRate] = useState<number>(1000); // 200 - 2000 JPY
  const [reinvestRatio, setReinvestRatio] = useState<number>(40); // 10% - 60%
  const [dispersionRate, setDispersionRate] = useState<number>(25); // 0% - 40%
  const [activePreset, setActivePreset] = useState<string>('preset-kyoto-2026');

  const applyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset.id);
    setTaxRate(preset.tax);
    setReinvestRatio(preset.reinvestRatio);
    setDispersionRate(preset.dispersionRate);
  };

  // Empirical constants based on 2024 DMO Kyoto & JNTO metrics:
  // - Annual Kyoto Inbound Overnight Guests: 8.21M
  // - Average Inbound Length of Stay: 2.4 nights
  // - Total Inbound Nights: ~19.7M guest-nights
  // - Day-tripper Volume (Kyoto & Nara combined): ~12.5M visits
  const BASE_GUEST_NIGHTS = 19_700_000;
  const BASE_OVERTOURISM_INDEX = 88; // 88/100 congestion peak
  const BASE_RESIDENT_SATISFACTION = 42; // 42/100 low due to bus overcrowding & noise

  const simResults = useMemo(() => {
    // 1. Total accommodation tax revenue (JPY)
    const annualTaxRevenueJpy = BASE_GUEST_NIGHTS * taxRate;
    const annualTaxRevenueBillionJpy = (annualTaxRevenueJpy / 1_000_000_000);

    // 2. Fund allocated directly to Heritage Trust & Resident Subsidies
    const conservationFundBillionJpy = (annualTaxRevenueBillionJpy * (reinvestRatio / 100));

    // 3. Overtourism Density Reduction (percentage)
    // Higher dispersion + moderate tax reduces bottleneck concentration at Kiyomizu/Nara Park
    const taxElasticityImpact = Math.min(12, ((taxRate - 200) / 1800) * 8);
    const totalDispersionImpact = dispersionRate * 0.95 + taxElasticityImpact;
    const congestionReductionPct = Math.min(48, Math.max(0, totalDispersionImpact));

    // 4. Per-capita spend uplift
    // Converting Day-Trippers into overnight satellite stays increases local meals/crafts spending
    const spendUpliftPct = (dispersionRate * 0.85) + ((taxRate / 2000) * 12.5);

    // 5. Resident Quality of Life Index (out of 100)
    const residentSatisfactionScore = Math.min(
      94,
      Math.round(
        BASE_RESIDENT_SATISFACTION +
        (congestionReductionPct * 0.72) +
        (reinvestRatio * 0.38)
      )
    );

    return {
      annualTaxRevenueBillionJpy: annualTaxRevenueBillionJpy.toFixed(1),
      conservationFundBillionJpy: conservationFundBillionJpy.toFixed(1),
      congestionReductionPct: congestionReductionPct.toFixed(1),
      spendUpliftPct: spendUpliftPct.toFixed(1),
      residentSatisfactionScore
    };
  }, [taxRate, reinvestRatio, dispersionRate]);

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>{isEn ? 'WHAT-IF POLICY SCENARIO SIMULATOR' : 'MÔ PHỎNG CHÍNH SÁCH ĐIỀU HÀNH • WHAT-IF SIMULATOR'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Landmark className="w-6 h-6 text-sky-400 shrink-0" />
            <span>
              {isEn 
                ? 'Kyoto & Nara Heritage Conservation vs Overtourism Balance Model' 
                : 'Mô Hình Cân Bằng Quỹ Bảo Tồn Di Sản & Giảm Tải Quá Tải Cố Đô'}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {isEn
              ? 'Simulate dynamic accommodation taxes, heritage reinvestment pools, and satellite dispersion to resolve the Day-Tripper paradox while maximizing empirical economic multipliers.'
              : 'Thử nghiệm điều chỉnh thuế lưu trú, quỹ phục dựng di tích và cơ chế giãn dòng khách sang Uji, Asuka, Nara để hóa giải nghịch lý Day-Tripper và bảo vệ không gian sống cố đô.'}
          </p>
        </div>

        {/* RESET BUTTON */}
        <button
          type="button"
          onClick={() => applyPreset(PRESETS[0])}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? 'Reset Default' : 'Khôi phục Mặc định'}</span>
        </button>
      </div>

      {/* PRESET STRATEGY BUTTONS */}
      <div className="relative z-10 pt-6">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
          {isEn ? 'Choose Policy Package Preset:' : 'Chọn Gói Kịch Bản Chính Sách:'}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-400/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {preset.badge[lang]}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{preset.name[lang]}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{preset.desc[lang]}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-sky-300">
                  <span>¥{preset.tax.toLocaleString()} / đêm</span>
                  <span>{preset.reinvestRatio}% Quỹ di sản</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE SLIDERS & TELEMETRY GRID */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* 3 CONTROL SLIDERS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>{isEn ? 'Policy Levers' : '3 Công Cụ Điều Hành'}</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">{isEn ? 'Adjust Real-time' : 'Kéo để tính toán'}</span>
          </div>

          {/* Slider 1: Accommodation Tax */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-slate-200">
                {isEn ? '1. Accommodation Tax Rate:' : '1. Mức Thuế Lưu Trú (Mỗi Đêm):'}
              </label>
              <span className="text-sm font-mono font-extrabold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                ¥{taxRate.toLocaleString()} <span className="text-[10px] text-slate-400">/đêm</span>
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={2000}
              step={100}
              value={taxRate}
              onChange={(e) => {
                setTaxRate(Number(e.target.value));
                setActivePreset('');
              }}
              className="w-full accent-sky-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>¥200 (Tối thiểu)</span>
              <span>¥1,000 (Đề xuất)</span>
              <span>¥2,000 (Trần)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn 
                ? 'Applies to 19.7M guest-nights across Kyoto hotels & machiya ryokans.' 
                : 'Áp dụng trên 19,7 triệu đêm lưu trú tại các khách sạn & nhà cổ Machiya Kyoto.'}
            </p>
          </div>

          {/* Slider 2: Heritage Reinvestment Ratio */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-slate-200">
                {isEn ? '2. Heritage Trust Reinvestment:' : '2. Tỷ Lệ Đưa Vào Quỹ Bảo Tồn & Dân Sinh:'}
              </label>
              <span className="text-sm font-mono font-extrabold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {reinvestRatio}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={reinvestRatio}
              onChange={(e) => {
                setReinvestRatio(Number(e.target.value));
                setActivePreset('');
              }}
              className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>10% (Chỉ bảo trì nhẹ)</span>
              <span>40% (Cân bằng)</span>
              <span>60% (Tu bổ di tích gỗ)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn 
                ? 'Dedicated to structural wood restoration and resident transit subsidies.' 
                : 'Dành riêng tu sửa kiến trúc gỗ truyền thống và trợ giá xe buýt dân sinh.'}
            </p>
          </div>

          {/* Slider 3: Day-Tripper Satellite Dispersion */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-slate-200">
                {isEn ? '3. Day-Tripper Satellite Dispersion:' : '3. Tỷ Lệ Giãn Dòng Khách Sang Vệ Tinh:'}
              </label>
              <span className="text-sm font-mono font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {dispersionRate}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={dispersionRate}
              onChange={(e) => {
                setDispersionRate(Number(e.target.value));
                setActivePreset('');
              }}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0% (Hiện trạng)</span>
              <span>25% (Mục tiêu 2026)</span>
              <span>40% (Giãn tải tối đa)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn 
                ? 'Incentivizing travel to Uji (Byodoin), Asuka, Yoshino, and Lake Biwa.' 
                : 'Chính sách vé JR Pass kết hợp voucher điều hướng khách sang Uji, Asuka, Yoshino.'}
            </p>
          </div>
        </div>

        {/* SIMULATED IMPACT RESULTS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'Simulated Policy Telemetry' : 'Kết Quả Mô Phỏng Tác Động Kinh Tế & Dân Sinh'}</span>
            </h4>
            <span className="text-xs font-mono font-bold text-emerald-400">Real-time Model</span>
          </div>

          {/* 4 TELEMETRY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Conservation Fund */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-sky-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Annual Heritage Fund' : 'Quỹ Bảo Tồn & Dân Sinh'}
                </span>
                <Landmark className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-300">
                +¥{simResults.conservationFundBillionJpy} <span className="text-sm text-slate-400">Tỷ / năm</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 border-t border-slate-900 pt-2 flex items-center justify-between">
                <span>{isEn ? 'Total Tax Revenue:' : 'Tổng thu thuế lưu trú:'}</span>
                <span className="font-mono text-white font-bold">¥{simResults.annualTaxRevenueBillionJpy} Tỷ</span>
              </div>
            </div>

            {/* Metric 2: Overtourism Congestion Reduction */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Overtourism Reduction' : 'Giảm Tải Áp Lực Cố Đô'}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                -{simResults.congestionReductionPct}%
              </div>
              <div className="mt-2 text-xs text-slate-400 border-t border-slate-900 pt-2 flex items-center justify-between">
                <span>{isEn ? 'Congestion Baseline:' : 'Mức quá tải ban đầu:'}</span>
                <span className="font-mono text-rose-400 font-bold">{BASE_OVERTOURISM_INDEX} / 100</span>
              </div>
            </div>

            {/* Metric 3: Per-Capita Spend Uplift */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Per-Capita Spend Uplift' : 'Tăng Chi Tiêu Bình Quân'}
                </span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
                +{simResults.spendUpliftPct}%
              </div>
              <div className="mt-2 text-xs text-slate-400 border-t border-slate-900 pt-2 flex items-center justify-between">
                <span>{isEn ? 'Day-Tripper Conversion:' : 'Chuyển hóa Day-Tripper:'}</span>
                <span className="font-mono text-emerald-300 font-bold">+{dispersionRate}%</span>
              </div>
            </div>

            {/* Metric 4: Resident Satisfaction */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Resident Livability Score' : 'Chỉ Số Hài Lòng Dân Cư'}
                </span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-300">
                {simResults.residentSatisfactionScore} <span className="text-sm text-slate-400">/ 100</span>
              </div>
              <div className="mt-2 text-xs text-slate-400 border-t border-slate-900 pt-2 flex items-center justify-between">
                <span>{isEn ? 'Pre-policy Baseline:' : 'Trước khi cải cách:'}</span>
                <span className="font-mono text-rose-400 font-bold">{BASE_RESIDENT_SATISFACTION} / 100</span>
              </div>
            </div>
          </div>

          {/* POLICY SYNTHESIS & INSIGHT BOX */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isEn ? 'Econometric Synthesis & Policy Mechanism:' : 'Phân Tích Cơ Chế Tác Động Kinh Tế Lượng:'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn ? (
                <>
                  By setting an accommodation tax of <strong>¥{taxRate.toLocaleString()}</strong> and channeling <strong>{reinvestRatio}%</strong> into the Heritage Fund, the city generates <strong>+¥{simResults.conservationFundBillionJpy} Billion annually</strong>. This funds structural fireproofing of designated wood pagodas while lowering bus crowding by <strong>-{simResults.congestionReductionPct}%</strong>.
                </>
              ) : (
                <>
                  Khi áp mức thuế <strong>¥{taxRate.toLocaleString()}/đêm</strong> kết hợp trích <strong>{reinvestRatio}%</strong> doanh thu vào quỹ di sản, thành phố thu về <strong>+¥{simResults.conservationFundBillionJpy} Tỉ mỗi năm</strong>. Nguồn vốn này giải quyết triệt để bài toán tu bổ kiến trúc cổ và hỗ trợ cư dân, đồng thời giảm <strong>-{simResults.congestionReductionPct}%</strong> áp lực quá tải tại các điểm du lịch cốt lõi.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
