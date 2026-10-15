'use client';

import React from 'react';
import { Zap, BookOpen, Sliders } from 'lucide-react';
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
  onNavClick = (id, e) => {
    e?.preventDefault?.();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 
  viewMode = 'executive', 
  onToggleViewMode 
}: HeritageJapanHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
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
              <span className="editorial-kicker text-xs block">
                {isEn ? 'RESEARCH SCOPE' : 'PHẠM VI NGHIÊN CỨU'}
              </span>
              <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">2013 – 2023</p>
              <p className="text-[11px] text-slate-500">10-Year Inbound Growth & Crisis</p>
            </div>

            <div className="card-minimal p-4 space-y-1">
              <span className="editorial-kicker text-xs block">
                {isEn ? 'WORLD HERITAGE SITES' : 'DI SẢN THẾ GIỚI'}
              </span>
              <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">25 Điểm Đến</p>
              <p className="text-[11px] text-slate-500">20 Văn hóa · 5 Thiên nhiên</p>
            </div>

            <div className="card-minimal p-4 space-y-1 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
              <span className="editorial-kicker text-xs block text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'PEAK INBOUND VOLUME' : 'ĐỈNH DU KHÁCH (2019)'}
              </span>
              <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">31.9 Triệu</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+513% Tăng trưởng từ 2003</p>
            </div>
          </div>

          {/* View Mode Switcher: ⚡ Executive Scan (3 mins) vs 📜 Full Academic Thesis */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  {isEn ? 'READING PERSPECTIVE' : 'CHẾ ĐỘ ĐỌC TỐI ƯU'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">
                  {viewMode === 'executive' 
                    ? (isEn ? 'Recommended for Recruiters' : 'Khuyên dùng cho Nhà tuyển dụng') 
                    : (isEn ? 'USSH VNU Monograph Fulltext' : 'Toàn văn Niên luận Khoa Du lịch')}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {viewMode === 'executive' ? (isEn ? '⏱️ ~3 min read' : '⏱️ ~3 phút đọc nhanh') : (isEn ? '📖 ~25 min in-depth' : '📖 ~25 phút nghiên cứu')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleViewMode?.('executive')}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  viewMode === 'executive'
                    ? 'bg-white dark:bg-slate-800 border-sky-500 text-slate-950 dark:text-white shadow-md ring-2 ring-sky-500/20'
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${viewMode === 'executive' ? 'bg-sky-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <span>{isEn ? '⚡ 3-Minute Executive Scan' : '⚡ Tóm Tắt 3 Phút (Executive Scan)'}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {isEn
                      ? 'Key problem statement, telemetry charts, What-If simulator & data audit.'
                      : 'Vấn đề cốt lõi, Telemetry định lượng, Mô phỏng chính sách What-If & Kiểm toán dữ liệu.'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onToggleViewMode?.('academic')}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  viewMode === 'academic'
                    ? 'bg-white dark:bg-slate-800 border-[#0D7287] dark:border-[#9BE7FA] text-slate-950 dark:text-white shadow-md ring-2 ring-[#0D7287]/20'
                    : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${viewMode === 'academic' ? 'bg-[#0D7287] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    <span>{isEn ? '📜 Full Academic Monograph' : '📜 Luận Văn Chuyên Sâu (Full Academic)'}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {isEn
                      ? 'Complete 10 chapters: UNESCO frameworks, 25 heritage sites, 5 case studies & theoretical proofs.'
                      : 'Đầy đủ 10 chương: Cơ sở lý luận UNESCO, 25 di sản, 5 case studies & chứng minh học thuật.'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#mo-phong-chinh-sach"
              onClick={(e) => onNavClick('mo-phong-chinh-sach', e)}
              className="btn-primary flex items-center gap-2 cursor-pointer font-bold"
            >
              <Sliders className="w-4 h-4" />
              <span>{isEn ? '⚡ What-If Policy Simulator' : '⚡ Mô Phỏng Chính Sách'}</span>
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
            <a
              href="#chuong-1"
              onClick={(e) => onNavClick('chuong-1', e)}
              className="btn-secondary-editorial cursor-pointer text-slate-600 dark:text-slate-400"
            >
              {isEn ? '25 UNESCO Sites' : '25 Di sản UNESCO'}
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}

export default HeritageJapanHero;
