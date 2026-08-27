'use client';

import React from 'react';
import { ArrowLeft, ExternalLink, Github, Tag, FileText, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProjectData } from '../types';
import { sanitizeUrl } from '../lib/security';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';

interface ProjectDetailViewProps {
  project?: ProjectData | null;
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function ProjectDetailView({ project, onBack, isEmbedded }: ProjectDetailViewProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  if (!project) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center p-4 dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-yellow border-t-transparent animate-spin mb-4" />
          <p className="text-slate-500 font-medium dark:text-slate-400">{isEn ? 'Loading project details...' : 'Đang tải thông tin dự án...'}</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-yellow/30 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-blue-light/50 transition-all dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold cursor-pointer group dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href={`/projects/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer dark:bg-brand-yellow dark:text-slate-950"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 sm:pt-16 sm:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight dark:text-white">
              {project.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl dark:text-slate-300">
              {project.desc}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 md:flex-nowrap shrink-0">
            {project.demoUrl && (
              <a 
                href={sanitizeUrl(project.demoUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackVisitorAction(`Mở Live Demo dự án: ${project.title}`, project.demoUrl, 'project')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-yellow hover:bg-[#FACC15] text-slate-900 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={sanitizeUrl(project.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackVisitorAction(`Xem Source Code dự án: ${project.title}`, project.githubUrl, 'project')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-brand-yellow/40 text-slate-700 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-yellow/30 dark:border-slate-800">
          <Tag className="w-4 h-4 text-slate-400 mr-1" />
          {project.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-[#FFF9E6] border border-brand-yellow/40 text-slate-800 rounded-xl text-xs font-semibold dark:bg-slate-900 dark:border-slate-800 dark:text-brand-blue-light"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Main Content / Markdown Case Study */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {project.content ? (
          <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-amber-600 prose-img:rounded-3xl prose-img:shadow-lg prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 dark:prose-invert dark:prose-a:text-brand-yellow">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="bg-[#FFF9E6] rounded-3xl p-8 sm:p-12 border border-brand-yellow/40 text-center space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <FileText className="w-12 h-12 text-slate-400 mx-auto dark:text-slate-500" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {isEn ? 'Detailed Case Study Documentation Coming Soon' : 'Nội dung chi tiết đang được cập nhật'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto dark:text-slate-400">
              {isEn 
                ? 'The full documentation and technical deep dive for this project will be available shortly.'
                : 'Bài viết phân tích chuyên sâu và tài liệu kỹ thuật cho dự án này đang được hoàn thiện.'}
            </p>
          </div>
        )}
      </main>

      <footer className="bg-[#FFFDF5] border-t border-brand-yellow/30 text-slate-600 py-12 text-center text-sm dark:bg-slate-950 dark:text-slate-500 dark:border-transparent">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-2">{isEn ? 'Personal Project · Data Analytics Case Study' : 'Dự án cá nhân · Phân tích dữ liệu'}</p>
          <p>{isEn ? 'Data Analytics Portfolio · Updated 08/2026' : 'Portfolio Data Analytics · Cập nhật 08/2026'}</p>
        </div>
      </footer>
    </div>
  );
}
