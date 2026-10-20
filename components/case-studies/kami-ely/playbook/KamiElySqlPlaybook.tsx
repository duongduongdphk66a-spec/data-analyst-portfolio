'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';
import {
  COLORS,
  K_MIN,
  categoryMatch,
  kAnonymity,
  modSampleFull,
  modSampleMaxDevPct,
  modSamples,
  outlierDays,
  robustZ,
  skuHealthByCategory,
  sqlSnippets,
  storeFacts,
  treatmentComparison,
  zScoreSeries,
} from './playbookData';
import {
  ChartCard,
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  UnifiedSection,
  axisTick,
  legendFormatter,
  usePlaybookLang,
} from './PlaybookUi';

export interface KamiElySqlPlaybookProps {
  compactMode?: boolean;
}

const STAGE6_SQL = `-- Khai phá văn bản (TRIM / SPLIT_PART / ILIKE) & 5 hướng xử lý ngoại lai (Z-Score / Winsorizing / LN)
WITH stats AS (
  SELECT AVG(daily_gmv) AS mu, STDDEV(daily_gmv) AS sd,
         PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY daily_gmv) AS p95,
         PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY daily_gmv) AS p99
  FROM kami_store_daily_180d
)
SELECT report_date,
       daily_gmv                                    AS raw_investigation,
       (daily_gmv - mu) / sd                        AS z_score,
       CASE WHEN ABS((daily_gmv - mu)/sd) <= 3
            THEN daily_gmv END                      AS trimmed_removal,
       LEAST(daily_gmv, p99)                        AS winsorized_p99,
       LEAST(daily_gmv, p95)                        AS winsorized_p95,
       LN(GREATEST(daily_gmv, 1))                   AS log_rescaled
FROM kami_store_daily_180d CROSS JOIN stats;

-- Khớp mẫu văn bản trên cột category
SELECT SUM(gmv_vnd) FROM kami_product_data_90d WHERE category ILIKE '%swimwear%';`;

