'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { HERITAGE_JAPAN_DATA, THESIS_METADATA } from '@/app/data/heritageJapanData';
import {
  seriesCagr,
  pearson,
  joinOnYear,
  logLinearTrend,
  fmtPct,
  fmtNum,
} from '@/app/lib/heritageAnalytics';
import CaseStudyFooter from './shared/CaseStudyFooter';
import {
  TrendingUp,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  Code2,
  GraduationCap,
  Copy,
  Check,
  Globe,
  Users,
} from 'lucide-react';

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  initialData?: unknown;
}

const SECTION_IDS = [
  'sec-macro-policy',
  'sec-kyoto-nara',
  'sec-overtourism',
  'sec-data-audit',
  'sec-sql-python',
] as const;

const HERITAGE_SQL_PYTHON_SNIPPETS = [
  {
    id: 'sql-indexed-audit',
    labelVi: 'SQL · Đồng bộ Chuỗi Thời gian & Chỉ số hóa (2013 = 100)',
    labelEn: 'SQL · Time-Series Alignment & Indexing (2013 = 100)',
    code: `-- Mục đích: Đồng bộ chuỗi khách quốc tế Toàn quốc, Kyoto, Nara và tính chỉ số tăng trưởng (2013 = 100)
-- Kiểm định tỷ trọng địa phương/toàn quốc để phát hiện lỗi nhập liệu thập phân (Kyoto 2020)
WITH base_2013 AS (
  SELECT
    MAX(CASE WHEN region_code = 'JP_NATIONAL' THEN visitors_k END) AS jp_2013_k,
    MAX(CASE WHEN region_code = 'KYOTO_CITY'  THEN visitors_k END) AS kyoto_2013_k,
    MAX(CASE WHEN region_code = 'NARA_CITY'   THEN visitors_k END) AS nara_2013_k
  FROM fact_heritage_arrivals
  WHERE report_year = 2013
),
aligned_series AS (
  SELECT
    report_year,
    MAX(CASE WHEN region_code = 'JP_NATIONAL' THEN visitors_k END) AS jp_visitors_k,
    MAX(CASE WHEN region_code = 'KYOTO_CITY'  THEN visitors_k END) AS kyoto_visitors_k,
    MAX(CASE WHEN region_code = 'NARA_CITY'   THEN visitors_k END) AS nara_visitors_k
  FROM fact_heritage_arrivals
  WHERE report_year BETWEEN 2009 AND 2020
  GROUP BY report_year
)
SELECT
  a.report_year,
  ROUND(a.jp_visitors_k / 1000.0, 2) AS jp_visitors_m,
  ROUND(a.kyoto_visitors_k, 1) AS kyoto_visitors_k,
  ROUND(a.nara_visitors_k, 1) AS nara_visitors_k,
  ROUND(a.jp_visitors_k * 100.0 / NULLIF(b.jp_2013_k, 0), 1) AS jp_index_2013,
  ROUND(a.kyoto_visitors_k * 100.0 / NULLIF(b.kyoto_2013_k, 0), 1) AS kyoto_index_2013,
  ROUND(a.nara_visitors_k * 100.0 / NULLIF(b.nara_2013_k, 0), 1) AS nara_index_2013,
  ROUND(a.kyoto_visitors_k * 100.0 / NULLIF(a.jp_visitors_k, 0), 2) AS kyoto_share_of_national_pct
FROM aligned_series a
CROSS JOIN base_2013 b
ORDER BY a.report_year;`,
  },
  {
    id: 'py-counterfactual',
    labelVi: 'Python · Hồi quy Log-Linear Counterfactual & CAGR',
    labelEn: 'Python · Log-Linear Counterfactual & CAGR Modeling',
    code: `# Mục đích: Ước lượng xu thế phản thực tế (Log-Linear Counterfactual) giai đoạn nền 2003-2012
# và lượng hóa thặng dư du khách giai đoạn chính sách 2013-2019
import numpy as np
import pandas as pd
from scipy.stats import pearsonr

visitors = pd.DataFrame([
    (2003, 5.2), (2004, 6.1), (2005, 6.7), (2006, 7.3), (2007, 8.3),
    (2008, 8.4), (2009, 6.8), (2010, 8.6), (2011, 6.2), (2012, 8.4),
    (2013, 10.4), (2014, 13.4), (2015, 19.7), (2016, 24.0),
    (2017, 28.7), (2018, 31.2), (2019, 31.9), (2020, 4.1), (2021, 0.2), (2022, 3.4)
], columns=["year", "visitors_m"])

# 1. Tính CAGR trước chính sách (2003-2012) và giai đoạn chính sách (2013-2019)
cagr_pre = (8.4 / 5.2) ** (1 / (2012 - 2003)) - 1      # +5.48%/năm
cagr_policy = (31.9 / 10.4) ** (1 / (2019 - 2013)) - 1 # +20.53%/năm

# 2. Khớp mô hình Log-Linear ln(y) = alpha + beta * t trên cửa sổ huấn luyện 2003-2012
train = visitors[visitors["year"].between(2003, 2012)]
beta, alpha = np.polyfit(train["year"], np.log(train["visitors_m"]), 1)
visitors["counterfactual_m"] = np.exp(alpha + beta * visitors["year"]).round(2)

# 3. Thặng dư chính sách tại đỉnh 2019 và lũy kế 2013-2019
policy_window = visitors[visitors["year"].between(2013, 2019)]
surplus_2019 = 31.9 - float(visitors.loc[visitors["year"] == 2019, "counterfactual_m"].iloc[0])
cum_surplus = (policy_window["visitors_m"] - policy_window["counterfactual_m"]).sum()
print(f"CAGR 2003-2012: {cagr_pre:.2%}, CAGR 2013-2019: {cagr_policy:.2%}")
print(f"2019 Surplus: +{surplus_2019:.1f}M, Cumulative 2013-2019: +{cum_surplus:.1f}M")`,
  },
];

const POLICY_PILLARS_EN = [
  {
    year: '1950 & 2004',
    name: 'Law for the Protection of Cultural Properties (2004 Amendment)',
    focus: 'Core Conservation & Cultural Landscape Buffer',
    highlights: [
      'Classified Important Cultural Properties and National Treasures with strict restoration permitting.',
      'Added protection tiers for Cultural Landscapes (2004) and Traditional Building Preservation Districts.',
    ],
  },
  {
    year: '2006 – 2008',
    name: 'Tourism Nation Promotion Basic Law & 2008 White Paper',
    focus: 'Sustainable Tourism Governance',
    highlights: [
      'Established the Japan Tourism Agency (2008) and the Historic Town Development Act (>100 heritage zones).',
      'Set dual goals: green growth replacing heavy industry and balancing economic benefits with local life.',
    ],
  },
  {
    year: '06/2013',
    name: 'Action Program Toward Realizing a Tourism Nation',
    focus: 'Inbound Stimulus & Japan Brand Promotion',
    highlights: [
      'Relaxed/waived visas for Southeast Asia (Thailand, Malaysia, Vietnam, Philippines, Indonesia).',
      'Expanded Open Skies aviation, consumption tax exemptions (Tax-free), multilingual signage, and MICE.',
    ],
  },
];

const CASE_STUDIES_EN = [
  {
    site: 'Historic Kyoto',
    prefecture: 'Kyoto Prefecture',
    type: 'Cultural Heritage (1994)',
    pressureMetric: '4.5M foreign visitors (2019) | Lodging shortage (53k rooms)',
    coreIssue:
      'Severe city bus congestion around Gion and Kinkakuji; residential apartment rentals causing noise; littering in Arashiyama.',
    intervention:
      'Installed real-time congestion live cameras; dispersed tourists to 6 peripheral zones; attracted luxury hotels (Park Hyatt, Aman).',
  },
  {
    site: 'Historic Nara',
    prefecture: 'Nara Prefecture',
    type: 'Cultural Heritage (1998)',
    pressureMetric: '3.318M foreign visitors (2019) | 2019 revenue dip',
    coreIssue:
      'Shortage of overnight hotels (day-tripper leakage); plastic litter from feeding sacred deer harming wildlife and farming.',
    intervention:
      'Launched hotel siting subsidies; opened JW Marriott and Fufu Nara; permitted converting cultural properties into lodging.',
  },
  {
    site: 'Mount Fuji (Fujisan)',
    prefecture: 'Yamanashi & Shizuoka',
    type: 'Cultural Heritage (2013)',
    pressureMetric: '5.06M visitors (2019, 2.2x vs 2012)',
    coreIssue:
      'Seasonal climbing congestion, hiker safety hazards, and waste accumulation along mountain trails.',
    intervention:
      'Established the Mt. Fuji Conservation Cooperation Fund (2014); opened the Mt. Fuji World Heritage Center with VR climbing (2017); proposed mountain rail.',
  },
  {
    site: 'Historic Villages of Shirakawa-go & Gokayama',
    prefecture: 'Gifu & Toyama',
    type: 'Cultural Heritage (1995)',
    pressureMetric: '1.8M visitors/yr per 600 residents (3,000:1)',
    coreIssue:
      'Exceeded infrastructure capacity during Winter Light-up nights; noise and waste disrupting local village life.',
    intervention:
      'Enforced 100% advance reservation for light-up events, raised entry fees, and capped parking and observation deck access.',
  },
  {
    site: 'Itsukushima Shrine (Miyajima Island)',
    prefecture: 'Hiroshima',
    type: 'Cultural Heritage (1996)',
    pressureMetric: '4.6M island visitors (2019)',
    coreIssue:
      'High visitor footfall straining historic wooden shrine structures and marine island sanitation.',
    intervention:
      'Introduced a 100 JPY/person Miyajima visitor tax to directly fund heritage preservation and environmental maintenance.',
  },
];

