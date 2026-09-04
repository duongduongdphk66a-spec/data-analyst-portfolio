'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Landmark, FileText, 
  BookOpen, ExternalLink, Download, Link as LinkIcon
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';

import {
  touristsData, kyotoNaraVisitorsData, spendNationalData,
  gdpShareData,
} from '../data/heritageJapanData';

import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useToast } from './ui/Toast';
import { exportChartAsPng } from '../lib/chartExport';

const HERITAGE_JAPAN_SECTIONS = ['overview', 'boi-canh', 'chinh-sach', 'du-lieu', 'giai-phap', 'ket-luan'];

export default function HeritageJapanProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const isEn = language === 'en';

  const [activeChartTab, setActiveChartTab] = useState<'national' | 'kyotonara' | 'spending' | 'macro'>('national');

  const copyDeepLink = (sectionId: string, title: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
      navigator.clipboard.writeText(url);
      showToast(isEn ? `Copied link to ${title}!` : `Đã sao chép liên kết mục ${title}!`, 'success');
    }
  };

  const handleExportChart = async (elementId: string, name: string) => {
    const ok = await exportChartAsPng(elementId, `${name}.png`);
    if (ok) {
      showToast(isEn ? `Exported ${name} as PNG!` : `Đã tải ảnh biểu đồ ${name}!`, 'success');
    }
  };

  const activeSection = useScrollSpy(HERITAGE_JAPAN_SECTIONS, 130);

  const navItems = [
    { id: 'boi-canh', label: isEn ? 'Context' : 'Bối cảnh' },
    { id: 'chinh-sach', label: isEn ? 'Policy Matrix' : 'Chính sách' },
    { id: 'du-lieu', label: isEn ? 'Telemetry & Charts' : 'Dữ liệu' },
    { id: 'giai-phap', label: isEn ? 'Case Studies' : 'Thực nghiệm' },
    { id: 'ket-luan', label: isEn ? 'Synthesis' : 'Tổng kết' },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const targetId = id === 'boi-canh' ? 'boi-canh' : id;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Sự phát triển của Du lịch Di sản tại Nhật Bản', 'proj-heritage-japan', 'project');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-element').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white font-lora text-slate-900 selection:bg-[#FFE485]/40 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Sticky Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 transition-all dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = activeSection === item.id || (item.id === 'boi-canh' && activeSection === 'overview');
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40 dark:bg-slate-800 dark:text-[#9BE7FA] dark:shadow-none'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 font-semibold'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            
            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-heritage-japan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors ml-1.5 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer ml-1 border border-[#FFD14C] dark:bg-slate-900 dark:text-white dark:border-slate-800 dark:hover:bg-slate-800"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="overview" className="relative bg-gradient-to-b from-[#F3FCFE] via-[#FFFDF5] to-[#FFF9E6] text-slate-900 pt-16 pb-20 overflow-hidden border-b border-slate-200/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white dark:border-slate-800">
        
        {/* Subtle Sun Accent Graphic */}
        <div className="absolute right-[6%] top-[12%] w-52 h-52 rounded-full bg-gradient-to-tr from-[#FFE485] via-[#FFD14C] to-[#E5B830] opacity-35 blur-2xl pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Metadata pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-md text-xs font-bold tracking-wide text-slate-900 mb-6 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <BookOpen className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{isEn ? 'ACADEMIC THESIS & DATA ANALYTICS CASE STUDY' : 'CÔNG TRÌNH NIÊN LUẬN & TRỰC QUAN HÓA DỮ LIỆU ĐỊNH LƯỢNG'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.15] mb-6 tracking-tight text-slate-950 dark:text-white">
            {isEn ? 'The Evolution of Heritage Tourism in Japan' : 'Sự Phát Triển Của Du Lịch Di Sản Tại Nhật Bản'} <br/>
            <span className="text-[#0D7287] dark:text-[#9BE7FA] text-2xl sm:text-4xl lg:text-5xl font-extrabold">
              {isEn ? 'From 2013 Policy Shift to Sustainable Transformation' : 'Giai Đoạn Từ Năm 2013 Đến Nay'}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mb-8 leading-relaxed dark:text-slate-300">
            {isEn 
              ? 'Quantitative empirical study investigating 20 years of international inbound tourist flow, regional expenditure trajectories (Kyoto, Nara, Mt. Fuji, Shirakawa-go), macroeconomic GDP contributions, and policy tensions between explosive growth and sustainable preservation.'
              : 'Công trình nghiên cứu định lượng phân tích chuỗi số liệu 20 năm về lượng du khách quốc tế, chi tiêu du lịch tại các điểm di sản trọng điểm (Kyoto, Nara, Núi Phú Sĩ, Shirakawa-go), tỷ trọng đóng góp GDP và bài toán cân bằng giữa tăng trưởng nóng với bảo tồn bền vững.'}
          </p>

          {/* Academic Origin Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs mb-10 max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'RESEARCHER & ACADEMIC ADVISOR' : 'TÁC GIẢ NGHIÊN CỨU & GIẢNG VIÊN HƯỚNG DẪN'}
              </div>
              <div className="text-sm font-bold text-slate-950 dark:text-white">
                Ma Văn Hùng <span className="text-slate-500 font-normal">({isEn ? 'Japanese Studies, USSH - VNU, Cohort QH-2021-X' : 'Ngành Nhật Bản học, Khoa Đông Phương học, ĐHKHXH&NV, ĐHQGHN'})</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {isEn ? 'Supervised by: Dr. Vo Minh Vu' : 'Giảng viên hướng dẫn: TS Võ Minh Vũ'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FFE485]/40 text-slate-900 border border-[#FFD14C] text-xs font-serif font-bold dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700">
                {isEn ? 'Grade: Excellent' : 'Hà Nội, 2024'}
              </span>
            </div>
          </div>

          {/* Key Metric Telemetry Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">31.9M</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'Peak Inbound Tourists (2019)' : 'Đỉnh khách quốc tế (2019)'}</div>
              <div className="text-[11px] text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? '+207% vs 2013' : 'Gấp ~3 lần năm 2013'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">4.81T ¥</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'Tourist Spending (2019)' : 'Chi tiêu khách quốc tế (2019)'}</div>
              <div className="text-[11px] text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? '3.4x surge in 7 yrs' : 'Tăng gấp 3.4 lần trong 7 năm'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">7.5%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'GDP Contribution (2019)' : 'Tỷ trọng đóng góp GDP (2019)'}</div>
              <div className="text-[11px] text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? 'Rank #3 Global Tourism' : 'Đứng #3 nền kinh tế du lịch'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-serif text-slate-950 dark:text-white">25</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'UNESCO World Heritage Sites' : 'Di sản Thế giới UNESCO'}</div>
              <div className="text-[11px] text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? '20 Cultural · 5 Natural' : '20 Văn hóa : 5 Thiên nhiên'}</div>
            </div>
          </div>

        </div>
      </header>

      {/* SECTION 1: BỐI CẢNH & CÂU HỎI NGHIÊN CỨU */}
      <section id="boi-canh" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>01 : CHƯƠNG 1 : TỔNG QUAN & BỐI CẢNH</span>
            </div>
            <button
              onClick={() => copyDeepLink('boi-canh', isEn ? 'Context' : 'Bối cảnh nghiên cứu')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title={isEn ? 'Copy link to section' : 'Sao chép liên kết mục'}
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
            {isEn ? 'Heritage Tourism Explosion: 31.9 Million Foreign Visitors' : 'Du Lịch Di Sản: Động Lực Tăng Trưởng Kinh Tế Chiến Lược'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FCFD] border border-slate-200/90 space-y-4 dark:bg-slate-900/60 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? 'Core Research Question' : 'Câu Hỏi Nghiên Cứu Cốt Lõi'}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-4 border-[#9BE7FA] pl-4 dark:text-slate-300">
              {isEn
                ? '"How has heritage tourism in Japan evolved since the 2013 Action Program, and how does the nation balance economic returns against overtourism pressures?"'
                : '"Du lịch di sản tại Nhật Bản đã phát triển như thế nào từ năm 2013 đến nay dưới tác động của Chương trình hành động quốc gia du lịch, và Nhật Bản đã giải quyết bài toán mâu thuẫn giữa hiệu quả kinh tế với áp lực quá tải di sản ra sao?"'}
            </p>
            <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">•</span>
                <span><b>{isEn ? 'Temporal Scope:' : 'Phạm vi thời gian:'}</b> 2013 - 2023 (Cột mốc Hội nghị Bộ trưởng Xúc tiến Du lịch lần 2 thông qua chiến lược Japan is Back).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">•</span>
                <span><b>{isEn ? 'Spatial Scope:' : 'Phạm vi không gian:'}</b> 25 Di sản Thế giới UNESCO tại Nhật Bản, tập trung sâu vào Cố đô Kyoto, Cố đô Nara, Núi Phú Sĩ, Làng cổ Shirakawa-go và Đền Itsukushima.</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-4 shadow-xs dark:bg-slate-900/60 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? 'Global Heritage Market Context' : 'Bối Cảnh Thị Trường Du Lịch Di Sản Toàn Cầu'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FFE485] dark:bg-slate-800/80 dark:border-slate-700">
                <div className="text-2xl font-black font-serif text-slate-950 dark:text-[#FFD14C]">40%</div>
                <div className="text-xs text-slate-600 mt-1 dark:text-slate-400">{isEn ? 'of global travelers choose cultural heritage destinations (UNWTO)' : 'du khách toàn cầu chọn điểm đến di sản văn hóa (UNWTO)'}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#C8EEF7]/50 border border-[#9BE7FA] dark:bg-slate-800/80 dark:border-slate-700">
                <div className="text-2xl font-black font-serif text-slate-950 dark:text-[#9BE7FA]">556.9B $</div>
                <div className="text-xs text-slate-600 mt-1 dark:text-slate-400">{isEn ? 'Global Heritage Tourism Revenue (CAGR 3.8% to $778B in 2030)' : 'Quy mô doanh thu du lịch di sản toàn cầu năm 2021'}</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
              {isEn
                ? 'Asia-Pacific accounts for ~40% global heritage tourism market share, predominantly driven by China, India and Japan.'
                : 'Khu vực Châu Á - Thái Bình Dương nắm giữ khoảng 40% thị phần doanh thu du lịch di sản toàn cầu, chủ yếu được đóng góp bởi Nhật Bản, Trung Quốc và Ấn Độ.'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHÍNH SÁCH BẢO TỒN VÀ DU LỊCH DI SẢN */}
      <section id="chinh-sach" className="py-16 bg-[#F8FCFD] border-y border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <span>02 : CHƯƠNG 2 : HỆ THỐNG PHÁP LÝ & CHÍNH SÁCH</span>
              </div>
              <button
                onClick={() => copyDeepLink('chinh-sach', isEn ? 'Policy Matrix' : 'Chính sách bảo tồn')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                title={isEn ? 'Copy link to section' : 'Sao chép liên kết mục'}
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Policy Evolution: Legal Conservation First, Tourism Action Program Follows' : 'Tiến Trình Chính Sách: Pháp Lý Đi Trước, Du Lịch Theo Sau'}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                period: '1897 - 1950',
                title: isEn ? 'Cultural Properties Protection Law' : 'Luật Bảo vệ Di sản Văn hóa (1950)',
                desc: isEn ? 'Unified 3 early preservation laws from Meiji era; established core protections for tangible and intangible cultural assets.' : 'Hợp nhất 3 đạo luật từ thời Minh Trị (1897), bảo vệ toàn diện di sản vật thể, phi vật thể, cổ vật và công trình kiến trúc cổ.'
              },
              {
                period: '2004',
                title: isEn ? '2004 Law Revision: Cultural Landscapes' : 'Sửa đổi Luật Di sản Văn hóa (2004)',
                desc: isEn ? 'Added legal preservation for Cultural Landscapes (文化的景観) and Traditional Building Clusters, safeguarding surrounding buffer zones.' : 'Bổ sung chế độ bảo tồn “Cảnh quan Văn hóa” và Quần thể kiến trúc truyền thống, bảo vệ toàn diện không gian đệm bao quanh di sản.'
              },
              {
                period: '2006 - 2008',
                title: isEn ? 'Tourism Nation Act & JTA Agency' : 'Luật Du lịch Quốc gia & JTA (2008)',
                desc: isEn ? 'Established Japan Tourism Agency (JTA) and chartered the Historic Towns Planning Act (2008) resolving regional development with heritage.' : 'Ban hành Luật Quy hoạch Thị trấn Lịch sử (2008), thành lập Cơ quan Du lịch Nhật Bản (JTA) để phát triển bền vững.'
              },
              {
                period: '2013 - Nay',
                title: isEn ? '2013 Action Program: Japan is Back' : 'Chương trình hành động Du lịch (2013)',
                desc: isEn ? 'Relaxed visas for ASEAN, expanded hospitality capacity, deployed multilingual systems, promoted "Brand Japan" globally.' : 'Nới lỏng visa cho Đông Nam Á (Việt Nam, Thái Lan), mở rộng lưu trú, thanh toán thẻ quốc tế, phát triển chiến lược "Thương hiệu Nhật Bản".'
              }
            ].map((item) => (
              <div key={item.period} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-serif text-xs font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
                  {item.period}
                </span>
                <h4 className="text-sm font-black text-slate-950 leading-snug dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF9E6] border border-[#FFE485] text-xs sm:text-sm text-slate-800 flex items-start gap-3 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
            <FileText className="w-5 h-5 text-[#0D7287] dark:text-[#FFD14C] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <b>{isEn ? 'Key Analytical Finding:' : 'Phát hiện phân tích chính:'}</b> {isEn 
                ? 'Japan succeeded because administrative heritage conservation systems were enacted decades before mass tourism promotion, establishing robust preservation guardrails prior to the 2013 explosion.'
                : 'Sự thành công của Nhật Bản bắt nguồn từ việc xây dựng thể chế bảo tồn di sản vững chắc từ trước (Luật 1950, 2004), tạo hàng rào bảo vệ trước khi mở cửa bùng nổ du lịch năm 2013.'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRỰC QUAN HÓA SỐ LIỆU ĐỊNH LƯỢNG (INTERACTIVE TELEMETRY) */}
      <section id="du-lieu" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <span>03 : CHƯƠNG 3 : PHÂN TÍCH HIỆU QUẢ DU LỊCH</span>
              </div>
              <button
                onClick={() => copyDeepLink('du-lieu', isEn ? 'Telemetry & Charts' : 'Số liệu định lượng')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                title={isEn ? 'Copy link to section' : 'Sao chép liên kết mục'}
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Interactive Quantitative Telemetry (6 Datasets)' : 'Trực Quan Hóa Chuỗi Số Liệu Định Lượng'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isEn ? 'Select an analytical perspective to inspect data points transcribed from the thesis.' : 'Chọn góc nhìn phân tích để khám phá chi tiết các bảng số liệu trích xuất từ niên luận.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => setActiveChartTab('national')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'national' 
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]' 
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {isEn ? '1. National Inbound (2003-22)' : '1. Khách Toàn Quốc'}
            </button>
            <button
              onClick={() => setActiveChartTab('kyotonara')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'kyotonara' 
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]' 
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {isEn ? '2. Kyoto vs Nara Inbound' : '2. Kyoto & Nara'}
            </button>
            <button
              onClick={() => setActiveChartTab('spending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'spending' 
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]' 
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {isEn ? '3. Expenditure Surge' : '3. Chi Tiêu Du Lịch'}
            </button>
            <button
              onClick={() => setActiveChartTab('macro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'macro' 
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]' 
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {isEn ? '4. Macro GDP Impact' : '4. GDP & Việc Làm'}
            </button>
          </div>
        </div>

        {/* Dynamic Chart Display Container */}
        <div id="heritage-japan-main-chart" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-end no-print">
            <button
              onClick={() => handleExportChart('heritage-japan-main-chart', `japan-heritage-${activeChartTab}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={isEn ? 'Export chart as PNG' : 'Tải ảnh biểu đồ PNG'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Export PNG' : 'Xuất PNG'}</span>
            </button>
          </div>

          {/* TAB 1: TOÀN QUỐC */}
          {activeChartTab === 'national' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {isEn ? 'Biểu đồ 3.1: International Inbound Arrivals to Japan (2003 - 2022)' : 'Biểu đồ 3.1: Số lượng khách du lịch nước ngoài đến Nhật Bản (2003 - 2022)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nguồn: Sách trắng Bộ Đất đai, Cơ sở hạ tầng, Giao thông và Du lịch Nhật Bản (MLIT)
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#C8EEF7]/50 text-slate-900 border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                  Đơn vị: Triệu lượt khách
                </span>
              </div>

              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={touristsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nationalInboundGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9BE7FA" stopOpacity={0.7}/>
                        <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      formatter={(val: number | string | readonly (string | number)[] | undefined) => [`${val} triệu lượt`, 'Khách quốc tế']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0D7287" strokeWidth={2.5} fill="url(#nationalInboundGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 dark:text-white">Giai đoạn 2003 - 2012:</span>
                  Khách quốc tế đi ngang quanh mức 6.2M - 8.6M lượt khách/năm.
                </div>
                <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#FFE485] dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 dark:text-white">Giai đoạn 2013 - 2019:</span>
                  Tăng trưởng vượt bậc từ 10.4M lên 31.9M lượt khách (tăng 207% trong 6 năm).
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 dark:text-white">Giai đoạn 2020 - 2022:</span>
                  Sụt giảm do COVID-19 (chạm đáy 0.2M năm 2021) và phục hồi mạnh mẽ từ 2023.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SO SÁNH KYOTO VS NARA */}
          {activeChartTab === 'kyotonara' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {isEn ? 'Biểu đồ 3.2 & 3.3: Inbound Tourists to Historic Kyoto and Nara (2009 - 2023)' : 'Biểu đồ 3.2 & 3.3: Lượng khách quốc tế tại Cố đô Kyoto và Cố đô Nara'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nguồn: Cục Du lịch Tỉnh Kyoto & Ban Xúc tiến Du lịch Tỉnh Nara
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FFE485]/40 text-slate-900 border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                  Đơn vị: Nghìn lượt khách
                </span>
              </div>

              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kyotoNaraVisitorsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      formatter={(val: number | string | readonly (string | number)[] | undefined) => [`${val} nghìn khách`, '']}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" dataKey="kyoto" name="Cố đô Kyoto" stroke="#0D7287" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="nara" name="Cố đô Nara" stroke="#FFD14C" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-950 block mb-1 text-sm dark:text-white">Tại Thành phố Kyoto:</span>
                  Trước 2013 chưa từng vượt 1 triệu khách; đạt 3.1 triệu (2016) và chạm đỉnh 4.5 triệu (2019), gây áp lực quá tải hạ tầng xe bus.
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-950 block mb-1 text-sm dark:text-white">Tại Cố đô Nara:</span>
                  Tăng trưởng liên tục 40% - 60% mỗi năm sau 2013; từ 435 nghìn khách (2013) lên đỉnh 3.3 triệu lượt khách (2019).
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHI TIÊU DU LỊCH */}
          {activeChartTab === 'spending' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {isEn ? 'Biểu đồ 3.4 & 3.5: International Inbound Spending Surge (2010 - 2021)' : 'Biểu đồ 3.4 & 3.5: Tăng trưởng Chi tiêu Du khách Quốc tế'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nguồn: Honichi Inbound Insights & Sở Du lịch Kyoto / Nara
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#C8EEF7]/50 text-slate-900 border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                  Đơn vị: Nghìn tỷ Yên (¥)
                </span>
              </div>

              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendNationalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      formatter={(val: number | string | readonly (string | number)[] | undefined) => [`${val} nghìn tỷ Yên`, 'Tổng chi tiêu']}
                    />
                    <Bar dataKey="value" fill="#FFD14C" radius={[6, 6, 0, 0]} maxBarSize={38} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300">
                <b>Đóng góp chi tiêu cục bộ tại các di sản trọng điểm:</b>
                <ul className="mt-1.5 space-y-1 list-disc list-inside">
                  <li><b>Kyoto:</b> Chi tiêu du lịch tăng từ 649 tỷ Yên (2008) lên 1.308 tỷ Yên (2019) (Biểu đồ 3.5).</li>
                  <li><b>Nara:</b> Chi tiêu du lịch tăng từ 872 tỷ Yên (2013) lên đỉnh 1.208 tỷ Yên (2018) (Biểu đồ 3.6).</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: KINH TẾ VĨ MÔ & VIỆC LÀM */}
          {activeChartTab === 'macro' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {isEn ? 'Macroeconomic GDP Share & Employment Impact' : 'Đóng Góp Vào GDP Nhật Bản & Việc Làm Toàn Quốc'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nguồn: Bộ Kinh tế, Thương mại và Công nghiệp Nhật Bản (METI) & WTTC
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#FFE485]/40 text-slate-900 border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                  Đơn vị: % GDP & Nghìn tỷ Yên
                </span>
              </div>

              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gdpShareData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      formatter={(val: number | string | readonly (string | number)[] | undefined, name?: string | number) => [name === 'gdpShare' ? `${val}% GDP` : `${val} nghìn tỷ Yên`, name === 'gdpShare' ? 'Tỷ trọng GDP' : 'Doanh thu Lữ hành']}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar dataKey="gdpShare" fill="#0D7287" name="gdpShare" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="directRevenue" fill="#FFD14C" name="directRevenue" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 dark:text-white">4.0+ Triệu Việc Làm:</span>
                  Ngành du lịch hỗ trợ 6.9% tổng số việc làm trên toàn lãnh thổ Nhật Bản.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 dark:text-white">Thành phố Kyoto:</span>
                  Thuế du lịch đạt 39 tỷ Yên (12.8% ngân sách), tạo 153.000 việc làm (12.4% lao động).
                </div>
                <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#FFE485] dark:bg-slate-800/60 dark:border-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 dark:text-white">Xếp Hạng Thế Giới:</span>
                  Năm 2019, Nhật Bản vượt Đức trở thành nền kinh tế du lịch lớn thứ 3 toàn cầu.
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: THÁCH THỨC QUÁ TẢI & 5 CASE STUDY ĐIỂN HÌNH */}
      <section id="giai-phap" className="py-16 bg-[#F8FCFD] border-t border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <span>04 : CHƯƠNG 3.2 : THÁCH THỨC & GIẢI PHÁP THỰC TIỄN</span>
              </div>
              <button
                onClick={() => copyDeepLink('giai-phap', isEn ? 'Case Studies' : 'Giải pháp thực tiễn')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                title={isEn ? 'Copy link to section' : 'Sao chép liên kết mục'}
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Overtourism Bottlenecks & 5 Ground-Level Policy Interventions' : 'Quá Tải Du Lịch & 5 Mô Hình Ứng Phó Thực Nghiệm'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Case Study 1: Kyoto IoT Camera */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-[#C8EEF7] text-slate-950 flex items-center justify-center font-bold font-serif text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">
                01
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                {isEn ? 'Kyoto: Real-Time Congestion IoT Cameras' : 'Kyoto: Camera IoT & Phân Tán 6 Khu Vực'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Lắp đặt mạng lưới camera livestream trực tiếp phân tích mật độ tắc nghẽn giao thông quanh chùa Kinkakuji, Gion; đưa lên Bản đồ tiện nghi du lịch Kyoto (京都観光快適度マップ) để điều hướng dòng khách phân tán ra 6 khu vực ngoại ô.
              </p>
            </div>

            {/* Case Study 2: Itsukushima Tourist Tax */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-[#FFE485] text-slate-950 flex items-center justify-center font-bold font-serif text-sm dark:bg-[#FFD14C] dark:text-slate-950">
                02
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                {isEn ? 'Itsukushima Shrine: Inbound Visitor Tax' : 'Đền Itsukushima: Thuế Lên Đảo (入島税)'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Đối mặt với lượng khách 4.6 triệu người (2019), Thành phố Hatsukaichi áp thuế 100 Yên/người lên đảo Miyajima; tạo nguồn ngân sách chuyên biệt phục vụ trùng tu đền cổ và dọn rác thải bảo vệ môi trường biển.
              </p>
            </div>

            {/* Case Study 3: Shirakawa-go Reservation */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-[#C8EEF7] text-slate-950 flex items-center justify-center font-bold font-serif text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">
                03
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                {isEn ? 'Shirakawa-go: Strict Pre-Booking System' : 'Shirakawa-go: Đặt Chỗ 100% (Light-up)'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Ngôi làng 600 dân đón 1.8 triệu khách/năm; sự kiện mùa đông Shirakawa-go Winter Light up chuyển sang cơ chế đăng ký và giữ chỗ trực tuyến 100%, giới hạn số lượng xe buýt và người lên đài quan sát.
              </p>
            </div>

            {/* Case Study 4: Mt. Fuji VR & Fund */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-[#FFE485] text-slate-950 flex items-center justify-center font-bold font-serif text-sm dark:bg-[#FFD14C] dark:text-slate-950">
                04
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                {isEn ? 'Mt. Fuji: Virtual Trekking VR & Fund' : 'Núi Phú Sĩ: VR 6.100m² & Quỹ Bảo Tồn'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Đón 5.06 triệu khách (2019); thành lập Trung tâm Di sản 6.100 m² với mô hình leo núi thực tế ảo (VR) giảm tải leo núi thực; vận hành Quỹ hợp tác bảo tồn Phú Sĩ (2014) thu phí bảo tồn và quy hoạch đường sắt leo núi.
              </p>
            </div>

            {/* Case Study 5: Nara Minpaku Ordinance */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800 md:col-span-2 lg:col-span-2">
              <div className="w-9 h-9 rounded-xl bg-[#C8EEF7] text-slate-950 flex items-center justify-center font-bold font-serif text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">
                05
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                {isEn ? 'Nara: Luxury Hotels & Minpaku Residential Ordinance' : 'Nara: Pháp Lệnh Quản Lý Homestay (Minpaku) & Khách Sạn Sang Trọng'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Ban hành &quot;Pháp lệnh đảm bảo quản lý hợp lý doanh nghiệp lưu trú&quot;, cho phép sử dụng công trình di sản làm cơ sở lưu trú cao cấp (JW Marriott Hotel Nara, Fufu Nara, Fairfield by Marriott Tenri); đồng thời kiểm soát lượng rác thải bảo vệ đàn hươu 1.200 con tại Công viên Nara.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: KẾT LUẬN & ĐỀ XUẤT */}
      <section id="ket-luan" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FFE485] text-slate-950 border-2 border-[#FFD14C] space-y-6 shadow-md dark:bg-[#090D16] dark:text-white dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0D7287] dark:text-[#9BE7FA]">
                KẾT LUẬN & ĐỀ XUẤT CHÍNH SÁCH
              </span>
              <button
                onClick={() => copyDeepLink('ket-luan', isEn ? 'Synthesis' : 'Tổng kết & Đề xuất')}
                className="p-1 rounded-md text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                title={isEn ? 'Copy link to section' : 'Sao chép liên kết mục'}
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {isEn ? 'Summary: Transition from Volume Growth to Quality & Sustainability' : 'Chuyển Đổi Chiến Lược: Từ "Số Lượng" Sang "Chất Lượng & Bền Vững"'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-900 leading-relaxed font-medium dark:text-slate-300">
            <div className="space-y-2 bg-white/60 p-4 rounded-2xl border border-[#FFD14C]/70 shadow-2xs dark:bg-slate-900/50 dark:border-slate-800">
              <div className="text-[#0D7287] font-black text-sm dark:text-[#FFD14C]">1. Nền Tảng Pháp Lý Trước Tiên</div>
              <p>Chính sách bảo tồn di sản phải được thể chế hóa và đi trước các đợt bùng nổ truyền thông, tạo hành lang pháp lý bảo vệ không gian cảnh quan.</p>
            </div>
            <div className="space-y-2 bg-white/60 p-4 rounded-2xl border border-[#FFD14C]/70 shadow-2xs dark:bg-slate-900/50 dark:border-slate-800">
              <div className="text-[#0D7287] font-black text-sm dark:text-[#9BE7FA]">2. Công Nghệ Điều Tiết Dòng Khách</div>
              <p>Ứng dụng IoT, camera thời gian thực và hệ thống đặt chỗ trực tuyến giúp phân tán mật độ, tránh xung đột lợi ích với cư dân bản địa.</p>
            </div>
            <div className="space-y-2 bg-white/60 p-4 rounded-2xl border border-[#FFD14C]/70 shadow-2xs dark:bg-slate-900/50 dark:border-slate-800">
              <div className="text-[#0D7287] font-black text-sm dark:text-[#FFD14C]">3. Tái Đầu Tư Doanh Thu Du Lịch</div>
              <p>Các khoản thuế du khách và quỹ hợp tác bảo tồn đảm bảo nguồn tài chính nội sinh bền vững cho việc tôn tạo và trùng tu di sản cho thế hệ mai sau.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#FFD14C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-800 font-mono dark:border-slate-800 dark:text-slate-400">
            <div>
              Trích xuất từ Niên luận Nghiên cứu Nhật Bản học, Khoa Đông Phương học, ĐHKHXH&NV, ĐHQGHN.
            </div>
            <div className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">
              Tác giả: Ma Văn Hùng · 2024
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-50 border-t border-slate-200/80 text-center text-xs text-slate-500 dark:bg-slate-950 dark:border-slate-900 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            Dự án nghiên cứu & trực quan hóa dữ liệu du lịch di sản Nhật Bản
          </p>
          <p>
            Ma Văn Hùng · Portfolio Data Analyst · Cập nhật 2026
          </p>
        </div>
      </footer>

    </div>
  );
}
