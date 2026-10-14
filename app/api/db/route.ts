import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { getDbPool, testDbConnection, initDatabase } from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/auth';
import { invalidateApiCacheAsync } from '@/app/lib/cache';

let lastHealthCheckCache: { timestamp: number; payload: Record<string, unknown> } | null = null;
const HEALTHCHECK_CACHE_TTL_MS = 15_000;

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAdminRequest(req);

    const now = Date.now();
    if (!auth.authenticated && lastHealthCheckCache && (now - lastHealthCheckCache.timestamp < HEALTHCHECK_CACHE_TTL_MS)) {
      return NextResponse.json({ ...lastHealthCheckCache.payload, cached: true });
    }

    const connTest = await testDbConnection();

    const responsePayload: any = {
      appHealthy: true,
      database: connTest.connected,
      message: connTest.connected 
        ? 'Dịch vụ dữ liệu hoạt động bình thường.' 
        : (auth.authenticated ? connTest.message : 'Kết nối cơ sở dữ liệu bị gián đoạn.'),
    };

    if (!auth.authenticated) {
      lastHealthCheckCache = { timestamp: now, payload: responsePayload };
      return NextResponse.json(responsePayload);
    }

    // Admin authenticated: trả full stats
    if (auth.authenticated && connTest.connected) {
      const pool = getDbPool();
      if (pool) {
        let profileRows = 0, textRows = 0, projectRows = 0, tiktokRows = 0;
        
        try {
          const [pRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM portfolio_profile');
          profileRows = pRows[0]?.cnt || 0;
          const [tRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM portfolio_texts');
          textRows = tRows[0]?.cnt || 0;
          const [projRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM portfolio_projects');
          projectRows = projRows[0]?.cnt || 0;
        } catch {}

        try {
          const tiktokTables = [
            'tiktok_shop_overview', 'tiktok_shop_weekly_trends', 'tiktok_shop_top_skus',
            'tiktok_shop_top_affiliates', 'tiktok_shop_livestreams', 'tiktok_shop_videos',
            'tiktok_shop_data_scopes', 'tiktok_shop_collaborative_stores',
          ];
          for (const t of tiktokTables) {
            try {
              const [res] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as cnt FROM ${t}`);
              tiktokRows += Number(res[0]?.cnt || 0);
            } catch {}
          }
        } catch {}

        responsePayload.stats = { profileRows, textRows, projectRows, tiktokRows };
      }
    }

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database check error';
    console.error('[API /api/db GET] Error:', message);
    const auth = verifyAdminRequest(req);
    return NextResponse.json({
      appHealthy: true,
      database: false,
      message: auth.authenticated ? message : 'Dịch vụ đang hoạt động ở chế độ dữ liệu dự phòng.',
      source: 'error',
    });
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

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'init'; // 'init' | 'reset'

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể kết nối tới MySQL. Vui lòng kiểm tra file .env hoặc dịch vụ MySQL.',
        },
        { status: 500 }
      );
    }

    if (action === 'reset') {
      // Yêu cầu khóa xác nhận để tránh xoá nhầm dữ liệu production
      if (body.confirmKey !== 'CONFIRM_RESET_DATABASE') {
        return NextResponse.json(
          {
            success: false,
            message: 'Thiếu hoặc sai mã xác nhận reset database (confirmKey). Hành động bị hủy bỏ vì an toàn dữ liệu.',
          },
          { status: 400 }
        );
      }

      // Drop and re-create
      await pool.query('DROP TABLE IF EXISTS portfolio_texts');
      await pool.query('DROP TABLE IF EXISTS portfolio_profile');
      await pool.query('DROP TABLE IF EXISTS portfolio_projects');
      await pool.query('DROP TABLE IF EXISTS portfolio_cache');
      const initRes = await initDatabase(true);
      await invalidateApiCacheAsync();
      return NextResponse.json({
        success: initRes.success,
        message: 'Đã thiết lập lại cơ sở dữ liệu về mặc định ban đầu!',
        details: initRes,
      });
    }

    // Default action: init
    const initRes = await initDatabase();
    return NextResponse.json({
      success: initRes.success,
      message: initRes.message,
      details: initRes,
    });
  } catch (error: unknown) {
    console.error('[API /api/db POST] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi thao tác cơ sở dữ liệu. Vui lòng kiểm tra lại nhật ký máy chủ.',
      },
      { status: 500 }
    );
  }
}
