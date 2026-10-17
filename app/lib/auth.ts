import { NextRequest } from 'next/server';
import crypto from 'crypto';
import net from 'net';
import { getDbRateLimit, recordDbFailedLogin, resetDbRateLimit } from './db';

function isValidIp(ip: string | null | undefined): boolean {
  if (!ip) return false;
  const trimmed = ip.trim();
  return Boolean(trimmed && net.isIP(trimmed) !== 0);
}

export function normalizeIp(rawIp: string | null | undefined): string | null {
  if (!rawIp) return null;
  const trimmed = rawIp.trim();
  if (!trimmed || trimmed.length > 64) return null;
  const clean = trimmed.replace(/^::ffff:/i, '');
  return isValidIp(clean) ? clean : null;
}

/**
 * Trích xuất Client IP an toàn theo cấu hình Reverse Proxy tường minh.
 * Không tự động dò header ngoại lai để chống giả mạo IP (IP Spoofing / Proxy Header Poisoning).
 *
 * Cấu hình TRUST_PROXY:
 * - 'false' / rỗng: Chạy trực tiếp hoặc không có proxy tin cậy. Bỏ qua toàn bộ header proxy,
 *   giới hạn chung theo địa chỉ socket hoặc IP toàn cục '127.0.0.1'. Không phân tách theo User-Agent.
 * - 'vercel': Chỉ tin x-vercel-forwarded-for khi chạy thật trên hạ tầng Vercel (VERCEL === '1').
 * - 'cloudflare': Chỉ tin cf-connecting-ip do Cloudflare kiểm soát.
 * - 'nginx': Chỉ tin x-real-ip do Nginx gán từ $remote_addr.
 * - 'true': Chế độ proxy thông thường, ưu tiên x-real-ip; nếu lấy x-forwarded-for thì lấy IP cuối cùng.
 */
export function getClientIp(request: NextRequest | Request): string {
  const headers = request.headers;
  const rawTrustProxy = (process.env.TRUST_PROXY || 'false').toLowerCase().trim();
  const isVercelEnv = process.env.VERCEL === '1';

  // 1. Chỉ tin x-vercel-forwarded-for khi thực sự chạy trên hạ tầng Vercel (VERCEL === '1')
  if (isVercelEnv && (rawTrustProxy === 'vercel' || rawTrustProxy === 'true' || rawTrustProxy === 'false' || !rawTrustProxy)) {
    const vercelIp = headers.get('x-vercel-forwarded-for')?.split(',')[0];
    const normalized = normalizeIp(vercelIp);
    if (normalized) return normalized;
    return '127.0.0.1';
  }

  // 2. Chế độ Cloudflare tường minh
  if (rawTrustProxy === 'cloudflare') {
    const cfIp = headers.get('cf-connecting-ip');
    const normalized = normalizeIp(cfIp);
    if (normalized) return normalized;
    return '127.0.0.1';
  }

  // 3. Chế độ Nginx / Reverse Proxy nội bộ (TRUST_PROXY="nginx" hoặc "true" hoặc "1")
  if (rawTrustProxy === 'nginx' || rawTrustProxy === 'true' || rawTrustProxy === '1') {
    // Ưu tiên tuyệt đối X-Real-IP do Nginx ghi đè ($remote_addr)
    const realIp = normalizeIp(headers.get('x-real-ip'));
    if (realIp) return realIp;

    // Nếu không có X-Real-IP, lấy phần tử CUỐI CÙNG hợp lệ trong X-Forwarded-For (IP do Proxy nối thêm vào cuối)
    const xff = headers.get('x-forwarded-for');
    if (xff) {
      const parts = xff
        .split(',')
        .map((p) => normalizeIp(p))
        .filter((p): p is string => Boolean(p));
      if (parts.length > 0) {
        return parts[parts.length - 1];
      }
    }
    return '127.0.0.1';
  }

  // 4. Mặc định (TRUST_PROXY="false"): Không tin bất kỳ header nào từ Client
  return '127.0.0.1';
}

/**
 * Server-side Admin Authentication & Rate Limiting Utility
 * Quản lý xác thực và kiểm soát quyền truy cập API quản trị viên.
 */

// Tạo secret ngẫu nhiên lúc khởi động cho môi trường dev nếu không có biến môi trường
const FALLBACK_RANDOM_SECRET = crypto.randomBytes(32).toString('hex');
const MIN_PROD_PASSWORD_LENGTH = 16; // Khớp 100% với tài liệu README.md
const MIN_PROD_VERIFY_CODE_LENGTH = 8; // Khớp 100% với tài liệu README.md (>= 8 ký tự)

export function getSessionSigningSecret(): string {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return process.env.SESSION_SECRET;
  }
  const adminPwd = process.env.ADMIN_PASSWORD || '';
  if (!adminPwd) return FALLBACK_RANDOM_SECRET;
  // Dẫn xuất khóa ký độc lập bằng HMAC thay vì dùng trực tiếp ADMIN_PASSWORD thô
  return crypto.createHmac('sha256', 'portfolio-session-v1').update(adminPwd).digest('hex');
}

const PLACEHOLDER_PATTERNS = [
  /your_/i,
  /_here/i,
  /changeme/i,
  /example/i,
  /default/i,
  /^admin123/i,
  /^password/i,
  /placeholder/i
];

