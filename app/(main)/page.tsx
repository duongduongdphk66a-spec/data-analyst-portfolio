import React from 'react';
import { Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import HeroSection from '../components/HeroSection';
import CVSection from '../components/CVSection';
import ProjectsSection from '../components/ProjectsSection';
import { getServerLanguage, getServerPortfolioData } from '../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Home' : 'Trang Chủ'}`,
  };
}

export default async function HomePage() {
  const { language, t } = await getServerLanguage();
  const { profile, projects } = await getServerPortfolioData();

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Hero Section */}
      <HeroSection 
        profile={profile} 
      />

      {/* 2. Featured Projects (Selected Work Stream) */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <span className="editorial-kicker">SELECTED CASE STUDIES</span>
            <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl">
              {language === 'en' ? 'Featured Analytical Work' : 'Dự Án Phân Tích Dữ Liệu Nổi Bật'}
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-heading font-bold text-[#0D7287] dark:text-[#9BE7FA] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'en' ? 'View all projects' : 'Xem toàn bộ dự án'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <ProjectsSection 
          projects={projects.slice(0, 3)} 
          isFeaturedView={true}
        />
      </section>

      {/* 3. Experience & Career Timeline */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 space-y-6 pt-4">
        <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <span className="editorial-kicker">CAREER & RESEARCH PATH</span>
          <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl">
            {language === 'en' ? 'Experience & Quantitative Background' : 'Học Vấn & Kinh Nghiệm Phân Tích'}
          </h2>
        </div>
        <CVSection 
          experiences={profile.experiences || []} 
          name={profile.name} 
          title={profile.title} 
        />
      </section>

      {/* 4. Editorial Bottom CTA Strip */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-950 text-white dark:bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-semibold text-[#9BE7FA] uppercase tracking-wider">
              {language === 'en' ? 'DIRECT COLLABORATION' : 'CƠ HỘI HỢP TÁC'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              {language === 'en' ? 'Looking for an evidence-driven data analyst?' : 'Tìm kiếm Data Analyst giải quyết bài toán tăng trưởng?'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Available for full-time Data Analyst roles, Business Intelligence implementations, and quantitative research consulting.'
                : 'Sẵn sàng phỏng vấn vị trí Data Analyst full-time hoặc tư vấn xây dựng hệ thống báo cáo BI, tối ưu hóa dữ liệu vận hành.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              target="_blank"
              className="btn-primary-gold text-xs px-5 py-3"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'en' ? 'Download CV PDF' : 'Tải CV PDF'}</span>
            </a>
            <a
              href="mailto:mavanhung.da@gmail.com"
              className="btn-secondary-editorial text-xs py-3 px-5 border-slate-700 text-white hover:bg-slate-800"
            >
              <span>{language === 'en' ? 'Contact Directly' : 'Liên Hệ Trực Tiếp'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
