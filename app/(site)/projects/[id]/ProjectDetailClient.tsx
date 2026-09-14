'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailView from '@/components/site/ProjectDetailView';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { ProjectData } from '../../../types';

const CaseStudyLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFDFE] dark:bg-[#0B0F17]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-[#0D7287] border-t-transparent rounded-full animate-spin dark:border-[#9BE7FA]" />
      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Đang tải Case Study...</span>
    </div>
  </div>
);

const KamiElyProject = dynamic(() => import('@/components/case-studies/KamiElyProject'), {
  loading: CaseStudyLoadingFallback,
});
const HeritageJapanProject = dynamic(() => import('@/components/case-studies/HeritageJapanProject'), {
  loading: CaseStudyLoadingFallback,
});
const LibraryBusProject = dynamic(() => import('@/components/case-studies/LibraryBusProject'), {
  loading: CaseStudyLoadingFallback,
});

const CASE_STUDY_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'proj-kami-ely': KamiElyProject,
  'proj-heritage-japan': HeritageJapanProject,
  'proj-library-bus': LibraryBusProject,
};

export default function ProjectDetailClient({ id, project }: { id: string; project?: ProjectData }) {
  const { projects: contextProjects, isLoading } = usePortfolioData();

  const SpecialComponent = CASE_STUDY_COMPONENTS[id];

  // 1. Prioritize prop from server, then context, then default
  const allProjects = contextProjects && contextProjects.length > 0 ? contextProjects : DEFAULT_PROJECTS;
  const activeProject = project || allProjects.find((p) => p.id === id);

  // 2. Render rich interactive case study if registered for this project ID
  if (SpecialComponent) {
    return <SpecialComponent isEmbedded={false} />;
  }

  const isStillLoading = !activeProject && isLoading;

  return (
    <ProjectDetailView 
      project={activeProject || null} 
      isLoading={isStillLoading}
      isEmbedded={false} 
    />
  );
}
