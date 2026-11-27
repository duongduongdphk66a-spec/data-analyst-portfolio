'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { V2 } from './kamiOutlineV2Metrics';

interface Props {
  lang: 'vi' | 'en';
}

export function Chapter4KocNetwork({ lang }: Props) {
  const isVi = lang === 'vi';
  const [showCohortDetails, setShowCohortDetails] = useState(false);

  const surv = V2.ch4.survival;

  return (
    <section id="sec-koc" className="scroll-mt-28 space-y-4">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isVi
                ? '145 KOC có 3 phiên đầu 0đ: 94 người không ra đơn nhưng 51 người tạo 304,9 Tr từ phiên 4+'
                : '145 Zero-Start KOCs (≥3 Sessions): 94 Never Converted, but 51 Drove 304.9M from Session 4+'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              {isVi
                ? 'Đo từ 7.760 phiên Live ngoài @shop_official (09/03 – 20/10/2026) để tối ưu ngân sách mẫu mà không đánh mất nhóm chuyển đổi muộn.'
                : 'Computed across 7,760 non-official live sessions (Mar 09 – Oct 20, 2026) to optimize sample spend without losing late converters.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs tabular-nums">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3.5">
            <p className="font-bold text-slate-900 dark:text-white">
              {isVi ? 'Tỷ lệ KOC Live từng ra đơn' : 'Ever-Converting Live KOCs'}
            </p>
            <p className="text-xl font-extrabold text-[#0D7287] dark:text-[#9BE7FA] mt-1">
              {surv.everOrderCount} / {surv.totalKocs} ({isVi ? String(surv.everOrderPct).replace('.', ',') : surv.everOrderPct}%)
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              {isVi
                ? `${surv.firstSessionOrderCount} KOC (${String(surv.firstSessionOrderPct).replace('.', ',')}%) ra đơn ngay phiên đầu tiên.`
                : `${surv.firstSessionOrderCount} KOCs (${surv.firstSessionOrderPct}%) converted on session 1.`}
            </p>
          </div>
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3.5">
            <p className="font-bold text-slate-900 dark:text-white">
              {isVi ? 'Đánh đổi luật 3 phiên đầu = 0đ' : '3-Session Zero-GMV Trade-Off'}
            </p>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {isVi ? '94/145 (64,8%) không ra đơn' : '94/145 (64.8%) never convert'}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              {isVi
                ? 'Nhưng 51/145 KOC còn lại (35,2%) ra đơn từ phiên 4+ và tạo 304,9 Tr (18,8% Live độc lập) → chỉ dừng gửi mẫu trả phí, giữ link affiliate mở.'
                : 'Yet 51/145 (35.2%) converted at session 4+ for 304.9M VND (18.8% of independent Live) → stop paid samples only, keep open affiliate links.'}
            </p>
          </div>
          <div className="rounded-xl border border-[#FFD14C]/50 bg-[#FFE485]/20 dark:bg-slate-950/60 p-3.5">
            <p className="font-bold text-slate-900 dark:text-white">
              {isVi ? 'Vai trò Kênh vệ tinh @koc_sat01' : 'In-House Satellite @koc_sat01'}
            </p>
            <p className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1">
              1,26 tỷ ({isVi ? String(V2.ch4.satelliteSummary.shareOfExtLivePct).replace('.', ',') : V2.ch4.satelliteSummary.shareOfExtLivePct}% Live ngoài)
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              {isVi
                ? '261 phiên từ kênh vệ tinh nội bộ (nếu không tách sẽ phóng đại sức mạnh KOC ngoài).'
                : '261 sessions from in-house satellite (must isolate to avoid overstating external KOCs).'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCohortDetails((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>
            {showCohortDetails
              ? isVi
                ? 'Thu gọn Ma trận giữ chân Cohort theo tháng gia nhập (M+0 đến M+7, 302 KOC Live)'
                : 'Collapse Monthly Cohort Retention Matrix (M+0 to M+7, 302 Live KOCs)'
              : isVi
              ? 'Xem Ma trận giữ chân Cohort theo tháng gia nhập (M+0 đến M+7 · 302 KOC Live)'
              : 'View Monthly Cohort Retention Matrix (M+0 to M+7 · 302 Live KOCs)'}
          </span>
          {showCohortDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCohortDetails && (
          <div className="pt-2">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? 'Ma trận giữ chân Cohort theo tháng gia nhập (M+0 đến M+7, 302 KOC Live)'
                  : 'Monthly Cohort Retention Matrix (M+0 to M+7, 302 Live KOCs)'}
              </p>
              <table className="w-full text-center border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-1.5 pr-2 text-left font-semibold">Cohort</th>
                    <th className="py-1.5 px-2 text-right font-semibold">Size</th>
                    {Array.from({ length: 8 }, (_, i) => (
                      <th key={i} className="py-1.5 px-1.5 font-semibold">
                        M+{i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {V2.ch4.cohortRetention.map((row) => (
                    <tr key={row.cohortMonth} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-1.5 pr-2 text-left font-bold text-slate-900 dark:text-white">
                        {row.shortLabel}
                      </td>
                      <td className="py-1.5 px-2 text-right font-semibold text-slate-600 dark:text-slate-300">
                        {row.size}
                      </td>
                      {row.cells.map((cell) => (
                        <td key={cell.offset} className="py-1.5 px-1.5 text-slate-700 dark:text-slate-300">
                          {cell.censored || cell.pct === null ? '—' : `${cell.pct}%`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
