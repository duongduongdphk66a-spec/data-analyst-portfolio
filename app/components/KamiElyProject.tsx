'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Download, ExternalLink, Radio, Link as LinkIcon, 
  Flame, ShoppingBag, Video, Award, TrendingUp, Clock,
  Bookmark, ShieldCheck, Sparkles, Store, UserCheck,
  Image as ImageIcon, X, Eye, CheckCircle2, ChevronRight,
  ChevronDown, Users, Lightbulb, ArrowRight
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';
import { FastMossTelemetryCard, FastMossTelemetryModal } from './ui/FastMossTelemetryCard';

import {
  PALETTE,
  shopOverviewKPIs,
  shopWeeklyTrendData,
  getShopChannelData,
  getShopContentData,
  getShopCategoryData,
  shopPriceTierData,
  shopTopSKUs,
  affiliateFollowerTiers,
  shopAffiliateCategoryDistribution,
  topAffiliatesList,
  shopLiveKPIs,
  topShopLiveSessions,
  shopVideoKPIs,
  topShoppableVideos,
  shopSelfOperatedAccount,
  creatorProfile,
  creatorHourlyActivity,
  creatorActivityHighlights,
  creatorDemographics,
  creatorVideoStats,
  creatorTopVideos,
  creatorLiveKPIs,
  creatorTopLiveStreams,
  creatorCollaborativeStores,
  creatorSalesCapacity,
  creator180dTelemetry,
  fastmossScreenshotsManifest,
  type FastMossScreenshotItem,
  KAMI_DATA_SCOPES,
} from '../data/kamiElyData';

import { scrollToSection, centerTabInContainer, useCaseStudyActions } from '../lib/uiHelpers';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import SectionHeader from './ui/SectionHeader';
import KamiElyScienceCaseStudy from './KamiElyScienceCaseStudy';

