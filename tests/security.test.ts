import { describe, it, expect, afterEach } from 'vitest';
import { sanitizeUrl, sanitizeEmbedUrl, sanitizeObject, safeJsonParse, validateUploadedFile, sanitizeTextInput } from '../app/lib/security';

describe('Security Utility Module', () => {
  describe('sanitizeTextInput', () => {
    it('should trim and limit length of strings', () => {
      expect(sanitizeTextInput('  hello world  ', 5)).toBe('hello');
      expect(sanitizeTextInput('short', 100)).toBe('short');
    });

    it('should handle non-string and nullish values safely', () => {
      expect(sanitizeTextInput(null, 10, 'default')).toBe('default');
      expect(sanitizeTextInput(undefined, 10, 'default')).toBe('default');
      expect(sanitizeTextInput(12345, 3)).toBe('123');
    });
  });

  describe('sanitizeUrl', () => {
    it('should block javascript: XSS vectors', () => {
      expect(sanitizeUrl("javascript:alert('XSS')")).toBe('#');
      expect(sanitizeUrl("JAVASCRIPT:alert(1)")).toBe('#');
      expect(sanitizeUrl("vbscript:msgbox(1)")).toBe('#');
      expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe('#');
    });

    it('should allow valid http and https URLs', () => {
      expect(sanitizeUrl('https://github.com/duongduongdphk66a-spec')).toBe('https://github.com/duongduongdphk66a-spec');
      expect(sanitizeUrl('http://localhost:3000/dashboard')).toBe('http://localhost:3000/dashboard');
    });

    it('should allow relative paths, hashes and base64 images', () => {
      expect(sanitizeUrl('/projects/proj-kami-ely')).toBe('/projects/proj-kami-ely');
      expect(sanitizeUrl('#overview')).toBe('#overview');
      expect(sanitizeUrl('data:image/png;base64,iVBORw0KGgo=')).toBe('data:image/png;base64,iVBORw0KGgo=');
    });

    it('should handle null/undefined/empty gracefully', () => {
      expect(sanitizeUrl(null)).toBe('#');
      expect(sanitizeUrl(undefined)).toBe('#');
      expect(sanitizeUrl('')).toBe('#');
      expect(sanitizeUrl('   ', 'fallback-url')).toBe('fallback-url');
    });
  });

  describe('sanitizeEmbedUrl', () => {
    it('should block dangerous embed protocols', () => {
      expect(sanitizeEmbedUrl("javascript:alert(1)")).toBe('about:blank');
      expect(sanitizeEmbedUrl("data:text/html;base64,...")).toBe('about:blank');
      expect(sanitizeEmbedUrl("blob:http://evil.com/123")).toBe('about:blank');
      expect(sanitizeEmbedUrl("file:///etc/passwd")).toBe('about:blank');
    });

    it('should allow legitimate iframe sources', () => {
      expect(sanitizeEmbedUrl('https://lookerstudio.google.com/embed/reporting/123')).toBe(
        'https://lookerstudio.google.com/embed/reporting/123'
      );
      expect(sanitizeEmbedUrl('/projects/proj-kami-ely')).toBe('/projects/proj-kami-ely');
    });
  });

  describe('sanitizeObject & safeJsonParse', () => {
    it('should remove prototype pollution keys', () => {
      const malicious = JSON.parse('{"name":"test","__proto__":{"admin":true},"constructor":{"test":1}}');
      const sanitized = sanitizeObject(malicious);
      expect(sanitized.name).toBe('test');
      expect(Object.prototype.hasOwnProperty.call(sanitized, '__proto__')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(sanitized, 'constructor')).toBe(false);
    });

    it('should safely parse JSON with fallback', () => {
      expect(safeJsonParse('{"a": 1}', { a: 0 })).toEqual({ a: 1 });
      expect(safeJsonParse('invalid-json', { fallback: true })).toEqual({ fallback: true });
    });
  });

  describe('validateUploadedFile', () => {
    it('should validate allowed extensions and file size', () => {
      const validFile = new File(['col1,col2\n1,2'], 'data.csv', { type: 'text/csv' });
      expect(validateUploadedFile(validFile).isValid).toBe(true);

      const invalidExtFile = new File(['evil script'], 'script.exe', { type: 'application/x-msdownload' });
      expect(validateUploadedFile(invalidExtFile).isValid).toBe(false);
    });
  });

  describe('Git Repository & MySQL Credential Leakage Prevention', () => {
    it('should strictly ignore all .env files in .gitignore except .env.example', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const gitignorePath = path.resolve(process.cwd(), '.gitignore');
      const gitignore = fs.readFileSync(gitignorePath, 'utf-8');

      expect(gitignore).toMatch(/^\.env$/m);
      expect(gitignore).toMatch(/^\.env\.\*$/m);
      expect(gitignore).toMatch(/^!\.env\.example$/m);
    });

    it('should ensure .env.example contains only dummy placeholders and no real secrets', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const examplePath = path.resolve(process.cwd(), '.env.example');
      const exampleContent = fs.readFileSync(examplePath, 'utf-8');

      // Ensure no live passwords or secrets are in .env.example
      expect(exampleContent).not.toMatch(/173053/);
      expect(exampleContent).toMatch(/MYSQL_PASSWORD=""/);
      expect(exampleContent).toMatch(/your_admin_password_here/);
    });
  });

  describe('getClientIp anti-spoofing via security module', () => {
    const origEnv = process.env.TRUST_PROXY;
    const origVercel = process.env.VERCEL;

    afterEach(() => {
      process.env.TRUST_PROXY = origEnv;
      process.env.VERCEL = origVercel;
    });

    it('ignores spoofed cf-connecting-ip, x-vercel-forwarded-for, and User-Agent when TRUST_PROXY=false', async () => {
      const { getClientIp } = await import('../app/lib/auth');
      process.env.TRUST_PROXY = 'false';
      delete process.env.VERCEL;

      const req1 = new Request('http://localhost/api/auth/login', {
        headers: { 'cf-connecting-ip': '1.2.3.4', 'user-agent': 'Bot-1' },
      });
      const req2 = new Request('http://localhost/api/auth/login', {
        headers: { 'x-vercel-forwarded-for': '5.6.7.8', 'user-agent': 'Bot-2' },
      });
      expect(getClientIp(req1)).toBe('127.0.0.1');
      expect(getClientIp(req2)).toBe('127.0.0.1');
    });

    it('ignores spoofed cf-connecting-ip when TRUST_PROXY=nginx and uses x-real-ip', async () => {
      const { getClientIp } = await import('../app/lib/auth');
      process.env.TRUST_PROXY = 'nginx';
      const req = new Request('http://localhost/api/auth/login', {
        headers: {
          'cf-connecting-ip': '9.9.9.9',
          'x-vercel-forwarded-for': '8.8.8.8',
          'x-real-ip': '203.0.113.50',
        },
      });
      expect(getClientIp(req)).toBe('203.0.113.50');
    });

    it('extracts the last appended IP in x-forwarded-for when TRUST_PROXY=true to neutralize spoofed prepended IPs', async () => {
      const { getClientIp } = await import('../app/lib/auth');
      process.env.TRUST_PROXY = 'true';
      const req = new Request('http://localhost/api/auth/login', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 198.51.100.50',
        },
      });
      // Attacker pre-pended 203.0.113.195, proxy appended 198.51.100.50
      expect(getClientIp(req)).toBe('198.51.100.50');
    });
  });
});

