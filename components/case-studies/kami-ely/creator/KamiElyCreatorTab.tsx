'use client';

import React from 'react';
import CreatorProfileSection from './CreatorProfileSection';
import CreatorActivitySection from './CreatorActivitySection';
import CreatorAudienceSection from './CreatorAudienceSection';
import CreatorContentSection from './CreatorContentSection';
import CreatorSalesSection from './CreatorSalesSection';
import CreatorAnalysisNarrative from './CreatorAnalysisNarrative';

import type { KamiElyDataPayload } from '@/app/types/caseStudies';

interface KamiElyCreatorTabProps {
  isEn: boolean;
  copyDeepLink: (_id: string, _name?: string) => void;
  openProofScreenshot: (_id: string) => void;
  handleExportChart: (_chartId: string, _fileName: string) => void;
  handleTabChange: (_tab: 'science' | 'shop' | 'creator') => void;
  renderDataScopeMatrix: (_scope: 'shop' | 'creator') => React.ReactNode;
  telemetryData?: KamiElyDataPayload | null;
}

export default function KamiElyCreatorTab({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  handleExportChart,
  handleTabChange,
  renderDataScopeMatrix,
  telemetryData
}: KamiElyCreatorTabProps) {
  return (
    <div className="space-y-16">
      {/* 2.1 TỔNG QUAN CREATOR */}
      <CreatorProfileSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        renderDataScopeMatrix={renderDataScopeMatrix}
        profile={telemetryData?.creatorProfile as any}
        collaborativeStores={telemetryData?.collaborativeStores as any}
      />

      {/* 2.2 HOẠT ĐỘNG (ACTIVITY & POSTING BEHAVIOR) */}
      <CreatorActivitySection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        handleExportChart={handleExportChart}
        hourlyActivity={telemetryData?.hourlyActivity as any}
        activityHighlights={telemetryData?.activityHighlights as any}
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
        topVideos={telemetryData?.videos as any}
        topLiveStreams={telemetryData?.livestreams as any}
      />

      {/* 2.6 & 2.7 DOANH SỐ & CỬA HÀNG ĐỐI TÁC + CTA */}
      <CreatorSalesSection
        isEn={isEn}
        copyDeepLink={copyDeepLink}
        openProofScreenshot={openProofScreenshot}
        handleTabChange={handleTabChange}
        collaborativeStores={telemetryData?.collaborativeStores as any}
      />

      {/* STRATEGIC NARRATIVE & RECOMMENDATIONS */}
      <CreatorAnalysisNarrative isEn={isEn} />
    </div>
  );
}