export default function KamiElyProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';
  const { copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);

  // Major Tab: 'science' (Khoa học dữ liệu & Thống kê 6 phần) | 'shop' (Phần 1: Toàn shop BI) | 'creator' (Phần 2: Creator Kamielyn)
  const [activeTab, setActiveTab] = useState<'science' | 'shop' | 'creator'>('science');
  const subnavContainerRef = useRef<HTMLDivElement>(null);

  // Sub-metrics toggles
  const [channelMetric, setChannelMetric] = useState<'units' | 'gmv'>('units');
  const [contentMetric, setContentMetric] = useState<'units' | 'gmv'>('units');
  const [categoryMetric, setCategoryMetric] = useState<'units' | 'gmv' | 'byCount'>('units');
  const [priceMetric, setPriceMetric] = useState<'units' | 'gmv' | 'byCount'>('units');
  const [affMetric, setAffMetric] = useState<'units' | 'gmv' | 'count'>('units');
  const [affCatMetric, setAffCatMetric] = useState<'units' | 'gmv' | 'count'>('units');
  const [crVideoCatMetric, setCrVideoCatMetric] = useState<'units' | 'gmv'>('units');
  const [crSalesMetric, setCrSalesMetric] = useState<'gmv' | 'units'>('gmv');

  // FastMoss Proof Gallery Modal state
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [selectedProofGroup, setSelectedProofGroup] = useState<'all' | 'shop' | 'creator'>('all');
  const [activeScreenshot, setActiveScreenshot] = useState<FastMossScreenshotItem | null>(null);
  const [isDataScopeExpanded, setIsDataScopeExpanded] = useState(false);

  const openProofScreenshot = (scId: string) => {
    const found = fastmossScreenshotsManifest.find((s) => s.id === scId);
    if (found) {
      setActiveScreenshot(found);
      setSelectedProofGroup(found.group);
    }
    setIsProofModalOpen(true);
  };

  // Keyboard navigation for FastMoss proof gallery lightbox
  useEffect(() => {
    if (!isProofModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeScreenshot) {
          setActiveScreenshot(null);
        } else {
          setIsProofModalOpen(false);
        }
      } else if (e.key === 'ArrowLeft' && activeScreenshot) {
        const currentIdx = fastmossScreenshotsManifest.findIndex((s) => s.id === activeScreenshot.id);
        if (currentIdx > 0) {
          setActiveScreenshot(fastmossScreenshotsManifest[currentIdx - 1]);
        }
      } else if (e.key === 'ArrowRight' && activeScreenshot) {
        const currentIdx = fastmossScreenshotsManifest.findIndex((s) => s.id === activeScreenshot.id);
        if (currentIdx < fastmossScreenshotsManifest.length - 1) {
          setActiveScreenshot(fastmossScreenshotsManifest[currentIdx + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProofModalOpen, activeScreenshot]);

  const channelData = getShopChannelData(isEn);
  const contentData = getShopContentData(isEn);
  const shopCategoryData = getShopCategoryData(isEn);

  const scienceNavItems = useMemo(() => [
    { id: 'sec-hero', label: isEn ? '1. Executive Overview' : '1. Tổng quan phân tích' },
    { id: 'sec-eda', label: isEn ? '2. Outlier Detection' : '2. Lọc điểm dị biệt' },
    { id: 'sec-hypothesis', label: isEn ? '3. Video vs Live GPM' : '3. Hiệu suất Video vs Live' },
    { id: 'sec-correlation', label: isEn ? '4. Live Duration Limit' : '4. Giới hạn giờ Live' },
    { id: 'sec-timeseries', label: isEn ? '5. Seasonality Analysis' : '5. Chu kỳ mùa vụ 180N' },
    { id: 'sec-optimization', label: isEn ? '6. Resource Optimization' : '6. Chiến lược tối ưu' },
  ], [isEn]);

  const shopNavItems = useMemo(() => [
    { id: 'shop-overview', label: isEn ? '1.1 Overview' : '1.1 Tổng quan' },
    { id: 'shop-sales', label: isEn ? '1.2 Sales' : '1.2 Bán hàng', dividerBefore: true },
    { id: 'shop-products', label: isEn ? '1.3 Products' : '1.3 Sản phẩm' },
    { id: 'shop-affiliates', label: isEn ? '1.4 Affiliates' : '1.4 Affiliates', dividerBefore: true },
    { id: 'shop-live', label: isEn ? '1.5 Livestream' : '1.5 Livestream' },
    { id: 'shop-video', label: isEn ? '1.6 Video' : '1.6 Video' },
    { id: 'shop-self-operated', label: isEn ? '1.7 Self-Operated' : '1.7 Tự vận hành', dividerBefore: true },
  ], [isEn]);

  const creatorNavItems = useMemo(() => [
    { id: 'creator-overview', label: isEn ? '2.1 Overview' : '2.1 Tổng quan' },
    { id: 'creator-activity', label: isEn ? '2.2 Activity' : '2.2 Hoạt động' },
    { id: 'creator-followers', label: isEn ? '2.3 Followers' : '2.3 Người theo dõi' },
    { id: 'creator-video', label: isEn ? '2.4 Video' : '2.4 Video', dividerBefore: true },
    { id: 'creator-live', label: isEn ? '2.5 Livestream' : '2.5 Livestream' },
    { id: 'creator-sales', label: isEn ? '2.6 Sales & 180d' : '2.6 Bán hàng & 180N', dividerBefore: true },
    { id: 'creator-collaborative', label: isEn ? '2.7 Top Stores' : '2.7 Cửa hàng hợp tác' },
  ], [isEn]);

  const currentNavItems = useMemo(() => {
    if (activeTab === 'science') return scienceNavItems;
    if (activeTab === 'shop') return shopNavItems;
    return creatorNavItems;
  }, [activeTab, scienceNavItems, shopNavItems, creatorNavItems]);

  const currentSectionIds = useMemo(() => currentNavItems.map(item => item.id), [currentNavItems]);
  const { activeSection, scrollProgress, setActiveSection } = useScrollSpy(currentSectionIds, 130);

  const handleTabChange = (tab: 'science' | 'shop' | 'creator') => {
    setActiveTab(tab);
    if (tab === 'science') {
      setActiveSection('sec-hero');
    } else if (tab === 'shop') {
      setActiveSection('shop-overview');
    } else {
      setActiveSection('creator-overview');
    }
  };

  // Auto-scroll ONLY the horizontal taskbar to keep active tab centered (without touching vertical window scroll)
  useEffect(() => {
    if (activeSection) {
      centerTabInContainer(subnavContainerRef.current, `nav-tab-${activeSection}`);
    }
  }, [activeSection]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSection(id);
    scrollToSection(id, 16);
  };

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Kami Ely TikTok Shop & Creator Analytics', 'proj-kami-ely', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  const renderDataScopeMatrix = (scopeType: 'shop' | 'creator') => {
    const scopes = KAMI_DATA_SCOPES.filter((s) => s.scope === scopeType);
    const isShop = scopeType === 'shop';

    return (
      <div className="rounded-3xl bg-gradient-to-br from-white via-[#F0FBFE]/50 to-white border-2 border-[#9BE7FA]/80 shadow-md dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 dark:border-slate-800 overflow-hidden">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsDataScopeExpanded(!isDataScopeExpanded)}
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-[#F0FBFE]/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8EEF7] text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] text-xs font-black uppercase tracking-wider shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? 'METHODOLOGY' : 'PHƯƠNG PHÁP'}</span>
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
              {isEn 
                ? (isShop ? 'Store data horizons: Lifetime · 180d · 90d · 28d' : 'Creator data horizons: Lifetime · 180d · 90d · 28d')
                : (isShop ? 'Chu kỳ dữ liệu: Tích lũy · 180 ngày · 90 ngày · 28 ngày' : 'Chu kỳ dữ liệu Creator: Tích lũy · 180 ngày · 90 ngày · 28 ngày')}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProofGroup(scopeType);
                setIsProofModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#0D7287] dark:border-[#9BE7FA] text-[#0D7287] dark:text-[#9BE7FA] hover:bg-[#0D7287] hover:text-white dark:hover:bg-[#9BE7FA] dark:hover:text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isEn ? `Proofs (${fastmossScreenshotsManifest.filter(s => s.group === scopeType).length})` : `Bằng chứng (${fastmossScreenshotsManifest.filter(s => s.group === scopeType).length})`}</span>
            </button>
            <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isDataScopeExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Collapsible Content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isDataScopeExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 sm:p-8 pt-0 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8EEF7] text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] text-xs font-black uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? 'DATA COLLECTION HORIZONS & SCOPE SPECIFICATION' : 'MA TRẬN PHÂN ĐỊNH PHẠM VI & CHU KỲ DỮ LIỆU'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? (isShop ? 'Store-Wide Telemetry Horizon Breakdown' : 'Creator @kamielyhn Horizon Breakdown')
                : (isShop ? 'Phân Định 3 Chu Kỳ Thu Thập Dữ Liệu Của Toàn Shop' : 'Phân Định 3 Chu Kỳ Thu Thập Dữ Liệu Kênh Chính Chủ @kamielyhn')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn 
                ? 'Methodological clarification: Explicitly separating Lifetime Inception Data from rolling observation windows (180 days, 90 days, 28 days) based on authentic FastMoss audit captures (dated 2026-09-05).'
                : 'Quy chuẩn phương pháp luận: Tách bạch tuyệt đối giữa Dữ liệu Tích Lũy Toàn Thời Gian (từ khi thành lập) và các chu kỳ quan sát viễn trắc (180 ngày, 90 ngày, 28 ngày) theo bộ ảnh kiểm toán độc lập FastMoss ngày 05/09/2026.'}
            </p>
          </div>
        </div>

        {/* 3 Scope Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {scopes.map((scopeItem) => {
            const isAllTime = scopeItem.isAllTime;
            return (
              <div 
                key={scopeItem.id}
                className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  isAllTime 
                    ? 'bg-gradient-to-b from-[#FFFDF5] to-white border-amber-400/90 shadow-md dark:from-amber-950/20 dark:to-slate-900 dark:border-amber-700/80' 
                    : 'bg-white border-[#9BE7FA]/70 shadow-sm dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  {/* Scope Badge & Period */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-wide uppercase ${
                        isAllTime 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700' 
                          : 'bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700'
                      }`}>
                        {scopeItem.timeframeBadge}
                      </span>
                      {isAllTime && (
                        <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300/60">
                          ⚠️ KHÔNG PHẢI 180N
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-slate-950 dark:text-white leading-snug">
                      {isEn ? scopeItem.timeframeEn : scopeItem.timeframeVi}
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>{isEn ? scopeItem.periodEn : scopeItem.periodVi}</span>
                    </div>
                  </div>

                  {/* Core Numeric Strip */}
                  <div className={`p-3.5 rounded-2xl border ${
                    isAllTime 
                      ? 'bg-amber-50/70 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/60' 
                      : 'bg-[#F0FBFE] border-[#9BE7FA]/60 dark:bg-slate-800/60 dark:border-slate-700/60'
                  } space-y-1.5`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {isEn ? 'Core Commercial Metric' : 'Chỉ Số Thương Mại Trọng Tâm'}
                    </div>
                    <div className="text-2xl font-black text-slate-950 dark:text-white">
                      {scopeItem.totalGmv}
                    </div>
                    <div className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                      {scopeItem.totalUnits}
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                    {(isEn ? scopeItem.keyHighlightsEn : scopeItem.keyHighlightsVi).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isAllTime ? 'text-amber-600 dark:text-amber-400' : 'text-[#0D7287] dark:text-[#9BE7FA]'}`} />
                        <span className="leading-tight">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proof Screenshot Anchors */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isEn ? 'Verified FastMoss Captures:' : 'Ảnh Bằng Chứng FastMoss Đối Soát:'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scopeItem.screenshotIds.slice(0, 4).map((scId) => {
                      const scItem = fastmossScreenshotsManifest.find((s) => s.id === scId);
                      if (!scItem) return null;
                      const shortCode = scItem.filename.replace('Screenshot 2026-09-05 ', '').replace('.png', '');
                      return (
                        <button
                          key={scId}
                          onClick={() => openProofScreenshot(scId)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            isAllTime
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 hover:bg-[#C8EEF7] text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                          }`}
                          title={isEn ? `View ${scItem.filename}` : `Xem ảnh ${scItem.filename}`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ảnh {shortCode}</span>
                        </button>
                      );
                    })}
                    {scopeItem.screenshotIds.length > 4 && (
                      <button
                        onClick={() => {
                          setSelectedProofGroup(scopeType);
                          setIsProofModalOpen(true);
                        }}
                        className="px-2 py-1 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        +{scopeItem.screenshotIds.length - 4} ảnh khác →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#FFE485]/60 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all dark:bg-slate-900/95 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-xs sm:text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
            <span className="hidden sm:inline">{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
            <span className="sm:hidden">{isEn ? 'Back' : 'Quay lại'}</span>
          </button>

          {/* Major Dual/Triple Tab Selector with Brand Colors */}
          <div className="flex bg-[#C8EEF7]/30 p-1 rounded-2xl border border-[#9BE7FA]/60 dark:bg-slate-800 dark:border-slate-700 shrink-0">
            <button
              onClick={() => handleTabChange('science')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'science'
                  ? 'bg-teal-500 text-slate-950 shadow-md border border-teal-400 font-black'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 dark:text-slate-900" />
              <span>{isEn ? 'Data Science' : 'Khoa Học Dữ Liệu'}</span>
            </button>
            <button
              onClick={() => handleTabChange('shop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-[#9BE7FA] text-slate-950 shadow-md border border-[#9BE7FA] dark:bg-[#0D7287] dark:text-white dark:border-[#0D7287]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{isEn ? 'Shop BI' : 'Toàn Shop'}</span>
            </button>
            <button
              onClick={() => handleTabChange('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'creator'
                  ? 'bg-[#FFD14C] text-slate-950 shadow-md border border-[#FFD14C] dark:bg-[#FFD14C] dark:text-slate-950 dark:border-[#FFD14C]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D7287] dark:text-slate-900" />
              <span>{isEn ? 'Creator' : 'Creator KOC'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Open FastMoss Proof Screenshots Modal */}
            <button
              onClick={() => {
                setActiveScreenshot(null);
                setSelectedProofGroup(activeTab === 'shop' ? 'shop' : 'creator');
                setIsProofModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#9BE7FA] hover:border-[#0D7287] text-slate-800 text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-[#9BE7FA]"
              title={isEn ? 'Inspect 36 authentic FastMoss source screenshots' : 'Xem 36 ảnh chụp màn hình gốc FastMoss'}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className="hidden sm:inline">{isEn ? 'FastMoss Proof' : 'Minh Chứng FastMoss'}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-[10px] font-black">36</span>
            </button>

            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-kami-ely"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-[#FFD14C] dark:text-slate-950 dark:hover:bg-[#FFE485]"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar with Dynamic ScrollSpy Active Effect */}
        <div 
          ref={subnavContainerRef}
          className="bg-[#C8EEF7]/25 backdrop-blur-md border-t border-[#9BE7FA]/40 py-2 px-4 overflow-x-auto dark:bg-slate-900/90 dark:border-slate-800/80"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              <span className="text-[11px] font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] mr-1 shrink-0 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] animate-ping" />
                {activeTab === 'science' 
                  ? (isEn ? 'Data Science Sections:' : 'Mục Khoa Học Dữ Liệu:') 
                  : activeTab === 'shop' 
                    ? (isEn ? 'Shop Sections:' : 'Mục Shop:') 
                    : (isEn ? 'Creator Sections:' : 'Mục Creator:')
                }
              </span>
              {currentNavItems.map((item: any) => {
                const isActive = activeSection === item.id;
                return (
                  <React.Fragment key={item.id}>
                    {item.dividerBefore && (
                      <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0 mx-1 self-center" />
                    )}
                    <button
                      id={`nav-tab-${item.id}`}
                      type="button"
                      onClick={(e) => handleNavClick(item.id, e)}
                      className={`group relative px-3.5 py-1.5 rounded-xl transition-all duration-200 ease-out cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${
                        isActive
                          ? activeTab === 'science'
                            ? 'bg-teal-500 text-slate-950 font-black shadow-md border-2 border-teal-400 ring-2 ring-teal-300 scale-105'
                            : activeTab === 'shop'
                              ? 'bg-[#9BE7FA] text-[#0D7287] font-black shadow-md border-2 border-[#0D7287] ring-2 ring-[#9BE7FA]/80 scale-105 dark:bg-[#0D7287] dark:text-[#9BE7FA] dark:border-[#9BE7FA]'
                              : 'bg-[#FFD14C] text-slate-950 font-black shadow-md border-2 border-slate-950 ring-2 ring-[#FFE485] scale-105 dark:bg-[#FFD14C] dark:text-slate-950 dark:border-white'
                          : 'hover:bg-white hover:text-slate-950 text-slate-600 font-semibold border-2 border-transparent dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {isActive && (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span 
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              activeTab === 'science' 
                                ? 'bg-slate-950' 
                                : activeTab === 'shop' 
                                  ? 'bg-[#0D7287] dark:bg-[#9BE7FA]' 
                                  : 'bg-slate-950 dark:bg-white'
                            }`}
                          />
                          <span 
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              activeTab === 'science' 
                                ? 'bg-slate-950' 
                                : activeTab === 'shop' 
                                  ? 'bg-[#0D7287] dark:bg-[#9BE7FA]' 
                                  : 'bg-slate-950 dark:bg-white'
                            }`}
                          />
                        </span>
                      )}
                      <span className={isActive ? 'underline decoration-2 underline-offset-4' : ''}>
                        {item.label}
                      </span>
                      {isActive && (
                        <span 
                          className={`absolute -bottom-1.5 left-2 right-2 h-0.5 rounded-full shadow-xs ${
                            activeTab === 'science' 
                              ? 'bg-teal-500' 
                              : activeTab === 'shop' 
                                ? 'bg-[#0D7287] dark:bg-[#9BE7FA]' 
                                : 'bg-slate-950 dark:bg-white'
                          }`} 
                        />
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Reading progress metric on wide screen */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
              <span>{Math.round(scrollProgress)}%</span>
              <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-150 ${activeTab === 'shop' ? 'bg-[#0D7287] dark:bg-[#9BE7FA]' : 'bg-[#FFD14C]'}`}
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic reading progress line on taskbar */}
        <div className="h-0.5 w-full bg-[#9BE7FA]/20 overflow-hidden dark:bg-slate-800">
          <div 
            className="h-full transition-all duration-150 ease-out bg-gradient-to-r from-[#0D7287] via-[#9BE7FA] to-[#FFD14C]" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Main Hero Header - Compact Design */}
      {activeTab !== 'science' && (
        <header className="relative bg-gradient-to-b from-[#C8EEF7]/40 via-[#FFE485]/10 to-slate-50 text-slate-900 pt-8 pb-8 overflow-hidden border-b border-[#9BE7FA]/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:border-slate-800">
        
        {/* Subtle Glow */}
        <div className="absolute right-[5%] top-0 w-56 h-56 rounded-full bg-gradient-to-br from-[#9BE7FA]/30 to-[#FFE485]/20 blur-3xl pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Row 1: Badge + Title */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-xl text-xs font-bold tracking-wide text-[#0D7287] shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <Flame className="w-3.5 h-3.5 text-[#FFD14C]" />
                <span>{isEn ? 'FASTMOSS TELEMETRY · 180-DAY REAL DATASET' : 'DỮ LIỆU TELEMETRY 180 NGÀY · PHÂN TÍCH CHUYÊN SÂU TỪ FASTMOSS'}</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
                {activeTab === 'shop' ? (
                  <>
                    {isEn ? 'Kami Ely TikTok Shop: ' : 'TikTok Shop Kami Ely: '}
                    <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? 'Growth via LIVE & Nano-Affiliates' : 'Bứt Phá Nhờ LIVE Shopping & KOC'}
                    </span>
                  </>
                ) : (
                  <>
                    {isEn ? 'Creator @kamielyhn: ' : 'Creator @kamielyhn: '}
                    <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? '9.2B VND GMV Powerhouse' : 'Năng Lực Thương Mại 9,2 Tỷ đ'}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-400 max-w-2xl">
                {activeTab === 'shop' ? (
                  isEn 
                    ? '338 products · 5.7k affiliates · 11.2k videos · 7.0k live sessions. Real commercial metrics from FastMoss.'
                    : '338 mã SP · 5.700 KOC · 11.200 video · 7.000 phiên live. Dữ liệu thương mại thực tế từ FastMoss.'
                ) : (
                  isEn
                    ? '73% Female · 60% Gen Z audience · 0.74% peak engagement · High-converting video/live sales matrix.'
                    : '73% Nữ · 60% Gen Z · Tương tác đỉnh 0.74% · Ma trận doanh thu video & mega-live.'
                )}
              </p>
            </div>

            {/* Compact Lifetime GMV Badge */}
            <div className="bg-white border-2 border-[#9BE7FA] rounded-2xl p-4 shadow-md min-w-[240px] dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold dark:text-slate-400">
                  {activeTab === 'shop' ? (isEn ? 'ALL-TIME GMV' : 'GMV TÍCH LŨY') : (isEn ? 'CREATOR GMV' : 'GMV CREATOR')}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-black uppercase border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
                  {isEn ? 'Lifetime' : 'Toàn thời gian'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                {activeTab === 'shop' ? '31,6' : '9,2'} <span className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? 'B VND' : 'Tỷ đ'}</span>
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1">
                <span>⚠️</span>
                <span>
                  {activeTab === 'shop'
                    ? (isEn ? 'Since 2022 (not 180d)' : 'Từ 2022 (không phải 180N)')
                    : (isEn ? 'Since 2023 (not 180d)' : 'Từ 2023 (không phải 180N)')}
                </span>
              </div>
            </div>
          </div>

          {/* Inline Metrics Row */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            {activeTab === 'shop' ? (
              <>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-white">85.5k / 12,7Tđ</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? '180d Units & GMV' : 'SP & GMV 180N'}</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-[#0D7287] dark:text-[#9BE7FA]">#7.5k / #259</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Rank' : 'Xếp hạng'}</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFE485] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-white">5.7k KOCs</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Affiliates</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFD14C] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-[#FFD14C]">3.9/5.0 (99%)</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Rating' : 'Đánh giá'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-white">48.8k</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Followers (+9.4k)' : 'Follow (+9.4k)'}</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#9BE7FA]/60 dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-[#0D7287] dark:text-[#9BE7FA]">135kđ / 30kđ</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">GPM Video/LIVE</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFE485] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-white">34.3M</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isEn ? 'Views' : 'Lượt xem'}</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#FFD14C] dark:bg-slate-900 dark:border-slate-800 inline-flex items-center gap-2">
                  <span className="text-sm font-black text-slate-950 dark:text-[#FFD14C]">67 Index</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">E-com</span>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      )}

      {/* BODY CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* ========================================================================= */}
        {/* CASE STUDY KHOA HỌC DỮ LIỆU & THỐNG KÊ SUY DIỄN (6 PHẦN CHUẨN MỰC)       */}
        {/* ========================================================================= */}
        {activeTab === 'science' && (
          <div className="space-y-12">
            <KamiElyScienceCaseStudy onBack={onBack} isEmbedded={isEmbedded} />

            {/* Cross-Tab Navigation CTA: Science -> Shop & Creator */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#F0FBFE] to-[#C8EEF7]/40 border-2 border-[#0D7287] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 dark:bg-slate-900 dark:border-slate-700">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8EEF7] text-[#0D7287] text-xs font-black uppercase tracking-wider dark:bg-slate-800 dark:text-[#9BE7FA]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'BUSINESS INTELLIGENCE DASHBOARDS' : 'DASHBOARD DỮ LIỆU THƯƠNG MẠI THỰC TẾ'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                    {isEn 
                      ? 'Explore Full FastMoss Telemetry Dashboards' 
                      : 'Khám Phá Dữ Liệu Thực Tế FastMoss Của Toàn Shop & Creator'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'View detailed breakdowns of 338 SKUs, 5.7k affiliate creators, 7,000 live streams, and independent audit screenshot proofs.'
                      : 'Trực quan hóa chi tiết 338 mã sản phẩm, mạng lưới 5.700 KOC affiliate, 7.000 phiên livestream cùng kho bằng chứng viễn trắc 36 ảnh gốc FastMoss.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      handleTabChange('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#0D7287] hover:bg-[#095262] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'View Shop Analysis (Part 1)' : 'Xem Phân Tích Shop (Phần 1)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange('creator');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-[#FFD14C] hover:bg-[#f5c332] text-slate-950 font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'View Creator (Part 2)' : 'Xem Creator (Phần 2)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHẦN 1: PHÂN TÍCH SHOP (KAMI ELY OFFICIAL STORE)                          */}
        {/* ========================================================================= */}
        {activeTab === 'shop' && (
          <div className="space-y-16">
            
            {/* 1.1 TỔNG QUAN VỀ SHOP */}
            <section id="shop-overview" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.1" title={isEn ? "Shop Overview & Operational Health" : "Tổng Quan Về Shop & Sức Khỏe Vận Hành"} id="shop-overview" onCopy={copyDeepLink} />

              {/* Data Scope & Time Horizons Matrix for Store */}
              {renderDataScopeMatrix('shop')}

              {/* Shop Profile & Benchmark Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#C8EEF7] flex items-center justify-center font-black text-[#0D7287] text-lg border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700">
                      KE
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-950 dark:text-white">Kami Ely</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">TikTok Shop Vietnam · Sports & Outdoor</p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs text-slate-600 dark:divide-slate-800 dark:text-slate-400">
                    <div className="py-2 flex justify-between">
                      <span>{isEn ? 'Inclusion Time' : 'Thời gian gia nhập'}:</span>
                      <b className="text-slate-900 dark:text-slate-200">{shopOverviewKPIs.inclusionDate}</b>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>{isEn ? 'Product Price Range' : 'Dải giá niêm yết'}:</span>
                      <b className="text-slate-900 dark:text-slate-200">{shopOverviewKPIs.priceRange}</b>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>{isEn ? 'National Ranking' : 'Xếp hạng toàn quốc'}:</span>
                      <b className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{shopOverviewKPIs.nationalRank}</b>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>{isEn ? 'Category Rank' : 'Xếp hạng ngành hàng'}:</span>
                      <b className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{shopOverviewKPIs.categoryRank}</b>
                    </div>
                  </div>
                </div>

                {/* Operations & Service Quality */}
                <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    {isEn ? 'Service & Operations Score' : 'Chất Lượng Dịch Vụ & Vận Hành'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800/60 border border-[#FFE485]/60 dark:border-slate-700/60">
                      <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{shopOverviewKPIs.rating}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Shop Overall Rating' : 'Đánh giá chung'}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F0FBFE] dark:bg-slate-800/60 border border-[#9BE7FA]/60 dark:border-slate-700/60">
                      <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.positiveRate}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Positive Rating' : 'Tỷ lệ tích cực'}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F0FBFE] dark:bg-slate-800/60 border border-[#9BE7FA]/60 dark:border-slate-700/60">
                      <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.responseRate24h}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Responds <24h' : 'Phản hồi trong 24h'}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800/60 border border-[#FFE485]/60 dark:border-slate-700/60">
                      <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{shopOverviewKPIs.shipWithin48h}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Ships <48h' : 'Giao hàng trong 48h'}</div>
                    </div>
                  </div>
                </div>

                {/* Content Assets Inventory */}
                <div className="p-6 rounded-3xl bg-white border border-[#C8EEF7] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                    {isEn ? 'Content & Commerce Inventory' : 'Tài Sản Nội Dung & Thương Mại'}
                  </h3>
                  <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                      <span>{isEn ? 'Active Products on Sale' : 'Sản phẩm đang mở bán'}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{shopOverviewKPIs.activeSkus} / {shopOverviewKPIs.historicalSkus}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                      <span>{isEn ? 'Shoppable LIVE Sessions' : 'Phiên LIVE gắn giỏ hàng'}</span>
                      <span className="font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.totalLiveStreams}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                      <span>{isEn ? 'Shoppable Short Videos' : 'Video ngắn gắn giỏ hàng'}</span>
                      <span className="font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.totalVideos}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                      <span>{isEn ? 'Active Affiliate Creators' : 'Nhà sáng tạo Affiliate'}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{shopOverviewKPIs.totalAffiliates}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* GROUP DIVIDER: DOANH SỐ & SẢN PHẨM */}
            <div className="pt-6 pb-2 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 shadow-xs">
                {isEn ? 'Group II: Sales & Product Matrix' : 'Nhóm II: Doanh Số & Ma Trận Sản Phẩm'}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
            </div>

            {/* 1.2 PHÂN TÍCH BÁN HÀNG */}
            <section id="shop-sales" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.2" title={isEn ? "Sales Trajectory & Transaction Structure" : "Phân Tích Bán Hàng & Cơ Cấu Giao Dịch"} id="shop-sales" onCopy={copyDeepLink} />

              {/* 180-Day Trajectory Chart using #0D7287, #9BE7FA, #FFD14C, #FFE485 */}
              <div id="shop-sales-trend" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">
                      {isEn ? '180-Day Trajectory (26 Weeks): Units Sold & GMV in Million VND' : 'Chuỗi Doanh Số 180 Ngày (26 Tuần): Sản Lượng & Doanh Thu GMV (Triệu đ)'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isEn ? 'Weekly aggregation showing June summer peak propelled by continuous LIVE sessions' : 'Dữ liệu tổng hợp theo tuần ghi nhận đỉnh điểm mùa du lịch tháng 6 với hơn 1.950 SP/ngày'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleExportChart('shop-sales-trend', 'kami-ely-sales-trend-180d')}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#C8EEF7]/50 hover:bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#9BE7FA] transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất PNG</span>
                  </button>
                </div>

                <div className="h-80 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={shopWeeklyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUnitsBrand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9BE7FA" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorGmvBrand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFE485" stopOpacity={0.7}/>
                          <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#0D7287" fontSize={11} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#b45309" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #9BE7FA', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                      <Area yAxisId="left" type="monotone" dataKey="units" name={isEn ? 'Units Sold' : 'Sản phẩm bán ra'} stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#colorUnitsBrand)" />
                      <Area yAxisId="right" type="monotone" dataKey="gmv" name={isEn ? 'GMV (Million VND)' : 'GMV (Triệu đ)'} stroke="#FFD14C" strokeWidth={3} fillOpacity={1} fill="url(#colorGmvBrand)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transaction Channels & Content Formats Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Channels */}
                <div id="shop-channels-pie" className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Transaction Channels' : 'Phân Bổ Kênh Giao Dịch'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Kênh chính vs Mạng lưới Affiliate</p>
                    </div>
                    <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
                      <button onClick={() => setChannelMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${channelMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
                      <button onClick={() => setChannelMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${channelMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={channelData[channelMetric]}
                          cx="50%"
                          cy="50%"
                          innerRadius="50%"
                          outerRadius="78%"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {channelData[channelMetric].map((_, index) => (
                            <Cell key={`cell-ch-${index}`} fill={PALETTE[index % PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, channelMetric === 'gmv' ? 'Tỷ trọng GMV' : 'Tỷ trọng số lượng']} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Content Distribution */}
                <div id="shop-content-pie" className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Content Format Distribution' : 'Cơ Cấu Định Dạng Nội Dung'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">LIVE vs Video vs Thẻ sản phẩm</p>
                    </div>
                    <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
                      <button onClick={() => setContentMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${contentMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
                      <button onClick={() => setContentMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${contentMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={contentData[contentMetric]}
                          cx="50%"
                          cy="50%"
                          innerRadius="50%"
                          outerRadius="78%"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {contentData[contentMetric].map((_, index) => (
                            <Cell key={`cell-ct-${index}`} fill={PALETTE[(index + 2) % PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, contentMetric === 'gmv' ? 'Tỷ trọng GMV' : 'Tỷ trọng số lượng']} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.3 PHÂN TÍCH SẢN PHẨM */}
            <section id="shop-products" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.3" title={isEn ? "Product Analysis & Best-Selling SKUs" : "Phân Tích Sản Phẩm & Ma Trận SKU Chủ Lực"} id="shop-products" onCopy={copyDeepLink} extraAction={<button
                    onClick={() => openProofScreenshot('sc-073543')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 hover:bg-[#9BE7FA]/60 text-[#0D7287] font-bold flex items-center gap-1 border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer transition-all"
                    title="Xem ảnh FastMoss gốc #073543, #073549, #073557"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ảnh FastMoss #073543-#073557</span>
                  </button>} />

              {/* Category & Price distribution */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Category Distribution' : 'Cơ Cấu Ngành Hàng'}</h3>
                    <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
                      <button onClick={() => setCategoryMetric('units')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${categoryMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
                      <button onClick={() => setCategoryMetric('gmv')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${categoryMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                      <button onClick={() => setCategoryMetric('byCount')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${categoryMetric === 'byCount' ? 'bg-[#C8EEF7] text-[#0D7287] shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'SKU Count' : 'Số mã SKU'}</button>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shopCategoryData[categoryMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={135} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Tỷ trọng']} />
                        <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Price Range Distribution' : 'Phân Khúc Mức Giá'}</h3>
                    <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
                      <button onClick={() => setPriceMetric('units')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priceMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
                      <button onClick={() => setPriceMetric('gmv')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priceMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                      <button onClick={() => setPriceMetric('byCount')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priceMetric === 'byCount' ? 'bg-[#FFE485] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'SKU Count' : 'Số mã SKU'}</button>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shopPriceTierData[priceMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="range" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={125} />
                        <Tooltip formatter={(value, _name, item: any) => [item?.payload?.label || `${value}%`, 'Tỷ trọng']} />
                        <Bar dataKey="value" fill="#FFD14C" radius={[0, 6, 6, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top 6 SKUs Table */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Top Performing SKUs (Last 90 Days Telemetry)' : 'Top Sản Phẩm Bán Chạy Nhất (Dữ Liệu 90 Ngày)'}
                </h3>
                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#9BE7FA]/60 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#C8EEF7]/30 text-slate-800 font-bold uppercase border-b border-[#9BE7FA]/40 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Mã SKU</th>
                        <th className="p-3.5">Tên Sản Phẩm</th>
                        <th className="p-3.5">Phân Loại</th>
                        <th className="p-3.5">Giá Bán</th>
                        <th className="p-3.5">Đã Bán</th>
                        <th className="p-3.5">Doanh Thu (GMV)</th>
                        <th className="p-3.5">Hoa Hồng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {shopTopSKUs.map((sku) => (
                        <tr key={sku.code} className="hover:bg-[#C8EEF7]/10 transition-colors dark:hover:bg-slate-800/50">
                          <td className="p-3.5 font-bold font-mono text-[#0D7287] dark:text-[#9BE7FA]">{sku.code}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">{sku.name}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">{sku.category}</td>
                          <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">{sku.price.toLocaleString()} đ</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{sku.units.toLocaleString()} SP</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{sku.gmv} Triệu đ</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{sku.commission}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
                  {shopTopSKUs.map((sku) => (
                    <div key={sku.code} className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-[#0D7287] dark:text-[#9BE7FA] px-2 py-0.5 rounded-md bg-[#C8EEF7]/50 dark:bg-slate-800">
                          {sku.code}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {sku.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                        {sku.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'Price' : 'Giá bán'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{sku.price.toLocaleString()} đ</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'Units Sold' : 'Đã bán'}</div>
                          <div className="font-black text-slate-950 dark:text-white">{sku.units.toLocaleString()} SP</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                          <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{sku.gmv} Tr đ</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'Commission' : 'Hoa hồng'}</div>
                          <div className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">{sku.commission}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* GROUP DIVIDER: CÁC KÊNH BÁN HÀNG */}
            <div className="pt-6 pb-2 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 shadow-xs">
                {isEn ? 'Group III: Performance Channels (Affiliate · LIVE · Video)' : 'Nhóm III: Các Kênh Bán Hàng (Affiliate · LIVE · Video)'}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
            </div>

            {/* 1.4 AFFILIATES */}
            <section id="shop-affiliates" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.4" title={isEn ? "Affiliate Network & KOC Performance" : "Mạng Lưới Tiếp Thị Liên Kết & KOC"} id="shop-affiliates" onCopy={copyDeepLink} extraAction={<button
                    onClick={() => openProofScreenshot('sc-073657')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 hover:bg-[#9BE7FA]/60 text-[#0D7287] font-bold flex items-center gap-1 border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer transition-all"
                    title="Xem ảnh FastMoss gốc #073657, #073705, #073713"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ảnh FastMoss #073657-#073713</span>
                  </button>} />

              {/* Nano Powerhouse callout with #C8EEF7 & #FFE485 gradient */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#C8EEF7]/50 via-[#FFFDF5] to-[#FFE485]/40 border border-[#9BE7FA] border-l-4 border-l-[#0D7287] shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700 dark:border-l-[#9BE7FA]">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0D7287] text-white text-[11px] font-black uppercase">KOC Nano</span>
                    <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                      Sức Mạnh Vượt Trội Của Nhóm Nano-Affiliate (1k - 5k Followers)
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    Nhóm creator có từ 1k đến 5k followers chiếm 48.2% số lượng nhưng mang lại tới 52.7% GMV (2,5 Tỷ đ) và 52.7% sản lượng (16.6k đơn), vượt xa nhóm Macro (&gt;100k chỉ đóng góp 5.3% GMV).
                  </p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <div className="p-3 rounded-2xl bg-white border border-[#9BE7FA]/60 text-center dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">5.7k</div>
                    <div className="text-[10px] text-slate-500">Tổng Influencers</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#FFD14C] text-center dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#FFD14C]">4,7 Tỷ đ</div>
                    <div className="text-[10px] text-slate-500">GMV 90 Ngày</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#9BE7FA]/60 text-center dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">+983</div>
                    <div className="text-[10px] text-slate-500">KOC Mới Onboard</div>
                  </div>
                </div>
              </div>

              {/* Follower Tiers Chart & Top KOC Table */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Distribution by Follower Tier' : 'Hiệu Quả Theo Tệp Follower'}</h3>
                    <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
                      <button onClick={() => setAffMetric('units')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
                      <button onClick={() => setAffMetric('gmv')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                      <button onClick={() => setAffMetric('count')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affMetric === 'count' ? 'bg-[#FFE485] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số KOC</button>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={affiliateFollowerTiers[affMetric]} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" domain={[0, 'auto']} stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis dataKey="tier" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={125} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top KOC Table */}
                <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <Award className="w-5 h-5 text-[#FFD14C]" />
                    {isEn ? 'Top Performing Affiliates' : 'Top KOC / Affiliates Tiêu Biểu'}
                  </h3>
                  <div className="space-y-2.5">
                    {topAffiliatesList.map((aff) => (
                      <div key={aff.id} className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFE485]/50 flex items-center justify-between gap-3 dark:bg-slate-800/60 dark:border-slate-700/60">
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{aff.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] dark:bg-slate-700 dark:text-[#9BE7FA] font-bold">
                              @{aff.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {aff.followers.toLocaleString()} followers · Video GPM: {aff.videoGpm}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-[#0D7287] dark:text-[#FFD14C]">{aff.gmv.toLocaleString()} Triệu đ</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{aff.units.toLocaleString()} SP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KOC Category Distribution (FastMoss Screenshots 073657, 073705, 073713) */}
              <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {isEn ? 'Affiliate Network Industry Breakdown' : 'Cơ Cấu Ngành Hàng Của Mạng Lưới KOC Affiliate'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isEn ? 'Telemetry from FastMoss Screenshots 073657, 073705 & 073713' : 'Dữ liệu trích xuất từ chuỗi ảnh FastMoss #073657, #073705 & #073713'}
                    </p>
                  </div>
                  <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800 shrink-0">
                    <button onClick={() => setAffCatMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affCatMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
                    <button onClick={() => setAffCatMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affCatMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                    <button onClick={() => setAffCatMetric('count')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affCatMetric === 'count' ? 'bg-[#FFE485] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'KOC Count' : 'Số KOC'}</button>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  <div className="md:col-span-2 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shopAffiliateCategoryDistribution[affCatMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={145} />
                        <Tooltip formatter={(value, _name, item: any) => [item?.payload?.label || `${value}%`, affCatMetric === 'gmv' ? 'Doanh số' : affCatMetric === 'units' ? 'Sản lượng' : 'Số KOC']} />
                        <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFE485]/20 border border-[#FFE485]/70 border-l-4 border-l-[#FFD14C] flex flex-col justify-center space-y-3 text-xs dark:bg-slate-800/60 dark:border-slate-700 dark:border-l-[#FFD14C]">
                    <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[#FFD14C]" />
                      Insight Ngành Hàng KOC
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      KOC thuộc nhóm <strong>Clothing & Accessories</strong> chỉ chiếm <strong>32.0% số lượng (315 KOC)</strong> nhưng tạo ra tới <strong>68.69% sản lượng (21.7k SP)</strong> và <strong>66.08% doanh số GMV (3,1 Tỷ đ)</strong>.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Nhóm <strong>Other</strong> chiếm tới 57.48% số KOC (566 KOC) nhưng chỉ đóng góp 28.83% GMV (1,3 Tỷ đ). Tỷ lệ chuyển đổi tập trung cao nhất ở các KOC chuyên ngành thời trang và làm đẹp.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 1.5 LIVESTREAM */}
            <section id="shop-live" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.5" title={isEn ? "Shop Livestream Performance" : "Hiệu Quả Livestream Của Shop"} id="shop-live" onCopy={copyDeepLink} />

              {/* LIVE KPIs with Palette Borders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopLiveKPIs.sessions}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Total LIVE Sessions' : 'Tổng phiên LIVE (180 ngày)'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{shopLiveKPIs.totalGmv}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Total LIVE GMV' : 'Tổng doanh số LIVE'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{shopLiveKPIs.avgViewers}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Avg Viewers/Session' : 'Người xem TB/phiên'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">{shopLiveKPIs.avgGmvPerSession}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Avg GMV/Session' : 'Doanh thu TB/phiên'}</div>
                </div>
              </div>

              {/* Top Mega-Live Sessions Table */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Top Mega-Live Sessions Propelling Summer Peaks' : 'Chi Tiết Các Phiên Mega-Live Bùng Nổ Doanh Thu'}
                </h3>
                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#9BE7FA]/60 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#C8EEF7]/30 text-slate-800 font-bold uppercase border-b border-[#9BE7FA]/40 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Tiêu Đề Phiên LIVE</th>
                        <th className="p-3.5">Người Phát</th>
                        <th className="p-3.5">Thời Gian Bắt Đầu</th>
                        <th className="p-3.5">Thời Lượng</th>
                        <th className="p-3.5">Lượt Xem</th>
                        <th className="p-3.5">Đã Bán</th>
                        <th className="p-3.5">GMV Phiên</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {topShopLiveSessions.map((l, i) => (
                        <tr key={i} className="hover:bg-[#C8EEF7]/10 transition-colors dark:hover:bg-slate-800/50">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">{l.title}</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{l.creator}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">{l.startTime}</td>
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{l.duration}</td>
                          <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{l.units.toLocaleString()} SP</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Triệu đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {topShopLiveSessions.map((l, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                          {l.creator}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {l.startTime} · {l.duration}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                        {l.title}
                      </h4>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                        <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400">{isEn ? 'Viewers' : 'Lượt xem'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                          <div className="font-black text-slate-950 dark:text-white">{l.units.toLocaleString()} SP</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                          <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Tr đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 1.6 VIDEO */}
            <section id="shop-video" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.6" title={isEn ? "Shoppable Video Analytics" : "Phân Tích Video Có Giỏ Hàng Của Shop"} id="shop-video" onCopy={copyDeepLink} />

              {/* Video metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{shopVideoKPIs.totalShoppableVideos}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Shoppable Videos (180d)' : 'Video gắn giỏ hàng (180 ngày)'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{shopVideoKPIs.units90d}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Units Sold (90d)' : 'Sản phẩm bán qua Video (90 ngày)'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopVideoKPIs.gmv90d}</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? 'Video GMV (90d)' : 'Doanh thu Video (90 ngày)'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">0% Paid Ads</div>
                  <div className="text-xs text-slate-500 mt-1">{isEn ? '100% Organic UGC Viral' : '100% Lan tỏa tự nhiên'}</div>
                </div>
              </div>

              {/* Top High-converting Shoppable Videos Table */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Top Converting Shoppable Videos' : 'Top Video Gắn Giỏ Hàng Đạt Doanh Thu Cao Nhất'}
                </h3>
                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#9BE7FA]/60 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#C8EEF7]/30 text-slate-800 font-bold uppercase border-b border-[#9BE7FA]/40 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Tiêu Đề Video</th>
                        <th className="p-3.5">Creator Sản Xuất</th>
                        <th className="p-3.5">Lượt Xem</th>
                        <th className="p-3.5">Lượt Thích</th>
                        <th className="p-3.5">Đã Bán</th>
                        <th className="p-3.5">GMV Video</th>
                        <th className="p-3.5">Chi Phí Ads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {topShoppableVideos.map((v, i) => (
                        <tr key={i} className="hover:bg-[#C8EEF7]/10 transition-colors dark:hover:bg-slate-800/50">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm truncate">{v.title}</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{v.creator}</td>
                          <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{v.views}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">{v.likes}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{v.units.toLocaleString()} SP</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Triệu đ</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] text-[11px] font-extrabold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                              {v.ads}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {topShoppableVideos.map((v, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                          {v.creator}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] text-[10px] font-extrabold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                          {v.ads}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                        {v.title}
                      </h4>
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                        <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'Views' : 'Lượt xem'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{v.views}</div>
                        </div>
                        <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'Likes' : 'Thích'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{v.likes}</div>
                        </div>
                        <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                          <div className="font-black text-slate-950 dark:text-white">{v.units.toLocaleString()} SP</div>
                        </div>
                        <div className="p-1 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                          <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Tr đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* GROUP DIVIDER: KÊNH TỰ VẬN HÀNH CHÍNH CHỦ */}
            <div className="pt-6 pb-2 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 shadow-xs">
                {isEn ? 'Group IV: Anchor Host & Brand Synergy' : 'Nhóm IV: Kênh Sáng Tạo Tự Vận Hành & Cộng Hưởng Thương Hiệu'}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA] to-transparent flex-1 dark:via-slate-700" />
            </div>

            {/* 1.7 TÀI KHOẢN TỰ VẬN HÀNH (SELF-OPERATED ACCOUNT @kamielyhn) */}
            <section id="shop-self-operated" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="1.7" title={isEn ? "Self-Operated Creator Account (@kamielyhn)" : "Tài Khoản Sáng Tạo Tự Vận Hành Chính Chủ (@kamielyhn)"} id="shop-self-operated" onCopy={copyDeepLink} extraAction={<button
                    onClick={() => openProofScreenshot('sc-074244')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#C8EEF7] text-[#0D7287] hover:bg-[#9BE7FA] transition-colors border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer"
                    title={isEn ? 'View FastMoss Proof #074244' : 'Xem Bằng Chứng FastMoss #074244'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>FastMoss #074244</span>
                  </button>} />

              {/* Self-Operated Account Banner & KPIs */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-white to-[#C8EEF7]/30 border border-[#FFD14C] shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0D7287] to-[#9BE7FA] flex items-center justify-center text-white text-2xl font-black shadow-md border border-[#9BE7FA]">
                      KL
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-black text-slate-950 dark:text-white">
                          {shopSelfOperatedAccount.creatorName}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] font-mono text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                          {shopSelfOperatedAccount.handle}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                          {isEn ? 'Sole In-House Creator' : 'Creator Tự Vận Hành Độc Quyền'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {isEn 
                          ? `Cooperation since ${shopSelfOperatedAccount.bindingDate} · Accounts for 49.3% GMV and 49.8% Volume` 
                          : `Thời gian hợp tác từ ${shopSelfOperatedAccount.bindingDate} · Đóng góp 49.3% GMV và 49.8% sản lượng của toàn bộ shop`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTabChange('creator')}
                      className="px-4 py-2 rounded-xl bg-[#0D7287] text-white text-xs font-bold hover:bg-[#0D7287]/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isEn ? 'Deep Dive Creator Tab' : 'Khám phá sâu Tab Creator'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">
                      {shopSelfOperatedAccount.unitsSold}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEn ? `Units Sold (${shopSelfOperatedAccount.unitsShare})` : `Sản lượng bán (${shopSelfOperatedAccount.unitsShare})`}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-2xl font-black text-slate-950 dark:text-white">
                      {shopSelfOperatedAccount.gmv}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEn ? `Self GMV (${shopSelfOperatedAccount.gmvShare})` : `Doanh số tự thân (${shopSelfOperatedAccount.gmvShare})`}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#C8EEF7] shadow-xs dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">
                      {shopSelfOperatedAccount.videosCount}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEn ? 'Shoppable Videos' : 'Video gắn giỏ hàng'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-2xl font-black text-slate-950 dark:text-[#FFD14C]">
                      {shopSelfOperatedAccount.liveSessionsCount}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEn ? 'LIVE Sessions Hosted' : 'Phiên Livestream trực tiếp'}
                    </div>
                  </div>
                </div>

                {/* Strategic Flywheel cards */}
                <div className="grid md:grid-cols-3 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#0D7287] shadow-xs space-y-2 dark:bg-slate-950 dark:border-slate-800 dark:border-l-[#0D7287]">
                    <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {isEn ? 'Zero-Commission Margin' : 'Tối Ưu Biên Lợi Nhuận 0% Fee'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {isEn 
                        ? '3.0B VND GMV generated in-house eliminates typical 15-20% third-party creator commissions, preserving cash flow for R&D and flash sales.' 
                        : '3,0 Tỷ đ doanh số đến từ kênh tự vận hành giúp shop tiết kiệm 15-20% phí hoa hồng so với KOC ngoài, bảo toàn dòng tiền để tái đầu tư vào mẫu mã và flash sale.'}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#FFD14C] shadow-xs space-y-2 dark:bg-slate-950 dark:border-slate-800 dark:border-l-[#FFD14C]">
                    <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                      {isEn ? 'Organic Traffic Flywheel' : 'Bánh Đà Traffic Tự Nhiên'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {isEn 
                        ? '147 videos and 208 lives continuously funnel 34.3M creator views straight into shop product carts without paid customer acquisition costs.' 
                        : '147 video và 208 phiên live điều hướng liên tục 34.3M lượt xem của kênh vào giỏ hàng shop với chi phí CAC gần như bằng 0 cho tệp organic.'}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#0D7287] shadow-xs space-y-2 dark:bg-slate-950 dark:border-slate-800 dark:border-l-[#9BE7FA]">
                    <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {isEn ? 'Brand Consistency Control' : 'Kiểm Soát Nhất Quán Thương Hiệu'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {isEn 
                        ? 'Direct host ownership guarantees accurate product sizing, fabric consultation, and rapid feedback loops between buyers and warehouse.' 
                        : 'Chủ kênh trực tiếp live giúp tư vấn đúng size số, chất liệu bikini/đồ bơi, hạn chế tối đa tỷ lệ hoàn hàng và tạo phản hồi tức thì về xưởng.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CROSS-TAB NAVIGATION CTA */}
            <div className="pt-8 border-t border-[#9BE7FA]/60 dark:border-slate-800">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-[#C8EEF7]/30 to-[#FFE485]/40 border-2 border-[#FFD14C] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 dark:bg-slate-900 dark:border-slate-800">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'DEEP-DIVE INTO THE ANCHOR CREATOR' : 'TIẾP TỤC KHÁM PHÁ: KÊNH CHÍNH CHỦ'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                    {isEn 
                      ? 'Discover How @kamielyhn Generates 50% of Shop GMV' 
                      : 'Tìm Hiểu Cách Kênh @kamielyhn Tạo Ra 50% Doanh Số Của Toàn Shop'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn
                      ? 'Analyze creator audience demographics, video conversion rates, 208 live sessions, and 9.2B VND career commercial capacity.'
                      : 'Xem chân dung nhân khẩu học khán giả, tỷ lệ tương tác đỉnh 0.74%, dữ liệu 208 phiên live và năng lực thương mại 9,2 Tỷ đ của founder & anchor host.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      handleTabChange('creator');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#0D7287] hover:bg-[#095262] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'View Creator Analysis (Part 2)' : 'Xem Phân Tích Creator (Phần 2)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange('science');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-white border border-slate-300 hover:border-[#0D7287] text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 dark:bg-slate-800 dark:text-white dark:border-slate-700 cursor-pointer"
                  >
                    <span>{isEn ? 'Data Science Case Study' : 'Nghiên Cứu Khoa Học Dữ Liệu'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PHẦN 2: PHÂN TÍCH NGƯỜI BÁN / CREATOR (KAMIELYN - @kamielyhn)              */}
        {/* ========================================================================= */}
        {activeTab === 'creator' && (
          <div className="space-y-16">
            
            {/* 2.1 TỔNG QUAN CREATOR */}
            <section id="creator-overview" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="2.1" title={isEn ? "Creator Overview & Commercial Index" : "Tổng Quan Người Bán & Chỉ Số Thương Mại"} id="creator-overview" onCopy={copyDeepLink} badgeBg="bg-[#FFD14C] text-slate-950" />

              {/* Data Scope & Time Horizons Matrix for Creator */}
              {renderDataScopeMatrix('creator')}

              {/* Creator Profile Header */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#FFD14C] shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFD14C] to-[#FFE485] flex items-center justify-center text-slate-950 text-2xl font-black shadow-md border border-[#FFD14C]">
                    KL
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-slate-950 dark:text-white">{creatorProfile.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] font-mono text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                        @{creatorProfile.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                        {creatorProfile.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
                      &quot;{creatorProfile.bio}&quot;
                    </p>
                    <div className="text-xs text-slate-500 flex items-center gap-3 pt-1">
                      <span>Video đầu tiên: <b>{creatorProfile.firstVideoDate}</b></span>
                      <span>•</span>
                      <span>Mới nhất: <b>{creatorProfile.latestCreationDate}</b></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
                  <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFE485] text-center dark:bg-slate-800 dark:border-slate-700">
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">#{creatorProfile.nationalRank}</div>
                    <div className="text-[10px] text-slate-500">Hạng Quốc Gia</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFD14C] text-center dark:bg-slate-800 dark:border-slate-700">
                    <div className="text-lg font-black text-slate-950 dark:text-[#FFD14C]">{creatorProfile.ecomPotentialIndex}</div>
                    <div className="text-[10px] text-slate-500">Tiềm Năng E-Com</div>
                  </div>
                </div>
              </div>

              {/* Commercial Capacity Split: Video vs LIVE */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isEn ? 'Lifetime GMV Generated' : 'Tổng GMV Tích Lũy Kênh'}</div>
                  <div className="text-3xl font-black text-slate-950 dark:text-white">{creatorProfile.totalGmv}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    {isEn ? '69.9k lifetime units sold (Since May 28, 2023 · Photo 080124)' : 'Từ 69.900 SP chốt đơn (Từ khi lập kênh 28/05/2023 · Ảnh 080124)'}
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">GMV Livestream</div>
                  <div className="text-3xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorProfile.liveGmv}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">43.900 SP chốt qua các phiên LIVE</div>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-[#FFE485] shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">GMV Shoppable Video</div>
                  <div className="text-3xl font-black text-slate-950 dark:text-[#FFD14C]">{creatorProfile.videoGmv}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">26.000 SP chốt qua video ngắn</div>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-[#FFD14C] shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hiệu Suất Video GPM</div>
                  <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{creatorProfile.videoGpm}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">Gấp 4.5 lần Live GPM ({creatorProfile.liveGpm})</div>
                </div>
              </div>

              {/* Collaborative Shops Table */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Top Collaborative Stores with Creator Kamielyn' : 'Các Cửa Hàng Hợp Tác Với Creator Kamielyn'}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-[#FFE485] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Thứ Hạng</th>
                        <th className="p-3.5">Tên Cửa Hàng</th>
                        <th className="p-3.5">Ngành Hàng</th>
                        <th className="p-3.5">SP Tiếp Thị</th>
                        <th className="p-3.5">Sản Phẩm Nổi Bật</th>
                        <th className="p-3.5">Creator Đã Bán</th>
                        <th className="p-3.5">GMV Đóng Góp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {creatorCollaborativeStores.map((store) => (
                        <tr key={store.rank} className="hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50">
                          <td className="p-3.5 font-bold font-mono text-[#0D7287] dark:text-[#9BE7FA]">#{store.rank}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{store.name}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">{store.category}</td>
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{store.affiliatedProducts} SP</td>
                          <td className="p-3.5 text-slate-800 dark:text-slate-200">{store.bestSeller}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{store.creatorUnitsSold.toLocaleString()} SP</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{store.gmvDisplay}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 2.2 HOẠT ĐỘNG (ACTIVITY & POSTING BEHAVIOR) */}
            <section id="creator-activity" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="2.2" title={isEn ? "Activity & Optimal Posting Windows" : "Phân Tích Hoạt Động & Khung Giờ Đăng Tối Ưu"} id="creator-activity" onCopy={copyDeepLink} badgeBg="bg-[#FFD14C] text-slate-950" />

              {/* 24-Hour Posting Curve Chart using #0D7287 & #FFD14C */}
              <div id="creator-posting-chart" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#FFD14C]/70 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">
                      {isEn ? '24-Hour Video Posting Count & Hourly Engagement Rate (%)' : 'Biểu Đồ 24 Giờ: Số Lượng Bài Đăng & Tỷ Lệ Tương Tác Giờ Vàng (%)'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ghi nhận đỉnh điểm đăng video lúc 08:00, 10:00, 11:00 và tỷ lệ tương tác bùng nổ lúc 15:00 - 16:00 (0.74%)
                    </p>
                  </div>
                  <button
                    onClick={() => handleExportChart('creator-posting-chart', 'kamielyn-posting-activity-24h')}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FFE485]/50 hover:bg-[#FFE485] text-slate-900 border border-[#FFD14C] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#FFD14C] transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất PNG</span>
                  </button>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={creatorHourlyActivity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#0D7287" fontSize={11} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#b45309" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="posts" name="Số video đã đăng" stroke="#0D7287" strokeWidth={3} dot={{ r: 4, fill: '#9BE7FA' }} />
                      <Line yAxisId="right" type="monotone" dataKey="engagement" name="Tỷ lệ tương tác (%)" stroke="#FFD14C" strokeWidth={3} dot={{ r: 4, fill: '#FFE485' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Activity Highlights Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                    <Clock className="w-5 h-5" />
                    <h4 className="font-black text-sm text-slate-950 dark:text-white">Khung Giờ Đăng Nhiều Nhất</h4>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {creatorActivityHighlights.topPostingHours.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
                        <span>Top {i + 1}</span>
                        <span className="text-[#0D7287] dark:text-[#9BE7FA]">{h}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">54% bài đăng tập trung trong khoảng 06:00 - 12:00 sáng.</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-950 dark:text-[#FFD14C]">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="font-black text-sm text-slate-950 dark:text-white">Khung Giờ Tương Tác Đỉnh</h4>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {creatorActivityHighlights.topEngagementWindows.map((w, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#FFFDF5] font-bold border border-[#FFE485]/60 dark:bg-slate-800 flex justify-between">
                        <span>{w.time}</span>
                        <span className="text-[#0D7287] dark:text-[#FFD14C]">{w.rate}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">Đỉnh 15h-16h vượt trội 76% so với mức trung bình 0.42% toàn kênh.</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#C8EEF7] shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                    <Radio className="w-5 h-5" />
                    <h4 className="font-black text-sm text-slate-950 dark:text-white">Tần Suất Bán Hàng</h4>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
                      <span>Đăng video ngắn</span>
                      <span className="text-slate-900 dark:text-white">~2 video / ngày</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
                      <span>Phiên LIVE định kỳ</span>
                      <span className="text-[#0D7287] dark:text-[#9BE7FA]">73 phiên / 28 ngày</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
                      <span>Thời lượng TB/phiên</span>
                      <span className="text-slate-900 dark:text-white">02 giờ 26 phút</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">Mật độ phủ sóng dày đặc ~2.6 phiên LIVE/ngày giúp duy trì tương tác cao.</p>
                </div>
              </div>
            </section>

            {/* 2.3 NGƯỜI THEO DÕI (FOLLOWERS & DEMOGRAPHICS) */}
            <section id="creator-followers" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="2.3" title={isEn ? "Audience & Follower Demographics" : "Chân Dung Người Theo Dõi & Nhân Khẩu Học"} id="creator-followers" onCopy={copyDeepLink} badgeBg="bg-[#FFD14C] text-slate-950" />

              {/* Demographics 3 Charts: Gender, Age, Geographic */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Gender */}
                <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Gender Split' : 'Tỷ Lệ Giới Tính'}</h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={creatorDemographics.gender}
                          cx="50%"
                          cy="50%"
                          innerRadius="50%"
                          outerRadius="75%"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {creatorDemographics.gender.map((entry, index) => (
                            <Cell key={`cell-gender-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v}%`, 'Tỷ lệ']} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
                    Nữ giới chiếm <b>73%</b>: Phù hợp hoàn hảo với thời trang nữ & đồ bơi
                  </div>
                </div>

                {/* Age */}
                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Age Distribution' : 'Cơ Cấu Nhóm Tuổi'}</h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creatorDemographics.age} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis dataKey="group" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={65} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Tỷ trọng']} />
                        <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={20}>
                          {creatorDemographics.age.map((entry, index) => (
                            <Cell key={`cell-age-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
                    Nhóm <b>18 - 24 tuổi</b> chiếm áp đảo <b>60%</b> (Gen Z sành điệu)
                  </div>
                </div>

                {/* Top Cities */}
                <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Top Locations' : 'Phân Bổ Tỉnh / Thành'}</h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creatorDemographics.locations} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis dataKey="city" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={100} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Tỷ trọng']} />
                        <Bar dataKey="value" fill="#FFD14C" radius={[0, 6, 6, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
                    <b>TP. Hồ Chí Minh</b> dẫn đầu tuyệt đối với <b>41%</b> người theo dõi
                  </div>
                </div>
              </div>
            </section>

            {/* GROUP DIVIDER: ĐỘNG CƠ NỘI DUNG & DOANH THU */}
            <div className="pt-6 pb-2 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFE485] text-slate-950 border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 shadow-xs">
                {isEn ? 'Group II: Content & Sales Engine (Video & LIVE)' : 'Nhóm II: Động Cơ Nội Dung & Doanh Thu (Video & LIVE)'}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
            </div>

            {/* 2.4 VIDEO (CREATOR VIDEO PERFORMANCE) */}
            <section id="creator-video" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="2.4" title={isEn ? "Creator Video Performance & Tag Analytics" : "Hiệu Quả Video Của Creator & Phân Tích Tag"} id="creator-video" onCopy={copyDeepLink} badgeBg="bg-[#FFD14C] text-slate-950" />

              {/* Creator video overview metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{creatorVideoStats.totalVideos}</div>
                  <div className="text-xs text-slate-500 mt-1">Tổng video (551 có giỏ hàng)</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorVideoStats.totalViews}</div>
                  <div className="text-xs text-slate-500 mt-1">Tổng lượt xem tích lũy</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">{creatorVideoStats.avgEngagementRate}</div>
                  <div className="text-xs text-slate-500 mt-1">Tỷ lệ tương tác bình quân</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-[#FFD14C]">{creatorVideoStats.videoGmv}</div>
                  <div className="text-xs text-slate-500 mt-1">GMV bán trực tiếp qua video</div>
                </div>
              </div>

              {/* Hashtags & Category proportion */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Top 5 Hashtags */}
                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#0D7287] dark:text-[#FFD14C]" />
                    {isEn ? 'Top 5 Viral Hashtags' : 'Top 5 Hashtag Mang Lại Tương Tác Cao Nhất'}
                  </h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creatorVideoStats.topHashtags} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                        <YAxis dataKey="tag" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={110} />
                        <Tooltip formatter={(v) => [`${v}%`, 'Tỷ lệ xuất hiện']} />
                        <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Video Category Distribution */}
                <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">Cơ Cấu Ngành Bán Qua Video</h3>
                    <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
                      <button onClick={() => setCrVideoCatMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crVideoCatMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
                      <button onClick={() => setCrVideoCatMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crVideoCatMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                    </div>
                  </div>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={creatorVideoStats.categories[crVideoCatMetric]}
                          cx="50%"
                          cy="50%"
                          innerRadius="50%"
                          outerRadius="75%"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {creatorVideoStats.categories[crVideoCatMetric].map((_, index) => (
                            <Cell key={`cell-vc-${index}`} fill={PALETTE[index % PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v}%`, 'Tỷ trọng']} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Creator Top Videos Table */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Top Revenue-Generating Videos Produced by Kamielyn' : 'Top Video Gắn Giỏ Hàng Mang Lại GMV Khủng Nhất Của Kamielyn'}
                </h3>
                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FFE485] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Tiêu Đề Video</th>
                        <th className="p-3.5">Ngày Đăng</th>
                        <th className="p-3.5">Lượt Xem</th>
                        <th className="p-3.5">Lượt Thích</th>
                        <th className="p-3.5">Tỷ Lệ Tương Tác</th>
                        <th className="p-3.5">Sản Phẩm Bán</th>
                        <th className="p-3.5">GMV Video</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {creatorTopVideos.map((v, i) => (
                        <tr key={i} className="hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm truncate">{v.title}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{v.publishDate}</td>
                          <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{v.views.toLocaleString()}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">{v.likes.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{v.interactionRate}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{v.units.toLocaleString()} SP</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Triệu đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {creatorTopVideos.map((v, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {v.publishDate}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FFE485] text-slate-950 text-[10px] font-black border border-[#FFD14C]">
                          {v.interactionRate} tương tác
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                        {v.title}
                      </h4>
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                        <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'Views' : 'Lượt xem'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{v.views.toLocaleString()}</div>
                        </div>
                        <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'Likes' : 'Thích'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{v.likes.toLocaleString()}</div>
                        </div>
                        <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                          <div className="font-black text-slate-950 dark:text-white">{v.units.toLocaleString()} SP</div>
                        </div>
                        <div className="p-1 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800/60">
                          <div className="text-[9px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                          <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Tr đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2.5 LIVESTREAM (CREATOR LIVE PERFORMANCE) */}
            <section id="creator-live" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="2.5" title={isEn ? "Creator LIVE Performance & Marathon Sales" : "Hiệu Suất Livestream Của Creator & Kỷ Lục Doanh Số"} id="creator-live" onCopy={copyDeepLink} badgeBg="bg-[#FFD14C] text-slate-950" />

              {/* Creator LIVE KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorLiveKPIs.totalSessionsLifetime}</div>
                  <div className="text-xs text-slate-500 mt-1">Phiên LIVE toàn thời gian</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{creatorLiveKPIs.gmv180d}</div>
                  <div className="text-xs text-slate-500 mt-1">GMV LIVE 180 ngày (49.8k SP)</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#C8EEF7] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorLiveKPIs.avgDuration}</div>
                  <div className="text-xs text-slate-500 mt-1">Thời lượng trung bình / phiên</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">{creatorLiveKPIs.peakViewersAccumulated}</div>
                  <div className="text-xs text-slate-500 mt-1">Đỉnh điểm người xem tích lũy</div>
                </div>
              </div>

              {/* Creator Top Live Sessions */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Top Revenue-Generating LIVE Sessions Hosted by Kamielyn' : 'Chi Tiết Các Phiên Mega LIVE Khủng Nhất Của Kamielyn'}
                </h3>
                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FFD14C] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Tiêu Đề Phiên LIVE</th>
                        <th className="p-3.5">Thời Gian Bắt Đầu</th>
                        <th className="p-3.5">Thời Lượng</th>
                        <th className="p-3.5">Người Xem</th>
                        <th className="p-3.5">Đã Bán</th>
                        <th className="p-3.5">GMV Phiên</th>
                        <th className="p-3.5">Chỉ Số UV Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {creatorTopLiveStreams.map((l, i) => (
                        <tr key={i} className="hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm truncate">{l.title}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{l.startTime}</td>
                          <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 font-mono">{l.duration}</td>
                          <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{l.units.toLocaleString()} SP</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Triệu đ</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7] text-[#0D7287] font-bold font-mono text-xs border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                              {l.uv.toLocaleString()} đ/view
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {creatorTopLiveStreams.map((l, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {l.startTime} · {l.duration}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold font-mono text-[10px] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                          {l.uv.toLocaleString()} đ/view
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                        {l.title}
                      </h4>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                        <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400">{isEn ? 'Viewers' : 'Lượt xem'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                          <div className="font-black text-slate-950 dark:text-white">{l.units.toLocaleString()} SP</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                          <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Tr đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* GROUP DIVIDER: NĂNG LỰC THƯƠNG MẠI & TẬP TRUNG THƯƠNG HIỆU */}
            <div className="pt-6 pb-2 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFE485] text-slate-950 border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 shadow-xs">
                {isEn ? 'Group III: Commercial Capacity & Exclusive Monopolization' : 'Nhóm III: Năng Lực Thương Mại & Mức Độ Tập Trung Thương Hiệu'}
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
            </div>

            {/* 2.6 PHÂN TÍCH DOANH SỐ & VIỄN TRẮC 180 NGÀY (SALES TELEMETRY 180-DAY) */}
            <section id="creator-sales" className="space-y-6 scroll-mt-36">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#FFD14C] text-slate-950 rounded-lg text-xs font-black uppercase">
                    2.6
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                    {isEn ? 'Sales Analysis & 180-Day Telemetry' : 'Phân Tích Doanh Số & Dữ Liệu Viễn Trắc 180 Ngày'}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openProofScreenshot('sc-080501')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFE485] text-slate-950 hover:bg-[#FFD14C] transition-colors border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 cursor-pointer"
                    title={isEn ? 'View FastMoss Proof #080501-#080640' : 'Xem Bằng Chứng FastMoss #080501-#080640'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>FastMoss #080501-#080640</span>
                  </button>
                  <button
                    onClick={() => copyDeepLink('creator-sales', '2.6 Phân tích doanh số')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                    title="Sao chép liên kết"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 180-Day Creator Telemetry Ribbon */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#C8EEF7]/40 via-white to-[#FFE485]/30 border border-[#9BE7FA] dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {isEn ? 'Comprehensive 180-Day Creator Metrics (FastMoss Telemetry)' : 'Tổng Hợp Chỉ Số Kênh 180 Ngày Gần Nhất (FastMoss Telemetry)'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isEn ? 'Timeframe: 2024/03/09 - 2024/09/04 · Consolidated from 13 Bi-weekly Telemetry Points' : 'Thời gian: 09/03/2024 - 04/09/2024 · Trích xuất từ 13 điểm viễn trắc 2 tuần liên tục'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>100% Verified Telemetry</span>
                  </div>
                </div>

                {/* KPI Ribbon Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-white border border-[#FFD14C] text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-slate-950 dark:text-[#FFD14C]">{creator180dTelemetry.totalGmv}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? '180d GMV' : 'Doanh số 180d'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#9BE7FA] text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">{creator180dTelemetry.totalUnitsSold}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Units Sold' : 'Sản phẩm bán'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-slate-950 dark:text-white">{creator180dTelemetry.totalVideoViews}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Video Views' : 'Lượt xem video'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-rose-600 dark:text-rose-400">{creator180dTelemetry.likes}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Likes' : 'Lượt thích'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-amber-600 dark:text-amber-400">{creator180dTelemetry.saves}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Saves' : 'Lưu trữ'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">{creator180dTelemetry.shares}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Shares' : 'Chia sẻ'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-emerald-300 text-center dark:bg-slate-950 dark:border-slate-800">
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{creator180dTelemetry.followerGrowth}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Follower Net' : 'Tăng Follow'}</div>
                  </div>
                </div>
              </div>

              {/* LIVE vs Video vs Showcase Commercial Distribution */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                      LIVE Channel (84.5%)
                    </span>
                    <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#FFD14C]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-950 dark:text-white">
                      {creator180dTelemetry.liveSales.gmv}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {creator180dTelemetry.liveSales.units} ({creator180dTelemetry.liveSales.shareUnits} sản lượng)
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {isEn 
                      ? 'The core revenue engine. Live sessions achieve highest conversion by letting viewers see bikini fitting on-screen with real-time size recommendations.' 
                      : 'Cỗ máy chốt đơn chủ lực. Livestream đạt tỷ lệ chuyển đổi vượt trội nhờ người xem được nhìn trực tiếp form dáng bikini trên mẫu thật và tư vấn size trực tiếp.'}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA] shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                      Shoppable Video (15.0%)
                    </span>
                    <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">
                      {creator180dTelemetry.videoSales.gmv}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {creator180dTelemetry.videoSales.units} ({creator180dTelemetry.videoSales.shareUnits} sản lượng)
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {isEn 
                      ? 'Top-of-funnel brand amplifier. 6.6M views generate continuous organic discovery and long-tail purchases even when creator is offline.' 
                      : 'Phễu lan tỏa thương hiệu đỉnh cao. 6.6M lượt xem tạo dòng khám phá tự nhiên liên tục và kích thích mua sắm đuôi dài (long-tail) ngay cả khi không live.'}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold dark:bg-slate-800 dark:text-slate-400">
                      Showcase / Trưng bày (0%)
                    </span>
                    <ShoppingBag className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-400">
                      {creator180dTelemetry.showcaseSales.gmv}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {creator180dTelemetry.showcaseSales.units}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {isEn 
                      ? 'Showcase tab is entirely unmonetized. Creator focuses 100% of commercial attention on dynamic interactive channels (Live & Shoppable Video).' 
                      : 'Kênh tủ trưng bày không phát sinh doanh thu. Toàn bộ năng lực thương mại tập trung 100% vào kênh tương tác động (Livestream và Shoppable Video).'}
                  </p>
                </div>
              </div>

              {/* 180-Day Bi-Weekly GMV Trajectory Chart */}
              <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#0D7287] dark:text-[#FFD14C]" />
                      {isEn ? '180-Day Bi-Weekly GMV Trajectory & Peak Analysis' : 'Quỹ Đạo Doanh Số GMV 180 Ngày (Chu Kỳ 2 Tuần) & Phân Tích Đỉnh Cao'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isEn ? 'Data plotted from 14 sequential FastMoss bi-weekly captures (Screenshots 080501 - 080640)' : 'Dữ liệu được vẽ từ 14 mốc chụp viễn trắc FastMoss liên tục (Ảnh 080501 - 080640)'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFFDF5] text-slate-900 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                    {isEn ? 'Summer Peak: Jun 10 - Jun 23 (1,061.6M đ)' : 'Đỉnh mùa hè: 10/06 - 23/06 (1.061,6 Triệu đ)'}
                  </span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={creator180dTelemetry.trajectory} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                      <defs>
                        <linearGradient id="creatorGmvGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFD14C" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FFE485" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="dateRange" stroke="#64748B" fontSize={10} angle={-25} textAnchor="end" tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}M`} />
                      <Tooltip 
                        formatter={(val: any, _name: any, item: any) => [
                          `${Number(val).toLocaleString()} Triệu đ (${item?.payload?.units?.toLocaleString()} SP)`,
                          'Doanh Số (GMV)'
                        ]}
                      />
                      <Area type="monotone" dataKey="gmv" stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#creatorGmvGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Product Category Sales Capacity (Screenshots 081026 & 081041) */}
              <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {isEn ? 'Category Commercial Capacity & Dominance' : 'Năng Lực Bán Hàng Theo Ngành Hàng (Category Capacity)'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isEn ? 'FastMoss Screenshot 081026 (GMV) & 081041 (Units)' : 'Trích xuất từ ảnh FastMoss #081026 (Doanh số) và #081041 (Sản lượng)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProofScreenshot('sc-081026')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#C8EEF7] text-[#0D7287] hover:bg-[#9BE7FA] transition-colors border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] cursor-pointer"
                    >
                      FastMoss #081026
                    </button>
                    <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800 shrink-0">
                      <button onClick={() => setCrSalesMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crSalesMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
                      <button onClick={() => setCrSalesMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crSalesMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Sản lượng'}</button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-2">
                  <div className="md:col-span-2 h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={creatorSalesCapacity[crSalesMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                        <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={155} />
                        <Tooltip formatter={(value, _name, item: any) => [item?.payload?.label || `${value}%`, crSalesMetric === 'gmv' ? 'Doanh số GMV' : 'Sản lượng']} />
                        <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFE485]/20 border border-[#FFE485] border-l-4 border-l-[#FFD14C] shadow-xs flex flex-col justify-center space-y-3 text-xs sm:text-sm dark:bg-slate-800/60 dark:border-slate-700 dark:border-l-[#FFD14C]">
                    <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                      {isEn ? 'Niche Monopoly Effect' : 'Hiệu Ứng Thống Trị Ngách'}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      Ngành <strong>Thể thao & Hoạt động ngoài trời (Sports & Outdoor)</strong> chiếm áp đảo tuyệt đối với <strong>98.92% GMV (5,7 Tỷ đ)</strong> và <strong>99.07% sản lượng (39.0k SP)</strong>.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Creator tập trung 100% chuyên sâu vào trang phục bơi lội, bikini và phụ kiện biển thay vì phân tán đa ngành, biến kênh thành điểm đến số 1 cho người tiêu dùng tìm kiếm đồ bơi chất lượng cao.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2.7 CỬA HÀNG HỢP TÁC PHÂN PHỐI (TOP COLLABORATIVE STORES) */}
            <section id="creator-collaborative" className="space-y-6 scroll-mt-36">
              <SectionHeader badge="2.7" title={isEn ? "Top Collaborative Brand Stores" : "Các Cửa Hàng Hợp Tác Phân Phối Của Creator"} id="creator-collaborative" onCopy={copyDeepLink} badgeBg="bg-[#FFD14C] text-slate-950" extraAction={<button
                    onClick={() => openProofScreenshot('sc-081121')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFE485] text-slate-950 hover:bg-[#FFD14C] transition-colors border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 cursor-pointer"
                    title={isEn ? 'View FastMoss Proof #081121' : 'Xem Bằng Chứng FastMoss #081121'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>FastMoss #081121</span>
                  </button>} />

              {/* Collaborative Stores Table & Brand Concentration */}
              <div className="space-y-4">
                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FFD14C] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="p-3.5">Cửa Hàng Đối Tác</th>
                        <th className="p-3.5">Đã Bán (Sản lượng)</th>
                        <th className="p-3.5">Tỷ Lệ Sản Lượng</th>
                        <th className="p-3.5">Doanh Số (GMV)</th>
                        <th className="p-3.5">Tỷ Trọng GMV</th>
                        <th className="p-3.5">Phiên LIVE</th>
                        <th className="p-3.5">Video Gắn Giỏ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {creatorCollaborativeStores.map((s, i) => (
                        <tr key={i} className={`hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50 ${i === 0 ? 'bg-[#FFFDF5] dark:bg-slate-800/40 font-bold' : ''}`}>
                          <td className="p-3.5 flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-[#0D7287] text-white' : 'bg-slate-200 text-slate-700'}`}>
                              {i + 1}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{s.storeName}</span>
                            {i === 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-[10px] font-extrabold border border-[#FFD14C]">
                                {isEn ? 'Flagship Store' : 'Shop Chính Chủ'}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">{s.unitsSold}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{s.unitsShare}</td>
                          <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{s.gmv}</td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">{s.gmvShare}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{s.liveSessions}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{s.videosCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {creatorCollaborativeStores.map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border shadow-xs space-y-2.5 transition-colors ${
                      i === 0 
                        ? 'bg-[#FFFDF5] border-[#FFD14C] dark:bg-slate-800/80 dark:border-[#FFD14C]' 
                        : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-[#0D7287] text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {i + 1}
                          </span>
                          <span className="font-black text-sm text-slate-950 dark:text-white">{s.storeName}</span>
                        </div>
                        {i === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-[10px] font-extrabold border border-[#FFD14C]">
                            {isEn ? 'Flagship Store' : 'Shop Chính Chủ'}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'Units Sold' : 'Sản lượng'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{s.unitsSold} ({s.unitsShare})</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh số'}</div>
                          <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{s.gmv} ({s.gmvShare})</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'LIVE Sessions' : 'Phiên LIVE'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{s.liveSessions}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">{isEn ? 'Videos' : 'Video gắn giỏ'}</div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{s.videosCount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Brand Concentration Analysis Callout */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-[#C8EEF7]/20 to-[#FFE485]/30 border border-[#FFD14C] border-l-4 border-l-[#FFD14C] shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between dark:bg-slate-900 dark:border-slate-800 dark:border-l-[#FFD14C]">
                  <div className="space-y-2">
                    <div className="font-black text-slate-950 dark:text-white text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {isEn ? 'Monopoly Brand Commitment (98.92% Revenue Concentration)' : 'Mức Độ Tập Trung Thương Hiệu Tuyệt Đối (98.92% GMV)'}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                      {isEn 
                        ? 'Out of 9.2B VND total career commercial GMV, 9.1B VND is exclusively concentrated in Kami Ely. This indisputably proves that @kamielyhn is NOT a general affiliate reseller, but the dedicated brand owner & anchor creator driving the entire Kami Ely e-commerce ecosystem.' 
                        : 'Trong tổng số 9,2 Tỷ đ GMV thương mại toàn thời gian, có tới 9,1 Tỷ đ tập trung trọn vẹn cho Kami Ely. Dữ liệu này chứng minh một cách không thể bàn cãi rằng @kamielyhn KHÔNG PHẢI là một affiliate bán rong đa nhãn hàng, mà chính là linh hồn và chủ nhân thương hiệu của toàn bộ hệ sinh thái Kami Ely.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] text-center shrink-0 w-full md:w-48 shadow-xs dark:bg-slate-950">
                    <div className="text-3xl font-black text-[#0D7287] dark:text-[#FFD14C]">98.92%</div>
                    <div className="text-[11px] text-slate-500 font-bold mt-1">Doanh Số Dành Cho Kami Ely</div>
                  </div>
                </div>
              </div>
            </section>

            {/* CROSS-TAB NAVIGATION CTA */}
            <div className="pt-8 border-t border-[#FFE485]/60 dark:border-slate-800">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#041E24] via-slate-900 to-[#0D7287]/40 border-2 border-[#9BE7FA] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9BE7FA] text-slate-950 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'STATISTICAL RIGOR & OPTIMIZATION' : 'CHUYÊN SÂU TOÁN THỐNG KÊ & TỐI ƯU'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isEn 
                      ? 'Read the 6-Part Applied Data Science Case Study' 
                      : 'Đọc Nghiên Cứu Khoa Học Dữ Liệu & Thống Kê Suy Diễn (6 Phần)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Mathematical validation, Tukey IQR outlier detection, Welch t-test on GPM, Polynomial regression on LIVE fatigue, STL seasonality, and linear programming.'
                      : 'Kiểm định toán học, lọc dị biệt Tukey IQR, kiểm định giả thuyết Welch t-test về GPM Video vs LIVE, hồi quy đa thức bậc 2 điểm bão hòa LIVE và tối ưu hóa phân bổ dòng tiền.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      handleTabChange('science');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#9BE7FA] hover:bg-[#72dbf3] text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'Explore Data Science Case Study' : 'Khám Phá Nghiên Cứu Data Science'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? 'Return to Shop Analysis (Part 1)' : 'Quay Lại Phân Tích Shop (Phần 1)'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-[#9BE7FA]/40 text-center text-xs text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            Dự Án Phân Tích Hiệu Suất TikTok Shop & Người Bán Kamielyn
          </p>
          <p>
            Dữ liệu tổng hợp từ FastMoss · Portfolio Data Analyst · Ma Văn Hùng
          </p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FAST MOSS PROOF GALLERY MODAL & HIGH-RESOLUTION LIGHTBOX                   */}
      {/* ========================================================================= */}
      {isProofModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 border border-[#9BE7FA]/80 dark:border-slate-800 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-gradient-to-r from-[#C8EEF7]/30 via-white to-[#FFE485]/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0D7287] text-white text-[11px] font-black uppercase tracking-wider">
                    FastMoss Verified Telemetry
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C]">
                    36 {isEn ? 'Original Captures' : 'Ảnh Gốc'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                  {isEn ? 'FastMoss Telemetry Proof Gallery' : 'Kho Bằng Chứng Viễn Trắc FastMoss (36 Ảnh Gốc)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn 
                    ? 'Official audit screenshots captured on 2026-09-05 confirming all shop & creator metrics' 
                    : 'Dữ liệu chụp màn hình xác thực độc lập ghi nhận ngày 05/09/2026 cho Shop Kami Ely & Creator @kamielyhn'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter group buttons */}
                <div className="flex bg-[#C8EEF7]/50 rounded-xl p-1 dark:bg-slate-800">
                  <button
                    onClick={() => setSelectedProofGroup('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedProofGroup === 'all'
                        ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isEn ? 'All' : 'Tất cả'} ({fastmossScreenshotsManifest.length})
                  </button>
                  <button
                    onClick={() => setSelectedProofGroup('shop')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedProofGroup === 'shop'
                        ? 'bg-[#0D7287] text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Shop ({fastmossScreenshotsManifest.filter(s => s.group === 'shop').length})
                  </button>
                  <button
                    onClick={() => setSelectedProofGroup('creator')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedProofGroup === 'creator'
                        ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Creator ({fastmossScreenshotsManifest.filter(s => s.group === 'creator').length})
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsProofModalOpen(false);
                    setActiveScreenshot(null);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  title={isEn ? 'Close' : 'Đóng'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid Container */}
            <div className="p-6 overflow-y-auto max-h-[calc(92vh-140px)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fastmossScreenshotsManifest
                  .filter((item) => selectedProofGroup === 'all' || item.group === selectedProofGroup)
                  .map((item) => (
                    <FastMossTelemetryCard
                      key={item.id}
                      item={item}
                      isEn={isEn}
                      onOpenInspect={(it) => setActiveScreenshot(it)}
                    />
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen FastMoss Telemetry Inspector Modal */}
      {activeScreenshot && (() => {
        const currentIdx = fastmossScreenshotsManifest.findIndex((s) => s.id === activeScreenshot.id);
        const prevItem = currentIdx > 0 ? fastmossScreenshotsManifest[currentIdx - 1] : null;
        const nextItem = currentIdx < fastmossScreenshotsManifest.length - 1 ? fastmossScreenshotsManifest[currentIdx + 1] : null;

        return (
          <FastMossTelemetryModal
            item={activeScreenshot}
            isEn={isEn}
            onClose={() => setActiveScreenshot(null)}
            onPrev={prevItem ? () => setActiveScreenshot(prevItem) : undefined}
            onNext={nextItem ? () => setActiveScreenshot(nextItem) : undefined}
          />
        );
      })()}

    </div>
  );
}
