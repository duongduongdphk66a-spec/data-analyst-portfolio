'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Database, Code2, Sparkles, Mail, Github, Linkedin, 
  ListChecks, Cloud, Network, Star, Layers, Cpu,
  Terminal, Settings2, AppWindow, Brain, ExternalLink,
  CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { ProfileData, SkillItem, CareerGoalItem } from '../types';
import { sanitizeUrl } from '../lib/security';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';

interface AboutSectionProps {
  profile: ProfileData;
}

export default React.memo(function AboutSection({ profile }: AboutSectionProps) {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Default fallback career goals if not present
  const careerGoalsEn: CareerGoalItem[] = [
    {
      id: 'goal-1',
      title: t('goal_1_title', 'Lead Scalable Data Infrastructure Engineering'),
      desc: t('goal_1_desc', 'Develop robust data governance frameworks, streamline analytical workflows, and standardize enterprise data pipelines.'),
      icon: 'list'
    },
    {
      id: 'goal-2',
      title: t('goal_2_title', 'Master Cloud Architecture & BI Pipelines'),
      desc: t('goal_2_desc', 'Architect scalable cloud storage, automated ETL/ELT pipelines, and real-time monitoring systems.'),
      icon: 'cloud'
    },
    {
      id: 'goal-3',
      title: t('goal_3_title', 'Enterprise Data Architecture & Decision Optimization'),
      desc: t('goal_3_desc', 'Deliver customer segmentation models, revenue forecasting algorithms, and data-driven recommendations.'),
      icon: 'network'
    }
  ];

  const careerGoals: CareerGoalItem[] = language === 'en' 
    ? careerGoalsEn 
    : (profile.careerGoalsList && profile.careerGoalsList.length > 0 ? profile.careerGoalsList : careerGoalsEn);

  // Default fallback skills if empty or less than 6
  const defaultSkillList: SkillItem[] = [
    { id: 'sk-1', name: 'Python', category: 'Languages', level: 5, icon: 'python' },
    { id: 'sk-2', name: 'SQL', category: 'Languages', level: 5, icon: 'sql' },
    { id: 'sk-3', name: 'DevOps & ETL', category: 'Frameworks', level: 4, icon: 'devops' },
    { id: 'sk-4', name: 'JavaScript / React', category: 'Languages', level: 5, icon: 'javascript' },
    { id: 'sk-5', name: 'Machine Learning', category: 'Core Skills', level: 4, icon: 'ml' },
    { id: 'sk-6', name: 'UI/UX & BI Dashboard', category: 'Tools', level: 4, icon: 'uiux' },
  ];

  const skillsToDisplay: SkillItem[] = profile.skills && profile.skills.length > 0 
    ? profile.skills.map((s, idx) => ({
        ...s,
        level: s.level || (idx % 2 === 0 ? 5 : 4),
        icon: s.icon || s.name.toLowerCase()
      }))
    : defaultSkillList;

  // Helper for Career Goal Icon
  const getGoalIconSrc = (iconType?: string, index: number = 0) => {
    switch (iconType) {
      case 'cloud': return '/extracted/goal_2.png';
      case 'network': return '/extracted/goal_3.png';
      case 'list':
      default:
        if (index === 1) return '/extracted/goal_2.png';
        if (index === 2) return '/extracted/goal_3.png';
        return '/extracted/goal_1.png';
    }
  };

  // Helper for Skill Icon
  const getSkillIconSrc = (skillName: string, iconType?: string) => {
    const key = (iconType || skillName).toLowerCase();
    if (key.includes('python') || key.includes('code') || key.includes('r prog')) return '/extracted/skill_python.png';
    if (key.includes('sql') || key.includes('data') || key.includes('database')) return '/extracted/skill_sql.png';
    if (key.includes('devops') || key.includes('gear') || key.includes('docker') || key.includes('airflow')) return '/extracted/skill_devops.png';
    if (key.includes('js') || key.includes('javascript') || key.includes('typescript')) return '/extracted/skill_js.png';
    if (key.includes('machine') || key.includes('ml') || key.includes('ai') || key.includes('brain')) return '/extracted/skill_ml.png';
    if (key.includes('ui') || key.includes('ux') || key.includes('design') || key.includes('web')) return '/extracted/skill_uiux.png';
    return '/extracted/skill_python.png';
  };

  const bioText = language === 'en' 
    ? t('about_default_bio', profile.bio)
    : profile.bio;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 sm:px-10 lg:px-12 space-y-12 animate-in fade-in duration-400 bg-white">
      {/* TOP ROW: 2 COLUMNS (BIO & CAREER GOALS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* LEFT COLUMN: BIO */}
        <div className="lg:col-span-6 space-y-6">
          {/* Section Header with cyan-blue underline bar */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase">
              {t('about_title', 'BIO')}
            </h2>
            <div className="w-12 h-1 bg-[#86E0F5] rounded-full mt-1.5" />
          </div>

          {/* Profile Card Header */}
          <div className="flex items-center gap-5 pt-1">
            {/* Round Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-200/90 shadow-sm bg-[#BDECF8]/30 flex-shrink-0 relative">
              {profile.avatarUrl ? (
                <Image
                  src={sanitizeUrl(profile.avatarUrl, '')}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#FFD147] text-slate-900 text-3xl font-extrabold select-none">
                  {profile.name ? profile.name.charAt(0) : 'A'}
                </div>
              )}
            </div>

            {/* Name, Subtitle, Title Link */}
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold text-slate-700">
                {profile.subtitle || (language === 'en' ? 'Data Analyst & BI Specialist' : 'Chuyên viên Phân tích Dữ liệu')}
              </p>
              <div>
                <a 
                  href="#bio-details"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-sm sm:text-base font-semibold text-[#1B8E9B] hover:text-[#10626B] underline transition-colors cursor-pointer inline-block"
                >
                  {profile.title}
                </a>
              </div>
            </div>
          </div>

          {/* Bio Text */}
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            <p className="whitespace-pre-line">
              {bioText}
            </p>
          </div>

          {/* Read More Button & Expanded Details */}
          <div className="pt-1">
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                trackVisitorAction(isExpanded ? 'Thu gọn Bio' : 'Bấm Read More Bio', profile.name, 'general');
              }}
              className="px-6 py-2.5 bg-[#FFCB36] hover:bg-[#F2BA24] text-white font-bold text-sm rounded-xl shadow-xs transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>{isExpanded ? t('about_btn_collapse', 'Thu gọn') : t('about_btn_expand', 'Read More')}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expandable Contact / Full Info Sheet */}
            {isExpanded && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Email:</strong> {profile.email || 'analyst@example.com'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.github && (
                    <a
                      href={sanitizeUrl(profile.github)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-100 shadow-2xs"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub Profile
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={sanitizeUrl(profile.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B8E9B] text-white text-xs font-semibold rounded-lg hover:bg-[#15717C] shadow-2xs"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CAREER GOALS */}
        <div className="lg:col-span-6 space-y-6">
          {/* Section Header with cyan-blue underline bar */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase">
              {t('about_career_goals', 'CAREER GOALS')}
            </h2>
            <div className="w-12 h-1 bg-[#86E0F5] rounded-full mt-1.5" />
          </div>

          {/* List of 3 Career Goals */}
          <div className="space-y-6 pt-1">
            {careerGoals.map((goal, idx) => (
              <div key={goal.id || `goal-${idx}`} className="flex items-start gap-4">
                {/* Yellow Round Icon Badge */}
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-xs relative bg-[#FFD147]">
                  <Image 
                    src={getGoalIconSrc(goal.icon, idx)} 
                    alt={goal.title}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-950 leading-snug">
                    {goal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {goal.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: SKILLS */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        {/* Section Header with cyan-blue underline bar */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase">
            {t('about_core_skills', 'SKILLS')}
          </h2>
          <div className="w-12 h-1 bg-[#86E0F5] rounded-full mt-1.5" />
        </div>

        {/* 3 Columns Grid for 6 Skill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-8 pt-2">
          {skillsToDisplay.map((skill) => {
            const level = skill.level || 5;
            return (
              <div key={skill.id} className="flex items-center gap-4">
                {/* Yellow Rounded Square Icon */}
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center shadow-xs flex-shrink-0 bg-[#FFD147] relative">
                  <Image 
                    src={getSkillIconSrc(skill.name, skill.icon)} 
                    alt={skill.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                {/* Skill Name & 5 Stars */}
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-950">
                    {skill.name}
                  </h4>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= level
                            ? 'text-[#FFD147] fill-[#FFD147]'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
