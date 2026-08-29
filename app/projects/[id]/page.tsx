import React from 'react';
import { DEFAULT_PROJECTS } from '../../defaultData';
import ProjectDetailClient from './ProjectDetailClient';

export function generateStaticParams() {
  return DEFAULT_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}
