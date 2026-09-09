'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useToast } from '../../ui/Toast';
import { exportChartWithToast } from '../../../lib/chartExport';

import ScienceHeroSection from './ScienceHeroSection';
import ScienceEdaSection from './ScienceEdaSection';
import ScienceHypothesisSection from './ScienceHypothesisSection';
import ScienceCorrelationSection from './ScienceCorrelationSection';
import ScienceTimeSeriesSection from './ScienceTimeSeriesSection';
import ScienceOptimizerSection from './ScienceOptimizerSection';
import ScienceNotebookModal from './ScienceNotebookModal';

interface KamiElyScienceCaseStudyProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function KamiElyScienceCaseStudy({ onBack: _onBack, isEmbedded: _isEmbedded }: KamiElyScienceCaseStudyProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { showToast } = useToast();

  // Python Notebook Modal state
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Chart toggles & interactive states
  const [polyView, setPolyView] = useState<'fitted' | 'marginal'>('fitted');
  const [tsPanelFocus, setTsPanelFocus] = useState<'all' | 'trend' | 'seasonal' | 'residual'>('all');
  const [liveHoursReduction, setLiveHoursReduction] = useState<number>(50); // % cut
  const [videoCoverage, setVideoCoverage] = useState<number>(859); // from 551 to 859 videos

  const handleExport = (elementId: string, chartName: string) => {
    exportChartWithToast(elementId, chartName, showToast, isEn);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(isEn ? 'Code copied to clipboard!' : 'Đã sao chép mã nguồn!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Interactive Reallocation Simulator Math
  const simulatorMetrics = useMemo(() => {
    const liveCostSaved = (liveHoursReduction / 100) * 48.5; // ~48.5M op cost
    const incrementalVideos = Math.max(0, videoCoverage - 551);
    const videoGmvAdded = (incrementalVideos * 1.85); // 1.85M GMV/video expectation
    const netBenefit = liveCostSaved + (videoGmvAdded * 0.18); // 18% gross margin contribution

    return {
      operationalCostSavedMillion: liveCostSaved.toFixed(1),
      additionalVideoGmvMillion: videoGmvAdded.toFixed(1),
      incrementalVideos,
      netBenefitMillion: netBenefit.toFixed(1),
    };
  }, [liveHoursReduction, videoCoverage]);

  return (
    <div className="w-full space-y-16 pb-20 text-slate-900 dark:text-slate-100">
      <ScienceHeroSection 
        isEn={isEn} 
        onOpenNotebook={() => setIsNotebookModalOpen(true)} 
      />

      <ScienceEdaSection 
        isEn={isEn} 
        handleExport={handleExport} 
      />

      <ScienceHypothesisSection 
        isEn={isEn} 
        handleExport={handleExport} 
      />

      <ScienceCorrelationSection 
        isEn={isEn} 
        polyView={polyView} 
        setPolyView={setPolyView} 
        handleExport={handleExport} 
      />

      <ScienceTimeSeriesSection 
        isEn={isEn} 
        tsPanelFocus={tsPanelFocus} 
        setTsPanelFocus={setTsPanelFocus} 
        handleExport={handleExport} 
      />

      <ScienceOptimizerSection 
        isEn={isEn} 
        liveHoursReduction={liveHoursReduction} 
        setLiveHoursReduction={setLiveHoursReduction} 
        videoCoverage={videoCoverage} 
        setVideoCoverage={setVideoCoverage} 
        simulatorMetrics={simulatorMetrics} 
      />

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
