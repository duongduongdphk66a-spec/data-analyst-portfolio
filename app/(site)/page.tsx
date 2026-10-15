import React from 'react';
import HeroSection from '@/components/site/HeroSection';
import DashboardSection from '@/components/site/DashboardSection';
import ProjectsSection from '@/components/site/ProjectsSection';
import AboutSection from '@/components/site/AboutSection';
import CVSection from '@/components/site/CVSection';
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

      {/* 2. BỐN THẺ KPI NGỮ CẢNH & MA TRẬN ĐỐI SÁNH DỰ ÁN */}
      <DashboardSection />

      {/* 3. DANH MỤC CASE STUDIES CHI TIẾT */}
      <ProjectsSection />

      {/* 4. KỸ NĂNG PHÂN TÍCH & HỒ SƠ NĂNG LỰC (CV) */}
      <AboutSection />
      <CVSection />
    </div>
  );
}
