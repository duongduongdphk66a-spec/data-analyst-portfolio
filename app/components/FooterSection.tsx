'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FooterSection() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink dark:bg-slate-950 py-10 border-t border-transparent dark:border-slate-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-ground/90 dark:text-slate-200">
              MVH<span className="text-accent dark:text-amber-400">.</span>
            </span>
            <span className="text-xs text-ground/40 dark:text-slate-500 font-heading">
              &copy; {year} Ma Văn Hùng
            </span>
          </div>

          <p className="text-xs text-ground/40 dark:text-slate-500 font-heading text-center sm:text-right">
            {isEn
              ? 'Data Analyst Portfolio. Built with Next.js, Recharts & TypeScript.'
              : 'Data Analyst Portfolio. Xây dựng với Next.js, Recharts & TypeScript.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
