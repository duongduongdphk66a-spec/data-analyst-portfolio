import { NextRequest } from 'next/server';
import crypto from 'crypto';

/**
 * Server-side Admin Authentication & Rate Limiting Utility
 * Quản lý xác thực và kiểm soát quyền truy cập API quản trị viên.
 */

// Tạo secret ngẫu nhiên lúc khởi động nếu không có biến môi trường (không bao giờ dùng mật khẩu cố định yếu)
const FALLBACK_RANDOM_SECRET = crypto.randomBytes(32).toString('hex');

function getAdminPassword(): string {
  const envPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (envPassword && envPassword.trim().length >= 8) {
    return envPassword.trim();
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[SECURITY WARNING] ADMIN_PASSWORD chưa được thiết lập hoặc quá ngắn (< 8 ký tự). Đang sử dụng mã bí mật ngẫu nhiên tạm thời.'
    );
  }
  return envPassword?.trim() || FALLBACK_RANDOM_SECRET;
}

const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 giờ

// ==========================================
// In-memory Rate Limiter cho /api/auth/login
// ==========================================
interface RateLimitEntry {
  failedAttempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 phút
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;   // 15 phút

const loginAttempts = new Map<string, RateLimitEntry>();

// Dọn dẹp bộ nhớ định kỳ (mỗi 10 phút)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of loginAttempts.entries()) {
    if (now - entry.lastAttempt > ATTEMPT_WINDOW_MS && (!entry.lockedUntil || now > entry.lockedUntil)) {
      loginAttempts.delete(ip);
    }
  }
}, 10 * 60 * 1000).unref?.();

/**
 * Trích xuất Client IP an toàn từ Request
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Kiểm tra xem IP có đang bị khoá hoặc quá số lần thử không
 */
export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Kiểm tra thời gian khoá tài khoản
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Nếu đã qua cửa sổ thời gian, reset lại số lần thử
  if (now - entry.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - entry.failedAttempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

/**
 * Ghi nhận một lần thử đăng nhập thất bại
 */
export function recordFailedLogin(ip: string): {
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  let entry = loginAttempts.get(ip);

  if (!entry || now - entry.lastAttempt > ATTEMPT_WINDOW_MS) {
    entry = { failedAttempts: 1, lockedUntil: null, lastAttempt: now };
  } else {
    entry.failedAttempts += 1;
    entry.lastAttempt = now;
  }

  if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, entry);
    return {
      isLocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  loginAttempts.set(ip, entry);
  return {
    isLocked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - entry.failedAttempts,
  };
}

/**
 * Reset lại trạng thái thử khi đăng nhập thành công
 */
export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// ==========================================
// Token & Password Validation
// ==========================================

/**
 * Tạo token phiên đăng nhập (Signed Session Token) dựa trên HMAC-SHA256
 */
export function generateAdminToken(): string {
  const password = getAdminPassword();
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', password)
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

  const password = getAdminPassword();

  // 1. Cho phép dùng trực tiếp ADMIN_PASSWORD cho các cuộc gọi programmatic API nếu trùng khớp
  if (trimmed === password) {
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
    .createHmac('sha256', password)
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
  const adminPassword = getAdminPassword();
  // So sánh an toàn chống timing attack
  const passBuffer = Buffer.from(password);
  const adminBuffer = Buffer.from(adminPassword);
  if (passBuffer.length !== adminBuffer.length) return false;
  return crypto.timingSafeEqual(passBuffer, adminBuffer);
}

/**
 * Trích xuất và xác minh Admin Token từ NextRequest
 */
export function verifyAdminRequest(req: NextRequest): { authenticated: boolean; error?: string } {
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
