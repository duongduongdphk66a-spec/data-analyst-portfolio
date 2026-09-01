import { NextRequest } from 'next/server';
import crypto from 'crypto';

/**
 * Server-side Admin Authentication Utility
 * Quản lý xác thực và kiểm soát quyền truy cập API quản trị viên.
 */

// Lấy Secret từ biến môi trường hoặc dùng fallback cho môi trường phát triển
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'admin123';
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 giờ

/**
 * Tạo token phiên đăng nhập (Signed Session Token) dựa trên HMAC-SHA256
 */
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', ADMIN_PASSWORD)
    .update(timestamp)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Kiểm tra tính hợp lệ và thời hạn của Admin Token
 */
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const trimmed = token.trim();
  if (!trimmed) return false;

  // 1. Cho phép dùng trực tiếp ADMIN_PASSWORD cho các cuộc gọi programmatic API nếu trùng khớp
  if (trimmed === ADMIN_PASSWORD) {
    return true;
  }

  // 2. Kiểm tra HMAC Signed Token (timestamp.signature)
  const parts = trimmed.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  // Kiểm tra thời hạn hết hạn
  const now = Date.now();
  if (now - timestamp > TOKEN_MAX_AGE_MS || timestamp > now + 60000) {
    return false; // Token đã hết hạn hoặc timestamp không hợp lệ
  }

  // Xác minh chữ ký số bằng so sánh an toàn timingSafeEqual
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_PASSWORD)
    .update(timestampStr)
    .digest('hex');

  try {
    const sigBuffer = Buffer.from(signature, 'hex');
    const expBuffer = Buffer.from(expectedSignature, 'hex');
    if (sigBuffer.length !== expBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expBuffer);
  } catch {
    return false;
  }
}

/**
 * Kiểm tra mật khẩu Admin khi đăng nhập
 */
export function validateAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  // So sánh an toàn chống timing attack
  const passBuffer = Buffer.from(password);
  const adminBuffer = Buffer.from(ADMIN_PASSWORD);
  if (passBuffer.length !== adminBuffer.length) return false;
  return crypto.timingSafeEqual(passBuffer, adminBuffer);
}

/**
 * Trích xuất và xác minh Admin Token từ NextRequest
 */
export function verifyAdminRequest(req: NextRequest): { authenticated: boolean; error?: string } {
  // Lấy token từ header hoặc cookie
  const authHeader = req.headers.get('authorization') || '';
  let token = req.headers.get('x-admin-token') || '';

  if (!token && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    const cookieToken = req.cookies.get('admin_token')?.value;
    if (cookieToken) token = cookieToken;
  }

  if (!token) {
    return {
      authenticated: false,
      error: 'Yêu cầu không được xác thực. Vui lòng đăng nhập với quyền Admin.',
    };
  }

  const isValid = verifyAdminToken(token);
  if (!isValid) {
    return {
      authenticated: false,
      error: 'Token quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    };
  }

  return { authenticated: true };
}
