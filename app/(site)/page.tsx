import React from 'react';
import HeroSection from '@/components/site/HeroSection';
import ProjectsSection from '@/components/site/ProjectsSection';
import { getServerLanguage, getServerPortfolioData } from '../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Home' : 'Trang Chủ'}`,
    description: language === 'en'
      ? 'Portfolio of Ma Văn Hùng — Evidence-driven Data Analyst. Interactive case studies, live data visualizations, SQL, Python, Power BI.'
      : 'Portfolio Ma Văn Hùng — Data Analyst chuyên SQL, Python, Power BI. Case studies tương tác, trực quan hóa dữ liệu trực tiếp.',
  };
}

export default function HomePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 lg:space-y-10">
      {/* 1. KHỐI MỞ ĐẦU & ĐIỂM NHẤN TƯƠNG TÁC 3 DỰ ÁN */}
      <HeroSection />

      {/* 2. MA TRẬN ĐỐI SÁNH & DANH MỤC 3 DỰ ÁN THỰC CHIẾN */}
      <ProjectsSection />
    </div>
  );
}
