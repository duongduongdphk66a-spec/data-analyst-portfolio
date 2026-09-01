import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/app/lib/auth';

/**
 * POST /api/auth/login
 * Đăng nhập quản trị viên với mật khẩu
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp mật khẩu quản trị.' },
        { status: 400 }
      );
    }

    const isValid = validateAdminPassword(password);
    if (!isValid) {
      // Giả lập delay nhỏ để phòng chống brute-force
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { success: false, message: 'Mật khẩu quản trị không chính xác.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập quản trị thành công!',
      token,
    });

    // Thiết lập cookie an toàn
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 1 ngày
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý xác thực hệ thống.' },
      { status: 500 }
    );
  }
}
