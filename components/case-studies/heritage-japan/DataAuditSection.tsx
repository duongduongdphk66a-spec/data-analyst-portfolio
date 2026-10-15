'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Search, SlidersHorizontal, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { DATA_AUDIT_FINDINGS } from '@/app/data/heritageJapanData';

import { useLanguage } from '@/app/context/LanguageContext';

export interface DataAuditSectionProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function DataAuditSection({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: DataAuditSectionProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const [selectedAuditId, setSelectedAuditId] = useState<string>('audit-kyoto-2020');
  const activeFinding = DATA_AUDIT_FINDINGS.find((f) => f.id === selectedAuditId) || DATA_AUDIT_FINDINGS[0];

  return (
    <section id="kiem-dinh-du-lieu" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80 dark:bg-[#070B12] dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          variant="stacked"
          id="kiem-dinh-du-lieu"
          badge={isEn ? 'Data Quality & Anomaly Detection • Critical Analyst Review' : 'Kiểm Định Dữ Liệu & Phát Hiện Bất Thường • Góc Nhìn Data Analyst'}
          title={isEn ? 'Auditing the Academic Dataset: Uncovering Latent Anomalies' : 'Kiểm Định Dữ Liệu Học Thuật: Phát Hiện Sai Lệch & Nghịch Lý Kinh Tế'}
          onCopy={onCopyDeepLink}
        />

        {/* Lead intro highlighting the analyst role */}
        <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <h4 className="font-extrabold text-slate-950 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <span>{isEn ? 'The Data Analyst Mindset: Never Take Numbers for Granted' : 'Tư Duy Phân Tích: Không Thụ Động Tiếp Nhận Số Liệu'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#9BE7FA] text-slate-950">Audit Phase</span>
              </h4>
              <p className="leading-relaxed">
                {isEn
                  ? 'A critical responsibility of a Data Analyst is to audit source datasets, cross-examine administrative reports against macroeconomic baselines, and detect data entry typos or unit translation ambiguities that could distort policy decisions.'
                  : 'Trách nhiệm cốt lõi của một Data Analyst là kiểm định nguồn gốc dữ liệu, đối chiếu số liệu báo cáo địa phương với bức tranh vĩ mô, và phát hiện các lỗi gõ phím (typos), nhầm lẫn đơn vị quy đổi có thể làm sai lệch hoàn toàn kết luận nghiên cứu.'}
              </p>
            </div>
          </div>
        </div>

        {/* Findings Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {DATA_AUDIT_FINDINGS.map((finding) => {
            const isSelected = selectedAuditId === finding.id;
            return (
              <button
                key={finding.id}
                onClick={() => setSelectedAuditId(finding.id)}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#0D7287] shadow-md dark:bg-slate-850 dark:border-[#9BE7FA]'
                    : 'bg-white/70 hover:bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    finding.severity === 'high'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : finding.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                  }`}>
                    {finding.severity === 'high' ? 'Lỗi Trực Quan Cấp 1' : finding.severity === 'medium' ? 'Nghi Vấn Đơn Vị' : 'Nghịch Lý Kinh Tế'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">Biểu đồ {finding.chartId}</span>
                </div>
                <h5 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 mb-1">
                  {isEn ? finding.titleEn : finding.titleVi}
                </h5>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {isEn ? finding.summaryEn : finding.summaryVi}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Audit Inspection Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? `Audit Case: ${activeFinding.id}` : `Hồ sơ kiểm định: ${activeFinding.id}`}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                {isEn ? activeFinding.titleEn : activeFinding.titleVi}
              </h4>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#C8EEF7]/50 text-[#0D7287] border border-[#9BE7FA] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA] self-start sm:self-auto">
              {isEn ? `Related: Chart ${activeFinding.chartId}` : `Gắn với: Biểu đồ ${activeFinding.chartId}`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Box 1: Nguyên trạng trong Niên luận */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'As Written in Thesis Document' : '1. Hiện trạng ghi nhận trong Niên luận gốc'}</span>
              </div>
              <p className="text-xs sm:text-sm font-mono p-3 rounded-lg bg-white border border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 leading-relaxed">
                {activeFinding.originalInDoc}
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <strong className="block text-slate-900 dark:text-white font-bold">
                  {isEn ? 'Potential Distortion Risk:' : 'Rủi ro nếu không kiểm định:'}
                </strong>
                <p>
                  {activeFinding.id === 'audit-kyoto-2020'
                    ? 'Người đọc tưởng rằng Kyoto vẫn đón gần 3.8 triệu khách quốc tế giữa đại dịch toàn cầu, dẫn đến kết luận sai lầm về khả năng chống chịu của thành phố.'
                    : activeFinding.id === 'audit-nara-unit'
                    ? 'Doanh thu du lịch của Cố đô Nara bị phóng đại gấp 10 lần, ngang ngửa với Kyoto mặc dù cơ sở lưu trú của Nara chỉ bằng 1/5.'
                    : 'Không phát hiện được vấn đề cấu trúc: du khách đổ dồn về Nara nhưng không ở lại, khiến địa phương gánh chịu chi phí quá tải mà thất thu ngân sách.'}
                </p>
              </div>
            </div>

            {/* Box 2: Phân tích & Thẩm tra của Data Analyst */}
            <div className="p-5 rounded-xl bg-[#F0FBFC] border border-[#9BE7FA] dark:bg-slate-850 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA] text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Data Analyst Verification & Diagnosis' : '2. Bằng chứng kiểm định & Thẩm tra chéo'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {isEn ? activeFinding.auditExplanationEn : activeFinding.auditExplanationVi}
              </p>
              <div className="pt-2 border-t border-[#9BE7FA]/40 dark:border-slate-700">
                <strong className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{isEn ? 'Solution Implemented in this Dashboard:' : 'Giải pháp xử lý trên Dashboard:'}</span>
                </strong>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {isEn ? activeFinding.suggestedActionEn : activeFinding.suggestedActionVi}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Case Visual Comparison */}
          {activeFinding.id === 'audit-kyoto-2020' && (
            <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-850 dark:border-slate-700">
              <h5 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Đối chiếu Số Liệu Kyoto Năm Đại Dịch 2020: Niên Luận vs Thẩm Tra Thực Tế</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900">
                  <span className="text-[11px] text-rose-700 font-bold block">Ghi nhận trong Niên luận</span>
                  <span className="text-2xl font-mono font-black text-rose-600">3,799 k</span>
                  <span className="text-[10px] text-slate-500 block">Lỗi typo (tương đương 3.8 triệu)</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900">
                  <span className="text-[11px] text-emerald-800 font-bold block">Thẩm tra DMO KYOTO chính thức</span>
                  <span className="text-2xl font-mono font-black text-emerald-600">379.9 k</span>
                  <span className="text-[10px] text-slate-500 block">Đúng thực tế đại dịch (0.38 triệu)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <span className="text-[11px] text-slate-600 font-bold block dark:text-slate-300">Khách quốc tế Toàn quốc 2020</span>
                  <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">4.12 M</span>
                  <span className="text-[10px] text-slate-500 block">Toàn Nhật Bản giảm -87.1%</span>
                </div>
              </div>
            </div>
          )}

          {activeFinding.id === 'audit-daytripper-paradox' && (
            <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-850 dark:border-slate-700">
              <h5 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mô hình Đối chứng Cấu trúc Du khách: Cố đô Kyoto vs Cố đô Nara (Năm đỉnh cao 2019)</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 space-y-1.5">
                  <strong className="text-slate-900 dark:text-white font-extrabold flex items-center justify-between">
                    <span>Kyoto: Điểm đến Lưu trú Dài ngày</span>
                    <span className="text-[#0D7287] dark:text-[#9BE7FA]">4.5M du khách</span>
                  </strong>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-[#0D7287] h-full" style={{ width: '68%' }} title="Lưu trú qua đêm: 68%" />
                    <div className="bg-slate-300 h-full" style={{ width: '32%' }} title="Đi trong ngày: 32%" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Lưu trú qua đêm: ~68%</span>
                    <span>Chi tiêu bình quân: 290k ¥/khách</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60 space-y-1.5">
                  <strong className="text-amber-900 dark:text-amber-300 font-extrabold flex items-center justify-between">
                    <span>Nara: Nghịch lý Khách đi trong ngày (Day-tripper)</span>
                    <span className="text-amber-600">3.3M du khách</span>
                  </strong>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-amber-500 h-full" style={{ width: '14%' }} title="Lưu trú qua đêm: 14%" />
                    <div className="bg-amber-200 h-full" style={{ width: '86%' }} title="Đi trong ngày: 86%" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Lưu trú qua đêm: ~14%</span>
                    <span>Chi tiêu bình quân: 36k ¥/khách (thấp hơn 8 lần!)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DataAuditSection;
