import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import GoBackButton from '@/components/ui/GoBackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ground flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Visual */}
        <div className="relative">
          <div className="text-[120px] sm:text-[160px] font-heading font-black text-brand-primary/15 dark:text-brand-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D7287] to-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Search className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink">
            Trang Không Tồn Tại
          </h1>
          <p className="text-ink-muted text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc chưa từng tồn tại.
            Hãy quay lại trang chủ để tiếp tục khám phá portfolio.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0D7287] to-[#0A5F70] text-white font-heading font-bold text-sm hover:shadow-lg hover:shadow-[#0D7287]/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </Link>
          <GoBackButton />
        </div>

        {/* Decorative Bottom */}
        <div className="pt-6">
          <p className="text-xs font-mono text-ink-muted/60">
            ERROR_CODE: 404 · PAGE_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
}
