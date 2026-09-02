import { NextRequest, NextResponse } from 'next/server';
import { 
  validateAdminPassword, 
  generateAdminToken, 
  getClientIp, 
  checkLoginRateLimitAsync, 
  recordFailedLoginAsync, 
  resetLoginAttemptsAsync 
} from '@/app/lib/auth';

/**
 * POST /api/auth/login
 * Đăng nhập quản trị viên với mật khẩu và kiểm soát Rate Limit
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Kiểm tra Rate Limit trước khi xử lý mật khẩu (đồng bộ qua MySQL / In-memory)
    const rateCheck = await checkLoginRateLimitAsync(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Tài khoản tạm thời bị khoá do thử sai quá nhiều lần. Vui lòng thử lại sau ${rateCheck.retryAfterSeconds || 900} giây.`,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds || 900),
          }
        }
      );
    }

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
      const record = await recordFailedLoginAsync(ip);
      // Giả lập delay chống timing attack
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (record.isLocked) {
        return NextResponse.json(
          {
            success: false,
            message: `Mật khẩu không chính xác. Bạn đã nhập sai 5 lần, tài khoản bị khoá tạm thời trong 15 phút.`,
            retryAfter: record.retryAfterSeconds,
          },
          { 
            status: 429,
            headers: {
              'Retry-After': String(record.retryAfterSeconds || 900),
            }
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Mật khẩu quản trị không chính xác. Còn lại ${record.remainingAttempts} lần thử.`,
          remainingAttempts: record.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Đăng nhập thành công -> Reset số lần thử sai
    await resetLoginAttemptsAsync(ip);
    const token = generateAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập quản trị thành công!',
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
  } catch (error: unknown) {
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi xử lý xác thực hệ thống.' },
      { status: 500 }
    );
  }
}
