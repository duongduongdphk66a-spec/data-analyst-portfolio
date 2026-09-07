'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { 
  Briefcase, Search, Star, Sparkles, FileText, ArrowRight,
  Cpu, X
} from 'lucide-react';
import { ProjectData } from '../types';
import { sanitizeUrl, sanitizeEmbedUrl } from '../lib/security';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { gsap, useGSAP } from '../lib/gsap';

interface ProjectsSectionProps {
  projects: ProjectData[];
  onSelectProject?: (_projId: string) => void;
}

export default React.memo(function ProjectsSection({ projects, onSelectProject }: ProjectsSectionProps) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeEmbedProject, setActiveEmbedProject] = useState<ProjectData | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // English localized project data mapping (without em-dashes)
  const localizedProjects = useMemo(() => {
    if (language !== 'en') return projects;

    const enMeta: Record<string, { title: string; desc: string; problem?: string; method?: string; insight?: string }> = {
      'proj-kami-ely': {
        title: 'Kami Ely: TikTok Shop (31.6B VND) & Creator Kamielyn (@kamielyhn) Telemetry',
        desc: 'Comprehensive 2-part report: (1) Shop performance across 338 products, 5.7k affiliates, 11.2k videos, 7k live sessions; and (2) Top creator @kamielyhn demographics, 24h curve, and commercial conversion matrix.',
        problem: 'Optimizing the commercial synergy between brand-owned LIVE accounts and external creator affiliate tiers, while finding the optimal engagement windows for creator content.',
        method: 'Extracted and synthesized 45 FastMoss telemetry files in Python, categorized 5.7k creators across follower tiers, and mapped 24h posting behavioral curves.',
        insight: 'LIVE Shopping drives 55.9% of shop GMV. Nano-creators (1k-5k followers) generate 52.7% of affiliate GMV (2.5B VND). Creator @kamielyhn peaked at 15:00-16:00 with 0.74% engagement.'
      },
      'proj-heritage-japan': {
        title: 'The Evolution of Heritage Tourism in Japan: Time-Series Analysis',
        desc: 'Time-series analysis of inbound international arrivals, tourist spending, and preservation policies in Japan (2013-present).',
        problem: 'Quantifying the economic impact of cultural heritage promotion policies and evaluating tourism recovery trajectories across cultural centers (Kyoto, Nara).',
        method: 'Ingested 20-year JNTO data, built statistical time-series models, and decomposed inbound arrivals and regional expenditure trends.',
        insight: 'Tourism spending reached 4.81 Trillion Yen in 2019 (+318% vs 2010). Cultural heritage visitors spent 3.2x more on local experiences than standard leisure travelers.'
      },
      'proj-library-bus': {
        title: 'Library Bus Management System: Logistics & Data Optimization',
        desc: 'Mobile library data architecture and asynchronous query pipeline serving 50,000 active users with sub-30ms response times.',
        problem: 'Real-time inventory desynchronization and reservation concurrency race conditions across dynamic roving library bus locations.',
        method: 'Engineered 3NF relational schema with ACID transactional guarantees, integrated distributed Redis caching, and decoupled tasks with Celery workers.',
        insight: 'Achieved 93.7% latency reduction (450ms down to 28ms), handled 500 concurrent connections seamlessly, and eliminated 100% of double-booking anomalies.'
      }
    };

    return projects.map(p => {
      const meta = enMeta[p.id];
      if (meta) {
        return { 
          ...p, 
          title: meta.title, 
          desc: meta.desc,
          problem: meta.problem || p.problem,
          method: meta.method || p.method,
          insight: meta.insight || p.insight
        };
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
                          p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchTag = selectedTag === 'all' || p.tags.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [localizedProjects, searchTerm, selectedTag]);

  useGSAP(() => {
    gsap.from('.project-card-item', {
      autoAlpha: 0,
      y: 25,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, { scope: containerRef, dependencies: [filteredProjects.length, selectedTag] });

  const handleOpenDetail = (projId: string) => {
    trackVisitorAction(`Xem bài viết chi tiết dự án: ${projId}`, projId, 'project');
    if (onSelectProject) {
      onSelectProject(projId);
    } else {
      router.push(`/projects/${projId}`);
    }
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto py-10 px-4 sm:px-8 lg:px-10 space-y-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('projects_badge', 'Case Studies & Phân Tích Thực Tế')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
            {t('projects_heading', 'Dự Án Phân Tích Dữ Liệu Nổi Bật')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
            {t('projects_subheading', 'Các dự án thực chiến giải quyết bài toán kinh doanh cụ thể bằng SQL, Python, Power BI và Recharts')}
          </p>
        </div>

        {/* Search & Filter Controls */}
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
              <option value="all">{t('projects_filter_all_tech', 'Tất cả công nghệ')} ({localizedProjects.length})</option>
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
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedTag === tag
                ? 'bg-[#0F172A] text-white shadow-xs dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {tag === 'all' ? (language === 'en' ? 'All Projects' : 'Tất cả dự án') : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Featured Projects Deep Showcase List */}
      <div className="projects-list space-y-8">
        {filteredProjects.map((proj, idx) => (
          <div
            id={proj.id}
            key={proj.id}
            className="project-card-item card-bento overflow-hidden flex flex-col lg:flex-row gap-6 p-6 sm:p-8 hover:border-[#9BE7FA] transition-all duration-300"
          >
            {/* Left/Top Media & Thumbnail */}
            <div className="lg:w-5/12 flex flex-col justify-between space-y-4">
              
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 group">
                {proj.featured && (
                  <div className="absolute top-3 left-3 z-10 bg-[#FFD14C] text-slate-950 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1 font-serif border border-[#FFE485]">
                    <Star className="w-3 h-3 fill-current text-slate-950" />
                    <span>CASE STUDY 0{idx + 1}</span>
                  </div>
                )}

                {proj.img ? (
                  <Image
                    src={sanitizeUrl(proj.img, '')}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Briefcase className="w-12 h-12" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                
                {/* Overlay quick open */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                  <span>{proj.tags.slice(0, 2).join(' · ')}</span>
                  <button 
                    onClick={() => handleOpenDetail(proj.id)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors cursor-pointer"
                    title="View Project"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* KPI Metrics Highlight Strip */}
              {proj.metrics && proj.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {proj.metrics.slice(0, 2).map((m) => (
                    <div key={m.label} className="p-3 rounded-xl bg-[#FAFDFE] dark:bg-slate-800/80 border border-[#E2F1F8] dark:border-slate-700 space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block dark:text-slate-400">
                        {m.label}
                      </span>
                      <div className="text-lg font-bold font-serif text-slate-950 tabular-nums dark:text-white">
                        {m.value}
                      </div>
                      {m.change && (
                        <span className="text-[11px] font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                          {m.change}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Right/Bottom Structured Storytelling Body */}
            <div className="lg:w-7/12 flex flex-col justify-between space-y-5">
              
              {/* Title & High-level description */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[#C8EEF7]/50 text-[#0D7287] dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA] rounded-lg text-xs font-semibold border border-[#9BE7FA]/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug dark:text-white">
                  {proj.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal dark:text-slate-400">
                  {proj.desc}
                </p>
              </div>

              {/* 3 Pillars: Problem -> Method -> Key Insight */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAFDFE] dark:bg-slate-800/40 border border-[#E2F1F8] dark:border-slate-800 text-xs sm:text-sm">
                
                {/* Problem */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{language === 'en' ? 'Business Problem:' : 'Vấn Đề Đặt Ra:'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 pl-3.5 leading-relaxed font-normal">
                    {proj.problem || (language === 'en' ? 'Identified inefficiencies in revenue distribution and resource allocation.' : 'Doanh nghiệp gặp khó khăn trong việc đánh giá hiệu quả kênh bán và phân bổ chi phí.')}
                  </p>
                </div>

                {/* Method */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span>{language === 'en' ? 'Analytical Method & Pipeline:' : 'Phương Pháp Phân Tích:'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 pl-3.5 leading-relaxed font-normal">
                    {proj.method || (language === 'en' ? 'Executed data extraction, wrangling in Python/SQL, and interactive visualization.' : 'Trích xuất, làm sạch dữ liệu giao dịch và xây dựng mô hình phân tích trực quan.')}
                  </p>
                </div>

                {/* Insight / Result */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#FFD14C]" />
                    <span>{language === 'en' ? 'Strategic Insight & Impact:' : 'Insight & Kết Quả Then Chốt:'}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 pl-3.5 leading-relaxed font-normal">
                    {proj.insight || (language === 'en' ? 'Provided data-backed recommendations delivering measurable operational improvements.' : 'Tối ưu hóa phân bổ nguồn lực và hỗ trợ đưa ra quyết định tăng trưởng chính xác.')}
                  </p>
                </div>

              </div>

              {/* Tools & Action Buttons Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                
                {/* Tools */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{proj.tools ? proj.tools.join(' · ') : proj.tags.join(' · ')}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {proj.demoUrl && (
                    <a
                      href={sanitizeUrl(proj.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-xs transition-[transform,background-color,border-color] duration-160 inline-flex items-center gap-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 active:scale-[0.97]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'PDF Documentation' : 'Tài Liệu PDF'}</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenDetail(proj.id)}
                    className="px-4 py-2.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 font-heading font-bold text-xs shadow-xs hover:shadow-md shadow-amber-500/15 transition-[transform,background-color,box-shadow] duration-160 ease-[var(--ease-out)] inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
                  >
                    <span>{language === 'en' ? 'Explore Case Study' : 'Xem Case Study Chi Tiết'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Empty Filter State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {t('projects_no_results', 'Không tìm thấy dự án phù hợp')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'en' ? 'Try searching with different keywords or reset tags.' : 'Hãy thử tìm kiếm với từ khóa khác hoặc chọn lại bộ lọc.'}
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
