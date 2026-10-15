'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';
import ProjectCardItem, { type ProjectCardData } from '@/components/site/projects/ProjectCardItem';

const FALLBACK_FLAGSHIP_PROJECTS: ProjectCardData[] = [
  {
    id: 'kami-ely',
    title: {
      vi: 'Kiểm Toán Đa Nguồn & Tối Ưu Chuyển Đổi TikTok Shop Kami Ely (@kamielyhn)',
      en: 'Multi-Source SQL Audit & Conversion Optimization — Kami Ely TikTok Shop'
    },
    description: {
      vi: 'Phân tích 8 bảng dữ liệu thực nghiệm (18.778 bản ghi SQL, 12,74 Tỉ VNĐ trong 180 ngày & 31,6 Tỉ VNĐ All-Time). Giải mã Nghịch lý GPM Video gấp 4,5x LIVE, quy luật Pareto trên 5.713 Creators và xây dựng mô hình What-If ROI.',
      en: 'Audited 8 empirical datasets (18,778 SQL rows, 12.74B VND in 180d & 31.6B VND All-Time). Uncovered the 4.5x Video vs LIVE GPM Paradox, Pareto concentration across 5,713 Creators, and built an interactive What-If ROI Optimizer.'
    },
    tech: ['SQL (MySQL/Window Functions)', 'Python (SciPy/Stats)', 'Power BI Blueprint', 'What-If Simulator'],
    featured: true
  },
  {
    id: 'library-bus',
    title: {
      vi: 'Hệ Sinh Thái Thư Viện Lưu Động Thông Minh (Library Bus Full-Stack & BI)',
      en: 'Smart Mobile Library Bus Ecosystem (Full-Stack Django & Product Analytics)'
    },
    description: {
      vi: 'Thiết kế kiến trúc 6 phân hệ Django + Celery + Redis với 10 màn hình Analytics chuyên biệt. Tối ưu lộ trình 5 tuyến xe buýt (30 điểm đỗ, 7.080 lượt mượn/tháng), kiểm soát khóa giao dịch chống trùng đơn (Race Condition) và tự động hóa nhắc hạn.',
      en: 'Architected a 6-app Django + Celery + Redis platform with 10 dedicated Analytics views. Optimized 5 mobile bus routes (30 stops, 7,080 borrows/mo) with concurrency locking and automated overdue reminders.'
    },
    tech: ['Python (Django)', 'Celery & Redis', 'Product Funnel BI', 'UX/UI System Design'],
    featured: true
  },
  {
    id: 'heritage-japan',
    title: {
      vi: 'Kinh Tế Lượng Di Sản Văn Hóa & Chính Sách Du Lịch Nhật Bản (2015–2025)',
      en: 'Cultural Heritage Econometrics & Tourism Policy in Japan (2015–2025)'
    },
    description: {
      vi: 'Định lượng sự bất cân xứng không gian của 1.132 Quốc bảo và 13.377 Tài sản văn hóa quan trọng (Gini = 0,64). Ứng dụng hồi quy OLS (R² = 0,84) và mô hình Sai phân kép (DiD) đánh giá hiệu quả Luật Bảo tồn sửa đổi năm 2019.',
      en: 'Quantified spatial disparity across 1,132 National Treasures and 13,377 Important Cultural Properties (Gini = 0.64). Applied OLS regression (R² = 0.84) and Difference-in-Differences (DiD) to evaluate the 2019 Law Reform.'
    },
    tech: ['Econometrics (OLS & DiD)', 'Spatial Gini Analysis', 'Policy Simulation', 'Data Storytelling'],
    featured: true
  }
];

export interface ProjectsSectionProps {
  projects?: any[];
  onSelectProject?: (_projId: string) => void;
  isFeaturedView?: boolean;
}

