'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Play, Copy, Check, ArrowRight, Upload, Download, 
  Sparkles, Database, FileSpreadsheet
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { ProfileData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { trackVisitorAction } from '../lib/visitorTracking';
import { SQL_SCENARIOS } from '../data/aboutSqlData';
import { gsap, useGSAP } from '../lib/gsap';
import { executeClientSql, SqlQueryResult } from '../lib/sqlEngine';
import { exportChartAsPng } from '../lib/chartExport';
import { useToast } from './ui/Toast';
import { validateUploadedFile } from '../lib/security';

const AboutSqlChart = dynamic(() => import('./charts/AboutSqlChart'), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full flex items-center justify-center text-xs text-ink-muted animate-pulse font-heading">
      Đang tải trực quan hóa...
    </div>
  ),
});

interface AboutSectionProps {
  profile: ProfileData;
  onSelectProject?: (_projId: string) => void;
  onNavigateTab?: (_tabId: string) => void;
}

export default function AboutSection({ profile, onSelectProject, onNavigateTab: _onNavigateTab }: AboutSectionProps) {
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { showToast } = useToast();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';

  // Mode: Preset vs Custom SQL
  const [sandboxMode, setSandboxMode] = useState<'presets' | 'custom'>('presets');

  // Preset mode state
  const [activeScenario, setActiveScenario] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [copied, setCopied] = useState(false);
  const [typedQuery, setTypedQuery] = useState(SQL_SCENARIOS[0].query);
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const sectionRef = useRef<HTMLElement>(null);

  // Custom SQL state
  const [customQuery, setCustomQuery] = useState(
    'SELECT channel_name, SUM(gmv_millions) AS total_gmv, COUNT(*) AS orders FROM sales_data GROUP BY channel_name ORDER BY total_gmv DESC;'
  );
  const [customData, setCustomData] = useState<Record<string, any>[]>([
    { channel_name: 'Live Shopping', gmv_millions: 4665, orders: 1850, category: 'Sports' },
    { channel_name: 'Short Video', gmv_millions: 1607, orders: 620, category: 'Apparel' },
    { channel_name: 'Product Showcase', gmv_millions: 1128, orders: 490, category: 'Accessories' },
    { channel_name: 'Affiliate Creator', gmv_millions: 3300, orders: 1210, category: 'Sports' },
  ]);
  const [customResult, setCustomResult] = useState<SqlQueryResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const scenario = SQL_SCENARIOS[activeScenario];

  // Typewriter effect when scenario changes in preset mode
  useEffect(() => {
    if (sandboxMode !== 'presets') return;
    const fullQuery = scenario.query;
    let i = 0;
    const timer = setInterval(() => {
      i += 3;
      if (i >= fullQuery.length) {
        setTypedQuery(fullQuery);
        clearInterval(timer);
      } else {
        setTypedQuery(fullQuery.slice(0, i));
      }
    }, 15);

    return () => clearInterval(timer);
  }, [scenario.query, sandboxMode]);

  useGSAP(() => {
    gsap.from('.about-goal-item', {
      autoAlpha: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
    });

    gsap.from('.about-sql-demo', {
      autoAlpha: 0,
      y: 25,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  const handleRunPreset = () => {
    setShowResult(false);
    setIsRunning(true);
    trackVisitorAction(`SQL Demo: ${scenario.id}`, scenario.id, 'sandbox');
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
      showToast(isEn ? 'Query executed successfully!' : 'Đã thực thi câu lệnh SQL thành công!', 'success');
    }, 600);
  };

  const handleRunCustomSql = () => {
    setIsRunning(true);
    trackVisitorAction('Custom SQL Sandbox Execution', customQuery.substring(0, 40), 'sandbox');
    setTimeout(() => {
      const res = executeClientSql(customQuery, customData);
      setCustomResult(res);
      setIsRunning(false);
      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast(isEn ? `Returned ${res.rowCount} rows in ${res.executionTimeMs}ms` : `Trả về ${res.rowCount} dòng trong ${res.executionTimeMs}ms`, 'success');
      }
    }, 250);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadedFile(file, { allowedExtensions: ['.csv'], maxSizeBytes: 5 * 1024 * 1024 });
    if (!validation.isValid) {
      showToast(validation.error || (isEn ? 'Invalid file.' : 'Tệp không hợp lệ.'), 'error');
      e.target.value = '';
      return;
    }

    try {
      const Papa = (await import('papaparse')).default;
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const parsed = results.data as Record<string, any>[];
            setCustomData(parsed);
            setUploadedFileName(file.name);
            setCustomQuery(`SELECT * FROM ${file.name.replace(/\.[^/.]+$/, '')} LIMIT 10;`);
            setCustomResult(null);
            showToast(isEn ? `Loaded ${file.name} (${parsed.length} rows)` : `Đã nạp tệp ${file.name} (${parsed.length} dòng)`, 'success');
            trackVisitorAction('Tải tệp CSV lên SQL Sandbox', file.name, 'sandbox');
          }
        },
        error: () => {
          showToast(isEn ? 'Failed to parse CSV file.' : 'Không thể phân tích tệp CSV.', 'error');
        },
      });
    } catch {
      showToast(isEn ? 'Failed to load CSV processor.' : 'Không thể tải bộ xử lý CSV.', 'error');
    }
  };

  const handleCopyPreset = () => {
    navigator.clipboard.writeText(scenario.query);
    setCopied(true);
    showToast(isEn ? 'SQL copied to clipboard' : 'Đã sao chép câu lệnh SQL', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectScenario = (idx: number) => {
    setActiveScenario(idx);
    setShowResult(false);
    setIsRunning(false);
  };

  const handleExportChart = async () => {
    const success = await exportChartAsPng('about-sql-chart-container', 'sql-query-chart.png');
    if (success) {
      showToast(isEn ? 'Chart image downloaded!' : 'Đã tải ảnh biểu đồ thành công!', 'success');
    }
  };

  const renderPresetChart = () => {
    if (!isMounted) {
      return (
        <div className="h-[160px] w-full flex items-center justify-center text-xs text-ink-muted animate-pulse font-heading">
          Đang tải trực quan hóa...
        </div>
      );
    }
    return <AboutSqlChart scenario={scenario} isDark={isDark} isEn={isEn} />;
  };

  const defaultGoalsEn = [
    { title: 'Optimize Data Pipelines', desc: 'Design clean ETL/ELT workflows, master relational databases, and standardize multi-source data for automated analysis.' },
    { title: 'Build Advanced Dashboards', desc: 'Develop real-time BI dashboards on Power BI/Tableau, apply segmentation models and time-series forecasting.' },
    { title: 'Data Storytelling', desc: 'Translate complex technical insights into clear data narratives that help leadership make growth decisions.' },
  ];

  const defaultGoalsVi = [
    { title: 'Tối ưu hóa Data Pipeline', desc: 'Thiết kế quy trình ETL/ELT sạch, làm chủ CSDL quan hệ và chuẩn hóa dữ liệu đa nguồn phục vụ phân tích tự động.' },
    { title: 'Xây dựng Dashboard nâng cao', desc: 'Phát triển báo cáo trực quan hóa thời gian thực trên Power BI/Tableau, áp dụng phân khúc và dự báo chuỗi thời gian.' },
    { title: 'Data Storytelling', desc: 'Truyền tải insight kỹ thuật phức tạp thành câu chuyện dữ liệu rõ ràng, hỗ trợ quản trị ra quyết định tăng trưởng.' },
  ];

  const goals = (profile.careerGoalsList && profile.careerGoalsList.length > 0)
    ? profile.careerGoalsList.map(g => ({ title: g.title, desc: g.desc }))
    : (isEn ? defaultGoalsEn : defaultGoalsVi);

  return (
    <section id="about" ref={sectionRef} className="section-alt py-20 md:py-28 transition-colors duration-200">
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
        <div className="about-goals-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Bio Column with Avatar */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 dark:bg-slate-900/80 border border-border-subtle dark:border-slate-800 shadow-xs">
              {profile.avatarUrl ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#0D7287]/40 dark:ring-[#9BE7FA]/40 shadow-sm shrink-0 relative">
                  <Image 
                    src={profile.avatarUrl} 
                    alt={profile.name || 'Avatar'} 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover" 
                    unoptimized={profile.avatarUrl.startsWith('data:') || profile.avatarUrl.startsWith('blob:')}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0D7287] to-cyan-500 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
                  {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 3).toUpperCase() : 'MVH'}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-ink dark:text-white font-heading">
                  {profile.name || 'Ma Văn Hùng'}
                </h3>
                <p className="text-xs text-ink-muted dark:text-slate-400 font-heading">
                  {profile.title || 'Data Analyst'}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isEn ? 'Open to Work' : 'Sẵn sàng nhận dự án'}
                  </span>
                </div>
              </div>
            </div>

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
              <div key={goal.title} className="about-goal-item flex gap-4">
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

        {/* SQL Interactive Demo Section */}
        <div className="about-sql-demo">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-heading font-semibold uppercase tracking-[0.15em] text-ink-muted mb-1">
                {isEn ? 'Interactive In-Browser SQL Engine' : 'Trình Thực Thi SQL Tương Tác Trực Tiếp'}
              </p>
              <h3 className="text-2xl font-heading font-bold text-ink dark:text-white">
                {isEn ? 'Query Data in Real-Time' : 'Truy vấn & Trực quan hóa dữ liệu tức thì'}
              </h3>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-surface/50 dark:bg-slate-800 rounded-xl border border-border-subtle dark:border-slate-700">
              <button
                onClick={() => setSandboxMode('presets')}
                className={`px-3.5 py-1.5 text-xs font-heading font-medium rounded-lg transition-all cursor-pointer ${
                  sandboxMode === 'presets'
                    ? 'bg-ink text-ground dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs font-bold'
                    : 'text-ink-secondary dark:text-slate-300 hover:text-ink'
                }`}
              >
                {isEn ? 'Case Study Presets' : 'Kịch bản mẫu'}
              </button>
              <button
                onClick={() => setSandboxMode('custom')}
                className={`px-3.5 py-1.5 text-xs font-heading font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  sandboxMode === 'custom'
                    ? 'bg-ink text-ground dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs font-bold'
                    : 'text-ink-secondary dark:text-slate-300 hover:text-ink'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isEn ? 'Custom SQL & CSV' : 'Tự do gõ SQL & Tải CSV'}
              </button>
            </div>
          </div>

          {sandboxMode === 'presets' ? (
            /* PRESETS MODE */
            <div>
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
                    <span className="text-[11px] font-heading font-medium text-ink-muted">SQL Query (PostgreSQL / ANSI)</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyPreset}
                        className="p-1.5 text-ink-muted hover:text-ink dark:hover:text-white rounded transition-colors cursor-pointer"
                        aria-label="Copy SQL"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={handleRunPreset}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-accent-deep dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 text-xs font-heading font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3 h-3" />
                        {isRunning ? (isEn ? 'Running...' : 'Đang chạy...') : 'Run'}
                      </button>
                    </div>
                  </div>
                  <pre className="px-4 py-4 text-[13px] leading-relaxed overflow-x-auto whitespace-pre text-slate-800 dark:text-slate-200">
                    <code>
                      {typedQuery}
                      {typedQuery.length < scenario.query.length && (
                        <span className="inline-block w-2 h-4 bg-emerald-500 dark:bg-[#9BE7FA] ml-0.5 animate-pulse align-middle" />
                      )}
                    </code>
                  </pre>
                </div>

                {/* Results panel */}
                <div id="about-sql-chart-container" className="bg-ground border border-border-subtle rounded-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle dark:border-slate-800 dark:bg-slate-950">
                    <span className="text-[11px] font-heading font-medium text-ink-muted">
                      {isEn ? 'Result' : 'Kết quả'}
                      {showResult && (
                        <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                          {scenario.data.length} {isEn ? 'rows' : 'dòng'}, {scenario.executionTime}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-3">
                      {showResult && (
                        <button
                          onClick={handleExportChart}
                          className="flex items-center gap-1 text-[11px] font-heading font-medium text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
                          title="Tải ảnh PNG"
                        >
                          <Download className="w-3 h-3" />
                          <span>PNG</span>
                        </button>
                      )}
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
                  </div>

                  {showResult ? (
                    <div className="px-4 py-4 space-y-4">
                      {renderPresetChart()}
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
          ) : (
            /* CUSTOM SQL & CSV UPLOAD MODE */
            <div className="space-y-5">
              {/* CSV Upload banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-ground border border-dashed border-[#9BE7FA] dark:bg-slate-900/80 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface/50 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA]">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-ink dark:text-white">
                      {uploadedFileName ? `Tệp đang nạp: ${uploadedFileName}` : (isEn ? 'Upload your own CSV dataset to query' : 'Tải lên tệp CSV bất kỳ từ máy tính để phân tích')}
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-slate-400">
                      {isEn ? 'Data is processed 100% in-browser on client memory' : 'Dữ liệu được xử lý 100% trong bộ nhớ trình duyệt, an toàn bảo mật'}
                    </p>
                  </div>
                </div>

                <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface/60 hover:bg-surface border border-border-subtle dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold rounded-lg text-ink dark:text-white cursor-pointer transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Upload CSV' : 'Chọn tệp CSV'}</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Custom Query Editor */}
                <div className="sql-block overflow-hidden dark:bg-slate-900 dark:border-slate-800 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-ground dark:bg-slate-950 dark:border-slate-800">
                    <span className="text-[11px] font-heading font-medium text-ink-muted">Custom Query Editor</span>
                    <button
                      onClick={handleRunCustomSql}
                      disabled={isRunning}
                      className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-accent-deep dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 text-xs font-heading font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" />
                      {isRunning ? (isEn ? 'Running...' : 'Đang chạy...') : 'Run SQL'}
                    </button>
                  </div>
                  <textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    rows={7}
                    className="w-full p-4 bg-transparent text-[13px] font-mono leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-hidden resize-none"
                    placeholder="SELECT * FROM table..."
                  />
                  <div className="px-4 py-2 bg-ground/50 dark:bg-slate-950/50 border-t border-border-subtle dark:border-slate-800/80 text-[11px] text-ink-muted">
                    Hỗ trợ: <code>SELECT</code>, <code>WHERE</code>, <code>GROUP BY</code>, <code>ORDER BY</code>, <code>LIMIT</code>, <code>SUM()</code>, <code>AVG()</code>, <code>COUNT()</code>
                  </div>
                </div>

                {/* Custom SQL Result Table */}
                <div className="bg-ground border border-border-subtle rounded-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle dark:border-slate-800 dark:bg-slate-950">
                    <span className="text-[11px] font-heading font-medium text-ink-muted">
                      {customResult ? `Bảng kết quả (${customResult.rowCount} dòng, ${customResult.executionTimeMs}ms)` : 'Kết quả truy vấn'}
                    </span>
                  </div>

                  <div className="flex-1 max-h-64 overflow-auto p-2">
                    {customResult?.error ? (
                      <div className="p-4 text-xs text-rose-500 font-mono">{customResult.error}</div>
                    ) : customResult && customResult.rows.length > 0 ? (
                      <table className="w-full text-left text-xs border-collapse font-heading">
                        <thead>
                          <tr className="border-b border-border-subtle dark:border-slate-800 text-ink-muted dark:text-slate-400">
                            {customResult.columns.map((col) => (
                              <th key={col} className="p-2 font-semibold">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle/50 dark:divide-slate-800/50">
                          {customResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-surface/20 dark:hover:bg-slate-800/40">
                              {customResult.columns.map((col) => (
                                <td key={col} className="p-2 tabular-data text-ink dark:text-slate-200">
                                  {String(row[col] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-ink-muted">
                        <Database className="w-6 h-6 mb-2 opacity-40" />
                        <p className="text-xs font-heading">
                          {isEn ? 'Click "Run SQL" to execute your query.' : 'Nhấn "Run SQL" để thực thi câu lệnh trên tập dữ liệu.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
