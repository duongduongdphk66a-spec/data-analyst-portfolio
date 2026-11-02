'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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

export default function Chapter5LiveVideoAds() {
  const { L, n } = usePlaybookLang();
  const le = V2.ch5.liveEfficiency;
  const slices = V2.ch5.videoForestSlices;
  const heatmap = V2.ch5.crLiveHeatmap;
  const hashtags = V2.ch5.videoHashtagStats;
  const themes = V2.ch5.videoThemeStats;
  const pinned = V2.ch5.pinnedAnalysis;

  const liveYieldBars = [
    {
      channel: L('Chính chủ (@shop_official)', 'Official (@shop_official)'),
      vndPerView: le.officialVndPerView,
      fill: KAMI_BRAND_PALETTE.tealInk,
    },
    {
      channel: L('Affiliate ngoài (302 KOC)', 'External Affiliates (302 KOCs)'),
      vndPerView: le.extVndPerView,
      fill: KAMI_BRAND_PALETTE.amber,
    },
  ];

  const heatCellClass = (val: number, lowSample: boolean) => {
    if (lowSample) {
      return 'bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700';
    }
    if (val >= 2800) {
      return 'bg-[#0D7287] text-white font-extrabold';
    }
    if (val >= 1500) {
      return 'bg-[#9BE7FA] text-slate-950 font-bold';
    }
    if (val >= 1000) {
      return 'bg-[#C8EEF7] text-slate-900 font-semibold dark:bg-[#9BE7FA]/25 dark:text-white';
    }
    return 'bg-[#FFE485]/45 text-amber-950 dark:bg-[#FFD14C]/15 dark:text-[#FFE485]';
  };

  return (
    <ChapterShell
      id="sec-ch5-ads"
      chapterNum={L('Chương 5', 'Chapter 5')}
      title={L('Hiệu suất định dạng nội dung: Live, Video và kiểm định Ads so với Organic', 'Content format efficiency: Live, Video, and Ads vs Organic forest plot')}
      scopeLabel={L(`AffLive · CrLive · AffVid (${n(le.affVideos)} clip)`, `AffLive · CrLive · AffVid (${n(le.affVideos)} clips)`)}
      question={L('Live hay Video, chính chủ hay affiliate, Ads hay Organic hiệu quả hơn?', 'How do Live vs Video, official vs affiliate, and Ads vs Organic compare in efficiency?')}
      conclusion={L(
        'Hiệu suất chuyển đổi tập trung vượt trội ở các phiên Live của chính shop so với creator ngoài; quảng cáo trả phí giúp mở rộng tỷ lệ video phát sinh đơn nhưng hiệu quả doanh thu trên mỗi nghìn lượt xem (GPM) chịu ảnh hưởng lớn theo tính thời điểm của mùa vụ.',
        'Conversion efficiency concentrates overwhelmingly in self-operated Live sessions; paid advertising expands the share of converting videos but revenue per 1,000 views (GPM) depends heavily on seasonal timing.'
      )}
      soWhat={L(
        'Ưu tiên ngân sách và nhân lực cho Live của chính shop, trọng tâm ở khung 12h đến 18h; dùng Ads có chọn lọc cho video đã có đà tự nhiên và gắn hashtag đặc thù theo mã sản phẩm.',
        'Prioritize budget and staffing on official Live sessions centered in the 12:00-18:00 slot; deploy Ads selectively on videos with organic traction and product-specific hashtags.'
      )}
    >
      {/* Ba lát cắt phân tích Chương 5 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs tabular-nums">
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Live chính chủ đối chiếu creator ngoài', 'Official Live vs external creators')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Kênh @shop_official đạt tỷ lệ ra đơn ${n(le.crLiveConvPct, 1)}% mỗi ca và ${n(le.officialVndPerView)} đ/lượt xem (PV), trong khi creator ngoài chỉ đạt ${n(le.extLiveConvPct, 1)}% số ca ra đơn và ${n(le.extVndPerView)} đ/PV dù thu hút đến ${n(le.extViewSharePct, 1)}% tổng lượt xem toàn sàn (thước đo UV trên CrLive đạt ${n(le.crLiveVndPerUv)} đ/người xem).`,
              `@shop_official converts orders in ${n(le.crLiveConvPct, 1)}% of streams at ${n(le.officialVndPerView)} VND/view (PV), while external affiliates convert in ${n(le.extLiveConvPct, 1)}% at ${n(le.extVndPerView)} VND/PV despite pulling ${n(le.extViewSharePct, 1)}% of total views (UV on CrLive reaches ${n(le.crLiveVndPerUv)} VND/viewer).`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Khung giờ UTC+7 & độ dài ca Live', 'UTC+7 start slots & stream duration')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Sau dịch +13h trên 600 ca CrLive, khung 12-18h dẫn đầu với ${n(le.crLiveBySlotAll[2].gmvPerUv)} đ/UV (${le.crLiveBySlotAll[2].sessions} ca), kế đến 06-12h đạt ${n(le.crLiveBySlotAll[1].gmvPerUv)} đ (${le.crLiveBySlotAll[1].sessions} ca), 18-24h đạt ${n(le.crLiveBySlotAll[3].gmvPerUv)} đ và 00-06h đạt ${n(le.crLiveBySlotAll[0].gmvPerUv)} đ (${le.crLiveBySlotAll[0].sessions} ca). Nhóm ${le.crLiveGt8Sessions} ca trên 8 giờ đạt ${n(le.crLiveGt8VndPerUv)} đ/UV so với ${n(le.crLiveLe8VndPerUv)} đ ở ca ngắn hơn (gồm cả yếu tố ca sale lớn hoặc mở máy dài).`,
              `Shifted +13h across 600 CrLive sessions, 12-18h leads at ${n(le.crLiveBySlotAll[2].gmvPerUv)} VND/UV (${le.crLiveBySlotAll[2].sessions} sessions), followed by 06-12h at ${n(le.crLiveBySlotAll[1].gmvPerUv)} (${le.crLiveBySlotAll[1].sessions}), 18-24h at ${n(le.crLiveBySlotAll[3].gmvPerUv)}, and 00-06h at ${n(le.crLiveBySlotAll[0].gmvPerUv)} (${le.crLiveBySlotAll[0].sessions}). Streams >8h (${le.crLiveGt8Sessions}) average ${n(le.crLiveGt8VndPerUv)} vs ${n(le.crLiveLe8VndPerUv)} VND/UV (partly reflecting mega-sale marathons).`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Video Ads so với Organic (4.796 clip)', 'Ads vs Organic across 4,796 clips')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Quảng cáo trả phí giúp tăng xác suất video có đơn từ ${n(slices[0].orgConvPct, 1)}% lên ${n(slices[0].adsConvPct, 1)}% (OR = ${n(slices[0].oddsRatio, 1)}, Fisher p < 0,001). Tuy nhiên, GPM toàn mẫu của Ads (${n(slices[0].adsGpmK, 1)}k đ) thấp hơn Organic (${n(slices[0].orgGpmK, 1)}k đ) do Organic bật mạnh vào mùa Thu Đông và các clip viral tự nhiên.`,
              `Paid Ads boosts video conversion probability from ${n(slices[0].orgConvPct, 1)}% to ${n(slices[0].adsConvPct, 1)}% (OR = ${n(slices[0].oddsRatio, 1)}, Fisher p < 0.001). However, full-sample Ads GPM (${n(slices[0].adsGpmK, 1)}k) trails Organic (${n(slices[0].orgGpmK, 1)}k) as Organic surged in Autumn-Winter and viral organic hits.`
            )}
          </p>
        </div>
      </div>
      {/* 5.1 [CHÍNH] GMV mỗi lượt xem Live: chính chủ so với affiliate */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `5.1. Live chính chủ tạo ${n(le.officialVndPerView)} đ/lượt xem so với ${n(le.extVndPerView)} đ ở affiliate; mạng ngoài chiếm ${n(le.extViewSharePct, 1)}% lượt xem nhưng chỉ mang về ${n(le.extGmvSharePct, 1)}% GMV`,
          `5.1. Official Live yields ${n(le.officialVndPerView)} VND/view vs ${n(le.extVndPerView)} VND for affiliates; affiliates hold ${n(le.extViewSharePct, 1)}% of views yet ${n(le.extGmvSharePct, 1)}% of GMV`
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams [Tổng Lượt Xem Live, Doanh Thu Cho Shop (VNĐ)] · 07/03 - 20/10/2026 · n = ${le.officialSessions} phiên chính chủ và ${n(le.extSessions)} phiên affiliate. Ghi chú phương pháp: Nếu tính trên bảng Creator_Livestreams theo Tổng Người Xem (UV, không cùng định nghĩa với lượt xem PV), kênh chính chủ đạt ${n(le.crLiveVndPerUv)} đ/người xem. Ở mảng Video, ${le.officialVideos} clip chính chủ tạo ${n(le.officialVideoGmvM, 1)} Tr đ so với ${n(le.affVideoGmvB, 2)} tỷ đ từ ${n(le.affVideos)} clip affiliate.`,
          `Source: Affiliate_Livestreams [Total Live Views (PV), Shop Revenue] · 07/03 - 20/10/2026 · n = ${le.officialSessions} official and ${n(le.extSessions)} affiliate sessions. Methodological note: Creator_Livestreams measures Unique Viewers (UV = ${n(le.crLiveVndPerUv)} VND/UV), which is not directly comparable to PV. On Video, ${le.officialVideos} official clips drove ${n(le.officialVideoGmvM, 1)}M vs ${n(le.affVideoGmvB, 2)}B across ${n(le.affVideos)} affiliate clips.`
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
          <div className="lg:col-span-6 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveYieldBars} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="channel" tick={axisTick} />
                <YAxis domain={[0, 2500]} width={52} tick={axisTick} tickFormatter={(v: number) => `${v}đ`} />
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 0)} đ/lượt xem`} />} />
                <Bar dataKey="vndPerView" name={L('GMV / lượt xem Live', 'GMV / Live view')} radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {liveYieldBars.map((b, i) => (
                    <Cell key={i} fill={b.fill} stroke={KAMI_BRAND_PALETTE.tealInk} strokeWidth={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-6 space-y-3 text-xs tabular-nums">
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>{L('Phân bổ Tổng Lượt Xem Live (43,79 triệu PV)', 'Share of Total Live Views (43.79M PV)')}</span>
                <span>{n(le.officialViewSharePct, 1)}% / {n(le.extViewSharePct, 1)}%</span>
              </div>
              <div className="flex h-7 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 font-bold">
                <div style={{ width: `${le.officialViewSharePct}%`, backgroundColor: KAMI_BRAND_PALETTE.tealInk }} className="flex items-center justify-center text-white">
                  {n(le.officialViewSharePct, 0)}%
                </div>
                <div style={{ width: `${le.extViewSharePct}%`, backgroundColor: KAMI_BRAND_PALETTE.amber }} className="flex items-center justify-center text-slate-950">
                  Affiliate {n(le.extViewSharePct, 1)}% ({n(le.extViewsM, 2)}M PV)
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>{L('Phân bổ Doanh thu Live (10,47 tỷ đ)', 'Share of Total Live GMV (10.47B VND)')}</span>
                <span>{n(le.officialGmvSharePct, 1)}% / {n(le.extGmvSharePct, 1)}%</span>
              </div>
              <div className="flex h-7 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 font-bold">
                <div style={{ width: `${le.officialGmvSharePct}%`, backgroundColor: KAMI_BRAND_PALETTE.tealInk }} className="flex items-center justify-center text-white">
                  @shop_official {n(le.officialGmvSharePct, 1)}%
                </div>
                <div style={{ width: `${le.extGmvSharePct}%`, backgroundColor: KAMI_BRAND_PALETTE.amber }} className="flex items-center justify-center text-slate-950">
                  {n(le.extGmvSharePct, 1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* 5.2 [CHÍNH] Forest plot Ads so với Organic qua 6 lát cắt */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '5.2. Forest plot 6 lát cắt: Cờ Ads tăng tỷ lệ video có đơn từ +11,0 đến +30,3 điểm %, nhưng tỷ số GPM đổi chiều từ 1,75x (Hè) sang 0,63x (90N cuối)',
          '5.2. Six-slice forest plot: Ads lifts conversion probability by +11.0 to +30.3 pp, while GPM ratio flips from 1.75x (Summer) to 0.63x (last 90d)'
        )}
        footer={L(
          `Nguồn: Affiliate_Videos sau khử trùng [Ủy Quyền Quảng Cáo, Doanh Thu Đóng Góp, Lượt Xem, Followers, KOC ID, Thời Gian Xuất Bản] · n = ${n(le.affVideos)} video (${n(slices[0].adsN)} Ads so với ${n(slices[0].orgN)} Organic). Không suy diễn nhân quả vì nhãn hàng thường cấp quyền chạy Ads cho các clip vốn đã có tín hiệu bán tốt.`,
          `Source: Deduplicated Affiliate_Videos [Ad Auth, Contributed Revenue, Views, Followers, KOC ID, Publish Date] · n = ${n(le.affVideos)} clips (${n(slices[0].adsN)} Ads vs ${n(slices[0].orgN)} Organic). Observational comparison only due to reverse selection into ad boosting.`
        )}
      >
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-12 gap-2 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 pb-1 border-b border-[#C8EEF7] dark:border-slate-800">
            <div className="col-span-12 md:col-span-4">{L('Lát cắt kiểm soát (n Ads / n Organic)', 'Control slice (Ads n / Organic n)')}</div>
            <div className="col-span-6 md:col-span-4">{L('Panel 1: Chênh lệch tỷ lệ có đơn (điểm %, CI 95%)', 'Panel 1: Conversion rate lift (pp, 95% CI)')}</div>
            <div className="col-span-6 md:col-span-4">{L('Panel 2: Tỷ số GPM Ads / Organic (mốc 1,0x)', 'Panel 2: GPM ratio Ads / Organic (ref 1.0x)')}</div>
          </div>

          {slices.map((s) => {
            // Panel 1 scale: 0 to +40 percentage points
            const toConvPct = (v: number) => Math.max(0, Math.min(100, (v / 40) * 100));
            // Panel 2 scale: 0x to 2.0x (1.0x is exactly at 50%!)
            const toRatioPct = (v: number) => Math.max(2, Math.min(98, (v / 2.0) * 100));
            const adsWinsGpm = s.gpmRatio >= 1.0;

            return (
              <div key={s.id} className="grid grid-cols-12 items-center gap-2 text-xs tabular-nums py-1">
                <div className="col-span-12 md:col-span-4">
                  <div className="font-bold text-slate-900 dark:text-white">{L(s.labelVi, s.labelEn)}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ads {n(s.adsN)} ({n(s.adsConvPct, 1)}%) · Org {n(s.orgN)} ({n(s.orgConvPct, 1)}%)
                  </div>
                </div>

                {/* Panel 1: Conversion lift CI */}
                <div className="col-span-6 md:col-span-4 flex items-center gap-2">
                  <div className="relative h-6 flex-1 rounded bg-[#C8EEF7]/30 dark:bg-slate-800">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-400" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]"
                      style={{
                        left: `${toConvPct(s.ciLowPp)}%`,
                        width: `${Math.max(2, toConvPct(s.ciHighPp) - toConvPct(s.ciLowPp))}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#074553] dark:bg-[#9BE7FA] border-2 border-white dark:border-slate-900"
                      style={{ left: `${toConvPct(s.diffPp)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-bold text-[#074553] dark:text-[#9BE7FA]">
                    +{n(s.diffPp, 1)} đ%
                  </span>
                </div>

                {/* Panel 2: GPM Ratio around 1.0x */}
                <div className="col-span-6 md:col-span-4 flex items-center gap-2">
                  <div className="relative h-6 flex-1 rounded bg-[#FFE485]/30 dark:bg-slate-800">
                    {/* Reference line at 1.0x (50%) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-500" />
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-2 rounded-full ${
                        adsWinsGpm ? 'bg-[#0D7287]' : 'bg-[#FFD14C] border border-amber-700/40'
                      }`}
                      style={{
                        left: `${Math.min(50, toRatioPct(s.gpmRatio))}%`,
                        width: `${Math.max(2, Math.abs(toRatioPct(s.gpmRatio) - 50))}%`,
                      }}
                    />
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        adsWinsGpm ? 'bg-[#074553]' : 'bg-amber-600'
                      }`}
                      style={{ left: `${toRatioPct(s.gpmRatio)}%` }}
                    />
                  </div>
                  <span
                    className={`w-16 text-right font-bold ${
                      adsWinsGpm ? 'text-[#074553] dark:text-[#9BE7FA]' : 'text-amber-800 dark:text-[#FFE485]'
                    }`}
                  >
                    {n(s.gpmRatio, 2)}x
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* 5.3, 5.4, 5.5 [XEM THÊM] */}
      <ExpandableMoreSection
        title={L(
          '5.3 - 5.5. Ma trận khung giờ × thời lượng Live chính chủ, phân tích hashtag/danh mục video và tương quan số sản phẩm ghim kệ',
          '5.3 - 5.5. Official Live hour × duration heatmap, video hashtag/theme analysis, and pinned shelf correlation'
        )}
        countLabel={L('3 phân tích mở rộng', '3 deep-dive views')}
      >
        <div className="space-y-3.5">
          {/* 5.3 Heatmap khung giờ × thời lượng */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              `5.3. Ca Live chính chủ khung 12-18h kéo dài trên 8 giờ đạt đỉnh ${n(heatmap[2].cells[3].gmvPerUv)} đ/người xem (n = ${heatmap[2].cells[3].sessions} phiên)`,
              `5.3. Official afternoon streams (12-18h) lasting >8h peak at ${n(heatmap[2].cells[3].gmvPerUv)} VND/UV (n = ${heatmap[2].cells[3].sessions} sessions)`
            )}
            footer={L(
              'Nguồn: Creator_Livestreams dịch +13 giờ về UTC+7 [Thời Gian Bắt Đầu Live, Thời Lượng (Giờ), Doanh Thu Phiên Live, Tổng Người Xem] · n = 595 phiên trong chu kỳ 231 ngày. Các ô viền đứt nét có cỡ mẫu nhỏ (n < 10 phiên) không dùng để ra quyết định.',
              'Source: Creator_Livestreams shifted +13h to UTC+7 · n = 595 sessions within the 231d window. Dashed cells denote small sample size (n < 10) and are excluded from slot scheduling decisions.'
            )}
          >
            <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800">
              <table className="w-full text-center text-xs tabular-nums border-collapse">
                <thead className="bg-[#C8EEF7]/45 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold">{L('Khung mở ca (UTC+7)', 'Start slot (UTC+7)')}</th>
                    <th className="px-3 py-2 font-bold">&lt; 2h</th>
                    <th className="px-3 py-2 font-bold">2 - 4h</th>
                    <th className="px-3 py-2 font-bold">4 - 8h</th>
                    <th className="px-3 py-2 font-bold">&gt; 8h</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmap.map((row) => (
                    <tr key={row.hourSlot} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">{row.hourSlot}</td>
                      {row.cells.map((c) => (
                        <td key={c.durBucket} className={`p-2 ${heatCellClass(c.gmvPerUv, c.lowSample)}`}>
                          <div>{c.sessions > 0 ? `${n(c.gmvPerUv)} đ` : '0 đ'}</div>
                          <div className="text-[11px] opacity-85">
                            n = {c.sessions} {c.lowSample ? L('(mẫu nhỏ)', '(low n)') : `· ${n(c.gmvM, 0)}Tr`}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* 5.4 Hashtag và danh mục video */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              `5.4. Video gắn hashtag đúng dòng sản phẩm có tỷ lệ ra đơn ${n(hashtags[0].convPct, 1)}% (so với ${n(hashtags[1].convPct, 1)}% hashtag xu hướng chung); chủ đề Đồ bơi chiếm ${n(themes[0].gmvSharePct, 1)}% GMV video`,
              `5.4. Product-specific hashtags convert at ${n(hashtags[0].convPct, 1)}% (vs ${n(hashtags[1].convPct, 1)}% generic trend tags); Swimwear accounts for ${n(themes[0].gmvSharePct, 1)}% of video GMV`
            )}
            footer={L(
              `Nguồn: Affiliate_Videos [Tiêu Đề Video, Danh Mục Nội Dung, Doanh Thu Đóng Góp] · n = ${n(le.affVideos)} video. Nhãn danh mục gốc của FastMoss ghi chung song ngữ (Clothing & Accessories 47,7%, Other 24,5%, Quần áo & Phụ kiện 12,1%), nên cả nhóm hashtag sản phẩm (#(bikini|doboi|setdoboi|aothun|chanvay|aokhoac|aogio|kamiely) so với hashtag xu hướng chung #xuhuong, #fyp, #outfit) và chủ đề Đồ bơi (${n(themes[0].gmvSharePct, 1)}% GMV) đều phân loại bằng regex trên Tiêu Đề Video + Danh Mục Nội Dung.`,
              `Source: Affiliate_Videos [Caption, Content Category, Contributed Revenue] · n = ${n(le.affVideos)} videos. Because native FastMoss categories are broad bilingual labels (Clothing & Accessories 47.7%, Other 24.5%, Quần áo & Phụ kiện 12.1%), both product hashtags (#(bikini|doboi|setdoboi|aothun|chanvay|aokhoac|aogio|kamiely) vs generic # tags) and the Swimwear theme (${n(themes[0].gmvSharePct, 1)}% GMV) are classified via explicit regex over Caption + Category.`
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {L('Tỷ lệ video phát sinh đơn theo cấu trúc hashtag', 'Order conversion rate by caption hashtag pattern')}
                </div>
                {hashtags.map((h) => (
                  <div key={h.id} className="space-y-1 text-xs tabular-nums">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-700 dark:text-slate-300 truncate">{L(h.labelVi, h.labelEn)}</span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">
                        {n(h.convPct, 1)}% ({n(h.clips)} clip)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded bg-[#0D7287] dark:bg-[#9BE7FA]"
                        style={{ width: `${Math.min(100, h.convPct * 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {L('Tỷ trọng GMV video theo nhóm chủ đề sản phẩm', 'Share of total video GMV by product theme')}
                </div>
                {themes.map((th) => (
                  <div key={th.id} className="space-y-1 text-xs tabular-nums">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-700 dark:text-slate-300 truncate">{L(th.labelVi, th.labelEn)}</span>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">
                        {n(th.gmvSharePct, 1)}% ({n(th.gmvM, 1)} Tr)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded bg-[#FFD14C] border-r border-amber-600"
                        style={{ width: `${th.gmvSharePct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* 5.5 Số sản phẩm ghim kệ vs GMV phiên & LiveProd */}
          <ChartCard
            height=""
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              `5.5. Tương quan hạng giữa số SP lên kệ và GMV phiên đạt ρ = ${n(pinned.spearmanRho, 2)}; ${pinned.liveProdActive}/${pinned.liveProdTotal} mã ghim Live phát sinh đơn trực tiếp`,
              `5.5. Rank correlation between shelf item count and session GMV reaches ρ = ${n(pinned.spearmanRho, 2)}; ${pinned.liveProdActive}/${pinned.liveProdTotal} pinned Live items converted`
            )}
            footer={L(
              'Nguồn: Creator_Livestreams [Số Sản Phẩm Lên Kệ, Doanh Thu Phiên Live] (n = 600) và Livestream_Products [Lượng Bán Trong Live / Lượng Bán Toàn Shop] (n = 103 SP). Đính chính phương pháp: Bộ dữ liệu không có bảng giao dịch nối khóa phiên × mã sản phẩm nên không thể tính giỏ hàng mua kèm (co-occurrence).',
              'Source: Creator_Livestreams [Shelf Products, Session GMV] (n = 600) and Livestream_Products (n = 103 items). Methodological note: No session_id × product_id junction table exists, so market-basket co-occurrence cannot be computed.'
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center pt-1">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pinned.shelfBucketStats} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="bucket" tick={axisTick} />
                    <YAxis width={48} tick={axisTick} tickFormatter={(v: number) => `${v}Tr`} />
                    <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)} Tr đ`} />} />
                    <Legend formatter={legendFormatter} />
                    <Bar dataKey="meanGmvM" name={L('GMV TB phiên', 'Mean session GMV')} fill={KAMI_BRAND_PALETTE.cyan} stroke={KAMI_BRAND_PALETTE.tealInk} strokeWidth={0.8} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="medianGmvM" name={L('GMV trung vị phiên', 'Median session GMV')} fill={KAMI_BRAND_PALETTE.tealInk} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800">
                <table className="w-full text-left text-xs tabular-nums">
                  <thead className="bg-[#C8EEF7]/45 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    <tr>
                      <th className="px-2.5 py-1.5 font-bold">{L('Mã ghim (LiveProd)', 'Pinned SKU')}</th>
                      <th className="px-2.5 py-1.5 font-bold text-right">{L('GMV trong Live', 'Live GMV')}</th>
                      <th className="px-2.5 py-1.5 font-bold text-right">{L('Tỷ lệ bán qua Live', 'Live unit share')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {pinned.topLiveProds.slice(0, 5).map((p) => (
                      <tr key={p.code} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-2.5 py-1.5 font-bold text-slate-900 dark:text-white">{p.code}</td>
                        <td className="px-2.5 py-1.5 text-right">{n(p.liveGmvM, 1)} Tr</td>
                        <td className="px-2.5 py-1.5 text-right font-semibold text-[#074553] dark:text-[#9BE7FA]">
                          {n(p.liveUnitSharePct, 1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ChartCard>
        </div>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}
