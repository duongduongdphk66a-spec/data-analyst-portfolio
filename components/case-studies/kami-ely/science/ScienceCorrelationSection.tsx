'use client';

import React from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { 
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Label,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';

interface ScienceCorrelationSectionProps {
  isEn: boolean;
  polyView: 'fitted' | 'marginal';
  setPolyView: (_v: 'fitted' | 'marginal') => void;
  handleExport: (_id: string, _name: string) => void;
}

export default function ScienceCorrelationSection({
  isEn,
  polyView,
  setPolyView,
  handleExport
}: ScienceCorrelationSectionProps) {
  return (
    <section id="sec-correlation" className="space-y-8 py-16 md:py-20 border-slate-200/80 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="meta-label">
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
      <div className="border-l-4 border-[#9BE7FA] pl-5 py-2 space-y-3 text-slate-800 dark:text-slate-200 bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/5 rounded-r-xl">
        <div className="flex items-center justify-between text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#074553] dark:text-[#9BE7FA]" />
            {isEn ? 'Key Analytical Findings: Live Streaming Plateau' : 'Nhận Định Phân Tích: Giới Hạn Hiệu Suất Của Livestream'}
          </span>
          <span className="tabular-nums text-[11px] text-[#074553] dark:text-[#9BE7FA] bg-[#C8EEF7]/80 dark:bg-[#9BE7FA]/20 px-2.5 py-0.5 rounded-full border border-[#9BE7FA]">
            {isEn ? 'Optimal Duration: ~3.1 Hours/Day' : 'Thời Lượng Tối Ưu: ~3.1 Giờ/Ngày'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <div className="card-minimal p-4 space-y-1 border border-[#9BE7FA]/60 bg-white dark:bg-slate-900">
            <span className="font-bold uppercase text-[#074553] dark:text-[#9BE7FA]">1. Tác Động Tuyến Tính Hạn Chế</span>
            <p>
              Mức độ tương quan giữa số phiên live và doanh thu hàng ngày chỉ ở mức vừa phải (~41%). Việc tăng ồ ạt số ca live không tạo ra mức tăng trưởng doanh thu tương xứng.
            </p>
          </div>

          <div className="card-minimal p-4 space-y-1 border border-[#9BE7FA]/60 bg-white dark:bg-slate-900">
            <span className="font-bold uppercase text-[#074553] dark:text-[#9BE7FA]">2. Quy Luật Năng Suất Giảm Dần</span>
            <p>
              Doanh thu đạt hiệu suất tốt nhất trong khoảng 2.5 đến 3.5 giờ phát sóng. Kéo dài các phiên live qua 4-6 tiếng khiến doanh thu tăng thêm gần như bằng 0 trong khi chi phí vận hành tăng vọt.
            </p>
          </div>
        </div>
      </div>

      {/* Diminishing Returns Curve */}
      <div id="chart-polynomial" className="card-minimal p-6 space-y-4 border border-[#9BE7FA]/80">
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
            <div className="flex items-center gap-1 rounded-xl bg-[#C8EEF7]/40 p-1 border border-[#9BE7FA]/60 dark:bg-slate-800 dark:border-slate-700">
              <button
                onClick={() => setPolyView('fitted')}
                className={`rounded-lg px-2.5 py-1 text-xs transition cursor-pointer active:scale-[0.97] ${
                  polyView === 'fitted' 
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold border border-[#9BE7FA] shadow-xs dark:bg-[#9BE7FA] dark:text-slate-950' 
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-300'
                }`}
              >
                {isEn ? 'Total Session Revenue' : 'Tổng Doanh Thu Phiên'}
              </button>
              <button
                onClick={() => setPolyView('marginal')}
                className={`rounded-lg px-2.5 py-1 text-xs transition cursor-pointer active:scale-[0.97] ${
                  polyView === 'marginal' 
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold border border-[#9BE7FA] shadow-xs dark:bg-[#9BE7FA] dark:text-slate-950' 
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-300'
                }`}
              >
                {isEn ? 'Marginal Revenue per Extra Hour' : 'Doanh Thu Cận Biên Thêm/Giờ'}
              </button>
            </div>
            <button
              onClick={() => handleExport('chart-polynomial', 'Diminishing_Returns_KamiEly')}
              className="btn-secondary-editorial py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isEn ? 'Export PNG' : 'Xuất biểu đồ'}</span>
            </button>
          </div>
        </div>

        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={KAMI_MATH_STATS.correlation.fittedPolyCurve} margin={{ top: 22, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#9BE7FA" opacity={0.25} />
              <XAxis dataKey="hours" tick={{ fontSize: 11 }} unit="h" />
              <YAxis tick={{ fontSize: 11 }}>
                <Label value={isEn ? '(M VND)' : '(Tr đ)'} position="top" offset={10} fill="#94a3b8" fontSize={11} />
              </YAxis>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#9BE7FA', color: '#f8fafc', borderRadius: '12px' }} />
              <Legend />
              <ReferenceLine x={3.1} stroke="#FFD14C" strokeDasharray="4 4" label={{ value: 'Đỉnh tối ưu: ~3.1h', position: 'top', fill: '#FFD14C', fontSize: 11 }} />
              <Line type="monotone" dataKey={polyView === 'fitted' ? 'fittedGmv' : 'marginalGmv'} stroke="#074553" strokeWidth={2.5} dot={false} name={polyView === 'fitted' ? 'Doanh thu ước lượng (M)' : 'Doanh thu tăng thêm/giờ (M)'} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 p-4 text-xs text-slate-800 dark:text-slate-200">
          <span className="inline-block px-2 py-0.5 rounded bg-[#9BE7FA] text-slate-950 font-bold mr-2 text-xs uppercase">
            Dẫn chứng Thực tế
          </span>
          <span>Ngày 09/04 shop đẩy mạnh lên tới 106 phiên LIVE toàn sàn nhưng GMV không tăng tỷ lệ thuận. Việc duy trì các ca LIVE kéo dài trên 4-6 tiếng chỉ làm tăng chi phí studio, mệt mỏi nhân sự mà không tạo thêm đơn hàng mới.</span>
        </div>
      </div>
    </section>
  );
}
