import React from 'react';
import AboutSection from '../../components/AboutSection';
import { getServerLanguage, getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'About' : 'Giới Thiệu'}`,
  };
}

export default async function AboutPage() {
  const { profile } = await getServerPortfolioData();

  return (
    <div className="py-8">
      <AboutSection 
        profile={profile} 
      />
    </div>
  );
}
