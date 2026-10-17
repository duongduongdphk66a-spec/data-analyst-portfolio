import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { 
  generateAdminToken, 
  verifyAdminToken, 
  validateAdminPassword, 
  isPlaceholderSecret,
  isInsecurePlaceholder,
  isProductionAuthConfigured,
  getClientIp,
  checkLoginRateLimit, 
  recordFailedLogin, 
  resetLoginAttempts,
  checkLoginRateLimitAsync,
  recordFailedLoginAsync,
  resetLoginAttemptsAsync
} from '../app/lib/auth';

describe('Admin Authentication & Rate Limiting Module', () => {
  const testIp = '192.168.1.100';

  beforeEach(async () => {
    resetLoginAttempts(testIp);
    await resetLoginAttemptsAsync(testIp);
  });

  describe('getClientIp & Anti-Spoofing', () => {
    it('should ignore all spoofed headers when TRUST_PROXY is false (default)', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'false';

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-real-ip': '10.0.0.1',
          'x-forwarded-for': '1.2.3.4, 5.6.7.8',
          'x-vercel-forwarded-for': '198.51.100.22',
        },
      });

      expect(getClientIp(req)).toBe('127.0.0.1');
      process.env.TRUST_PROXY = prev;
    });

    it('should not split rate-limit buckets by rotating User-Agent when TRUST_PROXY is false', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'false';

      const req1 = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: { 'user-agent': 'AttackerBot/1.0', 'cf-connecting-ip': '1.1.1.1' },
      });
      const req2 = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: { 'user-agent': 'AttackerBot/2.0-Rotated', 'cf-connecting-ip': '2.2.2.2' },
      });

      // Cả hai request dù đổi User-Agent và IP giả đều phải gom về chung 127.0.0.1 để chống bypass rate limit
      expect(getClientIp(req1)).toBe('127.0.0.1');
      expect(getClientIp(req2)).toBe('127.0.0.1');
      process.env.TRUST_PROXY = prev;
    });

    it('should trust ONLY x-real-ip when TRUST_PROXY is nginx and ignore fake cf/vercel headers', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'nginx';

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195', // Attacker spoofing CF header
          'x-vercel-forwarded-for': '198.51.100.99', // Attacker spoofing Vercel header
          'x-real-ip': '198.51.100.50', // Genuine Nginx remote_addr
        },
      });

      expect(getClientIp(req)).toBe('198.51.100.50');
      process.env.TRUST_PROXY = prev;
    });

    it('should trust ONLY cf-connecting-ip when TRUST_PROXY is cloudflare', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'cloudflare';

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-real-ip': '10.0.0.1',
          'x-forwarded-for': '1.2.3.4',
        },
      });

      expect(getClientIp(req)).toBe('203.0.113.195');
      process.env.TRUST_PROXY = prev;
    });

    it('should trust ONLY x-vercel-forwarded-for when running on Vercel (VERCEL=1)', () => {
      const prevTrust = process.env.TRUST_PROXY;
      const prevVercel = process.env.VERCEL;

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-vercel-forwarded-for': '198.51.100.33, 10.0.0.1',
        },
      });

      // Khi chạy trên hạ tầng Vercel (VERCEL=1)
      process.env.VERCEL = '1';
      process.env.TRUST_PROXY = 'vercel';
      expect(getClientIp(req)).toBe('198.51.100.33');

      // Tự động nhận diện khi VERCEL=1 và TRUST_PROXY không đặt
      delete process.env.TRUST_PROXY;
      expect(getClientIp(req)).toBe('198.51.100.33');

      // Khi KHÔNG chạy trên Vercel (VERCEL không đặt), chế độ vercel không được tin header
      delete process.env.VERCEL;
      process.env.TRUST_PROXY = 'vercel';
      expect(getClientIp(req)).toBe('127.0.0.1');

      process.env.TRUST_PROXY = prevTrust;
      process.env.VERCEL = prevVercel;
    });

    it('should use x-real-ip or take the LAST IP in x-forwarded-for when TRUST_PROXY is true (generic proxy)', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';

      const reqRealIp = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195', // Attacker header should be ignored in generic mode
          'x-real-ip': '198.51.100.50',
        },
      });
      expect(getClientIp(reqRealIp)).toBe('198.51.100.50');

      // Kẻ tấn công chèn fake IP '203.0.113.10' ở đầu, proxy gắn real IP '198.51.100.77' ở cuối
      const reqForwarded = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-forwarded-for': '203.0.113.10, 198.51.100.77',
        },
      });
      // Hệ thống lấy IP cuối cùng do proxy gắn vào, vô hiệu hóa IP giả mạo
      expect(getClientIp(reqForwarded)).toBe('198.51.100.77');

      process.env.TRUST_PROXY = prev;
    });

    it('should ignore malformed/poisoned IPs in x-forwarded-for and pick the last valid IP', () => {
      const prevEnv = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-forwarded-for': 'garbage-injection-string, 198.51.100.77, 10.0.0.2',
        },
      });
      expect(getClientIp(req)).toBe('10.0.0.2');
      process.env.TRUST_PROXY = prevEnv;
    });

    it('should fallback to 127.0.0.1 when headers contain only invalid IP strings', () => {
      const prevEnv = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-real-ip': 'not-an-ip',
          'x-forwarded-for': 'malicious-string, also-invalid',
        },
      });
      expect(getClientIp(req)).toBe('127.0.0.1');
      process.env.TRUST_PROXY = prevEnv;
    });

    it('should fallback to default IP when no headers are present', () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login');
      expect(getClientIp(req)).toBe('127.0.0.1');
    });
  });

  describe('HMAC Token Generation & Verification', () => {
    it('should generate a valid signed token', () => {
      const token = generateAdminToken();
      expect(typeof token).toBe('string');
      expect(token.includes('.')).toBe(true);
      expect(verifyAdminToken(token)).toBe(true);
    });

    it('should reject raw admin password passed directly as a token', () => {
      // Raw passwords must never be accepted directly as session tokens
      expect(verifyAdminToken('Hung@2025')).toBe(false);
      expect(verifyAdminToken(process.env.ADMIN_PASSWORD || 'Hung@2025')).toBe(false);
    });

    it('should reject invalid or tampered tokens', () => {
      expect(verifyAdminToken('invalid.token')).toBe(false);
      expect(verifyAdminToken('')).toBe(false);
      expect(verifyAdminToken(null)).toBe(false);

      const valid = generateAdminToken();
      const tampered = valid.slice(0, -5) + 'abcde';
      expect(verifyAdminToken(tampered)).toBe(false);
    });

    it('should reject tokens with expired or invalid timestamps', () => {
      const expiredTimestamp = (Date.now() - 48 * 60 * 60 * 1000).toString();
      expect(verifyAdminToken(`${expiredTimestamp}.invalidsig`)).toBe(false);
    });
  });

  describe('validateAdminPassword & Timing Attack Resistance', () => {
    it('should validate string passwords without crashing on different lengths', () => {
      expect(validateAdminPassword('')).toBe(false);
      expect(validateAdminPassword('short')).toBe(false);
      expect(validateAdminPassword('a'.repeat(500))).toBe(false);
      // @ts-expect-error test invalid types
      expect(validateAdminPassword(null)).toBe(false);
      // @ts-expect-error test invalid types
      expect(validateAdminPassword(undefined)).toBe(false);
    });

    it('should reject default template placeholder secrets from .env.example', () => {
      expect(isPlaceholderSecret('your_admin_password_here')).toBe(true);
      expect(isPlaceholderSecret('your_security_verify_code_here')).toBe(true);
      expect(isPlaceholderSecret('changeme123')).toBe(true);
      expect(isPlaceholderSecret('my_actual_secure_password_99#')).toBe(false);

      // validateAdminPassword should block placeholder credentials
      expect(validateAdminPassword('your_admin_password_here', 'your_security_verify_code_here')).toBe(false);
      expect(validateAdminPassword('changeme', 'valid_verify_code_1234')).toBe(false);
    });
  });

  describe('Rate Limiter (Sync & Async)', () => {
    it('should allow initial attempts', () => {
      const check = checkLoginRateLimit(testIp);
      expect(check.allowed).toBe(true);
      expect(check.remainingAttempts).toBe(10);
    });

    it('should decrement remaining attempts on failed login', () => {
      const rec1 = recordFailedLogin(testIp);
      expect(rec1.isLocked).toBe(false);
      expect(rec1.remainingAttempts).toBe(9);

      const rec2 = recordFailedLogin(testIp);
      expect(rec2.remainingAttempts).toBe(8);
    });

    it('should lockout IP after 10 consecutive failures', () => {
      for (let i = 0; i < 9; i++) {
        recordFailedLogin(testIp);
      }
      const finalAttempt = recordFailedLogin(testIp);
      expect(finalAttempt.isLocked).toBe(true);
      expect(finalAttempt.remainingAttempts).toBe(0);
      expect(finalAttempt.retryAfterSeconds).toBeGreaterThan(0);

      // Subsequent checks should be blocked
      const check = checkLoginRateLimit(testIp);
      expect(check.allowed).toBe(false);
      expect(check.remainingAttempts).toBe(0);
    });

    it('should reset rate limit upon successful login', () => {
      recordFailedLogin(testIp);
      recordFailedLogin(testIp);
      resetLoginAttempts(testIp);

      const check = checkLoginRateLimit(testIp);
      expect(check.allowed).toBe(true);
      expect(check.remainingAttempts).toBe(10);
    });

    it('should work with async rate limiter methods', async () => {
      const asyncCheck1 = await checkLoginRateLimitAsync(testIp);
      expect(asyncCheck1.allowed).toBe(true);

      const rec = await recordFailedLoginAsync(testIp);
      expect(rec.remainingAttempts).toBe(9);

      await resetLoginAttemptsAsync(testIp);
      const asyncCheck2 = await checkLoginRateLimitAsync(testIp);
      expect(asyncCheck2.allowed).toBe(true);
      expect(asyncCheck2.remainingAttempts).toBe(10);
    });
  });

  describe('isProductionAuthConfigured', () => {
    const origNodeEnv = process.env.NODE_ENV;
    const origPwd = process.env.ADMIN_PASSWORD;
    const origCode = process.env.ADMIN_VERIFY_CODE;

    afterEach(() => {
      (process.env as Record<string, string | undefined>).NODE_ENV = origNodeEnv;
      process.env.ADMIN_PASSWORD = origPwd;
      process.env.ADMIN_VERIFY_CODE = origCode;
    });

    it('should require ADMIN_PASSWORD >= 16 and ADMIN_VERIFY_CODE >= 8 in production', async () => {
      const { isProductionAuthConfigured } = await import('@/app/lib/auth');
      (process.env as Record<string, string | undefined>).NODE_ENV = 'production';

      // Password short, verify code short
      process.env.ADMIN_PASSWORD = 'short';
      process.env.ADMIN_VERIFY_CODE = '1234';
      expect(isProductionAuthConfigured()).toBe(false);

      // Password 16+ but verify code < 8
      process.env.ADMIN_PASSWORD = 'super_secret_password_16_chars';
      process.env.ADMIN_VERIFY_CODE = '1234567'; // 7 chars (< 8)
      expect(isProductionAuthConfigured()).toBe(false);

      // Both valid
      process.env.ADMIN_VERIFY_CODE = '12345678'; // 8 chars (>= 8)
      expect(isProductionAuthConfigured()).toBe(true);
    });
  });

  describe('isInsecurePlaceholder & Insecure Template Credentials Rejection', () => {
    it('should detect all placeholder patterns as insecure', () => {
      expect(isInsecurePlaceholder('your_admin_password_here')).toBe(true);
      expect(isInsecurePlaceholder('your_security_verify_code_here')).toBe(true);
      expect(isInsecurePlaceholder('your_session_secret_here')).toBe(true);
      expect(isInsecurePlaceholder('changeme_12345')).toBe(true);
      expect(isInsecurePlaceholder('my_example_secret')).toBe(true);
      expect(isInsecurePlaceholder('default_pass_123')).toBe(true);
      expect(isInsecurePlaceholder('admin1234567890')).toBe(true);
      expect(isInsecurePlaceholder('password_for_admin')).toBe(true);
      expect(isInsecurePlaceholder('placeholder_token')).toBe(true);
      expect(isInsecurePlaceholder('')).toBe(true);
      expect(isInsecurePlaceholder(null)).toBe(true);
      expect(isInsecurePlaceholder(undefined)).toBe(true);

      // Realistic secure credentials
      expect(isInsecurePlaceholder('K@miElyProdSecret2026!')).toBe(false);
      expect(isInsecurePlaceholder('SecureCode98765432')).toBe(false);
    });

    it('should reject placeholder credentials in isProductionAuthConfigured even when length >= 16', () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origPwd = process.env.ADMIN_PASSWORD;
      const origCode = process.env.ADMIN_VERIFY_CODE;
      const origSecret = process.env.SESSION_SECRET;

      (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
      process.env.ADMIN_PASSWORD = 'your_admin_password_here'; // 24 chars >= 16
      process.env.ADMIN_VERIFY_CODE = 'your_security_verify_code_here'; // 29 chars >= 8
      process.env.SESSION_SECRET = 'your_session_secret_here';

      expect(isProductionAuthConfigured()).toBe(false);

      // Set legitimate production credentials
      process.env.ADMIN_PASSWORD = 'K@miElyProdSecret2026!';
      process.env.ADMIN_VERIFY_CODE = 'SecureCode98765432';
      process.env.SESSION_SECRET = 'ProdSessionKeySecret9876543210';

      expect(isProductionAuthConfigured()).toBe(true);

      (process.env as Record<string, string | undefined>).NODE_ENV = origNodeEnv;
      process.env.ADMIN_PASSWORD = origPwd;
      process.env.ADMIN_VERIFY_CODE = origCode;
      process.env.SESSION_SECRET = origSecret;
    });

    it('should refuse login via validateAdminPassword if using placeholder values', () => {
      const origPwd = process.env.ADMIN_PASSWORD;
      const origCode = process.env.ADMIN_VERIFY_CODE;

      process.env.ADMIN_PASSWORD = 'your_admin_password_here';
      process.env.ADMIN_VERIFY_CODE = 'your_security_verify_code_here';

      // Even if user types the matching placeholder from .env.example, login MUST fail
      expect(validateAdminPassword('your_admin_password_here', 'your_security_verify_code_here')).toBe(false);

      process.env.ADMIN_PASSWORD = origPwd;
      process.env.ADMIN_VERIFY_CODE = origCode;
    });

    it('should refuse verification code via validateAdminPassword if verifyCode contains placeholder patterns', () => {
      const origPwd = process.env.ADMIN_PASSWORD;
      const origCode = process.env.ADMIN_VERIFY_CODE;

      process.env.ADMIN_PASSWORD = 'LegitimateAdminPassword2026!';
      process.env.ADMIN_VERIFY_CODE = 'your_security_verify_code_here';

      // Even with legitimate password, if verifyCode is placeholder, validateAdminPassword must return false
      expect(validateAdminPassword('LegitimateAdminPassword2026!', 'your_security_verify_code_here')).toBe(false);

      process.env.ADMIN_PASSWORD = origPwd;
      process.env.ADMIN_VERIFY_CODE = origCode;
    });
  });
});
