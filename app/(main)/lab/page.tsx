import React from 'react';
import InteractiveLab from '../../components/InteractiveLab';
import { getServerPortfolioData } from '../../lib/serverData';

export async function generateMetadata() {
  const { profile } = await getServerPortfolioData();
  return {
    title: `${profile.name || 'Ma Văn Hùng'} | Interactive Lab`,
  };
}

export default function LabPage() {
  return (
    <div className="py-8">
      <InteractiveLab />
    </div>
  );
}
