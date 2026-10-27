'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LabelList,
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
  CHANNEL_SHARE_100_STACKS,
  ACTIVE_SKU_PARETO,
  DAILY_CHARTS_231D,
  WEEKLY_CHARTS_33W,
  SKU_DAILY_179D,
} from './kamiElyVerified231d';

type Ch2ChannelView = 'share100' | 'day' | 'week';
type Ch2SkuView = 'pareto' | 'day';

export default function Chapter3RevenueAndSku() {
  const { L, isEn } = usePlaybookLang();
  const [channelView, setChannelView] = useChartGranularity<Ch2ChannelView>('share100', ['share100', 'day', 'week']);
  const [skuView, setSkuView] = useChartGranularity<Ch2SkuView>('pareto', ['pareto', 'day']);

  const stack100Data = CHANNEL_SHARE_100_STACKS.map((r) => ({
    ...r,
    scope: isEn ? r.scopeEn : r.scopeVi,
  }));

  const channelTimeSeries =
    channelView === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({ x: r.d, ownLive: r.ownLive, top1Live: r.top1Live, extLive: r.extLive }))
      : WEEKLY_CHARTS_33W.map((r) => ({ x: r.label, week: r.week, ownLive: r.ownLive, top1Live: r.top1Live, extLive: r.extLive }));

  return (
    <ChapterShell
      id="sec-ch2-sku"
      chapterNum={L('Chương 2', 'Chapter 2')}
      title={L('Doanh thu tập trung ở vài kênh, vài SKU', 'Revenue concentrates in a few channels and a few SKUs')}
      question={L('Doanh thu đến từ kênh nào, sản phẩm nào?', 'Which channels and which products generate the store’s revenue?')}
      scopeLabel={L('Đối chiếu 231N Live & Cửa sổ 90N SKU/KOL', '231d Live & 90d SKU/Creator windows reconciled')}
      soWhat={L(
        'Doanh thu dựa vào kênh tự vận hành (chiếm 72,5% trên 231 ngày Live và 60,1% trên danh bạ creator 90 ngày) cùng 12 SKU chủ lực (tạo 80,6% GMV kệ hàng), trong khi 60,8% danh mục (206/339 SKU) không phát sinh đơn trong 90 ngày. Gián đoạn kênh chính chủ hoặc đứt hàng vài mã đầu bảng sẽ làm hụt phần lớn doanh thu.',
        'Revenue relies heavily on the in-house channel (72.5% of 231d Live GMV; 60.1% of the 90d creator directory) and 12 hero SKUs (80.6% of 90d catalog GMV), while 60.8% of listed SKUs (206/339) had zero 90d orders.'
      )}
      recommendation={L(
        'Rà soát 206 SKU không ra đơn trong 90 ngày, đối chiếu tồn kho thực tế và ngày ra mắt để phân biệt hàng hết vụ Hè với mã lỗi trước khi gỡ kệ; ưu tiên giữ tồn kho cho dải giá 75k - 250k đ (chiếm 93,0% GMV).',
        'Review the 206 zero-sale SKUs against warehouse stock and launch dates before delisting, prioritizing inventory depth in the 75k - 250k VND price band (93.0% of GMV).'
      )}
      confidenceLabel={L('Tin cậy: Trung bình (thiếu tồn kho/COGS)', 'Confidence: Medium (missing stock/COGS)')}
      confidenceTone="amber"
      appendixLabel={L('Xem truy vấn SQL Pareto tại Phụ lục B', 'View Pareto SQL query in Appendix B')}
    >
      <div className="space-y-3.5">
        <ChartCard
          title={L(
            '2.1. Tỷ trọng 100% theo 3 nhóm kênh (xác nhận rõ từng phạm vi thời gian)',
            '2.1. 100% revenue split across 3 channel groups (reconciled by time window)'
          )}
          subtitle={L(
            'Tách riêng Kênh tự vận hành chính chủ, Kênh vệ tinh nội bộ (@koc_sat01) và Affiliate độc lập khác để không nhầm lẫn giữa cửa sổ 231 ngày và 90 ngày.',
            'Separates Official in-house, Satellite (@koc_sat01), and Other Affiliates across exact 231d vs. 90d scopes.'
          )}
          badge={
            <GranularityToggle
              value={channelView}
              onChange={setChannelView}
              options={[
                { id: 'share100', label: L('Thanh 100%', '100% split') },
                { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              ]}
            />
          }
          height={channelView === 'share100' ? 'h-48 sm:h-52' : 'h-56 sm:h-60'}
          footer={L(
            'Đối chiếu phạm vi: Tỷ lệ 63,9% / 15,5% / 20,6% thuộc bản chụp KOL 90 ngày kỳ Hè (đến 04/09); khi gộp thêm kỳ Thu Đông là 60,1% / 14,8% / 25,1%, và tính trên toàn bộ 231 ngày Live (10,47 tỷ đ) là 72,5% / 12,0% / 15,5%.',
            'Scope reconciliation: 63.9% / 15.5% / 20.6% corresponds to the Summer 90d KOL snapshot (to Sep 04); merged 90d is 60.1% / 14.8% / 25.1%, and full 231d Live (10.47B) is 72.5% / 12.0% / 15.5%.'
          )}
        >
          {channelView === 'share100' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stack100Data}
                layout="vertical"
                margin={{ top: 8, right: 18, left: 6, bottom: 6 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis type="category" dataKey="scope" width={154} tick={axisTick} />
                <Tooltip
                  content={
                    <ChartTooltip
                      fmt={(v, nm) => `${v.toFixed(1)}% (${nm})`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar
                  dataKey="ownPct"
                  stackId="s100"
                  name={L('Tự vận hành chính chủ', 'Official in-house')}
                  fill="#0D7287"
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="ownPct"
                    position="inside"
                    formatter={(v: unknown) => `${Number(v).toFixed(1)}%`}
                    className="fill-white text-[11px] font-bold tabular-nums"
                  />
                </Bar>
                <Bar
                  dataKey="satPct"
                  stackId="s100"
                  name={L('Vệ tinh nội bộ (@koc_sat01)', 'Satellite (@koc_sat01)')}
                  fill="#F59E0B"
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="satPct"
                    position="inside"
                    formatter={(v: unknown) => `${Number(v).toFixed(1)}%`}
                    className="fill-slate-950 text-[11px] font-bold tabular-nums"
                  />
                </Bar>
                <Bar
                  dataKey="extPct"
                  stackId="s100"
                  name={L('Affiliate khác', 'Other Affiliates')}
                  fill="#6366F1"
                  radius={[0, 6, 6, 0]}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="extPct"
                    position="inside"
                    formatter={(v: unknown) => `${Number(v).toFixed(1)}%`}
                    className="fill-white text-[11px] font-bold tabular-nums"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelTimeSeries} margin={{ top: 8, right: 14, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={channelView === 'day' ? 26 : 3} />
                <YAxis width={52} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        channelView === 'day' ? L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`) : L(`Tuần từ ${lbl}/2026`, `Week from ${lbl}/2026`)
                      }
                      fmt={(v) => `${v.toFixed(1)} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar dataKey="ownLive" stackId="ch" name={L('Tự vận hành', 'Official')} fill="#0D7287" isAnimationActive={false} />
                <Bar dataKey="top1Live" stackId="ch" name="@koc_sat01" fill="#F59E0B" isAnimationActive={false} />
                <Bar dataKey="extLive" stackId="ch" name={L('Affiliate khác', 'Other Affiliates')} fill="#6366F1" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title={L(
            '2.2. Đường cong Pareto trên 133 SKU có GMV (và chuỗi ngày Top SKU)',
            '2.2. Pareto curve across 133 active SKUs (with daily hero SKU series)'
          )}
          subtitle={
            <>
              {L(
                'Chỉ vẽ 133 SKU phát sinh doanh thu (>0 đ); đánh dấu Top 5 = 68,5% và 12 SKU = 80,6% GMV (',
                'Plots strictly the 133 revenue-generating SKUs (>0 VND); marks Top 5 = 68.5% and 12 SKUs = 80.6% GMV ('
              )}
              <TermTooltip
                label="Gini = 0,875"
                explain="Trên bảng kệ hàng 339 SKU hợp nhất đến tháng 10 (có thêm mã Thu Đông chủ lực AT06), 133 SKU có đơn đạt Gini = 0,875 (12 SKU = 80,6% GMV; Top 5 = 68,5%). Ở bản chụp riêng kỳ Hè trước tháng 10 (331 SKU, 134 SKU có đơn), 21 SKU tạo 80% GMV và Top 5 chiếm 44,9%."
              />
              {L(').', ').')}
            </>
          }
          badge={
            <GranularityToggle
              value={skuView}
              onChange={setSkuView}
              options={[
                { id: 'pareto', label: L('Pareto 133 SKU', '133-SKU Pareto') },
                { id: 'day', label: L('Theo ngày (179N)', 'Daily (179d)') },
              ]}
            />
          }
          height="h-56 sm:h-60"
          footer={L(
            'Ghi chú ngoài biểu đồ: 206/339 SKU không ra đơn trong 90 ngày (60,8%) được tách khỏi trục hoành để không bóp méo đường cong (kỳ Hè 331 SKU là 197 SKU 0 đơn, 21 SKU = 80% GMV). Dải giá 75k - 250k đ đóng góp 93,0% tổng GMV.',
            'Out-of-chart note: 206/339 zero-sale SKUs (60.8%) lie outside the active curve (Summer 331-SKU snapshot: 197 zero-sale, 21 SKUs = 80% GMV). The 75k - 250k VND tier generates 93.0% of GMV.'
          )}
        >
          {skuView === 'pareto' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVE_SKU_PARETO} margin={{ top: 8, right: 14, left: 2, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="activePct"
                  type="number"
                  domain={[0, 100]}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis
                  domain={[0, 100]}
                  width={46}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(_lbl, pl) => {
                        const rk = pl?.[0]?.payload?.rank ?? 0;
                        return L(`Top ${rk} / 133 SKU có đơn`, `Top ${rk} / 133 active SKUs`);
                      }}
                      fmt={(v) => `${v.toFixed(1)}% GMV tích lũy`}
                    />
                  }
                />
                <ReferenceLine
                  y={80.6}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: L('12 SKU = 80,6% GMV', '12 SKUs = 80.6% GMV'),
                    position: 'insideBottomRight',
                    fill: '#B45309',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
                <ReferenceLine
                  x={3.8}
                  stroke="#E11D48"
                  strokeDasharray="3 3"
                  label={{
                    value: L('Top 5 = 68,5%', 'Top 5 = 68.5%'),
                    position: 'insideTopRight',
                    fill: '#E11D48',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="gmvPct"
                  name={L('% GMV tích lũy', 'Cumulative GMV %')}
                  stroke="#0D7287"
                  strokeWidth={2.5}
                  fill="#9BE7FA"
                  fillOpacity={0.38}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={SKU_DAILY_179D} margin={{ top: 10, right: 14, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="d" tick={axisTick} interval={22} />
                <YAxis width={48} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) => L(`Ngày ${lbl}/2026 (Panel 10 SKU)`, `Date ${lbl}/2026 (10-SKU panel)`)}
                      fmt={(v) => `${v.toFixed(2)} Tr đ`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Area
                  type="monotone"
                  dataKey="h36M"
                  stackId="skuTop"
                  name={L('Mã #1 Hè (Bikini H36)', '#1 Summer (Bikini H36)')}
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.75}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="at06M"
                  stackId="skuTop"
                  name={L('Mã #1 Thu (Áo dài tay AT06)', '#1 Autumn (Long-sleeve AT06)')}
                  stroke="#0D7287"
                  fill="#0D7287"
                  fillOpacity={0.75}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="other8M"
                  stackId="skuTop"
                  name={L('8 mã chủ lực còn lại', 'Other 8 tracked SKUs')}
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.45}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </ChapterShell>
  );
}
