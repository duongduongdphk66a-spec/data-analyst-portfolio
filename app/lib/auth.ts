import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { getDbRateLimit, recordDbFailedLogin, resetDbRateLimit } from './db';

/**
 * Server-side Admin Authentication & Rate Limiting Utility
 * Quản lý xác thực và kiểm soát quyền truy cập API quản trị viên.
 */

// Tạo secret ngẫu nhiên lúc khởi động cho môi trường dev nếu không có biến môi trường
const FALLBACK_RANDOM_SECRET = crypto.randomBytes(32).toString('hex');

function getAdminPassword(): string {
  const envPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (envPassword && envPassword.trim().length >= 8) {
    return envPassword.trim();
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[CRITICAL SECURITY ERROR] ADMIN_PASSWORD/ADMIN_SECRET must be configured in environment with at least 8 characters in production mode.'
    );
  }
  return envPassword?.trim() || FALLBACK_RANDOM_SECRET;
}

const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 giờ

// ==========================================
// Rate Limiter (In-memory + MySQL Cluster Sync)
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
 * Chỉ tin cậy các proxy header khi TRUST_PROXY='true' được bật tường minh.
 * Ngăn chặn tuyệt đối việc kẻ tấn công tự set header giả lập IP để bypass rate limiting.
 */
export function getClientIp(req: NextRequest): string {
  const isTrustProxy = process.env.TRUST_PROXY === 'true';

  if (isTrustProxy) {
    // 1. Cloudflare header (chỉ tin khi đứng sau Cloudflare Proxy tin cậy)
    const cfIp = req.headers.get('cf-connecting-ip');
    if (cfIp) {
      return cfIp.trim();
    }

    // 2. Nginx/Traefik X-Real-IP header do reverse proxy thiết lập
    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
      return realIp.trim();
    }

    // 3. X-Forwarded-For: lấy IP đầu tiên (client IP)
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
      const clientIp = forwarded.split(',')[0].trim();
      if (clientIp) return clientIp;
    }
  }

  // Khi TRUST_PROXY=false hoặc không đứng sau proxy:
  // Lấy IP từ NextRequest socket nếu có hoặc fallback an toàn
  const reqIp = (req as unknown as { ip?: string }).ip;
  if (reqIp && typeof reqIp === 'string' && reqIp.trim()) {
    return reqIp.trim();
  }

  return '127.0.0.1';
}

/**
 * Kiểm tra xem IP có đang bị khoá hoặc quá số lần thử không (Sync In-Memory)
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
 * Kiểm tra Rate Limit Async có đồng bộ MySQL (cho Multi-process PM2 Cluster)
 */
export async function checkLoginRateLimitAsync(ip: string): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
}> {
  try {
    const dbLimit = await getDbRateLimit(ip);
    if (dbLimit) {
      const now = Date.now();
      if (dbLimit.lockedUntil && dbLimit.lockedUntil > now) {
        const retryAfterSeconds = Math.ceil((dbLimit.lockedUntil - now) / 1000);
        return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
      }
      if (now - dbLimit.lastAttempt <= ATTEMPT_WINDOW_MS) {
        const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - dbLimit.failedAttempts);
        return { allowed: remaining > 0, remainingAttempts: remaining };
      }
    }
  } catch {
    // Fallback to in-memory check
  }

  return checkLoginRateLimit(ip);
}

/**
 * Ghi nhận một lần thử đăng nhập thất bại (Sync In-Memory)
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
 * Ghi nhận thất bại Async có lưu MySQL (đồng bộ các worker PM2)
 */
export async function recordFailedLoginAsync(ip: string): Promise<{
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
}> {
  // Update in-memory first
  const memResult = recordFailedLogin(ip);

  try {
    const dbResult = await recordDbFailedLogin(
      ip,
      MAX_FAILED_ATTEMPTS,
      LOCKOUT_DURATION_MS,
      ATTEMPT_WINDOW_MS
    );
    if (dbResult) return dbResult;
  } catch {
    // Fallback to in-memory result
  }

  return memResult;
}

/**
 * Reset lại trạng thái thử khi đăng nhập thành công
 */
export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Reset lại trạng thái thử Async (đồng bộ xoá cả trong MySQL)
 */
export async function resetLoginAttemptsAsync(ip: string): Promise<void> {
  resetLoginAttempts(ip);
  try {
    await resetDbRateLimit(ip);
  } catch {
    // Ignore error
  }
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
 * Kiểm tra mật khẩu Admin khi đăng nhập (Constant-time SHA-256 comparison)
 */
export function validateAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  let adminPassword = '';
  try {
    adminPassword = getAdminPassword();
  } catch {
    return false;
  }
  if (!adminPassword) return false;

  // SHA-256 hash chuyển đổi cả 2 chuỗi về buffer cố định 32-byte
  // Loại trừ hoàn toàn side-channel rò rỉ độ dài mật khẩu
  const passHash = crypto.createHash('sha256').update(password).digest();
  const adminHash = crypto.createHash('sha256').update(adminPassword).digest();
  return crypto.timingSafeEqual(passHash, adminHash);
}

/**
 * Kiểm tra tính hợp lệ và thời hạn của Admin Token
 */
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const trimmed = token.trim();
  if (!trimmed) return false;

  // 1. Cho phép dùng trực tiếp ADMIN_PASSWORD cho các cuộc gọi programmatic API nếu trùng khớp
  // Sử dụng validateAdminPassword để đảm bảo constant-time comparison
  if (validateAdminPassword(trimmed)) {
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

  let password = '';
  try {
    password = getAdminPassword();
  } catch {
    return false;
  }

  // Xác minh chữ ký số bằng so sánh an toàn timingSafeEqual
  const expectedSignature = crypto
    .createHmac('sha256', password)
    .update(timestampStr)
    .digest('hex');

  try {
    const sigHash = crypto.createHash('sha256').update(signature).digest();
    const expHash = crypto.createHash('sha256').update(expectedSignature).digest();
    return crypto.timingSafeEqual(sigHash, expHash);
  } catch {
    return false;
  }
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
