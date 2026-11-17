'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  ComposedChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  usePlaybookLang,
  useChartGranularity,
  GranularityToggle,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  ChapterShell,
  axisTick,
  legendFormatter,
  GRID_STROKE,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Tier1ExecutiveSummary() {
  const { L, n } = usePlaybookLang();
  const [granularity, setGranularity] = useChartGranularity<'month' | 'week' | 'day'>('month', [
    'month',
    'week',
    'day',
  ]);

  const monthlyChartData = V2.ch3.monthly.map((m) => {
    let phaseNameVi = 'Tăng trưởng';
    let phaseNameEn = 'Ramp';
    let fill: string = KAMI_BRAND_PALETTE.tealInk;
    if (m.shortLabel === 'T6') {
      phaseNameVi = 'Đỉnh hè';
      phaseNameEn = 'Peak';
      fill = '#059669'; // Emerald
    } else if (m.shortLabel === 'T7' || m.shortLabel === 'T8') {
      phaseNameVi = 'Suy giảm';
      phaseNameEn = 'Contraction';
      fill = '#E11D48'; // Rose
    } else if (m.shortLabel === 'T9' || m.shortLabel === 'T10') {
      phaseNameVi = 'Thu Đông';
      phaseNameEn = 'Autumn Rebound';
      fill = '#D97706'; // Amber
    }

    return {
      monthLabel: m.isPartial ? `${m.shortLabel}*` : m.shortLabel,
      rawLabel: m.shortLabel,
      storeGmvB: m.storeGmvB,
      storeGmvFormatted: `${n(m.storeGmvB, 2)} tỷ`,
      days: m.days,
      isPartial: m.isPartial,
      phaseNameVi,
      phaseNameEn,
      fill,
    };
  });

  const weeklyChartData = (V2.ch3.weekly || []).map((w) => {
    let phaseNameVi = 'Tăng trưởng';
    let phaseNameEn = 'Ramp';
    let fill: string = KAMI_BRAND_PALETTE.tealInk;
    if (w.phase === 'peak') {
      phaseNameVi = 'Đỉnh hè';
      phaseNameEn = 'Peak';
      fill = '#059669';
    } else if (w.phase === 'contraction') {
      phaseNameVi = 'Suy giảm';
      phaseNameEn = 'Contraction';
      fill = '#E11D48';
    } else if (w.phase === 'autumn') {
      phaseNameVi = 'Thu Đông';
      phaseNameEn = 'Autumn Rebound';
      fill = '#D97706';
    }
    return {
      ...w,
      phaseNameVi,
      phaseNameEn,
      fill,
    };
  });

  const findings = [
    L(
      'Doanh thu tập trung: Phiên của chính shop chiếm 72,5% GMV Live, một kênh vệ tinh nội bộ 12,0% và 301 đối tác độc lập 15,5%. 12/133 mã tạo 80,6% GMV; riêng AT06 chiếm 46,9% vì cửa sổ 90 ngày vắt qua chuyển mùa.',
      'Concentrated revenue: Official streams drove 72.5% of Live GMV, one internal satellite channel 12.0%, and 301 independent partners 15.5%. 12/133 SKUs generated 80.6% of GMV; AT06 alone took 46.9% due to the 90-day window spanning season shifts.'
    ),
    L(
      'Biên độ mùa vụ lớn: GMV đi từ 0,95 tỷ (T3) lên 3,77 tỷ (T6), xuống 0,64 tỷ (T8) rồi hồi lên 1,62 tỷ chỉ trong 25 ngày T10. Việc giảm do số ca hay do năng suất mỗi ca phụ thuộc thước đo.',
      'Wide seasonal amplitude: Monthly GMV swung from 0.95B (Mar) to 3.77B (Jun), down to 0.64B (Aug), and rebounded to 1.62B in just 25 days of Oct. Whether the contraction was driven by session volume or session yield depends on the metric used.'
    ),
    L(
      'Hiệu quả nằm ở Live của chính shop và kênh vệ tinh (2.163 và 2.021 đ mỗi lượt xem); 301 đối tác độc lập chỉ đạt 40,8 đ và 22,7% phiên ra đơn. Chỉ 129/302 creator ngoài từng có đơn.',
      'Efficiency concentrated in official and satellite Live (2,163 and 2,021 VND per view); 301 independent partners achieved only 40.8 VND with a 22.7% session conversion rate. Only 129 of 302 external creators ever converted.'
    ),
  ];

  const recommendations = [
    L(
      'Lập kế hoạch tồn kho và lịch live trước chuyển mùa 1–2 tháng; đối chiếu kho thực với 206 mã không có đơn (204 mã niêm yết trước 2026). Đây là sàng lọc danh mục, chưa phải quyết định thanh lý.',
      'Plan inventory and Live schedules 1–2 months ahead of seasonal rotation; reconcile physical stock against the 206 zero-order SKUs (204 listed before 2026). This serves as catalog screening, not a liquidation decision.'
    ),
    L(
      'Ưu tiên nhân lực Live cho chính shop; dùng Ads có chọn lọc và đo cả tỷ lệ có đơn lẫn GMV trên 1.000 lượt xem; theo dõi GMV theo khung giờ trước khi chuyển ngân sách.',
      'Prioritize Live staffing for the official shop; deploy Ads selectively and track both order conversion rate and GMV per 1,000 views; monitor GMV by time slot before shifting budget.'
    ),
    L(
      'Theo dõi hằng tuần số ca live, creator mới, GMV mỗi ca; chưa đặt ngưỡng tự động. Thử nghiệm hỗ trợ 3 ca đầu theo hướng khám phá, vì cần khoảng 150 creator mỗi nhóm.',
      'Track weekly Live count, new creators, and GMV per session; refrain from hard automated alert thresholds. Design exploratory 3-session onboarding support, requiring ~150 creators per test cell.'
    ),
  ];

  const limitsSummary = [
    L(
      'Không có mã đơn, mã khách hàng và giá vốn nên dự án thay phễu giỏ hàng, A/B test và CLTV khách bằng cohort creator, phễu nội dung và so sánh quan sát.',
      'Without order_id, customer_id, or COGS, checkout funnels, A/B tests, and customer CLTV are replaced with creator cohorts, content funnels, and observational slices.'
    ),
    L(
      `Chuỗi quan sát mới gồm một mùa (${V2.meta.days} ngày) từ số liệu ước tính của bên thứ ba (FastMoss).`,
      `Observations span a single season (${V2.meta.days} days) of third-party FastMoss market estimates.`
    ),
    L(
      'Các bảng dữ liệu gốc dùng khung thời gian khác nhau (231 ngày toàn shop, 179 ngày SKU, cửa sổ trượt 90 ngày cho KOL/sản phẩm và snapshot 2 kỳ); chân mỗi biểu đồ ghi rõ phạm vi đang dùng.',
      'Source tables span distinct windows (231d store-wide, 179d SKU, rolling 90d for creators/products, and dual snapshots); every chart footer states its active window.'
    ),
  ];

  return (
    <ChapterShell
      id="sec-exec-summary"
      chapterNum={L('Chương 0', 'Chapter 0')}
      title={L('Tóm tắt điều hành', 'Executive summary')}
      scopeLabel={L(`Store · ${V2.meta.days} ngày`, `Store · ${V2.meta.days}d`)}
      question={L('Người đọc nên nhớ gì sau 60 giây?', 'What should a reader retain after 60 seconds?')}
    >
      <ChartCard
        title={L(
          '0.1. GMV tăng gấp bốn đến T6, rồi giảm 83,1% xuống T8',
          '0.1. Monthly GMV quadrupled to June, then fell 83.1% to August'
        )}
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <GranularityToggle
              value={granularity}
              onChange={setGranularity}
              options={[
                { id: 'month', label: L('Tháng (8T)', 'Month (8M)') },
                { id: 'week', label: L('Tuần (33W)', 'Week (33W)') },
                { id: 'day', label: L('Ngày (231N)', 'Day (231d)') },
              ]}
            />
            <ChartRoleBadge kind="main" />
          </div>
        }
        height="h-64 sm:h-72"
        footer={
          granularity === 'month'
            ? L(
                'Nguồn: Store_Daily_Overview · Khung 09/03 - 25/10/2026. *Tháng thiếu: T3 (23 ngày: 0,95 tỷ) và T10 (25 ngày: 1,62 tỷ đ) có vân gạch chéo.',
                'Source: Store_Daily_Overview · Range 09/03 - 25/10/2026. *Incomplete months: Mar (23d: 0.95B) and Oct (25d: 1.62B VND) shown with diagonal stripes.'
              )
            : granularity === 'week'
              ? L(
                  'Nguồn: Store_Daily_Overview gộp theo 33 tuần ISO (W11 - W43, 09/03 - 25/10/2026). Đỉnh tuần W25 (từ 15/06) đạt 1.057,2 Tr đ.',
                  'Source: Store_Daily_Overview aggregated across 33 ISO weeks (W11 - W43, Mar 09 - Oct 25, 2026). Peak week W25 (from Jun 15) reached 1,057.2M VND.'
                )
              : L(
                  'Nguồn: Store_Daily_Overview · Chuỗi 231 ngày liên tục (09/03 - 25/10/2026) kèm đường trung bình trượt MA7 và MA28. Đỉnh 16/06 đạt 315,0 Tr đ.',
                  'Source: Store_Daily_Overview · Continuous 231-day series (Mar 09 - Oct 25, 2026) with MA7 and MA28 trailing averages. Peak Jun 16 reached 315.0M VND.'
                )
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          {granularity === 'month' ? (
            <BarChart data={monthlyChartData} margin={{ top: 24, right: 16, left: 4, bottom: 8 }}>
              <defs>
                <pattern id="stripe-pattern-t3" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="4" height="8" fill={KAMI_BRAND_PALETTE.tealInk} />
                  <rect x="4" width="4" height="8" fill="#C8EEF7" />
                </pattern>
                <pattern id="stripe-pattern-t10" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="4" height="8" fill="#D97706" />
                  <rect x="4" width="4" height="8" fill="#FFE485" />
                </pattern>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="monthLabel" tick={axisTick} />
              <YAxis
                width={52}
                domain={[0, 4.5]}
                tick={axisTick}
                tickFormatter={(v: number) => `${v} tỷ`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    head={(lbl, p) => {
                      const row = p?.[0]?.payload;
                      return row ? `${L('Tháng', 'Month')} ${row.rawLabel} (${row.days} ${L('ngày', 'days')}) · ${L(row.phaseNameVi, row.phaseNameEn)}` : String(lbl);
                    }}
                    fmt={(v) => `${n(v, 2)} tỷ đ`}
                  />
                }
              />
              <Bar dataKey="storeGmvB" name={L('GMV tháng', 'Monthly GMV')} radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="storeGmvFormatted"
                  position="top"
                  style={{ fontSize: '11px', fontWeight: 700, fill: '#074553' }}
                />
                {monthlyChartData.map((entry, index) => {
                  let cellFill: string = entry.fill;
                  if (entry.rawLabel === 'T3') cellFill = 'url(#stripe-pattern-t3)';
                  if (entry.rawLabel === 'T10') cellFill = 'url(#stripe-pattern-t10)';
                  return <Cell key={`cell-${index}`} fill={cellFill} stroke={entry.fill} strokeWidth={1} />;
                })}
              </Bar>
            </BarChart>
          ) : granularity === 'week' ? (
            <BarChart data={weeklyChartData} margin={{ top: 16, right: 16, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="week" tick={axisTick} interval={2} />
              <YAxis
                width={56}
                domain={[0, 1150]}
                tick={axisTick}
                tickFormatter={(v: number) => `${v}Tr`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    head={(lbl, p) => {
                      const row = p?.[0]?.payload;
                      return row
                        ? `${L('Tuần', 'Week')} ${row.week} (${L('từ', 'from')} ${row.ddmm} · ${row.days}N) · ${L(row.phaseNameVi, row.phaseNameEn)}`
                        : String(lbl);
                    }}
                    fmt={(v) => `${n(v, 1)} Tr đ`}
                  />
                }
              />
              <Bar dataKey="storeGmvM" name={L('GMV tuần', 'Weekly GMV')} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {weeklyChartData.map((entry, idx) => (
                  <Cell key={`wk-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <ComposedChart data={V2.ch0.dailySeries} margin={{ top: 16, right: 16, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
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
                strokeWidth={2.2}
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
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#9BE7FA]/70 bg-[#C8EEF7]/25 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1.5">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Ba phát hiện cốt lõi', 'Three core findings')}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
            {findings.map((item, i) => (
              <li key={i} className="tabular-nums">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#FFD14C] bg-[#FFE485]/30 p-3.5 dark:border-slate-800 dark:bg-[#FFD14C]/10 space-y-1.5">
          <h3 className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-[#FFE485]">
            {L('Ba khuyến nghị hành động', 'Three prioritized actions')}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed list-disc pl-4">
            {recommendations.map((item, i) => (
              <li key={i} className="tabular-nums">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
          {L('Giới hạn phạm vi đọc số', 'Scope & data boundaries')}
        </h3>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-4 tabular-nums">
          {limitsSummary.map((lim, i) => (
            <li key={i}>{lim}</li>
          ))}
        </ul>
      </div>
    </ChapterShell>
  );
}