export default function ProjectsSection({ projects: propsProjects }: ProjectsSectionProps = {}) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';
  const { projects: contextProjects } = usePortfolioData();
  const projects = propsProjects || contextProjects;

  const [activeFilter, setActiveFilter] = useState<'all' | 'kami-ely' | 'library-bus' | 'heritage-japan'>('all');

  const mergedProjects: ProjectCardData[] = useMemo(() => {
    if (!projects || projects.length === 0) return FALLBACK_FLAGSHIP_PROJECTS;
    // Đảm bảo luôn giữ đủ 3 dự án Flagship với thứ tự chuẩn
    const byId = new Map<string, ProjectCardData>();
    for (const item of FALLBACK_FLAGSHIP_PROJECTS) {
      byId.set(item.id, item);
    }
    for (const p of projects as ProjectCardData[]) {
      if (p?.id) {
        const fallback = byId.get(p.id);
        byId.set(p.id, { ...fallback, ...p });
      }
    }
    return Array.from(byId.values());
  }, [projects]);

  const displayedProjects = useMemo(() => {
    if (activeFilter === 'all') return mergedProjects;
    return mergedProjects.filter((p) => p.id === activeFilter);
  }, [mergedProjects, activeFilter]);

  return (
    <section id="projects" aria-label="Flagship Case Studies" className="w-full space-y-6">
      {/* HEADER & QUICK FILTER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-sky-100 text-sky-950 border border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
            {lang === 'vi' ? 'DANH MỤC BÁO CÁO PHÂN TÍCH CHUYÊN SÂU' : 'DEEP-DIVE ANALYTICS CASE STUDIES'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
            {lang === 'vi'
              ? '3 Dự Án Thực Chiến Có Dữ Liệu Kiểm Chứng & Mô Hình Tương Tác'
              : '3 Empirical Case Studies with Auditable Data & Interactive Simulators'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {lang === 'vi'
              ? 'Mỗi dự án đều tích hợp sẵn bộ biểu đồ trực quan, công cụ mô phỏng What-If và chế độ Đọc lướt 3 phút cho Nhà tuyển dụng.'
              : 'Each case study features interactive charts, What-If simulators, and a 3-Minute Executive Scan mode for recruiters.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: { vi: 'Tất cả (3)', en: 'All (3)' } },
            { id: 'kami-ely', label: { vi: '🛍️ Kami Ely SQL', en: '🛍️ Kami Ely SQL' } },
            { id: 'library-bus', label: { vi: '🚌 Library Bus BI', en: '🚌 Library Bus BI' } },
            { id: 'heritage-japan', label: { vi: '⛩️ Di sản Nhật Bản', en: '⛩️ Japan Heritage' } }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveFilter(btn.id as typeof activeFilter)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                activeFilter === btn.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-sky-500'
              }`}
            >
              {btn.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* GRID 3 THẺ CASE STUDIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {displayedProjects.map((project, idx) => (
          <ProjectCardItem key={project.id} project={project} index={idx} />
        ))}
      </div>

      {/* BANNER ĐIỀU HƯỚNG SANG PHÒNG THÍ NGHIỆM SQL (/LAB) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase">
            💡 {lang === 'vi' ? 'Kiểm chứng trực tiếp bằng truy vấn SQL' : 'Verify Directly with Live SQL Queries'}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {lang === 'vi'
              ? 'Muốn tự tay chạy câu lệnh Window Functions, Cohort Retention hoặc Pareto KOC trên 18.778 bản ghi thực tế?'
              : 'Want to run Window Functions, Cohort Retention, or Pareto KOC queries across 18,778 empirical rows yourself?'}
          </p>
        </div>
        <Link
          href="/lab"
          className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-mono font-bold transition shrink-0 flex items-center justify-center gap-2 shadow"
        >
          <span>💻</span>
          <span>{lang === 'vi' ? 'Mở Phòng Thí Nghiệm SQL (/lab) →' : 'Open Interactive SQL Lab (/lab) →'}</span>
        </Link>
      </div>
    </section>
  );
}
