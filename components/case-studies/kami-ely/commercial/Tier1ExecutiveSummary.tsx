'use client';

import React from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  usePlaybookLang,
  ChartCard,
  ChartTooltip,
  GranularityToggle,
  useChartGranularity,
  axisTick,
  legendFormatter,
  GRID_STROKE,
} from '../playbook/PlaybookUi';
import {
  DAILY_CHARTS_231D,
  WEEKLY_CHARTS_33W,
  MONTHLY_CHARTS_8M,
} from './kamiElyVerified231d';

type HeroGrain = 'day' | 'week' | 'month';

export default function Tier1ExecutiveSummary() {
  const { L } = usePlaybookLang();
  const [grain, setGrain] = useChartGranularity<HeroGrain>('week', ['day', 'week', 'month']);

  interface HeroChartRow {
    xKey: string;
    ownLive: number;
    top1Live: number;
    extLive: number;
    storeTotal: number;
    week?: string;
    days?: number;
  }

  const chartData: HeroChartRow[] =
    grain === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({
          xKey: r.d,
          ownLive: r.ownLive,
          top1Live: r.top1Live,
          extLive: r.extLive,
          storeTotal: r.storeTotal,
        }))
      : grain === 'month'
        ? MONTHLY_CHARTS_8M.map((r) => ({
            xKey: r.month,
            days: r.days,
            ownLive: r.ownLive,
            top1Live: r.top1Live,
            extLive: r.extLive,
            storeTotal: r.storeTotal,
          }))
        : WEEKLY_CHARTS_33W.map((r) => ({
            xKey: r.label,
            week: r.week,
            ownLive: r.ownLive,
            top1Live: r.top1Live,
            extLive: r.extLive,
            storeTotal: r.storeTotal,
          }));

  const findings = [
    {
      title: L('1. Doanh thu tập trung vào rất ít điểm', '1. Revenue is concentrated in very few nodes'),
      body: L(
        'Trên 231 ngày Live (10,47 tỷ đ), kênh tự vận hành chiếm 72,5% (và chiếm 60,1% trên danh bạ creator 90 ngày). Trên kệ hàng 339 SKU, riêng 12 SKU tạo 80,6% GMV (top 5 chiếm 68,5%), và ngày đỉnh 16/06 (315,0 Tr) có 61,9% gắn với một ca Live duy nhất.',
        'Across 231d Live (10.47B VND), the official channel holds 72.5% (60.1% on the 90d creator directory). Just 12/339 SKUs generate 80.6% of GMV (top 5 hold 68.5%), and 61.9% of the 16/06 peak (315.0M) came from a single Live.'
      ),
    },
    {
      title: L('2. Đỉnh tháng 6, đáy tháng 8: cả hai đòn bẩy cùng sụt', '2. June peak to August trough: both volume and rate contracted'),
      body: L(
        'Số ca Live giảm từ 1.560 xuống 640 và GMV mỗi ca giảm từ 2,42 Tr xuống 0,99 Tr. Tháng 10 hồi phục (1,62 tỷ trong 25 ngày) gắn với việc xoay danh mục sang hàng Thu Đông. Đường MA7 cắt xuống MA28 ngày 26/06, sớm 18 ngày trước khi thủng nền tháng 4, nhưng mới quan sát một lần.',
        'Live sessions dropped from 1,560 to 640 while GMV/session fell from 2.42M to 0.99M. October rebounded (1.62B in 25 days) alongside the autumn catalog shift. MA7 crossed below MA28 on 26/06 (18 days ahead), observed once.'
      ),
    },
    {
      title: L('3. Mạng lưới affiliate rộng về lượt xem nhưng mỏng về đơn', '3. Affiliate network brings broad reach but thin conversion'),
      body: L(
        'Affiliate mang 92,0% lượt xem Live nhưng chỉ tạo 27,5% GMV Live. Có 57,3% creator Live chưa từng ra đơn, tỷ lệ giữ chân M+1 giảm từ 71,2% xuống 27,8%, và riêng kênh vệ tinh nội bộ (@koc_sat01) chiếm 43,7% GMV Live affiliate cả kỳ (56,1% trong kỳ Hè).',
        'Affiliates bring 92.0% of Live views for 27.5% of Live GMV. 57.3% of Live creators never sold, M+1 retention slid from 71.2% to 27.8%, and in-house satellite @koc_sat01 accounts for 43.7% of 231d affiliate Live GMV (56.1% in summer).'
      ),
    },
  ];

  const actions = [
    {
      title: L('1. Chuẩn bị tồn kho và lịch Live hàng Thu Đông sớm hơn', '1. Stage autumn inventory and Live schedules earlier'),
      body: L(
        'Đưa nhóm Áo thun dài tay và Chân váy lên kệ từ giữa tháng 8 để thu hẹp vùng trũng chuyển mùa, đồng thời theo dõi giao cắt MA7/MA28 như tín hiệu giám sát (chưa xem là dự báo đa năm).',
        'Introduce long-sleeve tops and skirts by mid-August to narrow the post-summer trough, tracking MA7/MA28 strictly as a descriptive monitor.'
      ),
    },
    {
      title: L('2. Dồn hỗ trợ hàng mẫu và voucher vào 3 phiên đầu của creator mới', '2. Concentrate seeding and vouchers in a creator’s first 3 sessions'),
      body: L(
        'Trong nhóm creator không phát sinh đơn ở 3 ca đầu, có tới 77,2% không bao giờ ra đơn về sau. Mọi báo cáo hiệu quả affiliate cần tách riêng kênh vệ tinh nội bộ (@koc_sat01).',
        'Among creators with zero orders in their first 3 sessions, 77.2% never convert later. Separate in-house satellite @koc_sat01 in all cohort reports.'
      ),
    },
    {
      title: L('3. Rà soát 206 SKU không ra đơn và thử nghiệm ca Live chiều kéo dài', '3. Review 206 zero-sale SKUs and test >=8h afternoon Live slots'),
      body: L(
        'Đối chiếu tồn kho thực tế và ngày mở bán trước khi gỡ kệ nhóm SKU 0 đơn trong 90 ngày. Thử nghiệm ca Live dài >=8 giờ ở khung chiều 12h - 18h, nơi hiệu suất quan sát cao nhất (3.891 đ/lượt xem, 36 ca).',
        'Cross-check warehouse stock and launch dates before delisting 90d zero-sale SKUs. Pilot >=8h afternoon (12:00 - 18:00) broadcasts where observed yield peaked (3,891 VND/viewer, n = 36).'
      ),
    },
  ];

  return (
    <section
      id="sec-exec-summary"
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/90 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-lg bg-[#9BE7FA] px-2.5 py-0.5 text-xs font-black text-slate-950">
          {L('Chương 0 · Tóm tắt điều hành', 'Chapter 0 · Executive summary')}
        </span>
      </div>

      <ChartCard
        title={L(
          'Biểu đồ tổng quan: Cơ cấu doanh thu miền chồng (Stacked Area) theo 3 nhóm kênh và 4 mốc chuyển pha',
          'Hero trajectory: Stacked area GMV across 3 channel tiers with 4 structural milestones'
        )}
        subtitle={L(
          'Chia 3 nhóm kênh Live (Tự vận hành chính chủ · Kênh vệ tinh nội bộ @koc_sat01 · Affiliate độc lập khác) đối chiếu đường GMV ròng toàn shop (gồm cả Video & kệ hàng).',
          'Stacked Live GMV across Official in-house, Satellite @koc_sat01, and 301 other Affiliates against net store-wide GMV.'
        )}
        badge={
          <GranularityToggle
            value={grain}
            onChange={setGrain}
            options={[
              { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
              { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              { id: 'month', label: L('Theo tháng (8T)', 'Monthly (8m)') },
            ]}
          />
        }
        height="h-64 sm:h-72"
        footer={L(
          'Ghi chú đối soát dữ liệu: (1) Ở tuần bình thường (như W11), đường GMV ròng toàn shop cao hơn miền Live vì shop có thêm doanh thu từ Video gắn giỏ hàng và kệ hàng tự nhiên. (2) Ở đợt cao điểm tháng 6 (W12 - W15), miền Live vượt đường ròng do FastMoss ghi nhận GMV ca Live theo tổng đơn đặt trước hủy/hoàn COD tại thời điểm phát sóng, trong khi số toàn shop là GMV ròng đã trừ đơn hủy và hoàn tiền.',
          'Data reconciliation note: (1) In standard weeks (e.g., W11), store-wide net GMV exceeds the Live area because it includes Shoppable Videos and organic storefront sales. (2) During June mega-sales (W12 - W15), Live GMV exceeds net store GMV because FastMoss logs gross session orders prior to cancellations/COD returns, whereas the store overview reports post-cancellation net increments.'
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 14, right: 16, left: 4, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="xKey"
              tick={axisTick}
              interval={grain === 'day' ? 24 : grain === 'week' ? 2 : 0}
            />
            <YAxis
              width={58}
              tick={axisTick}
              tickFormatter={(v: number) => `${v}Tr`}
            />
            <Tooltip
              content={
                <ChartTooltip
                  head={(lbl, pl) => {
                    const row = pl?.[0]?.payload;
                    if (grain === 'day') return L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`);
                    if (grain === 'month') return L(`Tháng ${lbl} (${row?.days ?? ''} ngày)`, `Month ${lbl}`);
                    return L(`Tuần ${row?.week ?? ''} (từ ${lbl}/2026)`, `Week ${row?.week ?? ''} (from ${lbl}/2026)`);
                  }}
                  fmt={(v) => `${v.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr đ`}
                  extraRow={(pl) => {
                    const r = pl?.[0]?.payload;
                    if (!r) return null;
                    const liveSum = Number(r.ownLive || 0) + Number(r.top1Live || 0) + Number(r.extLive || 0);
                    return L(
                      `Gộp 3 kênh Live (đơn đặt): ${liveSum.toFixed(1)} Tr đ · GMV ròng toàn shop: ${Number(r.storeTotal || 0).toFixed(1)} Tr đ`,
                      `3-tier Live gross: ${liveSum.toFixed(1)}M · Store-wide net GMV: ${Number(r.storeTotal || 0).toFixed(1)}M`
                    );
                  }}
                />
              }
            />
            <Legend formatter={legendFormatter} />
            <Area
              type="monotone"
              dataKey="ownLive"
              stackId="liveArea"
              name={L('Tự vận hành chính chủ', 'Official in-house')}
              stroke="#0D7287"
              fill="#0D7287"
              fillOpacity={0.75}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="top1Live"
              stackId="liveArea"
              name={L('Kênh vệ tinh nội bộ (@koc_sat01)', 'In-house satellite (@koc_sat01)')}
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.75}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="extLive"
              stackId="liveArea"
              name={L('Affiliate độc lập khác (301 KOC)', 'Other Affiliates (301 KOCs)')}
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.65}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="storeTotal"
              name={L('Tổng GMV ròng toàn shop', 'Store-wide net GMV')}
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={grain !== 'day' ? { r: 2.5, fill: '#10B981' } : false}
              isAnimationActive={false}
            />
            {grain === 'week' && (
              <>
                <ReferenceLine x="15/06" stroke="#E11D48" strokeDasharray="3 3" label={{ value: '16/06 Đột biến', position: 'insideTopLeft', fill: '#E11D48', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine x="22/06" stroke="#B45309" strokeDasharray="3 3" label={{ value: '26/06 Dead Cross', position: 'insideTopRight', fill: '#B45309', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine x="31/08" stroke="#64748B" strokeDasharray="3 3" label={{ value: 'Đáy T8', position: 'insideTopLeft', fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine x="12/10" stroke="#0D7287" strokeDasharray="3 3" label={{ value: 'Hồi phục T10', position: 'insideTopLeft', fill: '#0D7287', fontSize: 11, fontWeight: 700 }} />
              </>
            )}
            {grain === 'day' && (
              <>
                <ReferenceLine x="16/06" stroke="#E11D48" strokeDasharray="3 3" label={{ value: '16/06 (315Tr)', position: 'insideTopLeft', fill: '#E11D48', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine x="26/06" stroke="#B45309" strokeDasharray="3 3" label={{ value: '26/06 Cross', position: 'insideTopRight', fill: '#B45309', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine x="31/08" stroke="#64748B" strokeDasharray="3 3" label={{ value: 'Đáy T8', position: 'insideTopLeft', fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine x="12/10" stroke="#0D7287" strokeDasharray="3 3" label={{ value: 'Hồi phục T10', position: 'insideTopLeft', fill: '#0D7287', fontSize: 11, fontWeight: 700 }} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/20 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-950/60 space-y-2">
          <h3 className="text-sm font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Ba phát hiện chính', 'Three core findings')}
          </h3>
          {findings.map((f) => (
            <div key={f.title} className="text-xs sm:text-sm leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white">{f.title}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#FFD14C]/70 bg-[#FFE485]/20 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-[#FFD14C]/5 space-y-2">
          <h3 className="text-sm font-extrabold text-amber-950 dark:text-[#FFE485]">
            {L('Ba khuyến nghị trọng tâm', 'Three operational recommendations')}
          </h3>
          {actions.map((a) => (
            <div key={a.title} className="text-xs sm:text-sm leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white">{a.title}</p>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{a.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs sm:text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 leading-relaxed">
        <strong className="font-bold text-slate-900 dark:text-white mr-1.5">
          {L('Chưa kết luận được:', 'Cannot yet conclude:')}
        </strong>
        {L(
          'ROI quảng cáo ròng (video bật Ads có tỷ lệ ra đơn 30,3% so với 10,2% không Ads nhưng không có chi phí thầu), tác động mùa vụ đa năm (mới quan sát 1 chu kỳ Hè sang Thu) và hàng tồn chết thực sự (không có giá vốn COGS hay số dư kho nội bộ).',
          'Net ad ROI (Ads-tagged clips convert at 30.3% vs. 10.2% non-Ads, but ad spend is unobserved), multi-year seasonality (only 1 seasonal cycle observed), and true dead inventory (missing internal COGS and stock).'
        )}
      </div>
    </section>
  );
}
