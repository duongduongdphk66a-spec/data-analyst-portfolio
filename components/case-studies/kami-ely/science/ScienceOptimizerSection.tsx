'use client';

import React from 'react';
import { Sliders, AlertTriangle } from 'lucide-react';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';

interface ScienceOptimizerSectionProps {
  isEn: boolean;
  liveHoursReduction: number;
  setLiveHoursReduction: (_v: number) => void;
  videoCoverage: number;
  setVideoCoverage: (_v: number) => void;
  simulatorMetrics: {
    operationalCostSavedMillion: string;
    additionalVideoGmvMillion: string;
    incrementalVideos: number;
    netBenefitMillion: string;
  };
}

export default function ScienceOptimizerSection({
  isEn,
  liveHoursReduction,
  setLiveHoursReduction,
  videoCoverage,
  setVideoCoverage,
  simulatorMetrics
}: ScienceOptimizerSectionProps) {
  return (
    <section id="sec-optimization" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="editorial-kicker">
            {isEn ? 'PHASE 06 · RESOURCE ALLOCATION & SKU STRATEGY' : 'PHẦN 6 · TỐI ƯU NGUỒN LỰC & CHIẾN LƯỢC SKU'}
          </span>
        </div>
        <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
          {isEn ? 'Resource Reallocation & Top 5% Hero SKU Strategy' : 'Tối Ưu Phân Bổ Nguồn Lực & Chiến Lược Hero SKU Top 5%'}
        </h2>
        <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
          {isEn
            ? 'Action plan: reduce ineffective Live hours, shift resources to shoppable videos, and concentrate 80% ad spend on Hero SKUs.'
            : 'Hành động: giảm thời lượng Live kém hiệu quả, tập trung nguồn lực vào video và dồn 80% ngân sách quảng cáo cho Hero SKU.'}
        </p>
      </div>

      {/* Interactive Optimization Simulator */}
      <div className="rounded-2xl border-2 border-[#FFD14C] bg-gradient-to-br from-[#FFFDF5] via-[#FFF9E6] to-[#FFE485]/40 p-6 text-slate-900 shadow-lg dark:border-teal-500/30 dark:bg-gradient-to-br dark:from-teal-950/20 dark:via-slate-950 dark:to-slate-900 dark:text-white dark:shadow-xl transition-colors">
        <div className="flex items-center justify-between border-b border-[#FFE485]/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#0D7287] dark:text-teal-400" />
            <h3 className="font-bold text-base sm:text-lg text-slate-950 dark:text-white">
              {isEn ? 'Interactive Resource Reallocation Simulator' : 'Trình Giả Lập Tối Ưu Hóa Phân Bổ Nguồn Lực'}
            </h3>
          </div>
          <span className="rounded-full bg-[#FFE485] px-3 py-1 text-xs font-bold text-slate-900 border border-[#FFD14C] dark:border-transparent dark:bg-teal-500/20 dark:text-teal-300">
            {isEn ? 'Business Impact Forecast Model' : 'Mô hình Dự báo Lợi ích Kinh doanh'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isEn ? 'Reduce Low-GPM Live Hours:' : 'Cắt giảm giờ Live vượt ngưỡng hiệu quả:'}</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">-{liveHoursReduction}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="70" 
                step="5" 
                value={liveHoursReduction} 
                onChange={(e) => setLiveHoursReduction(Number(e.target.value))}
                className="w-full accent-[#0D7287] dark:accent-teal-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                {isEn 
                  ? 'Eliminates studio runtime past the 3-hour diminishing returns limit.' 
                  : 'Cắt giảm các ca live kéo dài sau mốc 3 giờ (nơi doanh thu phát sinh thêm gần như bằng 0).'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isEn ? 'Shoppable Video Coverage:' : 'Số lượng video có gắn link giỏ hàng:'}</span>
                <span className="font-bold text-[#0D7287] dark:text-teal-300">{videoCoverage} / 859 Video</span>
              </div>
              <input 
                type="range" 
                min="551" 
                max="859" 
                step="20" 
                value={videoCoverage} 
                onChange={(e) => setVideoCoverage(Number(e.target.value))}
                className="w-full accent-[#0D7287] dark:accent-teal-400 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                {isEn 
                  ? 'Increases high-GPM shoppable videos from 551 to full catalog coverage (859 videos).' 
                  : 'Gia tăng số lượng video có giỏ hàng (tận dụng GPM 135.2k VNĐ vượt trội của kênh video).'}
              </span>
            </div>
          </div>

          {/* Simulated Financial Outcomes */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#FFE485] bg-white/90 p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950/80">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isEn ? 'Operational Cost Saved' : 'Tiết kiệm Chi phí Vận hành'}
              </span>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">+{simulatorMetrics.operationalCostSavedMillion}M</p>
              <span className="text-[10px] text-slate-500">
                {isEn ? 'Reduced headcount & live studio depreciation' : 'Giảm nhân sự & khấu hao phòng live'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isEn ? 'Additional Video GMV' : 'GMV Video Bổ Sung'}
              </span>
              <p className="text-2xl font-bold text-[#0D7287] dark:text-teal-300">+{simulatorMetrics.additionalVideoGmvMillion}M</p>
              <span className="text-[10px] text-slate-500">
                {isEn ? `From ${simulatorMetrics.incrementalVideos} new shoppable videos` : `Từ ${simulatorMetrics.incrementalVideos} video gắn giỏ hàng mới`}
              </span>
            </div>

            <div className="col-span-2 border-t border-[#FFE485]/80 pt-3 dark:border-slate-800">
              <span className="text-xs uppercase tracking-wider text-[#0D7287] dark:text-teal-400 font-bold">
                {isEn ? 'Expected Net Financial Impact:' : 'Lợi ích Tài chính Ròng Kỳ Vọng:'}
              </span>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  +{simulatorMetrics.netBenefitMillion} {isEn ? 'Million VND' : 'Triệu VNĐ'}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {isEn ? 'Estimated revenue & savings' : 'Doanh thu và tiết kiệm dự kiến'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-section 6.2: SKU Strategy */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {isEn ? '6.2. Inventory Strategy: Top 5% Hero SKUs' : '6.2. Quản trị Tồn kho: Danh mục Hero SKU Top 5%'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? 'Focusing ad spend and creator seeding on Top 5% Hero SKUs, while eliminating zero-order Dead Stock.'
                : 'Tập trung 80% ngân sách cho nhóm Hero SKU dẫn đầu; giải phóng ngay hàng tồn kho không sinh đơn.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Ngưỡng Top 5% Sản lượng: &ge; {Math.round(KAMI_MATH_STATS.skuMatrix.p95Units)} Sản phẩm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left: Hero SKUs table */}
          <div className="col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              ⭐ TOP HERO SKUs (Tập trung 80% Ngân sách Ads & Creator Seeding)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-slate-500 dark:bg-slate-900/50">
                  <tr>
                    <th className="py-2.5 px-4">Tên Sản phẩm / Mã SKU</th>
                    <th className="py-2.5 px-3">Ngành hàng</th>
                    <th className="py-2.5 px-3">Đơn bán</th>
                    <th className="py-2.5 px-3">Doanh thu GMV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {KAMI_MATH_STATS.skuMatrix.heroSkus.slice(0, 6).map((sku: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-200 max-w-xs truncate">
                        {sku.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{sku.category}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        {sku.units.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {sku.gmv.toFixed(1)}M đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Dead Stock eliminate box */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>Hàng Tồn Cần Xử Lý (0 Đơn Bán)</span>
            </div>
            <p className="mt-2 text-xs text-rose-800/80 dark:text-rose-300/80">
              Không phát sinh đơn hàng trong suốt chu kỳ 90 ngày. Cần ngưng nhập và thanh lý xả kho sớm:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {KAMI_MATH_STATS.skuMatrix.deadStock.map((ds: any, idx: number) => (
                <li key={idx} className="flex items-center gap-2 rounded-lg bg-white/60 p-2 dark:bg-slate-900/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="truncate">{ds.name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg bg-rose-500/10 p-2.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
              Giải phóng dòng tiền để dồn nguồn lực cho Hero SKUs (CV11, H36).
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
