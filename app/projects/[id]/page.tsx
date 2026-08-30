import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_PROJECTS } from '../../defaultData';
import ProjectDetailClient from './ProjectDetailClient';

export function generateStaticParams() {
  return DEFAULT_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = DEFAULT_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found | Ma Văn Hùng Portfolio',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} | Ma Văn Hùng - Data Analyst Case Study`,
    description: project.desc,
    openGraph: {
      title: project.title,
      description: project.desc,
      type: 'article',
      images: project.img ? [{ url: project.img }] : undefined,
    },
    keywords: project.tags,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}
