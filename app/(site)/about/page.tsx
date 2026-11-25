"use client";

import React, { useState } from "react";
import AboutSection from "@/components/site/AboutSection";
import AboutSqlChart from "@/components/case-studies/charts/AboutSqlChart";
import { useLanguage } from "@/app/context/LanguageContext";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";

export default function AboutPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [showSqlFramework, setShowSqlFramework] = useState(false);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <AboutSection />

      <section className="mt-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSqlFramework((v) => !v)}
          aria-expanded={showSqlFramework}
          className="w-full min-h-[60px] p-6 sm:px-8 flex items-center justify-between gap-4 text-left hover:bg-[#F0F9FB]/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">
              <Terminal className="w-4 h-4 text-amber-500 dark:text-[#FFD14C]" />
              <span>
                {isVi
                  ? "Phụ lục phương pháp luận (Nhấp để mở rộng)"
                  : "Technical methodology appendix (Click to expand)"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isVi
                ? "Khung Phân tích 8 Giai đoạn (SQL for Data Analysis)"
                : "The 8-Stage Analytical Framework (SQL for Data Analysis)"}
            </h2>
          </div>
          {showSqlFramework ? (
            <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
          )}
        </button>

        {showSqlFramework && (
          <div className="p-6 sm:p-8 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mb-6">
              {isVi
                ? "Quy trình chuẩn hóa 8 bước từ kiểm toán khóa, làm sạch bảng, phân tích chuỗi thời gian đến đối soát đa nguồn:"
                : "Standard 8-step workflow from schema profiling and data cleaning to time-series windowing and cross-source reconciliation:"}
            </p>
            <AboutSqlChart />
          </div>
        )}
      </section>
    </main>
  );
}
