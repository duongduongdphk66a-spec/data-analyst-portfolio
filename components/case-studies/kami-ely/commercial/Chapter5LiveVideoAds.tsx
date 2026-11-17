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
  LabelList,
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

  // 3 cột tách bạch: Chính shop, Vệ tinh, 301 đối tác độc lập
  const liveYieldBars = [
    {
      channel: L('Chính shop', 'Official shop'),
      vndPerView: 2163,
      label: '2.163 đ',
      fill: KAMI_BRAND_PALETTE.tealInk,
    },
    {
      channel: L('Vệ tinh @koc_sat01', 'Satellite @koc_sat01'),
      vndPerView: 2021,
      label: '2.021 đ',
      fill: KAMI_BRAND_PALETTE.amber,
    },
    {
      channel: L('301 đối tác ngoài', '301 independent partners'),
      vndPerView: 40.8,
      label: '40,8 đ',
      fill: KAMI_BRAND_PALETTE.cyan,
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
        'Hiệu suất tập trung vượt trội ở phiên Live của chính shop và kênh vệ tinh; quảng cáo video giúp mở rộng xác suất ra đơn nhưng không nâng GPM toàn kỳ.',
        'Efficiency concentrates overwhelmingly in official and satellite Live streams; video Ads expands order conversion probability without lifting overall GPM.'
      )}
      soWhat={L(
        'Ưu tiên nhân lực và lịch phát sóng cho kênh chính shop; với video Ads, chỉ chạy có chọn lọc cho clip đã có đà tự nhiên và theo dõi GMV mỗi lượt xem theo khung giờ trước khi dồn ngân sách.',
        'Prioritize staffing and schedules for official streams; deploy video Ads selectively on organically proven clips and monitor GMV per view by time slot before scaling budget.'
      )}
    >
      {/* 1 thẻ Lưu ý khi đọc (thay 3 thẻ cũ) */}
      <div className="rounded-xl border border-[#9BE7FA]/80 bg-[#C8EEF7]/30 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
        <div className="text-xs font-extrabold text-[#074553] dark:text-[#9BE7FA]">
          {L('Lưu ý khi đọc số liệu hiệu suất nội dung và quảng cáo', 'Notes on content format efficiency and Ads metrics')}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed tabular-nums">
          {L(
            'Kênh vệ tinh @koc_sat01 đạt năng suất 2.021 đ/lượt xem, gần bằng chính shop (2.163 đ), vượt xa 301 đối tác độc lập (40,8 đ). Hiệu ứng cờ Ads trong phân tích là so sánh quan sát có thiên lệch chọn mẫu, không phải thử nghiệm ngẫu nhiên A/B.',
            'In-house satellite @koc_sat01 yielded 2,021 VND/view, rivaling official Live (2,163 VND) and far exceeding 301 independent partners (40.8 VND). The Ads flag reflects an observational comparison subject to selection bias, not a randomized A/B trial.'
          )}
        </p>
      </div>

      {/* 5.1 [CHÍNH] GMV mỗi lượt xem Live: 3 cột */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '5.1. Chính shop và vệ tinh đạt trên 2.000 đ/lượt xem; 301 đối tác chỉ đạt 40,8 đ',
          '5.1. Official and satellite yield over 2,000 VND/view; 301 partners reach 40.8 VND'
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams [Lượt Xem, Doanh Thu Cho Shop] · 07/03 - 20/10/2026 · n = 595 phiên chính shop, 261 phiên vệ tinh và 7.499 phiên đối tác độc lập. Mạng ngoài chiếm ${n(le.extViewSharePct, 1)}% lượt xem nhưng chỉ mang về ${n(le.extGmvSharePct, 1)}% GMV.`,
          `Source: Affiliate_Livestreams [Views, Shop GMV] · 07/03 - 20/10/2026 · n = 595 official, 261 satellite, and 7,499 independent partner sessions. Affiliates hold ${n(le.extViewSharePct, 1)}% of views yet only ${n(le.extGmvSharePct, 1)}% of GMV.`
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
          <div className="lg:col-span-6 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveYieldBars} margin={{ top: 20, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="channel" tick={axisTick} />
                <YAxis domain={[0, 2600]} width={52} tick={axisTick} tickFormatter={(v: number) => `${v}đ`} />
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 1)} đ/lượt xem`} />} />
                <Bar dataKey="vndPerView" name={L('GMV / lượt xem Live', 'GMV / Live view')} radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  <LabelList
                    dataKey="label"
                    position="top"
                    style={{ fontSize: '11px', fontWeight: 700, fill: '#074553' }}
                  />
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
                  Đối tác ngoài {n(le.extViewSharePct, 1)}% ({n(le.extViewsM, 2)}M PV)
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
          '5.2. Cờ Ads tăng tỷ lệ ra đơn nhưng GPM toàn kỳ thấp hơn Organic',
          '5.2. Ads flag lifts conversion rate but full-sample GPM trails Organic'
        )}
        footer={L(
          `Nguồn: Affiliate_Videos sau khử trùng · n = ${n(le.affVideos)} video (${n(slices[0].adsN)} Ads so với ${n(slices[0].orgN)} Organic). So sánh quan sát có thiên lệch chọn mẫu vì nhãn hàng thường cấp quyền Ads cho clip có tín hiệu tốt sẵn.`,
          `Source: Deduplicated Affiliate_Videos · n = ${n(le.affVideos)} clips (${n(slices[0].adsN)} Ads vs ${n(slices[0].orgN)} Organic). Observational comparison subject to selection bias.`
        )}
      >
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-12 gap-2 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 pb-1 border-b border-[#C8EEF7] dark:border-slate-800">
            <div className="col-span-12 md:col-span-4">{L('Lát cắt kiểm soát (n Ads / n Organic)', 'Control slice (Ads n / Organic n)')}</div>
            <div className="col-span-6 md:col-span-4">
              <div className="flex justify-between">
                <span>{L('Độ tăng tỷ lệ có đơn', 'Conversion lift')}</span>
                <span className="text-[11px] text-slate-400">[0% → +40%]</span>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="flex justify-between">
                <span>{L('Tỷ số GPM Ads/Org', 'GPM ratio')}</span>
                <span className="text-[11px] text-slate-400">[0x · 1.0x · 2.0x]</span>
              </div>
            </div>
          </div>

          {slices.map((s) => {
            const toConvPct = (v: number) => Math.max(0, Math.min(100, (v / 40) * 100));
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
              '5.3. Ca Live chính chủ kéo dài trên 8 giờ đạt năng suất cao nhất',
              '5.3. Official live streams over 8 hours achieve highest yield'
            )}
            footer={L(
              'Nguồn: Creator_Livestreams dịch +13 giờ về UTC+7 · n = 595 phiên trong chu kỳ 231 ngày. Các ô viền đứt nét có cỡ mẫu nhỏ (n < 10 phiên) không dùng để ra quyết định.',
              'Source: Creator_Livestreams shifted +13h to UTC+7 · n = 595 sessions within the 231d window. Dashed cells denote small sample size (n < 10) and are excluded from scheduling decisions.'
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
              '5.4. Hashtag dòng sản phẩm có tỷ lệ ra đơn cao hơn hashtag xu hướng',
              '5.4. Product-specific hashtags convert at higher rate than generic tags'
            )}
            footer={L(
              `Nguồn: Affiliate_Videos [Tiêu Đề Video, Danh Mục Nội Dung, Doanh Thu Đóng Góp] · n = ${n(le.affVideos)} video. Phân loại regex trên Tiêu Đề Video + Danh Mục Nội Dung.`,
              `Source: Affiliate_Videos [Caption, Content Category, Contributed Revenue] · n = ${n(le.affVideos)} videos. Classified via regex on Caption + Category.`
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
              `5.5. Tương quan hạng giữa số sản phẩm lên kệ và GMV phiên đạt ρ = ${n(pinned.spearmanRho, 2)}`,
              `5.5. Rank correlation between shelf item count and session GMV reaches ρ = ${n(pinned.spearmanRho, 2)}`
            )}
            footer={L(
              `Nguồn: Creator_Livestreams [Số Sản Phẩm Lên Kệ, Doanh Thu Phiên Live] (n = 600, ρ = ${n(pinned.spearmanRho, 2)}) và Livestream_Products (n = ${pinned.liveProdTotal} SP, ${pinned.liveProdActive} SP có đơn = ${n(pinned.liveProdTotalGmvB, 2)} tỷ đ). Cột Lượng Bán Toàn Shop (312.689) trong LiveProd là hằng số lũy kế toàn shop nên tỷ trọng tính trên tổng giỏ LiveProd.`,
              `Source: Creator_Livestreams [Shelf Products, Session GMV] (n = 600, ρ = ${n(pinned.spearmanRho, 2)}) and Livestream_Products (n = ${pinned.liveProdTotal} items, ${pinned.liveProdActive} active = ${n(pinned.liveProdTotalGmvB, 2)}B VND). Because Shop Units (312,689) is a store-wide cumulative constant, shares are computed over the LiveProd basket.`
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
                      <th className="px-2.5 py-1.5 font-bold text-right">{L('Sản lượng Live', 'Live units')}</th>
                      <th className="px-2.5 py-1.5 font-bold text-right">{L('GMV trong Live', 'Live GMV')}</th>
                      <th className="px-2.5 py-1.5 font-bold text-right">{L('Tỷ trọng giỏ Live', 'Live basket share')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {pinned.topLiveProds.slice(0, 6).map((p) => (
                      <tr key={p.code} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-2.5 py-1.5 font-bold text-slate-900 dark:text-white">{p.code}</td>
                        <td className="px-2.5 py-1.5 text-right">{n(p.liveUnits)} sp</td>
                        <td className="px-2.5 py-1.5 text-right font-medium">{n(p.liveGmvM, 1)} Tr</td>
                        <td className="px-2.5 py-1.5 text-right font-semibold text-[#074553] dark:text-[#9BE7FA]">
                          {n(p.liveGmvSharePct, 1)}%
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
