import { NextResponse } from 'next/server';
import { getKamiElyDataWithFallback } from '@/app/lib/serverData';
import { getApiCacheAsync, setApiCacheAsync } from '@/app/lib/cache';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
};

export async function GET() {
  try {
    const data = await getKamiElyDataWithFallback();
    return NextResponse.json({ 
      success: true, 
      source: data.isLiveDb ? 'mysql' : 'fallback', 
      data 
    }, { headers: CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[API /api/case-studies/kami-ely GET] Error:', message);
    const data = await getKamiElyDataWithFallback();
    return NextResponse.json({ success: true, source: 'fallback', data }, { headers: CACHE_HEADERS });
  }
}
