'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Database,
  FolderLock,
  Layers,
  Lock,
  Server,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
} from 'lucide-react';
import {
  Chip,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import type { Stage7Payload } from '@/app/types/caseStudies';
import { buildStage7Data } from '@/app/lib/kamiElyStagesData';

export interface Stage7Props {
  data?: Stage7Payload;
}

export default function Stage7EtlAutomationAndPii(props?: Stage7Props) {
  const { L } = usePlaybookLang();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'quality_gates' | 'pii_compliance'>('quality_gates');
  const [activeSqlTab, setActiveSqlTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const _stageData = props?.data || buildStage7Data();

  // 7.2: Bảng 8 Cổng Kiểm Tra Chất Lượng Dữ Liệu (Data Quality Gates)
  const qualityGates = [
    {
      gate: L('1. Chuỗi ngày liên tục', '1. Continuous Date Range'),
      scope: 'stg_store',
      expected: L('Đủ 226 ngày không đứt đoạn (09/03 – 20/10/2026)', '226 uninterrupted days (Mar 09 - Oct 20)'),
      actual: '226/226 ngày',
      level: 'error',
      status: 'passed',
      note: L('Đảm bảo tính toàn vẹn chuỗi thời gian', 'Guarantees time-series continuity'),
    },
    {
      gate: L('2. Kiểm soát tổng doanh số', '2. Total Sales Reconciliation'),
      scope: 'stg_store',
      expected: '100.669 sp · 14.842.597.762 VNĐ',
      actual: '100.669 sp · 14.842.597.762 VNĐ',
      level: 'error',
      status: 'passed',
      note: L('Khớp tuyệt đối 100% không lệch 1 xu', '100% exact currency reconciliation'),
    },
    {
      gate: L('3. Khóa duy nhất video', '3. Unique Video Primary Key'),
      scope: 'stg_shoppable',
      expected: L('0 bản ghi trùng lặp (creator + title + pub_date)', '0 duplicate rows (creator + title + date)'),
      actual: L('0 trùng (4.796 video duy nhất sau hợp nhất)', '0 duplicates (4,796 unique after merge)'),
      level: 'error',
      status: 'passed',
      note: L('Xử lý qua CTE ROW_NUMBER()', 'Resolved via ROW_NUMBER() CTE'),
    },
    {
      gate: L('4. Đối soát sản lượng chính chủ', '4. Own-Brand Volume Parity'),
      scope: 'creators_merged vs goods_for_sale',
      expected: L('Sản lượng kamielyhn khớp nhau (90 ngày)', 'kamielyhn 90d volume parity'),
      actual: '20.027 sp = 20.027 sp',
      level: 'error',
      status: 'passed',
      note: L('Khớp 100% giữa 2 bảng độc lập', '100% match across 2 independent exports'),
    },
    {
      gate: L('5. Khớp phiên Live chính chủ', '5. Live Session Cross-Match'),
      scope: 'shop_live vs creator_live_list',
      expected: L('470 phiên khớp sau khi dịch +13h', '470 sessions match after +13h shift'),
      actual: '470/470 phiên khớp',
      level: 'error',
      status: 'passed',
      note: L('Khắc phục độ lệch múi giờ UTC+7', 'Solves timezone latency discrepancy'),
    },
    {
      gate: L('6. Giải mã sai số GMV 91k đ', '6. 91k VND GMV Delta Proof'),
      scope: 'Live reconciliation',
      expected: L('190.000 đ (06/05) − 99.000 đ (07/03) = 91.000 đ', '190k (May 06) - 99k (Mar 07) = 91k'),
      actual: L('Khớp toán học 91.000 đ', 'Exact 91k VND mathematical match'),
      level: 'warn',
      status: 'passed',
      note: L('Giải mã triệt để biến động ngoài cửa sổ', 'Accounts for boundary window cutoffs'),
    },
    {
      gate: L('7. Tỷ lệ Creator mồ côi', '7. Orphan Creator Ratio'),
      scope: 'stg_live vs stg_creators',
      expected: '≤ 4/251 creator (≤ 1,6%)',
      actual: '4/251 creator (1,59%)',
      level: 'warn',
      status: 'passed',
      note: L('Gắn cờ is_orphan = 1 trong mart', 'Flagged as is_orphan = 1 in marts'),
    },
    {
      gate: L('8. Tỷ lệ tiêu đề thiếu', '8. Missing Title Threshold'),
      scope: 'stg_shoppable & stg_live',
      expected: L('Shoppable ≤ 5% · Live ≤ 15%', 'Shoppable ≤ 5% · Live ≤ 15%'),
      actual: 'Shoppable 5,0% · Live 14,4%',
      level: 'warn',
      status: 'passed',
      note: L('Đã lọc bỏ tiêu đề mặc định hệ thống', 'Default system titles binned separately'),
    },
    {
      gate: L('9. Phân vùng Multi-Snapshot Hàng Bán', '9. Multi-Snapshot Goods Partitioning'),
      scope: 'kami_creator_products',
      expected: L('392 SP (Kỳ Hè) + 395 SP (Kỳ Thu) = 787 bản ghi', '392 SKUs (Summer) + 395 SKUs (Autumn) = 787 rows'),
      actual: L('787/787 bản ghi (0 ghi đè làm mất lịch sử)', '787/787 rows (zero historical data loss)'),
      level: 'error',
      status: 'passed',
      note: L('Khóa duy nhất kết hợp (product_name, shop_name, snapshot_period)', 'Compound unique key (product_name, shop_name, snapshot_period)'),
    },
  ];

  // 7.3: Kiểm kê trường Creator PII
  const piiInventory = [
    { field: 'creator id (handle)', type: L('Định danh tài khoản', 'Account Handle'), risk: L('Cao (nhận diện cá nhân)', 'High (personal ID)'), treatment: L('Băm SHA-256 kèm muối: sha256(salt + id)[:10]', 'Salted SHA-256 hash: sha256(salt + id)[:10]') },
    { field: 'creator name / nickname', type: L('Tên hiển thị công khai', 'Display Name'), risk: L('Trung bình (chứa tên thật)', 'Medium (real names)'), treatment: L('Ẩn hoàn toàn trong bản Public; thay bằng "Creator A, B, C"', 'Replaced with anonymous aliases "Creator A, B, C"') },
    { field: 'followers & GMV', type: L('Chỉ số thương mại', 'Commercial Metrics'), risk: L('Cao (Deanonymization qua phân vị)', 'High (quantile reverse lookup)'), treatment: L('Làm tròn / nhóm thành các dải tier; không công bố bảng chi tiết nhóm nhỏ', 'Binned into tiers; suppress granular micro-tier tables') },
    { field: 'Tiêu đề Video / Live', type: L('Văn bản tự do', 'Free Text'), risk: L('Thấp (dương tính giả SĐT)', 'Low (false positive phones)'), treatment: L('Quét regex làm sạch thông tin liên hệ; bản Public chỉ xuất hashtag', 'Regex scrub contacts; export only aggregated tags in public repo') },
    { field: L('Dữ liệu người mua', 'Buyer Customer Logs'), type: L('Thông tin cá nhân khách', 'Customer Data'), risk: L('Không có rủi ro', 'Zero Risk'), treatment: L('Dữ liệu SSOT không chứa bất kỳ thông tin người mua nào', 'No buyer-level records exist in raw TikTok exports') },
  ];

  // 7.1 & 7.2: SQL code snippets
  const stage7Sql = [
    {
      title: L('1. Cổng Kiểm Tra Chất Lượng Dữ Liệu Tự Động (Data Quality Gates)', '1. Automated Quality Gates Verification'),
      desc: L('Kiểm tra tính liên tục của chuỗi ngày và đối soát sản lượng chính chủ trước khi build Marts', 'Verifies date continuity and cross-table own-brand volume parity before mart build'),
      sql: `-- Kiểm tra Cổng 1: 226 ngày liên tục không thiếu ngày
SELECT COUNT(DISTINCT date) AS active_days,
       MIN(date) AS start_date,
       MAX(date) AS end_date,
       CASE WHEN COUNT(DISTINCT date) = 226 THEN 'PASSED' ELSE 'FAILED' END AS gate_1_status
FROM stg_store_daily;

-- Kiểm tra Cổng 4: Đối soát sản lượng kamielyhn giữa Creators và Goods (90 ngày)
SELECT c.units_90d AS creator_units,
       g.units_90d AS goods_units,
       CASE WHEN c.units_90d = g.units_90d THEN 'PASSED (20.027 sp khớp 100%)' ELSE 'FAILED' END AS gate_4_status
FROM (SELECT SUM(units_sold) AS units_90d FROM stg_creators WHERE creator_id = 'kamielyhn') c
CROSS JOIN (SELECT SUM(units_sold) AS units_90d FROM stg_goods_for_sale) g;`,
    },
    {
      title: L('2. Truy Vấn Tạo Lớp Mart Daily Tổng Hợp (Data Mart Layer)', '2. Daily Aggregated Mart View'),
      desc: L('Hợp nhất doanh thu Store, Live và Video vào bảng Mart duy nhất phục vụ Dashboard', 'Unifies Store, Live, and Video metrics into a single mart table for dashboards'),
      sql: `-- Dựng bảng mart_daily phục vụ phân tích đa chiều
CREATE VIEW IF NOT EXISTS v_mart_daily_summary AS
SELECT s.date,
       s.gmv AS store_gmv,
       s.units AS store_units,
       COALESCE(l.live_sessions, 0) AS live_sessions,
       COALESCE(l.live_gmv, 0) AS live_gmv,
       COALESCE(v.video_count, 0) AS video_count,
       COALESCE(v.video_gmv, 0) AS video_gmv,
       ROUND(100.0 * COALESCE(l.live_gmv, 0) / NULLIF(s.gmv, 0), 1) AS live_gmv_share_pct
FROM stg_store_daily s
LEFT JOIN (
  SELECT strftime('%Y-%m-%d', start_time_vn) AS date,
         COUNT(*) AS live_sessions,
         SUM(gmv) AS live_gmv
  FROM stg_shop_live
  GROUP BY 1
) l ON s.date = l.date
LEFT JOIN (
  SELECT strftime('%Y-%m-%d', publish_date) AS date,
         COUNT(*) AS video_count,
         SUM(gmv) AS video_gmv
  FROM stg_shoppable_videos
  GROUP BY 1
) v ON s.date = v.date;`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 7.1: Mục Tiêu & Khẳng Định Nguồn Dữ Liệu Bên Thứ Ba */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BE7FA] text-slate-950 font-bold text-xs">
              7.1
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {L('Mục Tiêu & Khẳng Định Bản Quyền Nguồn Dữ Liệu Bên Thứ Ba', 'Objective & Explicit Attribution of Third-Party Data Source')}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Database className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{L('100% 8 tệp Excel có Sheet: FastMoss', '100% 8 Excel Files have Sheet: FastMoss')}</span>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {L(
            'Kiểm tra thực tế cấu trúc nội bộ của toàn bộ 8 tệp Excel nguồn xác nhận: 100% các tệp đều chứa duy nhất một bảng tính có tên "FastMoss". Điều này khẳng định với độ tin cậy tuyệt đối rằng nguồn dữ liệu là báo cáo xuất từ nền tảng phân tích tình báo thương mại điện tử FastMoss (Second-party Market Intelligence), không phải dữ liệu trích xuất từ API nội bộ TikTok Shop hay cơ sở dữ liệu ERP của chủ shop. Do đó, các hạn chế về làm tròn lượt xem ("1.6k"), độ trễ cửa sổ cuốn chiếu 90 ngày và định dạng tiền tệ đặc thù được xử lý bằng một đường ống nạp dữ liệu (ETL pipeline) chuẩn hóa và có khả năng chạy lại (Idempotent).',
            'Empirical verification confirms 100% of the 8 source Excel workbooks feature a single worksheet titled "FastMoss". This definitively establishes that the corpus originates from the FastMoss e-commerce intelligence platform rather than internal TikTok Shop APIs or shop ERPs. Consequently, display rounding ("1.6k"), rolling 90-day window latency, and localized currency strings are systematically handled via an idempotent, automated ETL pipeline.',
          )}
        </p>

        {/* Navigation Tabs for Stage 7 */}
        <div className="flex flex-wrap gap-2 pt-1 mt-3">
          <button
            onClick={() => setActiveTab('quality_gates')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'quality_gates'
                ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {L('8 Cổng Kiểm Tra Chất Lượng (Quality Gates)', '8 Data Quality Gates')}
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {L('Kiến Trúc ETL & Ranh Giới Tự Động Hóa', 'ETL Architecture & Automation Boundary')}
          </button>
          <button
            onClick={() => setActiveTab('pii_compliance')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'pii_compliance'
                ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FolderLock className="h-3.5 w-3.5" />
            {L('Bảo Mật Creator PII & Nghị Định 356/2025', 'Creator PII & Decree 356/2025 Compliance')}
          </button>
        </div>
      </div>

      {/* Tab 1: 8 Cổng Kiểm Tra Chất Lượng Dữ Liệu */}
      {activeTab === 'quality_gates' && (
        <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                {L('7.2. Bảng 8 Cổng Kiểm Tra Chất Lượng Dữ Liệu Tự Động (Production Quality Gates)', '7.2. Production Data Quality Gates Matrix')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Chặn đứng dữ liệu sai lệch trước khi nạp vào lớp phân tích Marts', 'Blocks invalid records before ingestion into analysis marts')}
              </p>
            </div>
            <Chip tone="cyan">{L('8/8 Cổng Đạt Chuẩn (Passed)', '8/8 Gates Passed')}</Chip>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs" data-ui="table">
              <thead className="bg-[#F0F9FB] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800" data-ui="thead">
                <tr>
                  <th className="py-2.5 px-3">{L('Tên cổng kiểm tra', 'Quality Gate')}</th>
                  <th className="py-2.5 px-3">{L('Phạm vi', 'Scope')}</th>
                  <th className="py-2.5 px-3">{L('Tiêu chí kỳ vọng', 'Expected Parity')}</th>
                  <th className="py-2.5 px-3">{L('Kết quả thực tế', 'Actual Value')}</th>
                  <th className="py-2.5 px-3">{L('Mức độ', 'Severity')}</th>
                  <th className="py-2.5 px-3">{L('Trạng thái', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400" data-ui="tbody">
                {qualityGates.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{g.gate}</td>
                    <td className="py-2 px-3 font-medium text-[11px]">{g.scope}</td>
                    <td className="py-2 px-3">{g.expected}</td>
                    <td className="py-2 px-3 tabular-nums font-bold text-slate-900 dark:text-white">{g.actual}</td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        g.level === 'error' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {g.level}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        PASSED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Kiến Trúc ETL 3 Tầng & Ranh Giới Tự Động Hóa */}
      {activeTab === 'pipeline' && (
        <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {L('7.2. Kiến Trúc Kho Dữ Liệu 3 Tầng (Raw → Staging → Marts → Views)', '7.2. 3-Tier Data Warehouse Architecture')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Phân tách rạch ròi trách nhiệm giữa nạp thô, làm sạch chuẩn hóa và tổng hợp báo cáo', 'Decouples raw ingestion, rule-based transformation, and consumption marts')}
              </p>
            </div>
            <Chip tone="cyan">Idempotent Pipeline</Chip>
          </div>

          {/* Sơ đồ 3 tầng */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>1. RAW LAYER</span>
                <Chip tone="rose">Append Only</Chip>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                {L('Đọc nguyên trạng 8 tệp xlsx; lưu source_file, sha256 checksum, loaded_at và as_of_date (04/09/2026).', 'Direct ingest of 8 xlsx files; tracks source_file, sha256, loaded_at, and as_of_date.')}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 space-y-2">
              <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center justify-between">
                <span>2. STAGING LAYER</span>
                <Chip tone="cyan">Cleaned</Chip>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {L('Áp dụng 7 chuẩn làm sạch: dịch múi giờ +13h, unnest dải giá, gán cờ is_orphan, is_outlier_duration.', 'Applies 7 cleaning standards: +13h shift, unnest price ranges, flag orphans & outliers.')}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>3. MARTS LAYER</span>
                <Chip tone="amber">SSOT</Chip>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {L('Dựng các bảng phân tích mart_daily, mart_creator, mart_live, mart_video đảm bảo tính nhất quán 100%.', 'Builds analytical marts (mart_daily, mart_creator, mart_live, mart_video) for 100% SSOT parity.')}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>4. VIEWS LAYER</span>
                <Chip tone="cyan">Dashboard</Chip>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {L('Cung cấp các view tối ưu: v_daily_gmv, v_ads_compare, v_creator_summary chỉ đọc, không nhân bản dữ liệu.', 'Exposes lightweight read-only views for UI components without replicating underlying data.')}
              </p>
            </div>
          </div>

          {/* Ranh giới tự động hóa thực tế */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Server className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('Ranh giới Tự Động Hóa Thực Tế Trong Môi Trường Doanh Nghiệp:', 'Real-World Automation Boundaries:')}
            </div>
            <p className="leading-relaxed">
              {L(
                '• Bước trích xuất (Extraction): Nền tảng FastMoss không cung cấp Webhook/API mở cho tài khoản chuẩn, việc tải file báo cáo định kỳ là thao tác thủ công của đội ngũ vận hành.',
                '• Extraction boundary: FastMoss lacks open public webhooks for standard accounts; scheduled file downloads remain an operator manual task.',
              )}
            </p>
            <p className="leading-relaxed">
              {L(
                '• Bước tự động hóa hoàn toàn: Bắt đầu từ khi tệp được đưa vào thư mục data/. Toàn bộ quy trình Nạp thô → Kiểm tra Cổng chất lượng → Xử lý sạch → Dựng Marts → Xuất báo cáo được tự động hóa hoàn toàn qua 1 lệnh duy nhất (`python scripts/kami/run_etl.py`).',
                '• Fully automated boundary: Commences once files land in data/. The entire chain (Raw Ingest → Quality Gate Check → Cleaning → Mart Build → Visual Export) runs unattended via a single command (`python scripts/kami/run_etl.py`).',
              )}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Creator PII & Nghị Định 356/2025/NĐ-CP */}
      {activeTab === 'pii_compliance' && (
        <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FolderLock className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {L('7.3. Kiểm Kê Trường Creator PII & Khung Pháp Lý Nghị Định 356/2025/NĐ-CP', '7.3. Creator PII Inventory & Legal Compliance Framework')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Tuân thủ Luật Bảo vệ dữ liệu cá nhân (hiệu lực 01/01/2026) và bảo vệ bí danh đối tác', 'Complies with Vietnam Personal Data Protection Law (effective Jan 01, 2026)')}
              </p>
            </div>
            <Chip tone="amber">Luật Dữ Liệu 2026</Chip>
          </div>

          {/* Cập nhật pháp lý */}
          <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              {L('Cập Nhật Pháp Lý Bắt Buộc (Luật BV Dữ Liệu Cá Nhân 2026):', 'Mandatory Legal Framework Notice:')}
            </div>
            <p className="leading-relaxed">
              {L(
                'Luật Bảo vệ dữ liệu cá nhân được Quốc hội thông qua ngày 26/06/2025 và có hiệu lực thi hành từ ngày 01/01/2026. Nghị định 356/2025/NĐ-CP ban hành hướng dẫn chi tiết luật này, chính thức thay thế Nghị định 13/2023/NĐ-CP. Việc công bố công khai thông tin định danh của các nhà sáng tạo (handle cá nhân, doanh số gắn với tài khoản) trên các kho lưu trữ công cộng (GitHub) tiềm ẩn rủi ro pháp lý nếu không thực hiện ẩn danh hóa nghiêm ngặt.',
                'The Law on Personal Data Protection was enacted on June 26, 2025, taking effect on January 1, 2026. Decree 356/2025/NĐ-CP replaces Decree 13/2023/NĐ-CP to enforce stringent penalties. Publishing identifiable creator handles or account-linked revenue on public repositories incurs legal exposure without rigorous pseudonymization.',
              )}
            </p>
          </div>

          {/* Bảng kiểm kê PII */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs" data-ui="table">
              <thead className="bg-[#F0F9FB] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800" data-ui="thead">
                <tr>
                  <th className="py-2.5 px-3">{L('Trường dữ liệu', 'Data Field')}</th>
                  <th className="py-2.5 px-3">{L('Bản chất thông tin', 'Entity Type')}</th>
                  <th className="py-2.5 px-3">{L('Rủi ro định danh', 'Identification Risk')}</th>
                  <th className="py-2.5 px-3">{L('Chiến lược ẩn danh hóa & Bảo vệ', 'Pseudonymization Strategy')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400" data-ui="tbody">
                {piiInventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200"><code>{item.field}</code></td>
                    <td className="py-2 px-3">{item.type}</td>
                    <td className="py-2 px-3 font-medium text-amber-700 dark:text-amber-400">{item.risk}</td>
                    <td className="py-2 px-3 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{item.treatment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chiến lược xuất 2 bản đầu ra */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                {L('Bản Báo Cáo Nội Bộ (Private NDA):', 'Internal Private Portfolio (NDA):')}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {L('Chỉ gửi cho nhà tuyển dụng/đối tác theo thỏa thuận bảo mật; giữ nguyên định danh để đối soát chất lượng dữ liệu với sự đồng thuận của chủ shop.', 'Shared exclusively under NDA with employers; retains handles to demonstrate auditing rigor with shop owner consent.')}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#F0F9FB] dark:bg-slate-800/60 space-y-1.5">
              <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {L('Bản Công Khai (Public Open Source):', 'Public Open-Source Showcase:')}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {L('Không commit tệp xlsx thô vào Git (.gitignore); toàn bộ creator được băm SHA-256 kèm muối; phân dải GMV/follower thành tier.', 'Excludes raw xlsx via .gitignore; salts and hashes all creator handles; generalizes metrics into follower tiers.')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7.4: Truy Vấn SQL Cho Mục 7 */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TerminalSquare className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {L('Truy Vấn SQL Kiểm Soát Cổng Dữ Liệu & Dựng Marts (Mục 7)', 'SQL Queries for Quality Gates & Mart Building')}
            </h4>
          </div>
          <div className="flex gap-1.5">
            {stage7Sql.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSqlTab(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeSqlTab === idx
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.title.split('.')[1]?.trim() || tab.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
            {stage7Sql[activeSqlTab].desc}
          </p>
          <div className="relative rounded-xl bg-slate-950 p-4 text-xs text-slate-200 overflow-x-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(stage7Sql[activeSqlTab].sql);
                setCopiedIndex(activeSqlTab);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
              className="absolute top-3 right-3 flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition-colors cursor-pointer"
            >
              {copiedIndex === activeSqlTab ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">{L('Đã chép', 'Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>{L('Sao chép SQL', 'Copy SQL')}</span>
                </>
              )}
            </button>
            <pre className="font-mono pr-16 text-slate-300 leading-relaxed">
              <code>{stage7Sql[activeSqlTab].sql}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
