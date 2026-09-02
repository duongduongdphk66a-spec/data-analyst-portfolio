import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { getDbPool, testDbConnection, initDatabase } from '@/app/lib/db';
import { verifyAdminRequest } from '@/app/lib/auth';
import { invalidateApiCacheAsync } from '@/app/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error || 'Quyền truy cập bị từ chối. Vui lòng đăng nhập Admin.' },
        { status: 401 }
      );
    }

    const connTest = await testDbConnection();

    if (!connTest.connected) {
      return NextResponse.json({
        connected: false,
        message: connTest.message,
        source: 'local_fallback',
        tables: [],
        stats: {
          profileRows: 0,
          textRows: 0,
          projectRows: 0,
        },
      });
    }

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({
        connected: false,
        message: 'Pool is null',
        source: 'local_fallback',
      });
    }

    // Check table row counts
    let profileRows = 0;
    let textRows = 0;
    let projectRows = 0;

    try {
      const [pRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM portfolio_profile');
      profileRows = pRows[0]?.cnt || 0;
    } catch {
      // Table may not exist yet
    }

    try {
      const [tRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM portfolio_texts');
      textRows = tRows[0]?.cnt || 0;
    } catch {
      // Table may not exist yet
    }

    try {
      const [projRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM portfolio_projects');
      projectRows = projRows[0]?.cnt || 0;
    } catch {
      // Table may not exist yet
    }

    return NextResponse.json({
      connected: true,
      message: 'Kết nối MySQL hoạt động bình thường.',
      stats: {
        profileRows,
        textRows,
        projectRows,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database check error';
    return NextResponse.json({
      connected: false,
      message,
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API /api/db POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi thao tác cơ sở dữ liệu: ${message}`,
      },
      { status: 500 }
    );
  }
}
