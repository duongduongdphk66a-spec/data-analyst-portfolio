'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  ChapterShell,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  ExpandableMoreSection,
  GranularityToggle,
  axisTick,
  legendFormatter,
  GRID_STROKE,
  useChartGranularity,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Chapter3SeasonalityAndRegression() {
  const { L, n } = usePlaybookLang();
  const [yieldGranularity, setYieldGranularity] = useChartGranularity<'month' | 'week'>('month', [
    'month',
    'week',
  ]);
  const daily = V2.ch0.dailySeries;
  const ch3 = V2.ch3;
  const yieldSeries =
    yieldGranularity === 'week'
      ? (ch3.weekly || []).map((w) => ({
          xLabel: w.week,
          ddmm: w.ddmm,
          days: w.days,
          storeLives: w.storeLives,
          storeGmvPerLiveM: w.storeGmvPerLiveM,
          actualLiveGmvPerSessionM: w.actualLiveGmvPerSessionM,
        }))
      : ch3.monthly.map((m) => ({
          xLabel: m.shortLabel,
          ddmm: m.month,
          days: m.days,
          storeLives: m.storeLives,
          storeGmvPerLiveM: m.storeGmvPerLiveM,
          actualLiveGmvPerSessionM: m.actualLiveGmvPerSessionM,
        }));
  const yieldXKey = 'xLabel';
  const s10 = ch3.sku10Summary;
  const wf1 = ch3.waterfalls.junToJul;
  const wf2 = ch3.waterfalls.julToAug;
  const wfAll = ch3.waterfalls.junToAug;

  return (
    <ChapterShell
      id="sec-ch3-season"
      chapterNum={L('Chương 3', 'Chapter 3')}
      title={L('Biến động doanh thu, phân rã hai pha và chuyển mùa danh mục', 'Revenue volatility, two-phase contraction, and seasonal SKU rotation')}
      scopeLabel={L('Store 231N · SKU10 (1.790 dòng)', 'Store 231d · SKU10 (1,790 rows)')}
      question={L('Biên độ biến động do mùa vụ sản phẩm hay do cường độ marketing?', 'Is revenue volatility driven by product seasonality or marketing intensity?')}
      conclusion={L(
        'GMV tăng gấp bốn từ T3 (0,95 tỷ) lên T6 (3,77 tỷ), giảm 83,1% xuống T8 (0,64 tỷ) rồi hồi lên 1,62 tỷ trong 25 ngày T10. Số ca live giảm mạnh từ T7 (1.560 xuống 836), nhưng việc T7 giảm do số ca hay do năng suất mỗi ca phụ thuộc thước đo (GMV toàn shop mỗi ca chỉ sụp ở T8; GMV Live mỗi phiên giảm từ T7 nhưng T6 bị đẩy cao vì gán theo giờ mở ca); riêng đợt hồi phục T10 đến từ năng suất mỗi ca, không phải số ca.',
        'GMV quadrupled from Mar (0.95B) to Jun (3.77B), dropped 83.1% to Aug (0.64B), and recovered to 1.62B in 25 days of Oct. Live sessions fell steeply in Jul (1,560 to 836), but whether Jul contracted via volume or yield depends on the metric (Store GMV/Live crashed in Aug; pure Live GMV/session fell from Jul though Jun was inflated by start-time booking); October recovery was yield-driven, not volume-driven.'
      )}
      soWhat={L(
        'Danh mục đảo chiều sang hàng Thu Đông từ tuần 31/08 (tỷ trọng Thu Đông từ 46,0% lên 70,8% trong một tuần). Dữ liệu một mùa không tách được mùa vụ khỏi cường độ marketing, nên kế hoạch hàng và lịch live cần đi trước chuyển mùa một đến hai tháng.',
        'The catalog rotated to Autumn-Winter from week 31/08 (winter share surged from 46.0% to 70.8% in one week). Single-season data cannot separate seasonality from marketing intensity, requiring stock and Live scheduling 1-2 months ahead of rotation.'
      )}
    >
      {/* 1 thẻ Lưu ý khi đọc (thay thế 3 thẻ cũ) */}
      <div className="rounded-xl border border-[#9BE7FA]/80 bg-[#C8EEF7]/30 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
        <div className="text-xs font-extrabold text-[#074553] dark:text-[#9BE7FA]">
          {L('Lưu ý khi đọc số liệu mùa vụ và năng suất ca', 'Notes on seasonality and session yield metrics')}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed tabular-nums">
          {L(
            'Thước Store ("GMV toàn shop trên mỗi ca Live") giữ 2,54 Tr ở T7 nhờ doanh thu Video và kệ hàng đệm vào tử số; trong khi thước Live thực trên AffLive giảm từ T7 do phiên lớn kéo dài qua đêm được gán trọn vào giờ mở ca tháng 6. Giá trị z-score chuẩn mực của đỉnh 16/06 là +6,81 (tính lùi 28 ngày trước đó, không gồm ngày đỉnh).',
            'Store metric ("Store GMV per Live") held at 2.54M in Jul buffered by Video and Card sales; whereas pure Live session yield on AffLive fell from Jul because overnight sessions booked entirely to June start hours. The standardized z-score for the June 16 peak is +6.81 (trailing 28-day window excluding peak day).'
          )}
        </p>
      </div>

      {/* 3.1 [CHÍNH] GMV ngày + MA7 + MA28 với 4 pha mùa vụ và 4 mốc MA7 < MA28 */}
      <ChartCard
        height="h-64 sm:h-72"
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '3.1. GMV 231 ngày qua 4 pha và 4 mốc MA7 cắt xuống MA28',
          '3.1. 231-day GMV across four seasonal phases and four MA cross events'
        )}
        footer={L(
          `Nguồn: Store_Daily_Overview · 09/03 - 25/10/2026 · n = ${V2.meta.days} ngày. Đỉnh 16/06 đạt 315,0 Tr đ (z = +6,81). 4 mốc MA7 < MA28: 29/04, 04/06, 26/06 và 22/10. Dải màu: Pha 1 Tăng trưởng, Pha 2 Đỉnh hè, Pha 3 Suy giảm, Pha 4 Thu Đông.`,
          `Source: Store_Daily_Overview · 09/03 - 25/10/2026 · n = ${V2.meta.days} days. Peak Jun 16 reached 315.0M VND (z = +6.81). Four MA7 < MA28 crosses: 29/04, 04/06, 26/06, 22/10.`
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={daily} margin={{ top: 22, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <ReferenceArea
              x1="09/03"
              x2="31/05"
              fill={KAMI_BRAND_PALETTE.ice}
              fillOpacity={0.25}
              label={{ value: L('Pha 1: Tăng trưởng', 'Phase 1: Ramp'), position: 'insideTopLeft', fill: '#074553', fontSize: 10, fontWeight: 700 }}
            />
            <ReferenceArea
              x1="01/06"
              x2="30/06"
              fill={KAMI_BRAND_PALETTE.cyan}
              fillOpacity={0.3}
              label={{ value: L('Pha 2: Đỉnh hè', 'Phase 2: Peak'), position: 'insideTop', fill: '#074553', fontSize: 10, fontWeight: 700 }}
            />
            <ReferenceArea
              x1="01/07"
              x2="31/08"
              fill={KAMI_BRAND_PALETTE.butter}
              fillOpacity={0.35}
              label={{ value: L('Pha 3: Suy giảm', 'Phase 3: Drop'), position: 'insideTop', fill: '#92400E', fontSize: 10, fontWeight: 700 }}
            />
            <ReferenceArea
              x1="01/09"
              x2="25/10"
              fill={KAMI_BRAND_PALETTE.ice}
              fillOpacity={0.2}
              label={{ value: L('Pha 4: Thu Đông', 'Phase 4: Autumn'), position: 'insideTopRight', fill: '#074553', fontSize: 10, fontWeight: 700 }}
            />
            <XAxis dataKey="ddmm" tick={axisTick} interval={24} />
            <YAxis width={52} domain={[0, 340]} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
            <Tooltip
              content={
                <ChartTooltip
                  head={(lbl) => L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`)}
                  fmt={(v) => `${n(v, 1)} Tr đ`}
                />
              }
            />
            <Legend formatter={legendFormatter} />
            <Line
              type="monotone"
              dataKey="gmvM"
              name={L('GMV ngày', 'Daily GMV')}
              stroke={KAMI_BRAND_PALETTE.slateMuted}
              strokeWidth={1.25}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ma7M"
              name="MA7"
              stroke={KAMI_BRAND_PALETTE.tealInk}
              strokeWidth={2.3}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ma28M"
              name="MA28"
              stroke={KAMI_BRAND_PALETTE.amberStroke}
              strokeWidth={1.8}
              strokeDasharray="5 3"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            {ch3.maCrossovers.map((c, idx) => {
              // Phân tách vị trí nhãn 04/06 và 26/06 để không chen chúc
              let pos: 'insideTopLeft' | 'insideTopRight' | 'top' = 'insideTopLeft';
              if (c.ddmm === '04/06') pos = 'insideTopLeft';
              if (c.ddmm === '26/06') pos = 'insideTopRight';
              if (c.ddmm === '22/10') pos = 'insideTopRight';
              return (
                <ReferenceLine
                  key={c.date}
                  x={c.ddmm}
                  stroke={idx === 2 ? KAMI_BRAND_PALETTE.negative : KAMI_BRAND_PALETTE.amberStroke}
                  strokeDasharray="3 3"
                  label={{
                    value: c.ddmm,
                    position: pos,
                    fill: idx === 2 ? KAMI_BRAND_PALETTE.negative : KAMI_BRAND_PALETTE.amberStroke,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3.2 [CHÍNH] Số ca Live và GMV mỗi ca theo tháng / tuần */}
      <ChartCard
        height=""
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <GranularityToggle
              value={yieldGranularity}
              onChange={setYieldGranularity}
              options={[
                { id: 'month', label: L('Tháng (8T)', 'Month (8M)') },
                { id: 'week', label: L('Tuần (33W)', 'Week (33W)') },
              ]}
            />
            <ChartRoleBadge kind="main" />
          </div>
        }
        title={L(
          '3.2. Số ca live giảm 46% ở T7; GMV mỗi ca sụp ở T8 hoặc từ T7',
          '3.2. Live sessions fell 46% in Jul; session yield dropped at T8 or T7'
        )}
        footer={L(
          'Nguồn: Store_Daily_Overview và Affiliate_Livestreams · T3 (23 ngày) và T10 (25 ngày) là tháng thiếu. Thước Store: GMV toàn shop trên mỗi ca Live giữ mức 2,54 Tr ở T7 do Video & Kệ hàng đệm vào; thước Live thực trên AffLive giảm từ T7.',
          'Source: Store_Daily_Overview and Affiliate_Livestreams · Mar (23d) and Oct (25d) are partial months. Store GMV per Live session buffered by non-Live sales in Jul; pure Live session yield dropped from Jul.'
        )}
      >
        <div className="space-y-3.5 pt-1">
          {/* Panel trên: Số ca Live theo tháng / tuần */}
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              {yieldGranularity === 'week'
                ? L('Panel trên: Số ca Livestream mới theo tuần ISO (33 tuần)', 'Top panel: Weekly Live session count across 33 ISO weeks')
                : L('Panel trên: Số ca Livestream mới theo tháng (bắt đầu từ 0)', 'Top panel: Monthly Live session count (zero baseline)')}
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldSeries} margin={{ top: 10, right: 16, left: 4, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey={yieldXKey} tick={axisTick} interval={yieldGranularity === 'week' ? 2 : 0} />
                  <YAxis domain={[0, yieldGranularity === 'week' ? 600 : 2200]} width={50} tick={axisTick} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl, pl) => {
                          const r = pl?.[0]?.payload;
                          if (yieldGranularity === 'week') {
                            return L(
                              `Tuần ${lbl} (từ ${r?.ddmm ?? ''} · ${r?.days ?? 7}N)`,
                              `Week ${lbl} (from ${r?.ddmm ?? ''} · ${r?.days ?? 7}d)`
                            );
                          }
                          return L(
                            `Tháng ${lbl}/2026 (${r?.days ?? 30} ngày)`,
                            `Month ${lbl}/2026 (${r?.days ?? 30} days)`
                          );
                        }}
                        fmt={(v) => `${n(v, 0)} ca`}
                      />
                    }
                  />
                  <Bar
                    dataKey="storeLives"
                    name={
                      yieldGranularity === 'week'
                        ? L('Số ca Live tuần (Store)', 'Weekly Live count')
                        : L('Số ca Live tháng (Store)', 'Monthly Live count')
                    }
                    fill={KAMI_BRAND_PALETTE.cyan}
                    stroke={KAMI_BRAND_PALETTE.tealInk}
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel dưới: GMV mỗi ca */}
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              {L('Panel dưới: Hiệu suất doanh thu bình quân mỗi ca (Triệu đ/ca, bắt đầu từ 0)', 'Bottom panel: Average revenue yield per session (Million VND, zero baseline)')}
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldSeries} margin={{ top: 10, right: 16, left: 4, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey={yieldXKey} tick={axisTick} interval={yieldGranularity === 'week' ? 2 : 0} />
                  <YAxis domain={[0, yieldGranularity === 'week' ? 5.5 : 3.5]} width={50} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl, pl) => {
                          const r = pl?.[0]?.payload;
                          return yieldGranularity === 'week'
                            ? L(`Tuần ${lbl} (từ ${r?.ddmm ?? ''})`, `Week ${lbl} (from ${r?.ddmm ?? ''})`)
                            : L(`Tháng ${lbl}/2026`, `Month ${lbl}/2026`);
                        }}
                        fmt={(v) => `${n(v, 2)} Tr đ`}
                      />
                    }
                  />
                  <Legend formatter={legendFormatter} />
                  <Bar
                    dataKey="storeGmvPerLiveM"
                    name={L('GMV toàn shop trên mỗi ca Live', 'Store GMV per Live session')}
                    fill={KAMI_BRAND_PALETTE.tealInk}
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="actualLiveGmvPerSessionM"
                    name={L('GMV Live thực / phiên (AffLive)', 'Pure Live GMV / session (AffLive)')}
                    fill={KAMI_BRAND_PALETTE.amber}
                    stroke={KAMI_BRAND_PALETTE.amberStroke}
                    strokeWidth={0.8}
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bảng phân rã Waterfall T6 → T7, T7 → T8, T6 → T8 kèm thanh trực quan */}
          <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-2">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white">
              {L('Phân rã đại số mức sụt giảm GMV (Hiệu ứng số lượng ΔN·Y₀ + Hiệu suất N₀·ΔY + Tương tác ΔN·ΔY)', 'Algebraic decomposition of GMV contraction (Volume + Yield + Cross-interaction)')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs tabular-nums">
              {[wf1, wf2, wfAll].map((w) => {
                const maxBarRef = 2200;
                const volBarPct = Math.min(100, Math.round((Math.abs(w.volEffectM) / maxBarRef) * 100));
                const yieldBarPct = Math.min(100, Math.round((Math.abs(w.yieldEffectM) / maxBarRef) * 100));
                const dominantDriver =
                  Math.abs(w.volEffectM) >= Math.abs(w.yieldEffectM)
                    ? L('Chủ đạo: Sụt số lượng ca', 'Primary driver: Session volume')
                    : L('Chủ đạo: Sụt năng suất/ca', 'Primary driver: Session yield');
                return (
                  <div key={`${w.from}-${w.to}`} className="rounded-lg bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 p-2.5 space-y-1.5">
                    <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex justify-between items-center">
                      <span>{w.from} → {w.to}</span>
                      <span className="text-rose-600 dark:text-rose-400">{n(w.deltaM, 1)} Tr ({n(w.deltaPct, 1)}%)</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {dominantDriver}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span>{L('Do số lượng ca (ΔN·Y₀):', 'Volume effect (ΔN·Y₀):')}</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">{n(w.volEffectM, 1)} Tr</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" style={{ width: `${volBarPct}%` }} />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span>{L('Do GMV/ca (N₀·ΔY):', 'Yield effect (N₀·ΔY):')}</span>
                        <span className={`font-bold ${w.yieldEffectM >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {w.yieldEffectM > 0 ? `+${n(w.yieldEffectM, 1)}` : n(w.yieldEffectM, 1)} Tr
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${w.yieldEffectM >= 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${yieldBarPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-0.5 border-t border-slate-100 dark:border-slate-800">
                      <span>{L('Tương tác chéo (ΔN·ΔY):', 'Interaction (ΔN·ΔY):')}</span>
                      <span>{w.interEffectM > 0 ? `+${n(w.interEffectM, 1)}` : n(w.interEffectM, 1)} Tr</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {L(
                `Giải thích kỹ thuật: Khi cả số lượng ca (ΔN < 0) và hiệu suất mỗi ca (ΔY < 0) cùng giảm ở giai đoạn T6 → T8, tích số tương tác ΔN × ΔY mang dấu dương (+${n(wfAll.interEffectM, 1)} Tr đ), giúp tránh trừ trùng phần doanh thu đã mất nên tổng hai hiệu ứng riêng lẻ lớn hơn 100% mức giảm ròng.`,
                `Technical note: When both session count (ΔN < 0) and yield (ΔY < 0) decline simultaneously across Jun → Aug, the cross-term ΔN × ΔY is positive (+${n(wfAll.interEffectM, 1)}M VND) to prevent double-counting lost volume, explaining why pure volume and yield shares exceed 100% of the net drop.`
              )}
            </p>
          </div>
        </div>
      </ChartCard>

      {/* 3.3 [CHÍNH] Mùa vụ 10 SKU chủ lực */}
      <ChartCard
        height="h-64"
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '3.3. Đảo chiều danh mục tại tuần 31/08: Thu Đông đạt 70,8% vào tháng 10',
          '3.3. Catalog rotated in week 31/08: Autumn-Winter reached 70.8% in October'
        )}
        footer={L(
          `Nguồn: 10_SKU_Daily_Timeseries · 30/04 - 25/10/2026 · n = 1.790 dòng (${n(s10.totalGmvB, 2)} tỷ đ; riêng AT06 đạt ${n(s10.octAt06GmvB, 2)} tỷ đ = ${n(s10.octAt06SharePct, 1)}% doanh thu 10 mã trong tháng 10).`,
          `Source: 10_SKU_Daily_Timeseries · 30/04 - 25/10/2026 · n = 1,790 rows (${n(s10.totalGmvB, 2)}B VND; AT06 alone drove ${n(s10.octAt06GmvB, 2)}B = ${n(s10.octAt06SharePct, 1)}% of 10-SKU GMV in October).`
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ch3.skuWeekly100} margin={{ top: 16, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="ddmm" tick={axisTick} interval={2} />
            <YAxis domain={[0, 100]} width={46} tick={axisTick} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip
              content={
                <ChartTooltip
                  head={(lbl, pl) => {
                    const r = pl?.[0]?.payload;
                    return L(
                      `Tuần ${r?.week ?? ''} (từ ${lbl}/2026) · AT06 = ${n(r?.at06Pct ?? 0, 1)}%`,
                      `Week ${r?.week ?? ''} (from ${lbl}/2026) · AT06 = ${n(r?.at06Pct ?? 0, 1)}%`
                    );
                  }}
                  fmt={(v) => `${n(v, 1)}%`}
                  extraRow={(pl) => {
                    const r = pl?.[0]?.payload;
                    return r
                      ? L(
                          `Hè: ${n(r.summerM, 1)} Tr đ | Thu Đông: ${n(r.winterM, 1)} Tr đ`,
                          `Summer: ${n(r.summerM, 1)}M | Winter: ${n(r.winterM, 1)}M`
                        )
                      : null;
                  }}
                />
              }
            />
            <Legend formatter={legendFormatter} />
            <Area
              type="monotone"
              dataKey="summerPct"
              stackId="season100"
              name={L('5 SKU Đồ bơi Hè (H36, M18, H32, SW01, H30)', '5 Summer Swimwear SKUs')}
              stroke={KAMI_BRAND_PALETTE.amberStroke}
              fill={KAMI_BRAND_PALETTE.amber}
              fillOpacity={0.75}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="winterPct"
              stackId="season100"
              name={L('5 SKU Thu Đông (AT06, CV11, CV02, AG01, AQ1)', '5 Autumn-Winter SKUs (led by AT06)')}
              stroke={KAMI_BRAND_PALETTE.tealInk}
              fill={KAMI_BRAND_PALETTE.cyan}
              fillOpacity={0.85}
              isAnimationActive={false}
            />
            <ReferenceLine
              x={ch3.crossoverDate}
              stroke={KAMI_BRAND_PALETTE.deepInk}
              strokeDasharray="4 3"
              label={{
                value: L(`Đảo chiều ${ch3.crossoverDate}`, `Crossover ${ch3.crossoverDate}`),
                position: 'insideTopLeft',
                fill: KAMI_BRAND_PALETTE.deepInk,
                fontSize: 11,
                fontWeight: 700,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3.4, 3.5, 3.6 [XEM THÊM] */}
      <ExpandableMoreSection
        title={L(
          '3.4 - 3.6. Đối soát đỉnh 16/06, mùa vụ thứ trong tuần, tương quan trễ và hồi quy kinh tế lượng bảng 10 SKU',
          '3.4 - 3.6. June 16 peak audit, day-of-week index, lag correlations, and 10-SKU panel fixed-effects regression'
        )}
        countLabel={L('3 phân tích mở rộng', '3 deep-dive analyses')}
      >
        <div className="space-y-3.5">
          {/* 3.4 Đỉnh 16-18/06 và Z-score */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              '3.4. Đỉnh 16/06 đạt z-score +6,81; phiên lớn nhất vượt doanh thu ngày Store',
              '3.4. Peak June 16 achieved z-score +6.81; top session exceeded Store daily GMV'
            )}
            footer={L(
              'Nguồn: Creator_Livestreams (+13h về UTC+7), Affiliate_Livestreams, Store_Daily_Overview · 15/06 - 18/06/2026. Z-score +6,81 tính theo 28 ngày lùi không gồm ngày đỉnh (+4,04 nếu gồm ngày đỉnh; +5,83 toàn kỳ 231 ngày). Vì GMV phiên cộng dồn vào ngày mở ca, tỷ lệ phiên trên ngày mang tính ước lượng.',
              'Source: Creator_Livestreams (+13h UTC+7), Affiliate_Livestreams, Store_Daily_Overview · Jun 15-18, 2026. Z-score +6.81 uses 28 trailing days excluding peak (+4.04 including peak; +5.83 full 231d).'
            )}
          >
            <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800">
              <table className="w-full text-left text-xs tabular-nums">
                <thead className="bg-[#C8EEF7]/45 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  <tr>
                    <th className="px-3 py-2 font-bold">{L('Ngày (UTC+7)', 'Date (UTC+7)')}</th>
                    <th className="px-3 py-2 font-bold text-right">{L('GMV Store ngày', 'Store daily GMV')}</th>
                    <th className="px-3 py-2 font-bold text-right">{L('Z-score trượt 28N', '28d trailing Z')}</th>
                    <th className="px-3 py-2 font-bold text-right">{L('Tổng Live gán theo ngày mở ca', 'Start-attributed Live sum')}</th>
                    <th className="px-3 py-2 font-bold">{L('Phiên lớn nhất bắt đầu trong ngày', 'Largest session started')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {ch3.junePeakReconciliation.map((r) => (
                    <tr key={r.date} className={r.ddmm === '16/06' || r.ddmm === '17/06' ? 'bg-[#FFE485]/25 dark:bg-[#FFD14C]/10' : ''}>
                      <td className="px-3 py-2 font-bold">{r.ddmm}/2026</td>
                      <td className="px-3 py-2 text-right font-semibold">{n(r.storeGmvM, 1)} Tr</td>
                      <td className="px-3 py-2 text-right font-bold text-[#074553] dark:text-[#9BE7FA]">
                        {r.z28 !== null && r.z28 > 0 ? `+${n(r.z28, 2)}` : n(r.z28 ?? 0, 2)}
                      </td>
                      <td className="px-3 py-2 text-right">{n(r.dedupLiveGmvM, 1)} Tr ({r.sessionCount} ca)</td>
                      <td className="px-3 py-2">
                        {n(r.topSessionGmvM, 1)} Tr ({L('mở lúc', 'start')} {r.topSessionStart}, {n(r.topSessionDurationH, 1)}h)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* 3.5 Thứ trong tuần và tương quan trễ 0-7 ngày */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              '3.5. Thứ Năm đạt doanh thu cao nhất tuần; tương quan cùng ngày r = 0,44',
              '3.5. Thursday leads intra-week revenue; same-day correlation r = 0.44'
            )}
            footer={L(
              `Nguồn: Store_Daily_Overview [Doanh Thu Trong Ngày, Livestream Mới Trong Ngày, KOC Mới Trong Ngày] · n = ${V2.meta.days} ngày. Chênh lệch giữa các ngày trong tuần nhỏ hơn nhiều so với biên độ mùa vụ giữa các tháng.`,
              `Source: Store_Daily_Overview [Daily GMV, New Livestreams, New KOCs] · n = ${V2.meta.days} days. Intra-week variation is minor compared to month-to-month seasonal swings.`
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ch3.dowIndex} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="labelVi" tick={axisTick} />
                    <YAxis domain={[0, 130]} width={46} tick={axisTick} tickFormatter={(v: number) => `${v}%`} />
                    <Tooltip
                      content={
                        <ChartTooltip
                          fmt={(v) => `${n(v, 1)}%`}
                          extraRow={(pl) => {
                            const r = pl?.[0]?.payload;
                            return r ? L(`TB: ${n(r.meanM, 1)} Tr | Trung vị: ${n(r.medianM, 1)} Tr`, `Mean: ${n(r.meanM, 1)}M`) : null;
                          }}
                        />
                      }
                    />
                    <ReferenceLine y={100} stroke={KAMI_BRAND_PALETTE.amberStroke} strokeDasharray="3 3" />
                    <Bar
                      dataKey="meanIndex"
                      name={L('Chỉ số GMV theo thứ (TB tuần = 100%)', 'DOW GMV index (Mean = 100%)')}
                      fill={KAMI_BRAND_PALETTE.cyan}
                      stroke={KAMI_BRAND_PALETTE.tealInk}
                      strokeWidth={1}
                      radius={[5, 5, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ch3.lagCorrelations} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="label" tick={axisTick} />
                    <YAxis domain={[0, 0.6]} width={46} tick={axisTick} />
                    <Tooltip content={<ChartTooltip fmt={(v) => n(v, 3)} />} />
                    <Legend formatter={legendFormatter} />
                    <Line
                      type="monotone"
                      dataKey="rLive"
                      name={L('r(Livestream mới, GMV)', 'r(New Lives, GMV)')}
                      stroke={KAMI_BRAND_PALETTE.tealInk}
                      strokeWidth={2.2}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="rKoc"
                      name={L('r(KOC mới, GMV)', 'r(New KOCs, GMV)')}
                      stroke={KAMI_BRAND_PALETTE.amberStroke}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>

          {/* 3.6 Hồi quy kinh tế lượng Panel FE */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              '3.6. Hồi quy bảng gợi ý liên hệ dương giữa Live và lượng bán',
              '3.6. Panel regression suggests positive correlation between Live and sales'
            )}
            footer={L(
              `Nguồn: 10_SKU_Daily_Timeseries · Biến phụ thuộc log(1 + Lượng bán), biến giải thích log(1 + Đầu vào marketing) với hiệu ứng cố định SKU và biến giả thứ trong tuần · n = ${n(ch3.panelRegression.nObs)} quan sát (${ch3.panelRegression.nSkus} cụm SKU, 176 ngày sau trễ). Khoảng tin cậy 95% bootstrap theo cụm SKU (${ch3.panelRegression.bootstrapReps} vòng). Kết quả mang tính gợi ý quan sát, không phải suy diễn nhân quả.`,
              `Source: 10_SKU_Daily_Timeseries · Dependent variable log(1 + units), regressors log(1 + inputs) with SKU fixed effects and DOW dummies · n = ${n(ch3.panelRegression.nObs)} obs (${ch3.panelRegression.nSkus} SKU clusters, 176 post-lag days). 95% CI from ${ch3.panelRegression.bootstrapReps} SKU-cluster bootstrap reps. Results are suggestive of correlation rather than causal proof.`
            )}
          >
            <div className="space-y-3 pt-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span>{L('Biến giải thích', 'Explanatory variable')}</span>
                <span className="hidden sm:inline">{L('Phân phối hệ số hồi quy β [-0.5 → +1.1]', 'Regression coefficient β distribution [-0.5 → +1.1]')}</span>
                <span>{L('Hệ số β [KTC 95%]', 'β [95% CI]')}</span>
              </div>
              {ch3.panelRegression.coefficients.map((c) => {
                const toPct = (v: number) => Math.max(0, Math.min(100, ((v + 0.5) / 1.6) * 100));
                const zeroPct = toPct(0);
                const lowPct = toPct(c.ciLow);
                const highPct = toPct(c.ciHigh);
                const ptPct = toPct(c.beta);
                const sig = c.ciLow > 0;
                return (
                  <div key={c.key} className="grid grid-cols-12 items-center gap-2 text-xs tabular-nums">
                    <div className="col-span-5 sm:col-span-4 font-semibold text-slate-800 dark:text-slate-200">
                      {L(c.labelVi, c.labelEn)}
                    </div>
                    <div className="col-span-4 sm:col-span-5 relative h-6 rounded bg-slate-100 dark:bg-slate-800">
                      <div
                        className="absolute top-0 bottom-0 w-px bg-slate-400 dark:bg-slate-500"
                        style={{ left: `${zeroPct}%` }}
                        title="Điểm 0"
                      />
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full ${
                          sig ? 'bg-[#0D7287] dark:bg-[#9BE7FA]' : 'bg-slate-400 dark:bg-slate-500'
                        }`}
                        style={{ left: `${lowPct}%`, width: `${Math.max(1.5, highPct - lowPct)}%` }}
                      />
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                          sig ? 'bg-[#074553] dark:bg-[#9BE7FA]' : 'bg-[#FFD14C]'
                        }`}
                        style={{ left: `${ptPct}%` }}
                      />
                    </div>
                    <div className="col-span-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {c.beta > 0 ? `+${n(c.beta, 2)}` : n(c.beta, 2)}{' '}
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        [{n(c.ciLow, 2)}, {n(c.ciHigh, 2)}]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}
