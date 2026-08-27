'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, AlertCircle, TrendingUp, Info, BarChart3, Users, Landmark, FileText } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../../lib/visitorTracking';
import { useLanguage } from '../../context/LanguageContext';

// Data for charts
const touristsData = [
  { year: '03', value: 5.2 }, { year: '04', value: 6.1 }, { year: '05', value: 6.7 },
  { year: '06', value: 7.3 }, { year: '07', value: 8.3 }, { year: '08', value: 8.4 },
  { year: '09', value: 6.8 }, { year: '10', value: 8.6 }, { year: '11', value: 6.2 },
  { year: '12', value: 8.4 }, { year: '13', value: 10.4 }, { year: '14', value: 13.4 },
  { year: '15', value: 19.7 }, { year: '16', value: 24.0 }, { year: '17', value: 28.7 },
  { year: '18', value: 31.2 }, { year: '19', value: 31.9 }, { year: '20', value: 4.1 },
  { year: '21', value: 0.2 }, { year: '22', value: 3.4 },
];

const kyotoNaraData = [
  { year: '2009', kyoto: 957.2, nara: 407 }, { year: '2010', kyoto: 783.8, nara: 629 },
  { year: '2011', kyoto: 983.9, nara: 174 }, { year: '2012', kyoto: 515.4, nara: 267 },
  { year: '2013', kyoto: 844.9, nara: 435 }, { year: '2014', kyoto: 1127.9, nara: 630 },
  { year: '2015', kyoto: 1828.6, nara: 975 }, { year: '2016', kyoto: 3158.6, nara: 1576 },
  { year: '2017', kyoto: 3184.8, nara: 1990 }, { year: '2018', kyoto: 3527.8, nara: 2651 },
  { year: '2019', kyoto: 4503.3, nara: 3318 }, { year: '2020', kyoto: 3799.0, nara: 28.9 },
];