export default function KamiElySqlPlaybook(_props: KamiElySqlPlaybookProps = {}) {
  const { L, b, n } = usePlaybookLang();

  const tickEvery = Math.floor(zScoreSeries.length / 6);
  const raw = treatmentComparison[0];
  const dropped = treatmentComparison[1];
  const stdDropPct = ((raw.std - dropped.std) / raw.std) * 100;
  const peakZ = Math.max(...zScoreSeries.map((d) => d.z));
  const minGroup = Math.min(...kAnonymity.map((k) => k.creators));

  const donutData = [
    { name: 'Swimwear', value: categoryMatch.swimwearGmvPct },
    { name: L('Ngành hàng khác', 'Other categories'), value: categoryMatch.otherGmvPct },
  ];

  return (
    <div id="sec-playbook" className="w-full space-y-12">
      {/* Giai đoạn 6: Khai phá Văn bản & Phát hiện Điểm Bất thường */}
      <UnifiedSection
        id="sec-stage-6-text-anomalies"
        badge="6"
        coverage="partial"
        gapText={L(
          'Lưu ý phạm vi: Dữ liệu trích xuất không chứa văn bản đánh giá khách hàng (review text), nên kỹ thuật làm sạch và khớp mẫu văn bản (TRIM, SPLIT_PART, ILIKE) được áp dụng trên tên danh mục và thuộc tính SKU.',
          'Scope note: Platform exports omit customer review text, so SQL text cleaning and pattern matching (TRIM, SPLIT_PART, ILIKE) are applied to product titles and category strings.',
        )}
        title={L(
          'Khai phá Văn bản & Phát hiện Điểm Bất thường (Anomaly Detection)',
          'Text Mining, Anomaly Detection & Five SQL Outlier Treatments',
        )}
        takeaway={L(
          `Chuyển hóa dữ liệu chuỗi thành chỉ số định lượng qua các hàm làm sạch (TRIM, LOWER, REGEXP_REPLACE), tách chuỗi (SPLIT_PART) và khớp mẫu (ILIKE '%swimwear%' xác định đồ bơi chiếm ${n(categoryMatch.swimwearGmvPct, 1)}% GMV). Để phát hiện bất thường, kết hợp phân vị (MEDIAN, PERCENTILE_CONT), Z-score (|z| > 3 phát hiện ${outlierDays.length}/${storeFacts.days} ngày đột biến) và 5 hướng xử lý ngoại lai trong SQL: Giữ nguyên, Loại bỏ (giảm ${n(stdDropPct, 1)}% độ lệch chuẩn), Winsorizing P95/P99 bằng LEAST(x, p99), Biến đổi LN(x) và Sửa từ nguồn.`,
          `Transforms strings into quantitative metrics using text cleaning (TRIM, LOWER, REGEXP_REPLACE), token splitting (SPLIT_PART), and pattern matching (ILIKE '%swimwear%' isolates ${n(categoryMatch.swimwearGmvPct, 1)}% GMV). For anomaly detection, combines quantiles (MEDIAN, PERCENTILE_CONT), z-scores (|z| > 3 flags ${outlierDays.length}/${storeFacts.days} spike days), and 5 SQL outlier treatments: Investigation, Removal (-${n(stdDropPct, 1)}% std. dev.), Winsorizing P95/P99 via LEAST(x, p99), LN(x) rescaling, and Fixing upstream.`,
        )}
        kpis={[
          {
            value: `${n(categoryMatch.swimwearGmvPct, 1)}%`,
            label: L("khớp mẫu category ILIKE '%swimwear%'", "category ILIKE '%swimwear%' GMV share"),
            sub: L('Tách chuỗi tên SKU bằng SPLIT_PART để chuẩn hóa 6 ngành hàng', 'Tokenized via SPLIT_PART to standardize 6 product categories'),
          },
          {
            value: `z = ${n(peakZ, 2)} (MAD ${n(robustZ(storeFacts.peakDay.gmv), 2)})`,
            label: L('đỉnh bất thường ngày 16/06 (|z| > 3)', 'peak anomaly on Jun 16 (|z| > 3)'),
            sub: L('Kết hợp Z-Score chuẩn và Robust Z kháng nhiễu trung vị', 'Combines standard Z-score and median-based Robust Z (MAD)'),
            tone: 'amber',
          },
          {
            value: `-${n(stdDropPct, 1)}% Std · P99/P95`,
            label: L('cắt ngọn Winsorizing bằng LEAST(x, p99)', 'Winsorizing cap via LEAST(x, p99)'),
            sub: L('Phân phối lệch phải (Skew = +2,84) được chuẩn hóa bằng LN(x)', 'Right-skewed sessions (Skew = +2.84) rescaled via LN(x)'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Báo cáo tài chính cần giữ nguyên ngày Mega Sale (Investigation), nhưng mô hình dự báo nhu cầu tồn kho tuần sẽ dự đoán thừa nếu không cắt ngọn P95/P99 hoặc biến đổi LN(x).',
          'Financial accounting requires keeping Mega Sale spikes (Investigation), whereas weekly inventory replenishment models over-forecast unless Winsorized at P95/P99 or log-rescaled.',
        )}
        action={L(
          'Sử dụng REGEXP_REPLACE chuẩn hóa mã gốc (H36, CV11, M18), duy trì song song cột daily_gmv gốc và cột LEAST(daily_gmv, p99) trong View, đồng thời bật cảnh báo khi |z| > 3.',
          'Canonicalize root SKU codes via REGEXP_REPLACE, maintain both raw daily_gmv and LEAST(daily_gmv, p99) in analytical Views, and trigger automated alerts when |z| > 3.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 6)', 'SQL (Stage 6)'), code: STAGE6_SQL }}
      >
        {/* Biểu đồ 1: Z-score 180 ngày (Full-width) */}
        <ChartCard
          className="lg:col-span-2"
          height="h-72"
          title={L('Phát hiện bất thường Z-Score GMV 180 ngày (ngưỡng |z| = 3)', '180-day daily GMV z-score anomaly detection (threshold |z| = 3)')}
          subtitle={L('Kiểm chuẩn độ lệch chuẩn Z-score phát hiện các ngày đột biến doanh số', '3-sigma Z-score anomaly detection flags spike days')}
          badge={<Chip tone="rose">|z| &gt; 3 ({outlierDays.length} {L('ngày đột biến', 'spikes')})</Chip>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zScoreSeries} margin={{ top: 22, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={tickEvery} tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={[-3, 6]} ticks={[-3, 0, 3, 6]} width={34}>
                <Label value="(σ)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v, 2)} />} />
              <ReferenceLine y={3} stroke={COLORS.alert} strokeDasharray="5 4" />
              <ReferenceLine y={-3} stroke={COLORS.alert} strokeDasharray="5 4" />
              <Bar dataKey="z" name="z" radius={[2, 2, 0, 0]}>
                {zScoreSeries.map((d) => (
                  <Cell key={d.date} fill={d.isOutlier ? COLORS.alert : COLORS.cyan} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Biểu đồ 2: Khớp mẫu ILIKE %swimwear% (Donut) */}
        <ChartCard
          title={L("Khớp mẫu ILIKE '%swimwear%': tỷ trọng GMV 90 ngày (%)", "Pattern match ILIKE '%swimwear%': 90-day GMV share (%)")}
          subtitle={L("Ứng dụng ILIKE '%swimwear%' lọc danh mục đồ bơi", "Pattern match ILIKE '%swimwear%' isolates swimwear")}
          badge={<Chip tone="amber">{n(categoryMatch.swimwearGmvPct, 1)}% GMV</Chip>}
        >
          <div className="relative h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} stroke="none">
                  <Cell fill={COLORS.amber} />
                  <Cell fill={COLORS.cyan} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-6">
              <span className="text-xl font-black tabular-nums text-slate-950 dark:text-white">
                {n(categoryMatch.swimwearGmvPct, 1)}%
              </span>
            </div>
          </div>
        </ChartCard>

        {/* Biểu đồ 3: Phân loại văn bản ngành hàng */}
        <ChartCard
          title={L('Phân loại văn bản ngành hàng: SKU có đơn vs chưa có đơn', 'Category text classification: converting vs zero-sale SKUs')}
          subtitle={L('Ứng dụng TRIM, SPLIT_PART phân nhóm ngành hàng', 'Text cleaning and category token splitting')}
          badge={<Chip tone="cyan">SPLIT_PART</Chip>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skuHealthByCategory} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="category" width={96} tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v)} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar dataKey="withSales" stackId="a" name={L('Có đơn', 'With orders')} fill={COLORS.cyan} />
              <Bar dataKey="dead" stackId="a" name={L('Chưa có đơn', 'No orders')} fill={COLORS.amber} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Biểu đồ 4: So sánh 4 phương pháp xử lý ngoại lai (Winsorizing) */}
        <ChartCard
          title={L('So sánh 4 phương pháp xử lý ngoại lai: Trung bình & Độ lệch chuẩn (triệu đ)', '4 outlier treatments: Mean & Standard Deviation (M VND)')}
          subtitle={L('Đối chiếu Giữ nguyên, Loại bỏ, Winsorize P99 và Winsorize P95', 'Comparing As-Is, Removal, P99 Winsorizing, and P95 Winsorizing')}
          badge={<Chip tone="amber">LEAST(x, p99)</Chip>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={treatmentComparison.map((t) => ({ ...t, name: b(t.label) }))}
              margin={{ top: 22, right: 8, left: -4, bottom: 0 }}
            >
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={38}>
                <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar dataKey="meanM" name={L('Trung bình', 'Mean')} fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
              <Bar dataKey="stdM" name={L('Độ lệch chuẩn', 'Std. dev.')} fill={COLORS.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Biểu đồ 5: Phân phối lệch phải GMV & Đường mật độ KDE */}
        <ChartCard
          title={L('Phân phối lệch phải GMV phiên LIVE & Đường mật độ KDE (% phiên)', 'Right-skewed LIVE session GMV & KDE density (% sessions)')}
          subtitle={L('Minh họa lý do cần dùng trung vị hoặc biến đổi tỷ lệ LN(x) thay cho trung bình', 'Illustrates why median or LN(x) rescaling is required over raw means')}
          badge={<Chip tone="cyan">Skew = +2,84 · LN(x)</Chip>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={KAMI_MATH_STATS.eda.kdePoints} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={34}>
                <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)}%`} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar dataKey="pct" name={L('Tỷ lệ phiên', 'Sessions')} fill={COLORS.cyan} radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="kde" name="KDE" stroke={COLORS.amber} strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </UnifiedSection>

      {/* Giai đoạn 7: Đóng gói Dữ liệu Phức tạp, Tự động hóa ETL & Bảo mật PII */}
      <UnifiedSection
        id="sec-stage-7-etl-pii"
        badge="7"
        title={L(
          'Đóng gói Dữ liệu Phức tạp, Tự động hóa ETL & Bảo mật PII',
          'Complex Dataset Packaging (CTEs / GROUPING SETS), Automated ETL & PII Privacy',
        )}
        takeaway={L(
          `Tổ chức mã nguồn bằng CTEs và mệnh đề GROUPING SETS để tính tổng đa chiều trong một truy vấn; đóng gói kết quả vào bảng chụp nhanh (snapshot metrics.json) với nguyên tắc vàng 0 bước chỉnh sửa thủ công trên bảng tính. Khi xử lý tập dữ liệu lớn và bảo mật PII, áp dụng lấy mẫu nhất quán 10% qua hàm MOD(chỉ số, 10), băm MD5 định danh và chỉ xuất các nhóm đạt ngưỡng k-Anonymity ≥ ${K_MIN} (loại bỏ hoàn toàn các dòng count = 1).`,
          `Structures complex logic via CTEs and GROUPING SETS for multi-dimensional rollups in a single query, materializing outputs into metrics.json under the golden rule of 0 manual spreadsheet steps. For dataset scaling and PII privacy, applies deterministic 10% sampling via MOD(index, 10), MD5 handle hashing, and enforces k-Anonymity ≥ ${K_MIN} (strictly dropping any count = 1 combinations).`,
        )}
        kpis={[
          {
            value: '0 bước thủ công',
            label: L('tự động hóa Snapshot ETL 100%', '100% automated Snapshot ETL'),
            sub: L('Chạy một lệnh build_metrics.py sinh trực tiếp metrics.json', 'Single build_metrics.py command materializes metrics.json'),
          },
          {
            value: `±${n(modSampleMaxDevPct, 1)}%`,
            label: L('độ lệch tối đa 10 mẫu MOD(id, 10)', 'max deviation across 10 MOD(id, 10) samples'),
            sub: L(`Trung bình toàn tập đạt ${n(modSampleFull, 1)} Tr đ/ngày`, `Full-population mean sits at ${n(modSampleFull, 1)}M VND/day`),
            tone: 'amber',
          },
          {
            value: `k ≥ ${K_MIN} (Min: ${n(minGroup)})`,
            label: L('chuẩn ẩn danh k-Anonymity & băm MD5', 'k-Anonymity threshold & MD5 hashing'),
            sub: L('Không xuất bất kỳ tổ hợp thuộc tính nào có count = 1', 'Zero count = 1 attribute combinations exposed in public outputs'),
          },
        ]}
        finding={L(
          'Xuất trực tiếp danh sách KOC kèm doanh số cá nhân hoặc giữ các phân nhóm quá nhỏ (count = 1) có nguy cơ lộ thông tin định danh cá nhân (PII).',
          'Exporting raw creator handles alongside individual payouts or retaining singleton groups (count = 1) risks exposing personally identifiable information (PII).',
        )}
        action={L(
          'Băm một chiều MD5(creator_handle), dùng HAVING COUNT(*) >= 10 trên mọi truy vấn xuất dữ liệu công khai và dùng MOD(ABS(HASHTEXT(id)), 10) khi thử nghiệm nhanh.',
          'Apply one-way MD5(creator_handle) hashing, enforce HAVING COUNT(*) >= 10 on all public aggregation queries, and use MOD(ABS(HASHTEXT(id)), 10) for fast dev sampling.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 7)', 'SQL (Stage 7)'), code: sqlSnippets.s7 }}
      >
        <ChartCard
          title={L('Lấy mẫu nhất quán 10% bằng hàm MOD(ngày, 10) (triệu đ)', 'Deterministic 10% sampling via MOD(day, 10) (M VND)')}
          subtitle={L('Đối chiếu trung bình 10 tập mẫu m0–m9 với đường trung bình toàn tập', 'Comparing 10 modulo sample means (m0–m9) against full population mean')}
          badge={<Chip tone="amber">{L('Toàn tập', 'Full set')} {n(modSampleFull, 1)}M</Chip>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modSamples} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="sample" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis width={38} tick={axisTick} tickLine={false} axisLine={false} domain={[0, 'auto']}>
                <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
              </YAxis>
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />} />
              <ReferenceLine y={modSampleFull} stroke={COLORS.deep} strokeDasharray="5 4" />
              <Bar dataKey="meanM" name={L('Trung bình mẫu', 'Sample mean')} fill={COLORS.amber} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={L(`Kiểm chuẩn bảo mật k-Anonymity (HAVING COUNT >= ${K_MIN}, thang log)`, `k-Anonymity privacy audit (HAVING COUNT >= ${K_MIN}, log scale)`)}
          subtitle={L('Mọi phân nhóm KOC xuất ra đều vượt ngưỡng tối thiểu k = 10', 'All exported KOC cohorts exceed the minimum k = 10 threshold')}
          badge={<Chip tone="cyan">k ≥ ${K_MIN} ({L('Đạt', 'Pass')})</Chip>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kAnonymity} margin={{ top: 12, right: 12, left: -6, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis
                width={40}
                scale="log"
                domain={[1, 10000]}
                ticks={[1, 10, 100, 1000, 10000]}
                allowDataOverflow
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v)} />} />
              <ReferenceLine y={K_MIN} stroke={COLORS.alert} strokeDasharray="5 4" label={{ value: `k = ${K_MIN}`, position: 'insideTopRight', fontSize: 11, fill: COLORS.alert }} />
              <Bar dataKey="creators" name="KOC" radius={[6, 6, 0, 0]}>
                {kAnonymity.map((k) => (
                  <Cell key={k.tier} fill={k.passes ? COLORS.cyan : COLORS.alert} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </UnifiedSection>
    </div>
  );
}
