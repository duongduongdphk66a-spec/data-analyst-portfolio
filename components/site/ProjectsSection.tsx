'use client';

import React, { useMemo } from 'react';
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

  return (
    <section id="projects" aria-label="Flagship Case Studies" className="w-full space-y-6">
      {/* HEADER: MA TRẬN & DANH MỤC ĐỐI SÁNH DỰ ÁN */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-[#9BE7FA]/20 text-[#074553] border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700">
          {lang === 'vi'
            ? 'MA TRẬN NĂNG LỰC & 3 DỰ ÁN THỰC CHIẾN'
            : 'CROSS-PROJECT MATRIX & 3 FLAGSHIP CASE STUDIES'}
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
          {lang === 'vi'
            ? 'Đối Chiếu Quy Mô Dữ Liệu, Phát Hiện Cốt Lõi & Tác Động Kinh Doanh'
            : 'Comparing Dataset Scale, Core Findings & Quantified Business Impact'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          {lang === 'vi'
            ? '3 dự án thực chiến đại diện 3 lĩnh vực trọng tâm (E-Commerce SQL, Product BI & Kinh tế lượng). Mỗi dự án đều tích hợp bộ số liệu kiểm chứng, giải mã nghịch lý thực tế và mô hình tương tác What-If.'
            : '3 empirical case studies across 3 core domains (E-Commerce SQL, Product BI & Econometrics) with auditable data, counter-intuitive findings, and interactive What-If simulators.'}
        </p>
      </div>

      {/* GRID 3 THẺ CASE STUDIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mergedProjects.map((project, idx) => (
          <ProjectCardItem key={project.id} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
