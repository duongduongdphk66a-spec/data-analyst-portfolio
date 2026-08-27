'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Briefcase, ExternalLink, Github, Search, Filter, Play, 
  X, Maximize2, Tag, Star, Sparkles, FileText 
} from 'lucide-react';
import { ProjectData } from '../types';
import { sanitizeUrl } from '../lib/security';
import { trackVisitorAction } from '../lib/visitorTracking';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

interface ProjectsSectionProps {
  projects: ProjectData[];
  onSelectProject?: (projId: string) => void;
}

export default React.memo(function ProjectsSection({ projects, onSelectProject }: ProjectsSectionProps) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeEmbedProject, setActiveEmbedProject] = useState<ProjectData | null>(null);
  const router = useRouter();

  // English localized project data mapping
  const localizedProjects = useMemo(() => {
    if (language !== 'en') return projects;

    const enMeta: Record<string, { title: string; desc: string }> = {
      'proj-kami-ely': {
        title: 'Kami Ely — TikTok Shop Performance Analytics',
        desc: 'Comprehensive analysis of sales performance, creator affiliate networks, and self-operated livestream channels for Sports & Outdoor e-commerce.'
      },
      'proj-heritage-japan': {
        title: 'The Evolution of Heritage Tourism in Japan',
        desc: 'Time-series analysis of inbound international arrivals, tourist spending, and preservation policies in Japan (2013–present).'
      },
      'proj-library-bus': {
        title: 'Library Bus Management System',
        desc: 'Mobile library management platform integrating IoT GPS tracking, real-time book reservation, and automated overdue penalty billing.'
      }
    };

    return projects.map(p => {
      const meta = enMeta[p.id];
      if (meta) {
        return { ...p, title: meta.title, desc: meta.desc };
      }
      return p;
    });
  }, [projects, language]);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    localizedProjects.forEach(p => p.tags.forEach(t => tags.add(t)));
    return ['all', ...Array.from(tags)];
  }, [localizedProjects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return localizedProjects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTag = selectedTag === 'all' || p.tags.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [localizedProjects, searchTerm, selectedTag]);

  const handleOpenDetail = (projId: string) => {
    trackVisitorAction(`Xem bài viết chi tiết dự án: ${projId}`, projId, 'project');
    if (onSelectProject) {
      onSelectProject(projId);
    } else {
      router.push(`/projects/${projId}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-brand-blue-light">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue-light/50 text-slate-800 rounded-full text-xs font-semibold tracking-wide border border-brand-blue/50 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            {t('projects_badge', 'Showcase & Case Studies')}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('projects_heading', 'Dự án Phân tích Dữ liệu')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('projects_subheading', 'Tổng hợp các dự án thực tế về SQL, Python, Machine Learning và Dashboard')}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('projects_search_placeholder', 'Tìm kiếm dự án...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-brand-blue-light rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-brand-blue-light rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
            >
              <option value="all">{t('projects_filter_all_tech', 'Tất cả công nghệ')} ({localizedProjects.length})</option>
              {allTags.filter(t => t !== 'all').map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tag Pills */}
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedTag === tag
                ? 'bg-brand-yellow text-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border border-brand-blue-light hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tag === 'all' ? t('projects_all_tag', '✨ Tất cả') : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            id={proj.id}
            key={proj.id}
            onClick={() => handleOpenDetail(proj.id)}
            className="cursor-pointer bg-white rounded-3xl border border-brand-blue-light shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1 relative"
          >
            {/* Featured badge */}
            {proj.featured && (
              <div className="absolute top-4 left-4 z-10 bg-brand-yellow text-slate-900 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {t('projects_featured', 'Nổi bật')}
              </div>
            )}

            {/* Thumbnail */}
            <div className="h-52 bg-brand-blue-light/40 relative overflow-hidden flex-shrink-0">
              {proj.img ? (
                <Image
                  src={sanitizeUrl(proj.img, '')}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Briefcase className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-slate-900 transition-colors">
                {proj.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {proj.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {proj.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 bg-brand-blue-light/40 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div 
                className="mt-auto pt-4 border-t border-brand-blue-light/50 flex items-center justify-between gap-2 relative z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  {proj.embedUrl ? (
                    <button
                      onClick={() => {
                        trackVisitorAction(`Xem Live Demo nhúng: ${proj.title}`, proj.embedUrl, 'project');
                        setActiveEmbedProject(proj);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {t('projects_btn_demo', 'Live Demo')}
                    </button>
                  ) : proj.demoUrl ? (
                    <a
                      href={sanitizeUrl(proj.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackVisitorAction(`Mở Demo Link dự án: ${proj.title}`, proj.demoUrl, 'project')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Demo Link
                    </a>
                  ) : null}
                  <button
                    onClick={() => handleOpenDetail(proj.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {t('projects_btn_details', 'Chi tiết')}
                  </button>
                </div>

                {proj.githubUrl && (
                  <a
                    href={sanitizeUrl(proj.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackVisitorAction(`Xem GitHub dự án: ${proj.title}`, proj.githubUrl, 'project')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-700 rounded-xl text-xs font-medium transition-all"
                  >
                    <Github className="w-4 h-4" />
                    {t('projects_btn_source', 'Source')}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-blue-light">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">
            {t('projects_no_results', 'Không tìm thấy dự án phù hợp')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'en' ? 'Try searching with different keywords or reset tags.' : 'Hãy thử tìm kiếm với từ khóa khác hoặc chọn lại bộ lọc.'}
          </p>
        </div>
      )}

      {/* Interactive Embed / Iframe Modal */}
      {activeEmbedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-brand-yellow/60 backdrop-blur-sm"
            onClick={() => setActiveEmbedProject(null)}
          />

          <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl border border-brand-blue-light overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-brand-blue-light flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-brand-yellow" />
                <div className="w-3 h-3 rounded-full bg-brand-blue" />
                <h3 className="text-base font-bold text-slate-900 ml-2">
                  {activeEmbedProject.title} — {language === 'en' ? 'Live Interactive Embed' : 'Trải nghiệm Trực tiếp (Live Embed)'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {activeEmbedProject.demoUrl && (
                  <a
                    href={activeEmbedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-brand-blue-light/50"
                    title={language === 'en' ? 'Open in new tab' : 'Mở trong tab mới'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setActiveEmbedProject(null)}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-brand-blue-light/50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe */}
            <div className="flex-1 w-full h-full bg-slate-50">
              <iframe
                src={activeEmbedProject.embedUrl}
                title={activeEmbedProject.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
