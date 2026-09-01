import { describe, it, expect, beforeEach } from 'vitest';
import { 
  generateAdminToken, 
  verifyAdminToken, 
  validateAdminPassword, 
  checkLoginRateLimit, 
  recordFailedLogin, 
  resetLoginAttempts 
} from '../app/lib/auth';

describe('Admin Authentication & Rate Limiting Module', () => {
  const testIp = '192.168.1.100';

  beforeEach(() => {
    resetLoginAttempts(testIp);
  });

  describe('HMAC Token Generation & Verification', () => {
    it('should generate a valid signed token', () => {
      const token = generateAdminToken();
      expect(typeof token).toBe('string');
      expect(token.includes('.')).toBe(true);
      expect(verifyAdminToken(token)).toBe(true);
    });

    it('should reject invalid or tampered tokens', () => {
      expect(verifyAdminToken('invalid.token')).toBe(false);
      expect(verifyAdminToken('')).toBe(false);
      expect(verifyAdminToken(null)).toBe(false);

      const valid = generateAdminToken();
      const tampered = valid.slice(0, -5) + 'abcde';
      expect(verifyAdminToken(tampered)).toBe(false);
    });
  });

  describe('validateAdminPassword', () => {
    it('should validate string passwords without crashing', () => {
      expect(validateAdminPassword('')).toBe(false);
      // @ts-expect-error test invalid types
      expect(validateAdminPassword(null)).toBe(false);
    });
  });

  describe('Rate Limiter', () => {
    it('should allow initial attempts', () => {
      const check = checkLoginRateLimit(testIp);
      expect(check.allowed).toBe(true);
      expect(check.remainingAttempts).toBe(5);
    });

    it('should decrement remaining attempts on failed login', () => {
      const rec1 = recordFailedLogin(testIp);
      expect(rec1.isLocked).toBe(false);
      expect(rec1.remainingAttempts).toBe(4);

      const rec2 = recordFailedLogin(testIp);
      expect(rec2.remainingAttempts).toBe(3);
    });

    it('should lockout IP after 5 consecutive failures', () => {
      for (let i = 0; i < 4; i++) {
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
      expect(check.remainingAttempts).toBe(5);
    });
  });
});
