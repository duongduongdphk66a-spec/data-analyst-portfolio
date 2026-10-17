"use client";

import React from "react";
import AboutSection from "@/components/site/AboutSection";
import AboutSqlChart from "@/components/case-studies/charts/AboutSqlChart";
import { useLanguage } from "@/app/context/LanguageContext";
import { Terminal } from "lucide-react";

export default function AboutPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <AboutSection />

      <section className="mt-8 rounded-3xl bg-white dark:bg-slate-900 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
          <Terminal className="w-4 h-4" />
          <span>
            {isVi
              ? "Phương pháp luận Kỹ thuật Đi kèm"
              : "Underlying Technical Methodology"}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {isVi
            ? "Khung Phân tích 8 Giai đoạn (SQL for Data Analysis)"
            : "The 8-Stage Analytical Framework (SQL for Data Analysis)"}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl mb-8">
          {isVi
            ? "Mọi dự án và bài viết phân tích trên trang /blog đều được triển khai dựa trên quy trình xử lý và kiểm định dữ liệu 8 bước dưới đây:"
            : "Every case study and technical blog write-up in this portfolio is engineered around this structured 8-stage analytical workflow:"}
        </p>

        <AboutSqlChart />
      </section>
    </main>
  );
}
