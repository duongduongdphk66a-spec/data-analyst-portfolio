"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

type L = { vi: string; en: string };

interface Entry {
  id: string;
  period: L;
  meta?: L;
  role: L;
  org: L;
  bullets: L[];
  tools?: L[];
  link?: { label: L; href: string };
}

interface Group {
  id: string;
  title: L;
  entries: Entry[];
}

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7287]";

const GROUPS: Group[] = [
  {
    id: "work",
    title: { vi: "Kinh nghiệm làm việc", en: "Work experience" },
    entries: [
      {
        id: "steve-kami",
        period: { vi: "2022 - 2023", en: "2022 - 2023" },
        meta: { vi: "Hà Nội, Việt Nam", en: "Hanoi, Vietnam" },
        role: {
          vi: "Hỗ trợ vận hành và báo cáo dữ liệu E-commerce",
          en: "E-commerce operations support and data reporting",
        },
        org: { vi: "Steve x Kami Company", en: "Steve x Kami Company" },
        bullets: [
          {
            vi: "Theo dõi đơn hàng hằng ngày, tỷ lệ giao thành công, tỷ lệ hoàn/hủy và biến động tồn kho theo mã SKU trên TikTok Shop.",
            en: "Tracked daily orders, delivery success rate, return/cancellation rate and SKU-level stock changes on TikTok Shop.",
          },
          {
            vi: "Tổng hợp báo cáo doanh số định kỳ bằng Excel và Google Sheets cho đội vận hành, so sánh kênh livestream nội bộ với cộng tác viên affiliate.",
            en: "Compiled recurring sales reports in Excel and Google Sheets for the operations team, comparing the in-house livestream channel with affiliate partners.",
          },
        ],
        tools: [
          { vi: "Excel", en: "Excel" },
          { vi: "Google Sheets", en: "Google Sheets" },
          { vi: "TikTok Seller Center", en: "TikTok Seller Center" },
        ],
      },
    ],
  },
  {
    id: "research",
    title: { vi: "Nghiên cứu và dự án", en: "Research and projects" },
    entries: [
      {
        id: "heritage-japan",
        period: { vi: "2023 - 2024", en: "2023 - 2024" },
        meta: {
          vi: "ĐHKHXH&NV - ĐHQGHN",
          en: "VNU University of Social Sciences and Humanities",
        },
        role: {
          vi: "Nghiên cứu khoa học: du lịch di sản tại Nhật Bản",
          en: "Research: heritage tourism in Japan",
        },
        org: { vi: "Niên luận định lượng", en: "Quantitative thesis" },
        bullets: [
          {
            vi: "Thu thập và làm sạch 6 bộ dữ liệu chuỗi thời gian từ MLIT và JNTO.",
            en: "Collected and cleaned 6 time-series datasets from MLIT and JNTO.",
          },
          {
            vi: "Phân tích lượng khách quốc tế và chi tiêu du lịch: đỉnh 31,9 triệu khách (2019) và 4,81 nghìn tỷ Yên chi tiêu.",
            en: "Analysed international arrivals and tourism spending: a peak of 31.9M visitors (2019) and 4.81T yen in spending.",
          },
          {
            vi: "Hoàn thành niên luận về sự phát triển du lịch di sản Nhật Bản (GVHD: TS Võ Minh Vũ).",
            en: "Completed a thesis on the growth of heritage tourism in Japan (advisor: Dr. Võ Minh Vũ).",
          },
        ],
        tools: [
          { vi: "Python", en: "Python" },
          { vi: "Chuỗi thời gian", en: "Time series" },
          { vi: "Trực quan hóa dữ liệu", en: "Data visualisation" },
        ],
        link: {
          label: { vi: "Đọc nghiên cứu", en: "Read the study" },
          href: "/projects/proj-heritage-japan",
        },
      },
      {
        id: "library-bus",
        period: { vi: "2023 - 2024", en: "2023 - 2024" },
        meta: {
          vi: "Dữ liệu trong giao diện là dữ liệu hạt giống kiểm thử",
          en: "Data shown in the interface is seeded prototype data",
        },
        role: {
          vi: "Phân tích nghiệp vụ (BA), Thiết kế UX/UI & Kiến trúc hệ thống thư viện lưu động",
          en: "BA Specification, UX/UI Design & System Architecture for Mobile Library",
        },
        org: { vi: "Library Bus", en: "Library Bus" },
        bullets: [
          {
            vi: "Đặc tả quy tắc nghiệp vụ (BR-01..04), xây dựng sitemap và luồng người dùng cho dịch vụ xe thư viện lưu động.",
            en: "Specified business rules (BR-01..04) and built the sitemap and user flows for a mobile library service.",
          },
          {
            vi: "Thiết kế hệ thống lưới 12 cột, bộ thành phần giao diện và đối chiếu 11 cặp màn hình cốt lõi (Wireframe & UI cho cả Desktop 1440px và Mobile 390px).",
            en: "Designed a 12-column grid, UI component set, and 11 core paired screens (Wireframe & UI across Desktop 1440px and Mobile 390px).",
          },
        ],
        tools: [
          { vi: "Phân tích nghiệp vụ (BA)", en: "Business Analysis (BA)" },
          { vi: "Wireframe & UI", en: "Wireframe & UI" },
          { vi: "PostgreSQL & Django", en: "PostgreSQL & Django" },
        ],
        link: {
          label: { vi: "Xem dự án", en: "Open the project" },
          href: "/projects/proj-library-bus",
        },
      },
      {
        id: "kami-ely",
        period: { vi: "Dữ liệu 03/2026 - 10/2026", en: "Data 03/2026 - 10/2026" },
        meta: {
          vi: "231 ngày dữ liệu ước tính từ FastMoss",
          en: "231 days of estimated FastMoss data",
        },
        role: {
          vi: "Phân tích hiệu suất TikTok Shop và mạng lưới affiliate",
          en: "TikTok Shop and affiliate network analysis",
        },
        org: { vi: "Kami Ely", en: "Kami Ely" },
        bullets: [
          {
            vi: "Chuẩn hóa 10 bảng dữ liệu ước tính FastMoss (15,01 tỷ đ GMV, 101.896 sản phẩm) và đối soát giữa các nguồn để mỗi con số truy được về nguồn.",
            en: "Standardised 10 estimated FastMoss tables (VND 15.01B GMV, 101,896 units) and reconciled figures across sources so each number traces back to its source.",
          },
          {
            vi: "Chỉ 329/6.086 creator trong danh sách affiliate phát sinh doanh thu (5,4%); kênh chính chủ chiếm 60,1% doanh thu bảng affiliate KOL.",
            en: "Only 329 of 6,086 creators in the affiliate list generated revenue (5.4%); the official channel drove 60.1% of affiliate KOL revenue.",
          },
          {
            vi: "Live chính chủ và kênh vệ tinh tạo 84,5% doanh thu livestream; 12/133 mã có đơn (trên tổng 339 SKU) tạo 80,6% GMV.",
            en: "Official and satellite livestreams drove 84.5% of live GMV; 12 of 133 converting SKUs (of 339 catalog SKUs) drove 80.6% of GMV.",
          },
        ],
        tools: [
          { vi: "SQL", en: "SQL" },
          { vi: "Python (SciPy)", en: "Python (SciPy)" },
          { vi: "Hồi quy OLS", en: "OLS regression" },
          { vi: "Đối soát dữ liệu", en: "Data reconciliation" },
        ],
        link: {
          label: { vi: "Xem dự án và SQL Lab", en: "Open the project and SQL Lab" },
          href: "/projects/proj-kami-ely",
        },
      },
    ],
  },
  {
    id: "education",
    title: { vi: "Học vấn", en: "Education" },
    entries: [
      {
        id: "degree",
        period: { vi: "2021 - 2025", en: "2021 - 2025" },
        meta: { vi: "Hà Nội, Việt Nam", en: "Hanoi, Vietnam" },
        role: {
          vi: "Cử nhân Nhật Bản học, Khoa Đông Phương học",
          en: "B.A. in Japanese Studies, Faculty of Oriental Studies",
        },
        org: {
          vi: "Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN",
          en: "VNU University of Social Sciences and Humanities",
        },
        bullets: [
          {
            vi: "Trọng tâm: kinh tế - xã hội Nhật Bản và phương pháp nghiên cứu định lượng.",
            en: "Focus: Japanese economy and society, and quantitative research methods.",
          },
        ],
      },
    ],
  },
];

