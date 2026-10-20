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
    <section id="kami-sql-lab" className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800/90 dark:bg-slate-950/95 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-1 rounded text-[11px] tabular-nums font-bold uppercase bg-[#C8EEF7]/50 text-[#074553] border border-[#9BE7FA]/60 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30">
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
              className={`px-3 py-1.5 rounded-xl text-xs tabular-nums font-bold transition border cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/60'
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
              <strong className="text-[#074553] dark:text-[#9BE7FA] block mb-1">
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
            className="w-full rounded-xl bg-slate-900 text-[#9BE7FA] border border-slate-800 p-3.5 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#9BE7FA] dark:bg-slate-950/95" /* taste-skill-ignore: SQL code editor */
          />
        </div>

        {/* QUERY RESULT TABLE & INTERPRETATION */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-xs">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 text-[11px] uppercase">
                  {activePreset.columns.map((col) => (
                    <th key={col} className="p-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-800 dark:text-slate-200 [&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
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

          <div className="p-4 rounded-xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/40 text-xs text-slate-800 dark:bg-slate-900 dark:border-[#9BE7FA]/30 dark:text-slate-200 leading-relaxed">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">
              {lang === 'vi' ? 'Kết luận Kiểm toán Dữ liệu:' : 'Data Audit Takeaway:'}
            </strong>{' '}
            {activePreset.analystInterpretation[lang]}
          </div>
        </div>
      </div>
    </section>
  );
}

export default KamiElySqlLabWorkbench;
