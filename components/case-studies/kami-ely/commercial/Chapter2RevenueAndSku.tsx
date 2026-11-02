'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ChapterShell,
  ChartCard,
  ChartRoleBadge,
  ChartTooltip,
  ExpandableMoreSection,
  axisTick,
  legendFormatter,
  GRID_STROKE,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export default function Chapter2RevenueAndSku() {
  const { L, n } = usePlaybookLang();
  const cm = V2.ch2.channelMix;
  const sp = V2.ch2.skuPareto;
  const lzAll = V2.ch2.lorenz.allActive;
  const lzExt = V2.ch2.lorenz.externalOnly;

  // Merge Lorenz curves on nearest creatorPct grid for dual-line comparison
  const lorenzData = lzAll.curve.map((pt, idx) => {
    const extPt = lzExt.curve[Math.min(idx, lzExt.curve.length - 1)];
    return {
      creatorPct: pt.creatorPct,
      equalityPct: pt.equalityPct,
      allGmvPct: pt.gmvPct,
      extGmvPct: extPt ? extPt.gmvPct : pt.gmvPct,
    };
  });

  const priceBandBars = sp.priceBandsLower.map((b) => ({
    ...b,
    fill:
      b.band === '75k-150k'
        ? KAMI_BRAND_PALETTE.tealInk
        : b.band === '150k-250k'
          ? KAMI_BRAND_PALETTE.cyan
          : b.band === '<75k'
            ? KAMI_BRAND_PALETTE.butter
            : KAMI_BRAND_PALETTE.ice,
  }));

  const sat = V2.ch4.satelliteSummary;

  return (
    <ChapterShell
      id="sec-ch2-sku"
      chapterNum={L('Chương 2', 'Chapter 2')}
      title={L('Doanh thu đến từ đâu: kênh, creator và danh mục SKU', 'Where revenue comes from: channels, creators, and SKU catalog')}
      scopeLabel={L('AffLive 231N · ShopProd & KOL 90N', 'AffLive 231d · ShopProd & KOL 90d')}
      question={L('Kênh nào, creator nào và sản phẩm nào tạo ra GMV?', 'Which channels, creators, and products generate GMV?')}
      conclusion={L(
        'Doanh thu tập trung cao độ vào Livestream tự vận hành và nhóm nhỏ sản phẩm chủ lực; kênh bán hàng chính chủ là trụ cột doanh thu trong khi mạng lưới creator đối tác đóng vai trò bổ trợ phân phối.',
        'Revenue concentrates heavily in self-operated Livestreams and a narrow set of hero SKUs; the official channel acts as the primary revenue pillar while external creators serve a supplementary distribution role.'
      )}
      soWhat={L(
        `Rủi ro tập trung lớn nhất nằm ở mức độ phụ thuộc vào lịch phát sóng của kênh chính chủ @shop_official và ${sp.skusFor80Pct} sản phẩm đầu bảng hơn là số lượng creator trong danh bạ.`,
        `Concentration risk centers on dependence on @shop_official Live scheduling and the top ${sp.skusFor80Pct} SKUs rather than raw creator headcount.`
      )}
    >
      {/* Ba lát cắt phân tích: Theo kênh · Theo creator · Theo sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs tabular-nums">
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Theo kênh (231N đối chiếu 180N)', 'By channel (231d vs 180d check)')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Sau khử trùng, Live đạt ${n(cm.liveTotalB, 2)} tỷ đ (${n(cm.liveShareOfStorePct, 1)}% GMV toàn shop), còn ${n(cm.nonLiveShareOfStorePct, 1)}% đến từ video và kệ hàng. Trong kênh Live, @shop_official chiếm ${n(cm.officialShareOfLivePct, 1)}%, vệ tinh nội bộ @koc_sat01 chiếm ${n(cm.satelliteShareOfLivePct, 1)}% và toàn bộ creator ngoài còn lại chiếm ${n(cm.otherAffShareOfLivePct, 1)}% (kết quả nhất quán khi đối soát trên cửa sổ 180 ngày).`,
              `Post-dedup Live generated ${n(cm.liveTotalB, 2)}B VND (${n(cm.liveShareOfStorePct, 1)}% of store GMV), with ${n(cm.nonLiveShareOfStorePct, 1)}% from video and showcase cards. Within Live, @shop_official holds ${n(cm.officialShareOfLivePct, 1)}%, in-house satellite @koc_sat01 holds ${n(cm.satelliteShareOfLivePct, 1)}%, and all external creators hold ${n(cm.otherAffShareOfLivePct, 1)}% (consistent on the 180d window).`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Theo creator (KOL 90 ngày)', 'By creator (90d KOL directory)')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Tài khoản dẫn đầu chiếm ${n(lzAll.top1SharePct, 1)}% doanh số đóng góp và Top 10 chiếm ${n(lzAll.top10SharePct, 1)}%. Tài khoản @koc_sat01 vận hành như kênh vệ tinh nội bộ với ${sat.sessions} phiên và ${n(sat.gmvB, 2)} tỷ đ (${n(sat.shareOfExtLivePct, 1)}% GMV Live ngoài shop), cần tách riêng khỏi đối tác độc lập.`,
              `The top account drives ${n(lzAll.top1SharePct, 1)}% of contributed sales and Top 10 drive ${n(lzAll.top10SharePct, 1)}%. @koc_sat01 operates as an in-house satellite (${sat.sessions} sessions, ${n(sat.gmvB, 2)}B VND = ${n(sat.shareOfExtLivePct, 1)}% of external Live GMV) and is separated from independent partners.`
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#C8EEF7] bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
          <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
            {L('Theo sản phẩm (ShopProd & CrProd)', 'By product (ShopProd & CrProd)')}
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {L(
              `Danh mục 339 sản phẩm có độ phân hóa mạnh: 206 mã không phát sinh đơn thì 204 mã là hàng tồn cũ tạo từ giai đoạn 2022-2025; ngược lại, 43/45 mã ra mắt năm 2026 đều có đơn. Doanh số dồn vào phân khúc bình dân 75-150k đ và duy trì mức tập trung cao cả ở kỳ cao điểm Hè lẫn Thu Đông.`,
              `The 339-SKU catalog shows sharp historical divergence: 204 of 206 zero-sale items were legacy listings created in 2022-2025; conversely, 43 of 45 items launched in 2026 converted. Revenue centers in the mass 75-150k tier across both Summer and Autumn-Winter periods.`
            )}
          </p>
        </div>
      </div>
      {/* 2.1 [CHÍNH] Cơ cấu GMV Live và GMV toàn shop (thanh xếp chồng 100%, hai thanh) */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `2.1. Cơ cấu GMV Live: @shop_official (${n(cm.officialShareOfLivePct, 1)}%) và vệ tinh @koc_sat01 (${n(cm.satelliteShareOfLivePct, 1)}%) áp đảo toàn bộ 301 creator đối tác ngoài (${n(cm.otherAffShareOfLivePct, 1)}%)`,
          `2.1. Live GMV structure: @shop_official (${n(cm.officialShareOfLivePct, 1)}%) and satellite @koc_sat01 (${n(cm.satelliteShareOfLivePct, 1)}%) dominate all 301 external affiliate partners (${n(cm.otherAffShareOfLivePct, 1)}%)`
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams [KOC ID, Doanh Thu Cho Shop (VNĐ)] sau khử trùng và Store_Daily_Overview · 09/03 - 25/10/2026 · n = ${n(cm.liveSessions)} phiên Live / ${V2.meta.days} ngày.`,
          `Source: Deduplicated Affiliate_Livestreams [KOC ID, Shop Revenue] and Store_Daily_Overview · 09/03 - 25/10/2026 · n = ${n(cm.liveSessions)} Live sessions / ${V2.meta.days} days.`
        )}
      >
        <div className="space-y-4 pt-1">
          {/* Thanh 1: Cơ cấu trong GMV Live */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {L(`Thanh 1: Cơ cấu nội bộ kênh Live (100% = ${n(cm.liveTotalB, 2)} tỷ đ)`, `Bar 1: Breakdown within Live channel (100% = ${n(cm.liveTotalB, 2)}B VND)`)}
              </span>
              <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                {L('Chính chủ + 1 kênh vệ tinh + 301 KOC độc lập', 'Official + 1 satellite + 301 independent KOCs')}
              </span>
            </div>
            <div className="flex h-10 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold tabular-nums">
              <div
                style={{ width: `${cm.officialShareOfLivePct}%`, backgroundColor: KAMI_BRAND_PALETTE.tealInk }}
                className="flex items-center justify-center px-2 text-white truncate"
                title={`@shop_official: ${cm.officialShareOfLivePct}% (${cm.officialGmvB}B)`}
              >
                {L(`@shop_official ${n(cm.officialShareOfLivePct, 1)}% (${n(cm.officialGmvB, 2)} tỷ)`, `@shop_official ${n(cm.officialShareOfLivePct, 1)}%`)}
              </div>
              <div
                style={{ width: `${cm.satelliteShareOfLivePct}%`, backgroundColor: KAMI_BRAND_PALETTE.amber }}
                className="flex items-center justify-center px-1.5 text-slate-950 truncate"
                title={`@koc_sat01: ${cm.satelliteShareOfLivePct}% (${cm.satelliteGmvB}B)`}
              >
                {`${n(cm.satelliteShareOfLivePct, 1)}%`}
              </div>
              <div
                style={{ width: `${cm.otherAffShareOfLivePct}%`, backgroundColor: KAMI_BRAND_PALETTE.ice }}
                className="flex items-center justify-center px-1.5 text-slate-900 truncate"
                title={`301 KOC: ${cm.otherAffShareOfLivePct}% (${cm.otherAffGmvB}B)`}
              >
                {`${n(cm.otherAffShareOfLivePct, 1)}%`}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-700 dark:text-slate-300 tabular-nums pt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287]" />
                {L(`Chính chủ @shop_official: ${n(cm.officialShareOfLivePct, 1)}% (${n(cm.officialGmvB, 2)} tỷ)`, `Official @shop_official: ${n(cm.officialShareOfLivePct, 1)}% (${n(cm.officialGmvB, 2)}B)`)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" />
                {L(`Vệ tinh @koc_sat01: ${n(cm.satelliteShareOfLivePct, 1)}% (${n(cm.satelliteGmvB, 2)} tỷ)`, `Satellite @koc_sat01: ${n(cm.satelliteShareOfLivePct, 1)}% (${n(cm.satelliteGmvB, 2)}B)`)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C8EEF7] border border-slate-300" />
                {L(`301 Affiliate khác: ${n(cm.otherAffShareOfLivePct, 1)}% (${n(cm.otherAffGmvB, 2)} tỷ)`, `301 Other Affiliates: ${n(cm.otherAffShareOfLivePct, 1)}% (${n(cm.otherAffGmvB, 2)}B)`)}
              </span>
            </div>
          </div>

          {/* Thanh 2: Live so với phần còn lại của GMV toàn shop */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {L(`Thanh 2: Tỷ trọng Live trên tổng GMV toàn shop (100% = ${n(cm.storeTotalB, 2)} tỷ đ)`, `Bar 2: Live share of total store GMV (100% = ${n(cm.storeTotalB, 2)}B VND)`)}
              </span>
              <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                {L('Phần còn lại gồm Video gắn giỏ và đơn tự nhiên trên kệ', 'Remainder covers shoppable videos and organic product cards')}
              </span>
            </div>
            <div className="flex h-10 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold tabular-nums">
              <div
                style={{ width: `${cm.liveShareOfStorePct}%`, backgroundColor: KAMI_BRAND_PALETTE.cyan }}
                className="flex items-center justify-center px-2 text-slate-950 truncate"
              >
                {L(`Livestream toàn shop: ${n(cm.liveShareOfStorePct, 1)}% (${n(cm.liveTotalB, 2)} tỷ)`, `All Live: ${n(cm.liveShareOfStorePct, 1)}% (${n(cm.liveTotalB, 2)}B)`)}
              </div>
              <div
                style={{ width: `${cm.nonLiveShareOfStorePct}%`, backgroundColor: KAMI_BRAND_PALETTE.butter }}
                className="flex items-center justify-center px-2 text-amber-950 truncate"
              >
                {L(`Video & Kệ hàng: ${n(cm.nonLiveShareOfStorePct, 1)}% (${n(cm.nonLiveGmvB, 2)} tỷ)`, `Video & Cards: ${n(cm.nonLiveShareOfStorePct, 1)}% (${n(cm.nonLiveGmvB, 2)}B)`)}
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* 2.2 [CHÍNH] Pareto SKU và dải giá (hai panel cạnh nhau) */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          `2.2. Chỉ ${sp.skusFor80Pct}/${sp.totalSkus} SKU tạo ${n(sp.skusFor80SharePct, 1)}% GMV (riêng ${sp.top1Code} chiếm ${n(sp.top1SharePct, 1)}%); dải giá 75-150k chiếm ${n(sp.priceBandsLower[1].gmvSharePct, 1)}%`,
          `2.2. Just ${sp.skusFor80Pct}/${sp.totalSkus} SKUs drive ${n(sp.skusFor80SharePct, 1)}% GMV (${sp.top1Code} alone at ${n(sp.top1SharePct, 1)}%); 75-150k VND holds ${n(sp.priceBandsLower[1].gmvSharePct, 1)}%`
        )}
        footer={L(
          `Nguồn: Shop_Products [Doanh Thu Gần Nhất (VNĐ), Giá Bán Niêm Yết (cận dưới), Ngày Giờ Lên Sàn] · Cửa sổ 90 ngày (${n(sp.catalogGmvB, 2)} tỷ đ) · n = ${sp.totalSkus} SKU (${sp.activeSkus} có đơn, ${sp.zeroSaleSkus} không đơn). Tính theo đơn giá thực bán ASP, dải 75-150k chiếm ${n(sp.priceBandsRealizedAsp[1].gmvSharePct, 1)}%. Có ${sp.zeroLaunchPre2026}/${sp.zeroSaleSkus} SKU 0 đơn (${n(sp.zeroLaunchPre2026Pct, 1)}%) là mã cũ đăng từ 2022-2025; ${sp.launches2026Active}/${sp.launches2026Total} mã mở năm 2026 đều phát sinh đơn.`,
          `Source: Shop_Products [Recent GMV, Listed Price lower bound, Launch Date] · 90-day window (${n(sp.catalogGmvB, 2)}B VND) · n = ${sp.totalSkus} SKUs (${sp.activeSkus} active, ${sp.zeroSaleSkus} zero-sale). By realized ASP, 75-150k reaches ${n(sp.priceBandsRealizedAsp[1].gmvSharePct, 1)}%. ${sp.zeroLaunchPre2026}/${sp.zeroSaleSkus} zero-sale SKUs (${n(sp.zeroLaunchPre2026Pct, 1)}%) are 2022-2025 legacy listings, whereas ${sp.launches2026Active}/${sp.launches2026Total} 2026 launches converted.`
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Panel trái: Đường Pareto tích lũy trên 133 SKU phát sinh đơn */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {L(
                `Panel trái: Đường GMV tích lũy theo thứ hạng SKU phát sinh đơn (Top 5 = ${n(sp.top5SharePct, 1)}%)`,
                `Left panel: Cumulative GMV curve across ${sp.activeSkus} active SKUs (Top 5 = ${n(sp.top5SharePct, 1)}%)`
              )}
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sp.curve} margin={{ top: 14, right: 16, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="rank"
                    domain={[0, sp.activeSkus]}
                    ticks={[0, 12, 30, 60, 90, 133]}
                    tick={axisTick}
                  />
                  <YAxis
                    domain={[0, 100]}
                    width={46}
                    tick={axisTick}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl, pl) => {
                          const row = pl?.[0]?.payload;
                          if (!row || row.rank === 0) return L('Bắt đầu (0 SKU)', 'Origin (0 SKUs)');
                          return L(
                            `Hạng #${row.rank} (${row.skuCode}) · Đơn lẻ ${n(row.gmvM, 1)} Tr đ`,
                            `Rank #${row.rank} (${row.skuCode}) · ${n(row.gmvM, 1)}M VND`
                          );
                        }}
                        fmt={(v) => `${n(v, 1)}%`}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="cumPct"
                    name={L('GMV tích lũy', 'Cumulative GMV')}
                    stroke={KAMI_BRAND_PALETTE.tealInk}
                    strokeWidth={2.3}
                    fill={KAMI_BRAND_PALETTE.cyan}
                    fillOpacity={0.35}
                    isAnimationActive={false}
                  />
                  <ReferenceLine
                    x={sp.skusFor80Pct}
                    stroke={KAMI_BRAND_PALETTE.amberStroke}
                    strokeDasharray="4 3"
                    label={{
                      value: L(`${sp.skusFor80Pct} SKU = ${n(sp.skusFor80SharePct, 1)}%`, `${sp.skusFor80Pct} SKUs = ${n(sp.skusFor80SharePct, 1)}%`),
                      position: 'insideBottomRight',
                      fill: KAMI_BRAND_PALETTE.amberStroke,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                  <ReferenceLine y={80} stroke={KAMI_BRAND_PALETTE.amberStroke} strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel phải: Tỷ trọng GMV theo dải giá (bắt đầu từ 0) */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {L(
                `Panel phải: Tỷ trọng GMV theo dải giá niêm yết (100% = ${n(sp.catalogGmvB, 2)} tỷ đ)`,
                `Right panel: Catalog GMV share by listed price band (100% = ${n(sp.catalogGmvB, 2)}B VND)`
              )}
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceBandBars} margin={{ top: 14, right: 16, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="band" tick={axisTick} />
                  <YAxis
                    domain={[0, 75]}
                    width={46}
                    tick={axisTick}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        head={(lbl, pl) => {
                          const r = pl?.[0]?.payload;
                          return L(
                            `Dải giá ${lbl} (${r?.activeSkus ?? 0}/${r?.skus ?? 0} SKU có đơn)`,
                            `Band ${lbl} (${r?.activeSkus ?? 0}/${r?.skus ?? 0} active SKUs)`
                          );
                        }}
                        fmt={(v) => `${n(v, 1)}%`}
                        extraRow={(pl) => {
                          const r = pl?.[0]?.payload;
                          return r ? L(`Doanh thu: ${n(r.gmvM, 1)} Tr đ`, `GMV: ${n(r.gmvM, 1)}M VND`) : null;
                        }}
                      />
                    }
                  />
                  <Bar dataKey="gmvSharePct" name={L('Tỷ trọng GMV', 'GMV share')} radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {priceBandBars.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} stroke={KAMI_BRAND_PALETTE.tealInk} strokeWidth={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* 2.3 [XEM THÊM] Đường Lorenz creator */}
      <ExpandableMoreSection
        title={L(
          `2.3. Đường Lorenz mức độ tập trung creator: Top 1 chiếm ${n(lzAll.top1SharePct, 1)}% toàn danh bạ, riêng mạng ngoài Top 1 chiếm ${n(lzExt.top1SharePct, 1)}%`,
          `2.3. Creator Lorenz concentration curve: Top 1 holds ${n(lzAll.top1SharePct, 1)}% overall and ${n(lzExt.top1SharePct, 1)}% among external affiliates`
        )}
        countLabel={L(`1 biểu đồ · n = ${lzAll.count} tài khoản`, `1 chart · n = ${lzAll.count} accounts`)}
      >
        <ChartCard
          height="h-64"
          badge={<ChartRoleBadge kind="more" />}
          title={L(
            `2.3. Top 10 tài khoản tạo ${n(lzAll.top10SharePct, 1)}% doanh số KOL (HHI = ${n(lzAll.hhi)}); khi tách kênh chủ shop, @koc_sat01 vẫn chiếm ${n(lzExt.top1SharePct, 1)}% mạng ngoài`,
            `2.3. Top 10 accounts drive ${n(lzAll.top10SharePct, 1)}% of KOL sales (HHI = ${n(lzAll.hhi)}); excluding official channel, @koc_sat01 holds ${n(lzExt.top1SharePct, 1)}%`
          )}
          footer={L(
            `Nguồn: Affiliate_KOL [Doanh Số Đóng Góp (VNĐ) > 0] · Cửa sổ trượt 90 ngày · n = ${lzAll.count} tài khoản có đơn (gồm @shop_official) và n = ${lzExt.count} KOC ngoài (HHI ngoài = ${n(lzExt.hhi)}, Gini = ${n(lzExt.gini, 3)}).`,
            `Source: Affiliate_KOL [Contributed Sales > 0] · 90-day rolling window · n = ${lzAll.count} converting accounts (incl. @shop_official) and n = ${lzExt.count} external KOCs (external HHI = ${n(lzExt.hhi)}, Gini = ${n(lzExt.gini, 3)}).`
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lorenzData} margin={{ top: 12, right: 16, left: 4, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis
                type="number"
                dataKey="creatorPct"
                domain={[0, 100]}
                tick={axisTick}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                domain={[0, 100]}
                width={46}
                tick={axisTick}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    head={(lbl) => L(`${lbl}% nhóm creator dưới lên`, `Bottom ${lbl}% of creators`)}
                    fmt={(v) => `${n(v, 1)}% GMV`}
                  />
                }
              />
              <Legend formatter={legendFormatter} />
              <Line
                type="linear"
                dataKey="equalityPct"
                name={L('Phân phối đều tuyệt đối (45°)', 'Line of equality (45°)')}
                stroke={KAMI_BRAND_PALETTE.slateLine}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="allGmvPct"
                name={L(`Toàn danh bạ (${lzAll.count} TK, Top 1 = ${n(lzAll.top1SharePct, 1)}%)`, `All active (${lzAll.count}, Top 1 = ${n(lzAll.top1SharePct, 1)}%)`)}
                stroke={KAMI_BRAND_PALETTE.tealInk}
                strokeWidth={2.3}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="extGmvPct"
                name={L(`Chỉ KOC ngoài (${lzExt.count} KOC, @koc_sat01 = ${n(lzExt.top1SharePct, 1)}%)`, `External KOCs (${lzExt.count}, @koc_sat01 = ${n(lzExt.top1SharePct, 1)}%)`)}
                stroke={KAMI_BRAND_PALETTE.amberStroke}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ExpandableMoreSection>
    </ChapterShell>
  );
}
