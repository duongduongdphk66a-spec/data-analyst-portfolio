'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, TrendingUp, Users, ShoppingBag, LayoutGrid, Award, 
  Info, PieChart, BarChart3, LineChart as LineChartIcon, Code, Download, 
  Globe, ExternalLink, Video, Radio, Flame, Sparkles, Filter, ChevronRight, Zap
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';

import {
  shopTrendData, topSKUData, topCreatorsList, topLiveStreams,
  getChannelData, getContentData, affFollowerData, PALETTE,
} from '../data/kamiElyData';

export default function KamiElyProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  const [channelMetric, setChannelMetric] = useState<'units'|'gmv'>('units');
  const [contentMetric, setContentMetric] = useState<'units'|'gmv'>('units');
  const [affMetric, setAffMetric] = useState<'units'|'gmv'|'count'>('units');
  const [skuSortBy, setSkuSortBy] = useState<'units' | 'gmv'>('units');

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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#FFE485]/40 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 transition-all dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <a href="#overview" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Overview' : 'Tổng quan'}</a>
            <a href="#sales" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Sales & Peak Live' : 'Doanh số & Live'}</a>
            <a href="#channels" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Channels' : 'Kênh bán'}</a>
            <a href="#affiliates" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Affiliates' : 'Affiliate'}</a>
            <a href="#sku" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Top SKUs' : 'Sản phẩm chủ lực'}</a>
            <a href="#automation" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Automation' : 'Tự động hóa'}</a>

            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-kami-ely"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer dark:bg-[#9BE7FA] dark:text-slate-950"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-[#F3FCFE] via-[#FFFDF5] to-[#FFF9E6] text-slate-900 pt-16 pb-20 overflow-hidden border-b border-slate-200/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white dark:border-slate-800" id="overview">
        
        {/* Glow Accent */}
        <div className="absolute right-[8%] top-[10%] w-60 h-60 rounded-full bg-gradient-to-tr from-[#9BE7FA] via-[#C8EEF7] to-[#FFE485] opacity-40 blur-3xl pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-10 justify-between items-start mb-12">
            <div className="max-w-2xl space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-md text-xs font-bold font-mono tracking-wide text-slate-900 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <Flame className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#FFD14C]" />
                <span>{isEn ? '90-DAY TELEMETRY DATA · MAY 22 - AUG 19, 2026' : 'DỮ LIỆU TELEMETRY 90 NGÀY · 22/05 - 19/08/2026'}</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-slate-950 dark:text-white">
                {isEn ? 'Kami Ely TikTok Shop:' : 'Kami Ely Trên TikTok Shop:'} <br/>
                <span className="text-[#0D7287] dark:text-[#9BE7FA] font-extrabold text-2xl sm:text-4xl lg:text-5xl">
                  {isEn ? 'Revenue Propelled by LIVE Shopping, Not Paid Ads' : 'Doanh Số Vận Hành Bởi LIVE, Không Phải Quảng Cáo'}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed dark:text-slate-300">
                {isEn 
                  ? 'Performance analysis of Vietnam designer swimwear brand Kami Ely. Extracted across 300 products, 300 affiliates, 300 shoppable videos, and 300 live streams from FastMoss telemetry.'
                  : 'Báo cáo hiệu suất kinh doanh thương hiệu đồ bơi thiết kế Kami Ely. Xử lý và phân tích dữ liệu chuyên sâu từ FastMoss qua 300 mã sản phẩm, 300 creator affiliate, 300 video gắn giỏ hàng và 300 phiên livestream.'}
              </p>
              
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'National Rank:' : 'Hạng toàn quốc:'} <b className="text-[#0D7287] dark:text-[#9BE7FA] font-mono">#2.7k</b>
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'Sports & Outdoor Category:' : 'Ngành Sports & Outdoor:'} <b className="text-[#0D7287] dark:text-[#9BE7FA] font-mono">#88</b>
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'Shop Rating:' : 'Đánh giá shop:'} <b className="text-[#0D7287] dark:text-[#FFD14C] font-mono">3.9 / 5.0</b>
                </span>
              </div>
            </div>
            
            {/* All-time Stat Card */}
            <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-lg min-w-[280px] space-y-3 dark:bg-slate-900/90 dark:border-slate-800">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold dark:text-slate-400">
                {isEn ? 'ALL-TIME TOTAL GMV' : 'TỔNG GMV TOÀN THỜI GIAN'}
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-slate-950 dark:text-white">
                31.4 <span className="text-lg font-bold text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? 'Billion VND' : 'Tỷ đ'}</span>
              </div>
              <div className="text-xs text-slate-600 border-t border-slate-100 pt-3 dark:text-slate-400 dark:border-slate-800">
                {isEn ? 'Accumulated from 235,500 total sold units' : 'Tích lũy từ 235.500 sản phẩm đã bán ra'}
              </div>
            </div>
          </div>

          {/* 90-Day Telemetry Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">46.1k</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? '90-Day Units Sold' : 'Sản phẩm bán (90 ngày)'}</div>
              <div className="text-[10px] font-mono text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? '7.35B VND 90-Day GMV' : '7,4 Tỷ đ GMV 90 ngày'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">163 / 332</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'Active / Registered SKUs' : 'SKU ra đơn / Đã đăng'}</div>
              <div className="text-[10px] font-mono text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? 'Top SKU: CV11 (6.7k sold)' : 'Top 1: Váy chữ A CV11'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">73.5%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'Live Shopping Share' : 'Tỷ trọng từ Livestream'}</div>
              <div className="text-[10px] font-mono text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? '16.9h Mega Live Session' : 'Phiên đỉnh: 272M GMV/phiên'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">527</div>
              <div className="text-xs text-slate-500 mt-1 font-medium dark:text-slate-400">{isEn ? 'Active Nano Affiliates' : 'Nano-Affiliate (1k-5k)'}</div>
              <div className="text-[10px] font-mono text-[#0D7287] font-bold mt-1 dark:text-[#9BE7FA]">{isEn ? '3.3B VND Affiliate GMV' : 'Đóng góp 3,3 Tỷ đ GMV'}</div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        
        {/* SECTION 1: SALES TRAJECTORY & PEAK LIVE CAMPAIGN */}
        <section id="sales" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>01 : XU HƯỚNG DOANH SỐ & CHIẾN DỊCH MEGA LIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Mid-June Sales Peak: Mega-Live Marathons Delivering 1.95k Units/Day' : 'Đỉnh Điểm Giữa Tháng 6: Chuỗi Mega-Live Đạt 1.950 Sản Phẩm/Ngày'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'Analysis of the 90-day trajectory reveals a sharp revenue peak around June 15 (~1,950 units/day, 390M VND GMV/day) propelled by 15-18 hour continuous marathon livestreams by the official store.'
                : 'Phân tích dữ liệu chuỗi 90 ngày cho thấy đợt bùng nổ doanh số mạnh mẽ quanh ngày 15/06 (~1.950 sản phẩm/ngày, 390 triệu đ GMV/ngày), được thúc đẩy trực tiếp từ chuỗi phiên livestream kéo dài 15 - 18 tiếng liên tục của kênh chính.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? '90-Day Weekly Units & GMV Trajectory' : 'Biểu đồ Số Lượng Bán & GMV Theo Tuần (90 Ngày)'}</h3>
                <p className="text-xs text-slate-500 font-mono dark:text-slate-400">Trích xuất từ dữ liệu chi tiết cửa hàng FastMoss</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#C8EEF7]/50 text-slate-900 border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                Đơn vị: Sản phẩm & Triệu VNĐ
              </span>
            </div>

            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={shopTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="units" name={isEn ? 'Units Sold' : 'Sản phẩm bán'} stroke="#0D7287" strokeWidth={3} dot={{ r: 3, fill: '#0D7287' }} activeDot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="gmv" name={isEn ? 'GMV (Million VND)' : 'GMV (Triệu đ)'} stroke="#FFD14C" strokeWidth={3} dot={{ r: 3, fill: '#FFD14C' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Mega Live Sessions Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? 'Top 5 Mega Livestream Sessions in June 2026' : 'Chi Tiết 5 Phiên Mega Livestream Đỉnh Cao (Tháng 6/2026)'}
            </h3>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-mono font-bold uppercase border-b border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Ngày</th>
                    <th className="p-3">Tên Phiên LIVE</th>
                    <th className="p-3">Thời Lượng</th>
                    <th className="p-3">Lượt Xem</th>
                    <th className="p-3">Sản Phẩm Bán</th>
                    <th className="p-3">GMV Phiên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topLiveStreams.map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">{l.date}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{l.title}</td>
                      <td className="p-3 font-mono">{l.duration}</td>
                      <td className="p-3 font-mono">{l.viewers.toLocaleString()}</td>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{l.units.toLocaleString()} SP</td>
                      <td className="p-3 font-mono font-bold text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Triệu đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 2: CHANNELS & CONTENT BREAKDOWN */}
        <section id="channels" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>02 : KÊNH GIAO DỊCH & ĐỊNH DẠNG NỘI DUNG</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Livestream Dominance: 68% of Total Unit Volume' : 'Áp Đảo Của LIVE: Đóng Góp 68% Tổng Sản Phẩm Bán Ra'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Channel Pie */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'By Channel' : 'Theo Kênh Giao Dịch'}</h3>
                <div className="flex bg-slate-100 rounded-lg p-1 dark:bg-slate-800">
                  <button onClick={() => setChannelMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${channelMetric === 'units' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số Lượng'}</button>
                  <button onClick={() => setChannelMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${channelMetric === 'gmv' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={channelData[channelMetric]} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={3} dataKey="value">
                      {channelData[channelMetric].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ trọng']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Content Pie */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'By Content Format' : 'Theo Định Dạng Nội Dung'}</h3>
                <div className="flex bg-slate-100 rounded-lg p-1 dark:bg-slate-800">
                  <button onClick={() => setContentMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${contentMetric === 'units' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số Lượng'}</button>
                  <button onClick={() => setContentMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${contentMetric === 'gmv' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={contentData[contentMetric]} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={3} dataKey="value">
                      {contentData[contentMetric].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ trọng']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: AFFILIATE NETWORK & NANO CREATOR INSIGHT */}
        <section id="affiliates" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>03 : MẠNG LƯỚI AFFILIATE & SỨC MẠNH NANO-CREATOR</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'The Nano-Affiliate Powerhouse (1k - 5k Followers)' : 'Sức Mạnh Đột Phá Của Nhóm Nano-Affiliate (1k - 5k Followers)'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'While mega-creators (>1M followers) have high single-video reach, nano-creators with 1k-5k followers generated the highest aggregate sales (21.8k units, 3.3 Billion VND GMV) with significantly lower acquisition cost.'
                : 'Mặc dù các KOC lớn (>1M follower) có độ phủ video tốt, nhóm nano-creator có từ 1k đến 5k followers lại là lực lượng tạo ra doanh số bán gộp cao nhất (21.800 sản phẩm, 3,3 Tỷ đ GMV) với chi phí chuyển đổi tối ưu hơn 40%.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Follower Tier Bar Chart */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Performance by Follower Tier' : 'Hiệu Quả Theo Tệp Follower'}</h3>
                <div className="flex bg-slate-100 rounded-lg p-1 dark:bg-slate-800">
                  <button onClick={() => setAffMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${affMetric === 'units' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số Lượng'}</button>
                  <button onClick={() => setAffMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${affMetric === 'gmv' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                  <button onClick={() => setAffMetric('count')} className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${affMetric === 'count' ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Count' : 'Số KOC'}</button>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={affFollowerData[affMetric]} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#64748B" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} axisLine={false} tickLine={false} width={70} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="value" fill="#0D7287" radius={[0, 4, 4, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Creators Table Comparison */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFF9E6] border border-[#FFE485] space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0D7287] dark:text-[#FFD14C]" />
                {isEn ? 'Top Performing Creators & Channels' : 'So Sánh Kênh Chính vs KOC Tiêu Biểu'}
              </h3>
              
              <div className="space-y-3">
                {topCreatorsList.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                      <div className="font-bold text-sm text-slate-950 dark:text-white flex items-center gap-2">
                        <span>{c.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {c.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5 dark:text-slate-400">
                        @{c.id} · {c.followers.toLocaleString()} followers
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-[#0D7287] dark:text-[#FFD14C]">
                        {c.gmv.toLocaleString()} Triệu đ
                      </div>
                      <div className="text-xs text-slate-500 font-mono dark:text-slate-400">
                        {c.units.toLocaleString()} SP đã bán
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: TOP SKUs PERFORMANCE MATRIX */}
        <section id="sku" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>04 : MA TRẬN SẢN PHẨM CHỦ LỰC (TOP SKUS)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Product Matrix: Top 5 Best-Selling Swimwear & Apparel SKUs' : 'Ma Trận Sản Phẩm: Top 5 SKU Đồ Bơi & Thời Trang Bán Chạy Nhất'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSKUData.map((sku, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:border-[#9BE7FA] transition-all dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#FFE485]/40 text-slate-950 font-mono font-bold text-xs border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700">
                    Mã SKU: {sku.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    Hoa hồng: {sku.commission}%
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-950 line-clamp-2 leading-snug dark:text-white">
                  {sku.name}
                </h4>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Số lượng bán</div>
                    <div className="text-base font-black font-mono text-slate-950 dark:text-white">
                      {sku.units.toLocaleString()} SP
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Doanh thu GMV</div>
                    <div className="text-base font-black font-mono text-[#0D7287] dark:text-[#9BE7FA]">
                      {sku.gmv} Triệu đ
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono dark:text-slate-400">
                  Giá bán niêm yết: {sku.price.toLocaleString()} VNĐ
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: NODE.JS PPTX AUTOMATION */}
        <section id="automation" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>05 : TỰ ĐỘNG HÓA BÁO CÁO (AUTOMATION PIPELINE)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Automated PowerPoint Slide Deck Generation (Node.js & PptxGenJS)' : 'Tự Động Hóa Xuất Báo Cáo PowerPoint Với Node.js & PptxGenJS'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn
                ? 'To eliminate 4+ hours of manual weekly reporting, a custom Node.js pipeline parses telemetry JSON and dynamically generates 13 presentation-ready brand slides complete with embedded multi-axis charts.'
                : 'Nhằm tiết kiệm hơn 4 giờ làm báo cáo thủ công mỗi tuần, một pipeline Node.js tùy biến đọc file telemetry JSON và tự động kết xuất bộ 13 slide chuẩn format thương hiệu đi kèm biểu đồ đa trục hoàn chỉnh.'}
            </p>
          </div>

          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFD14C]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFE485]"></div>
                <div className="w-3 h-3 rounded-full bg-[#9BE7FA]"></div>
              </div>
              <div className="text-xs font-mono text-slate-400">generate-slides.js</div>
            </div>
            <div className="p-6 sm:p-8 overflow-x-auto text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              <pre>
<span className="text-[#FFD14C]">const</span> pptx = <span className="text-[#9BE7FA]">require</span>(<span className="text-[#FFE485]">&apos;pptxgenjs&apos;</span>);
<span className="text-[#FFD14C]">const</span> fs = <span className="text-[#9BE7FA]">require</span>(<span className="text-[#FFE485]">&apos;fs&apos;</span>);
<span className="text-[#FFD14C]">const</span> DATA = <span className="text-[#C8EEF7]">JSON</span>.<span className="text-[#9BE7FA]">parse</span>(fs.<span className="text-[#9BE7FA]">readFileSync</span>(<span className="text-[#FFE485]">&apos;data.json&apos;</span>, <span className="text-[#FFE485]">&apos;utf-8&apos;</span>));

<span className="text-slate-500">{'// Initialize presentation layout & theme tokens'}</span>
<span className="text-[#FFD14C]">const</span> pres = <span className="text-[#FFD14C]">new</span> <span className="text-[#C8EEF7]">pptx</span>();
pres.<span className="text-[#9BE7FA]">defineLayout</span>(&#123; name: <span className="text-[#FFE485]">&apos;WIDE&apos;</span>, width: 13.333, height: 7.5 &#125;);
pres.layout = <span className="text-[#FFE485]">&apos;WIDE&apos;</span>;

<span className="text-slate-500">{'// Slide 1: Executive KPI Summary'}</span>
<span className="text-[#FFD14C]">const</span> s1 = pres.<span className="text-[#9BE7FA]">addSlide</span>();
s1.background = &#123; color: <span className="text-[#FFE485]">&apos;081C29&apos;</span> &#125;;
s1.<span className="text-[#9BE7FA]">addText</span>(<span className="text-[#FFE485]">&apos;KAMI ELY · PERFORMANCE REVIEW&apos;</span>, &#123; x: 0.6, y: 1.5, fontSize: 36, color: <span className="text-[#FFE485]">&apos;FFFFFF&apos;</span>, bold: <span className="text-[#FFD14C]">true</span> &#125;);
s1.<span className="text-[#9BE7FA]">addText</span>(fmtVND(DATA.overview.kpis.total_gmv_period), &#123; x: 0.6, y: 3.2, fontSize: 24, color: <span className="text-[#FFE485]">&apos;FFD14C&apos;</span> &#125;);

pres.<span className="text-[#9BE7FA]">writeFile</span>(&#123; fileName: <span className="text-[#FFE485]">&apos;Kami_Ely_Automated_Deck.pptx&apos;</span> &#125;);
              </pre>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-50 border-t border-slate-200/80 text-center text-xs text-slate-500 dark:bg-slate-950 dark:border-slate-900 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            Dự án phân tích hiệu suất TikTok Shop · Thương hiệu Kami Ely
          </p>
          <p>
            Ma Văn Hùng · Portfolio Data Analyst · Cập nhật 2026
          </p>
        </div>
      </footer>

    </div>
  );
}
