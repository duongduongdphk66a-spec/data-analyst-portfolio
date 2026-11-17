'use client';

import React from 'react';
import {
  LineChart,
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
  ChapterShell,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  Chip,
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
  const btRows = V2.ch6.backtestRows;
  const sp = V2.ch2.skuPareto;

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
      actionVi: `Ưu tiên nhân sự Live cho @shop_official, theo dõi GMV mỗi lượt xem theo khung giờ và cấp quyền chạy Ads có chọn lọc cho video đã có đơn tự nhiên kèm hashtag mã SP`,
      actionEn: `Prioritize @shop_official Live staffing, track GMV per view across time slots, and selectively grant Ad boosting to organically converting videos with SKU hashtags`,
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
      actionVi: `Thử nghiệm hỗ trợ KOC mới trong 3 ca Live đầu (kịch bản ghim mã chủ lực, voucher mở hàng) có nhóm đối chứng. Cần khoảng 150 creator mỗi nhóm để có ý nghĩa thống kê; thử nghiệm hiện tại mang tính khám phá`,
      actionEn: `Run a controlled 3-session onboarding support experiment (hero-SKU script, starter voucher) with a control group. Requires ~150 creators per arm for statistical power; currently exploratory`,
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

  const businessRules = [
    {
      code: 'BR-01',
      domainVi: 'Danh mục & Kho (Merchandising)',
      domainEn: 'Merchandising & Catalog',
      titleVi: 'Quy tắc xoay trục giỏ hàng chuyển mùa trước 3 tuần',
      titleEn: 'Three-week lead seasonal basket rotation rule',
      givenVi: 'Tỷ trọng đồ bơi Hè trong SKU10 đạt 90,9% ở T6 nhưng đảo chiều sang Thu Đông (70,8%) ngay tại tuần W36 (31/08).',
      givenEn: 'Summer swimwear share in SKU10 hit 90.9% in Jun but flipped to Autumn-Winter (70.8%) in week W36 (31/08).',
      whenVi: 'Cung ca Live Hè giảm > 25% MoM hoặc hệ thống chạm mốc lịch cố định ngày 10/08 hàng năm.',
      whenEn: 'Summer Live session supply drops > 25% MoM or calendar hits August 10.',
      thenVi: 'Đưa 5 mã chủ lực Thu Đông (AT06, CV11, CV02, AG01, AQ1) lên vị trí ghim #1-#5 trên sóng @shop_official và xuất danh sách 204 mã cũ 0 đơn để đối chiếu tồn kho ERP.',
      thenEn: 'Pin the 5 Autumn-Winter hero SKUs (AT06, CV11, CV02, AG01, AQ1) in slots #1-#5 on @shop_official and export 204 pre-2026 zero-sale SKUs for ERP stock audit.',
    },
    {
      code: 'BR-02',
      domainVi: 'Quảng cáo Video (Ads Gate)',
      domainEn: 'Video Ad-Boost Gate',
      titleVi: 'Cổng phê duyệt cấp quyền chạy Ads có điều kiện',
      titleEn: 'Conditional Ad-authorization eligibility gate',
      givenVi: 'Cờ Ads tăng tỷ lệ có đơn thêm +20,1 đ% nhưng GPM toàn mẫu chỉ bằng 0,84x Organic (0,73x trong cùng 192 KOC); nhóm gắn hashtag sản phẩm đạt chuyển đổi 32,7% so với 18,3% ở hashtag xu hướng.',
      givenEn: 'Ads lifts conversion by +20.1 pp but trails Organic GPM at 0.84x overall (0.73x within 192 dual KOCs); product hashtags convert at 32.7% vs 18.3% for generic tags.',
      whenVi: 'Clip affiliate phát sinh >= 1 đơn tự nhiên trong 48 giờ đầu và tiêu đề chứa hashtag dòng sản phẩm (#bikini, #aothun, #chanvay, #aogio).',
      whenEn: 'An affiliate clip generates >= 1 organic order within 48h and includes a product-line hashtag.',
      thenVi: 'Cấp quyền chạy Ads thử nghiệm; tự động ngắt ngân sách nếu tỷ số GPM Ads/Organic của nhóm tụt xuống dưới 0,80x sau 7 ngày.',
      thenEn: 'Grant pilot Ad authorization; revoke spend if cohort Ads/Organic GPM ratio falls below 0.80x after 7 days.',
    },
    {
      code: 'BR-03',
      domainVi: 'Vận hành Livestream (Live Ops)',
      domainEn: 'Livestream Slot & Shelf Ops',
      titleVi: 'Quy tắc phân bổ khung giờ mở ca và độ rộng kệ ghim',
      titleEn: 'Official stream slot duration and shelf breadth rule',
      givenVi: 'Phiên @shop_official đạt 2.163 đ/lượt xem (gấp 53 lần mức 40,8 đ của 301 đối tác độc lập); ca > 8h mở khung 06-18h đạt 2.802-3.858 đ/UV và độ rộng kệ tương quan dương với GMV phiên (ρ = 0,34).',
      givenEn: 'Official streams yield 2,163 VND/view (53x the 40.8 VND of 301 partners); >8h sessions starting 06-18h reach 2,802-3,858 VND/UV and shelf size correlates with GMV (ρ = 0.34).',
      whenVi: 'Lập lịch phân ca hàng tuần cho đội ngũ host nội bộ (@shop_official và @koc_sat01).',
      whenEn: 'Scheduling weekly host shifts for in-house channels (@shop_official and @koc_sat01).',
      thenVi: 'Duy trì tối thiểu 1 ca kéo dài > 4h mở trong khung 06-18h mỗi ngày với > 30 SKU ghim kệ; phát cảnh báo nếu năng suất ca chính chủ giảm xuống < 1.500 đ/lượt xem.',
      thenEn: 'Schedule at least one >4h session starting 06-18h daily with >30 pinned SKUs; alert if official yield drops below 1,500 VND/view.',
    },
    {
      code: 'BR-04',
      domainVi: 'Giám sát BI (Compound Alert)',
      domainEn: 'BI Compound Early Warning',
      titleVi: 'Quy tắc kích hoạt cảnh báo gãy mùa kết hợp đa tín hiệu',
      titleEn: 'Multi-signal compound seasonal breakdown alert',
      givenVi: 'Giao cắt MA7 < MA28 đơn lẻ trễ 10 ngày sau đỉnh 16/06 và tạo 2 lần báo giả (29/04, 04/06), trong khi số ca Live và KOC mới giảm trước đỉnh 6 tuần.',
      givenEn: 'Standalone MA7 < MA28 lagged the Jun 16 peak by 10 days with 2 false alarms (29/04, 04/06), whereas Live count and new KOCs dropped 6 weeks ahead of peak.',
      whenVi: 'Đường MA7 < MA28 duy trì >= 7 ngày liên tiếp VÀ số ca Live tuần giảm > 25% so với trung bình 4 tuần liền trước.',
      whenEn: 'MA7 < MA28 persists for >= 7 consecutive days AND weekly Live sessions drop > 25% below the trailing 4-week mean.',
      thenVi: 'Xác nhận chuyển sang Pha Suy Giảm (Pha 3), tạm dừng mở rộng chi phí tuyển KOC ngoài và kích hoạt quy tắc xoay trục kệ hàng BR-01.',
      thenEn: 'Confirm transition to Contraction Phase (Phase 3), freeze external KOC acquisition spend, and trigger catalog rotation rule BR-01.',
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
        `Đường MA7 cắt xuống MA28 trễ 10 ngày sau đỉnh 16/06 và có 2 lần báo giả; số ca Live và creator mới giảm từ tháng 5 trong khi GMV tăng đến đỉnh tháng 6 (lệch khoảng 1–2 tháng), nhưng quan sát một mùa chưa đủ khẳng định quy tắc.`,
        `The MA7 < MA28 crossover lagged the 16/06 peak by 10 days and triggered 2 false alarms; Live session volume and new creators declined from May while GMV rose to its June peak (~1-2 month lag), yet a single-season observation cannot establish a permanent predictive rule.`
      )}
      soWhat={L(
        'Kết hợp theo dõi định kỳ hàng tuần đối với tỷ trọng hàng Đông/Hè, hiệu suất theo khung giờ Live chính chủ và thử nghiệm có đối chứng cho creator mới, đồng thời chờ thêm một mùa dữ liệu trước khi khóa cứng ngưỡng cảnh báo tự động.',
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

      {/* 6.1 [CHÍNH] Dòng thời gian tín hiệu: 1 panel duy nhất chuẩn hóa T4 = 100% */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '6.1. Tín hiệu số ca live và creator mới giảm trước đỉnh GMV 6 tuần',
          '6.1. Live volume and new creator signals declined 6 weeks before GMV peak'
        )}
        footer={L(
          'Nguồn: Store_Daily_Overview và Affiliate_Livestreams · 09/03 - 25/10/2026. Chuẩn hóa tỷ lệ so với đỉnh tháng 4 (1.957 ca Live và 80 creator mới = 100%). Độ trễ giữa cung nội dung và lực cầu tiêu dùng trên n = 1 mùa 2026.',
          'Source: Store_Daily_Overview and Affiliate_Livestreams · Mar 09 - Oct 25, 2026. Normalized relative to April peak (1,957 Lives and 80 new creators = 100%). Operational lead time observed on n = 1 season (2026).'
        )}
      >
        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTimeline} margin={{ top: 12, right: 16, left: 0, bottom: 2 }}>
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
                label={{ value: L('Đỉnh cung T4 (100%)', 'Apr supply peak (100%)'), position: 'insideTopRight', fontSize: 11, fill: KAMI_BRAND_PALETTE.tealInk }}
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
      </ChartCard>

      {/* 1 thẻ Lưu ý khi đọc */}
      <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/25 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <span className="font-bold text-slate-900 dark:text-white mr-1.5">
          {L('Lưu ý khi đọc:', 'Reading note:')}
        </span>
        {L(
          '(a) Mốc sớm 46 ngày là khoảng cách giữa đỉnh cung tháng 4 (30/04) và đỉnh GMV ngày 16/06, không phải báo trước ngày gãy; (b) Backtest trên một mùa chỉ là gợi ý, cần mùa thứ hai để hiệu chỉnh.',
          '(a) The 46-day lead time is the gap between the April 30 content supply peak and the June 16 GMV peak, not a crash date predictor; (b) Single-season backtest results are indicative guides requiring a second season to calibrate.'
        )}
      </div>

      {/* 6.2 [CHÍNH] Bảng backtest kèm thanh Lollipop Lead Time */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '6.2. Backtest 4 tín hiệu cảnh báo trên chu kỳ mùa hè 2026',
          '6.2. Backtesting 4 early warning candidates across the 2026 summer season'
        )}
        footer={L(
          'Nguồn: Đối soát trên Store_Daily_Overview và Affiliate_Livestreams (mốc quy chiếu 0 ngày = đỉnh toàn shop 16/06/2026). Giao cắt 26/06 trễ 10 ngày sau đỉnh 16/06 (lead = -10N). Số ca Live và creator mới giảm từ tháng 5 trong khi GMV tháng 5 (+11,7%) và tháng 6 (+37,3%) vẫn tăng, cho thấy độ lệch giữa cung nội dung và lực cầu.',
          'Source: Backtested on Store_Daily_Overview and Affiliate_Livestreams (reference day 0 = 16/06/2026 store peak). The 26/06 crossover lagged the 16/06 peak by 10 days (lead = -10d). Live count and new creators fell from May while May (+11.7%) and June (+37.3%) GMV continued to grow, showing a lead time between supply and demand.'
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
                      {row.id === 'new_kocs_mom' || row.id === 'live_vol_mom' ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-[#FFE485]">
                          {L('Sớm quá: GMV còn tăng 6 tuần', 'Too early: GMV rose for 6 wks')}
                        </span>
                      ) : row.falseAlarms > 0 ? (
                        <Chip tone="amber">{L(`${row.falseAlarms} lần`, `${row.falseAlarms} times`)}</Chip>
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

      {/* 6.3 [HIỂN THỊ SẴN] Bảng đèn giao thông 4 chỉ số và Playbook 3 hành động */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
              {L('6.3. Playbook vận hành', '6.3. Operational Playbook')}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">
              {L('Bảng đèn giao thông 4 chỉ số, Playbook 3 hành động và 4 Quy tắc nghiệp vụ (BA)', 'Four-metric traffic-light monitor, 3-action playbook, and 4 BA business rules')}
            </h3>
          </div>
          <Chip tone="cyan">{L('4 ngưỡng đèn · 3 hành động · 4 BR', '4 traffic lights · 3 actions · 4 BRs')}</Chip>
        </div>

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

          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
              {L(
                'C. Đặc tả 4 Quy tắc Nghiệp vụ (Business Rules BR-01..BR-04) & Tiêu chí Nghiệm thu (Given / When / Then)',
                'C. Four Business Rules (BR-01..BR-04) & Acceptance Criteria (Given / When / Then)'
              )}
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs tabular-nums">
              {businessRules.map((br) => (
                <div
                  key={br.code}
                  className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/15 dark:border-slate-800 dark:bg-slate-950/60 p-3.5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-lg bg-[#9BE7FA] px-2 py-0.5 text-[11px] font-black text-slate-950">
                      {br.code}
                    </span>
                    <span className="text-[11px] font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? br.domainEn : br.domainVi}
                    </span>
                  </div>
                  <div className="font-bold text-slate-950 dark:text-white">
                    {isEn ? br.titleEn : br.titleVi}
                  </div>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <div>
                      <strong className="font-bold text-slate-900 dark:text-white">Given: </strong>
                      {isEn ? br.givenEn : br.givenVi}
                    </div>
                    <div>
                      <strong className="font-bold text-amber-900 dark:text-[#FFE485]">When: </strong>
                      {isEn ? br.whenEn : br.whenVi}
                    </div>
                    <div>
                      <strong className="font-bold text-[#074553] dark:text-[#9BE7FA]">Then: </strong>
                      {isEn ? br.thenEn : br.thenVi}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}

