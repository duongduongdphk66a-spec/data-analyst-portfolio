'use client';

import React from 'react';
import {
  ComposedChart,
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
  const k = V2.ch0.kpis;
  const cm = V2.ch2.channelMix;
  const sp = V2.ch2.skuPareto;
  const sv = V2.ch4.survival;
  const sat = V2.ch4.satelliteSummary;

  const mJun = V2.ch3.monthly[3];
  const mJul = V2.ch3.monthly[4];
  const mAug = V2.ch3.monthly[5];
  const mOct = V2.ch3.monthly[7];
  const lz = V2.ch2.lorenz.allActive;
  const le = V2.ch5.liveEfficiency;

  const findings = [
    L(
      `Doanh thu tập trung vào vài điểm: Tài khoản vệ tinh nội bộ @koc_sat01 tạo ${n(sat.gmvB, 2)} tỷ đ qua ${sat.sessions} phiên, bằng ${n(sat.shareOfExtLivePct, 1)}% GMV Live ngoài shop. Trong bảng KOL 90 ngày, Top 1 tài khoản chiếm ${n(lz.top1SharePct, 1)}% và Top 10 chiếm ${n(lz.top10SharePct, 1)}% doanh số đóng góp.`,
      `Revenue concentrates in a few nodes: In-house satellite @koc_sat01 generated ${n(sat.gmvB, 2)}B VND across ${sat.sessions} sessions (${n(sat.shareOfExtLivePct, 1)}% of external Live GMV). In the 90-day KOL table, Top 1 holds ${n(lz.top1SharePct, 1)}% and Top 10 hold ${n(lz.top10SharePct, 1)}% of contributed sales.`
    ),
    L(
      `Sụt giảm có hai pha và hồi phục nhờ hiệu suất ca: Tháng 7 giảm chủ yếu do số ca live (${n(mJun.storeLives)} xuống ${n(mJul.storeLives)}); tháng 8 giảm chủ yếu do GMV mỗi ca (${n(mJul.storeGmvPerLiveM, 2)} xuống ${n(mAug.storeGmvPerLiveM, 2)} Tr đ). Sang tháng 10, GMV mỗi ca quay về ${n(mOct.storeGmvPerLiveM, 2)} Tr đ và doanh thu tháng hồi lên ${n(mOct.storeGmvB, 2)} tỷ đ trong ${mOct.days} ngày.`,
      `Two-phase contraction and yield-led recovery: July fell mainly in Live count (${n(mJun.storeLives)} to ${n(mJul.storeLives)}); August fell in GMV/session (${n(mJul.storeGmvPerLiveM, 2)}M to ${n(mAug.storeGmvPerLiveM, 2)}M VND). In October, GMV/session returned to ${n(mOct.storeGmvPerLiveM, 2)}M VND, lifting monthly GMV to ${n(mOct.storeGmvB, 2)}B in ${mOct.days} days.`
    ),
    L(
      `Hiệu quả nằm ở Live của chính shop, mạng creator ngoài mỏng: Mỗi người xem Live của @shop_official tạo ${n(le.crLiveVndPerUv)} đ GMV (${n(le.officialVndPerView)} đ/lượt xem trên AffLive), gấp khoảng 30 lần creator ngoài (${n(le.extVndPerView)} đ/lượt xem) dù creator ngoài chiếm ${n(le.extViewSharePct, 1)}% lượt xem. Chỉ ${sv.everOrderCount}/${sv.totalKocs} creator ngoài (${n(sv.everOrderPct, 1)}%) từng có đơn.`,
      `Efficiency sits in official Live while the external network is thin: Official Live yields ${n(le.crLiveVndPerUv)} VND/viewer (${n(le.officialVndPerView)} VND/view on AffLive), roughly 30x higher than external creators (${n(le.extVndPerView)} VND/view) despite affiliates holding ${n(le.extViewSharePct, 1)}% of views. Only ${sv.everOrderCount}/${sv.totalKocs} external creators (${n(sv.everOrderPct, 1)}%) ever converted.`
    ),
  ];

  const recommendations = [
    L(
      `Lập kế hoạch tồn kho và lịch live trước chuyển mùa 1-2 tháng, đồng thời rà soát ${sp.zeroSaleSkus} mã 0 đơn. Vì chưa có dữ liệu giá vốn và tồn kho, bước này đóng vai trò sàng lọc danh mục để đối chiếu kho thực tế.`,
      `Plan seasonal stock and Live schedules 1-2 months ahead of rotation and screen ${sp.zeroSaleSkus} zero-sale listings. Without COGS or ERP inventory, this serves as a catalog screening step prior to physical stock verification.`
    ),
    L(
      'Dồn ngân sách và nhân lực vào Live của chính shop ở khung 12h-18h; dùng Ads có chọn lọc cho video đã có đà tự nhiên vì cờ Ads tăng tỷ lệ ra đơn nhưng toàn kỳ đạt GMV/1.000 lượt xem thấp hơn Organic (Chương 5).',
      'Concentrate budget and staffing on official Live in the 12:00-18:00 slot; deploy video Ads selectively on organically proven clips since Ads raises order conversion rate without lifting overall GMV per 1,000 views (Chapter 5).'
    ),
    L(
      'Thiết kế thử nghiệm hỗ trợ creator mới trong 3 ca đầu (voucher, hàng mẫu) kèm nhóm đối chứng để đo tỷ lệ hoạt động sau 1 tháng và tỷ lệ có đơn sau 3 ca trước khi chuẩn hóa thành quy định.',
      'Run a controlled experiment supporting new creators across their first 3 streams (vouchers, seeding) against a control group, tracking Month-1 retention and 3-session conversion before adopting a fixed rule.'
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
      'Các bảng gốc dùng khung thời gian khác nhau (231 ngày, 179 ngày, cửa sổ trượt 90 ngày và snapshot 2 kỳ); chân mỗi biểu đồ ghi rõ phạm vi đang dùng.',
      'Source tables span distinct windows (231d, 179d, rolling 90d, and dual snapshots); every chart footer states its active window.'
    ),
  ];

  return (
    <ChapterShell
      id="sec-exec-summary"
      chapterNum={L('Chương 0', 'Chapter 0')}
      title={L('Tóm tắt điều hành', 'Executive summary')}
      scopeLabel={L(`Store · ${V2.meta.days} ngày`, `Store · ${V2.meta.days}d`)}
      question={L('Người đọc nên nhớ gì sau 60 giây?', 'What should a reader retain after 60 seconds?')}
      conclusion={L(
        `Doanh thu tập trung vào Live của chính shop (${n(cm.officialShareOfLivePct, 1)}% GMV Live) và ${sp.skusFor80Pct} mã mùa vụ; biên độ sụt giảm từ tháng 6 sang tháng 8 lên tới ${n(Math.abs(k.junToAugDropPct), 1)}% theo hai pha; cảnh báo MA7/MA28 hiện tại chưa đáng tin và mạng creator ngoài mỏng.`,
        `Revenue concentrates in official Live (${n(cm.officialShareOfLivePct, 1)}% of Live GMV) and ${sp.skusFor80Pct} seasonal SKUs; June-to-August contraction hits ${n(Math.abs(k.junToAugDropPct), 1)}% in two phases; current MA7/MA28 alerts are unreliable and external creator depth is thin.`
      )}
    >
      <ChartCard
        title={L(
          `0.1. GMV đạt đỉnh ${n(k.peakDayGmvM, 1)} Tr ngày 16/06 (7 ngày quanh đỉnh chiếm ${n(k.peak7dSharePct, 1)}% cả kỳ), giảm ${n(Math.abs(k.junToAugDropPct), 1)}% về đáy T8 và cắt xuống MA28 ngày ${k.latestMaCrossDate}`,
          `0.1. Daily GMV peaked at ${n(k.peakDayGmvM, 1)}M on 16/06 (7-day peak window = ${n(k.peak7dSharePct, 1)}% of total), fell ${n(Math.abs(k.junToAugDropPct), 1)}% into Aug, and crossed below MA28 on ${k.latestMaCrossDate}`
        )}
        badge={<ChartRoleBadge kind="main" />}
        height="h-60 sm:h-64"
        footer={L(
          `Nguồn: Store_Daily_Overview [Ngày Ghi Nhận, Doanh Thu Trong Ngày (VNĐ)] · Khung thời gian: 09/03 - 25/10/2026 · n = ${V2.meta.days} ngày.`,
          `Source: Store_Daily_Overview [Date, Daily GMV (VND)] · Window: 09/03 - 25/10/2026 · n = ${V2.meta.days} days.`
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={V2.ch0.dailySeries} margin={{ top: 18, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="ddmm" tick={axisTick} interval={25} />
            <YAxis
              width={52}
              domain={[0, 340]}
              tick={axisTick}
              tickFormatter={(v: number) => `${v}Tr`}
            />
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
              name={L('GMV theo ngày', 'Daily GMV')}
              stroke={KAMI_BRAND_PALETTE.slateMuted}
              strokeWidth={1.35}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ma7M"
              name={L('Trung bình trượt 7 ngày (MA7)', '7-day moving average (MA7)')}
              stroke={KAMI_BRAND_PALETTE.tealInk}
              strokeWidth={2.4}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              x="16/06"
              stroke={KAMI_BRAND_PALETTE.tealInk}
              strokeDasharray="3 3"
              label={{
                value: L(`Đỉnh 16/06: ${n(k.peakDayGmvM, 1)} Tr`, `Peak 16/06: ${n(k.peakDayGmvM, 1)}M`),
                position: 'insideTopRight',
                fill: KAMI_BRAND_PALETTE.deepInk,
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            <ReferenceLine
              x="03/08"
              stroke={KAMI_BRAND_PALETTE.negative}
              strokeDasharray="3 3"
              label={{
                value: L(`Đáy T8 (${n(k.junToAugDropPct, 1)}%)`, `Aug trough (${n(k.junToAugDropPct, 1)}%)`),
                position: 'insideTopLeft',
                fill: KAMI_BRAND_PALETTE.negative,
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            <ReferenceLine
              x={k.latestMaCrossDate}
              stroke={KAMI_BRAND_PALETTE.amberStroke}
              strokeDasharray="3 3"
              label={{
                value: L(`MA7 < MA28 (${k.latestMaCrossDate})`, `MA7 < MA28 (${k.latestMaCrossDate})`),
                position: 'insideTopRight',
                fill: KAMI_BRAND_PALETTE.amberStroke,
                fontSize: 11,
                fontWeight: 700,
              }}
            />
          </ComposedChart>
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
