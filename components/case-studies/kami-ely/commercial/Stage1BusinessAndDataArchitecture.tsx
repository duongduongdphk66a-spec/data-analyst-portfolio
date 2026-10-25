'use client';

import React from 'react';
import {
  BarChart3,
  Calendar,
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
import { COLORS } from '../playbook/playbookData';
import { buildStage1Data } from '@/app/lib/kamiElyStagesData';
import type { Stage1Payload } from '@/app/types/caseStudies';
import {
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  axisTick,
  usePlaybookLang,
} from '../playbook/PlaybookUi';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  video: Video,
  target: Target,
  users: Users,
  layers: Layers,
  barChart: BarChart3,
  package: Package,
  database: Database,
  fileSpreadsheet: FileSpreadsheet,
  terminalSquare: TerminalSquare,
  layoutDashboard: LayoutDashboard,
};

export interface Stage1Props {
  data?: Stage1Payload;
}

export default function Stage1BusinessAndDataArchitecture({ data }: Stage1Props) {
  const { L, b, n } = usePlaybookLang();
  const stageData = data || buildStage1Data();

  const {
    tableRows,
    pipelineMeta,
    subQuestions,
    dataGrains,
    reconciliationRules,
    pipelineSteps,
  } = stageData;

  const tableChartData = tableRows.map((t) => ({ name: b(t.label), rows: t.rows }));

  return (
    <div className="space-y-6">
      {/* 1.1: Bối cảnh và Bài toán Trọng tâm */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
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
              <div className="text-[11px] font-bold text-[#074553] dark:text-[#9BE7FA] mb-1 flex items-center gap-1.5">
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
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-2">
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
              <tr data-ui className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">{L('Câu hỏi phân tích', 'Sub-Question')}</th>
                <th className="py-2.5 px-3 min-w-[170px]">{L('Chỉ số đo lường', 'Core Metric')}</th>
                <th className="py-2.5 px-3 min-w-[150px]">{L('Bảng dữ liệu nguồn', 'Source Table')}</th>
                <th className="py-2.5 px-3 min-w-[180px]">{L('Quyết định phục vụ', 'Decision Served')}</th>
              </tr>
            </thead>
            <tbody data-ui className="divide-y divide-slate-100 dark:divide-slate-800">
              {subQuestions.map((q) => {
                const Icon = ICON_MAP[q.iconName] || Calendar;
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
                        <span>{L(q.question.vi, q.question.en)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {L(q.metrics.vi, q.metrics.en)}
                    </td>
                    <td className="py-2.5 px-3">
                      <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono text-[#074553] dark:text-[#9BE7FA]">
                        {q.table}
                      </code>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200 font-medium">
                      {L(q.decision.vi, q.decision.en)}
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
            <div className="flex items-center gap-2.5 pb-3 mb-3">
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
            <div className="flex items-center gap-2.5 pb-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
                1.4
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Phân loại Nguồn Dữ liệu theo Mức Chi Tiết (Data Grain)', 'Source Data Classification by Granularity')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Ánh xạ 5 cấp độ hạt nhân dữ liệu phục vụ liên kết SQL', 'Mapping 5 levels of analytical granularity for SQL joins')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {dataGrains.map((g, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/80 dark:bg-slate-950/40 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                      {L(g.grain.vi, g.grain.en)}
                    </span>
                    <code className="text-[10px] font-mono rounded bg-white px-1.5 py-0.5 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-[#0D7287] dark:text-[#9BE7FA]">
                      {g.key}
                    </code>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    <strong className="text-slate-800 dark:text-slate-200">{g.table}:</strong> {L(g.desc.vi, g.desc.en)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2">
            <span>{L('5 Mức chi tiết hạt nhân', '5 Core Data Grains')}</span>
            <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              {pipelineMeta.tables} {L('bảng nguồn hợp nhất', 'unified tables')}
            </span>
          </div>
        </div>
      </div>

      {/* 1.5: Luồng kiến trúc dữ liệu 5 bước (Pipeline Diagram) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.5
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Luồng Kiến Trúc Dữ Liệu 5 Bước (Data Architecture Flow)', '5-Stage Data Architecture Pipeline')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Từ hệ thống nguồn đến kho dữ liệu 3 lớp và bàn giao quyết định kinh doanh', 'From platform sources to 3-tier warehouse and business decisions')}
              </p>
            </div>
          </div>
          <Chip tone="cyan">End-to-End Pipeline</Chip>
        </div>

        {/* 5 Hộp bước ngang */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineSteps.map((s, idx) => {
            const Icon = ICON_MAP[s.iconName] || Database;
            return (
              <div
                key={s.step}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 flex flex-col justify-between relative group hover:border-[#9BE7FA] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#9BE7FA] font-black text-slate-950 text-xs">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {s.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" />
                    <h5 className="text-xs font-bold text-slate-950 dark:text-white leading-tight">
                      {L(s.title.vi, s.title.en)}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {L(s.detail.vi, s.detail.en)}
                  </p>
                </div>

                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <div className="h-4 w-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                      →
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Biểu đồ số lượng dòng của 9 bảng nguồn */}
        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('Quy mô Bản ghi Dữ liệu theo 9 Bảng Nguồn (Tổng cộng 21.569 dòng SSOT)', 'Data Record Volume across 9 Source Tables (21,569 SSOT Rows Total)')}
            </h5>
            <span className="text-[11px] tabular-nums font-semibold text-slate-500">
              {n(pipelineMeta.rows)} {L('dòng hợp nhất', 'records merged')}
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tableChartData}
                layout="vertical"
                margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke={GRID_STROKE} />
                <XAxis type="number" tick={axisTick} stroke={GRID_STROKE} tickFormatter={(v) => n(v)} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={axisTick}
                  width={140}
                  stroke={GRID_STROKE}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      fmt={(v) => `${n(v)} ${L('dòng dữ liệu', 'records')}`}
                    />
                  }
                />
                <Bar dataKey="rows" fill={COLORS.teal} radius={[0, 6, 6, 0]}>
                  <LabelList dataKey="rows" position="right" formatter={(v: any) => (v != null ? n(Number(v)) : '')} className={TEXT_FILL_CLASS} fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 1.6: Bảng đối soát dữ liệu (Reconciliation Matrix) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.6
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Bảng Đối Soát Tính Nhất Quán Dữ Liệu (Cross-Table Reconciliation)', 'Cross-Table Reconciliation & Consistency Verification')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Kiểm chứng độc lập giữa các bảng để loại bỏ sai số trước khi phân tích', 'Independent validation between sources to eliminate discrepancies before modeling')}
              </p>
            </div>
          </div>
          <Chip tone="cyan">Reconciliation Matrix</Chip>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr data-ui className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 min-w-[200px]">{L('Hạng mục đối soát', 'Reconciliation Scope')}</th>
                <th className="py-2.5 px-3 min-w-[130px]">{L('Kỳ vọng lý thuyết', 'Expected Value')}</th>
                <th className="py-2.5 px-3 min-w-[160px]">{L('Thực tế ghi nhận', 'Actual Value')}</th>
                <th className="py-2.5 px-3 min-w-[100px] text-center">{L('Trạng thái', 'Status')}</th>
                <th className="py-2.5 px-3 min-w-[240px]">{L('Giải trình kỹ thuật', 'Technical Resolution')}</th>
              </tr>
            </thead>
            <tbody data-ui className="divide-y divide-slate-100 dark:divide-slate-800">
              {reconciliationRules.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {L(r.check.vi, r.check.en)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 tabular-nums">
                    {L(r.expected.vi, r.expected.en)}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums font-bold text-slate-900 dark:text-white">
                    {L(r.actual.vi, r.actual.en)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'pass'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : r.status === 'warn'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-[#FFE485]'
                          : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-[#9BE7FA]'
                      }`}
                    >
                      {L(r.statusLabel.vi, r.statusLabel.en)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {L(r.note.vi, r.note.en)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1.7: Kết quả đầu ra của dự án (Project Deliverables) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 mb-4">
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
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
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
            <div className="mt-3 pt-2">
              <span className="text-[11px] font-medium text-slate-500">7 Stages · 100% Validated</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
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
            <div className="mt-3 pt-2">
              <span className="text-[11px] font-medium text-slate-500">SQLite / DuckDB Schema</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
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
            <div className="mt-3 pt-2">
              <span className="text-[11px] font-medium text-slate-500">Recharts · Responsive</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
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
            <div className="mt-3 pt-2">
              <span className="text-[11px] font-medium text-slate-500">Action Plan & Limitations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
