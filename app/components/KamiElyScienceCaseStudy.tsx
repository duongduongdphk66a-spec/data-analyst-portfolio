'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Download, 
  AlertTriangle, Sliders, ShieldCheck, 
  Terminal, Code2, Activity, 
  Check, X, Copy
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  AreaChart, Area, Legend, ReferenceLine
} from 'recharts';
import { KAMI_MATH_STATS } from '../data/kamiElyMathStats';
import { useLanguage } from '../context/LanguageContext';
import { useCaseStudyActions } from '../lib/uiHelpers';

interface KamiElyScienceCaseStudyProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function KamiElyScienceCaseStudy({ onBack: _onBack, isEmbedded: _isEmbedded }: KamiElyScienceCaseStudyProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { showToast, handleExportChart: handleExport } = useCaseStudyActions(isEn);

  // Notebook Modal state
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Section 4: Polynomial vs Scatter toggle
  const [polyView, setPolyView] = useState<'fitted' | 'marginal'>('fitted');

  // Section 5: Time Series panel focus
  const [tsPanelFocus, setTsPanelFocus] = useState<'all' | 'trend' | 'seasonal' | 'residual'>('all');

  // Section 6: Optimization Simulator State
  const [liveHoursReduction, setLiveHoursReduction] = useState<number>(50); // % cut
  const [videoCoverage, setVideoCoverage] = useState<number>(859); // from 551 to 859 videos

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(isEn ? 'Code copied to clipboard!' : 'Đã sao chép mã nguồn Python!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Section 6: Financial Improvement Simulator
  const simulatorMetrics = useMemo(() => {
    const baseLiveHours = 470 * 2.5; // ~1,175 hours
    const reducedLiveHours = baseLiveHours * (1 - liveHoursReduction / 100);
    const operationalCostSaved = (baseLiveHours - reducedLiveHours) * 180000; // VND
    
    const incrementalVideos = Math.max(0, videoCoverage - 551);
    const additionalVideoGmv = incrementalVideos * 22000 * (135.2 / 1000); // VND
    const netBenefit = (operationalCostSaved + additionalVideoGmv) / 1e6; // Million VND
    
    return {
      operationalCostSavedMillion: Math.round(operationalCostSaved / 1e6),
      incrementalVideos,
      additionalVideoGmvMillion: Math.round(additionalVideoGmv / 1e6),
      netBenefitMillion: Math.round(netBenefit)
    };
  }, [liveHoursReduction, videoCoverage]);

  return (
    <div className="w-full space-y-16 pb-20 text-slate-900 dark:text-slate-100">
      
      {/* ==================================================================== */}
      {/* PHẦN 1: HERO SECTION & TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW) */}
      {/* ==================================================================== */}
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
              onClick={() => setIsNotebookModalOpen(true)}
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

      {/* ==================================================================== */}
      {/* PHẦN 2: TIỀN XỬ LÝ DỮ LIỆU & THỐNG KÊ MÔ TẢ (EDA & DESCRIPTIVE STATS) */}
      {/* ==================================================================== */}
      <section id="sec-eda" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="editorial-kicker">
              {isEn ? 'PHASE 02 · DATA PREPROCESSING & EDA' : 'PHẦN 2 · TIỀN XỬ LÝ DỮ LIỆU & THỐNG KÊ MÔ TẢ'}
            </span>
          </div>
          <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
            {isEn ? 'Outlier Detection & Skewed Distribution Analysis' : 'Nhận diện Điểm dị biệt & Phân tích Độ lệch Phân phối'}
          </h2>
          <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
            {isEn
              ? 'Raw e-commerce revenue exhibits severe right-skewness. We apply statistical outlier filtering to isolate extreme promotions and contrast Mean against Median to establish true baseline performance.'
              : 'Doanh thu thương mại điện tử thực tế có độ biến động rất mạnh và lệch phải. Ứng dụng phương pháp lọc độ lệch chuẩn để cô lập các phiên bán hàng bùng nổ cực đoan và so sánh Trung bình với Trung vị nhằm định vị chuẩn xác hiệu suất thông thường.'}
          </p>
        </div>

        {/* Analytical Insight Callout: Outlier Filtering */}
        <div className="border-l-4 border-[#0D7287] dark:border-[#9BE7FA] pl-5 py-2 space-y-2 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {isEn ? 'Outlier Filtering Methodology' : 'Nguyên Lý Định Vị Điểm Dị Biệt (Outlier Detection)'}
            </span>
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              {isEn ? 'Filter: > 3 Standard Deviations' : 'Ngưỡng Lọc: > 3 Độ Lệch Chuẩn'}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {isEn
              ? 'To evaluate true everyday shop performance, revenue spikes that diverge more than 3 standard deviations from the population average are isolated. This prevents anomalous Mega Live campaigns from distorting long-term trend lines.'
              : 'Để đánh giá đúng năng lực bán hàng nền tảng, các ngày có doanh số vượt quá 3 lần độ lệch chuẩn khỏi mức trung bình (như phiên Mega Live 16/06 đạt 315 Triệu VNĐ) được tách riêng, tránh làm lệch giá trị trung bình khi lập kế hoạch phân bổ nguồn lực.'}
          </p>
        </div>

        {/* Sub-section 2.1: Outlier Timeline Chart */}
        <div id="chart-outliers" className="card-minimal p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isEn ? '2.1. Daily Revenue Outlier Timeline' : '2.1. Biểu đồ Định vị Điểm dị biệt Doanh thu Hàng ngày'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn ? 'Extreme peak detected: June 16 reached 315M VND (abnormally high promotion event)' : 'Phát hiện điểm dị biệt: Ngày 16/06 đạt 315 Triệu VNĐ (phiên Mega Live đột biến cao)'}
              </p>
            </div>
            <button
              onClick={() => handleExport('chart-outliers', 'Outliers_Timeline_KamiEly')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              {isEn ? 'Export PNG' : 'Xuất biểu đồ'}
            </button>
          </div>

          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={KAMI_MATH_STATS.eda.zTimelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="M" />
                <Tooltip 
                  formatter={(val: any, name?: any) => [
                    `${val} Triệu VNĐ`, 
                    name === 'gmv' ? 'Doanh thu ngày' : name === 'upperThreshold' ? 'Ngưỡng dị biệt' : 'Mức trung bình'
                  ]}
                  labelFormatter={(lbl, items) => {
                    const item = items?.[0]?.payload;
                    return `${lbl} ${item?.isOutlier ? '⚠️ ĐIỂM DỊ BIỆT ĐỘT BIẾN' : ''}`;
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="gmv" stroke="#0D7287" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.isOutlier) {
                    return <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />;
                  }
                  return <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={1.5} fill="#0D7287" />;
                }} name="Doanh thu thực tế (Triệu VNĐ)" />
                <Line type="monotone" dataKey="upperThreshold" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Ngưỡng biến động đột biến" />
                <Line type="monotone" dataKey="meanBaseline" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth={1.5} dot={false} name="Mức trung bình quần thể" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              <strong>Insight Phân Tích:</strong> Phiên Mega Live 16/06 tạo doanh thu 315 Triệu VNĐ đã kéo giá trị trung bình cả tuần lên cao bất thường. Để đánh giá đúng năng lực nền tảng, việc đánh giá vận hành cần bóc tách các điểm dị biệt này hoặc sử dụng Trung vị.
            </span>
          </div>
        </div>

        {/* Sub-section 2.2: Distribution Analysis */}
        <div id="chart-distribution" className="card-minimal p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isEn ? '2.2. Right-Skewed Revenue Distribution' : '2.2. Phân phối Lệch Phải Của Doanh Thu Phiên LIVE'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn 
                  ? `Mean: ${KAMI_MATH_STATS.eda.liveMeanGmv}M vs Median: ${KAMI_MATH_STATS.eda.liveMedianGmv}M VND (Heavy right tail)` 
                  : `Trung bình: ${KAMI_MATH_STATS.eda.liveMeanGmv}M VNĐ so với Trung vị: ${KAMI_MATH_STATS.eda.liveMedianGmv}M VNĐ (Phần lớn doanh số tập trung ở mức thấp)`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Trung vị = 4,51M VNĐ
              </span>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 text-[#0D7287] dark:text-[#9BE7FA] border border-teal-200 dark:border-teal-800">
                Trung bình = 14,85M VNĐ
              </span>
            </div>
          </div>

          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={KAMI_MATH_STATS.eda.kdePoints} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip 
                  formatter={(val: any, name?: any) => [
                    `${val}%`, 
                    name === 'pct' ? 'Tỷ lệ phiên thực tế' : 'Đường phân phối ước lượng'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }}
                />
                <Bar dataKey="pct" fill="#0D7287" radius={[6, 6, 0, 0]} name="Tỷ lệ phiên thực tế" />
                <Line type="monotone" dataKey="kde" stroke="#FFD14C" strokeWidth={3} dot={{ r: 4, fill: '#FFD14C' }} name="Đường phân phối ước lượng" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Over 72.4% of live sessions generate under 5 Million VND. The median (4.51M) represents the true baseline output of a normal live stream, while the mean is inflated more than 3.3x by rare mega sales.'
              : 'Hơn 72.4% số phiên live chỉ đạt doanh thu dưới 5 Triệu VNĐ. Giá trị Trung vị (4,51 Triệu VNĐ) phản ánh chính xác hiệu suất thực tế của một ca live bình thường, trong khi giá trị Trung bình (14,85 Triệu VNĐ) bị phóng đại gấp hơn 3.3 lần do một số ít phiên bùng nổ.'}
          </p>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* PHẦN 3: SO SÁNH HIỆU SUẤT - NGHỊCH LÝ GPM */}
      {/* ==================================================================== */}
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
              className="btn-secondary-editorial py-1.5 px-3 text-xs flex items-center gap-1.5"
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

      {/* ==================================================================== */}
      {/* PHẦN 4: PHÂN TÍCH TƯƠNG QUAN & GIỚI HẠN HIỆU SUẤT CỦA LIVESTREAM */}
      {/* ==================================================================== */}
      <section id="sec-correlation" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="editorial-kicker">
              {isEn ? 'PHASE 04 · CORRELATION & MARGINAL RETURNS' : 'PHẦN 4 · TƯƠNG QUAN & NĂNG SUẤT CẬN BIÊN GIẢM DẦN'}
            </span>
          </div>
          <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
            {isEn ? 'Live Duration Limits: The Law of Diminishing Returns' : 'Giới Hạn Thời Lượng Live: Quy Luật Năng Suất Cận Biên Giảm Dần'}
          </h2>
          <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
            {isEn
              ? 'Empirical proof that "broadcasting more does not yield proportional revenue". The performance curve peaks at ~3.1 hours/day; past this threshold, additional broadcast hours produce negligible sales.'
              : 'Chứng minh luận điểm "Phát LIVE càng nhiều không đồng nghĩa với GMV càng cao". Đường cong hiệu suất đạt đỉnh tại mốc ~3.1 giờ/ngày; sau ngưỡng này, mỗi giờ live phát sóng thêm mang lại doanh số tăng thêm gần như bằng 0.'}
          </p>
        </div>

        {/* Strategic Analytical Principle Callout */}
        <div className="border-l-4 border-[#0D7287] dark:border-[#9BE7FA] pl-5 py-2 space-y-3 text-slate-800 dark:text-slate-200">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isEn ? 'Key Analytical Findings: Live Streaming Plateau' : 'Nhận Định Phân Tích: Giới Hạn Hiệu Suất Của Livestream'}
            </span>
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              {isEn ? 'Optimal Duration: ~3.1 Hours/Day' : 'Thời Lượng Tối Ưu: ~3.1 Giờ/Ngày'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            <div className="card-minimal p-4 space-y-1">
              <span className="font-bold uppercase text-slate-800 dark:text-slate-200">1. Tác Động Tuyến Tính Hạn Chế</span>
              <p>
                Mức độ tương quan giữa số phiên live và doanh thu hàng ngày chỉ ở mức vừa phải (~41%). Việc tăng ồ ạt số ca live không tạo ra mức tăng trưởng doanh thu tương xứng.
              </p>
            </div>

            <div className="card-minimal p-4 space-y-1">
              <span className="font-bold uppercase text-slate-800 dark:text-slate-200">2. Quy Luật Năng Suất Giảm Dần</span>
              <p>
                Doanh thu đạt hiệu suất tốt nhất trong khoảng 2.5 đến 3.5 giờ phát sóng. Kéo dài các phiên live qua 4-6 tiếng khiến doanh thu tăng thêm gần như bằng 0 trong khi chi phí vận hành tăng vọt.
              </p>
            </div>
          </div>
        </div>

        {/* Diminishing Returns Curve */}
        <div id="chart-polynomial" className="card-minimal p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isEn ? '4.2. Diminishing Marginal Returns Curve' : '4.2. Đường Cong Hiệu Suất Theo Thời Lượng Phát Sóng'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn 
                  ? 'Performance peaks at ~3.1 hours; beyond this threshold, marginal returns turn negative.' 
                  : 'Đường cong hiệu suất đạt đỉnh tại mốc ~3.1 giờ/ngày; vượt quá ngưỡng này, mỗi giờ live phát sóng thêm mang lại doanh thu cận biên tiệm cận 0.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setPolyView('fitted')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${polyView === 'fitted' ? 'bg-white shadow text-[#0D7287] dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {isEn ? 'Total Session Revenue' : 'Tổng Doanh Thu Phiên'}
                </button>
                <button
                  onClick={() => setPolyView('marginal')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${polyView === 'marginal' ? 'bg-white shadow text-[#0D7287] dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {isEn ? 'Marginal Revenue per Extra Hour' : 'Doanh Thu Cận Biên Thêm/Giờ'}
                </button>
              </div>
              <button
                onClick={() => handleExport('chart-polynomial', 'Diminishing_Returns_KamiEly')}
                className="btn-secondary-editorial py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isEn ? 'Export PNG' : 'Xuất biểu đồ'}</span>
              </button>
            </div>
          </div>

          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={KAMI_MATH_STATS.correlation.fittedPolyCurve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="durationHours" tick={{ fontSize: 11 }} unit="h" />
                <YAxis tick={{ fontSize: 11 }} unit="M" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                <Legend />
                <ReferenceLine x={3.1} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Đỉnh tối ưu: ~3.1h', position: 'top', fill: '#ef4444', fontSize: 11 }} />
                <Line type="monotone" dataKey={polyView === 'fitted' ? 'fittedGmv' : 'marginalGmv'} stroke="#0D7287" strokeWidth={2.5} dot={false} name={polyView === 'fitted' ? 'Doanh thu ước lượng (M)' : 'Doanh thu tăng thêm/giờ (M)'} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-100 dark:bg-slate-900 p-4 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">Dẫn chứng Thực tế:</span>
            <span>Ngày 09/04 shop đẩy mạnh lên tới 106 phiên LIVE toàn sàn nhưng GMV không tăng tỷ lệ thuận. Việc duy trì các ca LIVE kéo dài trên 4-6 tiếng chỉ làm tăng chi phí studio, mệt mỏi nhân sự mà không tạo thêm đơn hàng mới.</span>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* PHẦN 5: BÓC TÁCH XU HƯỚNG & TÍNH MÙA VỤ 180 NGÀY */}
      {/* ==================================================================== */}
      <section id="sec-timeseries" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="editorial-kicker">
              {isEn ? 'PHASE 05 · 180-DAY TIME-SERIES DECOMPOSITION' : 'PHẦN 5 · BÓC TÁCH XU HƯỚNG & TÍNH MÙA VỤ 180 NGÀY'}
            </span>
          </div>
          <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
            {isEn ? '180-Day Seasonal Decomposition: Trend vs Cycle' : 'Bóc Tách Tín Hiệu Doanh Thu 180 Ngày: Hiệu Ứng Mùa Vụ Hè'}
          </h2>
          <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
            {isEn
              ? 'Decomposing 180 days of store sales into Trend, Seasonality, and Residual components. This demonstrates that the August-September decline was driven by seasonal post-summer vacation demand, not live team execution failure.'
              : 'Bóc tách dữ liệu 180 ngày thành Xu hướng dài hạn, Chu kỳ mùa vụ và Đợt sale đột biến. Kết quả chứng minh sự sụt giảm doanh số tháng 8-9 là hệ quả khách quan của chu kỳ mùa du lịch hè kết thúc, không hoàn toàn do lỗi đội ngũ vận hành Live.'}
          </p>
        </div>

        {/* Signal Breakdown Framework */}
        <div className="card-minimal p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {isEn ? '180-Day Revenue Signal Breakdown' : 'Bóc Tách 3 Thành Phần Doanh Thu 180 Ngày'}
            </span>
            <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              Chu kỳ tuần hoàn 7 ngày
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-1 text-xs sm:grid-cols-3">
            <div className="space-y-1">
              <strong className="text-[#0D7287] dark:text-[#9BE7FA]">1. Xu hướng Dài hạn (Trend):</strong>
              <p className="text-slate-500 dark:text-slate-400">Tăng trưởng mạnh mẽ từ tháng 4 đến tháng 6 (cao điểm sắm đồ bơi hè), thoái trào tự nhiên từ tháng 8 đến tháng 9 khi học sinh trở lại trường.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-amber-600 dark:text-amber-400">2. Chu kỳ Tuần hoàn (Seasonality):</strong>
              <p className="text-slate-500 dark:text-slate-400">Tập trung doanh số cao vào thứ Năm đến thứ Bảy hàng tuần để kịp giao hàng phục vụ các chuyến du lịch cuối tuần.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-emerald-600 dark:text-emerald-400">3. Xung lực Đột biến (Residual):</strong>
              <p className="text-slate-500 dark:text-slate-400">Các đợt bùng nổ đơn hàng phát sinh từ chiến dịch Mega Sale định kỳ của nền tảng TikTok Shop (6.6, 7.7).</p>
            </div>
          </div>
        </div>

        {/* 4-Panel Synchronized Time-Series Chart */}
        <div id="chart-decomp-4panel" className="card-minimal p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isEn ? '5.1. 4-Panel Synchronized Time-Series Chart' : '5.1. Biểu đồ 4 Panel Phân Rã Tín Hiệu Doanh Thu'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn ? 'Visualizing Original Revenue, Trend Line, Weekly Cycle, and Event Spikes' : 'Trực quan hóa Doanh thu thực tế, Đường xu hướng, Chu kỳ tuần hoàn và Xung lực sale'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: isEn ? 'ALL' : 'Tất cả' },
                { id: 'trend', label: isEn ? 'TREND' : 'Xu hướng' },
                { id: 'seasonal', label: isEn ? 'SEASON' : 'Mùa vụ' },
                { id: 'residual', label: isEn ? 'EVENT' : 'Đột biến' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setTsPanelFocus(btn.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${tsPanelFocus === btn.id ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
                >
                  {btn.label}
                </button>
              ))}
              <button
                onClick={() => handleExport('chart-decomp-4panel', 'TimeSeries_Breakdown_KamiEly')}
                className="btn-secondary-editorial py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isEn ? 'Export PNG' : 'Xuất'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Panel 1: Original */}
            {(tsPanelFocus === 'all' || tsPanelFocus === 'trend') && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">1. Doanh thu Thực tế & Đường Xu hướng Dài hạn</span>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={KAMI_MATH_STATS.timeSeries.data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} unit="M" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="original" stroke="#0D7287" strokeWidth={1.5} dot={false} name="Doanh thu thực tế (M)" />
                      <Line type="monotone" dataKey="trend" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Xu hướng dài hạn" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Panel 2: Seasonal */}
            {(tsPanelFocus === 'all' || tsPanelFocus === 'seasonal') && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2. Chu kỳ Biến động Tuần hoàn (Seasonality)</span>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={KAMI_MATH_STATS.timeSeries.data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} unit="M" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="seasonal" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Biến động tuần hoàn (M)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Panel 3: Residual */}
            {(tsPanelFocus === 'all' || tsPanelFocus === 'residual') && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">3. Tác động Ngẫu nhiên & Đợt Sale (Residual)</span>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={KAMI_MATH_STATS.timeSeries.data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} unit="M" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                      <Bar dataKey="residual" fill="#64748b" name="Tác động đột biến (M)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
            <strong>Bài học Quản trị Vận hành:</strong> Kết quả bóc tách chuỗi thời gian cho thấy rõ doanh thu tháng 8-9 sụt giảm đồng thuận với sự hạ nhiệt của mùa du lịch hè. Việc ban quản lý cố gắng ép đội ngũ tăng lên tới 27 phiên LIVE/ngày vào tháng 9 là một quyết định đi ngược lại chu kỳ tự nhiên của thị trường, gây lãng phí chi phí vận hành.
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* PHẦN 6: CHIẾN LƯỢC TỐI ƯU HÓA PHÂN BỔ NGUỒN LỰC & DANH MỤC SKU */}
      {/* ==================================================================== */}
      <section id="sec-optimization" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="editorial-kicker">
              {isEn ? 'PHASE 06 · RESOURCE ALLOCATION & SKU STRATEGY' : 'PHẦN 6 · TỐI ƯU NGUỒN LỰC & CHIẾN LƯỢC SKU'}
            </span>
          </div>
          <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
            {isEn ? 'Resource Reallocation & Top 5% Hero SKU Strategy' : 'Tối Ưu Phân Bổ Nguồn Lực & Chiến Lược Hero SKU Top 5%'}
          </h2>
          <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
            {isEn
              ? 'Turning analytical insights into high-impact executive actions: reducing live streaming hours past the plateau threshold to fund shoppable video expansion, and concentrating ad spend on Top 5% Hero SKUs.'
              : 'Chuyển hóa các phân tích thành quyết định kinh doanh cụ thể: cắt giảm 50% thời lượng Live vượt ngưỡng hiệu quả, tái phân bổ nguồn lực sang sản xuất video gắn giỏ hàng và dồn 80% ngân sách vào các Hero SKU bán chạy nhất.'}
          </p>
        </div>

        {/* Interactive Optimization Simulator */}
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/20 via-slate-950 to-slate-900 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-teal-400" />
              <h3 className="font-bold text-base sm:text-lg">
                {isEn ? 'Interactive Resource Reallocation Simulator' : 'Trình Giả Lập Tối Ưu Hóa Phân Bổ Nguồn Lực'}
              </h3>
            </div>
            <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs text-teal-300 font-semibold">
              Mô hình Dự báo Lợi ích Kinh doanh
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isEn ? 'Reduce Low-GPM Live Hours:' : 'Cắt giảm giờ Live vượt ngưỡng hiệu quả:'}</span>
                  <span className="font-bold text-amber-400">-{liveHoursReduction}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="70" 
                  step="5" 
                  value={liveHoursReduction} 
                  onChange={(e) => setLiveHoursReduction(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
                <span className="text-[11px] text-slate-400">
                  {isEn 
                    ? 'Eliminates studio runtime past the 3-hour diminishing returns limit.' 
                    : 'Cắt giảm các ca live kéo dài sau mốc 3 giờ (nơi doanh thu phát sinh thêm gần như bằng 0).'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isEn ? 'Shoppable Video Coverage:' : 'Số lượng video có gắn link giỏ hàng:'}</span>
                  <span className="font-bold text-teal-300">{videoCoverage} / 859 Video</span>
                </div>
                <input 
                  type="range" 
                  min="551" 
                  max="859" 
                  step="20" 
                  value={videoCoverage} 
                  onChange={(e) => setVideoCoverage(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
                <span className="text-[11px] text-slate-400">
                  {isEn 
                    ? 'Increases high-GPM shoppable videos from 551 to full catalog coverage (859 videos).' 
                    : 'Gia tăng số lượng video có giỏ hàng (tận dụng GPM 135.2k VNĐ vượt trội của kênh video).'}
                </span>
              </div>
            </div>

            {/* Simulated Financial Outcomes */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/80 p-5">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Tiết kiệm Chi phí Vận hành</span>
                <p className="text-2xl font-bold text-amber-400">+{simulatorMetrics.operationalCostSavedMillion}M</p>
                <span className="text-[10px] text-slate-500">Giảm nhân sự & khấu hao phòng live</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">GMV Video Bổ Sung</span>
                <p className="text-2xl font-bold text-teal-300">+{simulatorMetrics.additionalVideoGmvMillion}M</p>
                <span className="text-[10px] text-slate-500">Từ {simulatorMetrics.incrementalVideos} video gắn giỏ hàng mới</span>
              </div>

              <div className="col-span-2 border-t border-slate-800 pt-3">
                <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">Lợi ích Tài chính Ròng Kỳ Vọng:</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-400">+{simulatorMetrics.netBenefitMillion} Triệu VNĐ</span>
                  <span className="text-xs text-slate-300">Doanh thu và tiết kiệm dự kiến</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-section 6.2: SKU Strategy */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isEn ? '6.2. Inventory Strategy: Top 5% Hero SKUs' : '6.2. Quản trị Tồn kho: Danh mục Hero SKU Top 5%'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? 'Focusing ad spend and creator seeding on Top 5% Hero SKUs, while eliminating zero-order Dead Stock.'
                  : 'Dồn 80% ngân sách quảng cáo và gửi mẫu creator vào các Hero SKU dẫn đầu sản lượng; giải phóng hàng tồn không phát sinh đơn.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Ngưỡng Top 5% Sản lượng: &ge; {Math.round(KAMI_MATH_STATS.skuMatrix.p95Units)} Sản phẩm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left: Hero SKUs table */}
            <div className="col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                ⭐ TOP HERO SKUs (Tập trung 80% Ngân sách Ads & Creator Seeding)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-500 dark:bg-slate-900/50">
                    <tr>
                      <th className="py-2.5 px-4">Tên Sản phẩm / Mã SKU</th>
                      <th className="py-2.5 px-3">Ngành hàng</th>
                      <th className="py-2.5 px-3">Đơn bán</th>
                      <th className="py-2.5 px-3">Doanh thu GMV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {KAMI_MATH_STATS.skuMatrix.heroSkus.slice(0, 6).map((sku: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-200 max-w-xs truncate">
                          {sku.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{sku.category}</td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {sku.units.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                          {sku.gmv.toFixed(1)}M đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Dead Stock eliminate box */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                <span>Hàng Tồn Cần Xử Lý (0 Đơn Bán)</span>
              </div>
              <p className="mt-2 text-xs text-rose-800/80 dark:text-rose-300/80">
                Không phát sinh đơn hàng trong suốt chu kỳ 90 ngày. Cần ngưng nhập và thanh lý xả kho sớm:
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {KAMI_MATH_STATS.skuMatrix.deadStock.map((ds: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 rounded-lg bg-white/60 p-2 dark:bg-slate-900/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span className="truncate">{ds.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-rose-500/10 p-2.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                Giải phóng dòng tiền để dồn nguồn lực cho Hero SKUs (CV11, H36).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* PYTHON NOTEBOOK VIEWER MODAL */}
      {/* ==================================================================== */}
      {isNotebookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-500/20 p-2 text-teal-400">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {isEn ? 'Python Notebook Source Code' : 'Mã Nguồn Phân Tích Python Notebook'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    public/kami/kami_ely_applied_statistics.ipynb
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/kami/kami_ely_applied_statistics.ipynb"
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isEn ? 'Download .ipynb' : 'Tải file .ipynb'}
                </a>
                <button
                  onClick={() => setIsNotebookModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Snippet Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-800 px-6 py-2">
              {KAMI_MATH_STATS.notebookSnippets.map((snippet: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSnippetIdx(idx)}
                  className={`whitespace-nowrap px-4 py-2 text-xs font-semibold transition ${selectedSnippetIdx === idx ? 'border-b-2 border-teal-400 text-teal-300' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {snippet.title}
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="relative flex-1 overflow-y-auto p-6 font-mono text-xs">
              <button
                onClick={() => handleCopyCode(KAMI_MATH_STATS.notebookSnippets[selectedSnippetIdx].code)}
                className="absolute right-8 top-8 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedCode ? (isEn ? 'Copied' : 'Đã chép') : (isEn ? 'Copy Code' : 'Sao chép')}
              </button>
              <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-200 leading-relaxed overflow-x-auto">
                <code>{KAMI_MATH_STATS.notebookSnippets[selectedSnippetIdx].code}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 p-4 px-6 text-xs text-slate-400">
              <span>Mã nguồn hoàn chỉnh phục vụ đánh giá năng lực Data Science / Data Analytics.</span>
              <button
                onClick={() => setIsNotebookModalOpen(false)}
                className="rounded-lg border border-slate-700 px-4 py-1.5 text-slate-300 hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
