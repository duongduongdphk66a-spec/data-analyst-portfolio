'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Users, ShoppingBag, LayoutGrid, Award, Info, PieChart, BarChart3, LineChart as LineChartIcon, Code, Download, Globe } from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../../lib/visitorTracking';
import { useLanguage } from '../../context/LanguageContext';

// Data
const shopTrendData = [
  { date: '22/5', units: 600, gmv: 96 }, { date: '28/5', units: 950, gmv: 152 }, { date: '3/6', units: 650, gmv: 104 },
  { date: '9/6', units: 900, gmv: 144 }, { date: '15/6', units: 1950, gmv: 390 }, { date: '21/6', units: 650, gmv: 104 },
  { date: '27/6', units: 1150, gmv: 184 }, { date: '3/7', units: 600, gmv: 96 }, { date: '9/7', units: 550, gmv: 88 },
  { date: '15/7', units: 500, gmv: 80 }, { date: '21/7', units: 450, gmv: 72 }, { date: '27/7', units: 400, gmv: 64 },
  { date: '2/8', units: 350, gmv: 56 }, { date: '8/8', units: 500, gmv: 80 }, { date: '14/8', units: 250, gmv: 40 }
];

const getChannelData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Self-Operated Store' : 'Tài khoản tự vận hành', value: 56.45 },
    { name: isEn ? 'Creator Affiliates' : 'Nhà sáng tạo (affiliate)', value: 31.87 },
    { name: isEn ? 'Product Showcase Card' : 'Product Card', value: 11.68 }
  ],
  gmv: [
    { name: isEn ? 'Self-Operated Store' : 'Tài khoản tự vận hành', value: 53.91 },
    { name: isEn ? 'Creator Affiliates' : 'Nhà sáng tạo (affiliate)', value: 30.85 },
    { name: isEn ? 'Product Showcase Card' : 'Product Card', value: 15.24 }
  ]
});

const getContentData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Livestream' : 'LIVE', value: 68.13 }, 
    { name: isEn ? 'Short Video' : 'Video', value: 20.2 }, 
    { name: isEn ? 'Product Card' : 'Product Card', value: 11.68 }
  ],
  gmv: [
    { name: isEn ? 'Livestream' : 'LIVE', value: 63.04 }, 
    { name: isEn ? 'Short Video' : 'Video', value: 21.72 }, 
    { name: isEn ? 'Product Card' : 'Product Card', value: 15.24 }
  ]
});

const affFollowerData = {
  units: [
    { name: '>100k', value: 3400 }, { name: '50k–100k', value: 3800 }, { name: '10k–50k', value: 8900 },
    { name: '5k–10k', value: 2100 }, { name: '1k–5k', value: 21800 }, { name: '≤1k', value: 16100 }
  ],
  gmv: [
    { name: '>100k', value: 615.4 }, { name: '50k–100k', value: 665.8 }, { name: '10k–50k', value: 1300 },
    { name: '5k–10k', value: 323.1 }, { name: '1k–5k', value: 3300 }, { name: '≤1k', value: 2000 }
  ],
  count: [
    { name: '>100k', value: 42 }, { name: '50k–100k', value: 37 }, { name: '10k–50k', value: 161 },
    { name: '5k–10k', value: 110 }, { name: '1k–5k', value: 527 }, { name: '≤1k', value: 210 }
  ]
};

// Palette-only chart colors: cyan dark, cyan, gold, gold light, cyan light, gold darker
const COLORS = ['#1A9AB5', '#9BE7FA', '#FFD14C', '#FEE485', '#C8EEF7', '#E5B830'];

