'use client';

import React from 'react';
import CreatorProfileSection from './CreatorProfileSection';
import CreatorActivitySection from './CreatorActivitySection';
import CreatorAudienceSection from './CreatorAudienceSection';
import CreatorContentSection from './CreatorContentSection';
import CreatorSalesSection from './CreatorSalesSection';
import CreatorAnalysisNarrative from './CreatorAnalysisNarrative';

interface KamiElyCreatorTabProps {
  isEn: boolean;
  copyDeepLink: (id: string, name?: string) => void;
  openProofScreenshot: (id: string) => void;
  handleExportChart: (chartId: string, fileName: string) => void;
  handleTabChange: (tab: 'science' | 'shop' | 'creator') => void;
  renderDataScopeMatrix: (scope: 'shop' | 'creator') => React.ReactNode;
}

export default function KamiElyCreatorTab({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  handleExportChart,
  handleTabChange,
  renderDataScopeMatrix
}: KamiElyCreatorTabProps) {
  return (
    <div className="space-y-16">
      {/* 2.1 TỔNG QUAN CREATOR */}
      <CreatorProfileSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        renderDataScopeMatrix={renderDataScopeMatrix}
      />

      {/* 2.2 HOẠT ĐỘNG (ACTIVITY & POSTING BEHAVIOR) */}
      <CreatorActivitySection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        handleExportChart={handleExportChart}
      />

      {/* 2.3 NGƯỜI THEO DÕI (FOLLOWERS & DEMOGRAPHICS) */}
      <CreatorAudienceSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
      />

      {/* 2.4 & 2.5 NỘI DUNG (VIDEO & LIVESTREAM) */}
      <CreatorContentSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
      />

      {/* 2.6 & 2.7 DOANH SỐ & CỬA HÀNG ĐỐI TÁC + CTA */}
      <CreatorSalesSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        handleTabChange={handleTabChange}
      />

      {/* STRATEGIC NARRATIVE & RECOMMENDATIONS */}
      <CreatorAnalysisNarrative isEn={isEn} />
    </div>
  );
}
