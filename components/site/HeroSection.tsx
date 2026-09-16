'use client';

import React, { useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ProfileData } from '@/app/types';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';

const HeroAreaChart = dynamic(() => import('@/components/case-studies/charts/HeroAreaChart'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-surface/20 rounded-xl animate-pulse" />,
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
  { value: '3', label: 'Case Studies' },
  { value: '93.7%', label: 'latency ↓' },
  { value: '8.5B', label: 'VND' },
  { value: '5,700+', label: 'creators' },
];

const STATS_EN = [
  { value: '3', label: 'Case Studies' },
  { value: '93.7%', label: 'latency ↓' },
  { value: '8.5B', label: 'VND' },
  { value: '5,700+', label: 'creators' },
];

export default function HeroSection({ profile, onNavigateTab }: HeroSectionProps) {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';
  const stats = isEn ? STATS_EN : STATS_VI;
  const containerRef = useRef<HTMLElement>(null);

  // Animations are now handled via Tailwind CSS classes

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
    window.open('/Ma_Van_Hung_CV_Data_Analyst_2026.pdf', '_blank');
  };

  return (
    <section ref={containerRef} className="relative min-h-0 sm:min-h-[85vh] flex flex-col justify-center bg-[#FAFDFE] dark:bg-[#0B0F17] hero-glow bg-data-dots overflow-hidden transition-colors duration-200">
      {/* Background visual graph (Subtle) */}
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.04] pointer-events-none overflow-hidden">
        <div className="absolute -bottom-32 -right-32 w-full h-full max-w-4xl scale-125 origin-bottom-right">
           <HeroAreaChart data={heroChartData} isDark={isDark} isEn={isEn} />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 w-full pt-16 sm:pt-24 pb-16 text-center sm:text-left z-10 flex-1 flex flex-col justify-center">
        <div className="space-y-8 sm:space-y-10">

          {/* 1. Identity & Kicker Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#C8EEF7]/40 border border-[#9BE7FA] dark:bg-[#9BE7FA]/10 dark:border-[#9BE7FA]/30">
              <span className="w-2 h-2 rounded-full bg-[#9BE7FA] animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-[#9BE7FA]">
                {profile.name || 'Ma Văn Hùng'} <span className="text-slate-400 mx-1">•</span> {profile.title || 'Data Analyst'}
              </span>
            </div>
          </div>

          {/* 2. Value Proposition Headline */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
            <h1 className="editorial-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
              {isEn 
                ? 'Turning messy data into clear business decisions.' 
                : 'Biến dữ liệu phức tạp thành quyết định kinh doanh rõ ràng.'}
            </h1>
          </div>



          {/* 4. CTAs - Dominant #9BE7FA Primary Button */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handleGoToProjects}
              className="btn-primary text-base group px-8 py-4"
            >
              <span>{t('cta_view_projects', 'Xem Case Studies')}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={handleDownloadCV}
              className="btn-secondary-editorial text-base px-8 py-4"
            >
              <Download className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span>{t('cta_view_cv', 'Download CV')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 5. Metrics Box (Moved out of hero stack) */}
      <div className="w-full border-t border-slate-200/60 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm relative z-10 animate-in fade-in duration-700 delay-300">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-6 sm:gap-y-0">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col text-center sm:text-left">
                <span className="text-xl sm:text-2xl lg:text-3xl font-mono font-extrabold text-slate-950 dark:text-white tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-heading font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

