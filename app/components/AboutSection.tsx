'use client';

import React, { useState } from 'react';
import { Play, Copy, Check, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import { ProfileData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { trackVisitorAction } from '../lib/visitorTracking';
import { SQL_SCENARIOS, CHART_COLORS } from '../data/aboutSqlData';

interface AboutSectionProps {
  profile: ProfileData;
  onSelectProject?: (projId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export default function AboutSection({ profile, onSelectProject, onNavigateTab }: AboutSectionProps) {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';

  const [activeScenario, setActiveScenario] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [copied, setCopied] = useState(false);

  const scenario = SQL_SCENARIOS[activeScenario];

  const handleRun = () => {
    setShowResult(false);
    setIsRunning(true);
    trackVisitorAction(`SQL Demo: ${scenario.id}`, scenario.id, 'sandbox');
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectScenario = (idx: number) => {
    setActiveScenario(idx);
    setShowResult(false);
    setIsRunning(false);
  };

  const renderChart = () => {
    const s = scenario;
    const tooltipStyle = {
      backgroundColor: isDark ? '#1e293b' : '#fafcfd',
      border: `1px solid ${isDark ? '#334155' : '#d8e6ed'}`,
      borderRadius: '8px',
      fontFamily: 'var(--font-heading)',
      fontSize: '11px',
      color: isDark ? '#f8fafc' : '#1a2332',
      padding: '6px 10px',
    };

    const axisColor = isDark ? '#94a3b8' : '#7b8fa6';

    if (s.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={s.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey={s.xAxisKey} tick={{ fontSize: 10, fontFamily: 'var(--font-heading)', fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={false} formatter={(val: any) => [`${val} ${s.unit}`, '']} />
            <Bar dataKey={s.dataKey} radius={[4, 4, 0, 0]} barSize={36}>
              {s.data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (s.chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={s.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="sqlAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9BE7FA" stopOpacity={isDark ? 0.4 : 0.3} />
                <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey={s.xAxisKey} tick={{ fontSize: 10, fontFamily: 'var(--font-heading)', fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={false} formatter={(val: any) => [`${val} ${s.unit}`, '']} />
            <Area type="monotone" dataKey={s.dataKey} stroke="#9BE7FA" strokeWidth={2} fill="url(#sqlAreaGrad)" dot={false} activeDot={{ r: 4, fill: '#9BE7FA', stroke: isDark ? '#1e293b' : '#fafcfd', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // compare chart (before vs after)
    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={s.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis dataKey={s.xAxisKey} tick={{ fontSize: 10, fontFamily: 'var(--font-heading)', fill: axisColor }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={tooltipStyle} cursor={false} />
          <Bar dataKey="raw" name={isEn ? 'Before (MySQL)' : 'Trước (MySQL)'} fill={isDark ? '#334155' : '#d8e6ed'} radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="optimized" name={isEn ? 'After (Redis)' : 'Sau (Redis)'} fill="#9BE7FA" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const goals = isEn
    ? [
        { title: 'Optimize Data Pipelines', desc: 'Design clean ETL/ELT workflows, master relational databases, and standardize multi-source data for automated analysis.' },
        { title: 'Build Advanced Dashboards', desc: 'Develop real-time BI dashboards on Power BI/Tableau, apply segmentation models and time-series forecasting.' },
        { title: 'Data Storytelling', desc: 'Translate complex technical insights into clear data narratives that help leadership make growth decisions.' },
      ]
    : [
        { title: 'Tối ưu hóa Data Pipeline', desc: 'Thiết kế quy trình ETL/ELT sạch, làm chủ CSDL quan hệ và chuẩn hóa dữ liệu đa nguồn phục vụ phân tích tự động.' },
        { title: 'Xây dựng Dashboard nâng cao', desc: 'Phát triển báo cáo trực quan hóa thời gian thực trên Power BI/Tableau, áp dụng phân khúc và dự báo chuỗi thời gian.' },
        { title: 'Data Storytelling', desc: 'Truyền tải insight kỹ thuật phức tạp thành câu chuyện dữ liệu rõ ràng, hỗ trợ quản trị ra quyết định tăng trưởng.' },
      ];

  return (
    <section id="about" className="section-alt py-20 md:py-28 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Section label */}
        <p className="text-xs font-heading font-semibold uppercase tracking-[0.15em] text-ink-muted mb-3">
          {isEn ? 'About' : 'Giới thiệu'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink mb-10 max-w-2xl leading-tight dark:text-white">
          {isEn
            ? 'Evidence-driven analyst focused on measurable impact.'
            : 'Phân tích dựa trên bằng chứng, tập trung vào tác động đo lường được.'}
        </h2>

        {/* Bio + Goals: 2 column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Bio */}
          <div className="space-y-5">
            <p className="text-base leading-relaxed text-ink-secondary dark:text-slate-300" style={{ fontFamily: 'var(--font-body)' }}>
              {isEn
                ? profile.bio || 'Ma Van Hung is a Data Analyst with a solid foundation in SQL, Python, Power BI, and advanced Excel. Focused on extracting insights from fragmented data, designing visual analytics models, and transforming raw numbers into strategic insights that optimize business decision-making.'
                : profile.bio}
            </p>
            <p className="text-base leading-relaxed text-ink-secondary dark:text-slate-300" style={{ fontFamily: 'var(--font-body)' }}>
              {isEn
                ? 'With a background in Japanese Studies and quantitative research, I bring a unique cross-disciplinary perspective to data analysis, combining rigorous methodology with cultural insight and business acumen.'
                : 'Với nền tảng Nhật Bản học và nghiên cứu định lượng, tôi mang đến góc nhìn liên ngành độc đáo cho phân tích dữ liệu, kết hợp phương pháp nghiên cứu nghiêm ngặt với hiểu biết văn hóa và nhạy bén kinh doanh.'}
            </p>
          </div>

          {/* Career Goals */}
          <div className="space-y-5">
            <p className="text-xs font-heading font-semibold uppercase tracking-[0.15em] text-ink-muted mb-1">
              {isEn ? 'Career Direction' : 'Định hướng nghề nghiệp'}
            </p>
            {goals.map((goal, i) => (
              <div key={i} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-md bg-accent/20 text-accent-deep dark:bg-amber-400/20 dark:text-amber-300 flex items-center justify-center text-xs font-heading font-bold mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-sm font-heading font-semibold text-ink dark:text-white mb-1">{goal.title}</h4>
                  <p className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{goal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SQL Interactive Demo */}
        <div>
          <p className="text-xs font-heading font-semibold uppercase tracking-[0.15em] text-ink-muted mb-3">
            {isEn ? 'Interactive Demo' : 'Thử nghiệm tương tác'}
          </p>
          <h3 className="text-2xl font-heading font-bold text-ink dark:text-white mb-6">
            {isEn ? 'Run a query from my case studies' : 'Chạy thử truy vấn từ các dự án phân tích'}
          </h3>

          {/* Scenario tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {SQL_SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(i)}
                className={`px-3.5 py-2 text-xs font-heading font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                  activeScenario === i
                    ? 'bg-ink text-ground dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs font-bold'
                    : 'bg-ground text-ink-secondary hover:text-ink border border-border-subtle dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-medium mr-1.5 ${activeScenario === i ? 'text-ground/70 dark:text-slate-700' : 'text-ink-muted'}`}>{s.tag}</span>
                {s.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Query panel */}
            <div className="sql-block overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-ground dark:bg-slate-950 dark:border-slate-800">
                <span className="text-[11px] font-heading font-medium text-ink-muted">SQL Query</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-ink-muted hover:text-ink dark:hover:text-white rounded transition-colors cursor-pointer"
                    aria-label="Copy SQL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-accent-deep dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 text-xs font-heading font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    {isRunning ? (isEn ? 'Running...' : 'Đang chạy...') : 'Run'}
                  </button>
                </div>
              </div>
              <pre className="px-4 py-4 text-[13px] leading-relaxed overflow-x-auto whitespace-pre text-slate-800 dark:text-slate-200">
                <code>{scenario.query}</code>
              </pre>
            </div>

            {/* Results panel */}
            <div className="bg-ground border border-border-subtle rounded-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle dark:border-slate-800 dark:bg-slate-950">
                <span className="text-[11px] font-heading font-medium text-ink-muted">
                  {isEn ? 'Result' : 'Kết quả'}
                  {showResult && (
                    <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                      {scenario.data.length} {isEn ? 'rows' : 'dòng'}, {scenario.executionTime}
                    </span>
                  )}
                </span>
                {showResult && onSelectProject && (
                  <button
                    onClick={() => onSelectProject(scenario.projectId)}
                    className="flex items-center gap-1 text-[11px] font-heading font-medium text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {isEn ? 'Full case study' : 'Xem chi tiết'}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {showResult ? (
                <div className="px-4 py-4 space-y-4">
                  {renderChart()}
                  <p className="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed border-l-2 border-accent dark:border-amber-400 pl-3" style={{ fontFamily: 'var(--font-body)' }}>
                    {isEn ? scenario.insightEn : scenario.insight}
                  </p>
                </div>
              ) : (
                <div className="px-4 py-12 text-center text-sm text-ink-muted font-heading">
                  {isRunning ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      {isEn ? 'Executing query...' : 'Đang thực thi truy vấn...'}
                    </span>
                  ) : (
                    isEn ? 'Click "Run" to execute the query.' : 'Nhấn "Run" để thực thi truy vấn.'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
