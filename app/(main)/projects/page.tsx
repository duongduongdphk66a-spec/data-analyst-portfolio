'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import ProjectsSection from '../../components/ProjectsSection';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { language } = useLanguage();
  const { profile, projects } = usePortfolioData();
  const router = useRouter();

  useEffect(() => {
    document.title = `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Work' : 'Dự Án'}`;
  }, [language, profile.name]);

  const handleSelectProject = (projId: string) => {
    router.push(`/projects/${projId}`);
  };

  return (
    <div className="py-8">
      <ProjectsSection 
        projects={projects} 
        onSelectProject={handleSelectProject}
      />
    </div>
  );
}
