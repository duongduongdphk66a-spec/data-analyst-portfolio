'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  ComposedChart,
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
  COHORT_RETENTION_231D,
  DAILY_CHARTS_231D,
  WEEKLY_CHARTS_33W,
} from './kamiElyVerified231d';

type Ch4RetView = 'heatmap' | 'day' | 'week';
type Ch4SatView = 'cohort' | 'day' | 'week';

function getRetentionCellStyle(val: number | null): string {
  if (val === null) {
    return 'bg-slate-50/70 text-slate-400 dark:bg-slate-950/40 dark:text-slate-600';
  }
  if (val >= 99.9) {
    return 'bg-[#0D7287] text-white font-bold';
  }
  if (val >= 45) {
    return 'bg-[#9BE7FA]/85 text-slate-950 font-bold dark:bg-[#9BE7FA]/35 dark:text-white';
  }
  if (val >= 25) {
    return 'bg-[#C8EEF7]/75 text-slate-900 font-semibold dark:bg-[#9BE7FA]/20 dark:text-slate-100';
  }
  if (val >= 12) {
    return 'bg-[#FFE485]/55 text-amber-950 font-medium dark:bg-[#FFD14C]/15 dark:text-[#FFE485]';
  }
  return 'bg-rose-50/80 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300';
}

