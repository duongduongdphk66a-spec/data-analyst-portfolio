'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { KAMI_ELY_SQL_LAB_PRESETS } from '@/app/data/kami-ely/sqlLabPresets';

export function KamiElySqlLabWorkbench() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [customSql, setCustomSql] = useState<string>(KAMI_ELY_SQL_LAB_PRESETS[0].sqlQuery);

  const activePreset = KAMI_ELY_SQL_LAB_PRESETS[activePresetIndex];

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setCustomSql(KAMI_ELY_SQL_LAB_PRESETS[idx].sqlQuery);
  };

  return (
    <section id="kami-sql-lab" className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/95 dark:shadow-2xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30">
            SQL Analytics Workbench • 8 Kami Ely Tables (18.778 Rows)
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1.5">
            {lang === 'vi'
              ? 'Phòng Thí Nghiệm Truy Vấn SQL Liên Bảng (Kami Ely E-Commerce Lab)'
              : 'Cross-Table SQL Reconciliation Workbench (Kami Ely E-Commerce Lab)'}
          </h2>
        </div>

        {/* 4 PRESET QUERY BUTTONS */}
        <div className="flex flex-wrap gap-2">
          {KAMI_ELY_SQL_LAB_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-sky-50 text-sky-900 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/50'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Query #{idx + 1}: {preset.badge}
            </button>
          ))}
        </div>
      </div>

      {/* BUSINESS QUESTION & SQL EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">{activePreset.title[lang]}</h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-sky-700 dark:text-sky-400 block mb-1">
                {lang === 'vi' ? 'Bài toán Phân tích:' : 'Analytical Question:'}
              </strong>
              {activePreset.businessQuestion[lang]}
            </div>
          </div>

          <textarea
            value={customSql}
            onChange={(e) => setCustomSql(e.target.value)}
            rows={12}
            spellCheck={false}
            className="w-full rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 p-3.5 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-sky-500 shadow-inner dark:bg-slate-950/95"
          />
        </div>

        {/* QUERY RESULT TABLE & INTERPRETATION */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-xs">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 text-[11px] uppercase">
                  {activePreset.columns.map((col) => (
                    <th key={col} className="p-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-800 dark:text-slate-200">
                {activePreset.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/80 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3">
                        {typeof cell === 'number' ? cell.toLocaleString('vi-VN') : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-slate-200 leading-relaxed">
            <strong className="text-emerald-800 dark:text-emerald-400">
              💡 {lang === 'vi' ? 'Kết luận Kiểm toán Dữ liệu:' : 'Data Audit Takeaway:'}
            </strong>{' '}
            {activePreset.analystInterpretation[lang]}
          </div>
        </div>
      </div>
    </section>
  );
}

export default KamiElySqlLabWorkbench;
