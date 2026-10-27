'use client';

import React from 'react';
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import skuSeasonalityJson from '@/app/data/kami-ely/generated/sku_seasonality.json';
import {
  ChapterShell,
  ChartCard,
  ChartTooltip,
  GranularityToggle,
  TermTooltip,
  useChartGranularity,
  usePlaybookLang,
  axisTick,
  legendFormatter,
  GRID_STROKE,
} from '../playbook/PlaybookUi';
import {
  DAILY_SERIES_231D,
  WEEKLY_CHARTS_33W,
  MONTHLY_CHARTS_8M,
  WATERFALL_T6_T8,
  SKU_DAILY_179D,
} from './kamiElyVerified231d';

type Ch3TrendGrain = 'day' | 'week' | 'month';
type Ch3DecompView = 'waterfall' | 'day' | 'week';

const SKU_WEEKLY = (skuSeasonalityJson.weeklySeries || []).map((w: any) => ({
  x: String(w.week).replace(/^W\d+\s*\((.+)\)$/, '$1'),
  summerM: Number(w.swimwearGmvM || 0),
  autumnM: Number(w.winterGmvM || 0),
}));

export default function Chapter4SeasonalityAndRegression() {
  const { L, isEn } = usePlaybookLang();
  const [trendGrain, setTrendGrain] = useChartGranularity<Ch3TrendGrain>('day', ['day', 'week', 'month']);
  const [decompView, setDecompView] = useChartGranularity<Ch3DecompView>('waterfall', ['waterfall', 'day', 'week']);

  const wfData = WATERFALL_T6_T8.map((r) => ({
    ...r,
    step: isEn ? r.stepEn : r.stepVi,
    sub: isEn ? r.subEn : r.subVi,
    label: isEn ? r.displayEn : r.displayVi,
  }));

  const aggTrendData =
    trendGrain === 'week'
      ? WEEKLY_CHARTS_33W.map((r) => ({ x: r.label, gmv: r.storeTotal, lives: r.lives }))
      : MONTHLY_CHARTS_8M.map((r) => ({ x: r.month, gmv: r.storeTotal, lives: r.lives }));

  const skuSeries =
    decompView === 'day'
      ? SKU_DAILY_179D.map((r) => ({ x: r.d, summerM: r.summerM, autumnM: r.autumnM }))
      : SKU_WEEKLY;

  return (
    <ChapterShell
      id="sec-ch3-season"
      chapterNum={L('Chương 3', 'Chapter 3')}
      title={L(
        'Đỉnh tháng 6, đáy tháng 8: sụt từ đâu, báo trước được không?',
        'June peak, August trough: where did revenue drop, and was there a leading signal?'
      )}
      question={L(
        'Vì sao GMV sụt giảm từ tháng 6 sang tháng 8, và có tín hiệu nào báo trước không?',
        'Why did GMV contract from June to August, and was there an advance monitoring signal?'
      )}
      scopeLabel={L('Chuỗi 231 ngày + Phân rã T6 -> T8 + Panel 10 SKU', '231d series + Jun-Aug waterfall + 10-SKU panel')}
      soWhat={L(
        'Mức sụt -83,1% (-3.135,7 Tr đ) gắn với cả việc ít ca Live hơn (1.560 xuống 640 ca) lẫn mỗi ca bán kém hơn (2,42 xuống 0,99 Tr), và tháng 10 hồi phục (1,62 tỷ/25 ngày) gắn với xoay sang hàng Thu Đông. Giao cắt MA7 < MA28 (26/06) đến sau ngày đỉnh 16/06 nên mới là tín hiệu giám sát trên 1 mùa.',
        'The -83.1% drop (-3,135.7M VND) is associated with both fewer Live sessions (1,560 to 640) and lower yield per session (2.42M to 0.99M), while October rebounded alongside the autumn SKU shift. Because MA7 < MA28 followed the 16/06 outlier, it remains a descriptive single-season signal.'
      )}
      recommendation={L(
        'Theo dõi MA7/MA28 như tín hiệu giám sát vận hành; chỉ gọi là "cảnh báo sớm" sau khi kiểm chứng thêm chu kỳ mùa sau trên chuỗi đã Winsorize ngày 16/06. Chuẩn bị tồn kho và lịch Live hàng Thu Đông sớm hơn từ giữa tháng 8.',
        'Track MA7/MA28 strictly as an operational monitor until backtested across a second seasonal cycle on Winsorized series, and stage autumn inventory and Live schedules earlier in mid-August.'
      )}
      confidenceLabel={L('Tin cậy: Thấp - trung bình (1 mùa, 1 sự kiện)', 'Confidence: Low - medium (1 season, 1 event)')}
      confidenceTone="amber"
      appendixLabel={L('Xem công thức Waterfall & kiểm định Winsorize tại Phụ lục B · C', 'View Waterfall SQL & Winsorize checks in Appendix B · C')}
    >
      <div className="space-y-3.5">
        <ChartCard
          title={L(
            '3.1. GMV ngày + MA7 + MA28 với 4 mốc chuyển pha (09/03 - 25/10/2026)',
            '3.1. Daily GMV + MA7 + MA28 with 4 structural milestones (Mar 09 - Oct 25, 2026)'
          )}
          subtitle={
            <>
              {L(
                'Trần hiển thị miền ngày đặt ở 185 Tr đ để phiên ngoại lai 16/06 (315,0 Tr đ, 61,9% từ một ca Live chính chủ) không nén dẹt 230 ngày còn lại. ',
                'Caps daily area display at 185M VND so the 16/06 spike (315.0M, 61.9% from one official Live) does not flatten the series. '
              )}
              <TermTooltip
                label={L('Kiểm chứng Winsorize', 'Winsorize check')}
                explain="Khi cắt ngọn ngày 16/06 ở phân vị P99 (176,6 Tr) hoặc P95 (136,8 Tr), ngày MA7 cắt xuống MA28 vẫn giữ nguyên tại 26/06/2026 (sớm 18 ngày trước khi thủng nền tháng 4). Thay bằng trung vị tháng 6 chỉ dịch 1 ngày sang 27/06."
              />
            </>
          }
          badge={
            <GranularityToggle
              value={trendGrain}
              onChange={setTrendGrain}
              options={[
                { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
                { id: 'month', label: L('Theo tháng (8T)', 'Monthly (8m)') },
              ]}
            />
          }
          height="h-56 sm:h-60"
          footer={L(
            'Hồi quy OLS đa biến (n = 231 ngày, R² = 0,446): khi giữ cố định số giờ Live chính chủ và số ca KOC, riêng chu kỳ cao điểm Hè (T5 - T6) gắn với mức chênh +43,5 Tr đ/ngày (p < 0,0001).',
            'Multiple OLS (n = 231d, R² = 0.446): holding broadcast volume constant, the May-June summer regime is associated with +43.5M VND/day (p < 0.0001).'
          )}
        >
          {trendGrain === 'day' ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DAILY_SERIES_231D} margin={{ top: 8, right: 14, left: 2, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="d" tick={axisTick} interval={25} />
                <YAxis
                  domain={[0, 195]}
                  width={50}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v}Tr`}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl, pl) => {
                        const raw = pl?.[0]?.payload?.gmv ?? 0;
                        return raw > 185
                          ? L(`Ngày ${lbl}/2026 (Thực tế: ${raw} Tr đ · trần cột 185 Tr)`, `Date ${lbl}/2026 (True: ${raw}M · capped at 185M)`)
                          : L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`);
                      }}
                      fmt={(v, nm) => `${v.toFixed(1)} Tr đ (${nm})`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Area
                  type="monotone"
                  dataKey="cap"
                  name={L('GMV ngày (trần 185Tr)', 'Daily GMV (185M cap)')}
                  fill="#C8EEF7"
                  fillOpacity={0.5}
                  stroke="#94A3B8"
                  strokeWidth={1}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="ma7"
                  name="MA7 (7 ngày)"
                  stroke="#F59E0B"
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="ma28"
                  name="MA28 (28 ngày)"
                  stroke="#0D7287"
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={false}
                />
                <ReferenceDot x="16/06" y={185} r={5} fill="#E11D48" stroke="#FFFFFF" strokeWidth={1.5} />
                <ReferenceLine x="16/06" stroke="#E11D48" strokeDasharray="3 3" label={{ value: '16/06 (315Tr)', position: 'insideTopLeft', fill: '#E11D48', fontSize: 10, fontWeight: 700 }} />
                <ReferenceLine x="26/06" stroke="#B45309" strokeDasharray="4 3" label={{ value: '26/06 Cross (-18N)', position: 'insideTopRight', fill: '#B45309', fontSize: 10, fontWeight: 700 }} />
                <ReferenceLine x="31/08" stroke="#64748B" strokeDasharray="3 3" label={{ value: 'Đáy T8', position: 'insideTopLeft', fill: '#64748B', fontSize: 10, fontWeight: 700 }} />
                <ReferenceLine x="12/10" stroke="#0D7287" strokeDasharray="3 3" label={{ value: 'Hồi phục T10', position: 'insideTopLeft', fill: '#0D7287', fontSize: 10, fontWeight: 700 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggTrendData} margin={{ top: 10, right: 14, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={trendGrain === 'week' ? 3 : 0} />
                <YAxis width={54} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        trendGrain === 'week' ? L(`Tuần từ ${lbl}/2026`, `Week from ${lbl}/2026`) : L(`Tháng ${lbl}`, `Month ${lbl}`)
                      }
                      fmt={(v) => `${v.toFixed(1)} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="gmv" name={L('GMV ròng toàn shop (Tr đ)', 'Store net GMV (M VND)')} fill="#0D7287" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title={L(
            '3.2. Waterfall phân rã T6 -> T8 (-3.135,7 Tr đ) & Xoay trục Thu Đông',
            '3.2. Exact June-to-August Waterfall (-3,135.7M) & Autumn SKU pivot'
          )}
          subtitle={L(
            'Cộng khớp tuyệt đối: 3.772,4 - 2.224,8 (số ca) - 2.220,5 (GMV/ca) + 1.309,6 (chéo) = 636,7 Tr đ.',
            'Exact identity: 3,772.4 - 2,224.8 (lives) - 2,220.5 (GMV/live) + 1,309.6 (interaction) = 636.7M VND.'
          )}
          badge={
            <GranularityToggle
              value={decompView}
              onChange={setDecompView}
              options={[
                { id: 'waterfall', label: L('Waterfall T6->T8', 'Waterfall') },
                { id: 'day', label: L('Theo ngày (179N)', 'Daily (179d)') },
                { id: 'week', label: L('Theo tuần (26T)', 'Weekly (26w)') },
              ]}
            />
          }
          height="h-56 sm:h-60"
          footer={L(
            'Chuyển dịch hàng hóa: Trên panel 10 SKU (6,09 tỷ đ), 5 mã Bikini Hè chiếm 90,9% ở tháng 6; từ tuần 07/09 nhóm 5 mã Thu Đông (AT06, CV11...) vượt lên và chiếm 98,4% vào tháng 10.',
            'Catalog rotation: Across the 10-SKU panel (6.09B VND), 5 swimwear SKUs held 90.9% in June; from week 07/09, 5 autumn SKUs overtook swimwear to reach 98.4% share in October.'
          )}
        >
          {decompView === 'waterfall' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wfData} margin={{ top: 10, right: 8, left: 2, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="step" tick={{ fontSize: 11, className: axisTick.className }} interval={0} />
                <YAxis
                  domain={[-950, 4250]}
                  width={54}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v}Tr`}
                />
                <ReferenceLine y={0} stroke="#64748B" strokeWidth={1} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl, pl) => `${lbl} (${pl?.[0]?.payload?.sub ?? ''})`}
                      fmt={(_v, _nm) => ''}
                      extraRow={(pl) => {
                        const r = pl?.[0]?.payload;
                        if (!r) return null;
                        return L(`Giá trị thành phần: ${r.label}`, `Component delta: ${r.label}`);
                      }}
                    />
                  }
                />
                <Bar dataKey="range" name={L('Biến thiên GMV (Tr đ)', 'GMV bridge (M VND)')} radius={[4, 4, 4, 4]} isAnimationActive={false}>
                  {wfData.map((entry) => (
                    <Cell key={entry.step} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="label"
                    position="top"
                    className="fill-slate-800 dark:fill-slate-100 text-[11px] font-bold tabular-nums"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skuSeries} margin={{ top: 10, right: 12, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={decompView === 'day' ? 24 : 3} />
                <YAxis width={50} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        decompView === 'day' ? L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`) : L(`Tuần ${lbl}/2026`, `Week ${lbl}/2026`)
                      }
                      fmt={(v) => `${v.toFixed(1)} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="summerM" stackId="s" name={L('5 mã Bikini Hè', '5 Summer SKUs')} fill="#F59E0B" isAnimationActive={false} />
                <Bar dataKey="autumnM" stackId="s" name={L('5 mã Thu Đông', '5 Autumn SKUs')} fill="#0D7287" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </ChapterShell>
  );
}
