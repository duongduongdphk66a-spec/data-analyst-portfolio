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
    <section id="sec-koc" className="scroll-mt-28">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs sm:text-sm tabular-nums">
          <p className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">
              {isVi ? 'Sàng lọc 302 KOC Live ngoài: ' : '302 External Live KOC Screening: '}
            </strong>
            {isVi
              ? `Chỉ ${surv.everOrderCount}/${surv.totalKocs} KOC (${surv.everOrderPct}%) từng ra đơn; trong nhóm 0 đơn 3 phiên đầu, ${surv.first3ZeroNeverConvertPct}% không bao giờ chuyển đổi (nhóm đủ ≥3 phiên là ${surv.first3ZeroGe3NeverConvertPct}%).`
              : `Only ${surv.everOrderCount}/${surv.totalKocs} KOCs (${surv.everOrderPct}%) ever converted; ${surv.first3ZeroNeverConvertPct}% with 0 orders in their first 3 sessions never convert (${surv.first3ZeroGe3NeverConvertPct}% among ≥3-session KOCs).`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCohortDetails((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>
            {showCohortDetails
              ? isVi
                ? 'Thu gọn phân tích sống còn Kaplan-Meier & Ma trận giữ chân Cohort 302 KOC Live'
                : 'Collapse Kaplan-Meier survival & Cohort retention matrix for 302 Live KOCs'
              : isVi
              ? `Xem kiểm định giữ chân 302 KOC Live: Quy tắc sàng lọc 3 phiên đầu (${surv.first3ZeroNeverConvertPct}% KOC 0 đơn sau 3 phiên đầu không bao giờ ra đơn)`
              : `View 302 Live KOC Retention Audit: 3-Session Screening Rule (${surv.first3ZeroNeverConvertPct}% with 0 orders in first 3 sessions never convert)`}
          </span>
          {showCohortDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCohortDetails && (
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs tabular-nums">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Tỷ lệ KOC Live từng ra đơn' : 'Ever-Converting Live KOCs'}
                </p>
                <p className="text-xl font-extrabold text-[#0D7287] dark:text-[#9BE7FA] mt-1">
                  {surv.everOrderCount} / {surv.totalKocs} ({surv.everOrderPct}%)
                </p>
                <p className="text-slate-500 mt-0.5">
                  {isVi
                    ? `Trong đó ${surv.firstSessionOrderCount} KOC (${surv.firstSessionOrderPct}%) có đơn ngay phiên đầu.`
                    : `${surv.firstSessionOrderCount} KOCs (${surv.firstSessionOrderPct}%) converted on session 1.`}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Ngưỡng sàng lọc 3 phiên đầu = 0đ' : '3-Session Zero-Revenue Rule'}
                </p>
                <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  {surv.first3ZeroNeverConvertPct}% ({surv.first3ZeroNeverConvertCount}/{surv.first3ZeroCount})
                </p>
                <p className="text-slate-500 mt-0.5">
                  {isVi
                    ? `Xét riêng nhóm đủ ≥3 phiên (n=${surv.first3ZeroGe3Count}), tỷ lệ không bao giờ ra đơn là ${surv.first3ZeroGe3NeverConvertPct}%.`
                    : `Among KOCs with ≥3 sessions (n=${surv.first3ZeroGe3Count}), ${surv.first3ZeroGe3NeverConvertPct}% never converted.`}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Vai trò Kênh vệ tinh @koc_sat01' : 'In-House Satellite @koc_sat01'}
                </p>
                <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                  1,26 tỷ ({V2.ch4.satelliteSummary.shareOfExtLivePct}% Live ngoài)
                </p>
                <p className="text-slate-500 mt-0.5">
                  {isVi
                    ? '261 phiên live từ kênh vệ tinh nội bộ @koc_sat01 (gộp 2 tên hiển thị qua cùng KOC ID ẩn danh).'
                    : '261 live sessions from in-house satellite @koc_sat01 (merging 2 display names under one pseudonymized KOC ID).'}
                </p>
              </div>
            </div>

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
