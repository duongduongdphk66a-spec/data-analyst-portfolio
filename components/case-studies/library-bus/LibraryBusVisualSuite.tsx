'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export interface LibraryBusVisualSuiteProps {
  isEn?: boolean;
}

export default function LibraryBusVisualSuite({ isEn: propIsEn }: LibraryBusVisualSuiteProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  return (
    <section className="w-full space-y-6">
      {/* BANNER MINH BẠCH DỮ LIỆU MÔ PHỎNG (SYNTHETIC SIMULATION DISCLOSURE) */}
      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              UI/UX DESIGN SYSTEM & SYNTHETIC TELEMETRY SIMULATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200">
            {lang === 'vi'
              ? 'Dự án tập trung vào Thiết kế Hệ thống Giao diện (UI/UX Design Tokens) & Kiến trúc Sản phẩm. Toàn bộ số liệu vận hành bên dưới được sinh tự động từ bộ kịch bản mô phỏng Python (seed_books.py, seed_routes.py, generate_test_data.py & test_race_condition.py).'
              : 'Focused on UI/UX Design Systems & Product Architecture. All operational metrics below are generated via synthetic Python simulation scripts (seed_books.py, seed_routes.py, generate_test_data.py & test_race_condition.py).'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            6 Modules • 42 UI Templates • 30 Graph Nodes
          </span>
        </div>
      </div>
    </section>
  );
}

export { LibraryBusVisualSuite };
