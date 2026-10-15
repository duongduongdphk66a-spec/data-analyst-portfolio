'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';

type PillarKey = 'sql_etl' | 'stats_econometrics' | 'bi_product' | 'workflow';

export interface AboutSectionProps {
  profile?: any;
  onNavigateTab?: (_tabId: string) => void;
  onSelectProject?: (_projId: string) => void;
}

export default function AboutSection({ profile: propsProfile }: AboutSectionProps = {}) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';
  const { profile: contextProfile } = usePortfolioData();
  const profile = propsProfile || contextProfile;

  const [activePillar, setActivePillar] = useState<PillarKey>('sql_etl');

  const competencyPillars = [
    {
      key: 'sql_etl' as PillarKey,
      badge: 'SQL & DATA RECONCILIATION',
      title: {
        vi: '1. Kiểm Toán Đa Nguồn & Kỹ Thuật Truy Vấn SQL Nâng Cao',
        en: '1. Multi-Source Data Auditing & Advanced SQL Engineering'
      },
      summary: {
        vi: 'Chuẩn hóa và đối soát chéo giữa dữ liệu cấp phiên (Gross CSV) và dữ liệu thanh toán thực tế (Net Settled), xử lý trùng lặp danh mục và thiết kế lược đồ Star Schema.',
        en: 'Cross-reconciling session-level Gross CSV logs against Net Settled revenue, resolving multi-category double counting, and designing Star Schemas.'
      },
      proofs: [
        {
          label: { vi: 'Bằng chứng Thực chiến #1 (Kami Ely)', en: 'Empirical Proof #1 (Kami Ely)' },
          detail: {
            vi: 'Đối soát 8 bảng dữ liệu (18.778 dòng): Bóc tách chính xác 4,73 Tỉ đ Creator Pool (90d) thành 3,03 Tỉ đ Kênh chính chủ (49,31%) + 1,71 Tỉ đ từ 5.712 KOC ngoài (27,84%) + 1,40 Tỉ đ Kệ hàng (22,85%).',
            en: 'Reconciled 8 datasets (18,778 rows): Decomposed the 4.73B VND Creator Pool (90d) into 3.03B VND Self-Operated (49.31%) + 1.71B VND across 5,712 External KOCs (27.84%) + 1.40B VND Product Card (22.85%).'
          }
        },
        {
          label: { vi: 'Kỹ thuật SQL Áp dụng (/lab)', en: 'Applied SQL Techniques (/lab)' },
          detail: {
            vi: 'Window Functions (FIRST_VALUE, LAG, SUM/AVG OVER), Cohort Retention xử lý Sparse Cohorts bằng GENERATE_SERIES & COALESCE, và phân rã đường cong Lorenz/Pareto.',
            en: 'Window Functions (FIRST_VALUE, LAG, rolling SUM/AVG), Cohort Retention with Sparse Cohort handling, and Lorenz/Pareto decomposition.'
          }
        }
      ],
      tools: ['MySQL / PostgreSQL', 'Window Functions', 'Cohort & Retention SQL', 'Star Schema Modeling', 'Data Cleaning & ETL']
    },
    {
      key: 'stats_econometrics' as PillarKey,
      badge: 'STATISTICS & ECONOMETRICS',
      title: {
        vi: '2. Thống Kê Ứng Dụng, Kinh Tế Lượng & Kiểm Định Giả Thuyết',
        en: '2. Applied Statistics, Econometrics & Hypothesis Testing'
      },
      summary: {
        vi: 'Áp dụng kiểm định tham số / phi tham số, hồi quy bội OLS, mô hình Sai phân kép (DiD) và chỉ số bất bình đẳng không gian Gini để đưa ra kết luận có ý nghĩa thống kê.',
        en: 'Applying parametric/non-parametric tests, OLS multiple regression, Difference-in-Differences (DiD), and spatial Gini coefficients for statistically rigorous conclusions.'
      },
      proofs: [
        {
          label: { vi: 'Bằng chứng Thực chiến #2 (Di sản Nhật Bản)', en: 'Empirical Proof #2 (Japan Heritage)' },
          detail: {
            vi: 'Chứng minh độ co giãn doanh thu du lịch theo mật độ Quốc bảo (R² = 0,84, β = +0,72, p < 0,01) và đánh giá tác động Luật Bảo tồn sửa đổi 2019 (+24,6% dự án qua mô hình DiD).',
            en: 'Proved tourism revenue elasticity to National Treasure density (R² = 0.84, β = +0.72, p < 0.01) and evaluated the 2019 Law Reform (+24.6% projects via DiD).'
          }
        },
        {
          label: { vi: 'Kiểm định Thực nghiệm A/B & Thời lượng LIVE', en: 'A/B Testing & Diminishing Returns' },
          detail: {
            vi: 'Chứng minh quy luật suy giảm hiệu suất theo số phiên LIVE (ngày 09/04 phát 106 phiên chỉ đạt 749k đ/phiên vs. ngày 25/06 phát 45 phiên đạt 4,36 Tr đ/phiên — gấp 5,8 lần).',
            en: 'Demonstrated diminishing returns in LIVE volume (Apr 09 with 106 sessions yielded 749k/session vs. Jun 25 with 45 sessions yielding 4.36M/session — 5.8x higher).'
          }
        }
      ],
      tools: ['Python (Pandas, SciPy, Statsmodels)', 'OLS & DiD Regression', 'A/B Testing', 'Jupyter Notebook', 'Gini & Lorenz Curve']
    },
    {
      key: 'bi_product' as PillarKey,
      badge: 'BI DASHBOARDS & SIMULATORS',
      title: {
        vi: '3. Thiết Kế Hệ Thống BI, Chẩn Đoán Phễu & Mô Hình What-If ROI',
        en: '3. BI Dashboard Architecture, Funnel Diagnostics & What-If Simulators'
      },
      summary: {
        vi: 'Chuyển đổi kết quả phân tích tĩnh thành các công cụ mô phỏng quyết định tương tác (What-If Simulators) giúp quản lý điều chỉnh tham số và thấy ngay tác động doanh thu.',
        en: 'Translating static findings into interactive What-If Decision Simulators that allow stakeholders to tune operational levers and project revenue impact in real time.'
      },
      proofs: [
        {
          label: { vi: 'Bộ 3 Simulator Quyết định Trên Portfolio', en: '3 Interactive Decision Simulators' },
          detail: {
            vi: '1) Simulator ROI Kami Ely (+1,18 Tỉ đ/tháng khi nâng CVR Kệ hàng từ 0,25% → 1,0%); 2) Simulator Đội xe Library Bus (7.080+ lượt mượn/tháng); 3) Simulator Giãn khách Kyoto (giảm áp lực 92 → 54/100).',
            en: '1) Kami Ely ROI Optimizer (+1.18B VND/mo); 2) Library Bus Fleet & Turnover Simulator; 3) Kyoto Overtourism Dispersal Simulator (92 → 54/100).'
          }
        },
        {
          label: { vi: 'Kiến trúc Full-Stack Product BI (Library Bus)', en: 'Full-Stack Product BI (Library Bus)' },
          detail: {
            vi: 'Xây dựng 10 màn hình Analytics chuyên biệt trên nền Django + Celery + Redis, kiểm soát chống trùng đơn (Race Condition Locking) và tự động hóa nhắc hạn.',
            en: 'Built 10 dedicated Analytics dashboards on Django + Celery + Redis with concurrency locking and automated overdue reminders.'
          }
        }
      ],
      tools: ['Power BI / Tableau Blueprint', 'Product Funnel BI', 'What-If ROI Modeling', 'Next.js & TypeScript', 'Django & Celery']
    },
    {
      key: 'workflow' as PillarKey,
      badge: 'END-TO-END ANALYTICS WORKFLOW',
      title: {
        vi: '4. Quy Trình Phân Tích 5 Bước Chuẩn Kiểm Toán (Audit-Grade Workflow)',
        en: '4. 5-Stage Audit-Grade Data Analytics Workflow'
      },
      summary: {
        vi: 'Mọi dự án đều tuân thủ quy trình 5 bước khép kín: Thu thập & Làm sạch → Đối soát Đa nguồn → Kiểm định Thống kê → Trực quan hóa BI → Khuyến nghị Hành động Định lượng.',
        en: 'Every case study follows a closed-loop 5-stage pipeline: Ingestion & Cleaning → Cross-Source Reconciliation → Statistical Testing → BI Visualization → Quantified Action Plan.'
      },
      proofs: [
        {
          label: { vi: 'Bằng chứng Gốc Minh bạch (Data Proof)', en: 'Verifiable Ground-Truth Evidence' },
          detail: {
            vi: 'Tích hợp 22 ảnh chụp màn hình Telemetry gốc từ FastMoss & Seller Center, 20 giao diện thực tế của hệ thống Library Bus và 6 biểu đồ học thuật gốc của dự án Di sản Nhật Bản.',
            en: 'Backed by 22 raw FastMoss & Seller Center telemetry screenshots, 20 full-screen Library Bus captures, and 6 academic charts for Japan Heritage.'
          }
        },
        {
          label: { vi: 'Tối ưu cho Nhà tuyển dụng (3-Minute HR Scan)', en: 'Recruiter-Optimized 3-Minute Scan' },
          detail: {
            vi: 'Cả 3 dự án đều trang bị chế độ "Đọc lướt 3 phút cho HR" giúp nắm trọn vẹn Bối cảnh, Nút thắt, Phương pháp và Tác động ROI trước khi đi sâu vào chi tiết kỹ thuật.',
            en: 'All 3 case studies feature a 3-Minute HR Scan mode summarizing Context, Bottlenecks, Methodology, and ROI Impact at a glance.'
          }
        }
      ],
      tools: ['Data Auditing', 'Executive Storytelling', 'Git / Docker / CI-CD', 'Playwright E2E Testing', 'Bilingual Documentation (VI/EN)']
    }
  ];

  const currentPillar = competencyPillars.find((p) => p.key === activePillar) || competencyPillars[0];

  const bioSummary =
    profile?.bio?.[lang] ||
    (typeof profile?.bio === 'string' ? profile.bio : null) ||
    (lang === 'vi'
      ? 'Tôi tập trung vào việc giải quyết các bài toán kinh doanh thực tế bằng dữ liệu sạch, truy vấn SQL minh bạch và mô hình thống kê có thể kiểm chứng — giúp doanh nghiệp nhìn rõ điểm nghẽn chuyển đổi và tối ưu hóa lợi nhuận.'
      : 'I focus on solving real-world business bottlenecks through clean data reconciliation, transparent SQL queries, and verifiable statistical models — helping teams pinpoint conversion leaks and maximize ROI.');

  return (
    <section id="about" aria-label="Core Competencies & Methodology" className="w-full space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-8 shadow-xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-2 max-w-3xl">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-indigo-100 text-indigo-950 border border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
              {lang === 'vi' ? 'NĂNG LỰC CỐT LÕI & PHƯƠNG PHÁP LUẬN' : 'CORE COMPETENCIES & METHODOLOGY'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
              {lang === 'vi'
                ? '4 Trụ Cột Phân Tích Dữ Liệu Được Chứng Minh Qua Dự Án Thực Tế'
                : '4 Data Analytics Pillars Backed by Empirical Case Studies'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {bioSummary}
            </p>
          </div>

          <Link
            href="/about"
            className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-sky-300 dark:border-slate-700 text-xs font-mono font-bold transition inline-flex items-center gap-2 self-start lg:self-auto shrink-0"
          >
            <span>{lang === 'vi' ? 'Xem Hồ Sơ Chi Tiết (/about)' : 'Full Profile & SQL Story (/about)'}</span>
            <span>→</span>
          </Link>
        </div>

        {/* 4 TAB TRỤ CỘT NĂNG LỰC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {competencyPillars.map((pillar) => {
            const isSelected = pillar.key === activePillar;
            return (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActivePillar(pillar.key)}
                className={`min-h-[54px] p-3.5 rounded-2xl text-left transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-lg'
                    : 'bg-slate-50 dark:bg-slate-900/75 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-sky-500'
                }`}
              >
                <span
                  className={`text-xs font-mono font-bold uppercase ${
                    isSelected ? 'text-sky-100' : 'text-sky-700 dark:text-sky-400'
                  }`}
                >
                  {pillar.badge}
                </span>
                <span className="text-xs sm:text-sm font-extrabold mt-1 line-clamp-2">
                  {pillar.title[lang]}
                </span>
              </button>
            );
          })}
        </div>

        {/* CHI TIẾT TRỤ CỘT ĐANG CHỌN */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
          <div className="space-y-1.5">
            <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 uppercase">
              {currentPillar.badge}
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {currentPillar.title[lang]}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentPillar.summary[lang]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPillar.proofs.map((proof, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm"
              >
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                  ✓ {proof.label[lang]}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {proof.detail[lang]}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mr-1">
                {lang === 'vi' ? 'Công cụ & Kỹ thuật:' : 'Tools & Methods:'}
              </span>
              {currentPillar.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-200/80 text-slate-900 dark:bg-slate-800 dark:text-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
