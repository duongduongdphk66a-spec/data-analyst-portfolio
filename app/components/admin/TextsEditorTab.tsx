'use client';

import React, { useState, useMemo } from 'react';
import { translations } from '../../data/translations';

interface TextsEditorTabProps {
  textsForm: { vi: Record<string, string>; en: Record<string, string> };
  setTextsForm: React.Dispatch<React.SetStateAction<{ vi: Record<string, string>; en: Record<string, string> }>>;
  onSave: () => void;
  isSaving: boolean;
}

export default function TextsEditorTab({
  textsForm,
  setTextsForm,
  onSave,
  isSaving,
}: TextsEditorTabProps) {
  const [textLang, setTextLang] = useState<'vi' | 'en'>('vi');
  const [textSubSection, setTextSubSection] = useState<string>('all');
  const [textSearch, setTextSearch] = useState<string>('');

  const textKeysList = useMemo(() => {
    return Object.keys(translations.vi).map((key) => {
      let section = 'general';
      let sectionLabel = 'Chung (General)';
      if (key.startsWith('nav_')) {
        section = 'navigation';
        sectionLabel = 'Menu & Điều hướng';
      } else if (key.startsWith('hero_') || key.startsWith('cta_')) {
        section = 'hero';
        sectionLabel = 'Trang chủ (Hero & CTA)';
      } else if (key.startsWith('about_') || key.startsWith('goal_')) {
        section = 'about';
        sectionLabel = 'Giới thiệu (About)';
      } else if (key.startsWith('cv_')) {
        section = 'cv';
        sectionLabel = 'Học vấn & CV';
      } else if (key.startsWith('proj_')) {
        section = 'projects';
        sectionLabel = 'Dự án (Projects)';
      } else if (key.startsWith('dash_')) {
        section = 'dashboard';
        sectionLabel = 'Dashboard & Thống kê';
      }
      return { key, section, sectionLabel };
    });
  }, []);

  const filteredTextKeys = useMemo(() => {
    return textKeysList.filter((item) => {
      if (textSubSection !== 'all' && item.section !== textSubSection) {
        return false;
      }
      if (textSearch.trim()) {
        const q = textSearch.toLowerCase();
        const curVal = textsForm[textLang]?.[item.key] || '';
        return item.key.toLowerCase().includes(q) || curVal.toLowerCase().includes(q);
      }
      return true;
    });
  }, [textKeysList, textSubSection, textSearch, textsForm, textLang]);

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Controls & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Language Switch */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setTextLang('vi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              textLang === 'vi'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => setTextLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              textLang === 'en'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🇬🇧 English
          </button>
        </div>

        {/* Section filter */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'hero', label: 'Trang Chủ' },
            { id: 'about', label: 'Giới Thiệu' },
            { id: 'cv', label: 'Học Vấn & CV' },
            { id: 'projects', label: 'Dự Án' },
            { id: 'dashboard', label: 'Dashboard' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setTextSubSection(sec.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                textSubSection === sec.id
                  ? 'bg-[#0D7287] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Tìm kiếm nội dung hoặc key..."
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-full sm:w-48"
        />

        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-1.5 bg-[#0D7287] hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Lưu Văn Bản
        </button>
      </div>

      {/* Text Inputs List */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {filteredTextKeys.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Không tìm thấy đoạn văn bản nào khớp với bộ lọc.
          </div>
        ) : (
          filteredTextKeys.map((item) => {
            const fallbackText = (translations[textLang] as Record<string, string>)?.[item.key] ?? '';
            const val = textsForm[textLang]?.[item.key] ?? fallbackText;
            const isLongText = val.length > 80;

            return (
              <div
                key={`${item.key}-${textLang}`}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-cyan-300 dark:hover:border-cyan-800 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-mono text-[10px] font-bold">
                      {item.key}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      • {item.sectionLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {val.length} ký tự
                  </span>
                </div>

                {isLongText ? (
                  <textarea
                    rows={3}
                    value={val}
                    onChange={(e) => {
                      setTextsForm({
                        ...textsForm,
                        [textLang]: {
                          ...textsForm[textLang],
                          [item.key]: e.target.value,
                        },
                      });
                    }}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-cyan-500 font-lora"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      setTextsForm({
                        ...textsForm,
                        [textLang]: {
                          ...textsForm[textLang],
                          [item.key]: e.target.value,
                        },
                      });
                    }}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
