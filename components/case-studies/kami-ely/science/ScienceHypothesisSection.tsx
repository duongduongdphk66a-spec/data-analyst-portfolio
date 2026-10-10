'use client';

import React from 'react';
import { ShieldCheck, Download, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import metrics from '@/app/data/kami-ely/generated/metrics.json';

interface ScienceHypothesisSectionProps {
  isEn: boolean;
  handleExport: (_id: string, _name: string) => void;
}

export default function ScienceHypothesisSection({ isEn, handleExport }: ScienceHypothesisSectionProps) {
  const hyp = metrics.channel.hypothesis;

  return (
    <section id="sec-hypothesis" className="space-y-8 py-16 md:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="editorial-kicker">
            {isEn ? 'PHASE 03 · STATISTICAL AUDIT & GPM DEBUNKING' : 'PHẦN 3 · KIỂM CHỨNG THỐNG KÊ & GIẢI MÃ NGHỊCH LÝ GPM'}
          </span>
        </div>
        <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
          {isEn 
            ? 'Hypothesis Testing & Metric Audit: Debunking the Video vs Live GPM Fallacy' 
            : 'Kiểm Định Giả Thuyết & Soi Lỗi Đo Lường: Giải Mã &quot;Ảo Ảnh&quot; GPM Video vs Livestream'}
        </h2>
        <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
          {isEn
            ? 'A senior analyst does not blindly parrot dashboard KPIs. We audited FastMoss’s reported claim that "Video GPM is 4.5x higher than Live", and uncovered critical metric denominator mismatches.'
            : 'Nhà phân tích dữ liệu chuyên nghiệp không bao giờ sao chép thụ động các con số trên dashboard. Chúng tôi kiểm chứng lại nhận định của FastMoss về việc &quot;GPM Video gấp 4.5 lần Live&quot; và phát hiện lỗi không đồng nhất mẫu số đo lường.'}
        </p>
      </div>

      {/* 3.1 Đối chiếu Hai Góc Nhìn: Dashboard vẹt vs Senior Data Audit */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card-minimal p-5 space-y-2 border border-rose-200 bg-white dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="editorial-kicker text-[11px] block text-rose-600 dark:text-rose-400">
              {isEn ? 'Dashboard Naive Interpretation' : 'Góc Nhìn Cạn Cợt Của Dashboard'}
            </span>
          </div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200">
            {isEn ? 'Video GPM 135k vs Live 30k (4.5x)' : 'Video GPM 135,2k vs Live 30,2k (Gấp 4.48x)'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isEn 
              ? 'FastMoss reported 28-day snapshot shows Video earning 135k VND per 1k views vs Live 30k VND, leading to premature recommendations to shift all budget to Video.' 
              : 'Thẻ FastMoss 28 ngày báo GPM Video 135k so với Live 30k. Người làm dữ liệu non tay sẽ lập tức đề xuất: &quot;Cắt giảm giờ Live, dồn toàn bộ nguồn lực sang làm Video&quot;.'}
          </p>
        </div>

        <div className="card-minimal p-5 space-y-2 border-2 border-[#9BE7FA] bg-gradient-to-br from-[#EAF8FC] to-[#C8EEF7]/30 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA]" />
            <span className="editorial-kicker text-[11px] block text-[#074553] dark:text-[#9BE7FA]">
              {isEn ? 'Senior Empirical Audit Finding' : 'Kết Luận Sau Khi Kiểm Chứng Dữ Liệu Thực Tế'}
            </span>
          </div>
          <div className="text-base font-bold text-[#074553] dark:text-[#9BE7FA]">
            {isEn ? 'Denominator Incompatibility Discovered' : 'Mẫu Số Đo Lường Bị Lệch Bản Chất'}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {isEn 
              ? 'Video uses automated video views; Live uses unique active session viewers. Video acts as top-funnel reach (68% conversion); Live converts at 95.6%.' 
              : 'Video tính trên lượt view thuật toán tự phát; Live tính trên tổng người xem phiên. Video là phễu nhận diện dài hạn (68.4% ra đơn), trong khi Live là cỗ máy chốt đơn tức thì (95.6% phiên ra đơn).'}
          </p>
        </div>
      </div>

      {/* Statistical Test Summary Box */}
      <div className="card-minimal p-6 space-y-4 border border-[#9BE7FA]">
        <div className="flex items-center justify-between border-b border-[#C8EEF7] dark:border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#074553] dark:text-[#9BE7FA]" />
            {isEn ? 'Statistical Non-Parametric Test (Mann-Whitney U)' : 'Kiểm Định Phi Tham Số Mann-Whitney U & Dữ Liệu Phân Phối Lệch'}
          </span>
          <span className="font-mono text-[11px] text-[#074553] dark:text-[#9BE7FA] bg-[#C8EEF7]/80 dark:bg-[#9BE7FA]/20 px-2.5 py-0.5 rounded-full border border-[#9BE7FA]">
            Dữ liệu gốc 180 Ngày
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1 text-xs sm:grid-cols-4">
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Mẫu Shoppable Video:</span>
            <p className="font-mono text-base font-bold text-[#074553] dark:text-[#9BE7FA]">139 Video (có giỏ)</p>
            <span className="text-[10px] text-slate-400">Median view: 11.582</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Mẫu Phiên Live Kênh:</span>
            <p className="font-mono text-base font-bold text-[#FFD14C] dark:text-[#FFE485]">475 Phiên Live</p>
            <span className="text-[10px] text-slate-400">Median viewer: 2.400</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Tỷ lệ Video có đơn:</span>
            <p className="font-mono text-base font-bold text-slate-900 dark:text-white">68.35%</p>
            <span className="text-[10px] text-slate-400">101 / 139 video gắn giỏ</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Tỷ lệ Live có đơn:</span>
            <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">95.58%</p>
            <span className="text-[10px] text-slate-400">454 / 475 phiên ra đơn</span>
          </div>
        </div>
      </div>

      {/* Visual GPM Comparison Cards */}
      <div id="chart-gpm-ci" className="card-minimal p-6 space-y-4 border border-[#9BE7FA]/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {isEn ? '3.2. Detailed Distribution Metrics: Median vs Aggregate GPM' : '3.2. Bóc Tách Phân Phối Thực Tế: Trung Vị (Median) vs Tổng Hợp (Aggregate)'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn 
                ? 'Because views and viewers are heavily right-skewed, parametric Welch t-tests yield distorted results. Non-parametric percentiles reflect reality.' 
                : 'Vì lượt xem và người xem phân phối lệch mạnh về bên phải (Right-skewed), kiểm định t-test thông thường bị sai lệch. Cần dùng phân vị và trung vị bootstrap.'}
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
          {/* Video Card */}
          <div className="rounded-2xl border-2 border-[#9BE7FA] bg-gradient-to-br from-[#EAF8FC] via-white to-[#C8EEF7]/40 p-5 shadow-xs dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-[#9BE7FA]/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-[#074553] dark:text-[#9BE7FA]">
                Shoppable Video (139 video gắn giỏ)
              </span>
              <span className="rounded-full bg-[#9BE7FA] px-2.5 py-0.5 text-xs font-black text-slate-950 border border-[#9BE7FA] shadow-xs">
                Median: 46,0k ₫
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GPM Trung vị (95% CI):</span>
                <strong className="text-slate-900 dark:text-white font-mono">22,7k – 65,6k ₫ / 1k view</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GPM Tổng hợp (Tổng GMV / Tổng View):</span>
                <strong className="text-[#074553] dark:text-[#9BE7FA] font-mono">121,4k ₫ / 1k view</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tỷ lệ video không có GMV (Zero GMV):</span>
                <span className="text-rose-500 font-mono font-bold">31.65%</span>
              </div>
            </div>
          </div>

          {/* Live Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Livestream Kênh Chính (475 phiên)
              </span>
              <span className="rounded-full bg-[#FFE485]/60 px-2.5 py-0.5 text-xs font-bold text-slate-900 border border-[#FFD14C]">
                Median: 995,9k ₫
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GPM Trung vị (95% CI):</span>
                <strong className="text-slate-900 dark:text-white font-mono">889,4k – 1.078,5k ₫ / 1k viewer</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GPM Tổng hợp (Tổng GMV / Tổng Viewer):</span>
                <strong className="text-amber-600 dark:text-amber-400 font-mono">2.133,1k ₫ / 1k viewer</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tỷ lệ phiên không có GMV:</span>
                <span className="text-emerald-500 font-mono font-bold">Chỉ 4.42% (chuyển đổi 95.6%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-800 p-4 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Bài học phân tích cho Data Analyst:</span>
          </div>
          <p>
            Không thể so sánh thô GPM Video với GPM Live vì 1 lượt xem video (kéo dài 15–30 giây lướt feed) hoàn toàn khác 1 lượt người xem phiên live (vào phòng live tương tác trực tiếp nhiều phút). Video có ưu thế tích lũy traffic thụ động 24/7, trong khi Livestream là công cụ chốt đơn có tỷ lệ thành công 95.6%. Chiến lược tối ưu là <strong>dùng Video làm phễu dẫn khách vào các khung giờ vàng livestream</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
