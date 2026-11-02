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
import metricsJson from '../app/data/kami-ely/generated/metrics.json';
import metricsV2Json from '../app/data/kami-ely/generated/metrics_v2.json';

describe('Kami Ely playbook data', () => {
  it('khớp tổng 10 bảng nguồn hợp nhất (23.364 dòng)', () => {
    expect(tableRows).toHaveLength(10);
    expect(totalRows).toBe(23364);
  });

  it('trung bình trượt 7 ngày chỉ có giá trị khi đủ cửa sổ', () => {
    expect(dailySeries).toHaveLength(231);
    expect(dailySeries.slice(0, 6).every((d) => d.ma7 === null)).toBe(true);
    expect(dailySeries[6].ma7).not.toBeNull();
  });

  it('GMV lũy kế ngày cuối bằng tổng GMV 231 ngày', () => {
    const last = dailySeries[dailySeries.length - 1];
    expect(last.cumulativeB).toBeCloseTo(storeFacts.gmv / 1e9, 1);
  });

  it('z-score tái tạo đúng ngày ngoại lai 16/06', () => {
    expect(outlierDays.length).toBeGreaterThanOrEqual(1);
    expect(outlierDays[0].date).toBe('2026-06-16');
    expect(outlierDays[0].z).toBeCloseTo(5.83, 1);
    expect(robustZ(storeFacts.peakDay.gmv)).toBeCloseTo(5.8, 1);
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

  it('10 mẫu mod 10 phủ đủ 231 ngày', () => {
    expect(modSamples).toHaveLength(10);
    expect(modSamples.reduce((s, x) => s + x.n, 0)).toBe(231);
  });

  it('Outline v2 SSOT (metrics_v2.json) bảo toàn các chỉ số kiểm toán từ 10 tệp Excel', () => {
    const v2 = metricsV2Json;
    expect(metricsJson.v2).toEqual(metricsV2Json);
    expect(v2.meta.totalFiles).toBe(10);
    expect(v2.meta.totalRawRows).toBe(23364);
    expect(v2.meta.days).toBe(231);

    // Ch 0 KPIs
    expect(v2.ch0.kpis.gmvB).toBeCloseTo(15.01, 2);
    expect(v2.ch0.kpis.unitsSold).toBe(101896);
    expect(v2.ch0.kpis.aspVnd).toBe(147298);
    expect(v2.ch0.kpis.junToAugDropPct).toBeCloseTo(-83.1, 1);
    expect(v2.ch0.kpis.peak7dSharePct).toBeCloseTo(7.3, 1);

    // Ch 1 Double-counting trap
    expect(v2.ch1.doubleCountTrap.naiveSumB).toBeCloseTo(18.06, 2);
    expect(v2.ch1.doubleCountTrap.overlapSessions).toBe(595);
    expect(v2.ch1.doubleCountTrap.daysExceedNaiveRaw).toBe(71);
    expect(v2.ch1.doubleCountTrap.daysExceedDedup).toBe(28);
    expect(v2.ch1.doubleCountTrap.weeksExceedDedup).toBe(4);

    // Ch 2 Channel mix & SKU Pareto
    expect(v2.ch2.channelMix.officialShareOfLivePct).toBeCloseTo(72.5, 1);
    expect(v2.ch2.channelMix.liveShareOfStorePct).toBeCloseTo(69.8, 1);
    expect(v2.ch2.skuPareto.totalSkus).toBe(339);
    expect(v2.ch2.skuPareto.activeSkus).toBe(133);
    expect(v2.ch2.skuPareto.skusFor80Pct).toBe(12);
    expect(v2.ch2.skuPareto.zeroLaunchPre2026).toBe(204);

    // Ch 4 KOC Cohorts & Survival
    expect(v2.ch4.survival.totalKocs).toBe(302);
    expect(v2.ch4.survival.totalSessions).toBe(7760);
    expect(v2.ch4.survival.medianSpanFirstOrderDays).toBe(9);
    expect(v2.ch4.survival.medianSpanFirstZeroDays).toBe(13);
    expect(v2.ch4.survival.first3ZeroNeverConvertPct).toBeCloseTo(77.2, 1);

    // Ch 5 & Ch 6 & Appendix
    expect(v2.ch3.sku10Summary.junSummerSharePct).toBeCloseTo(90.9, 1);
    expect(v2.ch3.sku10Summary.octWinterSharePct).toBeCloseTo(98.4, 1);
    expect(v2.ch3.peakZScores.trailing28Excl).toBeCloseTo(6.81, 2);
    expect(v2.ch3.dowIndex[3].meanIndex).toBeCloseTo(112.6, 1);
    expect(v2.ch5.videoForestSlices).toHaveLength(6);
    expect(v2.ch5.videoForestSlices[0].oddsRatio).toBeCloseTo(3.8, 1);
    expect(v2.ch5.videoForestSlices[0].gpmRatio).toBeCloseTo(0.84, 2);
    expect(v2.ch6.maCrossovers).toHaveLength(4);
    expect(v2.appendix.qualityGates).toHaveLength(9);
    expect(v2.appendix.qualityGates.every((g) => g.status === 'PASS')).toBe(true);
  });
});
