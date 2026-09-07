'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AcademicThesisMockup } from './ui/AcademicThesisMockup';
import { 
  ArrowLeft, Landmark, ExternalLink, Download, 
  Search, Compass, ShieldCheck, TrendingUp, 
  AlertTriangle, Sparkles, Eye, Camera, Layers, 
  Users, Award, Info, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';

import {
  THESIS_METADATA,
  THESIS_CHARTS_CATALOG,
  touristsData,
  kyotoVisitorsData,
  naraVisitorsData,
  kyotoNaraVisitorsData,
  spendNationalData,
  kyotoSpendData,
  naraSpendData,
  gdpShareData,
  UNESCO_SITES_JAPAN
} from '../data/heritageJapanData';

import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection, useCaseStudyActions } from '../lib/uiHelpers';
import SectionHeader from './ui/SectionHeader';

const HERITAGE_JAPAN_SECTIONS = [
  'mo-dau',
  'chuong-1',
  'chuong-2',
  'chuong-3',
  'ket-luan'
];

export default function HeritageJapanProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';
  const { copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);

  // Volume Charts (3.1, 3.2, 3.3)
  const [volumeChartId, setVolumeChartId] = useState<string>('3.1');
  const [volumeViewMode, setVolumeViewMode] = useState<'interactive' | 'authentic'>('interactive');

  // Revenue Charts (3.4, 3.5, 3.6)
  const [revenueChartId, setRevenueChartId] = useState<string>('3.4');
  const [revenueViewMode, setRevenueViewMode] = useState<'interactive' | 'authentic'>('interactive');

  // Case study active tab
  const [activeCaseStudy, setActiveCaseStudy] = useState<'kyoto' | 'nara' | 'fuji' | 'shirakawago' | 'miyajima'>('kyoto');

  // UNESCO list filter
  const [unescoFilter, setUnescoFilter] = useState<'all' | 'Văn hóa' | 'Thiên nhiên'>('all');
  const [unescoSearch, setUnescoSearch] = useState<string>('');

  const { activeSection } = useScrollSpy(HERITAGE_JAPAN_SECTIONS, 130);

  const navItems = [
    { id: 'mo-dau', label: isEn ? 'Introduction' : 'Mở đầu' },
    { id: 'chuong-1', label: isEn ? 'Ch1: Heritage Concept' : 'Chương 1' },
    { id: 'chuong-2', label: isEn ? 'Ch2: Policies' : 'Chương 2' },
    { id: 'chuong-3', label: isEn ? 'Ch3: Analytics & Cases' : 'Chương 3' },
    { id: 'ket-luan', label: isEn ? 'Conclusion' : 'Kết luận' },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id, 16);
  };

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Niên luận Du lịch Di sản Nhật Bản (Ma Văn Hùng)', 'proj-heritage-japan', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  // Filtered UNESCO sites
  const filteredUnescoSites = useMemo(() => {
    return UNESCO_SITES_JAPAN.filter(site => {
      const matchesType = unescoFilter === 'all' || site.type === unescoFilter;
      const matchesSearch = !unescoSearch.trim() || 
        site.nameVi.toLowerCase().includes(unescoSearch.toLowerCase()) ||
        site.nameJa.includes(unescoSearch) ||
        site.prefecture.toLowerCase().includes(unescoSearch.toLowerCase()) ||
        site.highlight.toLowerCase().includes(unescoSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [unescoFilter, unescoSearch]);

  const volumeCharts = useMemo(() => THESIS_CHARTS_CATALOG.filter(c => ['3.1', '3.2', '3.3'].includes(c.chartId)), []);
  const revenueCharts = useMemo(() => THESIS_CHARTS_CATALOG.filter(c => ['3.4', '3.5', '3.6'].includes(c.chartId)), []);

  const selectedVolumeMeta = volumeCharts.find(c => c.chartId === volumeChartId) || volumeCharts[0];
  const selectedRevenueMeta = revenueCharts.find(c => c.chartId === revenueChartId) || revenueCharts[0];

  return (
    <div className="min-h-screen bg-slate-50 font-lora text-slate-900 selection:bg-[#FFE485]/40 dark:bg-slate-950 dark:text-slate-100">
      
      {/* ======================================================== */}
      {/* STICKY TOP NAVIGATION                                     */}
      {/* ======================================================== */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#8CE0F4] text-slate-950 font-black shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 font-semibold'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {isEmbedded && (
              <a
                href="/projects/proj-heritage-japan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open full page in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-3 py-1.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 1. TRANG BÌA & THÔNG TIN HỌC THUẬT (#trang-bia)            */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* HERO HEADER (PORTFOLIO PROJECT OVERVIEW)                 */}
      {/* ======================================================== */}
      <header className="relative bg-gradient-to-b from-[#F3FCFE] via-[#FFFDF5] to-[#FFF9E6] text-slate-900 pt-16 pb-16 overflow-hidden border-b border-slate-200/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white dark:border-slate-800">
        
        {/* Ambient background glow */}
        <div className="absolute right-[8%] top-[10%] w-72 h-72 rounded-full bg-gradient-to-tr from-[#FFE485] via-[#FFD14C] to-[#9BE7FA] opacity-35 blur-3xl pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-md text-xs font-bold tracking-wide text-slate-900 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <Landmark className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#FFD14C]" />
              <span>{isEn ? 'LINE 03 · HERITAGE TOURISM & QUANTITATIVE RESEARCH' : 'LINE 03 : PHÂN TÍCH ĐỊNH LƯỢNG & DU LỊCH DI SẢN NHẬT BẢN'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.18] tracking-tight text-slate-950 dark:text-white">
              {isEn ? THESIS_METADATA.titleEn : THESIS_METADATA.titleVi}
            </h1>
            
            <p className="text-base sm:text-xl text-[#0D7287] font-semibold italic dark:text-[#9BE7FA]">
              {isEn ? THESIS_METADATA.titleVi : THESIS_METADATA.titleEn}
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl dark:text-slate-300">
              {isEn
                ? 'A comprehensive quantitative research & case study on Japan’s heritage tourism trajectory (2013–2023): examining inbound growth catalysts, the overtourism crisis across UNESCO cultural hotspots, and actionable governance models for sustainable preservation.'
                : 'Khảo sát thực tiễn toàn diện về lộ trình phát triển du lịch di sản tại Nhật Bản giai đoạn 2013–2023: phân tích động lực bùng nổ du khách quốc tế, khủng hoảng quá tải du lịch (Overtourism) tại các di sản UNESCO và các mô hình quản trị di sản bền vững.'}
            </p>
            
            {/* Quick Metadata Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                {isEn ? 'Research Scope:' : 'Phạm vi nghiên cứu:'} <b className="text-[#0D7287] dark:text-[#9BE7FA]">2013 – 2023</b>
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                {isEn ? 'UNESCO Sites:' : 'Di sản Thế giới:'} <b className="text-[#0D7287] dark:text-[#9BE7FA]">25 Điểm đến (20 VH / 5 TN)</b>
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                {isEn ? 'Telemetry Datasets:' : 'Dữ liệu phân tích:'} <b className="text-[#0D7287] dark:text-[#9BE7FA]">6 Chuỗi số liệu thống kê</b>
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                {isEn ? 'Key Hotspots:' : 'Khảo sát thực tiễn:'} <b className="text-[#0D7287] dark:text-[#9BE7FA]">Kyoto · Nara · Phú Sĩ · Shirakawa-go · Miyajima</b>
              </span>
            </div>

            {/* Quick Jump Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#mo-dau"
                onClick={(e) => handleNavClick('mo-dau', e)}
                className="px-4 py-2 rounded-xl bg-[#0D7287] text-white font-bold text-xs hover:bg-[#095262] transition-colors shadow-xs flex items-center gap-1.5 dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#8CE0F4] cursor-pointer"
              >
                <span>Bắt đầu đọc đề tài</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#chuong-1"
                onClick={(e) => handleNavClick('chuong-1', e)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Khám phá 25 Di sản UNESCO
              </a>
              <a
                href="#chuong-3"
                onClick={(e) => handleNavClick('chuong-3', e)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Xem Dữ liệu & Biểu đồ 3.1 - 3.6
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. PHẦN MỞ ĐẦU (#mo-dau)                                 */}
      {/* ======================================================== */}
      <section id="mo-dau" className="py-16 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <SectionHeader
            variant="stacked"
            id="mo-dau"
            badge={isEn ? 'Part I • Introduction' : 'Phần Mở Đầu • Đề cương nghiên cứu'}
            title={isEn ? 'Research Rationale & Methodological Framework' : 'Lý do, Mục tiêu & Phương pháp nghiên cứu'}
            onCopy={copyDeepLink}
          />

          <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            
            {/* 1. Lý do nghiên cứu */}
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8CE0F4]/40 text-[#0D7287] font-black text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">1</span>
                <span>{isEn ? '1. Research Rationale' : '1. Lý do nghiên cứu'}</span>
              </h3>
              <p>
                Bước vào thế kỷ 21, du lịch di sản (Heritage Tourism) đã vươn lên thành một trong những phân khúc phát triển bùng nổ nhất của ngành du lịch toàn cầu, chiếm hơn 40% lượng du khách quốc tế theo số liệu của Tổ chức Du lịch Thế giới. Đối với Nhật Bản, sau giai đoạn trì trệ kinh tế kéo dài cùng biến cố động đất sóng thần năm 2011, chính phủ đã xác định du lịch là trụ cột kinh tế chiến lược nhằm hồi sinh các vùng địa phương và nâng cao vị thế quốc gia.
              </p>
              <p>
                Mốc năm <strong>2013</strong> mang tính bước ngoặt lịch sử: Chính phủ Nhật Bản ban hành <em>"Chương trình hành động hướng tới quốc gia du lịch"</em> (観光立国実現に向けたアクション・プログラム), đồng thời Tokyo giành quyền đăng cai Thế vận hội Olympic 2020 và Núi Phú Sĩ chính thức được UNESCO công nhận là Di sản Thế giới. Sự kết hợp giữa chính sách mở cửa visa, mở rộng đường bay và chiến lược quảng bá thương hiệu quốc gia đã tạo ra làn sóng tăng trưởng chưa từng có. Nghiên cứu kinh nghiệm quản trị, cân bằng giữa phát triển du lịch di sản với bảo tồn nguyên vẹn các giá trị văn hóa của Nhật Bản đem lại những hàm ý và bài học quý giá cho các quốc gia đang phát triển như Việt Nam.
              </p>
            </div>

            {/* 2. Mục đích và câu hỏi nghiên cứu */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#8CE0F4]/40 text-[#0D7287] font-black text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">2</span>
                <span>{isEn ? '2. Objectives & Research Questions' : '2. Mục đích và câu hỏi nghiên cứu'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
                  <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                    <Compass className="w-4 h-4" />
                    <span>2.1 Mục đích nghiên cứu</span>
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Khảo sát, phân tích toàn diện quá trình phát triển của du lịch di sản tại Nhật Bản giai đoạn 2013 đến nay dưới hai tiêu chí then chốt: <strong>Hiệu quả du lịch</strong> (lượng khách, chi tiêu, GDP, việc làm) và <strong>Công tác bảo tồn - quản lý di sản</strong> (quá tải du lịch, thương mại hóa, bảo vệ môi trường).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
                  <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <Info className="w-4 h-4" />
                    <span>2.2 Ba câu hỏi nghiên cứu chính</span>
                  </h4>
                  <ul className="text-sm space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                    <li>Chính sách phát triển và bảo tồn di sản của Nhật Bản được hoạch định và chuyển dịch như thế nào?</li>
                    <li>Sự phát triển của du lịch di sản được phản ánh qua các chỉ số định lượng nào tại Kyoto, Nara và cả nước?</li>
                    <li>Chính quyền Nhật Bản đã giải quyết xung đột lợi ích dân cư và hệ lụy quá tải (Overtourism) ra sao?</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3, 4, 5, 6: Nhiệm vụ, Đối tượng, Phương pháp, Bố cục */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 dark:text-white">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>3. Nhiệm vụ nghiên cứu & 4. Phạm vi</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Hệ thống hóa cơ sở lý luận về du lịch di sản; thu thập và phân tích chuỗi dữ liệu thống kê khách du lịch, doanh thu tại Nhật Bản và các di sản trọng điểm (Kyoto, Nara, Shirakawa-go, Núi Phú Sĩ, Đền Itsukushima) trong phạm vi thời gian từ năm <strong>2013 đến 2023</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 dark:text-white">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>5. Phương pháp & 6. Bố cục đề tài</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Kết hợp phân tích thống kê định lượng (thống kê JNTO, MLIT, Cục Văn hóa), phân tích chính sách và nghiên cứu trường hợp (Case study). Đề tài gồm 3 chương chính: <strong>Chương 1</strong> (Cơ sở lý luận & 25 di sản), <strong>Chương 2</strong> (Hệ thống chính sách), <strong>Chương 3</strong> (Thực chứng dữ liệu & bảo tồn).
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CHƯƠNG 1: DI SẢN VÀ DU LỊCH DI SẢN (#chuong-1)         */}
      {/* ======================================================== */}
      <section id="chuong-1" className="py-16 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <SectionHeader
            variant="stacked"
            id="chuong-1"
            badge={isEn ? 'Chapter 1 • Theoretical Foundation' : 'Chương 1 • Cơ sở lý luận & Thực tiễn'}
            title={isEn ? 'Heritage & Heritage Tourism in the World and Japan' : 'Di sản và Du lịch di sản trên thế giới và Nhật Bản'}
            onCopy={copyDeepLink}
          />

          <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            
            {/* 1.1 Di sản */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 dark:text-white">
                1.1. Di sản và Di sản thế giới tại Nhật Bản
              </h3>
              
              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  <strong>Khái niệm di sản:</strong> Di sản bao gồm các tài sản văn hóa, lịch sử và thiên nhiên được các thế hệ trước để lại, có giá trị khoa học, thẩm mỹ và tinh thần to lớn. Theo Công ước Bảo vệ Di sản Văn hóa và Thiên nhiên Thế giới năm 1972 của UNESCO, Di sản Thế giới là những di sản đáp ứng các tiêu chí khắt khe về "Giá trị nổi bật toàn cầu" (Outstanding Universal Value - OUV).
                </p>
                <p>
                  <strong>Vai trò trong du lịch:</strong> Di sản là thỏi nam châm thu hút du khách, mang lại sức cạnh tranh khác biệt cho điểm đến. Khách du lịch di sản thường có thời gian lưu trú dài hơn và mức chi tiêu cao hơn đáng kể so với khách du lịch đại trà.
                </p>
                <p>
                  <strong>Nhật Bản:</strong> Tính đến năm 2023, Nhật Bản sở hữu <strong>25 Di sản Thế giới</strong> được UNESCO công nhận, bao gồm <strong>20 Di sản Văn hóa</strong> và <strong>5 Di sản Thiên nhiên</strong>. Hệ thống di sản phong phú trải dài từ kiến trúc gỗ cổ nhất thế giới (Chùa Horyuji), các cố đô ngàn năm (Kyoto, Nara) đến những kiệt tác thiên nhiên biệt lập (Yakushima, Shiretoko, Ogasawara).
                </p>
              </div>

              {/* Interactive UNESCO Explorer */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2 dark:text-white">
                      <Landmark className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>Tra cứu 25 Di sản Thế giới UNESCO tại Nhật Bản</span>
                    </h4>
                    <p className="text-xs text-slate-500">Bảng dữ liệu định danh 20 Di sản Văn hóa & 5 Di sản Thiên nhiên</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      {(['all', 'Văn hóa', 'Thiên nhiên'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setUnescoFilter(type)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                            unescoFilter === type 
                              ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                              : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          {type === 'all' ? 'Tất cả (25)' : `${type} (${type === 'Văn hóa' ? 20 : 5})`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search bar */}
                <div className="relative mb-4">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={unescoSearch}
                    onChange={(e) => setUnescoSearch(e.target.value)}
                    placeholder="Tìm theo tên di sản, tỉnh (Kyoto, Nara, Hiroshima, Tokyo...)..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8CE0F4] transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>

                {/* Grid of UNESCO sites */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredUnescoSites.map((site) => (
                    <div 
                      key={site.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#8CE0F4] transition-all text-xs dark:bg-slate-800/70 dark:border-slate-700/80"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          site.type === 'Văn hóa' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        }`}>
                          {site.type} • {site.year}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">{site.prefecture}</span>
                      </div>
                      <p className="font-extrabold text-slate-900 mb-0.5 dark:text-white">{site.nameVi}</p>
                      <p className="text-[11px] text-slate-500 font-japanese mb-1.5 dark:text-slate-400">{site.nameJa}</p>
                      <p className="text-slate-600 leading-normal text-[11px] dark:text-slate-300">{site.highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 1.2 Du lịch di sản */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 dark:text-white">
                1.2. Khái niệm Du lịch di sản & Ma trận tác động hai chiều
              </h3>

              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  Theo ICOMOS (Hội đồng Quốc tế về Di tích và Di chỉ) và UNWTO, <strong>Du lịch di sản</strong> là hoạt động di chuyển của các cá nhân nhằm trải nghiệm, khám phá và tìm hiểu về các di tích lịch sử, khảo cổ, kiến trúc, cảnh quan và lối sống truyền thống. Các hoạt động cốt lõi bao gồm: chiêm bái tâm linh, hành hương, tham gia lễ hội dân gian (Matsuri), thưởng thức ẩm thực di sản và học nghề thủ công truyền thống.
                </p>

                {/* 2-column impact matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60">
                    <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-wider mb-2 dark:text-emerald-300">
                      <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Tác động tích cực (Positive Impacts)</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                      <li><strong>Kinh tế:</strong> Tạo nguồn thu ngân sách trực tiếp thông qua vé tham quan, dịch vụ lưu trú và chi tiêu mua sắm hàng thủ công.</li>
                      <li><strong>Tái đầu tư:</strong> Cung cấp tài chính dồi dào cho các dự án trùng tu, bảo dưỡng định kỳ các công trình cổ bằng gỗ quý giá.</li>
                      <li><strong>Việc làm:</strong> Giải quyết công ăn việc làm cho cư dân bản địa, khuyến khích giới trẻ ở lại quê hương giữ nghề truyền thống.</li>
                      <li><strong>Tự hào văn hóa:</strong> Khơi dậy ý thức cộng đồng, bảo vệ các nghi lễ và văn hóa dân gian đứng trước nguy cơ mai một.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60">
                    <div className="flex items-center gap-2 text-rose-800 font-black text-sm uppercase tracking-wider mb-2 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Tác động tiêu cực (Negative Impacts)</span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                      <li><strong>Hao mòn vật chất:</strong> Áp lực bước chân hàng triệu du khách gây mòn nền gỗ, bậc đá và rung chấn kết cấu công trình cổ.</li>
                      <li><strong>Quá tải du lịch (Overtourism):</strong> Nghẽn đường, ách tắc phương tiện công cộng, tiếng ồn xáo trộn nếp sống cư dân bản địa.</li>
                      <li><strong>Thương mại hóa thái quá:</strong> Hàng hóa lưu niệm sản xuất hàng loạt từ nước ngoài lấn át sản phẩm thủ công tinh xảo nguyên bản.</li>
                      <li><strong>Ô nhiễm môi trường:</strong> Lượng rác thải khổng lồ, đặc biệt là bao bì nhựa và hộp đựng thức ăn du khách vứt bừa bãi.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F3FCFE] border border-[#9BE7FA] mt-4 text-xs sm:text-sm text-slate-800 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200">
                  <strong className="text-[#0D7287] dark:text-[#9BE7FA]">Nguyên tắc phát triển bền vững:</strong> 
                  {" "}Phát triển du lịch di sản bền vững đòi hỏi phải duy trì cân bằng động giữa 3 trụ cột: <em>Hiệu quả kinh tế lâu dài</em>, <em>Bảo tồn nguyên vẹn tính chân xác của di sản</em> và <em>Đảm bảo chất lượng cuộc sống bình yên cho cộng đồng địa phương</em>.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CHƯƠNG 2: CHÍNH SÁCH DU LỊCH DI SẢN CỦA NHẬT BẢN (#chuong-2) */}
      {/* ======================================================== */}
      <section id="chuong-2" className="py-16 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <SectionHeader
            variant="stacked"
            id="chuong-2"
            badge={isEn ? 'Chapter 2 • Governance & Policy Matrix' : 'Chương 2 • Thể chế & Hệ thống chính sách'}
            title={isEn ? "Japan's Strategic Policy on Heritage Tourism" : 'Chính sách của Nhật Bản về Du lịch Di sản'}
            onCopy={copyDeepLink}
          />

          <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            
            {/* 2.1 Chính sách trong Chương trình hành động 2013 */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-950 dark:border-slate-800">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 flex items-center gap-2 dark:text-white">
                <Compass className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>2.1. "Chương trình hành động hướng tới quốc gia du lịch" (2013)</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mb-6 dark:text-slate-300">
                Tháng 6 năm 2013, Thủ tướng Shinzo Abe chủ trì Hội nghị Bộ trưởng ban hành văn kiện chiến lược quốc gia mang tên <em>"Chương trình hành động hướng tới quốc gia du lịch"</em> (観光立国実現に向けたアクション・プログラム). Đây là bước đột phá toàn diện với 4 nhóm biện pháp trọng tâm:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                    <Sparkles className="w-4 h-4" />
                    <span>2.1.1 Quảng bá "Thương hiệu Nhật Bản" (日本ブランド)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                    Xây dựng thương hiệu quốc gia thông qua chiến lược <em>"Cool Japan"</em>, kết hợp quảng bá ẩm thực truyền thống Washoku (được UNESCO công nhận 2013) và văn hóa Omotenashi (sự hiếu khách tận tụy). Tận dụng truyền thông số và JNTO tại 22 quốc gia để định vị Nhật Bản là điểm đến di sản an toàn, tinh tế.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>2.1.2 Nới lỏng Visa, Hàng không LCC & Miễn thuế</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                    Miễn thị thực nhập cảnh ngắn hạn cho các nước ASEAN (Thái Lan, Malaysia...) và cấp visa nhiều lần cho Trung Quốc; mở rộng slot bay tại Haneda/Narita và cấp phép cho các hãng hàng không giá rẻ LCC; mở rộng chính sách hoàn thuế tiêu thụ (Tax-free Shopping) áp dụng cho cả thực phẩm, mỹ phẩm tại các phố cổ.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <Camera className="w-4 h-4" />
                    <span>2.1.3 Hạ tầng đa ngôn ngữ, Wi-Fi & Cashless</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                    Phổ cập mạng lưới <em>"Japan Connected-free Wi-Fi"</em> tại tất cả các đền chùa và nhà ga; chuẩn hóa biển chỉ dẫn giao thông 4 thứ tiếng (Nhật, Anh, Trung, Hàn); khuyến khích lắp đặt máy quẹt thẻ tín dụng và thanh toán quét mã QR nhằm tháo gỡ rào cản tiền mặt cố hữu.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <Users className="w-4 h-4" />
                    <span>2.1.4 Phát triển Du lịch MICE & Hội nghị Quốc tế</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                    Đưa Nhật Bản trở thành trung tâm tổ chức hội nghị quốc tế số 1 châu Á; tổ chức các sự kiện tầm cỡ như Hội nghị Văn hóa Du lịch Thế giới UNWTO/UNESCO lần thứ 4 tại Kyoto (2019), kết hợp chiêu đãi và trải nghiệm di sản văn hóa truyền thống cho quan khách cấp cao.
                  </p>
                </div>
              </div>
            </div>

            {/* 2.2 Chính sách bảo tồn di sản & Luật 1950/2004 */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-950 dark:border-slate-800">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 flex items-center gap-2 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>2.2. Khung pháp lý: Luật Bảo vệ Di sản Văn hóa (1950 & Sửa đổi 2004)</span>
              </h3>
              
              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  <strong>Nguồn gốc lịch sử (1950):</strong> Ngày 26/1/1949, một vụ hỏa hoạn nghiêm trọng đã thiêu rụi tòa Kim Đường (Kondo) của Chùa Horyuji cùng 12 bức bích họa cổ vô giá thế kỷ thứ 7. Thảm họa này đã thúc đẩy Quốc hội Nhật Bản ban hành <strong>Luật Bảo vệ Di sản Văn hóa</strong> vào ngày 30/5/1950. Kể từ đó, ngày 26 tháng 1 hàng năm được ấn định là <em>"Ngày Phòng chống Cháy nổ Di sản Văn hóa"</em> trên toàn quốc.
                </p>
                
                <p>
                  <strong>Luật sửa đổi năm 2004 (Cải cách toàn diện):</strong> Nhận thấy mô hình bảo tồn đơn lẻ không còn theo kịp thực tiễn đô thị hóa, bản sửa đổi năm 2004 đã thiết lập <strong>4 chế độ bảo tồn then chốt</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <strong className="text-slate-900 block font-bold mb-1 dark:text-white">1. Di sản văn hóa vật thể:</strong>
                    Quy định phân hạng nghiêm ngặt thành <em>"Tài sản văn hóa quan trọng"</em> và <em>"Bảo vật quốc gia"</em> (Kokuho). Mọi hoạt động can thiệp trùng tu phải được Cục Văn hóa phê duyệt.
                  </div>
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <strong className="text-slate-900 block font-bold mb-1 dark:text-white">2. Di tích, Danh thắng & Đài kỷ niệm thiên nhiên:</strong>
                    Bảo vệ các địa điểm khảo cổ, hoa viên cổ và hệ sinh vật đặc hữu theo ranh giới vùng đệm bảo tồn.
                  </div>
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <strong className="text-[#0D7287] block font-bold mb-1 dark:text-[#9BE7FA]">3. Cảnh quan văn hóa (文化的景観):</strong>
                    <em>(Điểm bổ sung đột phá năm 2004)</em>. Lần đầu tiên công nhận giá trị của cảnh quan được hình thành từ mối tương tác hài hòa giữa con người và tự nhiên (như ruộng bậc thang, làng chài, rừng bách).
                  </div>
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <strong className="text-slate-900 block font-bold mb-1 dark:text-white">4. Quần thể công trình kiến trúc truyền thống:</strong>
                    Bảo tồn toàn bộ diện mạo đô thị cổ (như làng Gassho-zukuri Shirakawa-go, phố cổ Gion Kyoto, phố Samurai Kakunodate).
                  </div>
                </div>
              </div>
            </div>

            {/* 2.3 Chuyển dịch tư duy: Dự án Japan Heritage 2015 */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60">
              <h3 className="text-lg sm:text-xl font-black text-amber-900 mb-2 flex items-center gap-2 dark:text-amber-300">
                <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <span>2.3. Chuyển dịch tư duy: Dự án "Japan Heritage" (日本遺産) năm 2015</span>
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
                Nếu như trước đây, quan điểm của Nhật Bản là <strong>"Bảo tồn thụ động"</strong> (đóng khung di sản trong tủ kính, hạn chế du khách), thì từ năm 2015, Cục Văn hóa (Agency for Cultural Affairs) đã khởi xướng đề án <strong>"Japan Heritage" (Di sản Nhật Bản)</strong>. Điểm mấu chốt của đề án là phương pháp <em>Kể chuyện (Storytelling)</em>: kết nối các di tích vật thể và phi vật thể rời rạc thành một câu chuyện văn hóa mạch lạc, biến di sản thành tài nguyên sống động phục vụ du khách và giáo dục thế hệ tương lai.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CHƯƠNG 3: SỰ PHÁT TRIỂN CỦA DU LỊCH DI SẢN (#chuong-3)  */}
      {/* ======================================================== */}
      <section id="chuong-3" className="py-16 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <SectionHeader
            variant="stacked"
            id="chuong-3"
            badge={isEn ? 'Chapter 3 • Quantitative Telemetry & In-depth Case Studies' : 'Chương 3 • Dữ liệu Định lượng & Khảo sát Thực tiễn'}
            title={isEn ? 'Development of Heritage Tourism: Efficiency & Conservation' : 'Sự Phát Triển của Du Lịch Di Sản tại Nhật Bản'}
            onCopy={copyDeepLink}
          />

          {/* ==================================================== */}
          {/* 3.1 TIÊU CHÍ HIỆU QUẢ DU LỊCH (DATA ANALYTICS HUB)  */}
          {/* ==================================================== */}
          <div className="mb-14">
            <div className="max-w-4xl mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
                <TrendingUp className="w-6 h-6 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>3.1. Sự phát triển nhìn từ tiêu chí Hiệu quả du lịch (Quantitative Analytics)</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed dark:text-slate-300">
                Sau khi Chương trình hành động 2013 được triển khai, các chỉ số hiệu quả du lịch tại Nhật Bản và hai trung tâm di sản hàng đầu là <strong>Thành phố Kyoto</strong> và <strong>Cố đô Nara</strong> đã có bước tăng trưởng nhảy vọt cả về quy mô lượng khách lẫn tổng mức chi tiêu.
              </p>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Khách quốc tế toàn quốc</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">31.9 Triệu</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+207%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Đỉnh 2019 (từ 10.4 triệu năm 2013)</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Chi tiêu du khách quốc tế</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">4.81 Nghìn tỷ ¥</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">x3.4 lần</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Gấp 3.4 lần so với 1.41T¥ (2013)</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Đóng góp vào GDP Nhật</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">7.5% GDP</span>
                  <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">41.9T ¥</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Nền kinh tế du lịch Top 3 thế giới</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tác động ngân sách Kyoto</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">39 Tỷ ¥ Thuế</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">12.8%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Tạo 153.000 việc làm cho Kyoto</p>
              </div>
            </div>

            {/* ==================================================== */}
            {/* 3.1.1 BIỂU ĐỒ SỐ LƯỢNG KHÁCH (VOLUME TELEMETRY HUB)   */}
            {/* ==================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 dark:bg-slate-900 dark:border-slate-800">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-xs font-black bg-[#8CE0F4] text-slate-950 dark:bg-slate-800 dark:text-[#9BE7FA]">
                      Nhóm 1 • Số lượng khách
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Biểu đồ {selectedVolumeMeta.chartId}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">(Trang {selectedVolumeMeta.pageInDoc} trong Niên luận)</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                    {isEn ? selectedVolumeMeta.nameEn : selectedVolumeMeta.nameVi}
                  </h4>
                  <p className="text-xs text-slate-500">Đơn vị đo lường: <strong>{isEn ? selectedVolumeMeta.unitEn : selectedVolumeMeta.unitVi}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <button
                      onClick={() => setVolumeViewMode('interactive')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        volumeViewMode === 'interactive'
                          ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>Biểu đồ Tương tác</span>
                    </button>
                    <button
                      onClick={() => setVolumeViewMode('authentic')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        volumeViewMode === 'authentic'
                          ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Ảnh Đồ thị Gốc</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleExportChart(`volume-chart-container-${volumeChartId}`, `Bieu-do-So-luong-${volumeChartId}`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 cursor-pointer"
                    title="Tải ảnh biểu đồ PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Volume Chart Tabs (3.1, 3.2, 3.3) */}
              <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-800 scrollbar-thin">
                {volumeCharts.map((item) => (
                  <button
                    key={item.chartId}
                    onClick={() => setVolumeChartId(item.chartId)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      volumeChartId === item.chartId
                        ? 'bg-[#0D7287] text-white shadow-xs font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    Biểu đồ {item.chartId} • {item.chartId === '3.1' ? 'Toàn quốc' : item.chartId === '3.2' ? 'Cố đô Kyoto' : 'Cố đô Nara'}
                  </button>
                ))}
              </div>

              {/* Volume Chart Rendering */}
              <div id={`volume-chart-container-${volumeChartId}`} className="pt-6 min-h-[360px]">
                {volumeViewMode === 'interactive' ? (
                  <div className="h-[340px] w-full">
                    {volumeChartId === '3.1' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={touristsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0D7287" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#0D7287" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} unit="M" />
                          <Tooltip formatter={(value: any) => [`${value} Triệu khách`, 'Khách quốc tế']} />
                          <Area type="monotone" dataKey="value" stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#colorTourists)" name="Lượng khách quốc tế (triệu người)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}

                    {volumeChartId === '3.2' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kyotoVisitorsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} unit="k" />
                          <Tooltip formatter={(value: any) => [`${value} Nghìn khách`, 'Khách quốc tế đến Kyoto']} />
                          <Bar dataKey="value" fill="#8CE0F4" stroke="#0D7287" strokeWidth={1} radius={[4, 4, 0, 0]} name="Khách đến TP Kyoto (nghìn người)" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {volumeChartId === '3.3' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={naraVisitorsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} unit="k" />
                          <Tooltip formatter={(value: any) => [`${value} Nghìn khách`, 'Khách quốc tế đến Nara']} />
                          <Bar dataKey="value" fill="#FFD14C" stroke="#B8860B" strokeWidth={1} radius={[4, 4, 0, 0]} name="Khách đến Cố đô Nara (nghìn người)" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                ) : (
                  <AcademicThesisMockup
                    chartId={selectedVolumeMeta.chartId}
                    nameVi={selectedVolumeMeta.nameVi}
                    nameEn={selectedVolumeMeta.nameEn}
                    unitVi={selectedVolumeMeta.unitVi}
                    unitEn={selectedVolumeMeta.unitEn}
                    pageInDoc={selectedVolumeMeta.pageInDoc}
                    data={volumeChartId === '3.1' ? touristsData : volumeChartId === '3.2' ? kyotoVisitorsData : naraVisitorsData}
                    isEn={isEn}
                  />
                )}
              </div>

              {/* Volume Commentary & Comparison Table */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 block font-bold mb-1 dark:text-white">
                  Phân tích học thuật về Lượng du khách (Niên luận):
                </strong>
                {volumeChartId === '3.1' && (
                  <p>
                    Lượng khách quốc tế đến Nhật Bản trước năm 2013 dao động ổn định trong khoảng 6 đến 8 triệu. Kể từ năm 2013, nhờ Chương trình hành động quốc gia, con số này tăng phi mã, chạm ngưỡng 19.7 triệu (2015) và đạt đỉnh lịch sử <strong>31.9 triệu lượt</strong> vào năm 2019. Năm 2020–2021 suy giảm mạnh do đại dịch COVID-19 và đã phục hồi ngoạn mục từ năm 2022–2023 đạt hơn 25 triệu lượt.
                  </p>
                )}
                {volumeChartId === '3.2' && (
                  <p>
                    Tại Thành phố Kyoto, trước năm 2013 lượng khách nước ngoài chưa bao giờ vượt quá 1 triệu người. Từ 2013, số lượng tăng vọt lên 1.8 triệu (2015), 3.1 triệu (2016) và lập kỷ lục <strong>4.5 triệu lượt</strong> năm 2019, đóng góp tới 12% tổng sản phẩm GRDP của cố đô.
                  </p>
                )}
                {volumeChartId === '3.3' && (
                  <p>
                    Cố đô Nara ghi nhận tốc độ tăng trưởng hàng năm ấn tượng 40%–60%, từ 174 nghìn lượt khách quốc tế (2011) lên tới <strong>3.3 triệu lượt</strong> vào năm 2019. Lượng khách tăng nhanh gấp gần 20 lần trong vòng chưa đầy một thập kỷ.
                  </p>
                )}

                {/* Kyoto vs Nara Table */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between dark:text-white text-xs">
                    <span>Đối sánh Lượng khách du lịch: Kyoto vs Nara (2013 - 2019)</span>
                    <span className="text-[10px] font-mono text-slate-400">Đơn vị: Nghìn người</span>
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold dark:border-slate-700">
                          <th className="py-1.5 px-2">Năm khảo sát</th>
                          <th className="py-1.5 px-2 text-[#0D7287] dark:text-[#9BE7FA]">Cố đô Kyoto (Khách quốc tế)</th>
                          <th className="py-1.5 px-2 text-amber-600 dark:text-amber-400">Cố đô Nara (Khách quốc tế)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {kyotoNaraVisitorsData.filter(d => ['2013', '2015', '2017', '2019'].includes(d.year)).map(d => (
                          <tr key={d.year}>
                            <td className="py-1.5 px-2 font-mono font-bold text-slate-600 dark:text-slate-400">{d.year}</td>
                            <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.kyoto.toLocaleString()}k khách</td>
                            <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.nara?.toLocaleString()}k khách</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* ==================================================== */}
            {/* 3.1.2 BIỂU ĐỒ DOANH THU & CHI TIÊU (REVENUE HUB)     */}
            {/* ==================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Nhóm 2 • Doanh thu & Chi tiêu
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Biểu đồ {selectedRevenueMeta.chartId}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">(Trang {selectedRevenueMeta.pageInDoc} trong Niên luận)</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                    {isEn ? selectedRevenueMeta.nameEn : selectedRevenueMeta.nameVi}
                  </h4>
                  <p className="text-xs text-slate-500">Đơn vị đo lường: <strong>{isEn ? selectedRevenueMeta.unitEn : selectedRevenueMeta.unitVi}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <button
                      onClick={() => setRevenueViewMode('interactive')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        revenueViewMode === 'interactive'
                          ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Biểu đồ Tương tác</span>
                    </button>
                    <button
                      onClick={() => setRevenueViewMode('authentic')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        revenueViewMode === 'authentic'
                          ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Ảnh Đồ thị Gốc</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleExportChart(`revenue-chart-container-${revenueChartId}`, `Bieu-do-Doanh-thu-${revenueChartId}`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 cursor-pointer"
                    title="Tải ảnh biểu đồ PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Revenue Chart Tabs (3.4, 3.5, 3.6) */}
              <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-800 scrollbar-thin">
                {revenueCharts.map((item) => (
                  <button
                    key={item.chartId}
                    onClick={() => setRevenueChartId(item.chartId)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      revenueChartId === item.chartId
                        ? 'bg-emerald-700 text-white shadow-xs font-black dark:bg-emerald-500 dark:text-slate-950'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    Biểu đồ {item.chartId} • {item.chartId === '3.4' ? 'Chi tiêu Toàn quốc' : item.chartId === '3.5' ? 'Doanh thu Kyoto' : 'Chi tiêu Nara'}
                  </button>
                ))}
              </div>

              {/* Revenue Chart Rendering */}
              <div id={`revenue-chart-container-${revenueChartId}`} className="pt-6 min-h-[360px]">
                {revenueViewMode === 'interactive' ? (
                  <div className="h-[340px] w-full">
                    {revenueChartId === '3.4' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={spendNationalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} unit="T¥" />
                          <Tooltip formatter={(value: any) => [`${value} Nghìn tỷ Yên`, 'Chi tiêu khách quốc tế']} />
                          <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Chi tiêu quốc tế (nghìn tỷ Yên)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}

                    {revenueChartId === '3.5' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kyotoSpendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} unit="B¥" />
                          <Tooltip formatter={(value: any) => [`${value} Tỷ Yên`, 'Chi tiêu tại Kyoto']} />
                          <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name="Chi tiêu du lịch TP Kyoto (tỷ Yên)" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {revenueChartId === '3.6' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={naraSpendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} unit="B¥" />
                          <Tooltip formatter={(value: any) => [`${value} Tỷ Yên`, 'Chi tiêu tại Nara']} />
                          <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Chi tiêu du lịch Cố đô Nara (tỷ Yên)" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                ) : (
                  <AcademicThesisMockup
                    chartId={selectedRevenueMeta.chartId}
                    nameVi={selectedRevenueMeta.nameVi}
                    nameEn={selectedRevenueMeta.nameEn}
                    unitVi={selectedRevenueMeta.unitVi}
                    unitEn={selectedRevenueMeta.unitEn}
                    pageInDoc={selectedRevenueMeta.pageInDoc}
                    data={revenueChartId === '3.4' ? spendNationalData : revenueChartId === '3.5' ? kyotoSpendData : naraSpendData}
                    isEn={isEn}
                  />
                )}
              </div>

              {/* Revenue Commentary & GDP Contribution Table */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 block font-bold mb-1 dark:text-white">
                  Phân tích học thuật về Doanh thu & Đóng góp Kinh tế:
                </strong>
                {revenueChartId === '3.4' && (
                  <p>
                    Tổng chi tiêu du lịch của khách quốc tế tại Nhật Bản tăng từ 1.41 nghìn tỷ Yên (2013) lên đỉnh điểm <strong>4.81 nghìn tỷ Yên</strong> (2019), tăng gấp 3.4 lần trong 7 năm, đưa ngành du lịch trở thành động lực xuất khẩu dịch vụ hàng đầu đất nước.
                  </p>
                )}
                {revenueChartId === '3.5' && (
                  <p>
                    Doanh thu du lịch tại Kyoto tăng trưởng bền bỉ từ 601 tỷ Yên (2008) lên <strong>1.308 tỷ Yên</strong> (2019), tạo nguồn thu thuế trực tiếp 39 tỷ Yên, tương đương 12.8% tổng thu ngân sách thành phố.
                  </p>
                )}
                {revenueChartId === '3.6' && (
                  <p>
                    Tại Cố đô Nara, tổng chi tiêu du lịch tăng từ 872 tỷ Yên (2013) lên đỉnh <strong>1.208 tỷ Yên</strong> (2018). Mức chi tiêu duy trì ổn định và nhanh chóng hồi phục đạt 598 tỷ Yên vào năm 2022 sau cú sốc đại dịch.
                  </p>
                )}

                {/* GDP Contribution Table */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between dark:text-white text-xs">
                    <span>Tăng trưởng Đóng góp GDP Quốc gia của Ngành Du lịch (2000 - 2019)</span>
                    <span className="text-[10px] font-mono text-slate-400">Nguồn: METI & WTTC</span>
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold dark:border-slate-700">
                          <th className="py-1.5 px-2">Năm thống kê</th>
                          <th className="py-1.5 px-2 text-emerald-600 dark:text-emerald-400">Tỷ trọng trong tổng GDP</th>
                          <th className="py-1.5 px-2">Quy mô Doanh thu trực tiếp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {gdpShareData.map(d => (
                          <tr key={d.year}>
                            <td className="py-1.5 px-2 font-mono font-bold text-slate-600 dark:text-slate-400">{d.year}</td>
                            <td className="py-1.5 px-2 font-bold text-emerald-600 dark:text-emerald-400">{d.gdpShare}% GDP</td>
                            <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.directRevenue} Nghìn tỷ ¥</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ==================================================== */}
          {/* 3.2 TIÊU CHÍ BẢO TỒN VÀ QUẢN LÝ (CASE STUDIES)     */}
          {/* ==================================================== */}
          <div className="pt-6">
            <div className="max-w-4xl mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
                <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span>3.2. Sự phát triển nhìn từ tiêu chí bảo tồn và quản lý di sản (Case Studies)</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed dark:text-slate-300">
                Song hành cùng tăng trưởng kinh tế là những hệ lụy tiêu cực sâu sắc: tình trạng <strong>quá tải du lịch (Overtourism / 観光公害 - Kanko Kogai)</strong>, mâu thuẫn dân cư bản địa, thương mại hóa làm xói mòn tính nguyên bản và ô nhiễm môi trường. Dưới đây là khảo sát thực tiễn 5 trường hợp điển hình cùng các giải pháp quản trị sáng tạo của Nhật Bản.
              </p>
            </div>

            {/* Case Studies Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
              {[
                { id: 'kyoto', label: 'Cố đô Kyoto', sub: 'Camera AI & Thuế du lịch' },
                { id: 'nara', label: 'Cố đô Nara', sub: 'Bảo tồn hươu & Minpaku' },
                { id: 'fuji', label: 'Núi Phú Sĩ', sub: 'Quỹ 1.000¥ & Bảo tàng VR' },
                { id: 'shirakawago', label: 'Làng Shirakawa-go', sub: 'Đặt trước 100% Light-up' },
                { id: 'miyajima', label: 'Đền Itsukushima', sub: 'Thuế vào đảo 100¥ Miyajima' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCaseStudy(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                    activeCaseStudy === tab.id
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-xs font-black dark:bg-slate-800 dark:text-[#9BE7FA]'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="block">{tab.label}</span>
                  <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">{tab.sub}</span>
                </button>
              ))}
            </div>

            {/* Case Study Detailed View */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800">
              
              {/* CASE 1: KYOTO */}
              {activeCaseStudy === 'kyoto' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold text-[#0D7287] uppercase tracking-wider dark:text-[#9BE7FA]">Case Study 01</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                        Cố đô Kyoto: Quá tải xe buýt, Live camera Kyoto Comfort Map & Rác thải
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold w-fit dark:bg-amber-950/60 dark:text-amber-300">
                      4.5M du khách (2019)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Thực trạng khủng hoảng (Overtourism)</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Lượng khách bùng nổ quanh các địa điểm Gion và Kinkakuji khiến mạng lưới xe buýt công cộng bị tê liệt. Người dân bản địa thường xuyên không thể lên xe để đi làm hoặc đi khám bệnh do xe buýt luôn chật kín du khách với hành lý cồng kềnh.
                      </p>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        <strong>"Trò chơi mèo vờn chuột" với rác thải:</strong> Tại các con phố cổ Arashiyama và Higashiyama, vỏ lon và hộp nhựa chất đống tràn ngập các thùng rác công cộng, phát sinh chi phí dọn dẹp khổng lồ cho thành phố. Khách sạn tăng từ 30.000 lên 53.000 phòng vẫn thiếu, dẫn đến làn sóng minpaku tự phát trong khu chung cư gây xung đột nếp sống.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Giải pháp quản trị của Thành phố Kyoto</span>
                      </h5>
                      <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                        <li>
                          <strong>Kyoto Comfort Map (京都観光快適度マップ):</strong> Lắp đặt camera AI tại các điểm nóng để phát trực tiếp mức độ đông đúc theo thời gian thực, khuyến khích du khách chủ động né giờ cao điểm.
                        </li>
                        <li>
                          <strong>Phân tán không gian & thời gian:</strong> Quảng bá 6 khu vực di sản ngoại ô ít người biết; kết hợp với tập đoàn JR Tokai triển khai các tour tham quan sáng sớm (Morning Tours) và ngắm cảnh đêm (Night Tours).
                        </li>
                        <li>
                          <strong>Chất lượng hơn số lượng:</strong> Thu hút các chuỗi nghỉ dưỡng siêu sang (Park Hyatt Kyoto, Aman Kyoto) để gia tăng nguồn thu từ đối tượng có mức chi tiêu cao mà không làm gia tăng quá mức áp lực dân số vãng lai.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 2: NARA */}
              {activeCaseStudy === 'nara' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider dark:text-amber-400">Case Study 02</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                        Cố đô Nara: Vấn nạn bảo vệ đàn hươu thần & Pháp lệnh lưu trú cao cấp
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold w-fit dark:bg-emerald-950/60 dark:text-emerald-300">
                      3.3M du khách (2019)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Mối lo ngại sinh thái đàn hươu công viên Nara</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Hơn 1.200 chú hươu tại Công viên Nara và Đền Kasuga Taisha là biểu tượng văn hóa thiêng liêng. Tuy nhiên, du khách đông đúc thường cho hươu ăn thức ăn không phù hợp, vứt túi nilon khiến nhiều chú hươu nuốt phải và tử vong. Ngoài ra, việc bảo tồn nghiêm ngặt khiến đàn hươu gia tăng số lượng, tràn ra ngoài phá hoại cây trồng nông nghiệp của người dân.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pháp lệnh lưu trú & Tái thiết di sản</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Tỉnh Nara ban hành <em>"Pháp lệnh đảm bảo quản lý hợp lý doanh nghiệp lưu trú"</em> (奈良県住宅宿泊事業の適正な運営の確保に関する条例). Cung cấp trợ cấp đặc biệt để thu hút các khách sạn đẳng cấp quốc tế (Fufu Nara, JW Marriott Hotel Nara, Fairfield by Marriott Tenri), đồng thời cho phép cải tạo các công trình cổ có giá trị văn hóa thành cơ sở lưu trú cao cấp giữ chân du khách qua đêm thay vì chỉ đi về trong ngày từ Osaka/Kyoto.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 3: FUJI */}
              {activeCaseStudy === 'fuji' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider dark:text-indigo-400">Case Study 03</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                        Núi Phú Sĩ: Quỹ bảo tồn tự nguyện 1.000¥, Đề án đường sắt & Trung tâm VR
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold w-fit dark:bg-indigo-950/60 dark:text-indigo-300">
                      5.06M du khách (2019)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Áp lực quá tải sườn núi & Khí thải xe cá nhân</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Năm 2019, 5.06 triệu người đến thăm núi Phú Sĩ (gấp 2.2 lần so với năm 2012 trước khi được công nhận di sản). Hàng vạn người leo núi cùng lúc gây tắc nghẽn nguy hiểm trên các cung đường dốc, tắc nghẽn nhà vệ sinh và lượng khí thải khổng lồ từ xe buýt, ô tô cá nhân đổ dồn lên trạm số 5 Subaru Line.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Bộ công cụ giải pháp bền vững</span>
                      </h5>
                      <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                        <li>
                          <strong>Quỹ hợp tác bảo tồn Núi Phú Sĩ (2014):</strong> Vận động phí đóng góp tự nguyện 1.000 Yên/người leo núi, tạo nguồn tài chính bảo trì nhà vệ sinh sinh thái, xử lý rác và cứu hộ y tế.
                        </li>
                        <li>
                          <strong>Đề án Đường sắt leo núi Fuji (Fuji Mountain Railway):</strong> Đề xuất cấm hoàn toàn xe ô tô cá nhân, chỉ cho phép đi tàu điện leo núi có kiểm soát số lượng theo giờ.
                        </li>
                        <li>
                          <strong>Trung tâm Di sản Thế giới Núi Phú Sĩ (2017):</strong> Xây dựng bảo tàng rộng 6.100 m² tại Shizuoka với công nghệ leo núi thực tế ảo VR, giúp du khách trải nghiệm đỉnh Phú Sĩ từ xa mà không cần leo núi thực.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 4: SHIRAKAWA-GO */}
              {activeCaseStudy === 'shirakawago' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">Case Study 04</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                        Làng cổ Shirakawa-go: Chế độ đặt chỗ trước 100% Lễ hội Ánh sáng Winter Light-up
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold w-fit dark:bg-purple-950/60 dark:text-purple-300">
                      600 dân vs 1.8M khách
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Tỷ lệ nghịch ngạc nhiên: Du khách gấp 3.000 lần dân số</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Ngôi làng cổ kính nép mình giữa thung lũng tuyết chỉ có vỏn vẹn khoảng 600 cư dân sinh sống nhưng đón tới <strong>1.8 triệu lượt du khách mỗi năm</strong> (gấp 3.000 lần dân số). Trong các đêm Lễ hội Ánh sáng Mùa đông (Shirakawago Winter Light-up), hàng nghìn du khách chen lấn trên đài quan sát hẹp và đường làng, gây nguy cơ giẫm đạp và làm đảo lộn hoàn toàn sự yên bình của làng quê.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Hệ thống đặt chỗ nghiêm ngặt (Advance Reservation)</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Chính quyền làng quyết định chuyển đổi Lễ hội Ánh sáng sang hình thức <strong>đặt chỗ trước 100% (Complete Reservation System)</strong>. Chỉ những khách đặt trước qua đêm tại làng hoặc mua vé xe buýt có số ghế kèm vé lên đài quan sát mới được phép vào làng sau 17h. Xe ô tô cá nhân không có giấy phép đăng ký đỗ xe trước bị cấm vào làng tuyệt đối. Giải pháp này đã xóa bỏ hoàn toàn cảnh hỗn loạn, đảm bảo an toàn tuyệt đối và nâng tầm trải nghiệm của du khách.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 5: MIYAJIMA */}
              {activeCaseStudy === 'miyajima' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider dark:text-purple-400">Case Study 05</span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                        Đền Itsukushima (Miyajima): Thuế vào đảo 100 Yên tái thiết di sản
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold w-fit dark:bg-blue-950/60 dark:text-blue-300">
                      4.6M du khách (2019)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Chi phí duy tu đền nổi & Quá tải hòn đảo</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Đền Thần đạo Itsukushima với cổng Torii màu đỏ son khổng lồ cắm thẳng xuống biển thủy triều đón tới <strong>4.6 triệu du khách</strong> năm 2019. Việc các công trình bằng gỗ liên tục tiếp xúc với nước biển mặn khiến chi phí bảo dưỡng, trùng tu và thu dọn vệ sinh trên đảo là gánh nặng tài chính khổng lồ đối với ngân sách thị trấn Hatsukaichi.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Chính sách thuế vào đảo (Miyajima Visitor Tax)</span>
                      </h5>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Thành phố Hatsukaichi chính thức áp dụng <strong>Thuế vào đảo Miyajima (入島税)</strong> với mức 100 Yên/người thu trực tiếp qua giá vé phà. Nguồn thu thuế chuyên dụng này được chuyển thẳng vào quỹ bảo tồn cảnh quan và trùng tu đền thờ, vừa san sẻ chi phí với du khách một cách công bằng, vừa điều tiết mật độ khách lên đảo bền vững qua nhiều thế hệ.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. KẾT LUẬN (#ket-luan)                                  */}
      {/* ======================================================== */}
      <section id="ket-luan" className="py-16 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <SectionHeader
            variant="stacked"
            id="ket-luan"
            badge={isEn ? 'Part III • Synthesis & Policy Implications' : 'Phần Kết Luận • Tổng kết & Hàm ý chính sách'}
            title={isEn ? 'Synthesis & Key Takeaways for Sustainable Heritage Tourism' : 'Kết luận & Bài học kinh nghiệm từ Nhật Bản'}
            onCopy={copyDeepLink}
          />

          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            <p>
              Qua toàn bộ khảo sát định lượng và nghiên cứu chính sách từ năm 2013 đến nay, bài niên luận đã khẳng định rằng du lịch di sản tại Nhật Bản đã có sự phát triển vượt bậc cả về quy mô lượng khách, doanh thu và tỷ trọng đóng góp vào nền kinh tế quốc gia. Sự thành công này được xây dựng trên nền tảng vững chắc của <strong>Luật Bảo vệ Di sản Văn hóa (1950 & sửa đổi 2004)</strong> cùng sự vào cuộc quyết liệt, đồng bộ của chính phủ qua <strong>Chương trình hành động hướng tới quốc gia du lịch (2013)</strong>.
            </p>

            {/* 4 Key Policy Lessons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#8CE0F4] text-slate-950 font-black text-sm mb-3">01</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Chuyển dịch sang bảo tồn động</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Từ bỏ tư duy bảo tồn khép kín trong bảo tàng sang mô hình kết hợp bảo tồn với phát huy giá trị di sản (tiêu biểu là đề án Japan Heritage), biến di sản thành tài sản phát triển kinh tế sinh lời cho xã hội.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-200 text-amber-950 font-black text-sm mb-3">02</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Ứng dụng công nghệ quản trị thông minh</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Sử dụng bản đồ trực tiếp camera AI mật độ (Kyoto Comfort Map), hệ thống đặt chỗ trước bắt buộc (Shirakawa-go) và công nghệ thực tế ảo VR (Núi Phú Sĩ) để chủ động điều tiết dòng du khách.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-200 text-emerald-950 font-black text-sm mb-3">03</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Đa dạng hóa công cụ tài chính</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Linh hoạt áp dụng thuế du khách vào đảo (Miyajima), quỹ bảo tồn tự nguyện (Núi Phú Sĩ) và thuế lưu trú để tạo nguồn ngân sách bền vững tái đầu tư cho công tác trùng tu và dọn dẹp vệ sinh.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-200 text-purple-950 font-black text-sm mb-3">04</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Đặt cư dân bản địa làm trung tâm</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Không đánh đổi cuộc sống bình yên của người dân lấy tăng trưởng du lịch nóng. Khi có xung đột lợi ích, các chính quyền địa phương lập tức ban hành chế tài quản lý lưu trú và giải tỏa giao thông dân sinh.
                </p>
              </div>
            </div>

            <p className="text-sm italic text-slate-600 border-l-4 border-[#0D7287] pl-4 py-1 dark:text-slate-400 dark:border-[#9BE7FA]">
              "Du lịch di sản chỉ có thể phát triển bền vững khi và chỉ khi nó tôn trọng tính nguyên bản của lịch sử, nâng cao phúc lợi kinh tế cho cộng đồng sở tại và bảo toàn trọn vẹn cảnh quan môi trường cho muôn đời sau." - Ma Văn Hùng (2024).
            </p>
          </div>
        </div>
      </section>



      {/* ======================================================== */}
      {/* FOOTER                                                   */}
      {/* ======================================================== */}
      <footer className="py-10 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="text-slate-300 font-bold text-sm">
            {THESIS_METADATA.universityVi} • {THESIS_METADATA.facultyVi}
          </p>
          <p>
            Đề tài niên luận: <em>"{THESIS_METADATA.titleVi}"</em> • Tác giả: {THESIS_METADATA.author} ({THESIS_METADATA.cohort}) • GVHD: {THESIS_METADATA.advisor}
          </p>
          <p className="text-slate-500 pt-2 border-t border-slate-800">
            Dữ liệu trực quan hóa học thuật và chuyển giao công nghệ phân tích dữ liệu du lịch bền vững.
          </p>
        </div>
      </footer>

    </div>
  );
}
