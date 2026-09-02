import { getDbCache, setDbCache, invalidateDbCache } from './db';

/**
 * Server-Side Two-Tier API Cache Utility (PM2 Cluster Compatible)
 * Tầng 1: In-Memory cục bộ (TTL ngắn 5s) giảm tải truy vấn MySQL cho từng tiến trình.
 * Tầng 2: MySQL Shared Cache (`portfolio_cache` TTL 60s) đồng bộ trạng thái giữa tất cả các worker PM2.
 * Khi Admin lưu dữ liệu, `invalidateApiCacheAsync()` sẽ xoá ngay trong MySQL và bộ nhớ.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

// TTL in-memory ngắn để đảm bảo các worker PM2 khác nhau nhận diện thay đổi tức thời (tối đa 5s)
const L1_MEMORY_TTL_MS = 5 * 1000;
// TTL mặc định trên MySQL Shared Cache (60s)
const DEFAULT_L2_TTL_MS = 60 * 1000;

/**
 * Lấy dữ liệu từ L1 In-Memory Cache (Đồng bộ)
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
 * Lưu dữ liệu vào L1 In-Memory Cache (Đồng bộ)
 */
export function setApiCache<T>(key: string, data: T, ttlMs: number = L1_MEMORY_TTL_MS): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Xoá dữ liệu trong L1 In-Memory Cache (Đồng bộ)
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

/**
 * Lấy dữ liệu Cache Async (Kiểm tra L1 Memory -> L2 MySQL Shared Cache)
 */
export async function getApiCacheAsync<T>(key: string): Promise<T | null> {
  // 1. Kiểm tra L1 Memory
  const memData = getApiCache<T>(key);
  if (memData !== null) {
    return memData;
  }

  // 2. Kiểm tra L2 MySQL Shared Cache
  try {
    const dbData = await getDbCache<T>(key);
    if (dbData !== null) {
      // Nạp ngược lại vào L1 Memory của tiến trình này
      setApiCache(key, dbData, L1_MEMORY_TTL_MS);
      return dbData;
    }
  } catch {
    // Fallback nếu MySQL có sự cố
  }

  return null;
}

/**
 * Lưu dữ liệu Cache Async (Lưu L1 Memory + Ghi L2 MySQL Shared)
 */
export async function setApiCacheAsync<T>(
  key: string,
  data: T,
  ttlMs: number = DEFAULT_L2_TTL_MS
): Promise<void> {
  // 1. Ghi L1 Memory
  setApiCache(key, data, Math.min(ttlMs, L1_MEMORY_TTL_MS));

  // 2. Ghi L2 MySQL Shared Cache
  try {
    await setDbCache(key, data, ttlMs);
  } catch {
    // Fallback
  }
}

/**
 * Vô hiệu hoá Cache Async (Xoá L1 Memory + Xoá trong MySQL Shared Cache)
 * Đảm bảo (N-1) worker PM2 khác sẽ không phục vụ dữ liệu cũ quá 5 giây (hoặc cập nhật ngay lập tức nếu cache L1 đã hết hạn)
 */
export async function invalidateApiCacheAsync(prefixOrKey?: string): Promise<void> {
  // 1. Xoá L1 Memory cục bộ
  invalidateApiCache(prefixOrKey);

  // 2. Xoá trong MySQL Shared Cache
  try {
    await invalidateDbCache(prefixOrKey);
  } catch {
    // Fallback
  }
}
