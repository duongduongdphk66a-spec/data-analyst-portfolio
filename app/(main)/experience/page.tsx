import React from 'react';
import CVSection from '../../components/CVSection';
import { getServerLanguage, getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Experience' : 'Kinh Nghiệm'}`,
  };
}

export default async function ExperiencePage() {
  const { profile } = await getServerPortfolioData();

  return (
    <div className="py-12">
      <CVSection 
        experiences={profile.experiences || []} 
        name={profile.name} 
        title={profile.title} 
      />
    </div>
  );
}