interface KamiElyProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function KamiElyProject({ onBack, isEmbedded }: KamiElyProjectProps = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  const [channelMetric, setChannelMetric] = useState<'units'|'gmv'>('units');
  const [contentMetric, setContentMetric] = useState<'units'|'gmv'>('units');
  const [affMetric, setAffMetric] = useState<'units'|'gmv'|'count'>('units');

  const channelData = getChannelData(isEn);
  const contentData = getContentData(isEn);

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Kami Ely TikTok Shop', 'proj-kami-ely', 'project');
    
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
            <a href="#overview" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Overview' : 'Tổng quan'}</a>
            <a href="#sales" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Sales' : 'Doanh số'}</a>
            <a href="#channels" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Channels' : 'Kênh bán'}</a>
            <a href="#affiliates" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Affiliates' : 'Affiliate'}</a>
            <a href="#insights" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Insights' : 'Insight'}</a>
            <a href="#automation" className="hover:text-slate-900 transition-colors dark:hover:text-white">{isEn ? 'Automation' : 'Tự động hóa'}</a>

            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-kami-ely"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <Globe className="w-4 h-4" />
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
      <header className="relative bg-gradient-to-tr from-[#FFFDF5] via-[#FFF9E6] to-[#FFF3C4]/60 text-slate-900 pt-16 pb-20 overflow-hidden border-b border-brand-yellow/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-white dark:border-none" id="overview">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-slate-950 dark:to-transparent"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 justify-between items-start mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-brand-yellow-light/40 border border-brand-yellow/40 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-800 mb-6 shadow-xs dark:bg-white/10 dark:border-white/20 dark:text-stone-100">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-brand-yellow animate-pulse"></span>
                {t('kami_badge', 'Dữ liệu 90 ngày gần nhất · 22/05 – 19/08/2026')}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900 dark:text-white">
                {isEn ? (
                  <>
                    Kami Ely on TikTok Shop:<br/>
                    <em className="italic text-amber-600 dark:text-brand-yellow font-normal">revenue propelled by LIVE</em>,<br/>not paid advertising.
                  </>
                ) : (
                  <>
                    Kami Ely trên TikTok Shop:<br/>
                    <em className="italic text-amber-600 dark:text-brand-yellow font-normal">doanh số vận hành bởi LIVE</em>,<br/>không phải quảng cáo.
                  </>
                )}
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-8 dark:text-brand-blue-light/90">
                {isEn 
                  ? 'Sports & Outdoor / designer swimwear brand in Vietnam. Comprehensive performance analysis synthesizing store GMV, affiliate creator networks, and self-operated livestream channels on TikTok Shop.'
                  : 'Shop ngành hàng Sports & Outdoor / đồ bơi thiết kế tại Việt Nam. Báo cáo tổng hợp hiệu suất bán hàng, mạng lưới affiliate và kênh nhà sáng tạo tự vận hành từ nền tảng phân tích dữ liệu TikTok Shop.'}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-white/80 border border-brand-yellow/40 text-slate-800 shadow-xs dark:bg-white/10 dark:border-white/20 dark:text-stone-100">{isEn ? 'National Rank' : 'Hạng toàn quốc'} <b className="text-amber-600 dark:text-brand-yellow font-mono">#2.7k</b></span>
                <span className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-white/80 border border-brand-yellow/40 text-slate-800 shadow-xs dark:bg-white/10 dark:border-white/20 dark:text-stone-100">{isEn ? 'Sports Category' : 'Ngành Sports'} <b className="text-amber-600 dark:text-brand-yellow font-mono">#88</b></span>
                <span className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-white/80 border border-brand-yellow/40 text-slate-800 shadow-xs dark:bg-white/10 dark:border-white/20 dark:text-stone-100">{isEn ? 'Rating' : 'Đánh giá'} <b className="text-amber-600 dark:text-brand-yellow font-mono">3.9/5</b></span>
              </div>
            </div>
            
            <div className="bg-white/90 border border-brand-yellow/40 rounded-3xl p-8 backdrop-blur-sm shadow-xl min-w-[280px] dark:bg-white/10 dark:border-white/20">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 dark:text-stone-300">{isEn ? 'All-Time Total GMV' : 'Tổng GMV toàn thời gian'}</div>
              <div className="text-5xl font-bold font-mono text-slate-900 mb-2 dark:text-white">31.4<span className="text-xl text-amber-600 dark:text-brand-yellow ml-1">{isEn ? 'Billion ₫' : 'Tỷ đ'}</span></div>
              <div className="text-sm text-slate-500 border-t border-slate-200/80 pt-4 mt-4 dark:text-stone-300 dark:border-white/20">{isEn ? 'from 235,500 total units sold' : 'từ 235.500 sản phẩm đã bán'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 border border-brand-yellow/30 rounded-2xl p-5 backdrop-blur-sm shadow-xs dark:bg-white/5 dark:border-white/10">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">235.5k</div>
              <div className="text-xs text-slate-500 mt-1 dark:text-stone-300">{isEn ? 'Total Units Sold' : 'Tổng sản phẩm đã bán'}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-2 uppercase tracking-wide dark:text-brand-blue">{isEn ? 'Industry Avg: 2.7M' : 'TB ngành: 2,7m'}</div>
            </div>
            <div className="bg-white/80 border border-brand-yellow/30 rounded-2xl p-5 backdrop-blur-sm shadow-xs dark:bg-white/5 dark:border-white/10">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">163 / 332</div>
              <div className="text-xs text-slate-500 mt-1 dark:text-stone-300">{isEn ? 'Active / Registered SKUs' : 'SP đang bán / từng đăng'}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-2 uppercase tracking-wide dark:text-brand-blue">{isEn ? 'Direct Commission: 0%' : 'Hoa hồng: 0%'}</div>
            </div>
            <div className="bg-white/80 border border-brand-yellow/30 rounded-2xl p-5 backdrop-blur-sm shadow-xs dark:bg-white/5 dark:border-white/10">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">12.0k</div>
              <div className="text-xs text-slate-500 mt-1 dark:text-stone-300">{isEn ? 'Shopping LIVE Sessions' : 'Phiên LIVE có giỏ hàng'}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-2 uppercase tracking-wide dark:text-brand-blue">{isEn ? 'Industry: 10.3k/mo' : 'TB ngành: 10,3k/tháng'}</div>
            </div>
            <div className="bg-white/80 border border-brand-yellow/30 rounded-2xl p-5 backdrop-blur-sm shadow-xs dark:bg-white/5 dark:border-white/10">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">5.9k</div>
              <div className="text-xs text-slate-500 mt-1 dark:text-stone-300">{isEn ? 'Affiliate Creators Partnered' : 'Affiliate đang hợp tác'}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-2 uppercase tracking-wide dark:text-brand-blue">{isEn ? 'Industry: 6.4k/mo' : 'TB ngành: 6,4k/tháng'}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        
        {/* Sales Trend */}
        <section id="sales" className="reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-4 dark:text-slate-400">
            <span className="w-6 h-0.5 bg-brand-yellow"></span> {isEn ? 'SALES & GMV TRENDS' : 'XU HƯỚNG DOANH SỐ'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight dark:text-white">
            {isEn ? 'Mid-June Sales Peak followed by Gradual Normalization' : 'Đỉnh bán hàng giữa tháng 6, sau đó giảm dần'}
          </h2>
          <p className="text-slate-600 max-w-3xl leading-relaxed mb-10 dark:text-slate-300">
            {isEn 
              ? 'Over the last 90 days, the shop sold 46.1k units generating 7.4 Billion VND in GMV. A distinct revenue surge occurred around June 15 (~1,950 units/day), driven by mega-livestream promotional events.'
              : 'Trong 90 ngày gần nhất shop bán được 46,1k sản phẩm, mang về 7,4 Tỷ đ GMV. Có một đợt bùng nổ rõ rệt quanh ngày 15/06 (~1.950 SP/ngày), nhiều khả năng đến từ một chiến dịch lớn.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
            <div><div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">46.1k</div><div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'Units Sold' : 'Sản phẩm bán'}</div></div>
            <div><div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">{isEn ? '7.4B ₫' : '7,4 Tỷ đ'}</div><div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? '90-Day GMV' : 'GMV (90 ngày)'}</div></div>
            <div><div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">144</div><div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'Active SKUs' : 'Mã SKU ra đơn'}</div></div>
            <div><div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">3.2k</div><div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'LIVE Sessions' : 'Phiên LIVE'}</div></div>
            <div><div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">1.9k</div><div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'Videos with Cart' : 'Video có giỏ hàng'}</div></div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-brand-yellow/30 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 mb-1 dark:text-white">{isEn ? 'Weekly Units Sold & GMV Trajectory' : 'Sản phẩm bán ra & GMV theo tuần'}</h3>
            <p className="text-sm text-slate-500 mb-8 dark:text-slate-400">{isEn ? 'Weekly aggregation reconstructed from platform telemetry data.' : 'Xu hướng theo tuần, tái dựng gần đúng từ biểu đồ gốc của nền tảng.'}</p>
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={shopTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                    labelStyle={{fontWeight: 'bold', color: '#0F172A', marginBottom: '4px'}}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Line yAxisId="left" type="monotone" dataKey="units" name={isEn ? 'Units Sold' : 'Sản phẩm bán'} stroke="#1A9AB5" strokeWidth={3} dot={{r:4, fill:'#1A9AB5', strokeWidth:2, stroke:'#fff'}} activeDot={{r:6}} />
                  <Line yAxisId="right" type="monotone" dataKey="gmv" name={isEn ? 'GMV (Million ₫)' : 'GMV (Triệu đ)'} stroke="#FFD14C" strokeWidth={3} dot={{r:4, fill:'#FFD14C', strokeWidth:2, stroke:'#fff'}} activeDot={{r:6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Channels & Content */}
        <section id="channels" className="reveal-element opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-4 dark:text-slate-400">
            <span className="w-6 h-0.5 bg-brand-yellow"></span> {isEn ? 'TRANSACTION CHANNELS & CONTENT FORMATS' : 'KÊNH GIAO DỊCH & ĐỊNH DẠNG NỘI DUNG'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight dark:text-white">
            {isEn ? 'Livestream is the Primary Conversion Engine' : 'LIVE là kênh chốt đơn chủ lực'}
          </h2>
          <p className="text-slate-600 max-w-3xl leading-relaxed mb-10 dark:text-slate-300">
            {isEn 
              ? 'By both units sold and total GMV, self-operated store accounts outperformed the entire external creator affiliate network combined, with LIVE streaming driving nearly 2/3 of all store revenue.'
              : 'Xét theo cả số lượng bán và GMV, tài khoản tự vận hành đóng góp nhiều hơn toàn bộ mạng lưới affiliate cộng lại, và LIVE mang về gần 2/3 doanh số.'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-brand-yellow/30 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isEn ? 'Revenue by Channel' : 'Kênh giao dịch'}</h3>
                <div className="flex bg-brand-yellow-light/30 rounded-lg p-1 dark:bg-slate-800">
                  <button onClick={() => setChannelMetric('units')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${channelMetric === 'units' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
                  <button onClick={() => setChannelMetric('gmv')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${channelMetric === 'gmv' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>GMV</button>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={channelData[channelMetric]} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={2} dataKey="value">
                      {channelData[channelMetric].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, isEn ? 'Share' : 'Tỷ trọng']} contentStyle={{borderRadius: '8px'}} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '12px'}} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-brand-yellow/30 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isEn ? 'Content Format Breakdown' : 'Định dạng nội dung'}</h3>
                <div className="flex bg-brand-yellow-light/30 rounded-lg p-1 dark:bg-slate-800">
                  <button onClick={() => setContentMetric('units')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${contentMetric === 'units' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
                  <button onClick={() => setContentMetric('gmv')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${contentMetric === 'gmv' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>GMV</button>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={contentData[contentMetric]} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={2} dataKey="value">
                      {contentData[contentMetric].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, isEn ? 'Share' : 'Tỷ trọng']} contentStyle={{borderRadius: '8px'}} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '12px'}} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Affiliates Section - Light Yellow Card in Light mode, Dark in Dark mode */}
        <section id="affiliates" className="reveal-element opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-4 dark:text-slate-400">
            <span className="w-6 h-0.5 bg-brand-yellow"></span> {isEn ? 'AFFILIATE CREATOR NETWORK' : 'MẠNG LƯỚI AFFILIATE'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight dark:text-white">
            {isEn ? 'Nano-Affiliates Drive the Majority of External Sales' : 'Đông nhưng nhỏ: nano-affiliate gánh phần lớn doanh số'}
          </h2>
          <p className="text-slate-600 max-w-3xl leading-relaxed mb-10 dark:text-slate-300">
            {isEn 
              ? 'Affiliate creators with under 5k followers — representing nearly 68% of the active affiliate pool — generated the largest share of affiliate unit sales and GMV.'
              : 'Nhóm affiliate dưới 5k followers — chiếm gần 68% tổng số affiliate — lại đóng góp phần lớn số lượng bán và GMV cho shop.'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-brand-yellow/30 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isEn ? 'By Follower Tier' : 'Theo lượng Follower'}</h3>
                <div className="flex bg-brand-yellow-light/30 rounded-lg p-1 dark:bg-slate-800">
                  <button onClick={() => setAffMetric('units')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${affMetric === 'units' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
                  <button onClick={() => setAffMetric('gmv')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${affMetric === 'gmv' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>GMV</button>
                  <button onClick={() => setAffMetric('count')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${affMetric === 'count' ? 'bg-slate-900 text-white shadow dark:bg-brand-yellow dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>{isEn ? 'Count' : 'Số Aff'}</button>
                </div>
              </div>
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={affFollowerData[affMetric]} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} width={80} />
                    <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px'}} />
                    <Bar dataKey="value" fill="#9BE7FA" radius={[0, 4, 4, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Self-Operated Account - Light Yellow in Light mode, Dark in Dark mode */}
            <div className="bg-[#FFF9E6] text-slate-900 border border-brand-yellow/40 rounded-3xl p-10 shadow-lg flex flex-col justify-center relative overflow-hidden dark:bg-slate-900 dark:text-white dark:border-transparent dark:shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <PieChart className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-white">{isEn ? 'Self-Operated Creator Account' : 'Kênh sáng tạo nội bộ (Self-operated)'}</h3>
                <p className="text-slate-700 leading-relaxed mb-10 dark:text-slate-300">
                  {isEn 
                    ? 'A single official account @kamielyhn (48.9k followers) independently drove 26.2k units sold and 4.0 Billion VND in GMV over 90 days — nearly matching the aggregate revenue of all 5,600 external affiliates combined (6.3B VND).'
                    : 'Một tài khoản duy nhất @kamielyhn (48,9k followers) tự tạo ra 26,2k sản phẩm bán và 4,0 Tỷ đ GMV trong 90 ngày. Con số này gần bằng toàn bộ 5,600 affiliate cộng lại (6,3 Tỷ đ).'}
                </p>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-t border-brand-yellow/30 pt-8 dark:border-white/10">
                  <div>
                    <div className="text-3xl font-bold font-mono text-slate-900 dark:text-brand-yellow">26.2k</div>
                    <div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'Units / 90 Days' : 'SP Bán / 90 ngày'}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-mono text-slate-900 dark:text-brand-yellow">{isEn ? '4.0 Billion ₫' : '4,0 Tỷ'}</div>
                    <div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'GMV / 90 Days' : 'GMV / 90 ngày'}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-mono text-amber-600 dark:text-brand-blue">143</div>
                    <div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'Short Videos' : 'Video'}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold font-mono text-amber-600 dark:text-brand-blue">198</div>
                    <div className="text-sm text-slate-500 mt-1 dark:text-slate-400">{isEn ? 'LIVE Streams' : 'Phiên LIVE'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insights Section - Light Yellow in Light mode, Dark in Dark mode */}
        <section id="insights" className="reveal-element opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="bg-[#FFF9E6] text-slate-900 border border-brand-yellow/40 rounded-[40px] p-10 md:p-14 shadow-md dark:bg-slate-900 dark:text-stone-100 dark:border-transparent">
            <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-4 dark:text-brand-blue">
              <span className="w-6 h-0.5 bg-brand-yellow"></span> {isEn ? 'STRATEGIC INSIGHTS & ACTIONS' : 'INSIGHT & ĐỀ XUẤT'}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight dark:text-white">{isEn ? 'Key Findings from 90-Day Telemetry' : 'Phát hiện chính từ dữ liệu'}</h2>
            <p className="text-slate-600 text-lg mb-12 max-w-2xl dark:text-slate-400">{isEn ? 'Synthesized across all store transactions, self-operated creator metrics, and affiliate benchmarks.' : 'Tổng hợp từ toàn bộ số liệu shop và kênh sáng tạo Kami Ely trong 90 ngày gần nhất.'}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  id: '01', 
                  title: isEn ? 'Livestream is the Revenue Engine' : 'LIVE là động cơ doanh số', 
                  desc: isEn ? 'Livestreaming contributed 68% of unit sales and 63% of GMV — significantly outperforming standard videos and showcase cards. Prioritize host training and LIVE schedule consistency.' : 'LIVE đóng góp 68% số lượng bán và 63% GMV — vượt xa video và product card. Ưu tiên tần suất và chất lượng LIVE.' 
                },
                { 
                  id: '02', 
                  title: isEn ? 'Official Account Drives Core GMV' : 'Tài khoản chính bán quá tốt', 
                  desc: isEn ? 'The internal self-operated account produced revenue nearly equal to 5,600 external affiliate creators combined, revealing large potential upside in optimizing external affiliate incentive models.' : 'Tài khoản tự vận hành tạo ra doanh số gần bằng 5.600 affiliate. Có dư địa lớn để tối ưu quy trình affiliate.' 
                },
                { 
                  id: '03', 
                  title: isEn ? 'Content & Category Misalignment' : 'Lệch danh mục quảng bá', 
                  desc: isEn ? 'Womenswear accounted for 64% of video content, but Sports & Outdoor swimwear delivered 88% of real revenue. Reallocate video production resources to focus heavily on core swimwear SKUs.' : 'Womenswear chiếm 64% nội dung nhưng Sports & Outdoor chiếm 88% doanh số. Nên điều chỉnh content tập trung đồ bơi.' 
                },
                { 
                  id: '04', 
                  title: isEn ? 'The Power of Nano-Affiliates' : 'Sức mạnh Nano-Affiliate', 
                  desc: isEn ? 'Creators with under 5k followers generated the highest aggregate affiliate GMV. Expand automated outreach and sample seeding strategies targeting micro and nano influencers.' : 'Gần 68% affiliate có dưới 5k follower, nhưng lại tạo GMV lớn nhất. Nên mở rộng chiến lược nano/micro-influencer.' 
                }
              ].map(insight => (
                <div key={insight.id} className="bg-white border border-brand-yellow/30 rounded-3xl p-8 hover:border-brand-yellow/70 transition-all shadow-xs dark:bg-white/5 dark:border-white/10 dark:text-stone-100 dark:hover:bg-white/10">
                  <div className="text-amber-600 font-mono font-bold text-sm tracking-widest mb-4 dark:text-brand-yellow">INSIGHT {insight.id}</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">{insight.title}</h4>
                  <p className="text-slate-600 leading-relaxed dark:text-slate-400">{insight.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Automation */}
        <section id="automation" className="reveal-element opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-4 dark:text-slate-400">
            <span className="w-6 h-0.5 bg-brand-yellow"></span> {isEn ? 'REPORT AUTOMATION (NODE.JS)' : 'TỰ ĐỘNG HÓA BÁO CÁO (NODE.JS)'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight dark:text-white">
            {isEn ? 'Automated PowerPoint Slide Deck Generation with PptxGenJS' : 'Xuất slide tự động với PptxGenJS'}
          </h2>
          <p className="text-slate-600 max-w-3xl leading-relaxed mb-10 dark:text-slate-300">
            {isEn
              ? 'Rather than manually copy-pasting figures into PowerPoint each week, this project integrates an automated Node.js script using pptxgenjs. The script reads structured data.json output and renders 13 presentation-ready, brand-styled slides complete with dual-axis charts and KPI callouts.'
              : 'Thay vì copy-paste dữ liệu thủ công vào PowerPoint hàng tuần, dự án này được tích hợp một script Node.js sử dụng pptxgenjs. Script tự động đọc file dữ liệu data.json đã được làm sạch và render ra bộ 13 slide chuẩn format thương hiệu, đi kèm các biểu đồ phức tạp được code trực tiếp vào slide.'}
          </p>
          
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
                <div className="w-3 h-3 rounded-full bg-brand-yellow-light"></div>
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
              </div>
              <div className="text-xs font-mono text-slate-400">generate-slides.js</div>
            </div>
            <div className="p-6 md:p-8 overflow-x-auto text-sm md:text-base">
              <pre className="font-mono text-slate-300 leading-relaxed">
<span className="text-brand-yellow">const</span> pptxgen = <span className="text-brand-blue">require</span>(<span className="text-brand-blue-light">&apos;pptxgenjs&apos;</span>);
<span className="text-brand-yellow">const</span> fs = <span className="text-brand-blue">require</span>(<span className="text-brand-blue-light">&apos;fs&apos;</span>);
<span className="text-brand-yellow">const</span> DATA = <span className="text-brand-yellow-light">JSON</span>.<span className="text-brand-blue">parse</span>(fs.<span className="text-brand-blue">readFileSync</span>(<span className="text-brand-blue-light">&apos;data.json&apos;</span>, <span className="text-brand-blue-light">&apos;utf-8&apos;</span>));

<span className="text-slate-500">// ================= PALETTE =================</span>
<span className="text-brand-yellow">const</span> NAVY_DEEP = <span className="text-brand-blue-light">&apos;081C29&apos;</span>;
<span className="text-brand-yellow">const</span> CORAL = <span className="text-brand-blue-light">&apos;FF6B4A&apos;</span>;

<span className="text-brand-yellow">const</span> pptx = <span className="text-brand-yellow">new</span> <span className="text-brand-yellow-light">pptxgen</span>();
pptx.<span className="text-brand-blue">defineLayout</span>(&#123; name: <span className="text-brand-blue-light">&apos;WIDE&apos;</span>, width: 13.333, height: 7.5 &#125;);
pptx.layout = <span className="text-brand-blue-light">&apos;WIDE&apos;</span>;

<span className="text-slate-500">/* ======================================================================
   SLIDE 1 — TITLE (Automated Cover Slide)
   ====================================================================== */</span>
<span className="text-brand-yellow">const</span> s = pptx.<span className="text-brand-blue">addSlide</span>();
s.background = &#123; color: NAVY_DEEP &#125;;
s.<span className="text-brand-blue">addText</span>(<span className="text-brand-blue-light">&apos;KAMI ELY&apos;</span>, &#123;
  x: 0.6, y: 1.55, w: 10.5, h: 1.3,
  fontFace: <span className="text-brand-blue-light">&apos;Century Schoolbook&apos;</span>, fontSize: 60, bold: <span className="text-brand-yellow">true</span>, color: <span className="text-brand-blue-light">&apos;FFFFFF&apos;</span>
&#125;);

<span className="text-slate-500">// Populate KPI stats directly from processed telemetry JSON</span>
s.<span className="text-brand-blue">addText</span>(fmtVND(DATA.overview.kpis.total_gmv_period), &#123; x:0.6, y:5.35, fontSize:22, color:CORAL &#125;);

pptx.<span className="text-brand-blue">writeFile</span>(&#123; fileName: <span className="text-brand-blue-light">&apos;Kami_Ely_Presentation.pptx&apos;</span> &#125;).<span className="text-brand-blue">then</span>(() =&gt; &#123;
  <span className="text-brand-yellow-light">console</span>.<span className="text-brand-blue">log</span>(<span className="text-brand-blue-light">&apos;DONE writing pptx&apos;</span>);
&#125;);
              </pre>
            </div>
          </div>
          
          <div className="mt-8 p-6 md:p-8 bg-[#FFF9E6] border border-brand-yellow/30 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-slate-900 mb-2 text-xl dark:text-white">{isEn ? 'Saves 4+ Hours of Reporting Every Week' : 'Tiết kiệm nhiều giờ làm báo cáo'}</h4>
              <p className="text-slate-600 leading-relaxed max-w-2xl dark:text-slate-300">{isEn ? 'This automated pipeline reads JSON exported from Python Pandas, dynamically generating PowerPoint slides with multi-axis Bar and Line charts matching this dashboard design perfectly.' : 'Pipeline này đọc tệp JSON xuất từ Python Pandas, sau đó sinh ra toàn bộ các slide (chứa Bar/Line chart đa trục, biểu đồ Doughnut) khớp hoàn toàn với cấu trúc của Dashboard ở trên, sẵn sàng mang đi trình chiếu (presentation-ready).'}</p>
            </div>
            <button className="whitespace-nowrap px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer dark:bg-brand-yellow dark:text-slate-950 dark:hover:bg-amber-400">
              <Download className="w-5 h-5" /> {isEn ? 'Download Sample Deck (.pptx)' : 'Tải Slide Mẫu (.pptx)'}
            </button>
          </div>
        </section>

      </main>
      
      <footer className="bg-[#FFFDF5] border-t border-brand-yellow/30 text-slate-600 py-12 text-center text-sm dark:bg-slate-950 dark:text-slate-500 dark:border-transparent">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-2">{isEn ? 'Personal Project · TikTok Shop Performance Analytics for Kami Ely' : 'Dự án cá nhân · Phân tích hiệu suất TikTok Shop của Kami Ely'}</p>
          <p>{isEn ? 'Data Analytics Portfolio · Updated 08/2026' : 'Portfolio Data Analytics · Cập nhật 08/2026'}</p>
        </div>
      </footer>
    </div>
  );
}
