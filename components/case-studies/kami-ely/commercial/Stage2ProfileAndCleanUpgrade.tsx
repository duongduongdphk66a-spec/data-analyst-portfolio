'use client';

import React, { useState } from 'react';
import {
  BadgeAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  Database,
  Eye,
  FileSpreadsheet,
  Filter,
  Layers,
  ShieldAlert,
  TerminalSquare,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  COLORS,
  paretoCurve,
  priceBands,
  productFacts,
} from '../playbook/playbookData';
import {
  ChartCard,
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  axisTick,
  legendFormatter,
  usePlaybookLang,
} from '../playbook/PlaybookUi';

export default function Stage2ProfileAndCleanUpgrade() {
  const { L, n } = usePlaybookLang();
  const [activeSqlTab, setActiveSqlTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 2.1: Khám phá mô hình dữ liệu (9 Bảng hợp nhất)
  const dataModelTables = [
    {
      name: 'Store Detail (Daily Overview)',
      window: L('226 ngày liên tục', '226 continuous days'),
      rows: 226,
      grain: L('Ngày', 'Daily'),
      joinKey: 'record_date',
      desc: L('Dữ liệu tổng hợp theo ngày toàn gian hàng (T3–T10/2026)', 'Store-level daily performance (Mar-Oct 2026)'),
      tag: 'SSOT',
    },
    {
      name: 'Shop Products (Catalog)',
      window: L('Toàn shop', 'Catalog-wide'),
      rows: 339,
      grain: L('Sản phẩm', 'Product SKU'),
      joinKey: 'product_name',
      desc: L('Danh mục 339 SKU, giá niêm yết và doanh số tích lũy', 'Product catalog of 339 SKUs & cumulative sales'),
      tag: 'Catalog',
    },
    {
      name: 'Affiliate KOL Network',
      window: L('Hợp nhất 2 kỳ', '2-Snapshot Merged'),
      rows: 6086,
      grain: 'Creator',
      joinKey: 'creator_id',
      desc: L('6.086 Creator liên kết tiếp thị & hoa hồng', '6,086 Affiliate creators & commission tiers'),
      tag: 'Affiliate',
    },
    {
      name: 'Goods for Sale (Multi-Snapshot)',
      window: L('Kỳ Hè + Kỳ Thu', 'Summer + Autumn Snapshots'),
      rows: 787,
      grain: L('SP × Gian hàng × Kỳ', 'Product × Shop × Period'),
      joinKey: L('Tên SP + Shop + Kỳ', 'Product + Shop + Period'),
      desc: L('Phương án A: Phân vùng 2 kỳ đo lường 90 ngày (392 hè + 395 thu)', 'Option A: 2-snapshot partitioning (392 summer + 395 autumn)'),
      tag: 'Snapshot',
    },
    {
      name: 'Creator Live Sessions',
      window: L('Hợp nhất 2 kỳ', '2-Snapshot Merged'),
      rows: 600,
      grain: L('Phiên Live chính chủ', 'Own LIVE Session'),
      joinKey: 'start_time',
      desc: L('600 ca phát sóng trực tiếp từ tài khoản chính', '600 Direct live sessions from main account'),
      tag: 'Brand LIVE',
    },
    {
      name: 'Creator Videos',
      window: L('Hợp nhất 2 kỳ', '2-Snapshot Merged'),
      rows: 276,
      grain: L('Video chính chủ', 'Own Video'),
      joinKey: 'publish_time',
      desc: L('276 video ngắn xuất bản từ kênh chính chủ', '276 Short-form videos published by brand channel'),
      tag: 'Brand Video',
    },
    {
      name: 'Affiliate Shoppable Videos',
      window: L('Hợp nhất 2 kỳ', '2-Snapshot Merged'),
      rows: 4796,
      grain: L('Video gắn link', 'Shoppable Video'),
      joinKey: 'title + publisher',
      desc: L('4.796 video từ mạng lưới creator toàn thị trường', '4,796 Shoppable videos across affiliate network'),
      tag: 'Affiliate Video',
    },
    {
      name: 'Shop-wide Affiliate LIVE',
      window: L('Hợp nhất 2 kỳ', '2-Snapshot Merged'),
      rows: 8355,
      grain: L('Phiên Live toàn shop', 'Shop LIVE Session'),
      joinKey: 'session_id + start_time',
      desc: L('8.355 phiên live có gắn giỏ hàng sản phẩm shop', '8,355 LIVE sessions tagging store products'),
      tag: 'Shop LIVE',
    },
    {
      name: 'Livestream Featured Products',
      window: L('Live Details', 'Live Product List'),
      rows: 103,
      grain: L('SP trong phiên LIVE', 'Live Product Item'),
      joinKey: 'product_name + session',
      desc: L('103 lượt sản phẩm gắn ghim trực tiếp trong các ca LIVE', '103 featured items pinned during live broadcasts'),
      tag: 'Live Goods',
    },
  ];

  // 2.2: Kết quả lập hồ sơ kiểm tra chi tiết
  const profilingFindings = [
    {
      entity: 'Store Detail (226d)',
      badge: L('226/226 ngày hợp lệ', '226/226 days valid'),
      tone: 'cyan' as const,
      finding: L(
        'Đủ 226/226 ngày liên tục, không ngày nào 0 đơn (thấp nhất 49 sp/ngày). Tổng khớp: 100.669 sản phẩm, 14.842.597.762 VNĐ. Bao phủ trọn vẹn từ 09/03/2026 đến 20/10/2026.',
        'Full 226/226 continuous days recorded, zero zero-order days (minimum 49 units/day). Total exact match: 100,669 units, 14,842,597,762 VND. Continuous coverage from Mar 09, 2026 to Oct 20, 2026.',
      ),
      stat: '14,84 Tỷ đ · 100.669 sp',
      detail: L('Mốc chuỗi thời gian nền tảng (SSOT)', 'Foundational time-series benchmark'),
    },
    {
      entity: 'Product Data (90d)',
      badge: L('134/331 SP có GMV', '134/331 active SKUs'),
      tone: 'amber' as const,
      finding: L(
        '331 dòng nhưng chỉ 134 sản phẩm có GMV > 0 (197 dòng bằng 0). 3 tên sản phẩm bị trùng lặp. 15 giá ở dạng khoảng ("249.192 ₫ - 271.949 ₫"). Top 5 sản phẩm chiếm 44,9% GMV của 134 sản phẩm đang bán.',
        '331 rows but only 134 SKUs have GMV > 0 (197 rows zero sales). 3 duplicate titles. 15 price ranges ("249,192 ₫ - 271,949 ₫"). Top 5 SKUs generate 44.9% of active catalog GMV.',
      ),
      stat: 'Top 5 = 44,9% GMV',
      detail: L('Cần tách dải giá min-max & gán cờ tồn kho chết', 'Requires price unnesting & zero-sale flags'),
    },
    {
      entity: 'Creators Merged (90d)',
      badge: L('292 creator ra đơn', '292 active creators'),
      tone: 'cyan' as const,
      finding: L(
        'Tổng khớp 31.599 sản phẩm / 4.734.186.743 VNĐ. Có 292 creator có doanh thu (gồm cả kênh chính chủ, tức 291/5.712 affiliate). 1 ID bị rỗng, 46 creator có số follower ≤ 0.',
        'Exact match: 31,599 units / 4,734,186,743 VND. 292 creators produced revenue (including own brand channel, i.e., 291/5,712 affiliates). 1 blank ID, 46 creators with followers ≤ 0.',
      ),
      stat: '291 affiliate active / 5.712',
      detail: L('Tỷ lệ kích hoạt affiliate chỉ đạt 5,1%', 'Affiliate activation rate is only 5.1%'),
    },
    {
      entity: 'Goods for Sale (90d)',
      badge: L('278 dòng Kami Ely', '278 Kami Ely rows'),
      tone: 'amber' as const,
      finding: L(
        '394 dòng đến từ 4 gian hàng: Kami Ely (278 dòng, gánh toàn bộ 20.027 sản phẩm), còn 3 gian hàng Havi Bikini, KamiBiki, KamiBiii (116 dòng) đều có 0 sản phẩm. GMV lưu dạng chữ làm tròn ("500,2Tr ₫").',
        '394 rows across 4 storefronts: Kami Ely (278 rows, holding all 20,027 units), while Havi Bikini, KamiBiki, KamiBiii (116 rows) record 0 units. GMV stored as rounded text ("500.2Tr ₫").',
      ),
      stat: '20.027 sp trên 1 gian hàng',
      detail: L('3 gian phụ không phát sinh doanh số thực', '3 satellite storefronts have 0 sales'),
    },
    {
      entity: 'Live Sessions (180d)',
      badge: L('69,2% ca 0 GMV', '69.2% zero-GMV sessions'),
      tone: 'rose' as const,
      finding: L(
        '69,2% phiên có GMV = 0 (kênh chính chủ 3,6%, affiliate 73,9%). 15 phiên dài hơn 24 giờ (dài nhất 269 giờ - treo máy), 69 phiên thời lượng bằng 0, 1.012 phiên bị thiếu tiêu đề.',
        '69.2% of sessions have zero GMV (brand channel 3.6%, affiliate network 73.9%). 15 sessions exceeded 24 hours (longest 269h - idle live stream), 69 zero-duration sessions, 1,012 missing titles.',
      ),
      stat: '15 ca outlier > 24 giờ',
      detail: L('Cần loại bỏ ca >24h khi tính thời lượng trung bình', 'Exclude >24h idle sessions for duration averages'),
    },
    {
      entity: 'Shoppable Videos (180d)',
      badge: L('21,7% video ra đơn', '21.7% video conversion'),
      tone: 'rose' as const,
      finding: L(
        '4 dòng trùng khóa (creator, ngày, tiêu đề). Mốc giờ bị lẫn giữa UTC+7 (4.380 dòng) và UTC+8 (27 dòng). Lượt xem lưu dạng chữ ("1.6k", "1.2m" ở 1.420 dòng). Cột Likes, Units sold, GMV lưu theo cửa sổ lăn [90 days] của nền tảng (chỉ 960/4.417 video có GMV > 0 trong 90 ngày).',
        '4 duplicate key rows (creator, date, title). Mixed timestamps between UTC+7 (4,380 rows) and UTC+8 (27 rows). Views stored as strings ("1.6k", "1.2m" across 1,420 rows). Likes, Units sold, GMV reflect [90 days] rolling window (only 960/4,417 videos with GMV > 0 in 90d).',
      ),
      stat: 'Lẫn UTC+7 & UTC+8',
      detail: L('Chuyển đổi chuỗi chữ số & chuẩn hóa múi giờ', 'String-to-numeric parser & UTC+7 normalization'),
    },
  ];

  // 2.3: Các phép đối chiếu chéo & Đối soát
  const crossReconciliations = [
    {
      test: L('Goods for Sale vs Creators Merged', 'Goods for Sale vs Creators Merged'),
      metric: L('20.027 sp khớp tuyệt đối', '20,027 units exact match'),
      detail: L(
        'GMV: 3.026.020.300 đ (parse từ dạng chữ "3,026 Tỉ") so với 3.026.026.869 đ (chính xác), lệch 6.569 đ do làm tròn chuỗi hiển thị. Quy chuẩn lấy Creators Merged làm mốc.',
        'GMV: 3,026,020,300 VND (parsed string) vs 3,026,026,869 VND (exact), 6,569 VND string rounding delta. Standardized on Creators Merged as truth.',
      ),
      status: 'pass' as const,
      statusLabel: L('Khớp 100% Sản lượng', 'Units Match 100%'),
    },
    {
      test: L('Số phiên Live: Store Detail (tổng ngày) vs Shop LIVE', 'Live Session Count: Store Detail daily sum vs Shop LIVE'),
      metric: '7.014 vs 7.046 ' + L('phiên', 'sessions'),
      detail: L(
        'Chênh lệch 32 phiên (lệch 0,45%). Do cách định nghĩa ca Live vắt qua nửa đêm (cross-midnight) giữa báo cáo ngày và nhật ký phiên.',
        '32 sessions variance (0.45% diff). Caused by cross-midnight session attribution differences between daily rollup and session log.',
      ),
      status: 'info' as const,
      statusLabel: L('Lệch 0,45%', '0.45% diff'),
    },
    {
      test: L('Số video: Store vs Shoppable vs Dashboard', 'Video Counts: Store vs Shoppable vs Dashboard'),
      metric: '2.443 vs 4.417 vs 4,8k ' + L('video', 'videos'),
      detail: L(
        'Ba nguồn cho 3 con số khác biệt do 3 định nghĩa kỹ thuật khác nhau: video có phát sinh đơn trong ngày, video đã từng đăng và video đang hoạt động trên hệ thống. Đưa vào danh mục giới hạn dữ liệu.',
        'Three disparate figures reflecting 3 differing platform criteria: active daily converting videos, total uploaded catalog, and live published assets. Documented under data constraints.',
      ),
      status: 'warn' as const,
      statusLabel: L('Khác định nghĩa', 'Def Split'),
    },
    {
      test: L('Creator ID trong Shop LIVE không có trong Creators Merged', 'Shop LIVE Creator IDs missing from Creators Merged'),
      metric: '4/251 ID ' + L('mồ côi', 'orphan IDs'),
      detail: L(
        '4 creator có phát sóng trực tiếp nhưng không xuất hiện trong bảng danh sách 90 ngày (do phiên nằm ngoài cửa sổ 90 ngày hoặc tài khoản đã đổi handle/bị xóa). Đã gắn cờ is_orphan.',
        '4 creators streamed live but are absent from the 90-day creators export (streamed outside 90d window or deactivated handle). Flagged via is_orphan.',
      ),
      status: 'warn' as const,
      statusLabel: L('Gắn cờ mồ côi', 'Flagged Orphan'),
    },
  ];

  // 2.4: Mẫu truy vấn SQL trên SQLite
  const sqlSnippetsList = [
    {
      title: L('1. Phát hiện trùng khóa trong Shoppable', '1. Deduplicate Shoppable Videos'),
      desc: L('Tìm các bản ghi bị ghi nhận lặp lại cùng creator, ngày đăng và tiêu đề', 'Identify records duplicated on creator, publication date, and title'),
      sql: `-- Trùng khóa trong Shoppable
SELECT creator_id, pub, title, COUNT(*) AS c
FROM stg_shoppable
GROUP BY 1, 2, 3
HAVING c > 1;`,
    },
    {
      title: L('2. Phát hiện Creator mồ côi ở bảng Live', '2. Detect Orphan Creators in Live'),
      desc: L('Kiểm tra toàn vẹn khóa ngoại (Referential Integrity) giữa phiên Live và danh bạ creator', 'Verify referential integrity between Live sessions and Creators directory'),
      sql: `-- Creator mồ côi ở bảng Live
SELECT COUNT(DISTINCT a.creator_id) AS orphan_creators_count
FROM stg_live a
LEFT JOIN stg_creators b ON a.creator_id = b.creator_id
WHERE b.creator_id IS NULL;`,
    },
    {
      title: L('3. Đối chiếu Creator Live List với Shop LIVE (+13 giờ)', '3. Live Reconciliation (+13h Shift)'),
      desc: L('Kiểm chứng khớp nối 470 phiên và làm rõ chênh lệch 5 phiên thừa cùng 91.000 đ', 'Verify 470 session matches and isolate 5 surplus sessions plus 91k VND delta'),
      sql: `-- Đối chiếu Creator Live List với Shop LIVE (lệch 13 giờ)
SELECT 
    SUM(b.start_ts IS NULL) AS chi_co_o_creator_list,
    SUM(b.start_ts IS NOT NULL AND (a.gmv <> b.gmv OR a.units <> b.units)) AS lech_so
FROM stg_live_creator a
LEFT JOIN (SELECT * FROM stg_live WHERE live_type = 'Shop LIVE') b
  ON datetime(a.start_ts, '+13 hours') = b.start_ts;`,
    },
    {
      title: L('4. Phân loại cấu trúc kênh doanh thu', '4. Channel Classification (Lookup)'),
      desc: L('Tính tỷ trọng đóng góp thực chất giữa Tự vận hành, Kênh nội bộ và Affiliate bên ngoài', 'Measure true GMV contribution across Own Brand, In-house Affiliate, and External KOCs'),
      sql: `-- Phân loại kênh qua bảng tra cứu channel_group
SELECT 
    CASE creator_id 
        WHEN 'kamielyhn' THEN 'tu_van_hanh'
        WHEN 'girlstyle.vn' THEN 'noi_bo_qua_affiliate'
        ELSE 'affiliate_ben_ngoai' 
    END AS channel_group,
    COUNT(*) AS creators, 
    SUM(gmv_90d) AS gmv
FROM stg_creators 
GROUP BY 1;`,
    },
  ];

  // 2.5: Bảng đính chính phân khúc KOC (File vs Dashboard)
  const kocCorrectionData = [
    { tier: '≤ 1k', filePct: 2.9, dashPct: 43.4, note: L('Thực tế chỉ 2,9%, dashboard ghi ảo 43,4%', 'Actual only 2.9%, inflated to 43.4% on dashboard') },
    { tier: '1k–5k', filePct: 54.2, dashPct: 52.7, note: L('Chiếm 54,2% nhưng Girl Style gánh tới 79% nhóm này!', 'Accounts for 54.2% but Girl Style carries 79% of this tier!') },
    { tier: '5k–10k', filePct: 5.5, dashPct: 7.2, note: L('Quy mô khiêm tốn', 'Modest scale') },
    { tier: '10k–50k', filePct: 21.4, dashPct: 21.5, note: L('Nhóm creator chuyên nghiệp', 'Mid-tier professional creators') },
    { tier: '50k–100k', filePct: 11.0, dashPct: 10.7, note: L('KOC uy tín', 'Established KOCs') },
    { tier: '> 100k', filePct: 5.0, dashPct: 5.3, note: L('KOL lớn', 'Macro influencers') },
  ];

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 2.1: Khám phá mô hình dữ liệu (8 File XLSX Thực tế) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              2.1
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Khám Phá Mô Hình Dữ Liệu (8 Tệp Nguồn XLSX)', 'Data Model Exploration (8 Raw XLSX Sources)')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Số liệu thực nghiệm kiểm chứng trực tiếp từ 9 bảng dữ liệu hợp nhất trong dự án',
                  'Empirical verification executed directly against the 9 unified tables in the warehouse',
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">21.569 Bản ghi</Chip>
            <Chip>5 Mức Chi Tiết (Grain)</Chip>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 min-w-[190px]">{L('Tên bảng dữ liệu', 'Source Table')}</th>
                <th className="py-2.5 px-2.5 text-right w-24">{L('Số dòng', 'Rows')}</th>
                <th className="py-2.5 px-3 min-w-[120px]">{L('Khung thời gian', 'Window')}</th>
                <th className="py-2.5 px-3 min-w-[160px]">{L('Mức chi tiết (Grain)', 'Data Grain')}</th>
                <th className="py-2.5 px-3 min-w-[190px]">{L('Khóa nối thực tế', 'Join Key')}</th>
                <th className="py-2.5 px-3 min-w-[220px]">{L('Bản chất nghiệp vụ', 'Business Context')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dataModelTables.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" />
                    <span>{t.name}</span>
                    <span className="text-[10px] rounded px-1.5 py-0.2 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {t.tag}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {n(t.rows)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {t.window}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {t.grain}
                  </td>
                  <td className="py-2.5 px-3">
                    <code className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[#074553] dark:text-[#9BE7FA]">
                      {t.joinKey}
                    </code>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                    {t.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Callout quan trọng về quan hệ thực tế */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <Database className="h-5 w-5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#074553] dark:text-[#9BE7FA] block mb-0.5">
              {L('Đặc thù Mô hình Dữ liệu (Không có Order ID hay Customer ID):', 'Data Model Specifics (No Order or Customer IDs):')}
            </span>
            {L(
              'Tệp Shop LIVE “tập 1 và tập 2” thực chất đã gộp sẵn trong một tệp duy nhất 7.046 dòng. Nền tảng TikTok Shop không cung cấp bảng khách hàng hay đơn hàng cấp cá nhân (order/customer), do đó hoàn toàn không có khóa ngoại kiểu order_id → customer_id. Đây là dữ liệu tổng hợp (aggregated snapshots) theo từng cấp chi tiết: ngày, creator, phiên live, và video.',
              'Shop LIVE "Part 1 & Part 2" is pre-merged into a single 7,046-row file. TikTok Shop exports do not provide individual transaction or customer tables (order/customer), meaning foreign keys like order_id → customer_id do not exist. Data arrives as aggregated snapshots across 4 distinct grains: daily, creator, live session, and video.',
            )}
          </div>
        </div>
      </div>

      {/* 2.2: Lập hồ sơ: Kết quả kiểm tra (Profiling Discoveries) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              2.2
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Lập Hồ Sơ: Kết Quả Kiểm Tra Chi Tiết (Data Profiling)', 'Data Profiling: Empirical Discoveries & Distributions')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Phát hiện dị biệt thực tế trên từng thực thể dữ liệu trước khi làm sạch', 'Empirical anomalies and patterns uncovered across each entity before cleaning')}
              </p>
            </div>
          </div>
          <Chip tone="amber">Phát hiện Thực tế</Chip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {profilingFindings.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {f.entity}
                  </span>
                  <Chip tone={f.tone}>{f.badge}</Chip>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {f.finding}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
                  {f.stat}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {f.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.3: Đối chiếu chéo & Lời giải cho chỗ lệch 475 so với 470 phiên */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              2.3
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L(
                  'Đối Chiếu Chéo & Lời Giải Chỗ Lệch 475 vs 470 Phiên LIVE',
                  'Cross-Reconciliation & Root-Cause Solution for 475 vs 470 LIVE Sessions',
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Giải mã toán học trọn vẹn điểm lệch 5 phiên và 91.000 đ ghi nhận ở Mục 1',
                  'Complete mathematical solution for the 5-session variance and 91,000 VND delta noted in Stage 1',
                )}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {L('Đã Giải Quyết Triệt Để', 'Fully Resolved')}
          </span>
        </div>

        {/* Thẻ đột phá giải mã toán học */}
        <div className="rounded-2xl border-2 border-[#9BE7FA] bg-[#F0F9FB] p-4.5 sm:p-5 dark:border-[#9BE7FA]/40 dark:bg-slate-800/80 mb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9BE7FA] text-slate-950 font-bold">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              <h5 className="text-sm font-black text-[#074553] dark:text-[#9BE7FA]">
                {L(
                  'Lời giải toán học: Lệch múi giờ 13 tiếng giữa 2 công cụ báo cáo',
                  'Mathematical Resolution: 13-Hour Timestamp Lag Across Export Tools',
                )}
              </h5>
              <p>
                {L(
                  'Ở Mục 1, chênh lệch 475 phiên (Creator Live List) so với 470 phiên (Shop LIVE) được ghi nhận là "chưa rõ nguyên nhân". Thực hiện đối soát trực tiếp trên dữ liệu gốc đã làm sáng tỏ hoàn toàn:',
                  'In Stage 1, the 475 vs 470 session variance was marked as unknown cause. Direct forensic timestamp analysis has completely resolved this:',
                )}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>{L('Lệch múi giờ 13 tiếng:', '13-Hour Lag:')}</strong> {L(
                    'Creator Live List ghi mốc thời gian chậm hơn Shop LIVE đúng 13 tiếng. Khi tịnh tiến +13 giờ (datetime(a.start_ts, "+13 hours") = b.start_ts), 470/470 phiên của Shop LIVE khớp hoàn toàn tuyệt đối.',
                    'Creator Live List timestamps lag Shop LIVE by exactly 13 hours. Shifting +13 hours matches 470/470 Shop LIVE sessions with 100% precision.',
                  )}
                </li>
                <li>
                  <strong>{L('5 phiên dôi dư ở Creator List:', '5 Surplus Sessions:')}</strong> {L(
                    'Gồm 1 phiên ngày 07/03 (phát trước khung quan sát 09/03, đạt 99.000 VNĐ) và 4 phiên trong ngày 04–05/07 đều có GMV bằng 0 (phiên test không phát sinh giao dịch).',
                    'Includes 1 session on Mar 07 (streamed before the official Mar 09 observation window, recording 99,000 VND) and 4 sessions on Jul 04-05 with zero GMV (test runs).',
                  )}
                </li>
                <li>
                  <strong>{L('1 phiên lệch số liệu (06/05, 23:40):', '1 Value Delta Session (May 06, 23:40):')}</strong> {L(
                    'Lệch đúng 1 sản phẩm và 190.000 VNĐ giữa 2 bản ghi.',
                    'Differs by exactly 1 product and 190,000 VND between the two tools.',
                  )}
                </li>
                <li className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {L(
                    'Chứng minh chênh lệch 91.000 VNĐ: 190.000 đ (lệch phiên 06/05) − 99.000 đ (phiên thừa 07/03) = đúng 91.000 VNĐ chênh lệch tổng!',
                    'Proof of the 91,000 VND discrepancy: 190,000 VND (May 06 delta) − 99,000 VND (Mar 07 surplus session) = exactly 91,000 VND net delta!',
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bảng các phép đối chiếu chéo khác */}
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          {L('Các Phép Kiểm Tra Đối Chiếu Chéo Khác', 'Other Cross-Table Reconciliation Checks')}
        </h5>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 min-w-[200px]">{L('Phép kiểm tra', 'Test Case')}</th>
                <th className="py-2.5 px-3 min-w-[140px]">{L('Kết quả đối chiếu', 'Result')}</th>
                <th className="py-2.5 px-3 text-center w-28">{L('Trạng thái', 'Status')}</th>
                <th className="py-2.5 px-3 min-w-[280px]">{L('Phân tích nguyên nhân & Xử lý', 'Audit Analysis & Resolution')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {crossReconciliations.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {c.test}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {c.metric}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.status === 'pass'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : c.status === 'warn'
                          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                          : 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300'
                      }`}
                    >
                      {c.statusLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {c.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2.4: Quy tắc làm sạch và định hình + Truy vấn SQLite */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              2.4
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Quy Tắc Làm Sạch & Định Hình Dữ Liệu (Data Cleaning & Shaping)', 'Data Cleaning & Shaping Rules + SQLite Scripts')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('7 nguyên tắc xử lý chuỗi, múi giờ, khử trùng và truy vấn mẫu đã kiểm thử trên SQLite', '7 production cleaning standards and tested SQLite validation scripts')}
              </p>
            </div>
          </div>
          <Chip tone="cyan">7 Quy Tắc Chuẩn Hóa</Chip>
        </div>

        {/* Lưới 7 quy tắc */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Coins className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('1. Chuẩn hóa Tiền tệ', '1. Currency Parsing')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Tách ký hiệu ₫, quy đổi hậu tố k (1e3), Tr (1e6), Tỉ (1e9). Với giá dạng khoảng ("249.192 ₫ - 271.949 ₫"), tách thành price_min và price_max.',
                'Strip ₫ symbols, parse k/Tr/Tỉ suffixes. Unnest price ranges into price_min and price_max.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Clock className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('2. Đồng bộ Múi giờ UTC+7', '2. Timezone UTC+7')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Đưa tất cả về UTC+7: Creator Live cộng thêm +13 giờ; các bản ghi bị lệch UTC+8 (27 dòng Shoppable) trừ 1 giờ.',
                'Normalize all to UTC+7: Creator Live shifted +13 hours; 27 UTC+8 rows shifted -1 hour.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Eye className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('3. Quy đổi Views rút gọn', '3. Views String Parsing')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Quy đổi "1.6k" thành 1.600 và "1.2m" thành 1.200.000 số nguyên, gắn chú thích metadata là giá trị nền tảng đã làm tròn.',
                'Convert "1.6k" → 1,600 and "1.2m" → 1,200,000 as integers, annotating as platform-rounded values.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Filter className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('4. Khử trùng lặp khóa tự nhiên', '4. Deduplication')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Giữ đúng 1 dòng cho mỗi bộ khóa tự nhiên: (creator_id, ngày đăng, tiêu đề) trong Shoppable; khử 4 dòng trùng.',
                'Retain exactly 1 row per composite key: (creator_id, date, title) in Shoppable; remove 4 duplicates.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <ShieldAlert className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('5. Gắn cờ thay vì xóa bỏ', '5. Soft-Flagging')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Bản ghi mồ côi, ngoại lai gắn cờ (is_orphan, is_outlier_duration, followers_unknown), không xóa khỏi kho. Khi tính thời lượng trung bình thì loại ca > 24 giờ.',
                'Anomalies flagged (is_orphan, is_outlier_duration, followers_unknown). Exclude >24h sessions for average durations.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Calendar className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('6. Cờ tháng thiếu (Partial Month)', '6. Partial Month Flags')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Tháng 3 (23 ngày) và Tháng 9 (4 ngày) được gắn is_partial_month = true để tránh tính sai tốc độ tăng trưởng tháng tổng.',
                'March (23 days) and Sept (4 days) tagged with is_partial_month = true to prevent distorted monthly growth metrics.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60 md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Layers className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('7. Bảng tra cứu phân loại kênh (Channel Grouping Lookup)', '7. Channel Grouping Lookup Table')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Thêm cột channel_group vào bảng tra cứu: "kamielyhn" → Tự vận hành (63,9% GMV); "girlstyle.vn" → Nội bộ qua affiliate (15,5% GMV); các creator còn lại → Affiliate bên ngoài (20,6% GMV). Không viết cứng (hardcode) trong SQL truy vấn.',
                'Add channel_group lookup table: "kamielyhn" → Own Brand (63.9% GMV); "girlstyle.vn" → In-house Co-op (15.5% GMV); others → External Affiliate (20.6% GMV). Avoids query hardcoding.',
              )}
            </p>
          </div>
        </div>

        {/* Trình xem Truy vấn SQLite Mẫu */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TerminalSquare className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('Truy vấn SQL thực tế (Đã kiểm thử trên SQLite)', 'Empirical SQL Scripts (Tested in SQLite)')}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">SQLite Engine · 100% Verified</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {sqlSnippetsList.map((snip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSqlTab(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-9 cursor-pointer ${
                  activeSqlTab === idx
                    ? 'bg-[#9BE7FA] text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {snip.title}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 text-slate-100 relative">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
              <span>{sqlSnippetsList[activeSqlTab].desc}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(sqlSnippetsList[activeSqlTab].sql, activeSqlTab)}
                className="flex items-center gap-1 hover:text-[#9BE7FA] transition-colors cursor-pointer text-xs"
              >
                {copiedIndex === activeSqlTab ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{L('Đã chép', 'Copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs overflow-x-auto text-[#9BE7FA] leading-relaxed">
              <code>{sqlSnippetsList[activeSqlTab].sql}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* 2.5: Hai chỗ sai cần sửa trong báo cáo cũ */}
      <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/30 p-5 sm:p-6 dark:border-amber-500/30 dark:bg-amber-950/10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200 dark:border-amber-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950 text-sm">
              2.5
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Đính Chính 2 Sai Lệch Nghiêm Trọng Trong Báo Cáo Cũ', 'Correction of 2 Critical Legacy Analytical Flaws')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {L(
                  'Phát hiện từ việc chạy trực tiếp trên file gốc, sửa đổi các ngụy biện dữ liệu ảnh hưởng đến quyết định',
                  'Discovered through direct pipeline replication, revising false assumptions that mislead business decisions',
                )}
              </p>
            </div>
          </div>
          <Chip tone="amber">Audit Chỉnh Sửa Quan Trọng</Chip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Sai sót 1: Tăng trưởng T3 -> T4 */}
          <div className="rounded-2xl border border-amber-200 bg-white p-4.5 dark:border-amber-800/80 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BadgeAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h5 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('1. Tăng trưởng T3 → T4 bị thổi phồng', '1. Inflated March → April Growth Rate')}
                </h5>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {L(
                  'Báo cáo cũ lấy tổng GMV Tháng 3 (954 triệu đ) so với Tháng 4 (2,46 tỷ đ) rồi kết luận tăng trưởng +158,9%. Con số này hoàn toàn sai lệch vì Tháng 3 chỉ có 23 ngày quan sát (bắt đầu từ 09/03).',
                  'Legacy reports compared total March GMV (954M VND) directly to April (2.46B VND), declaring +158.9% growth. This is fundamentally distorted because March only tracked 23 active days (starting Mar 09).',
                )}
              </p>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs space-y-1.5 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{L('GMV bình quân ngày T3 (23 ngày):', 'Daily Avg GMV March (23d):')}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">~41,3 {L('triệu đ/ngày', 'M VND/day')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{L('GMV bình quân ngày T4 (30 ngày):', 'Daily Avg GMV April (30d):')}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">~82,0 {L('triệu đ/ngày', 'M VND/day')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-amber-200 dark:border-slate-700 font-bold">
                  <span className="text-[#074553] dark:text-[#9BE7FA]">{L('Tăng trưởng thực tế theo ngày:', 'True Day-Normalized Growth:')}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">+98,5% {L('(thay vì 158,9%)', '(not 158.9%)')}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {L(
                'Bài học kinh nghiệm: Luôn chuẩn hóa ngày quan sát (Day-Normalized Rate) trước khi tính tỷ lệ tăng trưởng cùng kỳ.',
                'Data takeaway: Always normalize by calendar days before computing period-over-period growth rates.',
              )}
            </div>
          </div>

          {/* Sai sót 2: Ngụy biện KOC <5k follower */}
          <div className="rounded-2xl border border-amber-200 bg-white p-4.5 dark:border-amber-800/80 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BadgeAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h5 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('2. Ngụy biện "KOC <5k follower tạo ~96% GMV"', '2. Debunking the "<5k Follower Nano KOC" Myth')}
                </h5>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {L(
                  'Trên dashboard cũ, tỷ trọng các nhóm follower cộng lại ra 140,8% (bất khả thi về toán học). Tính toán lại từ file Creators Merged với affiliate ngoài cho thấy nhóm 1k–5k chiếm 54,2%, nhưng tài khoản girlstyle.vn (3.215 follower) chiếm tới ~79% GMV nhóm này!',
                  'The legacy dashboard summed follower tier shares to 140.8% (mathematically impossible). Recomputing directly shows the 1k-5k tier is 54.2%, but account girlstyle.vn (3,215 followers) alone accounts for ~79% of this tier!',
                )}
              </p>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs space-y-1.5 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{L('Bản chất girlstyle.vn:', 'girlstyle.vn Reality:')}</span>
                  <span className="font-bold text-[#074553] dark:text-[#9BE7FA]">{L('Tài khoản đồng vận hành chính chủ', 'In-house co-operated account')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{L('Nhóm 1k-5k khi bỏ Girl Style:', '1k-5k tier excluding Girl Style:')}</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">~19,7% {L('GMV affiliate ngoài', 'of external GMV')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{L('Mức tập trung Top 1% affiliate ngoài:', 'Top 1% External Affiliate Share:')}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">85,4% GMV</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-amber-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">{L('Hiệu suất Girl Style / phiên:', 'Girl Style per session:')}</span>
                  <span className="font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">4,93 Tr đ ({L('gấp ~32 lần', '~32x')} 155k đ)</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {L(
                'Kết luận: Nhận định "mô hình KOC nhỏ hiệu quả nhất" không có cơ sở; hiệu suất affiliate trung vị là 0 đ và tập trung cực đoan ở top 1%.',
                'Conclusion: The claim that nano KOCs drive the store is unfounded; affiliate median is 0 VND and heavily skewed.',
              )}
            </div>
          </div>
        </div>

        {/* Bảng so sánh % GMV giữa Tính từ File và Dashboard ghi */}
        <div className="mt-5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {L('Đối chiếu % GMV Affiliate Ngoài theo Nhóm Follower: Tính từ File vs Dashboard Cũ', 'Follower Tier GMV Share: Calculated from File vs Legacy Dashboard')}
          </h5>
          <div className="overflow-x-auto rounded-2xl border border-amber-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-amber-100/60 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-amber-200 dark:border-slate-700">
                  <th className="py-2.5 px-3 min-w-[120px]">{L('Nhóm Follower', 'Follower Tier')}</th>
                  <th className="py-2.5 px-3 text-right min-w-[150px]">{L('% GMV (Tính từ File)', '% GMV (From File)')}</th>
                  <th className="py-2.5 px-3 text-right min-w-[150px]">{L('Dashboard Cũ Ghi', 'Legacy Dashboard')}</th>
                  <th className="py-2.5 px-3 min-w-[280px]">{L('Phân tích bản chất & Ghi chú', 'Context & Empirical Reality')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {kocCorrectionData.map((row, i) => (
                  <tr key={i} className="hover:bg-amber-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                      {row.tier}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      {n(row.filePct, 1)}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500 line-through">
                      {n(row.dashPct, 1)}%
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                      {row.note}
                    </td>
                  </tr>
                ))}
                <tr className="bg-amber-100/40 dark:bg-slate-800/60 font-black border-t-2 border-amber-300 dark:border-slate-700">
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white">{L('Tổng cộng', 'Total Sum')}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400">100,0%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600 dark:text-rose-400 line-through">140,8% (Lỗi)</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 text-[11px]">
                    {L('Dashboard cũ bị trùng lặp bộ đếm dẫn đến tổng vượt 100%', 'Legacy dashboard double-counted overlapping tags')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trực quan hóa cấu trúc danh mục: Dải giá & Đường cong Pareto (Tích hợp nguyên vẹn) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          title={L('Đường cong phân vị Pareto: % & Số lượng SKU vs % GMV tích lũy', 'Pareto quantile curve: cumulative % & count of SKUs vs % GMV')}
          subtitle={L(
            `Top 5 sản phẩm chiếm 44,9% GMV; ${productFacts.skusFor80}/${productFacts.skus} SKU tạo ra 80% doanh thu`,
            `Top 5 SKUs generate 44.9% GMV; ${productFacts.skusFor80}/${productFacts.skus} SKUs account for 80% of revenue`,
          )}
          badge={
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C8EEF7]/60 px-2.5 py-1 text-[11px] font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Gini = {n(productFacts.gini, 3)}
            </span>
          }
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <AreaChart data={paretoCurve} margin={{ top: 22, right: 12, left: -18, bottom: 18 }}>
              <defs>
                <linearGradient id="pbParetoUpgrade" x1="0" y1="0" x2="0" y2="1">
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
                tick={(props: { x?: number | string; y?: number | string; payload?: { value?: number | string } }) => {
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
              <Area type="monotone" dataKey="gmv" name={L('GMV tích lũy', 'Cumulative GMV')} stroke={COLORS.teal} strokeWidth={2.5} fill="url(#pbParetoUpgrade)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
