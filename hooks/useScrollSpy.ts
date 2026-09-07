'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

export interface UseScrollSpyReturn {
  activeSection: string;
  scrollProgress: number;
  setActiveSection: (_id: string) => void;
}

/**
 * useScrollSpy
 * Theo dõi vị trí cuộn trang để xác định mục (section) đang hiển thị trong viewport và tính % tiến độ đọc.
 * Tương thích cả window và container cuộn con (main.overflow-y-auto).
 * 
 * @param sectionIds Danh sách ID các thẻ section cần theo dõi
 * @param offset Khoảng đệm đỉnh (px) để kích hoạt chuyển đổi section
 */
export function useScrollSpy(sectionIds: string[], offset = 120): UseScrollSpyReturn {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionIdsKey = useMemo(() => sectionIds.join(','), [sectionIds]);
  const isNavigatingRef = useRef<boolean>(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derive effective active section: if current activeSection is not in sectionIds, fallback to first id
  const effectiveActiveSection = useMemo(() => {
    const ids = sectionIdsKey.split(',').filter(Boolean);
    if (ids.length > 0 && !ids.includes(activeSection)) {
      return ids[0];
    }
    return activeSection;
  }, [sectionIdsKey, activeSection]);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionIdsKey) return;

    const ids = sectionIdsKey.split(',').filter(Boolean);
    if (!ids.length) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const readingLine = Math.min(380, Math.max(200, window.innerHeight * 0.42));
        let current = '';

        for (const id of ids) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= readingLine) {
              current = id;
            }
          }
        }

        const scrollContainer = (document.querySelector('main.overflow-y-auto') || document.querySelector('main')) as HTMLElement | null;
        const totalScroll = scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight
          ? (scrollContainer.scrollHeight - scrollContainer.clientHeight)
          : (document.documentElement.scrollHeight - window.innerHeight);
        const currentScroll = scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight
          ? scrollContainer.scrollTop
          : window.scrollY;

        // Bottom detection
        const isAtBottom = scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight
          ? (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 150)
          : (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150);

        if (!isNavigatingRef.current) {
          if (isAtBottom && ids.length > 0) {
            current = ids[ids.length - 1];
          } else if (currentScroll <= offset && ids.length > 0) {
            current = ids[0];
          }

          if (current) {
            setActiveSection(current);
          }
        }

        if (totalScroll > 0) {
          setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
        }

        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    const attachedContainers: HTMLElement[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      let p = el?.parentElement;
      while (p && p !== document.body && p !== document.documentElement) {
        const style = window.getComputedStyle(p);
        if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && !attachedContainers.includes(p)) {
          attachedContainers.push(p);
          p.addEventListener('scroll', handleScroll, { passive: true });
        }
        p = p.parentElement;
      }
    });

    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (isNavigatingRef.current) return;
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isNavigatingRef.current) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: `-${Math.max(0, offset)}px 0px -40% 0px`, threshold: [0, 0.2] }
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer?.observe(el);
      });
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true } as EventListenerOptions);
      attachedContainers.forEach((c) => c.removeEventListener('scroll', handleScroll));
      if (observer) observer.disconnect();
    };
  }, [sectionIdsKey, offset]);

  const setManualActiveSection = (id: string) => {
    isNavigatingRef.current = true;
    setActiveSection(id);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 850);
  };

  return { activeSection: effectiveActiveSection, scrollProgress, setActiveSection: setManualActiveSection };
}

export default useScrollSpy;
