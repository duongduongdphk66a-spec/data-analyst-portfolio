'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Sparkles, ArrowRight, Briefcase, X, Target, FlaskConical, Lightbulb, Wrench
} from 'lucide-react';
import { ProjectData } from '@/app/types';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { sanitizeEmbedUrl } from '@/app/lib/security';

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
  method: string;
  insight: string;
  metrics: { label: string; value: string; change?: string; isPositive?: boolean }[];
  tools: string[];
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
      method: isEn
        ? 'Compare 551 video vs 470 live sessions, model saturation curves at ~3.1h/day, decompose 180-day time series (Trend + Seasonality + Residual).'
        : 'So sánh 551 video vs 470 phiên live, mô hình hóa đường cong bão hòa ~3.1h/ngày, phân rã chuỗi thời gian 180 ngày (Xu hướng + Mùa vụ + Nhiễu).',
      insight: isEn
        ? 'Video outperforms Live by 4.48x GPM (p<0.0001). Summer seasonality explains 85% of the post-July drop. Cutting 50% excess live hours optimizes cash flow.'
        : 'Video vượt trội Live 4.48 lần GPM (p<0.0001). Chu kỳ mùa vụ hè lý giải 85% sụt giảm sau tháng 7. Cắt giảm 50% giờ live dư thừa tối ưu dòng tiền.',
      metrics: proj.metrics || [],
      tools: proj.tools || [],
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
      method: isEn
        ? 'Collect & normalize 20-year data from JNTO, MLIT, Kyoto & Nara tourism bureaus. Apply time-series modeling and multi-dimensional visual comparison.'
        : 'Thu thập, chuẩn hóa dữ liệu 20 năm từ JNTO, MLIT, Sở Du lịch Kyoto & Nara. Áp dụng mô hình chuỗi thời gian và trực quan hóa so sánh đa chiều.',
      insight: isEn
        ? 'Tourism spend peaked at ¥4.81T (+318%). Cultural experience travelers spend 3.2x more than regular tourists. Post-pandemic recovery reaches 88.4%.'
        : 'Chi tiêu du lịch đạt đỉnh 4.81 nghìn tỷ Yên (+318%). Khách trải nghiệm văn hóa chi tiêu gấp 3.2 lần. Tỷ lệ phục hồi hậu đại dịch đạt 88.4%.',
      metrics: proj.metrics || [],
      tools: proj.tools || [],
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
      method: isEn
        ? 'Design 3NF ERD with strict ACID transactions, implement Redis distributed cache and Celery background workers to offload CPU.'
        : 'Thiết kế ERD chuẩn 3NF với ràng buộc ACID, áp dụng Redis Cache phân tán và Celery Background Worker giải phóng tải CPU.',
      insight: isEn
        ? 'Reduced query latency by 93.7% (450ms→28ms), sustained 500 concurrent connections with zero downtime, and eliminated 100% reservation conflicts.'
        : 'Giảm 93.7% độ trễ (450ms→28ms), chịu tải ổn định 500 kết nối đồng thời, triệt tiêu 100% xung đột mượn sách.',
      metrics: proj.metrics || [],
      tools: proj.tools || [],
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
    method: proj.method || (isEn ? 'Data collection, cleaning, statistical analysis, and visual storytelling.' : 'Thu thập, chuẩn hóa, phân tích thống kê và trực quan hóa dữ liệu.'),
    insight: proj.insight || (isEn ? 'Data-driven insights revealing actionable business recommendations.' : 'Insight dựa trên dữ liệu giúp đưa ra khuyến nghị kinh doanh hành động.'),
    metrics: proj.metrics || [],
    tools: proj.tools || [],
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

      {/* Featured Editorial Full-Width Cards (30-Second Scan) — Homepage Only */}
      {isFeaturedView ? (
        <div className="space-y-8">
          {filteredProjects.map((proj, idx) => {
            const presentation = getProjectPresentation(proj, isEn);

            return (
              <Link
                href={`/projects/${proj.id}`}
                id={proj.id}
                key={proj.id}
                onClick={() => handleOpenDetail(proj.id)}
                className="project-card-item animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both block group cursor-pointer rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1524] hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA] transition-all hover:shadow-2xl overflow-hidden"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Top Section: Kicker + Title + Description */}
                <div className="p-6 sm:p-8 pb-0 sm:pb-0 space-y-3">
                  {/* Kicker */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-black uppercase tracking-[0.15em] text-[#0D7287] dark:text-[#9BE7FA]">
                      {presentation.kicker}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">·</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {isEn ? 'CASE STUDY' : 'BÁO CÁO PHÂN TÍCH'} #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-heading font-black text-slate-950 dark:text-white leading-snug group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors">
                    {presentation.title}
                  </h3>

                  {/* Elevator Pitch */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    {presentation.desc}
                  </p>
                </div>

                {/* Middle Section: Problem → Method → Insight (3-column) */}
                <div className="px-6 sm:px-8 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 md:divide-x divide-[#9BE7FA]/25 dark:divide-slate-700/50">
                    {/* Problem */}
                    <div className="md:pr-5 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                          {isEn ? 'Problem' : 'Bài Toán'}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {presentation.problem}
                      </p>
                    </div>

                    {/* Method */}
                    <div className="md:px-5 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {isEn ? 'Method' : 'Phương Pháp'}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {presentation.method}
                      </p>
                    </div>

                    {/* Insight */}
                    <div className="md:pl-5 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {isEn ? 'Key Insight' : 'Phát Hiện'}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {presentation.insight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-6 sm:mx-8 h-px bg-gradient-to-r from-[#9BE7FA]/30 via-[#9BE7FA]/15 to-transparent dark:from-slate-700/50 dark:via-slate-800/30" />

                {/* Bottom Section: 4 KPIs + Tools + CTA */}
                <div className="p-6 sm:p-8 pt-5 sm:pt-5 space-y-4">
                  {/* KPI Grid */}
                  {presentation.metrics.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {presentation.metrics.slice(0, 4).map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3 rounded-xl bg-[#C8EEF7]/15 dark:bg-slate-900/60 border border-[#9BE7FA]/25 dark:border-slate-800 space-y-0.5"
                        >
                          <div className="text-base sm:text-lg font-mono font-black text-slate-950 dark:text-white tabular-nums leading-tight">
                            {metric.value}
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                            {metric.label}
                          </div>
                          {metric.change && (
                            <div className={`text-[10px] font-bold ${
                              metric.isPositive !== false
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}>
                              {metric.change}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tools + CTA Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {/* Tools */}
                    {presentation.tools.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Wrench className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                        {presentation.tools.slice(0, 5).map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <span className="text-xs font-heading font-bold text-[#074553] dark:text-[#9BE7FA] group-hover:underline inline-flex items-center gap-1.5 shrink-0">
                      <span>{isEn ? 'Read full case study' : 'Đọc chi tiết case study'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Standard 3-Column Grid — Projects Page */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((proj, idx) => {
            const presentation = getProjectPresentation(proj, isEn);

            return (
              <Link
                href={`/projects/${proj.id}`}
                id={proj.id}
                key={proj.id}
                onClick={() => handleOpenDetail(proj.id)}
                className="project-card-item animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both card-minimal flex flex-col justify-between overflow-hidden p-0 group cursor-pointer border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1524] rounded-2xl hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA] transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Structured Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Category Kicker */}
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA] block">
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
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-mono font-semibold text-slate-500 dark:text-slate-400"
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
