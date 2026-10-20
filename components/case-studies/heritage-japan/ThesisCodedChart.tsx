'use client';

import React, { useState } from 'react';

export interface ThesisFigureDataPoint {
  label: string;
  value: number;
  displayValue?: string;
  isPeak?: boolean;
  isTrough?: boolean;
  isCovid?: boolean;
  event?: string;
  note?: string;
}

export interface ThesisFigureItem {
  id: number;
  code: string;
  chartId: string;
  type: 'bar' | 'line';
  title: { vi: string; en: string };
  shortTitle: { vi: string; en: string };
  stat: string;
  unit: { vi: string; en: string };
  source: string;
  pageInDoc: number;
  yMax: number;
  yTicks: number[];
  scanSrc: string;
  src?: string;
  data: ThesisFigureDataPoint[];
  auditInsight?: { vi: string; en: string };
}

export const THESIS_FIGURES: ThesisFigureItem[] = [
  {
    id: 1,
    code: 'Hình 3.1',
    chartId: '3.1',
    type: 'bar',
    title: {
      vi: 'Số lượng khách du lịch nước ngoài đến Nhật Bản (2003 – 2022)',
      en: 'International Visitors to Japan (2003 – 2022)'
    },
    shortTitle: {
      vi: 'Khách quốc tế đến Nhật Bản',
      en: 'Inbound Visitors to Japan'
    },
    stat: 'Đỉnh 31,9M (2019) • Đáy COVID 0,2M (2021)',
    unit: { vi: 'Triệu người', en: 'Million visitors' },
    source: 'Tổng cục Du lịch Nhật Bản (JNTO)',
    pageInDoc: 30,
    yMax: 35,
    yTicks: [0, 10, 20, 30, 35],
    scanSrc: '/heritage-japan/thesis-chart-3-1.png',
    auditInsight: {
      vi: 'Tăng trưởng ngoạn mục gấp 6,1 lần từ 5,2M (2003) lên đỉnh 31,9M (2019) nhờ nới lỏng thị thực và Đạo luật Di sản 2015 trước khi sụp đổ do COVID-19.',
      en: 'Remarkable 6.1x surge from 5.2M (2003) to a 31.9M peak (2019) driven by visa reforms and the 2015 Japan Heritage Act before the COVID-19 plunge.'
    },
    data: [
      { label: '2003', value: 5.2 },
      { label: '2004', value: 6.1 },
      { label: '2005', value: 6.7 },
      { label: '2006', value: 7.3 },
      { label: '2007', value: 8.3 },
      { label: '2008', value: 8.4 },
      { label: '2009', value: 6.8 },
      { label: '2010', value: 8.6 },
      { label: '2011', value: 6.2, event: 'Động đất Tohoku' },
      { label: '2012', value: 8.4 },
      { label: '2013', value: 10.4, event: 'Chương trình 2013' },
      { label: '2014', value: 13.4 },
      { label: '2015', value: 19.7, event: 'Japan Heritage' },
      { label: '2016', value: 24.0 },
      { label: '2017', value: 28.7 },
      { label: '2018', value: 31.2 },
      { label: '2019', value: 31.9, isPeak: true },
      { label: '2020', value: 4.1, isCovid: true },
      { label: '2021', value: 0.2, isTrough: true, isCovid: true },
      { label: '2022', value: 3.4 }
    ]
  },
  {
    id: 2,
    code: 'Hình 3.2',
    chartId: '3.2',
    type: 'bar',
    title: {
      vi: 'Số lượng khách du lịch nước ngoài đến Kyoto (2008 – 2023)',
      en: 'International Visitors to Kyoto (2008 – 2023)'
    },
    shortTitle: {
      vi: 'Khách quốc tế đến Kyoto',
      en: 'Inbound Visitors to Kyoto'
    },
    stat: 'Đỉnh 4.503,3k (2019) • DMO KYOTO',
    unit: { vi: 'Nghìn người', en: 'Thousand visitors' },
    source: 'Cục Du lịch Kyoto / DMO KYOTO',
    pageInDoc: 31,
    yMax: 5000,
    yTicks: [0, 1000, 2000, 3000, 4000, 5000],
    scanSrc: '/heritage-japan/thesis-chart-3-2.png',
    auditInsight: {
      vi: 'Kyoto đạt đỉnh 4,5 triệu lượt khách quốc tế (2019), chiếm 14,1% thị phần toàn quốc. Lưu ý đồ thị gốc in 3799k năm 2020 (chuẩn hóa thành 379,9k).',
      en: 'Kyoto reached a peak of 4.5M inbound visitors (2019), capturing 14.1% of national share. Note: original thesis printed 3799k for 2020 (normalized to 379.9k).'
    },
    data: [
      { label: '2008', value: 926.8 },
      { label: '2009', value: 937.2 },
      { label: '2010', value: 783.8 },
      { label: '2011', value: 983.9 },
      { label: '2012', value: 515.4 },
      { label: '2013', value: 844.9 },
      { label: '2014', value: 1127.9 },
      { label: '2015', value: 1828.6 },
      { label: '2016', value: 3158.6 },
      { label: '2017', value: 3184.8 },
      { label: '2018', value: 3527.8 },
      { label: '2019', value: 4503.3, isPeak: true },
      { label: '2020', value: 379.9, displayValue: '379.9*', note: 'Gốc in 3799k', isCovid: true },
      { label: '2021', value: 448.8, isCovid: true },
      { label: '2022', value: 54.4, isTrough: true },
      { label: '2023', value: 576.1 }
    ]
  },
  {
    id: 3,
    code: 'Hình 3.3',
    chartId: '3.3',
    type: 'bar',
    title: {
      vi: 'Số lượng khách du lịch nước ngoài đến Cố đô Nara (2009 – 2020)',
      en: 'International Visitors to Nara (2009 – 2020)'
    },
    shortTitle: {
      vi: 'Khách quốc tế đến Cố đô Nara',
      en: 'Inbound Visitors to Nara'
    },
    stat: 'Đỉnh 3.318k (2019) • Giảm -99,1% (2020)',
    unit: { vi: 'Nghìn người', en: 'Thousand visitors' },
    source: 'Cục Du lịch Tỉnh Nara (Nara Prefecture)',
    pageInDoc: 31,
    yMax: 3500,
    yTicks: [0, 1000, 2000, 3000, 3500],
    scanSrc: '/heritage-japan/thesis-chart-3-3.png',
    auditInsight: {
      vi: 'Nara bứt phá mạnh từ 407k (2009) lên 3,32M (2019) gấp 8,1 lần nhờ mô hình tham quan kết hợp Kyoto-Nara, nhưng rơi tự do -99,1% khi dịch bùng phát.',
      en: 'Nara expanded 8.1x from 407k (2009) to 3.32M (2019) via joint Kyoto-Nara itineraries, but suffered a severe -99.1% drop during the pandemic.'
    },
    data: [
      { label: '2009', value: 407.0 },
      { label: '2010', value: 629.0 },
      { label: '2011', value: 174.0 },
      { label: '2012', value: 267.0 },
      { label: '2013', value: 435.0 },
      { label: '2014', value: 630.0 },
      { label: '2015', value: 975.0 },
      { label: '2016', value: 1576.0 },
      { label: '2017', value: 1990.0 },
      { label: '2018', value: 2651.0 },
      { label: '2019', value: 3318.0, isPeak: true },
      { label: '2020', value: 28.9, isTrough: true, isCovid: true }
    ]
  },
  {
    id: 4,
    code: 'Hình 3.4',
    chartId: '3.4',
    type: 'line',
    title: {
      vi: 'Chi tiêu du lịch của khách quốc tế tại Nhật Bản (2010 – 2021)',
      en: 'Inbound Tourism Expenditure in Japan (2010 – 2021)'
    },
    shortTitle: {
      vi: 'Chi tiêu du lịch quốc tế toàn quốc',
      en: 'National Inbound Tourism Spend'
    },
    stat: 'Đỉnh 4,81 nghìn tỷ ¥ (2019) • JTA',
    unit: { vi: 'Nghìn tỷ Yên', en: 'Trillion JPY' },
    source: 'Cục Du lịch Nhật Bản (JTA / 観光庁)',
    pageInDoc: 33,
    yMax: 5.5,
    yTicks: [0, 1, 2, 3, 4, 5],
    scanSrc: '/heritage-japan/thesis-chart-3-4.png',
    auditInsight: {
      vi: 'Tổng chi tiêu tăng từ 1,15 lên 4,81 nghìn tỷ Yên (+318%) giai đoạn 2010–2019, khẳng định du lịch di sản trở thành trụ cột xuất khẩu dịch vụ của Nhật.',
      en: 'Inbound spend jumped from 1.15T to 4.81T JPY (+318%) between 2010 and 2019, cementing heritage tourism as a cornerstone service export.'
    },
    data: [
      { label: '2010', value: 1.15 },
      { label: '2011', value: 0.81 },
      { label: '2012', value: 1.08 },
      { label: '2013', value: 1.41 },
      { label: '2014', value: 2.02 },
      { label: '2015', value: 3.48 },
      { label: '2016', value: 3.75 },
      { label: '2017', value: 4.41 },
      { label: '2018', value: 4.50 },
      { label: '2019', value: 4.81, isPeak: true },
      { label: '2020', value: 0.70, isCovid: true },
      { label: '2021', value: 0.10, isTrough: true, isCovid: true }
    ]
  },
  {
    id: 5,
    code: 'Hình 3.5',
    chartId: '3.5',
    type: 'line',
    title: {
      vi: 'Chi tiêu du lịch tại Thành phố Kyoto (2008 – 2020)',
      en: 'Tourism Expenditure in Kyoto City (2008 – 2020)'
    },
    shortTitle: {
      vi: 'Chi tiêu du lịch tại Kyoto',
      en: 'Tourism Spend in Kyoto City'
    },
    stat: 'Đỉnh 1.308,1 tỷ ¥ (2019) • Khảo sát Kyoto',
    unit: { vi: 'Tỷ Yên', en: 'Billion JPY' },
    source: 'Khảo sát Du lịch Thành phố Kyoto (Kyoto Tourism Survey)',
    pageInDoc: 33,
    yMax: 1500,
    yTicks: [0, 300, 600, 900, 1200, 1500],
    scanSrc: '/heritage-japan/thesis-chart-3-5.png',
    auditInsight: {
      vi: 'Doanh thu du lịch Kyoto tăng gấp đôi từ 649,1 tỷ ¥ (2008) lên đỉnh 1.308,1 tỷ ¥ (2019). Ngay cả năm 2020 dịch bệnh, chi tiêu nội địa vẫn giữ ở mức 1.236 tỷ ¥.',
      en: 'Kyoto tourism revenue doubled from 649.1B (2008) to 1,308.1B JPY (2019). Domestic travel sustained 1,236B JPY even in 2020.'
    },
    data: [
      { label: '2008', value: 649.1 },
      { label: '2009', value: 655.9 },
      { label: '2010', value: 608.1 },
      { label: '2011', value: 648.8 },
      { label: '2014', value: 699.4 },
      { label: '2015', value: 761.7 },
      { label: '2016', value: 970.1 },
      { label: '2017', value: 1085.5 },
      { label: '2018', value: 1126.4 },
      { label: '2019', value: 1308.1, isPeak: true },
      { label: '2020', value: 1236.2 }
    ]
  },
  {
    id: 6,
    code: 'Hình 3.6',
    chartId: '3.6',
    type: 'line',
    title: {
      vi: 'Chi tiêu du lịch tại Nara (2013 – 2022)',
      en: 'Tourism Expenditure in Nara (2013 – 2022)'
    },
    shortTitle: {
      vi: 'Chi tiêu du lịch tại Nara',
      en: 'Tourism Spend in Nara'
    },
    stat: 'Đỉnh 1.208,0 tỷ ¥ (2018) • Thống kê Nara',
    unit: { vi: 'Tỷ Yên (Số liệu tổng hợp)', en: 'Billion JPY (Comprehensive)' },
    source: 'Cục Thống kê Tỉnh Nara (Nara Prefecture Statistics)',
    pageInDoc: 34,
    yMax: 1400,
    yTicks: [0, 300, 600, 900, 1200, 1400],
    scanSrc: '/heritage-japan/thesis-chart-3-6.png',
    auditInsight: {
      vi: 'Chi tiêu tại Nara đạt đỉnh 1.208 tỷ ¥ (2018) rồi giảm xuống 402,2 tỷ ¥ (2020) do dịch bệnh, sau đó phục hồi dần lên 598 tỷ ¥ (2022).',
      en: 'Nara tourism spend peaked at 1,208B JPY (2018), slumped to 402.2B (2020) during pandemic, then rebounded to 598B (2022).'
    },
    data: [
      { label: '2013', value: 872.6 },
      { label: '2014', value: 892.4 },
      { label: '2015', value: 994.6 },
      { label: '2016', value: 1035.9 },
      { label: '2017', value: 1128.6 },
      { label: '2018', value: 1208.0, isPeak: true },
      { label: '2019', value: 1147.2 },
      { label: '2020', value: 402.2, isCovid: true, isTrough: true },
      { label: '2021', value: 428.0 },
      { label: '2022', value: 598.0 }
    ]
  }
];

