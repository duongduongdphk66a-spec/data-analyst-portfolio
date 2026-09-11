'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { THESIS_METADATA } from '@/app/data/heritageJapanData';

interface HeritageJapanHeroProps {
  isEn: boolean;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
}

export function HeritageJapanHero({ isEn, onNavClick }: HeritageJapanHeroProps) {
  return (
    <header className="py-14 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="editorial-kicker">
              {isEn ? 'LINE 03 ┬╖ HERITAGE TOURISM & QUANTITATIVE RESEARCH' : 'LINE 03 ┬╖ PH├éN T├ìCH ─Éß╗èNH L╞»ß╗óNG & DU Lß╗èCH DI Sß║óN NHß║¼T Bß║óN'}
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">ΓÇó JNTO & UNESCO TELEMETRY</span>
          </div>
          
          <h1 className="editorial-section-title text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.16] tracking-tight text-slate-950 dark:text-white">
            {isEn ? THESIS_METADATA.titleEn : THESIS_METADATA.titleVi}
          </h1>
          
          <p className="text-base sm:text-xl text-[#0D7287] font-semibold italic dark:text-[#9BE7FA]">
            {isEn ? THESIS_METADATA.titleVi : THESIS_METADATA.titleEn}
          </p>

          <p className="editorial-lead text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl dark:text-slate-300">
            {isEn
              ? 'A comprehensive quantitative research & case study on JapanΓÇÖs heritage tourism trajectory (2013ΓÇô2023): examining inbound growth catalysts, the overtourism crisis across UNESCO cultural hotspots, and actionable governance models for sustainable preservation.'
              : 'Khß║úo s├ít thß╗▒c tiß╗àn to├án diß╗çn vß╗ü lß╗Ö tr├¼nh ph├ít triß╗ân du lß╗ïch di sß║ún tß║íi Nhß║¡t Bß║ún giai ─æoß║ín 2013ΓÇô2023: ph├ón t├¡ch ─æß╗Öng lß╗▒c b├╣ng nß╗ò du kh├ích quß╗æc tß║┐, khß╗ºng hoß║úng qu├í tß║úi du lß╗ïch (Overtourism) tß║íi c├íc di sß║ún UNESCO v├á c├íc m├┤ h├¼nh quß║ún trß╗ï di sß║ún bß╗ün vß╗»ng.'}
          </p>
          
          {/* 10% Bento Telemetry Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="card-minimal p-4 space-y-1">
              <span className="editorial-kicker text-[10px] block">
                {isEn ? 'RESEARCH SCOPE' : 'PHß║áM VI NGHI├èN Cß╗¿U'}
              </span>
              <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">2013 ΓÇô 2023</p>
              <p className="text-[11px] text-slate-500">10-Year Inbound Growth & Crisis</p>
            </div>

            <div className="card-minimal p-4 space-y-1">
              <span className="editorial-kicker text-[10px] block">
                {isEn ? 'WORLD HERITAGE SITES' : 'DI Sß║óN THß║╛ GIß╗ÜI'}
              </span>
              <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">25 ─Éiß╗âm ─Éß║┐n</p>
              <p className="text-[11px] text-slate-500">20 V─ân h├│a ┬╖ 5 Thi├¬n nhi├¬n</p>
            </div>

            <div className="card-minimal p-4 space-y-1 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
              <span className="editorial-kicker text-[10px] block text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'PEAK INBOUND VOLUME' : '─Éß╗êNH DU KH├üCH (2019)'}
              </span>
              <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">31.9 Triß╗çu</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+513% T─âng tr╞░ß╗ƒng tß╗½ 2003</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#mo-dau"
              onClick={(e) => onNavClick('mo-dau', e)}
              className="btn-primary-gold flex items-center gap-2 cursor-pointer"
            >
              <span>Bß║»t ─æß║ºu ─æß╗ìc ─æß╗ü t├ái</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="#chuong-1"
              onClick={(e) => onNavClick('chuong-1', e)}
              className="btn-secondary-editorial cursor-pointer"
            >
              Kh├ím ph├í 25 Di sß║ún UNESCO
            </a>
            <a
              href="#chuong-3"
              onClick={(e) => onNavClick('chuong-3', e)}
              className="btn-secondary-editorial cursor-pointer"
            >
              Xem Dß╗» liß╗çu & Biß╗âu ─æß╗ô 3.1 - 3.6
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
