'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { kamiReconciliationData } from '@/app/data/kami-ely/reconciliation';

type MatrixTabId = 'multi-window' | 'eight-datasets' | 'reconciliation-rules' | 'telemetry-sync';

export interface KamiElyDataScopeMatrixProps {
  scopeType?: 'shop' | 'creator';
  isEn?: boolean;
  openProofScreenshot?: (_id: string) => void;
  openProofModalWithGroup?: (_group: 'shop' | 'creator') => void;
  onOpenProofModal?: (_screenshotId?: string) => void;
}

export default function KamiElyDataScopeMatrix({
  scopeType,
  isEn: propIsEn,
  openProofScreenshot,
  openProofModalWithGroup,
  onOpenProofModal
}: KamiElyDataScopeMatrixProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');
  const [activeTab, setActiveTab] = useState<MatrixTabId>('multi-window');

  const tabs: { id: MatrixTabId; label: { vi: string; en: string }; badge: string }[] = [
    {
      id: 'multi-window',
      label: { vi: '1. Ma Trận 3 Khung Thời Gian', en: '1. 3-Window Scope Matrix' },
      badge: 'All-Time • 180d • 90d'
    },
    {
      id: 'eight-datasets',
      label: { vi: '2. Danh Mục 8 Bảng Gốc (CSV/SQL)', en: '2. 8 Raw Datasets Catalog' },
      badge: '18.778 Rows'
    },
    {
      id: 'reconciliation-rules',
      label: { vi: '3. Kiểm Toán & Giải Mã Chênh Lệch', en: '3. Data Audit & Reconciliation' },
      badge: '6 Rules'
    },
    {
      id: 'telemetry-sync',
      label: { vi: '4. Đồng Bộ Seller Center (180d)', en: '4. Seller Center 180d Sync' },
      badge: '4 Modules'
    }
  ];

  const handleOpenScreenshot = (screenshotId: string) => {
    if (openProofScreenshot) {
      openProofScreenshot(screenshotId);
    } else if (onOpenProofModal) {
      onOpenProofModal(screenshotId);
    } else if (openProofModalWithGroup) {
      openProofModalWithGroup(scopeType === 'creator' ? 'creator' : 'shop');
    }
  };

  return (
    <section id="data-scope-matrix" className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-2xl space-y-6">
      {/* HEADER & DATA INTEGRITY BADGES */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 rounded-md">
              {lang === 'vi' ? 'Kiểm Toán & Đồng Bộ Hóa Dữ Liệu (SSOT)' : 'Data Governance & Reconciliation (SSOT)'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-sky-800 bg-sky-50 border border-sky-200 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20 rounded-md">
              {lang === 'vi' ? 'Thu thập: 05/09/2026' : 'Collected: Sep 05, 2026'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-md">
              {lang === 'vi' ? '43% Followers Hà Nội • 73% Nữ' : '43% Hanoi Followers • 73% Female'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
            {lang === 'vi'
              ? 'Ma Trận Phạm Vi Dữ Liệu & Đối Soát Đa Chiều: Toàn Shop vs. Kênh Chính Chủ (@kamielyhn)'
              : 'Data Scope & Multi-Tier Reconciliation Matrix: Shop-Wide vs. Official Channel (@kamielyhn)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
            {lang === 'vi'
              ? 'Bảo toàn 100% số liệu gốc trong 8 bảng dữ liệu (18.778 bản ghi), phân tách minh bạch giữa Toàn thời gian (từ 18/08/2022), 180 ngày gần nhất (09/03 – 04/09/2026) và 90 ngày gần nhất.'
              : 'Preserves 100% of raw figures across all 8 datasets (18,778 records), cleanly separating All-Time (since Aug 18, 2022), Last 180 Days (Mar 09 – Sep 04, 2026), and Last 90 Days.'}
          </p>
        </div>

        {/* QUICK SUMMARY PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
              {lang === 'vi' ? 'GMV Toàn Shop (180d)' : 'Shop GMV (180d)'}
            </div>
            <div className="text-sm sm:text-base font-extrabold font-mono text-slate-950 dark:text-white">12,74 Tỉ đ</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">85.500 SP • All-time: 31,6 Tỉ</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
              {lang === 'vi' ? 'Chính Chủ (180d Net/Gross)' : 'Official (180d Net/Gross)'}
            </div>
            <div className="text-sm sm:text-base font-extrabold font-mono text-sky-700 dark:text-sky-400">5,80 / 7,89 Tỉ</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">470–475 LIVE • All-time: 9,2 Tỉ</div>
          </div>
          <div className="col-span-2 sm:col-span-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
              {lang === 'vi' ? 'Cơ Cấu 90 Ngày (6,14 Tỉ)' : '90d Split (6.14B VND)'}
            </div>
            <div className="text-xs sm:text-sm font-extrabold font-mono text-pink-700 dark:text-pink-400">
              49,3% • 27,8% • 22,9%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Chính chủ • KOC • Kệ hàng</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-950 border-sky-400 shadow-xs dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40 dark:shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-950 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-200 dark:hover:bg-slate-900'
                }`}
              >
                <span>{tab.label[lang]}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                    isActive ? 'bg-sky-200 text-sky-900 dark:bg-sky-500/30 dark:text-sky-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* PROOF GALLERY ACTION SHORTCUT */}
        {(openProofScreenshot || openProofModalWithGroup || onOpenProofModal) && (
          <button
            type="button"
            onClick={() => {
              if (openProofModalWithGroup) {
                openProofModalWithGroup(scopeType === 'creator' ? 'creator' : 'shop');
              } else if (onOpenProofModal) {
                onOpenProofModal();
              } else if (openProofScreenshot) {
                openProofScreenshot('sc-073329');
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>📷</span>
            <span>{lang === 'vi' ? 'Xem Ảnh Bằng Chứng' : 'View Proof Gallery'}</span>
          </button>
        )}
      </div>

      {/* TAB 1: MULTI-WINDOW COMPARISON MATRIX */}
      {activeTab === 'multi-window' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-mono uppercase text-[11px] dark:bg-slate-900/95 dark:text-slate-300 dark:border-slate-800">
                  <th className="p-3.5 min-w-[160px]">{lang === 'vi' ? 'Chỉ Số Đối Chiếu' : 'Metric'}</th>
                  <th className="p-3.5 min-w-[135px] bg-slate-100/60 dark:bg-slate-900/50">
                    <div>{lang === 'vi' ? 'Toàn Shop (All-Time)' : 'Shop (All-Time)'}</div>
                    <button
                      type="button"
                      onClick={() => handleOpenScreenshot('sc-073329')}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-normal cursor-pointer text-left"
                    >
                      Ảnh 073329 ↗
                    </button>
                  </th>
                  <th className="p-3.5 min-w-[145px] bg-slate-100/60 dark:bg-slate-900/50">
                    <div>{lang === 'vi' ? 'Chính Chủ (All-Time)' : 'Official (All-Time)'}</div>
                    <button
                      type="button"
                      onClick={() => handleOpenScreenshot('sc-080124')}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-normal cursor-pointer text-left"
                    >
                      Ảnh 080124 ↗
                    </button>
                  </th>
                  <th className="p-3.5 min-w-[165px] bg-sky-50 text-sky-900 dark:bg-sky-950/20 dark:text-sky-300">
                    <div>{lang === 'vi' ? 'Toàn Shop (180 Ngày)' : 'Shop (Last 180d)'}</div>
                    <div className="text-xs text-sky-700 dark:text-sky-400/80 font-normal">09/03 – 04/09/2026</div>
                  </th>
                  <th className="p-3.5 min-w-[185px] bg-sky-50 text-sky-900 dark:bg-sky-950/20 dark:text-sky-300">
                    <div>{lang === 'vi' ? 'Chính Chủ (180 Ngày)' : 'Official (Last 180d)'}</div>
                    <div className="text-xs text-sky-700 dark:text-sky-400/80 font-normal">Net UI vs. Gross CSV</div>
                  </th>
                  <th className="p-3.5 min-w-[160px] bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
                    <div>{lang === 'vi' ? 'Toàn Shop (90 Ngày)' : 'Shop (Last 90d)'}</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400/80 font-normal">_product data</div>
                  </th>
                  <th className="p-3.5 min-w-[160px] bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
                    <div>{lang === 'vi' ? 'Chính Chủ (90 Ngày)' : 'Official (Last 90d)'}</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400/80 font-normal">Creator Goods</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-700 dark:text-slate-200">
                {kamiReconciliationData.multiWindowMatrix.map((row) => (
                  <tr key={row.metricId} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div>{row.metricName[lang]}</div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">{row.auditNote[lang]}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 bg-slate-50/60 dark:text-slate-300 dark:bg-slate-900/20">{row.shopAllTime[lang]}</td>
                    <td className="p-3.5 font-mono text-slate-700 bg-slate-50/60 dark:text-slate-300 dark:bg-slate-900/20">{row.creatorAllTime[lang]}</td>
                    <td className="p-3.5 font-mono font-semibold text-sky-800 bg-sky-50/40 dark:text-sky-300 dark:bg-sky-950/10">{row.shop180d[lang]}</td>
                    <td className="p-3.5 font-mono font-semibold text-sky-800 bg-sky-50/40 dark:text-sky-200 dark:bg-sky-950/10">{row.creator180d[lang]}</td>
                    <td className="p-3.5 font-mono font-semibold text-emerald-800 bg-emerald-50/40 dark:text-emerald-300 dark:bg-emerald-950/10">
                      {row.shop90d[lang]}
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-emerald-800 bg-emerald-50/40 dark:text-emerald-200 dark:bg-emerald-950/10">
                      {row.creator90d[lang]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: 8 RAW DATASETS CATALOG (UNCHANGED MYSQL TABLES) */}
      {activeTab === 'eight-datasets' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300">
            <strong>{lang === 'vi' ? 'Cam kết Bảo toàn Dữ liệu Gốc:' : 'Raw Data Preservation Guarantee:'}</strong>{' '}
            {lang === 'vi'
              ? 'Toàn bộ 8 bảng dữ liệu dưới đây trong MySQL / CSV (tổng cộng 18.778 dòng) được giữ nguyên 100% không chỉnh sửa. Các phép đối soát kênh được thực hiện tự động qua truy vấn SQL JOIN và VIEW.'
              : 'All 8 tables below in MySQL / CSV (18,778 total rows) are 100% preserved without modification. Channel reconciliations are computed dynamically via SQL JOINs and VIEWs.'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kamiReconciliationData.eightDatasetsCatalog.map((ds) => (
              <div
                key={ds.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-200 text-sky-800 dark:bg-slate-800 dark:text-sky-400">
                      {ds.tableName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{ds.timeWindow[lang]}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white break-all">{ds.fileName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {ds.granularity[lang]} • <span className="font-mono text-slate-700 dark:text-slate-300">Key: {ds.joinKeys}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800/80 font-mono text-xs">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{lang === 'vi' ? 'Số bản ghi' : 'Rows'}</div>
                    <div className="font-bold text-slate-950 dark:text-white">{ds.rowCount.toLocaleString('vi-VN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{lang === 'vi' ? 'Sản lượng' : 'Units'}</div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">{ds.totalUnits.toLocaleString('vi-VN')} SP</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">GMV</div>
                    <div className="font-bold text-sky-700 dark:text-sky-400 truncate" title={ds.formattedGmv}>
                      {(ds.totalGmvVnd / 1e9).toFixed(2)} Tỉ đ
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-2.5">
                  {ds.keyInsight[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 6 RECONCILIATION RULES */}
      {activeTab === 'reconciliation-rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {kamiReconciliationData.reconciliationRules.map((rule) => (
            <div
              key={rule.ruleCode}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-pink-100 text-pink-800 border border-pink-200 dark:bg-pink-500/15 dark:text-pink-400 dark:border-pink-500/30">
                    {rule.ruleCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {rule.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rule.title[lang]}</h3>

                <div className="space-y-1.5 text-xs bg-white p-3 rounded-lg border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800/80">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Nguồn A: </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{rule.sourceAValue[lang]}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Nguồn B: </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{rule.sourceBValue[lang]}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-800/80 text-amber-700 dark:text-amber-400 font-mono text-[11px]">
                    Δ: {rule.deltaSummary[lang]}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-2.5">
                <strong className="text-sky-700 dark:text-sky-400">
                  {lang === 'vi' ? 'Quy chuẩn xử lý:' : 'Resolution Rule:'}
                </strong>{' '}
                {rule.technicalResolution[lang]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SYNCHRONIZED 180-DAY SELLER CENTER & LIVE WORKBENCH TELEMETRY */}
      {activeTab === 'telemetry-sync' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kamiReconciliationData.synchronizedTelemetryModules.map((mod) => (
            <div
              key={mod.moduleId}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30">
                    {mod.synchronizedWindow}
                  </span>
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">180d In-Window Synced</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{mod.moduleName[lang]}</h3>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-emerald-800 dark:bg-slate-950/90 dark:border-slate-800 dark:text-emerald-300">
                  ⚓ {mod.csvAnchorMetric[lang]}
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 pt-1">
                  {mod.telemetryMetrics.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item[lang]}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-200">
                <strong className="text-amber-700 dark:text-amber-400">
                  {lang === 'vi' ? 'Hành động Quản trị:' : 'Strategic Action:'}
                </strong>{' '}
                {mod.strategicTakeaway[lang]}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
