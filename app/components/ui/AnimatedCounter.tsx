'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
  triggerOnScroll?: boolean;
}

export default function AnimatedCounter({
  value,
  duration = 1.2,
  delay = 0,
  className = '',
  triggerOnScroll = true,
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  // Parse string value into prefix, numeric target, suffix, and decimal precision
  const { prefix, numericVal, suffix, decimals } = React.useMemo(() => {
    if (typeof value === 'number') {
      return {
        prefix: '',
        numericVal: value,
        suffix: '',
        decimals: Number.isInteger(value) ? 0 : 1,
      };
    }

    const str = String(value).trim();
    // Match prefix (e.g. $, ~), numeric part (including . or ,), and suffix (e.g. %, +, Tỷ, B)
    const match = str.match(/^([^0-9.-]*)([0-9]+(?:[.,][0-9]+)?)(.*)$/);

    if (!match) {
      return { prefix: '', numericVal: 0, suffix: str, decimals: 0 };
    }

    const rawPrefix = match[1] || '';
    const numStr = match[2].replace(',', '.');
    const rawSuffix = match[3] || '';
    const parsedNum = parseFloat(numStr) || 0;
    const decimalPart = numStr.split('.')[1];
    const dec = decimalPart ? decimalPart.length : 0;

    return {
      prefix: rawPrefix,
      numericVal: parsedNum,
      suffix: rawSuffix,
      decimals: dec,
    };
  }, [value]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerText = `${prefix}${numericVal.toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;
      return;
    }

    let tween: gsap.core.Tween | null = null;

    const startAnimation = () => {
      const counterObj = { val: 0 };

      const updateText = () => {
        if (el) {
          const formattedNum = counterObj.val.toLocaleString('vi-VN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
          el.innerText = `${prefix}${formattedNum}${suffix}`;
        }
      };

      if (tween) tween.kill();
      tween = gsap.to(counterObj, {
        val: numericVal,
        duration,
        delay,
        ease: 'power2.out',
        onUpdate: updateText,
      });
    };

    if (!triggerOnScroll) {
      startAnimation();
      return () => {
        if (tween) tween.kill();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (tween) tween.kill();
    };
  }, [numericVal, prefix, suffix, decimals, duration, delay, triggerOnScroll]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {numericVal.toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
