/**
 * Visitor Tracking & Activity Analytics Module
 * Tự động ghi nhận danh tính ẩn danh và mọi hành vi của khách truy cập trang web.
 */

export interface VisitorActionLog {
  id: string;
  visitorId: string;
  visitorLabel: string;
  device: string;
  browser: string;
  os: string;
  screenResolution?: string;
  timestamp: string;
  action: string;
  category: 'pageview' | 'navigation' | 'project' | 'contact' | 'chart' | 'download' | 'general';
  details?: string;
}

export interface VisitorAnalyticsSummary {
  totalActions: number;
  uniqueVisitorsCount: number;
  topSections: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  recentActions: VisitorActionLog[];
}

const VISITOR_ID_KEY = 'portfolio_visitor_id_v2';
const VISITOR_LOGS_KEY = 'portfolio_visitor_activity_logs_v2';
const MAX_VISITOR_LOGS = 200;

/**
 * Phân tích User Agent lấy thông tin Thiết bị, Trình duyệt, Hệ điều hành
 */
function parseUserAgent(): { device: string; browser: string; os: string } {
  if (typeof window === 'undefined') {
    return { device: 'Desktop', browser: 'Browser', os: 'OS' };
  }

  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  if (ua.indexOf('Win') !== -1) os = 'Windows';
  else if (ua.indexOf('Mac') !== -1) os = 'macOS';
  else if (ua.indexOf('iPhone') !== -1) os = 'iOS';
  else if (ua.indexOf('iPad') !== -1) os = 'iPadOS';
  else if (ua.indexOf('Android') !== -1) os = 'Android';
  else if (ua.indexOf('Linux') !== -1) os = 'Linux';

  let browser = 'Browser';
  if (ua.indexOf('Edg') !== -1) browser = 'Edge';
  else if (ua.indexOf('Chrome') !== -1) browser = 'Chrome';
  else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
  else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
  else if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) browser = 'Opera';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const device = isMobile ? 'Mobile / Tablet' : 'Máy tính (Desktop)';

  return { device, browser, os };
}

/**
 * Lấy hoặc tạo mới Visitor ID duy nhất cho khách truy cập
 */
export function getOrCreateVisitorId(): { id: string; label: string; device: string; browser: string; os: string } {
  if (typeof window === 'undefined') {
    return { id: 'vis-guest', label: 'Khách vãng lai', device: 'Desktop', browser: 'Web', os: 'OS' };
  }

  const { device, browser, os } = parseUserAgent();
  let storedId = localStorage.getItem(VISITOR_ID_KEY);

  if (!storedId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    storedId = `VIS-${randomNum}`;
    localStorage.setItem(VISITOR_ID_KEY, storedId);
  }

  const label = `Khách #${storedId.replace('VIS-', '')} (${os} • ${browser})`;
  return { id: storedId, label, device, browser, os };
}

/**
 * Ghi nhận một hành vi của khách truy cập
 */
export function trackVisitorAction(
  action: string,
  details?: string,
  category: 'pageview' | 'navigation' | 'project' | 'contact' | 'chart' | 'download' | 'general' = 'general'
): void {
  if (typeof window === 'undefined') return;

  try {
    const visitor = getOrCreateVisitorId();
    const resolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;

    const newLog: VisitorActionLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      visitorId: visitor.id,
      visitorLabel: visitor.label,
      device: visitor.device,
      browser: visitor.browser,
      os: visitor.os,
      screenResolution: resolution,
      timestamp: new Date().toLocaleString('vi-VN'),
      action,
      category,
      details,
    };

    const existingLogs = getVisitorLogs();
    const updatedLogs = [newLog, ...existingLogs].slice(0, MAX_VISITOR_LOGS);
    localStorage.setItem(VISITOR_LOGS_KEY, JSON.stringify(updatedLogs));
  } catch (err) {
    console.error('Failed to track visitor action', err);
  }
}

/**
 * Lấy toàn bộ danh sách lịch sử hành vi khách truy cập
 */
export function getVisitorLogs(): VisitorActionLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VISITOR_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Thống kê tổng hợp dữ liệu khách truy cập dành cho Admin
 */
export function getVisitorAnalytics(): VisitorAnalyticsSummary {
  const logs = getVisitorLogs();
  const uniqueVisitors = new Set<string>();
  const topSections: Record<string, number> = {};
  const deviceBreakdown: Record<string, number> = {};
  const browserBreakdown: Record<string, number> = {};

  logs.forEach(log => {
    uniqueVisitors.add(log.visitorId);

    // Top actions/sections
    topSections[log.action] = (topSections[log.action] || 0) + 1;

    // Devices
    deviceBreakdown[log.device] = (deviceBreakdown[log.device] || 0) + 1;

    // Browsers
    browserBreakdown[log.browser] = (browserBreakdown[log.browser] || 0) + 1;
  });

  return {
    totalActions: logs.length,
    uniqueVisitorsCount: uniqueVisitors.size,
    topSections,
    deviceBreakdown,
    browserBreakdown,
    recentActions: logs,
  };
}

/**
 * Xóa toàn bộ nhật ký khách truy cập
 */
export function clearVisitorLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(VISITOR_LOGS_KEY);
  }
}
