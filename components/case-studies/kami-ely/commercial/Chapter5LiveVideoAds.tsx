'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { V2 } from './kamiOutlineV2Metrics';

interface Props {
  lang: 'vi' | 'en';
}

export function Chapter5LiveVideoAds({ lang }: Props) {
  const isVi = lang === 'vi';
  const [showTechAppendix, setShowTechAppendix] = useState(false);

  const dur5 = V2.ch5.durationBuckets5;
  const vAds = V2.ch5.videoAdsComparison;
  const slices = V2.ch5.videoForestSlices;
  const hm = V2.ch5.crLiveHeatmap;
  const pin = V2.ch5.pinnedAnalysis;

  const videoComparisonBars = [
    {
      group: isVi ? 'Có ủy quyền Ads (3.775 clip)' : 'Ad-Authorized (3,775 clips)',
      shortGroup: isVi ? 'Có ủy quyền Ads' : 'Ad-Authorized',
      clips: vAds.adsClips,
      convPct: vAds.adsConvPct,
      meanGmvK: vAds.adsMeanGmvK,
      totalGmvB: vAds.adsTotalGmvB,
      fill: '#0D7287',
    },
    {
      group: isVi ? 'Không ủy quyền (1.021 clip)' : 'Non-Authorized (1,021 clips)',
      shortGroup: isVi ? 'Không ủy quyền' : 'Non-Authorized',
      clips: vAds.orgClips,
      convPct: vAds.orgConvPct,
      meanGmvK: vAds.orgMeanGmvK,
      totalGmvB: vAds.orgTotalGmvB,
      fill: '#94A3B8',
    },
  ];

  return (
    <section id="sec-content" className="scroll-mt-28 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isVi
            ? 'Hiệu suất Livestream & Đòn bẩy Video Ads'
            : 'Livestream Duration & Video Ad Leverage'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {isVi
            ? 'So sánh 600 phiên Live chính chủ theo thời lượng và 4.796 video gắn giỏ sau chuẩn hóa nhãn Ads (YES/có).'
            : 'Evaluates 600 official livestream sessions by duration and 4,796 deduplicated shoppable videos by Ad authorization.'}
        </p>
      </div>

      {/* Biểu đồ 4: 2 Biểu đồ ghép ngang (Trái: Thời lượng phiên Live vs GMV/giờ | Phải: Ủy quyền quảng cáo Video vs Không ủy quyền) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bên trái: Thời lượng phiên Live vs Hiệu suất GMV/giờ (600 phiên Creator_Livestreams) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                {isVi ? 'Biểu đồ 5A · Creator_Livestreams (600 phiên)' : 'Chart 5A · Creator_Livestreams (600 sessions)'}
              </span>
              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-[#FFE485] tabular-nums">
                {isVi ? 'Kiểm tra Simpson: T6 8,48 vs T8 0,73 Tr/h' : 'Simpson Check: Jun 8.48 vs Aug 0.73M/hr'}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isVi
                ? 'Live >10h đạt 8,48 Tr/h ở T6 nhưng tụt về 0,73 Tr/h ở T8 — mùa vụ quyết định hiệu suất hơn thời lượng'
                : '>10h Live Hit 8.48M/hr in Jun but Fell to 0.73M/hr in Aug — Seasonality Beats Duration'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {isVi
                ? 'Cột = Tổng GMV nhóm (Tỷ VNĐ) · Đường = GMV bình quân mỗi giờ live (Triệu VNĐ/giờ)'
                : 'Bars = Total Bucket GMV (B VND) · Line = Average GMV per Live Hour (M VND/hour)'}
            </p>

            <div className="h-[260px] w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dur5} margin={{ top: 12, right: 16, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}B`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 4.6]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#d97706' }}
                    tickFormatter={(v) => `${v}M/h`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 5.2]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 text-xs tabular-nums space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {isVi ? d.labelVi : d.labelEn} ({d.sessions} {isVi ? 'phiên' : 'sessions'})
                          </p>
                          <p>
                            {isVi ? 'Hiệu suất bình quân/giờ (Đường): ' : 'Mean GMV/hour (Line): '}
                            <strong className="text-amber-600 dark:text-amber-400">
                              {d.gmvPerHourM.toFixed(2).replace('.', ',')} {isVi ? 'triệu/giờ' : 'M/hour'}
                            </strong>
                          </p>
                          <p>
                            {isVi ? 'Tổng GMV đóng góp (Cột): ' : 'Total GMV (Bar): '}
                            <strong className="text-slate-900 dark:text-white">
                              {d.totalGmvB.toFixed(2).replace('.', ',')} {isVi ? 'tỷ VNĐ' : 'B VND'} ({d.gmvSharePct}%)
                            </strong>
                          </p>
                          <p>
                            {isVi ? 'Tổng số giờ live: ' : 'Total live hours: '}
                            <strong>{d.totalHours}h</strong>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="totalGmvB"
                    name={isVi ? 'Tổng GMV (Tỷ VNĐ)' : 'Total GMV (B VND)'}
                    fill="#9BE7FA"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gmvPerHourM"
                    name={isVi ? 'GMV/giờ (Triệu/giờ)' : 'GMV/hour (M/hour)'}
                    stroke="#D97706"
                    strokeWidth={2.75}
                    dot={{ r: 4.5, fill: '#FFD14C', stroke: '#D97706', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="rounded-lg bg-amber-50/80 dark:bg-[#FFD14C]/10 border border-amber-200/80 dark:border-amber-800/40 px-3 py-2 text-[11px] text-slate-700 dark:text-slate-300 tabular-nums leading-relaxed">
              <strong className="text-amber-900 dark:text-[#FFE485]">
                {isVi ? 'Phân tầng nhóm >10h theo tháng (tránh Simpson’s Paradox): ' : 'Monthly >10h Stratification (Simpson’s Paradox Check): '}
              </strong>
              {isVi
                ? 'T4: 3,36 Tr/h (4 ca) · T5: 4,54 Tr/h (12 ca) · T6: 8,48 Tr/h (23 ca · 68,7% GMV nhóm >10h) · T7: 1,43 Tr/h (16 ca) · T8: 0,73 Tr/h (12 ca, thấp hơn ca <2h) · T9–10: 0 ca.'
                : 'Apr: 3.36M/h (4) · May: 4.54M/h (12) · Jun: 8.48M/h (23 · 68.7% of >10h GMV) · Jul: 1.43M/h (16) · Aug: 0.73M/h (12, below <2h mean) · Sep–Oct: 0.'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 tabular-nums leading-relaxed">
              <strong className="text-slate-900 dark:text-white">
                {isVi ? 'Kết luận: ' : 'Takeaway: '}
              </strong>
              {isVi
                ? 'Mức gộp 4,55 Tr/giờ của 67 ca >10h bị kéo mạnh bởi đỉnh T6; trong mùa thấp điểm T7–T8, kéo dài phiên không tự tạo doanh số nên mọi ca ≥8h cần gắn ngưỡng cắt lỗ theo giờ.'
                : 'The 4.55M/hr aggregate across 67 >10h shifts is skewed by peak June; in Jul–Aug troughs, longer shifts alone underperform, so ≥8h tests require hourly stop-loss rules.'}
            </p>
          </div>
        </div>

        {/* Bên phải: Tác động của Ủy quyền quảng cáo Video (4.796 clip Affiliate_Videos) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 px-2.5 py-0.5 text-xs font-semibold text-slate-900 dark:text-[#FFE485]">
                {isVi ? 'Biểu đồ 5B · Affiliate_Videos (4.796 clip sau khử trùng)' : 'Chart 5B · Affiliate_Videos (4,796 deduped clips)'}
              </span>
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {isVi ? 'Doanh thu/clip gấp 4,4 lần khi bật Ads' : '4.4x higher revenue/clip with Ads'}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isVi
                ? 'Video Ads có GPM thấp hơn Organic (0,84× toàn mẫu; 0,73× trong cùng 192 KOC) — chỉ nên đẩy clip đã có đơn'
                : 'Video Ads Trailed Organic on GPM (0.84x Overall; 0.73x Within 192 KOCs) — Boost Proven Clips Only'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {isVi
                ? 'So sánh trực tiếp Doanh thu bình quân mỗi clip (Nghìn VNĐ/clip) và Tỷ lệ clip phát sinh đơn (%)'
                : 'Direct comparison of Mean Revenue per Clip (k VND/clip) and Clip Conversion Rate (%)'}
            </p>

            <div className="h-[260px] w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={videoComparisonBars} margin={{ top: 12, right: 16, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis
                    dataKey="shortGroup"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}k`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 620]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: '#059669' }}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 40]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 text-xs tabular-nums space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">{d.group}</p>
                          <p>
                            {isVi ? 'Doanh thu bình quân/clip (Cột): ' : 'Mean revenue/clip (Bar): '}
                            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">
                              {d.meanGmvK.toFixed(1).replace('.', ',')}k VNĐ/clip
                            </strong>
                          </p>
                          <p>
                            {isVi ? 'Tỷ lệ clip có đơn (Đường): ' : 'Clip conversion rate (Line): '}
                            <strong className="text-emerald-600 dark:text-emerald-400">
                              {d.convPct.toFixed(1).replace('.', ',')}%
                            </strong>
                          </p>
                          <p>
                            {isVi ? 'Tổng doanh thu đóng góp: ' : 'Total GMV contribution: '}
                            <strong>
                              {d.totalGmvB.toFixed(2).replace('.', ',')} {isVi ? 'tỷ VNĐ' : 'B VND'}
                            </strong>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="meanGmvK"
                    name={isVi ? 'Doanh thu TB/clip (Nghìn VNĐ)' : 'Mean GMV/clip (k VND)'}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={64}
                  >
                    {videoComparisonBars.map((entry, idx) => (
                      <Cell key={`vbar-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="convPct"
                    name={isVi ? 'Tỷ lệ có đơn (%)' : 'Conversion Rate (%)'}
                    stroke="#059669"
                    strokeWidth={2.75}
                    dot={{ r: 5, fill: '#10B981', stroke: '#059669', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 tabular-nums leading-relaxed">
            <strong className="text-slate-900 dark:text-white">
              {isVi ? 'Kết luận: ' : 'Takeaway: '}
            </strong>
            {isVi
              ? '3.775 clip bật Ads đạt 547,7k/clip và 30,3% có đơn (4,4× nhóm không Ads), lưu ý một phần do shop ưu tiên đẩy Ads cho clip đã bán tốt.'
              : '3,775 Ad clips hit 547.7k/clip and 30.3% conversion (4.4x non-Ads), partly reflecting selection of winning clips for boosting.'}
          </p>
        </div>
      </div>

      {/* Collapsible Technical Accordion for Forest Plot, Heatmap & Pinned Shelf (-55% height reduction) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowTechAppendix((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>
            {showTechAppendix
              ? isVi
                ? 'Thu gọn kiểm định độ nhạy 6 lát cắt Video Ads, Heatmap khung giờ Live & Kệ ghim'
                : 'Collapse 6-slice Video Ads sensitivity, Live hour heatmap & pinned shelf analysis'
              : isVi
              ? 'Xem kiểm định thống kê chuyên sâu (so sánh Ads vs Organic trong cùng KOC): Forest Plot 6 lát cắt, Heatmap 16 ô khung giờ Live & Top SKU ghim kệ'
              : 'View technical statistical tests (within-KOC Ads vs. Organic): 6-Slice Forest Plot, 16-Cell Live Heatmap & Top Pinned Live SKUs'}
          </span>
          {showTechAppendix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechAppendix && (
          <div className="space-y-5 pt-4">
            {/* 6-Slice Forest Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? 'Kiểm định độ nhạy 6 lát cắt Video Ads (Toàn mẫu OR = 3,8x, +20,1 điểm %; Cùng 192 KOC OR = 3,9x, +23,6 điểm %)'
                  : '6-Slice Video Ads Sensitivity Audit (Full sample OR = 3.8x, +20.1pp; Within 192 KOCs OR = 3.9x, +23.6pp)'}
              </p>
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 pr-3 font-semibold">{isVi ? 'Lát cắt kiểm định' : 'Subgroup Slice'}</th>
                    <th className="py-2 px-2 font-semibold text-right">n (Ads / Org)</th>
                    <th className="py-2 px-2 font-semibold text-right">Conv% Ads</th>
                    <th className="py-2 px-2 font-semibold text-right">Conv% Org</th>
                    <th className="py-2 px-2 font-semibold text-right">Δ (95% CI)</th>
                    <th className="py-2 pl-2 font-semibold text-right">OR</th>
                  </tr>
                </thead>
                <tbody>
                  {slices.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-2 pr-3 font-semibold text-slate-800 dark:text-slate-200">
                        {isVi ? s.labelVi : s.labelEn}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-500">
                        {s.adsN} / {s.orgN}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                        {s.adsConvPct}%
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600 dark:text-slate-400">
                        {s.orgConvPct}%
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                        +{s.diffPp}pp [{s.ciLowPp}, {s.ciHighPp}]
                      </td>
                      <td className="py-2 pl-2 text-right font-bold text-slate-900 dark:text-white">
                        {s.oddsRatio}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 16-Cell Heatmap & Top Pinned SKUs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                  {isVi
                    ? 'Ma trận Khung giờ bắt đầu × Thời lượng phiên Live (599 phiên CrLive >= 09/03, UTC+7)'
                    : 'Start Hour × Session Duration Matrix (599 CrLive sessions >= Mar 09, UTC+7)'}
                </p>
                <table className="w-full text-center border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-1.5 pr-2 text-left font-semibold">{isVi ? 'Khung giờ' : 'Hour Slot'}</th>
                      <th className="py-1.5 px-2 font-semibold">&lt;2h</th>
                      <th className="py-1.5 px-2 font-semibold">2-4h</th>
                      <th className="py-1.5 px-2 font-semibold">4-8h</th>
                      <th className="py-1.5 px-2 font-semibold">&gt;8h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hm.map((row) => (
                      <tr key={row.hourSlot} className="border-b border-slate-100 dark:border-slate-800/60">
                        <td className="py-1.5 pr-2 text-left font-bold text-slate-900 dark:text-white">
                          {row.hourSlot}
                        </td>
                        {row.cells.map((c) => (
                          <td key={c.durBucket} className="py-1.5 px-2">
                            <span className="font-bold text-slate-900 dark:text-white">{c.gmvPerUv}đ/UV</span>
                            <span className="block text-[11px] text-slate-500">n={c.sessions}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  {isVi
                    ? `Top 8 SKU ghim Live (Spearman ρ = +${String(pin.spearmanRho).replace('.', ',')}, mẫu xuất ${String(pin.liveProdTotalGmvB).replace('.', ',')} tỷ VNĐ)`
                    : `Top 8 Pinned Live SKUs (Spearman ρ = +${pin.spearmanRho}, export sample ${pin.liveProdTotalGmvB}B VND)`}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-[#FFE485] mb-2 leading-relaxed">
                  {isVi
                    ? 'Lưu ý chất lượng nguồn LiveProd: bảng chỉ phủ 0,45 tỷ (4,3% GMV Live), lặp tổng shopUnits = 312.689 ở mọi dòng và thiếu các mã chủ lực (AT06, H36) nên chỉ dùng minh họa mẫu.'
                    : 'LiveProd data caveat: covers only 0.45B (4.3% of Live GMV), repeats store total shopUnits = 312,689 on every row, and omits hero SKUs (AT06, H36); illustrative sample only.'}
                </p>
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-1.5 pr-2 font-semibold">SKU</th>
                      <th className="py-1.5 px-2 font-semibold text-right">{isVi ? 'Sản lượng Live' : 'Live Units'}</th>
                      <th className="py-1.5 px-2 font-semibold text-right">{isVi ? 'GMV Live' : 'Live GMV'}</th>
                      <th className="py-1.5 pl-2 font-semibold text-right">% GMV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pin.topLiveProds.map((p) => (
                      <tr key={p.code} className="border-b border-slate-100 dark:border-slate-800/60">
                        <td className="py-1.5 pr-2 font-bold text-slate-900 dark:text-white">{p.code}</td>
                        <td className="py-1.5 px-2 text-right">{p.liveUnits.toLocaleString(isVi ? 'vi-VN' : 'en-US')}</td>
                        <td className="py-1.5 px-2 text-right font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                          {p.liveGmvM}M
                        </td>
                        <td className="py-1.5 pl-2 text-right font-bold">{p.liveGmvSharePct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
