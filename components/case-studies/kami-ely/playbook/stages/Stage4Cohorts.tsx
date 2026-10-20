'use client';

import React, { useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, ComposedChart, Label, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, affiliateTop10, affiliateTopExGirlStyle, creatorFacts, creatorTiers, sqlSnippets, topCreatorMonthly,
} from '../playbookData';
import { ChartCard, ChartTooltip, Chip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

export default function Stage4Cohorts() {
  const { L, n } = usePlaybookLang();
  const [affiliateScope, setAffiliateScope] = useState<'all' | 'exGirlStyle'>('all');
  const first = creatorTiers[0];
  const last = creatorTiers[creatorTiers.length - 1];

  return (
    <StageSection
      stage={4}
      takeaway={L(
        `Follower càng nhiều, tỷ lệ kích hoạt càng cao: ${n(first.activationPct, 1)}% ở nhóm nhỏ nhất, ${n(last.activationPct, 1)}% ở nhóm lớn nhất.`,
        `More followers, higher activation: ${n(first.activationPct, 1)}% in the smallest tier, ${n(last.activationPct, 1)}% in the largest.`,
      )}
      kpis={[
        { value: n(creatorFacts.registered), label: L('creator trong cohort', 'creators in the cohort') },
        { value: `${n(creatorFacts.sellers)} (${n(creatorFacts.activationPct, 2)}%)`, label: L('creator có đơn', 'creators with orders'), tone: 'amber' },
        { value: `${n(creatorFacts.top1Pct, 1)}%`, label: L("GMV affiliate LIVE thuộc 'girl style' (kênh đồng vận hành)", "affiliate LIVE GMV from 'girl style' (co-operated channel)") },
      ]}
      sql={sqlSnippets.s4}
    >
      <ChartCard title={L('Tỷ lệ kích hoạt theo nhóm follower (%)', 'Activation rate by follower tier (%)')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={creatorTiers} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={34}>
              <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} head={(l) => `${l} follower`} />}
            />
            <Bar dataKey="activationPct" name={L('Kích hoạt', 'Activation')} fill={COLORS.cyan} radius={[6, 6, 0, 0]}>
              <LabelList dataKey="activationPct" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 1)}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L("Cơ cấu phân bổ có và không có 'girl style' (%)", "GMV distribution with and without 'girl style' (%)")} height="">
        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart data={creatorTiers} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={34}>
                <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} head={(l) => `${l} follower`} />}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar dataKey="gmvPct" name={L("Có 'girl style'", "With 'girl style'")} fill={COLORS.amber} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gmvPctExTop1" name={L("Không có 'girl style'", "Without 'girl style'")} fill={COLORS.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
            {L('Chú thích phân tích độ nhạy (Sensitivity Note):', 'Sensitivity Analysis Note:')}
          </div>
          <p>
            {L(
              "• 'girl style' (@girlstyle.vn) thuộc nhóm 1k–5k follower nhưng là kênh vệ tinh in-house do chính chủ shop vận hành, tạo ra 56% GMV LIVE.",
              "• 'girl style' (@girlstyle.vn) belongs to the 1k–5k follower tier but is an in-house satellite channel driving 56% of LIVE GMV.",
            )}
          </p>
          <p>
            {L(
              "• Khi loại trừ 'girl style', tổng mẫu số giảm hơn một nửa khiến tỷ trọng tương đối của nhóm 10k–100k follower tăng từ 11% lên 19%, phản ánh thực chất mạng lưới KOC bên ngoài.",
              "• Excluding 'girl style' halves the total denominator, lifting the 10k–100k follower tier's relative share from 11% to 19% to reveal true external KOC traction.",
            )}
          </p>
        </div>
      </ChartCard>

      <ChartCard
        title={
          affiliateScope === 'all'
            ? L('Top 10 affiliate LIVE: tỷ trọng và tích lũy (%)', 'Top 10 affiliate LIVE: share and cumulative (%)')
            : L("Top affiliate LIVE (Bỏ 'girl style'): tỷ trọng & tích lũy (%)", "Top affiliate LIVE (Excl. 'girl style'): share & cumulative (%)")
        }
        badge={
          <div className="flex items-center gap-1.5">
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-0.5 dark:bg-slate-800" role="group" aria-label={L("Bộ lọc 'girl style'", "'girl style' filter")}>
              <button
                type="button"
                onClick={() => setAffiliateScope('all')}
                className={`min-h-7 cursor-pointer rounded-lg px-2 text-[11px] font-bold transition-colors ${
                  affiliateScope === 'all'
                    ? 'bg-[#9BE7FA] text-slate-950'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {L("Có 'girl style'", "With 'girl style'")}
              </button>
              <button
                type="button"
                onClick={() => setAffiliateScope('exGirlStyle')}
                className={`min-h-7 cursor-pointer rounded-lg px-2 text-[11px] font-bold transition-colors ${
                  affiliateScope === 'exGirlStyle'
                    ? 'bg-[#9BE7FA] text-slate-950'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {L("Bỏ 'girl style'", "Exclude 'girl style'")}
              </button>
            </div>

            <Chip tone={affiliateScope === 'all' ? 'cyan' : 'amber'}>
              {affiliateScope === 'all' ? 'Top 10 = 82,2%' : 'Top 9 = 57,9%'}
            </Chip>
          </div>
        }
      >
        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <ComposedChart
              data={affiliateScope === 'all' ? affiliateTop10 : affiliateTopExGirlStyle}
              margin={{ top: 22, right: 14, left: 6, bottom: 0 }}
            >
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="rank" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="share"
                domain={affiliateScope === 'all' ? [0, 60] : [0, 20]}
                ticks={affiliateScope === 'all' ? [0, 15, 30, 45, 60] : [0, 5, 10, 15, 20]}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                width={38}
              >
                <Label
                  value={L('Tỷ trọng (%)', 'Share (%)')}
                  position="top"
                  offset={10}
                  className={TEXT_FILL_CLASS}
                  fontSize={11}
                />
              </YAxis>
              <YAxis
                yAxisId="cum"
                orientation="right"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                width={38}
              >
                <Label
                  value={L('Tích lũy (%)', 'Cum (%)')}
                  position="top"
                  offset={10}
                  className={TEXT_FILL_CLASS}
                  fontSize={11}
                />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                content={
                  <ChartTooltip
                    fmt={(v, name) =>
                      name.includes('Tích lũy') || name.includes('Cumulative')
                        ? `${n(v, 1)}% ${L('tích lũy', 'cum.')}`
                        : `${n(v, 2)}% ${L('tỷ trọng', 'share')}`
                    }
                    head={(_l, p) => {
                      const item = (p as any)?.[0]?.payload;
                      return item?.name ? `${item.rank} · ${item.name}` : String(_l);
                    }}
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar
                yAxisId="share"
                dataKey="sharePct"
                name={affiliateScope === 'all' ? L('Tỷ trọng toàn kênh', 'Total share') : L('Tỷ trọng ngoài GS', 'Share ex-GS')}
                fill={affiliateScope === 'all' ? COLORS.cyan : COLORS.teal}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="sharePct"
                  position="top"
                  fontSize={10}
                  className={TEXT_FILL_CLASS}
                  formatter={(v: unknown) => `${n(Number(v), 1)}%`}
                />
              </Bar>
              <Line
                yAxisId="cum"
                dataKey="cumulativePct"
                name={L('Tích lũy', 'Cumulative')}
                stroke={COLORS.deep}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: COLORS.deep }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title={L("Vận hành 'girl style': Số phiên & Số giờ LIVE", "'girl style' operations: Sessions & Stream hours")}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={topCreatorMonthly} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis yAxisId="ses" tick={axisTick} tickLine={false} axisLine={false} width={34}>
              <Label value={L('(ca)', '(ses)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <YAxis yAxisId="hrs" orientation="right" tick={axisTick} tickLine={false} axisLine={false} width={36}>
              <Label value={L('(giờ)', '(h)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={
                <ChartTooltip
                  fmt={(v, name) =>
                    name.includes('giờ') || name.includes('hour') ? `${n(v, 1)} giờ` : `${n(v)} ca`
                  }
                />
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar yAxisId="ses" dataKey="sessions" name={L('Phiên LIVE', 'LIVE sessions')} fill={COLORS.cyan} radius={[6, 6, 0, 0]} />
            <Line yAxisId="hrs" dataKey="liveHours" name={L('Giờ LIVE (h)', 'Stream hours (h)')} stroke={COLORS.deep} strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </StageSection>
  );
}