export default function Chapter5KocNetwork() {
  const { L } = usePlaybookLang();
  const [retView, setRetView] = useChartGranularity<Ch4RetView>('heatmap', ['heatmap', 'day', 'week']);
  const [satView, setSatView] = useChartGranularity<Ch4SatView>('cohort', ['cohort', 'day', 'week']);

  const kocActivitySeries =
    retView === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({ x: r.d, active: r.kocActive, orders: r.kocOrders, newly: r.kocNew }))
      : WEEKLY_CHARTS_33W.map((r) => ({ x: r.label, active: r.kocActive, orders: r.kocOrders, newly: r.kocNew }));

  const satTimeSeries =
    satView === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({ x: r.d, satM: r.top1Live, extM: r.extLive }))
      : WEEKLY_CHARTS_33W.map((r) => ({ x: r.label, satM: r.top1Live, extM: r.extLive }));

  return (
    <ChapterShell
      id="sec-ch4-koc"
      chapterNum={L('Chương 4', 'Chapter 4')}
      title={L('Affiliate: nhiều lượt xem, ít đơn, giữ chân kém', 'Affiliate KOCs: broad views, few orders, weak retention')}
      question={L('Mạng lưới KOC có bền và đa dạng không?', 'Is the affiliate creator network durable and genuinely diversified?')}
      scopeLabel={L('302 KOC Live · 7.760 phiên · 231 ngày', '302 Live KOCs · 7,760 sessions · 231d')}
      soWhat={L(
        'Giữ chân M+1 giảm từ 71,2% (lô T3) xuống 27,8% (lô T8, hồi phục lên 41,4% ở lô T9), tuyển mới giảm hơn một nửa từ tháng 5, và 57,3% (173/302) creator Live chưa từng ra đơn. Nếu không tách kênh vệ tinh nội bộ @koc_sat01 (chiếm 43,7% GMV affiliate cả kỳ, 56,1% kỳ Hè), cohort T5 trông như lô tốt nhất (1.496,7 Tr) trong khi 36 KOC còn lại chỉ tạo 238,9 Tr.',
        'M+1 retention dropped from 71.2% (Mar) to 27.8% (Aug, rebounding to 41.4% in Sep), recruitment fell by over half from May, and 57.3% of Live creators never sold. Without separating in-house satellite @koc_sat01 (43.7% of 231d affiliate Live GMV; 56.1% in summer), Cohort T5 appears strongest (1,496.7M) while its remaining 36 creators generated just 238.9M.'
      )}
      recommendation={L(
        'Dồn hỗ trợ seeding và voucher vào 3 phiên đầu của creator mới (sau 3 ca đầu không có đơn, 77,2% bỏ cuộc không bao giờ ra đơn về sau). Mọi báo cáo cohort affiliate cần tách riêng kênh vệ tinh nội bộ (@koc_sat01).',
        'Concentrate seeding and voucher support in a creator’s first 3 Live sessions (77.2% of creators with zero orders in their first 3 sessions never convert later), and separate @koc_sat01 in every cohort report.'
      )}
      confidenceLabel={L('Tin cậy: Trung bình - cao', 'Confidence: Medium - high')}
      confidenceTone="emerald"
      appendixLabel={L('Xem truy vấn SQL tách @koc_sat01 tại Phụ lục B', 'View @koc_sat01 cohort SQL in Appendix B')}
    >
      <div className="space-y-3.5">
        <ChartCard
          title={L(
            '4.1. Heatmap giữ chân KOC theo lô gia nhập (M0 -> M+7) & hoạt động theo ngày',
            '4.1. Cohort retention heatmap (M0 -> M+7) & daily creator activity'
          )}
          subtitle={
            <>
              {L(
                'Theo dõi vòng đời 302 KOC phát sóng Live (trong điều kiện thiếu customer_id). Các ô chấm phía dưới bên phải là ',
                'Tracks 302 external Live creators (absent customer_id). Blank lower-right cells represent '
              )}
              <TermTooltip
                label={L('Right-censoring (chưa tới kỳ)', 'right-censoring')}
                explain="Các lô gia nhập muộn (T8, T9, T10/2026) chưa đi hết các tháng M+2..M+7 tính đến ngày khóa sổ 25/10/2026, nên để trống thay vì ghi 0%."
              />
              {L(' tính đến 25/10/2026.', ' as of Oct 25, 2026.')}
            </>
          }
          badge={
            <GranularityToggle
              value={retView}
              onChange={setRetView}
              options={[
                { id: 'heatmap', label: L('Heatmap Cohort', 'Cohort heatmap') },
                { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              ]}
            />
          }
          height={retView === 'heatmap' ? '' : 'h-64'}
          footer={L(
            'Ngưỡng sàng lọc 3 ca đầu: Trong 224 creator không phát sinh đơn ở 3 phiên Live đầu tiên, có 173 người (77,2%) không bao giờ có đơn về sau (trung vị gắn bó chỉ 10 ngày so với 59 ngày ở nhóm có đơn sớm).',
            'First-3-session threshold: Among 224 creators with zero orders in their first 3 sessions, 173 (77.2%) never generated an order afterward (median lifespan 10d vs. 59d for early converters).'
          )}
        >
          {retView === 'heatmap' ? (
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-center border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-300">
                    <th className="py-2 px-2.5 text-left font-bold rounded-l-lg">{L('Cohort', 'Cohort')}</th>
                    <th className="py-2 px-2 text-right font-bold">n</th>
                    {['M0', 'M+1', 'M+2', 'M+3', 'M+4', 'M+5', 'M+6', 'M+7'].map((col, idx) => (
                      <th key={col} className={`py-2 px-1.5 font-bold ${idx === 7 ? 'rounded-r-lg' : ''}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-800 dark:text-slate-200">
                  {COHORT_RETENTION_231D.map((row) => (
                    <tr key={row.cohort} className="border-b border-white dark:border-slate-900">
                      <td className="py-1.5 px-2.5 text-left font-bold whitespace-nowrap">{row.cohort}</td>
                      <td className="py-1.5 px-2 text-right text-slate-500 dark:text-slate-400">{row.n}</td>
                      {row.m.map((val, mIdx) => (
                        <td
                          key={`${row.cohort}-m${mIdx}`}
                          className={`py-1.5 px-1.5 rounded-md ${getRetentionCellStyle(val)}`}
                        >
                          {val === null ? '·' : `${val.toFixed(1)}%`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={kocActivitySeries} margin={{ top: 10, right: 14, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={retView === 'day' ? 26 : 3} />
                <YAxis width={44} tick={axisTick} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        retView === 'day' ? L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`) : L(`Tuần từ ${lbl}/2026`, `Week from ${lbl}/2026`)
                      }
                      fmt={(v, nm) => `${v} KOC (${nm})`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="active" name={L('KOC lên sóng', 'Active KOCs')} fill="#6366F1" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name={L('KOC ra đơn (>0)', 'KOCs with orders')}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title={L(
            '4.2. GMV theo Cohort: Có vs Không có kênh vệ tinh nội bộ (@koc_sat01)',
            '4.2. Cohort GMV: With vs. Without in-house satellite (@koc_sat01)'
          )}
          subtitle={L(
            'Lô T5 ghi nhận 1.496,7 Tr đ khi gộp chung, nhưng khi tách @koc_sat01 (1.257,8 Tr đ) thì 36 KOC độc lập còn lại chỉ đạt 238,9 Tr đ (180N: 1.463 vs 207 Tr).',
            'Cohort T5 totals 1,496.7M VND overall, yet excluding @koc_sat01 (1,257.8M) leaves 238.9M across the other 36 KOCs (180d slice: 1,463M vs. 207M).'
          )}
          badge={
            <GranularityToggle
              value={satView}
              onChange={setSatView}
              options={[
                { id: 'cohort', label: L('Theo Cohort', 'By cohort') },
                { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              ]}
            />
          }
          height="h-56 sm:h-60"
          footer={L(
            'Độ tập trung HHI: Tính trên 302 KOC cả kỳ HHI = 2.152 (riêng kỳ Hè HHI = 3.230, mức tập trung cao); khi tách @koc_sat01, HHI của 301 KOC độc lập giảm xuống 761.',
            'HHI concentration: Full 231d affiliate HHI is 2,152 (3,230 in summer); excluding @koc_sat01 drops HHI across the 301 independent KOCs to 761.'
          )}
        >
          {satView === 'cohort' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COHORT_RETENTION_231D} margin={{ top: 8, right: 10, left: 2, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="cohort" tick={axisTick} />
                <YAxis width={52} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl, pl) => `${lbl} (n = ${pl?.[0]?.payload?.n ?? 0} KOC)`}
                      fmt={(v) => `${v.toLocaleString('vi-VN', { minimumFractionDigits: 1 })} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar
                  dataKey="gmvWithSatM"
                  name={L('Gồm @koc_sat01', 'Incl. @koc_sat01')}
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="gmvNoSatM"
                  name={L('Tách @koc_sat01', 'Excl. @koc_sat01')}
                  fill="#0D7287"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satTimeSeries} margin={{ top: 10, right: 12, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={satView === 'day' ? 26 : 3} />
                <YAxis width={52} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        satView === 'day' ? L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`) : L(`Tuần từ ${lbl}/2026`, `Week from ${lbl}/2026`)
                      }
                      fmt={(v) => `${v.toFixed(1)} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="satM" stackId="k" name="@koc_sat01" fill="#F59E0B" isAnimationActive={false} />
                <Bar dataKey="extM" stackId="k" name={L('301 KOC độc lập', '301 independent KOCs')} fill="#6366F1" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </ChapterShell>
  );
}
