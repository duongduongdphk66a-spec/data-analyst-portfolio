import React from 'react';
import type { Metadata } from 'next';
import ArchitectureClient from './ArchitectureClient';

export const metadata: Metadata = {
  title: 'Library Bus - Interactive Architecture Graph | Ma Văn Hùng',
  description: 'Interactive system architecture graph for Library Bus: Django apps, database models, and relational foreign keys.',
};

export default function ArchitecturePage() {
  return <ArchitectureClient />;
}
