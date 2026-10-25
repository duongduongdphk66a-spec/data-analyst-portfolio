/**
 * Heritage Japan: pure analytics helpers.
 * All functions are deterministic and side-effect free so every number shown
 * on the case-study page can be reproduced (and unit-tested).
 */

export interface YearValue {
  year: string;
  value: number | null;
}

/** Look up a value by year; returns null when absent. */
export function valueAt(series: YearValue[], year: string): number | null {
  const point = series.find((p) => p.year === year);
  return point && point.value !== null ? point.value : null;
}

/** Compound annual growth rate between two values over `years` periods. */
export function cagr(start: number, end: number, years: number): number {
  if (start <= 0 || years <= 0) return NaN;
  return Math.pow(end / start, 1 / years) - 1;
}

/** CAGR between two calendar years of a series. */
export function seriesCagr(series: YearValue[], fromYear: string, toYear: string): number {
  const a = valueAt(series, fromYear);
  const b = valueAt(series, toYear);
  if (a === null || b === null) return NaN;
  return cagr(a, b, Number(toYear) - Number(fromYear));
}

/** Year-over-year growth for consecutive observed years. */
export function yoy(series: YearValue[]): Array<{ year: string; growth: number | null }> {
  return series.map((p, i) => {
    if (i === 0) return { year: p.year, growth: null };
    const prev = series[i - 1];
    const consecutive = Number(p.year) - Number(prev.year) === 1;
    if (!consecutive || p.value === null || prev.value === null || prev.value === 0) {
      return { year: p.year, growth: null };
    }
    return { year: p.year, growth: p.value / prev.value - 1 };
  });
}

/** Pearson correlation coefficient. */
export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return NaN;
  const mx = xs.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const my = ys.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return num / Math.sqrt(dx * dy);
}

/** Pair two series on common years where both values exist. */
export function joinOnYear(a: YearValue[], b: YearValue[], from?: string, to?: string) {
  return a
    .filter((p) => (!from || p.year >= from) && (!to || p.year <= to))
    .map((p) => ({ year: p.year, a: p.value, b: valueAt(b, p.year) }))
    .filter((r): r is { year: string; a: number; b: number } => r.a !== null && r.b !== null);
}

/**
 * Fit a log-linear trend y = exp(alpha + beta * t) on a training window
 * and project it forward. Used as a naive counterfactual
 * ("what if the pre-2013 trend had simply continued?").
 */
export function logLinearTrend(series: YearValue[], trainFrom: string, trainTo: string) {
  const train = series.filter(
    (p): p is { year: string; value: number } =>
      p.year >= trainFrom && p.year <= trainTo && p.value !== null && p.value > 0
  );
  const n = train.length;
  const ts = train.map((p) => Number(p.year));
  const ls = train.map((p) => Math.log(p.value));
  const mt = ts.reduce((s, v) => s + v, 0) / n;
  const ml = ls.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (ts[i] - mt) * (ls[i] - ml);
    den += (ts[i] - mt) ** 2;
  }
  const beta = num / den;
  const alpha = ml - beta * mt;
  return {
    annualGrowth: Math.exp(beta) - 1,
    predict: (year: number) => Math.exp(alpha + beta * year),
  };
}

/** Format helpers (vi-VN uses comma decimals). */
export function fmtPct(v: number, digits = 1, isEn = false): string {
  if (!Number.isFinite(v)) return '-';
  const s = (v * 100).toFixed(digits);
  return `${isEn ? s : s.replace('.', ',')}%`;
}

export function fmtNum(v: number, digits = 1, isEn = false): string {
  if (!Number.isFinite(v)) return '-';
  return v.toLocaleString(isEn ? 'en-US' : 'vi-VN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
