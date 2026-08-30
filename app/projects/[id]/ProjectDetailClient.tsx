'use client';

import React from 'react';
import { DEFAULT_PROJECTS } from '../../defaultData';
import ProjectDetailView from '../../components/ProjectDetailView';

export default function ProjectDetailClient({ id }: { id: string }) {
  const project = DEFAULT_PROJECTS.find((p) => p.id === id) || null;
  return <ProjectDetailView project={project} isEmbedded={false} />;
}
