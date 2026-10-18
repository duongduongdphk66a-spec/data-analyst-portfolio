import { describe, it, expect } from 'vitest';
import { HERITAGE_JAPAN_DATA } from '../app/data/heritageJapanData';

describe('Heritage Japan Case Study Restructuring & Quality Standards', () => {
  it('should define core metadata, kpis, policy pillars, and limitations', () => {
    expect(HERITAGE_JAPAN_DATA.meta).toBeDefined();
    expect(HERITAGE_JAPAN_DATA.kpis).toBeDefined();
    expect(HERITAGE_JAPAN_DATA.policyPillars).toBeDefined();
    expect(HERITAGE_JAPAN_DATA.thesisLimitations).toBeDefined();
  });

  it('should have exactly 4 prominent KPI cards with correct metrics', () => {
    expect(HERITAGE_JAPAN_DATA.kpis).toHaveLength(4);
    expect(HERITAGE_JAPAN_DATA.kpis[0].value).toBe('31,9M');
    expect(HERITAGE_JAPAN_DATA.kpis[1].value).toBe('4,81 nghìn tỷ ¥');
    expect(HERITAGE_JAPAN_DATA.kpis[2].value).toBe('7,5% GDP');
    expect(HERITAGE_JAPAN_DATA.kpis[3].value).toBe('3.000 : 1');
  });

  it('should contain all 12 datasets for the 12 interactive charts', () => {
    // Chart 1: Japan visitors (2003-2022)
    expect(HERITAGE_JAPAN_DATA.japanVisitors.length).toBeGreaterThanOrEqual(20);
    // Chart 2: Japan spending (2010-2021)
    expect(HERITAGE_JAPAN_DATA.japanSpending.length).toBeGreaterThanOrEqual(12);
    // Chart 3: Indexed growth (2013-2019)
    expect(HERITAGE_JAPAN_DATA.indexedGrowth2013To2019).toHaveLength(7);
    // Chart 4: Global benchmarks
    expect(HERITAGE_JAPAN_DATA.globalBenchmarks).toHaveLength(4);
    // Chart 5: Kyoto visitors
    expect(HERITAGE_JAPAN_DATA.kyotoVisitors.length).toBeGreaterThanOrEqual(16);
    // Chart 6: Nara visitors
    expect(HERITAGE_JAPAN_DATA.naraVisitors.length).toBeGreaterThanOrEqual(12);
    // Chart 7: Spending Kyoto & Nara
    expect(HERITAGE_JAPAN_DATA.kyotoSpending.length).toBeGreaterThanOrEqual(10);
    expect(HERITAGE_JAPAN_DATA.naraSpending.length).toBeGreaterThanOrEqual(10);
    // Chart 8: Visitor mix 2017
    expect(HERITAGE_JAPAN_DATA.visitorMix2017).toHaveLength(3);
    // Chart 9: Kyoto supply demand mismatch
    expect(HERITAGE_JAPAN_DATA.kyotoSupplyDemandMismatch.visitors2019).toBe(4.5);
    // Chart 10: Economic share comparison
    expect(HERITAGE_JAPAN_DATA.economicShareComparison.length).toBeGreaterThanOrEqual(7);
    // Chart 11: Overtourism hotspots
    expect(HERITAGE_JAPAN_DATA.overtourismHotspots).toHaveLength(5);
    // Chart 12: Sustainability scores
    expect(HERITAGE_JAPAN_DATA.sustainabilityScores).toHaveLength(5);
  });

  it('should contain exactly 5 case study matrix items in Chapter 3.2', () => {
    expect(HERITAGE_JAPAN_DATA.caseStudies).toHaveLength(5);
    const sites = HERITAGE_JAPAN_DATA.caseStudies.map((c) => c.site);
    expect(sites).toContain('Cố đô Kyoto');
    expect(sites).toContain('Cố đô Nara');
    expect(sites).toContain('Núi Phú Sĩ (Fuji)');
    expect(sites).toContain('Làng cổ Shirakawa-go & Gokayama');
    expect(sites).toContain('Đền Itsukushima (Đảo Miyajima)');
  });

  it('should document exactly 5 academic limitations & governance fixes in Data Audit', () => {
    expect(HERITAGE_JAPAN_DATA.thesisLimitations).toHaveLength(5);
    const ids = HERITAGE_JAPAN_DATA.thesisLimitations.map((l) => l.id);
    expect(ids).toEqual(['LIM-01', 'LIM-02', 'LIM-03', 'LIM-04', 'LIM-05']);
  });

  it('should maintain concise UI text strictly under 1,000 words', () => {
    const rawText = [
      HERITAGE_JAPAN_DATA.meta.title,
      HERITAGE_JAPAN_DATA.meta.subtitle,
      ...HERITAGE_JAPAN_DATA.kpis.map((k) => `${k.label} ${k.value} ${k.delta} ${k.desc}`),
      ...HERITAGE_JAPAN_DATA.policyPillars.map((p) => `${p.name} ${p.focus} ${p.highlights.join(' ')}`),
      ...HERITAGE_JAPAN_DATA.caseStudies.map((c) => `${c.site} ${c.prefecture} ${c.pressureMetric} ${c.coreIssue} ${c.intervention}`),
      ...HERITAGE_JAPAN_DATA.thesisLimitations.map((l) => `${l.category} ${l.flawInThesis} ${l.portfolioFix}`),
    ].join(' ');

    const words = rawText.trim().split(/\s+/).filter(Boolean).length;
    // Target is < 850 words, strictly < 1000 words
    expect(words).toBeLessThan(1000);
    expect(words).toBeGreaterThan(450);
  });
});
