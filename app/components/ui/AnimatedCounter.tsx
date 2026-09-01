'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

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

  useGSAP(() => {
    if (!spanRef.current) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spanRef.current.innerText = `${prefix}${numericVal.toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;
      return;
    }

    const counterObj = { val: 0 };

    const updateText = () => {
      if (spanRef.current) {
        const formattedNum = counterObj.val.toLocaleString('vi-VN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        spanRef.current.innerText = `${prefix}${formattedNum}${suffix}`;
      }
    };

    gsap.to(counterObj, {
      val: numericVal,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: updateText,
    });
  }, { scope: spanRef, dependencies: [numericVal, prefix, suffix, decimals, duration, delay] });

  return (
    <span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
