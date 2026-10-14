import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bỏ qua hoàn toàn các file HTML tĩnh trong /library-bus/ để không chặn inline script
  if (pathname.startsWith('/library-bus/') && pathname.endsWith('.html')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // 2. CSP chuẩn cho Next.js App Router: không chặn Next.js preload chunks & giữ tương thích tĩnh
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: ws: wss:",
    "frame-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ].join('; ');

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

