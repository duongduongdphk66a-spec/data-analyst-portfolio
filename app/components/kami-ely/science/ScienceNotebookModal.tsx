'use client';

import React from 'react';
import { Terminal, Download, X, Check, Copy } from 'lucide-react';
import { KAMI_MATH_STATS } from '../../../data/kamiElyData';

interface ScienceNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn: boolean;
  selectedSnippetIdx: number;
  setSelectedSnippetIdx: (i: number) => void;
  copiedCode: boolean;
  handleCopyCode: (code: string) => void;
}

export default function ScienceNotebookModal({
  isOpen,
  onClose,
  isEn,
  selectedSnippetIdx,
  setSelectedSnippetIdx,
  copiedCode,
  handleCopyCode
}: ScienceNotebookModalProps) {
  if (!isOpen) return null;

  return (
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
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
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
              className={`whitespace-nowrap px-4 py-2 text-xs font-semibold transition cursor-pointer ${selectedSnippetIdx === idx ? 'border-b-2 border-teal-400 text-teal-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {snippet.title}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="relative flex-1 overflow-y-auto p-6 font-mono text-xs">
          <button
            onClick={() => handleCopyCode(KAMI_MATH_STATS.notebookSnippets[selectedSnippetIdx].code)}
            className="absolute right-8 top-8 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
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
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-1.5 text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
