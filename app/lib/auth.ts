/**
 * Enhanced Authentication Module (Triple-Password Security for Single Admin)
 * Hệ thống 1 tài khoản Admin duy nhất được bảo vệ bởi 3 tầng mật khẩu độc lập.
 */

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface SessionInfo {
  username: string;
  loginTime: number;
  lastActive: number;
  role: 'admin';
}

export interface RateLimitState {
  isLocked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
  maxAttempts: number;
}

export interface AdminTripleCredentials {
  pass1Hash: string;
  pass2Hash: string;
  pass3Hash: string;
}

// Initial default credentials hash (Admin can customize & update via Admin Panel)
const DEFAULT_CREDENTIALS: AdminTripleCredentials = {
  pass1Hash: 'fd55fe20ce3c826f87cfee948ba3ec400638dfe8e8d973cd4708084d1a47e1cb',
  pass2Hash: '983589f68a61012b2fda3650f4de287b194ba5bfa64a0028dc97a12bdadfee03',
  pass3Hash: '56cd781f9c078e02ff75980653159bc73864b650f08d2584724f2d13eca67af1',
};

const TRIPLE_AUTH_KEY = 'portfolio_admin_triple_auth_v4';
const SESSION_DATA_KEY = 'portfolio_admin_session_data_v4';
const RATE_LIMIT_KEY = 'portfolio_admin_rate_limit_v4';
const SECURITY_LOGS_KEY = 'portfolio_admin_security_logs_v4';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

/**
 * Tạo Salt ngẫu nhiên
 */
export function generateSalt(length = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2, 18);
}

/**
 * Băm mật khẩu kèm Salt (SHA-256)
 */
