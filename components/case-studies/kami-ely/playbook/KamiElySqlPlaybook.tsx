'use client';

import React from 'react';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { STAGE_META } from './stageMeta';
import { usePlaybookLang } from './PlaybookUi';
import { pipelineMeta } from './playbookData';
import Stage1Architecture from './stages/Stage1Architecture';
import Stage2ProfileClean from './stages/Stage2ProfileClean';
import Stage3TimeSeries from './stages/Stage3TimeSeries';
import Stage4Cohorts from './stages/Stage4Cohorts';
import Stage5Funnels from './stages/Stage5Funnels';
import Stage6Anomalies from './stages/Stage6Anomalies';
import Stage7EtlPii from './stages/Stage7EtlPii';

export default function KamiElySqlPlaybook() {
  const { L, b, n } = usePlaybookLang();

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="sec-playbook"
      className="scroll-mt-28 space-y-10 border-t border-slate-200 pt-10 dark:border-slate-800"
      aria-labelledby="pb-title"
    >
      <header className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">SQL playbook</span>
          <h2 id="pb-title" className="text-2xl font-extrabold text-slate-950 sm:text-3xl dark:text-white">
            {L('7 giai đoạn phân tích bằng SQL', '7 stages of SQL analysis')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {L(
              `Số liệu thật từ ${pipelineMeta.tables} bảng dữ liệu (${n(pipelineMeta.rows)} dòng). Biểu đồ trước, SQL mở khi cần.`,
              `Real figures from ${pipelineMeta.tables} data tables (${n(pipelineMeta.rows)} rows). Charts first, SQL on demand.`,
            )}
          </p>
        </div>

        <nav aria-label={L('Các giai đoạn', 'Stages')}>
          <ol className="flex gap-2 overflow-x-auto pb-1">
            {STAGE_META.map((s) => (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => jumpTo(s.id)}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border border-[#9BE7FA]/70 bg-white px-3 text-sm font-bold text-slate-800 transition-colors duration-200 hover:bg-[#C8EEF7]/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
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

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
            {L('Đủ dữ liệu cho đúng nội dung giai đoạn', 'Data covers the stage as defined')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CircleDashed className="h-4 w-4 text-amber-700 dark:text-[#FFE485]" aria-hidden="true" />
            {L('Dùng đối tượng thay thế hoặc bỏ một phần', 'Uses a substitute unit or skips part')}
          </span>
        </p>
      </header>

      <div className="space-y-14">
        <Stage1Architecture />
        <Stage2ProfileClean />
        <Stage3TimeSeries />
        <Stage4Cohorts />
        <Stage5Funnels />
        <Stage6Anomalies />
        <Stage7EtlPii />
      </div>
    </section>
  );
}
