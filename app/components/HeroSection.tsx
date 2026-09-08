'use client';

import React, { useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ProfileData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { trackVisitorAction } from '../lib/visitorTracking';
import { gsap, useGSAP } from '../lib/gsap';
import AnimatedCounter from './ui/AnimatedCounter';

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
  { value: '3+', label: 'Dự án phân tích chuyên sâu' },
  { value: '8.5 Tỷ', label: 'VNĐ quy mô xử lý' },
  { value: '450ms → 28ms', label: 'Tối ưu độ trễ truy vấn' },
];

const STATS_EN = [
  { value: '3+', label: 'In-depth case studies' },
  { value: '8.5B', label: 'VND volume processed' },
  { value: '450ms → 28ms', label: 'Query latency reduction' },
];

export default function HeroSection({ profile, onNavigateTab, onSelectProject }: HeroSectionProps) {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';
  const stats = isEn ? STATS_EN : STATS_VI;
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // Strict motion: Hero entrance opacity + 12px y
    gsap.from('.hero-content-reveal', {
      autoAlpha: 0,
      y: 12,
      duration: 0.5,
      ease: 'power2.out',
    });
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
    window.open('/library-bus/website.pdf', '_blank');
  };

  const handleViewCaseStudy = () => {
    if (onSelectProject) {
      onSelectProject('proj-heritage-japan');
    } else if (onNavigateTab) {
      onNavigateTab('projects');
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[85vh] flex items-center bg-[#FAFDFE] dark:bg-[#0B0F17] overflow-hidden transition-colors duration-200">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">

          {/* Left column: Editorial Content (7 cols) */}
          <div className="lg:col-span-7 space-y-8 hero-content-reveal">

            {/* Kicker (Identity) & Availability */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-heading font-black text-slate-950 dark:text-white tracking-wide text-sm sm:text-base">
                {profile.name || 'MA VĂN HÙNG'}
              </span>
              <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <span className="editorial-kicker text-xs">
                {profile.title ? profile.title.toUpperCase() : 'DATA ANALYST'}
              </span>
              <span className="h-3 w-px hidden sm:block bg-slate-300 dark:bg-slate-700" />
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isEn ? 'AVAILABLE' : 'SẴN SÀNG'}</span>
              </div>
            </div>

            {/* Value Proposition Headline */}
            <div className="space-y-4">
              <h1 className="editorial-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] leading-[1.05] tracking-tight">
                {isEn 
                  ? 'I turn messy data into clear business decisions.' 
                  : 'Biến dữ liệu phức tạp thành quyết định kinh doanh rõ ràng.'}
              </h1>
              <p className="text-lg sm:text-xl font-heading text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {profile.subtitle || t('hero_subtitle', isEn
                  ? 'Specializing in analytics engineering, quantitative research, and interactive data visualization.'
                  : 'Chuyên sâu về phân tích dữ liệu, nghiên cứu định lượng và trực quan hóa dữ liệu tương tác.')}
              </p>
            </div>

            {/* Unboxed Bio Lead */}
            <p className="editorial-lead max-w-xl">
              {profile.bio || t('about_default_bio', isEn
                ? 'SQL, Python, Power BI specialist. I extract, clean, model, and visualize data to help leadership teams make evidence-based decisions.'
                : 'Chuyên sâu SQL, Python, Power BI. Khai thác, chuẩn hóa và trực quan hóa dữ liệu đa nguồn, giúp ban quản trị ra quyết định dựa trên bằng chứng.')}
            </p>

            {/* 3 Unboxed KPIs: Typographic Data Strip */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-slate-950 dark:text-white tabular-nums tracking-tight">
                      <AnimatedCounter value={stat.value} duration={1.2} triggerOnScroll={false} />
                    </div>
                    <p className="text-xs font-heading font-medium text-slate-500 dark:text-slate-400 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleGoToProjects}
                className="btn-primary-gold text-sm group"
              >
                <span>{t('cta_view_projects', 'Khám Phá Dự Án')}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={handleDownloadCV}
                className="btn-secondary-editorial text-sm"
              >
                <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{t('cta_view_cv', 'Tải CV PDF')}</span>
              </button>
            </div>
          </div>

          {/* Right column: 30% Card Minimal Micro-Visualization (5 cols) */}
          <div className="lg:col-span-5">
            <div className="card-minimal p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="editorial-kicker text-[11px] block">
                    {isEn ? 'FEATURED TELEMETRY' : 'DỮ LIỆU ĐIỂN HÌNH'}
                  </span>
                  <p className="text-sm font-heading font-bold text-slate-900 dark:text-white mt-0.5">
                    {isEn ? 'Japan Inbound Tourism Growth' : 'Khách quốc tế đến Nhật Bản'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    +513%
                  </span>
                </div>
              </div>

              {/* Data number */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-slate-950 dark:text-white tabular-nums">
                  <AnimatedCounter value="31.9" duration={1.6} triggerOnScroll={false} />
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {isEn ? 'Million visitors (Peak 2019)' : 'Triệu lượt khách (Đỉnh 2019)'}
                </span>
              </div>

              {/* Area Chart */}
              <div className="pt-2">
                <HeroAreaChart data={heroChartData} isDark={isDark} isEn={isEn} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">Source: JNTO 2003-2019</span>
                <button
                  onClick={handleViewCaseStudy}
                  className="font-heading font-semibold text-[#0D7287] dark:text-[#9BE7FA] hover:underline flex items-center gap-1 cursor-pointer group"
                >
                  <span>{isEn ? 'Case Study' : 'Xem Phân Tích'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

