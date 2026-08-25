'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { ProjectData } from '../../types';
import { DEFAULT_PROJECTS } from '../../defaultData';
import { safeJsonParse, sanitizeUrl } from '../../lib/security';
import { trackVisitorAction } from '../../lib/visitorTracking';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('portfolio_projects_v2');
    let projectsList = DEFAULT_PROJECTS;
    if (savedProjects) {
      projectsList = safeJsonParse(savedProjects, DEFAULT_PROJECTS);
    }
    
    const foundProject = projectsList.find(p => p.id === id);
    setProject(foundProject || null);

    if (foundProject) {
      trackVisitorAction(`Xem chi tiết dự án: ${foundProject.title}`, `Mã dự án: ${id}`, 'project');
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-blue border-t-transparent animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Đang tải thông tin dự án...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans pb-20 selection:bg-brand-yellow/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-brand-blue-light/50 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại Portfolio</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              {project.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-brand-blue-light text-slate-700 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-blue-light/30 text-slate-700 rounded-xl text-sm font-semibold border border-brand-blue-light/50">
              <Tag className="w-3.5 h-3.5 text-brand-blue" />
              {tag}
            </span>
          ))}
        </div>

        {/* Hero Image */}
        {project.img && (
          <div className="w-full aspect-video md:aspect-[21/9] relative rounded-3xl overflow-hidden shadow-xl border border-brand-blue-light/30 bg-slate-100 group">
            <Image
              src={sanitizeUrl(project.img, '')}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              unoptimized
            />
          </div>
        )}
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-[2rem] shadow-sm border border-brand-blue-light/50 p-6 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          {project.content ? (
            <article className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-a:text-brand-blue hover:prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-slate-100
              prose-blockquote:border-l-brand-yellow prose-blockquote:bg-brand-yellow-light/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
              prose-li:marker:text-brand-blue
              prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:border prose-pre:border-slate-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-brand-blue-light/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Chi tiết dự án đang cập nhật</h3>
              <p className="text-slate-500">Nội dung chi tiết cho dự án này sẽ sớm được hoàn thiện.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
