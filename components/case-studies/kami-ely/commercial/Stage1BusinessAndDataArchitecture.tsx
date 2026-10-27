'use client';

import React from 'react';
import {
  BarChart3,
  Calendar,
  Database,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Package,
  Target,
  TerminalSquare,
  Users,
  Video,
} from 'lucide-react';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
  } = stageData;

  const tableChartData = tableRows.map((t) => ({ name: b(t.label), rows: t.rows }));

  return (
    <div className="space-y-6">
      {/* 1.1: Bối cảnh và Bài toán Trọng tâm */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 items-stretch">
          <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {L(
                `Thương hiệu thời trang đồ bơi Kami Ely trên TikTok Shop đạt doanh thu lũy kế 31,6 tỷ VNĐ, riêng chuỗi 231 ngày phân tích đầy đủ (09/03 – 25/10/2026) đạt 15,01 tỷ VNĐ (101.896 sản phẩm). Doanh thu theo tháng có độ dốc cực đoan: tăng vọt từ 0,95 tỷ (T3) lên đỉnh 3,77 tỷ (T6), hạ nhiệt trong T8–T9 (0,64–0,70 tỷ) khi sức mua đồ bơi suy giảm, và phục hồi mạnh mẽ trong T10 (1,62 tỷ/25 ngày) nhờ xoay trục danh mục sang thời trang thu đông. Dự án xây dựng kho dữ liệu 3 lớp (raw, staging, mart) từ ${pipelineMeta.tables} bảng nguồn hợp nhất (${n(pipelineMeta.rows)} dòng SSOT) nhằm làm rõ nguồn gốc doanh thu, kiểm soát rủi ro gãy mùa vụ và hỗ trợ ra quyết định kinh doanh.`,
                `Kami Ely swimwear brand on TikTok Shop recorded 31.6B VND cumulative GMV, with 15.01B VND generated across 231 continuous days Mar 09 – Oct 25, 2026 (101,896 units). Monthly revenue displays clear seasonality: surging from 0.95B (March) to a 3.77B peak (June), moderating in Aug-Sep (0.64-0.70B) as swimwear cooling set in, and rebounding in Oct (1.62B/25 days) via autumn catalog pivots. The project builds a 3-tier data warehouse (raw, staging, mart) across ${pipelineMeta.tables} unified source tables (${n(pipelineMeta.rows)} SSOT records) to decode revenue drivers, detect seasonal transition risks, and support commercial decision-making.`,
              )}
            </p>

            <div className="rounded-2xl border-l-4 border-l-[#0D7287] bg-[#F0F9FB] p-3.5 sm:p-4 dark:bg-slate-800/80 dark:border-l-[#9BE7FA]">
              <div className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4" />
                {L('Câu hỏi trọng tâm (Core Inquiry):', 'Core Business Inquiry:')}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white italic leading-relaxed">
                {L(
                  '"Doanh thu của shop đến từ đâu, phụ thuộc vào yếu tố nào, và những tín hiệu nào cho thấy rủi ro trước khi mùa cao điểm kết thúc?"',
                  '"Where does revenue originate, what key levers dictate growth, and what early signals alert operational risk before the peak season collapses?"',
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60 flex flex-col justify-between">
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
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs mx-auto">
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
                      <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono text-[#074553] dark:text-[#9BE7FA]">
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    '231 ngày (09/03 – 25/10/2026) cho chuỗi bán hàng theo ngày và 7.367 phiên LIVE toàn shop, kết hợp 2 snapshot (tháng 9 & tháng 10) cho danh mục sản phẩm creator. Khi đối chiếu chéo bắt buộc phải quy đổi tỷ trọng tương đối (%) thay vì so sánh số tuyệt đối.',
                    '231 days (09/03 – 25/10/2026) for daily store and 7,367 shop-wide LIVE sessions, alongside 2 monthly snapshots (Sep & Oct) for creator products. Cross-table analyses normalize to relative shares (%) rather than absolute sums.',
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

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {L('Ánh xạ 5 cấp độ hạt nhân dữ liệu phục vụ liên kết SQL', 'Mapping 5 levels of analytical granularity for SQL joins')}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              {dataGrains.map((g, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-1.5 dark:border-slate-800/80 dark:bg-slate-950/40 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                      {L(g.grain.vi, g.grain.en)}
                    </span>
                    <code className="text-[11px] font-mono rounded bg-white px-1.5 py-0.5 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-[#0D7287] dark:text-[#9BE7FA] shrink-0">
                      {g.key}
                    </code>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    <strong className="text-slate-700 dark:text-slate-300">{g.table}:</strong> {L(g.desc.vi, g.desc.en)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>{L('5 Mức chi tiết hạt nhân', '5 Core Data Grains')}</span>
            <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              {pipelineMeta.tables} {L('bảng nguồn hợp nhất', 'unified tables')}
            </span>
          </div>
        </div>
      </div>

      {/* 1.5: Quy mô Dữ liệu */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.5
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Quy mô Dữ liệu', 'Dataset Scale')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  `Quy mô bản ghi dữ liệu theo ${pipelineMeta.tables} bảng nguồn (Tổng cộng ${n(pipelineMeta.rows)} dòng SSOT)`,
                  `Data record volume across ${pipelineMeta.tables} source tables (${n(pipelineMeta.rows)} SSOT rows total)`,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[380px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tableChartData}
              layout="vertical"
              margin={{ top: 10, right: 45, left: 10, bottom: 10 }}
              barCategoryGap="20%"
            >
              <XAxis type="number" tick={{ ...axisTick, fontSize: 12 }} stroke={GRID_STROKE} tickFormatter={(v) => n(v)} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ ...axisTick, fontSize: 12 }}
                width={175}
                stroke={GRID_STROKE}
                interval={0}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    fmt={(v) => `${n(v)} ${L('dòng dữ liệu', 'records')}`}
                  />
                }
              />
              <Bar dataKey="rows" fill={COLORS.teal} radius={[0, 6, 6, 0]} barSize={18}>
                <LabelList dataKey="rows" position="right" formatter={(v: any) => (v != null ? n(Number(v)) : '')} className={TEXT_FILL_CLASS} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 1.6: Kết quả đầu ra mong muốn (Target Expected Outcomes) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              1.6
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Kết Quả Đầu Ra Mong Muốn', 'Target Expected Outcomes')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('4 mục tiêu then chốt về dữ liệu, vận hành thương mại và tối ưu dòng tiền kỳ vọng đạt được', '4 core data, commercial operations, and cash-flow objectives to be accomplished')}
              </p>
            </div>
          </div>
          <Chip tone="cyan">Target Outcomes</Chip>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {L(
            'Dự án hướng tới thiết lập hệ sinh thái phân tích dữ liệu toàn diện cho gian hàng Kami Ely: giải mã chính xác động lực tăng trưởng 15,01 tỷ đ doanh số, nhận diện sớm rủi ro sụt giảm mùa vụ trước 45–60 ngày, sàng lọc danh mục 339 SKU để loại bỏ hàng tồn đọng, và xây dựng kho dữ liệu 3 lớp tự động hóa thay thế thao tác thủ công.',
            'The project establishes a comprehensive commercial analytics framework for Kami Ely: pinpointing growth drivers behind 15.01B VND GMV, detecting seasonal drop risks 45–60 days in advance, cataloging 339 SKUs to eliminate dead stock, and deploying an automated 3-tier data warehouse.',
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
                <Database className="h-4 w-4" />
                {L('Kiến Trúc Dữ Liệu', 'Data Architecture')}
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Kho Dữ Liệu 3 Lớp & ETL', '3-Tier Warehouse & ETL')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  `Hợp nhất ${pipelineMeta.tables} nguồn dữ liệu (${n(pipelineMeta.rows)} dòng SSOT), tự động hóa nạp ETL, xử lý múi giờ và bảo mật PII theo chuẩn ISO/IEC 27701.`,
                  `Consolidate ${pipelineMeta.tables} data sources (${n(pipelineMeta.rows)} SSOT rows), automate ETL ingestion, resolve timezones, and protect PII under ISO 27701.`,
                )}
              </p>
            </div>
            <div className="mt-3 pt-2">
              <span className="text-xs font-medium text-slate-500">
                {L(`${pipelineMeta.tables} Bảng Nguồn · Tự Động Hóa`, `${pipelineMeta.tables} Source Tables · Automated`)}
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
                <Target className="h-4 w-4" />
                {L('Dự Báo Vận Hành', 'Operations Forecast')}
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Cảnh Báo Đỉnh & Gãy Mùa Vụ', 'Peak & Seasonality Warning')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  'Phân rã chuỗi 231 ngày, thiết lập tín hiệu cảnh báo Dead Cross trước 18–45 ngày giúp shop chủ động xoay trục nhập hàng trước khi kết thúc cao điểm.',
                  'Deconstruct 231-day trends and trigger early warning signals 18-45 days ahead, empowering proactive inventory pivoting.',
                )}
              </p>
            </div>
            <div className="mt-3 pt-2">
              <span className="text-xs font-medium text-slate-500">
                {L('Cảnh Báo Trước 45 Ngày', '45-Day Early Warning')}
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
                <Video className="h-4 w-4" />
                {L('Kênh & Nội Dung', 'Channel & Content')}
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Định Lượng KOC & Ca Live', 'KOC & Live Optimization')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  'Tách bạch đóng góp giữa kênh chính chủ và 6.086 KOC ngoài; đo lường GPM thực tế giữa Video và Live để phân bổ ngân sách tối ưu.',
                  'Disentangle own brand vs 6,086 external KOCs; measure empirical GPM across Video and Live to optimize marketing spend.',
                )}
              </p>
            </div>
            <div className="mt-3 pt-2">
              <span className="text-xs font-medium text-slate-500">
                {L('GPM Chuẩn Xác · Tối Ưu ROI', 'Precise GPM · ROI Lift')}
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mb-2">
                <Package className="h-4 w-4" />
                {L('Chiến Lược Sản Phẩm', 'Product Strategy')}
              </div>
              <h5 className="text-sm font-bold text-slate-950 dark:text-white mb-1.5">
                {L('Tinh Gọn SKU & Giảm Tồn', 'SKU Trimming & Dead Stock')}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {L(
                  'Sử dụng phân tích Pareto nhận diện 20% SKU gánh 80% doanh thu, lập lộ trình xử lý 197 SKU không phát sinh đơn để giải phóng vốn lưu động.',
                  'Apply Pareto analysis to isolate 20% core revenue SKUs and structure clear liquidation plans for 197 zero-sale dead catalog items.',
                )}
              </p>
            </div>
            <div className="mt-3 pt-2">
              <span className="text-xs font-medium text-slate-500">
                {L('Pareto 80/20 · Giải Phóng Vốn', 'Pareto 80/20 · Capital Recovery')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
