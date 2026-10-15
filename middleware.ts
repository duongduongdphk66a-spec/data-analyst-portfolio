import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bỏ qua hoàn toàn các file HTML tĩnh trong /library-bus/ để không chặn inline script & sơ đồ tương tác
  if (pathname.startsWith('/library-bus/') || pathname.endsWith('.html')) {
    return NextResponse.next();
  }

  // 2. Tạo nonce ngẫu nhiên bảo mật cao cho mỗi request
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const isDev = process.env.NODE_ENV === 'development';

  // 3. CSP nghiêm ngặt chuẩn OWASP / Next.js App Router (Không dùng unsafe-eval hay wildcard https: đại trà)
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.githubusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' ${isDev ? 'ws: wss:' : ''}`,
    "frame-src 'self' https://*.google.com https://lookerstudio.google.com https://public.tableau.com https://*.powerbi.com https://*.youtube.com https://*.loom.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ]
    .filter(Boolean)
    .join('; ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Truyền nonce qua request headers để layout.tsx và Server Components đọc được qua headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  return response;
}

export const config = {
  matcher: [
    // Loại trừ _next/static, _next/image, favicon, file ảnh/pdf và toàn bộ file .html tĩnh
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|html)$).*)'
  ]
};

