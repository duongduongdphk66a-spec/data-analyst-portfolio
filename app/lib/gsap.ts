'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  try {
    gsap.registerPlugin(useGSAP);
  } catch (e) {
    console.warn('[GSAP] Plugin registration error:', e);
  }
}

export { gsap, useGSAP };
