import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/app/lib/auth';

/**
 * POST /api/auth/verify
 * Kiểm tra tính hợp lệ của token admin hiện tại
 */
export async function POST(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      { authenticated: false, message: auth.error || 'Chưa được xác thực.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    message: 'Phiên quản trị đang hoạt động hợp lệ.',
  });
}
