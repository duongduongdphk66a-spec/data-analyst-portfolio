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
    nextTitleVi: 'Niên Luận Du Lịch Di Sản Nhật Bản (JNTO & MLIT)',
    nextTitleEn: 'Japan Heritage Tourism Quantitative Telemetry (JNTO & MLIT)',
    nextDescVi: 'Mô hình chuỗi thời gian 20 năm, khủng hoảng quá tải du lịch và quản trị di sản bền vững.',
    nextDescEn: '20-year time-series modeling, overtourism analysis, and sustainable heritage conservation.',
    categoryVi: 'Time-Series & Econometrics',
    categoryEn: 'Time-Series & Econometrics',
  },
  'proj-heritage-japan': {
    nextId: 'proj-library-bus',
    nextTitleVi: 'Library Bus: Thiết kế UX/UI Website Thư Viện Lưu Động',
    nextTitleEn: 'Library Bus: UX/UI Design for a Mobile Library Website',
    nextDescVi: 'Nghiên cứu, logo và thành phần giao diện, lưới, wireframe và UI design cho 20 màn hình.',
    nextDescEn: 'Research, logo and UI components, grid, wireframes and UI design for 20 screens.',
    categoryVi: 'UX/UI Design',
    categoryEn: 'UX/UI Design',
  },
  'proj-library-bus': {
    nextId: 'proj-kami-ely',
    nextTitleVi: 'Kami Ely: Phân tích hiệu suất TikTok Shop và mạng lưới Affiliate',
    nextTitleEn: 'Kami Ely: TikTok Shop & Affiliate Network Analytics',
    nextDescVi: 'Phân tích 231 ngày dữ liệu ước tính FastMoss, hồi quy OLS mùa vụ, độ tập trung HHI và chuyển dịch SKU Thu Đông.',
    nextDescEn: '231-day FastMoss telemetry analysis, seasonal OLS regression, HHI concentration, and autumn SKU transition.',
    categoryVi: 'E-Commerce & Commercial BI',
    categoryEn: 'E-Commerce & Commercial BI',
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
            <span>Ma Văn Hùng · Portfolio Data Analyst</span>
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
