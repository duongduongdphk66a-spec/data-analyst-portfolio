import React from 'react';
import AboutSection from '@/components/site/AboutSection';
import { getServerLanguage, getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'About' : 'Giới Thiệu'}`,
    description: language === 'en'
      ? 'About Ma Văn Hùng — Data Analyst specializing in SQL, Python, Power BI. Background in quantitative research at VNU Hanoi.'
      : 'Giới thiệu Ma Văn Hùng — Data Analyst chuyên SQL, Python, Power BI. Nền tảng nghiên cứu định lượng tại ĐHQG Hà Nội.',
  };
}

export default async function AboutPage() {
  const { profile } = await getServerPortfolioData();

  return (
    <div className="py-12 md:py-20">
      <AboutSection 
        profile={profile} 
      />
    </div>
  );
}
