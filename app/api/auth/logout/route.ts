import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Đăng xuất quản trị viên và xóa cookie phiên
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Đã đăng xuất tài khoản quản trị.',
  });

  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
