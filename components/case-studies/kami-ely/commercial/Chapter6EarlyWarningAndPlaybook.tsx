'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ChapterShell,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  Chip,
  ExpandableMoreSection,
  axisTick,
  legendFormatter,
  GRID_STROKE,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Chapter6EarlyWarningAndPlaybook() {
  const { L, isEn, n } = usePlaybookLang();
  const k = V2.ch0.kpis;
  const ls = V2.ch6.leadingSignals;
  const crosses = V2.ch6.maCrossovers;
  const btRows = V2.ch6.backtestRows;
  const sv = V2.ch4.survival;
  const sp = V2.ch2.skuPareto;
  const bestAfternoonUvYield = V2.ch5.crLiveHeatmap[2]?.cells[3]?.gmvPerUv ?? 3858;

  const aprPeakLives = ls.aprLives || 1;
  const aprPeakNewKocs = ls.aprNewKocs || 1;

  const monthlyTimeline = V2.ch3.monthly.map((m, idx) => {
    const newKocs = V2.ch4.cohortRetention[idx]?.size ?? 0;
    return {
      shortLabel: m.shortLabel,
      month: m.month,
      isPartial: m.isPartial,
      storeGmvB: m.storeGmvB,
      storeLives: m.storeLives,
      newKocs,
      livesIdx: Math.round((m.storeLives / aprPeakLives) * 1000) / 10,
      newKocsIdx: Math.round((newKocs / aprPeakNewKocs) * 1000) / 10,
    };
  });

  const crossoverAnnotations = crosses.map((c, idx) => {
    if (idx === 0) {
      return {
        ...c,
        tagVi: 'Báo giả #1',
        tagEn: 'False alarm #1',
        descVi: 'Nghỉ lễ 30/04, hồi phục ngay',
        descEn: 'Holiday dip, immediate rebound',
        tone: 'amber' as const,
      };
    }
    if (idx === 1) {
      return {
        ...c,
        tagVi: 'Báo giả #2',
        tagEn: 'False alarm #2',
        descVi: 'Chững ngắn 12N trước đỉnh 16/06',
        descEn: 'Brief pause 12d before 16/06 peak',
        tone: 'amber' as const,
      };
    }
    if (idx === 2) {
      return {
        ...c,
        tagVi: 'Trễ 10N sau đỉnh',
        tagEn: '10d post-peak',
        descVi: 'Xác nhận đà gãy về đáy T8',
        descEn: 'Confirmed slide toward Aug trough',
        tone: 'emerald' as const,
      };
    }
    return {
      ...c,
      tagVi: 'Đang kích hoạt',
      tagEn: 'Active alert',
      descVi: 'Hạ nhiệt sau Mega Sale 10.10',
      descEn: 'Post-10.10 campaign cooldown',
      tone: 'rose' as const,
    };
  });

  const trafficLights = [
    {
      metricVi: 'Nhịp số ca Live toàn shop theo tháng (MoM)',
      metricEn: 'Monthly store Live session pace (MoM)',
      greenVi: 'Biến động >= -10% so với tháng trước',
      greenEn: 'Change >= -10% vs prior month',
      yellowVi: 'Giảm từ -10% đến -25% MoM',
      yellowEn: 'Drops -10% to -25% MoM',
      redVi: `Giảm sâu hơn -25% (T5 đã ghi nhận ${n(ls.livesAprMayDropPct, 1)}%)`,
      redEn: `Drops below -25% (May logged ${n(ls.livesAprMayDropPct, 1)}%)`,
    },
    {
      metricVi: 'Creator ngoài lên sóng lần đầu / tháng',
      metricEn: 'First-time external Live creators / month',
      greenVi: '>= 35 KOC mới/tháng',
      greenEn: '>= 35 new KOCs/month',
      yellowVi: '20 đến 34 KOC mới/tháng (T9-T10 đạt 29 & 27)',
      yellowEn: '20 to 34 new KOCs/month (Sep-Oct hit 29 & 27)',
      redVi: `< 20 KOC hoặc sụt > 40% MoM (T5 sụt ${n(ls.newKocsAprMayDropPct, 1)}%, T7 còn 15)`,
      redEn: `< 20 KOCs or > 40% MoM drop (May fell ${n(ls.newKocsAprMayDropPct, 1)}%, Jul hit 15)`,
    },
    {
      metricVi: 'Doanh thu Live thực mỗi phiên (AffLive)',
      metricEn: 'Deduplicated Live GMV per session (AffLive)',
      greenVi: '>= 1,50 Tr đ/phiên',
      greenEn: '>= 1.50M VND/session',
      yellowVi: '0,80 đến 1,49 Tr đ/phiên',
      yellowEn: '0.80M to 1.49M VND/session',
      redVi: `< 0,80 Tr đ hoặc sụt > 40% MoM (T7 giảm ${n(ls.junToJulActualLiveYieldDropPct, 1)}% về 1,10 Tr; T8 còn 0,43 Tr)`,
      redEn: `< 0.80M or > 40% MoM drop (Jul fell ${n(ls.junToJulActualLiveYieldDropPct, 1)}% to 1.10M; Aug hit 0.43M)`,
    },
    {
      metricVi: 'Đường động lượng MA7 so với MA28 (Store)',
      metricEn: 'MA7 vs MA28 momentum crossover (Store)',
      greenVi: 'MA7 duy trì trên MA28',
      greenEn: 'MA7 stays above MA28',
      yellowVi: 'MA7 < MA28 dưới 5 ngày (lọc nhiễu lễ 29/04, 04/06; theo dõi mốc 22/10)',
      yellowEn: 'MA7 < MA28 under 5 days (filters 29/04 & 04/06 noise; watch 22/10)',
      redVi: 'MA7 < MA28 kéo dài >= 7 ngày kèm sụt cung Live (như mốc 26/06)',
      redEn: 'MA7 < MA28 persists >= 7 days alongside falling Live count (as on 26/06)',
    },
  ];

  const octMonthly = V2.ch3.monthly[7];
  const sepCohort = V2.ch4.cohortRetention[6];
  const octCohort = V2.ch4.cohortRetention[7];

  const playbookActions = [
    {
      actionVi: `Lên lịch xoay trục kệ hàng chuyển mùa từ giữa tháng 8 (sớm hơn mốc đảo chiều ${V2.ch3.crossoverWeek}) và đối chiếu sổ kho cho ${sp.zeroLaunchPre2026}/${sp.zeroSaleSkus} SKU cũ 0 đơn để sàng lọc danh mục`,
      actionEn: `Schedule seasonal shelf rotation by mid-August (ahead of ${V2.ch3.crossoverWeek} crossover) and cross-check ERP stock on ${sp.zeroLaunchPre2026}/${sp.zeroSaleSkus} zero-sale legacy SKUs for catalog screening`,
      kpiVi: 'Tỷ trọng GMV hàng mùa mới trên giỏ Live & danh sách mã cũ tồn kho',
      kpiEn: 'Next-season GMV share in Live basket & legacy SKU stock list',
      triggerVi: 'Cung ca Live Hè giảm > 25% MoM hoặc cố định từ ngày 10/08',
      triggerEn: 'Summer Live volume drops > 25% MoM or fixed on Aug 10',
      ownerVi: 'Merchandising & Quản lý kho',
      ownerEn: 'Merchandising & Inventory Ops',
      dataVi: 'SKU10, Shop_Products + Tồn kho & giá vốn ERP nội bộ',
      dataEn: 'SKU10, Shop_Products + Internal ERP stock & COGS',
    },
    {
      actionVi: `Ưu tiên nhân sự Live @shop_official ở khung 12h-18h (ca dài đạt ${n(bestAfternoonUvYield)} đ/người xem) và cấp quyền chạy Ads có chọn lọc cho video đã có đơn tự nhiên kèm hashtag mã SP`,
      actionEn: `Prioritize @shop_official staffing in the 12:00-18:00 slot (long sessions hit ${n(bestAfternoonUvYield)} VND/UV) and grant Ad boosting selectively to organically converting videos with SKU hashtags`,
      kpiVi: 'GMV/lượt xem Live chính chủ & tỷ số GPM Ads/Organic',
      kpiEn: 'Official Live VND/view & Ads/Organic GPM ratio',
      triggerVi: 'Ca chính chủ < 1.500 đ/lượt xem hoặc GPM Ads < 0,80x Organic',
      triggerEn: 'Official yield < 1,500 VND/view or Ads GPM < 0.80x Organic',
      ownerVi: 'Trưởng nhóm Livestream & Performance Ads',
      ownerEn: 'Livestream Lead & Performance Ads',
      dataVi: 'Creator_Livestreams (+13h), Affiliate_Videos + TikTok Ads Manager',
      dataEn: 'Creator_Livestreams (+13h), Affiliate_Videos + TikTok Ads Manager',
    },
    {
      actionVi: `Thử nghiệm hỗ trợ KOC mới trong 3 ca Live đầu (kịch bản ghim mã chủ lực, voucher mở hàng) có nhóm đối chứng, xuất phát từ việc ${n(sv.first3ZeroNeverConvertPct, 1)}% nhóm 0 đơn ở <= 3 ca đầu không ra đơn cả kỳ`,
      actionEn: `Run a controlled 3-session onboarding support experiment (hero-SKU script, starter voucher) with a control group, motivated by ${n(sv.first3ZeroNeverConvertPct, 1)}% of <= 3-session zero-GMV KOCs never converting`,
      kpiVi: 'Tỷ lệ ra đơn trong 3 ca đầu & giữ chân M+1 giữa nhóm hỗ trợ và đối chứng',
      kpiEn: '3-session conversion rate & M+1 retention (treatment vs control)',
      triggerVi: 'Mỗi lô tuyển mới >= 20 KOC/tháng (chia ngẫu nhiên 2 nhóm)',
      triggerEn: 'Monthly cohort intake >= 20 new KOCs (randomized 50/50 split)',
      ownerVi: 'Quản lý Affiliate / Booking KOC',
      ownerEn: 'Affiliate / KOC Booking Lead',
      dataVi: 'Affiliate_Livestreams (lọc ngoài @shop_official), Affiliate_KOL',
      dataEn: 'Affiliate_Livestreams (excl. @shop_official), Affiliate_KOL',
    },
  ];

  // Lollipop geometry: center 0d (peak 16/06) at 50%; range [-60d, +60d]
  const lollipopX = (days: number) => Math.max(4, Math.min(96, 50 + (days / 60) * 46));

  return (
    <ChapterShell
      id="sec-ch6-conclusion"
      chapterNum={L('Chương 6', 'Chapter 6')}
      title={L('Cảnh báo sớm gãy mùa và Playbook vận hành', 'Early seasonal breakdown warnings and operational playbook')}
      scopeLabel={L('Store 231N · AffLive 302 KOC · n = 1 mùa', 'Store 231d · AffLive 302 KOCs · n = 1 season')}
      question={L('Tín hiệu nào báo sớm khi mùa cao điểm sắp gãy?', 'Which signals provide early warning when the peak season is about to break?')}
      conclusion={L(
        `Giao cắt MA7 < MA28 báo trễ 10 ngày sau đỉnh 16/06 và phát sinh 2 lần báo giả (29/04, 04/06); số ca live (${n(ls.livesAprMayDropPct, 1)}%) và creator mới (${n(ls.newKocsAprMayDropPct, 1)}%) giảm từ tháng 5 sớm hơn đỉnh khoảng 6 tuần, nhưng với một mùa dữ liệu hiện chưa thể kiểm chứng thành quy tắc tự động.`,
        `The MA7 < MA28 crossover lagged the 16/06 peak by 10 days and generated 2 false alarms (29/04, 04/06); monthly Live volume (${n(ls.livesAprMayDropPct, 1)}%) and new creators (${n(ls.newKocsAprMayDropPct, 1)}%) contracted in May (~6 weeks ahead of peak), yet with a single observed season they remain unvalidated as automated rules.`
      )}
      soWhat={L(
        'Kết hợp theo dõi định kỳ hàng tuần đối với tỷ trọng hàng Đông/Hè, hiệu suất khung giờ Live chính chủ và thử nghiệm có đối chứng cho creator mới, đồng thời chờ thêm một mùa dữ liệu trước khi khóa cứng ngưỡng cảnh báo tự động.',
        'Combine weekly tracking of seasonal SKU share, official Live slot yield, and controlled new-creator onboarding pilots while awaiting a second annual cycle before locking automated alert thresholds.'
      )}
      appendixLabel={L('Mở Phụ lục A, B, C để xem đối soát phiên, thư viện SQL và ma trận giới hạn', 'Open Appendices A, B, C for session reconciliation, SQL, and limitations')}
    >
      {/* Trạng thái hiện tại (25/10/2026) */}
      <div className="rounded-2xl border border-[#FFD14C]/80 bg-[#FFE485]/25 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-[#FFD14C]/10 text-xs tabular-nums space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold text-slate-950 dark:text-white">
            {L('Trạng thái tại ngày khóa sổ dữ liệu (25/10/2026): Tín hiệu trái chiều, duy trì theo dõi định kỳ', 'Status as of data cutoff (25/10/2026): Mixed signals, maintain routine monitoring')}
          </span>
          <Chip tone="amber">{L(`MA7 < MA28 từ ${k.latestMaCrossDate}`, `MA7 < MA28 since ${k.latestMaCrossDate}`)}</Chip>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {L(
            `Đường MA7 cắt xuống dưới MA28 từ ngày ${k.latestMaCrossDate} sau đợt đẩy bán đầu tháng 10. Ở chiều ngược lại, GMV/ca tháng 10 đạt ${n(octMonthly.storeGmvPerLiveM, 2)} Tr đ (tổng ${n(octMonthly.storeGmvB, 2)} tỷ đ chỉ trong ${octMonthly.days} ngày), lượng creator mới ở tháng 9 và tháng 10 tăng lại lên ${sepCohort.size} và ${octCohort.size} KOC, và cohort tháng 9 giữ chân ${n(sepCohort.cells[1].pct ?? 41.4, 1)}% sang 20 ngày đầu tháng 10. Hai nhóm chỉ báo đang đi ngược chiều nhau nên chưa đủ cơ sở kết luận mùa Thu Đông suy yếu.`,
            `MA7 crossed below MA28 on ${k.latestMaCrossDate} following the early-October campaign push. Conversely, October Store GMV/session stands at ${n(octMonthly.storeGmvPerLiveM, 2)}M (${n(octMonthly.storeGmvB, 2)}B across ${octMonthly.days} days), new creator intake rose to ${sepCohort.size} and ${octCohort.size} in Sep-Oct, and the Sep cohort retained ${n(sepCohort.cells[1].pct ?? 41.4, 1)}% into Oct 1-20. Because momentum and supply indicators diverge, routine monitoring is warranted.`
          )}
        </p>
      </div>
      {/* 6.1 [CHÍNH] Dòng thời gian tín hiệu: 2 panel xếp dọc không trục kép */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `6.1. Cung ca Live (${n(ls.aprLives)} -> ${n(ls.mayLives)}) và creator mới (${ls.aprNewKocs} -> ${ls.mayNewKocs}) gãy từ tháng 5, sớm 6 tuần trước đỉnh GMV tháng 6; MA7 < MA28 cắt 4 lần và trễ sau đỉnh`,
          `6.1. Live volume (${n(ls.aprLives)} -> ${n(ls.mayLives)}) and new KOCs (${ls.aprNewKocs} -> ${ls.mayNewKocs}) broke in May, 6 weeks before June peak GMV; MA7 < MA28 crossed 4 times and lagged`
        )}
        footer={L(
          `Nguồn: Store_Daily_Overview [Doanh Thu Trong Ngày, Livestream Mới Trong Ngày] và Affiliate_Livestreams [Thời Gian Bắt Đầu Live, KOC ID != @shop_official] · 09/03 - 25/10/2026 · n = ${V2.meta.days} ngày (8 tháng, T3 và T10 khuyết ngày). Hai panel xếp dọc theo tháng thay cho trục kép để đối chiếu trực tiếp độ trễ giữa cung nội dung và doanh thu.`,
          `Source: Store_Daily_Overview [Daily GMV, New Livestreams] and Affiliate_Livestreams [Session Start, KOC ID != @shop_official] · 09/03 - 25/10/2026 · n = ${V2.meta.days} days (8 months; Mar & Oct partial). Vertically stacked panels avoid dual Y-axes while aligning supply lead time against GMV.`
        )}
      >
        <div className="space-y-3 pt-1">
          {/* Panel 1: Tín hiệu cung dẫn dắt chuẩn hóa T4 = 100% */}
          <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/15 p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {L('Panel trên: Tín hiệu cung dẫn dắt chuẩn hóa (% so với đỉnh T4 = 100%)', 'Top panel: Normalized leading supply signals (% of Apr peak = 100%)')}
              </span>
              <span className="font-semibold text-[#074553] dark:text-[#9BE7FA] tabular-nums">
                {L(`Đỉnh T4: ${n(ls.aprLives)} ca Live · ${ls.aprNewKocs} KOC mới -> T5 giảm ${n(ls.livesAprMayDropPct, 1)}% & ${n(ls.newKocsAprMayDropPct, 1)}%`, `Apr peak: ${n(ls.aprLives)} Lives · ${ls.aprNewKocs} new KOCs -> May ${n(ls.livesAprMayDropPct, 1)}% & ${n(ls.newKocsAprMayDropPct, 1)}%`)}
              </span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTimeline} margin={{ top: 10, right: 16, left: 0, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="shortLabel" tick={axisTick} />
                  <YAxis width={46} domain={[0, 115]} tick={axisTick} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl) => L(`Tháng ${lbl} (chỉ số so với đỉnh T4)`, `Month ${lbl} (indexed to Apr = 100%)`)}
                        fmt={(v, name) => `${n(v, 1)}% (${name})`}
                        extraRow={(payload) => {
                          const row = payload?.[0]?.payload;
                          if (!row) return null;
                          return L(
                            `Thực tế: ${n(row.storeLives)} ca Live · ${n(row.newKocs)} creator mới`,
                            `Actual: ${n(row.storeLives)} Lives · ${n(row.newKocs)} new creators`
                          );
                        }}
                      />
                    }
                  />
                  <Legend formatter={legendFormatter} />
                  <ReferenceLine
                    x="T4"
                    stroke={KAMI_BRAND_PALETTE.tealInk}
                    strokeDasharray="3 3"
                    label={{ value: L('Đỉnh cung T4', 'Apr supply peak'), position: 'insideTopRight', fontSize: 11, fill: KAMI_BRAND_PALETTE.tealInk }}
                  />
                  <Line
                    type="monotone"
                    dataKey="livesIdx"
                    name={L('Chỉ số số ca Live/tháng', 'Monthly Live sessions index')}
                    stroke={KAMI_BRAND_PALETTE.tealInk}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: KAMI_BRAND_PALETTE.tealInk }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="newKocsIdx"
                    name={L('Chỉ số creator mới/tháng', 'Monthly new creators index')}
                    stroke={KAMI_BRAND_PALETTE.amberStroke}
                    strokeWidth={2.2}
                    strokeDasharray="5 3"
                    dot={{ r: 3.5, fill: KAMI_BRAND_PALETTE.amber }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel 2: GMV theo tháng (cột từ 0) + chú thích đỉnh T6, đáy T8 và 4 lần MA7 < MA28 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-950/50 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {L('Panel dưới: GMV toàn shop theo tháng (tỷ đ, trục từ 0) và 4 mốc MA7 cắt xuống MA28', 'Bottom panel: Monthly store GMV (B VND, zero baseline) and 4 MA7 < MA28 events')}
              </span>
              <span className="font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                {L(`Đỉnh T6: ${n(k.junGmvB, 2)} tỷ (16/06 = ${n(k.peakDayGmvM, 1)} Tr) -> Đáy T8: ${n(k.augGmvB, 2)} tỷ (${n(k.junToAugDropPct, 1)}%)`, `Jun peak: ${n(k.junGmvB, 2)}B (16/06 = ${n(k.peakDayGmvM, 1)}M) -> Aug trough: ${n(k.augGmvB, 2)}B (${n(k.junToAugDropPct, 1)}%)`)}
              </span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTimeline} margin={{ top: 12, right: 16, left: 0, bottom: 2 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="shortLabel" tick={axisTick} />
                  <YAxis width={46} domain={[0, 4.2]} tick={axisTick} tickFormatter={(v: number) => `${v}Tỷ`} />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl) => L(`Doanh thu tháng ${lbl}`, `Month ${lbl} GMV`)}
                        fmt={(v) => `${n(v, 2)} tỷ đ`}
                      />
                    }
                  />
                  <ReferenceLine
                    x="T6"
                    stroke={KAMI_BRAND_PALETTE.tealInk}
                    strokeDasharray="3 3"
                    label={{ value: L('Đỉnh GMV T6 (3,77 tỷ)', 'Jun peak (3.77B)'), position: 'top', fontSize: 11, fill: KAMI_BRAND_PALETTE.tealInk }}
                  />
                  <Bar dataKey="storeGmvB" name={L('GMV tháng', 'Monthly GMV')} radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {monthlyTimeline.map((entry) => {
                      const fill =
                        entry.shortLabel === 'T6'
                          ? KAMI_BRAND_PALETTE.tealInk
                          : entry.shortLabel === 'T8'
                            ? KAMI_BRAND_PALETTE.amber
                            : KAMI_BRAND_PALETTE.cyan;
                      return <Cell key={entry.month} fill={fill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Thanh 4 mốc giao cắt MA7 < MA28 trích trực tiếp từ V2.ch6.maCrossovers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs tabular-nums">
              {crossoverAnnotations.map((c) => (
                <div
                  key={c.date}
                  className="rounded-lg border border-slate-200/90 bg-white px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-mono font-extrabold text-slate-950 dark:text-white">{c.ddmm}/2026</span>
                    <Chip tone={c.tone}>{isEn ? c.tagEn : c.tagVi}</Chip>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    MA7 {n(c.ma7M, 1)} &lt; MA28 {n(c.ma28M, 1)} Tr
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? c.descEn : c.descVi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartCard>

      {/* 6.2 [CHÍNH] Bảng backtest kèm thanh Lollipop Lead Time */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '6.2. Backtest 4 ứng viên cảnh báo (n = 1 mùa): Cung Live và creator mới dẫn trước đỉnh ~46 ngày, còn MA7 < MA28 trễ 10 ngày và báo giả 2 lần',
          '6.2. Backtesting 4 warning candidates (n = 1 season): Live count and new KOCs led the peak by ~46 days, whereas MA7 < MA28 lagged 10 days with 2 false alarms'
        )}
        footer={L(
          'Nguồn: Đối soát trên Store_Daily_Overview và Affiliate_Livestreams (mốc quy chiếu 0 ngày = đỉnh toàn shop 16/06/2026). Đính chính nhất quán: Giao cắt 26/06 xảy ra trễ 10 ngày sau đỉnh 16/06 (lead = -10N), dù vẫn sớm hơn đáy tháng 8 khoảng 36 ngày (và sớm 18 ngày trước nhịp rơi giữa tháng 7). Mọi ngưỡng hiện mới quan sát trên n = 1 mùa năm 2026 nên ghi nhận ở mức chưa kết luận đa năm.',
          'Source: Backtested on Store_Daily_Overview and Affiliate_Livestreams (reference day 0 = 16/06/2026 store peak). Unified note: The 26/06 crossover lagged the 16/06 peak by 10 days (lead = -10d), even though it preceded the August trough by ~36 days (and mid-July drop by 18 days). With n = 1 observed season, multi-year generalizability remains inconclusive.'
        )}
      >
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#C8EEF7]/45 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                <th className="py-2.5 px-3 font-bold rounded-tl-xl min-w-[220px]">{L('Tín hiệu ứng viên', 'Candidate signal')}</th>
                <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap">{L('Kích hoạt', 'Triggers')}</th>
                <th className="py-2.5 px-3 font-bold min-w-[230px]">{L('Lead / Lag so với đỉnh 16/06 (Lollipop)', 'Lead / Lag vs 16/06 peak (Lollipop)')}</th>
                <th className="py-2.5 px-2.5 font-bold text-center whitespace-nowrap">{L('Báo giả', 'False alarms')}</th>
                <th className="py-2.5 px-3 font-bold rounded-tr-xl min-w-[240px]">{L('Đánh giá (n = 1 mùa)', 'Evaluation (n = 1 season)')}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300">
              {btRows.map((row, idx) => {
                const isLead = row.leadDaysVsPeak > 0;
                const endPct = lollipopX(row.leadDaysVsPeak);
                const leftPct = Math.min(50, endPct);
                const widthPct = Math.abs(endPct - 50);
                const stemColor = isLead
                  ? KAMI_BRAND_PALETTE.tealInk
                  : row.tone === 'amber'
                    ? KAMI_BRAND_PALETTE.amberStroke
                    : KAMI_BRAND_PALETTE.negative;
                return (
                  <tr key={row.id} className={idx % 2 === 1 ? 'bg-slate-50/70 dark:bg-slate-950/40' : ''}>
                    <td className="py-2.5 px-3 font-bold text-slate-950 dark:text-white leading-snug">
                      {isEn ? row.signalEn : row.signalVi}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-bold text-slate-900 dark:text-white">
                      {row.triggers}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-400">{L('Trễ (-)', 'Lag (-)')}</span>
                          <span className={isLead ? 'text-[#0D7287] dark:text-[#9BE7FA]' : 'text-rose-600 dark:text-rose-400'}>
                            {isLead
                              ? L(`Sớm +${row.leadDaysVsPeak} ngày`, `Leads +${row.leadDaysVsPeak}d`)
                              : L(`Trễ ${row.leadDaysVsPeak} ngày`, `Lags ${row.leadDaysVsPeak}d`)}
                          </span>
                          <span className="text-slate-400">{L('Sớm (+)', 'Lead (+)')}</span>
                        </div>
                        <div className="relative h-5 w-full rounded-md bg-slate-100 dark:bg-slate-800">
                          <div
                            className="absolute top-0 bottom-0 w-px bg-slate-400 dark:bg-slate-500"
                            style={{ left: '50%' }}
                            aria-hidden="true"
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full"
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              backgroundColor: stemColor,
                            }}
                            aria-hidden="true"
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900"
                            style={{
                              left: `${endPct}%`,
                              backgroundColor: stemColor,
                            }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      {row.falseAlarms > 0 ? (
                        <Chip tone="amber">{row.falseAlarms}</Chip>
                      ) : (
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 leading-relaxed text-slate-600 dark:text-slate-300">
                      {isEn ? row.verdictEn : row.verdictVi}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* 6.3 [XEM THÊM] Bảng đèn giao thông 4 chỉ số và Playbook 3 hành động */}
      <ExpandableMoreSection
        title={L('6.3. Bảng đèn giao thông 4 chỉ số cảnh báo và Playbook 3 hành động vận hành', '6.3. Four-metric traffic-light monitor and 3-action operational playbook')}
        countLabel={L('4 ngưỡng đèn · 3 quy tắc hành động', '4 traffic lights · 3 action rules')}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
              {L('A. Bảng đèn giao thông 4 chỉ số tham chiếu (dải ngưỡng tạm thời từ n = 1 mùa, chờ hiệu chỉnh mùa thứ hai)', 'A. Provisional 4-metric traffic-light reference bands (derived from n = 1 season, awaiting second-season calibration)')}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {L(
                'Vì bộ dữ liệu mới quan sát một chu kỳ Hè sang Thu Đông năm 2026, các dải Xanh / Vàng / Đỏ dưới đây đóng vai trò khung tham chiếu rà soát hàng tuần kết hợp đánh giá của vận hành, chưa dùng làm lệnh cắt ngân sách tự động.',
                'Because telemetry covers a single 2026 Summer-to-Autumn cycle, the Green / Yellow / Red bands below serve as weekly operational review references rather than automated budget cut-offs.'
              )}
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    <th className="py-2 px-3 font-bold">{L('Chỉ số cảnh báo', 'Monitoring metric')}</th>
                    <th className="py-2 px-3 font-bold text-emerald-800 dark:text-emerald-300">{L('Xanh (Ổn định)', 'Green (Healthy)')}</th>
                    <th className="py-2 px-3 font-bold text-amber-900 dark:text-[#FFE485]">{L('Vàng (Theo dõi sát)', 'Yellow (Watch)')}</th>
                    <th className="py-2 px-3 font-bold text-rose-700 dark:text-rose-300">{L('Đỏ (Can thiệp ngay)', 'Red (Action trigger)')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {trafficLights.map((t, idx) => (
                    <tr key={t.metricEn} className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-950/40' : ''}>
                      <td className="py-2 px-3 font-bold text-slate-950 dark:text-white">{isEn ? t.metricEn : t.metricVi}</td>
                      <td className="py-2 px-3 bg-emerald-50/50 dark:bg-emerald-500/10">{isEn ? t.greenEn : t.greenVi}</td>
                      <td className="py-2 px-3 bg-[#FFE485]/35 dark:bg-[#FFD14C]/10">{isEn ? t.yellowEn : t.yellowVi}</td>
                      <td className="py-2 px-3 bg-rose-50/60 dark:bg-rose-500/10 font-medium">{isEn ? t.redEn : t.redVi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
              {L('B. Playbook 3 hành động ưu tiên gắn ngưỡng kích hoạt và đầu mối phụ trách', 'B. Three-action operational playbook with triggers, owners, and required data')}
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="bg-[#C8EEF7]/45 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    <th className="py-2 px-3 font-bold min-w-[230px]">{L('Hành động vận hành', 'Operational action')}</th>
                    <th className="py-2 px-3 font-bold min-w-[150px]">{L('Chỉ số theo dõi', 'Tracked KPI')}</th>
                    <th className="py-2 px-3 font-bold min-w-[160px]">{L('Ngưỡng kích hoạt', 'Trigger threshold')}</th>
                    <th className="py-2 px-3 font-bold whitespace-nowrap">{L('Người phụ trách', 'Owner')}</th>
                    <th className="py-2 px-3 font-bold min-w-[160px]">{L('Dữ liệu sử dụng', 'Data source')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {playbookActions.map((p, idx) => (
                    <tr key={p.ownerEn} className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-950/40' : ''}>
                      <td className="py-2.5 px-3 font-semibold text-slate-950 dark:text-white leading-relaxed">
                        {isEn ? p.actionEn : p.actionVi}
                      </td>
                      <td className="py-2.5 px-3">{isEn ? p.kpiEn : p.kpiVi}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#074553] dark:text-[#9BE7FA]">
                        {isEn ? p.triggerEn : p.triggerVi}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold">{isEn ? p.ownerEn : p.ownerVi}</td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{isEn ? p.dataEn : p.dataVi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}

