'use client';

import React from 'react';
import { DEFAULT_PROJECTS } from '../../defaultData';
import ProjectDetailView from '../../components/ProjectDetailView';
import KamiElyProject from '../../components/KamiElyProject';
import HeritageJapanProject from '../../components/HeritageJapanProject';
import LibraryBusProject from '../../components/LibraryBusProject';

export default function ProjectDetailClient({ id }: { id: string }) {
  if (id === 'proj-kami-ely') {
    return <KamiElyProject isEmbedded={false} />;
  }
  if (id === 'proj-heritage-japan') {
    return <HeritageJapanProject isEmbedded={false} />;
  }
  if (id === 'proj-library-bus') {
    return <LibraryBusProject isEmbedded={false} />;
  }

  const project = DEFAULT_PROJECTS.find((p) => p.id === id) || null;
  return <ProjectDetailView project={project} isEmbedded={false} />;
}
