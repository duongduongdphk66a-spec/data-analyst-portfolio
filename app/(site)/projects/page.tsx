import React from 'react';
import ProjectsSection from '@/components/site/ProjectsSection';
import { getServerLanguage, getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { language } = await getServerLanguage();
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | ${language === 'en' ? 'Work' : 'Dự Án'}`,
  };
}

export default async function ProjectsPage() {
  const { projects } = await getServerPortfolioData();

  return (
    <div className="py-8">
      <ProjectsSection 
        projects={projects} 
      />
    </div>
  );
}
