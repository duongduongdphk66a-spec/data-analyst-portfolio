import React from 'react';
import HeroSection from '@/components/site/HeroSection';
import { getServerLanguage, getServerPortfolioData } from '../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  const isEn = language === 'en';
  return {
    title: isEn
      ? `${profile?.name || 'Ma Van Hung'} — Outcome-Driven Data Analyst`
      : `${profile?.name || 'Mã Văn Hùng'} — Data Analyst | Định hướng Giải quyết Bài toán Kinh doanh`,
    description: isEn
      ? 'Ma Van Hung — Outcome-Driven Data Analyst. Turning raw, fragmented data into revenue growth and operational clarity with SQL, Python, Power BI, and Tableau.'
      : 'Mã Văn Hùng — Data Analyst định hướng giải quyết bài toán kinh doanh. Biến dữ liệu phức tạp thành tăng trưởng doanh thu và hiệu suất vận hành với SQL, Python, Power BI, Tableau.',
  };
}

export default function HomePage() {
  return (
    <main className="w-full">
      <HeroSection />
    </main>
  );
}

