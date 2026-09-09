'use client';

import React from 'react';
import { 
  Compass, Target, Sparkles, BarChart2, Users, 
  Layout, CheckSquare, GitBranch, ChevronRight, MousePointer 
} from 'lucide-react';
import { ABOUT_US_DATA, UX_RESEARCH_DATA } from '@/app/data/libraryBusData';
import SectionHeader from '@/components/ui/SectionHeader';

interface Chapter1UxResearchProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function Chapter1UxResearch({ isEn, onCopyDeepLink }: Chapter1UxResearchProps) {
  return (
    <>
      {/* 1.1 VỀ CHÚNG TÔI (ABOUT US) */}
      <section id="sec-about" className="space-y-6 scroll-mt-36">
        <SectionHeader
          variant="chapter"
          id="sec-about"
          chapter="CHAPTER 01"
          subtitle={isEn ? ABOUT_US_DATA.titleEn : ABOUT_US_DATA.titleVi}
          badge="1.1"
          title={isEn ? 'About Us' : 'Về Chúng Tôi'}
          onCopy={onCopyDeepLink}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Lý do phát triển */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-[#C8EEF7]/50 text-[#0D7287] flex items-center justify-center font-black">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isEn ? ABOUT_US_DATA.reason.titleEn : ABOUT_US_DATA.reason.titleVi}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
              {isEn ? ABOUT_US_DATA.reason.descEn : ABOUT_US_DATA.reason.descVi}
            </p>
          </div>

          {/* Sứ mệnh */}
          <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/80 shadow-xs hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-[#9BE7FA]/40 text-[#0D7287] flex items-center justify-center font-black">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isEn ? ABOUT_US_DATA.mission.titleEn : ABOUT_US_DATA.mission.titleVi}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
              {isEn ? ABOUT_US_DATA.mission.descEn : ABOUT_US_DATA.mission.descVi}
            </p>
          </div>

          {/* Ý nghĩa tên thương hiệu */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD14C]/30 text-slate-900 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 text-[#0D7287]" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isEn ? ABOUT_US_DATA.brandMeaning.titleEn : ABOUT_US_DATA.brandMeaning.titleVi}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
              {isEn ? ABOUT_US_DATA.brandMeaning.descEn : ABOUT_US_DATA.brandMeaning.descVi}
            </p>
          </div>
        </div>
      </section>

      {/* 1.2 NGHIÊN CỨU TRẢI NGHIỆM NGƯỜI DÙNG (UX RESEARCH) */}
      <section id="sec-research" className="space-y-8 scroll-mt-36">
        <SectionHeader
          variant="chapter"
          id="sec-research"
          chapter="CHAPTER 01"
          subtitle={isEn ? UX_RESEARCH_DATA.subtitleEn : UX_RESEARCH_DATA.subtitleVi}
          badge="1.2"
          title={isEn ? 'UX Research & Customer Target' : 'Nghiên Cứu UX, Khách Hàng Mục Tiêu & Chức Năng'}
          onCopy={onCopyDeepLink}
        />

        {/* Part A: Market Research */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            <span>{isEn ? '1.2.1 Market Research & Industry Trends' : '1.2.1 Nghiên cứu thị trường & Xu hướng'}</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0D7287]" />
                {isEn ? UX_RESEARCH_DATA.marketResearch.marketId.titleEn : UX_RESEARCH_DATA.marketResearch.marketId.titleVi}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {isEn ? UX_RESEARCH_DATA.marketResearch.marketId.descEn : UX_RESEARCH_DATA.marketResearch.marketId.descVi}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFD14C]" />
                {isEn ? UX_RESEARCH_DATA.marketResearch.currentTrends.titleEn : UX_RESEARCH_DATA.marketResearch.currentTrends.titleVi}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {isEn ? UX_RESEARCH_DATA.marketResearch.currentTrends.descEn : UX_RESEARCH_DATA.marketResearch.currentTrends.descVi}
              </p>
            </div>
          </div>
        </div>

        {/* Part B: Customer Target & 3 User Personas */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{isEn ? '1.2.2 Customer Target (Demographics & 3 Personas)' : '1.2.2 Khách hàng mục tiêu & 3 Chân dung người dùng (Personas)'}</span>
          </h3>

          {/* Demographics Strip */}
          <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs dark:bg-slate-900 dark:border-slate-800">
            {UX_RESEARCH_DATA.customerTarget.demographics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isEn ? item.labelEn : item.labelVi}</span>
                <p className="font-black text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* 3 Personas Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {UX_RESEARCH_DATA.customerTarget.personas.map((persona, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#C8EEF7]/50 text-2xl flex items-center justify-center">
                    {persona.avatar}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{persona.name}</h4>
                    <p className="text-[11px] font-bold text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? persona.roleEn : persona.roleVi}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Nhu cầu & Kỳ vọng:</span>
                    <p className="text-slate-600 dark:text-slate-400">{isEn ? persona.needsEn : persona.needsVi}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 dark:bg-slate-800 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-400">Điểm đau (Pain Point):</span>
                    <p className="text-slate-600 dark:text-slate-400">{isEn ? persona.painPointEn : persona.painPointVi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part C: Website References (Benchmarking) */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span>{isEn ? '1.2.3 Website References & Comparative Analysis' : '1.2.3 Đối chuẩn mô hình tham chiếu (Website References)'}</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {UX_RESEARCH_DATA.websiteReferences.map((ref, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{ref.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Ref 0{idx+1}</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <p><b className="text-emerald-600">Ưu điểm:</b> <span className="text-slate-600 dark:text-slate-400">{ref.prosVi}</span></p>
                  <p><b className="text-rose-600">Hạn chế:</b> <span className="text-slate-600 dark:text-slate-400">{ref.consVi}</span></p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <b className="text-[#0D7287] dark:text-[#9BE7FA]">Bài học áp dụng:</b>
                    <p className="text-slate-600 mt-0.5 dark:text-slate-400">{ref.takeawayVi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part D: Website Core Functions */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            <span>{isEn ? '1.2.4 Website Core Functions (6 Modules)' : '1.2.4 6 Chức năng cốt lõi của Website'}</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UX_RESEARCH_DATA.functions.map((func) => (
              <div key={func.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#9BE7FA] transition-all space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="w-7 h-7 rounded-xl bg-[#0D7287] text-white flex items-center justify-center text-xs font-black">
                    {func.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Core Feature</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {isEn ? func.nameEn : func.nameVi}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {func.descVi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part E: Sitemap & User Flow */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sitemap Structure */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <span>{isEn ? '1.2.5 Sitemap Detail' : '1.2.5 Sơ đồ cấu trúc Website (Sitemap)'}</span>
            </h3>
            <div className="space-y-3 text-xs">
              {UX_RESEARCH_DATA.sitemap.map((node, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 space-y-1.5">
                  <div className="font-black text-slate-900 flex items-center gap-1.5 dark:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-[#0D7287]" />
                    <span>{node.parentVi}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {node.childrenVi.map((c, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Flow Diagram */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              <span>{isEn ? '1.2.6 User Flow: Book Reservation & Hold Checkout' : '1.2.6 Sơ đồ luồng người dùng (User Flow)'}</span>
            </h3>
            <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800 space-y-3 overflow-x-auto">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Bắt đầu/Kết thúc</span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800">Điểm quyết định</span>
                <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800">Hành động</span>
              </div>
              <div className="space-y-2 min-w-[500px]">
                {UX_RESEARCH_DATA.userFlowSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 w-6 shrink-0">0{idx+1}</span>
                    <div className={`px-3 py-1.5 text-xs font-bold shrink-0 flex items-center gap-2 ${
                      step.type === 'start' || step.type === 'end'
                        ? 'rounded-full bg-emerald-600 text-white shadow-xs'
                        : step.type === 'decision'
                        ? 'rounded-xl bg-[#FFD14C] text-slate-950 border border-amber-300'
                        : 'rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white dark:border-slate-700'
                    }`}>
                      <span>{step.labelVi}</span>
                    </div>
                    <span className="text-slate-400">→</span>
                    <span className="text-[11px] text-slate-500 truncate dark:text-slate-400">{step.descVi}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
