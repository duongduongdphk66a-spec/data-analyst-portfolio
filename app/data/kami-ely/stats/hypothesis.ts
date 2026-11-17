/**
 * Kiểm định thống kê giữa hiệu suất Video và Livestream của kênh chính chủ @kamielyhn
 * trên dữ liệu xuất theo từng video và từng phiên (09/03 - 25/10/2026).
 *
 * Công thức: GPM = (Doanh thu / Lượt xem) × 1.000 (đơn vị: nghìn VNĐ / 1.000 lượt xem).
 * Nguồn trực tiếp: Creator_Videos_Merged (n = 276 video, gồm 184 video gắn giỏ hàng)
 * và Creator_Livestreams_Merged (n = 600 phiên).
 */
export const hypothesis = {
  title: 'Kiểm định Welch t-test & Mann-Whitney U theo từng phiên/video (GPM)',
  h0: 'μ_V = μ_L (GPM trung bình trên 1.000 lượt xem giữa Video và Livestream không khác nhau)',
  h1: 'μ_V ≠ μ_L (GPM giữa Video và Livestream khác nhau; kiểm định hai phía)',
  alpha: 0.05,
  gpmDefinition: 'GPM = (Doanh thu / Lượt xem) × 1.000 (nghìn VNĐ / 1.000 lượt xem)',
  unit: 'k VNĐ / 1.000 views',
  source: 'Creator_Videos_Merged.csv (n = 276) & Creator_Livestreams_Merged.csv (n = 600)',
  videoN: 276,
  videoMeanGpm: 90.9,
  videoStdGpm: 140.9,
  videoMedianGpm: 16.5,
  videoWeightedGpm: 113.4,
  videoCI95: [74.3, 107.5],
  videoEcomOnly: {
    n: 184,
    meanGpm: 132.1,
    stdGpm: 155.2,
    medianGpm: 77.2,
    welchLogT: -16.62,
    welchLogDf: 271.2,
    mannWhitneyU: 10231,
    mannWhitneyZ: -16.74,
    rankBiserial: -0.815,
  },
  liveN: 600,
  liveMeanGpm: 1719.2,
  liveStdGpm: 2051.4,
  liveMedianGpm: 1065.3,
  liveWeightedGpm: 2142.5,
  liveCI95: [1555.1, 1883.4],
  tStatistic: -19.34,
  degreesOfFreedom: 611.2,
  pValue: '< 0.0001',
  welchLogT: -24.39,
  welchLogDf: 433.1,
  welchLogP: '< 0.0001',
  mannWhitneyU: 12038,
  mannWhitneyZ: -20.41,
  mannWhitneyP: '< 0.0001',
  rankBiserial: -0.855,
  affiliateEcosystem: {
    videoN: 3206,
    videoMeanGpm: 78.1,
    videoMedianGpm: 0,
    liveN: 8342,
    liveMeanGpm: 197.0,
    liveMedianGpm: 0,
    welchRawT: -7.81,
    welchLogT: -25.29,
    mannWhitneyZ: -22.38,
    pValue: '< 0.0001',
  },
  snapshot28dUiNote: {
    videoGpm: 135.2,
    liveGpm: 30.2,
    window: '08/08 - 04/09/2026 (ảnh chụp giao diện FastMoss 28 ngày)',
  },
  isSignificant: true,
  interpretation:
    'Trên dữ liệu từng phiên/video 231 ngày của kênh chính chủ (n = 600 phiên Live, 276 video), Live đạt GPM cao hơn hẳn Video (trung bình 1.719,2k so với 90,9k/1.000 views; trung vị 1.065,3k so với 16,5k; Mann-Whitney U = 12.038, z = -20,41, p < 0,0001; Welch t trên log(1+GPM) = -24,39, p < 0,0001). Kết quả vẫn giữ nguyên khi lọc riêng 184 video gắn giỏ hàng (TB 132,1k) hoặc mở rộng sang toàn bộ mạng affiliate (3.206 video vs 8.342 phiên Live). Lưu ý: ảnh chụp giao diện 28 ngày FastMoss cho thấy 135,2k (Video) và 30,2k (Live) thuộc phạm vi UI hẹp với mẫu số khác nhau, không đại diện cho kết luận tổng thể.',
};
