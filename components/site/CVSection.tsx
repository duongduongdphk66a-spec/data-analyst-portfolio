'use client';

import React, { useRef } from 'react';
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react';
import { ExperienceItem } from '@/app/types';
import { useLanguage } from '@/app/context/LanguageContext';

interface CVSectionProps {
  experiences: ExperienceItem[];
  name?: string;
  title?: string;
}

export default React.memo(function CVSection({ experiences, name: _name, title: _title }: CVSectionProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const sectionRef = useRef<HTMLElement>(null);

  const education = experiences.filter(e => e.type === 'education');
  const work = experiences.filter(e => e.type === 'work');

  const defaultEducationEn: ExperienceItem[] = [
    {
      id: 'default-edu-en',
      role: 'Bachelor in Japanese Studies (Faculty of Oriental Studies)',
      company: 'University of Social Sciences and Humanities, VNU Hanoi',
      period: '2021 - 2025',
      type: 'education',
      location: 'Hanoi, Vietnam',
      description: [
        'Specialized in Japanese socio-economic development, quantitative research methodology, and empirical data analysis.',
        'Authored research thesis: "The Evolution of Heritage Tourism in Japan from 2013 to Present" (Supervised by Dr. Vo Minh Vu).',
      ],
    },
  ];

  const defaultWorkEn: ExperienceItem[] = [
    {
      id: 'default-work-1-en',
      role: 'Academic Research: Heritage Tourism Data Analytics in Japan',
      company: 'University of Social Sciences and Humanities, VNU Hanoi',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hanoi, Vietnam',
      description: [
        'Extracted, cleaned, and standardized 6 time-series datasets spanning 20 years from MLIT, JNTO, Kyoto Tourism Board, and Nara Prefecture.',
        'Synthesized macroeconomic indicators (7.5% GDP, 4M+ jobs) and modeled overtourism counter-measures across 5 UNESCO sites.',
      ],
    },
    {
      id: 'default-work-2-en',
      role: 'E-Commerce Operations & Performance Analytics',
      company: 'Steve x Kami Company',
      period: '2022 - 2023',
      type: 'work',
      location: 'Hanoi, Vietnam',
      description: [
        'Built automated sales tracking dashboards monitoring GMV, return rates, and live shopping conversion on TikTok Shop.',
        'Analyzed affiliate network contribution across 1,000+ creator tiers to optimize commission budget allocation and ROI.',
      ],
    },
    {
      id: 'default-work-3-en',
      role: 'Library Bus: Database Architecture & Logistics Optimization',
      company: 'Mobile Library Management System',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hanoi, Vietnam',
      description: [
        'Designed normalized 3NF relational database schema and asynchronous data pipelines serving 50,000+ active users at 500 concurrent RPS.',
        'Implemented Redis caching and Celery task queues, reducing query latency by 93.7% (450ms to 28ms) with zero data contention.',
      ],
    },
  ];

  const displayEducation = isEn ? (education.length > 0 ? education : defaultEducationEn) : education;
  const displayWork = isEn ? (work.length > 0 ? work : defaultWorkEn) : work;

  // Animations are now handled via Tailwind CSS classes

  const renderItem = (item: ExperienceItem) => (
    <div key={item.id} className="timeline-item animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both relative pl-8 pb-10 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-2 bottom-0 w-px bg-border-subtle dark:bg-slate-800 group-last:hidden" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-2 border-border-subtle dark:border-slate-700 bg-ground dark:bg-slate-900 flex items-center justify-center group-hover:border-[#9BE7FA] dark:group-hover:border-[#9BE7FA] transition-all duration-200">
        {item.type === 'education'
          ? <GraduationCap className="w-3 h-3 text-ink-muted dark:text-slate-400 group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors" />
          : <Briefcase className="w-3 h-3 text-ink-muted dark:text-slate-400 group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors" />
        }
      </div>

      {/* Content */}
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
          <h4 className="text-sm font-heading font-bold text-ink dark:text-white">{item.role}</h4>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
          <span className="text-sm font-heading font-medium text-ink-secondary dark:text-slate-300">{item.company}</span>
          <span className="flex items-center gap-1 text-xs text-ink-muted dark:text-slate-400 font-heading">
            <Calendar className="w-3 h-3" />
            {item.period}
          </span>
          {item.location && (
            <span className="flex items-center gap-1 text-xs text-ink-muted dark:text-slate-400 font-heading">
              <MapPin className="w-3 h-3" />
              {item.location}
            </span>
          )}
        </div>
        <ul className="space-y-2">
          {item.description.map((desc, i) => (
            <li key={`${item.id}-desc-${i}`} className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section id="experience" ref={sectionRef} className="section-ground py-20 md:py-28 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink dark:text-white mb-14 max-w-2xl leading-tight">
          {isEn ? 'Education & professional timeline.' : 'Học vấn và lộ trình nghề nghiệp.'}
        </h2>

        <div className="max-w-3xl space-y-16">
          {/* Education section */}
          <div>
            <div className="flex items-center gap-2.5 mb-8 pb-3 border-b border-border-subtle dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-surface/50 border border-[#9BE7FA]/40 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-ink dark:text-[#9BE7FA]" />
              </div>
              <h3 className="text-sm font-heading font-bold uppercase tracking-[0.15em] text-ink dark:text-white">
                {isEn ? 'Education' : 'Học vấn'}
              </h3>
            </div>
            <div>
              {displayEducation.map(renderItem)}
            </div>
          </div>

          {/* Work column */}
          <div>
            <div className="flex items-center gap-2.5 mb-8 pb-3 border-b border-border-subtle dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-surface/50 border border-[#9BE7FA]/40 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-ink dark:text-[#9BE7FA]" />
              </div>
              <h3 className="text-sm font-heading font-bold uppercase tracking-[0.15em] text-ink dark:text-white">
                {isEn ? 'Work Experience' : 'Kinh nghiệm thực tế'}
              </h3>
            </div>
            <div>
              {displayWork.map(renderItem)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

