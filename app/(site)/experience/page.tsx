import React from 'react';
import CVSection from '@/components/site/CVSection';
import { getServerLanguage, getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Experience' : 'Kinh Nghiệm'}`,
    description: language === 'en'
      ? 'Career timeline and experience of Ma Văn Hùng — E-Commerce data analysis, TikTok Shop analytics, and academic research at VNU Hanoi.'
      : 'Quá trình học vấn và kinh nghiệm phân tích dữ liệu của Ma Văn Hùng — E-Commerce, TikTok Shop analytics, nghiên cứu định lượng tại ĐHQG Hà Nội.',
  };
}

export default async function ExperiencePage() {
  const { profile } = await getServerPortfolioData();

  return (
    <div className="py-12 md:py-20">
      <CVSection 
        experiences={profile.experiences || []} 
        name={profile.name} 
        title={profile.title} 
      />
    </div>
  );
}