const LIMITATIONS_EN: Record<
  string,
  { category: string; severity: string; flawInThesis: string; portfolioFix: string }
> = {
  'LIM-01': {
    category: 'Proxy Metric Bias',
    severity: 'High',
    flawInThesis:
      'Japanese national statistics do not isolate a separate "heritage tourism" industry code. The thesis used total inbound arrivals and Kyoto/Nara figures as proxies.',
    portfolioFix:
      'Explicitly state proxy assumptions and incorporate the 2017 domestic vs. international visitor mix to separate true local load.',
  },
  'LIM-02': {
    category: 'Narrow Quantitative Coverage vs. Title',
    severity: 'High',
    flawInThesis:
      'The thesis title covers 25 UNESCO sites in Japan, but time-series charts in Section 3.1 focused only on Kyoto and Nara.',
    portfolioFix:
      'Expand quantitative hotspot metrics to Mt. Fuji (5.06M), Itsukushima (4.6M), and Shirakawa-go (1.8M).',
  },
  'LIM-03': {
    category: 'Uncontrolled Confounding Factors',
    severity: 'Medium',
    flawInThesis:
      'Attributed post-2013 growth directly to tourism policy without isolating Yen depreciation (Abenomics) and low-cost carrier expansion.',
    portfolioFix:
      'Add indexed growth (2013 = 100) comparing Kyoto/Nara against the national baseline and log-linear counterfactual modeling.',
  },
  'LIM-04': {
    category: 'Typographical & Year Errors in Original Text',
    severity: 'Corrected',
    flawInThesis:
      'Section 3.1.2 misstated that spending hit 4.81T Yen in 2020 (actually 2019; 2020 fell to 0.70T) and Chart 3.2 plotted Kyoto 2020 at 3,799k instead of 379.9k.',
    portfolioFix:
      'Corrected the 2019 peak label and fixed Kyoto 2020 directly in the data source to 379.9k visitors per DMO Kyoto.',
  },
  'LIM-05': {
    category: 'Reference Source Standardization',
    severity: 'Medium',
    flawInThesis:
      'The original bibliography included 4 Wikipedia links ([13], [14], [16], [19]) alongside government sources.',
    portfolioFix:
      'Standardized all quantitative series against primary JNTO, MLIT, JTA, UNWTO, and prefectural statistical reports.',
  },
};

