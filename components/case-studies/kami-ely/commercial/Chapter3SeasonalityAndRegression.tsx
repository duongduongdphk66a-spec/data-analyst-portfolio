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
  axisTick,
  legendFormatter,
  GRID_STROKE,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Chapter3SeasonalityAndRegression() {
  const { L, n } = usePlaybookLang();
  const daily = V2.ch0.dailySeries;
  const k = V2.ch0.kpis;
  const ch3 = V2.ch3;
  const s10 = ch3.sku10Summary;
  const pz = ch3.peakZScores;
  const thu = ch3.dowIndex[3];
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
        `Biên độ doanh thu trải qua 4 pha rõ rệt: Tăng tốc từ tháng 3 lên đỉnh tháng 6, suy giảm ${Math.abs(k.junToAugDropPct)}% về đáy tháng 8 qua hai pha phân rã khác nhau, trước khi đảo chiều danh mục sang hàng Thu Đông và hồi phục vào tháng 10.`,
        `Revenue traversed 4 distinct phases: Accelerating from March to the June peak, falling ${Math.abs(k.junToAugDropPct)}% to the August trough via two distinct contraction phases, before rotating into Autumn-Winter SKUs to recover in October.`
      )}
      soWhat={L(
        'Biên độ doanh thu phụ thuộc lớn vào lịch live của chính shop và chu kỳ mùa vụ sản phẩm; kế hoạch nhập hàng và lịch live cần chuẩn bị trước mốc chuyển mùa từ một đến hai tháng.',
        'Revenue swings depend heavily on official Live scheduling and seasonal product cycles; inventory procurement and Live calendars should be staged one to two months ahead of seasonal transitions.'
      )}
    >
      {/* Ba lát cắt phân tích Chương 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs tabular-nums">
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Bức tranh tháng & cụm đỉnh 16/06', 'Monthly arc & June 16 peak cluster')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Tháng 6 thiết lập đỉnh năm với phiên kỷ lục 16/06 đạt ${n(k.peakDayGmvM, 1)} Tr đ (z = +${n(pz.trailing28Excl, 2)} so với 28 ngày trước; chỉ ${pz.daysOver3Full231} ngày cả kỳ vượt z = 3). Cụm 7 ngày 13-19/06 gom ${n(k.peak7dGmvB, 2)} tỷ đ (${n(k.peak7dSharePct, 1)}% toàn kỳ), sau đó biến động ngày duy trì ở mức cao.`,
              `June established the annual peak with a record June 16 session of ${n(k.peakDayGmvM, 1)}M VND (z = +${n(pz.trailing28Excl, 2)} vs prior 28d; only ${pz.daysOver3Full231} days > 3σ). The 7-day window of June 13-19 concentrated ${n(k.peak7dGmvB, 2)}B VND (${n(k.peak7dSharePct, 1)}% of total GMV).`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Hai pha sụt giảm & đà hồi phục T10', 'Two-phase drop & October recovery')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Pha 1 (tháng 7) sụt giảm theo quy mô phát sóng khi số ca live giảm mạnh từ ${n(ch3.monthly[3].storeLives)} xuống ${n(ch3.monthly[4].storeLives)} ca. Pha 2 (tháng 8) sụt giảm theo năng suất khi GMV mỗi ca giảm sâu từ ${n(ch3.monthly[4].storeGmvPerLiveM, 2)} Tr xuống ${n(ch3.monthly[5].storeGmvPerLiveM, 2)} Tr đ trước khi hồi phục lên ${n(ch3.monthly[7].storeGmvPerLiveM, 2)} Tr đ vào tháng 10.`,
              `Phase 1 (July) contracted in broadcast volume as Live count dropped from ${n(ch3.monthly[3].storeLives)} to ${n(ch3.monthly[4].storeLives)}. Phase 2 (August) contracted in productivity as GMV/session fell from ${n(ch3.monthly[4].storeGmvPerLiveM, 2)}M to ${n(ch3.monthly[5].storeGmvPerLiveM, 2)}M VND before recovering to ${n(ch3.monthly[7].storeGmvPerLiveM, 2)}M VND in October.`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Tương quan quan sát & đổi ngôi 10 SKU', 'Observational correlation & 10-SKU rotation')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Đồ bơi chiếm ${n(s10.junSummerSharePct, 1)}% doanh số 10 SKU vào tháng 6 trước khi đảo chiều sang danh mục Thu Đông tại ${ch3.crossoverWeek} (${ch3.crossoverDate}). Đến tháng 10, nhóm Thu Đông chiếm ${n(s10.octWinterSharePct, 1)}% doanh số dẫn dắt bởi AT06 (${n(s10.octAt06GmvB, 2)} tỷ đ); tương quan cùng ngày r(Live, GMV) đạt ${n(ch3.lagCorrelations[0].rLive, 2)}.`,
              `Swimwear held ${n(s10.junSummerSharePct, 1)}% of 10-SKU sales in June before rotating to Autumn-Winter at ${ch3.crossoverWeek} (${ch3.crossoverDate}). In October, Autumn-Winter drove ${n(s10.octWinterSharePct, 1)}% of sales led by AT06 (${n(s10.octAt06GmvB, 2)}B VND); same-day r(Live, GMV) stood at ${n(ch3.lagCorrelations[0].rLive, 2)}.`
            )}
          </p>
        </div>
      </div>
      {/* 3.1 [CHÍNH] GMV ngày + MA7 + MA28 với 4 pha mùa vụ và 4 mốc MA7 < MA28 */}
      <ChartCard
        height="h-64 sm:h-72"
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '3.1. Chuỗi 231 ngày qua bốn pha mùa vụ và bốn lần đường MA7 cắt xuống MA28 (29/04, 04/06, 26/06, 22/10)',
          '3.1. 231-day trajectory across four seasonal phases and four MA7 < MA28 crossovers (29/04, 04/06, 26/06, 22/10)'
        )}
        footer={L(
          `Nguồn: Store_Daily_Overview [Ngày Ghi Nhận, Doanh Thu Trong Ngày (VNĐ)] · 09/03 - 25/10/2026 · n = ${V2.meta.days} ngày. Dải màu đánh dấu 4 pha: Tăng tốc (T3-T5), Đỉnh Hè (T6), Suy giảm (T7-T8), Phục hồi Thu Đông (T9-T10).`,
          `Source: Store_Daily_Overview [Date, Daily GMV] · 09/03 - 25/10/2026 · n = ${V2.meta.days} days. Shaded bands denote Ramp (Mar-May), Summer Peak (Jun), Contraction (Jul-Aug), and Autumn Recovery (Sep-Oct).`
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={daily} margin={{ top: 18, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <ReferenceArea x1="09/03" x2="31/05" fill={KAMI_BRAND_PALETTE.ice} fillOpacity={0.22} />
            <ReferenceArea x1="01/06" x2="30/06" fill={KAMI_BRAND_PALETTE.cyan} fillOpacity={0.25} />
            <ReferenceArea x1="01/07" x2="31/08" fill={KAMI_BRAND_PALETTE.butter} fillOpacity={0.28} />
            <ReferenceArea x1="01/09" x2="25/10" fill={KAMI_BRAND_PALETTE.ice} fillOpacity={0.18} />
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
            {ch3.maCrossovers.map((c, idx) => (
              <ReferenceLine
                key={c.date}
                x={c.ddmm}
                stroke={idx === 2 ? KAMI_BRAND_PALETTE.negative : KAMI_BRAND_PALETTE.amberStroke}
                strokeDasharray="3 3"
                label={{
                  value: c.ddmm,
                  position: idx % 2 === 0 ? 'insideTopRight' : 'insideTopLeft',
                  fill: idx === 2 ? KAMI_BRAND_PALETTE.negative : KAMI_BRAND_PALETTE.amberStroke,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3.2 [CHÍNH] Số ca Live và GMV mỗi ca theo tháng (2 panel xếp dọc, KHÔNG trục kép) + Waterfall */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '3.2. Số ca Live lập đỉnh tháng 4 (1.957 ca) rồi giảm còn 640 ca ở tháng 8; GMV/ca rơi từ 2,54 Tr (T7) xuống 0,99 Tr (T8)',
          '3.2. Monthly Live volume peaked in April (1,957) before dropping to 640 in August; Store GMV/Live fell from 2.54M (Jul) to 0.99M (Aug)'
        )}
        footer={L(
          'Nguồn: Store_Daily_Overview [Livestream Mới Trong Ngày, Doanh Thu Trong Ngày] và Affiliate_Livestreams · T3 (23 ngày) và T10 (25 ngày) là tháng thiếu. Lưu ý: GMV shop/ca trên bảng Store giữ mức 2,54 Tr ở T7 nhờ phần doanh thu Video & kệ hàng (30,2%) đệm vào tử số, trong khi GMV Live thực mỗi phiên trên AffLive giảm 65,1% ngay từ T7 (từ 3,15 xuống 1,10 Tr đ/phiên).',
          'Source: Store_Daily_Overview [New Lives, Daily GMV] and Affiliate_Livestreams · Mar (23d) and Oct (25d) are partial months. Store GMV/Live held at 2.54M in Jul due to non-Live Video/Card sales buffering the numerator, whereas pure AffLive session yield fell 65.1% immediately in Jul (3.15M to 1.10M).'
        )}
      >
        <div className="space-y-3.5 pt-1">
          {/* Panel trên: Số ca Live theo tháng */}
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              {L('Panel trên: Số ca Livestream mới theo tháng (bắt đầu từ 0)', 'Top panel: Monthly Live session count (zero baseline)')}
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ch3.monthly} margin={{ top: 10, right: 16, left: 4, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="shortLabel" tick={axisTick} />
                  <YAxis domain={[0, 2200]} width={50} tick={axisTick} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl, pl) => {
                          const r = pl?.[0]?.payload;
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
                    name={L('Số ca Live (Store)', 'Monthly Live count')}
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

          {/* Panel dưới: GMV mỗi ca (Store GMV/ca đối chiếu GMV Live thực/phiên) */}
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              {L('Panel dưới: Hiệu suất doanh thu bình quân mỗi ca (Triệu đ/ca, bắt đầu từ 0)', 'Bottom panel: Average revenue yield per session (Million VND, zero baseline)')}
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ch3.monthly} margin={{ top: 10, right: 16, left: 4, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="shortLabel" tick={axisTick} />
                  <YAxis domain={[0, 3.5]} width={50} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl) => L(`Tháng ${lbl}/2026`, `Month ${lbl}/2026`)}
                        fmt={(v) => `${n(v, 2)} Tr đ`}
                      />
                    }
                  />
                  <Legend formatter={legendFormatter} />
                  <Bar
                    dataKey="storeGmvPerLiveM"
                    name={L('GMV toàn shop / số ca Live (Store)', 'Store GMV / Store Live count')}
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

          {/* Bảng phân rã Waterfall T6 -> T7, T7 -> T8, T6 -> T8 */}
          <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1.5">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white">
              {L('Phân rã đại số mức sụt giảm GMV (Hiệu ứng số lượng ΔN·Y₀ + Hiệu suất N₀·ΔY + Tương tác ΔN·ΔY)', 'Algebraic decomposition of GMV contraction (Volume + Yield + Cross-interaction)')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs tabular-nums">
              {[wf1, wf2, wfAll].map((w) => (
                <div key={`${w.from}-${w.to}`} className="rounded-lg bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 p-2.5 space-y-1">
                  <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex justify-between">
                    <span>{w.from} {'->'} {w.to}</span>
                    <span className="text-rose-600 dark:text-rose-400">{n(w.deltaM, 1)} Tr ({n(w.deltaPct, 1)}%)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{L('Do số lượng ca:', 'Volume effect:')}</span>
                    <span className="font-semibold">{n(w.volEffectM, 1)} Tr</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{L('Do GMV/ca:', 'Yield effect:')}</span>
                    <span className="font-semibold">{n(w.yieldEffectM, 1)} Tr</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>{L('Tương tác chéo:', 'Interaction:')}</span>
                    <span>{w.interEffectM > 0 ? `+${n(w.interEffectM, 1)}` : n(w.interEffectM, 1)} Tr</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {L(
                `Giải thích kỹ thuật: Khi cả số lượng ca (ΔN < 0) và hiệu suất mỗi ca (ΔY < 0) cùng giảm ở giai đoạn T6 -> T8, tích số tương tác ΔN × ΔY mang dấu dương (+${n(wfAll.interEffectM, 1)} Tr đ), giúp tránh trừ trùng phần doanh thu đã mất nên tổng hai hiệu ứng riêng lẻ lớn hơn 100% mức giảm ròng.`,
                `Technical note: When both session count (ΔN < 0) and yield (ΔY < 0) decline simultaneously across Jun -> Aug, the cross-term ΔN × ΔY is positive (+${n(wfAll.interEffectM, 1)}M VND) to prevent double-counting lost volume, explaining why pure volume and yield shares exceed 100% of the net drop.`
              )}
            </p>
          </div>
        </div>
      </ChartCard>

      {/* 3.3 [CHÍNH] Mùa vụ 10 SKU chủ lực (Stacked Area 100% theo tuần) */}
      <ChartCard
        height="h-64"
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `3.3. Đảo chiều danh mục ở tuần ${ch3.crossoverWeek} (${ch3.crossoverDate}): Hàng Thu Đông thay thế nhóm Bikini Hè, đạt ${n(s10.octWinterSharePct, 1)}% vào tháng 10`,
          `3.3. Seasonal rotation at ${ch3.crossoverWeek} (${ch3.crossoverDate}): Autumn-Winter SKUs overtake Summer Swimwear, reaching ${n(s10.octWinterSharePct, 1)}% in October`
        )}
        footer={L(
          `Nguồn: 10_SKU_Daily_Timeseries [Đặc Tính Mùa, Doanh Thu Trong Ngày (VNĐ)] · 30/04 - 25/10/2026 · n = 1.790 dòng (${n(s10.totalGmvB, 2)} tỷ đ, ${n(s10.totalUnits)} sp; riêng AT06 đạt ${n(s10.octAt06GmvB, 2)} tỷ đ = ${n(s10.octAt06SharePct, 1)}% doanh thu 10 mã trong tháng 10).`,
          `Source: 10_SKU_Daily_Timeseries [Seasonality, Daily GMV] · 30/04 - 25/10/2026 · n = 1,790 rows (${n(s10.totalGmvB, 2)}B VND, ${n(s10.totalUnits)} units; AT06 alone drove ${n(s10.octAt06GmvB, 2)}B = ${n(s10.octAt06SharePct, 1)}% of 10-SKU GMV in October).`
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

      {/* 3.4, 3.5, 3.6 [XEM THÊM] tải chậm */}
      <ExpandableMoreSection
        title={L(
          '3.4 - 3.6. Đối soát đỉnh 16/06, mùa vụ thứ trong tuần, tương quan trễ và hồi quy kinh tế lượng bảng 10 SKU',
          '3.4 - 3.6. June 16 peak audit, day-of-week index, lag correlations, and 10-SKU panel fixed-effects regression'
        )}
        countLabel={L('3 phân tích mở rộng', '3 deep-dive analyses')}
      >
        <div className="space-y-3.5">
          {/* 3.4 Đỉnh 16-18/06 và Z-score trượt 28 ngày */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              `3.4. Đỉnh 16/06 đạt Z-score +${n(pz.trailing28Excl, 2)} so với 28 ngày liền trước (+${n(pz.trailing28Incl, 2)} gồm ngày đỉnh, +${n(pz.full231, 2)} toàn kỳ); phiên 272,1 Tr sáng 17/06 vượt GMV ngày Store (96,0 Tr) do gán theo giờ mở ca`,
              `3.4. June 16 hit Z-score +${n(pz.trailing28Excl, 2)} vs prior 28d (+${n(pz.trailing28Incl, 2)} incl. peak, +${n(pz.full231, 2)} full 231d); a 272.1M session on 17/06 09:08 exceeded 96.0M Store daily GMV due to start-time attribution`
            )}
            footer={L(
              'Nguồn: Creator_Livestreams (+13h về UTC+7), Affiliate_Livestreams, Store_Daily_Overview · 15/06 - 18/06/2026. Cột Z-score trượt 28N trong bảng dưới tính theo cửa sổ lùi t-28..t-1 không nhìn trước; vì GMV phiên được cộng dồn vào ngày bắt đầu ca phát sóng, mọi tỷ lệ "1 ca chiếm bao nhiêu % GMV ngày" chỉ mang tính ước lượng.',
              'Source: Creator_Livestreams (+13h UTC+7), Affiliate_Livestreams, Store_Daily_Overview · Jun 15-18, 2026. Table Z-scores use strictly causal prior 28d windows (t-28..t-1); because multi-hour session GMV is booked to its start timestamp, single-day session share percentages remain approximate.'
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
              `3.5. Thứ Năm dẫn đầu tuần ở mức ${n(thu.meanIndex, 1)}% trung bình (${n(thu.meanM, 1)} Tr đ, trung vị ${n(thu.medianIndex, 1)}%); tương quan cùng ngày r(Live, GMV) = ${n(ch3.lagCorrelations[0].rLive, 2)} và r(KOC, GMV) = ${n(ch3.lagCorrelations[0].rKoc, 2)}`,
              `3.5. Thursday leads the week at ${n(thu.meanIndex, 1)}% of mean (${n(thu.meanM, 1)}M, median ${n(thu.medianIndex, 1)}%); same-day correlation r(Live, GMV) = ${n(ch3.lagCorrelations[0].rLive, 2)} and r(KOC, GMV) = ${n(ch3.lagCorrelations[0].rKoc, 2)}`
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

          {/* 3.6 Hồi quy kinh tế lượng Panel FE (10 SKU × 176 ngày sau trễ, Bootstrap theo SKU) */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              `3.6. Hồi quy bảng hiệu ứng cố định (Panel FE): Bằng chứng quan sát gợi ý liên hệ dương giữa Livestream và lượng bán (cùng ngày β = +${n(ch3.panelRegression.coefficients[0].beta, 2)}, trễ 1-3 ngày β = +${n(ch3.panelRegression.coefficients[1].beta, 2)}), không khẳng định quan hệ nhân quả`,
              `3.6. Panel fixed-effects regression: Suggestive observational evidence of positive link between Live and unit sales (same-day β = +${n(ch3.panelRegression.coefficients[0].beta, 2)}, 1-3d lag β = +${n(ch3.panelRegression.coefficients[1].beta, 2)}), not causal proof`
            )}
            footer={L(
              `Nguồn: 10_SKU_Daily_Timeseries · Biến phụ thuộc log(1 + Lượng bán), biến giải thích log(1 + Đầu vào marketing) với hiệu ứng cố định SKU và biến giả thứ trong tuần · n = ${n(ch3.panelRegression.nObs)} quan sát (${ch3.panelRegression.nSkus} cụm SKU, 176 ngày sau trễ). Khoảng tin cậy 95% bootstrap theo cụm SKU (${ch3.panelRegression.bootstrapReps} vòng). Lưu ý: Cận dưới khoảng tin cậy cùng ngày nhạy cảm với số cụm nhỏ (10 SKU) và mô hình chưa kiểm soát cú sốc vĩ mô theo tuần (như phiên 16/06); kết quả thể hiện bằng chứng quan sát gợi ý, không phải suy diễn nhân quả.`,
              `Source: 10_SKU_Daily_Timeseries · Dependent variable log(1 + units), regressors log(1 + inputs) with SKU fixed effects and DOW dummies · n = ${n(ch3.panelRegression.nObs)} obs (${ch3.panelRegression.nSkus} SKU clusters, 176 post-lag days). 95% CI from ${ch3.panelRegression.bootstrapReps} SKU-cluster bootstrap reps. Note: Lower CI bound is sensitive with only 10 clusters and lacks weekly shock controls; results represent suggestive observational evidence rather than causal proof.`
            )}
          >
            <div className="space-y-2 pt-1">
              {ch3.panelRegression.coefficients.map((c) => {
                // Scale range [-0.5, 1.1] -> [0%, 100%]
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
