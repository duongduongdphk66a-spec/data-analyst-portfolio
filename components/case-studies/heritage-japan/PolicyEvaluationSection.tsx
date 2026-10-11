'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, Scale, Check, AlertCircle, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import { 
  POLICY_EVALUATION_MATRIX, 
  COUNTERFACTUAL_SUMMARY, 
  touristsData as defaultTouristsData
} from '@/app/data/heritageJapanData';

interface PolicyEvaluationSectionProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
  touristsData?: any[];
  isLiveDb?: boolean;
}

export function PolicyEvaluationSection({ isEn, onCopyDeepLink, touristsData, isLiveDb }: PolicyEvaluationSectionProps) {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('policy-1');
  const [showCounterfactual, setShowCounterfactual] = useState<boolean>(true);

  const activePillar = POLICY_EVALUATION_MATRIX.find((p) => p.id === selectedPillarId) || POLICY_EVALUATION_MATRIX[0];

  // Slice data for counterfactual view (2003 - 2019 pre-covid to cleanly evaluate the policy shock)
  const sourceData = touristsData && touristsData.length > 0 ? touristsData : defaultTouristsData;
  const preCovidData = sourceData.filter((d: any) => Number(d.year) >= 2003 && Number(d.year) <= 2019);


  return (
    <section id="danh-gia-hieu-qua" className="py-16 md:py-24 bg-white border-b border-slate-200/80 dark:bg-[#0B0F17] dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          variant="stacked"
          id="danh-gia-hieu-qua"
          badge={isEn ? 'Impact Assessment • Counterfactual Modeling' : 'Đánh Giá Hiệu Quả • Mô Hình Phản Thực Tế (Counterfactual)'}
          title={isEn ? 'Quantitative Policy Evaluation: The 2013 Tourism Action Program' : 'Đánh Giá Hiệu Quả Chính Sách: Cú Hích Chiến Lược 2013 Có Thực Sự Hiệu Quả?'}
          onCopy={onCopyDeepLink}
        />

        {/* Lead Analyst Commentary */}
        <div className="mb-8 p-5 rounded-2xl bg-[#F0FBFC] border border-[#9BE7FA] dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#0D7287]/10 text-[#0D7287] dark:text-[#9BE7FA] shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <h4 className="font-extrabold text-slate-950 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <span>{isEn ? 'Causal Inference & Baseline Comparison' : 'Đánh Giá Tác Động: Tách Biệt Hiệu Ứng Chính Sách với Xu Hướng Tự Nhiên'}</span>
              </h4>
              <p className="leading-relaxed">
                {isEn
                  ? 'To prove that the 2013 Action Program was truly effective rather than just a global macro tailwind, we built a log-linear counterfactual model based on the pre-policy decade (2003–2012). The policy generated an empirical surplus of +19.8 million visitors by 2019.'
                  : 'Để chứng minh "Chương trình hành động hướng tới quốc gia du lịch" (2013) thực sự tạo đột phá chứ không đơn thuần do xu hướng tự nhiên của thế giới, phương pháp phân tích đối chứng (Counterfactual Analysis) kéo dài tốc độ tăng trưởng cơ sở giai đoạn 2003–2012 (CAGR 5.1%) cho thấy: chính sách 2013 đã tạo ra thặng dư thần kỳ +19.8 triệu du khách vào năm 2019 so với kịch bản giữ nguyên.'}
              </p>
            </div>
          </div>
        </div>

        {/* Counterfactual Interactive Chart Container */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-ground border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Econometric Simulation
                </span>
                <span className="text-xs text-slate-500 font-bold">Thực tế (Actual) vs Phản thực tế (Baseline No-Policy)</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Mô hình Đối chứng Tăng trưởng Khách Quốc tế (2003 – 2019)</span>
                {isLiveDb && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    MySQL Live
                  </span>
                )}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCounterfactual(!showCounterfactual)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showCounterfactual
                    ? 'bg-[#0D7287] text-white shadow-xs font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>{showCounterfactual ? 'Ẩn Kịch Bản Cơ Sở (Baseline)' : 'Bật Kịch Bản Cơ Sở (Baseline)'}</span>
              </button>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={preCovidData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="M" domain={[0, 36]} />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${value} Triệu khách`, 
                    name === 'value' ? 'Thực tế (Chính sách 2013)' : 'Kịch bản cơ sở (Không chính sách)'
                  ]}
                />
                <Legend 
                  formatter={(value) => value === 'value' ? 'Thực tế đạt được (Chính sách 2013: CAGR 20.6%)' : 'Kịch bản không chính sách (Kéo dài xu hướng cũ: CAGR 5.1%)'}
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0D7287" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0D7287' }}
                  name="value"
                />
                {showCounterfactual && (
                  <Line 
                    type="monotone" 
                    dataKey="counterfactual" 
                    stroke="#F59E0B" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={{ r: 3, fill: '#F59E0B' }}
                    name="counterfactual"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tốc độ Tăng trưởng Trước 2013</span>
              <p className="font-mono text-xl font-black text-slate-900 dark:text-white">CAGR +5.1%</p>
              <p className="text-[10px] text-slate-500">2003–2012 (Giai đoạn tăng trưởng chậm)</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Tốc độ Sau Chính Sách 2013</span>
              <p className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">CAGR +20.6%</p>
              <p className="text-[10px] text-emerald-600/80">Tăng gấp 4.04 lần tốc độ tự nhiên</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-[#0D7287] dark:text-[#9BE7FA] block mb-1">Thặng Dư Du Khách Năm 2019</span>
              <p className="font-mono text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">+19.8 Triệu</p>
              <p className="text-[10px] text-slate-500">31.9M thực tế vs 12.1M baseline</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Thặng Dư Tích Lũy (2013–2019)</span>
              <p className="font-mono text-xl font-black text-amber-600">+63.4 Triệu</p>
              <p className="text-[10px] text-slate-500">Tổng khách vượt trội thu hút được</p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Policy Evaluation Scorecard */}
        <div className="space-y-4">
          <h4 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Đánh Giá Toàn Diện 4 Trụ Cột Chính Sách (Policy Scorecards)</span>
          </h4>

          {/* Pillar Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {POLICY_EVALUATION_MATRIX.map((item) => {
              const isSelected = item.id === selectedPillarId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPillarId(item.id)}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0D7287] text-white border-[#0D7287] shadow-sm dark:bg-[#9BE7FA] dark:text-slate-950 dark:border-[#9BE7FA]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-850 dark:text-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase opacity-80">
                      Trụ cột {item.id.replace('policy-', '0')}
                    </span>
                    <span className="text-xs font-black">
                      {'★'.repeat(item.impactScore)}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold line-clamp-1">
                    {isEn ? item.pillarEn : item.pillarVi}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Pillar Detailed Scorecard Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h5 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
                {isEn ? activePillar.pillarEn : activePillar.pillarVi}
              </h5>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 w-fit">
                <span>Hiệu quả thực thi:</span>
                <span className="font-mono font-black">{activePillar.impactScore}/5 Điểm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Biện pháp triển khai cụ thể</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {isEn ? activePillar.actionEn : activePillar.actionVi}
                </p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Bằng chứng định lượng đo lường được</span>
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {isEn ? activePillar.quantEvidenceEn : activePillar.quantEvidenceVi}
                </p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
                <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Ngoại ứng tiêu cực & Chi phí ngoài dự kiến</span>
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {isEn ? activePillar.unintendedCostEn : activePillar.unintendedCostVi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
