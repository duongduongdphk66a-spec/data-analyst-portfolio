'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import CVSection from '../../components/CVSection';

export default function ExperiencePage() {
  const { language } = useLanguage();
  const { profile } = usePortfolioData();

  useEffect(() => {
    document.title = `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Experience' : 'Kinh Nghiệm'}`;
  }, [language, profile.name]);

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
