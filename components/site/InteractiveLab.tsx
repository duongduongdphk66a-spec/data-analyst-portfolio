'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { 
  Play, Copy, Check, ArrowRight, Upload, Download, 
  Sparkles, Database, FileSpreadsheet, Terminal
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { SQL_SCENARIOS } from '@/app/data/aboutSqlData';
import { executeClientSql, SqlQueryResult } from '@/app/lib/sqlEngine';
import { exportChartAsPng } from '@/app/lib/chartExport';
import { useToast } from '@/components/ui/Toast';
import { validateUploadedFile } from '@/app/lib/security';

const AboutSqlChart = dynamic(() => import('@/components/case-studies/charts/AboutSqlChart'), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full flex items-center justify-center text-xs text-slate-400 animate-pulse font-heading">
      Đang tải trực quan hóa...
    </div>
  ),
});

const emptySubscribe = () => () => {};

interface InteractiveLabProps {
  onSelectProject?: (_projId: string) => void;
}

export default function InteractiveLab({ onSelectProject }: InteractiveLabProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { showToast } = useToast();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';

  const [sandboxMode, setSandboxMode] = useState<'presets' | 'custom'>('presets');
  const [activeScenario, setActiveScenario] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [copied, setCopied] = useState(false);
  const [typedQuery, setTypedQuery] = useState(SQL_SCENARIOS[0].query);
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

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

  useEffect(() => {
    if (sandboxMode !== 'presets') return;
    const fullQuery = scenario.query;
    let i = 0;
    const timer = setInterval(() => {
      i += 4;
      if (i >= fullQuery.length) {
        setTypedQuery(fullQuery);
        clearInterval(timer);
      } else {
        setTypedQuery(fullQuery.slice(0, i));
      }
    }, 12);

    return () => clearInterval(timer);
  }, [scenario.query, sandboxMode]);

  const handleRunPreset = () => {
    setShowResult(false);
    setIsRunning(true);
    trackVisitorAction(`SQL Lab Demo: ${scenario.id}`, scenario.id, 'sandbox');
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
      showToast(isEn ? 'Query executed successfully!' : 'Đã thực thi câu lệnh SQL thành công!', 'success');
    }, 450);
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
    }, 200);
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
    const success = await exportChartAsPng('lab-sql-chart-container', 'sql-query-chart.png');
    if (success) {
      showToast(isEn ? 'Chart image downloaded!' : 'Đã tải ảnh biểu đồ thành công!', 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-5 sm:px-8 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA]" />
          <span className="editorial-kicker">
            {isEn ? 'IN-BROWSER SQL STUDIO' : 'PHÒNG THÍ NGHIỆM DỮ LIỆU SQL TRỰC TIẾP'}
          </span>
        </div>
        <h1 className="editorial-section-title text-3xl sm:text-4xl lg:text-5xl">
          {isEn ? 'Interactive Analytics Lab' : 'Truy Vấn & Trực Quan Hóa Tức Thì'}
        </h1>
        <p className="editorial-lead max-w-2xl">
          {isEn
            ? 'Execute real SQL queries against actual telemetry datasets from featured case studies or upload your own CSV file for in-memory analysis.'
            : 'Thực thi câu lệnh SQL trực tiếp trên các tập dữ liệu thực tế từ case study hoặc tự do tải lên tệp CSV cá nhân để phân tích trong bộ nhớ trình duyệt.'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSandboxMode('presets')}
            className={`px-4 py-2 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
              sandboxMode === 'presets'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Case Study Datasets' : 'Dữ Liệu Case Study'}
          </button>
          <button
            onClick={() => setSandboxMode('custom')}
            className={`px-4 py-2 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              sandboxMode === 'custom'
                ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {isEn ? 'Custom SQL & CSV Upload' : 'Tự Do Viết SQL & Tải CSV'}
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Engine: SQLite/PostgreSQL In-Memory Client Worker
        </span>
      </div>

      {sandboxMode === 'presets' ? (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {SQL_SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(i)}
                className={`px-4 py-2 text-xs font-heading font-semibold rounded-xl transition-colors duration-150 cursor-pointer ${
                  activeScenario === i
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-950 border border-slate-200/80 hover:border-[#9BE7FA]/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span className="font-mono text-[11px] opacity-70 mr-1.5">{s.tag}</span>
                {s.title}
              </button>
            ))}
          </div>

          {/* Editor + Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Query Panel (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-[#0A1120] border border-slate-800 shadow-md flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#060B13]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD14C]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono font-bold text-[#9BE7FA] ml-1">query.sql</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPreset}
                    className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    aria-label="Copy SQL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleRunPreset}
                    disabled={isRunning}
                    className="btn-primary text-xs px-3.5 py-1.5"
                  >
                    <Play className="w-3 h-3 fill-current text-slate-950" />
                    <span>{isRunning ? (isEn ? 'Running...' : 'Đang chạy...') : 'Run'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto whitespace-pre text-slate-100 font-mono flex-1">
                <code>
                  {typedQuery}
                  {typedQuery.length < scenario.query.length && (
                    <span className="inline-block w-2 h-4 bg-[#9BE7FA] ml-0.5 animate-pulse align-middle" />
                  )}
                </code>
              </pre>
            </div>

            {/* Results Panel (7 cols) */}
            <div id="lab-sql-chart-container" className="lg:col-span-7 card-minimal overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-xs font-heading font-semibold text-slate-600 dark:text-slate-400">
                  {isEn ? 'Execution Result' : 'Kết Quả Truy Vấn'}
                  {showResult && (
                    <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400">
                      • {scenario.data.length} {isEn ? 'rows' : 'dòng'} ({scenario.executionTime})
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  {showResult && (
                    <button
                      onClick={handleExportChart}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                      title="Xuất ảnh PNG"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PNG</span>
                    </button>
                  )}
                  {showResult && (
                    <button
                      onClick={() => onSelectProject ? onSelectProject(scenario.projectId) : router.push(`/projects/${scenario.projectId}`)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#074553] dark:text-[#9BE7FA] hover:underline transition-colors cursor-pointer"
                    >
                      <span>{isEn ? 'Case Study' : 'Xem Đầy Đủ'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {showResult ? (
                <div className="p-5 space-y-4 flex-1">
                  {isMounted && <AboutSqlChart scenario={scenario} isDark={isDark} isEn={isEn} />}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white mr-1.5">Business Insight:</span>
                    {isEn ? scenario.insightEn : scenario.insight}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-sm text-slate-400 font-heading flex-1 flex items-center justify-center">
                  {isRunning ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#9BE7FA] border-t-transparent rounded-full animate-spin" />
                      {isEn ? 'Executing SQL...' : 'Đang xử lý truy vấn...'}
                    </span>
                  ) : (
                    isEn ? 'Click "Run" to execute the query.' : 'Nhấn "Run" để chạy câu lệnh.'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CUSTOM SQL & CSV UPLOAD */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 card-minimal">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                  {uploadedFileName ? `Tệp đang nạp: ${uploadedFileName}` : (isEn ? 'Upload custom CSV dataset' : 'Tải lên tệp CSV bất kỳ')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn ? 'Processed 100% in-browser in client memory for privacy' : 'Dữ liệu được xử lý 100% trong bộ nhớ trình duyệt, an toàn bảo mật'}
                </p>
              </div>
            </div>

            <label className="btn-secondary-editorial text-xs cursor-pointer shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{isEn ? 'Choose CSV File' : 'Chọn tệp CSV'}</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-[#0A1120] border border-slate-800 shadow-md flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#060B13]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD14C]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono font-bold text-[#9BE7FA] ml-1">Custom SQL Editor</span>
                </div>
                <button
                  onClick={handleRunCustomSql}
                  disabled={isRunning}
                  className="btn-primary text-xs px-3.5 py-1.5"
                >
                  <Play className="w-3 h-3 fill-current text-slate-950" />
                  <span>{isRunning ? '...' : 'Run SQL'}</span>
                </button>
              </div>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                rows={8}
                className="w-full p-4 bg-transparent text-[13px] font-mono leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-hidden resize-none"
                placeholder="SELECT * FROM table..."
              />
              <div className="px-4 py-2 bg-[#060B13] border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Syntax: <code className="text-[#9BE7FA]">SELECT</code>, <code className="text-[#9BE7FA]">WHERE</code>, <code className="text-[#9BE7FA]">GROUP BY</code>, <code className="text-[#9BE7FA]">ORDER BY</code>, <code className="text-[#9BE7FA]">LIMIT</code>, <code className="text-[#FFD14C]">SUM()</code>, <code className="text-[#FFD14C]">COUNT()</code>
              </div>
            </div>

            <div className="lg:col-span-6 card-minimal overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-heading font-semibold text-slate-600 dark:text-slate-400">
                {customResult ? `Output Table (${customResult.rowCount} rows, ${customResult.executionTimeMs}ms)` : 'Query Output'}
              </div>
              <div className="flex-1 max-h-80 overflow-auto p-2">
                {customResult?.error ? (
                  <div className="p-4 text-xs text-rose-500 font-mono">{customResult.error}</div>
                ) : customResult && customResult.rows.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        {customResult.columns.map((col) => (
                          <th key={col} className="p-2 font-semibold font-mono">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {customResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          {customResult.columns.map((col) => (
                            <td key={col} className="p-2 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                              {String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <Database className="w-6 h-6 mb-2 opacity-40" />
                    <p className="text-xs font-heading">
                      {isEn ? 'Click "Run SQL" to execute query.' : 'Nhấn "Run SQL" để thực thi.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
