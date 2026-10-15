'use client';

import React from 'react';
import Link from 'next/link';
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
  // 1. Tóm tắt 1 câu định vị bài toán (5 giây đầu)
  oneLinePitch: { vi: string; en: string };
  // 2. Hộp "Nghịch lý gây tò mò" kích thích HR bấm vào xem (15 giây giữa)
  paradoxHookTitle: { vi: string; en: string };
  paradoxHookBody: { vi: string; en: string };
  // 3. Kết quả định lượng (10 giây cuối)
  roiHighlight: { vi: string; en: string };
  kpis: { label: { vi: string; en: string }; value: string }[];
  miniBars: { label: { vi: string; en: string }; textValue: string; pct: number; color: string }[];
  // Nút CTA chính gây tò mò thay vì chữ "Xem chi tiết" chung chung
  curiosityCta: { vi: string; en: string };
  secondaryAction?: { label: { vi: string; en: string }; href: string; external?: boolean };
}

const PROJECT_PITCH_MAP: Record<string, RecruiterPitchTelemetry> = {
  'kami-ely': {
    domainBadge: {
      vi: 'CASE STUDY #1 • E-COMMERCE SQL & BI',
      en: 'CASE STUDY #1 • E-COMMERCE SQL & BI'
    },
    badgeStyle:
      'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
    readTimeTag: {
      vi: '⏱️ Tóm tắt 30s • Đọc sâu 3 phút',
      en: '⏱️ 30s Pitch • 3-Min Scan'
    },
    oneLinePitch: {
      vi: 'Kiểm toán 18.778 bản ghi SQL (8 bảng CSV + Seller Center) của gian hàng thời trang 31,6 Tỉ VNĐ để tìm lời giải cho cú rơi doanh số mùa vụ và sự quá tải của đội ngũ Livestream.',
      en: 'Audited 18,778 SQL records (8 CSVs + Seller Center) for a 31.6B VND fashion brand to solve seasonal revenue decay and livestream host burnout.'
    },
    paradoxHookTitle: {
      vi: '⚡ Nghịch lý Dữ liệu Phát hiện (Tại sao làm nhiều hơn lại thu ít hơn?):',
      en: '⚡ Counter-Intuitive Discovery (Why working harder yielded less):'
    },
    paradoxHookBody: {
      vi: 'Đội ngũ đứng LIVE ~7,5h/ngày nhưng chỉ thu 30,2k đ/1.000 views — thấp hơn 4,5 lần so với Video ngắn (135,2k đ). Ngày spam kỷ lục 106 phiên LIVE (09/04) chỉ đạt 79,4 Tr đ, thua xa ngày phát 45 phiên chọn lọc (25/06) đạt 196,1 Tr đ (hiệu suất gấp 5,8 lần)!',
      en: 'Hosts streamed ~7.5h/day for just 30.2k VND/1k views — 4.5x lower than Short Video (135.2k). A record 106 LIVEs on Apr 09 yielded only 79.4M VND, whereas 45 focused LIVEs on Jun 25 generated 196.1M VND (5.8x higher efficiency)!'
    },
    roiHighlight: {
      vi: '🎯 Tác động: Đẩy tốc độ LIVE tăng 3,16x (1,81M → 5,73M đ/giờ) & Mở khóa +1,18 Tỉ VNĐ/tháng',
      en: '🎯 Impact: Lifted LIVE velocity 3.16x (1.81M → 5.73M/hr) & Unlocked +1.18B VND/mo'
    },
    kpis: [
      { label: { vi: 'GMV 180d / All-Time', en: '180d / All-Time GMV' }, value: '12,74 Tỉ / 31,6 Tỉ' },
      { label: { vi: 'Kho Dữ Liệu SQL', en: 'SQL Warehouse' }, value: '18.778 Dòng' },
      { label: { vi: 'GPM Video vs LIVE', en: 'Video vs LIVE GPM' }, value: '135,2k (4,5x)' }
    ],
    miniBars: [
      {
        label: { vi: 'Kênh Chính Chủ @kamielyhn (90d)', en: 'Self-Operated @kamielyhn (90d)' },
        textValue: '49,31% GMV (3,03 Tỉ)',
        pct: 49.31,
        color: 'bg-sky-500'
      },
      {
        label: { vi: '5.712 KOCs Ngoài (Top 1% = 91,5%)', en: '5,712 External KOCs (Top 1% = 91.5%)' },
        textValue: '27,84% GMV (1,71 Tỉ)',
        pct: 27.84,
        color: 'bg-emerald-500'
      },
      {
        label: { vi: 'Kệ Hàng (1,17M views • CVR 0,25%)', en: 'Product Card (1.17M views • 0.25% CVR)' },
        textValue: '22,85% GMV (1,40 Tỉ)',
        pct: 22.85,
        color: 'bg-amber-500'
      }
    ],
    curiosityCta: {
      vi: '🔍 Xem cách giải mã Nghịch lý 4,5x & Mô hình +1,18 Tỉ/th',
      en: '🔍 See How I Solved the 4.5x Paradox & +1.18B Model'
    },
    secondaryAction: {
      label: { vi: '💻 Chạy SQL (/lab)', en: '💻 Run SQL (/lab)' },
      href: '/lab'
    }
  },
  'library-bus': {
    domainBadge: {
      vi: 'CASE STUDY #2 • PRODUCT BI & FULL-STACK',
      en: 'CASE STUDY #2 • PRODUCT BI & FULL-STACK'
    },
    badgeStyle:
      'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    readTimeTag: {
      vi: '⏱️ Tóm tắt 30s • Có Sơ đồ 30 Nodes',
      en: '⏱️ 30s Pitch • 30-Node Graph'
    },
    oneLinePitch: {
      vi: 'Xây dựng nền tảng Quản trị & Phân tích Dữ liệu Thư viện Lưu động (6 Django Apps + Celery + 10 Dashboards) điều phối 7.080 lượt mượn/tháng qua 5 tuyến xe buýt.',
      en: 'Built a Full-Stack Mobile Library & Product BI platform (6 Django Apps + Celery + 10 Dashboards) orchestrating 7,080 monthly borrows across 5 bus routes.'
    },
    paradoxHookTitle: {
      vi: '⚡ Bài toán Hóc búa (Chống xung đột tồn kho di động):',
      en: '⚡ The Core Engineering & Analytics Bottleneck:'
    },
    paradoxHookBody: {
      vi: 'Khi nhiều độc giả ở các trạm xe buýt khác nhau cùng bấm đặt giữ chỗ cuốn sách cuối cùng tại cùng một mili-giây, hệ thống thông thường sẽ bị xuất khống tồn kho (Race Condition) và lệch cơ cấu sách giữa các điểm đỗ.',
      en: 'When multiple readers across different bus stops reserve the last available book copy at the exact same millisecond, naive systems suffer inventory double-booking (Race Condition) and stockouts.'
    },
    roiHighlight: {
      vi: '🎯 Tác động: 0% Trùng đơn (Race Lock) • 92,0% Hoàn tất đặt trước (+34%) • Trễ hạn <4,8%',
      en: '🎯 Impact: 0% Booking Conflict • 92.0% Reservation Fill (+34%) • Overdue <4.8%'
    },
    kpis: [
      { label: { vi: 'Lưu Lượng Mượn', en: 'Monthly Volume' }, value: '7.080 Lượt/th' },
      { label: { vi: 'Kiến Trúc Hệ Thống', en: 'System Scale' }, value: '6 Apps • 10 BI Views' },
      { label: { vi: 'Hoàn Tất Đặt Trước', en: 'Reservation Fill' }, value: '92,0% (0% Lỗi)' }
    ],
    miniBars: [
      {
        label: { vi: 'Tỷ lệ nhận sách đặt giữ chỗ theo trạm', en: 'Stop-Based Reservation Fulfillment' },
        textValue: '92,0% (+34% YoY)',
        pct: 92,
        color: 'bg-emerald-500'
      },
      {
        label: { vi: 'Độ phủ Celery nhắc hạn tự động', en: 'Celery Auto-Reminder Coverage' },
        textValue: '85,0% (Trễ <4,8%)',
        pct: 85,
        color: 'bg-sky-500'
      },
      {
        label: { vi: 'Chuyển đổi Tra cứu → Xem chi tiết sách', en: 'Catalog → Book Detail CVR' },
        textValue: '62,0% (7.688 độc giả)',
        pct: 62,
        color: 'bg-indigo-500'
      }
    ],
    curiosityCta: {
      vi: '🔍 Xem Kiến trúc 6 Django Apps & Mô phỏng Đội xe',
      en: '🔍 Inspect 6-App Architecture & Fleet Simulator'
    },
    secondaryAction: {
      label: { vi: '🕸️ Sơ đồ 30 Nodes ↗', en: '🕸️ 30-Node Graph ↗' },
      href: '/library-bus/architecture-graph.html',
      external: true
    }
  },
  'heritage-japan': {
    domainBadge: {
      vi: 'CASE STUDY #3 • KINH TẾ LƯỢNG & CHÍNH SÁCH',
      en: 'CASE STUDY #3 • ECONOMETRICS & POLICY'
    },
    badgeStyle:
      'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
    readTimeTag: {
      vi: '⏱️ Tóm tắt 30s • Mô hình OLS & DiD',
      en: '⏱️ 30s Pitch • OLS & DiD Models'
    },
    oneLinePitch: {
      vi: 'Kiểm định kinh tế lượng trên 14.509 di sản văn hóa cấp quốc gia tại Nhật Bản (2015–2025) để đo lường tác động kinh tế du lịch và hiệu quả của Luật Bảo tồn sửa đổi năm 2019.',
      en: 'Econometric evaluation of 14,509 national cultural properties in Japan (2015–2025) measuring tourism elasticity and the impact of the 2019 Law Reform.'
    },
    paradoxHookTitle: {
      vi: '⚡ Nghịch lý Không gian & Ngân sách (Cực quá tải vs. Cực thiếu vốn):',
      en: '⚡ The Spatial & Fiscal Paradox (Overtourism vs. Underfunding):'
    },
    paradoxHookBody: {
      vi: '41,8% Quốc bảo tập trung đặc tại vùng Kansai (Gini = 0,64) đẩy chỉ số quá tải du lịch tại Kyoto lên mức báo động 92/100; trong khi các tỉnh địa phương thiếu vốn phát triển vì 68% ngân sách quốc gia bị chôn vào trùng tu thụ động.',
      en: '41.8% of National Treasures cluster in Kansai (Gini = 0.64), pushing Kyoto overtourism to 92/100, while regional prefectures starve for growth capital as 68% of ACA budget is locked in passive repairs.'
    },
    roiHighlight: {
      vi: '🎯 Tác động: Hồi quy R² = 0,84 (β = +0,72) • DiD tăng +24,6% dự án • Giảm tải Kyoto 92 → 54/100',
      en: '🎯 Impact: OLS R² = 0.84 (β = +0.72) • DiD +24.6% Projects • Kyoto Load Cut 92 → 54/100'
    },
    kpis: [
      { label: { vi: 'Quy Mô Di Sản', en: 'Heritage Scale' }, value: '1.132 Quốc bảo' },
      { label: { vi: 'Độ Phù Hợp OLS', en: 'OLS Model Fit' }, value: 'R² = 0,84 (p<0,01)' },
      { label: { vi: 'Hiệu Ứng Luật 2019', en: '2019 Law DiD' }, value: '+24,6% Dự án' }
    ],
    miniBars: [
      {
        label: { vi: 'Mức độ giải thích doanh thu du lịch (R²)', en: 'Tourism Revenue Explained (R²)' },
        textValue: '84,0% (β = +0,72)',
        pct: 84,
        color: 'bg-amber-500'
      },
      {
        label: { vi: 'Tỷ trọng ngân sách trùng tu cơ bản (ACA)', en: 'ACA Basic Repair Budget Share' },
        textValue: '68,0% (141,2 Tỉ ¥)',
        pct: 68,
        color: 'bg-sky-500'
      },
      {
        label: { vi: 'Tỷ trọng Quốc bảo tập trung tại Kansai', en: 'Kansai National Treasure Concentration' },
        textValue: '41,8% (Gini = 0,64)',
        pct: 41.8,
        color: 'bg-rose-500'
      }
    ],
    curiosityCta: {
      vi: '🔍 Xem Kiểm định Hồi quy & Simulator Giãn khách',
      en: '🔍 Explore Regression Proofs & Policy Simulator'
    },
    secondaryAction: {
      label: { vi: '🎛️ Simulator Chính sách', en: '🎛️ Policy Simulator' },
      href: '/projects/heritage-japan#policy-simulator'
    }
  }
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

  const pitch = PROJECT_PITCH_MAP[project.id] || PROJECT_PITCH_MAP['kami-ely'];
  const techList = project.tech || project.tags || ['SQL', 'Python', 'Power BI', 'Next.js'];

  return (
    <article className="group rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 hover:border-sky-500 dark:hover:border-sky-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between p-5 sm:p-6 space-y-4">
      <div className="space-y-4">
        {/* DÒNG 1: BADGE LĨNH VỰC & THỜI GIAN ĐỌC 30 GIÂY */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${pitch.badgeStyle}`}>
            {pitch.domainBadge[lang]}
          </span>
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
            {pitch.readTimeTag[lang]}
          </span>
        </div>

        {/* DÒNG 2: TIÊU ĐỀ & CÂU ĐỊNH VỊ 5 GIÂY */}
        <div className="space-y-1.5">
          <Link href={`/projects/${project.id}`} className="block">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition leading-snug">
              {resolveText(project.title, project.titleEn)}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {pitch.oneLinePitch[lang]}
          </p>
        </div>

        {/* DÒNG 3: 3 Ô SỐ LIỆU QUY MÔ (ĐẬP VÀO MẮT TRONG 5 GIÂY) */}
        <div className="grid grid-cols-3 gap-2">
          {pitch.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800"
            >
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                {kpi.label[lang]}
              </div>
              <div className="text-xs sm:text-sm font-extrabold font-mono text-slate-900 dark:text-white mt-0.5 truncate">
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* DÒNG 4: HỘP "NGHỊCH LÝ GÂY TÒ MÒ" (THE 15-SECOND PARADOX HOOK) */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/25 border border-amber-300 dark:border-amber-500/35 space-y-1.5">
          <div className="text-xs font-mono font-extrabold text-amber-950 dark:text-amber-300">
            {pitch.paradoxHookTitle[lang]}
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
            {pitch.paradoxHookBody[lang]}
          </p>
        </div>

        {/* DÒNG 5: THANH CƠ CẤU DỮ LIỆU MINI */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 space-y-2">
          {pitch.miniBars.map((bar, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {bar.label[lang]}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-sky-300 shrink-0 ml-2">
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

        {/* DÒNG 6: KẾT QUẢ ĐỊNH LƯỢNG (ROI BANNER) */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold text-emerald-950 dark:text-emerald-200 leading-relaxed">
          {pitch.roiHighlight[lang]}
        </div>
      </div>

      {/* CHÂN THẺ: TECH STACK & NÚT BẤM KÍCH THÍCH TÒ MÒ (CURIOSITY CTA) */}
      <div className="space-y-3.5 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-1.5">
          {techList.slice(0, 5).map((item) => (
            <span
              key={item}
              className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            href={`/projects/${project.id}`}
            className="min-h-[42px] flex-1 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg text-center"
          >
            <span>{pitch.curiosityCta[lang]}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {pitch.secondaryAction &&
            (pitch.secondaryAction.external ? (
              <a
                href={pitch.secondaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center shrink-0"
              >
                {pitch.secondaryAction.label[lang]}
              </a>
            ) : (
              <Link
                href={pitch.secondaryAction.href}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center shrink-0"
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
