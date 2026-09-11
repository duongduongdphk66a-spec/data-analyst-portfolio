'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { libraryBusKPIs } from '@/app/data/libraryBusData';

interface LibraryBusHeroProps {
  isEn: boolean;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
}

export function LibraryBusHero({ isEn, onNavClick }: LibraryBusHeroProps) {
  return (
    <header className="py-14 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="editorial-kicker">
              {isEn ? 'SYSTEM GUIDELINES ┬╖ ARENA MULTIMEDIA FORMAT' : 'QUY CHUß║¿N THIß║╛T Kß║╛ & B├üO C├üO PH├éN T├ìCH Hß╗å THß╗ÉNG'}
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">ΓÇó DJANGO & REDIS TELEMETRY</span>
          </div>
          
          <h1 className="editorial-section-title text-3xl sm:text-5xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            {isEn ? 'Library Bus System:' : 'Tß╗º S├ích L╞░u ─Éß╗Öng (Library Bus):'} <br />
            <span className="text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'Website Guidelines, UX Research & Production Telemetry' : 'Bß╗Ö Quy Chuß║⌐n Thiß║┐t Kß║┐ Giao Diß╗çn, Nghi├¬n Cß╗⌐u UX & Hß║í Tß║ºng Kß╗╣ Thuß║¡t'}
            </span>
          </h1>
          
          <p className="editorial-lead text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl dark:text-slate-300">
            {isEn 
              ? 'Complete 3-Chapter System Guidelines adapted from "Thiß║┐t kß║┐ ch╞░a c├│ t├¬n.pdf" (Arena Multimedia). Featuring 01 Introduction and UX Research, 02 Logo and UI Components, and 03 Website Design with 8 key responsive screens, interactive architecture graph, and pessimistic locking (select_for_update) telemetry.'
              : 'Tr├¼nh b├áy theo ─æ├║ng cß║Ñu tr├║c chuß║⌐n h├│a 3 ch╞░╞íng tß╗½ t├ái liß╗çu hß╗ô s╞í thiß║┐t kß║┐: Ch╞░╞íng 01 Giß╗¢i thiß╗çu & Nghi├¬n cß╗⌐u UX; Ch╞░╞íng 02 Hß╗ç thß╗æng Logo & Th├ánh phß║ºn giao diß╗çn UI Components; Ch╞░╞íng 03 Thiß║┐t kß║┐ 8 m├án h├¼nh Website k├¿m bß╗Ö tr├¼nh diß╗àn t╞░╞íng t├íc kiß║┐n tr├║c Django v├á c╞í chß║┐ kh├│a bi quan tß╗ôn kho.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#sec-screens"
              onClick={(e) => onNavClick('sec-screens', e)}
              className="btn-primary-gold flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{isEn ? 'View 8 UI Screens' : 'Xem 8 M├án H├¼nh Giao Diß╗çn'}</span>
            </a>
            <a
              href="/library-bus/website.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-editorial flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{isEn ? 'View Interactive Spec (HTML)' : 'Xem Hß╗ô S╞í Thiß║┐t Kß║┐ (HTML)'}</span>
            </a>
          </div>
        </div>

        {/* 10% Bento Telemetry Matrix (Scale, CCU, Latency, Concurrency) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="card-minimal p-4 space-y-1">
            <span className="editorial-kicker text-[10px] block">
              {isEn ? 'ACTIVE FLEET' : '─Éß╗ÿI XE L╞»U ─Éß╗ÿNG'}
            </span>
            <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">{libraryBusKPIs.activeBusFleet}</p>
            <p className="text-[11px] text-slate-500">48 GPS Stops / Ha Noi</p>
          </div>

          <div className="card-minimal p-4 space-y-1">
            <span className="editorial-kicker text-[10px] block">
              {isEn ? 'CATALOG SCALE' : 'QUY M├ö ─Éß║ªU S├üCH'}
            </span>
            <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">{libraryBusKPIs.totalCatalogBooks}</p>
            <p className="text-[11px] text-slate-500">Physical Books Tracked</p>
          </div>

          <div className="card-minimal p-4 space-y-1">
            <span className="editorial-kicker text-[10px] block">
              {isEn ? 'CONCURRENT READERS' : 'Kß║╛T Nß╗ÉI ─Éß╗ÆNG THß╗£I'}
            </span>
            <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">500 CCU</p>
            <p className="text-[11px] text-slate-500">50,000 Registered Readers</p>
          </div>

          <div className="card-minimal p-4 space-y-1 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
            <span className="editorial-kicker text-[10px] block text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'REDIS LATENCY & LOCKING' : '─Éß╗ÿ TRß╗ä TRUY Vß║ñN'}
            </span>
            <p className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">28ms (-93.7%)</p>
            <p className="text-[11px] text-slate-500">0.0% Race Condition (Locking)</p>
          </div>
        </div>
      </div>
    </header>
  );
}
