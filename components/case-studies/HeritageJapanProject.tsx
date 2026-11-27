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
  yoy,
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
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
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

type RegionToggle = 'japan' | 'kyoto' | 'nara';
type IndexedLineFilter = 'all' | 'japan' | 'kyoto' | 'nara';

const HERITAGE_SQL_PYTHON_SNIPPETS = [
  {
    id: 'sql-indexed-audit',
    labelVi: 'SQL · Window Functions & Chuẩn hóa 6 chuỗi thời gian',
    labelEn: 'SQL · Window Functions & Time-Series Normalization',
    code: `-- Mục đích: Chuẩn hóa 6 chuỗi thời gian (hiệu chỉnh lệch trục năm Kyoto -1 từ 2012, quy đổi 億円/万人 của Nara)
-- Tính chỉ số tăng trưởng (2013 = 100), YoY% bằng LAG() và trả NULL tại điểm đứt gãy khảo sát R1/2019
WITH cleaned_series AS (
  SELECT
    region_code,
    -- Hiệu chỉnh lùi trục năm -1 chỉ cho giai đoạn raw_year >= 2012 bị đẩy tiến trong niên luận gốc (giữ nguyên 2008-2010)
    CASE
      WHEN region_code = 'KYOTO_CITY' AND raw_year >= 2012 THEN raw_year - 1
      ELSE raw_year
    END AS report_year,
    -- Chuẩn hóa đơn vị: Nara 2020 (28,9 万人 -> 289 nghìn); Chi tiêu Nara (億円 -> chia 10 về Tỷ Yên)
    CASE
      WHEN region_code = 'NARA_CITY' AND raw_year = 2020 THEN raw_visitors_k * 10.0
      ELSE raw_visitors_k
    END AS visitors_k,
    CASE
      WHEN region_code = 'NARA_CITY' THEN raw_spend_unit / 10.0
      ELSE raw_spend_unit
    END AS spend_normalized,
    CASE
      WHEN region_code = 'KYOTO_CITY' AND raw_year = 2020 THEN 'METHOD_BREAK_R1_2019'
      ELSE 'CONTINUOUS'
    END AS method_flag
  FROM raw_heritage_thesis_tables
),
base_2013 AS (
  SELECT
    region_code,
    visitors_k AS base_visitors_2013,
    spend_normalized AS base_spend_2013
  FROM cleaned_series
  WHERE report_year = 2013
)
SELECT
  c.region_code,
  c.report_year,
  ROUND(c.visitors_k, 1) AS visitors_k,
  ROUND(c.spend_normalized, 2) AS spend_norm,
  ROUND(c.visitors_k * 100.0 / NULLIF(b.base_visitors_2013, 0), 1) AS index_2013_100,
  CASE
    WHEN c.method_flag = 'METHOD_BREAK_R1_2019' THEN NULL
    ELSE ROUND(
      (c.visitors_k - LAG(c.visitors_k) OVER (PARTITION BY c.region_code ORDER BY c.report_year)) * 100.0
      / NULLIF(LAG(c.visitors_k) OVER (PARTITION BY c.region_code ORDER BY c.report_year), 0),
      1
    )
  END AS yoy_visitors_pct,
  c.method_flag
FROM cleaned_series c
JOIN base_2013 b ON c.region_code = b.region_code
WHERE c.report_year BETWEEN 2013 AND 2022
ORDER BY c.region_code, c.report_year;`,
  },
  {
    id: 'py-counterfactual',
    labelVi: 'Python · Đối soát Chi tiêu/Khách & Kiểm định Xu thế Nền',
    labelEn: 'Python · Per-Visitor Spend Audit & Baseline Trend Diagnostics',
    code: `# Mục đích: Kiểm tra xu thế Log-Linear nền (2003-2012) kèm R²/p-value và tính chi tiêu bình quân/khách (2013-2019)
import numpy as np
import pandas as pd
from scipy import stats

# 1. Hồi quy Log-Linear trên giai đoạn nền 2003-2012 (n = 10 năm, đơn vị: triệu khách)
years_base = np.arange(2003, 2013)
japan_base = np.array([5.2, 6.1, 6.7, 7.3, 8.3, 8.4, 6.8, 8.6, 6.2, 8.4])
reg = stats.linregress(years_base, np.log(japan_base))
baseline_growth_pct = (np.exp(reg.slope) - 1) * 100            # +3.38%/năm
pred_2019 = float(np.exp(reg.intercept + reg.slope * 2019))    # 10.41M (95% PI: 5.98M - 18.13M)
# Lưu ý kiểm định: R² = 0.347, p = 0.073 (không đạt ý nghĩa ở alpha = 0.05 do cú sốc 2009 & 2011)

# 2. Tính chi tiêu bình quân/khách (nghìn Yên) đồng bộ 100% với HERITAGE_JAPAN_DATA
# Đơn vị: 1 nghìn tỷ Yên / 1 triệu khách = 1.000 nghìn Yên -> nhân 1e3 (không phải 1e6)
df_nat = pd.DataFrame({
    "year":       [2013, 2014, 2015, 2016, 2017, 2018, 2019],
    "visitors_m": [10.4, 13.4, 19.7, 24.0, 28.7, 31.2, 31.9],
    "spend_t":    [1.41, 2.02, 3.48, 3.75, 4.41, 4.50, 4.81],  # Nghìn tỷ Yên (JNTO/JTA)
})
df_nat["spend_per_visitor_k"] = (df_nat["spend_t"] * 1e3 / df_nat["visitors_m"]).round(1)
# Đỉnh 2015 = 176.6k Yên -> giảm -14.6% về 150.8k Yên năm 2019

print(f"Baseline: {baseline_growth_pct:.2f}%/yr | R2={reg.rvalue**2:.3f}, p={reg.pvalue:.3f} | 2019 ref={pred_2019:.2f}M")
print(df_nat[["year", "visitors_m", "spend_t", "spend_per_visitor_k"]].to_string(index=False))`,
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
    focus: 'Sustainable Tourism & Historic Town Planning',
    highlights: [
      'Established the Japan Tourism Agency (2008) and the Historic Town Development Act (>100 heritage zones).',
      'Set dual goals: green growth replacing heavy industry and balancing economic benefits with community life.',
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
    pressureMetric: '4.50M foreign overnight guests (2018, 4.0×) vs 53,000 rooms (1.8×)',
    coreIssue:
      'City bus gridlock at Gion & Kinkakuji; hotel deficit pushed tourists into residential flats causing noise.',
    intervention:
      'Installed real-time congestion live cameras; dispersed visitors across 6 satellite zones; attracted Park Hyatt & Aman.',
  },
  {
    site: 'Shirakawa-go & Gokayama',
    prefecture: 'Gifu & Toyama',
    type: 'Cultural Heritage (1995)',
    pressureMetric: '1.8M visitors/yr per ~600 local residents (3,000× ratio)',
    coreIssue:
      'Exceeded infrastructure capacity during Winter Light-up nights; waste and noise disrupting village life.',
    intervention:
      'Enforced 100% advance reservations for light-up events, raised ticket prices, and capped parking & observation deck.',
  },
  {
    site: 'Itsukushima Shrine (Miyajima)',
    prefecture: 'Hiroshima',
    type: 'Cultural Heritage (1996)',
    pressureMetric: '4.60M island visitors (2019)',
    coreIssue:
      'High footfall straining historic over-water wooden shrine architecture and island marine sanitation.',
    intervention:
      'Implemented a 100 JPY/person Miyajima island entry tax to directly fund heritage conservation.',
  },
  {
    site: 'Mount Fuji (Fujisan)',
    prefecture: 'Yamanashi & Shizuoka',
    type: 'Cultural Heritage (2013)',
    pressureMetric: '5.06M visitors (2019, 2.2× vs 2012)',
    coreIssue:
      'Seasonal climbing congestion, hiker safety hazards, and waste accumulation along mountain trails.',
    intervention:
      'Created Conservation Cooperation Fund (2014); opened 6,100 m² World Heritage Center with VR climbing (2017); proposed mountain rail.',
  },
  {
    site: 'Historic Nara',
    prefecture: 'Nara Prefecture',
    type: 'Cultural Heritage (1998)',
    pressureMetric: '3.32M foreign visitors (2019, +662.8%) but total spend fell -5.0% (¥114.7B)',
    coreIssue:
      'Day-trip leakage from Kyoto/Osaka due to hotel shortage; plastic litter harming sacred deer.',
    intervention:
      'Subsidized hotel siting (JW Marriott, Fufu Nara); permitted converting cultural properties into lodging.',
  },
];

const POLICY_RECOMMENDATIONS = [
  {
    id: 'rec-01',
    ownerVi: 'Đánh giá mô hình Kyoto · Mở rộng hạ tầng dữ liệu',
    ownerEn: 'Kyoto Assessment · Data Infrastructure Extension',
    titleVi: '1. Chuẩn hóa dữ liệu mật độ theo giờ (bổ sung cho 6 vùng vệ tinh)',
    titleEn: '1. Add Hourly Congestion Telemetry to Existing 6-Zone Dispersion',
    descVi: 'Kyoto đã triển khai camera trực tiếp và phân tán sang 6 vùng vệ tinh từ 2022; tuy nhiên thống kê năm hiện có chưa đo được đỉnh tắc nghẽn theo khung giờ tại Gion – Kinkakuji.',
    descEn: 'Kyoto already rolled out live cameras and 6 satellite zones (2022); annual survey series still miss hourly transit bottlenecks at Gion–Kinkakuji.',
    metricVi: 'Bài học DMO: Kết nối cảm biến giờ (P90) khi cầu lưu trú tăng 4,0× vs quỹ phòng 1,8×',
    metricEn: 'DMO takeaway: Pair hourly P90 telemetry where lodging demand (4.0×) outpaced rooms (1.8×)',
  },
  {
    id: 'rec-02',
    ownerVi: 'Đánh giá mô hình Shirakawa-go & Miyajima',
    ownerEn: 'Shirakawa-go & Miyajima Policy Review',
    titleVi: '2. Rút kinh nghiệm từ hạn ngạch đặt chỗ & thuế lên đảo 100 ¥',
    titleEn: '2. Lessons from Hard Quotas & Miyajima’s ¥100 Entry Levy',
    descVi: 'Shirakawa-go đã áp đặt chỗ 100% (từ 2019) và Miyajima thu thuế 100 ¥ (từ 10/2023). Khi nhân rộng cho điểm di sản khác, cần tính chi phí thu hộ và nhóm miễn trừ thay vì nhân gộp lượt khách.',
    descEn: 'Shirakawa-go enforced 100% booking (2019) and Miyajima enacted a ¥100 tax (Oct 2023). Scaling to peer sites requires modeling exemptions rather than gross headcount.',
    metricVi: 'Lưu ý ước toán Miyajima: 4,60M × 100 ¥ ≈ 460M ¥ gộp (thực thu ròng <50% sau miễn trừ cư dân/học sinh)',
    metricEn: 'Miyajima sizing caveat: 4.60M × ¥100 ≈ ¥460M gross (net yield <50% after resident/student exemptions)',
  },
  {
    id: 'rec-03',
    ownerVi: 'Kịch bản mở rộng TP. Nara (Nara DMO)',
    ownerEn: 'Nara Expansion Scenario (Nara DMO)',
    titleVi: '3. Chuyển dịch khách đi trong ngày sang lưu trú đêm',
    titleEn: '3. Day-Trip-to-Overnight Conversion in Nara',
    descVi: 'Nara đón 3,32M khách QT (2019) nhưng quy mô chi tiêu chỉ bằng ~1/11 Kyoto do tỷ trọng đi trong ngày cao. Cần mở rộng quỹ phòng và sản phẩm đêm song song đo chi tiêu ròng tăng thêm.',
    descEn: 'Nara drew 3.32M foreign visits (2019) yet total spend stood at ~1/11 of Kyoto due to day-tripping. Expanding lodging requires validating room supply and net incremental spend.',
    metricVi: 'Kịch bản minh họa +5 đpt lưu trú (~166k lượt × 20–30k ¥ ròng) → +3,3 đến +5,0 tỷ ¥/năm',
    metricEn: 'Illustrative +5pp overnight (~166k × ¥20k–30k net) → +¥3.3B–¥5.0B/yr (pending room capacity)',
  },
  {
    id: 'rec-04',
    ownerVi: 'Khuyến nghị đo lường cấp quốc gia (JTA / MLIT)',
    ownerEn: 'National KPI Governance (JTA / MLIT)',
    titleVi: '4. Đo chi tiêu bình quân theo tỷ giá thực & quốc tịch',
    titleEn: '4. Track FX-Adjusted & Market-Mix Per-Visitor Yield',
    descVi: 'Kế hoạch Du lịch 2023 của Nhật đã đặt mục tiêu ≥200k ¥/khách; để đánh giá đúng chất lượng tăng trưởng (sau mức giảm -14,6% giai đoạn 2015–2019), cần bóc tách biến tỷ giá Yên và độ dài lưu trú.',
    descEn: 'Japan’s 2023 Tourism Plan adopted ¥200k/visitor; evaluating true yield beyond the -14.6% (2015–2019) dip requires decomposing JPY FX swings and stay length by source market.',
    metricVi: 'Chuẩn KPI: Theo dõi chi tiêu/khách cố định tỷ giá & phân tầng theo quốc tịch thay vì tổng lượt',
    metricEn: 'KPI standard: Monitor FX-constant spend/visitor and stay length by nationality rather than raw arrivals',
  },
];

export default function HeritageJapanProject({
  onBack,
  isEmbedded: _isEmbedded,
}: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeSection, setActiveSection] = useState<string>('sec-macro-policy');
  const [indexedLineFilter, setIndexedLineFilter] = useState<IndexedLineFilter>('all');
  const [part1Region, setPart1Region] = useState<RegionToggle>('japan');
  const [part2Region, setPart2Region] = useState<RegionToggle>('japan');
  const [showPolicyContext, setShowPolicyContext] = useState<boolean>(false);
  const [showPart1Table, setShowPart1Table] = useState<boolean>(false);
  const [showUnescoMatrix, setShowUnescoMatrix] = useState<boolean>(false);
  const [showCodeAccordion, setShowCodeAccordion] = useState<boolean>(false);
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
    if (sectionId === 'sec-sql-python') {
      setShowCodeAccordion(true);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ============================================================================
  // QUANTITATIVE METRICS & STANDARDIZED SERIES
  // ============================================================================
  const quantStats = useMemo(() => {
    const prePolicyCagr = seriesCagr(HERITAGE_JAPAN_DATA.japanVisitors, '2003', '2012');
    const policyCagr = seriesCagr(HERITAGE_JAPAN_DATA.japanVisitors, '2013', '2019');
    const kyotoCagr2013To2018 = seriesCagr(HERITAGE_JAPAN_DATA.kyotoVisitors, '2013', '2018');
    const naraCagr2013To2019 = seriesCagr(HERITAGE_JAPAN_DATA.naraVisitors, '2013', '2019');

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

    return {
      prePolicyCagr,
      policyCagr,
      kyotoCagr2013To2018,
      naraCagr2013To2019,
      predicted2019,
      surplus2019,
      corrNat,
    };
  }, []);

  // Chuỗi Indexed Line Chart (2013 = 100) cho giai đoạn 2013–2022
  const indexedSeries2013To2022 = useMemo(() => {
    const years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];
    const jpBase = 10.4;
    const kyBase = 1127.9;
    const naBase = 435.0;

    return years.map((yr) => {
      const jpVal = HERITAGE_JAPAN_DATA.japanVisitors.find((d) => d.year === yr)?.value ?? null;
      const kyVal = HERITAGE_JAPAN_DATA.kyotoVisitors.find((d) => d.year === yr)?.value ?? null;
      const naVal = HERITAGE_JAPAN_DATA.naraVisitors.find((d) => d.year === yr)?.value ?? null;
      return {
        year: yr,
        japanVal: jpVal,
        kyotoVal: kyVal,
        naraVal: naVal,
        japanIdx: jpVal !== null ? Number(((jpVal / jpBase) * 100).toFixed(1)) : null,
        kyotoIdx: kyVal !== null ? Number(((kyVal / kyBase) * 100).toFixed(1)) : null,
        naraIdx: naVal !== null ? Number(((naVal / naBase) * 100).toFixed(1)) : null,
      };
    });
  }, []);

  // Chuỗi Biểu đồ Phải Phần 01: Cột số tuyệt đối + Đường YoY% có nút chuyển [Toàn Nhật | Kyoto | Nara]
  // Đồng bộ khung thời gian 2013–2020 cho cả 3 tab (và cả Biểu đồ đường chuẩn hóa bên trái)
  const indexedSeries2013To2020 = useMemo(
    () => indexedSeries2013To2022.filter((d) => Number(d.year) >= 2013 && Number(d.year) <= 2020),
    [indexedSeries2013To2022]
  );

  const part1RightSeries = useMemo(() => {
    const raw =
      part1Region === 'japan'
        ? HERITAGE_JAPAN_DATA.japanVisitors.filter((d) => Number(d.year) >= 2012 && Number(d.year) <= 2020)
        : part1Region === 'kyoto'
        ? HERITAGE_JAPAN_DATA.kyotoVisitors.filter((d) => Number(d.year) >= 2012 && Number(d.year) <= 2020)
        : HERITAGE_JAPAN_DATA.naraVisitors.filter((d) => Number(d.year) >= 2012 && Number(d.year) <= 2020);

    const yoyList = yoy(raw);
    return raw
      .filter((d) => Number(d.year) >= 2013)
      .map((d) => {
        const yItem = yoyList.find((y) => y.year === d.year);
        const isMethodBreak = part1Region === 'kyoto' && d.year === '2019';
        const pct =
          !isMethodBreak && yItem && yItem.growth !== null
            ? Number((yItem.growth * 100).toFixed(1))
            : null;
        return {
          year: d.year,
          value: d.value,
          yoyPct: pct,
          isMethodBreak,
        };
      });
  }, [part1Region]);

  // Chuỗi Biểu đồ Trái Phần 02: Dual-Axis Combo Chart (Cột = Lượng khách | Đường = Chi tiêu)
  // Đồng bộ cùng một trục thời gian 2013–2019 cho cả 3 biểu đồ [Toàn Nhật | TP. Kyoto | TP. Nara]
  const part2ComboSeries = useMemo(() => {
    const years = ['2013', '2014', '2015', '2016', '2017', '2018', '2019'];
    if (part2Region === 'japan') {
      return years.map((yr) => ({
        year: yr,
        visitors: HERITAGE_JAPAN_DATA.japanVisitors.find((d) => d.year === yr)?.value ?? null,
        spend: HERITAGE_JAPAN_DATA.japanSpending.find((d) => d.year === yr)?.value ?? null,
        isGap: false,
        isMethodBreak: false,
      }));
    }
    if (part2Region === 'kyoto') {
      return years.map((yr) => ({
        year: yr,
        visitors: HERITAGE_JAPAN_DATA.kyotoVisitors.find((d) => d.year === yr)?.value ?? null,
        spend: HERITAGE_JAPAN_DATA.kyotoSpending.find((d) => d.year === yr)?.value ?? null,
        isGap: false,
        isMethodBreak: yr === '2019',
      }));
    }
    // nara
    return years.map((yr) => ({
      year: yr,
      visitors: HERITAGE_JAPAN_DATA.naraVisitors.find((d) => d.year === yr)?.value ?? null,
      spend: HERITAGE_JAPAN_DATA.naraSpending.find((d) => d.year === yr)?.value ?? null,
      isGap: false,
      isMethodBreak: false,
    }));
  }, [part2Region]);

  const navItems = [
    {
      id: 'sec-macro-policy',
      labelVi: 'Phần 01 · Tăng trưởng khách',
      labelEn: 'Part 01 · Visitor Growth',
    },
    {
      id: 'sec-kyoto-nara',
      labelVi: 'Phần 02 · Chi tiêu & Kinh tế',
      labelEn: 'Part 02 · Spend & Economy',
    },
    {
      id: 'sec-overtourism',
      labelVi: 'Phần 03 · Quá tải & 5 Di sản',
      labelEn: 'Part 03 · Overtourism & 5 Sites',
    },
    {
      id: 'sec-data-audit',
      labelVi: 'Phần 04 · Hàm ý Chính sách',
      labelEn: 'Part 04 · Policy & Governance',
    },
    {
      id: 'sec-sql-python',
      labelVi: 'Mã nguồn SQL & Python',
      labelEn: 'SQL & Python Code',
    },
  ];

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* =====================================================================
       * TẦNG MỞ ĐẦU: HEADER + 4 THẺ KPI + DẢI "TÓM TẮT 60 GIÂY"
       * ===================================================================== */}
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
              <span>{isEn ? 'Policy Recommendations' : 'Hàm ý Chính sách'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleJumpToSection('sec-sql-python')}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-slate-950 border border-[#0D7287]/20 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#074553]" aria-hidden="true" />
              <span>{isEn ? 'SQL & Python Audit' : 'Mã nguồn SQL & Python'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 max-w-4xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight text-balance">
            {isEn ? (
              <>
                Japan Heritage Tourism{' '}
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">(2013–2022)</span>: Time-Series
                Data Audit &amp; Overtourism
              </>
            ) : (
              <>
                Du Lịch Di Sản Nhật Bản{' '}
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">(2013–2022)</span>: Kiểm Toán
                Dữ Liệu &amp; Bài Toán Quá Tải
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {isEn
              ? 'Research question: After Japan’s June 2013 inbound stimulus, how did arrivals and spending scale across 2013–2022 (with 2023 headline updates), and what carrying-capacity pressures emerged at 5 UNESCO sites? Audited 6 primary Japanese series (JNTO, MLIT, Kyoto, Nara) to fix 5 errors from my 2024 thesis.'
              : 'Câu hỏi nghiên cứu: Sau chương trình mở cửa du lịch 06/2013, lượng khách và chi tiêu tại Nhật Bản (cùng Kyoto, Nara) mở rộng ra sao giai đoạn 2013–2022 (kèm mốc chốt 2023), và áp lực quá tải tác động thế nào tới 5 điểm di sản UNESCO? Toàn bộ 6 chuỗi gốc tiếng Nhật được tự kiểm toán sửa 5 lỗi từ niên luận 2024.'}
          </p>
        </div>

        {/* 4 THẺ KPI ĐẦU TRANG (GỌN 1 DÒNG MÔ TẢ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              id: 'kpi-heritage-visitors',
              title: { vi: 'Đỉnh khách quốc tế (2019)', en: 'Peak Inbound Visitors (2019)' },
              primaryValue: isEn ? '31.9M' : '31,9 triệu',
              exactSubValue: {
                vi: `+206,7% vs 2013 (CAGR ${fmtPct(quantStats.policyCagr, 1, false)}/năm)`,
                en: `+206.7% vs 2013 (CAGR ${fmtPct(quantStats.policyCagr, 1, true)}/yr)`,
              },
              tone: 'bg-[#9BE7FA]/25 border-[#9BE7FA]/70 dark:bg-slate-900/80 dark:border-[#9BE7FA]/30',
            },
            {
              id: 'kpi-heritage-spending',
              title: { vi: 'Chi tiêu quốc tế đỉnh (2019)', en: 'Peak Inbound Spend (2019)' },
              primaryValue: isEn ? '¥4.81T' : '4,81 nghìn tỷ ¥',
              exactSubValue: {
                vi: `3,41× vs 2013 (~0,86% GDP) · ~150,8k ¥/khách`,
                en: `3.41× vs 2013 (~0.86% GDP) · ~¥150.8k/visitor`,
              },
              tone: 'bg-[#FFE485]/35 border-[#FFD14C]/70 dark:bg-slate-900/80 dark:border-[#FFD14C]/30',
            },
            {
              id: 'kpi-heritage-gdp',
              title: { vi: 'Toàn ngành Du lịch (WTTC, 2019)', en: 'Total Travel & Tourism (WTTC, 2019)' },
              primaryValue: isEn ? '7.5% GDP' : '7,5% GDP',
              exactSubValue: {
                vi: 'Nội địa + Quốc tế + Gián tiếp (41,94T ¥ · >4M việc làm)',
                en: 'Domestic + Inbound + Indirect (¥41.94T · >4M jobs)',
              },
              tone: 'bg-[#C8EEF7]/35 border-[#C8EEF7] dark:bg-slate-900/80 dark:border-slate-800',
            },
            {
              id: 'kpi-heritage-overtourism',
              title: { vi: 'Quá tải cục bộ (Shirakawa-go)', en: 'Local Strain (Shirakawa-go)' },
              primaryValue: isEn ? '3,000×/yr' : '3.000×/năm',
              exactSubValue: {
                vi: '1,8M lượt/năm ÷ ~600 cư dân lõi Ogimachi (~8,2/ngày)',
                en: '1.8M visits/yr ÷ ~600 Ogimachi hamlet residents (~8.2/day)',
              },
              tone: 'bg-rose-500/5 border-rose-500/30 dark:bg-slate-900/80 dark:border-rose-900/50',
            },
          ].map((card) => {
            const lang = isEn ? 'en' : 'vi';
            return (
              <div
                key={card.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-1 ${card.tone}`}
              >
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-950 dark:text-white tracking-tight">
                  {card.primaryValue}
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {card.title[lang]}
                </h2>
                <div className="text-xs tabular-nums font-semibold text-[#074553] dark:text-[#9BE7FA] leading-snug">
                  {card.exactSubValue[lang]}
                </div>
              </div>
            );
          })}
        </div>

        {/* DẢI TÓM TẮT GỌN 3 Ý (1 DÒNG MỖI Ý) */}
        <div className="rounded-2xl bg-[#F0F9FB] dark:bg-slate-900/90 border border-[#C8EEF7] dark:border-slate-800 p-3.5">
          <ul className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300 tabular-nums">
            <li className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-950 dark:text-white">
                {isEn ? '1. Heritage outpaced national: ' : '1. Tăng nóng cục bộ: '}
              </strong>
              {isEn
                ? 'Japan +206.7% (2013–19) vs. Kyoto +299.3% and Nara +662.8%.'
                : 'Toàn Nhật +206,7% vs. Kyoto +299,3% và Nara +662,8%.'}
            </li>
            <li className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-950 dark:text-white">
                {isEn ? '2. Nara day-trip gap: ' : '2. Nghịch lý Nara: '}
              </strong>
              {isEn
                ? '3.32M foreign visitors in 2019, yet spend dipped -5.0% (¥114.7B ≈ 1/11 Kyoto).'
                : '3,32M khách QT (2019) nhưng tổng chi tiêu giảm -5,0% (≈1/11 Kyoto).'}
            </li>
            <li className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <strong className="text-slate-950 dark:text-white">
                {isEn ? '3. Data Audit (5 fixes): ' : '3. Kiểm toán 5 lỗi gốc: '}
              </strong>
              {isEn
                ? 'Fixed Kyoto +1yr shift, Nara 10× units (億円/万人) & R1/2019 break.'
                : 'Sửa lệch năm +1 Kyoto, lỗi ×10 đơn vị Nara (億円/万人) & mốc R1/2019.'}
            </li>
          </ul>
        </div>

        {/* Cây chỉ số (KPI Tree) tách bài toán Kinh tế du lịch vs. Sức chứa di sản */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 space-y-2.5 tabular-nums">
          <p className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
            {isEn
              ? 'KPI Tree · Splitting Economic Value (¥4.81T) from Local Carrying Pressure'
              : 'Cây chỉ số (KPI Tree) · Tách Giá trị kinh tế (4,81T Yên) khỏi Áp lực sức chứa di sản'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-[#F0F9FB]/70 dark:bg-slate-950/60 border border-[#C8EEF7] dark:border-slate-800 p-3 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                {isEn
                  ? 'Inbound Spend (¥4.81T, ~0.86% GDP) = Visitors (31.88M) × Spend/Visitor (¥150.8k)'
                  : 'Chi tiêu QT (4,81T Yên, ~0,86% GDP) = Lượt khách (31,88M) × Chi tiêu/khách (150,8k Yên)'}
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                {isEn
                  ? 'Quality bottleneck: Spend/visitor fell -14.6% from ¥176.6k (2015) to ¥150.8k (2019) as JPY firmed and short-haul trips rose.'
                  : 'Nút thắt chất lượng: Chi tiêu/khách giảm -14,6% từ 176,6k (2015) xuống 150,8k Yên (2019) do tỷ giá JPY và khách đi ngắn ngày tăng.'}
              </p>
            </div>
            <div className="rounded-xl bg-[#F0F9FB]/70 dark:bg-slate-950/60 border border-[#C8EEF7] dark:border-slate-800 p-3 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                {isEn
                  ? 'Heritage Pressure = Concentrated Core Footfall ÷ Resident Base & Lodging Supply'
                  : 'Áp lực di sản = Lượt khách dồn vào vùng lõi ÷ Dân số bản địa & Sức chứa lưu trú'}
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                {isEn
                  ? 'Spatial bottleneck: Shirakawa-go core (~600 residents) hit 3,000 visits/resident/yr; Nara day-trippers kept spend at ~1/11 Kyoto.'
                  : 'Nút thắt không gian: Khu lõi Shirakawa-go (~600 dân) chịu 3.000 lượt/dân/năm; khách đi về trong ngày giữ chi tiêu Nara chỉ bằng ~1/11 Kyoto.'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* THANH ĐIỀU HƯỚNG DÍNH (STICKY NAVIGATION BAR) */}
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
       * PHẦN 01 — TĂNG TRƯỞNG LƯỢNG KHÁCH QUỐC TẾ
       * ===================================================================== */}
      <section id="sec-macro-policy" className="space-y-5 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" aria-hidden="true" />
            <span>
              {isEn
                ? '1. Inbound Visitor Acceleration: National vs. Kyoto & Nara'
                : '1. Tăng trưởng khách quốc tế: Toàn Nhật so với Kyoto & Nara'}
            </span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Core charts align to 2013–2020 (matching Nara’s series); policy milestones and 2022–2023 updates are in the accordions below.'
              : 'Biểu đồ khóa khung 2013–2020 (khớp chuỗi Nara); bối cảnh 3 mốc chính sách và số liệu chốt 2022–2023 nằm ở mục mở rộng bên dưới.'}
          </p>
        </div>

        {/* 2 BIỂU ĐỒ XẾP NGANG (65% / 35% -> lg:col-span-7 / lg:col-span-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* TRÁI (65% -> col-span-7): BIỂU ĐỒ ĐƯỜNG CHUẨN HÓA MỐC GỐC (INDEXED LINE CHART, 2013 = 100) */}
          <div className="lg:col-span-7 rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Indexed Growth Line Chart (Base Year 2013 = 100)'
                    : 'Biểu đồ đường chuẩn hóa mốc gốc (Năm 2013 = 100)'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FFE485]/50 text-amber-950 dark:bg-[#FFE485]/15 dark:text-[#FFE485]">
                  {isEn
                    ? 'Nara 2019: 762.8 · Kyoto 2018: 399.3 · Japan 2019: 306.7'
                    : 'Nara 2019: 762,8 · Kyoto 2018: 399,3 · Toàn Nhật 2019: 306,7'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                {isEn
                  ? 'Nara (+662.8%) & Kyoto (+299.3%) Outpaced National Inbound Growth (+206.7%) Over 2013–2019'
                  : 'Nara (+662,8%) và Kyoto (+299,3%) tăng tốc nhanh hơn toàn Nhật (+206,7%) suốt giai đoạn 2013–2019'}
              </h3>

              {/* Interactive Filter Pills: Xem tất cả hoặc xem riêng từng đường */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-3">
                <button
                  type="button"
                  onClick={() => setIndexedLineFilter('all')}
                  aria-pressed={indexedLineFilter === 'all'}
                  className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                    indexedLineFilter === 'all'
                      ? 'bg-[#9BE7FA] text-[#074553] border-[#0D7287]/30 font-extrabold dark:text-slate-950'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span>{isEn ? 'All 3 Lines' : 'Tất cả 3 đường'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIndexedLineFilter((prev) => (prev === 'japan' ? 'all' : 'japan'))
                  }
                  aria-pressed={indexedLineFilter === 'japan'}
                  className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                    indexedLineFilter === 'japan'
                      ? 'bg-slate-200/90 text-slate-950 border-slate-500 font-extrabold dark:bg-slate-700 dark:text-white dark:border-slate-400'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="w-3 h-1 rounded-full bg-slate-500 inline-block" />
                  <span>{isEn ? 'All Japan (2019 = 306.7)' : 'Toàn Nhật (2019 = 306,7)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIndexedLineFilter((prev) => (prev === 'kyoto' ? 'all' : 'kyoto'))
                  }
                  aria-pressed={indexedLineFilter === 'kyoto'}
                  className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                    indexedLineFilter === 'kyoto'
                      ? 'bg-[#C8EEF7] text-[#074553] border-[#0D7287] font-extrabold dark:bg-[#9BE7FA]/25 dark:text-[#9BE7FA] dark:border-[#9BE7FA]'
                      : 'bg-slate-50 text-[#074553] border-slate-200 hover:bg-[#F0F9FB] dark:bg-slate-800/70 dark:text-[#9BE7FA] dark:border-slate-700'
                  }`}
                >
                  <span className="w-3 h-1 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] inline-block" />
                  <span>{isEn ? 'Kyoto City (2018 = 399.3)' : 'TP. Kyoto (2018 = 399,3)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIndexedLineFilter((prev) => (prev === 'nara' ? 'all' : 'nara'))
                  }
                  aria-pressed={indexedLineFilter === 'nara'}
                  className={`min-h-[34px] inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                    indexedLineFilter === 'nara'
                      ? 'bg-[#FFE485]/70 text-amber-950 border-amber-600 font-extrabold dark:bg-[#FFD14C]/25 dark:text-[#FFE485] dark:border-[#FFD14C]'
                      : 'bg-slate-50 text-amber-800 border-slate-200 hover:bg-amber-50 dark:bg-slate-800/70 dark:text-[#FFE485] dark:border-slate-700'
                  }`}
                >
                  <span className="w-3 h-1 rounded-full bg-[#D97706] dark:bg-[#FFD14C] inline-block" />
                  <span>{isEn ? 'Nara City (2019 = 762.8)' : 'TP. Nara (2019 = 762,8)'}</span>
                </button>
              </div>

              {/* SVG Indexed Line Chart */}
              {(() => {
                const w = 640;
                const h = 270;
                const padL = 44;
                const padR = 24;
                const padT = 28;
                const padB = 34;
                const plotW = w - padL - padR;
                const plotH = h - padT - padB;
                const yMax =
                  indexedLineFilter === 'japan'
                    ? 360
                    : indexedLineFilter === 'kyoto'
                    ? 450
                    : 800;
                const yTicks =
                  indexedLineFilter === 'japan'
                    ? [0, 100, 200, 300, 360]
                    : indexedLineFilter === 'kyoto'
                    ? [0, 100, 200, 300, 400, 450]
                    : [0, 100, 200, 400, 600, 800];
                const n = indexedSeries2013To2020.length;

                const showJapan = indexedLineFilter === 'all' || indexedLineFilter === 'japan';
                const showKyoto = indexedLineFilter === 'all' || indexedLineFilter === 'kyoto';
                const showNara = indexedLineFilter === 'all' || indexedLineFilter === 'nara';
                const isSingleLine = indexedLineFilter !== 'all';

                const xAt = (idx: number) => padL + (idx / (n - 1)) * plotW;
                const yAt = (val: number) => padT + plotH - (val / yMax) * plotH;

                // Build paths
                const jpPts = indexedSeries2013To2020
                  .map((d, i) => (d.japanIdx !== null ? { x: xAt(i), y: yAt(d.japanIdx), val: d.japanIdx, yr: d.year } : null))
                  .filter((p): p is { x: number; y: number; val: number; yr: string } => p !== null);

                const naPts = indexedSeries2013To2020
                  .map((d, i) => (d.naraIdx !== null ? { x: xAt(i), y: yAt(d.naraIdx), val: d.naraIdx, yr: d.year } : null))
                  .filter((p): p is { x: number; y: number; val: number; yr: string } => p !== null);

                // Kyoto continuous 2013..2018 (indices 0..5), dashed 2018..2019 (5..6), post-2019 (6..7)
                const kyPts = indexedSeries2013To2020
                  .map((d, i) => (d.kyotoIdx !== null ? { x: xAt(i), y: yAt(d.kyotoIdx), val: d.kyotoIdx, yr: d.year, idx: i } : null))
                  .filter((p): p is { x: number; y: number; val: number; yr: string; idx: number } => p !== null);

                const toPath = (pts: Array<{ x: number; y: number }>) =>
                  pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

                const kyPre2018 = kyPts.filter((p) => Number(p.yr) <= 2018);
                const kyBreak2018To2019 = kyPts.filter((p) => p.yr === '2018' || p.yr === '2019');
                const kyPost2019 = kyPts.filter((p) => Number(p.yr) >= 2019);

                const x2013 = xAt(0);
                const x2018 = xAt(5);
                const x2019 = xAt(6);
                const x2020 = xAt(7);

                return (
                  <div className="w-full overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${w} ${h}`}
                      className="w-full h-auto select-none overflow-visible"
                      role="img"
                      aria-label="Indexed Line Chart 2013=100"
                    >
                      {/* Horizontal gridlines */}
                      {yTicks.map((tick) => {
                        const y = yAt(tick);
                        return (
                          <g key={tick}>
                            <line
                              x1={padL}
                              y1={y}
                              x2={w - padR}
                              y2={y}
                              stroke="currentColor"
                              strokeDasharray={tick === 100 ? '4 2' : tick === 0 ? undefined : '2 3'}
                              className={
                                tick === 100
                                  ? 'text-slate-400 dark:text-slate-600'
                                  : 'text-slate-200 dark:text-slate-800'
                              }
                              strokeWidth={tick === 100 || tick === 0 ? 1.2 : 1}
                            />
                            <text
                              x={padL - 8}
                              y={y + 4}
                              textAnchor="end"
                              className="fill-slate-500 dark:fill-slate-400 text-[11px] tabular-nums font-semibold"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {/* Event Marker 1: 2013 (Mở cửa & Miễn thị thực ASEAN) */}
                      <line
                        x1={x2013}
                        y1={padT}
                        x2={x2013}
                        y2={padT + plotH}
                        stroke="#0D7287"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x2013 + 6}
                        y={padT + 12}
                        textAnchor="start"
                        className="fill-[#074553] dark:fill-[#9BE7FA] text-[11px] font-bold"
                      >
                        {isEn ? '06/2013: Visa Waiver & Action Plan' : '2013: Mở cửa & Miễn thị thực ASEAN'}
                      </text>

                      {/* Event Marker 2: 2020 (COVID-19) */}
                      <line
                        x1={x2020}
                        y1={padT}
                        x2={x2020}
                        y2={padT + plotH}
                        stroke="#E11D48"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x2020 - 5}
                        y={padT + 14}
                        textAnchor="end"
                        className="fill-rose-600 dark:fill-rose-400 text-[11px] font-bold"
                      >
                        {isEn ? '2020: COVID-19' : '2020: COVID-19'}
                      </text>

                      {/* Japan Line */}
                      {showJapan && (
                        <g>
                          <path
                            d={toPath(jpPts)}
                            fill="none"
                            stroke="#64748B"
                            strokeWidth={isSingleLine ? '3' : '2.2'}
                          />
                          {jpPts.map((pt) => (
                            <g key={`jp-${pt.yr}`}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={pt.yr === '2019' ? 4.5 : isSingleLine ? 3.5 : 2.5}
                                className="fill-slate-600 dark:fill-slate-300"
                              />
                              {isSingleLine && (
                                <text
                                  x={pt.x}
                                  y={pt.y - 8}
                                  textAnchor="middle"
                                  className="fill-slate-700 dark:fill-slate-200 text-[11px] font-bold tabular-nums"
                                >
                                  {fmtNum(pt.val, 1, isEn)}
                                </text>
                              )}
                            </g>
                          ))}
                        </g>
                      )}

                      {/* Kyoto Line: solid 2013-2018, dashed 2018-2019, solid 2019-2022 */}
                      {showKyoto && (
                        <g>
                          <path
                            d={toPath(kyPre2018)}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={isSingleLine ? '3.2' : '2.8'}
                            className="text-[#0D7287] dark:text-[#9BE7FA]"
                          />
                          <path
                            d={toPath(kyBreak2018To2019)}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={isSingleLine ? '2.8' : '2.5'}
                            strokeDasharray="5 4"
                            className="text-[#0D7287] dark:text-[#9BE7FA]"
                          />
                          <path
                            d={toPath(kyPost2019)}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={isSingleLine ? '2.6' : '2.2'}
                            className="text-[#0D7287] dark:text-[#9BE7FA]"
                          />
                          {kyPts.map((pt) => (
                            <g key={`ky-${pt.yr}`}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={pt.yr === '2018' || pt.yr === '2019' ? 4.5 : isSingleLine ? 3.5 : 2.8}
                                className={
                                  pt.yr === '2019'
                                    ? 'fill-white dark:fill-slate-900 stroke-[#0D7287] dark:stroke-[#9BE7FA]'
                                    : 'fill-[#0D7287] dark:fill-[#9BE7FA]'
                                }
                                strokeWidth={pt.yr === '2019' ? 2.2 : 0}
                              />
                              {isSingleLine && pt.yr !== '2018' && pt.yr !== '2019' && (
                                <text
                                  x={pt.x}
                                  y={pt.y - 8}
                                  textAnchor="middle"
                                  className="fill-[#074553] dark:fill-[#9BE7FA] text-[11px] font-bold tabular-nums"
                                >
                                  {fmtNum(pt.val, 1, isEn)}
                                </text>
                              )}
                            </g>
                          ))}
                        </g>
                      )}

                      {/* Nara Line */}
                      {showNara && (
                        <g>
                          <path
                            d={toPath(naPts)}
                            fill="none"
                            stroke="#D97706"
                            strokeWidth={isSingleLine ? '3.2' : '2.8'}
                          />
                          {naPts.map((pt) => (
                            <g key={`na-${pt.yr}`}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={pt.yr === '2019' ? 4.5 : isSingleLine ? 3.5 : 2.8}
                                className="fill-amber-600 dark:fill-[#FFD14C]"
                              />
                              {isSingleLine && pt.yr !== '2019' && (
                                <text
                                  x={pt.x}
                                  y={pt.y - 8}
                                  textAnchor="middle"
                                  className="fill-amber-800 dark:fill-[#FFE485] text-[11px] font-bold tabular-nums"
                                >
                                  {fmtNum(pt.val, 1, isEn)}
                                </text>
                              )}
                            </g>
                          ))}
                        </g>
                      )}

                      {/* Key Annotations */}
                      {/* Nara 2019 Peak = 762.8 */}
                      {showNara && (
                        <text
                          x={x2019 - 6}
                          y={yAt(762.8) - 8}
                          textAnchor="end"
                          className="fill-amber-700 dark:fill-[#FFD14C] text-[11px] font-extrabold tabular-nums"
                        >
                          Nara &apos;19: 762,8 (+662,8%)
                        </text>
                      )}

                      {/* Kyoto 2018 Peak = 399.3 & R1/2019 Method Break */}
                      {showKyoto && (
                        <>
                          <text
                            x={x2018 - 6}
                            y={yAt(399.3) - 9}
                            textAnchor="end"
                            className="fill-[#074553] dark:fill-[#9BE7FA] text-[11px] font-extrabold tabular-nums"
                          >
                            Kyoto &apos;18: 399,3 (+299,3%)
                          </text>
                          <text
                            x={x2019 + 6}
                            y={yAt(336.8) - 6}
                            textAnchor="start"
                            className="fill-[#074553] dark:fill-[#9BE7FA] text-[11px] font-bold"
                          >
                            {isEn ? 'R1/2019 New Method (336.8)' : 'Đổi PP thống kê R1/2019 (336,8)'}
                          </text>
                        </>
                      )}

                      {/* Japan 2019 Peak = 306.7 */}
                      {showJapan && !isSingleLine && (
                        <text
                          x={x2019 - 6}
                          y={yAt(306.7) + 14}
                          textAnchor="end"
                          className="fill-slate-700 dark:fill-slate-300 text-[11px] font-bold tabular-nums"
                        >
                          {isEn ? "Japan '19: 306.7" : "Toàn Nhật '19: 306,7"}
                        </text>
                      )}

                      {/* X-axis labels */}
                      {indexedSeries2013To2020.map((d, i) => (
                        <text
                          key={d.year}
                          x={xAt(i)}
                          y={h - 8}
                          textAnchor="middle"
                          className="fill-slate-600 dark:fill-slate-400 text-[11px] font-semibold tabular-nums"
                        >
                          {d.year}
                        </text>
                      ))}
                    </svg>
                  </div>
                );
              })()}
            </div>

            <p className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed tabular-nums">
              <strong className="text-emerald-700 dark:text-emerald-400">
                {isEn ? 'Descriptive Baseline (2003–2012, n = 10): ' : 'Đường nền tham chiếu (2003–2012, n = 10): '}
              </strong>
              {isEn
                ? `Log-linear extrapolation projects ~${fmtNum(quantStats.predicted2019, 1, true)}M in 2019 vs. 31.9M actual, but R² = 0.347, p = 0.073 (not significant at α = 0.05; 95% PI: 6.0M–18.1M due to 2009/2011 shocks) — descriptive reference only. Dashed Kyoto segment marks R1/2019 survey revision.`
                : `Ngoại suy log-linear ra ~${fmtNum(quantStats.predicted2019, 1, false)}M năm 2019 vs. 31,9M thực tế, nhưng R² = 0,347 và p = 0,073 (không đạt ý nghĩa ở α = 0,05; 95% PI: 6,0–18,1M do cú sốc 2009 & 2011) nên chỉ mang tính tham chiếu mô tả. Nét đứt Kyoto đánh dấu đổi PP đo R1/2019.`}
            </p>
          </div>

          {/* PHẢI (35% -> col-span-5): BIỂU ĐỒ CỘT + ĐƯỜNG YoY% CÓ NÚT CHUYỂN [Toàn Nhật | Kyoto | Nara] */}
          <div className="lg:col-span-5 rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn ? 'Absolute Volume & YoY% Growth' : 'Số liệu tuyệt đối & Tốc độ YoY%'}
                </span>
                {/* Nút chuyển [Toàn Nhật | Kyoto | Nara] */}
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  {(
                    [
                      { key: 'japan', vi: 'Toàn Nhật', en: 'All Japan' },
                      { key: 'kyoto', vi: 'Kyoto', en: 'Kyoto' },
                      { key: 'nara', vi: 'Nara', en: 'Nara' },
                    ] as Array<{ key: RegionToggle; vi: string; en: string }>
                  ).map((tab) => {
                    const active = part1Region === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setPart1Region(tab.key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#9BE7FA] text-[#074553] dark:text-slate-950'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {isEn ? tab.en : tab.vi}
                      </button>
                    );
                  })}
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {part1Region === 'japan'
                  ? isEn
                    ? 'Japan Peaked at 31.9M Visitors (2019) Before Plunging -87.1% in 2020'
                    : 'Khách quốc tế đạt đỉnh 31,9 triệu (2019) trước khi sụt -87,1% (2020) vì đại dịch'
                  : part1Region === 'kyoto'
                  ? isEn
                    ? 'Kyoto Foreign Overnight Guests Hit 4.50M (2018) Before Falling -88.2% in 2020'
                    : 'Khách lưu trú nước ngoài Kyoto lập đỉnh 4,50 triệu (2018) rồi rơi -88,2% năm 2020'
                  : isEn
                  ? 'Nara Foreign Arrivals Surged 7.6× (2013→2019) Before Dropping to 289k in 2020'
                  : 'Khách quốc tế đến Nara tăng 7,6× (2013→2019), chuẩn hóa 2020 còn 289 nghìn lượt'}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {part1Region === 'japan'
                  ? isEn
                    ? 'Chart 3.1 (Aligned 2013–2020) · 2019 Peak: 31.9M · 2020: 4.1M (2022 Finalized: 3.83M)'
                    : 'Biểu đồ 3.1 (Đồng bộ 2013–2020) · Đỉnh 2019: 31,9 triệu · 2020: 4,1 triệu (2022 chốt: 3,83 triệu)'
                  : part1Region === 'kyoto'
                  ? isEn
                    ? 'Chart 3.2 (Aligned 2013–2020) · 2018 Peak: 4,503.3k · 2019 New Method: 3,799.0k · 2020: 448.8k'
                    : 'Biểu đồ 3.2 (Đồng bộ 2013–2020) · Đỉnh 2018: 4.503,3k · 2019 (PP mới): 3.799,0k · 2020: 448,8k'
                  : isEn
                  ? 'Chart 3.3 (Aligned 2013–2020) · 2019 Peak: 3,318k · 2020 Corrected: 289k (28.9 万人)'
                  : 'Biểu đồ 3.3 (Đồng bộ 2013–2020) · Đỉnh 2019: 3.318 nghìn · Năm 2020 chuẩn hóa: 289 nghìn (28,9 万人)'}
              </p>

              {/* Legend cho Cột & Đường YoY% */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mb-2">
                <span className="inline-flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                  <span className="w-3 h-3 rounded-xs bg-[#0D7287] dark:bg-[#9BE7FA] inline-block" />
                  {isEn ? 'Bars: Visitors (Left)' : 'Cột: Lượng khách'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <span className="w-4 border-t-2 border-dashed border-emerald-500 inline-block" />
                  {isEn ? 'Dashed line: YoY% growth (Right axis)' : 'Đường đứt: Tăng trưởng YoY% (Trục phải)'}
                </span>
              </div>

              {/* Bar + YoY% SVG Chart */}
              {(() => {
                const w = 440;
                const h = 235;
                const padL = 24;
                const padR = 44;
                const padT = 26;
                const padB = 30;
                const plotW = w - padL - padR;
                const plotH = h - padT - padB;
                const n = part1RightSeries.length;
                const maxVal =
                  part1Region === 'japan' ? 35 : part1Region === 'kyoto' ? 5000 : 3600;

                // YoY scale (-100% to +120%)
                const yoyMin = -100;
                const yoyMax = 120;
                const yAtYoy = (pct: number) => {
                  const clamped = Math.max(yoyMin, Math.min(yoyMax, pct));
                  return padT + plotH - ((clamped - yoyMin) / (yoyMax - yoyMin)) * plotH;
                };

                const yoyPts = part1RightSeries
                  .map((d, i) => {
                    if (d.yoyPct === null) return null;
                    const x = padL + i * (plotW / n) + plotW / n / 2;
                    return { x, y: yAtYoy(d.yoyPct), pct: d.yoyPct, yr: d.year, idx: i };
                  })
                  .filter((p): p is { x: number; y: number; pct: number; yr: string; idx: number } => p !== null);

                // Break SVG line when an intermediate year (Kyoto R1/2019 methodology break) has null YoY
                const yoyPath = yoyPts
                  .map((p, i) => {
                    const isBreakAfterPrev = i === 0 || p.idx !== yoyPts[i - 1].idx + 1;
                    return `${isBreakAfterPrev ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <svg
                    viewBox={`0 0 ${w} ${h}`}
                    className="w-full h-auto select-none overflow-visible"
                    role="img"
                    aria-label="Absolute Volume and YoY Chart"
                  >
                    {/* Right-axis YoY% reference ticks (+100%, 0%, -100%) */}
                    {[100, 0, -100].map((tick) => (
                      <g key={`yoy-tick-${tick}`}>
                        <line
                          x1={padL}
                          y1={yAtYoy(tick)}
                          x2={w - padR}
                          y2={yAtYoy(tick)}
                          stroke="currentColor"
                          strokeDasharray="2 3"
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="1"
                        />
                        <text
                          x={w - padR + 5}
                          y={yAtYoy(tick) + 3.5}
                          textAnchor="start"
                          className={`text-[11px] tabular-nums font-semibold ${
                            tick < 0
                              ? 'fill-rose-600 dark:fill-rose-400'
                              : tick > 0
                              ? 'fill-emerald-700 dark:fill-emerald-400'
                              : 'fill-slate-500 dark:fill-slate-400'
                          }`}
                        >
                          {tick > 0 ? `+${tick}%` : `${tick}%`}
                        </text>
                      </g>
                    ))}
                    {/* Baseline */}
                    <line
                      x1={padL}
                      y1={padT + plotH}
                      x2={w - padR}
                      y2={padT + plotH}
                      stroke="currentColor"
                      className="text-slate-300 dark:text-slate-700"
                      strokeWidth="1.2"
                    />

                    {/* Bars */}
                    {part1RightSeries.map((d, i) => {
                      const colW = plotW / n;
                      const barW = Math.max(14, colW * 0.62);
                      const x = padL + i * colW + (colW - barW) / 2;
                      const barH = Math.max(3, (d.value / maxVal) * plotH);
                      const y = padT + plotH - barH;

                      const isPeak =
                        (part1Region === 'japan' && d.year === '2019') ||
                        (part1Region === 'kyoto' && d.year === '2018') ||
                        (part1Region === 'nara' && d.year === '2019');
                      const isMethod2019 = part1Region === 'kyoto' && d.year === '2019';
                      const isCovid = Number(d.year) >= 2020;

                      const fillClass = isPeak
                        ? 'fill-[#FFD14C]'
                        : isMethod2019
                        ? 'fill-[#0D7287]/65 dark:fill-[#9BE7FA]/65'
                        : isCovid
                        ? 'fill-rose-500/80 dark:fill-rose-400/80'
                        : 'fill-[#0D7287] dark:fill-[#9BE7FA]';

                      const labelStr =
                        part1Region === 'japan'
                          ? fmtNum(d.value, 1, isEn)
                          : part1Region === 'kyoto'
                          ? fmtNum(d.value, 0, isEn)
                          : fmtNum(d.value, 0, isEn);

                      return (
                        <g key={d.year}>
                          <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={barH}
                            rx={3}
                            className={fillClass}
                          />
                          <text
                            x={x + barW / 2}
                            y={y - 5}
                            textAnchor="middle"
                            className={`text-[11px] tabular-nums font-bold ${
                              isPeak
                                ? 'fill-amber-800 dark:fill-[#FFD14C]'
                                : isCovid
                                ? 'fill-rose-600 dark:fill-rose-400'
                                : 'fill-slate-700 dark:fill-slate-200'
                            }`}
                          >
                            {labelStr}
                          </text>
                          <text
                            x={x + barW / 2}
                            y={h - 8}
                            textAnchor="middle"
                            className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold tabular-nums"
                          >
                            {d.year}
                          </text>
                        </g>
                      );
                    })}

                    {/* YoY% Line */}
                    <path
                      d={yoyPath}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.8"
                      strokeDasharray="3 2"
                    />
                    {yoyPts.map((pt) => (
                      <g key={`yoy-${pt.yr}`}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="3.2"
                          className={
                            pt.pct < 0
                              ? 'fill-rose-500 stroke-white dark:stroke-slate-900'
                              : 'fill-emerald-500 stroke-white dark:stroke-slate-900'
                          }
                          strokeWidth="1.2"
                        >
                          <title>{`${pt.yr} YoY: ${pt.pct > 0 ? '+' : ''}${fmtNum(pt.pct, 1, isEn)}%`}</title>
                        </circle>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </div>

            <p className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed tabular-nums">
              {part1Region === 'japan' ? (
                isEn ? (
                  <>
                    <strong>Audited:</strong> 2022 updated to <strong>3.83M</strong> (JNTO official; 2023 rebound: 25.07M).
                  </>
                ) : (
                  <>
                    <strong>Đã chuẩn hóa:</strong> 2022 chốt <strong>3,83M</strong> theo JNTO (2023 phục hồi 25,07M).
                  </>
                )
              ) : part1Region === 'kyoto' ? (
                isEn ? (
                  <>
                    <strong>Audited (-1yr shift):</strong> 2018 peak <strong>4,503.3k</strong>, R1/2019 <strong>3,799.0k</strong>, 2020 <strong>448.8k</strong>.
                  </>
                ) : (
                  <>
                    <strong>Đã lùi trục -1 năm:</strong> đỉnh 2018 <strong>4.503,3k</strong>, R1/2019 <strong>3.799,0k</strong>, 2020 <strong>448,8k</strong>.
                  </>
                )
              ) : isEn ? (
                <>
                  <strong>Audited (10× fix):</strong> 2020 corrected to <strong>289k</strong> (<code>28.9 万人</code>, -91.3% vs 2019).
                </>
              ) : (
                <>
                  <strong>Đã sửa đơn vị ×10:</strong> 2020 chốt <strong>289 nghìn</strong> (<code>28,9 万人</code>, giảm -91,3% vs 2019).
                </>
              )}
            </p>
          </div>
        </div>

        {/* ACCORDION BỐI CẢNH CHÍNH SÁCH (1950–2013) & PHƯƠNG PHÁP COUNTERFACTUAL */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPolicyContext((prev) => !prev)}
            aria-expanded={showPolicyContext}
            className="w-full min-h-[44px] px-5 py-3 flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <span>
              {isEn
                ? 'Policy Context (1950–2013) & Counterfactual Method Notes'
                : 'Bối cảnh 3 cột mốc chính sách (1950–2013) & Ghi chú phương pháp Counterfactual'}
            </span>
            {showPolicyContext ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            )}
          </button>

          {showPolicyContext && (
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(isEn ? POLICY_PILLARS_EN : HERITAGE_JAPAN_DATA.policyPillars).map((p, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3.5 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1"
                  >
                    <span className="inline-block text-[11px] font-bold text-[#074553] dark:text-[#9BE7FA]">
                      {p.year} · {p.focus}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {p.highlights[0]}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Method Caveat: The 2003–2012 log-linear fit has R² = 0.347 and p = 0.073 (sensitive to 2009 GFC & 2011 earthquake shocks) and does not isolate macroeconomic confounders—notably Abenomics JPY depreciation in 2012–2015 (~80 → ~121 JPY/USD), 2016–2019 JPY strengthening (~109 JPY/USD), and low-cost carrier expansion across East Asia.'
                  : 'Lưu ý phương pháp: Đường nền log-linear 2003–2012 có R² = 0,347 và p = 0,073 (chịu ảnh hưởng cú sốc 2009 và động đất 2011) nên không chứng minh quan hệ nhân quả độc lập; cần tính đến các biến nhiễu vĩ mô như đồng Yên giảm giá mạnh giai đoạn Abenomics 2012–2015 (~80 → ~121 JPY/USD), phục hồi ~109 JPY/USD giai đoạn 2016–2019 và làn sóng hãng bay giá rẻ Đông Á.'}
              </p>
            </div>
          )}
        </div>

        {/* NÚT ACCORDION: XEM BẢNG SỐ LIỆU CHI TIẾT 2013–2022 */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPart1Table((prev) => !prev)}
            aria-expanded={showPart1Table}
            className="w-full min-h-[48px] px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] text-xs font-extrabold">
                {isEn ? 'DATA TABLE' : 'BẢNG ĐỐI SOÁT'}
              </span>
              <span>
                {isEn
                  ? 'View detailed visitor & counterfactual data table (2013–2022)'
                  : 'Xem bảng số liệu chi tiết 2013–2022 (Toàn Nhật • TP. Kyoto • TP. Nara & Chỉ số 2013 = 100)'}
              </span>
            </span>
            {showPart1Table ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            )}
          </button>

          {showPart1Table && (
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs tabular-nums border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3 font-bold">{isEn ? 'Metric / Year' : 'Chỉ số / Năm'}</th>
                    {indexedSeries2013To2022.map((r) => (
                      <th key={r.year} className="py-2.5 px-2.5 font-extrabold text-right">
                        {r.year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&>tr:nth-child(even)]:bg-slate-50/60 dark:[&>tr:nth-child(even)]:bg-slate-800/30">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                      {isEn ? 'All Japan (Million)' : 'Toàn Nhật (Triệu lượt)'}
                    </td>
                    {indexedSeries2013To2022.map((r) => (
                      <td key={r.year} className="py-2 px-2.5 text-right font-semibold">
                        {r.japanVal !== null ? fmtNum(r.japanVal, r.year === '2022' ? 2 : 1, isEn) : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#074553] dark:text-[#9BE7FA]">
                      {isEn ? 'Kyoto Foreign Overnight (Thousand)' : 'Khách lưu trú NN TP. Kyoto (Nghìn)'}
                    </td>
                    {indexedSeries2013To2022.map((r) => (
                      <td key={r.year} className="py-2 px-2.5 text-right font-semibold">
                        {r.kyotoVal !== null ? fmtNum(r.kyotoVal, 1, isEn) : '-'}
                        {r.year === '2019' ? '*' : ''}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-amber-800 dark:text-[#FFE485]">
                      {isEn ? 'Nara Foreign Visitors (Thousand)' : 'Khách quốc tế TP. Nara (Nghìn)'}
                    </td>
                    {indexedSeries2013To2022.map((r) => (
                      <td key={r.year} className="py-2 px-2.5 text-right font-semibold">
                        {r.naraVal !== null ? fmtNum(r.naraVal, 0, isEn) : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-500 dark:text-slate-400">
                      {isEn ? 'Index: Japan / Kyoto / Nara (2013=100)' : 'Index: Nhật / Kyoto / Nara (2013=100)'}
                    </td>
                    {indexedSeries2013To2022.map((r) => (
                      <td key={r.year} className="py-2 px-2.5 text-right text-[11px] text-slate-500 dark:text-slate-400">
                        {r.japanIdx}/{r.kyotoIdx}/{r.naraIdx ?? '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
                {isEn
                  ? '*Note: Kyoto 2012 value was 844.9k. In R1/2019 (3,799.0k), Kyoto City revised its survey methodology. Optional 2023 updates: Japan = 25.07M, Kyoto = 5,357k.'
                  : '*Chú thích: Năm 2012 khách lưu trú nước ngoài tại Kyoto đạt 844,9 nghìn. Năm 2019* (3.799,0 nghìn) TP. Kyoto đổi phương pháp thống kê (R1/2019). Số liệu bổ sung 2023: Toàn Nhật = 25,07 triệu; TP. Kyoto = 5.357 nghìn.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 02 — CHI TIÊU DU LỊCH & ĐÓNG GÓP KINH TẾ
       * ===================================================================== */}
      <section id="sec-kyoto-nara" className="space-y-5 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" aria-hidden="true" />
            <span>
              {isEn
                ? '2. Visitors vs. Expenditure & GDP / GRDP Share'
                : '2. Tương quan Lượng khách – Chi tiêu & Tỷ trọng GDP / GRDP'}
            </span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Separates national inbound spend (¥4.81T) from municipal total spend (Domestic + Inbound) in Kyoto and Nara.'
              : 'Tách bạch chi tiêu quốc tế toàn Nhật (4,81T ¥) với tổng chi tiêu Nội địa + Quốc tế tại Kyoto và Nara.'}
          </p>
        </div>

        {/* 2 BIỂU ĐỒ XẾP NGANG (60% / 40% -> lg:col-span-7 / lg:col-span-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* TRÁI (60% -> col-span-7): DUAL-Axis COMBO CHART (CỘT = LƯỢNG KHÁCH | ĐƯỜNG = CHI TIÊU) */}
          <div className="lg:col-span-7 rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Dual-Axis Combo Chart (Bars = Visitors | Line = Expenditure)'
                    : 'Biểu đồ kết hợp 2 trục (Cột = Lượng khách | Đường = Chi tiêu)'}
                </span>

                {/* Nút gạt [Toàn Nhật | TP. Kyoto | TP. Nara] */}
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  {(
                    [
                      { key: 'japan', vi: 'Toàn Nhật', en: 'All Japan' },
                      { key: 'kyoto', vi: 'TP. Kyoto', en: 'Kyoto City' },
                      { key: 'nara', vi: 'TP. Nara', en: 'Nara City' },
                    ] as Array<{ key: RegionToggle; vi: string; en: string }>
                  ).map((tab) => {
                    const active = part2Region === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setPart2Region(tab.key)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#9BE7FA] text-[#074553] dark:text-slate-950'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {isEn ? tab.en : tab.vi}
                      </button>
                    );
                  })}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                {part2Region === 'japan'
                  ? isEn
                    ? 'Inbound Spend Grew 3.41× to ¥4.81T, Yet Per-Visitor Spend Eroded -14.6% After 2015'
                    : 'Chi tiêu quốc tế tăng 3,41× lên 4,81T Yên, nhưng chi tiêu/khách giảm -14,6% sau 2015'
                  : part2Region === 'kyoto'
                  ? isEn
                    ? 'Kyoto Total Spend Rose +87.0% to ¥1,308.2B (2018) Ahead of the 2019 Method Break'
                    : 'Tổng chi tiêu Kyoto tăng +87,0% lên 1.308,2 tỷ Yên (2018) trước mốc đổi phương pháp 2019'
                  : isEn
                  ? 'Nara Total Spend Grew +38.4% to ¥120.8B (2018) Then Slipped -5.0% Despite Record Arrivals'
                  : 'Chi tiêu du lịch Nara tăng +38,4% lên 120,8 tỷ Yên (2018) rồi lùi -5,0% dù khách lập đỉnh'}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {part2Region === 'japan'
                  ? isEn
                    ? 'Charts 3.1 & 3.4 (Synchronized Window 2013–2019) · Inbound Spend rose 3.41× from ¥1.41T to ¥4.81T (2020: ¥0.74T; 2021: ¥0.12T)'
                    : 'Biểu đồ 3.1 & 3.4 (Khung đồng bộ 2013–2019) · Chi tiêu quốc tế tăng 3,41 lần từ 1,41 lên 4,81 nghìn tỷ Yên (2020: 0,74; 2021: 0,12)'
                  : part2Region === 'kyoto'
                  ? isEn
                    ? 'Charts 3.2 & 3.5 (Synchronized Window 2013–2019) · Total spend grew +87.0% from ¥699.4B (2013) to ¥1,308.2B peak (2018); 2019 R1 new method: ¥1,236.7B'
                    : 'Biểu đồ 3.2 & 3.5 (Khung đồng bộ 2013–2019) · Tổng chi tiêu tăng +87,0% từ 699,4 tỷ (2013) lên đỉnh 1.308,2 tỷ Yên (2018); năm 2019 (PP mới): 1.236,7 tỷ'
                  : isEn
                  ? 'Charts 3.3 & 3.6 (Synchronized Window 2013–2019, converted from 億円) · Total spend rose +38.4% from ¥87.26B (2013) to ¥120.8B peak (2018), dipped -5.0% in 2019 (¥114.7B)'
                  : 'Biểu đồ 3.3 & 3.6 (Khung đồng bộ 2013–2019, đã chia 10 từ 億円) · Tổng chi tiêu tăng +38,4% từ 87,26 tỷ (2013) lên đỉnh 120,8 tỷ Yên (2018), giảm -5,0% năm 2019 còn 114,7 tỷ'}
              </p>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mb-2">
                <span className="inline-flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                  <span className="w-3 h-3 rounded-xs bg-[#0D7287]/80 dark:bg-[#9BE7FA]/80 inline-block" />
                  {part2Region === 'japan'
                    ? isEn
                      ? 'Left Axis: Inbound Visitors (Million)'
                      : 'Trục trái (Cột): Khách quốc tế (Triệu)'
                    : part2Region === 'kyoto'
                    ? isEn
                      ? 'Left Axis: Foreign Overnight Guests (Thousand)'
                      : 'Trục trái (Cột): Khách lưu trú nước ngoài (Nghìn)'
                    : isEn
                    ? 'Left Axis: Foreign Visitors (Thousand)'
                    : 'Trục trái (Cột): Khách quốc tế (Nghìn)'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-800 dark:text-[#FFD14C]">
                  <span className="w-3.5 h-1 rounded-full bg-[#D97706] dark:bg-[#FFD14C] inline-block" />
                  {part2Region === 'japan'
                    ? isEn
                      ? 'Right Axis: Inbound Spend (Trillion ¥)'
                      : 'Trục phải (Đường): Chi tiêu khách quốc tế (Nghìn tỷ ¥)'
                    : isEn
                    ? 'Right Axis: Total Spend Domestic + Inbound (Billion ¥)'
                    : 'Trục phải (Đường): Tổng chi tiêu Nội địa + Quốc tế (Tỷ ¥)'}
                </span>
              </div>

              {/* Dual-Axis SVG */}
              {(() => {
                const w = 620;
                const h = 255;
                const padL = 44;
                const padR = 46;
                const padT = 28;
                const padB = 32;
                const plotW = w - padL - padR;
                const plotH = h - padT - padB;
                const n = part2ComboSeries.length;

                const maxVis =
                  part2Region === 'japan' ? 35 : part2Region === 'kyoto' ? 5000 : 3600;
                const maxSpend =
                  part2Region === 'japan' ? 5.5 : part2Region === 'kyoto' ? 1500 : 140;

                const colW = plotW / n;
                const xCenter = (i: number) => padL + i * colW + colW / 2;
                const ySpend = (s: number) => padT + plotH - (s / maxSpend) * plotH;

                // Split spend points into contiguous segments (handling 2011-2012 gap in Kyoto)
                const segments: Array<Array<{ x: number; y: number; val: number; yr: string; isMethodBreak: boolean }>> = [];
                let currentSeg: Array<{ x: number; y: number; val: number; yr: string; isMethodBreak: boolean }> = [];

                part2ComboSeries.forEach((d, i) => {
                  if (d.spend === null || d.isGap) {
                    if (currentSeg.length > 0) {
                      segments.push(currentSeg);
                      currentSeg = [];
                    }
                  } else {
                    currentSeg.push({
                      x: xCenter(i),
                      y: ySpend(d.spend),
                      val: d.spend,
                      yr: d.year,
                      isMethodBreak: d.isMethodBreak,
                    });
                  }
                });
                if (currentSeg.length > 0) segments.push(currentSeg);

                return (
                  <svg
                    viewBox={`0 0 ${w} ${h}`}
                    className="w-full h-auto select-none overflow-visible"
                    role="img"
                    aria-label="Dual Axis Combo Chart"
                  >
                    {/* Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                      const y = padT + plotH * (1 - ratio);
                      const leftLabel = Math.round(maxVis * ratio);
                      const rightLabel =
                        part2Region === 'japan'
                          ? (maxSpend * ratio).toFixed(1)
                          : Math.round(maxSpend * ratio);
                      return (
                        <g key={idx}>
                          <line
                            x1={padL}
                            y1={y}
                            x2={w - padR}
                            y2={y}
                            stroke="currentColor"
                            strokeDasharray={ratio === 0 ? undefined : '2 3'}
                            className="text-slate-200 dark:text-slate-800"
                            strokeWidth="1"
                          />
                          <text
                            x={padL - 6}
                            y={y + 4}
                            textAnchor="end"
                            className="fill-slate-400 dark:fill-slate-500 text-[11px] tabular-nums"
                          >
                            {leftLabel}
                          </text>
                          <text
                            x={w - padR + 6}
                            y={y + 4}
                            textAnchor="start"
                            className="fill-amber-700/80 dark:fill-[#FFD14C]/80 text-[11px] tabular-nums font-semibold"
                          >
                            {rightLabel}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars (Visitors) */}
                    {part2ComboSeries.map((d, i) => {
                      const barW = Math.max(12, colW * 0.55);
                      const x = xCenter(i) - barW / 2;
                      const v = d.visitors ?? 0;
                      const barH = d.visitors !== null ? Math.max(3, (v / maxVis) * plotH) : 0;
                      const y = padT + plotH - barH;

                      return (
                        <g key={d.year}>
                          {d.isGap && (
                            <rect
                              x={padL + i * colW + 2}
                              y={padT}
                              width={colW - 4}
                              height={plotH}
                              className="fill-slate-100/80 dark:fill-slate-800/40"
                            />
                          )}
                          {d.visitors !== null && (
                            <rect
                              x={x}
                              y={y}
                              width={barW}
                              height={barH}
                              rx={2.5}
                              className={
                                d.isMethodBreak
                                  ? 'fill-[#0D7287]/55 dark:fill-[#9BE7FA]/55'
                                  : 'fill-[#0D7287]/80 dark:fill-[#9BE7FA]/75'
                              }
                            />
                          )}
                          <text
                            x={xCenter(i)}
                            y={h - 8}
                            textAnchor="middle"
                            className="fill-slate-600 dark:fill-slate-400 text-[11px] font-semibold tabular-nums"
                          >
                            {d.year}
                          </text>
                        </g>
                      );
                    })}

                    {/* Spend Line Segments */}
                    {segments.map((seg, sIdx) => {
                      // For Kyoto, draw dashed between 2018 and 2019
                      if (part2Region === 'kyoto' && seg.length >= 2) {
                        const pre = seg.filter((p) => Number(p.yr) <= 2018);
                        const brk = seg.filter((p) => p.yr === '2018' || p.yr === '2019');
                        const prePath = pre
                          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                          .join(' ');
                        const brkPath = brk
                          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                          .join(' ');
                        return (
                          <g key={`seg-${sIdx}`}>
                            <path d={prePath} fill="none" stroke="#D97706" strokeWidth="2.6" />
                            <path
                              d={brkPath}
                              fill="none"
                              stroke="#D97706"
                              strokeWidth="2.4"
                              strokeDasharray="5 3"
                            />
                          </g>
                        );
                      }
                      const pathD = seg
                        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                        .join(' ');
                      return (
                        <path
                          key={`seg-${sIdx}`}
                          d={pathD}
                          fill="none"
                          stroke="#D97706"
                          strokeWidth="2.6"
                        />
                      );
                    })}

                    {/* Spend Dots & Values */}
                    {segments.flat().map((pt) => {
                      const isPeakSpend =
                        (part2Region === 'japan' && pt.yr === '2019') ||
                        (part2Region === 'kyoto' && pt.yr === '2018') ||
                        (part2Region === 'nara' && pt.yr === '2018');
                      const digits =
                        part2Region === 'japan'
                          ? 2
                          : part2Region === 'kyoto'
                          ? 1
                          : pt.yr === '2018' || pt.yr === '2019' || pt.yr === '2021'
                          ? 1
                          : 2;
                      return (
                        <g key={`sp-${pt.yr}`}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isPeakSpend ? 4.5 : 3.2}
                            className="fill-[#FFD14C] stroke-amber-800 dark:stroke-slate-950"
                            strokeWidth="1.5"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 8}
                            textAnchor="middle"
                            className={`text-[11px] tabular-nums font-extrabold ${
                              isPeakSpend
                                ? 'fill-amber-900 dark:fill-[#FFD14C]'
                                : 'fill-amber-800 dark:fill-[#FFE485]'
                            }`}
                          >
                            {fmtNum(pt.val, digits, isEn)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Callout chú thích tách biệt phạm vi đo lường & Phát hiện Chi tiêu bình quân/khách (2013-2019) */}
            <div className="mt-3 space-y-2.5">
              <div className="p-3.5 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/70 border border-[#C8EEF7] dark:border-slate-700 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <strong className="text-[#074553] dark:text-[#9BE7FA]">
                    {isEn
                      ? 'All-Japan Inbound Spend per Visitor (2013–2019, Nominal JPY)'
                      : 'Chi tiêu bình quân/khách quốc tế Toàn Nhật (2013–2019, Yên danh nghĩa)'}
                  </strong>
                  <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {isEn ? '¥176.6k (2015) → ¥150.8k (2019) · -14.6%' : '176,6k ¥ (2015) → 150,8k ¥ (2019) · -14,6%'}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] tabular-nums">
                  {[
                    { yr: '2013', val: 135.6 },
                    { yr: '2014', val: 150.7 },
                    { yr: '2015', val: 176.6, peak: true },
                    { yr: '2016', val: 156.3 },
                    { yr: '2017', val: 153.7 },
                    { yr: '2018', val: 144.2 },
                    { yr: '2019', val: 150.8, end: true },
                  ].map((pt) => (
                    <div
                      key={pt.yr}
                      className={`rounded-lg py-1.5 px-1 border ${
                        pt.peak
                          ? 'bg-[#FFE485]/60 dark:bg-[#FFD14C]/20 border-[#FFD14C] font-extrabold text-amber-950 dark:text-[#FFE485]'
                          : pt.end
                          ? 'bg-rose-500/10 border-rose-500/30 font-bold text-rose-700 dark:text-rose-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{pt.yr}</div>
                      <div>{fmtNum(pt.val, 1, isEn)}k</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  {isEn
                    ? 'The -14.6% dip after 2015 reflects three combined drivers: ~10% JPY appreciation (121 → ~109 JPY/USD), cooling of 2015 Chinese Bakugai shopping, and faster growth of short-haul repeat East Asian visitors.'
                    : 'Mức giảm -14,6% sau 2015 chịu tác động đồng thời của 3 yếu tố: đồng Yên tăng giá ~10% (121 → ~109 JPY/USD), hạ nhiệt làn sóng mua sắm Bakugai (2015) và tỷ trọng khách Đông Á đi ngắn ngày tăng nhanh.'}
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {isEn
                    ? 'Scope: National = Inbound only (¥4.81T); Kyoto (¥1,308.2B) & Nara (¥120.8B) = Total (Domestic + Inbound). Day-tripping explains Nara’s level (~1/11 Kyoto), while 2019’s -5.0% dip in total spend also reflected the Oct 2019 tax hike, Typhoon Hagibis, and Korea boycott (Kyoto total spend also fell -5.5%).'
                    : 'Phạm vi: Toàn Nhật = chỉ khách quốc tế (4,81T ¥); Kyoto & Nara = tổng Nội địa + Quốc tế. Khách đi trong ngày giải thích mức nền thấp của Nara (~1/11 Kyoto), còn cú giảm -5,0% tổng chi tiêu năm 2019 còn chịu tác động tăng thuế tiêu dùng T10/2019, bão Hagibis và tẩy chay du lịch từ Hàn Quốc (Kyoto cũng giảm -5,5%).'}
                </span>
              </p>
            </div>
          </div>

          {/* PHẢI (40% -> col-span-5): BIỂU ĐỒ ĐỘ DỐC ĐÚNG TỶ LỆ THỜI GIAN (2000 -> 2014 -> 2019) */}
          <div className="lg:col-span-5 rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn ? 'Time-Proportional Slope · GDP & GRDP Share' : 'Độ dốc đúng tỷ lệ năm · GDP & GRDP'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {isEn
                  ? 'Kyoto’s Tourism Share Expanded 3.6× Faster Than Japan’s (+1.00 vs. +0.28 pts/yr)'
                  : 'Tỷ trọng du lịch trong kinh tế Kyoto tăng nhanh gấp 3,6× tốc độ toàn Nhật (+1,00 vs. +0,28 đpt/năm)'}
              </h3>

              {/* SVG Time-Proportional Slope Chart: x(2000)=66, x(2014)=285, x(2019)=364 so Kyoto's +1.00pt/yr is visually steeper than Japan's +0.28pt/yr */}
              {(() => {
                const w = 480;
                const h = 225;
                const x2000 = 68;
                const x2019 = 372;
                const xAtYear = (yr: number) => x2000 + ((yr - 2000) / 19) * (x2019 - x2000);
                const x2014 = xAtYear(2014);
                const padT = 30;
                const padB = 26;
                const plotH = h - padT - padB;
                const yMax = 14;
                const yAt = (val: number) => padT + plotH - (val / yMax) * plotH;

                const yJpStart = yAt(2.2);
                const yJpEnd = yAt(7.5);
                const yKyStart = yAt(7.0);
                const yKyEnd = yAt(12.0);

                return (
                  <svg
                    viewBox={`0 0 ${w} ${h}`}
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label="Time-Proportional Economic Contribution Slope Chart"
                  >
                    {[2000, 2014, 2019].map((yr) => (
                      <g key={yr}>
                        <line
                          x1={xAtYear(yr)}
                          y1={padT}
                          x2={xAtYear(yr)}
                          y2={padT + plotH}
                          stroke="currentColor"
                          strokeDasharray="3 3"
                          className="text-slate-300 dark:text-slate-700"
                          strokeWidth="1.3"
                        />
                        <text
                          x={xAtYear(yr)}
                          y={h - 6}
                          textAnchor="middle"
                          className="fill-slate-600 dark:fill-slate-400 text-[11px] font-bold tabular-nums"
                        >
                          {yr}
                        </text>
                      </g>
                    ))}

                    {/* Line 2: Kyoto GRDP (~7% 2014 -> ~12% 2019: 5-year steep climb) */}
                    <line x1={x2014} y1={yKyStart} x2={x2019} y2={yKyEnd} stroke="#D97706" strokeWidth="3" />
                    <circle cx={x2014} cy={yKyStart} r="5" className="fill-[#FFD14C] stroke-amber-800" strokeWidth="1.5" />
                    <circle cx={x2019} cy={yKyEnd} r="5.5" className="fill-[#FFD14C] stroke-amber-800" strokeWidth="1.5" />
                    <text x={x2014 - 8} y={yKyStart + 4} textAnchor="end" className="fill-amber-800 dark:fill-[#FFE485] text-[11.5px] font-extrabold tabular-nums">
                      ~7% (2014)
                    </text>
                    <text x={x2019 + 8} y={yKyEnd + 4} textAnchor="start" className="fill-amber-800 dark:fill-[#FFD14C] text-[11.5px] font-extrabold tabular-nums">
                      ~12% (2019)
                    </text>
                    <text x={x2014 - 8} y={yKyEnd - 2} textAnchor="end" className="fill-amber-800 dark:fill-[#FFE485] text-[10.5px] font-bold">
                      {isEn ? 'Kyoto GRDP (+1.00 pt/yr)' : 'GRDP Kyoto (+1,00 đpt/năm)'}
                    </text>

                    {/* Line 1: All Japan GDP (2.2% 2000 -> 7.5% 2019: 19-year span) */}
                    <line x1={x2000} y1={yJpStart} x2={x2019} y2={yJpEnd} stroke="currentColor" strokeWidth="3" className="text-[#0D7287] dark:text-[#9BE7FA]" />
                    <circle cx={x2000} cy={yJpStart} r="5" className="fill-[#0D7287] dark:fill-[#9BE7FA]" />
                    <circle cx={x2019} cy={yJpEnd} r="5.5" className="fill-[#0D7287] dark:fill-[#9BE7FA]" />
                    <text x={x2000 - 8} y={yJpStart + 4} textAnchor="end" className="fill-[#074553] dark:fill-[#9BE7FA] text-[11.5px] font-extrabold tabular-nums">
                      {isEn ? '2.2%' : '2,2%'}
                    </text>
                    <text x={x2019 + 8} y={yJpEnd + 4} textAnchor="start" className="fill-[#074553] dark:fill-[#9BE7FA] text-[11.5px] font-extrabold tabular-nums">
                      {isEn ? '7.5% (2019)' : '7,5% (2019)'}
                    </text>
                    <text x={(x2000 + x2014) / 2} y={(yJpStart + yJpEnd) / 2 + 24} textAnchor="middle" className="fill-[#074553] dark:fill-[#9BE7FA] text-[10.5px] font-bold">
                      {isEn ? 'Japan Total GDP (+0.28 pt/yr)' : 'GDP Toàn ngành (+0,28 đpt/năm)'}
                    </text>
                  </svg>
                );
              })()}
            </div>

            {/* 2 hộp chỉ số kinh tế xếp dọc rộng rãi */}
            <div className="space-y-2.5 tabular-nums text-xs">
              <div className="p-3 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/70 border border-[#C8EEF7] dark:border-slate-700">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
                    {isEn ? 'All Japan (WTTC, 2019)' : 'Toàn ngành Nhật (WTTC, 2019)'}
                  </span>
                  <strong className="text-slate-950 dark:text-white">
                    {isEn ? '¥41.94T (7.5% GDP)' : '41,94T ¥ (7,5% GDP)'}
                  </strong>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {isEn
                    ? 'Inbound spend ¥4.81T (~0.86% GDP, 11.5% of sector); remaining 88.5% combines direct domestic travel (~¥21.9T) plus indirect/induced supply-chain GDP (>4M jobs).'
                    : 'Khách quốc tế 4,81T ¥ (~0,86% GDP, 11,5% quy mô ngành); 88,5% còn lại gồm chi tiêu nội địa trực tiếp (~21,9T ¥) và hiệu ứng gián tiếp/lan tỏa (>4M việc làm).'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FFE485]/25 dark:bg-slate-800/70 border border-[#FFD14C]/50 dark:border-slate-700">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-extrabold text-amber-900 dark:text-[#FFE485]">
                    {isEn ? 'Kyoto City (2019)' : 'TP. Kyoto (2019)'}
                  </span>
                  <strong className="text-slate-950 dark:text-white">
                    {isEn ? '¥39B Tax (12.8%)' : '39 tỷ ¥ thuế (12,8%)'}
                  </strong>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn
                    ? '153,000 jobs = 12.4% of workforce (~12% municipal GRDP).'
                    : '153.000 việc làm = 12,4% lao động (~12% GRDP địa phương).'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 03 — QUÁ TẢI DU LỊCH & BẢO TỒN DI SẢN (3 TẦNG)
       * ===================================================================== */}
      <section id="sec-overtourism" className="space-y-5 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-[#FFD14C] shrink-0" aria-hidden="true" />
            <span>
              {isEn
                ? '3. Local Carrying Capacity Strain & 5 UNESCO Sites'
                : '3. Quá tải cục bộ & Ma trận giải pháp tại 5 Di sản UNESCO'}
            </span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Domestic visitors form 76%–94% of footfall; inbound spikes stack on top of dense domestic peaks.'
              : 'Khách nội địa chiếm 76%–94% tổng tải lượng; quá tải bùng phát khi sóng khách quốc tế cộng hưởng lên nền nội địa mùa cao điểm.'}
          </p>
        </div>

        {/* TẦNG 1: 2 BIỂU ĐỒ NGANG NHAU (CƠ CẤU KHÁCH & HỆ SỐ QUÁ TẢI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* TRÁI: BIỂU ĐỒ THANH CHỒNG 100% (100% STACKED BAR) CƠ CẤU KHÁCH NỘI ĐỊA VS QUỐC TẾ (2017) */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? '100% Stacked Bar · Domestic vs. International Mix (2017)'
                    : 'Biểu đồ thanh chồng 100% · Cơ cấu Khách nội địa vs Quốc tế (2017)'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
                  {isEn ? 'Section 4.2 Benchmark' : 'Mốc khảo sát Mục 4.2'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
                {isEn
                  ? 'Domestic Travelers Still Form 76%–94% of Footfall Across the Top 3 Heritage Sites (2017)'
                  : 'Khách nội địa chiếm 76%–94% tổng lượt tại 3 điểm di sản lớn, tạo tải nền liên tục (2017)'}
              </h3>

              <div className="flex items-center gap-4 text-xs font-semibold mb-4">
                <span className="inline-flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                  <span className="w-3 h-3 rounded-xs bg-[#0D7287] dark:bg-[#9BE7FA] inline-block" />
                  {isEn ? 'Domestic Visitors' : 'Khách nội địa'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-800 dark:text-[#FFD14C]">
                  <span className="w-3 h-3 rounded-xs bg-[#FFD14C] inline-block" />
                  {isEn ? 'International Visitors' : 'Khách quốc tế'}
                </span>
              </div>

              <div className="space-y-4 tabular-nums">
                {[
                  {
                    siteVi: 'TP. Kyoto (Lưu trú NN vs Tổng nội địa)',
                    siteEn: 'Kyoto City (Foreign overnight vs Total dom.)',
                    domLabelVi: '53,62 triệu lượt nội địa (93,8%)',
                    domLabelEn: '53.62M total domestic (93.8%)',
                    intlLabelVi: '3,53 triệu khách NN lưu trú (6,2%)',
                    intlLabelEn: '3.53M foreign overnight (6.2%)',
                    intlShare: 6.2,
                  },
                  {
                    siteVi: 'TP. Nara',
                    siteEn: 'Nara City',
                    domLabelVi: '16,31 triệu nội địa (89,1%)',
                    domLabelEn: '16.31M domestic (89.1%)',
                    intlLabelVi: '1,99 triệu quốc tế (10,9%)',
                    intlLabelEn: '1.99M international (10.9%)',
                    intlShare: 10.9,
                  },
                  {
                    siteVi: 'Vùng du lịch Phú Sĩ – Ngũ Hồ (rộng)',
                    siteEn: 'Greater Mt. Fuji / Five Lakes Area',
                    domLabelVi: '6,4 triệu nội địa (76,2%)',
                    domLabelEn: '6.4M domestic (76.2%)',
                    intlLabelVi: '~2 triệu quốc tế (23,8%)',
                    intlLabelEn: '~2M international (23.8%)',
                    intlShare: 23.8,
                  },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {isEn ? row.siteEn : row.siteVi}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isEn ? row.domLabelEn : row.domLabelVi} ·{' '}
                        <span className="text-amber-800 dark:text-[#FFD14C]">
                          {isEn ? row.intlLabelEn : row.intlLabelVi}
                        </span>
                      </span>
                    </div>

                    <div className="w-full h-6 rounded-lg overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] flex items-center pl-2.5 text-[11px] font-extrabold text-white dark:text-slate-950"
                        style={{ width: `${100 - row.intlShare}%` }}
                      >
                        {fmtNum(100 - row.intlShare, 1, isEn)}%
                      </div>
                      <div
                        className="h-full bg-[#FFD14C] flex items-center justify-end pr-2 text-[11px] font-extrabold text-slate-950"
                        style={{ width: `${row.intlShare}%` }}
                      >
                        {fmtNum(row.intlShare, 1, isEn)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed pt-3">
              {isEn
                ? 'Domestic travelers still form 76%–94% of physical footfall. Unit caveat: Kyoto pairs total domestic visits (53.62M incl. day-trippers) with foreign overnight guests (3.53M), so 6.2% is a lower bound excluding foreign day-trippers.'
                : 'Khách nội địa chiếm 76%–94% tổng tải lượng thực tế. Lưu ý đơn vị: TP. Kyoto đối chiếu tổng lượt nội địa (53,62M gồm đi trong ngày) với khách nước ngoài lưu trú qua đêm (3,53M), nên 6,2% là cận dưới (chưa tính khách quốc tế đi trong ngày).'}
            </p>
          </div>

          {/* PHẢI: BẢNG THẺ CHỈ SỐ ÁP LỰC ĐỘC LẬP (TRÁNH VẼ THANH TỶ LỆ GIẢ GIỮA 4 ĐƠN VỊ KHÁC NHAU) */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Independent Pressure Indicators (Non-Comparable Units)'
                    : '4 Chỉ số áp lực độc lập (Không gộp chung trục)'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FFE485]/50 text-amber-950 dark:bg-[#FFE485]/15 dark:text-[#FFE485]">
                  {isEn ? 'Capacity Multipliers' : 'Hệ số nhân áp lực'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                {isEn
                  ? 'Shirakawa-go Absorbed 3,000 Visits/Core Resident/Yr While Core Hotspots Scaled 2×–4×'
                  : 'Shirakawa-go chịu 3.000 lượt/cư dân lõi/năm trong khi các điểm di sản lõi tăng gấp 2×–4×'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                {isEn
                  ? 'Displayed as separate indicator cards because each hotspot uses a distinct unit (resident density vs. multi-year growth multiplier).'
                  : 'Trình bày theo 4 thẻ độc lập thay vì thanh độ dài chung vì mỗi chỉ số mang một đơn vị đo riêng (mật độ khách/cư dân vs. hệ số tăng trưởng theo kỳ).'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 tabular-nums">
                {[
                  {
                    labelVi: 'Làng cổ Shirakawa-go (khu lõi Ogimachi)',
                    labelEn: 'Shirakawa-go (Ogimachi core hamlet)',
                    subVi: '1,8M lượt/năm ÷ ~600 cư dân lõi (~8,2 khách/dân/ngày bình quân; cực đại dịp thắp sáng mùa đông)',
                    subEn: '1.8M visits/yr ÷ ~600 Ogimachi residents (~8.2/day avg; peaking sharply on winter light-up nights)',
                    badge: isEn ? '3,000×/yr' : '3.000×/năm',
                    cardClass: 'border-rose-500/30 bg-rose-500/5',
                    valClass: 'text-rose-700 dark:text-rose-400',
                  },
                  {
                    labelVi: 'Khách lưu trú NN TP. Kyoto (2013–2018)',
                    labelEn: 'Kyoto Foreign Overnight (2013–2018)',
                    subVi: 'Tăng từ 1,13 triệu (2013) lên đỉnh 4,50 triệu lượt (2018, +299,3%)',
                    subEn: 'Surged from 1.13M (2013) to 4.50M peak (2018, +299.3%)',
                    badge: isEn ? '4.0×' : '4,0×',
                    cardClass: 'border-[#9BE7FA]/80 bg-[#F0F9FB] dark:bg-slate-800/70',
                    valClass: 'text-[#074553] dark:text-[#9BE7FA]',
                  },
                  {
                    labelVi: 'Quỹ phòng khách sạn TP. Kyoto (2013–2018)',
                    labelEn: 'Kyoto Hotel Rooms (2013–2018)',
                    subVi: 'Mở rộng từ <30.000 lên ~53.000 phòng (tăng chậm hơn 2,2 lần so với cầu lưu trú)',
                    subEn: 'Expanded from <30,000 to ~53,000 rooms (lagging lodging demand by 2.2×)',
                    badge: isEn ? '1.8×' : '1,8×',
                    cardClass: 'border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50',
                    valClass: 'text-slate-900 dark:text-white',
                  },
                  {
                    labelVi: 'Vùng lõi Di sản Núi Phú Sĩ / Trạm 5 (2012–2019)',
                    labelEn: 'Mt. Fuji Core / 5th Station (2012–2019)',
                    subVi: 'Tăng gấp 2,2× đạt 5,06M lượt (vùng lõi hẹp hơn toàn vùng Ngũ Hồ 8,4M ở biểu đồ trái)',
                    subEn: 'Expanded 2.2× to 5.06M visits (narrower core zone vs. 8.4M Greater Five Lakes on left)',
                    badge: isEn ? '2.2×' : '2,2×',
                    cardClass: 'border-[#FFD14C]/70 bg-[#FFE485]/20 dark:bg-slate-800/70',
                    valClass: 'text-amber-900 dark:text-[#FFE485]',
                  },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-xl border p-3.5 space-y-1.5 ${item.cardClass}`}>
                    <div className={`text-2xl font-extrabold tracking-tight ${item.valClass}`}>
                      {item.badge}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {isEn ? item.labelEn : item.labelVi}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isEn ? item.subEn : item.subVi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TẦNG 3: ACCORDION BẢNG ĐỐI SÁNH 5 DI SẢN UNESCO (ĐÓNG MẶC ĐỊNH ĐỂ GIỮ TRANG THOÁNG) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowUnescoMatrix((prev) => !prev)}
            aria-expanded={showUnescoMatrix}
            className="w-full min-h-[48px] px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div>
              <span>
                {isEn
                  ? 'Comparative Matrix: 5 UNESCO World Heritage Sites & Local Interventions'
                  : 'Xem bảng đối sánh chi tiết 5 Di sản UNESCO & Giải pháp điều tiết'}
              </span>
              <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Kyoto · Shirakawa-go · Itsukushima (Miyajima) · Mt. Fuji · Nara'
                  : 'Kyoto · Shirakawa-go · Đền Itsukushima (Miyajima) · Núi Phú Sĩ · Nara'}
              </span>
            </div>
            {showUnescoMatrix ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            )}
          </button>

          {showUnescoMatrix && (
            <div className="overflow-x-auto border-t border-slate-100 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-4">{isEn ? 'UNESCO Heritage Site' : 'Di sản UNESCO'}</th>
                    <th className="py-2.5 px-4">{isEn ? 'Peak Pressure Metric' : 'Chỉ số áp lực'}</th>
                    <th className="py-2.5 px-4">{isEn ? 'Core Bottleneck' : 'Vấn đề cốt lõi'}</th>
                    <th className="py-2.5 px-4">{isEn ? 'Intervention' : 'Giải pháp can thiệp'}</th>
                  </tr>
                </thead>
                <tbody className="[&>tr:nth-child(even)]:bg-slate-50/70 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
                  {(isEn ? CASE_STUDIES_EN : HERITAGE_JAPAN_DATA.caseStudies).map((cs, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="py-2.5 px-4 font-bold whitespace-nowrap align-top">
                        <div className="text-slate-900 dark:text-white">{cs.site}</div>
                        <div className="text-[11px] font-normal text-slate-500">{cs.type}</div>
                      </td>
                      <td className="py-2.5 px-4 font-bold tabular-nums text-[#074553] dark:text-[#9BE7FA] align-top">
                        {cs.pressureMetric}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 align-top">
                        {cs.coreIssue}
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-medium align-top">
                        {cs.intervention}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
       * PHẦN 04 — NHẬT KÝ KIỂM TOÁN DỮ LIỆU (DATA AUDIT), KỊCH BẢN CHÍNH SÁCH & CODE
       * ===================================================================== */}
      <section
        id="sec-data-audit"
        className="rounded-3xl p-5 sm:p-7 bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 space-y-6 scroll-mt-24"
      >
        {/* 4A: BẢNG ĐỐI SOÁT KIỂM TOÁN DỮ LIỆU (5 LỖI PHÁT HIỆN TỪ NIÊN LUẬN GỐC) */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" aria-hidden="true" />
              <span>
                {isEn
                  ? '4. Empirical Data Audit Log & Quantified Policy Scenarios'
                  : '4. Nhật ký Kiểm toán Dữ liệu (Data Audit) & Kịch bản Chính sách'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'Cross-checking official Japanese reports (JNTO, Kyoto, Nara) corrected 5 errors in the 2024 thesis before modeling.'
                : 'Đối chiếu trực tiếp báo cáo gốc tiếng Nhật (JNTO, Kyoto, Nara) đã phát hiện và sửa 5 sai lệch trước khi chạy mô hình.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3.5 font-bold whitespace-nowrap">{isEn ? 'Audit ID' : 'Mã'}</th>
                    <th className="py-2.5 px-3.5 font-bold">{isEn ? 'Before (Original Thesis)' : 'Trước kiểm toán (Niên luận gốc)'}</th>
                    <th className="py-2.5 px-3.5 font-bold">{isEn ? 'After (Audited Fix)' : 'Sau hiệu chỉnh (Nguồn gốc Nhật)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {HERITAGE_JAPAN_DATA.thesisLimitations.map((lim) => (
                    <tr key={lim.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50">
                      <td className="py-2.5 px-3.5 align-top whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#C8EEF7]/60 dark:bg-[#9BE7FA]/15 text-[#074553] dark:text-[#9BE7FA] font-extrabold text-[11px]">
                          {lim.id}
                        </span>
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {lim.category}
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 align-top text-rose-700 dark:text-rose-300/90 leading-snug">
                        {lim.flawInThesis}
                      </td>
                      <td className="py-2.5 px-3.5 align-top text-slate-800 dark:text-slate-200 leading-snug">
                        {lim.portfolioFix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4B: LƯỚI CHẴN 4 THẺ KHUYẾN NGHỊ CHÍNH SÁCH GỌN */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
            {isEn
              ? 'Policy Evaluation & Transferable Governance Lessons'
              : '4 Đánh giá chính sách & Bài học quản trị di sản'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {POLICY_RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                className="rounded-2xl p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    {isEn ? rec.ownerEn : rec.ownerVi}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-950 dark:text-white leading-snug">
                    {isEn ? rec.titleEn : rec.titleVi}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? rec.descEn : rec.descVi}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] tabular-nums">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{isEn ? rec.metricEn : rec.metricVi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KHỐI CODE NỀN ĐEN CUỐI TRANG: MẶC ĐỊNH Ở TRẠNG THÁI ĐÓNG (ACCORDION) */}
        <div
          id="sec-sql-python"
          className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden scroll-mt-24"
        >
          <button
            type="button"
            onClick={() => setShowCodeAccordion((prev) => !prev)}
            aria-expanded={showCodeAccordion}
            className="w-full min-h-[52px] px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" aria-hidden="true" />
              <span>
                {isEn
                  ? 'View SQL & Python data reconciliation code (Window Functions • Series Normalization)'
                  : 'Xem mã nguồn SQL & Python đối soát dữ liệu (Window Functions • Chuẩn hóa chuỗi)'}
              </span>
            </span>
            {showCodeAccordion ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            )}
          </button>

          {showCodeAccordion && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {HERITAGE_SQL_PYTHON_SNIPPETS.map((snip, idx) => (
                    <button
                      key={snip.id}
                      type="button"
                      onClick={() => setSelectedCodeIdx(idx)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        selectedCodeIdx === idx
                          ? 'bg-[#9BE7FA] text-[#074553] border-[#0D7287]/30'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isEn ? snip.labelEn : snip.labelVi}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(HERITAGE_SQL_PYTHON_SNIPPETS[selectedCodeIdx].code)}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
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

              <pre className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-100 text-xs font-mono leading-relaxed overflow-x-auto border border-slate-800">
                <code>{HERITAGE_SQL_PYTHON_SNIPPETS[selectedCodeIdx].code}</code>
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-heritage-japan"
        attribution={{
          datasetVi:
            'Dữ liệu chuỗi thời gian JNTO, MLIT, TP. Kyoto, TP. Nara & Niên luận Khoa Đông Phương học (ĐHKHXH&NV - ĐHQGHN)',
          datasetEn:
            'JNTO, MLIT, Kyoto City, Nara City Time-Series & Undergraduate Thesis at Faculty of Oriental Studies (VNU-USSH)',
          scopeVi:
            '6 chuỗi thời gian đã đối soát (2003–2022) · 25 di sản UNESCO tại Nhật Bản',
          scopeEn:
            '6 audited time-series (2003–2022) · 25 UNESCO World Heritage sites in Japan',
        }}
      />
    </div>
  );
}
