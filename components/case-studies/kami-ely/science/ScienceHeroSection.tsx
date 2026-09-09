'use client';

import React from 'react';
import { Code2, Download } from 'lucide-react';

interface ScienceHeroSectionProps {
  isEn: boolean;
  onOpenNotebook: () => void;
}

export default function ScienceHeroSection({ isEn, onOpenNotebook }: ScienceHeroSectionProps) {
  return (
    <section id="sec-hero" className="py-12 border-b border-slate-200/80 dark:border-slate-800 space-y-8">
      <div className="max-w-5xl space-y-6">
        {/* Editorial Kicker */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="editorial-kicker">
            {isEn ? 'APPLIED DATA SCIENCE · PERFORMANCE ANALYTICS' : 'KHOA HỌC DỮ LIỆU · PHÂN TÍCH HIỆU SUẤT THỰC NGHIỆM'}
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            • 180-DAY TIME-SERIES DECOMPOSITION
          </span>
        </div>

        {/* 1.1 Tiêu đề & Thông tin cốt lõi */}
        <div className="space-y-4">
          <h1 className="editorial-section-title text-3xl sm:text-4xl lg:text-5xl text-slate-950 dark:text-white leading-[1.18]">
            {isEn 
              ? 'Omnichannel Resource Optimization & Time-Series Analytics: Kami Ely Case Study' 
              : 'Tối ưu hóa Phân bổ Nguồn lực Đa kênh bằng Thống kê Suy diễn & Phân tích Chuỗi thời gian: Case Study Thương hiệu Kami Ely'}
          </h1>
          <p className="editorial-lead text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-4xl">
            {isEn
              ? 'Empirical evaluation of the revenue efficiency gap between Livestream and Shoppable Video channels, combined with 180-day seasonal trend extraction to guide commercial resource reallocation.'
              : 'Kiểm định thực nghiệm chênh lệch hiệu suất sinh lời giữa Livestream và Video mua sắm, kết hợp bóc tách tính chu kỳ mùa vụ 180 ngày nhằm tối ưu hóa chi phí vận hành và phân bổ nguồn lực.'}
          </p>
        </div>

        {/* Core Analytical Pillars Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'Thống kê mô tả & Điểm dị biệt', 
            'So sánh hiệu suất 2 mẫu độc lập', 
            'Phân tích tương quan tuyến tính', 
            'Quy luật năng suất cận biên giảm dần', 
            'Phân rã chuỗi thời gian 180 ngày', 
            'Python (scipy.stats, statsmodels)'
          ].map((tech) => (
            <span key={tech} className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {tech}
            </span>
          ))}
        </div>

        {/* 1.2 Executive Summary 10% Bento Telemetry Matrix */}
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
          <div className="card-minimal p-5 space-y-2">
            <span className="editorial-kicker text-[11px] block">
              {isEn ? 'Total Population Analyzed' : 'Quy Mô Quần Thể Phân Tích'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-slate-950 dark:text-white">238.4k</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Orders' : 'Đơn hàng'}</span>
            </div>
            <p className="text-xs text-[#0D7287] dark:text-[#9BE7FA] font-bold">31,6 Tỷ VNĐ GMV Toàn Sàn</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {isEn ? 'Accumulated since inception (Aug 18, 2022) • 180-day window: 85.5k units / 12.7B VND' : 'Tích lũy toàn thời gian từ 18/08/2022 • Chu kỳ bóc tách 180N: 85.5k đơn / 12,7 Tỷ đ'}
            </p>
          </div>

          <div className="card-minimal p-5 space-y-2">
            <span className="editorial-kicker text-[11px] block">
              {isEn ? 'Livestream Mean GPM (470 Sessions)' : 'GPM Live Trung Bình (470 Phiên)'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-slate-800 dark:text-slate-200">30,2k</span>
              <span className="text-xs text-slate-500 font-medium">VNĐ / 1.000 Views</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Revenue output per 1,000 live views' : 'Doanh thu thu về trên mỗi nghìn view Live'}
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '22%' }} />
            </div>
          </div>

          <div className="card-minimal p-5 space-y-2 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
            <span className="editorial-kicker text-[11px] block text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'Shoppable Video GPM (551 Videos)' : 'GPM Video Mua Sắm (551 Videos)'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">135,2k</span>
              <span className="text-xs text-slate-500 font-medium">VNĐ / 1.000 Views</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {isEn ? '4.48x higher than Livestream' : 'Gấp 4.48 lần kênh Livestream'}
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Action Row: View Python Notebook & Jump links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onOpenNotebook}
            className="btn-primary-gold flex items-center gap-2 cursor-pointer"
          >
            <Code2 className="h-4 w-4" />
            <span>{isEn ? 'View Python Notebook' : 'Xem Python Notebook (scipy.stats)'}</span>
          </button>
          <a
            href="/kami/kami_ely_applied_statistics.ipynb"
            download
            className="btn-secondary-editorial flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{isEn ? 'Download .ipynb File' : 'Tải File .ipynb Chuẩn'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
