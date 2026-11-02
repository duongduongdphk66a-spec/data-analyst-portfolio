'use client';

import React from 'react';
import type { KamiElyDataPayload } from '@/app/types/caseStudies';
import { ChartGranularityProvider } from '../playbook/PlaybookUi';
import Tier1ExecutiveSummary from './Tier1ExecutiveSummary';
import Chapter1ContextAndData from './Chapter1ContextAndData';
import Chapter2RevenueAndSku from './Chapter2RevenueAndSku';
import Chapter3SeasonalityAndRegression from './Chapter3SeasonalityAndRegression';
import Chapter4KocNetwork from './Chapter4KocNetwork';
import Chapter5LiveVideoAds from './Chapter5LiveVideoAds';
import Chapter6EarlyWarningAndPlaybook from './Chapter6EarlyWarningAndPlaybook';
import Tier3EngineeringAppendix from './Tier3EngineeringAppendix';

export interface KamiElyCommercialTabProps {
  isEn?: boolean;
  onOpenProofModal?: (_screenshotId?: string) => void;
  copyDeepLink?: (_id: string) => void;
  telemetryData?: KamiElyDataPayload | null;
  onOpenNotebook?: () => void;
}

export default function KamiElyCommercialTab({ onOpenNotebook }: KamiElyCommercialTabProps) {
  return (
    <ChartGranularityProvider>
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Chapter 0: Executive Summary */}
        <Tier1ExecutiveSummary />

        {/* Chapters 1 to 6 */}
        <Chapter1ContextAndData />
        <Chapter2RevenueAndSku />
        <Chapter3SeasonalityAndRegression />
        <Chapter4KocNetwork />
        <Chapter5LiveVideoAds />
        <Chapter6EarlyWarningAndPlaybook />

        {/* Engineering Appendix A, B, C */}
        <Tier3EngineeringAppendix onOpenNotebook={onOpenNotebook} />
      </div>
    </ChartGranularityProvider>
  );
}
