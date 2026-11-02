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
        'Mạng lưới creator đối tác có quy mô danh bạ lớn nhưng tỷ lệ gắn bó thấp và phân hóa mạnh; phần lớn doanh thu thực tế dồn vào vài tuần đầu hoặc kênh vệ tinh nội bộ trước khi creator rời bỏ.',
        'The external creator network has large registered breadth but low retention and high polarization; most actual revenue concentrates in initial weeks or in-house streams before creators churn.'
      )}
      soWhat={L(
        'Mạng creator ngoài vận hành như kênh thử nghiệm có tỷ lệ rời bỏ cao và đóng góp nhỏ bên cạnh kênh chính chủ; quy tắc hỗ trợ 3 phiên đầu cần được kiểm tra bằng thử nghiệm có nhóm đối chứng.',
        'The external creator network functions as a high-churn exploratory channel alongside official streams; onboarding support across the first 3 sessions should be evaluated via a controlled experiment.'
      )}
    >
      {/* Ba lát cắt phân tích Chương 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs tabular-nums">
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Quy mô thực & lưu ý mốc mở kỳ T3', 'Network depth & March start-date caveat')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Trong ${sv.totalKocs} KOC ngoài qua ${n(sv.totalSessions)} phiên, ${n(sv.oneSessionPct, 1)}% chỉ live đúng 1 phiên và chỉ ${sv.everOrderCount} KOC (${n(sv.everOrderPct, 1)}%) từng phát sinh đơn hàng. Tỷ lệ giữ chân M+1 của lô tháng 3 (${n(cohorts[0].cells[1].pct ?? 71.2, 1)}%) phản ánh cả creator hiện hữu từ trước mốc thu thập, trước khi giảm dần qua các tháng Hè.`,
              `Across ${sv.totalKocs} external KOCs across ${n(sv.totalSessions)} sessions, ${n(sv.oneSessionPct, 1)}% streamed once and only ${sv.everOrderCount} (${n(sv.everOrderPct, 1)}%) ever converted. March M+1 retention (${n(cohorts[0].cells[1].pct ?? 71.2, 1)}%) reflects pre-existing active partners prior to data capture before decaying through Summer.`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('GMV lũy kế theo lô & tách riêng @koc_sat01', 'Cohort lifetime GMV & isolating @koc_sat01')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Lô T5 ghi nhận tổng GMV vượt trội khi chưa khử trùng do chứa trọn ${n(sat.gmvB, 2)} tỷ đ (${sat.sessions} phiên) của kênh vệ tinh nội bộ @koc_sat01. Khi tách riêng tài khoản này, GMV các lô tuyển mới từ T4 đến T6 tương đương nhau, trước khi lô T9 và T10 hồi phục tích cực theo mùa Thu Đông.`,
              `May cohort totals were inflated raw by ${n(sat.gmvB, 2)}B VND (${sat.sessions} sessions) from in-house @koc_sat01. Isolating this satellite aligns Apr-Jun new cohorts before Sep-Oct show solid seasonal recovery.`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Sống còn ca đầu & gợi ý thử nghiệm 3 ca', 'Session-1 survival & 3-session pilot motivation')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Creator có đơn ngay phiên đầu (${sv.firstSessionOrderCount} KOC) có trung vị gắn bó ${sv.medianSpanFirstOrderDays} ngày so với ${sv.medianSpanFirstZeroDays} ngày ở nhóm không đơn. Đáng chú ý, ${sv.first3ZeroNeverConvertCount}/${sv.first3ZeroCount} KOC (${n(sv.first3ZeroNeverConvertPct, 1)}%) không có đơn sau 3 ca đầu sẽ không bao giờ phát sinh đơn cả kỳ.`,
              `First-session converters (${sv.firstSessionOrderCount} KOCs) show a ${sv.medianSpanFirstOrderDays}d median active span vs ${sv.medianSpanFirstZeroDays}d for non-converters. Critically, ${sv.first3ZeroNeverConvertCount}/${sv.first3ZeroCount} KOCs (${n(sv.first3ZeroNeverConvertPct, 1)}%) zero in their first 3 sessions never convert during the entire period.`
            )}
          </p>
        </div>
      </div>
      {/* 4.1 [CHÍNH] Heatmap retention cohort × M+0...M+7 */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '4.1. Tỷ lệ giữ chân tháng kế tiếp (M+1) giảm từ 71,2% (lô T3) xuống 27,8% (lô T8), sau đó lượng KOC mới tăng lại ở T9-T10',
          '4.1. Month-1 retention declined from 71.2% (Mar cohort) to 27.8% (Aug cohort), while new KOC intake recovered in Sep-Oct'
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams lọc KOC ID ≠ @shop_official [Thời Gian Bắt Đầu Live] · 07/03 - 20/10/2026 · n = ${sv.totalKocs} creator (${n(sv.totalSessions)} phiên). Bản 180 ngày trước đây dừng ở 04/09 nên chỉ ghi nhận 250 creator (bỏ sót 52 KOC mới và 1.189 phiên mùa Thu). Các ô màu xám là vùng bị cắt phải (chưa tới kỳ quan sát); cột cuối ứng với tháng 10 (20 ngày đầu).`,
          `Source: Affiliate_Livestreams excluding @shop_official [Live Start Time] · 07/03 - 20/10/2026 · n = ${sv.totalKocs} creators (${n(sv.totalSessions)} sessions). Gray cells indicate right-censored future months; final diagonal reflects Oct 1-20.`
        )}
      >
        <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800">
          <table className="w-full text-center text-xs tabular-nums border-collapse">
            <thead className="bg-[#C8EEF7]/45 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              <tr>
                <th className="px-2.5 py-2 text-left font-bold">{L('Lô gia nhập', 'Cohort')}</th>
                <th className="px-2.5 py-2 font-bold">{L('KOC mới', 'New KOCs')}</th>
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

      {/* 4.2 [CHÍNH] Đường sống còn Kaplan-Meier */}
      <ChartCard
        height="h-64"
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `4.2. Có đơn ngay phiên đầu (${n(sv.firstSessionOrderPct, 1)}%, n = ${sv.firstSessionOrderCount}) không kéo dài thời gian gắn bó (trung vị ${sv.medianSpanFirstOrderDays} ngày so với ${sv.medianSpanFirstZeroDays} ngày)`,
          `4.2. First-session conversion (${n(sv.firstSessionOrderPct, 1)}%, n = ${sv.firstSessionOrderCount}) does not extend retention (median ${sv.medianSpanFirstOrderDays}d vs ${sv.medianSpanFirstZeroDays}d)`
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams [Ngày live đầu, Ngày live cuối, Doanh Thu Cho Shop phiên 1] · Định nghĩa rời bỏ: nghỉ quá 30 ngày tính đến 20/10 · n = ${sv.totalKocs} creator (${n(sv.everOrderPct, 1)}% từng có đơn). Lưu ý vận hành: Dù đơn phiên 1 chưa kéo dài tuổi thọ, trong ${sv.first3ZeroCount} KOC có 0 đơn ở <= 3 phiên đầu thì ${sv.first3ZeroNeverConvertCount} KOC (${n(sv.first3ZeroNeverConvertPct, 1)}%) không ra đơn cả kỳ (${n(sv.first3ZeroGe3NeverConvertPct, 1)}% với nhóm trụ >= 3 phiên), làm cơ sở thiết kế thử nghiệm hỗ trợ 3 ca đầu có đối chứng ở Chương 6.`,
          `Source: Affiliate_Livestreams [First/Last stream date, Session-1 revenue] · 30-day inactivity churn definition · n = ${sv.totalKocs} creators (${n(sv.everOrderPct, 1)}% ever converted). While session-1 orders do not lengthen tenure, ${sv.first3ZeroNeverConvertCount}/${sv.first3ZeroCount} (${n(sv.first3ZeroNeverConvertPct, 1)}%) of KOCs with zero GMV in their first <=3 sessions never convert, motivating a controlled 3-session onboarding support experiment in Chapter 6.`
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sv.kmSeries} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              type="number"
              dataKey="day"
              domain={[0, 180]}
              ticks={[0, 14, 30, 60, 90, 120, 150, 180]}
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
                      `Sau ${lbl} ngày (Còn quan sát: ${r?.firstOrderRisk ?? 0} và ${r?.firstZeroRisk ?? 0} KOC)`,
                      `Day ${lbl} (At risk: ${r?.firstOrderRisk ?? 0} & ${r?.firstZeroRisk ?? 0} KOCs)`
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
      </ChartCard>

      {/* 4.3 & 4.4 [XEM THÊM] */}
      <ExpandableMoreSection
        title={L(
          `4.3 - 4.4. Tác động của kênh vệ tinh @koc_sat01 (${n(sat.shareOfExtLivePct, 1)}% GMV mạng ngoài) và phễu KOC theo tháng`,
          `4.3 - 4.4. Impact of satellite @koc_sat01 (${n(sat.shareOfExtLivePct, 1)}% of external GMV) and monthly KOC funnel`
        )}
        countLabel={L('2 biểu đồ mở rộng', '2 charts')}
      >
        <div className="space-y-3.5">
          {/* 4.3 GMV theo tháng có và không có @koc_sat01 */}
          <ChartCard
            height="h-60"
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
              `4.3. Tài khoản vệ tinh @koc_sat01 (${sat.sessions} phiên, ${n(sat.gmvB, 2)} tỷ đ) tạo ${n(sat.shareOfExtLivePct, 1)}% tổng GMV Live mạng ngoài`,
              `4.3. In-house satellite @koc_sat01 (${sat.sessions} sessions, ${n(sat.gmvB, 2)}B VND) drives ${n(sat.shareOfExtLivePct, 1)}% of external Live GMV`
            )}
            footer={L(
              `Nguồn: Affiliate_Livestreams lọc KOC ID ≠ @shop_official · 07/03 - 20/10/2026 · n = ${n(sv.totalSessions)} phiên.`,
              `Source: Affiliate_Livestreams excluding @shop_official · 07/03 - 20/10/2026 · n = ${n(sv.totalSessions)} sessions.`
            )}
          >
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
                  name={L('KOC độc lập mới trong tháng', 'New independent KOCs')}
                  fill={KAMI_BRAND_PALETTE.cyan}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="priorCohortGmvM"
                  stackId="kocGmv"
                  name={L('KOC độc lập từ lô cũ ở lại', 'Retained independent KOCs')}
                  fill={KAMI_BRAND_PALETTE.tealInk}
                  isAnimationActive={false}
                />
                {includeSat && (
                  <Bar
                    dataKey="satGmvM"
                    stackId="kocGmv"
                    name={L('Kênh vệ tinh @koc_sat01', 'Satellite @koc_sat01')}
                    fill={KAMI_BRAND_PALETTE.amber}
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={false}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 4.4 Cột Creator Mới / Còn xuất hiện / Có đơn theo tháng */}
          <ChartCard
            height="h-56"
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              '4.4. Số lượng KOC mới, tổng KOC đang phát sóng và số KOC thực sự ra đơn theo từng tháng',
              '4.4. Monthly new, active, and order-converting KOC headcount'
            )}
            footer={L(
              `Nguồn: Affiliate_Livestreams lọc KOC ID ≠ @shop_official · n = ${sv.totalKocs} creator.`,
              `Source: Affiliate_Livestreams excluding @shop_official · n = ${sv.totalKocs} creators.`
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFunnel} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="shortLabel" tick={axisTick} />
                <YAxis width={46} tick={axisTick} />
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 0)} KOC`} />} />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="activeKocs" name={L('Tổng KOC có phát sóng', 'Active KOCs')} fill={KAMI_BRAND_PALETTE.ice} stroke={KAMI_BRAND_PALETTE.tealInk} strokeWidth={0.8} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="newKocs" name={L('KOC gia nhập mới', 'Newly onboarded KOCs')} fill={KAMI_BRAND_PALETTE.cyan} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="convertingKocs" name={L('KOC có phát sinh đơn', 'Order-converting KOCs')} fill={KAMI_BRAND_PALETTE.tealInk} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}
