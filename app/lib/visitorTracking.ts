/**
 * Lightweight Telemetry / Visitor Tracking Interface (No-op client side)
 */

export interface VisitorActionLog {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  details?: string;
}

export function trackVisitorAction(
  _action?: string,
  _details?: string,
  _category?: string
): void {
  // Zero-overhead no-op for static SSG deployment
}
