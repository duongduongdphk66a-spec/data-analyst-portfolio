'use client';

import React from 'react';
import Link from 'next/link';
import { Presentation, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter3DeckEmbedProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter3DeckEmbed({ isEn = false, onCopyDeepLink = () => {} }: Chapter3DeckEmbedProps) {
  return (
    <section id="sec-deck" className="space-y-6 scroll-mt-36">
      <SectionHeader
        variant="chapter"
        id="sec-deck"
        chapter="CHAPTER 03"
        subtitle={isEn ? 'UX/UI design guidelines deck' : 'Bản trình chiếu thiết kế UX/UI'}
        badge="3.4"
        title={isEn ? 'Presentation Deck (30 Slides)' : 'Bản Trình Chiếu (30 Slide)'}
        onCopy={onCopyDeepLink}
      />
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="w-11 h-11 rounded-2xl bg-[#C8EEF7]/50 text-[#0D7287] flex items-center justify-center shrink-0">
            <Presentation className="w-6 h-6" />
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed dark:text-slate-300">
            {isEn
              ? 'The deck follows the same structure as this case study: introduction and BA/UX research, logo and UI components, and website design with paired Wireframes and UI for the 11 core screens (Desktop & Mobile).'
              : 'Bản trình chiếu đi theo cùng cấu trúc với nghiên cứu này: giới thiệu và phân tích BA/UX, logo và thành phần giao diện, thiết kế website với cặp Wireframe và UI của 11 màn hình cốt lõi (Desktop & Mobile).'}
          </p>
        </div>
        <Link
          href="/projects/library-bus/presentation"
          className="btn-secondary-editorial flex items-center gap-2.5 shrink-0 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold min-h-[44px] border border-slate-300 dark:border-slate-700 hover:border-[#0D7287]"
        >
          <span>{isEn ? 'Open the deck' : 'Mở bản trình chiếu'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default Chapter3DeckEmbed;
