'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface ShopCatalogPricingSectionProps {
  isEn?: boolean;
  copyDeepLink?: (_id: string) => void;
  openProofScreenshot?: (_id: string) => void;
  shopCategoryData?: Record<string, any[]>;
  categoryMetric?: 'units' | 'gmv' | 'byCount';
  setCategoryMetric?: (_m: 'units' | 'gmv' | 'byCount') => void;
  priceMetric?: 'units' | 'gmv' | 'byCount';
  setPriceMetric?: (_m: 'units' | 'gmv' | 'byCount') => void;
  topSkus?: any[];
  isLiveDb?: boolean;
}

export default function ShopCatalogPricingSection({
  isEn: propIsEn,
  copyDeepLink: _copyDeepLink,
  openProofScreenshot,
  shopCategoryData: _shopCategoryData,
  categoryMetric: _categoryMetric,
  setCategoryMetric: _setCategoryMetric,
  priceMetric: _priceMetric,
  setPriceMetric: _setPriceMetric,
  topSkus: _topSkus,
  isLiveDb: _isLiveDb
}: ShopCatalogPricingSectionProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');
  const [activeSubTab, setActiveSubTab] = useState<'sku-matrix' | 'shopping-tab' | 'promo-engine'>('sku-matrix');

  // 1. Cơ cấu 3 Ngành hàng trong 90 ngày (331 SKUs = 6.136.205.973 VNĐ | 40.229 SP)
  const categoryBreakdown = [
    {
      id: 'cat-swimwear',
      name: { vi: 'Sports & Outdoor (Đồ bơi & Bikini)', en: 'Sports & Outdoor (Swimwear & Bikini)' },
      gmvVnd: 4252990392,
      csvGmvSharePct: 69.31,
      uiGmvSharePct: 66.48,
      unitsSold: 27208,
      csvUnitsSharePct: 67.64,
      uiUnitsSharePct: 60.46,
      videoFormatSharePct: 98.33,
      seasonalityNote: {
        vi: 'Động lực tăng trưởng chính tháng 4–6 (đỉnh 3,77 Tỉ đ tháng 6), nhưng sụt giảm mạnh từ tháng 8 khi 43% khách Hà Nội hết mùa đi biển.',
        en: 'Primary growth driver in Apr–Jun (3.77B VND June peak), but drops sharply in August as 43% Hanoi audience exits beach season.'
      },
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
    },
    {
      id: 'cat-womenswear',
      name: { vi: 'Womenswear & Underwear (Chân váy, Áo, Đồ nữ)', en: 'Womenswear & Underwear (Skirts, Tops, Apparel)' },
      gmvVnd: 1718349602,
      csvGmvSharePct: 28.00,
      uiGmvSharePct: 33.22,
      unitsSold: 10764,
      csvUnitsSharePct: 26.76,
      uiUnitsSharePct: 37.85,
      videoFormatSharePct: 1.52,
      seasonalityNote: {
        vi: 'Mũi nhọn xoay trục mùa Thu – Đông quanh năm: Mã Chân váy chữ A (CV11) đứng #1 toàn shop về sản lượng (6.375 SP / 735,07 Tr đ).',
        en: 'Year-round & Autumn/Winter pivot engine: A-Line Skirt (CV11) ranks #1 shop-wide in volume (6,375 units / 735.07M VND).'
      },
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'cat-accessories',
      name: { vi: 'Fashion Accessories (Khăn quấn & Phụ kiện biển)', en: 'Fashion Accessories (Sarongs & Beachwear Acc)' },
      gmvVnd: 145417117,
      csvGmvSharePct: 2.37,
      uiGmvSharePct: 0.31,
      unitsSold: 2094,
      csvUnitsSharePct: 5.20,
      uiUnitsSharePct: 1.80,
      videoFormatSharePct: 0.15,
      seasonalityNote: {
        vi: 'Sản phẩm phễu bán kèm (Add-on Deal / Cross-sell) giúp nâng giá trị đơn hàng trung bình (AOV) từ 128.600 đ lên 150.991 đ.',
        en: 'Add-on & cross-sell items that lift Average Order Value (AOV) from 128,600 VND to 150,991 VND.'
      },
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
  ];

  // 2. Ma trận Top SKU đối chiếu Toàn Shop (_product data) vs. Kênh Chính Chủ (Creator Goods)
  const heroSkuMatrix = [
    {
      skuCode: 'H36',
      name: { vi: 'Set Bikini 2 Mảnh Kẻ Sọc (H36)', en: 'Striped 2-Piece Bikini Set (H36)' },
      category: 'Sports & Outdoor',
      priceVnd: 194019,
      shopUnits90d: 4360,
      shopGmv90d: 824024829,
      selfUnits90d: 2852,
      selfGmv90d: 500200000,
      selfReliancePct: 65.41,
      roleTag: { vi: 'Kênh Chính Chủ Tự Gánh (65,4%)', en: 'Official Channel Core (65.4%)' }
    },
    {
      skuCode: 'CV11',
      name: { vi: 'Chân Váy Ngắn Form Chữ A Dáng Ôm (CV11)', en: 'Fitted A-Line Mini Skirt (CV11)' },
      category: 'Womenswear & Underwear',
      priceVnd: 125000,
      shopUnits90d: 6375,
      shopGmv90d: 735067229,
      selfUnits90d: 1338,
      selfGmv90d: 164700000,
      selfReliancePct: 20.99,
      roleTag: {
        vi: 'Top #1 Sản Lượng • Dư Địa Đẩy LIVE Thu–Đông (79% từ KOC/Kệ hàng)',
        en: '#1 Volume Hero • Autumn LIVE Pivot Opportunity (79% via KOC/Cards)'
      }
    },
    {
      skuCode: 'M18',
      name: { vi: 'Bikini 1 Mảnh Bodysuit Đen & Xanh Viền Trắng (M18)', en: '1-Piece Bodysuit Bikini (M18)' },
      category: 'Sports & Outdoor',
      priceVnd: 99000,
      shopUnits90d: 2307,
      shopGmv90d: 463963132,
      selfUnits90d: 1313,
      selfGmv90d: 256100000,
      selfReliancePct: 56.91,
      roleTag: { vi: 'Sản Phẩm Mồi Kéo Traffic (<100k)', en: 'Traffic Magnet SKU (<100k VND)' }
    },
    {
      skuCode: 'H32',
      name: { vi: 'Set Bikini 2 Mảnh Xanh Rêu Free Size (H32)', en: 'Moss Green 2-Piece Bikini Set (H32)' },
      category: 'Sports & Outdoor',
      priceVnd: 162682,
      shopUnits90d: 2681,
      shopGmv90d: 390995921,
      selfUnits90d: 1664,
      selfGmv90d: 242700000,
      selfReliancePct: 62.07,
      roleTag: { vi: 'Vùng Giá Vàng 100k–200k (62,1% Chính Chủ)', en: '100k–200k Sweet Spot (62.1% Self)' }
    }
  ];

  // 3. Top Thẻ sản phẩm tiềm năng cao trong 7 ngày (Đồng bộ tuần 25/03 – 31/03/2026)
  const highPotentialProductCards = [
    {
      sku: 'CV11',
      name: { vi: 'Chân Váy Ngắn Form Chữ A Dáng Ôm (CV11)', en: 'Fitted A-Line Mini Skirt (CV11)' },
      viewers7d: '161,42K',
      clicks7d: '10,08K',
      ctrPct: '6,25%',
      conversionMetric: { vi: '782 khách mua / 7 ngày (~112 khách/ngày)', en: '782 buyers / 7d (~112/day)' },
      action: { vi: 'Đưa lên Ghim #1 sóng LIVE chính chủ & Bật Flash Sale', en: 'Pin #1 on Official LIVE & Enable Flash Sale' }
    },
    {
      sku: 'CV-REN',
      name: { vi: 'Chân váy dài phối viền ren (Womenswear)', en: 'Lace-Trimmed Midi Skirt (Womenswear)' },
      viewers7d: '23,61K',
      clicks7d: '1,89K',
      ctrPct: '8,01%',
      conversionMetric: { vi: 'GMV 4,03 Tr đ (+471,28% tăng trưởng tuần)', en: 'GMV 4.03M VND (+471.28% weekly growth)' },
      action: { vi: 'Mũi nhọn xoay trục Thu – Đông cho tệp 43% khách Hà Nội', en: 'Autumn/Winter hero for 43% Hanoi audience' }
    },
    {
      sku: 'BKN-TG01',
      name: { vi: '[TRỢ GIÁ] Bikini 2 chi tiết đi biển', en: '[SUBSIDIZED] 2-Piece Beach Bikini' },
      viewers7d: '65,07K',
      clicks7d: '3,92K',
      ctrPct: '6,02%',
      conversionMetric: { vi: 'GMV 2,65 Tr đ (CVR mới đạt 0,25% — Báo động đỏ)', en: 'GMV 2.65M VND (CVR only 0.25% — Red Alert)' },
      action: { vi: 'Bổ sung video 15s quay cận chất vải & bảng size thật', en: 'Add 15s fabric close-up video & size chart' }
    },
    {
      sku: 'SET-VOAN',
      name: { vi: '[TRỢ GIÁ] SET áo voan + chân váy đi biển', en: '[SUBSIDIZED] Chiffon Top + Beach Skirt Set' },
      viewers7d: '44,22K',
      clicks7d: '2,74K',
      ctrPct: '6,20%',
      conversionMetric: { vi: 'GMV 2,02 Tr đ (+52,54% tăng trưởng tuần)', en: 'GMV 2.02M VND (+52.54% weekly growth)' },
      action: { vi: 'Thiết lập Deal Mua Kèm (Add-on Deal) để đẩy AOV >150k', en: 'Set up Add-on Deal to push AOV >150k VND' }
    }
  ];

  return (
    <section id="shop-products" className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/90 dark:shadow-2xl space-y-6 scroll-mt-36">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30 rounded-md">
              {lang === 'vi' ? 'Danh Mục 331 SKUs • Kệ Hàng & Khuyến Mãi' : '331 SKUs Catalog • Shopping Tab & Promotions'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-md">
              {lang === 'vi' ? '90 Ngày: 6.136.205.973 đ • 40.229 SP' : '90d: 6,136,205,973 VND • 40,229 Units'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
            {lang === 'vi'
              ? 'Chiến Lược Danh Mục Ngành Hàng, Phễu Thẻ Sản Phẩm (1,17M Views) & Công Cụ Giá'
              : 'Category Portfolio Strategy, Product Card Funnel (1.17M Views) & Pricing Engine'}
          </h2>
        </div>

        {/* SUB-NAVIGATION */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'sku-matrix', label: { vi: '1. Ngành Hàng & Rổ Giá', en: '1. Categories & Price Tiers' } },
            { id: 'shopping-tab', label: { vi: '2. Phễu Thẻ SP (1,17M Views)', en: '2. Shopping Tab (1.17M Views)' } },
            { id: 'promo-engine', label: { vi: '3. Công Cụ Khuyến Mãi (35,86%)', en: '3. Promotions Engine (35.86%)' } }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-sky-50 text-sky-950 border-sky-400 shadow-xs dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/50'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-950 hover:bg-slate-100 dark:bg-slate-900/70 dark:text-slate-400 dark:border-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: CATEGORY & SKU SELF-RELIANCE MATRIX */}
      {activeSubTab === 'sku-matrix' && (
        <div className="space-y-6">
          {/* 3 CATEGORY CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${cat.badgeColor}`}>
                    CSV: {cat.csvGmvSharePct}% GMV (UI: {cat.uiGmvSharePct}%)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name[lang]}</h3>
                  <div className="text-2xl font-extrabold font-mono text-slate-950 dark:text-white">
                    {(cat.gmvVnd / 1e9).toFixed(2)} Tỉ VNĐ
                  </div>
                  <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                    {cat.unitsSold.toLocaleString('vi-VN')} SP ({cat.csvUnitsSharePct}% CSV | {cat.uiUnitsSharePct}% UI)
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-2.5">
                  {cat.seasonalityNote[lang]}
                </p>
              </div>
            ))}
          </div>

          {/* SWEET SPOT PRICE TIER BAR */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {lang === 'vi'
                  ? 'Phân Bổ Phân Khúc Giá (Sweet Spot 100.000đ – 200.000đ chiếm 67,37% GMV; Nhóm >75.000đ chiếm 98,9% GMV)'
                  : 'Price Tier Distribution (100k–200k VND Sweet Spot drives 67.37% GMV; >75k VND drives 98.9% GMV)'}
              </span>
              <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">AOV Cơ Sở: 128.600 đ → AOV Khuyến Mãi: 150.991 đ</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
              <div className="bg-amber-400 h-full" style={{ width: '20.8%' }} title="< 100k VNĐ: 20,80%" />
              <div className="bg-sky-500 h-full" style={{ width: '67.37%' }} title="100k - 200k VNĐ: 67,37%" />
              <div className="bg-emerald-500 h-full" style={{ width: '11.83%' }} title="> 200k VNĐ: 11,83%" />
            </div>
            <div className="flex flex-wrap justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>🟡 &lt; 100k VNĐ: 20,80% GMV (1,28 Tỉ đ • 9.898 SP)</span>
              <span className="text-sky-700 dark:text-sky-300 font-bold">🔵 100k – 200k VNĐ (Vùng giá vàng): 67,37% GMV (4,13 Tỉ đ • 27.276 SP)</span>
              <span>🟢 200k – 300k VNĐ: 11,83% GMV (726,07 Tr đ • 3.054 SP)</span>
            </div>
          </div>

          {/* HERO SKU SELF-RELIANCE TABLE */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-mono uppercase text-[11px] dark:bg-slate-900/95 dark:text-slate-300 dark:border-slate-800">
                  <th className="p-3.5">{lang === 'vi' ? 'Mã & Tên Sản Phẩm (Hero SKU)' : 'Hero SKU'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Đơn Giá' : 'Price'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Toàn Shop (90d)' : 'Shop Total (90d)'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Kênh Chính Chủ (90d)' : 'Official Channel (90d)'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Tỷ Lệ Tự Gánh' : 'Self-Reliance %'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Chiến Lược Phân Bổ Kênh' : 'Channel Strategy'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-700 dark:text-slate-200">
                {heroSkuMatrix.map((sku) => (
                  <tr key={sku.skuCode} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div>{sku.name[lang]}</div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{sku.category}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{sku.priceVnd.toLocaleString('vi-VN')} đ</td>
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-slate-950 dark:text-white">{sku.shopUnits90d.toLocaleString('vi-VN')} SP</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{(sku.shopGmv90d / 1e6).toFixed(2)} Tr đ</div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-sky-700 dark:text-sky-300">{sku.selfUnits90d.toLocaleString('vi-VN')} SP</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{(sku.selfGmv90d / 1e6).toFixed(1)} Tr đ</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{sku.selfReliancePct}%</td>
                    <td className="p-3.5 text-[11px] text-amber-800 dark:text-amber-300 font-semibold">{sku.roleTag[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SHOPPING TAB / PRODUCT CARD DIAGNOSTICS (1.17M VIEWERS & 0.25% CVR) */}
      {activeSubTab === 'shopping-tab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {lang === 'vi' ? 'Lượt Xem Thẻ Sản Phẩm (28 Ngày)' : 'Product Card Viewers (28d)'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 dark:text-white">1,17 Triệu</div>
              <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400">+34,46% (Vượt 80% đối thủ cùng ngành)</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {lang === 'vi' ? 'Doanh Thu Kệ Hàng (28d / 90d)' : 'Product Card GMV (28d / 90d)'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-700 dark:text-sky-400">
                442,36 Tr / 1,40 Tỉ
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
                Chiếm 22,85% – 22,87% GMV 90 ngày (8.630 SP)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 space-y-1.5">
              <div className="text-xs font-mono text-rose-800 dark:text-rose-300">
                {lang === 'vi' ? 'Tỷ Lệ Xem Đến Thanh Toán (CVR)' : 'View-to-Pay Conversion Rate (CVR)'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700 dark:text-rose-400">0,25% 🚨</div>
              <div className="text-xs font-mono text-rose-800 dark:text-rose-300">
                Giảm -38,4% (400 người xem mới có 1 người mua)
              </div>
            </div>
          </div>

          {/* 3 TRAFFIC SOURCES OF PRODUCT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-1">
              <div className="font-mono font-bold text-amber-700 dark:text-amber-400">1. Nguồn Khác / Shopping Ads (44,5% GMV)</div>
              <div className="text-lg font-extrabold font-mono text-slate-950 dark:text-white">192,0 Triệu VNĐ</div>
              <p className="text-slate-600 dark:text-slate-400">Đổ về từ quảng cáo Shopping Ads, link ngoại sàn và giỏ hàng Affiliate.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-1">
              <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">2. Tìm Kiếm Chủ Động (Search)</div>
              <div className="text-lg font-extrabold font-mono text-slate-950 dark:text-white">74,6 Triệu VNĐ</div>
              <p className="text-slate-600 dark:text-slate-400">Khách gõ từ khóa trực tiếp, tỷ lệ chuyển đổi cao nhất trên Kệ hàng.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 space-y-1">
              <div className="font-mono font-bold text-sky-700 dark:text-sky-400">3. Đề Xuất TikTok (1,71 Triệu PV)</div>
              <div className="text-lg font-extrabold font-mono text-slate-950 dark:text-white">58,0 Triệu VNĐ</div>
              <p className="text-slate-600 dark:text-slate-400">Lượng hiển thị khổng lồ (1,71M PV) nhưng thoát trang cao do thiếu video review thật.</p>
            </div>
          </div>

          {/* HIGH POTENTIAL PRODUCT CARDS TABLE (SYNCED TO MAR 25 - MAR 31, 2026) */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-mono uppercase text-[11px] dark:bg-slate-900/95 dark:text-slate-300 dark:border-slate-800">
                  <th className="p-3.5">{lang === 'vi' ? 'Thẻ Sản Phẩm Tiềm Năng (Tuần 25/03 – 31/03/2026)' : 'High-Potential Product Card'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Người Xem (7d)' : 'Viewers (7d)'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Lượt Click (CTR)' : 'Clicks (CTR)'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Hiệu Suất Chuyển Đổi' : 'Conversion Performance'}</th>
                  <th className="p-3.5">{lang === 'vi' ? 'Hành Động Tối Ưu Kệ Hàng' : 'Optimization Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-700 dark:text-slate-200">
                {highPotentialProductCards.map((card) => (
                  <tr key={card.sku} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{card.name[lang]}</td>
                    <td className="p-3.5 font-mono text-sky-700 dark:text-sky-300 font-bold">{card.viewers7d}</td>
                    <td className="p-3.5 font-mono">
                      {card.clicks7d} <span className="text-emerald-700 dark:text-emerald-400 font-semibold">({card.ctrPct})</span>
                    </td>
                    <td className="p-3.5 font-mono text-amber-800 dark:text-amber-300 font-semibold">{card.conversionMetric[lang]}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{card.action[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MARKETING & PROMOTIONS ENGINE (35.86% GMV SHARE & 50.45% DISCOUNT COST) */}
      {activeSubTab === 'promo-engine' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Tỷ Trọng GMV Khuyến Mãi</div>
              <div className="text-2xl font-extrabold font-mono text-slate-950 dark:text-white mt-1">35,86% (123,3 Tr đ)</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono mt-1 font-semibold">Động lực kích cầu đơn hàng</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">AOV Đơn Hàng Khuyến Mãi</div>
              <div className="text-2xl font-extrabold font-mono text-sky-700 dark:text-sky-400 mt-1">150.991 VNĐ</div>
              <div className="text-[11px] text-sky-700 dark:text-sky-300 font-mono mt-1 font-semibold">+17,41% vs. AOV chung (128.600 đ)</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30">
              <div className="text-[11px] font-mono text-rose-800 dark:text-rose-300">Chi Phí Giảm Giá (Discount Cost)</div>
              <div className="text-2xl font-extrabold font-mono text-rose-700 dark:text-rose-400 mt-1">62,2 Triệu VNĐ</div>
              <div className="text-[11px] text-rose-800 dark:text-rose-300 font-mono mt-1 font-semibold">Chiết khấu ~50,45% doanh thu KM</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-500/30">
              <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300">Cơ Cấu Công Cụ Bị Lệch</div>
              <div className="text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-1">96,35% Cố Định</div>
              <div className="text-[11px] text-amber-800 dark:text-amber-200 font-mono mt-1 font-semibold">Flash Sale LIVE: 19,65% • Thường: 0,2%</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 dark:bg-slate-900/70 dark:border-slate-800 dark:text-slate-300 space-y-2 leading-relaxed">
            <div className="font-bold text-slate-950 dark:text-white text-sm">
              {lang === 'vi'
                ? 'Chẩn đoán & Giải pháp Tái cấu trúc Biên lợi nhuận Khuyến mãi:'
                : 'Diagnostic & Promotional Margin Restructuring Plan:'}
            </div>
            <p>
              {lang === 'vi'
                ? 'Việc chi 62,2 triệu đ giảm giá để thu về 123,3 triệu đ GMV khuyến mãi (tỷ lệ chiết khấu ~50%) chủ yếu do shop cài đặt "Giảm giá cố định" kéo dài suốt 28 ngày (chiếm 96,35%, tiêu biểu là chiến dịch xả kho giao mùa 141 triệu đ). Để giữ nguyên mức AOV cao 150.991 đ nhưng giảm tỷ lệ chiết khấu xuống 30%–35%, shop cần thay giảm giá cố định bằng: (1) Flash Sale 2 tiếng trên Kệ hàng (hiện mới chiếm 0,2%), (2) Flash Sale chớp nhoáng trong phiên LIVE (nâng từ 19,65% lên 40%), và (3) Mua kèm deal sốc (Add-on Deal: Mua Bikini giảm 50% Áo lưới/Khăn quấn).'
                : 'Spending 62.2M VND in discounts to generate 123.3M VND in promotional GMV (~50% markdown rate) stems from relying 96.35% on 28-day Fixed Discounts (such as the 141M VND seasonal clearance campaign). To preserve the 150,991 VND AOV while reducing markdowns to 30%–35%, replace fixed discounts with: (1) 2-hour Shopping Tab Flash Sales (currently 0.2%), (2) LIVE Flash Sales (scale from 19.65% to 40%), and (3) Add-on Deals (Buy Bikini, get 50% off Mesh Cover-up/Sarong).'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
