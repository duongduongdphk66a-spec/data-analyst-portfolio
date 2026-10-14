'use client';

import React from 'react';
import { ShoppingBag, ImageIcon, TrendingUp, Tag, Compass, Sparkles, Layers } from 'lucide-react';
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
  topSkus?: any[];
  isLiveDb?: boolean;
}

export default function ShopCatalogPricingSection({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  shopCategoryData,
  categoryMetric,
  setCategoryMetric,
  priceMetric,
  setPriceMetric,
  topSkus,
  isLiveDb
}: ShopCatalogPricingSectionProps) {
  const skuList = topSkus && topSkus.length > 0 ? topSkus : shopTopSKUs;

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
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? 'Top Performing SKUs (Last 90 Days Telemetry)' : 'Top Sản Phẩm Bán Chạy Nhất (Dữ Liệu 90 Ngày)'}
          </h3>
          {isLiveDb && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MySQL Live Telemetry
            </span>
          )}
        </div>
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
              {skuList.map((sku) => (
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
          {skuList.map((sku) => (
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

      {/* 1.3.B Pricing Sweet Spot & Seasonal Category Pivot Strategy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-sky-50/40 border-2 border-sky-300/80 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/20 dark:border-sky-800/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200/60 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-900 dark:text-sky-300 text-xs font-black uppercase tracking-wider border border-sky-500/20">
              <Compass className="w-3.5 h-3.5 text-[#0D7287] dark:text-sky-400" />
              <span>{isEn ? 'STRATEGIC PORTFOLIO MANAGEMENT' : 'ĐỊNH VỊ RỔ GIÁ & XOAY TRỤC DANH MỤC THU – ĐÔNG'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? 'Pricing Sweet Spot (100k–200k VND) & Seasonal Category Pivot' 
                : 'Vùng Giá Vàng (100k–200k đ) & Kịch Bản Chuyển Dịch Danh Mục Mùa Vụ'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-700 text-[#0D7287] dark:text-sky-300 shrink-0 self-start sm:self-auto">
            159/179 SKUs &gt; 75k đ (88,8%)
          </span>
        </div>

        {/* 2-Column Comparative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Pricing Sweet Spot */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? '1. Pricing Sweet Spot Concentration' : '1. Vùng Giá Vàng & Cơ Cấu Phân Khúc'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dữ liệu viễn trắc rổ giá chứng minh shop tập trung cực kỳ nhất quán vào phân khúc thời trang trung cấp:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
                <div>
                  <span className="font-black text-slate-900 dark:text-white">Phân khúc &gt; 75.000 đ:</span>
                  <span className="text-[11px] text-slate-500 block">159 SKU (88,75% danh mục)</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#0D7287] dark:text-[#9BE7FA] text-sm">98,90% GMV</span>
                  <span className="text-[10px] text-slate-500 block">94,95% Sản lượng</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <span className="font-black text-amber-900 dark:text-amber-200">Vùng Giá Vàng (100k – 200k đ):</span>
                  <span className="text-[11px] text-slate-500 block">Top Hero SKUs (CV11 125k, H36 194k, H32 162k)</span>
                </div>
                <div className="text-right font-black text-amber-700 dark:text-amber-300 text-sm">
                  67,4% Doanh số
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              → Phân khúc &lt; 45.000 đ chỉ đóng góp <strong>1,21% sản lượng</strong> và <strong>0,13% GMV</strong>, khẳng định shop không bán phá giá mà thành công nhờ định vị phân khúc chất lượng.
            </p>
          </div>

          {/* Right: Seasonal Category Pivot */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {isEn ? '2. Seasonal Category Pivot Strategy' : '2. Kịch Bản Xoay Trục Ngành Hàng Mùa Vụ'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ngành hàng <strong>Sports & Outdoor (Bikini/Đồ bơi)</strong> đang chiếm tới <strong>60,46% sản lượng</strong> và <strong>66,48% GMV</strong> toàn shop (thậm chí 79,31% sản lượng & 98,33% GMV trên Shoppable Video):
            </p>
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-indigo-950 dark:text-indigo-200">
                <span>Rủi ro điểm rơi tháng 8 – 9:</span>
                <span className="font-black text-rose-600 dark:text-rose-400">Doanh số hạ nhiệt cuối hè</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                Khi mùa du lịch biển khép lại (doanh thu trượt dốc từ đỉnh 1,06 Tỷ/tuần về 83,5M đ/2 tuần cuối tháng 8), shop cần lập tức kích hoạt nhóm <strong>Womenswear & Underwear</strong> (đang sẵn có 37,85% sản lượng và 33,22% GMV).
              </p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              → Đẩy mạnh các mã thời trang 4 mùa như <strong>Chân váy ngắn chữ A (CV11)</strong>, <strong>Chân váy ren dài</strong>, kết hợp điều chuyển ngân sách từ các chiến dịch xả kho hè sang dòng sản phẩm ứng dụng quanh năm.
            </p>
          </div>
        </div>

        {/* Senior Strategic Takeaway */}
        <div className="p-4 rounded-2xl bg-[#0D7287]/10 border border-[#0D7287]/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">Khuyến nghị Analytics: </strong>
            Không giữ nguyên tỷ trọng ngân sách quảng cáo của mùa hè cho mùa thu đông. Tái cấu trúc danh mục SKU ngay từ tháng 7 bằng cách chuẩn bị các bộ sưu tập thời trang dạo phố / công sở trẻ để giữ nhịp tăng trưởng doanh thu mà không bị suy giảm theo tính mùa vụ của đồ bơi.
          </p>
        </div>
      </div>
    </section>
  );
}

