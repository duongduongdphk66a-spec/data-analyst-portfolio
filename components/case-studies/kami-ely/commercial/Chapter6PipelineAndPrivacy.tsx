'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, Lock, ShieldCheck, Terminal } from 'lucide-react';
import {
  ChapterShell,
  Chip,
  TermTooltip,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { UNIFIED_9_QUALITY_GATES } from './kamiElyVerified231d';

export interface Chapter6PipelineAndPrivacyProps {
  onOpenNotebook?: () => void;
}

export default function Chapter6PipelineAndPrivacy({ onOpenNotebook }: Chapter6PipelineAndPrivacyProps) {
  const { L, isEn } = usePlaybookLang();

  const layers = [
    {
      step: '1. Raw',
      title: L('10 tệp Excel nguồn FastMoss', '10 raw FastMoss exports'),
      desc: L(
        'Đọc nguyên trạng 21.374 dòng thực thể + 1.790 dòng panel SKU; giữ nguyên chuỗi tiền tệ và dấu thời gian gốc.',
        'Ingests 21,374 core rows + 1,790 SKU panel rows untouched outside public static assets.'
      ),
      tone: 'border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/60',
    },
    {
      step: '2. Staging',
      title: L('Chuẩn hóa +13h, khử trùng & băm', '+13h shift, dedup & SHA-256'),
      desc: L(
        'Dịch +13 giờ bảng Live chính chủ sang UTC+7, khử 1 video trùng khóa phức hợp, đồng nhất cờ Ads (YES/có) và băm creator_id.',
        'Shifts official Live +13h to UTC+7, deduplicates 1 composite video row, normalizes YES/có Ads flags, and hashes creator IDs.'
      ),
      tone: 'border-[#9BE7FA]/80 bg-[#C8EEF7]/25 dark:border-slate-700 dark:bg-[#9BE7FA]/10',
    },
    {
      step: '3. Marts',
      title: L('4 tập JSON tĩnh đã kiểm định', '4 verified analytical marts'),
      desc: L(
        'Xuất chuỗi ngày/tuần/tháng (231N), Pareto 133 SKU, ma trận Cohort M0-M7 và bảng đối soát phục vụ trực tiếp giao diện.',
        'Materializes deterministic 231d daily/weekly/monthly JSONs, 133-SKU Pareto, and M0-M7 cohort matrices.'
      ),
      tone: 'border-[#FFD14C]/80 bg-[#FFE485]/25 dark:border-slate-700 dark:bg-[#FFD14C]/10',
    },
  ];

  return (
    <ChapterShell
      id="sec-ch6-pipeline"
      chapterNum={L('Chương 6', 'Chapter 6')}
      title={L('Pipeline chạy lại được và xử lý dữ liệu cá nhân', 'Reproducible ETL pipeline and creator privacy protection')}
      question={L(
        'Làm sao tái lập toàn bộ kết quả phân tích mà không lộ định danh cá nhân của creator?',
        'How is every metric reproduced deterministically without exposing external creator handles?'
      )}
      scopeLabel={L('Kiến trúc 3 lớp · 9/9 cổng đạt · Salted SHA-256', '3-layer pipeline · 9/9 gates passed · Salted SHA-256')}
      soWhat={L(
        'Các sai lệch kỹ thuật như lệch múi giờ +13h trên bảng Live chính chủ, dòng video trùng khóa và gộp chồng snapshot 90 ngày được chặn tự động qua 9 cổng kiểm tra chất lượng trước khi lên biểu đồ. Băm một chiều có muối (Salted SHA-256) giữ nguyên khả năng nối khóa cho 6.085 creator mà không hiển thị tên tài khoản gốc.',
        'Technical pitfalls (+13h timezone offset on official Live, duplicate video rows, overlapping 90d snapshots) are caught automatically across 9 quality gates. Salted SHA-256 hashing preserves foreign-key joins across 6,085 creators without exposing raw handles.'
      )}
      recommendation={L(
        'Chạy tự động bộ 9 cổng kiểm tra mỗi lần cập nhật tệp mới, lưu khóa muối (salt) ở biến môi trường cục bộ tách biệt mã nguồn, và gọi chuẩn thuật ngữ giả danh hóa (pseudonymization) thay vì ẩn danh hóa tuyệt đối.',
        'Run all 9 automated quality gates on every data refresh, keep cryptographic salts in local environment variables outside git, and frame hashed IDs strictly as pseudonymization.'
      )}
      confidenceLabel={L('Tin cậy kỹ thuật: Cao (kiểm chứng trực tiếp qua repo)', 'Pipeline confidence: High (reproducible in repo)')}
      confidenceTone="emerald"
      appendixLabel={L('Xem chi tiết 9 cổng chất lượng & SQL tại Phụ lục A · B', 'Inspect all 9 quality gates & SQL in Appendix A · B')}
    >
      <div className="space-y-3.5">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                {L('6.1. Luồng biến đổi Raw -> Staging -> Mart và dải 9 cổng kiểm tra', '6.1. Raw -> Staging -> Mart flow and 9 automated quality gates')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {L(
                  'Toàn bộ script xử lý bằng Python & SQL có thể chạy lại độc lập để sinh đúng từng con số trên báo cáo.',
                  'Deterministic Python & SQL scripts regenerate every number rendered in the UI.'
                )}
              </p>
            </div>
            <Chip tone="emerald">{L('6 ERROR · 3 WARN · 0 lỗi', '6 ERROR · 3 WARN · 0 failed')}</Chip>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {layers.map((l) => (
              <div key={l.step} className={`rounded-xl border p-3 space-y-1 ${l.tone}`}>
                <div className="text-xs font-black text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1">
                  <span>{l.step}</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">{l.title}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{L('Dải 9 cổng kiểm định tự động (nhấn Phụ lục A để xem bảng đối soát đầy đủ):', '9 automated quality gates (see Appendix A for full reconciliation table):')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {UNIFIED_9_QUALITY_GATES.map((g) => (
                <span
                  key={g.id}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold tabular-nums ${g.level === 'ERROR'
                      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'border-[#FFD14C]/70 bg-[#FFE485]/35 text-amber-950 dark:border-slate-700 dark:bg-[#FFD14C]/10 dark:text-[#FFE485]'
                    }`}
                >
                  <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>G{g.id}: {isEn ? g.gateEn : g.gateVi}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <a
              href="https://github.com/mvhung17/data-analyst-portfolio/tree/main/scripts/kami"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span>{L('Mã nguồn Pipeline trên GitHub (scripts/kami)', 'Pipeline scripts on GitHub (scripts/kami)')}</span>
            </a>

            {onOpenNotebook && (
              <button
                type="button"
                onClick={onOpenNotebook}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-slate-950 cursor-pointer transition-colors"
              >
                <Terminal className="h-3.5 w-3.5 text-[#074553]" aria-hidden="true" />
                <span>{L('Mở Sổ tay Python kiểm định', 'Open verification Python Notebook')}</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
                <span>{L('6.2. Ví dụ trước / sau băm giả danh creator_id', '6.2. Before / after salted SHA-256 creator hashing')}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {L(
                'Dữ liệu không chứa thông tin người mua cuối. Với 6.085 tài khoản creator, pipeline áp dụng ',
                'Zero end-buyer PII exists in the source. For 6,085 creator accounts, the pipeline applies '
              )}
              <TermTooltip
                label={L('giả danh hóa (Pseudonymization)', 'pseudonymization')}
                explain="Băm SHA-256 kèm khóa muối bí mật (salt) thay thế handle thật bằng mã cố định để nối bảng chính xác, bám sát nguyên tắc giảm thiểu dữ liệu công khai theo Nghị định 13/2023/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân 2025."
              />
              {L(' trên mẫu minh họa tổng hợp dưới đây:', ' illustrated with synthetic values below:')}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 space-y-2.5 overflow-x-auto">
            <div>
              <div className="text-[11px] font-sans font-semibold text-rose-300">
                {L('1. Dữ liệu thô cục bộ (không đưa lên thư mục public/):', '1. Local raw export (excluded from public/ hosting):')}
              </div>
              <div className="mt-0.5 text-slate-300">
                creator_handle = <span className="text-amber-300">&quot;sample_creator_demo&quot;</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-sans font-semibold text-[#9BE7FA]">
                {L('2. Khóa nối tầng Staging (SHA-256 + ENV_SALT):', '2. Staging join key (SHA-256 + ENV_SALT):')}
              </div>
              <div className="mt-0.5 text-[#C8EEF7] break-all">
                creator_hash = &quot;8f4e9c2a71b0...4d17&quot;
              </div>
            </div>

            <div>
              <div className="text-[11px] font-sans font-semibold text-emerald-300">
                {L('3. Bí danh hiển thị công khai trên giao diện:', '3. Public UI deterministic alias:')}
              </div>
              <div className="mt-0.5 text-emerald-200">
                display_alias = <span className="font-bold">&quot;@koc_sat01&quot;</span> | <span className="font-bold">&quot;@koc_ext02&quot;</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {L(
              'Nhờ giữ cùng khóa muối nội bộ khi nạp 3 bảng (Danh bạ KOL, Phiên Live, Video gắn giỏ), hệ thống đối soát trọn vẹn vòng đời từng KOC mà không để lộ bất kỳ tên tài khoản thực nào trên trang web.',
              'Sharing the local environment salt across KOL Directory, Live Sessions, and Affiliate Videos preserves exact cross-table joins with zero raw handles rendered publicly.'
            )}
          </p>
        </div>
      </div>
    </ChapterShell>
  );
}

