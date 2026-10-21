import { describe, it, expect } from 'vitest';
import {
  K_MIN,
  dailySeries,
  funnels,
  kAnonymity,
  modSamples,
  outlierDays,
  percentile,
  robustZ,
  storeFacts,
  tableRows,
  totalRows,
  treatmentComparison,
  winsorizeUpper,
  zScoreSeries,
} from '../components/case-studies/kami-ely/playbook/playbookData';

describe('Kami Ely playbook data', () => {
  it('khớp tổng các bảng nguồn hợp nhất', () => {
    expect(tableRows).toHaveLength(9);
    expect(totalRows).toBe(21568);
  });

  it('trung bình trượt 7 ngày chỉ có giá trị khi đủ cửa sổ', () => {
    expect(dailySeries).toHaveLength(226);
    expect(dailySeries.slice(0, 6).every((d) => d.ma7 === null)).toBe(true);
    expect(dailySeries[6].ma7).not.toBeNull();
  });

  it('GMV lũy kế ngày cuối bằng tổng GMV 226 ngày', () => {
    const last = dailySeries[dailySeries.length - 1];
    expect(last.cumulativeB).toBeCloseTo(storeFacts.gmv / 1e9, 1);
  });

  it('z-score tái tạo đúng ngày ngoại lai 16/06', () => {
    expect(outlierDays.length).toBeGreaterThanOrEqual(1);
    expect(outlierDays[0].date).toBe('2026-06-16');
    expect(outlierDays[0].z).toBeCloseTo(5.79, 1);
    expect(robustZ(storeFacts.peakDay.gmv)).toBeCloseTo(5.5, 1);
    expect(zScoreSeries.filter((d) => d.isOutlier)).toHaveLength(outlierDays.length);
  });

  it('percentile nội suy tuyến tính như PERCENTILE_CONT', () => {
    expect(percentile([1, 2, 3, 4], 0.5)).toBe(2.5);
    expect(percentile([10, 20, 30], 0)).toBe(10);
    expect(percentile([10, 20, 30], 1)).toBe(30);
  });

  it('winsorize chỉ cắt phía trên và giữ nguyên số phần tử', () => {
    const a = [1, 2, 3, 4, 100];
    const w = winsorizeUpper(a, 0.8);
    expect(w).toHaveLength(a.length);
    expect(Math.max(...w)).toBeLessThan(100);
    expect(w.slice(0, 3)).toEqual([1, 2, 3]);
  });

  it('loại outlier làm giảm độ lệch chuẩn nhiều hơn trung bình', () => {
    const [raw, dropped, p99, p95] = treatmentComparison;
    const meanDrop = (raw.mean - dropped.mean) / raw.mean;
    const stdDrop = (raw.std - dropped.std) / raw.std;
    expect(stdDrop).toBeGreaterThan(meanDrop);
    expect(p99.std).toBeLessThan(raw.std);
    expect(p95.std).toBeLessThan(p99.std);
  });

  it('phễu giảm dần qua từng bước', () => {
    for (const f of Object.values(funnels)) {
      for (let i = 1; i < f.steps.length; i++) {
        expect(f.steps[i].value).toBeLessThanOrEqual(f.steps[i - 1].value);
      }
    }
  });

  it('mọi nhóm creator vượt ngưỡng k', () => {
    expect(kAnonymity.every((k) => k.creators >= K_MIN && k.passes)).toBe(true);
  });

  it('10 mẫu mod 10 phủ đủ 226 ngày', () => {
    expect(modSamples).toHaveLength(10);
    expect(modSamples.reduce((s, x) => s + x.n, 0)).toBe(226);
  });
});
