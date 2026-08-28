'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Database, Code2, Sparkles, Mail, Github, Linkedin, 
  Layers, Terminal, CheckCircle2, ChevronDown, ChevronUp,
  BarChart3, TrendingUp, Cpu, LineChart as LineChartIcon,
  Play, Copy, Check, ArrowRight, FileText, Download,
  Lightbulb, ShieldAlert, Zap, Globe
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  AreaChart, Area, Cell 
} from 'recharts';
import { ProfileData, SkillItem, CareerGoalItem } from '../types';
import { sanitizeUrl } from '../lib/security';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';

interface AboutSectionProps {
  profile: ProfileData;
  onSelectProject?: (projId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

// Interactive SQL Preset Scenarios for Signature Feature
const SQL_SCENARIOS = [
  {
    id: 'kami-sales',
    title: 'TikTok Shop Channel GMV',
    tag: 'E-Commerce Analytics',
    projectId: 'proj-kami-ely',
    query: `SELECT 
    channel_name,
    SUM(gmv_millions) AS total_gmv_m,
    ROUND(SUM(gmv_millions) * 100.0 / 7400, 2) AS share_pct
FROM kami_ely_sales_logs
GROUP BY channel_name
ORDER BY total_gmv_m DESC;`,
    executionTime: '12ms',
    data: [
      { name: 'Live Shopping', gmv: 4665, share: '63.0%' },
      { name: 'Short Video', gmv: 1607, share: '21.7%' },
      { name: 'Product Card', gmv: 1128, share: '15.3%' }
    ],
    chartType: 'bar',
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Triệu đ',
    insight: 'Livestream đóng góp 63.04% tổng doanh số GMV, tạo tỷ lệ chuyển đổi cao gấp 2.8 lần so với định dạng video ngắn truyền thống.'
  },
  {
    id: 'japan-tourism',
    title: 'Japan Tourist Growth (2013-2022)',
    tag: 'Time-Series Analysis',
    projectId: 'proj-heritage-japan',
    query: `SELECT 
    year, 
    inbound_tourists_millions AS tourists_m,
    total_spend_trillion_yen AS spend_tyen
FROM jnto_heritage_stats
WHERE year BETWEEN '2013' AND '2022'
ORDER BY year ASC;`,
    executionTime: '18ms',
    data: [
      { year: "'13", tourists: 10.4, spend: 1.41 },
      { year: "'15", tourists: 19.7, spend: 3.48 },
      { year: "'17", tourists: 28.7, spend: 4.41 },
      { year: "'19", tourists: 31.9, spend: 4.81 },
      { year: "'20", tourists: 4.1, spend: 0.70 },
      { year: "'22", tourists: 3.4, spend: 0.35 }
    ],
    chartType: 'area',
    xAxisKey: 'year',
    dataKey: 'spend',
    unit: 'Nghìn Tỷ Yên',
    insight: 'Chi tiêu du lịch đạt đỉnh 4.81 nghìn tỷ Yên năm 2019 (+318% so với 2010), phần lớn đến từ du khách văn hóa có mức chi tiêu bình quân cao.'
  },
  {
    id: 'library-perf',
    title: 'Query Latency (Before vs Redis)',
    tag: 'Architecture & Optimization',
    projectId: 'proj-library-bus',
    query: `SELECT 
    operation_type,
    avg_latency_raw_mysql_ms AS raw_mysql,
    avg_latency_with_redis_ms AS redis_cached
FROM bus_telemetry_logs
GROUP BY operation_type;`,
    executionTime: '8ms',
    data: [
      { name: 'Check Book Status', raw: 380, optimized: 24 },
      { name: 'Hold Reservation', raw: 520, optimized: 32 },
      { name: 'Vehicle GPS Route', raw: 450, optimized: 28 }
    ],
    chartType: 'compare',
    xAxisKey: 'name',
    dataKey: 'optimized',
    unit: 'ms (thấp hơn là tốt hơn)',
    insight: 'Áp dụng Redis Cache phân tán và Celery Workers giúp giảm 93.7% độ trễ truy vấn (từ 450ms xuống 28ms), chịu tải 500 RPS không nghẽn.'
  }
];

export default React.memo(function AboutSection({ profile, onSelectProject, onNavigateTab }: AboutSectionProps) {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const activeScenario = SQL_SCENARIOS[selectedScenarioIdx];

  const handleCopyEmail = () => {
    const emailToCopy = profile.email || 'mavanhung.da@gmail.com';
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    trackVisitorAction('Sao chép email', emailToCopy, 'contact');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(activeScenario.query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 1800);
  };

  const handleScenarioChange = (idx: number) => {
    setSelectedScenarioIdx(idx);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 300);
    trackVisitorAction(`Bấm sandbox query: ${SQL_SCENARIOS[idx].title}`, SQL_SCENARIOS[idx].id, 'sandbox');
  };

  // Skill clusters grouped with deep technical details (no fake % bars)
  const skillClusters = [
    {
      groupTitle: language === 'en' ? 'Querying & Languages' : 'Ngôn Ngữ & Truy Vấn',
      icon: Code2,
      skills: [
        {
          name: 'SQL (PostgreSQL / MySQL)',
          level: 'Proficient / Production Ready',
          details: ['Window Functions (ROW_NUMBER, RANK, LEAD/LAG)', 'Complex Multi-table Joins & CTEs', 'Subqueries & Index Optimization', 'Aggregations & Grouping Sets']
        },
        {
          name: 'Python for Analytics',
          level: 'Proficient / Data Wrangling',
          details: ['Pandas & NumPy Data Cleaning', 'Matplotlib & Seaborn Visuals', 'Automated ETL Wrangling Scripts', 'API Data Ingestion']
        }
      ]
    },
    {
      groupTitle: language === 'en' ? 'BI & Data Storytelling' : 'Trực Quan Hóa & BI Dashboard',
      icon: BarChart3,
      skills: [
        {
          name: 'Power BI & DAX',
          level: 'Advanced Data Modeling',
          details: ['Star Schema Relational Modeling', 'Complex DAX Measures & CALCULATE', 'Interactive Executive Dashboards', 'Row-Level Security (RLS)']
        },
        {
          name: 'Advanced Excel & Power Query',
          level: 'Expert / Data Modeling',
          details: ['Power Query ETL Transformations', 'Dynamic Arrays & XLOOKUP/INDEX-MATCH', 'Pivot Tables & Scenario Modeling', 'Financial & KPI Summary Modeling']
        }
      ]
    },
    {
      groupTitle: language === 'en' ? 'Statistical & EDA Modeling' : 'Thống Kê & Phân Tích Khám Phá',
      icon: TrendingUp,
      skills: [
        {
          name: 'EDA & Business Statistics',
          level: 'Applied Analytical Methods',
          details: ['Exploratory Data Analysis (EDA)', 'Time-series Trend Decomposition', 'Hypothesis Testing & A/B Evaluation', 'Customer Segmentation (RFM)']
        }
      ]
    },
    {
      groupTitle: language === 'en' ? 'Data Engineering & Workflows' : 'Kiến Trúc CSDL & Vận Hành',
      icon: Database,
      skills: [
        {
          name: 'Database Schema & Pipelines',
          level: 'Systems & Reliability',
          details: ['Relational Schema Design (3NF / ERD)', 'Transaction ACID Integrity Rules', 'Redis Cache & Celery Background Tasks', 'Git & GitHub Version Control']
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-8 lg:px-10 space-y-14 animate-in fade-in duration-400">
      
      {/* 1. HERO SECTION: PUNCHY POSITIONING + LIVE METRICS */}
      <section className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F9FD] border border-slate-200/80 shadow-sm overflow-hidden dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 dark:border-slate-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-data-grid pointer-events-none opacity-60 dark:opacity-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Bio & Core Pitch */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Status Live Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#9BE7FA] shadow-xs text-xs font-semibold text-slate-800 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#10B981] -ml-3" />
              <span className="font-mono text-[11px] tracking-wide uppercase text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Active Analytics Portfolio' : 'Hồ Sơ Năng Lực Data Analyst'}
              </span>
            </div>

            {/* Name & Sharp Role */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight dark:text-white">
                {profile.name || 'Ma Văn Hùng'}
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {profile.subtitle || (language === 'en' ? 'Intern Data Analyst | Business Intelligence' : 'Intern Data Analyst | Business Intelligence & Analytics')}
              </p>
            </div>

            {/* Sharp Value Proposition */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              {profile.bio || (language === 'en' 
                ? 'Transforming fragmented raw data into structured analytics pipelines, intuitive visual dashboards, and clear commercial insights that support high-impact business decisions.'
                : 'Khai phá giá trị từ số liệu thực tế: Xây dựng mô hình phân tích logic, trực quan hóa dashboard tương tác bằng SQL, Python, Power BI và đưa ra insight hỗ trợ ra quyết định kinh doanh chuẩn xác.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  trackVisitorAction('Bấm CTA Xem Dự Án Hero', 'projects', 'navigation');
                  if (onNavigateTab) onNavigateTab('projects');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer inline-flex items-center gap-2 active:scale-95 dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7]"
              >
                <span>{t('cta_view_projects', 'Khám Phá Dự Án')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  trackVisitorAction('Bấm CTA Xem CV Hero', 'cv', 'navigation');
                  if (onNavigateTab) onNavigateTab('cv');
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all duration-200 cursor-pointer inline-flex items-center gap-2 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>{language === 'en' ? 'Resume & Experience' : 'Học Vấn & CV'}</span>
              </button>

              <button
                onClick={handleCopyEmail}
                className="px-4 py-2.5 rounded-xl bg-[#FFE485]/40 hover:bg-[#FFE485]/70 text-slate-900 font-semibold text-sm border border-[#FFD14C]/50 transition-all duration-200 cursor-pointer inline-flex items-center gap-2 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Mail className="w-4 h-4 text-slate-700 dark:text-amber-300" />}
                <span>{copiedEmail ? (language === 'en' ? 'Email Copied!' : 'Đã sao chép email!') : (profile.email || 'mavanhung.da@gmail.com')}</span>
              </button>
            </div>

          </div>

          {/* Right Column: 4 Real Data Telemetry Badges */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 hover:border-[#9BE7FA] transition-colors dark:bg-slate-800/80 dark:border-slate-700">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block dark:text-slate-400">
                {language === 'en' ? 'Data Processed' : 'Khối lượng dữ liệu'}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight tabular-nums dark:text-white">
                50,000+
              </div>
              <p className="text-xs text-slate-600 font-medium dark:text-slate-400">
                {language === 'en' ? 'Rows & Transactions Analyzed' : 'Bản ghi giao dịch & vận hành'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 hover:border-[#FFD14C] transition-colors dark:bg-slate-800/80 dark:border-slate-700">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block dark:text-slate-400">
                {language === 'en' ? 'Case Studies' : 'Dự án thực tế'}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#0D7287] tracking-tight tabular-nums dark:text-[#9BE7FA]">
                3 Projects
              </div>
              <p className="text-xs text-slate-600 font-medium dark:text-slate-400">
                {language === 'en' ? 'E-Com, Time-Series & Logistics' : 'TikTok Shop, Du lịch & Logistics'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 hover:border-[#FFD14C] transition-colors dark:bg-slate-800/80 dark:border-slate-700">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block dark:text-slate-400">
                {language === 'en' ? 'Query Latency' : 'Tối ưu hiệu năng'}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600 tracking-tight tabular-nums dark:text-[#FFD14C]">
                -93.7%
              </div>
              <p className="text-xs text-slate-600 font-medium dark:text-slate-400">
                {language === 'en' ? '450ms down to 28ms via Redis' : 'Giảm từ 450ms xuống 28ms'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 hover:border-[#9BE7FA] transition-colors dark:bg-slate-800/80 dark:border-slate-700">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block dark:text-slate-400">
                {language === 'en' ? 'Core Stack' : 'Công cụ chủ lực'}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight tabular-nums dark:text-white">
                SQL · Py
              </div>
              <p className="text-xs text-slate-600 font-medium dark:text-slate-400">
                {language === 'en' ? 'Power BI & Advanced Excel' : 'Power BI, DAX & Excel nâng cao'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 2. SIGNATURE FEATURE: "LIVE INTERACTIVE SQL & INSIGHT SANDBOX" */}
      <section className="space-y-4">
        
        {/* Header & Description */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C8EEF7]/50 border border-[#9BE7FA] text-xs font-mono font-bold text-slate-900 mb-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <Terminal className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'SIGNATURE FEATURE // INTERACTIVE QUERY SANDBOX' : 'TÍNH NĂNG ĐỘC BẢN // LIVE SQL & INSIGHT INSPECTOR'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight dark:text-white">
              {language === 'en' ? 'Direct Query Simulation & Live Insight' : 'Truy Vấn Trực Tiếp & Khám Phá Dữ Liệu'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {language === 'en' 
                ? 'Select an analytical problem below to simulate the SQL query, run on sample data, and inspect the resulting visual insight.'
                : 'Bấm chọn một bài toán phân tích thực tế để chạy thử câu lệnh SQL, quan sát biểu đồ tương tác và rút ra insight kinh doanh.'}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'en' ? 'In-Memory Telemetry Engine' : 'Engine Dữ Liệu Tương Tác'}</span>
          </div>
        </div>

        {/* Tab Selector for 3 Scenarios */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SQL_SCENARIOS.map((sc, idx) => {
            const isSelected = selectedScenarioIdx === idx;
            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(idx)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-white border-[#0D7287] shadow-sm ring-2 ring-[#9BE7FA]/40 dark:bg-slate-800 dark:border-[#9BE7FA]'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                    Query #{idx + 1}
                  </span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-[#0D7287] dark:text-[#9BE7FA]' : 'text-slate-400'}`}>
                    {sc.tag}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 line-clamp-1 dark:text-white">
                  {sc.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Terminal + Live Recharts Output split view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-3xl bg-[#090D16] border border-slate-800 p-5 sm:p-6 shadow-md text-white">
          
          {/* Left Column: SQL Terminal */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Terminal Topbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">
                  query_workbench.sql
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeScenario.executionTime}
                </span>

                <button
                  onClick={handleCopyQuery}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy SQL Query"
                >
                  {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedQuery ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* SQL Code Box with syntax styling */}
            <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 overflow-x-auto p-3 rounded-xl bg-[#050810] border border-slate-800/80 selection:bg-[#9BE7FA]/30">
              <code>
                {activeScenario.query}
              </code>
            </pre>

            {/* Business Insight Callout Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFE485]">
                <Lightbulb className="w-4 h-4 text-[#FFD14C]" />
                <span>{language === 'en' ? 'Key Analytical Insight:' : 'Phát Hiện & Insight Kinh Doanh:'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeScenario.insight}
              </p>
            </div>

          </div>

          {/* Right Column: Live Responsive Visual Output */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#0F1626] border border-slate-800/90 p-4 sm:p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                {language === 'en' ? 'Query Output Visual' : 'Biểu Đồ Kết Quả'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Unit: {activeScenario.unit}
              </span>
            </div>

            {/* Chart Container */}
            <div className="h-48 sm:h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {activeScenario.chartType === 'area' ? (
                  <AreaChart data={activeScenario.data as any} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="queryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9BE7FA" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} ${activeScenario.unit}`, 'Chi tiêu du lịch']}
                    />
                    <Area type="monotone" dataKey="spend" stroke="#9BE7FA" strokeWidth={2.5} fillOpacity={1} fill="url(#queryAreaGrad)" />
                  </AreaChart>
                ) : activeScenario.chartType === 'compare' ? (
                  <BarChart data={activeScenario.data as any} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [`${val} ms`, name === 'raw' ? 'MySQL Thường' : 'Redis Caching']}
                    />
                    <Bar dataKey="raw" fill="#475569" radius={[4, 4, 0, 0]} name="raw" />
                    <Bar dataKey="optimized" fill="#FFD14C" radius={[4, 4, 0, 0]} name="optimized" />
                  </BarChart>
                ) : (
                  <BarChart data={activeScenario.data as any} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} Triệu đ`, 'Doanh số GMV']}
                    />
                    <Bar dataKey="gmv" radius={[4, 4, 0, 0]}>
                      {activeScenario.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#9BE7FA' : index === 1 ? '#FFD14C' : '#FFE485'} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Jump to full case study button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  trackVisitorAction(`Xem Case Study từ Sandbox: ${activeScenario.projectId}`, activeScenario.projectId, 'project');
                  if (onSelectProject) {
                    onSelectProject(activeScenario.projectId);
                  } else if (onNavigateTab) {
                    onNavigateTab('projects');
                  }
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-[#9BE7FA] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'en' ? 'Open Full Deep-Dive Case Study' : 'Mở Case Study Phân Tích Đầy Đủ'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 3. ABOUT ME & STRATEGIC CAREER PILLARS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Analytical Philosophy */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFE485]/40 border border-[#FFD14C]/60 text-xs font-bold text-slate-900 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{language === 'en' ? 'CORE PHILOSOPHY' : 'TRIẾT LÝ PHÂN TÍCH'}</span>
          </div>

          <h2 className="text-2xl font-black text-slate-950 tracking-tight dark:text-white">
            {language === 'en' ? 'Data-Driven, Action-Oriented' : 'Tư Duy Logic & Kể Chuyện Bằng Số Liệu'}
          </h2>

          <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
            {language === 'en'
              ? 'Data only creates value when it directly answers concrete business questions. My objective is to bridge technical queries (SQL, Python ETL) with managerial clarity (KPI Dashboards, Cost Optimization).'
              : 'Dữ liệu chỉ thực sự tạo ra giá trị khi giải quyết đúng bài toán kinh doanh. Mục tiêu của tôi là kết nối giữa kỹ thuật truy vấn dữ liệu chuyên sâu (SQL, Python) với góc nhìn quản trị kinh doanh thực tiễn (Dashboard, Tối ưu chi phí và tăng trưởng GMV).'}
          </p>

          {/* Contact Information & Socials */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 dark:bg-slate-900/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Email:</span>
              <button 
                onClick={handleCopyEmail}
                className="hover:text-[#0D7287] dark:hover:text-[#9BE7FA] font-medium underline cursor-pointer"
              >
                {profile.email || 'mavanhung.da@gmail.com'}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {profile.github && (
                <a
                  href={sanitizeUrl(profile.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={sanitizeUrl(profile.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D7287] text-white text-xs font-semibold rounded-xl hover:bg-[#095261] shadow-2xs dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7]"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: 3 Career Pillars */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C8EEF7]/50 border border-[#9BE7FA] text-xs font-bold text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('about_career_goals', 'MỤC TIÊU & ĐỊNH HƯỚNG')}</span>
          </div>

          <h2 className="text-2xl font-black text-slate-950 tracking-tight dark:text-white">
            {language === 'en' ? 'Strategic Focus Areas' : 'Trọng Tâm Năng Lực Phát Triển'}
          </h2>

          <div className="space-y-3.5 pt-1">
            {(profile.careerGoalsList || []).map((goal, idx) => (
              <div 
                key={goal.id || `goal-${idx}`} 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#9BE7FA] transition-all dark:bg-slate-900/80 dark:border-slate-800"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFE485] text-slate-900 font-mono font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs dark:bg-[#FFD14C]">
                    0{idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                      {goal.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                      {goal.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* 4. GROUPED SKILLS MATRIX (NO FAKE PROGRESS BARS) */}
      <section className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C8EEF7]/50 border border-[#9BE7FA] text-xs font-bold text-slate-900 mb-1 dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <Cpu className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'SKILLS MATRIX' : 'MA TRẬN KỸ NĂNG & NĂNG LỰC'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight dark:text-white">
            {language === 'en' ? 'Technical Stack & Applied Analytics' : 'Kỹ Năng Kỹ Thuật & Khả Năng Ứng Dụng'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {language === 'en'
              ? 'Structured by capability areas with concrete application techniques, without arbitrary percentage metrics.'
              : 'Trình bày theo nhóm năng lực chuyên môn và các kỹ thuật thực chiến, không dùng thanh phần trăm mang tính cảm tính.'}
          </p>
        </div>

        {/* 4 Grouped Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillClusters.map((cluster, cIdx) => {
            const ClusterIcon = cluster.icon;
            return (
              <div 
                key={cIdx} 
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#9BE7FA] transition-all space-y-4 dark:bg-slate-900/80 dark:border-slate-800"
              >
                {/* Cluster Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-[#C8EEF7]/60 text-slate-900 flex items-center justify-center dark:bg-slate-800 dark:text-[#9BE7FA]">
                    <ClusterIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    {cluster.groupTitle}
                  </h3>
                </div>

                {/* Skills within cluster */}
                <div className="space-y-4">
                  {cluster.skills.map((sk, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                          {sk.name}
                        </span>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FFE485]/40 text-slate-800 dark:bg-amber-950/40 dark:text-amber-300">
                          {sk.level}
                        </span>
                      </div>

                      {/* Detail capability tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {sk.details.map((dt, dIdx) => (
                          <span 
                            key={dIdx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          >
                            • {dt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
});
