'use client';

import React from 'react';
import { 
  Compass, Target, Sparkles, BarChart2, Users, 
  Layout, CheckSquare, GitBranch, ChevronRight, MousePointer 
} from 'lucide-react';
import { ABOUT_US_DATA, UX_RESEARCH_DATA } from '@/app/data/libraryBusData';
import SectionHeader from '@/components/ui/SectionHeader';

import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter1UxResearchProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter1UxResearch({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: Chapter1UxResearchProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
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
          title={isEn ? 'About Us' : 'Về Dự Án'}
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
              {isEn ? ABOUT_US_DATA.scope.titleEn : ABOUT_US_DATA.scope.titleVi}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
              {isEn ? ABOUT_US_DATA.scope.descEn : ABOUT_US_DATA.scope.descVi}
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
          title={isEn ? 'UX Research, Customer Target & Website Structure' : 'Nghiên Cứu UX, Khách Hàng Mục Tiêu & Cấu Trúc Website'}
          onCopy={onCopyDeepLink}
        />

        {/* Part A: Market Research */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            <span>{isEn ? '1.2.1 Market Research' : '1.2.1 Nghiên cứu thị trường'}</span>
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
          <p className="text-xs italic text-slate-700 leading-relaxed dark:text-slate-300">
            {isEn ? UX_RESEARCH_DATA.marketResearch.conclusionEn : UX_RESEARCH_DATA.marketResearch.conclusionVi}
          </p>
          <p className="text-[11px] italic text-slate-500 dark:text-slate-400">
            {isEn ? UX_RESEARCH_DATA.marketResearch.noteEn : UX_RESEARCH_DATA.marketResearch.noteVi}
          </p>
        </div>

        {/* Part B: Customer Target (3 user groups) */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{isEn ? '1.2.2 Customer Target (3 User Groups)' : '1.2.2 Khách hàng mục tiêu (3 nhóm người dùng)'}</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {UX_RESEARCH_DATA.customerGroups.map((group) => (
              <div key={group.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-2xl bg-[#C8EEF7]/50 text-[#0D7287] flex items-center justify-center text-sm font-black">
                    {group.id}
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{isEn ? group.nameEn : group.nameVi}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  {isEn ? group.descEn : group.descVi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part C: Website References (Benchmarking) */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span>{isEn ? '1.2.3 Website References' : '1.2.3 Website tham khảo (Website References)'}</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {UX_RESEARCH_DATA.websiteReferences.map((ref, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between gap-2">
                  <span>{isEn ? ref.nameEn : ref.nameVi}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0 dark:bg-slate-800 dark:text-slate-300">Ref 0{idx+1}</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">{isEn ? ref.descEn : ref.descVi}</p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <b className="text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? 'Applied to:' : 'Áp dụng cho:'}</b>
                    <p className="text-slate-600 mt-0.5 dark:text-slate-400">{isEn ? ref.appliedEn : ref.appliedVi}</p>
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
            <span>{isEn ? '1.2.4 Website Functions' : '1.2.4 Chức năng của Website (Website\'s Function)'}</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UX_RESEARCH_DATA.functions.map((func) => (
              <div key={func.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#9BE7FA] transition-all space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="w-7 h-7 rounded-xl bg-[#0D7287] text-white flex items-center justify-center text-xs font-black">
                    {func.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{isEn ? 'Function' : 'Chức năng'}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {isEn ? func.nameEn : func.nameVi}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isEn ? func.descEn : func.descVi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part E: Sitemap */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>{isEn ? '1.2.5 Sitemap' : '1.2.5 Sơ đồ trang web (Sitemap)'}</span>
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
            <span className="px-4 py-2.5 rounded-xl bg-[#0D7287] text-white font-black text-sm self-start">
              {UX_RESEARCH_DATA.sitemapRoot}
            </span>
            <div className="flex flex-wrap gap-2">
              {UX_RESEARCH_DATA.sitemapTop.map((node, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                  {isEn ? node.en : node.vi}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Part F: Sitemap detail */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <span>{isEn ? '1.2.6 Sitemap Detail' : '1.2.6 Sơ đồ trang web chi tiết (Sitemap Detail)'}</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {UX_RESEARCH_DATA.sitemap.map((node, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-2">
                <div className="font-black text-slate-900 flex items-center gap-1.5 dark:text-white">
                  <ChevronRight className="w-3.5 h-3.5 text-[#0D7287]" />
                  <span>{isEn ? node.parentEn : node.parentVi}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {(isEn ? node.childrenEn : node.childrenVi).map((c, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part G: User flow */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            <span>{isEn ? `1.2.7 User Flow: ${UX_RESEARCH_DATA.userFlowTitleEn}` : `1.2.7 Sơ đồ luồng người dùng (User Flow): ${UX_RESEARCH_DATA.userFlowTitleVi}`}</span>
          </h3>
          <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800 space-y-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mb-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{isEn ? 'Start / End' : 'Bắt đầu/Kết thúc'}</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800">{isEn ? 'Decision point' : 'Điểm quyết định'}</span>
              <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800">{isEn ? 'Action' : 'Hoạt động'}</span>
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
                    <span>{isEn ? step.labelEn : step.labelVi}</span>
                  </div>
                  <span className="text-slate-400">→</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? step.descEn : step.descVi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Chapter1UxResearch;
