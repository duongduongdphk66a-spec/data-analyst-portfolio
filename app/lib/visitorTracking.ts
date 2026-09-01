/**
 * Privacy-Friendly Client-Side Telemetry & Visitor Action Logger
 * Ghi nhận các tương tác người dùng vào sessionStorage để hỗ trợ gỡ lỗi và phân tích phiên cục bộ.
 * Không thu thập thông tin định danh cá nhân (PII), không gửi dữ liệu ra bên ngoài.
 */

export interface VisitorActionLog {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  details?: string;
}

const MAX_STORED_ACTIONS = 50;
const SESSION_STORAGE_KEY = 'portfolio_visitor_actions';

/**
 * Ghi nhận một hành động tương tác của khách truy cập
 */
export function trackVisitorAction(
  action: string = 'view',
  details: string = '',
  category: string = 'general'
): void {
  if (typeof window === 'undefined') return;

  const logEntry: VisitorActionLog = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    action,
    category,
    details,
  };

  // 1. In log hỗ trợ gỡ lỗi trong môi trường phát triển
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Telemetry] [${category.toUpperCase()}] ${action}: ${details}`);
  }

  // 2. Lưu trữ tối đa 50 hành động gần nhất vào sessionStorage
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const existing: VisitorActionLog[] = raw ? JSON.parse(raw) : [];
    const updated = [logEntry, ...existing].slice(0, MAX_STORED_ACTIONS);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // SessionStorage có thể bị tắt trong chế độ ẩn danh nghiêm ngặt
  }
}

/**
 * Lấy danh sách các hành động tương tác gần đây từ session hiện tại
 */
export function getRecentVisitorActions(): VisitorActionLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
