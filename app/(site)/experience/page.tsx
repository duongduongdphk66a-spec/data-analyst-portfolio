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
        meta: { vi: "Full-time · Hà Nội, Việt Nam", en: "Full-time · Hanoi, Vietnam" },
        role: {
          vi: "Nhân viên Hỗ trợ Vận hành & Báo cáo Dữ liệu E-Commerce",
          en: "E-Commerce Operations & Data Reporting Staff",
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
            vi: "Kiểm toán 5 sai lệch nguồn niên luận và làm sạch 6 bộ dữ liệu chuỗi thời gian 20 năm (2003–2022) từ MLIT và JNTO.",
            en: "Audited 5 thesis source errors and standardized 6 20-year time-series datasets (2003–2022) from MLIT and JNTO.",
          },
          {
            vi: "Phân tích lượng khách và chất lượng chi tiêu: đỉnh 31,9 triệu khách (2019), chi tiêu quốc tế 4,81 nghìn tỷ Yên (~0,86% GDP, tách khỏi toàn ngành 7,5% GDP WTTC), trong khi chi tiêu/khách giảm -14,6% giai đoạn 2015–2019.",
            en: "Analysed visitor volume and spending quality: 31.9M peak arrivals (2019), 4.81T JPY inbound spend (~0.86% GDP, separate from WTTC 7.5% total sector GDP), while per-visitor spend eroded -14.6% from 2015 to 2019.",
          },
          {
            vi: "Hoàn thành niên luận về du lịch di sản Nhật Bản giai đoạn 2013–2022 (GVHD: TS Võ Minh Vũ).",
            en: "Completed a quantitative thesis on heritage tourism in Japan covering 2013–2022 (advisor: Dr. Võ Minh Vũ).",
          },
        ],
        tools: [
          { vi: "Python", en: "Python" },
          { vi: "SQL Data Audit", en: "SQL Data Audit" },
          { vi: "Chuỗi thời gian", en: "Time series" },
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
          vi: "Mini-BRD • ERD 7 bảng • Tracking Plan • 171 Tests",
          en: "Mini-BRD • 7-Entity ERD • Tracking Plan • 171 Tests",
        },
        role: {
          vi: "Phân tích nghiệp vụ (Technical BA), Mô hình dữ liệu & Tracking Plan",
          en: "Technical Business Analysis, Core Data Modeling & Tracking Plan",
        },
        org: { vi: "Library Bus", en: "Library Bus" },
        bullets: [
          {
            vi: "Đặc tả vận hành xe lưu động (gồm ràng buộc offline 4G, trả chéo tuyến, hủy chuyến) thành Mini-BRD, bảng As-Is/To-Be, 5 Stakeholder, MoSCoW, 5 User Stories và BR-01..04 (chống trùng sách cuối, giữ chỗ 7 ngày từ lúc sách về trạm, phạt 3 bậc trần 100% giá sách).",
            en: "Specified mobile library operations (including offline 4G, cross-bus returns, and trip cancellations) into a Mini-BRD, As-Is/To-Be map, 5 stakeholders, MoSCoW, 5 User Stories, and BR-01..04 (last-copy locking, stop-aligned 7d holds, replacement-capped fines).",
          },
          {
            vi: "Chuẩn hóa ERD lõi 7 bảng (BookTitle/BusBookInventory), Tracking Plan 8 sự kiện, khung quyết định Pilot 4 tuần (2 tuyến) và 11 cặp màn hình Wireframe/UI; kiểm chứng bằng bản mẫu Django 5.2 / MySQL 8.0 (171 unit tests).",
            en: "Normalized a 7-entity core ERD (BookTitle/BusBookInventory), 8-event Tracking Plan, 4-week 2-route pilot criteria, and 11 paired Wireframe/UI flows; validated via a Django 5.2 / MySQL 8.0 prototype (171 unit tests).",
          },
        ],
        tools: [
          { vi: "Mini-BRD & MoSCoW", en: "Mini-BRD & MoSCoW" },
          { vi: "Core ERD & Tracking Plan", en: "Core ERD & Tracking Plan" },
          { vi: "SQL • Wireframe/UI", en: "SQL • Wireframe/UI" },
          { vi: "Prototype (Django / MySQL)", en: "Prototype (Django / MySQL)" },
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
          vi: "Phân tích hiệu suất TikTok Shop, mạng lưới Affiliate & Đặc tả BI",
          en: "TikTok Shop, Affiliate Network Analysis & BI Spec",
        },
        org: { vi: "Kami Ely", en: "Kami Ely" },
        bullets: [
          {
            vi: "Chuẩn hóa 10 bảng dữ liệu ước tính FastMoss (15,01 tỷ đ GMV, 101.896 sản phẩm), phát hiện và loại trừ +7,59 tỷ đ trùng nguồn giữa CrLive và AffLive, kèm Đặc tả BI (4 Fact · 3 Dim · DAX).",
            en: "Standardised 10 estimated FastMoss tables (VND 15.01B GMV, 101,896 units), caught and removed +7.59B VND cross-file overlap between CrLive and AffLive, paired with a 4-Fact · 3-Dim DAX BI Spec.",
          },
          {
            vi: "Kiểm định Panel FE cửa sổ hoạt động sau mở bán (n = 1.422, Within R² = 0,302), phát hiện Nghịch lý Simpson ở Live >10h (tụt từ 8,48 về 0,73 Tr/h giữa T6→T8) và Video Ads GPM thấp hơn Organic (0,84×).",
            en: "Ran post-launch active-window Panel FE (n = 1,422, Within R² = 0.302), uncovered Simpson’s Paradox in >10h Live (8.48 to 0.73M/hr Jun→Aug), and showed Video Ads trailed Organic GPM (0.84x).",
          },
          {
            vi: "Đề xuất bộ lọc KOC 2 tầng bảo toàn 51 creator nổ đơn muộn từ phiên thứ 4+ (304,9 Tr = 18,8% GMV Live ngoài) thay vì cắt cứng sau 3 phiên.",
            en: "Designed a 2-tier KOC screening rule protecting 51 late-converting creators from session 4+ (304.9M = 18.8% external Live GMV) instead of a hard 3-session cutoff.",
          },
        ],
        tools: [
          { vi: "SQL (MySQL 8.0)", en: "SQL (MySQL 8.0)" },
          { vi: "Python (SciPy)", en: "Python (SciPy)" },
          { vi: "Panel FE & Stats", en: "Panel FE & Stats" },
          { vi: "BI Spec (Star Schema)", en: "BI Spec (Star Schema)" },
        ],
        link: {
          label: { vi: "Xem dự án & Thư viện SQL", en: "Open case study & SQL library" },
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
              ? "Xem hệ thống truy vấn SQL, sổ tay kiểm định Python, Đặc tả BI và biểu đồ tương tác trong dự án Kami Ely."
              : "Inspect the SQL queries, Python statistical notebook, BI Spec, and interactive charts in the Kami Ely case study."}
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
