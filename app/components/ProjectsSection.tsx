'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { 
  Briefcase, Search, Sparkles, ArrowRight, X
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
  isFeaturedView?: boolean;
}

interface ProjectPresentationMeta {
  kicker: string;
  title: string;
  value: string;
  sub: string;
  desc: string;
  problem: string;
}

function getProjectPresentation(proj: ProjectData, isEn: boolean): ProjectPresentationMeta {
  if (proj.id === 'proj-kami-ely') {
    return {
      kicker: 'TIKTOK SHOP · CREATOR ANALYTICS',
      title: isEn ? 'Kami Ely: TikTok Shop & Creator Analytics' : 'Kami Ely: Phân Tích TikTok Shop & Creator Telemetry',
      value: isEn ? '31.6B VND' : '31.6 Tỷ VNĐ',
      sub: isEn ? '52.7% affiliate GMV from nano-creators' : '52.7% GMV affiliate từ nano-creator',
      desc: isEn 
        ? 'E-commerce telemetry & creator performance matrix across 338 products and 5,700 affiliates.'
        : 'Hệ thống phân tích hiệu suất bán hàng TikTok Shop và ma trận chuyển đổi 5.700 nhà sáng tạo nội dung.',
      problem: isEn
        ? 'Optimizing commercial synergy between brand LIVE streams and external affiliate tiers.'
        : 'Tối ưu hóa doanh thu giữa kênh LIVE thương hiệu và mạng lưới affiliate đa tầng.',
    };
  }

  if (proj.id === 'proj-heritage-japan') {
    return {
      kicker: 'TIME-SERIES · MACRO ANALYTICS',
      title: isEn ? 'Inbound Tourism in Japan: Time-Series Analysis' : 'Phát Triển Du Lịch Di Sản Nhật Bản: Time-Series Analysis',
      value: isEn ? '4.81T JPY' : '4.81 Nghìn Tỷ Yên',
      sub: isEn ? '+318% tourist spend surge' : 'Tăng trưởng chi tiêu +318%',
      desc: isEn
        ? 'Econometric time-series model evaluating inbound arrivals and regional tourism spend across Japan.'
        : 'Phân tích chuỗi thời gian chu kỳ phục hồi du lịch quốc tế và chi tiêu của du khách tại các trung tâm văn hóa Nhật Bản.',
      problem: isEn
        ? 'Quantifying the economic impact of cultural heritage promotion policies on regional recovery.'
        : 'Đo lường tác động kinh tế của chính sách xúc tiến di sản đối với tăng trưởng chi tiêu vùng.',
    };
  }

  if (proj.id === 'proj-library-bus') {
    return {
      kicker: 'SYSTEM DESIGN · DATABASE ARCHITECTURE',
      title: isEn ? 'Library Bus: Mobile Logistics & Query Pipeline' : 'Library Bus: Tối Ưu Logistics & Truy Vấn Cơ Sở Dữ Liệu',
      value: '450ms → 28ms',
      sub: isEn ? '93.7% latency reduction' : 'Giảm 93.7% độ trễ truy vấn',
      desc: isEn
        ? 'High-concurrency relational data architecture and asynchronous pipeline serving 50,000 active readers.'
        : 'Kiến trúc cơ sở dữ liệu quan hệ và luồng xử lý bất đồng bộ phục vụ 50.000 độc giả với độ trễ thấp.',
      problem: isEn
        ? 'Real-time inventory synchronization and reservation concurrency race conditions across roving bus stops.'
        : 'Xung đột dữ liệu đặt mượn sách thời gian thực và lệch tồn kho giữa các trạm xe lưu động.',
    };
  }

  // Dynamic fallback for custom CMS projects
  const firstMetric = proj.metrics && proj.metrics[0];
  return {
    kicker: proj.tags && proj.tags[0] ? `${proj.tags[0].toUpperCase()} · ANALYTICS` : 'DATA ANALYTICS',
    title: proj.title,
    value: firstMetric ? firstMetric.value : 'Verified Impact',
    sub: firstMetric ? (firstMetric.change || firstMetric.label) : (proj.tags ? proj.tags.slice(0, 2).join(' · ') : 'Analytics Case Study'),
    desc: proj.desc,
    problem: proj.problem || (isEn ? 'Optimizing data pipelines and reporting efficiency.' : 'Tối ưu hóa pipeline dữ liệu và nâng cao hiệu suất báo cáo.'),
  };
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

  useGSAP(() => {
    gsap.from('.project-card-item', {
      autoAlpha: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.45,
      ease: 'power3.out',
    });
  }, { scope: containerRef, dependencies: [filteredProjects.length, selectedTag, isFeaturedView] });

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
      className={isFeaturedView ? "w-full space-y-8" : "max-w-6xl mx-auto py-10 px-4 sm:px-8 lg:px-10 space-y-10"}
    >
      {/* Search & Filter Header (ONLY rendered on full Projects page, omitted on Homepage to prevent duplicate header) */}
      {!isFeaturedView && (
        <div className="space-y-6">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#0F172A] text-white shadow-xs dark:bg-[#9BE7FA] dark:text-slate-950'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {tag === 'all' ? (isEn ? 'All Projects' : 'Tất cả dự án') : `#${tag}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Streamlined Recruiter-First Project Card Grid (3-Second Scan Rule) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((proj, idx) => {
          const presentation = getProjectPresentation(proj, isEn);

          return (
            <div
              id={proj.id}
              key={proj.id}
              onClick={() => handleOpenDetail(proj.id)}
              className="project-card-item card-minimal flex flex-col justify-between overflow-hidden p-0 group cursor-pointer border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1524] rounded-2xl hover:border-[#0D7287]/40 dark:hover:border-[#9BE7FA]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* 1. Project Image Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
                <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                  CASE STUDY 0{idx + 1}
                </div>

                {proj.img ? (
                  <Image
                    src={sanitizeUrl(proj.img, '')}
                    alt={presentation.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Briefcase className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
              </div>

              {/* 2. Structured Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Category Kicker */}
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] block">
                    {presentation.kicker}
                  </span>

                  {/* High-impact Title */}
                  <h3 className="text-lg font-heading font-bold text-slate-950 dark:text-white leading-snug group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors line-clamp-2">
                    {presentation.title}
                  </h3>
                </div>

                {/* 3. Hero Proof-Point KPI Box (Single Strong Highlight) */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <div className="text-xl font-mono font-black text-slate-950 dark:text-white tabular-nums">
                    {presentation.value}
                  </div>
                  <div className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                    {presentation.sub}
                  </div>
                </div>

                {/* 4. Elevator Pitch (1-2 sentences) */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {presentation.desc}
                </p>

                {/* 5. Business Problem Snippet */}
                {presentation.problem && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      {isEn ? 'Business Problem' : 'Bài toán thực tế'}
                    </span>
                    <p className="line-clamp-2 leading-relaxed">
                      {presentation.problem}
                    </p>
                  </div>
                )}

                {/* 6. Direct Action Link */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-[#0D7287] dark:text-[#9BE7FA] group-hover:underline inline-flex items-center gap-1.5">
                    <span>{isEn ? 'Read case study' : 'Đọc case study'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
