'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import {
  ChapterShell,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  Chip,
  ExpandableMoreSection,
  axisTick,
  GRID_STROKE,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Chapter1ContextAndData() {
  const { L, n } = usePlaybookLang();
  const files = V2.ch1.files;
  const trap = V2.ch1.doubleCountTrap;

  const subQuestions = [
    {
      ch: L('Chương 2', 'Chapter 2'),
      q: L('Kênh nào, creator nào và dải giá SKU nào tạo ra doanh thu?', 'Which channels, creators, and SKU price tiers generate GMV?'),
      target: 'sec-ch2-sku',
    },
    {
      ch: L('Chương 3', 'Chapter 3'),
      q: L('Biên độ biến động đến từ mùa vụ sản phẩm hay cường độ marketing?', 'Does volatility stem from product seasonality or marketing intensity?'),
      target: 'sec-ch3-season',
    },
    {
      ch: L('Chương 4', 'Chapter 4'),
      q: L('Creator mới có trụ lại và phát sinh đơn sau tháng đầu không?', 'Do newly onboarded creators stay active and convert past month one?'),
      target: 'sec-ch4-koc',
    },
    {
      ch: L('Chương 5', 'Chapter 5'),
      q: L('Hiệu suất giữa Live với Video, chính chủ với affiliate, Ads với Organic chênh nhau ra sao?', 'How does efficiency differ across Live vs Video, official vs affiliate, and Ads vs Organic?'),
      target: 'sec-ch5-ads',
    },
    {
      ch: L('Chương 6', 'Chapter 6'),
      q: L('Tín hiệu nào cảnh báo sớm trước khi mùa cao điểm gãy đà?', 'Which indicator warns ahead of peak-season exhaustion?'),
      target: 'sec-ch6-conclusion',
    },
  ];

  const scopeAdaptations = [
    {
      orig: L('Phễu giỏ hàng (Xem → Giỏ → Thanh toán)', 'Checkout cart funnel (View → Cart → Checkout)'),
      adapted: L('Phễu cung nội dung (Creator đăng ký → Có phiên → Có đơn)', 'Content supply funnel (Registered → Active → Converting)'),
      why: L('FastMoss không xuất log click giỏ hàng và bước thanh toán cấp người mua.', 'FastMoss lacks buyer-level cart click and checkout logs.'),
    },
    {
      orig: L('Thử nghiệm A/B quảng cáo', 'Controlled Ads A/B test'),
      adapted: L('So sánh quan sát Ads và Organic qua 6 lát cắt kiểm soát', 'Observational Ads vs Organic forest plot across 6 slices'),
      why: L('Chỉ có cờ Ủy Quyền Quảng Cáo, không có phân bổ ngẫu nhiên hay ngân sách chi tiêu.', 'Only ad-authorization flags exist without randomized assignment or spend.'),
    },
    {
      orig: L('Giá trị vòng đời khách hàng (Customer CLTV)', 'Customer CLTV'),
      adapted: L('Đường sống còn Kaplan-Meier và GMV lũy kế theo cohort creator', 'Creator Kaplan-Meier survival and cohort cumulative GMV'),
      why: L('Không có customer_id để nối lịch sử mua lặp lại của người tiêu dùng cuối.', 'No customer_id exists to track repeat buyer transactions.'),
    },
    {
      orig: L('Khai phá văn bản đánh giá sao (Review mining)', 'Product review text mining'),
      adapted: L('Phân loại regex tiêu đề, nhóm hashtag và chủ đề của 4.796 video', 'Regex classification on captions, hashtags, and themes across 4,796 videos'),
      why: L('Bộ dữ liệu không chứa bảng bình luận của người mua sau nhận hàng.', 'Post-purchase buyer review text is absent from the export.'),
    },
  ];

  const schemaJoinMap = [
    {
      layerVi: 'Fact Chuỗi Ngày',
      layerEn: 'Daily Time-Series Facts',
      tables: 'Store (231) · SKU10 (1.790)',
      grainVi: '1 dòng / ngày (Store) · 1 dòng / SKU × ngày (SKU10)',
      grainEn: '1 row / day (Store) · 1 row / SKU × day (SKU10)',
      joinKeys: 'record_date · iso_week · sku_code',
      constraintVi: 'Nối Store ↔ SKU10 theo ngày/tuần; SKU10 bắt đầu từ 30/04 (179 ngày).',
      constraintEn: 'Join Store ↔ SKU10 by date/week; SKU10 starts Apr 30 (179d).',
    },
    {
      layerVi: 'Fact Sự Kiện Live',
      layerEn: 'Livestream Event Facts',
      tables: 'AffLive (8.355) · CrLive (600)',
      grainVi: '1 dòng / phiên phát sóng (gán GMV vào giờ mở ca)',
      grainEn: '1 row / live session (GMV booked at start timestamp)',
      joinKeys: 'koc_hash · session_start_vn (+13h) · iso_week',
      constraintVi: 'CrLive nằm trọn trong AffLive (@shop_official = 595 ca); đối soát với Store theo tuần ISO.',
      constraintEn: 'CrLive is a subset of AffLive (@shop_official = 595 lives); reconcile with Store by ISO week.',
    },
    {
      layerVi: 'Fact Sự Kiện Video',
      layerEn: 'Video Content Event Facts',
      tables: 'AffVid (4.796) · CrVid (2.000)',
      grainVi: '1 dòng / clip gắn giỏ (khử 1 dòng trùng khóa phức hợp)',
      grainEn: '1 row / shoppable clip (deduped 1 composite-key row)',
      joinKeys: 'koc_hash · pub_date · is_ads_auth',
      constraintVi: 'Ngày đăng từ 11/2025 nhưng doanh số đóng góp tính theo cửa sổ trượt 90 ngày.',
      constraintEn: 'Published since Nov 2025 but attributed sales reflect a rolling 90-day window.',
    },
    {
      layerVi: 'Dimension & Snapshot 90N',
      layerEn: '90d Catalog & KOL Snapshots',
      tables: 'KOL (5.041) · ShopProd (339) · CrProd (787) · LiveProd (103)',
      grainVi: '1 dòng / KOC hoặc 1 dòng / mã SKU (cửa sổ 90N / 2 kỳ)',
      grainEn: '1 row / KOC or 1 row / SKU (90d rolling / 2 snapshots)',
      joinKeys: 'koc_hash · sku_code · snapshot_period',
      constraintVi: 'LiveProd không có session_id và cột Lượng Bán Toàn Shop (312.689) là hằng số lũy kế toàn shop.',
      constraintEn: 'LiveProd lacks session_id and its Shop Units column (312,689) is a store-wide cumulative constant.',
    },
  ];

  const trapBars = [
    {
      name: L('AffLive thô', 'Raw AffLive'),
      gmvB: trap.affLiveRawB,
      gmvFormatted: `${n(trap.affLiveRawB, 2)} tỷ`,
      fill: KAMI_BRAND_PALETTE.cyan,
      stroke: KAMI_BRAND_PALETTE.tealInk,
    },
    {
      name: L('CrLive chính chủ', 'Official CrLive'),
      gmvB: trap.crLiveRawB,
      gmvFormatted: `${n(trap.crLiveRawB, 2)} tỷ`,
      fill: KAMI_BRAND_PALETTE.butter,
      stroke: KAMI_BRAND_PALETTE.amberStroke,
    },
    {
      name: L('Cộng thẳng (Sai)', 'Naive sum (Trap)'),
      gmvB: trap.naiveSumB,
      gmvFormatted: `${n(trap.naiveSumB, 2)} tỷ`,
      fill: KAMI_BRAND_PALETTE.negative,
      stroke: KAMI_BRAND_PALETTE.negative,
    },
  ];

  // Timeline Gantt calculation: 2025-11-01 to 2026-10-25 (358 days span)
  const ganttMinMs = new Date('2025-11-01T00:00:00Z').getTime();
  const ganttMaxMs = new Date('2026-10-25T00:00:00Z').getTime();
  const ganttSpanMs = ganttMaxMs - ganttMinMs;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <ChapterShell
      id="sec-ch1-data"
      chapterNum={L('Chương 1', 'Chapter 1')}
      title={L('Bài toán và kiến trúc dữ liệu', 'Problem framing and data architecture')}
      scopeLabel={L(`${V2.meta.totalFiles} tệp · ${n(V2.meta.totalRawRows)} dòng`, `${V2.meta.totalFiles} files · ${n(V2.meta.totalRawRows)} rows`)}
      question={L('Dữ liệu này nói được gì và không nói được gì?', 'What can and cannot be answered with this dataset?')}
      conclusion={L(
        'Dữ liệu chỉ cho phép phân tích theo ngày, phiên, video và creator; có bốn bẫy phải xử lý trước khi tin bất kỳ con số nào.',
        'The dataset supports daily, session, video, and creator analysis only; four data traps must be resolved before trusting any figure.'
      )}
      soWhat={L(
        'Mọi kết luận trong bài đặt ở cấp ngày, phiên, video hoặc creator, và dùng đơn vị tuần hoặc tháng khi đối chiếu chéo; phân tích cấp đơn hàng và vòng đời người mua nằm ngoài phạm vi bộ dữ liệu.',
        'All conclusions operate at the day, session, video, or creator level, using weekly or monthly aggregation; order-level and buyer-level analyses lie outside the scope of this dataset.'
      )}
    >
      {/* 5 câu hỏi con gắn với chương trả lời */}
      <div className="rounded-2xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-2">
        <div className="text-xs font-extrabold text-slate-900 dark:text-white">
          {L('Năm câu hỏi phân tích và chương trả lời tương ứng', 'Five analytical sub-questions mapped to chapters')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {subQuestions.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => jumpTo(item.target)}
              className="min-h-[44px] text-left px-3 py-2 rounded-xl bg-white hover:bg-[#9BE7FA]/25 border border-[#C8EEF7] dark:bg-slate-900 dark:border-slate-800 dark:hover:border-[#9BE7FA]/50 flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <span className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                <strong className="font-bold text-[#074553] dark:text-[#9BE7FA] mr-1.5">{item.ch}:</strong>
                {item.q}
              </span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {/* 1.2 Bẫy cộng đôi (Hiển thị sẵn) */}
      <ChartCard
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `1.2. Bẫy cộng đôi: Cộng thẳng hai bảng Live ra ${n(trap.naiveSumB, 2)} tỷ, vượt cả shop (${n(trap.storeGmvB, 2)} tỷ)`,
          `1.2. Double-counting trap: Naive Live sum hits ${n(trap.naiveSumB, 2)}B vs ${n(trap.storeGmvB, 2)}B store GMV`
        )}
        height="h-auto"
        footer={L(
          `Nguồn: AffLive (${n(files[2].rows)} dòng), CrLive (${n(trap.crLiveTotalSessions)} dòng), Store (${V2.meta.days} ngày). Phiên 17/06 09:08 dài ${trap.exampleSessionDurationH}h đạt ${n(trap.exampleSessionGmvM, 1)} Tr trong khi Store ngày 17/06 ghi ${n(trap.exampleStoreDayGmvM, 1)} Tr.`,
          `Source: AffLive (${n(files[2].rows)}), CrLive (${n(trap.crLiveTotalSessions)}), Store (${V2.meta.days}d). A ${trap.exampleSessionDurationH}h session starting 17/06 09:08 logged ${n(trap.exampleSessionGmvM, 1)}M vs ${n(trap.exampleStoreDayGmvM, 1)}M store daily GMV.`
        )}
      >
        <div className="space-y-3">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trapBars} layout="vertical" margin={{ top: 12, right: 54, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 22]}
                  tick={axisTick}
                  tickFormatter={(v: number) => `${v} tỷ`}
                />
                <YAxis type="category" dataKey="name" width={116} tick={axisTick} />
                <Tooltip
                  content={
                    <ChartTooltip
                      fmt={(v) => `${n(v, 2)} tỷ đ`}
                    />
                  }
                />
                <ReferenceLine
                  x={trap.storeGmvB}
                  stroke={KAMI_BRAND_PALETTE.tealInk}
                  strokeDasharray="4 3"
                  label={{
                    value: L(`Shop ${n(trap.storeGmvB, 2)} tỷ`, `Store ${n(trap.storeGmvB, 2)}B`),
                    position: 'insideTopRight',
                    fill: KAMI_BRAND_PALETTE.deepInk,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="gmvB" name={L('GMV ghi nhận', 'Recorded GMV')} radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  <LabelList
                    dataKey="gmvFormatted"
                    position="right"
                    style={{ fontSize: '11px', fontWeight: 700, fill: '#074553' }}
                  />
                  {trapBars.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke={entry.stroke} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#C8EEF7]/45 text-slate-900 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-3 py-1.5 font-bold">{L('Cách tính', 'Method')}</th>
                  <th className="px-3 py-1.5 font-bold text-right">{L('Tổng Live', 'Live GMV')}</th>
                  <th className="px-3 py-1.5 font-bold text-right">{L('Vượt GMV shop', 'Exceeds store')}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                <tr className="bg-rose-50/50 dark:bg-rose-950/20">
                  <td className="px-3 py-1.5 font-semibold">{L('Cộng thẳng AffLive + CrLive', 'Naive AffLive + CrLive')}</td>
                  <td className="px-3 py-1.5 text-right font-bold text-rose-600 dark:text-rose-400">{n(trap.naiveSumB, 2)} tỷ</td>
                  <td className="px-3 py-1.5 text-right font-bold text-rose-600 dark:text-rose-400">{trap.daysExceedNaiveRaw}/231 ngày</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5">{L(`Bỏ trùng ${trap.overlapSessions} ca @shop_official`, `Dedup ${trap.overlapSessions} @shop_official lives`)}</td>
                  <td className="px-3 py-1.5 text-right font-bold text-[#074553] dark:text-[#9BE7FA]">{n(trap.dedupLiveB, 2)} tỷ ({n(trap.dedupShareOfStorePct, 1)}%)</td>
                  <td className="px-3 py-1.5 text-right">{trap.daysExceedDedup}/231 ngày</td>
                </tr>
                <tr className="bg-[#C8EEF7]/20 dark:bg-slate-900/60">
                  <td className="px-3 py-1.5">{L('Bỏ trùng, gộp theo tuần', 'Deduped, weekly grain')}</td>
                  <td className="px-3 py-1.5 text-right font-bold">{n(trap.dedupLiveB, 2)} tỷ</td>
                  <td className="px-3 py-1.5 text-right">{trap.weeksExceedDedup}/{trap.totalWeeks} tuần (max {n(trap.maxWeekRatio, 1)}x)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ChartCard>

      {/* Ô mới: Định nghĩa quần thể creator */}
      <div className="overflow-x-auto rounded-2xl border border-[#9BE7FA] bg-[#C8EEF7]/25 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-2">
        <div className="text-xs sm:text-sm font-extrabold text-[#074553] dark:text-[#9BE7FA]">
          {L('Định nghĩa bốn nhóm quần thể creator dùng trong phân tích', 'Four creator population definitions across analysis')}
        </div>
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="bg-[#9BE7FA]/40 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="px-3 py-2 font-bold">{L('Tên gọi', 'Designation')}</th>
              <th className="px-3 py-2 font-bold">{L('Thành phần cấu thành', 'Included entities')}</th>
              <th className="px-3 py-2 font-bold text-right">{L('Số lượng', 'Volume')}</th>
              <th className="px-3 py-2 font-bold text-right">{L('Phạm vi sử dụng', 'Referenced in')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C8EEF7] dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr>
              <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{L('Creator ngoài chủ shop', 'External creators (excl. official)')}</td>
              <td className="px-3 py-2">{L('Mọi tài khoản trong AffLive trừ @shop_official, gồm kênh vệ tinh', 'All accounts in AffLive except @shop_official, including satellite')}</td>
              <td className="px-3 py-2 text-right font-semibold">{L('302 (7.760 phiên)', '302 (7,760 sessions)')}</td>
              <td className="px-3 py-2 text-right font-medium text-[#0D7287] dark:text-[#9BE7FA]">{L('Chương 4, Chương 5', 'Chapter 4, Chapter 5')}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{L('Đối tác độc lập', 'Independent affiliate partners')}</td>
              <td className="px-3 py-2">{L('Creator ngoài chủ shop trừ kênh vệ tinh @koc_sat01', 'External creators excluding internal satellite @koc_sat01')}</td>
              <td className="px-3 py-2 text-right font-semibold">301</td>
              <td className="px-3 py-2 text-right font-medium text-[#0D7287] dark:text-[#9BE7FA]">{L('Chương 2, Chương 5', 'Chapter 2, Chapter 5')}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{L('Kênh vệ tinh nội bộ', 'In-house satellite channel')}</td>
              <td className="px-3 py-2 font-mono text-[11px]">@koc_sat01</td>
              <td className="px-3 py-2 text-right font-semibold">{L('1 (261 phiên)', '1 (261 sessions)')}</td>
              <td className="px-3 py-2 text-right font-medium text-[#0D7287] dark:text-[#9BE7FA]">{L('Chương 2, 4, 5', 'Chapter 2, 4, 5')}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{L('Danh bạ KOL 90 ngày', '90-day KOL directory')}</td>
              <td className="px-3 py-2">{L('Tài khoản có doanh số trong file KOL', 'Accounts with sales in KOL file')}</td>
              <td className="px-3 py-2 text-right font-semibold">{L('329 (328 không gồm chủ shop)', '329 (328 excluding official shop)')}</td>
              <td className="px-3 py-2 text-right font-medium text-[#0D7287] dark:text-[#9BE7FA]">{L('Hình 2.3', 'Chart 2.3')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng Dàn ý gốc → Đã làm gì → Vì sao (Hiển thị sẵn) */}
      <div className="overflow-x-auto rounded-2xl border border-[#C8EEF7] dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#C8EEF7]/40 text-slate-900 dark:bg-slate-800/90 dark:text-slate-100">
            <tr>
              <th className="px-3.5 py-2.5 font-bold">{L('Dàn ý gốc', 'Original question')}</th>
              <th className="px-3.5 py-2.5 font-bold">{L('Đã làm gì', 'Implemented analytical proxy')}</th>
              <th className="px-3.5 py-2.5 font-bold">{L('Vì sao', 'Data constraint reason')}</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {scopeAdaptations.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? 'bg-[#C8EEF7]/15 dark:bg-slate-900/50' : ''}>
                <td className="px-3.5 py-2 font-semibold text-slate-900 dark:text-white">{row.orig}</td>
                <td className="px-3.5 py-2 text-[#074553] dark:text-[#9BE7FA] font-medium">{row.adapted}</td>
                <td className="px-3.5 py-2 text-slate-600 dark:text-slate-400">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ma trận Kiến trúc Mô hình Dữ liệu & Khóa Đối Soát 10 Bảng (BA/DA Data Modeling) */}
      <div className="overflow-x-auto rounded-2xl border border-[#C8EEF7] bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs sm:text-sm font-extrabold text-slate-950 dark:text-white">
            {L(
              'Kiến trúc mô hình dữ liệu: Phân tầng Fact / Snapshot, độ hạt (Grain) và khóa đối soát 10 bảng',
              'Data model architecture: Fact / Snapshot tiers, table grain, and cross-table join keys'
            )}
          </div>
          <Chip tone="cyan">{L('4 nhóm bảng · Khóa nối chuẩn hóa', '4 table groups · Standardized join keys')}</Chip>
        </div>
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="bg-[#C8EEF7]/40 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <tr>
              <th className="px-3 py-2 font-bold">{L('Phân tầng dữ liệu', 'Model tier')}</th>
              <th className="px-3 py-2 font-bold">{L('Bảng nguồn (Số dòng)', 'Source tables (Rows)')}</th>
              <th className="px-3 py-2 font-bold">{L('Độ hạt bản ghi (Grain)', 'Record grain')}</th>
              <th className="px-3 py-2 font-bold">{L('Khóa nối kỹ thuật', 'Technical join keys')}</th>
              <th className="px-3 py-2 font-bold">{L('Quy tắc đối soát & Ràng buộc', 'Reconciliation rule & constraint')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C8EEF7]/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {schemaJoinMap.map((item) => (
              <tr key={item.tables}>
                <td className="px-3 py-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {L(item.layerVi, item.layerEn)}
                </td>
                <td className="px-3 py-2 font-semibold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">
                  {item.tables}
                </td>
                <td className="px-3 py-2">{L(item.grainVi, item.grainEn)}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-amber-900 dark:text-[#FFE485]">
                  {item.joinKeys}
                </td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {L(item.constraintVi, item.constraintEn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Thu gọn: Chi tiết nguồn, bẫy ghi nhận và Gantt */}
      <ExpandableMoreSection
        title={L('Xem thêm: chi tiết nguồn dữ liệu, các bẫy ghi nhận và bản đồ Gantt', 'More: source lineage, recording traps, and Gantt timeline map')}
        countLabel={L('2 sơ đồ · 3 bẫy bổ sung', '2 charts · 3 traps')}
      >
        <div className="space-y-3.5">
          {/* Sơ đồ 1.1 */}
          <ChartCard
            badge={<ChartRoleBadge kind="more" />}
            title={L(
              `1.1. Luồng hợp nhất ${V2.meta.totalFiles} tệp gốc (${n(V2.meta.totalRawRows)} dòng) qua tầng làm sạch vào Chương 2-6`,
              `1.1. Data lineage across ${V2.meta.totalFiles} raw tables (${n(V2.meta.totalRawRows)} rows) through staging to Chapters 2-6`
            )}
            footer={L(
              `Nguồn: Kiểm đếm trực tiếp 10 tệp .xlsx trong data/kami/ · Tổng cộng n = ${n(V2.meta.totalRawRows)} bản ghi thô.`,
              `Source: Direct row audit across 10 .xlsx exports in data/kami/ · Total n = ${n(V2.meta.totalRawRows)} raw records.`
            )}
            height="h-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch pt-1">
              {/* Cột 1: 10 file thô */}
              <div className="sm:col-span-6 space-y-1">
                <div className="text-[11px] font-bold text-[#074553] dark:text-[#9BE7FA] mb-1">
                  {L('10 tệp thô FastMoss', '10 raw FastMoss files')}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {files.map((f) => (
                    <div
                      key={f.abbr}
                      className="rounded-lg border border-[#C8EEF7] bg-[#C8EEF7]/25 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between gap-1"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{f.abbr}</span>
                      <span className="text-[11px] font-extrabold tabular-nums text-[#0D7287] dark:text-[#9BE7FA]">
                        {n(f.rows)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột 2: Staging */}
              <div className="sm:col-span-3 rounded-xl border border-[#9BE7FA] bg-[#9BE7FA]/20 p-2.5 dark:border-[#9BE7FA]/40 dark:bg-slate-950 space-y-1.5 text-slate-800 dark:text-slate-200">
                <div className="text-xs font-extrabold text-slate-950 dark:text-white">
                  {L('Staging (stg_*)', 'Staging (stg_*)')}
                </div>
                <ul className="text-[11px] space-y-1 leading-snug list-disc pl-3.5">
                  <li>{L('Dịch CrLive +13h về UTC+7', 'Shift CrLive +13h to UTC+7')}</li>
                  <li>{L(`Tách ${trap.overlapSessions} ca @shop_official trùng`, `Isolate ${trap.overlapSessions} overlapping official lives`)}</li>
                  <li>{L('Gộp nhãn YES/có, NO/không & khử 1 clip trùng', 'Merge YES/có labels & dedup 1 clip')}</li>
                  <li>{L('Băm SHA-256 ẩn danh KOC ID', 'Salted SHA-256 creator IDs')}</li>
                </ul>
              </div>

              {/* Cột 3: Mart -> Chương */}
              <div className="sm:col-span-3 rounded-xl border border-[#FFD14C] bg-[#FFE485]/35 p-2.5 dark:border-[#FFD14C]/40 dark:bg-slate-950 space-y-1.5 text-slate-800 dark:text-slate-200">
                <div className="text-xs font-extrabold text-amber-950 dark:text-[#FFE485]">
                  {L('Mart → Chương 2-6', 'Marts → Ch 2-6')}
                </div>
                <div className="space-y-1 text-[11px] leading-snug tabular-nums">
                  <div><strong>Ch 2:</strong> AffLive, ShopProd, KOL</div>
                  <div><strong>Ch 3:</strong> Store, SKU10, CrLive</div>
                  <div><strong>Ch 4:</strong> AffLive (302 creator), KOL</div>
                  <div><strong>Ch 5:</strong> AffLive, CrLive, AffVid, CrVid, LiveProd</div>
                  <div><strong>Ch 6:</strong> Store, AffLive</div>
                </div>
              </div>
            </div>
          </ChartCard>

          {/* Ba bẫy dữ liệu 2, 3, 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs tabular-nums">
            <div className="rounded-xl border border-[#C8EEF7] bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
              <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
                {L('Bẫy 2 · Lệch thời điểm ghi nhận', 'Trap 2 · Timestamp & start-time skew')}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  `Hai bảng Live lệch 13 giờ và GMV cả phiên (có ca dài ~${trap.exampleSessionDurationH} giờ) gán trọn vào giờ mở ca. Đối chiếu theo tuần giúp rút từ ${trap.daysExceedDedup}/231 ngày xuống ${trap.weeksExceedDedup}/${trap.totalWeeks} tuần vượt.`,
                  `The two Live exports differ by 13 hours and multi-hour session GMV (~${trap.exampleSessionDurationH}h) books to start time. Weekly aggregation narrows daily excess from ${trap.daysExceedDedup}/231d to ${trap.weeksExceedDedup}/${trap.totalWeeks} weeks.`
                )}
              </p>
            </div>
            <div className="rounded-xl border border-[#C8EEF7] bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
              <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
                {L('Bẫy 3 · Khung thời gian khác nhau', 'Trap 3 · Mismatched time windows')}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  'Store theo ngày (09/03 - 25/10), Live đến 20/10, SKU10 từ 30/04, bảng sản phẩm và KOL tính 90 ngày gần nhất, còn CrProd gồm hai kỳ chụp (04/09 và 20/10).',
                  'Store runs Mar 09 - Oct 25, Live ends Oct 20, SKU10 starts Apr 30, product/KOL tables reflect rolling 90 days, and CrProd spans two snapshots.'
                )}
              </p>
            </div>
            <div className="rounded-xl border border-[#FFD14C]/80 bg-[#FFE485]/20 p-3 dark:border-slate-800 dark:bg-[#FFD14C]/10 space-y-1">
              <div className="font-extrabold text-amber-950 dark:text-[#FFE485]">
                {L('Bẫy 4 · Nhãn song ngữ không đồng nhất', 'Trap 4 · Mixed bilingual labels')}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {L(
                  'Cột quảng cáo trong AffVid ghi lẫn YES/NO và có/không (tương tự nhãn danh mục Anh/Việt); phải gộp chuẩn hóa trước khi kiểm định Ads với Organic.',
                  'The ad-authorization column in AffVid mixes YES/NO with Vietnamese có/không (alongside bilingual categories); labels must be unified prior to testing.'
                )}
              </p>
            </div>
          </div>

          {/* 1.3 Bản đồ khung thời gian Gantt */}
          <div className="rounded-xl border border-[#C8EEF7] bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {L('1.3. Bản đồ khung thời gian và chế độ ghi nhận của 10 tệp dữ liệu (Gantt)', '1.3. Timeline coverage map across all 10 source files (Gantt)')}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Chip tone="cyan">{L('Chuỗi ngày / sự kiện liên tục', 'Continuous daily / event log')}</Chip>
              <Chip tone="amber">{L('Cửa sổ trượt 90 ngày / Snapshot 2 kỳ', '90-day rolling / Dual snapshot')}</Chip>
            </div>
            <div className="space-y-1.5 pt-1">
              {files.map((f) => {
                const sMs = new Date(`${f.start}T00:00:00Z`).getTime();
                const eMs = new Date(`${f.end}T00:00:00Z`).getTime();
                const leftPct = Math.max(0, Math.min(100, ((sMs - ganttMinMs) / ganttSpanMs) * 100));
                const widthPct = Math.max(4, Math.min(100 - leftPct, ((eMs - sMs) / ganttSpanMs) * 100));
                const isRolling = f.mode === 'rolling90' || f.mode === 'snapshot2';
                return (
                  <div key={f.abbr} className="grid grid-cols-12 items-center gap-2 text-xs tabular-nums">
                    <div className="col-span-4 sm:col-span-3 font-bold text-slate-900 dark:text-slate-100 truncate">
                      {f.abbr}{' '}
                      <span className="font-normal text-slate-500 dark:text-slate-400">({n(f.rows)})</span>
                    </div>
                    <div className="col-span-5 sm:col-span-6 relative h-5 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`absolute top-0.5 bottom-0.5 rounded ${
                          isRolling
                            ? 'bg-[#FFD14C] border border-amber-600/40'
                            : 'bg-[#9BE7FA] border border-[#0D7287]/40'
                        }`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      />
                    </div>
                    <div className="col-span-3 text-right text-[11px] text-slate-600 dark:text-slate-400">
                      {f.start.slice(5)} → {f.end.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 tabular-nums">
              {L(
                'Nguồn: Kiểm tra min/max cột thời gian trên 10 tệp gốc. Bảng AffVid có clip đăng từ 11/2025 nhưng doanh số đóng góp tính theo cửa sổ trượt 90 ngày gần nhất; CrProd gồm 2 kỳ chốt 04/09 (392 dòng) và 20/10 (395 dòng).',
                'Source: Min/max timestamp audit across 10 raw exports. AffVid includes clips published since Nov 2025 with rolling 90-day attributed sales; CrProd combines Sep 04 (392 rows) and Oct 20 (395 rows) snapshots.'
              )}
            </p>
          </div>
        </div>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}
