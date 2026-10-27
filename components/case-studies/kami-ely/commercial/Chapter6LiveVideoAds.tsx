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
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import {
  ChapterShell,
  ChartCard,
  ChartTooltip,
  Chip,
  GranularityToggle,
  TermTooltip,
  useChartGranularity,
  usePlaybookLang,
  axisTick,
  legendFormatter,
  GRID_STROKE,
} from '../playbook/PlaybookUi';
import {
  OFFICIAL_SLOT_DURATION_595,
  DAILY_CHARTS_231D,
  WEEKLY_CHARTS_33W,
  type SlotDurationCell,
} from './kamiElyVerified231d';

type Ch5CompareView = 'pairs' | 'day' | 'week';
type Ch5MatrixView = 'matrix' | 'day' | 'week';

function getMatrixCellStyle(cell: SlotDurationCell): string {
  if (cell.lowSample || cell.gmvPerView === null) {
    return 'opacity-45 bg-slate-100/70 text-slate-500 dark:bg-slate-900/50 dark:text-slate-500';
  }
  if (cell.gmvPerView >= 3000) {
    return 'bg-[#FFD14C]/55 text-slate-950 font-black ring-1 ring-[#F59E0B] dark:bg-[#FFD14C]/25 dark:text-[#FFE485]';
  }
  if (cell.gmvPerView >= 2000) {
    return 'bg-[#9BE7FA]/75 text-slate-950 font-bold dark:bg-[#9BE7FA]/25 dark:text-white';
  }
  if (cell.gmvPerView >= 1400) {
    return 'bg-[#C8EEF7]/65 text-slate-900 font-semibold dark:bg-[#9BE7FA]/15 dark:text-slate-100';
  }
  return 'bg-slate-50 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300';
}

