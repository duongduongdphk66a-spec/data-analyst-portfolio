import { describe, it, expect } from 'vitest';
import { MINTO_NARRATIVE } from '../app/data/kami-ely/mintoNarrative';
import { translations } from '../app/data/translations';

describe('Minto Pyramid Restructuring for Kami Ely Case Study', () => {
  it('should define header, tab1, tab2, and tab3 in MINTO_NARRATIVE', () => {
    expect(MINTO_NARRATIVE.header).toBeDefined();
    expect(MINTO_NARRATIVE.tab1).toBeDefined();
    expect(MINTO_NARRATIVE.tab2).toBeDefined();
    expect(MINTO_NARRATIVE.tab3).toBeDefined();
  });

  it('should have exact 4 KPI items in the header strip (Biểu đồ #1)', () => {
    expect(MINTO_NARRATIVE.header.kpiStrip).toHaveLength(4);
    expect(MINTO_NARRATIVE.header.kpiStrip[0].value).toContain('12,74 Tỉ');
  });

  it('should cover all 22 numbered charts across the sections', () => {
    // Biểu đồ 1 & 2 in header
    expect(MINTO_NARRATIVE.header.telemetry.verifiedRate).toContain('100%');

    // Biểu đồ 3, 4 in tab1 sec1_1
    expect(MINTO_NARRATIVE.tab1.sec1_1.chart3.vi).toContain('Biểu đồ #3');
    expect(MINTO_NARRATIVE.tab1.sec1_1.chart4.vi).toContain('Biểu đồ #4');

    // Biểu đồ 5, 6, 7 in tab1 sec1_2
    expect(MINTO_NARRATIVE.tab1.sec1_2.chart5.vi).toContain('Biểu đồ #5');
    expect(MINTO_NARRATIVE.tab1.sec1_2.chart6.vi).toContain('Biểu đồ #6');
    expect(MINTO_NARRATIVE.tab1.sec1_2.chart7.vi).toContain('Biểu đồ #7');

    // Biểu đồ 8, 9 in tab1 sec1_3
    expect(MINTO_NARRATIVE.tab1.sec1_3.chart8.vi).toContain('Biểu đồ #8');
    expect(MINTO_NARRATIVE.tab1.sec1_3.chart9.vi).toContain('Biểu đồ #9');

    // Biểu đồ 10, 11, 12 in tab1 sec1_4
    expect(MINTO_NARRATIVE.tab1.sec1_4.chart10.vi).toContain('Biểu đồ #10');
    expect(MINTO_NARRATIVE.tab1.sec1_4.chart11.vi).toContain('Biểu đồ #11');
    expect(MINTO_NARRATIVE.tab1.sec1_4.chart12.vi).toContain('Biểu đồ #12');

    // Biểu đồ 13, 14 in tab2 sec2_1
    expect(MINTO_NARRATIVE.tab2.sec2_1.chart13.vi).toContain('Biểu đồ #13');
    expect(MINTO_NARRATIVE.tab2.sec2_1.chart14.vi).toContain('Biểu đồ #14');

    // Biểu đồ 15, 16 in tab2 sec2_2
    expect(MINTO_NARRATIVE.tab2.sec2_2.chart15.vi).toContain('Biểu đồ #15');
    expect(MINTO_NARRATIVE.tab2.sec2_2.chart16.vi).toContain('Biểu đồ #16');

    // Biểu đồ 17, 18 in tab2 sec2_3
    expect(MINTO_NARRATIVE.tab2.sec2_3.chart17.vi).toContain('Biểu đồ #17');
    expect(MINTO_NARRATIVE.tab2.sec2_3.chart18.vi).toContain('Biểu đồ #18');

    // Biểu đồ 19, 20, 21, 22 in tab3
    expect(MINTO_NARRATIVE.tab3.chart19.vi).toContain('Biểu đồ #19');
    expect(MINTO_NARRATIVE.tab3.chart20.vi).toContain('Biểu đồ #20');
    expect(MINTO_NARRATIVE.tab3.chart21.vi).toContain('Biểu đồ #21');
    expect(MINTO_NARRATIVE.tab3.chart22.vi).toContain('Biểu đồ #22');
  });

  it('should maintain concise Vietnamese narrative within ~760 words', () => {
    const rawViText = [
      MINTO_NARRATIVE.header.projectTitle.vi,
      MINTO_NARRATIVE.header.context.vi,
      MINTO_NARRATIVE.header.conclusion.vi,
      MINTO_NARRATIVE.tab1.sec1_1.insight.vi,
      MINTO_NARRATIVE.tab1.sec1_2.insight.vi,
      MINTO_NARRATIVE.tab1.sec1_3.insight.vi,
      MINTO_NARRATIVE.tab1.sec1_4.insight.vi,
      MINTO_NARRATIVE.tab2.sec2_1.insight.vi,
      MINTO_NARRATIVE.tab2.sec2_2.insight.vi,
      MINTO_NARRATIVE.tab2.sec2_3.insight.vi,
      MINTO_NARRATIVE.tab3.architectureInsight.vi,
      MINTO_NARRATIVE.tab3.queryInsight.vi,
    ].join(' ');

    const wordCount = rawViText.trim().split(/\s+/).length;
    // Word count is concise (approximately 500-800 words, drastically reduced from original 2500+ words)
    expect(wordCount).toBeGreaterThan(400);
    expect(wordCount).toBeLessThan(900);
  });

  it('should have all Minto translations registered in translations.vi and translations.en', () => {
    expect(translations.vi.kami_minto_header_title).toBeDefined();
    expect(translations.en.kami_minto_header_title).toBeDefined();
    expect(translations.vi.kami_minto_tab1_title).toBeDefined();
    expect(translations.en.kami_minto_tab1_title).toBeDefined();
  });
});
