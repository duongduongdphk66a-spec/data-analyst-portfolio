'use client';

import React from 'react';
import { Briefcase, GraduationCap, Calendar, Building, CheckCircle2, Download, Printer } from 'lucide-react';
import { ExperienceItem } from '../types';

interface CVSectionProps {
  experiences: ExperienceItem[];
  name: string;
  title: string;
}

export default React.memo(function CVSection({ experiences, name, title }: CVSectionProps) {
  const workList = experiences.filter(e => e.type === 'work');
  const educationList = experiences.filter(e => e.type === 'education');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kinh nghiệm & Học vấn
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hành trình phát triển sự nghiệp trong ngành Phân tích Dữ liệu
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-xl shadow-md transition-all w-fit cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          In / Lưu PDF CV
        </button>
      </div>

      {/* Work Experiences */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          Kinh nghiệm làm việc
        </h2>

        <div className="space-y-6 pl-2 sm:pl-4 border-l-2 border-indigo-100 dark:border-slate-800 relative ml-3">
          {workList.length > 0 ? (
            workList.map((item) => (
              <div key={item.id} className="relative pl-6 sm:pl-8 group">
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 group-hover:scale-125 transition-transform" />

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.role}
                      </h3>
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mt-0.5">
                        <Building className="w-4 h-4" />
                        {item.company}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mt-4">
                    {item.description.map((desc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 pl-6">Chưa có thông tin kinh nghiệm.</p>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          Học vấn & Bằng cấp
        </h2>

        <div className="space-y-6 pl-2 sm:pl-4 border-l-2 border-emerald-100 dark:border-slate-800 relative ml-3">
          {educationList.length > 0 ? (
            educationList.map((item) => (
              <div key={item.id} className="relative pl-6 sm:pl-8 group">
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-emerald-600 group-hover:scale-125 transition-transform" />

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.role}
                      </h3>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mt-0.5">
                        <Building className="w-4 h-4" />
                        {item.company}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.period}
                    </span>
                  </div>

                  {item.description && item.description.length > 0 && (
                    <ul className="space-y-2 mt-4">
                      {item.description.map((desc, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 pl-6">Chưa có thông tin học vấn.</p>
          )}
        </div>
      </div>
    </div>
  );
});
