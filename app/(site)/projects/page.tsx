import React from 'react';
import ProjectsSection from '@/components/site/ProjectsSection';
import { getServerLanguage, getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Work' : 'Dự Án'}`,
    description: language === 'en'
      ? 'Data analysis case studies by Ma Văn Hùng — TikTok Shop analytics, Japan heritage tourism time-series, and library database architecture.'
      : 'Các dự án phân tích dữ liệu của Ma Văn Hùng — TikTok Shop analytics, time-series du lịch di sản Nhật Bản, kiến trúc CSDL thư viện lưu động.',
  };
}

export default async function ProjectsPage() {
  const { projects } = await getServerPortfolioData();

  return (
    <div className="py-12 md:py-20">
      <ProjectsSection 
        projects={projects} 
      />
    </div>
  );
}
