'use client';

import React, { useState } from 'react';
import { CheckCircle2, CircleDashed, ChevronDown, ChevronUp, Database, Sparkles, Lightbulb } from 'lucide-react';
import { STAGE_META } from './stageMeta';
import { usePlaybookLang } from './PlaybookUi';
import { pipelineMeta } from './playbookData';
import { MINTO_NARRATIVE } from '@/app/data/kami-ely/mintoNarrative';

import Stage1Architecture from './stages/Stage1Architecture';
import Stage2ProfileClean from './stages/Stage2ProfileClean';
import Stage3TimeSeries from './stages/Stage3TimeSeries';
import Stage4Cohorts from './stages/Stage4Cohorts';
import Stage5Funnels from './stages/Stage5Funnels';
import Stage6Anomalies from './stages/Stage6Anomalies';
import Stage7EtlPii from './stages/Stage7EtlPii';

export interface KamiElySqlPlaybookProps {
  compactMode?: boolean;
}

export default function KamiElySqlPlaybook({ compactMode = true }: KamiElySqlPlaybookProps = {}) {
  const { L, b, n } = usePlaybookLang();
  const [showAllStages, setShowAllStages] = useState(!compactMode);
  const narrative = MINTO_NARRATIVE.tab3;

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="sec-playbook"
      className="scroll-mt-28 space-y-10 border-t border-slate-200 pt-8 dark:border-slate-800"
      aria-labelledby="pb-title"
    >
      <header className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {L('3. Kỹ Thuật Dữ Liệu & SQL', '3. Data Engineering & SQL')}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {pipelineMeta.tables} {L('bảng', 'tables')} · {n(pipelineMeta.rows)} {L('dòng SSOT', 'SSOT rows')}
            </span>
          </div>

          <h2 id="pb-title" className="text-2xl font-extrabold text-slate-950 sm:text-3xl dark:text-white flex items-center gap-2.5">
            <Database className="w-7 h-7 text-[#0D7287] dark:text-[#9BE7FA]" />
            {compactMode
              ? L('4 Mô-đun Kỹ Thuật Dữ Liệu Cốt Lõi', '4 Core Data Engineering Modules')
              : L('7 Giai Đoạn Phân Tích Bằng SQL', '7 Stages of SQL Analysis')}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {L(
              `Số liệu thật từ ${pipelineMeta.tables} bảng dữ liệu (${n(pipelineMeta.rows)} dòng). Biểu đồ trước, SQL mở khi cần.`,
              `Real figures from ${pipelineMeta.tables} data tables (${n(pipelineMeta.rows)} rows). Charts first, SQL on demand.`,
            )}
          </p>
        </div>

        {/* Minto Analytical Narrative Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {L('Kiến Trúc & Làm Sạch (Stage 1 • 2 • 7)', 'Architecture & Cleansing (Stage 1 • 2 • 7)')}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {L(narrative.architectureInsight.vi, narrative.architectureInsight.en)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                {L('Truy Vấn Hành Vi Chuyên Sâu (Stage 3 → 6)', 'Deep Behavioral Querying (Stage 3 → 6)')}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {L(narrative.queryInsight.vi, narrative.queryInsight.en)}
              </p>
            </div>
          </div>
        </div>

        {/* Stage quick jump bar */}
        <nav aria-label={L('Các giai đoạn', 'Stages')}>
          <ol className="flex gap-2 overflow-x-auto pb-1">
            {STAGE_META.map((s) => (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (!showAllStages) setShowAllStages(true);
                    setTimeout(() => jumpTo(s.id), 50);
                  }}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border border-[#9BE7FA]/70 bg-white px-3 text-xs sm:text-sm font-bold text-slate-800 transition-colors duration-200 hover:bg-[#C8EEF7]/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#9BE7FA] text-xs font-black text-slate-950">
                    {s.n}
                  </span>
                  {b(s.short)}
                  {s.coverage === 'full' ? (
                    <CheckCircle2 className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-label={L('Dữ liệu thật', 'Real data')} />
                  ) : (
                    <CircleDashed className="h-4 w-4 text-amber-700 dark:text-[#FFE485]" aria-label={L('Một phần', 'Partial')} />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {/* Render 4 core modules or full 7 stages */}
      <div className="space-y-14">
        {/* Module 1: Stage 1 Architecture & Schema (Biểu đồ #19) */}
        <Stage1Architecture />

        {/* Module 2: Stage 5 Funnels (Biểu đồ #20) */}
        <Stage5Funnels />

        {/* Module 3: Stage 4 Cohorts (Biểu đồ #21) */}
        <Stage4Cohorts />

        {/* Module 4: Stage 6 Anomalies (Biểu đồ #22) */}
        <Stage6Anomalies />

        {/* Additional stages when expanded */}
        {showAllStages && (
          <div className="space-y-14 animate-fadeIn border-t border-slate-200 dark:border-slate-800 pt-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              <span>{L('Các giai đoạn phân tích bổ sung', 'Additional analytical stages')}</span>
            </div>
            <Stage2ProfileClean />
            <Stage3TimeSeries />
            <Stage7EtlPii />
          </div>
        )}
      </div>

      {/* Toggle button to expand/collapse full stages */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={() => setShowAllStages((prev) => !prev)}
          className="inline-flex min-h-[44px] items-center gap-2 px-6 py-2.5 rounded-2xl border-2 border-[#9BE7FA] bg-white hover:bg-[#C8EEF7]/40 text-slate-900 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white"
        >
          {showAllStages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>
            {showAllStages
              ? L('Thu gọn về 4 mô-đun cốt lõi', 'Collapse to 4 core modules')
              : L('Mở rộng toàn bộ 7 giai đoạn SQL', 'Expand all 7 SQL stages')}
          </span>
        </button>
      </div>
    </section>
  );
}
