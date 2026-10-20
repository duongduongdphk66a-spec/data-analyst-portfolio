'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Portfolio Error]', error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-ground flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Error Visual */}
        <div className="relative">
          <div className="text-[100px] sm:text-[140px] font-heading font-black text-red-500/10 dark:text-red-400/10 leading-none select-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-red-500">
              <AlertTriangle className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink">
            Đã Xảy Ra Lỗi
          </h1>
          <p className="text-ink-muted text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Hệ thống gặp sự cố khi xử lý yêu cầu của bạn.
            Vui lòng thử lại hoặc quay về trang chủ.
          </p>
          {error.digest && (
            <p className="text-xs tabular-nums text-ink-muted/50 mt-2">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-heading font-bold text-sm transition duration-300 hover:-translate-y-0.5 cursor-pointer bg-[#0D7287]"
          >
            <RefreshCw className="w-4 h-4" />
            Thử Lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-ink-secondary font-heading font-bold text-sm hover:bg-surface-tint transition duration-300"
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </Link>
        </div>

        {/* Decorative Bottom */}
        <div className="pt-6">
          <p className="text-xs tabular-nums text-ink-muted/60">
            ERROR_CODE: 500 · INTERNAL_ERROR
          </p>
        </div>
      </div>
    </div>
  );
}
