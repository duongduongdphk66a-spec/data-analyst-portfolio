import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { getDbPool, initDatabase } from '@/app/lib/db';
import { translations } from '@/app/data/translations';
import { verifyAdminRequest } from '@/app/lib/auth';
import { getApiCache, setApiCache, invalidateApiCache } from '@/app/lib/cache';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const langParam = searchParams.get('lang'); // 'vi' | 'en' | null
    const cacheKey = `texts:${langParam || 'all'}`;

    const cached = getApiCache<Record<string, unknown>>(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, source: 'cache', data: cached }, { headers: CACHE_HEADERS });
    }

    const pool = getDbPool();
    if (!pool) {
      const data = langParam ? (translations as Record<string, Record<string, string>>)[langParam] || translations.vi : translations;
      return NextResponse.json({
        success: true,
        source: 'default',
        data,
      }, { headers: CACHE_HEADERS });
    }

    // Query all texts from database
    let query = 'SELECT text_key, lang, value_text, section FROM portfolio_texts';
    const params: string[] = [];
    if (langParam) {
      query += ' WHERE lang = ?';
      params.push(langParam);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    if (!rows || rows.length === 0) {
      // Auto initialize texts if empty
      await initDatabase();
      const [newRows] = await pool.query<RowDataPacket[]>(query, params);
      if (newRows && newRows.length > 0) {
        const result: Record<string, Record<string, string>> = { vi: {}, en: {} };
        for (const row of newRows) {
          if (!result[row.lang]) result[row.lang] = {};
          result[row.lang][row.text_key] = row.value_text;
        }
        const finalData = langParam ? result[langParam] : result;
        setApiCache(cacheKey, finalData);
        return NextResponse.json({
          success: true,
          source: 'mysql',
          data: finalData,
        }, { headers: CACHE_HEADERS });
      }

      const defaultData = langParam ? (translations as Record<string, Record<string, string>>)[langParam] || translations.vi : translations;
      return NextResponse.json({
        success: true,
        source: 'default',
        data: defaultData,
      }, { headers: CACHE_HEADERS });
    }

    const result: Record<string, Record<string, string>> = {
      vi: { ...translations.vi },
      en: { ...translations.en },
    };

    for (const row of rows) {
      if (!result[row.lang]) result[row.lang] = {};
      result[row.lang][row.text_key] = row.value_text;
    }

    const finalData = langParam ? result[langParam] : result;
    setApiCache(cacheKey, finalData);
    return NextResponse.json({
      success: true,
      source: 'mysql',
      data: finalData,
    }, { headers: CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[API /api/texts GET] Fallback to static translations:', message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: translations,
      error: message,
    }, { headers: CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error || 'Quyền truy cập bị từ chối. Vui lòng đăng nhập Admin.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({
        success: false,
        source: 'local',
        message: 'MySQL pool is not available. Changes will persist in local session.',
      });
    }

    await initDatabase();

    const updates: Array<{ text_key: string; lang: string; value_text: string; section?: string }> = [];

    if (Array.isArray(body.updates)) {
      updates.push(...body.updates);
    } else if (body.text_key && body.value_text) {
      updates.push({
        text_key: body.text_key,
        lang: body.lang || 'vi',
        value_text: body.value_text,
        section: body.section || 'general',
      });
    } else if (body.vi || body.en) {
      if (body.vi) {
        for (const [key, val] of Object.entries(body.vi)) {
          updates.push({ text_key: key, lang: 'vi', value_text: String(val) });
        }
      }
      if (body.en) {
        for (const [key, val] of Object.entries(body.en)) {
          updates.push({ text_key: key, lang: 'en', value_text: String(val) });
        }
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    }

    const placeholders: string[] = [];
    const values: (string | number)[] = [];

    for (const item of updates) {
      let section = item.section;
      if (!section) {
        if (item.text_key.startsWith('nav_')) section = 'navigation';
        else if (item.text_key.startsWith('hero_') || item.text_key.startsWith('cta_')) section = 'hero';
        else if (item.text_key.startsWith('about_') || item.text_key.startsWith('goal_')) section = 'about';
        else if (item.text_key.startsWith('cv_')) section = 'cv';
        else if (item.text_key.startsWith('proj_')) section = 'projects';
        else if (item.text_key.startsWith('dash_')) section = 'dashboard';
        else section = 'general';
      }

      placeholders.push('(?, ?, ?, ?)');
      values.push(item.text_key, item.lang, item.value_text, section);
    }

    if (placeholders.length > 0) {
      await pool.query(
        `INSERT INTO portfolio_texts (text_key, lang, value_text, section)
         VALUES ${placeholders.join(', ')}
         ON DUPLICATE KEY UPDATE value_text = VALUES(value_text), section = VALUES(section)`,
        values
      );
    }

    invalidateApiCache('texts');

    return NextResponse.json({
      success: true,
      source: 'mysql',
      message: `Đã lưu thành công ${updates.length} đoạn văn bản vào MySQL!`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API /api/texts POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi lưu văn bản vào MySQL: ${message}`,
      },
      { status: 500 }
    );
  }
}
