import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin CMS',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-dvh text-slate-900 dark:text-slate-100 font-sans">
      {children}
    </div>
  );
}
