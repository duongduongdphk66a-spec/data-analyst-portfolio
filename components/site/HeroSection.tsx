"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Mail } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { usePortfolioData } from "@/app/context/PortfolioDataContext";
import { DEFAULT_PROFILE } from "@/app/defaultData";
import type { ProfileData } from "@/app/types";

type L = { vi: string; en: string };

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7287]";

const TOOLS: L[] = [
  { vi: "SQL", en: "SQL" },
  { vi: "Python (pandas, SciPy)", en: "Python (pandas, SciPy)" },
  { vi: "Kiểm định thống kê", en: "Statistical testing" },
  { vi: "Trực quan hóa dữ liệu", en: "Data visualisation" },
];

const FLAGSHIP_STATS: { value: string; label: L }[] = [
  {
    value: "84,5%",
    label: {
      vi: "doanh thu livestream đến từ Live chính chủ và kênh vệ tinh",
      en: "of live revenue came from the official and satellite livestreams",
    },
  },
  {
    value: "329/6.086",
    label: {
      vi: "creator trong danh sách affiliate có phát sinh doanh thu (5,4%)",
      en: "creators in the affiliate list generated revenue (5.4%)",
    },
  },
  {
    value: "12/133",
    label: {
      vi: "mã có đơn (trên tổng 339 SKU) đóng góp 80,6% GMV kỳ gần nhất",
      en: "converting SKUs (of 339 catalog SKUs) drove 80.6% of recent GMV",
    },
  },
];

const OTHER_WORK: { href: string; tag: L; title: L; body: L }[] = [
  {
    href: "/projects/proj-heritage-japan",
    tag: { vi: "Phân tích chuỗi thời gian", en: "Time-series analysis" },
    title: { vi: "Du lịch di sản Nhật Bản", en: "Heritage tourism in Japan" },
    body: {
      vi: "Dữ liệu JNTO và MLIT: đỉnh 31,9 triệu khách quốc tế năm 2019 và chi tiêu đỉnh 4,81 nghìn tỷ Yên.",
      en: "JNTO and MLIT data: a peak of 31.9M international visitors in 2019 and peak spending of 4.81T yen.",
    },
  },
  {
    href: "/projects/proj-library-bus",
    tag: { vi: "Phân tích nghiệp vụ và UX", en: "Business analysis and UX" },
    title: { vi: "Library Bus", en: "Library Bus" },
    body: {
      vi: "Đặc tả nghiệp vụ (BA), thiết kế UX/UI và kiến trúc dữ liệu cho website thư viện lưu động: sitemap, luồng người dùng, quy tắc BR và 11 cặp màn hình cốt lõi (Desktop & Mobile).",
      en: "BA specification, UX/UI design, and data architecture for a mobile library website: sitemap, user flows, business rules, and 11 core screen pairs (Desktop & Mobile).",
    },
  },
];

const MORE_LINKS: { href: string; label: L }[] = [
  { href: "/about", label: { vi: "Giới thiệu", en: "About" } },
  { href: "/experience", label: { vi: "Kinh nghiệm", en: "Experience" } },
  { href: "/blog", label: { vi: "Bài viết", en: "Blog" } },
];

