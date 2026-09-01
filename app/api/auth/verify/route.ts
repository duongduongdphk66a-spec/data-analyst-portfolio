import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/app/lib/auth';

/**
 * GET & POST /api/auth/verify
 * Kiểm tra tính hợp lệ của token admin hiện tại từ cookie hoặc header
 */
function handleVerify(req: NextRequest) {
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

export async function GET(req: NextRequest) {
  return handleVerify(req);
}

export async function POST(req: NextRequest) {
  return handleVerify(req);
}
