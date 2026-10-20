'use client';

import React, { useState, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';
import {
  COLORS,
  affiliateTop10,
  affiliateTopExGirlStyle,
  creatorFacts,
  creatorTiers,
  donutFunnels,
  funnels,
  gpmCompare,
  sqlSnippets,
  topCreatorMonthly,
  shopWideLiveMonthly,
  type FunnelKey,
} from '../playbook/playbookData';
import {
  ChartCard,
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  UnifiedSection,
  axisTick,
  legendFormatter,
  usePlaybookLang,
} from '../playbook/PlaybookUi';

export interface KamiElyScienceCaseStudyProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  onOpenNotebook?: () => void;
}

const FUNNEL_KEYS: FunnelKey[] = ['video', 'live', 'sku', 'creator'];
const STEP_COLORS = [COLORS.cyan, COLORS.butter, COLORS.amber] as const;

export default function KamiElyScienceCaseStudy(_props: KamiElyScienceCaseStudyProps = {}) {
  const { L, b, n } = usePlaybookLang();
  const [liveScope, setLiveScope] = useState<'girlStyle' | 'shop'>('girlStyle');
  const [affiliateScope, setAffiliateScope] = useState<'all' | 'exGirlStyle'>('all');

  // 4 Interactive Sliders for What-If Simulator
  const [targetCardCvr, setTargetCardCvr] = useState<number>(0.75);
  const [monetizedVideosCount, setMonetizedVideosCount] = useState<number>(220);
  const [targetPromoDiscountPct, setTargetPromoDiscountPct] = useState<number>(35.0);
  const [targetActiveKocPct, setTargetActiveKocPct] = useState<number>(10.0);

  const sim = useMemo(() => {
    const baseCardGmv = 442364954;
    const cardGmvUplift = Math.max(0, baseCardGmv * (targetCardCvr / 0.25) - baseCardGmv);
    const videoGmvUplift = ((monetizedVideosCount * 16400 * 0.45) / 1000) * 135200;
    const savedDiscountMargin = Math.max(0, 62200000 - 123300000 * (targetPromoDiscountPct / 100));
    const newlyActivatedKocs = Math.max(0, Math.round((5713 * targetActiveKocPct) / 100) - 292);
    const affiliateGmvUplift = newlyActivatedKocs * 2200000;
    const totalM = (cardGmvUplift + videoGmvUplift + savedDiscountMargin + affiliateGmvUplift) / 1e6;
    return {
      cardM: Math.round(cardGmvUplift / 1e6),
      videoM: Math.round(videoGmvUplift / 1e6),
      marginM: Math.round(savedDiscountMargin / 1e6),
      affM: Math.round(affiliateGmvUplift / 1e6),
      totalM: Math.round(totalM),
    };
  }, [targetCardCvr, monetizedVideosCount, targetPromoDiscountPct, targetActiveKocPct]);


  const gpmPanels = [
    {
      title: L('Báo cáo 28 ngày', '28-day reported'),
      data: [
        { name: 'Video', v: gpmCompare.platform28d.videoK },
        { name: 'LIVE', v: gpmCompare.platform28d.liveK },
      ],
    },
    {
      title: L('Trung vị 180 ngày', '180-day median'),
      data: [
        { name: 'Video', v: gpmCompare.recomputed180d.videoK },
        { name: 'LIVE', v: gpmCompare.recomputed180d.liveK },
      ],
    },
  ];

  const heroSkus = [
    { code: 'H36 · Bikini liền thân', gmvM: 824.0 },
    { code: 'CV11 · Chân váy chữ A', gmvM: 735.1 },
    { code: 'M18 · Bikini 2 mảnh', gmvM: 464.0 },
    { code: 'H32 · Sét bơi 3 món', gmvM: 391.0 },
    { code: 'K01 · Kính bơi', gmvM: 110.2 },
  ];

  return (
    <div className="w-full space-y-12">
      {/* Giai đoạn 4: Phân tích Affiliate */}
      <UnifiedSection
        id="sec-stage-4-cohort-cltv"
        badge="4"
        coverage="partial"
        gapText={L(
          'Lưu ý phạm vi: TikTok Seller Center ẩn mã khách hàng (customer_id), nên phân tích thực nghiệm được tính trên 5.713 KOC Affiliate và kèm truy vấn SQL chuẩn cho bảng orders.',
          'Scope note: TikTok Seller Center omits customer_id, so empirical charts track the 5,713 Affiliate KOCs alongside standard SQL retention queries for orders.',
        )}
        title={L(
          'Phân tích Affiliate',
          'Affiliate Analysis',
        )}
        takeaway={L(
          `Phân tích toàn diện mạng lưới 5.713 KOC Affiliate theo mốc gia nhập (MIN date) và bậc quy mô follower: tỷ lệ kích hoạt phát sinh đơn (${n(creatorFacts.activationPct, 2)}%), độ tập trung doanh thu HHI, đường cong giữ chân và hiệu suất kênh đồng vận hành 'girl style' (${n(creatorFacts.top1Pct, 1)}% GMV LIVE liên kết).`,
          `Comprehensive analysis of the 5,713 Affiliate KOC network by entry date (MIN date) and follower tier: converting activation rate (${n(creatorFacts.activationPct, 2)}%), HHI revenue concentration, retention curves, and performance of co-operated channel 'girl style' (${n(creatorFacts.top1Pct, 1)}% affiliate LIVE GMV).`,
        )}
        kpis={[
          {
            value: `${n(creatorFacts.sellers)}/${n(creatorFacts.registered)}`,
            label: L('KOC phát sinh đơn (Kích hoạt 5,11%)', 'active converting KOCs (5.11% rate)'),
            sub: L('Nhóm <10k follower kích hoạt 3,9% · nhóm >500k đạt 13,0%', '<10k tier activates at 3.9% · >500k tier reaches 13.0%'),
          },
          {
            value: `HHI = ${n(creatorFacts.hhi)}`,
            label: L('độ tập trung doanh thu Affiliate LIVE', 'Affiliate LIVE revenue concentration'),
            sub: L("'girl style' (kênh đồng vận hành) chiếm 77,3% GMV · Top 10 chiếm 96,4% tổng kênh", "'girl style' (co-operated channel) drives 77.3% GMV · Top 10 represent 96.4% of channel"),
            tone: 'amber',
          },
          {
            value: L('149.000 đ', '149K VND'),
            label: L('giá trị đơn trung bình (AOV chuẩn hóa)', 'normalized Average Order Value (AOV)'),
            sub: L('Theo dõi kèm số mặt hàng/đơn (items per order) & CLTV', 'Tracked alongside items per order & cumulative CLTV'),
          },
        ]}
        finding={L(
          "Phân tích vòng đời theo tháng của 'girl style' (kênh đồng vận hành bởi chính chủ) cho thấy doanh số đạt đỉnh tháng 5–6 rồi sụt giảm nhanh khi tần suất lên phiên LIVE giảm.",
          "Monthly lifecycle tracking of 'girl style' (in-house co-operated channel) shows GMV peaking in May–June before dropping sharply as LIVE session frequency declined.",
        )}
        action={L(
          "Thiết lập truy vấn 'time since last session > 14 days' để cảnh báo sớm kênh đồng vận hành 'girl style' và KOC trụ cột có nguy cơ rời bỏ, đồng thời ươm mầm 200 KOC nhóm 10k–100k follower.",
          "Deploy a 'time since last session > 14 days' query to flag lapsing anchor channels like 'girl style' early while onboarding 200 mid-tier (10k–100k) creators.",
        )}
        codePeek={{ label: L('SQL (Giai đoạn 4)', 'SQL (Stage 4)'), code: sqlSnippets.s4 }}
      >
        <ChartCard
          title={L("Cơ cấu phân bổ có và không có 'girl style' (%)", "GMV distribution with and without 'girl style' (%)")}
          subtitle={L("Đối chiếu cơ cấu đóng góp khi có và không có 'girl style' (kênh đồng vận hành bởi chính chủ)", "Cohort contribution with vs without 'girl style' (in-house co-operated channel)")}
          badge={<Chip tone="amber">{L('Đồng vận hành', 'In-house')}</Chip>}
          height=""
        >
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={creatorTiers} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={34}>
                  <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} head={(l) => `${l} follower`} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar dataKey="gmvPct" name={L("Có 'girl style'", "With 'girl style'")} fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                <Bar dataKey="gmvPctExTop1" name={L("Không có 'girl style'", "Without 'girl style'")} fill={COLORS.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
            <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
              {L('Chú thích phân tích độ nhạy (Sensitivity Note):', 'Sensitivity Analysis Note:')}
            </div>
            <p>
              {L(
                "• 'girl style' (@girlstyle.vn) thuộc nhóm 1k–5k follower nhưng là kênh vệ tinh in-house do chính chủ shop vận hành, tạo ra 56% GMV LIVE.",
                "• 'girl style' (@girlstyle.vn) belongs to the 1k–5k follower tier but is an in-house satellite channel driving 56% of LIVE GMV.",
              )}
            </p>
            <p>
              {L(
                "• Khi loại trừ 'girl style', tổng mẫu số giảm hơn một nửa khiến tỷ trọng tương đối của nhóm 10k–100k follower tăng từ 11% lên 19%, phản ánh thực chất mạng lưới KOC bên ngoài.",
                "• Excluding 'girl style' halves the total denominator, lifting the 10k–100k follower tier's relative share from 11% to 19% to reveal true external KOC traction.",
              )}
            </p>
          </div>
        </ChartCard>

        <ChartCard
          title={
            affiliateScope === 'all'
              ? L('Top 10 Affiliate LIVE: tỷ trọng & tích lũy (%)', 'Top 10 Affiliate LIVE: share & cumulative (%)')
              : L("Top Affiliate LIVE (Bỏ 'girl style'): tỷ trọng & tích lũy (%)", "Top Affiliate LIVE (Excl. 'girl style'): share & cumulative (%)")
          }
          subtitle={
            affiliateScope === 'all'
              ? L('Theo dõi độ tập trung doanh số và mức phụ thuộc theo thứ hạng creator', 'Tracks revenue concentration and dependency across creator ranks')
              : L("Cơ cấu doanh số thực chất giữa các creator bên ngoài khi loại trừ kênh in-house", 'True external creator revenue distribution after removing in-house channel')
          }
          badge={
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-xl bg-[#C8EEF7]/40 p-0.5 dark:bg-slate-800" role="group" aria-label={L("Bộ lọc 'girl style'", "'girl style' filter")}>
                <button
                  type="button"
                  onClick={() => setAffiliateScope('all')}
                  className={`min-h-7 cursor-pointer rounded-lg px-2 text-[11px] font-bold transition-colors ${
                    affiliateScope === 'all'
                      ? 'bg-[#9BE7FA] text-slate-950'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {L("Có 'girl style'", "With 'girl style'")}
                </button>
                <button
                  type="button"
                  onClick={() => setAffiliateScope('exGirlStyle')}
                  className={`min-h-7 cursor-pointer rounded-lg px-2 text-[11px] font-bold transition-colors ${
                    affiliateScope === 'exGirlStyle'
                      ? 'bg-[#9BE7FA] text-slate-950'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {L("Bỏ 'girl style'", "Exclude 'girl style'")}
                </button>
              </div>

              <Chip tone={affiliateScope === 'all' ? 'cyan' : 'amber'}>
                {affiliateScope === 'all' ? 'Top 10 = 82,2%' : 'Top 9 = 57,9%'}
              </Chip>
            </div>
          }
          height=""
        >
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <ComposedChart
                data={affiliateScope === 'all' ? affiliateTop10 : affiliateTopExGirlStyle}
                margin={{ top: 22, right: 14, left: 6, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="rank" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="share"
                  domain={affiliateScope === 'all' ? [0, 60] : [0, 20]}
                  ticks={affiliateScope === 'all' ? [0, 15, 30, 45, 60] : [0, 5, 10, 15, 20]}
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                >
                  <Label
                    value={L('Tỷ trọng (%)', 'Share (%)')}
                    position="top"
                    offset={10}
                    className={TEXT_FILL_CLASS}
                    fontSize={11}
                  />
                </YAxis>
                <YAxis
                  yAxisId="cum"
                  orientation="right"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                >
                  <Label
                    value={L('Tích lũy (%)', 'Cum (%)')}
                    position="top"
                    offset={10}
                    className={TEXT_FILL_CLASS}
                    fontSize={11}
                  />
                </YAxis>
                <Tooltip
                  cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                  content={
                    <ChartTooltip
                      fmt={(v, name) =>
                        name.includes('Tích lũy') || name.includes('Cumulative')
                          ? `${n(v, 1)}% ${L('tích lũy', 'cum.')}`
                          : `${n(v, 2)}% ${L('tỷ trọng', 'share')}`
                      }
                      head={(_l, p) => {
                        const item = (p as any)?.[0]?.payload;
                        return item?.name ? `${item.rank} · ${item.name}` : String(_l);
                      }}
                    />
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar
                  yAxisId="share"
                  dataKey="sharePct"
                  name={affiliateScope === 'all' ? L('Tỷ trọng toàn kênh', 'Total share') : L('Tỷ trọng ngoài GS', 'Share ex-GS')}
                  fill={affiliateScope === 'all' ? COLORS.cyan : COLORS.teal}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="sharePct"
                    position="top"
                    fontSize={10}
                    className={TEXT_FILL_CLASS}
                    formatter={(v: unknown) => `${n(Number(v), 1)}%`}
                  />
                </Bar>
                <Line
                  yAxisId="cum"
                  dataKey="cumulativePct"
                  name={L('Tích lũy', 'Cumulative')}
                  stroke={COLORS.deep}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: COLORS.deep }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
            <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
              {L('Ý nghĩa vận hành (Operational Insight):', 'Operational Insight:')}
            </div>
            {affiliateScope === 'all' ? (
              <p>
                {L(
                  "• Vị trí #1 chính là kênh 'girl style' đóng góp 55,9% GMV affiliate; Top 10 creator nắm giữ 82,2% doanh số kênh.",
                  "• Rank #1 represents the in-house 'girl style' channel driving 55.9% GMV; the top 10 capture 82.2% of channel revenue.",
                )}
              </p>
            ) : (
              <p>
                {L(
                  "• Khi loại trừ 'girl style' (kênh vệ tinh in-house), Gon Pink dẫn đầu với 14,81% GMV, theo sau là CiiN (8,75%) và Hiền Nguyễn (8,25%). Cơ cấu doanh số phân tán lành mạnh hơn, Top 9 creator chiếm 57,9% doanh số affiliate thực tế bên ngoài.",
                  "• Excluding 'girl style' reveals a healthier spread: Gon Pink leads at 14.81% GMV, followed by CiiN (8.75%) and Hien Nguyen (8.25%). The top 9 account for 57.9% of true external affiliate sales.",
                )}
              </p>
            )}
          </div>
        </ChartCard>

        {/* Cột trái: Biểu đồ cột GMV theo tháng kết hợp đường GMV/giờ */}
        <ChartCard
          title={L("Vòng đời 'girl style': GMV & Hiệu suất GMV/giờ", "'girl style' lifecycle: GMV & GMV/Hour")}
          subtitle={L('Cột là doanh thu GMV (Tr đ), đường là hiệu suất GMV/giờ (Tr đ/h)', 'Bars: GMV revenue (M VND), Line: GMV rate per stream hour (M VND/h)')}
          badge={<Chip tone="amber">{L('GMV & GMV/giờ', 'GMV & GMV/h')}</Chip>}
          height=""
        >
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <ComposedChart data={topCreatorMonthly} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis yAxisId="gmv" tick={axisTick} tickLine={false} axisLine={false} width={38}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <YAxis yAxisId="rate" orientation="right" domain={[0, 'auto']} tick={axisTick} tickLine={false} axisLine={false} width={40}>
                  <Label value={L('(Tr/h)', '(M/h)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip
                  cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                  content={
                    <ChartTooltip
                      fmt={(v, name) =>
                        name.includes('/h') || name.includes('/giờ') || name.includes('/hour')
                          ? `${n(v, 2)} ${L('Tr đ/h', 'M VND/h')}`
                          : `${n(v, 1)} ${L('Tr đ', 'M VND')}`
                      }
                    />
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar yAxisId="gmv" dataKey="gmvM" name={L('Doanh thu GMV', 'GMV Revenue')} fill={COLORS.amber} radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="gmvM" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 0)} ${L('Tr', 'M')}`} />
                </Bar>
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="gmvPerHourM"
                  name={L('GMV/giờ', 'GMV/hour')}
                  stroke="#0D7287"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0D7287' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
            <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
              {L('Ý nghĩa doanh thu & hiệu suất (Revenue & Efficiency Insight):', 'Revenue & Efficiency Insight:')}
            </div>
            <p>
              {L(
                "• Doanh thu 'girl style' bùng nổ ở T6 đạt 785,2 Tr đ (đóng góp 55,9% GMV affiliate toàn shop), đạt đỉnh hiệu suất GMV/giờ 1,80 Tr đ/giờ (gấp 6,4 lần so với mức 0,28 Tr đ/giờ ở T8).",
                "• 'girl style' revenue surged in June to 785.2M VND (55.9% of affiliate GMV), peaking at 1.80M VND/hour (6.4x higher than 0.28M VND/hour in August).",
              )}
            </p>
          </div>
        </ChartCard>

        {/* Cột phải: Biểu đồ cột đường với Cột là số phiên LIVE, Đường là số giờ LIVE */}
        <ChartCard
          title={
            liveScope === 'girlStyle'
              ? L("Tần suất vận hành 'girl style': Phiên & Giờ LIVE", "'girl style' frequency: Sessions & Stream hours")
              : L('Tần suất vận hành toàn shop: Phiên & Giờ LIVE', 'Shop-wide frequency: Sessions & Stream hours')
          }
          subtitle={L('Cột là số phiên LIVE, đường là số giờ LIVE (bảng live toàn shop)', 'Bars: session count, Line: stream duration (from shop-wide LIVE table)')}
          badge={
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-1 dark:bg-slate-800">
              {(['girlStyle', 'shop'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setLiveScope(k)}
                  className={`min-h-11 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    liveScope === k ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {k === 'girlStyle' ? "'girl style'" : L('Toàn shop', 'All shop')}
                </button>
              ))}
            </div>
          }
          height=""
        >
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <ComposedChart
                data={liveScope === 'girlStyle' ? topCreatorMonthly : shopWideLiveMonthly}
                margin={{ top: 22, right: 8, left: -4, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis yAxisId="ses" tick={axisTick} tickLine={false} axisLine={false} width={34}>
                  <Label value={L('(ca)', '(ses)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <YAxis yAxisId="hrs" orientation="right" tick={axisTick} tickLine={false} axisLine={false} width={36}>
                  <Label value={L('(giờ)', '(h)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip
                  cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                  content={
                    <ChartTooltip
                      fmt={(v, name) =>
                        name.includes('giờ') || name.includes('hour') ? `${n(v, 1)} giờ` : `${n(v)} ca`
                      }
                    />
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar yAxisId="ses" dataKey="sessions" name={L('Số phiên LIVE', 'LIVE sessions')} fill={COLORS.cyan} radius={[6, 6, 0, 0]} />
                <Line yAxisId="hrs" dataKey="liveHours" name={L('Số giờ LIVE', 'Stream hours')} stroke={COLORS.deep} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.amber, stroke: COLORS.deep, strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
            <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
              {L('Ý nghĩa vận hành (Operational Insight):', 'Operational Insight:')}
            </div>
            <p>
              {liveScope === 'girlStyle'
                ? L(
                    "• Trích xuất từ bảng shop_live: T6 đạt kỷ lục 436,2 giờ LIVE qua 79 ca (5,5h/ca) tạo đỉnh doanh số; sang T8 giảm còn 176,1 giờ (48 ca) khiến GMV suy giảm tương ứng.",
                    "• Extracted from shop_live table: June achieved peak 436.2 stream hours over 79 sessions (5.5h/ses); August dropped to 176.1 hours (48 ses), causing revenue contraction.",
                  )
                : L(
                    "• Toàn shop tích lũy 19.980 giờ livestream trên 7.046 phiên; cao điểm T4–T6 đạt hơn 1.300–1.900 ca/tháng và trên 3.500–5.200 giờ live/tháng.",
                    "• Shop-wide accumulated 19,980 livestream hours across 7,046 sessions; peak Apr–Jun reached over 1,300–1,900 sessions and 3,500–5,200 hours per month.",
                  )}
            </p>
          </div>
        </ChartCard>
      </UnifiedSection>

      {/* Giai đoạn 5: Phễu Chuyển đổi, Giỏ hàng & Thử nghiệm A/B */}
      <UnifiedSection
        id="sec-stage-5-funnel-experiments"
        badge="5"
        coverage="partial"
        gapText={L(
          'Lưu ý phạm vi: Bảng đơn hàng tổng hợp không tách dòng chi tiết (order_detail), nên biểu đồ hiển thị 4 phễu thực thể, 5 Hero SKU P95 làm hạt nhân ghép Combo và kiểm định Mann-Whitney U / hồi quy bậc 2 trên dữ liệu quan sát tự nhiên.',
          'Scope note: Store exports lack line-item order_detail rows, so charts present the 4 entity funnels, top 5 P95 Hero SKUs for bundle pairing, and Mann-Whitney U / quadratic regression on natural experiment data.',
        )}
        title={L(
          'Phễu Chuyển đổi, Giỏ hàng & Thử nghiệm A/B (Split Testing)',
          'Conversion Funnels, Market Basket & A/B Split Testing',
        )}
        takeaway={L(
          'Sử dụng chuỗi LEFT JOIN nối tiếp kèm time box để tìm điểm rơi rụng trên 4 phễu (308/973 video quên gắn giỏ hàng) và Self-JOIN (b.product > a.product) để ghép bộ sản phẩm mua kèm. Khi đánh giá thử nghiệm: dùng Chi-Squared cho chuyển đổi nhị phân, COALESCE(amount, 0) kèm Welch t-test cho chi tiêu liên tục, và Mann-Whitney U / Pre-Post analysis cho thử nghiệm tự nhiên (chứng minh trung vị 180d LIVE đạt 995,9k đ/1k người xem và điểm bão hòa ca LIVE tại 3,1 giờ).',
          'Chains sequential LEFT JOINs within a fixed time box to locate funnel drop-offs (308/973 videos unlinked to carts) and Self-JOIN (b.product > a.product) for cross-sell bundles. For experiment inference: uses Chi-Squared for binary conversion, COALESCE(amount, 0) with Welch t-tests for continuous spend, and Mann-Whitney U / Pre-Post analysis for natural experiments (proving 180d median LIVE reaches 995.9k VND/1k viewers and session saturation hits at 3.1 hours).',
        )}
        kpis={[
          {
            value: '68,35%',
            label: L('tỷ lệ Video gắn giỏ (665/973 video)', 'shoppable Video link rate (665/973)'),
            sub: L('308 video đứt phễu bước 2 · 17 Hero SKU vượt P95 (≥80,35 Tr)', '308 videos drop at step 2 · 17 Hero SKUs exceed P95 (≥80.35M)'),
            tone: 'amber',
          },
          {
            value: '995,9k vs 46,0k',
            label: L('trung vị 180d LIVE vs Video (nghìn đ/1k)', '180d median LIVE vs Video (K VND/1k)'),
            sub: L('Kiểm định Mann-Whitney U & hồi quy cực đại tại 3,1 giờ/ca', 'Mann-Whitney U audit & quadratic saturation at 3.1 hrs/session'),
          },
          {
            value: `+${n(sim.totalM)} ${L('Tr/tháng', 'M/month')}`,
            label: L('tổng giá trị mô phỏng 4 đòn bẩy chiến thuật', 'simulated monthly uplift across 4 levers'),
            sub: L('Đo lường triển khai thực tế qua Pre-/Post-analysis CASE', 'Measured post-rollout via Pre-/Post-analysis CASE windows'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Điểm rớt phễu lớn nhất nằm ở 308 video quên gắn giỏ hàng (31,65%), trong khi nếu bỏ qua COALESCE(amount, 0) cho phiên 0 đơn thì hàm AVG() sẽ làm lệch kết quả kiểm định.',
          'The largest funnel drop-off is 308 unlinked videos (31.65%), while omitting COALESCE(amount, 0) on zero-order sessions biases SQL AVG() t-test comparisons.',
        )}
        action={L(
          'Gắn giỏ bổ sung cho 308 video, ghép combo bán chéo Bikini H36 + Kính bơi K01 bằng Self-JOIN và giới hạn ca LIVE ở ngưỡng 3,0 giờ kết hợp theo dõi Pre-/Post-analysis.',
          'Link carts to the 308 videos, pair Bikini H36 + Swim Goggles K01 via Self-JOIN, and cap LIVE sessions at 3.0 hours with Pre-/Post-analysis tracking.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 5)', 'SQL (Stage 5)'), code: sqlSnippets.s5 }}
      >
        {/* Chuyển 4 biểu đồ Phễu chuyển đổi sang biểu đồ tròn Donut PieChart (Sequential LEFT JOIN) */}
        {FUNNEL_KEYS.map((k) => {
          const item = donutFunnels[k];
          return (
            <ChartCard
              key={k}
              title={b(item.title)}
              subtitle={b(item.subtitle)}
              badge={<Chip tone={item.tone}>{b(item.badge)}</Chip>}
              height=""
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-1">
                {/* Donut Chart with center metric */}
                <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        content={
                          <ChartTooltip
                            fmt={(v) => `${n(Number(v))} (${n((Number(v) / item.total) * 100, 1)}%)`}
                          />
                        }
                      />
                      <Pie
                        data={item.segments.map((s) => ({ ...s, name: b(s.name) }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={66}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {item.segments.map((seg, idx) => (
                          <Cell key={`cell-${idx}`} fill={seg.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {item.centerVal}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {b(item.centerLabel)}
                    </span>
                  </div>
                </div>

                {/* Structured Breakdown List */}
                <div className="flex-1 w-full space-y-2.5">
                  {item.segments.map((seg, idx) => {
                    const pct = n((seg.value / item.total) * 100, 1);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 text-xs rounded-lg p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: seg.color }}
                          />
                          <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                            {b(seg.name)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 tabular-nums">
                          <span className="font-semibold text-slate-900 dark:text-white">{n(seg.value)}</span>
                          <Chip tone={idx === 0 ? 'teal' : idx === 1 ? 'cyan' : 'amber'}>
                            {pct}%
                          </Chip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ChartCard>
          );
        })}


        {/* Biểu đồ 2: Top 5 Hero SKU vượt P95 */}
        <ChartCard
          title={L('Top 5 Hero SKU vượt P95 làm hạt nhân Giỏ hàng (triệu đ)', 'Top 5 P95 Hero SKUs anchoring Basket Bundles (M VND)')}
          subtitle={L('Cơ sở chọn cặp sản phẩm chủ lực ghép combo bán chéo (Self-JOIN)', 'Anchor products selected for cross-sell bundle pairing (Self-JOIN)')}
          badge={<Chip tone="cyan">Self-JOIN P95</Chip>}
          height=""
        >
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heroSkus} layout="vertical" margin={{ top: 4, right: 48, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="code" width={132} tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />} />
                <Bar dataKey="gmvM" name="GMV" fill={COLORS.cyan} radius={[0, 6, 6, 0]}>
                  <LabelList dataKey="gmvM" position="right" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 0)}M`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Biểu đồ 3: Kiểm định GPM Video vs LIVE */}
        <ChartCard
          title={L('Kiểm định GPM Video vs LIVE: 28 ngày vs 180 ngày (nghìn đ)', 'Video vs LIVE GPM audit: 28d vs 180d (K VND)')}
          subtitle={L('Đối chiếu kiểm định Mann-Whitney U giữa 28 ngày và 180 ngày', 'Mann-Whitney U statistical comparison between 28d and 180d')}
          badge={<Chip tone="amber">Mann-Whitney U</Chip>}
          height=""
        >
          <div className="grid grid-cols-2 gap-3 pt-2">
            {gpmPanels.map((g) => (
              <div key={g.title} className="min-w-0">
                <div className="mb-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">{g.title}</div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={g.data} margin={{ top: 20, right: 4, left: 4, bottom: 0 }}>
                      <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)}k`} />} />
                      <Bar dataKey="v" name="GPM" radius={[6, 6, 0, 0]}>
                        {g.data.map((d) => (
                          <Cell key={d.name} fill={d.name === 'Video' ? COLORS.cyan : COLORS.amber} />
                        ))}
                        <LabelList dataKey="v" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 1)}k`} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Biểu đồ 4: Đường cong bão hòa thời lượng LIVE */}
        <ChartCard
          title={L('Đường cong bão hòa thời lượng LIVE tại 3,1 giờ (triệu đ)', 'LIVE duration saturation curve at 3.1 hours (M VND)')}
          subtitle={L('Hiệu suất cận biên đạt đỉnh tại 3,1 giờ trước khi giảm dần do mệt mỏi', 'Marginal efficiency peaks at 3.1h before host fatigue sets in')}
          badge={<Chip tone="rose">{L('Đỉnh 3,1h LIVE', '3.1h peak')}</Chip>}
          height=""
        >
          <div className="h-60 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={KAMI_MATH_STATS.correlation.fittedPolyCurve} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="hours" tick={axisTick} tickLine={false} axisLine={false} unit="h" />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={38}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)} ${L('Tr', 'M')}`} />} />
                <ReferenceLine x={3.1} stroke={COLORS.amber} strokeDasharray="5 4" label={{ value: '3.1h', position: 'top', fontSize: 11, className: TEXT_FILL_CLASS }} />
                <Line type="monotone" dataKey="fittedGmv" name={L('GMV ước lượng', 'Fitted GMV')} stroke={COLORS.deep} strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Biểu đồ 5: Mô phỏng 4 đòn bẩy thử nghiệm (What-If Split Simulator) */}
        <ChartCard
          className="lg:col-span-2"
          title={L('Mô phỏng 4 đòn bẩy thử nghiệm (What-If Split Simulator)', '4-lever experiment simulator (What-If Split Simulator)')}
          subtitle={L('Phân tích thử nghiệm tự nhiên, hiệu suất cận biên và mô phỏng nhân quả', 'Natural experiment audit, marginal saturation curve, and causal simulator')}
          badge={<Chip tone="amber">+{n(sim.totalM)} {L('Tr/tháng', 'M/month')}</Chip>}
          height=""
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>{L('1. CVR Kệ hàng (0,25% → 1,25%)', '1. Shopping Tab CVR (0.25% → 1.25%)')}</span>
                <span className="tabular-nums font-black text-[#0D7287] dark:text-[#9BE7FA]">{targetCardCvr.toFixed(2)}% (+{n(sim.cardM)}M)</span>
              </div>
              <input
                type="range"
                min={0.25}
                max={1.25}
                step={0.05}
                value={targetCardCvr}
                onChange={(e) => setTargetCardCvr(parseFloat(e.target.value))}
                className="w-full accent-[#0D7287] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>{L('2. Gắn giỏ 308 video trống', '2. Monetize 308 unlinked videos')}</span>
                <span className="tabular-nums font-black text-[#0D7287] dark:text-[#9BE7FA]">+{monetizedVideosCount} (+{n(sim.videoM)}M)</span>
              </div>
              <input
                type="range"
                min={0}
                max={308}
                step={4}
                value={monetizedVideosCount}
                onChange={(e) => setMonetizedVideosCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#0D7287] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>{L('3. Giảm chiết khấu KM (từ 50,4%)', '3. Lower promo discount (from 50.4%)')}</span>
                <span className="tabular-nums font-black text-amber-700 dark:text-[#FFE485]">{targetPromoDiscountPct.toFixed(1)}% (+{n(sim.marginM)}M)</span>
              </div>
              <input
                type="range"
                min={25.0}
                max={50.4}
                step={0.5}
                value={targetPromoDiscountPct}
                onChange={(e) => setTargetPromoDiscountPct(parseFloat(e.target.value))}
                className="w-full accent-[#0D7287] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>{L('4. Tỷ lệ KOC có đơn (từ 5,1%)', '4. Active KOC rate (from 5.1%)')}</span>
                <span className="tabular-nums font-black text-amber-700 dark:text-[#FFE485]">{targetActiveKocPct.toFixed(1)}% (+{n(sim.affM)}M)</span>
              </div>
              <input
                type="range"
                min={5.1}
                max={15.0}
                step={0.3}
                value={targetActiveKocPct}
                onChange={(e) => setTargetActiveKocPct(parseFloat(e.target.value))}
                className="w-full accent-[#0D7287] cursor-pointer"
              />
            </div>
          </div>
        </ChartCard>
      </UnifiedSection>
    </div>
  );
}