THESIS_FIGURES.forEach((fig) => {
  fig.src = fig.scanSrc;
});

interface ThesisCodedChartProps {
  figure: ThesisFigureItem;
  isThumbnail?: boolean;
  lang?: 'vi' | 'en';
}

export function ThesisCodedChart({ figure, isThumbnail = false, lang = 'vi' }: ThesisCodedChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (isThumbnail) {
    return <ThumbnailChart figure={figure} />;
  }

  return (
    <FullModalChart
      figure={figure}
      lang={lang}
      hoveredIdx={hoveredIdx}
      setHoveredIdx={setHoveredIdx}
    />
  );
}

/**
 * THUMBNAIL MINI-CHART: Dành cho 6 thẻ xem trước ở chế độ lưới
 * ViewBox 280 x 115, thiết kế siêu nét, tương thích sáng / tối
 */
function ThumbnailChart({ figure }: { figure: ThesisFigureItem }) {
  const w = 280;
  const h = 115;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 18;
  const padBottom = 20;

  const plotW = w - padLeft - padRight;
  const plotH = h - padTop - padBottom;
  const n = figure.data.length;

  const firstYear = figure.data[0]?.label.slice(-2);
  const lastYear = figure.data[n - 1]?.label.slice(-2);
  const peakItem = figure.data.find((d) => d.isPeak) || figure.data[0];

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full overflow-visible"
        aria-label={figure.code}
      >
        <defs>
          <linearGradient id={`thumb-line-grad-${figure.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal faint reference gridlines */}
        <line
          x1={padLeft}
          y1={padTop}
          x2={w - padRight}
          y2={padTop}
          stroke="currentColor"
          strokeDasharray="2 3"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth="1"
        />
        <line
          x1={padLeft}
          y1={padTop + plotH * 0.5}
          x2={w - padRight}
          y2={padTop + plotH * 0.5}
          stroke="currentColor"
          strokeDasharray="2 3"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth="1"
        />
        <line
          x1={padLeft}
          y1={padTop + plotH}
          x2={w - padRight}
          y2={padTop + plotH}
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
          strokeWidth="1"
        />

        {figure.type === 'bar' ? (
          // BAR CHART
          figure.data.map((d, i) => {
            const barW = Math.max(3.5, (plotW / n) * 0.65);
            const x = padLeft + i * (plotW / n) + (plotW / n - barW) / 2;
            const barH = Math.max(2, (d.value / figure.yMax) * plotH);
            const y = padTop + plotH - barH;

            let fillClass = 'fill-[#0D7287] hover:fill-[#095262] dark:fill-[#9BE7FA] dark:hover:fill-[#C8EEF7]';
            if (d.isPeak) fillClass = 'fill-[#FFD14C] dark:fill-[#FFD14C]';
            if (d.isTrough || d.isCovid) fillClass = 'fill-rose-500 hover:fill-rose-600 dark:fill-rose-400 dark:hover:fill-rose-300';

            return (
              <rect
                key={d.label}
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={1.5}
                className={`${fillClass} transition-colors duration-200`}
              />
            );
          })
        ) : (
          // LINE CHART
          (() => {
            const points = figure.data.map((d, i) => {
              const x = padLeft + (i / (n - 1)) * plotW;
              const y = padTop + plotH - (d.value / figure.yMax) * plotH;
              return { x, y, ...d };
            });

            const pathD = points.reduce(
              (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
              ''
            );

            const areaD = `${pathD} L ${points[n - 1].x.toFixed(1)} ${padTop + plotH} L ${points[0].x.toFixed(1)} ${padTop + plotH} Z`;

            return (
              <g>
                <path d={areaD} fill={`url(#thumb-line-grad-${figure.id})`} />
                <path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-sky-600 dark:text-sky-400"
                />
                {points.map((pt) => {
                  if (pt.isPeak) {
                    return (
                      <circle
                        key={pt.label}
                        cx={pt.x}
                        cy={pt.y}
                        r="3.5"
                        className="fill-cyan-600 dark:fill-cyan-400 stroke-white dark:stroke-slate-900"
                        strokeWidth="1.5"
                      />
                    );
                  }
                  return (
                    <circle
                      key={pt.label}
                      cx={pt.x}
                      cy={pt.y}
                      r="1.8"
                      className="fill-sky-600 dark:fill-sky-400"
                    />
                  );
                })}
              </g>
            );
          })()
        )}

        {/* Year labels at bottom */}
        <text
          x={padLeft}
          y={h - 4}
          textAnchor="start"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] tabular-nums font-medium"
        >
          &apos;{firstYear}
        </text>

        <text
          x={w / 2}
          y={h - 4}
          textAnchor="middle"
          className="fill-cyan-600 dark:fill-cyan-400 text-[11px] tabular-nums font-bold"
        >
          Đỉnh &apos;{peakItem.label.slice(-2)}: {peakItem.value.toLocaleString('vi-VN')}
        </text>

        <text
          x={w - padRight}
          y={h - 4}
          textAnchor="end"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] tabular-nums font-medium"
        >
          &apos;{lastYear}
        </text>
      </svg>
    </div>
  );
}

