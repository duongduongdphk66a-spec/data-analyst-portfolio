'use client';

import React from 'react';
import { Terminal, Download, X, Check, Copy } from 'lucide-react';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';

interface ScienceNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  selectedSnippetIdx: number;
  setSelectedSnippetIdx: (_i: number) => void;
  copiedCode: boolean;
  handleCopyCode: (_code: string) => void;
}

export default function ScienceNotebookModal({
  isOpen,
  onClose,
  isEn,
  selectedSnippetIdx,
  setSelectedSnippetIdx,
  copiedCode,
  handleCopyCode,
}: ScienceNotebookModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Python notebook source code' : 'Mã nguồn phân tích Python Notebook'}
    >
      <div className="relative flex max-h-[90dvh] w-full max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" /* taste-skill-ignore: modal overlay */>
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 p-2.5 text-[#074553] dark:text-[#9BE7FA]">
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-950 dark:text-white">
                {isEn ? 'Python notebook source code (231-day dataset)' : 'Mã nguồn phân tích Python Notebook (chuỗi 231 ngày)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                public/kami/kami_ely_applied_statistics.ipynb
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/kami/kami_ely_applied_statistics.ipynb"
              download
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#0D7287] hover:bg-[#074553] text-white dark:bg-[#9BE7FA] dark:hover:bg-[#C8EEF7] dark:text-slate-950 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {isEn ? 'Download .ipynb' : 'Tải file .ipynb'}
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label={isEn ? 'Close modal' : 'Đóng cửa sổ'}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Snippet Tabs */}
        <div className="flex overflow-x-auto px-5 sm:px-6 py-1.5 bg-slate-50/70 dark:bg-slate-950/50 gap-1">
          {KAMI_MATH_STATS.notebookSnippets.map((snippet: any, idx: number) => (
            <button
              key={snippet.title}
              type="button"
              onClick={() => setSelectedSnippetIdx(idx)}
              className={`min-h-[44px] whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedSnippetIdx === idx
                  ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {snippet.title}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="relative flex-1 overflow-y-auto p-5 sm:p-6 tabular-nums text-xs">
          <button
            type="button"
            onClick={() => handleCopyCode(KAMI_MATH_STATS.notebookSnippets[selectedSnippetIdx].code)}
            className="absolute right-8 top-8 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/95 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 cursor-pointer transition-colors"
          >
            {copiedCode ? <Check className="h-4 w-4 text-[#9BE7FA]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copiedCode ? (isEn ? 'Copied' : 'Đã sao chép') : (isEn ? 'Copy code' : 'Sao chép mã')}
          </button>
          <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-5 pt-14 sm:pt-5 text-[#9BE7FA] dark:text-[#C8EEF7] leading-relaxed overflow-x-auto">
            <code>{KAMI_MATH_STATS.notebookSnippets[selectedSnippetIdx].code}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 px-5 sm:px-6 py-3.5 text-xs text-slate-600 dark:text-slate-400 rounded-b-3xl">
          <span>
            {isEn
              ? 'Reproducible Python verification scripts on 231-day FastMoss exports (pseudonymized handles).'
              : 'Mã nguồn tái lập toàn bộ kiểm định thống kê trên dữ liệu FastMoss 231 ngày (đã giả danh hóa KOC).'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
}
