'use client';

import React from 'react';
import { ShieldCheck, Download } from 'lucide-react';

interface ScienceHypothesisSectionProps {
  isEn: boolean;
  handleExport: (_id: string, _name: string) => void;
}

export default function ScienceHypothesisSection({ isEn, handleExport }: ScienceHypothesisSectionProps) {
  return (
    <section id="sec-hypothesis" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="editorial-kicker">
            {isEn ? 'PHASE 03 · HYPOTHESIS & STATISTICAL SIGNIFICANCE' : 'PHẦN 3 · KIỂM ĐỊNH HIỆU SUẤT - NGHỊCH LÝ GPM'}
          </span>
        </div>
        <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
          {isEn ? 'Statistical Significance Testing: Video vs Livestream GPM' : 'So Sánh Hiệu Suất Sinh Lời: Nghịch lý GPM Video vs Livestream'}
        </h2>
        <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
          {isEn
            ? 'Rigorous statistical verification confirming whether Shoppable Video systematically outperforms Livestream in Gross Merchandise Value per 1,000 views, or if the observed 135.2k vs 30.2k gap is random noise.'
            : 'Đánh giá có cơ sở thực nghiệm khẳng định việc Short-video có doanh thu trên mỗi nghìn lượt xem (GPM) vượt trội hơn Livestream là sự thật mang tính quy luật vững chắc, loại bỏ hoàn toàn khả năng do biến động ngẫu nhiên.'}
        </p>
      </div>

      {/* 3.1 Định vị Giả định & Kết luận thực nghiệm */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card-minimal p-5 space-y-2">
          <span className="editorial-kicker text-[11px] block">{isEn ? 'Baseline Assumption' : 'Giả Định Ban Đầu'}</span>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200">
            {isEn ? 'Channel Equivalence' : 'Hiệu Suất Tương Đương'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn 
              ? 'The observed GPM difference between Video and Livestream is assumed to be accidental variance.' 
              : 'Chênh lệch doanh thu trên 1.000 lượt xem (GPM) giữa Video và Live chỉ là ngẫu nhiên nhất thời.'}
          </p>
        </div>

        <div className="card-minimal p-5 space-y-2 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
          <span className="editorial-kicker text-[11px] block text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? 'Proven Finding' : 'Kết Luận Thực Nghiệm'}</span>
          <div className="text-base font-bold text-[#0D7287] dark:text-[#9BE7FA]">
            {isEn ? 'Systemic Video Superiority (4.48x)' : 'Video Vượt Trội Có Hệ Thống (4.48x)'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isEn 
              ? 'Shoppable Video systematically generates higher GPM with over 99.9% statistical confidence.' 
              : 'Video mua sắm tạo ra doanh thu trên 1.000 lượt xem cao gấp 4.48 lần Live với độ tin cậy trên 99.9%.'}
          </p>
        </div>
      </div>

      {/* Statistical Test Summary Box */}
      <div className="card-minimal p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            {isEn ? 'Two-Sample Statistical Test Summary' : 'Tóm Tắt Kết Quả So Sánh Hai Nhóm Mẫu'}
          </span>
          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Độ tin cậy: &gt; 99.99%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1 text-xs sm:grid-cols-4">
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Mẫu Video Mua Sắm:</span>
            <p className="font-mono text-base font-bold text-[#0D7287] dark:text-[#9BE7FA]">551 Video</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Mẫu Phiên Live:</span>
            <p className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">470 Phiên Live</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Xác Suất Ngẫu Nhiên:</span>
            <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">&lt; 0.01%</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Đánh Giá:</span>
            <p className="text-base font-bold text-slate-900 dark:text-white">Quy Luật Bền Vững</p>
          </div>
        </div>
      </div>

      {/* Visual GPM Comparison Cards */}
      <div id="chart-gpm-ci" className="card-minimal p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {isEn ? '3.2. GPM Performance Gap Comparison' : '3.2. So Sánh Hiệu Suất Doanh Thu Trên 1.000 Lượt Xem (GPM)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn ? 'Khoảng dao động tin cậy của Video và Live hoàn toàn tách biệt, khẳng định ưu thế vượt trội của Short-video.' : 'Khoảng dao động tin cậy của Video và Live hoàn toàn tách biệt, khẳng định ưu thế vượt trội của Short-video.'}
            </p>
          </div>
          <button
            onClick={() => handleExport('chart-gpm-ci', 'GPM_Comparison_KamiEly')}
            className="btn-secondary-editorial py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isEn ? 'Export PNG' : 'Xuất biểu đồ'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Live Card */}
          <div className="rounded-2xl border border-amber-300/40 bg-amber-500/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                {isEn ? 'Livestream Channel (470 Sessions)' : 'Kênh Livestream (470 phiên)'}
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                Trung Bình GPM: 30,2k
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Dải hiệu suất tin cậy:</span>
                <strong className="text-slate-800 dark:text-slate-200">28,5k - 31,9k VNĐ</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Đặc điểm:</span>
                <span className="text-slate-600 dark:text-slate-300">Phụ thuộc streamer, tốn chi phí phòng live</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-3 rounded-full bg-amber-400" style={{ width: '22%' }} />
              </div>
            </div>
          </div>

          {/* Video Card */}
          <div className="rounded-2xl border border-teal-300/40 bg-teal-500/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                {isEn ? 'Shoppable Video Channel (551 Videos)' : 'Kênh Video Mua Sắm (551 video)'}
              </span>
              <span className="rounded bg-teal-500/20 px-2 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                Trung Bình GPM: 135,2k
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Dải hiệu suất tin cậy:</span>
                <strong className="text-teal-600 dark:text-teal-300">128,1k - 142,3k VNĐ</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Đặc điểm:</span>
                <span className="text-slate-600 dark:text-slate-300">Tồn tại lâu dài, sinh đơn thụ động 24/7</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-3 rounded-full bg-teal-500" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
          <strong>Kết luận Phân Tích:</strong> Short-video mang lại doanh thu trên mỗi 1.000 lượt xem cao gấp 4.48 lần Livestream. Điều này xuất phát từ khả năng phân phối liên tục của thuật toán TikTok và trải nghiệm xem ngắn gọn, dễ chốt đơn của khách hàng.
        </div>
      </div>
    </section>
  );
}
