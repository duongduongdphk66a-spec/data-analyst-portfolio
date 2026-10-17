'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { libraryBusKPIs } from '@/app/data/libraryBusData';

import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusHeroProps {
  isEn?: boolean;
  onNavClick?: (_id: string, _e?: React.MouseEvent) => void;
}

export function LibraryBusHero({ 
  isEn: propIsEn, 
  onNavClick = (id, e) => {
    e?.preventDefault?.();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  } 
}: LibraryBusHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <header className="py-16 md:py-24 border-b border-slate-200/80 dark:border-slate-800">
      <div className="page-container space-y-8">
        <div className="max-w-4xl space-y-5">
          <h1 className="editorial-section-title text-3xl sm:text-5xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            {isEn ? 'Library Bus System:' : 'Tủ Sách Lưu Động (Library Bus):'} <br />
            <span className="text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'Website Guidelines, UX Research & Production Telemetry' : 'Bộ Quy Chuẩn Thiết Kế Giao Diện, Nghiên Cứu UX & Hạ Tầng Kỹ Thuật'}
            </span>
          </h1>
          
          <p className="editorial-lead text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl dark:text-slate-300">
            {isEn 
              ? 'The mobile library web platform provides core functionalities including real-time catalog and inventory lookup across bus fleets, advance book reservations and borrowing at 48 GPS stops, live route tracking, reader profile management, and automated due-date notifications.'
              : 'Hệ thống web thư viện lưu động cung cấp các chức năng: tra cứu danh mục và tình trạng tồn kho sách thời gian thực theo từng trạm xe, đặt trước và mượn trả sách tại 48 điểm dừng GPS, theo dõi lộ trình di chuyển của đội xe buýt, cùng cổng thông tin quản lý hồ sơ độc giả, lịch sử mượn và thông báo nhắc hẹn tự động.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#sec-screens"
              onClick={(e) => onNavClick('sec-screens', e)}
              className="btn-primary flex items-center gap-2 cursor-pointer font-bold"
            >
              <Eye className="w-4 h-4" />
              <span>{isEn ? 'View 8 UI Screens' : 'Xem 8 Màn Hình Giao Diện'}</span>
            </a>
            <a
              href="/library-bus/website.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-editorial flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{isEn ? 'View Interactive Spec (HTML)' : 'Xem Hồ Sơ Thiết Kế (HTML)'}</span>
            </a>
          </div>
        </div>

        {/* 10% Bento Telemetry Matrix (Scale, CCU, Latency, Concurrency) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="card-minimal p-4 space-y-1">
            <span className="editorial-kicker text-xs block">
              {isEn ? 'ACTIVE FLEET' : 'ĐỘI XE LƯU ĐỘNG'}
            </span>
            <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">{libraryBusKPIs.activeBusFleet}</p>
            <p className="text-[11px] text-slate-500">48 GPS Stops / Ha Noi</p>
          </div>

          <div className="card-minimal p-4 space-y-1">
            <span className="editorial-kicker text-xs block">
              {isEn ? 'CATALOG SCALE' : 'QUY MÔ ĐẦU SÁCH'}
            </span>
            <p className="font-mono text-2xl font-bold text-[#0D7287] dark:text-[#9BE7FA]">{libraryBusKPIs.totalCatalogBooks}</p>
            <p className="text-[11px] text-slate-500">Physical Books Tracked</p>
          </div>

          <div className="card-minimal p-4 space-y-1">
            <span className="editorial-kicker text-xs block">
              {isEn ? 'CONCURRENT READERS' : 'KẾT NỐI ĐỒNG THỜI'}
            </span>
            <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white">500 CCU</p>
            <p className="text-[11px] text-slate-500">50,000 Registered Readers</p>
          </div>

          <div className="card-minimal p-4 space-y-1 border-l-4 border-l-[#0D7287] dark:border-l-[#9BE7FA]">
            <span className="editorial-kicker text-xs block text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'REDIS LATENCY & LOCKING' : 'ĐỘ TRỄ TRUY VẤN'}
            </span>
            <p className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">28ms (-93.7%)</p>
            <p className="text-[11px] text-slate-500">0.0% Race Condition (Locking)</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LibraryBusHero;
