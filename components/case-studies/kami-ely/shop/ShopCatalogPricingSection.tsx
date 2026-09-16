'use client';

import React from 'react';
import { ShoppingBag, ImageIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import { shopPriceTierData, shopTopSKUs } from '@/app/data/kamiElyData';

interface ShopCatalogPricingSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string) => void;
  openProofScreenshot: (_id: string) => void;
  shopCategoryData: Record<string, any[]>;
  categoryMetric: 'units' | 'gmv' | 'byCount';
  setCategoryMetric: (_m: 'units' | 'gmv' | 'byCount') => void;
  priceMetric: 'units' | 'gmv' | 'byCount';
  setPriceMetric: (_m: 'units' | 'gmv' | 'byCount') => void;
}

export default function ShopCatalogPricingSection({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  shopCategoryData,
  categoryMetric,
  setCategoryMetric,
  priceMetric,
  setPriceMetric
}: ShopCatalogPricingSectionProps) {
  return (
    <section id="shop-products" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="1.3" 
        title={isEn ? "Product Analysis & Best-Selling SKUs" : "Phân Tích Sản Phẩm & Ma Trận SKU Chủ Lực"} 
        id="shop-products" 
        onCopy={copyDeepLink} 
        extraAction={
          <button
            onClick={() => openProofScreenshot('sc-073543')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 hover:bg-[#9BE7FA]/60 text-[#0D7287] font-bold flex items-center gap-1 border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer transition-all"
            title="Xem ảnh FastMoss gốc #073543, #073549, #073557"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ảnh FastMoss #073543-#073557</span>
          </button>
        } 
      />

      {/* Category & Price distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Category Distribution' : 'Cơ Cấu Ngành Hàng'}</h3>
            <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setCategoryMetric('units')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${categoryMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
              <button onClick={() => setCategoryMetric('gmv')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${categoryMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
              <button onClick={() => setCategoryMetric('byCount')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${categoryMetric === 'byCount' ? 'bg-[#C8EEF7] text-[#0D7287] shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'SKU Count' : 'Số mã SKU'}</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopCategoryData[categoryMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={135} />
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ trọng']} />
                <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Price Range Distribution' : 'Phân Khúc Mức Giá'}</h3>
            <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setPriceMetric('units')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priceMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
              <button onClick={() => setPriceMetric('gmv')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priceMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
              <button onClick={() => setPriceMetric('byCount')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priceMetric === 'byCount' ? 'bg-[#FFE485] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'SKU Count' : 'Số mã SKU'}</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopPriceTierData[priceMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="range" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={125} />
                <Tooltip formatter={(value, _name, item: any) => [item?.payload?.label || `${value}%`, 'Tỷ trọng']} />
                <Bar dataKey="value" fill="#FFD14C" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 6 SKUs Table */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
          {isEn ? 'Top Performing SKUs (Last 90 Days Telemetry)' : 'Top Sản Phẩm Bán Chạy Nhất (Dữ Liệu 90 Ngày)'}
        </h3>
        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#9BE7FA]/60 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#C8EEF7]/30 text-slate-800 font-bold uppercase border-b border-[#9BE7FA]/40 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Mã SKU</th>
                <th className="p-3.5">Tên Sản Phẩm</th>
                <th className="p-3.5">Phân Loại</th>
                <th className="p-3.5">Giá Bán</th>
                <th className="p-3.5">Đã Bán</th>
                <th className="p-3.5">Doanh Thu (GMV)</th>
                <th className="p-3.5">Hoa Hồng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {shopTopSKUs.map((sku) => (
                <tr key={sku.code} className="hover:bg-[#C8EEF7]/10 transition-colors dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-bold font-mono text-[#0D7287] dark:text-[#9BE7FA]">{sku.code}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">{sku.name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{sku.category}</td>
                  <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">{sku.price.toLocaleString()} đ</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{sku.units.toLocaleString()} SP</td>
                  <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{sku.gmv} Triệu đ</td>
                  <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{sku.commission}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
          {shopTopSKUs.map((sku) => (
            <div key={sku.code} className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-black text-[#0D7287] dark:text-[#9BE7FA] px-2 py-0.5 rounded-md bg-[#C8EEF7]/50 dark:bg-slate-800">
                  {sku.code}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {sku.category}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                {sku.name}
              </h4>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">{isEn ? 'Price' : 'Giá bán'}</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{sku.price.toLocaleString()} đ</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                  <div className="font-bold text-slate-900 dark:text-white">{sku.units.toLocaleString()} SP</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">GMV</div>
                  <div className="font-bold text-[#0D7287] dark:text-[#FFD14C]">{sku.gmv} Tr đ</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Hoa hồng</div>
                  <div className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">{sku.commission}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
