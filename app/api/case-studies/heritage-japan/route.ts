import { NextResponse } from 'next/server';
import { getHeritageJapanDataWithFallback } from '@/app/lib/serverData';
import { getApiCacheAsync, setApiCacheAsync } from '@/app/lib/cache';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
};

export async function GET() {
  try {
    const cached = await getApiCacheAsync<Record<string, unknown>>('case-study:heritage-japan');
    if (cached) {
      return NextResponse.json({ success: true, source: 'cache', data: cached }, { headers: CACHE_HEADERS });
    }

    const data = await getHeritageJapanDataWithFallback();
    await setApiCacheAsync('case-study:heritage-japan', data);

    return NextResponse.json({ success: true, source: 'mysql', data }, { headers: CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[API /api/case-studies/heritage-japan GET] Error:', message);
    const data = await getHeritageJapanDataWithFallback();
    return NextResponse.json({ success: true, source: 'fallback', data }, { headers: CACHE_HEADERS });
  }
}
