'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Zap, Target, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface ProjectCardData {
  id: string;
  title: string | { vi: string; en: string };
  titleEn?: string;
  category?: string | { vi: string; en: string };
  description?: string | { vi: string; en: string };
  descEn?: string;
  impact?: string | { vi: string; en: string };
  tech?: string[];
  tags?: string[];
  image?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
}

export interface ProjectCardItemProps {
  project: ProjectCardData;
  index?: number;
}

interface RecruiterPitchTelemetry {
  domainBadge: { vi: string; en: string };
  badgeStyle: string;
  readTimeTag: { vi: string; en: string };
  oneLinePitch: { vi: string; en: string };
  paradoxHookTitle: { vi: string; en: string };
  paradoxHookBody: { vi: string; en: string };
  roiHighlight: { vi: string; en: string };
  kpis: { label: { vi: string; en: string }; value: string }[];
  miniBars: { label: { vi: string; en: string }; textValue: string; pct: number; color: string }[];
  curiosityCta: { vi: string; en: string };
  secondaryAction?: { label: { vi: string; en: string }; href: string; external?: boolean };
}

const PROJECT_PITCH_MAP: Record<string, RecruiterPitchTelemetry> = {
  'kami-ely': {
    domainBadge: {
      vi: 'E-Commerce Analytics · SQL & Python',
      en: 'E-Commerce Analytics · SQL & Python',
    },
    badgeStyle:
      'bg-[#C8EEF7]/45 text-[#074553] border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700',
    readTimeTag: {
      vi: 'Tóm tắt 30s • Đọc sâu 4 phút',
      en: '30s Pitch • 4-Min Read',
    },
    oneLinePitch: {
      vi: 'Đánh giá thực nghiệm 231 ngày vận hành (15,01 tỷ VNĐ, 101.896 sản phẩm) từ 10 bảng dữ liệu ước tính FastMoss để giải mã cơ cấu nguồn thu theo kênh, cú rơi mùa vụ -83,1% và sức bền mạng lưới KOC.',
      en: 'Empirical 231-day study (15.01B VND, 101,896 units) across 10 FastMoss tables dissecting channel attribution, post-summer -83.1% contraction, and KOC cohort retention.',
    },
    paradoxHookTitle: {
      vi: 'Phát hiện thực nghiệm từ dữ liệu 231 ngày:',
      en: 'Empirical Discovery Across 231 Operating Days:',
    },
    paradoxHookBody: {
      vi: '301 KOC độc lập phát tới 89,8% số phiên Live nhưng chỉ đem về 15,5% doanh thu Live; ngược lại đội ngũ in-house (kênh chính chủ + vệ tinh @koc_sat01) tạo ra tới 84,5% dòng tiền Live, trong khi chỉ 12/339 SKU gánh 80,6% GMV.',
      en: '301 independent KOCs ran 89.8% of Live sessions for just 15.5% of Live GMV, whereas in-house rooms (official + @koc_sat01) generated 84.5% of Live revenue and 12/339 SKUs drove 80.6% of catalog GMV.',
    },
    roiHighlight: {
      vi: 'Kiểm định: Hồi quy OLS (R² = 0,446) • Winsorize giao cắt 26/06 • HHI giảm 3.230 -> 2.152',
      en: 'Verified: Daily OLS (R² = 0.446) • Winsorized 26/06 crossover • HHI eased 3,230 -> 2,152',
    },
    kpis: [
      { label: { vi: 'GMV ước tính 231N', en: '231d Est. GMV' }, value: '15,01 tỷ đ' },
      { label: { vi: 'Đơn giá ASP', en: 'Store ASP' }, value: '147.300 đ/sp' },
      { label: { vi: 'Tỷ trọng In-house', en: 'In-house Live' }, value: '84,5% Live' },
    ],
    miniBars: [
      {
        label: { vi: 'Live chính chủ (595 phiên • GPM 2.142k)', en: 'Official Live (595 sessions • 2,142k GPM)' },
        textValue: '72,5% Live (7,59 tỷ)',
        pct: 72.5,
        color: 'bg-[#9BE7FA]',
      },
      {
        label: { vi: '301 KOC độc lập (7.499 phiên • HHI 761)', en: '301 Independent KOCs (7,499 sessions)' },
        textValue: '15,5% Live (1,62 tỷ)',
        pct: 15.5,
        color: 'bg-[#FFE485]',
      },
      {
        label: { vi: 'Kênh vệ tinh @koc_sat01 (261 phiên)', en: 'Satellite @koc_sat01 (261 sessions)' },
        textValue: '12,0% Live (1,26 tỷ)',
        pct: 12.0,
        color: 'bg-[#FFD14C]',
      },
    ],
    curiosityCta: {
      vi: 'Xem báo cáo phân tích 7 chương & Phụ lục SQL',
      en: 'Read 7-Chapter Case Study & SQL Appendix',
    },
  },
  'library-bus': {
    domainBadge: {
      vi: 'UX/UI Design System & Research',
      en: 'UX/UI Design System & Research',
    },
    badgeStyle:
      'bg-[#C8EEF7]/45 text-[#074553] border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700',
    readTimeTag: {
      vi: '3 Chương • 20 Cặp Màn Hình',
      en: '3 Chapters • 20 Screen Pairs',
    },
    oneLinePitch: {
      vi: 'Thiết kế hệ thống UX/UI cho website dịch vụ xe thư viện lưu động: nghiên cứu thị trường, nhận diện thương hiệu, hệ thống lưới 12 cột và 20 màn hình desktop kèm bản mobile.',
      en: 'Designed an UX/UI system for a mobile library service website: market research, brand identity, 12-column grid, and 20 desktop screens plus mobile.',
    },
    paradoxHookTitle: {
      vi: 'Rào cản tiếp cận tri thức truyền thống:',
      en: 'The Core Accessibility Challenge:',
    },
    paradoxHookBody: {
      vi: 'Thư viện cố định khó tiếp cận người ở xa hoặc ít thời gian. Website xe thư viện lưu động giải quyết bài toán tra cứu sách theo vị trí xe, theo dõi lộ trình và đặt mượn trước khi xe đến trạm dừng.',
      en: 'Fixed libraries remain inaccessible for distant or busy patrons. The mobile bus library website solves book discovery by vehicle location, route tracking, and pre-arrival reservations.',
    },
    roiHighlight: {
      vi: 'Quy chuẩn: 20 Cặp Wireframe/UI • Lưới 12 Cột • Bảng màu 6 Tông (Neo-Bakery) • Typography Lora + Outfit',
      en: 'Standard: 20 Wireframe/UI Pairs • 12-Column Grid • 6-Tone Neo-Bakery Palette • Lora + Outfit Typography',
    },
    kpis: [
      { label: { vi: 'Màn Hình Desktop', en: 'Desktop Screens' }, value: '20 Màn hình' },
      { label: { vi: 'Bản Mobile Đồng Bộ', en: 'Mobile Versions' }, value: '20 Bản mobile' },
      { label: { vi: 'Bảng Màu & Phông', en: 'Color & Typography' }, value: '6 Tông • 2 Phông' },
    ],
    miniBars: [
      {
        label: { vi: 'Màn hình Desktop đối chiếu Wireframe vs UI', en: 'Desktop Wireframe vs UI Comparison' },
        textValue: '20 Màn hình',
        pct: 100,
        color: 'bg-[#9BE7FA]',
      },
      {
        label: { vi: 'Bản Mobile bố cục một cột đồng bộ', en: 'Mobile Single-Column Layouts' },
        textValue: '20 Bản mobile',
        pct: 100,
        color: 'bg-[#C8EEF7]',
      },
      {
        label: { vi: 'Bảng màu Neo-Bakery & Cặp phông Lora/Outfit', en: 'Neo-Bakery Palette & Font Pairing' },
        textValue: '6 Tông màu • 2 Phông',
        pct: 100,
        color: 'bg-[#FFD14C]',
      },
    ],
    curiosityCta: {
      vi: 'Khám phá Đối chiếu 20 Màn hình Wireframe vs UI',
      en: 'Explore 20-Screen Wireframe vs UI Comparison',
    },
    secondaryAction: {
      label: { vi: 'Bản Trình Chiếu (30 Slide)', en: 'Presentation Deck (30 Slides)' },
      href: '/projects/library-bus/presentation',
      external: false,
    },
  },
  'heritage-japan': {
    domainBadge: {
      vi: 'Kinh tế lượng & Chính sách',
      en: 'Econometrics & Policy',
    },
    badgeStyle:
      'bg-[#FFE485]/35 text-amber-950 border-[#FFD14C]/50 dark:bg-slate-800 dark:text-[#FFE485] dark:border-slate-700',
    readTimeTag: {
      vi: 'Tóm tắt 30s • Mô hình OLS & DiD',
      en: '30s Pitch • OLS & DiD Models',
    },
    oneLinePitch: {
      vi: 'Kiểm định kinh tế lượng trên 14.509 di sản văn hóa cấp quốc gia tại Nhật Bản (2015-2025) để đo lường tác động kinh tế du lịch và hiệu quả của Luật Bảo tồn sửa đổi năm 2019.',
      en: 'Econometric evaluation of 14,509 national cultural properties in Japan (2015-2025) measuring tourism elasticity and the impact of the 2019 Law Reform.',
    },
    paradoxHookTitle: {
      vi: 'Nghịch lý Không gian & Ngân sách (Cực quá tải vs. Cực thiếu vốn):',
      en: 'The Spatial & Fiscal Paradox (Overtourism vs. Underfunding):',
    },
    paradoxHookBody: {
      vi: '41,8% Quốc bảo tập trung đặc tại vùng Kansai (Gini = 0,64) đẩy chỉ số quá tải du lịch tại Kyoto lên mức báo động 92/100; trong khi các tỉnh địa phương thiếu vốn phát triển vì 68% ngân sách quốc gia bị chôn vào trùng tu thụ động.',
      en: '41.8% of National Treasures cluster in Kansai (Gini = 0.64), pushing Kyoto overtourism to 92/100, while regional prefectures starve for growth capital as 68% of ACA budget is locked in passive repairs.',
    },
    roiHighlight: {
      vi: 'Tác động: Hồi quy R² = 0,84 (β = +0,72) • DiD tăng +24,6% dự án • Giảm tải Kyoto 92 → 54/100',
      en: 'Impact: OLS R² = 0.84 (β = +0.72) • DiD +24.6% Projects • Kyoto Load Cut 92 → 54/100',
    },
    kpis: [
      { label: { vi: 'Quy Mô Di Sản', en: 'Heritage Scale' }, value: '1.132 Quốc bảo' },
      { label: { vi: 'Độ Phù Hợp OLS', en: 'OLS Model Fit' }, value: 'R² = 0,84 (p<0,01)' },
      { label: { vi: 'Hiệu Ứng Luật 2019', en: '2019 Law DiD' }, value: '+24,6% Dự án' },
    ],
    miniBars: [
      {
        label: { vi: 'Mức độ giải thích doanh thu du lịch (R²)', en: 'Tourism Revenue Explained (R²)' },
        textValue: '84,0% (β = +0,72)',
        pct: 84,
        color: 'bg-[#FFD14C]',
      },
      {
        label: { vi: 'Tỷ trọng ngân sách trùng tu cơ bản (ACA)', en: 'ACA Basic Repair Budget Share' },
        textValue: '68,0% (141,2 Tỉ ¥)',
        pct: 68,
        color: 'bg-[#9BE7FA]',
      },
      {
        label: { vi: 'Tỷ trọng Quốc bảo tập trung tại Kansai', en: 'Kansai National Treasure Concentration' },
        textValue: '41,8% (Gini = 0,64)',
        pct: 41.8,
        color: 'bg-[#FFE485]',
      },
    ],
    curiosityCta: {
      vi: 'Xem Kiểm định Hồi quy & Simulator Giãn khách',
      en: 'Explore Regression Proofs & Policy Simulator',
    },
    secondaryAction: {
      label: { vi: 'Simulator Chính sách', en: 'Policy Simulator' },
      href: '/projects/proj-heritage-japan#policy-simulator',
    },
  },
};