const spendData = [
  { year: '2010', value: 1.15 }, { year: '2011', value: 0.81 }, { year: '2012', value: 1.08 },
  { year: '2013', value: 1.41 }, { year: '2014', value: 2.02 }, { year: '2015', value: 3.48 },
  { year: '2016', value: 3.75 }, { year: '2017', value: 4.41 }, { year: '2018', value: 4.50 },
  { year: '2019', value: 4.81 }, { year: '2020', value: 0.70 }, { year: '2021', value: 0.10 },
];

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function HeritageJapanProject({ onBack, isEmbedded }: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Sự phát triển của Du lịch Di sản tại Nhật Bản', 'proj-heritage-japan', 'project');
    
    // Intersection Observer for animations
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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-brand-yellow/30 dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-blue-light/50 transition-all dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold group cursor-pointer dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#boi-canh" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Context' : 'Bối cảnh'}</a>
            <a href="#di-san" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Heritage' : 'Di sản'}</a>
            <a href="#chinh-sach" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Policies' : 'Chính sách'}</a>
            <a href="#du-lieu" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Data & Analytics' : 'Dữ liệu'}</a>
            <a href="#ket-luan" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Conclusion' : 'Kết luận'}</a>
            
            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-heritage-japan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <FileText className="w-4 h-4" />
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer dark:bg-brand-yellow dark:text-slate-950"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Light Yellow in Light mode, Dark in Dark mode */}
      <header className="relative bg-gradient-to-b from-[#FFFDF5] via-[#FFF9E6] to-[#FFF3C4]/60 text-slate-900 min-h-[85vh] flex flex-col justify-center overflow-hidden border-b border-brand-yellow/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white dark:border-none">
        {/* Sun Element */}
        <div className="absolute right-[8%] top-[16%] w-48 h-48 rounded-full bg-gradient-to-tr from-[#FFE485] via-brand-yellow to-[#E8A93A] shadow-[0_0_120px_30px_rgba(255,209,76,0.22)] hidden md:block"></div>
        
        {/* Mountain SVG overlay (recreating the fuji shape) */}
        <div className="absolute left-0 right-0 bottom-0 w-full h-[25vh] opacity-90 pointer-events-none">
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="w-full h-full fill-[#F5E6B3]/60 dark:fill-[#0D2033]">
            <path d="M0,360 L340,140 L430,220 L620,60 L760,190 L880,110 L1020,230 L1160,150 L1440,300 L1440,360 Z"/>
          </svg>
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-white opacity-85 dark:fill-[#F6FBFD] dark:opacity-85">
            <path d="M560,90 L620,60 L680,100 L650,105 L610,88 L590,102 Z"/>
          </svg>
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-[#EBD596]/40 dark:fill-[#0A1723]">
            <path d="M0,360 L520,170 L640,250 L900,120 L1080,240 L1440,180 L1440,360 Z"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 w-full">
          <div className="flex items-center gap-3 text-slate-600 font-mono text-sm tracking-widest uppercase font-bold mb-6 dark:text-brand-blue">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            Data Analytics Case Study
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 max-w-4xl tracking-tight text-slate-900 dark:text-white">
            {isEn ? 'The Evolution of' : 'Sự phát triển của'} <br/>
            <em className="not-italic text-amber-600 dark:text-brand-yellow">{isEn ? 'Heritage Tourism' : 'Du lịch Di sản'}</em> {isEn ? 'in Japan' : 'tại Nhật Bản'}
          </h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mb-12 leading-relaxed dark:text-brand-blue-light/90">
            {isEn 
              ? 'Time-series analysis of international inbound arrivals, tourist spending, and heritage preservation policies in Japan (2013–present), adapted from Japanese Studies research into an interactive data visualization case study.'
              : 'Phân tích chuỗi số liệu khách du lịch quốc tế, chi tiêu du lịch và chính sách bảo tồn di sản Nhật Bản giai đoạn 2013 – nay, chuyển thể từ niên luận ngành Nhật Bản học thành một dự án trực quan hoá dữ liệu.'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-brand-yellow/30 max-w-4xl dark:border-white/10">
            <div>
              <div className="text-3xl font-bold text-slate-900 font-mono leading-none dark:text-brand-yellow">2013–22</div>
              <div className="text-xs text-slate-500 mt-2 tracking-widest font-mono uppercase dark:text-brand-blue">{isEn ? 'Time Frame' : 'Khung thời gian'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 font-mono leading-none dark:text-brand-yellow">25</div>
              <div className="text-xs text-slate-500 mt-2 tracking-widest font-mono uppercase dark:text-brand-blue">{isEn ? 'World Heritage Sites' : 'Di sản thế giới'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 font-mono leading-none dark:text-brand-yellow">6</div>
              <div className="text-xs text-slate-500 mt-2 tracking-widest font-mono uppercase dark:text-brand-blue">{isEn ? 'Interactive Charts' : 'Biểu đồ dữ liệu'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 font-mono leading-none dark:text-brand-yellow">3</div>
              <div className="text-xs text-slate-500 mt-2 tracking-widest font-mono uppercase dark:text-brand-blue">{isEn ? 'Key Regions Studied' : 'Địa phương trọng điểm'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Context */}
      <section id="boi-canh" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:text-slate-400">
          <span className="w-6 h-0.5 bg-brand-yellow"></span>
          {isEn ? '01 · Research Context' : '01 · Bối cảnh nghiên cứu'}
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight dark:text-white">
              {isEn ? 'Why is Japanese Heritage Tourism Worth Analyzing?' : 'Vì sao du lịch di sản Nhật Bản đáng để phân tích?'}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-10 dark:text-slate-300">
              {isEn
                ? 'Heritage tourism is a strategic national economic pillar for Japan. This study investigates the rapid growth of this sector following the 2013 Tourism Nation Promotion Basic Plan enacted by the Japanese Government.'
                : 'Du lịch di sản là mũi nhọn du lịch quốc gia của Nhật Bản. Nghiên cứu tìm hiểu sự phát triển của loại hình du lịch này kể từ năm 2013 — thời điểm Chính phủ Nhật ban hành Chương trình hành động hướng tới quốc gia du lịch.'}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[#FFF9E6] p-6 rounded-2xl border border-brand-yellow/40 shadow-xs dark:bg-brand-blue-light/10 dark:border-brand-blue-light/30">
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2 dark:text-white"><span className="text-amber-600 dark:text-brand-yellow">40%</span></div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{isEn ? 'of global tourists choose cultural heritage destinations (UNWTO)' : 'khách du lịch thế giới chọn di sản làm điểm đến (UNWTO)'}</p>
              </div>
              <div className="bg-[#FFF9E6] p-6 rounded-2xl border border-brand-yellow/40 shadow-xs dark:bg-brand-blue-light/10 dark:border-brand-blue-light/30">
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2 dark:text-white"><span className="text-amber-600 dark:text-brand-yellow">556.9</span> {isEn ? 'Billion' : 'tỷ'}</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{isEn ? 'USD global heritage tourism revenue in 2021' : 'USD doanh thu du lịch di sản toàn cầu năm 2021'}</p>
              </div>
            </div>
          </div>
          
          <div className="reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
            <div className="bg-[#FFF9E6] rounded-3xl p-8 md:p-10 mb-8 border border-brand-yellow/40 shadow-sm dark:bg-slate-900 dark:border-brand-yellow/30">
              <p className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-4 font-bold dark:text-brand-yellow">{isEn ? 'Core Research Question' : 'Câu hỏi nghiên cứu chính'}</p>
              <p className="text-2xl md:text-3xl font-bold italic text-slate-900 leading-tight dark:text-white">
                {isEn ? '"How has heritage tourism in Japan evolved since 2013?"' : '"Du lịch di sản tại Nhật Bản đã phát triển như thế nào từ năm 2013?"'}
              </p>
            </div>
            
            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-4 font-bold dark:text-slate-400">{isEn ? 'Sub-Questions Investigated' : 'Câu hỏi phụ'}</p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-slate-600 dark:text-slate-300">{isEn ? 'What legal frameworks and tourism policies drove this growth?' : 'Các chính sách phát triển du lịch di sản của Nhật Bản là gì?'}</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-slate-600 dark:text-slate-300">{isEn ? 'How did inbound numbers, growth rates, and tourist expenditures perform?' : 'Hiệu quả thể hiện qua số lượng khách, tốc độ tăng trưởng và doanh thu du lịch ra sao?'}</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-slate-600 dark:text-slate-300">{isEn ? 'What impact has this growth had on heritage conservation and management?' : 'Tình trạng bảo tồn và quản lý di sản đã thay đổi như thế nào?'}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Heritage Section - Light Yellow Card in Light Mode, Dark in Dark Mode */}
      <section id="di-san" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:text-slate-400">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            {isEn ? '02 · Heritage & Identity' : '02 · Di sản & du lịch di sản'}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-16 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 dark:text-white">
            {isEn ? 'Heritage as a Driver of Culture, Identity, and Economics' : 'Di sản là động lực, là bản sắc, là cầu nối văn hoá'}
          </h2>
          
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
            <div className="bg-[#FFF9E6] text-slate-900 rounded-3xl p-10 lg:p-12 border border-brand-yellow/40 shadow-lg reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 dark:bg-slate-950 dark:text-white dark:border-transparent dark:shadow-2xl">
              <p className="text-slate-600 font-mono text-xs tracking-widest uppercase font-bold mb-4 dark:text-brand-blue">{isEn ? 'UNESCO World Heritage Sites in Japan (2023)' : 'Di sản Thế giới UNESCO tại Nhật Bản (2023)'}</p>
              <div className="text-8xl font-black font-mono text-slate-900 leading-none mb-2 dark:text-brand-yellow">25</div>
              <p className="text-slate-600 text-sm dark:text-brand-blue-light/80">{isEn ? 'world heritage sites' : 'di sản thế giới'}</p>
              
              <div className="flex gap-10 mt-8 mb-10">
                <div>
                  <span className="block text-4xl font-bold font-mono text-slate-900 mb-1 dark:text-white">20</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider dark:text-brand-blue-light/70">{isEn ? 'Cultural Sites' : 'Di sản văn hoá'}</span>
                </div>
                <div>
                  <span className="block text-4xl font-bold font-mono text-amber-600 mb-1 dark:text-brand-yellow">5</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider dark:text-brand-blue-light/70">{isEn ? 'Natural Sites' : 'Di sản thiên nhiên'}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {[isEn ? 'Historic Kyoto' : 'Cố đô Kyoto', isEn ? 'Historic Nara' : 'Cố đô Nara', isEn ? 'Mount Fuji' : 'Núi Phú Sĩ', 'Himeji', 'Itsukushima'].map(dest => (
                  <span key={dest} className="px-4 py-2 rounded-full bg-white/80 text-slate-800 text-xs font-mono border border-brand-yellow/30 dark:bg-slate-800 dark:text-brand-blue-light dark:border-slate-700">
                    {dest}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
              {[
                { 
                  id: '01', 
                  title: isEn ? 'Tourism Growth Driver' : 'Động lực du lịch', 
                  desc: isEn ? 'Serves as an alluring destination for domestic and international travelers seeking cultural immersion and history.' : 'Là điểm đến hấp dẫn để khám phá, trải nghiệm văn hoá và phong tục mới của du khách trong và ngoài nước.' 
                },
                { 
                  id: '02', 
                  title: isEn ? 'Distinctive Identity' : 'Tạo sự khác biệt', 
                  desc: isEn ? 'Reflects the unique spirit and traditions of local communities, establishing differentiated global branding.' : 'Phản ánh bản sắc riêng của từng cộng đồng, dân tộc — không nơi nào giống nơi nào.' 
                },
                { 
                  id: '03', 
                  title: isEn ? 'Education & Cultural Exchange' : 'Giáo dục & giao lưu', 
                  desc: isEn ? 'Fosters historical appreciation and promotes international dialogue across diverse global populations.' : 'Nâng cao hiểu biết lịch sử, thúc đẩy giao lưu văn hoá giữa các quốc gia, dân tộc.' 
                },
                { 
                  id: '04', 
                  title: isEn ? 'Sustainable Economic Resource' : 'Nguồn lực kinh tế', 
                  desc: isEn ? 'Generates reinvestment capital for ongoing preservation, historic site maintenance, and regional revitalisation.' : 'Tạo doanh thu tái đầu tư cho công tác bảo tồn, tôn tạo di sản và phát triển địa phương.' 
                }
              ].map(role => (
                <div key={role.id} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-brand-yellow-light/40 border border-brand-yellow text-slate-900 font-bold font-mono flex items-center justify-center shrink-0 shadow-xs dark:bg-slate-800 dark:text-brand-yellow dark:border-slate-700">
                    {role.id}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 dark:text-white">{role.title}</h4>
                    <p className="text-slate-600 leading-relaxed dark:text-slate-300">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policy Timeline */}
      <section id="chinh-sach" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:text-slate-400">
          <span className="w-6 h-0.5 bg-brand-yellow"></span>
          {isEn ? '03 · Policy Framework' : '03 · Chính sách phát triển'}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 dark:text-white">
          {isEn ? 'Legal Foundation First, Tourism Policies Follow' : 'Nền tảng pháp lý đi trước, chính sách du lịch theo sau'}
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mb-16 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 dark:text-slate-300">
          {isEn
            ? 'Cultural heritage protection was codified into Japanese law in the mid-20th century, providing the foundation for modern inbound tourism expansion policies.'
            : 'Bảo tồn di sản văn hoá được luật hoá từ giữa thế kỷ 20 tại Nhật Bản, tạo nền móng để các chính sách thúc đẩy du lịch được ban hành và thực thi hiệu quả sau này.'}
        </p>

        <div className="relative mb-12 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
          <div className="absolute top-6 left-8 right-8 h-0.5 bg-brand-yellow/30 hidden md:block"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              { 
                year: '1950', 
                title: isEn ? 'Law for Protection of Cultural Properties' : 'Luật Bảo vệ Di sản Văn hoá', 
                desc: isEn ? 'Unified 3 predecessor preservation laws and formally included intangible cultural assets.' : 'Hợp nhất 3 đạo luật bảo tồn tiền thân, bổ sung tài sản văn hoá phi vật thể vào phạm vi bảo vệ.', 
                active: false 
              },
              { 
                year: '2004', 
                title: isEn ? 'Cultural Property Act Revision' : 'Sửa đổi Luật Di sản Văn hoá', 
                desc: isEn ? 'Added legal conservation schemes for cultural landscapes and traditional building groups.' : 'Bổ sung chế độ bảo tồn cảnh quan văn hoá & quần thể kiến trúc truyền thống.', 
                active: false 
              },
              { 
                year: "'06–08", 
                title: isEn ? 'Tourism Nation Promotion Act' : 'Luật Du lịch Quốc gia', 
                desc: isEn ? 'Established the Japan Tourism Agency (JTA, 2008); chartered sustainable tourism growth.' : 'Thành lập Cơ quan Du lịch Nhật Bản (2008); định hướng du lịch bền vững.', 
                active: false 
              },
              { 
                year: '2013', 
                title: isEn ? 'Action Program for Tourism' : 'Chương trình hành động', 
                desc: isEn ? 'Key milestone: promoted "Brand Japan", relaxed visas for ASEAN, expanded transit infrastructure.' : 'Cột mốc khởi đầu nghiên cứu — thúc đẩy “Thương hiệu Nhật Bản”, nới lỏng visa, mở rộng hạ tầng.', 
                active: true 
              }
            ].map((node, i) => (
              <div key={i} className="relative">
                <div className={`mx-auto mb-6 flex items-center justify-center font-bold font-mono text-slate-900 transition-all rounded-full shadow-sm
                  ${node.active ? 'w-16 h-16 bg-brand-yellow text-lg ring-4 ring-brand-yellow/30' : 'w-12 h-12 bg-brand-yellow-light text-sm border-4 border-white dark:border-slate-900'}`}>
                  {node.year}
                </div>
                <div className={`p-6 rounded-2xl h-full border ${node.active ? 'bg-[#FFF9E6] border-brand-yellow shadow-md dark:bg-slate-900 dark:border-brand-yellow' : 'bg-white border-brand-yellow/30 shadow-xs dark:bg-slate-900/50 dark:border-slate-800'}`}>
                  <h4 className="font-bold text-slate-900 mb-3 leading-snug dark:text-white">{node.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF9E6] text-slate-800 p-8 rounded-2xl flex gap-4 items-start border border-brand-yellow/40 shadow-sm reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400 dark:bg-slate-900 dark:text-brand-blue-light dark:border-transparent dark:shadow-xl">
          <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 dark:text-brand-yellow" />
          <p className="text-sm md:text-base leading-relaxed dark:text-slate-200">
            <b className="text-slate-900 dark:text-white">{isEn ? 'Core 2013 Policy Initiatives:' : 'Trọng tâm chính sách 2013:'}</b> {isEn ? 'Visa exemptions and simplifications for ASEAN (Thailand, Malaysia, Vietnam, Philippines) · Expansion of hospitality accommodations · Promotion of "Brand Japan" globally · Multi-lingual transit & international payment systems · Attracting international MICE conferences.' : 'nới lỏng thị thực cho ASEAN (Thái Lan, Malaysia, Việt Nam, Philippines) · mở rộng cơ sở lưu trú · quảng bá “Thương hiệu Nhật Bản” · hỗ trợ đa ngôn ngữ & thanh toán quốc tế · thu hút hội nghị MICE.'}
          </p>
        </div>
      </section>

      {/* Data Charts Section - Light Yellow Background in Light mode */}
      <section id="du-lieu" className="py-24 bg-[#FFFDF5] text-slate-900 border-t border-brand-yellow/30 dark:bg-slate-950 dark:text-white dark:border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:text-brand-blue">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            {isEn ? '04 · Data & Telemetry' : '04 · Phân tích dữ liệu'}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 dark:text-white">
            {isEn ? 'What Does the Growth Trajectory Reveal?' : 'Đường cong tăng trưởng nói lên điều gì?'}
          </h2>
          
          <p className="text-lg text-slate-600 max-w-3xl mb-16 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 dark:text-brand-blue-light/80">
            {isEn
              ? 'Three standardized time-series datasets extracted from official sources (MLIT, JNTO, Kyoto & Nara Prefectures) and visualized using Recharts.'
              : 'Ba chuỗi số liệu được trích xuất, chuẩn hoá và trực quan hoá lại từ nguồn thống kê chính thức (MLIT, JNTO, tỉnh Kyoto, Nara) được trích dẫn trong niên luận gốc.'}
          </p>

          {/* Chart 1 */}
          <div className="py-12 border-t border-brand-yellow/30 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:border-white/10">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 dark:text-white">
                <TrendingUp className="text-amber-600 dark:text-brand-blue" />
                {isEn ? 'International Inbound Arrivals to Japan' : 'Khách du lịch quốc tế đến Nhật Bản'}
              </h3>
              <span className="font-mono text-sm text-slate-500 tracking-wider dark:text-brand-blue">{isEn ? 'MILLION ARRIVALS · 2003–2022' : 'TRIỆU NGƯỜI · 2003–2022'}</span>
            </div>
            
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="bg-white border border-brand-yellow/30 rounded-2xl p-6 h-[360px] shadow-xs dark:bg-white/5 dark:border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={touristsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} />
                    <YAxis stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#D97706' }}
                      formatter={(value) => [`${value} ${isEn ? 'Million' : 'triệu'}`, isEn ? 'Arrivals' : 'Số lượng']}
                      labelStyle={{ color: '#0F172A', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#FFD14C" strokeWidth={3} dot={{ fill: '#FFD14C', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-yellow rounded-2xl p-5 text-slate-900 shadow-md">
                  <div className="text-2xl font-bold font-mono mb-1">{isEn ? '31.9 Million' : '31,9 triệu'}</div>
                  <div className="text-sm font-medium">{isEn ? 'inbound visitors in 2019 peak (~5x increase compared to 2013)' : 'lượt khách quốc tế năm 2019 — mức đỉnh, gấp ~5 lần năm 2013'}</div>
                </div>
                <div className="bg-white border border-brand-yellow/30 rounded-2xl p-5 shadow-xs dark:bg-white/5 dark:border-white/10">
                  <div className="text-xl font-bold font-mono text-slate-900 mb-1 dark:text-white">2013 → 2019</div>
                  <div className="text-sm text-slate-600 dark:text-brand-blue-light/80">{isEn ? '10.4M → 31.9M (+207%) post implementation of Tourism Action Program' : '10,4 triệu → 31,9 triệu (+207%) sau khi Chương trình hành động du lịch được triển khai'}</div>
                </div>
                <div className="bg-white border border-brand-yellow/30 rounded-2xl p-5 shadow-xs dark:bg-white/5 dark:border-white/10">
                  <div className="text-xl font-bold font-mono text-slate-900 mb-1 dark:text-white">{isEn ? '0.2 Million' : '0,2 triệu'}</div>
                  <div className="text-sm text-slate-600 dark:text-brand-blue-light/80">{isEn ? 'in 2021 during COVID-19 border closures; strong rebound since 2023' : 'năm 2021 — tác động COVID-19; phục hồi mạnh mẽ từ 2023'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="py-12 border-t border-brand-yellow/30 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:border-white/10">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 dark:text-white">
                <Users className="text-amber-600 dark:text-brand-blue" />
                {isEn ? 'International Inbound Arrivals: Kyoto vs Nara' : 'Khách quốc tế tại Kyoto & Nara'}
              </h3>
              <span className="font-mono text-sm text-slate-500 tracking-wider dark:text-brand-blue">{isEn ? 'THOUSAND ARRIVALS · 2009–2020' : 'NGHÌN LƯỢT KHÁCH · 2009–2020'}</span>
            </div>
            
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="bg-white border border-brand-yellow/30 rounded-2xl p-6 h-[360px] shadow-xs dark:bg-white/5 dark:border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kyotoNaraData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} />
                    <YAxis stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(value) => [`${value} ${isEn ? 'k' : 'nghìn'}`, isEn ? 'Arrivals' : 'Khách']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="kyoto" name={isEn ? 'Kyoto Prefecture' : 'Cố đô Kyoto'} stroke="#FFD14C" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="nara" name={isEn ? 'Nara Prefecture' : 'Cố đô Nara'} stroke="#1A9AB5" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-yellow rounded-2xl p-5 text-slate-900 shadow-md">
                  <div className="text-2xl font-bold font-mono mb-1">{isEn ? 'Kyoto: 4.5 Million' : 'Kyoto: 4,5 triệu'}</div>
                  <div className="text-sm font-medium">{isEn ? 'inbound tourists in 2019 (never exceeded 1M prior to 2013)' : 'lượt khách quốc tế năm 2019 — trước 2013 chưa từng vượt mốc 1 triệu'}</div>
                </div>
                <div className="bg-white border border-brand-yellow/30 rounded-2xl p-5 shadow-xs dark:bg-white/5 dark:border-white/10">
                  <div className="text-2xl font-bold font-mono text-slate-900 mb-1 dark:text-brand-blue">{isEn ? 'Nara: 3.3 Million' : 'Nara: 3,3 triệu'}</div>
                  <div className="text-sm text-slate-600 dark:text-brand-blue-light/80">{isEn ? 'inbound visitors in 2019, growing 40–60% YoY continuously since 2013' : 'lượt khách năm 2019, duy trì tăng 40–60% mỗi năm kể từ 2013'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="py-12 border-t border-brand-yellow/30 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:border-white/10">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 dark:text-white">
                <BarChart3 className="text-amber-600 dark:text-brand-blue" />
                {isEn ? 'International Inbound Tourism Spending' : 'Chi tiêu du lịch của khách quốc tế'}
              </h3>
              <span className="font-mono text-sm text-slate-500 tracking-wider dark:text-brand-blue">{isEn ? 'TRILLION YEN (¥) · 2010–2021' : 'NGHÌN TỶ YÊN · 2010–2021'}</span>
            </div>
            
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="bg-white border border-brand-yellow/30 rounded-2xl p-6 h-[360px] shadow-xs dark:bg-white/5 dark:border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#D97706' }}
                      formatter={(value) => [`${value} ${isEn ? 'Trillion ¥' : 'nghìn tỷ ¥'}`, isEn ? 'Spending' : 'Doanh thu']}
                    />
                    <Bar dataKey="value" fill="#FFD14C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-yellow rounded-2xl p-5 text-slate-900 shadow-md">
                  <div className="text-2xl font-bold font-mono mb-1">{isEn ? '3.4x Revenue Surge' : 'Tăng gấp 3.4 lần'}</div>
                  <div className="text-sm font-medium">{isEn ? 'inbound tourist expenditure: from 1.41T (2013) to 4.81T Yen (2019)' : 'tăng trưởng chi tiêu quốc tế: từ 1,41 (2013) lên 4,81 nghìn tỷ Yên (2019)'}</div>
                </div>
                <div className="bg-white border border-brand-yellow/30 rounded-2xl p-5 shadow-xs dark:bg-white/5 dark:border-white/10">
                  <div className="text-xl font-bold font-mono text-slate-900 mb-1 dark:text-white">{isEn ? 'Regional Inbound Contributions' : 'Đóng góp địa phương'}</div>
                  <div className="text-sm text-slate-600 mt-2 dark:text-brand-blue-light/80">
                    <ul className="space-y-2">
                      <li>• <b>Kyoto:</b> 649 → 1,308 {isEn ? 'Billion Yen' : 'tỷ Yên'} (2008–2019)</li>
                      <li>• <b>Nara:</b> 873 → 1,208 {isEn ? 'Billion Yen' : 'tỷ Yên'} (2013–2018)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="thach-thuc" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:text-slate-400">
          <span className="w-6 h-0.5 bg-brand-yellow"></span>
          {isEn ? '05 · Structural Challenges' : '05 · Mặt trái của tăng trưởng'}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 dark:text-white">
          {isEn ? 'Overtourism & Commercialization Pressures' : 'Quá tải du lịch & thương mại hoá'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#FFF9E6] rounded-3xl p-8 md:p-10 border border-brand-yellow/40 shadow-xs reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200 dark:bg-slate-900 dark:border-brand-yellow/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center text-slate-900 shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{isEn ? 'Overtourism Bottlenecks' : 'Quá tải du lịch'}</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-slate-900 font-bold mb-2 dark:text-white">Kyoto</h4>
                <p className="text-slate-600 dark:text-slate-300">{isEn ? 'Severe public bus congestion around Gion and Kinkakuji; transportation strain between daily commuter residents and tourist crowds.' : 'Tắc nghẽn xe buýt công cộng quanh Gion, Kinkakuji; xung đột giữa nhu cầu di chuyển của du khách và cư dân bản địa.'}</p>
              </div>
              <div>
                <h4 className="text-slate-900 font-bold mb-2 dark:text-white">{isEn ? 'Historic Village of Shirakawa-go' : 'Làng cổ Shirakawa-go'}</h4>
                <p className="text-slate-600 dark:text-slate-300">{isEn ? '~600 local residents received over 1.8 million annual visitors, exceeding the village infrastructure carrying capacity.' : '~600 cư dân địa phương phải tiếp đón tới 1,8 triệu lượt khách/năm — vượt quá sức chứa hạ tầng của làng.'}</p>
              </div>
              <div>
                <h4 className="text-slate-900 font-bold mb-2 dark:text-white">Nara</h4>
                <p className="text-slate-600 dark:text-slate-300">{isEn ? 'Increased littering from deer feeding practices, introducing environmental and agricultural ecological risks.' : 'Lượng rác thải từ việc cho hươu ăn tăng, gây nguy cơ mất cân bằng sinh thái và ảnh hưởng trực tiếp đến nông nghiệp khu vực.'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#FFF9E6] text-slate-900 rounded-3xl p-8 md:p-10 border border-brand-yellow/40 shadow-xs reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 dark:bg-slate-900 dark:text-white dark:border-transparent dark:shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-brand-yellow-light flex items-center justify-center text-slate-900 shadow-sm dark:bg-brand-blue">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{isEn ? 'Commercialization of Heritage' : 'Thương mại hoá di sản'}</h3>
            </div>
            
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-amber-600 font-bold mb-2 dark:text-brand-yellow">{isEn ? 'Economic Dividend' : 'Lợi ích kinh tế'}</h4>
                <p className="text-slate-600 dark:text-brand-blue-light/80">{isEn ? 'Generated crucial tax revenue for historic renovation; broadcasted heritage values globally; provided direct employment for local communities.' : 'Tăng nguồn thu ngân sách để tái đầu tư bảo tồn; quảng bá giá trị di sản rộng rãi; tạo việc làm trực tiếp cho cộng đồng.'}</p>
              </div>
              <div>
                <h4 className="text-amber-600 font-bold mb-2 dark:text-brand-yellow">{isEn ? 'Cultural Preservation Risks' : 'Rủi ro văn hoá'}</h4>
                <p className="text-slate-600 dark:text-brand-blue-light/80">{isEn ? 'Excessive rapid development altering historic landscapes; risk of losing authentic cultural heritage; conflict of interest between corporate developers and local residents.' : 'Xây dựng hạ tầng quá mức làm phá vỡ cảnh quan; nguy cơ làm mất giá trị nguyên bản; xung đột lợi ích giữa doanh nghiệp lớn và người dân.'}</p>
              </div>
            </div>
            
            <div className="bg-white/80 border border-brand-yellow/30 rounded-2xl p-5 text-slate-700 italic text-sm dark:bg-white/10 dark:border-white/20 dark:text-brand-blue-light">
              {isEn ? 'Kyoto Hospitality Metric: Hotel room inventory grew from 30,000 (2014) to 53,000 (2019) — yet struggled to accommodate a 4x surge in inbound arrivals.' : 'Ví dụ tại Kyoto: Số lượng phòng khách sạn tăng từ 30.000 (2014) lên 53.000 (2019) — nhưng vẫn chưa theo kịp tốc độ khách tăng gấp 4 lần.'}
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion & About - Light Yellow in Light mode */}
      <section id="ket-luan" className="py-24 bg-[#FFF9E6] text-slate-900 border-b-8 border-brand-yellow dark:bg-slate-900 dark:text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out dark:text-brand-blue">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            {isEn ? 'Case Study Synthesis' : 'Tổng kết Case Study'}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-16 tracking-tight max-w-3xl leading-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100 dark:text-white">
            {isEn ? 'Impressive Growth Coupled with Sustainable Strategy' : 'Tăng trưởng ấn tượng, đi cùng bài toán bền vững'}
          </h2>
          
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
            <ul className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
              <li className="flex gap-4">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-lg text-slate-700 leading-relaxed dark:text-brand-blue-light/90">{isEn ? 'Japanese heritage tourism experienced phenomenal growth from 2013, catalyzed by the national Action Program alongside a robust Cultural Properties Protection legal framework.' : 'Du lịch di sản Nhật Bản tăng trưởng bùng nổ kể từ 2013, được thúc đẩy bởi Chương trình hành động hướng tới quốc gia du lịch cùng nền tảng pháp lý Luật Bảo vệ Di sản vững chắc.'}</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-lg text-slate-700 leading-relaxed dark:text-brand-blue-light/90">{isEn ? 'Inbound tourist volumes and expenditures multiplied significantly at core heritage sites, contributing an increasing share of national GDP and local employment.' : 'Số lượng khách quốc tế và chi tiêu du lịch tăng gấp nhiều lần tại các điểm di sản trọng điểm, đóng góp tỷ trọng ngày càng lớn vào GDP và việc làm toàn quốc.'}</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-lg text-slate-700 leading-relaxed dark:text-brand-blue-light/90">{isEn ? 'This growth trajectory necessitated a policy pivot toward "quality over quantity", emphasizing sustainable preservation and dispersing visitors across lesser-known rural heritage destinations.' : 'Sự bùng nổ này đi kèm những thách thức rõ rệt về quá tải và thương mại hoá; buộc các địa phương phải chuyển hướng chiến lược sang "chất lượng hơn số lượng" (phát triển bền vững).'}</span>
              </li>
            </ul>
            
            <div className="bg-white border border-brand-yellow/40 rounded-3xl p-8 shadow-sm reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 dark:bg-white/5 dark:border-white/10">
              <h3 className="text-slate-900 font-bold text-xl mb-6 flex items-center gap-2 dark:text-brand-yellow">
                <FileText className="w-5 h-5 text-amber-600 dark:text-brand-yellow" />
                {isEn ? 'About This Analytics Project' : 'Về dự án phân tích này'}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-slate-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 dark:text-brand-blue">{isEn ? 'Data Sources' : 'Nguồn dữ liệu'}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed dark:text-brand-blue-light/80">{isEn ? 'Extracted from Japanese Studies thesis and official government statistical repositories (MLIT, JNTO, Kyoto & Nara Prefectures).' : 'Số liệu trích xuất từ niên luận "Sự phát triển của du lịch di sản tại Nhật Bản" và các nguồn thống kê chính phủ (MLIT, JNTO).'}</p>
                </div>
                <div>
                  <h4 className="text-slate-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 dark:text-brand-blue">{isEn ? 'Methodology' : 'Phương pháp'}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed dark:text-brand-blue-light/80">{isEn ? 'Time-series data extraction, normalization, unit harmonization, and responsive data visualization using Recharts and Tailwind CSS.' : 'Trích xuất số liệu chuỗi thời gian, chuẩn hoá đơn vị và xây dựng hệ thống trực quan hoá (Data Viz) bằng Recharts.'}</p>
                </div>
                <div>
                  <h4 className="text-slate-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 dark:text-brand-blue">{isEn ? 'Skills Demonstrated' : 'Kỹ năng thể hiện'}</h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Data Extraction', 'Data Viz', 'Recharts', 'React', 'Storytelling'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-brand-yellow-light/40 rounded-lg text-xs font-mono text-slate-800 border border-brand-yellow/30 dark:bg-white/10 dark:text-brand-blue-light dark:border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF5] border-t border-brand-yellow/30 text-slate-600 py-12 text-center text-sm dark:bg-slate-950 dark:text-slate-500 dark:border-transparent">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-2">{isEn ? 'Personal Project · Data Analytics & Visual Storytelling of Heritage Tourism in Japan' : 'Dự án cá nhân · Phân tích & trực quan hoá dữ liệu du lịch di sản Nhật Bản'}</p>
          <p>{isEn ? 'Original Work: Japanese Studies Thesis, Faculty of Oriental Studies, USSH - VNU' : 'Bản gốc: Niên luận ngành Nhật Bản học, Khoa Đông Phương học, ĐHKHXH&NV, ĐHQGHN'}</p>
        </div>
      </footer>
    </div>
  );
}
