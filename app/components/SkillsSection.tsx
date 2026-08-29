'use client';

import React, { useRef } from 'react';
import { Database, Code2, BarChart3, LineChart, MessageSquareText } from 'lucide-react';
import { SkillItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { gsap, useGSAP } from '../lib/gsap';

interface SkillsSectionProps {
  skills: SkillItem[];
}

interface PipelineStage {
  id: string;
  titleVi: string;
  titleEn: string;
  icon: React.ReactNode;
  tools: { name: string; note?: string }[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'collect',
    titleVi: 'Thu thập',
    titleEn: 'Collect',
    icon: <Database className="w-5 h-5" />,
    tools: [
      { name: 'SQL (PostgreSQL / MySQL)', note: 'Complex Joins, CTEs, Window Functions' },
      { name: 'Database Architecture', note: 'ERD Design, 3NF, ACID Transactions' },
      { name: 'Web Scraping / APIs', note: 'JNTO, MLIT datasets' },
    ],
  },
  {
    id: 'process',
    titleVi: 'Xử lý',
    titleEn: 'Process',
    icon: <Code2 className="w-5 h-5" />,
    tools: [
      { name: 'Python (Pandas, NumPy)', note: 'Data Wrangling, Cleaning, Automation' },
      { name: 'Power Query / Excel', note: 'Dynamic Arrays, Pivot, ETL' },
      { name: 'Redis / Celery', note: 'Cache, Async Processing' },
    ],
  },
  {
    id: 'analyze',
    titleVi: 'Phân tích',
    titleEn: 'Analyze',
    icon: <LineChart className="w-5 h-5" />,
    tools: [
      { name: 'EDA / Thống kê', note: 'Hypothesis Testing, Correlation' },
      { name: 'Time-Series Modeling', note: 'Trend Decomposition, Forecasting' },
      { name: 'RFM Segmentation', note: 'Customer Cohort Analysis' },
    ],
  },
  {
    id: 'visualize',
    titleVi: 'Trực quan hóa',
    titleEn: 'Visualize',
    icon: <BarChart3 className="w-5 h-5" />,
    tools: [
      { name: 'Power BI / DAX', note: 'Star Schema, KPI Dashboards' },
      { name: 'Recharts / D3.js', note: 'Interactive Web Charts' },
      { name: 'Matplotlib / Seaborn', note: 'Statistical Plots' },
    ],
  },
  {
    id: 'storytell',
    titleVi: 'Kể chuyện',
    titleEn: 'Storytell',
    icon: <MessageSquareText className="w-5 h-5" />,
    tools: [
      { name: 'Data Storytelling', note: 'Executive Summaries' },
      { name: 'Slide / Report Design', note: 'Actionable Recommendations' },
      { name: 'Stakeholder Communication', note: 'Technical-to-Business Translation' },
    ],
  },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate header
    gsap.from('.skills-header', {
      autoAlpha: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
      },
    });

    // Stagger pipeline stages
    gsap.from('.pipeline-stage-card', {
      autoAlpha: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.pipeline-grid',
        start: 'top 80%',
        once: true,
      },
    });

    // Stagger proficiency skills
    gsap.from('.skill-bar-item', {
      autoAlpha: 0,
      y: 15,
      stagger: 0.06,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-legend',
        start: 'top 90%',
        once: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section id="skills" ref={sectionRef} className="section-ground py-20 md:py-28 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="skills-header">
          <p className="text-xs font-heading font-semibold uppercase tracking-[0.15em] text-ink-muted mb-3">
            {isEn ? 'Skills & Tools' : 'Kỹ năng & Công cụ'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink dark:text-white mb-4 max-w-2xl leading-tight">
            {isEn
              ? 'End-to-end data analysis pipeline.'
              : 'Quy trình phân tích dữ liệu đầu-cuối.'}
          </h2>
          <p className="text-base text-ink-secondary dark:text-slate-300 mb-14 max-w-xl" style={{ fontFamily: 'var(--font-body)' }}>
            {isEn
              ? 'From raw data ingestion to stakeholder-ready insights, each stage uses purpose-built tools and rigorous methodology.'
              : 'Từ thu thập dữ liệu thô đến insight sẵn sàng trình bày, mỗi giai đoạn sử dụng công cụ chuyên biệt và phương pháp nghiêm ngặt.'}
          </p>
        </div>

        {/* Pipeline flow */}
        <div className="pipeline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div key={stage.id} className="pipeline-stage-card relative group">
              {/* Connector line (desktop only, between stages) */}
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-0 w-full h-px bg-border-subtle dark:bg-slate-800 z-0" />
              )}

              <div className="relative z-10 lg:pr-4">
                {/* Stage header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-surface/60 border border-surface-vivid/30 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-ink-secondary dark:text-[#9BE7FA] group-hover:bg-surface group-hover:text-ink dark:group-hover:bg-slate-700 group-hover:scale-105 transition-all duration-200 shadow-xs">
                    {stage.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-medium text-ink-muted dark:text-slate-400 uppercase tracking-wider">
                      {isEn ? `Step ${idx + 1}` : `Bước ${idx + 1}`}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-ink dark:text-white leading-tight">
                      {isEn ? stage.titleEn : stage.titleVi}
                    </h3>
                  </div>
                </div>

                {/* Tools list */}
                <ul className="space-y-3 pl-0">
                  {stage.tools.map((tool) => (
                    <li key={tool.name} className="flex flex-col group/tool">
                      <span className="text-sm font-heading font-medium text-ink dark:text-slate-200 group-hover/tool:text-[#0D7287] dark:group-hover/tool:text-[#9BE7FA] transition-colors">{tool.name}</span>
                      {tool.note && (
                        <span className="text-xs text-ink-muted dark:text-slate-400 mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                          {tool.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Proficiency legend */}
        <div className="skills-legend mt-16 pt-8 border-t border-border-subtle dark:border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="skill-bar-item flex flex-col gap-1.5">
                <span className="text-xs font-heading font-medium text-ink dark:text-slate-200 truncate">{skill.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i < (skill.level || 0) ? 'bg-accent dark:bg-amber-400' : 'bg-border-subtle dark:bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

