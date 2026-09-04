'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Download, Edit3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ProfileData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { trackVisitorAction } from '../lib/visitorTracking';
import { gsap, useGSAP } from '../lib/gsap';
import AnimatedCounter from './ui/AnimatedCounter';
import { sanitizeUrl } from '../lib/security';

const HeroAreaChart = dynamic(() => import('./charts/HeroAreaChart'), {
  ssr: false,
  loading: () => <div className="h-44 sm:h-52 w-full bg-surface/20 rounded-xl animate-pulse" />,
});

interface HeroSectionProps {
  profile: ProfileData;
  onNavigateTab?: (_tabId: string) => void;
  onSelectProject?: (_projId: string) => void;
  onOpenAdmin?: () => void;
}

const heroChartData = [
  { y: "'03", v: 5.2 },
  { y: "'05", v: 6.7 },
  { y: "'07", v: 8.3 },
  { y: "'09", v: 6.8 },
  { y: "'10", v: 8.6 },
  { y: "'13", v: 10.4 },
  { y: "'15", v: 19.7 },
  { y: "'17", v: 28.7 },
  { y: "'19", v: 31.9 },
];

const STATS_VI = [
  { value: '3+', label: 'Dự án phân tích' },
  { value: '8.5 Tỷ', label: 'VNĐ dữ liệu xử lý' },
  { value: '93.7%', label: 'Cải thiện hiệu suất' },
];

const STATS_EN = [
  { value: '3+', label: 'Analytics projects' },
  { value: '8.5B', label: 'VND data processed' },
  { value: '93.7%', label: 'Performance gain' },
];

