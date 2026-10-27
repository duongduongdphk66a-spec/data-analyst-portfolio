'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ChapterShell, Chip, usePlaybookLang } from '../playbook/PlaybookUi';

export default function Chapter7ConclusionAndLimits() {
  const { L, isEn } = usePlaybookLang();

  const rows = [
    {
      recVi: '1. Chuẩn bị tồn kho và lịch Live hàng Thu Đông sớm từ giữa tháng 8',
      recEn: '1. Stage autumn inventory and Live schedules earlier in mid-August',
      evVi: 'T6 -> T8 sụt -83,1% (-3.135,7 Tr đ); tháng 10 hồi phục 1,62 tỷ/25 ngày cùng lúc 5 mã Thu Đông chiếm 98,4% nhóm mẫu 10 SKU.',
      evEn: 'Jun -> Aug fell -83.1% (-3,135.7M); Oct rebounded to 1.62B in 25d as 5 autumn SKUs reached 98.4% of the 10-SKU panel.',
      confVi: 'Trung bình (1 mùa)',
      confEn: 'Medium (1 season)',
      tone: 'amber' as const,
    },
    {
      recVi: '2. Dồn seeding và voucher vào 3 phiên Live đầu của creator mới; tách riêng @koc_sat01 trên báo cáo',
      recEn: '2. Concentrate seeding & vouchers in first 3 creator sessions; separate @koc_sat01 in reports',
      evVi: '77,2% creator 0 đơn ở 3 ca đầu không bao giờ ra đơn về sau; @koc_sat01 chiếm 43,7% GMV affiliate cả kỳ (lô T5: 1.496,7 Tr vs 238,9 Tr).',
      evEn: '77.2% of zero-sale creators in first 3 lives never convert later; @koc_sat01 holds 43.7% of 231d affiliate Live GMV.',
      confVi: 'Trung bình - cao',
      confEn: 'Medium - high',
      tone: 'emerald' as const,
    },
    {
      recVi: '3. Rà soát 206 SKU không ra đơn đối chiếu tồn kho và ngày mở bán trước khi gỡ kệ',
      recEn: '3. Audit 206 zero-sale SKUs against warehouse stock and launch dates before delisting',
      evVi: '12/339 SKU tạo 80,6% GMV kệ hàng 90N; 206 SKU (60,8%) có 0 đơn; dải giá 75k - 250k đ đóng góp 93,0% GMV.',
      evEn: '12/339 SKUs generate 80.6% of 90d GMV; 206 SKUs (60.8%) had zero orders; 75k - 250k VND band drives 93.0% GMV.',
      confVi: 'Trung bình (thiếu COGS/tồn kho)',
      confEn: 'Medium (no COGS/stock)',
      tone: 'amber' as const,
    },
    {
      recVi: '4. Thử nghiệm ca Live chính chủ >=8 giờ khung chiều 12h - 18h và gắn hashtag sản phẩm cho Video',
      recEn: '4. Pilot >=8h afternoon (12-18h) official Live slots and product-specific video hashtags',
      evVi: 'Ca >=8h khung 12h - 18h đạt 3.891 đ/lượt xem (36 ca, trung bình kênh 2.163 đ); hashtag sản phẩm ra đơn 31,1% so với 21,7% hashtag chung.',
      evEn: '>=8h 12-18h slots yielded 3,891 VND/viewer (n = 36 vs. 2,163 mean); product hashtags converted at 31.1% vs. 21.7% generic.',
      confVi: 'Trung bình (mẫu nhỏ, quan sát)',
      confEn: 'Medium (small n, observational)',
      tone: 'amber' as const,
    },
    {
      recVi: '5. Dùng giao cắt MA7 < MA28 làm tín hiệu giám sát vận hành và duy trì 9 cổng kiểm định ETL',
      recEn: '5. Use MA7 < MA28 as an operational monitor alongside the 9 automated ETL quality gates',
      evVi: 'Giao cắt 26/06 ổn định qua phép thử Winsorize P99/P95 (sớm 18 ngày trước khi thủng nền T4); pipeline vượt 9/9 cổng đối soát.',
      evEn: '26/06 cross holds under P99/P95 Winsorization (18d lead); ETL pipeline passes 9/9 quality assertions.',
      confVi: 'Thấp - TB (dự báo) · Cao (ETL)',
      confEn: 'Low-Med (signal) · High (ETL)',
      tone: 'cyan' as const,
    },
  ];

  const unanswered = [
    {
      title: L('1. ROI ròng của Quảng cáo Video', '1. Net Video Ads ROI'),
      body: L(
        'Video gắn cờ Ads có tỷ lệ phát sinh đơn cao hơn (30,3% so với 10,2%), nhưng GPM gộp thấp hơn (65.689 đ so với 77.799 đ) và không có chi phí quảng cáo (Ad spend) để tính lợi nhuận sau thầu.',
        'Ads-tagged clips show higher order incidence (30.3% vs. 10.2%) at lower gross GPM (65,689 vs. 77,799 VND), with ad spend unobserved.'
      ),
    },
    {
      title: L('2. Quy luật mùa vụ đa năm (YoY)', '2. Multi-year seasonality (YoY)'),
      body: L(
        'Chuỗi quan sát mới đi qua 231 ngày trong năm 2026 (1 chu kỳ Hè sang Thu). Cần tối thiểu thêm 1 năm dữ liệu cùng kỳ để tách biệt nhu cầu mùa vụ lặp lại khỏi biến động vận hành riêng của shop.',
        'Only one 231-day seasonal transition in 2026 is observed; a second year is required to separate recurring calendar seasonality from store execution.'
      ),
    },
    {
      title: L('3. Hàng tồn chết thực sự & Mua lặp lại', '3. True dead stock & repeat buyers'),
      body: L(
        'Thiếu số dư kho nội bộ, giá vốn (COGS), mã đơn hàng (order_id) và mã người mua (customer_id), nên chưa xác định được giá trị vốn đọng thực tế của 206 SKU 0 đơn hay tỷ lệ khách quay lại.',
        'Without warehouse stock, COGS, order IDs, or buyer IDs, capital tied up in the 206 zero-sale SKUs and customer repeat rates remain unmeasured.'
      ),
    },
  ];

  return (
    <ChapterShell
      id="sec-ch7-conclusion"
      chapterNum={L('Chương 7', 'Chapter 7')}
      title={L('Kết luận, khuyến nghị, điều chưa trả lời được', 'Conclusions, recommendations, and open questions')}
      question={L(
        'Nên hành động gì từ bằng chứng hiện có, mức độ tin cậy đến đâu, và câu hỏi nào cần dữ liệu nội bộ mới trả lời được?',
        'What actions are supported by current evidence, at what confidence level, and what requires internal logs to answer?'
      )}
      scopeLabel={L('Tổng hợp 5 khuyến nghị & 3 khoảng trống dữ liệu', '5 prioritized actions & 3 open telemetry gaps')}
      appendixLabel={L('Mở Phụ lục A · B · C để xem bảng đối soát, SQL và giả định', 'Expand Appendix A · B · C for full audit, SQL, and assumptions')}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
            {L('7.1. Bảng hành động: Khuyến nghị -> Bằng chứng định lượng -> Mức tin cậy', '7.1. Decision table: Recommendation -> Empirical evidence -> Confidence')}
          </h3>
          <Chip tone="cyan">{L('Gắn chặt mức tin cậy theo giới hạn dữ liệu', 'Confidence calibrated to data limits')}</Chip>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-300">
                <th className="py-2.5 px-3 font-bold rounded-l-lg">{L('Khuyến nghị trọng tâm', 'Operational recommendation')}</th>
                <th className="py-2.5 px-3 font-bold">{L('Bằng chứng định lượng cốt lõi', 'Supporting empirical evidence')}</th>
                <th className="py-2.5 px-3 font-bold rounded-r-lg whitespace-nowrap">{L('Mức tin cậy', 'Confidence')}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300">
              {rows.map((r, idx) => (
                <tr key={r.recEn} className={idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-950/30' : ''}>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white leading-relaxed">
                    {isEn ? r.recEn : r.recVi}
                  </td>
                  <td className="py-2.5 px-3 leading-relaxed tabular-nums">
                    {isEn ? r.evEn : r.evVi}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <Chip tone={r.tone}>{isEn ? r.confEn : r.confVi}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900 space-y-2.5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-amber-600 dark:text-[#FFE485]" aria-hidden="true" />
          <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
            {L('7.2. Ba điều dữ liệu hiện tại chưa trả lời được', '7.2. Three questions current telemetry cannot yet answer')}
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {unanswered.map((u) => (
            <div
              key={u.title}
              className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1.5"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{u.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