/**
 * Kiểm tra xem chuỗi có phải là giá trị mẫu mặc định không an toàn (placeholder) không.
 * Từ chối tuyệt đối các chuỗi chứa: your_, _here, changeme, example, default, admin123, password, placeholder.
 */
export function isInsecurePlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return PLACEHOLDER_PATTERNS.some((regex) => regex.test(trimmed));
}

export const isPlaceholderSecret = isInsecurePlaceholder;

export function isProductionAuthConfigured(): boolean {
  const pwd = process.env.ADMIN_PASSWORD || '';
  const verifyCode = process.env.ADMIN_VERIFY_CODE || '';
  const sessionSecret = process.env.SESSION_SECRET || '';
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    if (
      isInsecurePlaceholder(pwd) ||
      isInsecurePlaceholder(verifyCode) ||
      (sessionSecret && isInsecurePlaceholder(sessionSecret))
    ) {
      return false;
    }
    return pwd.length >= MIN_PROD_PASSWORD_LENGTH && verifyCode.length >= MIN_PROD_VERIFY_CODE_LENGTH;
  }

  return pwd.length >= 6 && !isInsecurePlaceholder(pwd);
}

function getAdminPassword(): string {
  const envPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  const minLength = process.env.NODE_ENV === 'production' ? MIN_PROD_PASSWORD_LENGTH : 6;
  if (envPassword && envPassword.trim().length >= minLength) {
    const trimmed = envPassword.trim();
    if (isPlaceholderSecret(trimmed)) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          `[CRITICAL SECURITY ERROR] ADMIN_PASSWORD cannot use default placeholder template values (contains 'your_', '_here', or 'changeme').`
        );
      }
      return FALLBACK_RANDOM_SECRET;
    }
    return trimmed;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `[CRITICAL SECURITY ERROR] ADMIN_PASSWORD must be configured with >= ${MIN_PROD_PASSWORD_LENGTH} characters in production mode.`
    );
  }
  return envPassword?.trim() || FALLBACK_RANDOM_SECRET;
}

function getAdminVerifyCode(): string {
  const envCode = process.env.ADMIN_VERIFY_CODE;
  const minLength = process.env.NODE_ENV === 'production' ? MIN_PROD_VERIFY_CODE_LENGTH : 6;
  if (envCode && envCode.trim().length >= minLength) {
    const trimmed = envCode.trim();
    if (isPlaceholderSecret(trimmed)) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          `[CRITICAL SECURITY ERROR] ADMIN_VERIFY_CODE cannot use default placeholder template values (contains 'your_', '_here', or 'changeme').`
        );
      }
      return FALLBACK_RANDOM_SECRET;
    }
    return trimmed;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `[CRITICAL SECURITY ERROR] ADMIN_VERIFY_CODE must be configured in environment in production mode (>= ${MIN_PROD_VERIFY_CODE_LENGTH} characters).`
    );
  }
  return envCode?.trim() || FALLBACK_RANDOM_SECRET;
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

export const MAX_FAILED_ATTEMPTS = 10;
export const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 phút
export const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;   // 15 phút

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
  const secret = getSessionSigningSecret();
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(timestamp)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Kiểm tra thông tin xác thực Admin khi đăng nhập (Constant-time SHA-256 comparison)
 */
export function validateAdminPassword(password: string, verifyCode?: string): boolean {
  if (!password || typeof password !== 'string') return false;
  if (isPlaceholderSecret(password) || (verifyCode && isPlaceholderSecret(verifyCode))) {
    return false;
  }
  
  let adminPassword = '';
  let adminVerifyCode = '';
  try {
    adminPassword = getAdminPassword();
    adminVerifyCode = getAdminVerifyCode();
  } catch {
    return false;
  }
  if (!adminPassword || !adminVerifyCode) return false;

  // SHA-256 hash chuyển đổi cả 2 chuỗi về buffer cố định 32-byte
  // Loại trừ hoàn toàn side-channel rò rỉ độ dài mật khẩu
  const passHash = crypto.createHash('sha256').update(password).digest();
  const adminHash = crypto.createHash('sha256').update(adminPassword).digest();
  const passwordMatch = crypto.timingSafeEqual(passHash, adminHash);

  // Xác thực mã xác nhận bảo mật (constant-time)
  const codeInput = verifyCode || '';
  const codeHash = crypto.createHash('sha256').update(codeInput).digest();
  const adminCodeHash = crypto.createHash('sha256').update(adminVerifyCode).digest();
  const codeMatch = crypto.timingSafeEqual(codeHash, adminCodeHash);

  // Cả hai phải đúng (luôn chạy cả 2 phép so sánh để tránh timing leak)
  return passwordMatch && codeMatch;
}

/**
 * Kiểm tra tính hợp lệ và thời hạn của Admin Token
 */
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const trimmed = token.trim();
  if (!trimmed) return false;

  // Chỉ chấp nhận HMAC Signed Token (timestamp.signature) để bảo mật tuyệt đối,
  // không chấp nhận mật khẩu thô qua network để tránh rò rỉ qua log/proxy/devtools.
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

  const secret = getSessionSigningSecret();
  if (!secret) return false;

  // Xác minh chữ ký số bằng so sánh an toàn timingSafeEqual
  const expectedSignature = crypto
    .createHmac('sha256', secret)
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
