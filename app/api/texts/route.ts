import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDatabase } from '@/app/lib/db';
import { translations } from '@/app/data/translations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const langParam = searchParams.get('lang'); // 'vi' | 'en' | null

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({
        success: true,
        source: 'default',
        data: langParam ? (translations as any)[langParam] || translations.vi : translations,
      });
    }

    // Query all texts from database
    let query = 'SELECT text_key, lang, value_text, section FROM portfolio_texts';
    const params: any[] = [];
    if (langParam) {
      query += ' WHERE lang = ?';
      params.push(langParam);
    }

    const [rows]: any = await pool.query(query, params);

    if (!rows || rows.length === 0) {
      // Auto initialize texts if empty
      await initDatabase();
      const [newRows]: any = await pool.query(query, params);
      if (newRows && newRows.length > 0) {
        const result: Record<string, Record<string, string>> = { vi: {}, en: {} };
        for (const row of newRows) {
          if (!result[row.lang]) result[row.lang] = {};
          result[row.lang][row.text_key] = row.value_text;
        }
        return NextResponse.json({
          success: true,
          source: 'mysql',
          data: langParam ? result[langParam] : result,
        });
      }

      return NextResponse.json({
        success: true,
        source: 'default',
        data: langParam ? (translations as any)[langParam] || translations.vi : translations,
      });
    }

    const result: Record<string, Record<string, string>> = {
      vi: { ...translations.vi },
      en: { ...translations.en },
    };

    for (const row of rows) {
      if (!result[row.lang]) result[row.lang] = {};
      result[row.lang][row.text_key] = row.value_text;
    }

    return NextResponse.json({
      success: true,
      source: 'mysql',
      data: langParam ? result[langParam] : result,
    });
  } catch (error: any) {
    console.warn('[API /api/texts GET] Fallback to static translations:', error?.message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: translations,
      error: error?.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expected body format:
    // { updates: [ { text_key: string, lang: 'vi' | 'en', value_text: string, section?: string } ] }
    // or { text_key: string, lang: string, value_text: string, section?: string }
    // or dictionary { vi?: { ... }, en?: { ... } }

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

      await pool.query(
        `INSERT INTO portfolio_texts (text_key, lang, value_text, section)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE value_text = VALUES(value_text), section = VALUES(section)`,
        [item.text_key, item.lang, item.value_text, section]
      );
    }

    return NextResponse.json({
      success: true,
      source: 'mysql',
      message: `Đã lưu thành công ${updates.length} đoạn văn bản vào MySQL!`,
    });
  } catch (error: any) {
    console.error('[API /api/texts POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi lưu văn bản vào MySQL: ${error?.message || 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
