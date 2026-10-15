'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Sparkles, ArrowRight, Briefcase, X
} from 'lucide-react';
import { ProjectData } from '@/app/types';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { sanitizeEmbedUrl } from '@/app/lib/security';
import { ProjectCardItem } from './projects/ProjectCardItem';
import { getProjectPresentation } from './projects/projectPresentation';

interface ProjectsSectionProps {
  projects: ProjectData[];
  onSelectProject?: (_projId: string) => void;
  isFeaturedView?: boolean;
}

export default React.memo(function ProjectsSection({ 
  projects, 
  onSelectProject, 
  isFeaturedView = false 
}: ProjectsSectionProps) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeEmbedProject, setActiveEmbedProject] = useState<ProjectData | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isEn = language === 'en';

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.tags?.forEach(t => tags.add(t)));
    return ['all', ...Array.from(tags)];
  }, [projects]);

  // Filter projects (used when in full page mode)
  const filteredProjects = useMemo(() => {
    if (isFeaturedView) {
      return projects.slice(0, 3);
    }
    return projects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchTag = selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag));
      return matchSearch && matchTag;
    });
  }, [projects, isFeaturedView, searchTerm, selectedTag]);

  // Animations are now handled via Tailwind CSS classes

  const handleOpenDetail = (projId: string) => {
    trackVisitorAction(`Xem bài viết chi tiết dự án: ${projId}`, projId, 'project');
    if (onSelectProject) {
      onSelectProject(projId);
    } else {
      router.push(`/projects/${projId}`);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={isFeaturedView ? "w-full space-y-8" : "page-container py-10 sm:py-16 space-y-10"}
    >
      {/* Search & Filter Header (ONLY rendered on full Projects page, omitted on Homepage to prevent duplicate header) */}
      {!isFeaturedView && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/90 dark:border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue-light/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-brand-blue-vivid dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <Sparkles className="w-3.5 h-3.5 text-brand-teal dark:text-[#9BE7FA]" />
                <span className="editorial-kicker">{t('projects_badge', 'Case Studies & Phân Tích Thực Tế')}</span>
              </div>
              <h1 className="editorial-section-title text-3xl sm:text-4xl lg:text-5xl">
                {t('projects_heading', 'Dự Án Phân Tích Dữ Liệu Nổi Bật')}
              </h1>
              <p className="editorial-lead text-sm sm:text-base max-w-2xl">
                {t('projects_subheading', 'Các dự án thực chiến giải quyết bài toán kinh doanh cụ thể bằng SQL, Python, Power BI và Recharts')}
              </p>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('projects_search_placeholder', 'Tìm kiếm dự án, công cụ...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9BE7FA] transition-all dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9BE7FA] cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                >
                  <option value="all">{t('projects_filter_all_tech', 'Tất cả công nghệ')} ({projects.length})</option>
                  {allTags.filter(t => t !== 'all').map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-[0.97] ${
                  selectedTag === tag
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-[#C8EEF7]/20 hover:border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {tag === 'all' ? (isEn ? 'All Projects' : 'Tất cả dự án') : `#${tag}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Editorial Full-Width Cards (30-Second Scan) - Homepage Only */}
      {isFeaturedView ? (
        <div className="space-y-8">
          {filteredProjects.map((proj, idx) => (
            <ProjectCardItem
              key={proj.id}
              project={proj}
              index={idx}
              isEn={isEn}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>
      ) : (
        /* Standard 3-Column Grid - Projects Page */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((proj, idx) => {
            const presentation = getProjectPresentation(proj, isEn);

            return (
              <Link
                href={`/projects/${proj.id}`}
                id={proj.id}
                key={proj.id}
                onClick={() => handleOpenDetail(proj.id)}
                className="project-card-item animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both card-minimal flex flex-col justify-between overflow-hidden p-0 group cursor-pointer border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1524] rounded-2xl hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA] transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Structured Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-[#074553] dark:text-[#9BE7FA] block">
                      {presentation.kicker}
                    </span>

                    {/* High-impact Title */}
                    <h3 className="text-lg font-heading font-bold text-slate-950 dark:text-white leading-snug group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors line-clamp-2">
                      {presentation.title}
                    </h3>
                  </div>

                  {/* Hero Proof-Point KPI Box */}
                  <div className="p-3.5 rounded-xl bg-[#C8EEF7]/25 dark:bg-slate-900/80 border border-[#9BE7FA]/40 dark:border-slate-800 space-y-0.5">
                    <div className="text-xl font-mono font-black text-slate-950 dark:text-white tabular-nums">
                      {presentation.value}
                    </div>
                    <div className="text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">
                      {presentation.sub}
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {presentation.problem}
                  </p>

                  {/* Tools */}
                  {presentation.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {presentation.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Direct Action Link */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-[#074553] dark:text-[#9BE7FA] group-hover:underline inline-flex items-center gap-1.5">
                      <span>{isEn ? 'Read case study' : 'Đọc case study'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty Filter State (Only for full projects page) */}
      {!isFeaturedView && filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {t('projects_no_results', 'Không tìm thấy dự án phù hợp')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isEn ? 'Try searching with different keywords or reset tags.' : 'Hãy thử tìm kiếm với từ khóa khác hoặc chọn lại bộ lọc.'}
          </p>
        </div>
      )}

      {/* Embed Modal */}
      {activeEmbedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setActiveEmbedProject(null)}
          />

          <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 ml-2 dark:text-white">
                  {activeEmbedProject.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveEmbedProject(null)}
                aria-label="Đóng khung xem trực quan hóa nhúng"
                className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 w-full h-full bg-slate-50 dark:bg-slate-950">
              <iframe
                src={sanitizeEmbedUrl(activeEmbedProject.embedUrl)}
                title={activeEmbedProject.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
});
