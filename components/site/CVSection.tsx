'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { GraduationCap, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { ExperienceItem } from '@/app/types';
import { useLanguage } from '@/app/context/LanguageContext';

interface CVSectionProps {
  experiences: ExperienceItem[];
  name?: string;
  title?: string;
  isSummary?: boolean;
}

export default React.memo(function CVSection({ experiences, name: _name, title: _title, isSummary = false }: CVSectionProps) {
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

  const finalEducation = isSummary ? displayEducation.slice(0, 1) : displayEducation;
  const finalWork = isSummary ? displayWork.slice(0, 2) : displayWork;

  const renderItem = (item: ExperienceItem, summaryMode: boolean) => (
    <div key={item.id} className={`timeline-item animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both relative pl-8 ${summaryMode ? 'pb-6' : 'pb-10'} last:pb-0 group`}>
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
      <div className="card-minimal p-5 sm:p-6 ml-3 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-3 gap-y-2 mb-2">
          <h4 className="text-base sm:text-lg font-heading font-bold text-ink dark:text-white leading-snug">{item.role}</h4>
          <span className="badge-cyan flex items-center gap-1 w-fit shrink-0">
            <Calendar className="w-3 h-3" />
            {item.period}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          <span className="badge-gold font-heading">{item.company}</span>
          {item.location && (
            <span className="flex items-center gap-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400 font-heading">
              <MapPin className="w-3 h-3" />
              {item.location}
            </span>
          )}
        </div>
        <ul className="space-y-2 mt-2 list-disc list-inside marker:text-[#9BE7FA] dark:marker:text-[#9BE7FA]/70">
          {item.description?.map((desc, i) => (
            <li key={`${item.id}-desc-${i}`} className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed font-sans">
              {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section 
      id={isSummary ? undefined : "experience"} 
      ref={sectionRef} 
      className={`transition-colors duration-200 ${isSummary ? 'pt-2 pb-0' : 'section-ground py-14 sm:py-20 md:py-28 bg-data-dots'}`}
    >
      <div className={isSummary ? 'w-full' : 'max-w-6xl mx-auto px-5 sm:px-8'}>
        {!isSummary && (
          <h2 className="editorial-section-title text-3xl sm:text-4xl md:text-5xl mb-12 sm:mb-16 max-w-2xl">
            {isEn ? 'Education & professional timeline.' : 'Học vấn và lộ trình nghề nghiệp.'}
          </h2>
        )}

        <div className={`max-w-3xl ${isSummary ? 'space-y-10' : 'space-y-16'}`}>
          {/* Education section */}
          <div>
            <div className="flex items-center gap-2.5 mb-8 pb-3 border-b border-border-subtle dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-surface/50 border border-[#9BE7FA]/40 dark:bg-slate-800 dark:border-[#9BE7FA]/40 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-ink dark:text-[#9BE7FA]" />
              </div>
              <h3 className="editorial-kicker text-ink dark:text-[#9BE7FA]">
                {isEn ? 'Education & Academic Rigor' : 'Học vấn & Nghiên cứu'}
              </h3>
            </div>
            <div>
              {finalEducation.map(item => renderItem(item, isSummary))}
            </div>
          </div>

          {/* Work column */}
          <div>
            <div className="flex items-center gap-2.5 mb-8 pb-3 border-b border-border-subtle dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-surface/50 border border-[#9BE7FA]/40 dark:bg-slate-800 dark:border-[#9BE7FA]/40 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-ink dark:text-[#9BE7FA]" />
              </div>
              <h3 className="editorial-kicker text-ink dark:text-[#9BE7FA]">
                {isEn ? (isSummary ? 'Key Analytical Experience' : 'Work Experience') : (isSummary ? 'Kinh nghiệm phân tích tiêu biểu' : 'Kinh nghiệm thực tế')}
              </h3>
            </div>
            <div>
              {finalWork.map(item => renderItem(item, isSummary))}
            </div>
          </div>

          {/* Summary Call to Action */}
          {isSummary && (
            <div className="pt-2">
              <Link
                href="/experience"
                className="btn-secondary-editorial text-xs font-bold gap-2 group w-full sm:w-auto justify-center"
              >
                <span>{isEn ? 'View Complete Career & Education Timeline' : 'Xem toàn bộ kinh nghiệm & quá trình học vấn'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#074553] dark:text-[#9BE7FA]" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

