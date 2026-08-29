'use client';

import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds: string[], offset: number = 100): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionIds.length) return;

    // 1. IntersectionObserver to detect visible section in viewport (works inside any scroll container)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-15% 0px -65% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 2. Capture-phase scroll listener to catch events from <main overflow-y-auto> or window
    const handleScroll = (e: Event) => {
      const target = e.target;
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (!target || target === document || target === document.documentElement) {
        scrollTop = window.scrollY;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      } else if (target instanceof HTMLElement) {
        scrollTop = target.scrollTop;
        scrollHeight = target.scrollHeight;
        clientHeight = target.clientHeight;
      }

      // If scrolled near top
      if (scrollTop <= 80) {
        setActiveSection(sectionIds[0]);
        return;
      }

      // If scrolled near bottom
      if (scrollHeight > 0 && scrollTop + clientHeight >= scrollHeight - 60) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [sectionIds, offset]);

  return activeSection;
}
