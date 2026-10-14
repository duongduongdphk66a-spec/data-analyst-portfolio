// ============================================================================
// FILE: app/api/case-studies/kami-ely/route.ts
// API PHỤC VỤ DỮ LIỆU ĐỐI SOÁT 8 BẢNG GỐC & TELEMETRY ĐỒNG BỘ 180 NGÀY
// ============================================================================

import { NextResponse } from 'next/server';
import { kamiReconciliationData } from '@/app/data/kami-ely/reconciliation';
import { verifyKamiDataDirectoryIntegrity } from '@/app/lib/seedKamiData';
import { getKamiElyDataWithFallback } from '@/app/lib/serverData';

export async function GET() {
  try {
    const fileIntegrity = verifyKamiDataDirectoryIntegrity();
    const fallbackData = await getKamiElyDataWithFallback();

    return NextResponse.json({
      success: true,
      project: 'Kami Ely TikTok Shop E-Commerce Analytics (@kamielyhn)',
      collectionDate: '2026-09-05',
      masterTimeline180d: {
        start: '2026-03-09',
        end: '2026-09-04',
        days: 180
      },
      // 1. Đối chiếu 3 tầng thời gian: All-Time vs. 180 Ngày vs. 90 Ngày
      summaryKPIs: {
        allTime: {
          shopGmvVnd: 31600000000,
          shopUnits: 238400,
          selfGmvVnd: 9200000000,
          selfUnits: 69900,
          selfLiveGmvVnd: 5900000000,
          selfVideoGmvVnd: 3200000000
        },
        window180d: {
          shopNetGmvVnd: 12735128067,
          shopUnits: 85500,
          shopLiveGmvVnd: 9262277940,
          shopLiveSessions: 7046,
          selfNetGmvVnd: 5800000000,
          selfNetUnits: 39300,
          selfGrossCsvGmvVnd: 7893730964,
          selfGrossCsvUnits: 54961,
          selfLiveNetGmvVnd: 4900000000,
          selfLiveGrossCsvGmvVnd: 7023530158,
          selfLiveSessionsCsv: 475,
          selfLiveSessionsUi: 470,
          selfVideoGmvCsvVnd: 870200806,
          selfVideoGmvUiVnd: 872200000,
          selfVideosCount: 222
        },
        window90d: {
          shopTotalGmvVnd: 6136205973,
          shopTotalUnits: 40229,
          totalSkus: 331,
          channels: {
            selfOperated: { gmvVnd: 3026026869, sharePct: 49.31, units: 20027, unitsSharePct: 49.78 },
            externalAffiliates: { gmvVnd: 1708159874, sharePct: 27.84, units: 11572, unitsSharePct: 28.77, kocsCount: 5712 },
            productCard: { gmvVnd: 1402019230, sharePct: 22.85, units: 8630, unitsSharePct: 21.45 }
          },
          shoppableVideos90dMeasured: {
            totalVideos: 4417,
            totalGmvVnd: 2170840326,
            totalUnits: 13083,
            paidAdsGmvVnd: 2055758301,
            paidAdsSharePct: 94.70,
            organicGmvVnd: 115082025,
            organicSharePct: 5.30
          }
        }
      },
      // 2. Dữ liệu kiểm toán liên bảng & Telemetry Seller Center đồng bộ 180 ngày
      reconciliation: kamiReconciliationData,
      // 3. Trạng thái 8 bảng dữ liệu gốc
      storageIntegrity: fileIntegrity,
      // 4. Giữ nguyên data payload để tương thích hoàn toàn với useCaseStudyData<KamiElyDataPayload>
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
