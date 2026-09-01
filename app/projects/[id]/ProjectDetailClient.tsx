'use client';

import React, { useEffect, useState } from 'react';
import { DEFAULT_PROJECTS } from '../../defaultData';
import ProjectDetailView from '../../components/ProjectDetailView';
import KamiElyProject from '../../components/KamiElyProject';
import HeritageJapanProject from '../../components/HeritageJapanProject';
import LibraryBusProject from '../../components/LibraryBusProject';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { ProjectData } from '../../types';

export default function ProjectDetailClient({ id }: { id: string }) {
  const { projects: contextProjects, isLoading } = usePortfolioData();
  const [apiProject, setApiProject] = useState<ProjectData | null>(null);
  const [fetchFinished, setFetchFinished] = useState(false);

  // 1. Lookup in Context Projects (including MySQL DB / CMS dynamic projects)
  const isSpecialCaseStudy = id === 'proj-kami-ely' || id === 'proj-heritage-japan' || id === 'proj-library-bus';
  const allProjects = contextProjects && contextProjects.length > 0 ? contextProjects : DEFAULT_PROJECTS;
  const project = allProjects.find((p) => p.id === id) || apiProject;

  // 2. Fallback direct API fetch if not present in memory context yet
  useEffect(() => {
    let active = true;

    if (!isSpecialCaseStudy && !project && !isLoading && !fetchFinished) {
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
  }, [id, project, isLoading, fetchFinished, isSpecialCaseStudy]);

  // 3. Static Case Studies with custom bespoke interactive visualizations
  if (id === 'proj-kami-ely') {
    return <KamiElyProject isEmbedded={false} />;
  }
  if (id === 'proj-heritage-japan') {
    return <HeritageJapanProject isEmbedded={false} />;
  }
  if (id === 'proj-library-bus') {
    return <LibraryBusProject isEmbedded={false} />;
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
