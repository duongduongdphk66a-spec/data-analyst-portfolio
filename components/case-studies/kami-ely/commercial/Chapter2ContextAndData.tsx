'use client';

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import {
  ChapterShell,
  ChartCard,
  ChartTooltip,
  Chip,
  GranularityToggle,
  useChartGranularity,
  usePlaybookLang,
  axisTick,
  legendFormatter,
  GRID_STROKE,
} from '../playbook/PlaybookUi';
import {
  DAILY_CHARTS_231D,
  WEEKLY_CHARTS_33W,
  UNIFIED_SOURCE_TABLES,
} from './kamiElyVerified231d';

type Ch1View = 'schema' | 'day' | 'week';

export default function Chapter2ContextAndData() {
  const { L, n } = usePlaybookLang();
  const [view, setView] = useChartGranularity<Ch1View>('schema', ['schema', 'day', 'week']);

  const totalRaw = UNIFIED_SOURCE_TABLES.slice(0, 9).reduce((acc, r) => acc + r.rawRows, 0);
  const totalClean = UNIFIED_SOURCE_TABLES.slice(0, 9).reduce((acc, r) => acc + r.cleanRows, 0);

  const grains = [
    {
      grain: L('1. Mức Ngày (231 dòng)', '1. Day grain (231 rows)'),
      scope: L('Liên tục 09/03 - 25/10/2026', 'Continuous Mar 09 - Oct 25, 2026'),
      detail: L('Khớp tuyệt đối 15,009 tỷ đ & 101.896 sản phẩm toàn shop.', 'Exact 15.009B VND & 101,896 store units.'),
    },
    {
      grain: L('2. Mức SKU (339 mã kệ + 10 mã ngày)', '2. SKU grain (339 catalog + 10 daily)'),
      scope: L('Cửa sổ 90N + Panel 179 ngày', '90d window + 179d panel'),
      detail: L('133 SKU phát sinh đơn, 206 SKU 0 đơn; 1.790 dòng theo dõi chuyển mùa.', '133 active SKUs, 206 zero-sale; 1,790 seasonal rows.'),
    },
    {
      grain: L('3. Mức Creator (6.085 KOC + 1 shop)', '3. Creator grain (6,085 KOCs + 1 shop)'),
      scope: L('Snapshot 90 ngày hợp nhất', 'Merged 90d directory'),
      detail: L('Đã băm giả danh SHA-256; tách tài khoản chính chủ khỏi mạng lưới liên kết.', 'Salted SHA-256 pseudonymized; official account separated.'),
    },
    {
      grain: L('4. Mức Ca Live (8.355 phiên)', '4. Live session grain (8,355 lives)'),
      scope: L('231 ngày (dịch +13h cho chính chủ)', '231d (+13h shifted on official)'),
      detail: L('595 ca chính chủ (7,59 tỷ), 261 ca @koc_sat01 (1,26 tỷ), 7.499 ca KOC khác.', '595 official (7.59B), 261 @koc_sat01 (1.26B), 7,499 external.'),
    },
    {
      grain: L('5. Mức Video (5.072 clip)', '5. Video grain (5,072 clips)'),
      scope: L('Lịch đăng 231N · Doanh số 90N', '231d publish · 90d sales'),
      detail: L('4.796 clip affiliate (đã khử 1 bản ghi trùng) + 276 clip kênh chính chủ.', '4,796 deduplicated affiliate clips + 276 official clips.'),
    },
  ];

  const hasList = [
    L('GMV ước tính theo ngày (15,01 tỷ đ) và doanh thu gán theo phiên Live / Video', 'Estimated daily net GMV (15.01B VND) and session/clip attributed GMV'),
    L('Sản lượng bán (101.896 sp) và đơn giá bình quân mỗi sản phẩm (ASP = 147,3k đ/sp)', 'Unit volume (101,896 units) and Average Selling Price (ASP = 147.3k VND/unit)'),
    L('Lượt xem phiên Live, lượt phát Video, khung giờ lên sóng và thời lượng từng ca', 'Session viewers, video views, broadcast start timestamps, and duration'),
    L('Lịch sử hoạt động của 302 creator Live và cờ ủy quyền quảng cáo Video (YES / có)', 'Activity logs for 302 Live creators and Video Ads authorization flags'),
  ];

  const missingList = [
    L('Mã đơn hàng (order_id): không tính được giá trị trung bình mỗi đơn (AOV) hay giỏ mua kèm', 'Order IDs (order_id): cannot compute basket AOV or multi-item bundle size'),
    L('Mã khách hàng cuối (customer_id): không đo được tỷ lệ mua lặp lại hay LTV người mua', 'Customer IDs: cannot measure buyer repeat purchase rate or customer LTV'),
    L('Giá vốn hàng bán (COGS) & phí sàn: không tính được biên lợi nhuận gộp và ròng', 'Cost of goods sold (COGS) & platform fees: cannot compute net margin'),
    L('Chi phí quảng cáo (Ad spend) & tồn kho ERP: không kết luận được ROAS hay hàng chết thực sự', 'Ad spend & warehouse stock: cannot conclude net ROAS or true dead inventory'),
  ];

  const seriesData =
    view === 'day'
      ? DAILY_CHARTS_231D.map((r) => ({ x: r.d, lives: r.lives, vidClips: r.vidClips }))
      : WEEKLY_CHARTS_33W.map((r) => ({ x: r.label, week: r.week, lives: r.lives, vidClips: r.vidClips }));

  return (
    <ChapterShell
      id="sec-ch1-data"
      chapterNum={L('Chương 1', 'Chapter 1')}
      title={L('Dữ liệu gì, tin được đến đâu?', 'What data do we have, and how far can we trust it?')}
      question={L('Dữ liệu này đo được gì và không đo được gì?', 'What can this dataset measure, and what lies outside its scope?')}
      scopeLabel={L('9 bảng chính (21.367 dòng sạch) + 1 panel SKU', '9 core tables (21,367 clean rows) + 1 SKU panel')}
      soWhat={L(
        'Dữ liệu là số ước tính của bên thứ ba (FastMoss), liên tục đủ 231/231 ngày và khớp tổng doanh số 15,009 tỷ đ qua 9 cổng kiểm tra chất lượng. Vì không có order ID và chi phí nội bộ, mọi kết luận dừng ở quan hệ quan sát ("gắn với"), không suy diễn nhân quả ("do") và không tính được ROI hay lợi nhuận.',
        'All figures are third-party FastMoss estimates, continuous across 231/231 days and reconciled to 15.009B VND across 9 quality gates. Without order IDs or internal cost logs, conclusions remain observational ("associated with") and cannot establish net ROI or profit.'
      )}
      recommendation={L(
        'Xin bổ sung dữ liệu giá vốn (COGS), chi phí quảng cáo và số dư tồn kho nội bộ trước khi ra quyết định loại bỏ SKU hoặc phân bổ lại ngân sách quảng cáo.',
        'Request internal COGS, TikTok Ads spend, and warehouse stock balances before making irreversible SKU delisting or ad budget decisions.'
      )}
      confidenceLabel={L('Tin cậy kiểm kê: Cao (đạt 9/9 cổng)', 'Data audit confidence: High (9/9 gates)')}
      confidenceTone="emerald"
      appendixLabel={L('Xem bảng đối soát 10 tệp & 9 cổng tại Phụ lục A', 'View full 10-table & 9-gate audit in Appendix A')}
    >
      <div className="space-y-3.5">
        <ChartCard
          title={L(
            '1.1. Sơ đồ nguồn FastMoss -> 5 mức độ hạt phân tích (và mật độ ghi nhận theo ngày)',
            '1.1. FastMoss source architecture -> 5 analytical grains (with daily logging density)'
          )}
          subtitle={L(
            `Tổng 9 bảng chính: ${n(totalRaw)} dòng thô -> ${n(totalClean)} dòng sạch, cộng thêm 1.790 dòng theo dõi 10 SKU chủ lực theo ngày.`,
            `9 core exports: ${n(totalRaw)} raw rows -> ${n(totalClean)} cleaned rows, plus 1,790 rows in the 10-SKU daily panel.`
          )}
          badge={
            <GranularityToggle
              value={view}
              onChange={setView}
              options={[
                { id: 'schema', label: L('Sơ đồ 5 mức hạt', '5-grain map') },
                { id: 'day', label: L('Theo ngày (231N)', 'Daily (231d)') },
                { id: 'week', label: L('Theo tuần (33T)', 'Weekly (33w)') },
              ]}
            />
          }
          height={view === 'schema' ? '' : 'h-64'}
        >
          {view === 'schema' ? (
            <div className="grid gap-3 sm:grid-cols-12 items-stretch pt-1 text-slate-800 dark:text-slate-200">
              <div className="sm:col-span-4 rounded-xl border border-[#9BE7FA]/80 bg-[#C8EEF7]/30 p-3 dark:border-slate-700 dark:bg-slate-950/70 flex flex-col gap-2">
                <div className="space-y-1">
                  <Chip tone="cyan">{L('Nguồn đầu vào', 'Source input')}</Chip>
                  <div className="text-sm font-extrabold text-slate-950 dark:text-white pt-0.5">
                    {L('FastMoss Exports', 'FastMoss Exports')}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {L(
                      '9 tệp Excel thực thể chính + 1 panel chuỗi ngày SKU (09/03 - 25/10/2026).',
                      '9 core entity Excel exports + 1 daily SKU panel (Mar 09 - Oct 25, 2026).'
                    )}
                  </p>
                </div>
                <div className="rounded-lg bg-white/90 dark:bg-slate-900 p-2.5 border border-slate-200/80 dark:border-slate-800 text-xs tabular-nums space-y-0.5 mt-auto">
                  <div className="font-black text-[#074553] dark:text-[#9BE7FA]">{n(totalClean)} dòng sạch</div>
                  <div className="text-slate-500 dark:text-slate-400">{L('Khử 7 dòng nhiễu/trùng & dịch +13h', '7 out-of-window/dup rows cleaned')}</div>
                </div>
              </div>

              <div className="sm:col-span-8 grid gap-2">
                {grains.map((g) => (
                  <div
                    key={g.grain}
                    className="rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
                        <span>{g.grain}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 pl-5 leading-snug">{g.detail}</p>
                    </div>
                    <span className="pl-5 sm:pl-0 text-[11px] font-semibold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap tabular-nums">
                      {g.scope}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={seriesData} margin={{ top: 10, right: 16, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="x" tick={axisTick} interval={view === 'day' ? 26 : 3} />
                <YAxis width={46} tick={axisTick} />
                <Tooltip
                  content={
                    <ChartTooltip
                      head={(lbl) =>
                        view === 'day' ? L(`Ngày ${lbl}/2026`, `Date ${lbl}/2026`) : L(`Tuần từ ${lbl}/2026`, `Week from ${lbl}/2026`)
                      }
                      fmt={(v, nm) => `${v.toLocaleString('vi-VN')} (${nm})`}
                    />
                  }
                />
                <Legend formatter={legendFormatter} />
                <Bar
                  dataKey="lives"
                  name={L('Số ca Live ghi nhận', 'Logged Live sessions')}
                  fill="#0D7287"
                  radius={[2, 2, 0, 0]}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="vidClips"
                  name={L('Số Video gắn giỏ đăng mới', 'Newly published shoppable clips')}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={view === 'week' ? { r: 2.5, fill: '#F59E0B' } : false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
              {L('1.2. Ranh giới đo lường: Có vs Không có', '1.2. Telemetry boundary: Observed vs. Unobserved')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {L(
                'Xác định rõ phạm vi dữ liệu ngay từ đầu để không suy diễn vượt quá bằng chứng.',
                'Explicitly bounds what can and cannot be claimed from third-party observations.'
              )}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{L('Đo được (Có trong 10 tệp)', 'Observed (Available)')}</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {hasList.map((item) => (
                  <li key={item} className="pl-2 border-l-2 border-emerald-400/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-rose-200/90 bg-rose-50/40 p-3 dark:border-rose-900/50 dark:bg-rose-950/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-800 dark:text-rose-300">
                <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{L('Không đo được (Không có)', 'Unobserved (Missing)')}</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {missingList.map((item) => (
                  <li key={item} className="pl-2 border-l-2 border-rose-400/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ChapterShell>
  );
}
