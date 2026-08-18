'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Database, Code2, LineChart, Sparkles, Mail, Github, Linkedin, 
  Target, CheckCircle2, Award, Terminal, Layers, Cpu
} from 'lucide-react';
import { ProfileData } from '../types';

interface AboutSectionProps {
  profile: ProfileData;
}

export default React.memo(function AboutSection({ profile }: AboutSectionProps) {
  // Group skills by category
  const skillsByCategory = React.useMemo(() => {
    const categories: Record<string, typeof profile.skills> = {
      'Languages': [],
      'Tools': [],
      'Frameworks': [],
      'Core Skills': []
    };

    profile.skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });

    return categories;
  }, [profile.skills]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Languages': return <Terminal className="w-4 h-4 text-indigo-500" />;
      case 'Tools': return <Layers className="w-4 h-4 text-emerald-500" />;
      case 'Frameworks': return <Cpu className="w-4 h-4 text-amber-500" />;
      default: return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      {/* Hero Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar container */}
          <div className="relative group flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800 relative">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 144px, 176px"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-4xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-slate-900 flex items-center gap-1 text-[11px] font-semibold px-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Sẵn sàng làm việc
            </div>
          </div>

          {/* Bio info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold tracking-wide border border-indigo-100 dark:border-indigo-800 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Data Analyst Portfolio
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                {profile.title}
              </p>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base max-w-2xl whitespace-pre-wrap">
              {profile.bio}
            </p>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-all"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium rounded-xl transition-all border border-blue-200 dark:border-blue-800"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Career Vision Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/30 border border-indigo-400/30 rounded-2xl text-indigo-300 flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Định hướng & Mục tiêu nghề nghiệp
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
              {profile.careerGoal}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-indigo-600" />
            Kỹ năng & Chuyên môn dữ liệu
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {profile.skills.length} Kỹ năng cốt lõi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(skillsByCategory).map(([category, items]) => {
            if (!items || items.length === 0) return null;
            return (
              <div 
                key={category}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map(skill => (
                    <span 
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs sm:text-sm font-medium border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 opacity-70" />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
