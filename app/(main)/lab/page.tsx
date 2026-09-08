'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import InteractiveLab from '../../components/InteractiveLab';
import { useRouter } from 'next/navigation';

export default function LabPage() {
  const { language } = useLanguage();
  const { profile } = usePortfolioData();
  const router = useRouter();

  useEffect(() => {
    document.title = `${profile.name || 'Ma Văn Hùng'} | Interactive Lab`;
  }, [profile.name]);

  const handleSelectProject = (projId: string) => {
    router.push(`/projects/${projId}`);
  };

  return (
    <div className="py-8">
      <InteractiveLab onSelectProject={handleSelectProject} />
    </div>
  );
}