export default function HeroSection({ profile, onNavigateTab, onSelectProject, onOpenAdmin }: HeroSectionProps) {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';
  const stats = isEn ? STATS_EN : STATS_VI;
  const containerRef = useRef<HTMLElement>(null);
  const safeAvatarUrl = profile.avatarUrl ? sanitizeUrl(profile.avatarUrl) : '';

  useGSAP(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', { autoAlpha: 0, y: 15, duration: 0.5 })
      .from('.hero-title', { autoAlpha: 0, y: 25, duration: 0.6 }, '-=0.3')
      .from('.hero-subtitle', { autoAlpha: 0, y: 20, duration: 0.5 }, '-=0.4')
      .from('.hero-bio', { autoAlpha: 0, y: 15, duration: 0.5 }, '-=0.3')
      .from('.hero-stat-item', { autoAlpha: 0, y: 15, stagger: 0.1, duration: 0.5 }, '-=0.2')
      .from('.hero-cta-btn', { autoAlpha: 0, y: 15, stagger: 0.1, duration: 0.5 }, '-=0.3')
      .from('.hero-card-viz', { autoAlpha: 0, scale: 0.96, y: 30, duration: 0.8 }, '-=0.6');
  }, { scope: containerRef });

  const handleGoToProjects = () => {
    trackVisitorAction('Hero CTA: Khám phá dự án', 'projects', 'navigation');
    if (onNavigateTab) {
      onNavigateTab('projects');
    } else {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCV = () => {
    trackVisitorAction('Hero CTA: Tải CV', 'CV Download', 'download');
    window.open('/website.pdf', '_blank');
  };

  const handleViewCaseStudy = () => {
    if (onSelectProject) {
      onSelectProject('proj-heritage-japan');
    } else if (onNavigateTab) {
      onNavigateTab('projects');
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center section-ground overflow-hidden transition-colors duration-200">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 bg-data-dots opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left column: text (7 cols) */}
          <div className="lg:col-span-7 space-y-8">

            {/* Avatar & Badge */}
            <div className="hero-badge flex items-center gap-3.5">
              {safeAvatarUrl && safeAvatarUrl !== '#' ? (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden ring-2 ring-[#0D7287]/40 dark:ring-[#9BE7FA]/40 shadow-md flex-shrink-0">
                  <Image
                    src={safeAvatarUrl}
                    alt={profile.name || 'Avatar'}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized={safeAvatarUrl.startsWith('data:') || safeAvatarUrl.startsWith('blob:')}
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Sẵn sàng tiếp nhận cơ hội mới" />
                </div>
              ) : (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#0D7287] to-cyan-500 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md shadow-cyan-500/20 flex-shrink-0 ring-2 ring-cyan-400/30">
                  {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 3).toUpperCase() : 'MVH'}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Sẵn sàng tiếp nhận cơ hội mới" />
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface/40 border border-surface-vivid/30 dark:bg-slate-800 dark:border-slate-700 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-amber-400 animate-pulse" />
                <span className="text-xs font-heading font-medium text-ink-secondary dark:text-slate-300 tracking-wide">
                  {t('hero_badge', profile.title ? `${profile.title} | Business Intelligence & Analytics` : 'Data Analyst | Business Intelligence & Analytics')}
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-[3.5rem] font-heading font-bold leading-[1.1] tracking-tight text-ink dark:text-white">
                {profile.name || 'Ma Văn Hùng'}
              </h1>
              <p className="hero-subtitle text-xl sm:text-2xl lg:text-[1.7rem] font-heading font-medium text-ink-secondary dark:text-slate-300 leading-snug max-w-xl">
                {profile.subtitle || t('hero_subtitle', isEn
                  ? 'Turning raw data into strategic insights that drive business decisions.'
                  : 'Chuyển hóa dữ liệu thô thành insight chiến lược, hỗ trợ ra quyết định kinh doanh.')}
              </p>
            </div>

            {/* Bio line */}
            <p className="hero-bio text-base text-ink-secondary dark:text-slate-300 leading-relaxed max-w-lg" style={{ fontFamily: 'var(--font-body)' }}>
              {profile.bio || t('about_default_bio', isEn
                ? 'SQL, Python, Power BI specialist. I extract, clean, model, and visualize data to help leadership teams make evidence-based decisions.'
                : 'Chuyên SQL, Python, Power BI. Khai thác, chuẩn hóa, mô hình hóa và trực quan hóa dữ liệu, giúp đội ngũ quản trị ra quyết định dựa trên bằng chứng.')}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
              {stats.map((stat) => (
                <div key={stat.label} className="hero-stat-item flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-heading font-bold text-ink dark:text-white tabular-data">
                    <AnimatedCounter value={stat.value} duration={1.5} triggerOnScroll={false} />
                  </span>
                  <span className="text-sm text-ink-muted dark:text-slate-400 font-heading">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleGoToProjects}
                className="hero-cta-btn group flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-deep dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 font-heading font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
              >
                {t('cta_view_projects', 'Khám Phá Dự Án')}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={handleDownloadCV}
                className="hero-cta-btn flex items-center gap-2 px-6 py-3 border border-border-subtle hover:border-ink-muted text-ink-secondary hover:text-ink dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-500 font-heading font-medium text-sm rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                {t('cta_view_cv', 'Tải CV PDF')}
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="hero-cta-btn flex items-center gap-2 px-4 py-3 bg-[#0D7287]/10 hover:bg-[#0D7287]/20 text-[#0D7287] dark:bg-[#9BE7FA]/10 dark:hover:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#0D7287]/30 dark:border-[#9BE7FA]/30 font-heading font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
                  title="Chỉnh sửa thông tin cá nhân & MySQL CMS"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Sửa Thông Tin (CMS)</span>
                </button>
              )}
            </div>
          </div>

          {/* Right column: micro visualization (5 cols) */}
          <div className="lg:col-span-5 hero-card-viz">
            <div className="relative bg-ground-alt border border-border-subtle dark:bg-slate-900/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
              {/* Mini chart header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-heading font-medium text-ink-muted dark:text-slate-400 uppercase tracking-wider">
                    {isEn ? 'Japan Inbound Tourists' : 'Khách quốc tế đến Nhật Bản'}
                  </p>
                  <p className="text-2xl font-heading font-bold text-ink dark:text-white mt-0.5 tabular-data">
                    <AnimatedCounter value="31.9" duration={1.8} triggerOnScroll={false} />
                    <span className="text-sm font-medium text-ink-muted dark:text-slate-400 ml-1">{isEn ? 'M (2019)' : 'Triệu (2019)'}</span>
                  </p>
                </div>
                <span className="text-xs font-heading font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                  +513%
                </span>
              </div>

              {/* Area Chart */}
              <HeroAreaChart data={heroChartData} isDark={isDark} isEn={isEn} />

              {/* Chart footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle dark:border-slate-800/80">
                <p className="text-[11px] text-ink-muted dark:text-slate-400 font-heading">
                  {isEn ? 'Source: JNTO, 2003-2019' : 'Nguồn: JNTO, 2003-2019'}
                </p>
                <button
                  onClick={handleViewCaseStudy}
                  className="text-[11px] font-heading font-medium text-[#0D7287] dark:text-[#9BE7FA] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>{isEn ? 'View Case Study' : 'Xem Case Study'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

