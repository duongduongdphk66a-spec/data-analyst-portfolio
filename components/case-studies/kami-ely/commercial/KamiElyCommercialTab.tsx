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
  onOpenNotebook?: () => void;
}

export function KamiElyCommercialTab({ lang, isEn, onOpenNotebook }: Props) {
  const resolvedLang: 'vi' | 'en' = lang ?? (isEn ? 'en' : 'vi');
  return (
    <div className="space-y-10">
      {/* 1. Tóm tắt 60 giây & Biểu đồ 1 (Xu hướng GMV tháng + Bình quân/ngày) */}
      <Tier1ExecutiveSummary lang={resolvedLang} />
      {/* 2. Biểu đồ 2 (Đối soát 10 bảng & cơ cấu Nội bộ vs KOC ngoài theo từng kênh) */}
      <Chapter1ContextAndData lang={resolvedLang} />
      {/* 3. Biểu đồ 3 & 4 (Mùa vụ 10 SKU trả lời trực tiếp cú rơi T8 + Pareto 2 lớp & Kiểm định thống kê) */}
      <Chapter3SeasonalityAndRegression lang={resolvedLang} />
      {/* 4. Biểu đồ 5A & 5B (Thời lượng Live phân tầng theo tháng chống Simpson + Video Ads 6 lát cắt) */}
      <Chapter5LiveVideoAds lang={resolvedLang} />
      {/* 5. Sàng lọc 302 KOC Live ngoài & Luật hỗ trợ 2 tầng bảo toàn nhóm chuyển đổi muộn */}
      <Chapter4KocNetwork lang={resolvedLang} />
      {/* 6. 4 Sáng kiến hành động ưu tiên gắn KPI & Đánh đổi rủi ro */}
      <Chapter6EarlyWarningAndPlaybook lang={resolvedLang} />
      {/* 7. Phụ lục Kỹ thuật & Thư viện SQL (Đóng Accordion mặc định) */}
      <Tier3EngineeringAppendix onOpenNotebook={onOpenNotebook} />
    </div>
  );
}

export default KamiElyCommercialTab;
