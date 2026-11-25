'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { V2 } from './kamiOutlineV2Metrics';

interface Props {
  lang: 'vi' | 'en';
}

export function Chapter6EarlyWarningAndPlaybook({ lang }: Props) {
  const isVi = lang === 'vi';
  const [showBacktestAccordion, setShowBacktestAccordion] = useState(false);

  const actions = [
    {
      titleVi: '1. Lịch lên kệ giao mùa sớm 4 tuần (Chặn vùng trũng T8 -83,1%)',
      titleEn: '1. Advance Seasonal SKU Launch by 4 Weeks (Prevent -83.1% Aug Trough)',
      evidenceVi:
        'Đồ bơi Hè rơi 90% từ 1,57 tỷ (T6) về 0,15 tỷ (T8), trong khi 2 mã chủ lực Thu Đông AT06 (09/09) và AG01 (14/09) lên kệ trễ gần 1 tháng.',
      evidenceEn:
        'Summer swimwear fell 90% from 1.57B (Jun) to 0.15B (Aug), while autumn heroes AT06 (Sep 09) and AG01 (Sep 14) launched nearly 1 month late.',
      actionVi:
        'Đẩy lịch test mẫu và mở bán dòng Thu Đông từ tuần đầu tháng 8 (ngay khi MA7 cắt xuống MA28 hậu đỉnh Hè) thay vì đợi sang giữa tháng 9.',
      actionEn:
        'Move autumn SKU sampling and launch to the first week of August (upon post-peak MA7 < MA28 crossover) instead of mid-September.',
      kpiVi: 'KPI mục tiêu: Giữ nền GMV tháng giao mùa ≥ 45 triệu/ngày (thay vì rơi xuống 20,5 triệu/ngày)',
      kpiEn: 'Target KPI: Maintain transition-month floor ≥ 45M VND/day (vs. 20.5M/day trough)',
      tone: 'cyan',
    },
    {
      titleVi: '2. Thí điểm ca Mega-Live ≥ 8–10 giờ có ngưỡng cắt lỗ & Tái bổ sung kệ ghim mỗi 2 giờ',
      titleEn: '2. Pilot ≥ 8–10h Mega-Live Shifts with Break-Even Cutoffs & 2-Hour Shelf Rotation',
      evidenceVi:
        '67 phiên mega-live >10h của kênh chính chủ đạt hiệu suất 4,55 triệu/giờ (gấp 4,1 lần ca <2h là 1,10 triệu/giờ), tạo 4,08 tỷ (>50% GMV Live chính chủ). Lưu ý khả năng nhân quả ngược: phiên bán tốt vào ngày sale thường được kéo dài hơn.',
      evidenceEn:
        '67 official mega-lives (>10h) generated 4.55M/hour (4.1x the 1.10M/hour of <2h sessions), contributing 4.08B (>50% of official Live GMV). Subject to reverse causality because high-converting promo sessions tend to stay live longer.',
      actionVi:
        'Triển khai thử nghiệm có kiểm soát (ngày sale vs. ngày thường) nâng thời lượng từ 2,25–4,46h lên ≥8h với 2–3 host xoay ca và ghim >50 mã/phiên (Spearman ρ = +0,339); áp dụng ngưỡng dừng sớm nếu GMV/giờ rơi dưới điểm hòa vốn chi phí host.',
      actionEn:
        'Run a controlled pilot (promo vs. regular days) extending sessions from 2.25–4.46h to ≥8h with 2–3 rotating hosts and >50 pinned SKUs (Spearman ρ = +0.339), paired with an early stop-loss rule if hourly GMV falls below host break-even.',
      kpiVi: 'KPI mục tiêu: Đạt ≥ 3,5 – 4,5 triệu VNĐ/giờ live (chỉ kéo dài khi biên đóng góp dương sau chi phí host)',
      kpiEn: 'Target KPI: ≥ 3.5 – 4.5M VND/live hour (extend only while contribution margin stays positive after host cost)',
      tone: 'emerald',
    },
    {
      titleVi: '3. Cấp quyền quảng cáo có chọn lọc (Selective Ad Auth) cho KOC Video Affiliate',
      titleEn: '3. Selective Ad Authorization (Spark Ads) for External KOC Shoppable Videos',
      evidenceVi:
        'Ở mảng Video ngắn (2,20 tỷ), KOC bên ngoài đóng góp 58,4% (1,28 tỷ). Clip bật Ads (3.775 clip sau khử trùng) có tỷ lệ ra đơn 30,3% và doanh thu 547,7k/clip (gấp 4,4 lần nhóm không Ads), nhưng GPM/1k views lại thấp hơn Organic (0,84× toàn mẫu; 0,73× trong cùng 192 KOC) do chọn mẫu ngược.',
      evidenceEn:
        'External KOCs drive 58.4% (1.28B) of Short Video GMV. Ad-authorized clips (3,775 deduplicated) convert at 30.3% and average 547.7k/clip (4.4x non-authorized), yet GPM per 1k views trails Organic (0.84x overall; 0.73x within 192 dual KOCs) due to selection bias.',
      actionVi:
        'Yêu cầu cấp sẵn mã Spark Ads khi gửi mẫu để chủ động nguồn clip, nhưng chỉ rót ngân sách Ads có chọn lọc cho clip đã có đơn tự nhiên kèm theo dõi ROAS biên và lợi nhuận ròng (sau COGS và hoàn hủy). Dừng hỗ trợ KOC Live sau 3 phiên đầu 0đ (loại 64,8% KOC không chuyển đổi).',
      actionEn:
        'Collect Spark Ads codes upfront on sample briefs, but allocate paid spend selectively only to clips with proven organic conversions while tracking marginal ROAS and net profit (after COGS and returns). Enforce the 3-session zero-revenue cutoff for Live KOCs (64.8% non-converters).',
      kpiVi: 'KPI mục tiêu: ≥ 90% clip mẫu cấp sẵn mã · Chỉ chạy Ads khi clip có đơn tự nhiên & ROAS biên đạt ngưỡng',
      kpiEn: 'Target KPI: ≥ 90% sample clips pre-authorized · Boost only organically converting clips meeting marginal ROAS',
      tone: 'amber',
    },
    {
      titleVi: '4. Giảm rủi ro phụ thuộc đơn mã AT06 (80,5% GMV T10) & Dọn 206 SKU 0 đơn',
      titleEn: '4. De-risk AT06 Single-SKU Dependency (80.5% Oct GMV) & Prune 206 Dead SKUs',
      evidenceVi:
        'Tháng 10 riêng mã AT06 chiếm 80,5% doanh thu toàn shop (1,30 / 1,62 tỷ). Trong 339 SKU toàn danh mục có tới 206 mã (60,8%) doanh thu 0đ.',
      evidenceEn:
        'In October, single SKU AT06 accounted for 80.5% of store GMV (1.30B / 1.62B), while 206 of 339 catalog SKUs (60.8%) had zero sales.',
      actionVi:
        'Đẩy bán chéo combo Áo thun AT06 + Chân váy CV11/CV02 + Áo khoác gió AG01 trên cùng phiên live; ẩn 204 mã tồn cũ trước 2026 không có đơn và gộp các link trùng mã như H30.',
      actionEn:
        'Cross-sell AT06 long-sleeve tee with CV11/CV02 skirts and AG01 windbreaker in bundles; archive 204 zero-sale pre-2026 SKUs and consolidate duplicate H30 listings.',
      kpiVi: 'KPI mục tiêu: Giảm tỷ trọng 1 SKU đơn lẻ xuống ≤ 50% GMV tháng · Tỷ lệ SKU active ≥ 65%',
      kpiEn: 'Target KPI: Cap single-SKU concentration at ≤ 50% of monthly GMV · Active SKU ratio ≥ 65%',
      tone: 'rose',
    },
  ];

  return (
    <section id="sec-warning" className="scroll-mt-28 space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isVi
            ? 'Khuyến nghị hành động gắn KPI mục tiêu'
            : 'Actionable Recommendations & Target KPIs'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-prose leading-relaxed">
          {isVi
            ? '4 quyết định vận hành rút ra trực tiếp từ kiểm toán 10 bảng dữ liệu để khắc phục vùng trũng giao mùa, tối ưu ca Mega-Live, khai thác kênh Video KOC và giảm rủi ro phụ thuộc đơn mã AT06.'
            : '4 operational decisions derived directly from the 10-table audit to bridge the seasonal trough, scale Mega-Live shifts, leverage external KOC videos, and reduce single-SKU dependency on AT06.'}
        </p>
      </div>

      {/* 4 Concise Action Cards with Target KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {isVi ? act.titleVi : act.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed tabular-nums">
                <strong className="text-slate-900 dark:text-white">
                  {isVi ? 'Bằng chứng: ' : 'Evidence: '}
                </strong>
                {isVi ? act.evidenceVi : act.evidenceEn}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed tabular-nums">
                <strong className="text-[#0D7287] dark:text-[#9BE7FA]">
                  {isVi ? 'Hành động: ' : 'Action: '}
                </strong>
                {isVi ? act.actionVi : act.actionEn}
              </p>
            </div>
            <div className="rounded-xl bg-[#C8EEF7]/25 dark:bg-slate-950/80 border border-[#C8EEF7] dark:border-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
              {isVi ? act.kpiVi : act.kpiEn}
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible Accordion for Backtest & Early Warning Signals (-40% height reduction) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowBacktestAccordion((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>
            {showBacktestAccordion
              ? isVi
                ? 'Thu gọn bảng Backtest 4 tín hiệu cảnh báo sớm & Giao cắt MA7/MA28'
                : 'Collapse 4-Signal Early Warning Backtest & MA7/MA28 Crossovers'
              : isVi
              ? 'Xem bảng Backtest 4 tín hiệu cảnh báo sớm (Giao cắt MA7 < MA28 ngày 29/04, 04/06, 26/06, 22/10)'
              : 'View 4-Signal Early Warning Backtest Table (MA7 < MA28 Crossovers on Apr 29, Jun 04, Jun 26, Oct 22)'}
          </span>
          {showBacktestAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showBacktestAccordion && (
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">{isVi ? 'Tín hiệu' : 'Signal'}</th>
                  <th className="py-2 px-2 font-semibold text-right">{isVi ? 'Số lần báo' : 'Triggers'}</th>
                  <th className="py-2 px-2 font-semibold text-right">{isVi ? 'Độ trễ vs 16/06' : 'Lead vs Jun 16'}</th>
                  <th className="py-2 px-2 font-semibold text-right">{isVi ? 'Báo giả' : 'False Alarms'}</th>
                  <th className="py-2 pl-2 font-semibold">{isVi ? 'Đánh giá kiểm định' : 'Audit Verdict'}</th>
                </tr>
              </thead>
              <tbody>
                {V2.ch6.backtestRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="py-2 pr-3 font-semibold text-slate-900 dark:text-white">
                      {isVi ? row.signalVi : row.signalEn}
                    </td>
                    <td className="py-2 px-2 text-right font-bold">{row.triggers}</td>
                    <td className="py-2 px-2 text-right font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                      {row.leadDaysVsPeak > 0 ? `+${row.leadDaysVsPeak}d` : `${row.leadDaysVsPeak}d`}
                    </td>
                    <td className="py-2 px-2 text-right">{row.falseAlarms}</td>
                    <td className="py-2 pl-2 text-slate-600 dark:text-slate-300">
                      {isVi ? row.verdictVi : row.verdictEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