export default function HeroSection({
  profile: propsProfile,
}: {
  profile?: Partial<ProfileData> | null;
} = {}) {
  const { language } = useLanguage();
  const isVi = language !== "en";
  const t = (l: L) => (isVi ? l.vi : l.en);
  const { profile: contextProfile } = usePortfolioData();
  const profile = propsProfile || contextProfile;

  const rawName =
    typeof profile?.name === "string" && profile.name.trim()
      ? profile.name.trim()
      : DEFAULT_PROFILE.name;
  const name = rawName.replace(/^Mã\s+/i, "Ma ");
  const email =
    typeof profile?.email === "string" && profile.email.trim()
      ? profile.email.trim()
      : DEFAULT_PROFILE.email || "";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-14 md:space-y-20">
      {/* 1. Hero */}
      <section className="space-y-6">
        <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span>{isVi ? "Xin chào, mình là" : "Hi, I am"}</span>
          <span className="font-extrabold text-slate-900 dark:text-white">{name}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE485]/60 dark:bg-[#FFE485]/15 text-[#5C2808] dark:text-[#FFE485] font-bold text-xs sm:text-sm border border-[#FFD14C]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" aria-hidden="true" />
            {"Fresher Data Analyst / Business Analyst"}
          </span>
        </p>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] max-w-3xl">
          {isVi
            ? "Phân tích dữ liệu bán hàng và chuỗi thời gian, từ câu hỏi đến khuyến nghị."
            : "Analysing sales and time-series data, from question to recommendation."}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          {isVi
            ? "Mình là cử nhân Nhật Bản học chuyển sang phân tích dữ liệu, đang tìm vị trí Fresher Data Analyst hoặc Business Analyst. Dự án chính là phân tích 231 ngày dữ liệu TikTok Shop bằng SQL, Python và kiểm định thống kê."
            : "I am a Japanese Studies graduate who moved into data analysis, and I am looking for a Fresher Data Analyst or Business Analyst role. My main project analyses 231 days of TikTok Shop data with SQL, Python and statistical testing."}
        </p>

        <div className="flex flex-wrap items-center gap-3.5 pt-1">
          <Link
            href="/projects/proj-kami-ely"
            className={`min-h-[44px] px-6 py-3 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-bold text-sm transition-colors inline-flex items-center gap-2 border border-[#9BE7FA] cursor-pointer ${FOCUS}`}
          >
            {isVi ? "Xem dự án Kami Ely" : "See the Kami Ely project"}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`min-h-[44px] px-6 py-3 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors inline-flex items-center gap-2 cursor-pointer ${FOCUS}`}
          >
            <FileText className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            {isVi ? "Tải CV (PDF)" : "Download CV"}
          </a>
          {email && (
            <a
              href={`mailto:${email}`}
              className={`min-h-[44px] px-3 py-3 inline-flex items-center gap-2 text-sm font-semibold text-[#074553] dark:text-[#9BE7FA] hover:underline cursor-pointer ${FOCUS}`}
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              {isVi ? "Gửi email" : "Email me"}
            </a>
          )}
        </div>

        <ul className="flex flex-wrap gap-2 pt-1" aria-label={isVi ? "Công cụ" : "Tools"}>
          {TOOLS.map((tool) => (
            <li
              key={tool.en}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F0F9FB] dark:bg-slate-900 text-[#074553] dark:text-[#C8EEF7] border border-[#C8EEF7] dark:border-slate-800"
            >
              {t(tool)}
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Flagship project */}
      <section aria-labelledby="flagship-title" className="space-y-5">
        <h2
          id="flagship-title"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
        >
          {isVi ? "Dự án chính: Kami Ely" : "Main project: Kami Ely"}
        </h2>

        <div className="rounded-3xl bg-[#F0F9FB] dark:bg-slate-900/70 border border-[#C8EEF7] dark:border-slate-800 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="text-xl sm:text-2xl font-bold leading-snug text-slate-900 dark:text-white">
              {isVi
                ? "Kênh nào tạo ra doanh thu TikTok Shop?"
                : "Which channels drive TikTok Shop revenue?"}
            </h3>
            <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {isVi
                ? "Doanh thu tháng 8 giảm 83,1% so với đỉnh tháng 6. Mình phân tích 231 ngày dữ liệu để biết gian hàng đang phụ thuộc vào kênh nào, và danh mục thu đông có thay thế được không."
                : "August revenue fell 83.1% from the June peak. I analysed 231 days of data to see which channels the shop relied on, and whether the autumn range could replace them."}
            </p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {isVi
                ? "Dữ liệu ước tính từ FastMoss (ảnh chụp tháng 9, file xuất đến 25/10/2026), không phải dữ liệu nội bộ."
                : "Estimated FastMoss data (Sep screenshots, exports through Oct 25, 2026), not internal company data."}
            </p>
            <Link
              href="/projects/proj-kami-ely"
              className={`mt-auto pt-6 self-start inline-flex items-center gap-1 min-h-[44px] text-sm font-bold text-[#074553] dark:text-[#9BE7FA] hover:underline ${FOCUS}`}
            >
              {isVi ? "Xem phân tích & Thư viện SQL" : "Open case study & SQL library"}
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>

          <dl className="lg:col-span-6 space-y-4">
            {FLAGSHIP_STATS.map((s) => (
              <div
                key={s.value}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 px-5 py-4"
              >
                <dt className="text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white shrink-0 sm:min-w-[9.5rem]">
                  {s.value}
                </dt>
                <dd className="text-sm sm:text-[15px] leading-snug text-slate-600 dark:text-slate-300">
                  {t(s.label)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Other work */}
      <section aria-labelledby="other-title" className="space-y-5">
        <h2
          id="other-title"
          className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white"
        >
          {isVi ? "Nghiên cứu và dự án khác" : "More research and projects"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {OTHER_WORK.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA] p-6 transition-colors cursor-pointer ${FOCUS}`}
            >
              <span className="self-start text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA]">
                {t(item.tag)}
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                {t(item.title)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t(item.body)}
              </p>
              <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-bold text-[#074553] dark:text-[#9BE7FA]">
                {isVi ? "Xem dự án" : "Open the project"}
                <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform motion-reduce:transition-none" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <nav
          aria-label={isVi ? "Trang khác" : "Other pages"}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm"
        >
          <span className="text-slate-500 dark:text-slate-400">
            {isVi ? "Xem thêm" : "More"}
          </span>
          {MORE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`min-h-[44px] inline-flex items-center font-bold text-[#074553] dark:text-[#9BE7FA] hover:underline ${FOCUS}`}
            >
              {t(l.label)}
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
