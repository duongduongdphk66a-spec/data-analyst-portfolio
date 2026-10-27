import { describe, it, expect } from 'vitest';
import skuSeasonality from '../app/data/kami-ely/generated/sku_seasonality.json';

describe('Kami Ely SKU Seasonality & Transition Data', () => {
  it('đủ 10 SKU chủ lực với thông tin danh mục và đơn giá hợp lệ', () => {
    expect(skuSeasonality.skus).toHaveLength(10);
    expect(skuSeasonality.summary.totalSkus).toBe(10);
    
    // Kiểm tra các mã SKU chủ chốt
    const skuCodes = skuSeasonality.skus.map((s) => s.code);
    expect(skuCodes).toContain('AT06');
    expect(skuCodes).toContain('H36');
    expect(skuCodes).toContain('M18');
    expect(skuCodes).toContain('CV11');
    expect(skuCodes).toContain('CV02');
    expect(skuCodes).toContain('SW01');
    expect(skuCodes).toContain('AG01');
    expect(skuCodes).toContain('AQ1');

    // Kiểm định đúng phân loại ngành hàng theo yêu cầu người dùng
    const aq1 = skuSeasonality.skus.find((s) => s.code === 'AQ1');
    expect(aq1?.category).toBe('Set Đồ Thể Thao Nữ');

    const at06 = skuSeasonality.skus.find((s) => s.code === 'AT06');
    expect(at06?.category).toBe('Áo Thun');

    const ag01 = skuSeasonality.skus.find((s) => s.code === 'AG01');
    expect(ag01?.category).toBe('Áo Gió');

    const cv11 = skuSeasonality.skus.find((s) => s.code === 'CV11');
    expect(cv11?.category).toBe('Chân Váy');

    const cv02 = skuSeasonality.skus.find((s) => s.code === 'CV02');
    expect(cv02?.category).toBe('Chân Váy');

    // Kiểm định thuộc tính mùa vụ: 4 ngành hàng đều là Hàng Bán Đông
    expect(aq1?.affinity).toBe('Hàng Bán Đông');
    expect(at06?.affinity).toBe('Hàng Bán Đông');
    expect(ag01?.affinity).toBe('Hàng Bán Đông');
    expect(cv11?.affinity).toBe('Hàng Bán Đông');
    expect(cv02?.affinity).toBe('Hàng Bán Đông');

    // 5 SKU Bikini đều là Hàng Bán Hè
    const bikiniSkus = skuSeasonality.skus.filter((s) => s.category === 'Bikini / Đồ Bơi');
    expect(bikiniSkus.map((s) => s.code).sort()).toEqual(['H30', 'H32', 'H36', 'M18', 'SW01'].sort());
    bikiniSkus.forEach((b) => {
      expect(b.affinity).toBe('Hàng Bán Hè');
    });
  });

  it('tổng GMV và số lượng bán của 10 SKU khớp kiểm toán MySQL', () => {
    expect(skuSeasonality.summary.totalUnits).toBe(38037);
    expect(skuSeasonality.summary.totalGmv).toBe(6091718359);
    expect(skuSeasonality.summary.totalGmvM).toBeCloseTo(6091.7, 1);
  });

  it('xác nhận sự thoái trào mùa hè của Bikini H36', () => {
    const h36 = skuSeasonality.skus.find((s) => s.code === 'H36');
    expect(h36).toBeDefined();
    // Đỉnh hè tháng 6
    expect(h36?.peakMonth).toBe('2026-06');
    expect(h36?.peakGmvM).toBeCloseTo(572.8, 1);
    // Rơi tự do tháng 8 và gần về 0 tháng 10
    expect(h36?.monthlyGmvM['2026-08']).toBeLessThan(50);
    expect(h36?.monthlyGmvM['2026-10']).toBeLessThan(5);
  });

  it('xác nhận vai trò cứu tinh mùa vụ của Át chủ bài AT06 trong tháng 10', () => {
    const at06 = skuSeasonality.skus.find((s) => s.code === 'AT06');
    expect(at06).toBeDefined();
    // Hoàn toàn không phát sinh doanh số trong giai đoạn cao điểm hè T4-T8
    expect(at06?.monthlyGmvM['2026-05']).toBe(0);
    expect(at06?.monthlyGmvM['2026-06']).toBe(0);
    expect(at06?.monthlyGmvM['2026-07']).toBe(0);
    expect(at06?.monthlyGmvM['2026-08']).toBe(0);
    // Bùng nổ tháng 9 và đỉnh điểm tháng 10
    expect(at06?.monthlyGmvM['2026-09']).toBeGreaterThan(250);
    expect(at06?.monthlyGmvM['2026-10']).toBeCloseTo(1301.0, 1);
    expect(at06?.peakMonth).toBe('2026-10');
  });

  it('chuỗi chuyển dịch tháng xác định đúng điểm đảo chiều (crossover) vào tháng 9', () => {
    const transitions = skuSeasonality.monthlyTransitions;
    expect(transitions).toHaveLength(6);

    const june = transitions.find((t) => t.month === '2026-06');
    expect(june?.swimwearSharePct).toBeGreaterThan(90);

    const sept = transitions.find((t) => t.month === '2026-09');
    expect(sept?.autumnSharePct).toBeGreaterThan(80);

    const oct = transitions.find((t) => t.month === '2026-10');
    expect(oct?.autumnSharePct).toBeGreaterThan(95);
  });

  it('chuỗi theo dõi theo tuần gắn cờ đúng điểm giao cắt đảo chiều mùa vụ', () => {
    const crossoverWeek = skuSeasonality.weeklySeries.find((w) => w.isCrossover);
    expect(crossoverWeek).toBeDefined();
    expect([36, 37]).toContain(crossoverWeek?.weekNum);
  });
});
