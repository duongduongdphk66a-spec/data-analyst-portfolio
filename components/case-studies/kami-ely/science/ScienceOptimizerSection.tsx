'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface ScienceOptimizerSectionProps {
  isEn?: boolean;
  liveHoursReduction?: number;
  setLiveHoursReduction?: (_v: number) => void;
  videoCoverage?: number;
  setVideoCoverage?: (_v: number) => void;
  simulatorMetrics?: {
    operationalCostSavedMillion?: string;
    additionalVideoGmvMillion?: string;
    incrementalVideos?: number;
    netBenefitMillion?: string;
  };
}

export default function ScienceOptimizerSection({
  isEn: propIsEn,
  liveHoursReduction: _propLiveReduction,
  setLiveHoursReduction: _setLiveHoursReduction,
  videoCoverage: _propVideoCoverage,
  setVideoCoverage: _setVideoCoverage,
  simulatorMetrics: _simulatorMetrics
}: ScienceOptimizerSectionProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  // 4 Thanh trượt điều khiển (Interactive Sliders) khởi tạo ở kịch bản mục tiêu khả thi
  const [targetCardCvr, setTargetCardCvr] = useState<number>(0.75);          // Baseline: 0,25% trên 1,17M người xem (442,36 Tr đ)
  const [monetizedVideosCount, setMonetizedVideosCount] = useState<number>(220); // Tối đa: 308 video chưa gắn giỏ (859 - 551)
  const [targetPromoDiscountPct, setTargetPromoDiscountPct] = useState<number>(35.0); // Baseline: 50,45% (Chi 62,2 Tr / 123,3 Tr GMV KM)
  const [targetActiveKocPct, setTargetActiveKocPct] = useState<number>(10.0); // Baseline: 5,11% (292 / 5.713 Creators có đơn)

  // Hằng số chuẩn hóa từ 8 bảng dữ liệu & Seller Center của Kami Ely
  const BASE_CARD_VIEWERS_28D = 1170000;
  const BASE_CARD_GMV_28D = 442364954;
  const BASE_CARD_CVR_PCT = 0.25;

  const VIDEO_GPM_VND = 135200;        // 135,2k VNĐ / 1.000 views (Gấp 4,5x LIVE GPM 30,2k)
  const AVG_VIEWS_PER_VIDEO_90D = 16400;

  const BASE_PROMO_GMV_VND = 123300000;
  const BASE_PROMO_DISCOUNT_COST_VND = 62200000;

  const TOTAL_CREATORS_COUNT = 5713;
  const BASE_ACTIVE_CREATORS_COUNT = 292;

  const sim = useMemo(() => {
    // 1. Doanh thu tăng thêm từ nâng CVR Thẻ sản phẩm (Shopping Tab)
    const newCardGmv = BASE_CARD_GMV_28D * (targetCardCvr / BASE_CARD_CVR_PCT);
    const cardGmvUplift = Math.max(0, newCardGmv - BASE_CARD_GMV_28D);

    // 2. Doanh thu từ gắn giỏ hàng cho 308 video + đăng đúng khung giờ vàng (12:00–13:00 & 15:00–16:00)
    // Giả định thận trọng đạt 45% lượng view trung bình của video thương mại
    const incrementalVideoViews = monetizedVideosCount * AVG_VIEWS_PER_VIDEO_90D * 0.45;
    const videoGmvUplift = (incrementalVideoViews / 1000) * VIDEO_GPM_VND;

    // 3. Chi phí chiết khấu tiết kiệm được khi chuyển từ Giảm giá cố định (96,35%) sang Flash Sale & Deal mua kèm
    const newDiscountCost = BASE_PROMO_GMV_VND * (targetPromoDiscountPct / 100);
    const savedDiscountMargin = Math.max(0, BASE_PROMO_DISCOUNT_COST_VND - newDiscountCost);

    // 4. Doanh thu mở rộng từ kích hoạt nhóm Nano/Micro KOC (<5k followers đang chiếm >95% GMV Affiliate)
    const targetActiveCreators = Math.round((TOTAL_CREATORS_COUNT * targetActiveKocPct) / 100);
    const newlyActivatedKocs = Math.max(0, targetActiveCreators - BASE_ACTIVE_CREATORS_COUNT);
    const affiliateGmvUplift = newlyActivatedKocs * 2200000; // Ước tính thận trọng 2,2 Tr đ/KOC mới kích hoạt

    const totalMonthlyValueCreated =
      cardGmvUplift + videoGmvUplift + savedDiscountMargin + affiliateGmvUplift;

    return {
      newCardGmv,
      cardGmvUplift,
      videoGmvUplift,
      savedDiscountMargin,
      newlyActivatedKocs,
      affiliateGmvUplift,
      totalMonthlyValueCreated
    };
  }, [targetCardCvr, monetizedVideosCount, targetPromoDiscountPct, targetActiveKocPct]);

  const formatVnd = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)} Tỉ VNĐ`;
    return `${Math.round(val / 1e6).toLocaleString('vi-VN')} Tr VNĐ`;
  };

  return (
    <section id="science-optimizer" className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 p-5 sm:p-8 shadow-2xl space-y-6 scroll-mt-36">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30 rounded-md">
            {lang === 'vi' ? 'Mô Hình Mô Phỏng Quyết Định (What-If ROI & Margin Simulator)' : 'Interactive What-If ROI & Margin Simulator'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {lang === 'vi'
              ? 'Mô Phỏng Tác Động Doanh Thu & Biên Lợi Nhuận Từ 4 Đòn Bẩy Dữ Liệu'
              : 'Simulating GMV & Margin Impact Across 4 Data-Driven Levers'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'vi'
              ? 'Kéo các thanh trượt bên dưới để kiểm chứng tác động tài chính dựa trên hệ số thực tế từ 18.778 bản ghi.'
              : 'Drag the sliders below to test financial impact using empirical coefficients from the 18,778 records.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTargetCardCvr(1.0);
            setMonetizedVideosCount(308);
            setTargetPromoDiscountPct(32.0);
            setTargetActiveKocPct(12.0);
          }}
          className="self-start lg:self-auto px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition cursor-pointer"
        >
          ⚡ {lang === 'vi' ? 'Áp dụng Kịch bản Tối ưu Toàn diện (1,0% CVR)' : 'Apply Full Optimization Preset (1.0% CVR)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: 4 INTERACTIVE SLIDERS */}
        <div className="lg:col-span-7 space-y-4">
          {/* Slider 1 */}
          <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                {lang === 'vi'
                  ? `1. Nâng CVR Kệ hàng (${BASE_CARD_VIEWERS_28D.toLocaleString('vi-VN')} người xem — Baseline: 0,25%)`
                  : '1. Lift Shopping Tab CVR (1.17M Viewers — Baseline: 0.25%)'}
              </span>
              <span className="font-mono font-extrabold text-sky-400 text-sm">{targetCardCvr.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min={0.25}
              max={1.25}
              step={0.05}
              value={targetCardCvr}
              onChange={(e) => setTargetCardCvr(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Hiện tại: 0,25% (442,36 Tr đ)</span>
              <span>Mục tiêu: 1,00% (~1,77 Tỉ đ)</span>
              <span>Tối đa: 1,25%</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                {lang === 'vi'
                  ? '2. Gắn giỏ hàng cho 308 Video còn trống & Đăng giờ vàng (GPM 135,2k đ)'
                  : '2. Monetize 308 Unlinked Videos & Post at Peak Hours (135.2k GPM)'}
              </span>
              <span className="font-mono font-extrabold text-pink-400 text-sm">
                +{monetizedVideosCount} / 308 videos
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={308}
              step={4}
              value={monetizedVideosCount}
              onChange={(e) => setMonetizedVideosCount(parseInt(e.target.value, 10))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Hiện tại: 551/859 gắn giỏ</span>
              <span>Giờ vàng: 12h–13h & 15h–16h</span>
              <span>Tối đa: +308 videos (100%)</span>
            </div>
          </div>

          {/* Slider 3 */}
          <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                {lang === 'vi'
                  ? '3. Tối ưu Tỷ lệ Chiết khấu Khuyến mãi (Thay Giảm cố định bằng Flash Sale)'
                  : '3. Optimize Promo Markdown Rate (Replace Fixed Discounts with Flash Sales)'}
              </span>
              <span className="font-mono font-extrabold text-amber-400 text-sm">
                {targetPromoDiscountPct.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={25.0}
              max={50.4}
              step={0.5}
              value={targetPromoDiscountPct}
              onChange={(e) => setTargetPromoDiscountPct(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Tối ưu: 25,0%</span>
              <span>Chuẩn ngành: 32% – 35%</span>
              <span>Hiện tại: 50,45% (Chi 62,2 Tr đ)</span>
            </div>
          </div>

          {/* Slider 4 */}
          <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                {lang === 'vi'
                  ? '4. Kích hoạt Mạng lưới KOC Có Đơn (5.713 Creators — Nhóm <5k Follow)'
                  : '4. Activate Converting KOC Rate (5,713 Creators — <5k Follower Tier)'}
              </span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm">
                {targetActiveKocPct.toFixed(1)}% ({Math.round((TOTAL_CREATORS_COUNT * targetActiveKocPct) / 100)} KOCs)
              </span>
            </div>
            <input
              type="range"
              min={5.1}
              max={15.0}
              step={0.3}
              value={targetActiveKocPct}
              onChange={(e) => setTargetActiveKocPct(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Hiện tại: 5,1% (292 KOCs)</span>
              <span>Hoa hồng LIVE: 12%–14%</span>
              <span>Mục tiêu: 15,0% (857 KOCs)</span>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: FINANCIAL IMPACT DASHBOARD */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-1.5">
            <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
              {lang === 'vi' ? 'Tổng Giá Trị Tài Chính Tạo Thêm (GMV + Lợi Nhuận Giữ Lại)' : 'Total Incremental Value Created (GMV + Saved Margin)'}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              +{formatVnd(sim.totalMonthlyValueCreated)}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'vi'
                ? 'Tính toán trực tiếp trên tệp 1,17 triệu người xem Kệ hàng, 308 video sẵn có và mạng lưới Nano/Micro KOC (<5k followers đang đóng góp >95% doanh thu Affiliate).'
                : 'Computed directly across the 1.17M Product Card viewers, 308 existing videos, and the Nano/Micro KOC network (<5k followers driving >95% of Affiliate GMV).'}
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-800 pt-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <div className="font-bold text-white">1. Doanh thu Kệ hàng Mở khóa (0đ Ads)</div>
                <div className="text-[11px] text-slate-400">Tổng Kệ hàng đạt {formatVnd(sim.newCardGmv)}</div>
              </div>
              <span className="font-mono font-bold text-sky-400 text-sm">+{formatVnd(sim.cardGmvUplift)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <div className="font-bold text-white">2. Doanh thu Thương mại hóa Video</div>
                <div className="text-[11px] text-slate-400">Từ +{monetizedVideosCount} video (GPM 135,2k đ)</div>
              </div>
              <span className="font-mono font-bold text-pink-400 text-sm">+{formatVnd(sim.videoGmvUplift)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <div className="font-bold text-white">3. Biên lợi nhuận Khuyến mãi Thu hồi</div>
                <div className="text-[11px] text-slate-400">Giữ AOV 150.991 đ • Giảm chiết khấu về {targetPromoDiscountPct.toFixed(1)}%</div>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">+{formatVnd(sim.savedDiscountMargin)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div>
                <div className="font-bold text-white">4. Doanh thu Kích hoạt Nano/Micro KOC</div>
                <div className="text-[11px] text-slate-400">Thêm +{sim.newlyActivatedKocs} KOC có đơn (Giảm phụ thuộc @girlstyle.vn)</div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">+{formatVnd(sim.affiliateGmvUplift)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
