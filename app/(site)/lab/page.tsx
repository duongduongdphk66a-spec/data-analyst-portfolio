import React, { Suspense } from 'react';
import InteractiveLab from '@/components/site/InteractiveLab';
import { getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | Interactive Lab`,
  };
}

export default function LabPage() {
  return (
    <div className="py-12 md:py-20">
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-slate-400">Loading SQL Lab...</div>}>
        <InteractiveLab />
      </Suspense>
    </div>
  );
}