export default function ProjectCardItem({ project }: ProjectCardItemProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const resolveText = (val?: string | { vi: string; en: string }, valEn?: string) => {
    if (lang === 'en' && valEn) return valEn;
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang];
  };

  const bareId = project.id.replace(/^proj-/, '');
  const canonicalRouteId = project.id.startsWith('proj-') ? project.id : `proj-${project.id}`;
  const pitch = PROJECT_PITCH_MAP[project.id] || PROJECT_PITCH_MAP[bareId] || PROJECT_PITCH_MAP['kami-ely'];
  const techList = project.tech || project.tags || ['SQL', 'Python', 'Power BI', 'Next.js'];

  return (
    <article className="group rounded-3xl border border-[#C8EEF7] dark:border-slate-800/90 bg-white dark:bg-slate-950/95 hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA]/60 transition-colors duration-200 flex flex-col justify-between p-5 sm:p-6 space-y-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${pitch.badgeStyle}`}>
            {pitch.domainBadge[lang]}
          </span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 inline-flex items-center gap-1 tabular-nums">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{pitch.readTimeTag[lang]}</span>
          </span>
        </div>

        <div className="space-y-1.5">
          <Link href={`/projects/${canonicalRouteId}`} className="block">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors leading-snug">
              {resolveText(project.title, project.titleEn)}
            </h2>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {pitch.oneLinePitch[lang]}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {pitch.kpis.map((kpi, idx) => (
            <div
              key={idx}
              title={`${kpi.label[lang]}: ${kpi.value}`}
              className="p-2 sm:p-2.5 rounded-xl bg-[#F8FCFD] dark:bg-slate-900/90 border border-[#C8EEF7] dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight line-clamp-2">
                {kpi.label[lang]}
              </div>
              <div className="text-xs sm:text-sm font-extrabold tabular-nums text-slate-900 dark:text-white mt-1 leading-tight break-words">
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFE485]/15 dark:bg-[#FFD14C]/10 border border-[#FFE485]/60 dark:border-[#FFD14C]/30 space-y-1.5">
          <div className="text-xs font-extrabold text-amber-950 dark:text-[#FFE485] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFD14C] shrink-0" />
            <span>{pitch.paradoxHookTitle[lang]}</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
            {pitch.paradoxHookBody[lang]}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F8FCFD] dark:bg-slate-900/70 border border-[#C8EEF7] dark:border-slate-800/90 space-y-2">
          {pitch.miniBars.map((bar, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {bar.label[lang]}
                </span>
                <span className="tabular-nums font-bold text-slate-900 dark:text-[#9BE7FA] shrink-0 ml-2">
                  {bar.textValue}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar.color}`}
                  style={{ width: `${Math.min(100, bar.pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-900 border border-[#9BE7FA]/50 dark:border-slate-800 text-xs font-bold text-[#074553] dark:text-[#FFE485] leading-relaxed flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA] shrink-0" />
          <span>{pitch.roiHighlight[lang]}</span>
        </div>
      </div>

      <div className="space-y-3.5 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {techList.slice(0, 5).map((item) => (
            <span
              key={item}
              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F8FCFD] text-slate-800 border border-[#C8EEF7] dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            href={`/projects/${canonicalRouteId}`}
            className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#9BE7FA] text-center cursor-pointer"
          >
            <span>{pitch.curiosityCta[lang]}</span>
            <ArrowUpRight className="w-4 h-4 text-[#074553] shrink-0" />
          </Link>

          {pitch.secondaryAction &&
            (pitch.secondaryAction.external ? (
              <a
                href={pitch.secondaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:border-[#9BE7FA] text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                {pitch.secondaryAction.label[lang]}
              </a>
            ) : (
              <Link
                href={pitch.secondaryAction.href}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:border-[#9BE7FA] text-xs font-bold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                {pitch.secondaryAction.label[lang]}
              </Link>
            ))}
        </div>
      </div>
    </article>
  );
}

export { ProjectCardItem };
