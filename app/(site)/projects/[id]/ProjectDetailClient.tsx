'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailView from '@/components/site/ProjectDetailView';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { ProjectData } from '../../../types';

const CaseStudyLoadingFallback = () => (
  <div className="min-h-dvh flex items-center justify-center bg-ground dark:bg-[#0B0F17]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-[#0D7287] border-t-transparent rounded-full animate-spin dark:border-[#9BE7FA]" /* taste-skill-ignore: circular spinner */ />
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Đang tải Case Study...</span>
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
  'kami-ely': KamiElyProject,
  'proj_kami_ely': KamiElyProject,
  'kami_ely': KamiElyProject,
  'proj-heritage-japan': HeritageJapanProject,
  'heritage-japan': HeritageJapanProject,
  'proj_heritage_japan': HeritageJapanProject,
  'heritage_japan': HeritageJapanProject,
  'proj-library-bus': LibraryBusProject,
  'library-bus': LibraryBusProject,
  'proj_library_bus': LibraryBusProject,
  'library_bus': LibraryBusProject,
};

export default function ProjectDetailClient({ 
  id, 
  project, 
  initialCaseStudyData 
}: { 
  id: string; 
  project?: ProjectData;
  initialCaseStudyData?: any;
}) {
  const { projects: contextProjects, isLoading } = usePortfolioData();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      const mainContainer = document.querySelector('main.overflow-y-auto') || document.querySelector('main');
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, [id]);

  const cleanId = id.replace(/_/g, '-');
  const normalizedId = cleanId.startsWith('proj-') ? cleanId : `proj-${cleanId}`;

  const SpecialComponent = CASE_STUDY_COMPONENTS[id] || CASE_STUDY_COMPONENTS[normalizedId] || CASE_STUDY_COMPONENTS[cleanId];

  // 1. Prioritize prop from server, then context, then default
  const allProjects = contextProjects && contextProjects.length > 0 ? contextProjects : DEFAULT_PROJECTS;
  const activeProject = project || allProjects.find((p) => p.id === id || p.id === normalizedId || p.id === cleanId);

  // 2. Render rich interactive case study if registered for this project ID
  if (SpecialComponent) {
    return <SpecialComponent isEmbedded={false} initialData={initialCaseStudyData} />;
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
