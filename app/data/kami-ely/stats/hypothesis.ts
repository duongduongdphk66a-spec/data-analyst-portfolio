export const hypothesis = {
  "title": "Welch's Independent Two-Sample T-test",
  "h0": "μ_V ≤ μ_L (GPM Video không lớn hơn Live)",
  "h1": "μ_V > μ_L (GPM Video thực sự vượt trội hơn Live)",
  "alpha": 0.05,
  "videoN": 551,
  "videoMeanGpm": 135.2,
  "videoStdGpm": 84.5,
  "videoCI95": [
    128.1,
    142.3
  ],
  "liveN": 470,
  "liveMeanGpm": 30.2,
  "liveStdGpm": 18.6,
  "liveCI95": [
    28.5,
    31.9
  ],
  "tStatistic": 27.64,
  "degreesOfFreedom": 612.4,
  "pValue": "< 0.0001",
  "isSignificant": true,
  "interpretation": "Độ tin cậy đạt trên 99.99% (xác suất sai số ngẫu nhiên < 0.01%). Sự vượt trội của kênh Video mua sắm (135.2k vs 30.2k VNĐ GPM) mang tính quy luật vững chắc, khẳng định Video sinh lời tốt hơn Livestream một cách có hệ thống."
};
