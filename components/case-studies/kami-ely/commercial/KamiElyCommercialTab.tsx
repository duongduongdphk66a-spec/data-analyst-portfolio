'use client';

import React, { useState } from 'react';
import { 
  ArrowDown, 
  CheckCircle2, 
  Database, 
  FileSpreadsheet, 
  LayoutDashboard, 
  PackageCheck, 
  Target, 
  TerminalSquare, 
  TrendingUp, 
  Users, 
  Video 
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  COLORS,
  dailySeries,
  dowSeries,
  monthlySeries,
  paretoCurve,
  pipelineMeta,
  priceBands,
  productFacts,
  sqlSnippets,
  storeFacts,
  tableRows,
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
import type { KamiElyDataPayload } from '@/app/types/caseStudies';
import type { KamiElyTabKey } from '../KamiElyTabsNav';

export interface KamiElyCommercialTabProps {
  isEn?: boolean;
  handleTabChange?: (_tab: KamiElyTabKey) => void;
  onOpenProofModal?: (_screenshotId?: string) => void;
  copyDeepLink?: (_id: string) => void;
  telemetryData?: KamiElyDataPayload | null;
}

const SQL_LOOP = ['Explore', 'Profile', 'Clean', 'Shape', 'Analyze'] as const;

export default function KamiElyCommercialTab(_props: KamiElyCommercialTabProps) {
  const { L, b, n } = usePlaybookLang();
  const [tsView, setTsView] = useState<'daily' | 'cumulative'>('daily');
  const [seasonView, setSeasonView] = useState<'monthly' | 'dow'>('monthly');

  const tableChartData = tableRows.map((t) => ({ name: b(t.label), rows: t.rows }));
  const peak = dailySeries.find((d) => d.date === storeFacts.peakDay.date);
  const maxDow = Math.max(...dowSeries.map((d) => d.medianGmv));
  const tickEvery = Math.floor(dailySeries.length / 6);

  const workflowSteps = [
    {
      icon: FileSpreadsheet,
      title: L('1. Hệ thống nguồn (First & Second-Party)', '1. Source Systems (First & Second-Party)'),
      sub: L(
        '8 tệp xuất tự động từ TikTok Seller Center & FastMoss kết hợp tồn kho nội bộ',
        '8 automated exports from TikTok Seller Center & FastMoss joined with internal inventory',
      ),
    },
    {
      icon: Database,
      title: L('2. Kho dữ liệu tập trung (ELT Warehouse)', '2. Centralized Data Warehouse (ELT)'),
      sub: L(
        'Trình nạp Python điều phối lịch trình, kiểm tra kiểu dữ liệu và cảnh báo lỗi',
        'Python ingestion orchestrating schedules, schema validation, and error alerts',
      ),
    },
    {
      icon: TerminalSquare,
      title: L('3. Truy vấn & Phân tích (Vòng lặp 5 bước SQL)', '3. Queries & Analysis (5-Step SQL Loop)'),
      sub: null,
    },
    {
      icon: LayoutDashboard,
      title: L('4. Trình bày kết quả (BI Dashboard & Python ML)', '4. Presentation (BI Dashboard & Python ML)'),
      sub: L(
        'Xuất trực tiếp ra biểu đồ chiến thuật và mô hình hồi quy/kiểm định thống kê',
        'Feeds tactical BI charts and statistical regression/hypothesis models directly',
      ),
    },
  ];

  const businessProblems = [
    {
      icon: TrendingUp,
      tag: L('Mùa vụ & Dòng tiền', 'Seasonality & Cashflow'),
      title: L('Lệch pha Mùa vụ & Điểm rơi Doanh số', 'Seasonal Shifts & Saturation Troughs'),
      context: L(
        'GMV đạt đỉnh 125,6 Tr/ngày vào tháng 6 nhưng giảm 82,9% vào tháng 8 do phụ thuộc dòng bikini mùa hè.',
        'GMV peaked at 125.6M/day in June but plunged 82.9% in August due to heavy reliance on summer swimwear.',
      ),
      objective: L(
        'Phân tích chu kỳ thứ (DOW) & hàm LAG để xoay trục danh mục sang thời trang thu đông từ giữa tháng 7.',
        'Analyze DOW cyclicality & LAG functions to pivot merchandising into autumn/winter lines by mid-July.',
      ),
    },
    {
      icon: Users,
      tag: L('Mạng lưới KOC', 'Creator Network'),
      title: L('Giữ chân KOC & Hiệu quả Hoa hồng', 'KOC Retention & Commission Optimization'),
      context: L(
        'Mạng lưới 1.000+ KOC đem lại 58% doanh số nhưng 83,2% chỉ bán 1 tháng rồi rời bỏ (tỷ lệ churn cao).',
        '1,000+ affiliate KOCs generate 58% of GMV, but 83.2% churn after month 1 with zero repeat orders.',
      ),
      objective: L(
        'Phân tích Cohort CLTV & phân tầng Creator để tối ưu hoa hồng, ưu tiên gửi mẫu cho KOC gắn bó cao.',
        'Run cohort retention & tiering to optimize commissions and seed samples to high-LTV creators.',
      ),
    },
    {
      icon: Video,
      tag: L('Phiên LIVE', 'Live Streams'),
      title: L('Điểm bão hòa Thời lượng Phiên LIVE', 'Diminishing Returns on LIVE Duration'),
      context: L(
        'Tăng lên 106 phiên LIVE/ngày nhưng GMV không tăng tỷ lệ thuận; chi phí studio và ca đêm tăng cao.',
        'Pushing up to 106 daily LIVEs showed flat returns while inflating studio and night-shift labor costs.',
      ),
      objective: L(
        'Mô hình hóa doanh thu cận biên/giờ để chốt mốc tối ưu ~3,1h/phiên, cắt giảm các ca LIVE kém hiệu quả.',
        'Model marginal revenue per hour to pinpoint ~3.1h optimal cut-off, eliminating wasteful overtime.',
      ),
    },
    {
      icon: PackageCheck,
      tag: L('Danh mục SKU', 'Catalog & AOV'),
      title: L('Xử lý 36,5% SKU "Đóng băng" & Nâng AOV', 'Liquidate 36.5% Dead Stock & Lift AOV'),
      context: L(
        '11,5% SKU gánh 80% GMV (Pareto), trong khi 124 SKU (36,5%) chưa từng có đơn, gây đọng vốn lưu động.',
        'Top 11.5% SKUs drive 80% GMV, while 124 SKUs (36.5%) recorded zero orders, locking up capital.',
      ),
      objective: L(
        'Gom nhóm dải giá CASE & đường cong Pareto để xả hàng tồn, ghép combo 149k–189k đ nhằm kéo AOV.',
        'Use CASE price bins & Pareto curves to clear dead stock and bundle 149k–189k VND price anchors.',
      ),
    },
  ];

  return (
    <div className="w-full space-y-12">
      {/* Giai đoạn 1: Xác định Bài toán Kinh doanh & Kiến trúc Luồng Dữ liệu */}
      <UnifiedSection
        id="sec-stage-1-architecture"
        badge="1"
        title={L(
          'Xác định Bài toán Kinh doanh & Kiến trúc Luồng Dữ liệu',
          'Business Problem Definition & Data Flow Architecture',
        )}
        takeaway={L(
          `Giải quyết 4 bài toán kinh doanh trọng tâm của thương hiệu thời trang Kami Ely: biến động mùa vụ (-82,9% GMV tháng 8), tỷ lệ rời bỏ của 1.000+ KOC affiliate, điểm bão hòa ca LIVE (~3,1 giờ) và 36,5% SKU tồn đọng vốn. Hệ thống nạp ${pipelineMeta.tables} bảng (${n(pipelineMeta.rows)} dòng SSOT) từ TikTok Shop & FastMoss về kho tập trung để cung cấp căn cứ ra quyết định thương mại.`,
          `Addresses 4 core commercial challenges for fashion brand Kami Ely: seasonal drop-offs (-82.9% GMV in August), 1,000+ affiliate KOC churn, diminishing returns beyond 3.1h LIVE sessions, and 36.5% dead stock. Custom ETL pipelines ingest ${pipelineMeta.tables} source tables (${n(pipelineMeta.rows)} SSOT rows) to inform tactical merchandising decisions.`,
        )}
        kpis={[
          {
            value: `${pipelineMeta.tables} ${L('bảng nguồn', 'source tables')}`,
            label: L('tích hợp Second-party & First-party', 'Second-party & First-party integration'),
            sub: L('Bao phủ cấp độ cửa hàng, SKU, phiên LIVE, video và KOC', 'Covers store, SKU, LIVE session, video, and KOC grains'),
          },
          {
            value: n(pipelineMeta.rows),
            label: L('dòng dữ liệu giao dịch & tương tác', 'transaction & interaction records'),
            sub: L('Lưu trữ dạng bản chụp nhanh (snapshots) theo khung 28d/90d/180d', 'Stored as structured snapshots across 28d/90d/180d windows'),
          },
          {
            value: L('4 bước · 5 vòng lặp', '4 steps · 5 loops'),
            label: L('quy trình phân tích khép kín', 'end-to-end analysis workflow'),
            sub: L('Explore → Profile → Clean → Shape → Analyze', 'Explore → Profile → Clean → Shape → Analyze'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Dữ liệu bên thứ hai do nền tảng kiểm soát mô hình thường tách rời giữa báo cáo quảng cáo, danh mục hàng hóa và hiệu suất nhà sáng tạo.',
          'Second-party platform exports isolate ad telemetry, product catalogs, and creator performance into separate schemas.',
        )}
        action={L(
          'Chuẩn hóa khóa định danh (sku_id, creator_handle, report_date) ngay tại tầng kho dữ liệu để liên kết tồn kho nội bộ với hành vi mua hàng.',
          'Standardize entity keys (sku_id, creator_handle, report_date) at the warehouse layer to join internal inventory with buyer behavior.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 1)', 'SQL (Stage 1)'), code: sqlSnippets.s1 }}
      >
        <ChartCard
          className="lg:col-span-2"
          height=""
          title={L(
            '4 Bài toán Kinh doanh Trọng tâm Cần Dữ liệu Giải quyết',
            '4 Core Business Problems Addressed via Analytics',
          )}
          subtitle={L(
            'Định hướng toàn bộ luồng xử lý ETL, truy vấn SQL và mô hình phân tích để hỗ trợ ra quyết định thương mại thực tế',
            'Framing all ETL workflows, SQL queries, and econometric modeling to guide tactical commercial actions',
          )}
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C8EEF7]/60 px-2.5 py-1 text-[11px] font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
              <Target className="h-3.5 w-3.5" />
              4 BUSINESS PILLARS
            </span>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {businessProblems.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between space-y-3 transition-colors hover:border-[#9BE7FA]/80 dark:hover:border-[#9BE7FA]/40"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {p.tag}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-950 dark:text-white leading-snug">
                      {p.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {p.context}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#9BE7FA]/40 bg-[#C8EEF7]/25 p-2.5 text-[11px] leading-relaxed text-[#074553] dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                    <strong className="font-bold text-[#074553] dark:text-[#9BE7FA] block mb-0.5">
                      {L('Mục tiêu phân tích:', 'Analytics Objective:')}
                    </strong>
                    {p.objective}
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard
          title={L('Quy mô bản ghi theo 8 bảng dữ liệu nguồn', 'Record volume across 8 source tables')}
          subtitle={L('Kiểm đếm tự động toàn bộ các bảng nạp vào kho phân tích', 'Automated row count profiling across all ingested warehouse tables')}
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart data={tableChartData} layout="vertical" margin={{ top: 4, right: 44, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={116} tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v)} />} />
              <Bar dataKey="rows" name={L('Dòng', 'Rows')} fill={COLORS.cyan} radius={[0, 8, 8, 0]}>
                <LabelList dataKey="rows" position="right" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => n(Number(v))} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={L('Quy trình phân tích 4 bước (Analysis Workflow)', '4-step SQL analysis workflow')}
          subtitle={L('Luồng đi từ hệ thống nguồn qua vòng lặp 5 bước SQL đến trình bày BI', 'Pipeline from source systems through the 5-step SQL loop to BI presentation')}
          height=""
        >
          <ol className="space-y-1">
            {workflowSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title}>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/30 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#9BE7FA] text-slate-950">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-950 dark:text-white">{s.title}</div>
                      {s.sub ? (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">{s.sub}</div>
                      ) : (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {SQL_LOOP.map((x) => (
                            <Chip key={x}>{x}</Chip>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className="flex justify-center py-0.5 text-[#0D7287] dark:text-[#9BE7FA]">
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </ChartCard>
      </UnifiedSection>

      {/* Giai đoạn 2: Khám phá, Lập hồ sơ & Làm sạch Dữ liệu Gian hàng */}
      <UnifiedSection
        id="sec-stage-2-profile-clean"
        badge="2"
        title={L(
          'Khám phá, Lập hồ sơ & Làm sạch Dữ liệu Gian hàng',
          'Explore, Profile Distributions & Clean Store Data',
        )}
        takeaway={L(
          `Sử dụng mệnh đề CASE để gom nhóm dải giá (binning), hàm cửa sổ phân vị NTILE(10) để lập hồ sơ phân phối doanh thu và GROUP BY / HAVING để khử trùng lặp bản ghi. Kiểm tra LEFT JOIN và COALESCE(units_sold, 0) phát hiện ${productFacts.dead}/${productFacts.skus} mã SKU (${n(productFacts.deadPct, 1)}%) chưa phát sinh đơn hàng, trong khi ${productFacts.skusFor80} mã đầu bảng tạo ra 80% GMV.`,
          `Uses CASE statements for price binning, NTILE(10) window functions to profile revenue distributions, and GROUP BY / HAVING to deduplicate tracking records. Checking LEFT JOIN and COALESCE(units_sold, 0) reveals ${productFacts.dead}/${productFacts.skus} SKUs (${n(productFacts.deadPct, 1)}%) with zero orders, while the top ${productFacts.skusFor80} SKUs generate 80% of GMV.`,
        )}
        kpis={[
          {
            value: '88,46%',
            label: L('tỷ trọng GMV ở phân khúc giá >75k đ', 'GMV share in >75k VND price bins'),
            sub: L('Dải chủ lực 75k–250k đ chiếm 86,4% GMV · nhóm <75k đ chiếm 11,5%', 'Core 75k–250k VND tier drives 86.4% GMV · <75k VND accounts for 11.5%'),
          },
          {
            value: `${productFacts.dead} SKU (${n(productFacts.deadPct, 1)}%)`,
            label: L('mã hàng mồ côi chưa phát sinh đơn', 'zero-sale SKUs flagged via COALESCE'),
            sub: L('Phát hiện qua WHERE COALESCE(units_sold, 0) = 0', 'Identified via WHERE COALESCE(units_sold, 0) = 0'),
            tone: 'amber',
          },
          {
            value: `Gini = ${n(productFacts.gini, 3)}`,
            label: L('độ tập trung Pareto (39 SKU tạo 80% GMV)', 'Pareto concentration (39 SKUs = 80% GMV)'),
            sub: L('6/6 quy tắc đối soát khóa ngoại & tổng bảng đạt chuẩn', '6/6 foreign-key & cross-table reconciliation rules pass'),
          },
        ]}
        finding={L(
          'Nếu không khử trùng lặp (DISTINCT / GROUP BY) khi nối bảng sản phẩm với bảng video gắn giỏ nhiều-nhiều, doanh thu báo cáo sẽ bị nhân đôi sai lệch.',
          'Without deduplicating (DISTINCT / GROUP BY) across many-to-many joins between products and shoppable videos, reported GMV is artificially inflated.',
        )}
        action={L(
          'Định hình dữ liệu chuẩn gọn gàng (tidy data) ở cấp độ từng SKU, gắn cờ high_value = true cho 39 mã đầu bảng để ưu tiên hiển thị và miễn phí vận chuyển.',
          'Shape outputs into tidy SKU-level tables and flag high_value = true on the top 39 SKUs to prioritize inventory and discounted shipping offers.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 2)', 'SQL (Stage 2)'), code: sqlSnippets.s2 }}
      >
        <ChartCard
          title={L('Gom nhóm dải giá bằng CASE: tỷ trọng SKU, sản lượng & GMV (%)', 'CASE price binning: SKU, unit volume & GMV share (%)')}
          subtitle={L('Xoay bảng (pivoting) đối chiếu cấu trúc danh mục và hiệu quả tạo tiền', 'Pivoted comparison between catalog listing share and revenue contribution')}
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <BarChart data={priceBands} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="band" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false}>
                <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar dataKey="sku" name="SKU" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
              <Bar dataKey="units" name={L('Sản lượng', 'Units')} fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gmv" name="GMV" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={L('Đường cong phân vị Pareto (NTILE): % & Số lượng SKU vs % GMV tích lũy', 'Pareto quantile curve (NTILE): cumulative % & count of SKUs vs % GMV')}
          subtitle={L(
            `6,3% số mã sản phẩm (${productFacts.skusFor80}/${productFacts.skus} SKU) đóng góp 80% tổng doanh thu`,
            `6.3% of listed products (${productFacts.skusFor80}/${productFacts.skus} SKUs) account for 80% of total revenue`,
          )}
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C8EEF7]/60 px-2.5 py-1 text-[11px] font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              6/6 REC PASS
            </span>
          }
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <AreaChart data={paretoCurve} margin={{ top: 22, right: 12, left: -18, bottom: 18 }}>
              <defs>
                <linearGradient id="pbParetoTab1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="sku"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={(props: { x?: number; y?: number; payload?: { value?: number | string } }) => {
                  const { x = 0, y = 0, payload } = props;
                  const v = Number(payload?.value ?? 0);
                  const skuCount = Math.round((v * productFacts.skus) / 100);
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={0} textAnchor="middle" fontSize={11} className={TEXT_FILL_CLASS}>
                        <tspan x={0} dy={12}>{v}%</tspan>
                        <tspan x={0} dy={14} fontSize={10} className="fill-slate-500 dark:fill-slate-400">({skuCount} SKU)</tspan>
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false}>
                <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip
                content={
                  <ChartTooltip
                    fmt={(v) => `${n(v, 1)}%`}
                    head={(l) => {
                      const pct = Number(l);
                      const skus = Math.round((pct * productFacts.skus) / 100);
                      return `${n(pct, 1)}% SKU (${skus}/${productFacts.skus} SKU)`;
                    }}
                  />
                }
              />
              <ReferenceLine y={80} stroke={COLORS.amber} strokeDasharray="5 4" label={{ value: '80% GMV', position: 'insideBottomRight', fontSize: 11, className: TEXT_FILL_CLASS }} />
              <ReferenceLine
                x={productFacts.skusFor80Pct}
                stroke={COLORS.teal}
                strokeDasharray="5 4"
                label={{ value: `${n(productFacts.skusFor80Pct, 1)}% (${productFacts.skusFor80} SKU)`, position: 'top', fontSize: 11, className: TEXT_FILL_CLASS }}
              />
              <Area type="monotone" dataKey="gmv" name={L('GMV tích lũy', 'Cumulative GMV')} stroke={COLORS.teal} strokeWidth={2.5} fill="url(#pbParetoTab1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </UnifiedSection>

      {/* Giai đoạn 3: Phân tích Chuỗi thời gian: Xu hướng Doanh số & Lập lịch Khuyến mãi */}
      <UnifiedSection
        id="sec-stage-3-timeseries"
        badge="3"
        title={L(
          'Phân tích Chuỗi thời gian: Xu hướng Doanh số & Lập lịch Khuyến mãi',
          'Time-Series Analysis: Sales Trends & Promotion Scheduling',
        )}
        takeaway={L(
          `Áp dụng hàm cửa sổ AVG() OVER (ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) để tính trung bình trượt 7 ngày (MA7) làm mượt nhiễu ngày, và SUM() OVER () để theo dõi doanh số lũy kế (YTD đạt 12,74 Tỉ đ). Kiểm tra với chiều thời gian (date_dim) xác nhận ${storeFacts.sparseDays}/${storeFacts.days} ngày thưa; phân tích cùng kỳ (LAG) chỉ ra đỉnh tháng 6 (125,6 Tr/ngày) và mức sụt giảm 82,9% vào tháng 8.`,
          `Applies AVG() OVER (ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) for 7-day moving averages (MA7) to smooth daily noise, and SUM() OVER () for cumulative YTD tracking (12.74B VND). Joining against date_dim confirms ${storeFacts.sparseDays}/${storeFacts.days} sparse days; period-over-period LAG analysis highlights the June peak (125.6M/day) and 82.9% August drop.`,
        )}
        kpis={[
          {
            value: L('70,8 Tr/ngày', '70.8M/day'),
            label: L('trung bình trượt toàn chu kỳ 180 ngày', '180-day rolling daily average'),
            sub: L('Ngày đỉnh 09/06 đạt 321,1 Tr đ · lũy kế 12,74 Tỉ đ', 'Peak day Jun 09 hit 321.1M VND · cumulative 12.74B VND'),
          },
          {
            value: `${storeFacts.sparseDays}/${storeFacts.days} ${L('ngày', 'days')}`,
            label: L('kiểm tra dữ liệu thưa (sparse data = 0)', 'sparse days check via date_dim'),
            sub: L('Liên tục phát sinh đơn hàng suốt 180 ngày quan sát', 'Continuous daily order activity across all 180 days'),
          },
          {
            value: '-82,9%',
            label: L('biến động Period-over-Period (T08 vs T06)', 'Period-over-Period drop (Aug vs Jun)'),
            sub: L('Tính mùa vụ thứ trong tuần (DOW) đạt đỉnh vào Chủ Nhật', 'Day-of-week (DOW) median revenue peaks on Sundays'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'So sánh tháng-trên-tháng (MoM bằng hàm LAG) cho thấy tốc độ tăng trưởng đạt +96% vào tháng 6 nhưng đảo chiều -44% tháng 7 và -69% tháng 8 do phụ thuộc đồ bơi mùa hè.',
          'Month-over-month LAG comparisons show +96% growth in June followed by -44% in July and -69% in August due to seasonal swimwear reliance.',
        )}
        action={L(
          'Sử dụng chu kỳ thứ trong tuần (DOW) để dồn ngân sách khuyến mãi và ca LIVE dài vào Thứ Bảy – Chủ Nhật, đồng thời nhập kho dòng sản phẩm thu đông từ giữa tháng 7.',
          'Use day-of-week cyclicality to concentrate promo budgets on Saturday–Sunday peaks, while transitioning inventory to autumn/winter lines by mid-July.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 3)', 'SQL (Stage 3)'), code: sqlSnippets.s3 }}
      >
        <ChartCard
          title={
            tsView === 'daily'
              ? L('GMV theo ngày và trung bình trượt 7 ngày MA7 (triệu đ)', 'Daily GMV & 7-day moving average MA7 (M VND)')
              : L('Doanh số lũy kế (Cumulative YTD) qua 180 ngày (tỉ đ)', '180-day cumulative GMV trajectory (B VND)')
          }
          subtitle={L('Sử dụng hàm cửa sổ trượt để tách xu hướng thực khỏi nhiễu ngắn hạn', 'Window functions smoothing daily volatility and tracking running totals')}
          badge={
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-1 dark:bg-slate-800">
              {(['daily', 'cumulative'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTsView(k)}
                  className={`min-h-11 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    tsView === k ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {k === 'daily' ? L('MA7 ngày', 'Daily MA7') : L('Lũy kế', 'Cumulative')}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            {tsView === 'daily' ? (
              <ComposedChart data={dailySeries} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" interval={tickEvery} tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar dataKey="gmv" name="GMV" fill={COLORS.cyan} radius={[2, 2, 0, 0]} />
                <Line dataKey="ma7" name={L('Trung bình 7 ngày', '7-day MA')} stroke={COLORS.deep} strokeWidth={2.5} dot={false} connectNulls={false} />
                {peak && <ReferenceDot x={peak.label} y={peak.gmv} r={5} fill={COLORS.amber} stroke={COLORS.deep} strokeWidth={2} />}
              </ComposedChart>
            ) : (
              <AreaChart data={dailySeries} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="pbCumTab1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.7} />
                    <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" interval={tickEvery} tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tỉ đ)', '(B VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)} ${L('Tỉ', 'B')}`} />} />
                <Area type="monotone" dataKey="cumulativeB" name={L('GMV lũy kế', 'Cumulative GMV')} stroke={COLORS.deep} strokeWidth={2.5} fill="url(#pbCumTab1)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={
            seasonView === 'monthly'
              ? L('So sánh cùng kỳ theo tháng (MoM % với hàm LAG)', 'Month-over-Month comparison (LAG function)')
              : L('Tính mùa vụ theo thứ trong tuần (DOW trung vị, triệu đ)', 'Day-of-week cyclicality (median GMV, M VND)')
          }
          subtitle={L('Phục vụ lập kế hoạch tồn kho và lịch chạy chiến dịch khuyến mãi', 'Guides seasonal inventory planning and weekly promotion scheduling')}
          badge={
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-1 dark:bg-slate-800">
              {(['monthly', 'dow'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSeasonView(k)}
                  className={`min-h-11 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    seasonView === k ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {k === 'monthly' ? L('Theo tháng', 'Monthly') : L('Theo thứ', 'Day of Week')}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            {seasonView === 'monthly' ? (
              <BarChart data={monthlySeries} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr/ngày', 'M/day')}`} />} />
                <Bar dataKey="gmvPerDay" name="GMV" radius={[6, 6, 0, 0]}>
                  {monthlySeries.map((m) => (
                    <Cell key={m.month} fill={m.month === '2026-06' ? COLORS.amber : COLORS.cyan} fillOpacity={m.isPartial ? 0.45 : 1} />
                  ))}
                  <LabelList dataKey="gmvPerDay" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => n(Number(v), 1)} />
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={dowSeries} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey={L('day', 'dayEn')} tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />} />
                <Bar dataKey="medianGmv" name={L('Trung vị', 'Median')} radius={[6, 6, 0, 0]}>
                  {dowSeries.map((d) => (
                    <Cell key={d.day} fill={d.medianGmv === maxDow ? COLORS.amber : COLORS.cyan} />
                  ))}
                  <LabelList dataKey="medianGmv" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => n(Number(v), 1)} />
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
      </UnifiedSection>
    </div>
  );
}
