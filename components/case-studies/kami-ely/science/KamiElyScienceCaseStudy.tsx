'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { exportChartWithToast } from '@/app/lib/chartExport';
import ExecutiveSummary from '../../ExecutiveSummary';

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

      {/* Executive Summary — 60-second overview */}
      <div className="max-w-5xl">
        <ExecutiveSummary
          isEn={isEn}
          readingTime={isEn ? '~3 min deep dive' : '~3 phút đọc chi tiết'}
          problem={isEn
            ? 'Live channel consumes most hours but yields low GPM compared to Short-video. Need to analyze Aug-Sep revenue dip.'
            : 'Kênh Live chiếm nhiều thời lượng nhưng GPM thấp hơn Short-video. Cần phân tích sụt giảm doanh số tháng 8-9.'}
          method={isEn
            ? 'Compare video vs live sessions, model saturation curves, and decompose 180-day time series into Trend, Seasonality, and Residual components.'
            : 'So sánh mẫu video và live, mô hình hóa điểm bão hòa và phân rã chuỗi thời gian 180 ngày.'}
          insight={isEn
            ? 'Video GPM outperforms Live by 4.48x. Seasonality explains 85% of the drop. Cutting excess live hours optimizes cash flow.'
            : 'Video sinh lời vượt trội 4.48 lần. Mùa vụ lý giải 85% sụt giảm. Cắt giảm giờ live tối ưu dòng tiền.'}
          metrics={[
            { label: isEn ? 'Total Ecosystem GMV' : 'Tổng GMV Hệ Sinh Thái', value: isEn ? '31.6B' : '31.6 Tỷ', change: isEn ? '238.4k items' : '238.4k sản phẩm', isPositive: true },
            { label: isEn ? 'Self-Operated GMV' : 'Kênh Tự Vận Hành', value: isEn ? '9.2B' : '9.2 Tỷ', change: isEn ? '49.3% Shop GMV' : '49.3% GMV shop', isPositive: true },
            { label: isEn ? 'Video vs Live GPM' : 'Chênh Lệch GPM', value: '4.5x', change: isEn ? '135k vs 30k VND' : '135k vs 30k VNĐ', isPositive: true },
            { label: isEn ? 'Affiliate Leverage' : 'Mạng Lưới Affiliate', value: '5.7k', change: isEn ? '>95% Nano/Micro KOC' : '>95% DS từ Nano/Micro', isPositive: true },
          ]}
          tools={['Python (scipy.stats & statsmodels)', 'Statistical Analysis', 'Time-Series Modeling', 'Recharts']}
        />
      </div>

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
