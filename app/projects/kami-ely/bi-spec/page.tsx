import React from 'react';
import type { Metadata } from 'next';
import KamiBiInteractiveWorkspace from '@/components/case-studies/kami-ely/KamiBiInteractiveWorkspace';

export const metadata: Metadata = {
  title: 'Kami Ely - BI Dashboard Tương tác & Đặc tả Power BI / Looker Studio | Ma Văn Hùng',
  description:
    'BI Dashboard tương tác có Cross-Filter Slicer, mô phỏng Stop-Loss Live >10h, gói tải CSV/Excel Star Schema 4 Fact / 3 Dim và 6 nhóm DAX Measures cho dự án Kami Ely.',
};

export default function KamiBiSpecPage() {
  return <KamiBiInteractiveWorkspace />;
}
