'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

interface CaseStudyFooterProps {
  isEn: boolean;
  currentProjectId: 'proj-kami-ely' | 'proj-heritage-japan' | 'proj-library-bus';
  attribution: {
    datasetVi: string;
    datasetEn: string;
    scopeVi: string;
    scopeEn: string;
  };
}

const PROJECT_MAP = {
  'proj-kami-ely': {
    nextId: 'proj-heritage-japan',
    nextTitleVi: 'Du lịch Di sản Nhật Bản (2013–2022): Kiểm toán & Chuỗi Thời gian',
    nextTitleEn: 'Japan Heritage Tourism (2013–2022): Data Audit & Time-Series',
    nextDescVi: 'Kiểm toán 5 sai lệch niên luận, chuỗi thời gian 20 năm (2003–2022), chi tiêu/khách -14,6% và áp lực quá tải UNESCO.',
    nextDescEn: '5-error thesis data audit, 20-year time-series (2003–2022), -14.6% per-visitor spend drop, and UNESCO overtourism analysis.',
    categoryVi: 'Data Audit & Time-Series',
    categoryEn: 'Data Audit & Time-Series',
  },
  'proj-heritage-japan': {
    nextId: 'proj-library-bus',
    nextTitleVi: 'Library Bus: Technical BA, ERD lõi 7 bảng & Tracking Plan',
    nextTitleEn: 'Library Bus: Technical BA, 7-Entity Core ERD & Tracking Plan',
    nextDescVi: 'Mini-BRD & 5 User Stories, BR-01..04, Tracking Plan 8 sự kiện, Pilot 4 tuần và 11 cặp màn hình cốt lõi.',
    nextDescEn: 'Mini-BRD & 5 User Stories, BR-01..04, 8-event Tracking Plan, 4-week pilot, and 11 core screen pairs.',
    categoryVi: 'Technical BA & Telemetry',
    categoryEn: 'Technical BA & Telemetry',
  },
  'proj-library-bus': {
    nextId: 'proj-kami-ely',
    nextTitleVi: 'Kami Ely: Phân tích TikTok Shop, Affiliate & Đặc tả BI',
    nextTitleEn: 'Kami Ely: TikTok Shop, Affiliate Analytics & BI Spec',
    nextDescVi: 'Đối soát 10 bảng FastMoss (loại +7,59 tỷ trùng nguồn), phân tầng Live theo tháng, Panel FE, Cohort KOC và Đặc tả BI 4 Fact · 3 Dim.',
    nextDescEn: '10 FastMoss tables reconciled (+7.59B overlap removed), monthly Live stratification, Panel FE, KOC cohorts, and 4-Fact · 3-Dim BI Spec.',
    categoryVi: 'E-Commerce Analytics & BI Spec',
    categoryEn: 'E-Commerce Analytics & BI Spec',
  },
};

export default function CaseStudyFooter({ isEn, currentProjectId, attribution }: CaseStudyFooterProps) {
  const nextProj = PROJECT_MAP[currentProjectId];

  return (
    <footer className="mt-16 sm:mt-24 bg-ground transition-colors">
      <div className="page-container py-12 sm:py-16 space-y-10">
        {/* Next Project Teaser Card */}
        {nextProj && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-brand-blue-light dark:border-slate-800 hover:border-[#9BE7FA] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD14C]" />
                  <span>{isEn ? 'Next Recommended Case Study' : 'Dự Án Phân Tích Tiếp Theo'}</span>
                  <span>•</span>
                  <span>{isEn ? nextProj.categoryEn : nextProj.categoryVi}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  {isEn ? nextProj.nextTitleEn : nextProj.nextTitleVi}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {isEn ? nextProj.nextDescEn : nextProj.nextDescVi}
                </p>
              </div>

              <Link
                href={`/projects/${nextProj.nextId}`}
                className="btn-primary text-xs sm:text-sm py-3 px-6 shrink-0 inline-flex items-center gap-2 font-bold cursor-pointer"
              >
                <span>{isEn ? 'Explore Next Study' : 'Xem Dự Án Kế Tiếp'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Data Attribution & Author Signoff */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {isEn ? attribution.datasetEn : attribution.datasetVi}
            </p>
            <p className="text-xs text-slate-500">
              {isEn ? attribution.scopeEn : attribution.scopeVi}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs tabular-nums">
            <span>Ma Văn Hùng · Data Analyst &amp; Business Analyst Portfolio</span>
            <Link
              href="/"
              className="text-[#074553] dark:text-[#9BE7FA] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>{isEn ? 'Home' : 'Trang chủ'}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
