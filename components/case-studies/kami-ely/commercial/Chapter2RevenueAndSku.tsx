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
  LabelList,
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

  // Ghép đường Lorenz theo giá trị creatorPct gần nhất thay vì ghép chỉ số mảng
  const lorenzData = lzAll.curve.map((pt) => {
    let closestExt = lzExt.curve[0];
    let minDiff = Math.abs(closestExt.creatorPct - pt.creatorPct);
    for (let i = 1; i < lzExt.curve.length; i++) {
      const diff = Math.abs(lzExt.curve[i].creatorPct - pt.creatorPct);
      if (diff < minDiff) {
        minDiff = diff;
        closestExt = lzExt.curve[i];
      }
    }
    return {
      creatorPct: pt.creatorPct,
      equalityPct: pt.equalityPct,
      allGmvPct: pt.gmvPct,
      extGmvPct: closestExt ? closestExt.gmvPct : pt.gmvPct,
    };
  });

  const priceBandBars = sp.priceBandsLower.map((b) => ({
    ...b,
    gmvShareFormatted: `${n(b.gmvSharePct, 1)}%`,
    realizedAspSharePct: sp.priceBandsRealizedAsp.find((r) => r.band === b.band)?.gmvSharePct ?? b.gmvSharePct,
    fill:
      b.band === '75k-150k'
        ? KAMI_BRAND_PALETTE.tealInk
        : b.band === '150k-250k'
          ? KAMI_BRAND_PALETTE.cyan
          : b.band === '<75k'
            ? KAMI_BRAND_PALETTE.butter
            : KAMI_BRAND_PALETTE.ice,
  }));

  return (
    <ChapterShell
      id="sec-ch2-sku"
      chapterNum={L('Chương 2', 'Chapter 2')}
      title={L('Doanh thu đến từ đâu: kênh, creator và danh mục SKU', 'Where revenue comes from: channels, creators, and SKU catalog')}
      scopeLabel={L('AffLive 231N · ShopProd & KOL 90N', 'AffLive 231d · ShopProd & KOL 90d')}
      question={L('Kênh nào, creator nào và sản phẩm nào tạo ra GMV?', 'Which channels, creators, and products generate GMV?')}
      conclusion={L(
        'Live tạo 69,8% GMV shop và phiên của chính shop chiếm 72,5% GMV Live; doanh thu sản phẩm dồn vào 12/133 mã, trong đó AT06 chịu ảnh hưởng của cửa sổ 90 ngày vắt qua chuyển mùa.',
        'Live drives 69.8% of store GMV and official shop sessions account for 72.5% of Live GMV; catalog revenue concentrates in 12/133 SKUs, with AT06 influenced by the 90-day window spanning season shifts.'
      )}
      soWhat={L(
        `Rủi ro tập trung lớn nhất nằm ở mức độ phụ thuộc vào lịch phát sóng của kênh chính chủ @shop_official và ${sp.skusFor80Pct} sản phẩm đầu bảng hơn là số lượng creator trong danh bạ.`,
        `Concentration risk centers on dependence on @shop_official Live scheduling and the top ${sp.skusFor80Pct} hero SKUs rather than raw creator headcount.`
      )}
    >
      {/* 1 thẻ Lưu ý khi đọc (thay thế 3 thẻ trước đây) */}
      <div className="rounded-xl border border-[#9BE7FA]/80 bg-[#C8EEF7]/30 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1">
        <div className="text-xs font-extrabold text-[#074553] dark:text-[#9BE7FA]">
          {L('Lưu ý khi đọc số liệu danh mục và mạng lưới', 'Notes on catalog and creator figures')}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed tabular-nums">
          {L(
            'Trong 206 mã không có đơn, 204 mã là mã niêm yết cũ trước 2026 (dữ liệu không có tồn kho nên đây là phân loại danh mục, không phải hàng tồn); 43/45 mã ra mắt năm 2026 đều có đơn. Tài khoản @koc_sat01 là kênh vệ tinh nội bộ của shop, không phải đối tác độc lập.',
            'Among 206 zero-sale SKUs, 204 are legacy listings prior to 2026 (the dataset lacks inventory levels, so this reflects catalog history rather than physical stock); 43 of 45 products launched in 2026 converted. Account @koc_sat01 is an in-house satellite channel, not an independent partner.'
          )}
        </p>
      </div>

      {/* 2.1 [CHÍNH] Cơ cấu GMV Live và GMV toàn shop */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '2.1. Live chiếm 69,8% GMV shop; chính shop và vệ tinh tạo 84,5% kênh Live',
          '2.1. Live accounts for 69.8% of store GMV; official and satellite drive 84.5%'
        )}
        footer={L(
          `Nguồn: Affiliate_Livestreams [KOC ID, Doanh Thu Cho Shop (VNĐ)] sau khử trùng và Store_Daily_Overview · 09/03 - 25/10/2026 · n = ${n(cm.liveSessions)} phiên Live / ${V2.meta.days} ngày. Kênh vệ tinh @koc_sat01 đóng góp ${n(cm.satelliteGmvB, 2)} tỷ đ (${n(cm.satelliteShareOfLivePct, 1)}% Live).`,
          `Source: Deduplicated Affiliate_Livestreams [KOC ID, Shop Revenue] and Store_Daily_Overview · 09/03 - 25/10/2026 · n = ${n(cm.liveSessions)} Live sessions / ${V2.meta.days} days. Satellite @koc_sat01 contributed ${n(cm.satelliteGmvB, 2)}B VND (${n(cm.satelliteShareOfLivePct, 1)}% of Live).`
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

      {/* 2.2 [CHÍNH] Pareto SKU và dải giá */}
      <ChartCard
        height=""
        badge={<ChartRoleBadge kind="main" />}
        title={L(
          '2.2. Chỉ 12/133 SKU tạo 80,6% GMV; dải giá 75–150k chiếm 62,6% doanh thu',
          '2.2. Just 12/133 SKUs drive 80.6% of GMV; 75–150k VND tier holds 62.6%'
        )}
        footer={L(
          `Nguồn: Shop_Products [Doanh Thu Gần Nhất, Giá Niêm Yết, Ngày Lên Sàn] · Cửa sổ 90 ngày (${n(sp.catalogGmvB, 2)} tỷ đ) · n = ${sp.totalSkus} SKU (${sp.activeSkus} có đơn, ${sp.zeroSaleSkus} mã niêm yết cũ). Theo giá niêm yết, dải 75–150k chiếm ${n(sp.priceBandsLower[1].gmvSharePct, 1)}% GMV (theo ASP thực bán là ${n(sp.priceBandsRealizedAsp[1].gmvSharePct, 1)}%).`,
          `Source: Shop_Products [Recent GMV, Listed Price, Launch Date] · 90-day window (${n(sp.catalogGmvB, 2)}B VND) · n = ${sp.totalSkus} SKUs (${sp.activeSkus} active, ${sp.zeroSaleSkus} legacy listings). By listed price, 75–150k holds ${n(sp.priceBandsLower[1].gmvSharePct, 1)}% (by realized ASP: ${n(sp.priceBandsRealizedAsp[1].gmvSharePct, 1)}%).`
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
                <AreaChart data={sp.curve} margin={{ top: 16, right: 16, left: 0, bottom: 6 }}>
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
                          const isGenericCode = !row.skuCode || row.skuCode.startsWith('SKU_') || row.skuCode === 'KOC';
                          return isGenericCode
                            ? L(`Hạng #${row.rank} · Đơn lẻ ${n(row.gmvM, 1)} Tr đ`, `Rank #${row.rank} · ${n(row.gmvM, 1)}M VND`)
                            : L(
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
                      position: 'insideTopRight',
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

          {/* Panel phải: Tỷ trọng GMV theo dải giá */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {L(
                `Panel phải: Tỷ trọng GMV theo dải giá niêm yết (100% = ${n(sp.catalogGmvB, 2)} tỷ đ)`,
                `Right panel: Catalog GMV share by listed price band (100% = ${n(sp.catalogGmvB, 2)}B VND)`
              )}
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceBandBars} margin={{ top: 20, right: 16, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="band" tick={axisTick} />
                  <YAxis
                    domain={[0, 80]}
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
                          if (!r) return null;
                          return (
                            <div className="space-y-0.5 pt-0.5">
                              <div>{L(`Doanh thu: ${n(r.gmvM, 1)} Tr đ`, `GMV: ${n(r.gmvM, 1)}M VND`)}</div>
                              <div className="text-slate-500 dark:text-slate-400">
                                {L(`Theo ASP thực bán: ${n(r.realizedAspSharePct, 1)}%`, `By realized ASP: ${n(r.realizedAspSharePct, 1)}%`)}
                              </div>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Bar dataKey="gmvSharePct" name={L('Tỷ trọng GMV', 'GMV share')} radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    <LabelList
                      dataKey="gmvShareFormatted"
                      position="top"
                      style={{ fontSize: '11px', fontWeight: 700, fill: '#074553' }}
                    />
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
          '2.3. Top 1 tài khoản tạo 60,1% GMV danh bạ; tách kênh chủ shop còn 43,7%',
          '2.3. Top 1 account drives 60.1% of directory GMV; drops to 43.7% excluding official'
        )}
        countLabel={L(`1 biểu đồ · n = ${lzAll.count} tài khoản`, `1 chart · n = ${lzAll.count} accounts`)}
      >
        <ChartCard
          height="h-64"
          badge={<ChartRoleBadge kind="more" />}
          title={L(
            '2.3. Top 10 tài khoản tạo 83,7% doanh số KOL (HHI = 3.842); kênh vệ tinh @koc_sat01 chiếm 43,7% mạng ngoài',
            '2.3. Top 10 accounts drive 83.7% of KOL sales (HHI = 3,842); satellite @koc_sat01 holds 43.7% among affiliates'
          )}
          footer={L(
            `Nguồn: Affiliate_KOL [Doanh Số Đóng Góp (VNĐ) > 0] · Cửa sổ trượt 90 ngày · n = ${lzAll.count} tài khoản có đơn (gồm @shop_official) và n = ${lzExt.count} đối tác ngoài (HHI ngoài = ${n(lzExt.hhi)}, Gini = ${n(lzExt.gini, 3)}).`,
            `Source: Affiliate_KOL [Contributed Sales > 0] · 90-day rolling window · n = ${lzAll.count} converting accounts (incl. @shop_official) and n = ${lzExt.count} external partners (external HHI = ${n(lzExt.hhi)}, Gini = ${n(lzExt.gini, 3)}).`
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
