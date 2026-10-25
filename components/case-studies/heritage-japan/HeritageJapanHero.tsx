'use client';

import React from 'react';
import { THESIS_METADATA } from '@/app/data/heritageJapanData';
import { useLanguage } from '@/app/context/LanguageContext';

export interface HeritageJapanHeroProps {
  isEn?: boolean;
  onNavClick?: (_id: string, _e: React.MouseEvent) => void;
  viewMode?: 'executive' | 'academic';
  onToggleViewMode?: (_mode: 'executive' | 'academic') => void;
}

export function HeritageJapanHero({ 
  isEn: propIsEn, 
  onNavClick: _onNavClick, 
  viewMode: _viewMode = 'executive', 
  onToggleViewMode: _onToggleViewMode 
}: HeritageJapanHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <header className="py-16 md:py-24 border-slate-200/80 dark:border-slate-800">
      <div className="page-container">
        <div className="max-w-4xl space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="meta-label">
              {isEn ? 'LINE 03 · HERITAGE TOURISM & QUANTITATIVE RESEARCH' : 'LINE 03 · PHÂN TÍCH ĐỊNH LƯỢNG & DU LỊCH DI SẢN NHẬT BẢN'}
            </span>
            <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500">• JNTO & UNESCO TELEMETRY</span>
          </div>
          
          <h1 className="editorial-section-title text-3xl sm:text-5xl lg:text-6xl font-extrabold sm:font-black leading-[1.18] tracking-normal text-slate-950 dark:text-white">
            {isEn ? THESIS_METADATA.titleEn : THESIS_METADATA.titleVi}
          </h1>
          
          <p className="text-base sm:text-xl text-[#0D7287] font-semibold italic dark:text-[#9BE7FA]">
            {isEn ? THESIS_METADATA.titleVi : THESIS_METADATA.titleEn}
          </p>

          <p className="editorial-lead text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl dark:text-slate-300">
            {isEn
              ? 'A comprehensive quantitative research & case study on Japan’s heritage tourism trajectory (2013–2023): examining inbound growth catalysts, the overtourism crisis across UNESCO cultural hotspots, and actionable governance models for sustainable preservation.'
              : 'Khảo sát thực tiễn toàn diện về lộ trình phát triển du lịch di sản tại Nhật Bản giai đoạn 2013–2023: phân tích động lực bùng nổ du khách quốc tế, khủng hoảng quá tải du lịch (Overtourism) tại các di sản UNESCO và các mô hình quản trị di sản bền vững.'}
          </p>
          
          {/* 10% Bento Telemetry Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="card-minimal p-4 space-y-1">
              <span className="meta-label text-xs block">
                {isEn ? 'RESEARCH SCOPE' : 'PHẠM VI NGHIÊN CỨU'}
              </span>
              <p className="tabular-nums text-2xl font-bold text-slate-950 dark:text-white">2013 – 2023</p>
              <p className="text-xs text-slate-500">10-Year Inbound Growth & Crisis</p>
            </div>

            <div className="card-minimal p-4 space-y-1">
              <span className="meta-label text-xs block">
                {isEn ? 'WORLD HERITAGE SITES' : 'DI SẢN THẾ GIỚI'}
              </span>
              <p className="tabular-nums text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">25 Điểm Đến</p>
              <p className="text-xs text-slate-500">20 Văn hóa · 5 Thiên nhiên</p>
            </div>

            <div className="card-minimal p-4 space-y-1 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
              <span className="meta-label text-xs block text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'PEAK INBOUND VOLUME' : 'ĐỈNH DU KHÁCH (2019)'}
              </span>
              <p className="tabular-nums text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">31.9 Triệu</p>
              <p className="text-xs tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">+513% Tăng trưởng từ 2003</p>
            </div>
          </div>


        </div>
      </div>
    </header>
  );
}

export default HeritageJapanHero;
