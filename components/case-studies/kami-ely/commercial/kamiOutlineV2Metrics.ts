import metricsV2Json from '@/app/data/kami-ely/generated/metrics_v2.json';

/**
 * Official 4-Color Brand Palette + Accessible Contrast Pairs
 * Primary Cyan: #9BE7FA | Ice Light Tint: #C8EEF7 | Soft Butter Gold: #FFE485 | Amber Gold: #FFD14C
 */
export const KAMI_BRAND_PALETTE = {
  cyan: '#9BE7FA',
  ice: '#C8EEF7',
  butter: '#FFE485',
  amber: '#FFD14C',
  // High-contrast ink & stroke companions for white/light chart surfaces (WCAG AA >= 4.5:1)
  tealInk: '#0D7287',
  deepInk: '#074553',
  amberStroke: '#D97706',
  slateLine: '#94A3B8',
  slateMuted: '#CBD5E1',
  slateDark: '#475569',
  // Semantic delta indicators per AGENTS.md
  positive: '#059669',
  negative: '#E11D48',
} as const;

export const V2 = metricsV2Json;
export type KamiOutlineV2Data = typeof V2;

