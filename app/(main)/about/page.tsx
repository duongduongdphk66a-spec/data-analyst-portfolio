'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import AboutSection from '../../components/AboutSection';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const { language } = useLanguage();
  const { profile } = usePortfolioData();
  const router = useRouter();

  useEffect(() => {
    document.title = `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'About' : 'Giới Thiệu'}`;
  }, [language, profile.name]);

  const handleSelectProject = (projId: string) => {
    router.push(`/projects/${projId}`);
  };

  const handleNavigateTab = (tabId: string) => {
    router.push(tabId === 'home' ? '/' : `/${tabId}`);
  };

  return (
    <div className="py-8">
      <AboutSection 
        profile={profile} 
        onSelectProject={handleSelectProject} 
        onNavigateTab={handleNavigateTab}
      />
    </div>
  );
}
