'use client';

import React from 'react';
import { ArrowLeft, ExternalLink, Github, Tag, FileText, Globe, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { ProjectData } from '@/app/types';
import { sanitizeUrl } from '@/app/lib/security';
import { useLanguage } from '@/app/context/LanguageContext';
import { useRouter } from 'next/navigation';

interface ProjectDetailViewProps {
  project?: ProjectData | null;
  isLoading?: boolean;
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function ProjectDetailView({ 
  project, 
  isLoading = false,
  onBack, 
  isEmbedded 
}: ProjectDetailViewProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-[#FAFDFE] flex flex-col items-center justify-center p-6 dark:bg-[#0B0F17]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#FFD14C] border-t-transparent animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm dark:text-slate-300">
            {isEn ? 'Loading project details...' : 'Đang tải thông tin dự án...'}
          </p>
        </div>
      </div>
    );
  }

  // 2. Project Not Found State
  if (!project) {
    return (
      <div className="min-h-[80vh] bg-[#FAFDFE] flex flex-col items-center justify-center p-6 text-center dark:bg-[#0B0F17]">
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
          {isEn ? 'Project Not Found' : 'Không Tìm Thấy Dự Án'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm mb-6">
          {isEn 
            ? 'The requested case study could not be located or may have been removed.' 
            : 'Dự án bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang vị trí khác.'}
        </p>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#9BE7FA] hover:bg-[#C8EEF7] text-slate-950 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer border border-[#9BE7FA]/60 dark:bg-[#9BE7FA] dark:text-slate-950"
        >
          <ArrowLeft className="w-4 h-4 text-[#074553]" />
          <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFDFE] font-sans text-slate-900 selection:bg-[#9BE7FA]/60 dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAFDFE]/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all dark:bg-[#0B0F17]/95 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-semibold cursor-pointer group dark:text-slate-300 dark:hover:text-white"
            aria-label="Quay lại Portfolio"
          >
            <ArrowLeft className="w-5 h-5 text-[#074553] dark:text-[#9BE7FA] group-hover:-translate-x-1 transition-transform" />
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
                aria-label="Open in new tab"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-slate-900 dark:text-white dark:border-slate-800 dark:hover:bg-slate-800"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
              aria-label={isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="flex-1 space-y-3">
            <span className="editorial-kicker">
              {isEn ? 'CASE STUDY · TECHNICAL OVERVIEW' : 'CHI TIẾT DỰ ÁN · BÁO CÁO PHÂN TÍCH'}
            </span>
            <h1 className="editorial-section-title text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.18]">
              {project.title}
            </h1>
            <p className="editorial-lead text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
              {project.desc}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 md:flex-nowrap shrink-0">
            {project.demoUrl && (
              <a 
                href={sanitizeUrl(project.demoUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={sanitizeUrl(project.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary-editorial flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {project.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2.5 py-0.5 rounded-md bg-[#C8EEF7]/30 dark:bg-slate-900 border border-[#9BE7FA]/40 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-mono text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Main Content / Markdown Case Study */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {project.content ? (
          <article className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-950 prose-a:text-[#074553] dark:prose-a:text-[#9BE7FA] prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-800 prose-pre:font-mono dark:prose-invert">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => {
                  if (!src || typeof src !== 'string') return null;
                  return (
                    <span className="block my-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <Image
                        src={src}
                        alt={alt || 'Project illustration'}
                        width={1200}
                        height={675}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                        unoptimized={src.startsWith('data:') || src.startsWith('blob:')}
                      />
                    </span>
                  );
                },
              }}
            >
              {project.content}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="card-minimal p-8 sm:p-12 text-center space-y-4">
            <FileText className="w-10 h-10 text-slate-400 mx-auto dark:text-slate-500" />
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
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

      <footer className="border-t border-slate-200/80 dark:border-slate-800 text-slate-500 py-12 text-center text-xs">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-1 font-medium">{isEn ? 'Personal Project · Data Analytics Case Study' : 'Dự án cá nhân · Phân tích dữ liệu'}</p>
          <p className="font-mono text-[11px] text-slate-400">Ma Van Hung · Data Analyst Portfolio</p>
        </div>
      </footer>
    </div>
  );
}
