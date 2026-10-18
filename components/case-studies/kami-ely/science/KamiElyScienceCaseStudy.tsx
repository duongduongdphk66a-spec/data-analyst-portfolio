'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { exportChartWithToast } from '@/app/lib/uiHelpers';
import { MINTO_NARRATIVE } from '@/app/data/kami-ely/mintoNarrative';
import { BarChart3, Binary, Sparkles, Lightbulb } from 'lucide-react';

import ScienceEdaSection from './ScienceEdaSection';
import ScienceHypothesisSection from './ScienceHypothesisSection';
import ScienceCorrelationSection from './ScienceCorrelationSection';
import ScienceTimeSeriesSection from './ScienceTimeSeriesSection';
import ScienceOptimizerSection from './ScienceOptimizerSection';
import ScienceNotebookModal from './ScienceNotebookModal';

export interface KamiElyScienceCaseStudyProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  onOpenNotebook?: () => void;
}

export default function KamiElyScienceCaseStudy({
  onBack: _onBack,
  isEmbedded: _isEmbedded,
  onOpenNotebook
}: KamiElyScienceCaseStudyProps = {}) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const lang = isEn ? 'en' : 'vi';
  const { showToast } = useToast();
  const text = MINTO_NARRATIVE.tab2;

  // Python Notebook Modal state
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Chart toggles & interactive states
  const [polyView, setPolyView] = useState<'fitted' | 'marginal'>('fitted');
  const [tsPanelFocus, setTsPanelFocus] = useState<'all' | 'trend' | 'seasonal' | 'residual'>('all');
  const [liveHoursReduction, setLiveHoursReduction] = useState<number>(50);
  const [videoCoverage, setVideoCoverage] = useState<number>(859);
  const [liveData, setLiveData] = useState<{ timeSeries?: any[]; isLiveDb?: boolean } | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch('/api/case-studies/kami-ely')
      .then((r) => r.json())
      .then((res) => {
        if (active && res.success && res.data) {
          setLiveData({
            timeSeries: res.data.timeSeries,
            isLiveDb: res.source === 'mysql',
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleExport = (elementId: string, chartName: string) => {
    exportChartWithToast(elementId, chartName, showToast, isEn);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(isEn ? 'Code copied to clipboard!' : 'Đã sao chép mã nguồn!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenNotebookModal = () => {
    if (onOpenNotebook) {
      onOpenNotebook();
    } else {
      setIsNotebookModalOpen(true);
    }
  };

  // Interactive Reallocation Simulator Math
  const simulatorMetrics = useMemo(() => {
    const liveCostSaved = (liveHoursReduction / 100) * 48.5;
    const incrementalVideos = Math.max(0, videoCoverage - 551);
    const videoGmvAdded = (incrementalVideos * 1.85);
    const netBenefit = liveCostSaved + (videoGmvAdded * 0.18);

    return {
      operationalCostSavedMillion: liveCostSaved.toFixed(1),
      additionalVideoGmvMillion: videoGmvAdded.toFixed(1),
      incrementalVideos,
      netBenefitMillion: netBenefit.toFixed(1),
    };
  }, [liveHoursReduction, videoCoverage]);

  return (
    <div className="w-full space-y-16 pb-12 text-slate-900 dark:text-slate-100">
      {/* ==================================================================== */}
      {/* MỤC 2.1: PHÂN TÍCH KHÁM PHÁ (EDA) & TƯƠNG QUAN ĐA BIẾN (#13, #14)   */}
      {/* ==================================================================== */}
      <section id="sec-2-1-eda" className="space-y-6 scroll-mt-28">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec2_1.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec2_1.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec2_1.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #13: Histogram + Boxplot */}
        <ScienceEdaSection
          isEn={isEn}
          handleExport={handleExport}
        />

        {/* Biểu đồ #14: Correlation Heatmap */}
        <ScienceCorrelationSection
          isEn={isEn}
          polyView={polyView}
          setPolyView={setPolyView}
          handleExport={handleExport}
        />
      </section>

      {/* ==================================================================== */}
      {/* MỤC 2.2: KIỂM ĐỊNH GIẢ THUYẾT & CHUỖI THỜI GIAN (#15, #16)          */}
      {/* ==================================================================== */}
      <section id="sec-2-2-hypothesis" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec2_2.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Binary className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec2_2.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec2_2.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #15: Hypothesis Testing */}
        <ScienceHypothesisSection
          isEn={isEn}
          handleExport={handleExport}
        />

        {/* Biểu đồ #16: Time-Series Decomposition */}
        <ScienceTimeSeriesSection
          isEn={isEn}
          tsPanelFocus={tsPanelFocus}
          setTsPanelFocus={setTsPanelFocus}
          handleExport={handleExport}
          timeSeriesData={liveData?.timeSeries}
          isLiveDb={liveData?.isLiveDb}
        />
      </section>

      {/* ==================================================================== */}
      {/* MỤC 2.3: MA TRẬN PHÂN NHÓM SKU & MÔ PHỎNG TỐI ƯU (#17, #18)        */}
      {/* ==================================================================== */}
      <section id="sec-2-3-optimizer" className="space-y-6 scroll-mt-28 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="p-5 sm:p-6 rounded-3xl border border-[#9BE7FA]/60 bg-gradient-to-br from-white via-slate-50/50 to-[#C8EEF7]/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#9BE7FA]/30 border border-[#9BE7FA]/70 text-[#074553] dark:text-[#9BE7FA] text-xs font-mono font-black uppercase">
              {text.sec2_3.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {text.sec2_3.title[lang]}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#FFD14C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#FFE485]">
                {isEn ? 'Key Analytical Insight' : 'Nhận định phân tích'}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {text.sec2_3.insight[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Biểu đồ #17 (SKU Quadrant Matrix) & #18 (What-If Optimization Simulation) */}
        <ScienceOptimizerSection
          isEn={isEn}
          liveHoursReduction={liveHoursReduction}
          setLiveHoursReduction={setLiveHoursReduction}
          videoCoverage={videoCoverage}
          setVideoCoverage={setVideoCoverage}
          simulatorMetrics={simulatorMetrics}
          onOpenNotebook={handleOpenNotebookModal}
        />
      </section>

      {/* Python Notebook Modal */}
      <ScienceNotebookModal
        isOpen={isNotebookModalOpen}
        onClose={() => setIsNotebookModalOpen(false)}
        isEn={isEn}
        selectedSnippetIdx={selectedSnippetIdx}
        setSelectedSnippetIdx={setSelectedSnippetIdx}
        copiedCode={copiedCode}
        handleCopyCode={handleCopyCode}
      />
    </div>
  );
}
