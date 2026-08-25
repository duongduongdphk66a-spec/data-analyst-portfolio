/**
 * Security Utility Module
 * Phòng chống tấn công XSS, Prototype Pollution và kiểm soát dữ liệu đầu vào.
 */

// Danh sách các giao thức URL được coi là an toàn
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:', 'blob:']);

/**
 * Làm sạch và xác thực URL trước khi đưa vào href hoặc src.
 * Ngăn chặn tấn công XSS thông qua `javascript:`, `data:`, `vbscript:`.
 */
export function sanitizeUrl(url: string | undefined | null, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback;
  
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Cho phép liên kết tương đối nội bộ hoặc anchor (#) hoặc ảnh base64 data:image/
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('./') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    if (SAFE_PROTOCOLS.has(parsed.protocol)) {
      return trimmed;
    }
    console.warn(`[Security Alert] Blocked potentially unsafe URL protocol: ${parsed.protocol}`);
    return fallback;
  } catch {
    // Nếu chuỗi không parse được URL chuẩn nhưng không chứa ký tự nguy hiểm
    if (/^[a-zA-Z0-9_\-\.\/]+$/.test(trimmed)) {
      return trimmed;
    }
    return fallback;
  }
}

/**
 * Ngăn chặn Prototype Pollution bằng cách loại bỏ các thuộc tính nguy hiểm
 * như `__proto__`, `constructor`, `prototype`.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Chặn hoàn toàn các key ô nhiễm prototype
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.warn(`[Security Alert] Stripped dangerous prototype key: ${key}`);
      continue;
    }
    cleaned[key] = sanitizeObject(value);
  }

  return cleaned as T;
}

/**
 * Phân tích cú pháp JSON an toàn có bảo vệ chống Prototype Pollution và Crash
 */
export function safeJsonParse<T>(jsonStr: string, fallback: T): T {
  if (!jsonStr || typeof jsonStr !== 'string') return fallback;
  try {
    const parsed = JSON.parse(jsonStr);
    return sanitizeObject(parsed);
  } catch (err) {
    console.error('[Security Warning] Failed to parse JSON securely:', err);
    return fallback;
  }
}

/**
 * Kiểm tra file upload an toàn (giới hạn dung lượng và đuôi mở rộng)
 */
export function validateUploadedFile(file: File, options: { maxSizeBytes?: number; allowedExtensions?: string[] } = {}): { isValid: boolean; error?: string } {
  const maxSize = options.maxSizeBytes || 5 * 1024 * 1024; // Mặc định 5MB
  const allowedExtensions = options.allowedExtensions || ['.json', '.csv', '.txt'];

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Dung lượng tệp quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là ${maxSizeMB}MB.`
    };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()));
  if (!hasValidExt) {
    return {
      isValid: false,
      error: `Định dạng tệp không được hỗ trợ. Chỉ chấp nhận các định dạng: ${allowedExtensions.join(', ')}`
    };
  }

  return { isValid: true };
}