export default function HeritageJapanProject({
  onBack,
  isEmbedded: _isEmbedded,
  initialData: _initialData,
}: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeSection, setActiveSection] = useState<string>('sec-macro-policy');
  const [selectedCodeIdx, setSelectedCodeIdx] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    trackVisitorAction(
      'Xem chi tiết dự án: Niên luận Du lịch Di sản Nhật Bản (Ma Văn Hùng)',
      'proj-heritage-japan',
      'project'
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(SECTION_IDS[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  const handleJumpToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ============================================================================
  // 1. SYNCHRONIZED TIME-SERIES WINDOWS ACROSS PAIRED CHARTS
  // ============================================================================
  // Pair 1 (Biểu đồ 1 & 2 - Toàn quốc): Đồng bộ 12 năm liên tục 2010–2021
  const synchronizedVisitors = useMemo(
    () =>
      HERITAGE_JAPAN_DATA.japanVisitors.filter(
        (d) => Number(d.year) >= 2010 && Number(d.year) <= 2021
      ),
    []
  );
  const synchronizedSpending = useMemo(
    () =>
      HERITAGE_JAPAN_DATA.japanSpending.filter(
        (d) => Number(d.year) >= 2010 && Number(d.year) <= 2021
      ),
    []
  );

  // Pair 2 (Biểu đồ 4 & 5 - Kyoto vs. Nara): Đồng bộ 12 năm liên tục 2009–2020
  const synchronizedKyotoVisitors = useMemo(
    () =>
      HERITAGE_JAPAN_DATA.kyotoVisitors.filter(
        (d) => Number(d.year) >= 2009 && Number(d.year) <= 2020
      ),
    []
  );
  const synchronizedNaraVisitors = useMemo(
    () =>
      HERITAGE_JAPAN_DATA.naraVisitors.filter(
        (d) => Number(d.year) >= 2009 && Number(d.year) <= 2020
      ),
    []
  );

  // Biểu đồ 6 (Chi tiêu Kyoto vs. Nara): Đồng bộ 7 năm liên tục 2014–2020
  const synchronizedRegionalSpendingYears = ['2014', '2015', '2016', '2017', '2018', '2019', '2020'];

  // ============================================================================
  // 2. QUANTITATIVE METRICS FROM heritageAnalytics.ts (20-YEAR BASELINE 2003-2022)
  // ============================================================================
  const quantStats = useMemo(() => {
    const prePolicyCagr = seriesCagr(HERITAGE_JAPAN_DATA.japanVisitors, '2003', '2012');
    const policyCagr = seriesCagr(HERITAGE_JAPAN_DATA.japanVisitors, '2013', '2019');
    const kyotoCagr = seriesCagr(HERITAGE_JAPAN_DATA.kyotoVisitors, '2013', '2019');
    const naraCagr = seriesCagr(HERITAGE_JAPAN_DATA.naraVisitors, '2013', '2019');

    const trendModel = logLinearTrend(HERITAGE_JAPAN_DATA.japanVisitors, '2003', '2012');
    const predicted2019 = trendModel.predict(2019);
    const surplus2019 = 31.9 - predicted2019;

    const pairedNat = joinOnYear(
      HERITAGE_JAPAN_DATA.japanVisitors,
      HERITAGE_JAPAN_DATA.japanSpending,
      '2010',
      '2021'
    );
    const corrNat = pearson(
      pairedNat.map((p) => p.a),
      pairedNat.map((p) => p.b)
    );

    const series20YrWithCounterfactual = HERITAGE_JAPAN_DATA.japanVisitors.map((pt) => {
      const yr = Number(pt.year);
      const cf = Number(trendModel.predict(yr).toFixed(1));
      return {
        year: pt.year,
        actual: pt.value,
        counterfactual: cf,
        surplus: yr >= 2013 && yr <= 2019 ? Number((pt.value - cf).toFixed(1)) : 0,
      };
    });

    return {
      prePolicyCagr,
      policyCagr,
      kyotoCagr,
      naraCagr,
      predicted2019,
      surplus2019,
      corrNat,
      series20YrWithCounterfactual,
    };
  }, []);

  const navItems = [
    {
      id: 'sec-macro-policy',
      labelVi: '1. Chính sách & Chuỗi 20 năm',
      labelEn: '1. Policy & 20-Yr Series',
    },
    {
      id: 'sec-kyoto-nara',
      labelVi: '2. Đối sánh Kyoto & Nara',
      labelEn: '2. Kyoto vs. Nara',
    },
    {
      id: 'sec-overtourism',
      labelVi: '3. Sức chứa & 5 Di sản',
      labelEn: '3. Capacity & 5 Sites',
    },
    {
      id: 'sec-data-audit',
      labelVi: '4. Data Audit & Phản biện',
      labelEn: '4. Data Audit & Critique',
    },
    {
      id: 'sec-sql-python',
      labelVi: '5. Mã nguồn SQL & Python',
      labelEn: '5. SQL & Python Code',
    },
  ];

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* HERO & KPI SUMMARY */}
      <header className="rounded-3xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-5 sm:p-8 border border-[#C8EEF7] dark:border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-[#FFE485]/45 border border-[#FFD14C] px-3 py-1.5 text-xs font-semibold text-amber-950 dark:bg-[#FFD14C]/15 dark:border-[#FFD14C]/40 dark:text-[#FFE485]">
            <GraduationCap className="w-4 h-4 shrink-0 text-amber-800 dark:text-[#FFD14C]" aria-hidden="true" />
            <span>
              {isEn
                ? `Quantitative Thesis Research · ${THESIS_METADATA.facultyVi}, VNU-USSH (${THESIS_METADATA.completionDate}) · Advisor: ${THESIS_METADATA.advisor}`
                : `Niên luận Nghiên cứu Định lượng · ${THESIS_METADATA.facultyVi}, ĐHKHXH&NV - ĐHQGHN (${THESIS_METADATA.completionDate}) · GVHD: ${THESIS_METADATA.advisor}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleJumpToSection('sec-data-audit')}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#C8EEF7]/45 hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-[#074553] border border-[#9BE7FA]/60 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span>{isEn ? 'Data Audit (5 Fixes)' : 'Kiểm toán Dữ liệu (5 Hiệu đính)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleJumpToSection('sec-sql-python')}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-slate-950 border border-[#0D7287]/20 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#074553]" aria-hidden="true" />
              <span>{isEn ? 'SQL & Python Model' : 'Mô hình SQL & Python'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 max-w-5xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight text-balance">
            {isEn ? (
              <>
                Quantitative Analysis of Japanese Heritage Tourism{' '}
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">(2013–2023)</span>: Policy
                Drivers & Overtourism Capacity
              </>
            ) : (
              <>
                Phân Tích Tăng Trưởng & Sức Chứa Du Lịch Di Sản Nhật Bản{' '}
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">(2013–2023)</span>: Từ Đòn Bẩy
                Chính Sách Đến Bài Toán Quá Tải
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {isEn
              ? 'Built on a 20-year empirical baseline (2003–2022) from JNTO and MLIT across 25 UNESCO World Heritage sites. Evaluates the June 2013 Action Program, log-linear counterfactual growth, the Nara day-tripper paradox, and local carrying capacity limits.'
              : 'Xây dựng trên nền chuỗi dữ liệu 20 năm (2003–2022) từ JNTO và MLIT tại 25 Di sản Thế giới UNESCO. Lượng hóa tác động của Chương trình Hành động 06/2013 qua mô hình đối chứng log-linear, giải mã nghịch lý khách đi trong ngày tại Nara và đánh giá sức chứa địa phương.'}
          </p>
        </div>

        {/* 4 BENTO KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {[
            {
              id: 'kpi-heritage-visitors',
              badge: { vi: 'QUY MÔ KHÁCH • 2013–2019', en: 'VISITOR VOLUME • 2013–2019' },
              badgeColor:
                'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
              title: {
                vi: 'Đỉnh Khách Quốc Tế Toàn Quốc (2019)',
                en: 'Peak International Visitors (2019)',
              },
              primaryValue: '31,9M',
              exactSubValue: {
                vi: `+206,7% vs 2013 (CAGR ${fmtPct(quantStats.policyCagr, 1, false)}/năm)`,
                en: `+206.7% vs 2013 (CAGR ${fmtPct(quantStats.policyCagr, 1, true)}/yr)`,
              },
              comparisonNote: {
                vi: 'Tăng gấp 3,8 lần so với mức nền 6–8,6 triệu lượt trước năm 2013 nhờ nới lỏng thị thực ASEAN và mở rộng hàng không.',
                en: 'Grew 3.8x over the pre-2013 baseline of 6–8.6M visitors following ASEAN visa waivers and Open Skies aviation.',
              },
            },
            {
              id: 'kpi-heritage-spending',
              badge: { vi: 'DOANH THU DU LỊCH • ĐỈNH 2019', en: 'TOURISM REVENUE • 2019 PEAK' },
              badgeColor:
                'bg-[#FFE485]/45 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
              title: {
                vi: 'Chi Tiêu Khách Quốc Tế Tại Nhật Bản',
                en: 'Inbound Tourist Expenditure in Japan',
              },
              primaryValue: isEn ? '¥4.81T' : '4,81 nghìn tỷ ¥',
              exactSubValue: {
                vi: `Tăng 3,41x vs 2013 (Tương quan r = ${fmtNum(quantStats.corrNat, 3, false)})`,
                en: `3.41x vs 2013 (Pearson r = ${fmtNum(quantStats.corrNat, 3, true)})`,
              },
              comparisonNote: {
                vi: 'Chiếm 11,5% tổng doanh thu toàn ngành du lịch Nhật Bản (41,94 nghìn tỷ ¥), thúc đẩy bởi chính sách miễn thuế tiêu dùng (Tax-free).',
                en: 'Accounted for 11.5% of total Japanese tourism revenue (¥41.94T), accelerated by nationwide duty-free retail expansion.',
              },
            },
            {
              id: 'kpi-heritage-gdp',
              badge: { vi: 'TỶ TRỌNG KINH TẾ • ĐÓNG GÓP GDP', en: 'ECONOMIC IMPACT • GDP SHARE' },
              badgeColor:
                'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
              title: {
                vi: 'Đóng Góp Kinh Tế Vĩ Mô & Việc Làm',
                en: 'Macroeconomic Contribution & Jobs',
              },
              primaryValue: '7,5% GDP',
              exactSubValue: {
                vi: '375,4 Tỷ USD · Hạng 3 Thế giới',
                en: '$375.4B USD · Ranked 3rd Globally',
              },
              comparisonNote: {
                vi: 'Tăng từ 2,2% GDP (2000), vượt Đức (344,8 tỷ USD) và duy trì hơn 4 triệu việc làm (6,9% tổng lực lượng lao động).',
                en: 'Rose from 2.2% GDP (2000), surpassing Germany ($344.8B) and sustaining over 4 million jobs (6.9% of total employment).',
              },
            },
            {
              id: 'kpi-heritage-overtourism',
              badge: { vi: 'SỨC CHỨA DI SẢN • OVERTOURISM', en: 'HERITAGE CAPACITY • OVERTOURISM' },
              badgeColor:
                'bg-[#FFE485]/45 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
              title: {
                vi: 'Tỷ Lệ Áp Lực Quá Tải Cục Bộ (UNESCO)',
                en: 'Peak Local Overtourism Ratio (UNESCO)',
              },
              primaryValue: '3.000 : 1',
              exactSubValue: {
                vi: '1,8M Khách / 600 Cư dân bản địa',
                en: '1.8M Visitors / 600 Local Residents',
              },
              comparisonNote: {
                vi: 'Ghi nhận tại làng cổ Shirakawa-go & Gokayama, buộc chính quyền áp dụng đặt chỗ trước 100% và giới hạn phương tiện.',
                en: 'Recorded at historic Shirakawa-go & Gokayama, prompting mandatory 100% advance booking and vehicle caps.',
              },
            },
          ].map((card) => {
            const lang = isEn ? 'en' : 'vi';
            return (
              <div
                key={card.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-xs tabular-nums font-bold border ${card.badgeColor}`}
                  >
                    {card.badge[lang]}
                  </span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">
                    {card.title[lang]}
                  </h2>
                  <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-950 dark:text-white tracking-tight">
                    {card.primaryValue}
                  </div>
                  <div className="text-xs sm:text-sm tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA] leading-snug">
                    {card.exactSubValue[lang]}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200/70 dark:border-slate-800">
                  {card.comparisonNote[lang]}
                </p>
              </div>
            );
          })}
        </div>
      </header>

      {/* STICKY NAVIGATION BAR */}
      <nav
        aria-label={isEn ? 'Heritage Japan Case Study Navigation' : 'Điều hướng dự án Du lịch Di sản'}
        className="sticky top-2 z-30 w-full rounded-2xl border border-[#C8EEF7] bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md p-2.5"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={handleBack}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Back' : 'Quay lại'}</span>
          </button>

          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleJumpToSection(item.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-[#9BE7FA] text-[#074553] border-[#0D7287]/30 dark:bg-[#9BE7FA] dark:text-slate-950'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-[#F0F9FB] hover:text-slate-900 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-white'
                }`}
              >
                {isEn ? item.labelEn : item.labelVi}
              </button>
            );
          })}
        </div>
      </nav>

      {/* =====================================================================
       * PHẦN 1: BỐI CẢNH CHÍNH SÁCH, KINH TẾ VĨ MÔ & MÔ HÌNH PHẢN THỰC TẾ
       * ===================================================================== */}
      <section id="sec-macro-policy" className="space-y-8 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-black tabular-nums">
              {isEn ? 'PART 1' : 'PHẦN 1'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              <span>
                {isEn
                  ? 'Policy Framework, Global Context & Macro Time-Series'
                  : 'Khung Chính sách, Bối cảnh Toàn cầu & Chuỗi Thời gian Vĩ mô'}
              </span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {isEn
              ? '1. The 2013 Policy Catalyst and National Inbound Acceleration'
              : '1. Đòn bẩy chính sách năm 2013 và cú hích du lịch quốc tế'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {isEn
              ? 'Examining Japan’s three legislative pillars (1950/2004, 2006/2008, and 06/2013), global heritage market share, and synchronized national arrival and expenditure trajectories.'
              : 'Phân tích 3 trụ cột luật pháp và chính sách (1950/2004, 2006/2008 và 06/2013), vị thế thị trường di sản toàn cầu và chuỗi dữ liệu đồng bộ giữa lượng khách và chi tiêu quốc tế.'}
          </p>
        </div>

        {/* 3 Trụ cột chính sách (Chương 2 Niên luận) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {(isEn ? POLICY_PILLARS_EN : HERITAGE_JAPAN_DATA.policyPillars).map((p, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full"
            >
              <div>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
                    {p.year} · {p.focus}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-3 text-slate-900 dark:text-white leading-snug">
                  {p.name}
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                  {p.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bối cảnh Thị trường Du lịch Di sản Toàn cầu (Mở đầu & Chương 1.2.5 Niên luận) */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isEn
                  ? 'Global Heritage Tourism Market & Japan’s Position (UNWTO & Grand View Research)'
                  : 'Quy mô Thị trường Du lịch Di sản Toàn cầu & Vị thế Nhật Bản (UNWTO & Grand View Research)'}
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FFE485]/50 text-amber-950 dark:bg-[#FFE485]/15 dark:text-[#FFE485]">
              {isEn
                ? 'UNWTO: 40% of global trips include heritage'
                : 'UNWTO: Di sản thu hút 40% khách du lịch toàn cầu'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {HERITAGE_JAPAN_DATA.globalBenchmarks.map((b, idx) => {
              const labelsEn = [
                'Global Heritage Tourism Market (2021)',
                'Projected Global Market (2030)',
                'Japan Total Tourism Economy (2019 · #3 Global)',
                'Germany Total Tourism Economy (2019 · #4 Global)',
              ];
              const unitsEn = [
                'Billion USD (Asia-Pacific holds ~40% share)',
                'Billion USD (CAGR 3.8%/yr, 2022–2030)',
                'Billion USD (¥41.94T total, ¥4.81T inbound)',
                'Billion USD (OECD/WTTC benchmark)',
              ];
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-1"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {isEn ? labelsEn[idx] : b.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold tabular-nums text-slate-950 dark:text-white">
                    ${fmtNum(b.value, idx < 2 ? 2 : 1, isEn)}B
                  </p>
                  <p className="text-xs text-[#074553] dark:text-[#9BE7FA] font-medium">
                    {isEn ? unitsEn[idx] : b.unit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CẶP BIỂU ĐỒ 1 & 2 ĐỒNG BỘ THỜI GIAN (2010–2021): KHÁCH QUỐC TẾ & CHI TIÊU QUỐC TẾ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* BIỂU ĐỒ 1: KHÁCH QUỐC TẾ ĐẾN NHẬT BẢN (2010–2021) */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Chart 1 (Aligned Window 2010–2021) · Unit: Million Visitors'
                    : 'Biểu đồ 1 (Khung đồng bộ 2010–2021) · Đơn vị: Triệu người'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  {isEn ? '2019 Peak: 31.9M' : 'Đỉnh 2019: 31,9M lượt'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {isEn
                  ? 'International Visitors to Japan (2010–2021)'
                  : 'Số lượng khách du lịch quốc tế đến Nhật Bản (2010–2021)'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />{' '}
                  {isEn ? 'Pre-2013 / COVID-19' : 'Trước 2013 / COVID-19'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" />{' '}
                  {isEn ? 'Growth 2013–2018' : 'Tăng trưởng 2013–2018'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" />{' '}
                  {isEn ? '2019 Peak' : 'Đỉnh 2019'}
                </span>
              </div>

              <div className="w-full">
                <div className="h-56 flex items-end gap-1 sm:gap-2 px-1 border-b-2 border-slate-200 dark:border-slate-700">
                  {synchronizedVisitors.map((d) => {
                    const barHeight = Math.max(Math.round((d.value / 34) * 160), 6);
                    const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2018;
                    const isPeak = d.year === '2019';
                    return (
                      <div
                        key={d.year}
                        className="flex-1 flex flex-col items-center justify-end h-full group"
                      >
                        <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200 mb-1.5 select-none">
                          {d.value}
                        </span>
                        <div
                          style={{ height: `${barHeight}px` }}
                          className={`w-full rounded-t-md transition-opacity duration-200 group-hover:opacity-90 ${
                            isPeak
                              ? 'bg-[#FFD14C]'
                              : isBoom
                              ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`${d.year}: ${d.value}M`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-1 sm:gap-2 px-1 pt-2.5">
                  {synchronizedVisitors.map((d) => (
                    <div key={d.year} className="flex-1 text-center">
                      <span
                        className={`text-xs font-semibold tabular-nums block truncate ${
                          d.year === '2019'
                            ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="hidden sm:inline">20</span>
                        {d.year.slice(-2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800">
              {isEn ? (
                <>
                  <strong>Observation:</strong> From 2010 to 2012, inbound volume fluctuated between
                  6.2M and 8.6M visitors/year. Following the June 2013 Action Program, arrivals grew
                  at a <strong>20.5% CAGR</strong> to reach 31.9M in 2019 before pandemic border
                  restrictions.
                </>
              ) : (
                <>
                  <strong>Nhận xét:</strong> Giai đoạn 2010–2012, lượng khách dao động ở mức 6,2 –
                  8,6 triệu lượt/năm. Sau Chương trình hành động 06/2013, lượng khách tăng trưởng kép{' '}
                  <strong>20,5%/năm</strong>, đạt đỉnh 31,9 triệu lượt năm 2019 trước khi đóng cửa
                  biên giới vì dịch COVID-19.
                </>
              )}
            </p>
          </div>

          {/* BIỂU ĐỒ 2: CHI TIÊU CỦA KHÁCH QUỐC TẾ (2010–2021) */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Chart 2 (Aligned Window 2010–2021) · Unit: Trillion Yen'
                    : 'Biểu đồ 2 (Khung đồng bộ 2010–2021) · Đơn vị: Nghìn tỷ Yên'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  {isEn ? '2019 Peak: ¥4.81T' : 'Đỉnh 2019: 4,81 nghìn tỷ ¥'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {isEn
                  ? 'International Tourist Spending in Japan (2010–2021)'
                  : 'Chi tiêu của khách du lịch quốc tế tại Nhật Bản (2010–2021)'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />{' '}
                  {isEn ? 'Pre-2013 / COVID-19' : 'Trước 2013 / COVID-19'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" />{' '}
                  {isEn ? 'Growth 2013–2018' : 'Tăng tốc 2013–2018'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" />{' '}
                  {isEn ? '2019 Peak' : 'Đỉnh 2019'}
                </span>
              </div>

              <div className="w-full">
                <div className="h-56 flex items-end gap-1 sm:gap-2 px-1 border-b-2 border-slate-200 dark:border-slate-700">
                  {synchronizedSpending.map((d) => {
                    const barHeight = Math.max(Math.round((d.value / 5.2) * 160), 6);
                    const isPeak = d.year === '2019';
                    const isBoom = Number(d.year) >= 2013 && Number(d.year) < 2019;
                    return (
                      <div
                        key={d.year}
                        className="flex-1 flex flex-col items-center justify-end h-full group"
                      >
                        <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200 mb-1.5 select-none">
                          {d.value}
                        </span>
                        <div
                          style={{ height: `${barHeight}px` }}
                          className={`w-full rounded-t-md transition-opacity duration-200 group-hover:opacity-90 ${
                            isPeak
                              ? 'bg-[#FFD14C]'
                              : isBoom
                              ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`${d.year}: ${d.value}T JPY`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-1 sm:gap-2 px-1 pt-2.5">
                  {synchronizedSpending.map((d) => (
                    <div key={d.year} className="flex-1 text-center">
                      <span
                        className={`text-xs font-semibold tabular-nums block truncate ${
                          d.year === '2019'
                            ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="hidden sm:inline">20</span>
                        {d.year.slice(-2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800">
              {isEn ? (
                <>
                  <strong>Observation:</strong> Inbound tourist expenditure grew{' '}
                  <strong>3.41x</strong> from ¥1.41T (2013) to ¥4.81T (2019), moving in lockstep
                  with arrival volume (Pearson correlation <strong>r = 0.982</strong> across
                  2010–2021).
                </>
              ) : (
                <>
                  <strong>Nhận xét:</strong> Chi tiêu tăng gấp <strong>3,41 lần</strong> từ 1,41
                  nghìn tỷ Yên (2013) lên đỉnh 4,81 nghìn tỷ Yên (2019), đồng pha chặt chẽ với lượng
                  khách quốc tế (hệ số tương quan Pearson <strong>r = 0,982</strong> giai đoạn
                  2010–2021).
                </>
              )}
            </p>
          </div>
        </div>

        {/* MÔ HÌNH ĐỐI CHỨNG LOG-LINEAR COUNTERFACTUAL TRÊN CHUỖI NỀN 20 NĂM (2003–2022) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn
                  ? 'Econometric Baseline (2003–2022) · Log-Linear Counterfactual Model'
                  : 'Chuỗi nền 20 năm (2003–2022) · Mô hình Đối chứng Log-Linear Counterfactual'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-slate-900 dark:text-white">
                {isEn
                  ? 'Actual Inbound Arrivals vs. Pre-2013 Log-Linear Trend Projection (2003–2022)'
                  : 'Đối sánh Thực tế (2003–2022) với Xu thế Phản thực tế nếu không có Cú hích 2013'}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tabular-nums">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {isEn
                  ? `2003–2012 CAGR: ${fmtPct(quantStats.prePolicyCagr, 1, true)}`
                  : `CAGR 2003–2012: ${fmtPct(quantStats.prePolicyCagr, 1, false)}`}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {isEn
                  ? `2013–2019 CAGR: +${fmtPct(quantStats.policyCagr, 1, true)}`
                  : `CAGR 2013–2019: +${fmtPct(quantStats.policyCagr, 1, false)}`}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFE485]/60 text-amber-950 dark:bg-[#FFE485]/15 dark:text-[#FFE485]">
                {isEn
                  ? `2019 Policy Surplus: +${fmtNum(quantStats.surplus2019, 1, true)}M`
                  : `Thặng dư 2019: +${fmtNum(quantStats.surplus2019, 1, false)}M khách`}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3 font-bold">
                    {isEn ? 'Metric / Year' : 'Chỉ số / Năm'}
                  </th>
                  {quantStats.series20YrWithCounterfactual
                    .filter((r) =>
                      ['2003', '2006', '2009', '2012', '2013', '2015', '2017', '2019', '2020', '2022'].includes(
                        r.year
                      )
                    )
                    .map((r) => (
                      <th key={r.year} className="py-2.5 px-2.5 font-extrabold text-right">
                        {r.year}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Actual Arrivals (M)' : 'Khách thực tế JNTO (Triệu)'}
                  </td>
                  {quantStats.series20YrWithCounterfactual
                    .filter((r) =>
                      ['2003', '2006', '2009', '2012', '2013', '2015', '2017', '2019', '2020', '2022'].includes(
                        r.year
                      )
                    )
                    .map((r) => (
                      <td
                        key={r.year}
                        className={`py-2.5 px-2.5 text-right font-bold ${
                          r.year === '2019'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {fmtNum(r.actual, 1, isEn)}
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-500 dark:text-slate-400">
                    {isEn ? 'Log-Linear Baseline (M)' : 'Dự phóng xu thế cũ 2003–2012 (Triệu)'}
                  </td>
                  {quantStats.series20YrWithCounterfactual
                    .filter((r) =>
                      ['2003', '2006', '2009', '2012', '2013', '2015', '2017', '2019', '2020', '2022'].includes(
                        r.year
                      )
                    )
                    .map((r) => (
                      <td
                        key={r.year}
                        className="py-2.5 px-2.5 text-right text-slate-500 dark:text-slate-400"
                      >
                        {fmtNum(r.counterfactual, 1, isEn)}
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-[#074553] dark:text-[#9BE7FA]">
                    {isEn ? 'Net Policy Surplus (M)' : 'Chênh lệch so với xu thế cũ (Triệu)'}
                  </td>
                  {quantStats.series20YrWithCounterfactual
                    .filter((r) =>
                      ['2003', '2006', '2009', '2012', '2013', '2015', '2017', '2019', '2020', '2022'].includes(
                        r.year
                      )
                    )
                    .map((r) => {
                      const diff = r.actual - r.counterfactual;
                      return (
                        <td
                          key={r.year}
                          className={`py-2.5 px-2.5 text-right font-bold ${
                            diff > 1
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : diff < -1
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {diff > 0 ? `+${fmtNum(diff, 1, isEn)}` : fmtNum(diff, 1, isEn)}
                        </td>
                      );
                    })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BIỂU ĐỒ 3: CHỈ SỐ HÓA TỐC ĐỘ BỨT PHÁ ĐỒNG BỘ LIÊN TỤC 2013–2019 (MỐC 2013 = 100) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn
                  ? 'Chart 3 (Continuous Window 2013–2019) · Indexed Growth (2013 = 100)'
                  : 'Biểu đồ 3 (Chuỗi liên tục 2013–2019) · Chỉ số hóa tốc độ tăng trưởng (Mốc 2013 = 100)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-slate-900 dark:text-white">
                {isEn
                  ? 'Relative Inbound Acceleration: National vs. Historic Kyoto vs. Historic Nara (2013–2019)'
                  : 'Tốc độ bứt phá tương đối: Toàn quốc vs. Cố đô Kyoto vs. Cố đô Nara (2013–2019)'}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-500" />{' '}
                {isEn ? 'National' : 'Toàn quốc'}
              </span>
              <span className="flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                <span className="w-3 h-3 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />{' '}
                {isEn ? 'Kyoto' : 'Cố đô Kyoto'}
              </span>
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-[#FFE485]">
                <span className="w-3 h-3 rounded-full bg-[#FFD14C]" />{' '}
                {isEn ? 'Nara' : 'Cố đô Nara'}
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {HERITAGE_JAPAN_DATA.indexedGrowth2013To2019.map((row) => (
              <div
                key={row.year}
                className="space-y-2 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm font-medium gap-2 tabular-nums">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {isEn ? `Year ${row.year}` : `Năm ${row.year}`}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 text-xs">
                    {isEn ? 'National' : 'Toàn Nhật'}:{' '}
                    <b className="text-slate-900 dark:text-white">{row.japan}</b> | Kyoto:{' '}
                    <b className="text-[#0D7287] dark:text-[#9BE7FA]">{row.kyoto}</b> | Nara:{' '}
                    <b className="text-amber-700 dark:text-[#FFE485] font-bold">{row.nara}</b>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 tabular-nums">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{isEn ? 'National' : 'Toàn quốc'}</span>
                      <span className="font-bold">{row.japan}</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-slate-500 h-full rounded-full"
                        style={{ width: `${Math.max((row.japan / 800) * 100, 6)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#074553] dark:text-[#9BE7FA]">
                      <span>{isEn ? 'Kyoto' : 'Cố đô Kyoto'}</span>
                      <span className="font-bold">{row.kyoto}</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#0D7287] dark:bg-[#9BE7FA] h-full rounded-full"
                        style={{ width: `${Math.max((row.kyoto / 800) * 100, 6)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-700 dark:text-[#FFE485]">
                      <span>{isEn ? 'Nara' : 'Cố đô Nara'}</span>
                      <span className="font-bold">{row.nara}</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#FFD14C] h-full rounded-full"
                        style={{ width: `${Math.max((row.nara / 800) * 100, 6)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">
              {isEn ? 'Core Finding: ' : 'Phát hiện cốt lõi: '}
            </strong>
            {isEn ? (
              <>
                From 2013 to 2019, national arrivals grew 3.07x (index 306.7, CAGR{' '}
                {fmtPct(quantStats.policyCagr, 1, true)}), whereas Historic Kyoto expanded{' '}
                <strong>5.33x (index 533.0, CAGR {fmtPct(quantStats.kyotoCagr, 1, true)})</strong>{' '}
                and Historic Nara surged{' '}
                <strong>7.63x (index 762.8, CAGR {fmtPct(quantStats.naraCagr, 1, true)})</strong>.
                UNESCO heritage capitals absorbed foreign demand at nearly 2.5x the national rate.
              </>
            ) : (
              <>
                Giai đoạn 2013–2019, khách quốc tế toàn Nhật tăng 3,07 lần (chỉ số 306,7; CAGR{' '}
                {fmtPct(quantStats.policyCagr, 1, false)}), trong khi Kyoto tăng{' '}
                <strong>5,33 lần (chỉ số 533,0; CAGR {fmtPct(quantStats.kyotoCagr, 1, false)})</strong>{' '}
                và Nara tăng{' '}
                <strong>7,63 lần (chỉ số 762,8; CAGR {fmtPct(quantStats.naraCagr, 1, false)})</strong>.
                Các đô thị di sản UNESCO hút khách quốc tế nhanh gấp gần 2,5 lần trung bình toàn
                quốc.
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 2: THỐNG KÊ TẠI CỐ ĐÔ KYOTO & CỐ ĐÔ NARA (ĐỒNG BỘ THỜI GIAN)
       * ===================================================================== */}
      <section id="sec-kyoto-nara" className="space-y-8 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-black tabular-nums">
              {isEn ? 'PART 2' : 'PHẦN 2'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>
                {isEn
                  ? 'UNESCO Destination Comparison (Synchronized Horizons)'
                  : 'Đối sánh Điểm đến Di sản UNESCO (Khung thời gian đồng bộ)'}
              </span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {isEn
              ? '2. Inbound Volume (2009–2020) and Expenditure Divergence (2014–2020) in Kyoto & Nara'
              : '2. Lượng khách quốc tế (2009–2020) và phân kỳ chi tiêu (2014–2020) tại Kyoto & Nara'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {isEn
              ? 'Synchronized side-by-side comparison on a unified Y-axis scale (with Kyoto 2020 corrected at source to 379.9k) and structural diagnosis of Nara’s day-tripper revenue leakage.'
              : 'Đối chiếu song song trên cùng khung thời gian 2009–2020 và cùng thang đo trục Y (đã hiệu đính số liệu Kyoto 2020 tại nguồn về 379,9 nghìn người), giải mã hiện tượng khách đi về trong ngày tại Nara.'}
          </p>
        </div>

        {/* CẶP BIỂU ĐỒ 4 & 5 ĐỒNG BỘ 2009–2020: KYOTO VS NARA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* BIỂU ĐỒ 4: KHÁCH ĐẾN CỐ ĐÔ KYOTO (2009–2020) */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Chart 4 (Aligned Window 2009–2020) · Unit: Thousand Visitors'
                    : 'Biểu đồ 4 (Khung đồng bộ 2009–2020) · Đơn vị: Nghìn người'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  {isEn ? '2019 Peak: 4,503.3k' : 'Đỉnh 2019: 4.503,3 nghìn'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {isEn
                  ? 'International Visitors to Historic Kyoto (2009–2020)'
                  : 'Khách du lịch quốc tế đến Cố đô Kyoto (2009–2020)'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />{' '}
                  {isEn ? 'Pre-2013 / COVID-19' : 'Trước 2013 / COVID-19'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" />{' '}
                  {isEn ? 'Growth 2013–2018' : 'Tăng tốc 2013–2018'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" />{' '}
                  {isEn ? '2019 Peak' : 'Đỉnh 2019'}
                </span>
              </div>

              <div className="w-full pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                  <span className="font-medium">
                    {isEn ? 'Y-Axis Scale (Thousand)' : 'Thang đo trục Y (Nghìn người)'}
                  </span>
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/15 px-2 py-0.5 rounded-md">
                    {isEn ? 'Shared Scale: 1,000k = 36px' : 'Thang chuẩn chung: 1.000 nghìn = 36px'}
                  </span>
                </div>

                <div className="relative w-full">
                  <div className="absolute inset-0 pointer-events-none z-0" data-ui="chart-grid">
                    {[4000, 3000, 2000, 1000].map((lvl) => (
                      <div
                        key={lvl}
                        data-ui="chart-gridline"
                        className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1"
                        style={{ bottom: `${(lvl / 1000) * 36}px` }}
                      >
                        <span className="text-xs tabular-nums font-semibold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">
                          {lvl.toLocaleString(isEn ? 'en-US' : 'vi-VN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-60 flex items-end gap-1 sm:gap-1.5 px-1 border-b-2 border-slate-200 dark:border-slate-700 relative z-10">
                    {synchronizedKyotoVisitors.map((d) => {
                      const barHeight = Math.max(Math.round((d.value / 5000) * 180), 4);
                      const isPeak = d.year === '2019';
                      const isBoom = Number(d.year) >= 2013 && Number(d.year) < 2019;
                      return (
                        <div
                          key={d.year}
                          className="flex-1 flex flex-col items-center justify-end h-full group min-w-0"
                        >
                          <span
                            className={`text-xs font-bold mb-1 select-none tabular-nums truncate max-w-full ${
                              isPeak
                                ? 'text-[#92400E] dark:text-[#FFD14C] font-extrabold'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {Math.round(d.value)}
                          </span>
                          <div
                            style={{ height: `${barHeight}px` }}
                            className={`w-full max-w-[24px] rounded-t-md transition-opacity duration-200 group-hover:opacity-90 ${
                              isPeak
                                ? 'bg-[#FFD14C]'
                                : isBoom
                                ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${d.year}: ${d.value}k`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-1 sm:gap-1.5 px-1 pt-2">
                    {synchronizedKyotoVisitors.map((d) => (
                      <div key={d.year} className="flex-1 text-center min-w-0">
                        <span
                          className={`text-xs font-semibold tabular-nums block truncate ${
                            d.year === '2019'
                              ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {d.year.slice(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800">
              {isEn ? (
                <>
                  <strong>Observation:</strong> Kyoto foreign overnight arrivals rose from 844.9k
                  (2013) to a peak of 4,503.3k (2019), expanding <strong>5.33x</strong> in 6 years
                  before dropping to 379.9k in 2020 during pandemic lockdowns.
                </>
              ) : (
                <>
                  <strong>Nhận xét:</strong> Khách quốc tế đến Kyoto tăng từ 844,9 nghìn (2013) lên
                  đỉnh 4.503,3 nghìn lượt (2019), gấp <strong>5,33 lần</strong> sau 6 năm trước khi
                  giảm về mức 379,9 nghìn lượt năm 2020 do đại dịch.
                </>
              )}
            </p>
          </div>

          {/* BIỂU ĐỒ 5: KHÁCH ĐẾN CỐ ĐÔ NARA (2009–2020) */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Chart 5 (Aligned Window 2009–2020) · Unit: Thousand Visitors'
                    : 'Biểu đồ 5 (Khung đồng bộ 2009–2020) · Đơn vị: Nghìn người'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  {isEn ? '2019 Peak: 3,318k' : 'Đỉnh 2019: 3.318 nghìn'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {isEn
                  ? 'International Visitors to Historic Nara (2009–2020)'
                  : 'Khách du lịch quốc tế đến Cố đô Nara (2009–2020)'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />{' '}
                  {isEn ? 'Pre-2013 / COVID-19' : 'Trước 2013 / COVID-19'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" />{' '}
                  {isEn ? 'Growth 2013–2018' : 'Tăng tốc 2013–2018'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" />{' '}
                  {isEn ? '2019 Peak' : 'Đỉnh 2019'}
                </span>
              </div>

              <div className="w-full pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                  <span className="font-medium">
                    {isEn ? 'Y-Axis Scale (Thousand)' : 'Thang đo trục Y (Nghìn người)'}
                  </span>
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/15 px-2 py-0.5 rounded-md">
                    {isEn ? 'Shared Scale: 1,000k = 36px' : 'Thang chuẩn chung: 1.000 nghìn = 36px'}
                  </span>
                </div>

                <div className="relative w-full">
                  <div className="absolute inset-0 pointer-events-none z-0" data-ui="chart-grid">
                    {[4000, 3000, 2000, 1000].map((lvl) => (
                      <div
                        key={lvl}
                        data-ui="chart-gridline"
                        className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1"
                        style={{ bottom: `${(lvl / 1000) * 36}px` }}
                      >
                        <span className="text-xs tabular-nums font-semibold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">
                          {lvl.toLocaleString(isEn ? 'en-US' : 'vi-VN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-60 flex items-end gap-1 sm:gap-1.5 px-1 border-b-2 border-slate-200 dark:border-slate-700 relative z-10">
                    {synchronizedNaraVisitors.map((d) => {
                      const barHeight = Math.max(Math.round((d.value / 5000) * 180), 4);
                      const isPeak = d.year === '2019';
                      const isBoom = Number(d.year) >= 2013 && Number(d.year) < 2019;
                      return (
                        <div
                          key={d.year}
                          className="flex-1 flex flex-col items-center justify-end h-full group min-w-0"
                        >
                          <span
                            className={`text-xs font-bold mb-1 select-none tabular-nums truncate max-w-full ${
                              isPeak
                                ? 'text-[#92400E] dark:text-[#FFD14C] font-extrabold'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {Math.round(d.value)}
                          </span>
                          <div
                            style={{ height: `${barHeight}px` }}
                            className={`w-full max-w-[24px] rounded-t-md transition-opacity duration-200 group-hover:opacity-90 ${
                              isPeak
                                ? 'bg-[#FFD14C]'
                                : isBoom
                                ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${d.year}: ${d.value}k`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-1 sm:gap-1.5 px-1 pt-2">
                    {synchronizedNaraVisitors.map((d) => (
                      <div key={d.year} className="flex-1 text-center min-w-0">
                        <span
                          className={`text-xs font-semibold tabular-nums block truncate ${
                            d.year === '2019'
                              ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {d.year.slice(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800">
              {isEn ? (
                <>
                  <strong>Observation:</strong> Starting from 435k visitors in 2013, Nara sustained
                  40–60% annual growth to reach <strong>3,318k visitors</strong> in 2019 (a{' '}
                  <strong>7.63x</strong> increase) before falling 99.1% to 28.9k in 2020.
                </>
              ) : (
                <>
                  <strong>Nhận xét:</strong> Từ mức 435 nghìn khách (2013), Nara duy trì đà tăng
                  trưởng 40–60%/năm và đạt đỉnh <strong>3.318 nghìn lượt</strong> vào năm 2019 (tăng
                  gấp <strong>7,63 lần</strong>) trước khi giảm 99,1% còn 28,9 nghìn năm 2020.
                </>
              )}
            </p>
          </div>
        </div>

        {/* BIỂU ĐỒ 6: SO SÁNH CHI TIÊU DU LỊCH KYOTO VS NARA ĐỒNG BỘ LIÊN TỤC 2014–2020 */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn
                  ? 'Chart 6 (Aligned Window 2014–2020) · Unit: Billion Yen (Nara: see unit audit)'
                  : 'Biểu đồ 6 (Khung đồng bộ liên tục 2014–2020) · Đơn vị: Tỷ Yên (Nara: xem kiểm định đơn vị)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-slate-900 dark:text-white">
                {isEn
                  ? 'Tourism Expenditure Comparison: Historic Kyoto vs. Historic Nara (2014–2020)'
                  : 'So sánh Chi tiêu Du lịch giữa Cố đô Kyoto và Cố đô Nara (2014–2020)'}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                <span className="w-3 h-3 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />{' '}
                {isEn ? 'Kyoto' : 'Cố đô Kyoto'}
              </span>
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-[#FFE485]">
                <span className="w-3 h-3 rounded-full bg-[#FFD14C]" />{' '}
                {isEn ? 'Nara' : 'Cố đô Nara'}
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {synchronizedRegionalSpendingYears.map((yr) => {
              const kVal =
                HERITAGE_JAPAN_DATA.kyotoSpending.find((x) => x.year === yr)?.value || 0;
              const nVal =
                HERITAGE_JAPAN_DATA.naraSpending.find((x) => x.year === yr)?.value || 0;
              return (
                <div
                  key={yr}
                  className="space-y-2 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 tabular-nums"
                >
                  <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm font-medium gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {isEn ? `Year ${yr}` : `Năm ${yr}`}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 text-xs">
                      Kyoto:{' '}
                      <b className="text-[#0D7287] dark:text-[#9BE7FA]">
                        {fmtNum(kVal, 1, isEn)} {isEn ? 'B ¥' : 'tỷ ¥'}
                      </b>{' '}
                      | Nara:{' '}
                      <b className="text-amber-700 dark:text-[#FFE485] font-bold">
                        {fmtNum(nVal, 1, isEn)} {isEn ? 'B ¥' : 'tỷ ¥'}
                      </b>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#074553] dark:text-[#9BE7FA]">
                        <span>Kyoto</span>
                        <span className="font-bold">
                          {fmtNum(kVal, 1, isEn)} {isEn ? 'B ¥' : 'tỷ ¥'}
                        </span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full"
                          style={{ width: `${Math.max((kVal / 1400) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-amber-700 dark:text-[#FFE485]">
                        <span>Nara</span>
                        <span className="font-bold">
                          {fmtNum(nVal, 1, isEn)} {isEn ? 'B ¥' : 'tỷ ¥'}
                        </span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-[#FFD14C] rounded-full"
                          style={{ width: `${Math.max((nVal / 1400) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">
              {isEn
                ? '2019 Expenditure Divergence in Nara (Day-Tripper Paradox): '
                : 'Nghịch lý phân bổ chi tiêu năm 2019 tại Nara (Hiệu ứng khách đi trong ngày): '}
            </strong>
            {isEn ? (
              <>
                Although foreign arrivals to Nara jumped <strong>+25.1%</strong> in 2019 (from
                2,651k to 3,318k), local tourism revenue fell <strong>-5.0%</strong> (from 1,208 to
                1,147.2). Because Nara is 45 minutes by train from Kyoto and Osaka, over 85% of
                visitors came as day-trippers without staying overnight, leaving Nara with crowding
                and waste costs while lodging revenue accrued to Osaka and Kyoto.
              </>
            ) : (
              <>
                Dù lượng khách quốc tế đến Nara năm 2019 tăng <strong>+25,1%</strong> (từ 2.651
                nghìn lên đỉnh 3.318 nghìn lượt), tổng thu du lịch tại Nara lại giảm{' '}
                <strong>-5,0%</strong> (từ 1.208 xuống 1.147,2). Do Nara chỉ cách Kyoto và Osaka 45
                phút đi tàu, phần lớn du khách chỉ ghé thăm trong ngày rồi quay về ngủ tại khách sạn
                ở Kyoto/Osaka, khiến Nara chịu áp lực hạ tầng nhưng thất thu dịch vụ lưu trú.
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 3: QUÁ TẢI DU LỊCH, CƠ CẤU KHÁCH NỘI ĐỊA/QUỐC TẾ & 5 CASE STUDIES
       * ===================================================================== */}
      <section id="sec-overtourism" className="space-y-8 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-black tabular-nums">
              {isEn ? 'PART 3' : 'PHẦN 3'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              <span>
                {isEn
                  ? 'Carrying Capacity, Domestic vs. Inbound Mix & 5 UNESCO Case Studies'
                  : 'Sức chứa Điểm đến, Cơ cấu Nội địa/Quốc tế & 5 Nghiên cứu Trường hợp'}
              </span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {isEn
              ? '3. Infrastructure Bottlenecks and Governance Matrix Across 5 World Heritage Sites'
              : '3. Hệ lụy quá tải hạ tầng và ma trận điều tiết tại 5 Di sản Thế giới'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {isEn
              ? 'Combining domestic and international footfall (2017 benchmark), hotel room deficits in Kyoto (2014 vs. 2019), and policy interventions across 5 UNESCO hotspots.'
              : 'Kết hợp tổng tải khách nội địa và quốc tế (mốc khảo sát 2017 trang 4 niên luận), độ lệch cung cầu phòng lưu trú Kyoto (2014 vs 2019) và giải pháp quản trị tại 5 điểm nóng UNESCO.'}
          </p>
        </div>

        {/* CƠ CẤU KHÁCH NỘI ĐỊA VS QUỐC TẾ NĂM 2017 (TỪ MỞ ĐẦU MỤC 4.2 NIÊN LUẬN) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <div>
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] block">
                  {isEn
                    ? 'Thesis Section 4.2 Benchmark (2017) · Domestic vs. International Footfall'
                    : 'Số liệu Mở đầu Mục 4.2 Niên luận (2017) · Cơ cấu Khách Nội địa vs. Quốc tế'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {isEn
                    ? 'Total Physical Load at Top 3 UNESCO Heritage Destinations (Million Visitors, 2017)'
                    : 'Tổng tải lượng du khách thực tế tại 3 điểm di sản hàng đầu (Triệu lượt, 2017)'}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tabular-nums">
            {HERITAGE_JAPAN_DATA.visitorMix2017.map((item, idx) => {
              const total = Number((item.domestic + item.international).toFixed(2));
              const siteNamesEn = ['Historic Kyoto', 'Historic Nara', 'Mount Fuji (Fujisan)'];
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {isEn ? siteNamesEn[idx] : item.site}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
                      {isEn
                        ? `${fmtNum(item.intlShare, 1, true)}% Inbound`
                        : `${fmtNum(item.intlShare, 1, false)}% Quốc tế`}
                    </span>
                  </div>

                  <div className="text-2xl font-extrabold text-slate-950 dark:text-white">
                    {fmtNum(total, 2, isEn)}M{' '}
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isEn ? 'total visits' : 'tổng lượt khách'}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#0D7287] dark:bg-[#9BE7FA]"
                      style={{ width: `${100 - item.intlShare}%` }}
                      title={isEn ? 'Domestic' : 'Nội địa'}
                    />
                    <div
                      className="h-full bg-[#FFD14C]"
                      style={{ width: `${item.intlShare}%` }}
                      title={isEn ? 'International' : 'Quốc tế'}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span>
                      {isEn ? 'Domestic: ' : 'Nội địa: '}
                      <strong className="text-slate-900 dark:text-white">
                        {fmtNum(item.domestic, 2, isEn)}M
                      </strong>
                    </span>
                    <span>
                      {isEn ? 'Inbound: ' : 'Quốc tế: '}
                      <strong className="text-[#074553] dark:text-[#FFE485]">
                        {fmtNum(item.international, 2, isEn)}M
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BIỂU ĐỒ 7 & 8 (2 CỘT): CUNG - CẦU PHÒNG KYOTO & QUY MÔ ĐIỂM NÓNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BIỂU ĐỒ 7: ĐỘ LỆCH CUNG CẦU PHÒNG & KINH TẾ KYOTO */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn
                  ? 'Chart 7 · Kyoto Lodging Bottleneck & Municipal Contribution (2014 vs. 2019)'
                  : 'Biểu đồ 7 · Nút thắt lưu trú & Đóng góp Kinh tế Kyoto (2014 vs. 2019)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-slate-900 dark:text-white">
                {isEn
                  ? 'Hotel Room Supply-Demand Mismatch & Municipal Economic Share'
                  : 'Độ lệch Cung : Cầu Phòng Khách sạn & Tỷ trọng Kinh tế TP. Kyoto'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 tabular-nums">
              <div className="p-4 rounded-xl bg-[#C8EEF7]/30 border border-[#9BE7FA]/40">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {isEn ? 'Kyoto Foreign Arrivals (2014 → 2019)' : 'Khách quốc tế đến Kyoto (2014 → 2019)'}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                  1,13M → 4,50M
                </p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {isEn ? '+298% surge (4.0x in 5 years)' : 'Tăng +298% (Gấp 4 lần sau 5 năm)'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFE485]/30 border border-[#FFD14C]/40">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {isEn ? 'Hotel Room Supply (2014 → 2019)' : 'Nguồn cung phòng khách sạn (2014 → 2019)'}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                  &lt;30.000 → 53.000
                </p>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
                  {isEn
                    ? '+76.7% growth (Spillover into residential flats)'
                    : 'Chỉ tăng +76,7% (Tràn sang căn hộ dân sinh)'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1 tabular-nums">
              {HERITAGE_JAPAN_DATA.economicShareComparison.slice(3).map((item, i) => {
                const metricsEn = [
                  'Kyoto Municipal GDP Share (2014)',
                  'Kyoto Municipal GDP Share (2019)',
                  'Kyoto Municipal Tax Share (¥39B, 2019)',
                  'Kyoto Employment Share (153,000 jobs, 2019)',
                ];
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {isEn ? metricsEn[i] : item.metric}
                      </span>
                      <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                        {fmtNum(item.share, 1, isEn)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full"
                        style={{ width: `${Math.max((item.share / 15) * 100, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BIỂU ĐỒ 8: ÁP LỰC TẠI 5 ĐIỂM NÓNG DI SẢN */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn
                  ? 'Chart 8 · Overtourism Intensity at Sensitive UNESCO Sites (2019)'
                  : 'Biểu đồ 8 · Cường độ quá tải tại 5 Di sản nhạy cảm (2019)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1 mb-5 text-slate-900 dark:text-white">
                {isEn
                  ? 'Annual Visitor Volume Across 5 Overtourism Hotspots (Million Visitors)'
                  : 'Quy mô khách tại 5 điểm nóng Overtourism (Triệu lượt)'}
              </h3>

              <div className="space-y-4 tabular-nums">
                {HERITAGE_JAPAN_DATA.overtourismHotspots.map((h, i) => {
                  const sitesEn = [
                    'Mount Fuji (2019 vs. 2012: 2.2x surge)',
                    'Miyajima Island - Itsukushima Shrine (2019)',
                    'Historic Kyoto - Foreign Overnight Visitors (2019)',
                    'Historic Nara - Foreign Visitors (2019)',
                    'Historic Shirakawa-go Village (Only 600 residents)',
                  ];
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {isEn ? sitesEn[i] : h.site}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {fmtNum(h.visitorsMillion, 2, isEn)} {isEn ? 'M' : 'triệu lượt'}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD14C] rounded-full"
                          style={{ width: `${Math.max((h.visitorsMillion / 5.5) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3 border-t border-slate-100 dark:border-slate-800">
              {isEn ? (
                <>
                  At Shirakawa-go village, 1.8 million annual visitors represent{' '}
                  <strong>3,000x</strong> the local population (~600 residents), requiring strict
                  advance reservation quotas during winter light-up nights.
                </>
              ) : (
                <>
                  Tại làng cổ Shirakawa-go, lượng khách 1,8 triệu người/năm gấp{' '}
                  <strong>3.000 lần</strong> quy mô dân số bản địa (~600 người), buộc chính quyền
                  phải áp dụng đặt chỗ trước 100% trong dịp lễ hội ánh sáng mùa đông.
                </>
              )}
            </p>
          </div>
        </div>

        {/* BẢNG MA TRẬN 5 CASE STUDIES (CHƯƠNG 3.2 NIÊN LUẬN) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isEn
                ? 'Governance & Conservation Matrix Across 5 UNESCO World Heritage Sites (Section 3.2)'
                : 'Tổng hợp Giải pháp Quản trị & Bảo tồn tại 5 Di sản Thế giới (Chương 3.2 Niên luận)'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs uppercase">
                <tr>
                  <th className="p-4">{isEn ? 'Heritage Site & Prefecture' : 'Di sản & Địa phương'}</th>
                  <th className="p-4">{isEn ? 'Quantitative Pressure' : 'Áp lực Dữ liệu'}</th>
                  <th className="p-4">{isEn ? 'Observed Impacts' : 'Vấn đề Phát sinh'}</th>
                  <th className="p-4">{isEn ? 'Policy Intervention' : 'Can thiệp Chính sách'}</th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-slate-50/70 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
                {(isEn ? CASE_STUDIES_EN : HERITAGE_JAPAN_DATA.caseStudies).map((cs, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <td className="p-4 font-bold whitespace-nowrap align-top">
                      <div className="text-sm text-slate-900 dark:text-white">{cs.site}</div>
                      <div className="text-xs font-normal text-slate-500 mt-0.5">
                        {cs.prefecture} · {cs.type}
                      </div>
                    </td>
                    <td className="p-4 font-bold tabular-nums text-slate-950 dark:text-white align-top">
                      {cs.pressureMetric}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 leading-relaxed max-w-md align-top">
                      {cs.coreIssue}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-200 leading-relaxed max-w-md align-top">
                      {cs.intervention}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 4: DATA AUDIT & PHẢN BIỆN HỌC THUẬT (5 HIỆU ĐÍNH TỪ NIÊN LUẬN GỐC)
       * ===================================================================== */}
      <section
        id="sec-data-audit"
        className="rounded-3xl p-6 sm:p-8 bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 space-y-6 scroll-mt-24"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-black tabular-nums">
                {isEn ? 'PART 4' : 'PHẦN 4'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isEn ? 'Data Audit & Methodological Critique' : 'Data Audit & Phản biện Học thuật'}
                </span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {isEn
                ? '4. Auditing and Correcting 5 Limitations in the Original 2024 Thesis'
                : '4. Kiểm toán và hiệu đính 5 thiếu sót từ bài niên luận gốc (01/2024)'}
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] text-xs font-bold border border-[#9BE7FA]/40">
            {isEn ? '5 Methodological & Data Fixes' : '5 Giới hạn Phương pháp luận & Dữ liệu'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          {isEn
            ? 'The original thesis was written in late 2023 – January 2024 from a Japanese Studies perspective. When rebuilding the study for this Data Analytics portfolio, I audited the underlying tables and corrected five methodological and data issues directly at the source:'
            : 'Bài niên luận gốc được thực hiện vào cuối năm 2023 – tháng 01/2024 dưới góc độ Nhật Bản học. Khi chuẩn hóa công trình này sang hồ sơ Data Analytics, mình kiểm toán lại toàn bộ các bảng số liệu và hiệu đính trực tiếp 5 điểm hạn chế:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HERITAGE_JAPAN_DATA.thesisLimitations.map((item) => {
            const enItem = LIMITATIONS_EN[item.id];
            const category = isEn && enItem ? enItem.category : item.category;
            const severity = isEn && enItem ? enItem.severity : item.severity;
            const flaw = isEn && enItem ? enItem.flawInThesis : item.flawInThesis;
            const fix = isEn && enItem ? enItem.portfolioFix : item.portfolioFix;

            return (
              <div
                key={item.id}
                className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    {item.id} · {category}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${
                      item.severity === 'Cao'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                        : item.severity === 'Đã hiệu đính'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-[#FFE485]/50 text-amber-950 dark:bg-[#FFD14C]/15 dark:text-[#FFE485]'
                    }`}
                  >
                    {severity}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    {isEn ? 'Original thesis flaw: ' : 'Hạn chế trong niên luận: '}
                  </strong>
                  {flaw}
                </p>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed">
                  <strong className="text-[#0D7287] dark:text-[#9BE7FA]">
                    {isEn ? 'Source & Portfolio Fix: ' : 'Hiệu đính tại nguồn & Portfolio: '}
                  </strong>
                  {fix}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 5: MÃ NGUỒN SQL & PYTHON TÁI LẬP PHÂN TÍCH
       * ===================================================================== */}
      <section
        id="sec-sql-python"
        className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 scroll-mt-24"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <Code2 className="w-4 h-4" aria-hidden="true" />
              <span>
                {isEn
                  ? 'PART 5 · REPRODUCIBLE SQL & PYTHON PIPELINE'
                  : 'PHẦN 5 · TRUY VẤN SQL & MÔ HÌNH PYTHON TÁI LẬP KẾT QUẢ'}
              </span>
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
              {isEn
                ? '5. Time-Series Alignment, Indexing & Log-Linear Counterfactual Code'
                : '5. Mã nguồn đồng bộ chuỗi thời gian, chỉ số hóa và hồi quy đối chứng'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {HERITAGE_SQL_PYTHON_SNIPPETS.map((snip, idx) => (
              <button
                key={snip.id}
                type="button"
                onClick={() => setSelectedCodeIdx(idx)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedCodeIdx === idx
                    ? 'bg-[#9BE7FA] text-[#074553] border-[#0D7287]/30'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                {isEn ? snip.labelEn : snip.labelVi}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleCopySnippet(HERITAGE_SQL_PYTHON_SNIPPETS[selectedCodeIdx].code)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>{isEn ? 'Copied' : 'Đã chép'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? 'Copy code' : 'Sao chép'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-100 text-xs font-mono leading-relaxed overflow-x-auto border border-slate-800">
          <code>{HERITAGE_SQL_PYTHON_SNIPPETS[selectedCodeIdx].code}</code>
        </pre>
      </section>

      {/* UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-heritage-japan"
        attribution={{
          datasetVi:
            'Dữ liệu chuỗi thời gian MLIT, JNTO, UNWTO & Niên luận Khoa Đông Phương học (ĐHKHXH&NV - ĐHQGHN)',
          datasetEn:
            'MLIT, JNTO, UNWTO Time-Series & Undergraduate Thesis at Faculty of Oriental Studies (VNU-USSH)',
          scopeVi:
            'Chuỗi nền 2003–2022 · Khung đồng bộ 2009–2021 · 25 di sản UNESCO tại Nhật Bản',
          scopeEn:
            '2003–2022 baseline · 2009–2021 synchronized windows · 25 UNESCO sites in Japan',
        }}
      />
    </div>
  );
}
