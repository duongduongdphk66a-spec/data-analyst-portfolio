'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const [selectedAuditCase, setSelectedAuditCase] = useState<'creator_pool' | 'gross_vs_net' | 'diminishing_live'>(
    'creator_pool'
  );

  const auditCaseStudies = {
    creator_pool: {
      badge: 'AUDIT CASE #1 • AFFILIATE POOL RECONCILIATION (90 NGÀY)',
      title: {
        vi: 'Giải Mã "Ảo Giác Số Liệu" 4,73 Tỉ VNĐ vs. 1,71 Tỉ VNĐ Trong Mạng Lưới 5.713 Creators',
        en: 'Resolving the 4.73B vs. 1.71B VND "Data Illusion" Across 5,713 Creators'
      },
      problem: {
        vi: 'Giao diện tổng quan ghi tổng GMV 90 ngày toàn shop là 6,14 Tỉ đ (Kênh chính chủ 49,3% | Affiliate 27,83% | Kệ hàng 22,87%), nhưng trang Affiliate lại báo "Mạng lưới Creators đạt 4,73 Tỉ đ (31.599 SP)". Nếu cộng 4,73 Tỉ đ với 3,03 Tỉ đ chính chủ sẽ vượt quá tổng GMV toàn shop.',
        en: 'The overview dashboard showed 6.14B VND 90d shop GMV (Self-operated 49.3% | Affiliate 27.83% | Product Card 22.87%), yet the Affiliate tab reported "4.73B VND (31,599 units)". Adding 4.73B to 3.03B self-operated exceeded total shop GMV.'
      },
      sqlResolution: {
        vi: 'Kiểm toán trực tiếp tệp CSV _Creators_merged (5.713 dòng) phát hiện con số 4.734.186.743 VNĐ đã bao gồm cả tài khoản chính chủ @kamielyhn (3.026.026.869 VNĐ / 20.027 SP = 63,92% khối Creator). Toàn bộ 5.712 KOC ngoài thực chất mang về 1.708.159.874 VNĐ (11.572 SP = 27,84% toàn shop), và Kệ hàng chiếm đúng phần dư 1.402.019.230 VNĐ (22,85%).',
        en: 'Auditing _Creators_merged.csv (5,713 rows) revealed that 4,734,186,743 VND included the self-operated @kamielyhn account (3,026,026,869 VND / 20,027 units = 63.92% of Creator Pool). The 5,712 external KOCs generated exactly 1,708,159,874 VND (27.84% of shop), leaving 1,402,019,230 VND (22.85%) for Product Cards.'
      },
      sqlSnippet: `SELECT 
  CASE WHEN creator_handle = '@kamielyhn' THEN '1. Self-Operated (@kamielyhn)'
       ELSE '2. External Affiliate KOCs (5,712)' END AS channel_group,
  COUNT(*) AS creators_count,
  SUM(units_sold_90d) AS total_units,
  SUM(gmv_90d) AS total_gmv_vnd,
  ROUND(SUM(gmv_90d) * 100.0 / 6136205973, 2) AS share_of_shop_90d_pct
FROM dim_creators_90d
GROUP BY 1;`
    },
    gross_vs_net: {
      badge: 'AUDIT CASE #2 • GROSS SESSION LOGS VS. NET SETTLED GMV (180 NGÀY)',
      title: {
        vi: 'Đối Soát Chênh Lệch Cấp Phiên (7,02 Tỉ đ / 475 Phiên) Và Thanh Toán Thực Nhận (4,90 Tỉ đ / 470 Phiên)',
        en: 'Reconciling Session-Level Gross Logs (7.02B / 475 LIVEs) vs. Net Settled GMV (4.90B / 470 LIVEs)'
      },
      problem: {
        vi: 'Tệp CSV Creator Live Streaming (180d) cộng dồn 475 phiên đạt 7.023.530.158 VNĐ (49.817 SP), trong khi biểu đồ tổng hợp kênh 180 ngày ghi nhận 4,90 Tỉ VNĐ (34,1k SP) qua 470 phiên LIVE.',
        en: 'The Creator Live Streaming CSV (180d) summed to 7,023,530,158 VND (49,817 units) across 475 sessions, whereas the 180d channel summary reported 4.90B VND (34.1k units) across 470 sessions.'
      },
      sqlResolution: {
        vi: 'Phân tách rõ 2 tầng đo lường trong kho dữ liệu: Gross Order GMV (7,02 Tỉ đ lúc khách bấm đặt trong phiên, bao gồm cả quà tặng kèm 0đ và đơn hủy/đổi size) so với Net Settled GMV (4,90 Tỉ đ sau đối soát hoàn hàng của ngành thời trang/đồ bơi, tỷ lệ thực nhận đạt ~69,8%).',
        en: 'Separated two distinct telemetry layers: Gross Order GMV (7.02B VND placed during live streams, including free gift items and size-exchange cancellations) vs. Net Settled GMV (4.90B VND post-return settlement, ~69.8% net realization rate).'
      },
      sqlSnippet: `SELECT 
  COUNT(session_id) AS total_sessions_logged,
  SUM(CASE WHEN units_sold > 0 THEN 1 ELSE 0 END) AS converting_sessions,
  ROUND(SUM(CASE WHEN units_sold > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS conversion_session_pct,
  SUM(gross_session_gmv) AS gross_live_gmv_vnd,
  4900000000 AS net_settled_live_gmv_vnd
FROM fact_creator_live_180d;`
    },
    diminishing_live: {
      badge: 'AUDIT CASE #3 • DIMINISHING RETURNS & AUDIENCE GOLDEN HOURS',
      title: {
        vi: 'Chẩn Đoán Bẫy Quán Tính Thời Lượng LIVE (09/04 vs. 25/06) & Độ Trễ Khung Giờ Đăng Video',
        en: 'Diagnosing LIVE Duration Inertia (Apr 09 vs. Jun 25) & Video Upload Timing Mismatch'
      },
      problem: {
        vi: 'Đội ngũ duy trì lịch đứng LIVE ~7,5h/ngày (gắn dàn trải 375 SKUs) ngay cả khi bước vào tháng 8–9 thấp điểm, đồng thời đăng video tập trung vào buổi sáng (06:00–12:00).',
        en: 'The team maintained ~7.5h/day LIVE schedules (pinning 375 diluted SKUs) even during the Aug–Sep off-peak trough, while uploading videos primarily in the morning (06:00–12:00).'
      },
      sqlResolution: {
        vi: 'Truy vấn chuỗi thời gian 180 ngày chứng minh ngày 09/04 phát kỷ lục 106 phiên LIVE chỉ đạt 79,45 Tr đ (~749k đ/phiên), trong khi ngày 25/06 chỉ phát 45 phiên chất lượng đạt 196,09 Tr đ (~4,36 Tr đ/phiên — gấp 5,8 lần). Kết hợp nhân khẩu học (43% Hà Nội, 73% Nữ) để dịch chuyển giờ đăng sang 12:00–13:00 và 15:00–16:00.',
        en: '180-day time-series queries proved Apr 09 with 106 LIVEs yielded only 79.45M VND (~749k/session), while Jun 25 with 45 focused LIVEs yielded 196.09M VND (~4.36M/session — 5.8x higher). Combined with demographics (43% Hanoi, 73% Female) to shift uploads to 12:00–13:00 and 15:00–16:00.'
      },
      sqlSnippet: `SELECT 
  date_id,
  live_sessions_count,
  daily_gmv,
  ROUND(daily_gmv * 1.0 / NULLIF(live_sessions_count, 0), 0) AS avg_gmv_per_live_session
FROM fact_store_daily_180d
WHERE date_id IN ('2026-04-09', '2026-06-16', '2026-06-25', '2026-09-04')
ORDER BY date_id;`
    }
  };

  const activeAudit = auditCaseStudies[selectedAuditCase];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. PROFILE HERO & ANALYTICAL PHILOSOPHY */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-2 max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
              {lang === 'vi'
                ? 'HỒ SƠ CHUYÊN MÔN & TRIẾT LÝ KIỂM TOÁN DỮ LIỆU'
                : 'ANALYST PROFILE & DATA AUDITING PHILOSOPHY'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              {lang === 'vi'
                ? 'Mã Văn Hùng — Không Chỉ Vẽ Biểu Đồ, Tôi Kiểm Toán Sự Thật Đằng Sau Con Số'
                : 'Ma Van Hung — Beyond Charts, I Audit the Ground Truth Behind Numbers'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'vi'
                ? 'Trong thực tế vận hành E-Commerce và Product BI, các bảng tổng hợp tự động thường chứa sai lệch do đếm lặp danh mục (Multi-category Double Counting), lệch khung thời gian (90d vs. 180d vs. All-Time) hoặc trộn lẫn doanh thu đặt hàng (Gross) với doanh thu thực nhận (Net). Giá trị cốt lõi của tôi là làm sạch các mâu thuẫn đó bằng SQL và thống kê trước khi đưa ra quyết định.'
                : 'In real-world E-Commerce and Product BI, automated dashboards often suffer from multi-category double counting, mismatched time horizons (90d vs. 180d vs. All-Time), or mixed Gross vs. Net revenue. My core value lies in resolving these discrepancies via SQL and statistics before driving business decisions.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/lab"
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-mono font-bold transition shadow-md flex items-center gap-2"
            >
              <span>💻</span>
              <span>{lang === 'vi' ? 'Mở Phòng Thí Nghiệm SQL (/lab)' : 'Open SQL Lab (/lab)'}</span>
            </Link>
            <Link
              href="/experience"
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              <span>💼</span>
              <span>{lang === 'vi' ? 'Xem Kinh Nghiệm STAR' : 'View STAR Experience'}</span>
            </Link>
          </div>
        </div>

        {/* 4 CORE TECHNICAL DOMAINS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">01 • SQL & ETL PIPELINE</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              MySQL • PostgreSQL • Star Schema
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Window Functions (`LAG`, `FIRST_VALUE`), Cohort Retention xử lý dữ liệu thưa (`GENERATE_SERIES`) và phân rã Pareto.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              02 • PYTHON & ECONOMETRICS
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              Pandas • SciPy • Statsmodels
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kiểm định giả thuyết A/B Testing, hồi quy đa biến OLS ($R^2 = 0,84$), mô hình Sai phân kép (DiD) và hệ số Gini.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              03 • BI & WHAT-IF SIMULATORS
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              Power BI • Next.js Interactive BI
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Thiết kế Dashboard 3 tầng (Macro → Funnel → SKU/KOC Matrix) và công cụ mô phỏng độ nhạy doanh thu theo thời gian thực.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
              04 • FULL-STACK DATA SYSTEMS
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              Django • Celery • Docker • CI/CD
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Xây dựng hệ thống giao dịch chống Race Condition, hàng đợi tác vụ ngầm và kiểm thử tự động Playwright E2E.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE DATA AUDIT SHOWCASE (3 REAL RECONCILIATION CASES) */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
              {lang === 'vi'
                ? 'BẰNG CHỨNG TƯ DUY KIỂM TOÁN DỮ LIỆU (DATA RECONCILIATION SHOWCASE)'
                : 'DATA RECONCILIATION & ANOMALY DETECTION SHOWCASE'}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {lang === 'vi'
                ? '3 Tình Huống Phát Hiện & Xử Lý Mâu Thuẫn Số Liệu Thực Tế Bằng SQL'
                : '3 Real-World Data Discrepancies Resolved via SQL Auditing'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'creator_pool', label: { vi: '1. Ảo giác 4,73 Tỉ vs 1,71 Tỉ', en: '1. 4.73B vs 1.71B Pool' } },
              { id: 'gross_vs_net', label: { vi: '2. Gross (7,02 Tỉ) vs Net (4,90 Tỉ)', en: '2. Gross vs Net LIVE' } },
              { id: 'diminishing_live', label: { vi: '3. Bẫy 106 Phiên LIVE (09/04)', en: '3. 106 LIVEs Trap (Apr 09)' } }
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedAuditCase(btn.id as typeof selectedAuditCase)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  selectedAuditCase === btn.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-sky-500'
                }`}
              >
                {btn.label[lang]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">
              {activeAudit.badge}
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {activeAudit.title[lang]}
            </h3>

            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-1">
              <div className="text-xs font-mono font-bold text-rose-900 dark:text-rose-300 uppercase">
                ⚠️ Biểu hiện Mâu thuẫn trên Giao diện Nguồn:
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
                {activeAudit.problem[lang]}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300 uppercase">
                ✓ Giải mã & Chuẩn hóa bằng Kiểm toán File CSV Gốc:
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeAudit.sqlResolution[lang]}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="text-emerald-400 font-bold">SQL Verification Query</span>
                <span>18.778 Rows Warehouse</span>
              </div>
              <pre className="text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {activeAudit.sqlSnippet}
              </pre>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">
                {lang === 'vi' ? 'Chạy trực tiếp trên trình duyệt:' : 'Execute live in browser:'}
              </span>
              <Link
                href="/lab"
                className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition inline-flex items-center gap-1.5"
              >
                <span>▶ Chạy trong /lab</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
