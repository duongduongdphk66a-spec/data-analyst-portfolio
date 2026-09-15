'use client';

import React, { useState } from 'react';
import { 
  Layers, GitBranch, Zap, Clock, BarChart2, Server, Download, 
  Code, Check, Eye 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend 
} from 'recharts';
import { weeklyActivityData, latencyBenchmarkData } from '@/app/data/libraryBusData';
import { 
  DJANGO_APPS, PIPELINE_STOPS, LOCKING_CODE_SNIPPET, 
  CELERY_BEAT_SCHEDULES, DOCKER_COMPOSE_SERVICES 
} from '@/app/data/libraryBusContent';
import SectionHeader from '@/components/ui/SectionHeader';

interface Chapter3TechnicalArchitectureProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
  onExportChart: (_chartId: string, _filename: string) => void;
  showToast: (_msg: string, _type?: 'success' | 'error' | 'info') => void;
}

export function Chapter3TechnicalArchitecture({
  isEn,
  onCopyDeepLink,
  onExportChart,
  showToast,
}: Chapter3TechnicalArchitectureProps) {
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(LOCKING_CODE_SNIPPET);
      setCopiedSnippet(true);
      showToast(isEn ? 'Copied Python code snippet!' : 'Đã sao chép đoạn mã Python!', 'success');
      setTimeout(() => setCopiedSnippet(false), 2500);
    }
  };

  return (
    <>
      <section id="sec-tech" className="space-y-8 scroll-mt-36">
        <SectionHeader
          variant="chapter"
          id="sec-tech"
          chapter="CHAPTER 03"
          subtitle={isEn ? '3.5 Technical Architecture & Data Engineering' : '3.5 Kiến trúc kỹ thuật & Kỹ thuật dữ liệu'}
          badge="3.5"
          title={isEn ? '7 Django Apps, Pessimistic Locking & Weekly Trends' : 'Kiến Trúc 7 Django Apps, Khóa Bi Quan & Xu Hướng Vận Hành'}
          onCopy={onCopyDeepLink}
        />

        {/* 7 Django Apps Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>7 Phân Hệ Nghiệp Vụ Django (Modular Monolith)</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DJANGO_APPS.map((app, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#0D7287]/50 hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA]/50 dark:bg-slate-800 dark:text-[#9BE7FA]">
                    app: {app.app}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}/07</span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {isEn ? app.nameEn : app.nameVi}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  {isEn ? app.descEn : app.descVi}
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 dark:border-slate-800">
                  {app.models.map((m, mIdx) => (
                    <span key={mIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Propagation Pipeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>Luồng Dữ Liệu 6 Trạm Dừng (Event Pipeline)</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PIPELINE_STOPS.map((stop, i) => (
              <div 
                key={i} 
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#9BE7FA] hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-[#0D7287] text-white flex items-center justify-center font-black text-sm">
                    {stop.stop}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA]/40 dark:bg-slate-800 dark:text-[#9BE7FA]">
                    {stop.tag}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {isEn ? stop.titleEn : stop.titleVi}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  {isEn ? stop.descEn : stop.descVi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Concurrency Locking & Redis Benchmarks */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Real Source Code Box */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md flex flex-col">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                </div>
                <span className="font-mono text-slate-400 ml-2">transactions/services.py (Pessimistic Locking)</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed flex-1">
              <code>{LOCKING_CODE_SNIPPET}</code>
            </pre>
          </div>

          {/* Performance Benchmark Table & Analysis */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <h4 className="text-sm font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                {isEn ? 'Redis Caching Benchmark (ms)' : 'Benchmark Đo Lường Hiệu Năng Redis Cache'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Triển khai bộ đệm đa tầng Redis Memory giúp giảm trung bình 93.7% thời gian truy vấn cho độc giả.
              </p>
              <div className="space-y-2 pt-1">
                {latencyBenchmarkData.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{item.endpoint}</span>
                      <span className="text-emerald-600 font-mono font-black">{item.withCache}ms</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Không cache: <b className="line-through text-red-500">{item.withoutCache}ms</b></span>
                      <span className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">Giảm {item.reduction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Celery Tasks & Weekly Activity Chart */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Celery Beat Schedule Table */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h4 className="text-sm font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {isEn ? 'Automated Periodic Maintenance Schedules' : 'Lịch Trình Tự Động Định Kỳ (Celery Beat Schedules)'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F0F9FB] text-slate-900 font-bold uppercase border-b border-[#D2EDF6] dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Thời Điểm</th>
                    <th className="p-3">Tác Vụ (Task)</th>
                    <th className="p-3">App</th>
                    <th className="p-3">Mô Tả Xử Lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {CELERY_BEAT_SCHEDULES.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-[#0D7287] whitespace-nowrap dark:text-[#9BE7FA]">{item.time}</td>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{item.taskName}</td>
                      <td className="p-3 text-slate-500 font-mono">{item.app}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{isEn ? item.descEn : item.descVi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Borrow/Return Telemetry Chart */}
          <div id="chart-weekly-circulation" className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                {isEn ? 'Weekly Borrow vs Return Trend' : 'Xu Hướng Mượn / Trả Trong Tuần'}
              </h4>
              <button
                onClick={() => onExportChart('chart-weekly-circulation', 'weekly_circulation_trend')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                title="Tải ảnh PNG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData}>
                  <defs>
                    <linearGradient id="colorBorrows" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D7287" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0D7287" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD14C" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="borrows" name="Lượt mượn" stroke="#0D7287" fillOpacity={1} fill="url(#colorBorrows)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="returns" name="Lượt trả" stroke="#FFD14C" fillOpacity={1} fill="url(#colorReturns)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Docker Infrastructure Topology */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span>Hạ Tầng Triển Khai & Mô Hình Docker Compose</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOCKER_COMPOSE_SERVICES.map((srv, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#0D7287]/50 hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    <Server className="w-4 h-4" />
                    <span>{srv.service}</span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {srv.port}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500">Image: {srv.image}</div>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  {isEn ? srv.roleEn : srv.roleVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-[#C8EEF7]/30 via-white to-[#C8EEF7]/30 p-8 border-2 border-[#9BE7FA]/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {isEn ? 'Want to inspect the complete source code or design spec?' : 'Bạn muốn tìm hiểu sâu hơn về mã nguồn hoặc hồ sơ thiết kế?'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isEn 
              ? 'Full source code available on GitHub. Complete system architecture and wireframes documented in interactive website.html.'
              : 'Mã nguồn đầy đủ trên GitHub. Toàn bộ kiến trúc và giao diện nằm trong tập tin website.html.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/library-bus/website.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>{isEn ? 'Open Spec HTML' : 'Xem Hồ Sơ HTML'}</span>
          </a>
          <a
            href="https://github.com/duongduongdphk66a-spec/prj"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-black transition-all shadow-xs flex items-center gap-1.5 dark:bg-slate-800 dark:text-white dark:border-slate-700"
          >
            <Code className="w-4 h-4 text-[#0D7287]" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>
    </>
  );
}
