'use client';

import { useState, useEffect, useMemo } from 'react';

/**
 * useScrollSpy
 * Theo dõi vị trí cuộn trang để xác định mục (section) đang hiển thị trong viewport.
 * 
 * @param sectionIds Danh sách ID các thẻ section cần theo dõi
 * @param offset Khoảng đệm đỉnh (px) để kích hoạt chuyển đổi section
 */
export function useScrollSpy(sectionIds: string[], offset: number = 100): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  const sectionIdsKey = useMemo(() => sectionIds.join(','), [sectionIds]);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionIdsKey) return;

    const ids = sectionIdsKey.split(',').filter(Boolean);
    if (!ids.length) return;

    // 1. IntersectionObserver có rootMargin tính toán theo offset thực tế
    const topMargin = Math.max(0, offset);
    const bottomMargin = Math.max(150, offset * 2);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${topMargin}px 0px -${bottomMargin}px 0px`,
        threshold: [0, 0.2, 0.5],
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 2. Scroll listener cho các trường hợp container cuộn bên trong
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

      // Khi ở sát đầu trang (trong khoảng offset)
      if (scrollTop <= offset) {
        setActiveSection(ids[0]);
        return;
      }

      // Khi đã cuộn đến sát cuối trang
      if (scrollHeight > 0 && scrollTop + clientHeight >= scrollHeight - (offset / 2)) {
        setActiveSection(ids[ids.length - 1]);
        return;
      }
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [sectionIdsKey, offset]);

  return activeSection;
}
