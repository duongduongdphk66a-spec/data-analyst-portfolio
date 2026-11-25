'use client';

import React from 'react';
import { Tier1ExecutiveSummary } from './Tier1ExecutiveSummary';
import { Chapter1ContextAndData } from './Chapter1ContextAndData';
import { Chapter3SeasonalityAndRegression } from './Chapter3SeasonalityAndRegression';
import { Chapter4KocNetwork } from './Chapter4KocNetwork';
import { Chapter5LiveVideoAds } from './Chapter5LiveVideoAds';
import { Chapter6EarlyWarningAndPlaybook } from './Chapter6EarlyWarningAndPlaybook';
import Tier3EngineeringAppendix from './Tier3EngineeringAppendix';

interface Props {
  lang?: 'vi' | 'en';
  isEn?: boolean;
  telemetryData?: unknown;
  onOpenNotebook?: () => void;
}

export function KamiElyCommercialTab({ lang, isEn, onOpenNotebook }: Props) {
  const resolvedLang: 'vi' | 'en' = lang ?? (isEn ? 'en' : 'vi');
  return (
    <div className="space-y-10">
      {/* 1. Tóm tắt 60 giây & Biểu đồ 1 (Xu hướng GMV tháng + Bình quân/ngày) */}
      <Tier1ExecutiveSummary lang={resolvedLang} />
      {/* 2. Biểu đồ 2 (Phân rã 3 tầng Sankey tại mốc 20/10 = 14,84 tỷ) + 4 Bẫy dữ liệu & Đối soát 10 bảng */}
      <Chapter1ContextAndData lang={resolvedLang} />
      {/* 3. Biểu đồ 4 (Ghép ngang: Thời lượng phiên Live 5 mốc vs Ủy quyền quảng cáo Video) */}
      <Chapter5LiveVideoAds lang={resolvedLang} />
      {/* 4. Biểu đồ 3 (Vùng xếp chồng Hè vs Đông từ 10 SKU) đặt cạnh Biểu đồ 5 (Pareto 2 lớp KOC | SKU) */}
      <Chapter3SeasonalityAndRegression lang={resolvedLang} />
      <Chapter4KocNetwork lang={resolvedLang} />
      {/* 5. 4 Thẻ Khuyến nghị hành động gắn KPI mục tiêu */}
      <Chapter6EarlyWarningAndPlaybook lang={resolvedLang} />
      {/* 6. Phụ lục Kỹ thuật & Thư viện SQL (Đóng Accordion mặc định) */}
      <Tier3EngineeringAppendix onOpenNotebook={onOpenNotebook} />
    </div>
  );
}

export default KamiElyCommercialTab;
