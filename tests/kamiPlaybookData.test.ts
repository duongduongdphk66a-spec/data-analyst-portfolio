import { describe, it, expect } from 'vitest';
import metricsJson from '../app/data/kami-ely/generated/metrics.json';
import metricsV2Json from '../app/data/kami-ely/generated/metrics_v2.json';

describe('Kami Ely SSOT (metrics_v2.json) Data Integrity', () => {
  const v2 = metricsV2Json;

  it('khớp tổng 10 bảng nguồn hợp nhất (23.364 dòng, 231 ngày) và đồng bộ với metrics.json', () => {
    expect(metricsJson.v2).toEqual(metricsV2Json);
    expect(v2.meta.totalFiles).toBe(10);
    expect(v2.meta.totalRawRows).toBe(23364);
    expect(v2.meta.days).toBe(231);
  });

  it('bảo toàn các chỉ số KPI cốt lõi Chương 0 và bẫy cộng đôi Chương 1', () => {
    expect(v2.ch0.kpis.gmvB).toBeCloseTo(15.01, 2);
    expect(v2.ch0.kpis.unitsSold).toBe(101896);
    expect(v2.ch0.kpis.aspVnd).toBe(147298);
    expect(v2.ch0.kpis.junToAugDropPct).toBeCloseTo(-83.1, 1);
    expect(v2.ch0.kpis.peak7dSharePct).toBeCloseTo(7.3, 1);

    expect(v2.ch1.doubleCountTrap.naiveSumB).toBeCloseTo(18.06, 2);
    expect(v2.ch1.doubleCountTrap.overlapSessions).toBe(595);
    expect(v2.ch1.doubleCountTrap.daysExceedNaiveRaw).toBe(71);
    expect(v2.ch1.doubleCountTrap.daysExceedDedup).toBe(28);
    expect(v2.ch1.doubleCountTrap.weeksExceedDedup).toBe(4);
  });

  it('bảo toàn phân bổ kênh, mã SKU Pareto (không lỗi SKU_ fallback) và dải giá thực tế 95,4%', () => {
    expect(v2.ch2.channelMix.officialShareOfLivePct).toBeCloseTo(72.5, 1);
    expect(v2.ch2.channelMix.liveShareOfStorePct).toBeCloseTo(69.8, 1);
    expect(v2.ch2.skuPareto.totalSkus).toBe(339);
    expect(v2.ch2.skuPareto.activeSkus).toBe(133);
    expect(v2.ch2.skuPareto.skusFor80Pct).toBe(12);
    expect(v2.ch2.skuPareto.zeroLaunchPre2026).toBe(204);

    // Top 10 SKU Pareto must resolve clean codes (no SKU_x regex fallback)
    const top10Codes = v2.ch2.skuPareto.curve.slice(1, 11).map((x) => x.skuCode);
    expect(top10Codes).toEqual([
      'AT06',
      'CV11',
      'CV02',
      'H36',
      'H32',
      'SW01',
      'H31',
      'AG01',
      'M18',
      'SW08',
    ]);

    // Realized ASP 75k-250k share must equal 95.4% (75.4 + 20.0)
    const midBandGmvPct = v2.ch2.skuPareto.priceBandsRealizedAsp
      .filter((b) => b.band === '75k-150k' || b.band === '150k-250k')
      .reduce((s, b) => s + b.gmvSharePct, 0);
    expect(midBandGmvPct).toBeCloseTo(95.4, 1);
  });

  it('bảo toàn chuyển giao mùa vụ 10 SKU, tỷ trọng AT06 T10 (80,5%) và chuỗi 33 tuần', () => {
    expect(v2.ch3.weekly).toHaveLength(33);
    expect(v2.ch3.sku10Summary.junSummerSharePct).toBeCloseTo(91.2, 1);
    expect(v2.ch3.sku10Summary.octWinterSharePct).toBeCloseTo(98.3, 1);
    expect(v2.ch3.peakZScores.trailing28Excl).toBeCloseTo(6.81, 2);
    expect(v2.ch3.dowIndex[3].meanIndex).toBeCloseTo(112.6, 1);

    const octRow = v2.ch3.skuMonthlySeries.find((m) => m.month === '2026-10');
    expect(octRow?.storeMonthGmvM).toBeCloseTo(1616.9, 1);
    expect(octRow?.at06ShareOfStoreMonthPct).toBeCloseTo(80.5, 1);
  });

  it('bảo toàn Cohort 302 KOC, kiểm định 6 lát cắt Video Ads, LiveProd và 9 Quality Gates', () => {
    expect(v2.ch4.survival.totalKocs).toBe(302);
    expect(v2.ch4.survival.totalSessions).toBe(7760);
    expect(v2.ch4.survival.medianSpanFirstOrderDays).toBe(9);
    expect(v2.ch4.survival.medianSpanFirstZeroDays).toBe(13);
    expect(v2.ch4.survival.first3ZeroNeverConvertPct).toBeCloseTo(77.2, 1);

    expect(v2.ch5.videoForestSlices).toHaveLength(6);
    expect(v2.ch5.videoForestSlices[0].oddsRatio).toBeCloseTo(3.8, 1);
    expect(v2.ch5.videoForestSlices[0].gpmRatio).toBeCloseTo(0.84, 2);
    expect(v2.ch5.pinnedAnalysis.spearmanRho).toBeCloseTo(0.339, 3);
    expect(v2.ch5.pinnedAnalysis.topLiveProds.map((p) => p.code)).toEqual([
      'SW01',
      'M03',
      'A01',
      'H13',
      'A03',
      'H26',
      'CV11',
      'H05',
    ]);

    expect(v2.ch6.maCrossovers).toHaveLength(4);
    expect(v2.appendix.qualityGates).toHaveLength(9);
    expect(v2.appendix.qualityGates.every((g) => g.status === 'PASS')).toBe(true);
  });

  it('không rò rỉ tài khoản creator gốc dạng plaintext trong JSON công khai', () => {
    const serialized = JSON.stringify(v2).toLowerCase();
    const forbidden = [
      '@kami_official',
      Buffer.from('a2FtaWVseWhu', 'base64').toString('utf8'),
      Buffer.from('Z2lybHN0eWxl', 'base64').toString('utf8'),
    ];
    for (const token of forbidden) {
      expect(serialized).not.toContain(token);
    }
  });
});
