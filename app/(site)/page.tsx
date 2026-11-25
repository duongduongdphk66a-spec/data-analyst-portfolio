import React from 'react';
import HeroSection from '@/components/site/HeroSection';
import { getServerLanguage, getServerPortfolioData } from '../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  const isEn = language === 'en';
  const displayName = (profile?.name || 'Ma Văn Hùng').replace(/^Mã\s+/i, 'Ma ');
  return {
    title: `${displayName} | Fresher Data Analyst / Business Analyst`,
    description: isEn
      ? `${displayName}: a Japanese Studies graduate moving into data and business analysis. Projects on TikTok Shop sales (231 days of data), heritage tourism in Japan, and Library Bus BA & telemetry design, built with SQL and Python.`
      : `${displayName}: cử nhân Nhật Bản học chuyển sang phân tích dữ liệu và nghiệp vụ. Dự án phân tích TikTok Shop (231 ngày dữ liệu), du lịch di sản Nhật Bản và đặc tả BA & Telemetry cho Library Bus, dùng SQL và Python.`,
  };
}

export default function HomePage() {
  return (
    <main className="w-full">
      <HeroSection />
    </main>
  );
}
