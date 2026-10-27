'use client';

import React, { useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';
import ProjectCardItem, { type ProjectCardData } from '@/components/site/projects/ProjectCardItem';

const FALLBACK_FLAGSHIP_PROJECTS: ProjectCardData[] = [
  {
    id: 'proj-kami-ely',
    title: {
      vi: 'Kami Ely: Phân tích hiệu suất TikTok Shop và mạng lưới Affiliate',
      en: 'Kami Ely: TikTok Shop performance and affiliate network analytics',
    },
    description: {
      vi: 'Đánh giá thực nghiệm 231 ngày vận hành (15,01 tỷ VNĐ, 101.896 sản phẩm) từ dữ liệu ước tính FastMoss: phân rã nguồn thu kênh in-house vs 301 KOC, hồi quy OLS mùa vụ (R² = 0,446) và chuyển trục danh mục sang Thu Đông.',
      en: 'Empirical 231-day evaluation (15.01B VND, 101,896 units) from FastMoss estimates: in-house vs. 301 KOC attribution, seasonal OLS regression (R² = 0.446), and autumn SKU pivot.',
    },
    tech: ['SQL (Window Functions)', 'Python (OLS & Stats)', 'Cohort & HHI', 'Data Governance'],
    featured: true,
  },
  {
    id: 'proj-library-bus',
    title: {
      vi: 'Library Bus: Thiết kế UX/UI Website Thư Viện Lưu Động',
      en: 'Library Bus: UX/UI Design for a Mobile Library Website',
    },
    description: {
      vi: 'Nghiên cứu, logo và thành phần giao diện, hệ thống lưới, wireframe và UI design cho 20 màn hình desktop kèm bản mobile của website xe thư viện lưu động.',
      en: 'Research, logo and UI components, grid system, wireframes and UI design for 20 desktop screens plus mobile versions of a mobile library website.',
    },
    tech: ['UX Research', 'Wireframe', 'Design System', 'UI Design'],
    featured: true,
  },
  {
    id: 'proj-heritage-japan',
    title: {
      vi: 'Kinh Tế Lượng Di Sản Văn Hóa & Chính Sách Du Lịch Nhật Bản (2015-2025)',
      en: 'Cultural Heritage Econometrics & Tourism Policy in Japan (2015-2025)',
    },
    description: {
      vi: 'Định lượng sự bất cân xứng không gian của 1.132 Quốc bảo và 13.377 Tài sản văn hóa quan trọng (Gini = 0,64). Ứng dụng hồi quy OLS (R² = 0,84) và mô hình Sai phân kép (DiD) đánh giá hiệu quả Luật Bảo tồn sửa đổi năm 2019.',
      en: 'Quantified spatial disparity across 1,132 National Treasures and 13,377 Important Cultural Properties (Gini = 0.64). Applied OLS regression (R² = 0.84) and Difference-in-Differences (DiD) to evaluate the 2019 Law Reform.',
    },
    tech: ['Econometrics (OLS & DiD)', 'Spatial Gini Analysis', 'Policy Simulation', 'Data Storytelling'],
    featured: true,
  },
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
    const byBareId = new Map<string, ProjectCardData>();
    for (const item of FALLBACK_FLAGSHIP_PROJECTS) {
      byBareId.set(item.id.replace(/^proj-/, ''), item);
    }
    for (const p of projects as ProjectCardData[]) {
      if (p?.id) {
        const bare = p.id.replace(/^proj-/, '');
        const fallback = byBareId.get(bare);
        byBareId.set(bare, { ...fallback, ...p, id: p.id.startsWith('proj-') ? p.id : `proj-${p.id}` });
      }
    }
    return Array.from(byBareId.values());
  }, [projects]);

  return (
    <section id="projects" aria-label="Flagship Case Studies" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#C8EEF7]/45 text-[#074553] border border-[#9BE7FA]/50 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700">
          {lang === 'vi'
            ? 'Ma trận năng lực & 3 dự án phân tích'
            : 'Cross-project matrix & 3 flagship case studies'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white pt-1">
          {lang === 'vi'
            ? 'Đối chiếu quy mô dữ liệu, phát hiện cốt lõi & tác động vận hành'
            : 'Comparing dataset scale, core findings & operational impact'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          {lang === 'vi'
            ? '3 dự án đại diện 3 mảng kỹ năng (E-Commerce Analytics, UX/UI Product Design & Kinh tế lượng chính sách), đi kèm số liệu thực nghiệm kiểm chứng được.'
            : '3 empirical case studies across E-Commerce Analytics, UX/UI Product Design, and Policy Econometrics with auditable data.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mergedProjects.map((project, idx) => (
          <ProjectCardItem key={project.id} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
