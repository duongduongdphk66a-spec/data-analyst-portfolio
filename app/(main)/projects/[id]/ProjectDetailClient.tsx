'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailView from '../../../components/ProjectDetailView';
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

const KamiElyProject = dynamic(() => import('../../../components/KamiElyProject'), {
  loading: CaseStudyLoadingFallback,
});
const HeritageJapanProject = dynamic(() => import('../../../components/HeritageJapanProject'), {
  loading: CaseStudyLoadingFallback,
});
const LibraryBusProject = dynamic(() => import('../../../components/LibraryBusProject'), {
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

  // 2. If it's a special component and the project DOES NOT have explicit markdown content, render the special hardcoded component.
  // This allows overriding hardcoded components with CMS markdown if the user adds 'content'.
  if (SpecialComponent && (!activeProject || !activeProject.content)) {
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
