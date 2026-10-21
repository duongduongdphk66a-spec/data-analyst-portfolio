'use client';

import React from 'react';
import {
  ArrowDown,
  BarChart3,
  Calendar,
  CheckCircle2,
  Database,
  FileCheck2,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Package,
  ShieldAlert,
  Target,
  TerminalSquare,
  Users,
  Video,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { COLORS, pipelineMeta, tableRows } from '../playbook/playbookData';
import {
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  axisTick,
  usePlaybookLang,
} from '../playbook/PlaybookUi';

export default function Stage1BusinessAndDataArchitecture() {
  const { L, b, n } = usePlaybookLang();

  const tableChartData = tableRows.map((t) => ({ name: b(t.label), rows: t.rows }));

  // 1.2: 5 Câu hỏi phân tích con
  const subQuestions = [
    {
      id: 1,
      question: L(
        'Doanh thu biến động do mùa vụ hay do cường độ marketing?',
        'Is revenue driven by seasonality or marketing intensity?',
      ),
      metrics: L('GMV ngày/tháng, số KOC và số phiên Live mỗi ngày', 'Daily/monthly GMV, active KOCs & daily LIVE count'),
      table: 'Store Detail Page (226 ngày)',
      decision: L('Lịch chiến dịch, kế hoạch nhập hàng & tồn kho', 'Campaign scheduling, stock & inventory planning'),
      icon: Calendar,
      tone: 'cyan' as const,
    },
    {
      id: 2,
      question: L(
        'Doanh thu phụ thuộc kênh và hình thức nội dung nào?',
        'Which channels and content formats drive revenue?',
      ),
      metrics: L('Tỷ trọng GMV theo kênh, Live / Video / Product Card', 'GMV share by channel: Live / Video / Product Card'),
      table: 'Shop LIVE, Shoppable Videos, Creators Merged',
      decision: L('Phân bổ ngân sách quảng cáo và nhân lực sản xuất', 'Budget & headcount allocation across content formats'),
      icon: Video,
      tone: 'amber' as const,
    },
    {
      id: 3,
      question: L(
        'Kênh chính chủ đang khỏe hay yếu so với toàn shop?',
        'Is the in-house brand channel healthy or lagging?',
      ),
      metrics: L('Follower, xếp hạng, GPM/1k views, tỷ lệ ra đơn', 'Followers, rankings, GPM/1k views, order conversion'),
      table: 'Video List, Live List, Creator Dashboard',
      decision: L('Ưu tiên đầu tư phòng studio Video hay ca LIVE', 'Investment priority: Video production vs Live studios'),
      icon: Target,
      tone: 'cyan' as const,
    },
    {
      id: 4,
      question: L(
        'Mạng lưới affiliate có đa dạng thật sự không?',
        'Is the affiliate KOC network genuinely diversified?',
      ),
      metrics: L('Tỷ lệ kích hoạt, phân bổ Pareto, tỷ trọng ngoài GS', 'Activation rate, Pareto core, share ex-girl style'),
      table: 'Creators Merged, Shop LIVE',
      decision: L('Chính sách hoa hồng, tiêu chuẩn tuyển và giữ KOC', 'Commission structure, recruitment & retention criteria'),
      icon: Users,
      tone: 'amber' as const,
    },
    {
      id: 5,
      question: L(
        'Sản phẩm và phân khúc giá nào là xương sống danh mục?',
        'Which SKUs and price points anchor the catalog?',
      ),
      metrics: L('Đường cong Pareto SKU, tỷ trọng theo dải giá', 'Pareto SKU curve, revenue share by price band'),
      table: 'Product Data (331 SKU)',
      decision: L('Cấu trúc danh mục, định giá niêm yết & tạo combo', 'Catalog breadth, anchoring price tiers & bundle design'),
      icon: Package,
      tone: 'cyan' as const,
    },
  ];

  // 1.4: Phân loại mức chi tiết dữ liệu (Data Grain)
  const dataGrains = [
    {
      grain: L('Theo ngày (Daily)', 'Daily Grain'),
      table: 'Store Detail Page Overview',
      key: 'report_date',
      desc: L('226 dòng SSOT theo dõi GMV, lượt hiển thị, đơn hàng toàn shop (09/03 – 20/10/2026)', '226 SSOT daily records tracking GMV, impressions, orders (Mar 09 – Oct 20, 2026)'),
    },
    {
      grain: L('Theo sản phẩm (SKU)', 'Product SKU Grain'),
      table: 'Shop Products & Creator Products',
      key: 'product_id, sku_id',
      desc: L('339 SKU niêm yết và 787 dòng sản phẩm creator (hợp nhất 2 snapshot Hè & Thu)', '339 listed SKUs and 787 creator product records (2 seasonal snapshots merged)'),
    },
    {
      grain: L('Theo Creator', 'Creator Grain'),
      table: 'Affiliate KOL / Creators',
      key: 'creator_handle',
      desc: L('6.086 creator liên kết, bậc follower, số đơn phát sinh và GMV', '6,086 affiliate creators, follower tiers, order count & GMV'),
    },
    {
      grain: L('Theo ca LIVE (Session)', 'Live Session Grain'),
      table: 'Shop LIVE & Creator Livestreams',
      key: 'session_id, start_time',
      desc: L('600 phiên LIVE chính chủ và 7.367 phiên LIVE toàn shop liên kết', '600 own LIVE sessions and 7,367 shop-wide affiliate LIVE sessions'),
    },
    {
      grain: L('Theo Video', 'Video Grain'),
      table: 'Shoppable Videos & Creator Videos',
      key: 'video_id',
      desc: L('276 video chính chủ và 4.796 video gắn giỏ hàng của nhà sáng tạo', '276 own videos and 4,796 affiliate shoppable videos'),
    },
  ];

  // 1.6: Bảng đối soát dữ liệu (Reconciliation)
  const reconciliationRules = [
    {
      check: L('Sản lượng kênh chính chủ giữa Creators Merged và Goods for Sale', 'Own-channel volume between Creators Merged & Goods for Sale'),
      expected: L('Khớp tuyệt đối', 'Exact match'),
      actual: L('Khớp chính xác 20.027 sản phẩm', 'Exact match: 20,027 units'),
      status: 'pass' as const,
      statusLabel: L('Khớp 100%', 'Pass 100%'),
      note: L('Tính nhất quán cao giữa danh mục sản phẩm bày bán và báo cáo kênh creator.', 'High consistency between listed catalog goods and creator performance.'),
    },
    {
      check: L('Số phiên LIVE chính chủ giữa Creator Live List và Shop LIVE', 'Own LIVE session count between Creator Live List & Shop LIVE'),
      expected: L('Bằng nhau', 'Equal count'),
      actual: L('Lệch 5 phiên (475 phiên vs 470 phiên)', 'Mismatch: 475 vs 470 sessions'),
      status: 'warn' as const,
      statusLabel: L('Lệch 5 phiên', '5-session diff'),
      note: L('Đã giải mã ở Mục 2.3: Lệch 13 tiếng (+13h khớp 470/470); 5 phiên thừa gồm 1 phiên 07/03 và 4 phiên test 0 GMV.', 'Solved in Stage 2.3: 13h lag (+13h matches 470/470); 5 surplus sessions are 1 Mar 07 pre-window & 4 zero-GMV test runs.'),
    },
    {
      check: L('GMV LIVE chính chủ giữa hai nguồn trên', 'Own LIVE GMV between Creator Live List & Shop LIVE'),
      expected: L('Bằng nhau', 'Equal GMV'),
      actual: L('Lệch nhẹ 91.000 đ (7.023.530.158 vs 7.023.621.158 đ)', 'Minor diff: 91K VND (0.001%)'),
      status: 'warn' as const,
      statusLabel: L('Lệch 0,001%', '0.001% diff'),
      note: L('Đã giải mã ở Mục 2.3: Khớp toán học trọn vẹn từ 190.000 đ (lệch phiên 06/05) − 99.000 đ (phiên 07/03) = đúng 91.000 đ.', 'Solved in Stage 2.3: Exact math reconciliation: 190k VND (May 06 session diff) − 99k VND (Mar 07 session) = 91k VND.'),
    },
    {
      check: L('Khử trùng lặp giữa Shop LIVE tập 1 và tập 2', 'Deduplication across Shop LIVE Part 1 & Part 2'),
      expected: L('Không có bản ghi trùng', 'Zero duplicates'),
      actual: L('Khử trùng lặp qua DISTINCT session_id', 'Deduplicated via DISTINCT session_id'),
      status: 'info' as const,
      statusLabel: L('Đã làm sạch', 'Deduplicated'),
      note: L('Bảo đảm không bị nhân đôi số liệu khi gom file xuất định kỳ theo 2 đợt.', 'Prevents artificial row inflation when merging split periodic exports.'),
    },
    {
      check: L('Tổng GMV theo ngày chu kỳ 226 ngày', '226-day Daily GMV Time-Series'),
      expected: L('Cộng khớp SSOT', 'Exact SSOT sum'),
      actual: L('Khớp chính xác 14,84 tỷ VNĐ (14.842.597.762 đ)', 'Exact match: 14.84B VND'),
      status: 'pass' as const,
      statusLabel: L('Khớp SSOT', 'SSOT Valid'),
      note: L('Xác minh toàn vẹn chuỗi thời gian không bị thất thoát ngày nào trong 226 ngày liên tục.', 'Confirms complete time-series integrity with zero missing days across 226 continuous days.'),
    },
  ];

  // 1.5: 5 bước luồng kiến trúc
  const pipelineSteps = [
    {
      step: '1',
      title: L('Hệ thống nguồn (Source)', 'Source Systems'),
      detail: L('9 bảng dữ liệu xuất từ nền tảng (nạp qua MySQL & script tự động).', '9 raw tables exported from platform (ingested into MySQL with automated ETL).'),
      icon: FileSpreadsheet,
      badge: `${pipelineMeta.tables} Bảng`,
    },
    {
      step: '2',
      title: L('Nạp & Kiểm tra (Ingestion)', 'Ingestion & Validation'),
      detail: L('Script Python chuẩn hóa snake_case, kiểm tra kiểu dữ liệu và chạy test đối chiếu tự động.', 'Python script standardizes schemas, casts types, and runs automated checks.'),
      icon: Database,
      badge: 'Python ETL',
    },
    {
      step: '3',
      title: L('Kho dữ liệu 3 lớp (Warehouse)', '3-Tier Warehouse'),
      detail: L('Mô hình hóa raw (gốc) → staging (làm sạch) → mart (tổng hợp daily, creator, session).', 'raw (audit) → staging (cleaned) → mart (daily/creator/session aggregates).'),
      icon: Layers,
      badge: 'raw / staging / mart',
    },
    {
      step: '4',
      title: L('Phân tích SQL (5-Step Loop)', 'SQL Analytics Loop'),
      detail: L('Vòng lặp chuẩn: Khám phá → Lập hồ sơ → Làm sạch → Định hình → Phân tích chuyên sâu.', 'Standard loop: Explore → Profile → Clean → Shape → Analyze.'),
      icon: TerminalSquare,
      badge: '5 Loops',
    },
    {
      step: '5',
      title: L('Trình bày (Presentation)', 'BI & Reporting'),
      detail: L('Dashboard BI thương mại, kiểm định giả thuyết thống kê và khuyến nghị hành động.', 'Commercial BI dashboard, statistical hypothesis tests & actionable playbooks.'),
      icon: LayoutDashboard,
      badge: 'BI & Decision',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1.1: Bối cảnh và Bài toán Trọng tâm */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.1
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Bối cảnh và Bài toán Trọng tâm', 'Business Context & Core Problem Statement')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Thương hiệu thời trang đồ bơi & bikini Kami Ely trên TikTok Shop', 'Swimwear & Bikini Fashion Brand Kami Ely on TikTok Shop')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">Lũy kế: 31,6 tỷ đ</Chip>
            <Chip tone="amber">226 ngày: 14,84 tỷ đ</Chip>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {L(
                'Shop thời trang đồ bơi và bikini trên TikTok Shop đạt doanh thu lũy kế 31,6 tỷ VNĐ, riêng chuỗi 226 ngày phân tích đầy đủ đạt 14,84 tỷ VNĐ (100.669 sản phẩm). Doanh thu theo tháng có độ dốc cực đoan: tăng vọt từ 0,95 tỷ (T3) lên đỉnh 3,77 tỷ (T6), sau đó giảm dần khi bước vào giai đoạn chuyển mùa thu đông.',
                'TikTok Shop swimwear brand recorded 31.6B VND cumulative GMV, with 14.84B VND generated across 226 continuous days (100,669 units). Monthly revenue displays clear seasonality: surging from 0.95B (March) to a 3.77B peak (June), before moderating into the autumn transition.',
              )}
            </p>

            <div className="rounded-2xl border-l-4 border-l-[#0D7287] bg-[#F0F9FB] p-3.5 dark:bg-slate-800/80 dark:border-l-[#9BE7FA]">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA] mb-1 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                {L('Câu hỏi trọng tâm (Core Inquiry):', 'Core Business Inquiry:')}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white italic leading-snug">
                {L(
                  '"Doanh thu của shop đến từ đâu, phụ thuộc vào yếu tố nào, và những tín hiệu nào cho thấy rủi ro trước khi mùa cao điểm kết thúc?"',
                  '"Where does revenue originate, what key levers dictate growth, and what early signals alert operational risk before the peak season collapses?"',
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                <Users className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {L('Đối tượng thụ hưởng', 'Target Decision Makers')}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  'Chủ shop (Store Owner) và Đội ngũ vận hành (Commercial Ops), những người chịu trách nhiệm trực tiếp về:',
                  'Store Owner and Commercial Operations leads responsible directly for:',
                )}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD14C]" />
                  {L('Lịch chiến dịch & xoay trục tồn kho mùa vụ', 'Campaign calendar & seasonal inventory pivot')}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9BE7FA]" />
                  {L('Phân bổ ngân sách giữa phòng Live và Video', 'Studio budget allocation: LIVE vs Video')}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D7287]" />
                  {L('Chính sách hoa hồng & chọn lọc affiliate KOC', 'Commission tiers & affiliate KOC governance')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 1.2: Năm Câu hỏi con & Bảng ma trận quyết định */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.2
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Năm Câu hỏi Con và Ma trận Quyết định Phục vụ', '5 Analytical Sub-Questions & Decision Matrix')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Ánh xạ chỉ số đo lường, bảng dữ liệu nguồn và quyết định thực tế', 'Mapping metrics, source tables, and targeted business decisions')}
              </p>
            </div>
          </div>
          <Chip tone="cyan">5 Sub-Questions</Chip>
        </div>

        {/* Bảng 5 câu hỏi con */}
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">{L('Câu hỏi phân tích', 'Sub-Question')}</th>
                <th className="py-2.5 px-3 min-w-[170px]">{L('Chỉ số đo lường', 'Core Metric')}</th>
                <th className="py-2.5 px-3 min-w-[150px]">{L('Bảng dữ liệu nguồn', 'Source Table')}</th>
                <th className="py-2.5 px-3 min-w-[180px]">{L('Quyết định phục vụ', 'Decision Served')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subQuestions.map((q) => {
                const Icon = q.icon;
                return (
                  <tr key={q.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] mx-auto">
                        {q.id}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#0D7287] dark:text-[#9BE7FA]" />
                        <span>{q.question}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {q.metrics}
                    </td>
                    <td className="py-2.5 px-3">
                      <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono text-[#074553] dark:text-[#9BE7FA]">
                        {q.table}
                      </code>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200 font-medium">
                      {q.decision}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Callout Câu hỏi đã loại bỏ do hạn chế dữ liệu */}
        <div className="mt-4 rounded-2xl border border-amber-200 bg-[#FFE485]/20 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-[#FFE485]">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{L('Câu hỏi đã chủ động loại bỏ (Data Limitation Notice):', 'Omitted Analytical Question (Data Limitation Notice):')}</span>
          </div>
          <p className="mt-1 leading-relaxed text-amber-950 dark:text-amber-200">
            {L(
              'Câu hỏi "Vì sao khách mua lặp lại, vì sao khách rời bỏ" (từng xuất hiện trong dàn ý sơ khai) đã được lược bỏ. Dữ liệu hiện có ở mức tổng hợp (aggregated snapshots), không có mã định danh khách hàng (customer_id) hay dòng chi tiết đơn hàng (order_detail), nên không thể truy vết retention ở mức vi mô. Việc thừa nhận thẳng thắn hạn chế này đảm bảo tính trung thực và chuẩn mực khoa học của dự án.',
              'The question "Why do customers repeat or churn" was intentionally omitted. Current exports exist only as aggregated snapshots lacking customer_id or order_detail line items. Acknowledging this boundary preserves analytical integrity and research rigor.',
            )}
          </p>
        </div>
      </div>

      {/* 1.3 & 1.4: Phạm vi, Ràng buộc & Phân loại Mức chi tiết Dữ liệu (Data Grain) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1.3: Phạm vi & Ràng buộc */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
                1.3
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Phạm vi và Ràng buộc Phân tích', 'Analytical Scope & Technical Constraints')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Ba rào cản kỹ thuật cần nhận diện trước khi mô hình hóa', '3 technical boundaries acknowledged before modeling')}
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {L('Khung thời gian không đồng nhất:', 'Mismatched Time Windows:')}
                  </strong>{' '}
                  {L(
                    '226 ngày (09/03 – 20/10/2026) cho chuỗi bán hàng theo ngày và 7.367 phiên LIVE toàn shop, kết hợp 2 snapshot (tháng 9 & tháng 10) cho danh mục sản phẩm creator. Khi đối chiếu chéo bắt buộc phải quy đổi tỷ trọng tương đối (%) thay vì so sánh số tuyệt đối.',
                    '226 days (09/03 – 20/10/2026) for daily store and 7,367 shop-wide LIVE sessions, alongside 2 monthly snapshots (Sep & Oct) for creator products. Cross-table analyses normalize to relative shares (%) rather than absolute sums.',
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD14C]" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {L('Quan sát chu kỳ 1 mùa vụ (Single-Season):', 'Single-Season Observational Window:')}
                  </strong>{' '}
                  {L(
                    'Bộ dữ liệu chỉ ghi nhận 1 mùa hè năm 2026, chưa có dữ liệu năm trước để tách biệt biến động mùa vụ thuần túy khỏi đà tăng trưởng tự nhiên (organic growth) của thương hiệu.',
                    'Observes only one summer season (2026). Without prior-year baselines, pure weather seasonality cannot be fully decoupled from organic shop expansion.',
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {L('Dữ liệu ước tính từ nền tảng bên ngoài:', 'Third-Party Platform Estimates:')}
                  </strong>{' '}
                  {L(
                    'Dữ liệu trích xuất từ FastMoss & Seller Center là số liệu giám sát của nền tảng, cần đối soát kiểm đếm trước khi đưa vào các thuật toán kiểm định.',
                    'Telemetry exports from FastMoss and Seller Center represent platform monitoring data requiring reconciliation before econometric inference.',
                  )}
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white mr-1">
              {L('Thiếu hụt dữ liệu nội bộ (COGS):', 'Missing Internal Cost Data:')}
            </span>
            {L(
              'Chưa có dữ liệu giá vốn hàng bán, chi phí đóng gói & tỷ lệ hủy hoàn, do đó toàn bộ phân tích tập trung vào doanh số GMV, chưa thể kết luận về biên lợi nhuận ròng.',
              'Lacks COGS, fulfillment costs, and return rates; analyses focus strictly on Top-line GMV rather than Net Margin.',
            )}
          </div>
        </div>

        {/* 1.4: Phân loại Nguồn Dữ liệu theo Mức chi tiết */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
                1.4
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Phân loại Mức chi tiết Dữ liệu (Data Grain & Join Keys)', 'Data Grain Classification & Join Keys')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Xác định mức chi tiết quyết định chiến lược nối bảng (JOIN)', 'Entity grains dictating relational SQL join strategies')}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                    <th className="py-1.5 px-2">{L('Mức chi tiết (Grain)', 'Grain')}</th>
                    <th className="py-1.5 px-2">{L('Bảng dữ liệu', 'Table')}</th>
                    <th className="py-1.5 px-2">{L('Khóa nối (Key)', 'Join Key')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dataGrains.map((g) => (
                    <tr key={g.key} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {g.grain}
                      </td>
                      <td className="py-2 px-2 text-slate-600 dark:text-slate-300">
                        {g.table}
                      </td>
                      <td className="py-2 px-2">
                        <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 text-[11px] font-mono text-[#0D7287] dark:text-[#9BE7FA]">
                          {g.key}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#C8EEF7] bg-[#F0F9FB] p-2.5 text-[11px] text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
            <span className="font-bold text-[#074553] dark:text-[#9BE7FA] mr-1">
              {L('Quy chuẩn First-party vs Second-party:', 'First vs Second-Party Taxonomy:')}
            </span>
            {L(
              'Toàn bộ bảng từ TikTok Shop / FastMoss là dữ liệu bên ngoài (Second-party). Kho dữ liệu chuẩn hóa các khóa trên để sẵn sàng hợp nhất với ERP nội bộ khi được cấp quyền.',
              'All platform exports classify as Second-party data. Standardized keys ensure seamless future integration with internal ERPs.',
            )}
          </div>
        </div>
      </div>

      {/* 1.5: Kiến trúc Luồng Dữ liệu (5 Bước & Quy mô 9 Bảng) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Luồng 5 bước */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.5
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white">
                {L('Kiến trúc Luồng Dữ liệu 5 Bước', '5-Step Data Pipeline Architecture')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {L('Từ tệp nguồn xlsx qua kho 3 lớp đến mô hình phân tích và BI', 'From source xlsx through 3-tier warehouse to SQL models & BI')}
              </p>
            </div>
          </div>

          <ol className="space-y-2">
            {pipelineSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <li key={s.step}>
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60 transition-colors">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#9BE7FA] text-slate-950 text-xs font-bold mt-0.5">
                      {s.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                          {s.title}
                        </div>
                        <Chip tone={idx === 2 ? 'amber' : idx === 3 ? 'cyan' : undefined}>
                          {s.badge}
                        </Chip>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                  {idx < pipelineSteps.length - 1 && (
                    <div className="flex justify-center py-0.5 text-slate-400 dark:text-slate-600">
                      <ArrowDown className="h-3 w-3" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Biểu đồ quy mô 9 bảng dữ liệu nguồn */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L(`Quy mô Bản ghi ${pipelineMeta.tables} Bảng Dữ liệu Hợp nhất`, `Row Volume Across ${pipelineMeta.tables} Ingested Tables`)}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L(`Tổng cộng ${pipelineMeta.tables} bảng với ${n(pipelineMeta.rows)} dòng SSOT`, `Total ${pipelineMeta.tables} tables with ${n(pipelineMeta.rows)} SSOT records`)}
                </p>
              </div>
              <Chip tone="cyan">{n(pipelineMeta.rows)} Dòng</Chip>
            </div>

            <div className="h-72 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableChartData} layout="vertical" margin={{ top: 4, right: 44, left: 4, bottom: 0 }}>
                  <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={128} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v)} />} />
                  <Bar dataKey="rows" name={L('Dòng', 'Rows')} fill={COLORS.cyan} radius={[0, 8, 8, 0]}>
                    <LabelList dataKey="rows" position="right" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => n(Number(v))} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="font-bold text-[#074553] dark:text-[#9BE7FA] block mb-0.5">
              {L('Ý nghĩa tầng Warehouse Mart:', 'Warehouse Mart Layer Purpose:')}
            </span>
            {L(
              `Từ ${n(pipelineMeta.rows)} dòng thô hợp nhất, script Python tự động tổng hợp ra các bảng Mart: daily_sales (226 dòng liên tục), creator_summary (6.086 dòng), live_sessions (600 dòng), creator_products (787 dòng 2 snapshot) giúp các truy vấn SQL chạy dưới 15ms.`,
              `From ${n(pipelineMeta.rows)} unified raw rows, Python pipelines build clean Mart tables (daily_sales, creator_summary, live_sessions, creator_products), enabling sub-15ms SQL queries.`,
            )}
          </div>
        </div>
      </div>

      {/* 1.6: Các phép đối chiếu bắt buộc khi nạp (Data Reconciliation) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.6
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Các Phép Đối Chiếu Bắt Buộc Khi Nạp (Data Reconciliation)', 'Mandatory Data Quality Ingestion Checks')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Phát hiện và xử lý chênh lệch thực tế giữa các nguồn dữ liệu độc lập', 'Detecting and resolving empirical mismatches between disparate sources')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">2 Điểm Lệch Thực Tế</Chip>
            <Chip tone="amber">Tư Duy Audit Độc Lập</Chip>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 min-w-[220px]">{L('Phép kiểm tra đối chiếu', 'Reconciliation Test')}</th>
                <th className="py-2.5 px-3 min-w-[120px]">{L('Kỳ vọng', 'Expected')}</th>
                <th className="py-2.5 px-3 min-w-[180px]">{L('Phát hiện thực tế', 'Empirical Finding')}</th>
                <th className="py-2.5 px-3 w-28 text-center">{L('Trạng thái', 'Status')}</th>
                <th className="py-2.5 px-3 min-w-[240px]">{L('Ý nghĩa & Phân tích nguyên nhân', 'Audit Note & Evaluation')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reconciliationRules.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {r.check}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {r.expected}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">
                    <span className={r.status === 'warn' ? 'text-amber-700 dark:text-amber-300 font-bold' : 'text-slate-900 dark:text-white'}>
                      {r.actual}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        r.status === 'pass'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : r.status === 'warn'
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                          : 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300'
                      }`}
                    >
                      {r.statusLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {r.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Highlight giá trị portfolio */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#074553] dark:text-[#9BE7FA] block mb-0.5">
              {L('Giá trị Portfolio từ 2 điểm lệch thực tế:', 'Portfolio High-Value Signal from Empirical Mismatches:')}
            </span>
            {L(
              'Hai điểm chênh lệch thực tế (lệch 5 phiên LIVE và lệch 91.000 đ GMV) là bằng chứng cho thấy tư duy kiểm chứng dữ liệu độc lập, không tin số liệu một cách mù quáng. Khi trình bày với nhà tuyển dụng, việc phân tích thấu đáo nguyên nhân khả dĩ (múi giờ, ngưỡng lọc ca test, cách tính voucher) và chủ động chọn bảng SSOT làm mốc đối chiếu khẳng định năng lực Data Quality thực chiến của ứng viên.',
              'The 2 real-world variances (5 LIVE sessions and 91K VND) demonstrate independent analytical scrutiny over blind trust. Walking interviewers through plausible root causes (timezones, sub-5min test filters, voucher rounding) showcases authentic production-grade Data Quality maturity.',
            )}
          </div>
        </div>
      </div>

      {/* 1.7: Kết quả đầu ra của dự án (Project Deliverables) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
            1.7
          </span>
          <div>
            <h4 className="text-base font-black text-slate-950 dark:text-white">
              {L('Kết Quả Đầu Ra của Dự Án (Project Deliverables)', 'Project Deliverables & Artifacts')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {L('4 sản phẩm cụ thể chuyển giao cho doanh nghiệp và hội đồng đánh giá', '4 concrete deliverables handed over to stakeholders and hiring panels')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] uppercase tracking-wider mb-2">
                <TerminalSquare className="h-4 w-4" />
                SQL Playbook
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Bộ Truy Vấn SQL Tái Tạo', 'Reproducible SQL Suite')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L('7 giai đoạn SQL khép kín từ nạp ETL, xử lý PII, khử trùng lặp đến kiểm định thống kê.', '7-stage modular SQL suite covering ETL, PII masking, deduplication, and statistical tests.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-mono text-slate-500">7 Stages · 100% Validated</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] uppercase tracking-wider mb-2">
                <Database className="h-4 w-4" />
                CSDL Đã Dựng Sẵn
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Kho Dữ Liệu 3 Lớp', '3-Tier Database Warehouse')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L('CSDL SQLite / DuckDB dựng sẵn phân tách raw, staging và mart, sẵn sàng nạp tự động.', 'Pre-built SQLite/DuckDB schemas partitioned into raw, staging, and mart layers.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-mono text-slate-500">SQLite / DuckDB Schema</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] uppercase tracking-wider mb-2">
                <BarChart3 className="h-4 w-4" />
                5 Câu Hỏi Con
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Bộ Biểu Đồ Trực Quan', 'Interactive BI Charts')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L('Bộ biểu đồ tương tác thời gian thực giải quyết triệt để 5 câu hỏi trọng tâm thương mại.', 'Dynamic charts resolving all 5 core commercial sub-questions.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-mono text-slate-500">Recharts · Responsive</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] uppercase tracking-wider mb-2">
                <FileCheck2 className="h-4 w-4" />
                Chiến Lược & Hạn Chế
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Báo Cáo & Khuyến Nghị', 'Decision & Boundary Report')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L('Báo cáo hành động thực tế cho chủ shop kèm hồ sơ hạn chế dữ liệu phục vụ mở rộng.', 'Actionable executive report for shop owners alongside documented data constraints.')}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-mono text-slate-500">Action Plan & Limitations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