/**
 * FULL MODAL CHART: Biểu đồ học thuật chi tiết cao với trục tọa độ, lưới số liệu, giá trị từng điểm
 * và hộp chú thích sự kiện chính sách
 */
function FullModalChart({
  figure,
  lang,
  hoveredIdx,
  setHoveredIdx
}: {
  figure: ThesisFigureItem;
  lang: 'vi' | 'en';
  hoveredIdx: number | null;
  setHoveredIdx: (_idx: number | null) => void;
}) {
  const w = 780;
  const h = 360;
  const padLeft = 60;
  const padRight = 35;
  const padTop = 35;
  const padBottom = 50;

  const plotW = w - padLeft - padRight;
  const plotH = h - padTop - padBottom;
  const n = figure.data.length;

  const activePoint = hoveredIdx !== null ? figure.data[hoveredIdx] : null;

  return (
    <div className="w-full space-y-3">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs tabular-nums font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            {figure.code} • Trang {figure.pageInDoc}
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {figure.unit[lang]}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs tabular-nums">
          <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA] inline-block" />
            {lang === 'vi' ? 'Số liệu niên luận' : 'Empirical Data'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#92400E] dark:text-[#FFD14C] font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C] inline-block" />
            {lang === 'vi' ? 'Năm đỉnh cao (Peak)' : 'Peak Year'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#B45309] dark:text-[#FFE485]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FFE485] inline-block" />
            {lang === 'vi' ? 'COVID-19 / Đáy' : 'COVID-19 Impact'}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-auto max-h-[50vh] overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`modal-line-grad-${figure.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {figure.yTicks.map((tick) => {
            const y = padTop + plotH - (tick / figure.yMax) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={w - padRight}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray={tick === 0 ? '' : '3 3'}
                  className={tick === 0 ? 'text-slate-400 dark:text-slate-600' : 'text-slate-200 dark:text-slate-800'}
                  strokeWidth={tick === 0 ? '1.5' : '1'}
                />
                <text
                  x={padLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-500 dark:fill-slate-400 text-[11px] tabular-nums font-medium"
                >
                  {tick.toLocaleString('vi-VN')}
                </text>
              </g>
            );
          })}

          {/* Y Axis Label Title */}
          <text
            x={padLeft - 10}
            y={padTop - 12}
            textAnchor="start"
            className="fill-slate-500 dark:fill-slate-400 text-xs tabular-nums font-bold"
          >
            ({figure.unit[lang]})
          </text>

          {figure.type === 'bar' ? (
            <g>
              {figure.data.map((d, i) => {
                const barW = Math.max(8, (plotW / n) * 0.68);
                const x = padLeft + i * (plotW / n) + (plotW / n - barW) / 2;
                const barH = Math.max(2, (d.value / figure.yMax) * plotH);
                const y = padTop + plotH - barH;
                const isHovered = hoveredIdx === i;

                let fillClass = 'fill-[#0D7287] hover:fill-[#095262] dark:fill-[#9BE7FA] dark:hover:fill-[#C8EEF7]';
                if (d.isPeak) fillClass = 'fill-[#FFD14C] dark:fill-[#FFD14C]';
                if (d.isTrough || d.isCovid) fillClass = 'fill-rose-500 hover:fill-rose-600 dark:fill-rose-400 dark:hover:fill-rose-300';

                return (
                  <g
                    key={d.label}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Invisible wider hover hit-area */}
                    <rect
                      x={padLeft + i * (plotW / n)}
                      y={padTop}
                      width={plotW / n}
                      height={plotH}
                      fill="transparent"
                    />

                    {/* Active highlight background column */}
                    {isHovered && (
                      <rect
                        x={padLeft + i * (plotW / n)}
                        y={padTop}
                        width={plotW / n}
                        height={plotH}
                        className="fill-sky-500/10 dark:fill-sky-400/10"
                      />
                    )}

                    {/* Actual Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      rx={2.5}
                      className={`${fillClass} transition duration-200 ${
                        isHovered ? 'opacity-90' : ''
                      }`}
                    />

                    {/* Numerical value on top of bar */}
                    <text
                      x={x + barW / 2}
                      y={y - 5}
                      textAnchor="middle"
                      className={`text-[11px] tabular-nums font-bold ${
                        d.isPeak
                           ? 'fill-[#92400E] dark:fill-[#FFD14C]'
                          : d.isTrough || d.isCovid
                          ? 'fill-[#B45309] dark:fill-[#FFE485]'
                          : 'fill-slate-700 dark:fill-slate-300'
                      }`}
                    >
                      {d.displayValue || d.value.toLocaleString('vi-VN')}
                    </text>

                    {/* X-axis year label */}
                    <text
                      x={x + barW / 2}
                      y={padTop + plotH + 16}
                      textAnchor="middle"
                      className={`text-[11px] tabular-nums ${
                        isHovered
                          ? 'fill-sky-600 dark:fill-sky-300 font-bold'
                          : d.isPeak
                          ? 'fill-cyan-700 dark:fill-cyan-400 font-bold'
                          : 'fill-slate-600 dark:fill-slate-400'
                      }`}
                    >
                      {n > 15 ? `'${d.label.slice(-2)}` : d.label}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : (
            (() => {
              const points = figure.data.map((d, i) => {
                const x = padLeft + (i / (n - 1)) * plotW;
                const y = padTop + plotH - (d.value / figure.yMax) * plotH;
                return { x, y, ...d, index: i };
              });

              const pathD = points.reduce(
                (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
                ''
              );

              const areaD = `${pathD} L ${points[n - 1].x.toFixed(1)} ${padTop + plotH} L ${points[0].x.toFixed(1)} ${padTop + plotH} Z`;

              return (
                <g>
                  {/* Shaded Area */}
                  <path d={areaD} fill={`url(#modal-line-grad-${figure.id})`} />

                  {/* Main Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-sky-600 dark:text-sky-400"
                  />

                  {/* Points and value tags */}
                  {points.map((pt) => {
                    const isHovered = hoveredIdx === pt.index;

                    return (
                      <g
                        key={pt.label}
                        onMouseEnter={() => setHoveredIdx(pt.index)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        className="cursor-pointer"
                      >
                        {/* Hover vertical line */}
                        {isHovered && (
                          <line
                            x1={pt.x}
                            y1={padTop}
                            x2={pt.x}
                            y2={padTop + plotH}
                            stroke="currentColor"
                            strokeDasharray="2 2"
                            className="text-sky-500/70"
                            strokeWidth="1.5"
                          />
                        )}

                        {/* Outer glow ring on peak or hovered */}
                        {(pt.isPeak || isHovered) && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 9 : 7}
                            className={`${
                              pt.isPeak
                                ? 'fill-cyan-500/25 dark:fill-cyan-400/25'
                                : 'fill-sky-500/25'
                            } transition`}
                          />
                        )}

                        {/* Dot circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.isPeak ? 5 : 4}
                          className={`${
                            pt.isPeak
                              ? 'fill-[#FFD14C]'
                              : pt.isTrough || pt.isCovid
                              ? 'fill-[#FFE485]'
                              : 'fill-[#0D7287] dark:fill-[#9BE7FA]'
                          } stroke-white dark:stroke-slate-900 transition`}
                          strokeWidth="2"
                        />

                        {/* Text Value */}
                        <text
                          x={pt.x}
                          y={pt.y - 9}
                          textAnchor="middle"
                          className={`text-[11px] tabular-nums font-bold ${
                            pt.isPeak
                              ? 'fill-[#92400E] dark:fill-[#FFD14C]'
                              : pt.isTrough || pt.isCovid
                              ? 'fill-[#B45309] dark:fill-[#FFE485]'
                              : 'fill-slate-800 dark:fill-slate-200'
                          }`}
                        >
                          {pt.displayValue || pt.value.toLocaleString('vi-VN')}
                        </text>

                        {/* X-axis year */}
                        <text
                          x={pt.x}
                          y={padTop + plotH + 16}
                          textAnchor="middle"
                          className={`text-[11px] tabular-nums ${
                            isHovered
                              ? 'fill-sky-600 dark:fill-sky-300 font-bold'
                              : pt.isPeak
                              ? 'fill-cyan-700 dark:fill-cyan-400 font-bold'
                              : 'fill-slate-600 dark:fill-slate-400'
                          }`}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()
          )}
        </svg>

        {/* Hover Tooltip Float */}
        {activePoint && (
          <div className="absolute top-4 right-4 bg-slate-900/95 dark:bg-slate-950/95 text-white border border-slate-700 rounded-lg p-2.5 text-xs space-y-1 z-10 pointer-events-none">
            <div className="flex items-center justify-between gap-4 border-slate-700 pb-1">
              <span className="tabular-nums text-sky-400 font-bold">Năm {activePoint.label}</span>
              <span className="tabular-nums text-[#9BE7FA] font-bold">
                {activePoint.value.toLocaleString('vi-VN')} {figure.unit[lang]}
              </span>
            </div>
            {activePoint.event && (
              <div className="text-amber-300 font-medium">{activePoint.event}</div>
            )}
            {activePoint.note && (
              <div className="text-slate-400 text-[11px]">ℹ️ {activePoint.note}</div>
            )}
            {activePoint.isPeak && (
              <div className="text-[#FFD14C] font-semibold">Điểm cao nhất trong chuỗi thời gian</div>
            )}
            {activePoint.isCovid && (
              <div className="text-[#FFE485]">Tác động phong tỏa biên giới phòng dịch COVID-19</div>
            )}
          </div>
        )}
      </div>

      {/* Academic Commentary & Verification Footer */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 p-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Nhận định học thuật:</strong>{' '}
            {figure.auditInsight ? figure.auditInsight[lang] : figure.stat}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] tabular-nums text-slate-500 dark:text-slate-400 pt-1 border-slate-200 dark:border-slate-800">
          <span>{figure.source}</span>
          <span>Luận văn: Chương 3, Trang {figure.pageInDoc}</span>
        </div>
      </div>
    </div>
  );
}
