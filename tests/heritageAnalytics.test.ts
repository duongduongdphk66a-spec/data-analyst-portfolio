import { describe, it, expect } from 'vitest';
import {
  cagr,
  seriesCagr,
  pearson,
  logLinearTrend,
  fmtPct,
  fmtNum,
  valueAt,
  yoy,
} from '../app/lib/heritageAnalytics';

describe('heritageAnalytics module', () => {
  it('calculates CAGR accurately', () => {
    // 100 to 200 in 1 year = 100%
    expect(cagr(100, 200, 1)).toBeCloseTo(1.0, 4);
    // 100 to 200 in 2 years = sqrt(2) - 1 ~ 41.42%
    expect(cagr(100, 200, 2)).toBeCloseTo(0.41421, 4);
    // Invalid inputs
    expect(Number.isNaN(cagr(0, 100, 2))).toBe(true);
    expect(Number.isNaN(cagr(100, 200, 0))).toBe(true);
  });

  it('computes seriesCagr and valueAt on time-series', () => {
    const series = [
      { year: '2013', value: 10.36 },
      { year: '2019', value: 31.88 },
    ];
    expect(valueAt(series, '2013')).toBe(10.36);
    expect(valueAt(series, '2099')).toBeNull();

    // 6-year period 2013-2019: (31.88 / 10.36)^(1/6) - 1 ~ 20.6%
    const cagrVal = seriesCagr(series, '2013', '2019');
    expect(cagrVal).toBeCloseTo(0.206, 2);
  });

  it('computes YoY growth correctly', () => {
    const series = [
      { year: '2018', value: 31.19 },
      { year: '2019', value: 31.88 },
      { year: '2020', value: 4.12 },
    ];
    const res = yoy(series);
    expect(res[0].growth).toBeNull();
    expect(res[1].growth).toBeCloseTo(0.0221, 3); // +2.2%
    expect(res[2].growth).toBeCloseTo(-0.8708, 3); // -87.1%
  });

  it('calculates Pearson correlation coefficient', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [2, 4, 6, 8, 10]; // perfectly collinear
    expect(pearson(xs, ys)).toBeCloseTo(1.0, 4);

    const antiYs = [10, 8, 6, 4, 2];
    expect(pearson(xs, antiYs)).toBeCloseTo(-1.0, 4);
  });

  it('fits log-linear counterfactual trend', () => {
    // 5% steady growth
    const series = [
      { year: '2003', value: 5.21 },
      { year: '2004', value: 5.47 },
      { year: '2005', value: 5.74 },
      { year: '2006', value: 6.03 },
      { year: '2007', value: 6.33 },
    ];
    const model = logLinearTrend(series, '2003', '2007');
    expect(model.annualGrowth).toBeCloseTo(0.05, 2);
    expect(model.predict(2003)).toBeCloseTo(5.21, 1);
  });

  it('formats numbers and percentages properly', () => {
    expect(fmtPct(0.2056, 1, true)).toBe('20.6%');
    expect(fmtPct(0.2056, 1, false)).toBe('20,6%');
    expect(fmtNum(1234.56, 1, true)).toBe('1,234.6');
  });
});
