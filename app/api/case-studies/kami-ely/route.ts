// FILE: app/api/case-studies/kami-ely/route.ts
// API PHỤC VỤ DỮ LIỆU ĐỐI SOÁT 10 TỆP GỐC & TELEMETRY ĐỒNG BỘ 231 NGÀY (FAST MOSS)

import { NextResponse } from 'next/server';
import { kamiReconciliationData } from '@/app/data/kami-ely/reconciliation';
import { verifyKamiDataDirectoryIntegrity } from '@/app/lib/seedKamiData';
import { getKamiElyDataWithFallback } from '@/app/lib/serverData';
import metricsV2Json from '@/app/data/kami-ely/generated/metrics_v2.json';

export async function GET() {
  try {
    const fileIntegrity = verifyKamiDataDirectoryIntegrity();
    const fallbackData = await getKamiElyDataWithFallback();

    return NextResponse.json({
      success: true,
      project: 'Kami Ely TikTok Shop E-Commerce Analytics (@shop_official)',
      collectionDate: '2026-10-25',
      masterTimeline231d: {
        start: '2026-03-09',
        end: '2026-10-25',
        days: 231,
        totalFiles: 10,
        totalRawRows: 23364
      },
      // 1. Chỉ số chủ chốt xác thực từ 10 tệp Excel gốc (231 ngày)
      summaryKPIs: {
        timeline231d: {
          totalGmvVnd: metricsV2Json.ch0.kpis.gmvB * 1e9,
          totalUnits: metricsV2Json.ch0.kpis.unitsSold,
          aspVnd: metricsV2Json.ch0.kpis.aspVnd,
          junToAugDropPct: metricsV2Json.ch0.kpis.junToAugDropPct,
          peakDayGmvVnd: metricsV2Json.ch0.kpis.peakDayGmvM * 1e6,
          peak7dGmvB: metricsV2Json.ch0.kpis.peak7dGmvB,
          peak7dSharePct: metricsV2Json.ch0.kpis.peak7dSharePct
        },
        channelMix: {
          liveShareOfStorePct: metricsV2Json.ch2.channelMix.liveShareOfStorePct,
          officialShareOfLivePct: metricsV2Json.ch2.channelMix.officialShareOfLivePct,
          satelliteShareOfLivePct: metricsV2Json.ch2.channelMix.satelliteShareOfLivePct,
          otherAffShareOfLivePct: metricsV2Json.ch2.channelMix.otherAffShareOfLivePct
        },
        skuPareto: {
          totalSkus: metricsV2Json.ch2.skuPareto.totalSkus,
          activeSkus: metricsV2Json.ch2.skuPareto.activeSkus,
          skusFor80Pct: metricsV2Json.ch2.skuPareto.skusFor80Pct,
          top1Code: metricsV2Json.ch2.skuPareto.top1Code,
          top1SharePct: metricsV2Json.ch2.skuPareto.top1SharePct
        },
        creatorNetwork: {
          totalExternalKocs: metricsV2Json.ch4.survival.totalKocs,
          totalSessions: metricsV2Json.ch4.survival.totalSessions,
          everOrderPct: metricsV2Json.ch4.survival.everOrderPct,
          satelliteSessions: metricsV2Json.ch4.satelliteSummary.sessions,
          satelliteGmvB: metricsV2Json.ch4.satelliteSummary.gmvB,
          satelliteShareOfExtLivePct: metricsV2Json.ch4.satelliteSummary.shareOfExtLivePct
        }
      },
      // 2. Toàn bộ cấu trúc phân tích Outline v2 (Chương 0-6 & Phụ lục A-C)
      v2: metricsV2Json,
      // 3. Dữ liệu kiểm toán đối soát liên bảng
      reconciliation: kamiReconciliationData,
      // 4. Trạng thái 10 tệp dữ liệu gốc
      storageIntegrity: fileIntegrity,
      // 5. Data payload tương thích ngược
      data: fallbackData
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
