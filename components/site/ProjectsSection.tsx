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
      en: 'Multi-Source SQL Audit & Conversion Optimization: Kami Ely TikTok Shop'
    },
    description: {
      vi: 'Phân tích 9 bảng dữ liệu thực nghiệm (21.569 bản ghi SQL, 14,84 Tỉ VNĐ trong 226 ngày & 31,6 Tỉ VNĐ All-Time). Giải mã Nghịch lý GPM Video gấp 4,5x LIVE, quy luật Pareto trên 6.086 Creators và xây dựng mô hình What-If ROI.',
      en: 'Audited 9 empirical datasets (21,569 SQL rows, 14.84B VND in 226d & 31.6B VND All-Time). Uncovered the 4.5x Video vs LIVE GPM Paradox, Pareto concentration across 6,086 Creators, and built an interactive What-If ROI Optimizer.'
    },
    tech: ['SQL (MySQL/Window Functions)', 'Python (SciPy/Stats)', 'Power BI Blueprint', 'What-If Simulator'],
    featured: true
  },
  {
    id: 'library-bus',
    title: {
      vi: 'Library Bus: Thiết kế UX/UI Website Thư Viện Lưu Động',
      en: 'Library Bus: UX/UI Design for a Mobile Library Website'
    },
    description: {
      vi: 'Nghiên cứu, logo và thành phần giao diện, hệ thống lưới, wireframe và UI design cho 20 màn hình desktop kèm bản mobile của website xe thư viện lưu động.',
      en: 'Research, logo and UI components, grid system, wireframes and UI design for 20 desktop screens plus mobile versions of a mobile library website.'
    },
    tech: ['UX Research', 'Wireframe', 'Design System', 'UI Design'],
    featured: true
  },
  {
    id: 'heritage-japan',
    title: {
      vi: 'Kinh Tế Lượng Di Sản Văn Hóa & Chính Sách Du Lịch Nhật Bản (2015-2025)',
      en: 'Cultural Heritage Econometrics & Tourism Policy in Japan (2015-2025)'
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
    <section id="projects" aria-label="Flagship Case Studies" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* HEADER: MA TRẬN & DANH MỤC ĐỐI SÁNH DỰ ÁN */}
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#C8EEF7]/45 text-[#074553] border border-[#9BE7FA]/50 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700">
          {lang === 'vi'
            ? 'Ma trận năng lực & 3 dự án thực chiến'
            : 'Cross-project matrix & 3 flagship case studies'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white pt-1">
          {lang === 'vi'
            ? 'Đối Chiếu Quy Mô Dữ Liệu, Phát Hiện Cốt Lõi & Tác Động Kinh Doanh'
            : 'Comparing Dataset Scale, Core Findings & Quantified Business Impact'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
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
