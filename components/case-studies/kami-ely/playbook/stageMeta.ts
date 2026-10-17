import type { Bi } from './playbookData';

export interface StageMeta {
  n: number;
  id: string;
  title: Bi;
  short: Bi;
  /** full: dữ liệu thật đủ cho đúng nội dung giai đoạn. partial: dùng đối tượng thay thế hoặc bỏ một phần. */
  coverage: 'full' | 'partial';
  gap?: Bi;
}

export const STAGE_META: readonly StageMeta[] = [
  {
    n: 1,
    id: 'pb-stage-1',
    title: { vi: 'Kiến trúc dữ liệu', en: 'Data architecture' },
    short: { vi: 'Kiến trúc', en: 'Architecture' },
    coverage: 'full',
  },
  {
    n: 2,
    id: 'pb-stage-2',
    title: { vi: 'Hồ sơ và làm sạch', en: 'Profile and clean' },
    short: { vi: 'Làm sạch', en: 'Clean' },
    coverage: 'full',
  },
  {
    n: 3,
    id: 'pb-stage-3',
    title: { vi: 'Chuỗi thời gian', en: 'Time series' },
    short: { vi: 'Thời gian', en: 'Time' },
    coverage: 'full',
  },
  {
    n: 4,
    id: 'pb-stage-4',
    title: { vi: 'Cohort creator', en: 'Creator cohorts' },
    short: { vi: 'Cohort', en: 'Cohorts' },
    coverage: 'partial',
    gap: {
      vi: 'Seller Center không có mã khách hàng nên cohort được tính trên creator.',
      en: 'Seller Center has no customer IDs, so cohorts are built on creators.',
    },
  },
  {
    n: 5,
    id: 'pb-stage-5',
    title: { vi: 'Phễu và so sánh', en: 'Funnels and comparison' },
    short: { vi: 'Phễu', en: 'Funnels' },
    coverage: 'partial',
    gap: {
      vi: 'Chưa có bảng order_detail nên chưa làm phân tích giỏ hàng.',
      en: 'No order_detail table, so basket analysis is not included.',
    },
  },
  {
    n: 6,
    id: 'pb-stage-6',
    title: { vi: 'Bất thường', en: 'Anomalies' },
    short: { vi: 'Bất thường', en: 'Anomalies' },
    coverage: 'partial',
    gap: {
      vi: 'Chưa có văn bản đánh giá khách hàng. Phần này có outlier theo ngày và khớp mẫu trên cột category.',
      en: 'No customer review text. This stage covers daily outliers and category pattern matching.',
    },
  },
  {
    n: 7,
    id: 'pb-stage-7',
    title: { vi: 'ETL và PII', en: 'ETL and PII' },
    short: { vi: 'ETL, PII', en: 'ETL, PII' },
    coverage: 'full',
  },
] as const;