export default function Chapter6LiveVideoAds() {
  const { L, isEn } = usePlaybookLang();
  const [compView, setCompView] = useChartGranularity<Ch5CompareView>('pairs', ['pairs', 'day', 'week']);
  const [matView, setMatView] = useChartGranularity<Ch5MatrixView>('matrix', ['matrix', 'day', 'week']);

  const sharePairs = [
    {
      metric: L('Lượt xem Live', 'Live views'),
      ownPct: 8.0,
      affPct: 92.0,
    },
    {
      metric: L('Doanh thu Live', 'Live GMV'),
      ownPct: 72.5,
      affPct: 27.5,
    },
  ];

  const liveEffSeries =
    compView === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({ x: r.d, viewsPerSes: r.ownViewsPerSes, unitsPer1k: r.ownUnitsPer1k }))
      : WEEKLY_CHARTS_33W.map((r) => ({ x: r.label, viewsPerSes: r.ownViewsPerSes, unitsPer1k: r.ownUnitsPer1k }));

  const videoTopicSeries =
    matView === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({
        x: r.d,
        bikini: r.vidBikini,
        dress: r.vidDress,
        autumn: r.vidAutumn,
        other: r.vidOther,
      }))
      : WEEKLY_CHARTS_33W.map((r) => ({
        x: r.label,
        bikini: r.vidBikini,
        dress: r.vidDress,
        autumn: r.vidAutumn,
        other: r.vidOther,
      }));

  const renderSlotCell = (cell: SlotDurationCell) => {
    if (cell.gmvPerView === null || cell.n === 0) {
      return (
        <div className="py-2 px-2">
          <div className="text-xs font-medium">·</div>
          <div className="text-[10px]">n = 0</div>
        </div>
      );
    }
    return (
      <div className="py-2 px-2">
        <div className="text-xs sm:text-sm leading-tight">
          {cell.gmvPerView.toLocaleString('vi-VN')} đ
        </div>
        <div className="text-[11px] font-normal opacity-80">({cell.n} ca)</div>
      </div>
    );
  };

  return (
    <ChapterShell
      id="sec-ch5-funnel"
      chapterNum={L('Chương 5', 'Chapter 5')}
      title={L('Live, Video, Quảng cáo: kênh nào chuyển đổi tốt hơn?', 'Live, Video, and Ads: which format converts viewers best?')}
      question={L(
        'Kênh và định dạng nào tạo doanh thu trên mỗi lượt xem tốt nhất?',
        'Which channel and broadcast format generate the highest revenue per viewer?'
      )}
      scopeLabel={L('Live 231N (8.355 ca) · 4.796 Video (doanh số 90N)', '231d Live (8,355 lives) · 4,796 Videos (90d sales)')}
      soWhat={L(
        'Affiliate tạo 92,0% lượt xem Live nhưng chỉ mang về 27,5% GMV Live (71 đ/lượt xem so với 2.163 đ ở kênh chính chủ), và trong riêng nội dung tự vận hành, Live chiếm 88,8% GMV. Quảng cáo gắn với tỷ lệ video ra đơn cao hơn nhưng GPM/1.000 view không cao hơn, và thiếu chi phí thầu nên chưa kết luận được ROI.',
        'Affiliates generate 92.0% of Live views for just 27.5% of Live GMV (71 VND/viewer vs. 2,163 VND on official Live), and Live accounts for 88.8% of official-account GMV. Ads-tagged clips convert more often at lower gross GPM, with net ROI unobservable without spend logs.'
      )}
      recommendation={L(
        'Thử nghiệm ca Live chính chủ dài >=8 giờ ở khung chiều 12h - 18h (đạt 3.891 đ/lượt xem trên 36 ca). Chuẩn hóa gắn hashtag tên sản phẩm thay vì hashtag xu hướng chung, và chưa thay đổi ngân sách quảng cáo khi chưa có dữ liệu chi phí.',
        'Pilot >=8h official Live broadcasts in the 12:00 - 18:00 afternoon window (3,891 VND/viewer across 36 sessions), standardize product-specific hashtags over generic tags, and hold ad budgets steady until spend logs are joined.'
      )}
      confidenceLabel={L('Tin cậy: Trung bình (mẫu ca dài nhỏ, dữ liệu quan sát)', 'Confidence: Medium (small >=8h sample, observational)')}
      confidenceTone="amber"
      appendixLabel={L('Xem giả định mẫu số lượt xem & bộ lọc từ khóa tại Phụ lục C', 'View view-denominator & regex notes in Appendix C')}
    >
      <div className="space-y-3.5">
        <ChartCard
          title={L(
            '5.1. Hai cặp thanh: Tỷ trọng Lượt xem vs GMV & Hiệu suất đ/lượt xem',
            '5.1. Two bar pairs: Share of Views vs. GMV & Revenue per viewer'
          )}
          subtitle={L(
            'Trên 231 ngày Live: Affiliate chiếm 92,0% lượt xem nhưng 27,5% GMV (lát cắt Hè 180N: 91,6% lượt xem, 24,2% GMV; chính chủ 2.155 đ vs affiliate 63 đ).',
            '231d Live: Affiliates hold 92.0% of views vs. 27.5% of GMV (180d slice: 91.6% views, 24.2% GMV; official 2,155 vs. affiliate 63 VND/view).'
          )}
          badge={
            <GranularityToggle
              value={compView}
              onChange={setCompView}
              options={[
                { id: 'pairs', label: L('Hai cặp thanh', 'Bar pairs') },
                { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              ]}
            />
          }
          height={compView === 'pairs' ? '' : 'h-56 sm:h-60'}
          footer={L(
            'Trong nội dung kênh chính chủ (8,55 tỷ đ): Live đóng góp 88,8% (7,59 tỷ đ / 595 ca), còn Video chính chủ chiếm 11,2% (0,96 tỷ đ / 276 clip).',
            'Within official-account content (8.55B VND): Live generates 88.8% (7.59B / 595 lives) vs. 11.2% from official Video (0.96B / 276 clips).'
          )}
        >
          {compView === 'pairs' ? (
            <div className="space-y-3 pt-1 text-slate-800 dark:text-slate-200">
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sharePairs}
                    layout="vertical"
                    margin={{ top: 4, right: 14, left: 4, bottom: 2 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={axisTick} tickFormatter={(v: number) => `${v}%`} />
                    <YAxis type="category" dataKey="metric" width={104} tick={axisTick} />
                    <Tooltip content={<ChartTooltip fmt={(v, nm) => `${v.toFixed(1)}% (${nm})`} />} />
                    <Legend formatter={legendFormatter} />
                    <Bar dataKey="ownPct" stackId="lv" name={L('Live chính chủ', 'Official Live')} fill="#0D7287" isAnimationActive={false}>
                      <LabelList
                        dataKey="ownPct"
                        position="inside"
                        formatter={(v: unknown) => `${Number(v).toFixed(1)}%`}
                        className="fill-white text-[11px] font-bold tabular-nums"
                      />
                    </Bar>
                    <Bar dataKey="affPct" stackId="lv" name={L('Live Affiliate', 'Affiliate Live')} fill="#6366F1" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                      <LabelList
                        dataKey="affPct"
                        position="inside"
                        formatter={(v: unknown) => `${Number(v).toFixed(1)}%`}
                        className="fill-white text-[11px] font-bold tabular-nums"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-2.5 text-xs tabular-nums">
                <div className="font-bold text-slate-900 dark:text-white font-sans">
                  {L('Cặp 2 · GMV trên mỗi lượt xem phiên Live (gấp 30,5 lần):', 'Pair 2 · GMV per Live viewer (30.5x gap):')}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 font-sans">{L('Live chính chủ (595 ca)', 'Official Live (595 lives)')}</span>
                    <span className="font-black text-[#074553] dark:text-[#9BE7FA]">2.163 đ / lượt xem</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-[#0D7287]" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 font-sans">{L('Live Affiliate (7.760 ca · trừ @koc_sat01 còn 41 đ)', 'Affiliate Live (7,760 lives · 41 VND excl. sat)')}</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">71 đ / lượt xem</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-[#6366F1]" style={{ width: '4%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={liveEffSeries} margin={{ top: 10, right: 12, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={compView === 'day' ? 26 : 3} />
                <YAxis width={48} tick={axisTick} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        compView === 'day' ? L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`) : L(`Tuần từ ${lbl}/2026`, `Week from ${lbl}/2026`)
                      }
                      fmt={(v, nm) => `${v.toLocaleString('vi-VN')} (${nm})`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Line
                  type="monotone"
                  dataKey="unitsPer1k"
                  name={L('Sản phẩm / 1k người xem chính chủ', 'Units / 1k official viewers')}
                  stroke="#0D7287"
                  strokeWidth={2}
                  dot={compView === 'week' ? { r: 2.5, fill: '#0D7287' } : false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title={L(
            '5.2. Ma trận Khung giờ × Độ dài ca Live chính chủ (GMV/lượt xem) & Video theo ngày',
            '5.2. Official Live Time-slot × Duration matrix (VND/viewer) & daily Video series'
          )}
          subtitle={L(
            'Đã dịch +13 giờ sang giờ Việt Nam (595 ca). Ô có ít ca (n < 10) được làm mờ để tránh ngộ nhận trên mẫu nhỏ.',
            'Shifted +13h to Vietnam UTC+7 (595 sessions). Low-sample cells (n < 10) are dimmed.'
          )}
          badge={
            <GranularityToggle
              value={matView}
              onChange={setMatView}
              options={[
                { id: 'matrix', label: L('Ma trận Khung giờ', 'Slot × Duration') },
                { id: 'day', label: L('Theo ngày Video (231N)', 'Video daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              ]}
            />
          }
          height={matView === 'matrix' ? '' : 'h-64'}
          footer={L(
            'Điểm nổi bật: Khung chiều 12h - 18h với ca kéo dài >=8 giờ đạt hiệu suất cao nhất (3.891 đ/lượt xem, 36 ca), vượt xa ca ngắn buổi tối 18h - 24h (871 - 1.467 đ/lượt xem).',
            'Key cell: Afternoon 12:00 - 18:00 sessions lasting >=8h achieved the highest yield (3,891 VND/viewer, n = 36), outperforming congested evening slots.'
          )}
        >
          {matView === 'matrix' ? (
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-center border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-300">
                    <th className="py-2 px-3 text-left font-bold rounded-l-lg">{L('Khung giờ bắt đầu (VN)', 'Start slot (VN)')}</th>
                    <th className="py-2 px-2 font-bold">{L('<= 2 giờ', '<= 2h')}</th>
                    <th className="py-2 px-2 font-bold">{L('2 - 4 giờ', '2 - 4h')}</th>
                    <th className="py-2 px-2 font-bold">{L('4 - 8 giờ', '4 - 8h')}</th>
                    <th className="py-2 px-2 font-bold rounded-r-lg">{L('>= 8 giờ', '>= 8h')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800 dark:text-slate-200">
                  {OFFICIAL_SLOT_DURATION_595.map((row) => (
                    <tr key={row.slotEn} className="border-b-4 border-white dark:border-slate-900">
                      <td className="py-2 px-3 text-left font-bold whitespace-nowrap">
                        {isEn ? row.slotEn : row.slotVi}
                      </td>
                      <td className={`rounded-lg ${getMatrixCellStyle(row.u2h)}`}>{renderSlotCell(row.u2h)}</td>
                      <td className={`rounded-lg ${getMatrixCellStyle(row.b2_4h)}`}>{renderSlotCell(row.b2_4h)}</td>
                      <td className={`rounded-lg ${getMatrixCellStyle(row.b4_8h)}`}>{renderSlotCell(row.b4_8h)}</td>
                      <td className={`rounded-lg ${getMatrixCellStyle(row.o8h)}`}>{renderSlotCell(row.o8h)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={videoTopicSeries} margin={{ top: 10, right: 12, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={matView === 'day' ? 26 : 3} />
                <YAxis width={48} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        matView === 'day'
                          ? L(`Ngày đăng Video ${lbl}/2026`, `Clip publish date ${lbl}/2026`)
                          : L(`Tuần đăng từ ${lbl}/2026`, `Publish week from ${lbl}/2026`)
                      }
                      fmt={(v) => `${v.toFixed(1)} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="bikini" stackId="vid" name={L('Bikini / Đồ bơi', 'Swimwear')} fill="#0D7287" isAnimationActive={false} />
                <Bar dataKey="dress" stackId="vid" name={L('Váy / Đầm', 'Dresses')} fill="#F59E0B" isAnimationActive={false} />
                <Bar dataKey="autumn" stackId="vid" name={L('Áo thu / Chân váy', 'Autumn tops/skirts')} fill="#10B981" isAnimationActive={false} />
                <Bar dataKey="other" stackId="vid" name={L('Khác (thiếu từ khóa)', 'Unclassified')} fill="#64748B" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Hàng chỉ số nhỏ gắn nhãn rõ "Quan sát, không nhân quả" */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
            {L(
              '5.3. Chỉ số Video gắn giỏ (n = 4.796 clip đã chuẩn hóa cờ Ads YES / có)',
              '5.3. Shoppable Video indicators (n = 4,796 clips with normalized Ads flags)'
            )}
          </div>
          <Chip tone="amber">
            <TermTooltip
              label={L('Quan sát, không nhân quả', 'Observational, non-causal')}
              explain="Các clip được bật cờ ủy quyền quảng cáo thường đã qua bước chọn lọc nội dung hoặc thuộc KOC có sẵn tệp người xem, đồng thời dữ liệu không có chi phí quảng cáo (Ad spend)."
            />
          </Chip>
        </div>

        <div className="grid gap-3 md:grid-cols-3 text-xs tabular-nums">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="text-slate-500 dark:text-slate-400 font-sans">
              {L('Tỷ lệ Video phát sinh đơn (Ads vs Không Ads)', 'Clip order incidence (Ads vs. Non-Ads)')}
            </div>
            <div className="text-base font-black text-slate-950 dark:text-white mt-0.5">
              30,3% <span className="font-normal text-slate-400">vs</span> 10,2%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              {L('3.775 vs 1.021 clip (lát cắt 180N: 26,2% vs 5,2%)', '3,775 vs. 1,021 clips (180d slice: 26.2% vs. 5.2%)')}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="text-slate-500 dark:text-slate-400 font-sans">
              {L('GPM gộp / 1.000 lượt phát (Ads vs Không Ads)', 'Gross GPM / 1,000 views (Ads vs. Non-Ads)')}
            </div>
            <div className="text-base font-black text-[#074553] dark:text-[#9BE7FA] mt-0.5">
              65.689 đ <span className="font-normal text-slate-400">vs</span> 77.799 đ
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              {L('Lát cắt 180N: 71.103 đ vs 80.874 đ (chưa trừ chi phí Ads)', '180d slice: 71,103 vs. 80,874 VND (gross before ad spend)')}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="text-slate-500 dark:text-slate-400 font-sans">
              {L('Tỷ lệ ra đơn: Hashtag sản phẩm vs Hashtag chung', 'Order incidence: Product hashtag vs. Generic tag')}
            </div>
            <div className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
              31,1% <span className="font-normal text-slate-400">vs</span> 21,7%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              {L('1.817 vs 2.393 clip (lát cắt 180N: 28,6% vs 16,4%)', '1,817 vs. 2,393 clips (180d slice: 28.6% vs. 16.4%)')}
            </div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
