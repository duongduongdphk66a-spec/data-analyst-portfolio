'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { THESIS_METADATA } from '@/app/data/heritageJapanData';

interface HeritageJapanHeroProps {
  isEn: boolean;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
}

export function HeritageJapanHero({ isEn, onNavClick }: HeritageJapanHeroProps) {
  return (
    <header className="py-16 md:py-24 border-b border-slate-200/80 dark:border-slate-800">
      <div className="page-container">
        <div className="max-w-4xl space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="editorial-kicker">
              {isEn ? 'LINE 03 · HERITAGE TOURISM & QUANTITATIVE RESEARCH' : 'LINE 03 · PHÂN TÍCH ĐỊNH LƯỢNG & DU LỊCH DI SẢN NHẬT BẢN'}
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">• JNTO & UNESCO TELEMETRY</span>
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
              <span className="editorial-kicker text-[10px] block">
                {isEn ? 'RESEARCH SCOPE' : 'PHẠM VI NGHIÊN CỨU'}
              </span>
              <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">2013 – 2023</p>
              <p className="text-[11px] text-slate-500">10-Year Inbound Growth & Crisis</p>
            </div>

            <div className="card-minimal p-4 space-y-1">
              <span className="editorial-kicker text-[10px] block">
                {isEn ? 'WORLD HERITAGE SITES' : 'DI SẢN THẾ GIỚI'}
              </span>
              <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">25 Điểm Đến</p>
              <p className="text-[11px] text-slate-500">20 Văn hóa · 5 Thiên nhiên</p>
            </div>

            <div className="card-minimal p-4 space-y-1 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
              <span className="editorial-kicker text-[10px] block text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'PEAK INBOUND VOLUME' : 'ĐỈNH DU KHÁCH (2019)'}
              </span>
              <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">31.9 Triệu</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+513% Tăng trưởng từ 2003</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#mo-dau"
              onClick={(e) => onNavClick('mo-dau', e)}
              className="btn-primary flex items-center gap-2 cursor-pointer font-bold"
            >
              <span>{isEn ? 'Start Reading Thesis' : 'Bắt đầu đọc đề tài'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#chuong-1"
              onClick={(e) => onNavClick('chuong-1', e)}
              className="btn-secondary-editorial cursor-pointer"
            >
              {isEn ? 'Explore 25 UNESCO Sites' : 'Khám phá 25 Di sản UNESCO'}
            </a>
            <a
              href="#chuong-3"
              onClick={(e) => onNavClick('chuong-3', e)}
              className="btn-secondary-editorial cursor-pointer"
            >
              {isEn ? 'View Data & Charts 3.1 - 3.6' : 'Biểu đồ 3.1 - 3.6'}
            </a>
            <a
              href="#kiem-dinh-du-lieu"
              onClick={(e) => onNavClick('kiem-dinh-du-lieu', e)}
              className="btn-secondary-editorial cursor-pointer text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
            >
              {isEn ? 'Data Audit & Anomalies' : 'Kiểm định Dữ liệu'}
            </a>
            <a
              href="#danh-gia-hieu-qua"
              onClick={(e) => onNavClick('danh-gia-hieu-qua', e)}
              className="btn-secondary-editorial cursor-pointer text-[#0D7287] dark:text-[#9BE7FA] border-[#9BE7FA]"
            >
              {isEn ? 'Counterfactual Model' : 'Đánh giá Hiệu quả'}
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
