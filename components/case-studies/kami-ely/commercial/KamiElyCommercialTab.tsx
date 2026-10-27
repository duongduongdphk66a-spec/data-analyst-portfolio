'use client';

import React from 'react';
import type { KamiElyDataPayload } from '@/app/types/caseStudies';
import { ChartGranularityProvider, GlobalGranularityBar } from '../playbook/PlaybookUi';
import Tier1ExecutiveSummary from './Tier1ExecutiveSummary';
import Chapter2ContextAndData from './Chapter2ContextAndData';
import Chapter3RevenueAndSku from './Chapter3RevenueAndSku';
import Chapter4SeasonalityAndRegression from './Chapter4SeasonalityAndRegression';
import Chapter5KocNetwork from './Chapter5KocNetwork';
import Chapter6LiveVideoAds from './Chapter6LiveVideoAds';
import Chapter6PipelineAndPrivacy from './Chapter6PipelineAndPrivacy';
import Chapter7ConclusionAndLimits from './Chapter7ConclusionAndLimits';
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
        {/* Thanh chuyển đồng loạt tất cả biểu đồ sang chế độ Xem theo ngày (231N / 179N) */}
        <GlobalGranularityBar />

        {/* Chương 0: Tóm tắt điều hành (Stacked Area 3 nhóm kênh + 3 phát hiện + 3 khuyến nghị) */}
        <Tier1ExecutiveSummary />

        {/* Chương 1 -> Chương 7: Mỗi chương gọn trong 1 - 2 màn hình theo khuôn chuẩn */}
        <Chapter2ContextAndData />
        <Chapter3RevenueAndSku />
        <Chapter4SeasonalityAndRegression />
        <Chapter5KocNetwork />
        <Chapter6LiveVideoAds />
        <Chapter6PipelineAndPrivacy onOpenNotebook={onOpenNotebook} />
        <Chapter7ConclusionAndLimits />

        {/* Phụ lục A · B · C (Accordion mặc định đóng) */}
        <Tier3EngineeringAppendix onOpenNotebook={onOpenNotebook} />
      </div>
    </ChartGranularityProvider>
  );
}
