'use client';

import React from 'react';
import { ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';

interface ScienceEdaSectionProps {
  isEn: boolean;
  handleExport: (id: string, name: string) => void;
}

export default function ScienceEdaSection({ isEn, handleExport }: ScienceEdaSectionProps) {
  return (
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
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
  );
}
