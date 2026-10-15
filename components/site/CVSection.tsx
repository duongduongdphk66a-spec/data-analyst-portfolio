'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';

export interface CVSectionProps {
  experiences?: any[];
  name?: string;
  title?: string;
  isSummary?: boolean;
}

export default function CVSection({ experiences: _experiences, name: _name, title: _title, isSummary: _isSummary }: CVSectionProps = {}) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';
  const { profile } = usePortfolioData();

  const email = profile?.email || 'mavanhung.data@gmail.com';

  const recruiterHighlights = [
    {
      category: { vi: '1. Kỹ Thuật Phân Tích & Công Cụ', en: '1. Core Analytics & Tech Stack' },
      items: [
        'SQL (MySQL, PostgreSQL, Window Functions, Cohort & Pareto)',
        'Python (Pandas, NumPy, SciPy, Statsmodels, Jupyter)',
        'BI & Visualization (Power BI, Tableau, Interactive Web Dashboards)',
        'Web & Backend (Next.js, TypeScript, Django, Celery, Docker)'
      ]
    },
    {
      category: { vi: '2. Thành Tựu Định Lượng Nổi Bật', en: '2. Quantified Project Deliverables' },
      items: [
        lang === 'vi'
          ? 'Kami Ely TikTok Shop: Kiểm toán 18.778 bản ghi SQL (12,74 Tỉ đ / 180d), phát hiện GPM Video gấp 4,5x LIVE.'
          : 'Kami Ely TikTok Shop: Audited 18,778 SQL rows (12.74B VND / 180d), uncovered 4.5x Video vs LIVE GPM gap.',
        lang === 'vi'
          ? 'Library Bus BI: Thiết kế 6 Django Apps + 10 Analytics Views, đạt 92% hoàn tất đặt sách & 0% trùng đơn.'
          : 'Library Bus BI: Architected 6 Django Apps + 10 Analytics Views, achieving 92% reservation fill & 0% conflict.',
        lang === 'vi'
          ? 'Di sản Nhật Bản: Mô hình OLS (R² = 0,84) & DiD đánh giá Luật Bảo tồn 2019 (+24,6% dự án).'
          : 'Japan Heritage: OLS (R² = 0.84) & DiD econometric evaluation of 2019 Law Reform (+24.6% projects).'
      ]
    },
    {
      category: { vi: '3. Giá Trị Đóng Góp Cho Doanh Nghiệp', en: '3. Immediate Value to Your Team' },
      items: [
        lang === 'vi'
          ? 'Làm sạch & đối soát dữ liệu đa nguồn (Gross vs. Net, tránh đếm lặp danh mục).'
          : 'Multi-source data cleaning & reconciliation (Gross vs. Net, eliminating double-counting).',
        lang === 'vi'
          ? 'Xây dựng Dashboard tự động hóa và mô hình What-If ROI phục vụ ra quyết định nhanh.'
          : 'Automated BI dashboards and What-If ROI simulators for rapid executive decision-making.',
        lang === 'vi'
          ? 'Khả năng làm việc độc lập hoặc phối hợp chặt chẽ giữa đội Data, Marketing và Engineering.'
          : 'Cross-functional collaboration bridging Data Analytics, Growth Marketing, and Engineering.'
      ]
    }
  ];

  return (
    <section id="cv" aria-label="Curriculum Vitae & Contact" className="w-full pb-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-gradient-to-br from-white via-slate-50 to-sky-50/40 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-950 p-5 sm:p-8 shadow-xl space-y-6">
        {/* TOP ROW: TITLE & PRIMARY CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
              {lang === 'vi' ? 'HỒ SƠ NĂNG LỰC (CV) & LIÊN HỆ TUYỂN DỤNG' : 'CURRICULUM VITAE & RECRUITER HUB'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
              {lang === 'vi'
                ? 'Sẵn Sàng Đồng Hành Cùng Đội Ngũ Dữ Liệu Của Bạn'
                : 'Ready to Deliver Data-Driven Impact for Your Team'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {lang === 'vi'
                ? 'Tải bản CV đầy đủ (PDF) hoặc kiểm tra nhanh tóm tắt năng lực và kinh nghiệm thực chiến ngay bên dưới.'
                : 'Download the full PDF Resume or review the executive qualification summary below.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-sky-500/20 flex items-center gap-2"
            >
              <span>📄</span>
              <span>
                {lang === 'vi' ? 'Mở / Tải CV Đầy Đủ (PDF)' : 'Open / Download Full CV (PDF)'}
              </span>
            </a>

            <Link
              href="/experience"
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              <span>💼</span>
              <span>{lang === 'vi' ? 'Kinh Nghiệm (/experience)' : 'Experience Timeline'}</span>
            </Link>
          </div>
        </div>

        {/* 3 COLUMNS: RECRUITER SUMMARY CHECKLIST */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {recruiterHighlights.map((block, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
            >
              <h3 className="text-sm font-extrabold font-mono text-sky-800 dark:text-sky-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                {block.category[lang]}
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {block.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR: QUICK CONTACT & DIRECT LINKS */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-700 dark:text-slate-300">
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              📬 {lang === 'vi' ? 'Liên hệ trực tiếp:' : 'Direct Contact:'}
            </span>
            <a
              href={`mailto:${email}`}
              className="font-mono font-semibold text-sky-700 dark:text-sky-400 hover:underline"
            >
              {email}
            </a>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span>
              {lang === 'vi'
                ? 'Sẵn sàng phỏng vấn trực tiếp hoặc thực hiện bài Test kỹ thuật (SQL / Python / BI).'
                : 'Available for technical interviews and live SQL / Python / BI assessments.'}
            </span>
          </div>

          <Link
            href="/lab"
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold transition inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>💻</span>
            <span>{lang === 'vi' ? 'Kiểm tra kỹ năng SQL tại /lab →' : 'Verify SQL Skills at /lab →'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
