'use client';

import { ArrowLeft } from 'lucide-react';

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-ink-secondary font-heading font-bold text-sm hover:bg-surface-tint transition duration-300 cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      Quay Lại
    </button>
  );
}
