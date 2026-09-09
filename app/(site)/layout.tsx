import React from 'react';
import { getServerPortfolioData } from '../lib/serverData';
import MainLayoutClient from './MainLayoutClient';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { projects } = await getServerPortfolioData();

  return (
    <MainLayoutClient initialProjects={projects}>
      {children}
    </MainLayoutClient>
  );
}
