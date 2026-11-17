'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChapterShell,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  ExpandableMoreSection,
  axisTick,
  legendFormatter,
  GRID_STROKE,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Chapter4KocNetwork() {
  const { L, n } = usePlaybookLang();
  const cohorts = V2.ch4.cohortRetention;
  const sv = V2.ch4.survival;
  const sat = V2.ch4.satelliteSummary;
  const monthlyFunnel = V2.ch4.monthlyGmvAndFunnel;
  const [includeSat, setIncludeSat] = useState(true);

  // Cắt chuỗi Kaplan-Meier ở mốc 90 ngày
  const kmData90 = sv.kmSeries.filter((pt) => pt.day <= 90);
  const atRiskMilestones = [0, 14, 30, 60, 90];
  const atRiskRows = atRiskMilestones.map((mDay) => {
    const pt = kmData90.slice().reverse().find((p) => p.day <= mDay) ?? kmData90[0];
    return {
      day: mDay,
      orderRisk: pt?.firstOrderRisk ?? 0,
      zeroRisk: pt?.firstZeroRisk ?? 0,
    };
  });

  const cellStyle = (pct: number | null, censored: boolean) => {
    if (censored || pct === null) {
      return 'bg-slate-100 text-slate-400 dark:bg-slate-800/70 dark:text-slate-500';
    }
    if (pct >= 99.9) {
      return 'bg-[#0D7287] text-white font-extrabold';
    }
    if (pct >= 50) {
      return 'bg-[#9BE7FA] text-slate-950 font-bold';
    }
    if (pct >= 25) {
      return 'bg-[#C8EEF7] text-slate-900 font-semibold dark:bg-[#9BE7FA]/30 dark:text-white';
    }
    if (pct > 0) {
      return 'bg-[#FFE485]/55 text-amber-950 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]';
    }
    return 'bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500';
  };

  return (
    <ChapterShell
      id="sec-ch4-koc"
      chapterNum={L('Chương 4', 'Chapter 4')}
      title={L('Độ bền mạng lưới KOC và kiểm định sống còn creator', 'KOC network retention and creator survival testing')}
      scopeLabel={L(`AffLive · ${sv.totalKocs} KOC · ${n(sv.totalSessions)} phiên`, `AffLive · ${sv.totalKocs} KOCs · ${n(sv.totalSessions)} sessions`)}
      question={L('Creator mới có ở lại và ra đơn không?', 'Do newly onboarded creators stay active and generate orders?')}
      conclusion={L(
        'Có đơn ở phiên đầu không làm thay đổi thời gian gắn bó của creator (log-rank p = 0,98); mạng lưới đối tác ngoài có tỷ lệ rời bỏ cao.',
        'First-session order conversion does not alter creator retention duration (log-rank p = 0.98); the affiliate network exhibits rapid churn.'
      )}
      soWhat={L(
        'Mạng creator ngoài vận hành như kênh thử nghiệm có tỷ lệ rời bỏ cao và đóng góp nhỏ bên cạnh kênh chính chủ; quy tắc hỗ trợ 3 phiên đầu cần được kiểm tra bằng thử nghiệm có nhóm đối chứng.',
        'The external creator network functions as a high-churn exploratory channel alongside official streams; onboarding support across the first 3 sessions should be evaluated via a controlled experiment.'
      )}
    >
      {/* 1 thẻ Lưu ý khi đọc (thay thế 3 thẻ cũ) */}
      <div className="rounded-xl border border-[#9BE7FA]/80 bg-[#C8EEF7]/30 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
        <div className="text-xs font-extrabold text-[#074553] dark:text-[#9BE7FA]">
          {L('Lưu ý khi đọc số liệu mạng lưới creator', 'Notes on creator network retention')}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed tabular-nums">
          {L(
            'Quan sát "77,2% creator có 0 đơn sau 3 ca đầu không bao giờ phát sinh đơn" là kết quả hồi cứu có thiên lệch chọn mẫu; kênh vệ tinh nội bộ @koc_sat01 chiếm tới 43,7% GMV Live ngoài shop và cần được phân tích riêng.',
            'The finding that "77.2% of creators zero in their first 3 sessions never convert" is a retrospective observation subject to survival bias; internal satellite @koc_sat01 drives 43.7% of non-shop Live GMV and must be analyzed separately.'
          )}
        </p>
      </div>
      {/* 4.1 [CHÍNH] Heatmap retention cohort */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '4.1. Tỷ lệ giữ chân M+1 giảm từ 71,2% ở T3 xuống 27,8% ở T8',
          '4.1. Month-1 retention dropped from 71.2% in Mar to 27.8% in Aug'
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams lọc KOC ID ≠ @shop_official [Thời Gian Bắt Đầu Live] · 07/03 - 20/10/2026 · n = ${sv.totalKocs} creator (${n(sv.totalSessions)} phiên). Các ô màu xám là vùng bị cắt phải (chưa tới kỳ quan sát); cột cuối ứng với tháng 10 (20 ngày đầu).`,
          `Source: Affiliate_Livestreams excluding @shop_official [Live Start Time] · 07/03 - 20/10/2026 · n = ${sv.totalKocs} creators (${n(sv.totalSessions)} sessions). Gray cells indicate right-censored future months; final diagonal reflects Oct 1-20.`
        )}
      >
        <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800">
          <table className="w-full text-center text-xs tabular-nums border-collapse">
            <thead className="bg-[#C8EEF7]/45 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              <tr>
                <th className="px-2.5 py-2 text-left font-bold">{L('Lô gia nhập', 'Cohort')}</th>
                <th className="px-2.5 py-2 font-bold">{L('Creator mới', 'New creators')}</th>
                {Array.from({ length: 8 }, (_, idx) => (
                  <th key={idx} className="px-2 py-2 font-bold">
                    M+{idx}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((row) => (
                <tr key={row.cohortMonth} className="border-t border-slate-100 dark:border-slate-800/70">
                  <td className="px-2.5 py-2 text-left font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.shortLabel}/2026
                  </td>
                  <td className="px-2.5 py-2 font-extrabold text-[#074553] dark:text-[#9BE7FA]">{row.size}</td>
                  {row.cells.map((c) => (
                    <td key={c.offset} className={`px-1.5 py-1.5 ${cellStyle(c.pct, c.censored)}`}>
                      {c.censored || c.pct === null ? (
                        <span aria-label={L('Chưa quan sát', 'Right-censored')}>·</span>
                      ) : (
                        <div className="leading-tight">
                          <div>{n(c.pct, 1)}%</div>
                          <div className="text-[11px] opacity-80">({c.n})</div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* 4.2 [CHÍNH] Đường sống còn Kaplan-Meier cắt ở 90 ngày */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '4.2. Đơn phiên đầu không làm tăng thời gian gắn bó (log-rank p = 0,98)',
          '4.2. First-session conversion does not prolong tenure (log-rank p = 0.98)'
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams · Cắt ở mốc 90 ngày · n = ${sv.totalKocs} creator (${n(sv.everOrderPct, 1)}% từng có đơn). Có đơn phiên 1 đạt trung vị ${sv.medianSpanFirstOrderDays} ngày so với ${sv.medianSpanFirstZeroDays} ngày ở nhóm không đơn.`,
          `Source: Affiliate_Livestreams · Cut at 90 days · n = ${sv.totalKocs} creators (${n(sv.everOrderPct, 1)}% ever converted). First-session order median tenure is ${sv.medianSpanFirstOrderDays}d vs ${sv.medianSpanFirstZeroDays}d.`
        )}
      >
        <div className="space-y-3 pt-1">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kmData90} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  type="number"
                  dataKey="day"
                  domain={[0, 90]}
                  ticks={[0, 14, 30, 45, 60, 75, 90]}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v}N`}
                />
                <YAxis domain={[0, 100]} width={48} tick={axisTick} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl, pl) => {
                        const r = pl?.[0]?.payload;
                        return L(
                          `Sau ${lbl} ngày (Còn quan sát: ${r?.firstOrderRisk ?? 0} và ${r?.firstZeroRisk ?? 0} creator)`,
                          `Day ${lbl} (At risk: ${r?.firstOrderRisk ?? 0} & ${r?.firstZeroRisk ?? 0} creators)`
                        );
                      }}
                      fmt={(v) => `${n(v, 1)}%`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Line
                  type="stepAfter"
                  dataKey="firstOrderPct"
                  name={L(`Có đơn ở phiên 1 (n = ${sv.firstSessionOrderCount}, trung vị ${sv.medianSpanFirstOrderDays}N)`, `1st-session order (n = ${sv.firstSessionOrderCount}, med ${sv.medianSpanFirstOrderDays}d)`)}
                  stroke={KAMI_BRAND_PALETTE.amberStroke}
                  strokeWidth={2.3}
                  dot={{ r: 2.5, fill: KAMI_BRAND_PALETTE.amber }}
                  isAnimationActive={false}
                />
                <Line
                  type="stepAfter"
                  dataKey="firstZeroPct"
                  name={L(`Không đơn ở phiên 1 (n = ${sv.totalKocs - sv.firstSessionOrderCount}, trung vị ${sv.medianSpanFirstZeroDays}N)`, `Zero 1st-session order (n = ${sv.totalKocs - sv.firstSessionOrderCount}, med ${sv.medianSpanFirstZeroDays}d)`)}
                  stroke={KAMI_BRAND_PALETTE.tealInk}
                  strokeWidth={2.3}
                  dot={{ r: 2.5, fill: KAMI_BRAND_PALETTE.cyan }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Hàng số creator còn quan sát (At-risk table) */}
          <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/15 p-2 text-xs tabular-nums">
            <div className="font-bold text-[#074553] dark:text-[#9BE7FA] mb-1">
              {L('Số lượng creator còn trong diện theo dõi (At-risk):', 'Number of creators at risk:')}
            </div>
            <div className="grid grid-cols-6 gap-1 text-center font-mono text-[11px]">
              <div className="text-left font-sans font-semibold text-slate-700 dark:text-slate-300">
                {L('Mốc thời gian', 'Milestone')}
              </div>
              {atRiskRows.map((r) => (
                <div key={r.day} className="font-bold text-slate-900 dark:text-white">{r.day}N</div>
              ))}
              <div className="text-left font-sans text-amber-800 dark:text-[#FFE485]">
                {L('Có đơn P1', '1st order')}
              </div>
              {atRiskRows.map((r) => (
                <div key={`order-${r.day}`} className="text-amber-800 dark:text-[#FFE485] font-semibold">{r.orderRisk}</div>
              ))}
              <div className="text-left font-sans text-[#0D7287] dark:text-[#9BE7FA]">
                {L('Không đơn P1', 'Zero P1')}
              </div>
              {atRiskRows.map((r) => (
                <div key={`zero-${r.day}`} className="text-[#0D7287] dark:text-[#9BE7FA] font-semibold">{r.zeroRisk}</div>
              ))}
            </div>
          </div>
        </div>
      </ChartCard>

      {/* 4.3 [XEM THÊM] Gộp vai trò @koc_sat01 và phễu creator theo tháng */}
      <ExpandableMoreSection
        title={L(
          'Xem thêm: vai trò kênh vệ tinh @koc_sat01 và phễu creator theo tháng',
          'More: satellite @koc_sat01 role and monthly creator funnel'
        )}
        countLabel={L('1 phân tích mở rộng', '1 deep-dive')}
      >
        <ChartCard
          height=""
          badge={
            <div className="inline-flex rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/30 p-0.5 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setIncludeSat(true)}
                className={`min-h-[44px] px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  includeSat ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {L('Gồm @koc_sat01', 'With @koc_sat01')}
              </button>
              <button
                type="button"
                onClick={() => setIncludeSat(false)}
                className={`min-h-[44px] px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  !includeSat ? 'bg-[#FFD14C] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {L('Bỏ @koc_sat01', 'Excl. @koc_sat01')}
              </button>
            </div>
          }
          title={L(
            '4.3. Kênh vệ tinh tạo 43,7% GMV ngoài shop; phễu creator theo tháng',
            '4.3. Satellite drives 43.7% of external GMV; monthly creator funnel'
          )}
          footer={L(
            `Nguồn: Affiliate_Livestreams lọc KOC ID ≠ @shop_official · 07/03 - 20/10/2026 · n = ${sv.totalKocs} creator.`,
            `Source: Affiliate_Livestreams excluding @shop_official · 07/03 - 20/10/2026 · n = ${sv.totalKocs} creators.`
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
            {/* Panel trái: GMV theo tháng có/không sat */}
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {L('Cơ cấu GMV đối tác ngoài theo tháng (Triệu đ)', 'External Live GMV by month (Million VND)')}
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFunnel} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="shortLabel" tick={axisTick} />
                    <YAxis width={50} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                    <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 1)} Tr đ`} />} />
                    <Legend formatter={legendFormatter} />
                    <Bar
                      dataKey="newCohortGmvM"
                      stackId="kocGmv"
                      name={L('KOC độc lập mới', 'New independent KOCs')}
                      fill={KAMI_BRAND_PALETTE.cyan}
                      isAnimationActive={false}
                    />
                    <Bar
                      dataKey="priorCohortGmvM"
                      stackId="kocGmv"
                      name={L('KOC độc lập cũ', 'Retained independent KOCs')}
                      fill={KAMI_BRAND_PALETTE.tealInk}
                      isAnimationActive={false}
                    />
                    {includeSat && (
                      <Bar
                        dataKey="satGmvM"
                        stackId="kocGmv"
                        name={L('Vệ tinh @koc_sat01', 'Satellite @koc_sat01')}
                        fill={KAMI_BRAND_PALETTE.amber}
                        radius={[5, 5, 0, 0]}
                        isAnimationActive={false}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Panel phải: Phễu nhân sự KOC */}
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {L('Số lượng creator mới, phát sóng và có đơn', 'New, active, and converting creators')}
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFunnel} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="shortLabel" tick={axisTick} />
                    <YAxis width={46} tick={axisTick} />
                    <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 0)} creator`} />} />
                    <Legend formatter={legendFormatter} />
                    <Bar dataKey="activeKocs" name={L('Tổng KOC phát sóng', 'Active KOCs')} fill={KAMI_BRAND_PALETTE.ice} stroke={KAMI_BRAND_PALETTE.tealInk} strokeWidth={0.8} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="newKocs" name={L('Gia nhập mới', 'New')} fill={KAMI_BRAND_PALETTE.cyan} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="convertingKocs" name={L('Có phát sinh đơn', 'Converting')} fill={KAMI_BRAND_PALETTE.tealInk} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </ChartCard>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}