export default function ExperiencePage() {
  const { language } = useLanguage();
  const isVi = language !== "en";
  const t = (l: L) => (isVi ? l.vi : l.en);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-12 md:space-y-16">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {isVi ? "Kinh nghiệm" : "Experience"}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {isVi
              ? "Công việc, nghiên cứu và các dự án phân tích. Dự án nào dùng dữ liệu ước tính hoặc dữ liệu mẫu đều được ghi rõ."
              : "Work, research and analysis projects. Any project that uses estimated or sample data says so."}
          </p>
        </div>
        <a
          href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`min-h-[44px] shrink-0 self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-bold text-sm transition-colors border border-[#9BE7FA] ${FOCUS}`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          {isVi ? "Tải CV (PDF)" : "Download CV"}
        </a>
      </header>

      {GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`${group.id}-title`} className="space-y-4">
          <h2
            id={`${group.id}-title`}
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white"
          >
            {t(group.title)}
          </h2>

          <div className="border-y border-[#C8EEF7] dark:border-slate-800 divide-y divide-[#C8EEF7] dark:divide-slate-800">
            {group.entries.map((entry) => (
              <article
                key={entry.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-7"
              >
                <div className="md:col-span-3">
                  <p className="text-sm font-bold tabular-nums text-[#074553] dark:text-[#9BE7FA]">
                    {t(entry.period)}
                  </p>
                  {entry.meta && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t(entry.meta)}
                    </p>
                  )}
                </div>

                <div className="md:col-span-9 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {t(entry.role)}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {t(entry.org)}
                    </p>
                  </div>

                  <ul className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                    {entry.bullets.map((b) => (
                      <li key={b.en} className="flex items-start gap-2.5">
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#FFD14C] shrink-0" />
                        <span>{t(b)}</span>
                      </li>
                    ))}
                  </ul>

                  {(entry.tools || entry.link) && (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                      {entry.tools && (
                        <ul className="flex flex-wrap gap-1.5">
                          {entry.tools.map((tool) => (
                            <li
                              key={tool.en}
                              className="px-2.5 py-1 rounded-lg bg-[#F8FCFD] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                            >
                              {t(tool)}
                            </li>
                          ))}
                        </ul>
                      )}
                      {entry.link && (
                        <Link
                          href={entry.link.href}
                          className={`inline-flex items-center gap-1 text-sm font-bold text-[#074553] dark:text-[#9BE7FA] hover:underline ${FOCUS}`}
                        >
                          {t(entry.link.label)}
                          <ArrowUpRight className="w-4 h-4 shrink-0" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isVi ? "Muốn xem cách mình phân tích?" : "Want to see how I analyse data?"}
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isVi
              ? "Chạy thử truy vấn trong SQL Lab của dự án Kami Ely và xem biểu đồ đi kèm."
              : "Run queries in the Kami Ely SQL Lab and see the charts that go with them."}
          </p>
        </div>
        <Link
          href="/projects/proj-kami-ely"
          className={`min-h-[44px] shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-bold text-sm whitespace-nowrap transition-colors ${FOCUS}`}
        >
          {isVi ? "Mở dự án Kami Ely" : "Open the Kami Ely project"}
          <ArrowUpRight className="w-4 h-4 shrink-0" />
        </Link>
      </section>
    </main>
  );
}
