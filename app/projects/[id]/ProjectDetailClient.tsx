'use client';

import React, { useEffect, useState } from 'react';
import { DEFAULT_PROJECTS } from '../../defaultData';
import ProjectDetailView from '../../components/ProjectDetailView';
import KamiElyProject from '../../components/KamiElyProject';
import HeritageJapanProject from '../../components/HeritageJapanProject';
import LibraryBusProject from '../../components/LibraryBusProject';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { ProjectData } from '../../types';

const CASE_STUDY_COMPONENTS: Record<string, React.ComponentType<{ isEmbedded?: boolean; onBack?: () => void }>> = {
  'proj-kami-ely': KamiElyProject,
  'proj-heritage-japan': HeritageJapanProject,
  'proj-library-bus': LibraryBusProject,
};

export default function ProjectDetailClient({ id }: { id: string }) {
  const { projects: contextProjects, isLoading } = usePortfolioData();
  const [apiProject, setApiProject] = useState<ProjectData | null>(null);
  const [fetchFinished, setFetchFinished] = useState(false);

  const SpecialComponent = CASE_STUDY_COMPONENTS[id];

  // 1. Lookup in Context Projects (including MySQL DB / CMS dynamic projects)
  const allProjects = contextProjects && contextProjects.length > 0 ? contextProjects : DEFAULT_PROJECTS;
  const project = allProjects.find((p) => p.id === id) || apiProject;

  // 2. Fallback direct API fetch if not present in memory context yet
  useEffect(() => {
    let active = true;

    if (!SpecialComponent && !project && !isLoading && !fetchFinished) {
      fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => {
          if (!active) return;
          if (data.success && Array.isArray(data.data)) {
            const match = data.data.find((p: ProjectData) => p.id === id);
            if (match) {
              setApiProject(match);
            }
          }
        })
        .catch((err) => {
          console.warn('[ProjectDetailClient] Failed to fetch project from API:', err);
        })
        .finally(() => {
          if (active) setFetchFinished(true);
        });
    }

    return () => {
      active = false;
    };
  }, [id, project, isLoading, fetchFinished, SpecialComponent]);

  if (SpecialComponent) {
    return <SpecialComponent isEmbedded={false} />;
  }

  const isStillLoading = !project && (isLoading || !fetchFinished);

  return (
    <ProjectDetailView 
      project={project || null} 
      isLoading={isStillLoading}
      isEmbedded={false} 
    />
  );
}
