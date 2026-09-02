/**
 * Server-Side In-Memory API Cache Utility
 * Giảm tải truy vấn lặp lại tới MySQL cho các dữ liệu ít biến động (Profile, Texts, Projects).
 * Tự động vô hiệu hóa (invalidate) ngay lập tức khi Admin thực hiện thao tác lưu (POST).
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 60 * 1000; // 60 giây

/**
 * Lấy dữ liệu từ cache nếu còn hạn
 */
export function getApiCache<T>(key: string): T | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Lưu dữ liệu vào cache với TTL tuỳ chọn
 */
export function setApiCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Xoá một hoặc toàn bộ cache (khi Admin cập nhật dữ liệu hoặc reset DB)
 */
export function invalidateApiCache(prefixOrKey?: string): void {
  if (!prefixOrKey) {
    memoryCache.clear();
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key === prefixOrKey || key.startsWith(`${prefixOrKey}:`) || key.startsWith(prefixOrKey)) {
      memoryCache.delete(key);
    }
  }
}