export async function hashWithSalt(password: string, salt: string): Promise<string> {
  const combined = `${salt}:${password}`;
  const msgBuffer = new TextEncoder().encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}$${hashHex}`;
}

/**
 * Băm SHA-256 đơn giản
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Xác minh mật khẩu so với hash đã lưu
 */
async function verifySinglePassword(input: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;
  if (storedHash.includes('$')) {
    const [salt] = storedHash.split('$');
    const computed = await hashWithSalt(input, salt);
    return computed === storedHash;
  }
  const simpleHash = await sha256(input);
  return simpleHash === storedHash;
}

/**
 * Lấy 3 hashes mật khẩu Admin đang lưu trữ
 */
export function getStoredCredentials(): AdminTripleCredentials {
  if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
  const stored = localStorage.getItem(TRIPLE_AUTH_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        pass1Hash: parsed.pass1Hash || DEFAULT_CREDENTIALS.pass1Hash,
        pass2Hash: parsed.pass2Hash || DEFAULT_CREDENTIALS.pass2Hash,
        pass3Hash: parsed.pass3Hash || DEFAULT_CREDENTIALS.pass3Hash,
      };
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  }
  return DEFAULT_CREDENTIALS;
}

/**
 * Lưu 3 hashes mật khẩu Admin
 */
export function setStoredCredentials(creds: AdminTripleCredentials): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRIPLE_AUTH_KEY, JSON.stringify(creds));
  }
}

/**
 * Kiểm tra xem admin có đang dùng mật khẩu mặc định (admin1, admin2, admin3) hay không
 */
export function isUsingDefaultPasswords(): boolean {
  const creds = getStoredCredentials();
  return (
    creds.pass1Hash === DEFAULT_CREDENTIALS.pass1Hash ||
    creds.pass2Hash === DEFAULT_CREDENTIALS.pass2Hash ||
    creds.pass3Hash === DEFAULT_CREDENTIALS.pass3Hash
  );
}

// --- RATE LIMITING (CHỐNG BRUTE-FORCE) ---

export function getRateLimitState(): RateLimitState {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0, maxAttempts: MAX_FAILED_ATTEMPTS };
  }

  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) {
      return { isLocked: false, remainingSeconds: 0, failedAttempts: 0, maxAttempts: MAX_FAILED_ATTEMPTS };
    }

    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockUntil && now < data.lockUntil) {
      const remainingSeconds = Math.ceil((data.lockUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        failedAttempts: data.failedAttempts || MAX_FAILED_ATTEMPTS,
        maxAttempts: MAX_FAILED_ATTEMPTS,
      };
    }

    if (data.lockUntil && now >= data.lockUntil) {
      sessionStorage.removeItem(RATE_LIMIT_KEY);
      return { isLocked: false, remainingSeconds: 0, failedAttempts: 0, maxAttempts: MAX_FAILED_ATTEMPTS };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts: data.failedAttempts || 0,
      maxAttempts: MAX_FAILED_ATTEMPTS,
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0, maxAttempts: MAX_FAILED_ATTEMPTS };
  }
}

export function recordFailedAttempt(): RateLimitState {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 1, maxAttempts: MAX_FAILED_ATTEMPTS };
  }

  const current = getRateLimitState();
  const nextAttempts = current.failedAttempts + 1;
  const now = Date.now();

  let lockUntil: number | null = null;
  if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
    lockUntil = now + LOCKOUT_DURATION_MS;
    logSecurityEvent(
      'Khóa đăng nhập tạm thời',
      `Nhập sai mật khẩu 3 tầng ${nextAttempts} lần. Tạm khóa đăng nhập 60 giây.`,
      'error'
    );
  } else {
    logSecurityEvent(
      'Đăng nhập Admin thất bại',
      `Xác thực 3 mật khẩu không thành công lần ${nextAttempts}/${MAX_FAILED_ATTEMPTS}.`,
      'warning'
    );
  }

  const state = { failedAttempts: nextAttempts, lockUntil };
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
  return getRateLimitState();
}

export function resetRateLimit(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  }
}

// --- XÁC THỰC 3 MẬT KHẨU TỪNG BƯỚC (PROGRESSIVE DISCLOSURE) ---

export async function verifyStepPassword(step: 1 | 2 | 3, inputPassword: string): Promise<boolean> {
  const rateLimit = getRateLimitState();
  if (rateLimit.isLocked) {
    return false;
  }

  const creds = getStoredCredentials();
  let targetHash = '';
  if (step === 1) targetHash = creds.pass1Hash;
  else if (step === 2) targetHash = creds.pass2Hash;
  else if (step === 3) targetHash = creds.pass3Hash;

  const isValid = await verifySinglePassword(inputPassword, targetHash);
  if (isValid) {
    if (step === 3) {
      resetRateLimit();
      logSecurityEvent('Đăng nhập Quản trị thành công', 'Admin đã vượt qua cả 3 vòng bảo mật từng bước.', 'success');
    }
  } else {
    recordFailedAttempt();
  }

  return isValid;
}

export async function verifyCredentials(
  username: string,
  pass1: string,
  pass2: string,
  pass3: string
): Promise<boolean> {
  const rateLimit = getRateLimitState();
  if (rateLimit.isLocked) {
    return false;
  }

  // Chỉ chấp nhận duy nhất 1 tài khoản là 'admin'
  if (username.trim().toLowerCase() !== 'admin') {
    recordFailedAttempt();
    return false;
  }

  const creds = getStoredCredentials();

  const isPass1Valid = await verifySinglePassword(pass1, creds.pass1Hash);
  const isPass2Valid = await verifySinglePassword(pass2, creds.pass2Hash);
  const isPass3Valid = await verifySinglePassword(pass3, creds.pass3Hash);

  // Bắt buộc cả 3 mật khẩu đều phải chính xác
  const allValid = isPass1Valid && isPass2Valid && isPass3Valid;

  if (allValid) {
    resetRateLimit();
    logSecurityEvent('Đăng nhập Quản trị thành công', 'Admin đã xác thực thành công cả 3 tầng mật khẩu.', 'success');
  } else {
    recordFailedAttempt();
  }

  return allValid;
}

/**
 * Đổi đồng thời cả 3 mật khẩu của Admin
 */
export async function changeAdminPasswords(
  currPass1: string,
  currPass2: string,
  currPass3: string,
  newPass1: string,
  newPass2: string,
  newPass3: string
): Promise<{ success: boolean; message: string }> {
  const isValid = await verifyCredentials('admin', currPass1, currPass2, currPass3);
  if (!isValid) {
    return { success: false, message: 'Bộ 3 mật khẩu hiện tại chưa chính xác. Vui lòng kiểm tra lại!' };
  }

  if (!newPass1 || !newPass2 || !newPass3) {
    return { success: false, message: 'Vui lòng nhập đầy đủ cả 3 mật khẩu mới.' };
  }

  const salt1 = generateSalt(16);
  const salt2 = generateSalt(16);
  const salt3 = generateSalt(16);

  const newHash1 = await hashWithSalt(newPass1, salt1);
  const newHash2 = await hashWithSalt(newPass2, salt2);
  const newHash3 = await hashWithSalt(newPass3, salt3);

  setStoredCredentials({
    pass1Hash: newHash1,
    pass2Hash: newHash2,
    pass3Hash: newHash3,
  });

  logSecurityEvent('Đổi 3 mật khẩu thành công', 'Admin đã cập nhật thành công bộ 3 mật khẩu bảo vệ mới.', 'success');

  return { success: true, message: '🎉 Đổi thành công bộ 3 mật khẩu quản trị!' };
}

// --- QUẢN LÝ PHIÊN LÀM VIỆC (SESSION) ---

export function getSessionData(): SessionInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_DATA_KEY);
    if (!raw) return null;
    const session: SessionInfo = JSON.parse(raw);
    const now = Date.now();

    if (now - session.lastActive > SESSION_TIMEOUT_MS) {
      setAdminSession(false);
      logSecurityEvent('Hết hạn phiên làm việc', 'Phiên làm việc quản trị đã tự động đóng sau 30 phút bất hoạt.', 'warning');
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function touchSession(): void {
  if (typeof window === 'undefined') return;
  const current = getSessionData();
  if (current) {
    current.lastActive = Date.now();
    sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(current));
  }
}

export function isSessionAdmin(): boolean {
  const session = getSessionData();
  return !!session;
}

export function getSessionUsername(): string | null {
  const session = getSessionData();
  return session ? session.username : null;
}

export function setAdminSession(status: boolean, username = 'admin'): void {
  if (typeof window === 'undefined') return;

  if (status) {
    const now = Date.now();
    const session: SessionInfo = {
      username: 'admin',
      loginTime: now,
      lastActive: now,
      role: 'admin',
    };
    sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));
    sessionStorage.setItem('portfolio_admin_authenticated', 'true');
    sessionStorage.setItem('portfolio_admin_username', 'admin');
  } else {
    logSecurityEvent('Đăng xuất Quản trị', 'Admin đã kết thúc phiên làm việc an toàn.', 'success');
    sessionStorage.removeItem(SESSION_DATA_KEY);
    sessionStorage.removeItem('portfolio_admin_authenticated');
    sessionStorage.removeItem('portfolio_admin_username');
  }
}

// --- NHẬT KÝ BẢO MẬT (SECURITY AUDIT LOGS) ---

export function getSecurityLogs(): SecurityLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SECURITY_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logSecurityEvent(
  action: string,
  details: string,
  status: 'success' | 'warning' | 'error' = 'success'
): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getSecurityLogs();
    const newEntry: SecurityLogEntry = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      action,
      details,
      status,
    };
    const updated = [newEntry, ...logs].slice(0, 50);
    localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to write security log', e);
  }
}

export function clearSecurityLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SECURITY_LOGS_KEY);
  }
}
