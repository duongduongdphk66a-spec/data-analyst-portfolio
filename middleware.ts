import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = `
    default-src 'self';
    script-src 'self' https://unpkg.com ${isDev ? "'unsafe-eval' 'unsafe-inline'" : `'nonce-${nonce}' 'strict-dynamic'`};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
    img-src 'self' data: blob: https://images.unsplash.com https://*.githubusercontent.com https://avatars.githubusercontent.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' ${isDev ? 'ws: wss:' : ''};
    frame-src 'self' https://*.google.com https://lookerstudio.google.com https://public.tableau.com https://*.powerbi.com https://*.youtube.com https://*.loom.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
  `.replace(/\s{2,}/g, ' ').trim();
 
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);
 
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  response.headers.set('Content-Security-Policy', cspHeader);
 
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
