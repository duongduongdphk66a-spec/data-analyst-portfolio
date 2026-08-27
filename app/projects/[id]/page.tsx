'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectData } from '../../types';
import { DEFAULT_PROJECTS } from '../../defaultData';
import { safeJsonParse } from '../../lib/security';
import { trackVisitorAction } from '../../lib/visitorTracking';
import ProjectDetailView from '../../components/ProjectDetailView';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('portfolio_projects_v3');
    let projectsList = DEFAULT_PROJECTS;
    if (savedProjects) {
      projectsList = safeJsonParse(savedProjects, DEFAULT_PROJECTS);
    }
    
    const foundProject = projectsList.find(p => p.id === id);
    setProject(foundProject || null);

    if (foundProject) {
      trackVisitorAction(`Xem chi tiết dự án: ${foundProject.title}`, `Mã dự án: ${id}`, 'project');
    }
  }, [id]);

  return <ProjectDetailView project={project} isEmbedded={false} />;
}
