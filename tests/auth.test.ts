import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { 
  generateAdminToken, 
  verifyAdminToken, 
  validateAdminPassword, 
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

  describe('getClientIp', () => {
    it('should ignore spoofed headers when TRUST_PROXY is false (default)', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'false';

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-real-ip': '10.0.0.1',
          'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        },
      });

      expect(getClientIp(req)).toBe('127.0.0.1');
      process.env.TRUST_PROXY = prev;
    });

    it('should prioritize cf-connecting-ip when TRUST_PROXY is true', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-real-ip': '10.0.0.1',
          'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.195');
      process.env.TRUST_PROXY = prev;
    });

    it('should use x-real-ip if cf-connecting-ip is missing and TRUST_PROXY is true', () => {
      const prev = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-real-ip': '198.51.100.50',
          'x-forwarded-for': '1.2.3.4',
        },
      });
      expect(getClientIp(req)).toBe('198.51.100.50');
      process.env.TRUST_PROXY = prev;
    });

    it('should extract leftmost valid IP from x-forwarded-for when trust proxy is enabled', () => {
      const prevEnv = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-forwarded-for': '203.0.113.10, 10.0.0.2',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.10');
      process.env.TRUST_PROXY = prevEnv;
    });

    it('should ignore malformed/poisoned IPs in x-forwarded-for and find first valid IP', () => {
      const prevEnv = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-forwarded-for': 'garbage-injection-string, 198.51.100.77, 10.0.0.2',
        },
      });
      expect(getClientIp(req)).toBe('198.51.100.77');
      process.env.TRUST_PROXY = prevEnv;
    });

    it('should fallback to 127.0.0.1 when headers contain only invalid IP strings', () => {
      const prevEnv = process.env.TRUST_PROXY;
      process.env.TRUST_PROXY = 'true';
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'cf-connecting-ip': 'invalid-cf-ip',
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
});
