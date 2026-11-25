/**
 * Heritage Japan Tourism: Academic Thesis Data & Research Telemetry
 * Source: Japan National Tourism Organization (JNTO) & MLIT Statistical Reports, Faculty of Oriental Studies (USSH - VNU Hanoi)
 * Supervisor: Dr. Vo Minh Vu
 */

export interface TimeSeriesPoint {
  year: string;
  value: number;
  note?: string;
}

export interface DualSeriesPoint {
  year: string;
  kyoto: number;
  nara: number;
}

export interface CaseStudyMatrixItem {
  site: string;
  prefecture: string;
  type: string;
  pressureMetric: string;
  coreIssue: string;
  intervention: string;
  status: string;
}

export interface ThesisLimitationItem {
  id: string;
  category: string;
  severity: 'Cao' | 'Trung bình' | 'Đã hiệu đính';
  flawInThesis: string;
  portfolioFix: string;
}

export const HERITAGE_JAPAN_DATA = {
  meta: {
    title: 'Phân tích Tăng trưởng & Sức chứa Du lịch Di sản Nhật Bản (2013–2023)',
    subtitle:
      'Đánh giá hiệu lực kinh tế của Chương trình Quốc gia Du lịch (06/2013) và bài toán quá tải (Overtourism) tại các Di sản Thế giới UNESCO.',
    author: 'Ma Văn Hùng',
    advisor: 'TS. Võ Minh Vũ',
    institution: 'Khoa Đông Phương học, Trường ĐH KHXH&NV - ĐHQGHN',
    wordCountTarget: '< 850 chữ',
    chartCount: 12,
  },

  kpis: [
    {
      label: 'Đỉnh khách quốc tế (2019)',
      value: '31,9M',
      delta: '+206,7% vs 2013 (10,4M)',
      desc: 'Tăng gấp ~3,8 lần so với mức nền 6–8 triệu lượt trước năm 2013.',
    },
    {
      label: 'Chi tiêu khách quốc tế (2019)',
      value: '4,81 nghìn tỷ ¥',
      delta: 'Tăng 3,41x vs 2013 (1,41T ¥)',
      desc: 'Chiếm 11,5% tổng doanh thu toàn ngành du lịch Nhật Bản (41,94T ¥).',
    },
    {
      label: 'Đóng góp kinh tế vĩ mô (2019)',
      value: '7,5% GDP',
      delta: '375,4 tỷ USD (Hạng 3 Thế giới)',
      desc: 'Tăng từ 2,2% GDP (2000), vượt Đức (344,8 tỷ USD), tạo >4 triệu việc làm (6,9%).',
    },
    {
      label: 'Tỷ lệ quá tải cực đại',
      value: '3.000 : 1',
      delta: '1,8M khách / 600 cư dân',
      desc: 'Ghi nhận tại làng cổ Shirakawa-go & Gokayama, gây áp lực rác thải & hạ tầng.',
    },
  ],

  policyPillars: [
    {
      year: '1950 & 2004',
      name: 'Luật Bảo vệ Di sản Văn hóa (Sửa đổi 2004)',
      focus: 'Bảo tồn lõi & Vùng đệm cảnh quan',
      highlights: [
        'Phân cấp Di sản văn hóa trọng yếu & Quốc bảo; kiểm soát nghiêm ngặt việc trùng tu.',
        'Bổ sung chế độ bảo tồn "Cảnh quan văn hóa" (2004) & Quần thể kiến trúc truyền thống.',
      ],
    },
    {
      year: '2006 – 2008',
      name: 'Luật Du lịch Quốc gia & Sách trắng 2008',
      focus: 'Định hướng Du lịch Bền vững',
      highlights: [
        'Thành lập Cơ quan Du lịch Nhật Bản (2008) & ban hành Luật Quy hoạch thị trấn lịch sử (>100 khu cổ kính).',
        'Đặt 2 mục tiêu: Tăng trưởng xanh thay thế công nghiệp nặng & cân bằng lợi ích kinh tế - xã hội.',
      ],
    },
    {
      year: '06/2013',
      name: 'Chương trình Hành động Quốc gia Du lịch',
      focus: 'Kích cầu Inbound & Thương hiệu Nhật Bản',
      highlights: [
        'Miễn/nới lỏng visa cho Đông Nam Á (Thái Lan, Malaysia, Việt Nam, Philippines, Indonesia).',
        'Chiến lược Bầu trời mở (Open Skies), miễn thuế tiêu dùng (Tax-free), đa ngôn ngữ, thanh toán quốc tế & MICE.',
      ],
    },
  ],

  // Chart 1: Biểu đồ 3.1 - Khách quốc tế đến Nhật Bản (2003 - 2022, Triệu người)
  japanVisitors: [
    { year: '2003', value: 5.2 },
    { year: '2004', value: 6.1 },
    { year: '2005', value: 6.7 },
    { year: '2006', value: 7.3 },
    { year: '2007', value: 8.3 },
    { year: '2008', value: 8.4 },
    { year: '2009', value: 6.8 },
    { year: '2010', value: 8.6 },
    { year: '2011', value: 6.2 },
    { year: '2012', value: 8.4 },
    { year: '2013', value: 10.4 },
    { year: '2014', value: 13.4 },
    { year: '2015', value: 19.7 },
    { year: '2016', value: 24.0 },
    { year: '2017', value: 28.7 },
    { year: '2018', value: 31.2 },
    { year: '2019', value: 31.9 },
    { year: '2020', value: 4.1 },
    { year: '2021', value: 0.2 },
    { year: '2022', value: 3.83 },
  ] as TimeSeriesPoint[],

  // Chart 2: Biểu đồ 3.4 - Chi tiêu khách quốc tế tại Nhật (2010 - 2021, Nghìn tỷ Yên)
  japanSpending: [
    { year: '2010', value: 1.15 },
    { year: '2011', value: 0.81 },
    { year: '2012', value: 1.08 },
    { year: '2013', value: 1.41 },
    { year: '2014', value: 2.02 },
    { year: '2015', value: 3.48 },
    { year: '2016', value: 3.75 },
    { year: '2017', value: 4.41 },
    { year: '2018', value: 4.50 },
    { year: '2019', value: 4.81 },
    { year: '2020', value: 0.74 },
    { year: '2021', value: 0.12 },
  ] as TimeSeriesPoint[],

  // Chart 3: Chỉ số hóa tốc độ tăng trưởng khách quốc tế (2013 = 100)
  indexedGrowth2013To2019: [
    { year: '2013', japan: 100.0, kyoto: 100.0, nara: 100.0 },
    { year: '2014', japan: 128.8, kyoto: 162.1, nara: 144.8 },
    { year: '2015', japan: 189.4, kyoto: 280.0, nara: 224.1 },
    { year: '2016', japan: 230.8, kyoto: 282.4, nara: 362.3 },
    { year: '2017', japan: 276.0, kyoto: 312.8, nara: 457.5 },
    { year: '2018', japan: 300.0, kyoto: 399.3, nara: 609.4 },
    { year: '2019', japan: 306.7, kyoto: 336.8, nara: 762.8 },
  ],

  // Chart 4: Quy mô thị trường toàn cầu & vị thế Nhật Bản
  globalBenchmarks: [
    { label: 'Mỹ & Top dẫn đầu (Tham chiếu)', value: 556.96, unit: 'Tỷ USD (Thị trường Di sản 2021)' },
    { label: 'Dự báo Du lịch Di sản Toàn cầu (2030)', value: 778.07, unit: 'Tỷ USD (CAGR 3,8%/năm)' },
    { label: 'Quy mô Du lịch Nhật Bản (2019 - Hạng 3 TG)', value: 375.4, unit: 'Tỷ USD (41,94 nghìn tỷ Yên)' },
    { label: 'Quy mô Du lịch Đức (2019 - Hạng 4 TG)', value: 344.8, unit: 'Tỷ USD' },
  ],

  // Chart 5: Biểu đồ 3.2 - Khách lưu trú nước ngoài thực tế tại TP. Kyoto (2008 - 2023, Nghìn người)
  kyotoVisitors: [
    { year: '2008', value: 926.8 },
    { year: '2009', value: 937.2 },
    { year: '2010', value: 783.8 },
    { year: '2011', value: 515.4 },
    { year: '2012', value: 844.9 },
    { year: '2013', value: 1127.9 },
    { year: '2014', value: 1828.6 },
    { year: '2015', value: 3158.6 },
    { year: '2016', value: 3184.8 },
    { year: '2017', value: 3527.8 },
    { year: '2018', value: 4503.3 },
    { year: '2019', value: 3799.0 },
    { year: '2020', value: 448.8 },
    { year: '2021', value: 54.4 },
    { year: '2022', value: 576.1 },
    { year: '2023', value: 5357.0 },
  ] as TimeSeriesPoint[],

  // Chart 6: Biểu đồ 3.3 - Khách quốc tế đến TP. Nara (2009 - 2020, Nghìn người)
  naraVisitors: [
    { year: '2009', value: 407 },
    { year: '2010', value: 629 },
    { year: '2011', value: 174 },
    { year: '2012', value: 267 },
    { year: '2013', value: 435 },
    { year: '2014', value: 630 },
    { year: '2015', value: 975 },
    { year: '2016', value: 1576 },
    { year: '2017', value: 1990 },
    { year: '2018', value: 2651 },
    { year: '2019', value: 3318 },
    { year: '2020', value: 289 },
  ] as TimeSeriesPoint[],

  // Chart 7: Biểu đồ 3.5 & 3.6 - Tổng chi tiêu du lịch (Nội địa + Quốc tế) tại TP. Kyoto & TP. Nara (Tỷ Yên)
  kyotoSpending: [
    { year: '2008', value: 649.1 },
    { year: '2009', value: 655.9 },
    { year: '2010', value: 608.1 },
    { year: '2013', value: 699.4 },
    { year: '2014', value: 761.7 },
    { year: '2015', value: 970.4 },
    { year: '2016', value: 1085.5 },
    { year: '2017', value: 1126.4 },
    { year: '2018', value: 1308.2 },
    { year: '2019', value: 1236.7 },
  ] as TimeSeriesPoint[],

  naraSpending: [
    { year: '2013', value: 87.26 },
    { year: '2014', value: 89.24 },
    { year: '2015', value: 99.46 },
    { year: '2016', value: 103.59 },
    { year: '2017', value: 112.86 },
    { year: '2018', value: 120.8 },
    { year: '2019', value: 114.7 },
    { year: '2020', value: 50.64 },
    { year: '2021', value: 42.8 },
    { year: '2022', value: 59.83 },
  ] as TimeSeriesPoint[],

  // Chart 8: Cơ cấu khách Nội địa vs Quốc tế năm 2017 (Triệu lượt)
  visitorMix2017: [
    { site: 'Cố đô Kyoto', domestic: 53.62, international: 3.53, intlShare: 6.2 },
    { site: 'Cố đô Nara', domestic: 16.31, international: 1.99, intlShare: 10.9 },
    { site: 'Núi Phú Sĩ (Fuji)', domestic: 6.40, international: 2.00, intlShare: 23.8 },
  ],

  // Chart 9: Độ lệch Cung - Cầu lưu trú tại Kyoto (2013 vs 2018)
  kyotoSupplyDemandMismatch: {
    visitors2013: 1.13, // Triệu khách lưu trú nước ngoài (1.127,9k)
    visitors2018: 4.50, // Triệu khách lưu trú nước ngoài (+299,3%)
    rooms2013: 30.0, // Nghìn phòng (<30.000)
    rooms2018: 53.0, // Nghìn phòng (~53.000, ~1,8x)
  },

  // Chart 10: Tác động kinh tế đa chiều tại Kyoto & Toàn quốc (2019)
  economicShareComparison: [
    { metric: 'Đóng góp GDP Nhật Bản (2000)', share: 2.2 },
    { metric: 'Đóng góp GDP Nhật Bản (2019)', share: 7.5 },
    { metric: 'Tỷ trọng việc làm toàn quốc (2019 - >4M việc)', share: 6.9 },
    { metric: 'Đóng góp GRDP TP. Kyoto (2014)', share: 7.0 },
    { metric: 'Đóng góp GRDP TP. Kyoto (2019)', share: 12.0 },
    { metric: 'Đóng góp Thuế TP. Kyoto (39 tỷ Yên)', share: 12.8 },
    { metric: 'Đóng góp Việc làm TP. Kyoto (153.000 người)', share: 12.4 },
  ],

  // Chart 11: Cường độ quá tải tại các điểm di sản nhạy cảm
  overtourismHotspots: [
    { site: 'Núi Phú Sĩ (2019 vs 2012: gấp 2,2x)', visitorsMillion: 5.06, benchmarkMillion: 2.3 },
    { site: 'Đảo Miyajima - Đền Itsukushima (2019)', visitorsMillion: 4.60, benchmarkMillion: 2.0 },
    { site: 'Cố đô Kyoto - Khách lưu trú nước ngoài (Đỉnh 2018)', visitorsMillion: 4.50, benchmarkMillion: 1.13 },
    { site: 'Cố đô Nara - Khách quốc tế (Đỉnh 2019)', visitorsMillion: 3.32, benchmarkMillion: 0.44 },
    { site: 'Làng cổ Shirakawa-go (Chỉ có ~600 cư dân)', visitorsMillion: 1.80, benchmarkMillion: 0.5 },
  ],

  // Chart 12: Ma trận điểm áp lực vs. mức độ can thiệp chính sách (Thang tham chiếu định tính 0-100 tổng hợp từ tư liệu case study, không phải chỉ số chính thức của JNTO)
  sustainabilityScores: [
    { site: 'Cố đô Kyoto', crowdingPressure: 95, commercialization: 90, ecoWasteRisk: 85, policyResponse: 92 },
    { site: 'Cố đô Nara', crowdingPressure: 80, commercialization: 78, ecoWasteRisk: 88, policyResponse: 82 },
    { site: 'Núi Phú Sĩ', crowdingPressure: 88, commercialization: 75, ecoWasteRisk: 82, policyResponse: 86 },
    { site: 'Làng Shirakawa-go', crowdingPressure: 98, commercialization: 65, ecoWasteRisk: 78, policyResponse: 88 },
    { site: 'Đền Itsukushima', crowdingPressure: 84, commercialization: 70, ecoWasteRisk: 75, policyResponse: 85 },
  ],

  // Ma trận 5 Case Studies ở Chương 3.2 (Súc tích 1 dòng/ô gắn thẳng con số)
  caseStudies: [
    {
      site: 'Cố đô Kyoto',
      prefecture: 'Phủ Kyoto',
      type: 'Di sản Văn hóa (1994)',
      pressureMetric: '4,50M khách lưu trú NN (2018, 4,0×) vs 53.000 phòng (1,8×)',
      coreIssue:
        'Tắc nghẽn xe buýt Gion & Kinkakuji; thiếu khách sạn nên tràn sang thuê chung cư dân sinh gây ồn.',
      intervention:
        'Lắp camera trực tiếp báo mật độ thời gian thực; phân tán khách ra 6 vùng vệ tinh; thu hút Park Hyatt, Aman.',
      status: 'Đang vận hành hiệu quả',
    },
    {
      site: 'Làng cổ Shirakawa-go & Gokayama',
      prefecture: 'Gifu & Toyama',
      type: 'Di sản Văn hóa (1995)',
      pressureMetric: '1,8M khách/năm trên ~600 cư dân bản địa (tỷ lệ 3.000×)',
      coreIssue:
        'Vượt sức chứa hạ tầng dịp Lễ hội ánh sáng mùa đông; rác thải và tiếng ồn xâm phạm sinh hoạt làng cổ.',
      intervention:
        'Bắt buộc đặt chỗ trước 100% đêm thắp sáng, tăng giá vé, giới hạn bãi đỗ xe và lối lên đài quan sát.',
      status: 'Đã kiểm soát tốt mùa cao điểm',
    },
    {
      site: 'Đền Itsukushima (Đảo Miyajima)',
      prefecture: 'Hiroshima',
      type: 'Di sản Văn hóa (1996)',
      pressureMetric: '4,60M lượt khách lên đảo (2019)',
      coreIssue:
        'Mật độ du khách cao gây áp lực bảo dưỡng kiến trúc gỗ trên biển và vệ sinh môi trường đảo.',
      intervention:
        'Thu thuế du khách lên đảo 100 Yên/người để tạo nguồn thu trực tiếp cho quỹ bảo tồn di sản.',
      status: 'Đã áp dụng thu phí bảo tồn',
    },
    {
      site: 'Núi Phú Sĩ (Fuji)',
      prefecture: 'Yamanashi & Shizuoka',
      type: 'Di sản Văn hóa (2013)',
      pressureMetric: '5,06M lượt khách (2019, gấp 2,2× so với 2012)',
      coreIssue:
        'Quá tải leo núi theo mùa, rủi ro an toàn và ứ đọng rác thải dọc các tuyến đường mòn.',
      intervention:
        'Lập Quỹ hợp tác bảo tồn (2014); mở Trung tâm Di sản Thế giới leo núi ảo VR 6.100 m² (2017); đề xuất đường sắt leo núi.',
      status: 'Quỹ và Trung tâm VR vận hành tốt',
    },
    {
      site: 'Cố đô Nara',
      prefecture: 'Tỉnh Nara',
      type: 'Di sản Văn hóa (1998)',
      pressureMetric: '3,32M khách quốc tế (2019, +662,8%) nhưng tổng chi tiêu giảm -5,0% (114,7 tỷ ¥)',
      coreIssue:
        'Khách đi về trong ngày (day-trip) từ Kyoto/Osaka do thiếu khách sạn; rác nhựa gây hại đàn hươu.',
      intervention:
        'Trợ cấp vị trí mở khách sạn (JW Marriott, Fufu Nara); cho phép cải tạo tài sản văn hóa làm nơi lưu trú.',
      status: 'Đang mở rộng lưu trú',
    },
  ] as CaseStudyMatrixItem[],

  // Phần thừa nhận thiếu sót & Nhật ký Đối soát Dữ liệu của bài niên luận gốc
  thesisLimitations: [
    {
      id: 'LIM-01',
      category: 'Chuẩn hóa đơn vị (億円 & 万人)',
      severity: 'Đã hiệu đính',
      flawInThesis:
        'Biểu đồ 3.6 ghi chi tiêu Nara theo "tỷ Yên" (phóng đại ×10 lần từ 億円); Biểu đồ 3.3 đổi nhầm 28,9 万人 năm 2020 thành 28,9 nghìn.',
      portfolioFix:
        'Chia 10 chuỗi chi tiêu Nara về Tỷ Yên (2018: 120,8 tỷ ¥ = ~1/11 Kyoto; 2019: 114,7; 2020: 50,64) và sửa khách Nara 2020 thành 289 nghìn.',
    },
    {
      id: 'LIM-02',
      category: 'Hiệu chỉnh lệch trục năm (+1 năm) tại Kyoto',
      severity: 'Đã hiệu đính',
      flawInThesis:
        'Biểu đồ 3.2 (khách lưu trú nước ngoài từ 2012) và Biểu đồ 3.5 (chi tiêu 2014–2020) tại Kyoto bị đẩy tiến +1 năm so với báo cáo gốc.',
      portfolioFix:
        'Lùi trục năm -1: giai đoạn 2013–2018 khách lưu trú nước ngoài Kyoto tăng +299,3% (1.127,9k → 4.503,3k); tổng chi tiêu tăng +87,0% (699,4 → 1.308,2 tỷ ¥).',
    },
    {
      id: 'LIM-03',
      category: 'Gắn cờ đứt gãy phương pháp (R1/2019 & 2011–2012)',
      severity: 'Đã hiệu đính',
      flawInThesis:
        'Nối liền tuyến tính chuỗi Kyoto qua năm đổi phương pháp khảo sát R1/2019 (3.799,0k khách) và khoảng trống chi tiêu 2011–2012.',
      portfolioFix:
        'Vẽ nét đứt đoạn 2018→2019 kèm nhãn "Đổi phương pháp thống kê R1/2019"; tách rõ "Khách lưu trú nước ngoài thực tế" và "Tổng chi tiêu (Nội địa + Quốc tế)".',
    },
    {
      id: 'LIM-04',
      category: 'Chốt số JNTO 2022 & mốc thuyết minh 3.1.2',
      severity: 'Đã hiệu đính',
      flawInThesis:
        'Biểu đồ 3.1 ghi khách đến Nhật năm 2022 là 3,4 triệu; mục 3.1.2 ghi nhầm chi tiêu đạt 4,81 nghìn tỷ Yên giai đoạn "2013 đến 2020".',
      portfolioFix:
        'Chốt khách năm 2022 là 3,83 triệu theo JNTO (3.832.110 lượt); sửa mốc đỉnh 4,81 nghìn tỷ ¥ về giai đoạn 2013–2019 (2020: 0,74; 2021: 0,12).',
    },
    {
      id: 'LIM-05',
      category: 'Tách phạm vi đo lường & chuẩn hóa nguồn gốc',
      severity: 'Đã hiệu đính',
      flawInThesis:
        'Chưa tách nhãn chi tiêu quốc tế với tổng chi tiêu địa phương và dùng 4 liên kết thứ cấp trong tài liệu tham khảo.',
      portfolioFix:
        'Chuẩn hóa nhãn phạm vi trên biểu đồ kết hợp 2 trục và đối soát 100% chuỗi số liệu với báo cáo gốc JNTO, MLIT, TP. Kyoto, TP. Nara.',
    },
  ] as ThesisLimitationItem[],
};

export interface ThesisMetadata {
  titleVi: string;
  titleEn: string;
  author: string;
  advisor: string;
  facultyVi: string;
  universityVi: string;
  majorVi: string;
  cohort: string;
  completionDate: string;
  scopeYears: string;
}

export const THESIS_METADATA: ThesisMetadata = {
  titleVi: 'SỰ PHÁT TRIỂN CỦA DU LỊCH DI SẢN TẠI NHẬT BẢN GIAI ĐOẠN TỪ NĂM 2013 ĐẾN NAY',
  titleEn: 'The Development of Heritage Tourism in Japan from 2013 to Present',
  author: 'Ma Văn Hùng',
  advisor: 'TS. Võ Minh Vũ',
  facultyVi: 'Khoa Đông Phương học',
  universityVi: 'Trường Đại học Khoa học Xã hội và Nhân văn, ĐHQGHN',
  majorVi: 'Ngành Nhật Bản học',
  cohort: 'QH–2021-X',
  completionDate: '19/01/2024',
  scopeYears: '2013 – 2023',
};


export interface ChartCatalogItem {
  stt: number;
  chartId: string;
  nameVi: string;
  nameEn: string;
  unitVi: string;
  unitEn: string;
  imageSrc?: string;
  pageInDoc: number;
}

// Danh sách biểu đồ đúng như trong niên luận (tên, giai đoạn, số trang)
export const THESIS_CHARTS_CATALOG: ChartCatalogItem[] = [
  {
    stt: 1,
    chartId: '3.1',
    nameVi: 'Số lượng khách du lịch nước ngoài đến Nhật Bản (2003 – 2022)',
    nameEn: 'International Visitors to Japan (2003 – 2022)',
    imageSrc: '/heritage-japan/thesis-chart-3-1.png',
    unitVi: 'Triệu người',
    unitEn: 'Million visitors',
    pageInDoc: 30,
  },
  {
    stt: 2,
    chartId: '3.2',
    nameVi: 'Khách lưu trú nước ngoài thực tế tại TP. Kyoto (2008 – 2022)',
    nameEn: 'Actual Foreign Overnight Guests in Kyoto City (2008 – 2022)',
    imageSrc: '/heritage-japan/thesis-chart-3-2.png',
    unitVi: 'Nghìn người',
    unitEn: 'Thousand guests',
    pageInDoc: 31,
  },
  {
    stt: 3,
    chartId: '3.3',
    nameVi: 'Số lượng khách du lịch nước ngoài đến TP. Nara (2009 – 2020)',
    nameEn: 'International Visitors to Nara City (2009 – 2020)',
    imageSrc: '/heritage-japan/thesis-chart-3-3.png',
    unitVi: 'Nghìn người',
    unitEn: 'Thousand visitors',
    pageInDoc: 31,
  },
  {
    stt: 4,
    chartId: '3.4',
    nameVi: 'Chi tiêu du lịch của khách quốc tế tại Nhật Bản (2010 – 2021)',
    nameEn: 'Inbound Tourism Expenditure in Japan (2010 – 2021)',
    imageSrc: '/heritage-japan/thesis-chart-3-4.png',
    unitVi: 'Nghìn tỷ Yên',
    unitEn: 'Trillion JPY',
    pageInDoc: 33,
  },
  {
    stt: 5,
    chartId: '3.5',
    nameVi: 'Tổng chi tiêu du lịch (Nội địa + Quốc tế) tại TP. Kyoto (2008 – 2019)',
    nameEn: 'Total Tourism Expenditure (Domestic + International) in Kyoto City (2008 – 2019)',
    imageSrc: '/heritage-japan/thesis-chart-3-5.png',
    unitVi: 'Tỷ Yên',
    unitEn: 'Billion JPY',
    pageInDoc: 33,
  },
  {
    stt: 6,
    chartId: '3.6',
    nameVi: 'Tổng chi tiêu du lịch (Nội địa + Quốc tế) tại TP. Nara (2013 – 2022)',
    nameEn: 'Total Tourism Expenditure (Domestic + International) in Nara City (2013 – 2022)',
    imageSrc: '/heritage-japan/thesis-chart-3-6.png',
    unitVi: 'Tỷ Yên (đã chuẩn hóa từ 億円)',
    unitEn: 'Billion JPY (normalized from 100M JPY / 億円)',
    pageInDoc: 34,
  },
];

// DỮ LIỆU CHUỖI THỜI GIAN THEO 6 BIỂU ĐỒ TRONG NIÊN LUẬN & DỮ LIỆU CẬP NHẬT CHÍNH THỨC

// Biểu đồ 3.1: Số lượng khách quốc tế đến Nhật Bản (triệu người)
// Nguồn gốc niên luận: JNTO (2003 - 2022); Cập nhật: JNTO (2023 - 2025)
export const touristsData = [
  { year: '2003', value: 5.2, isThesis: true, counterfactual: 5.2 },
  { year: '2004', value: 6.1, isThesis: true, counterfactual: 5.5 },
  { year: '2005', value: 6.7, isThesis: true, counterfactual: 5.8 },
  { year: '2006', value: 7.3, isThesis: true, counterfactual: 6.1 },
  { year: '2007', value: 8.3, isThesis: true, counterfactual: 6.4 },
  { year: '2008', value: 8.4, isThesis: true, counterfactual: 6.8 },
  { year: '2009', value: 6.8, isThesis: true, counterfactual: 7.1 }, // Khủng hoảng tài chính toàn cầu 2008-2009
  { year: '2010', value: 8.6, isThesis: true, counterfactual: 7.5 },
  { year: '2011', value: 6.2, isThesis: true, counterfactual: 7.9 }, // Thảm họa động đất sóng thần Tohoku 11/3
  { year: '2012', value: 8.4, isThesis: true, counterfactual: 8.3 },
  { year: '2013', value: 10.4, isThesis: true, counterfactual: 8.8, policyEvent: 'Chương trình hành động 2013' },
  { year: '2014', value: 13.4, isThesis: true, counterfactual: 9.3 },
  { year: '2015', value: 19.7, isThesis: true, counterfactual: 9.8, policyEvent: 'Japan Heritage 2015' },
  { year: '2016', value: 24.0, isThesis: true, counterfactual: 10.3 },
  { year: '2017', value: 28.7, isThesis: true, counterfactual: 10.9 },
  { year: '2018', value: 31.2, isThesis: true, counterfactual: 11.5 },
  { year: '2019', value: 31.9, isThesis: true, counterfactual: 12.1 }, // Đỉnh cao tiền Covid-19 (+19.8M thặng dư chính sách)
  { year: '2020', value: 4.1, isThesis: true, counterfactual: 12.7 },  // Đại dịch Covid-19
  { year: '2021', value: 0.2, isThesis: true, counterfactual: 13.4 },  // Đáy lịch sử
  { year: '2022', value: 3.83, isThesis: true, counterfactual: 14.1, source: 'JNTO chốt 3.832.110 lượt' },
  { year: '2023', value: 25.07, isThesis: false, counterfactual: 14.9, source: 'JNTO (25,07M)' },
  { year: '2024', value: 36.87, isThesis: false, counterfactual: 15.7, source: 'JNTO (36,87M kỷ lục mới)' },
  { year: '2025', value: 42.68, isThesis: false, counterfactual: 16.5, source: 'JNTO (42,68M kỷ lục lịch sử)' }
];

// Biểu đồ 3.2: Khách lưu trú nước ngoài thực tế tại TP. Kyoto (nghìn người)
export const kyotoVisitorsData = [
  { year: '2008', value: 926.8, thesisRawValue: 926.8, isThesis: true },
  { year: '2009', value: 937.2, thesisRawValue: 937.2, isThesis: true },
  { year: '2010', value: 783.8, thesisRawValue: 783.8, isThesis: true },
  { year: '2011', value: 515.4, thesisRawValue: 983.9, isThesis: true },
  { year: '2012', value: 844.9, thesisRawValue: 515.4, isThesis: true },
  { year: '2013', value: 1127.9, thesisRawValue: 844.9, isThesis: true },
  { year: '2014', value: 1828.6, thesisRawValue: 1127.9, isThesis: true },
  { year: '2015', value: 3158.6, thesisRawValue: 1828.6, isThesis: true },
  { year: '2016', value: 3184.8, thesisRawValue: 3158.6, isThesis: true },
  { year: '2017', value: 3527.8, thesisRawValue: 3184.8, isThesis: true },
  { year: '2018', value: 4503.3, thesisRawValue: 3527.8, isThesis: true },
  { year: '2019', value: 3799.0, thesisRawValue: 4503.3, isThesis: true, hasAnomaly: true },
  { year: '2020', value: 448.8, thesisRawValue: 3799.0, isThesis: true },
  { year: '2021', value: 54.4, thesisRawValue: 448.8, isThesis: true },
  { year: '2022', value: 576.1, thesisRawValue: 54.4, isThesis: true },
  { year: '2023', value: 5357.0, thesisRawValue: 576.1, isThesis: false },
];

// Biểu đồ 3.3: Khách quốc tế đến TP. Nara (nghìn người)
// Đã sửa năm 2020 từ 28,9 nghìn thành 289 nghìn (28,9 万人)
export const naraVisitorsData = [
  { year: '2009', value: 407.0, isThesis: true },
  { year: '2010', value: 629.0, isThesis: true },
  { year: '2011', value: 174.0, isThesis: true },
  { year: '2012', value: 267.0, isThesis: true },
  { year: '2013', value: 435.0, isThesis: true },
  { year: '2014', value: 630.0, isThesis: true },
  { year: '2015', value: 975.0, isThesis: true },
  { year: '2016', value: 1576.0, isThesis: true },
  { year: '2017', value: 1990.0, isThesis: true },
  { year: '2018', value: 2651.0, isThesis: true },
  { year: '2019', value: 3318.0, isThesis: true }, // Đỉnh cao 3,32 triệu khách (+662,8% vs 2013)
  { year: '2020', value: 289.0, isThesis: true },  // Quy đổi chuẩn 28,9 万人 = 289 nghìn
];

// So sánh Kyoto vs Nara (nghìn người)
export const kyotoNaraVisitorsData = [
  { year: '2009', kyoto: 937.2, nara: 407.0 },
  { year: '2010', kyoto: 783.8, nara: 629.0 },
  { year: '2011', kyoto: 515.4, nara: 174.0 },
  { year: '2012', kyoto: 844.9, nara: 267.0 },
  { year: '2013', kyoto: 1127.9, nara: 435.0 },
  { year: '2014', kyoto: 1828.6, nara: 630.0 },
  { year: '2015', kyoto: 3158.6, nara: 975.0 },
  { year: '2016', kyoto: 3184.8, nara: 1576.0 },
  { year: '2017', kyoto: 3527.8, nara: 1990.0 },
  { year: '2018', kyoto: 4503.3, nara: 2651.0 },
  { year: '2019', kyoto: 3799.0, nara: 3318.0 },
  { year: '2020', kyoto: 448.8, nara: 289.0 },
];

// Biểu đồ 3.4: Chi tiêu quốc tế toàn quốc (nghìn tỷ Yên)
// Niên luận: Cục Du lịch Nhật Bản (JTA) (2010 - 2021)
export const spendNationalData = [
  { year: '2010', value: 1.15, isThesis: true },
  { year: '2011', value: 0.81, isThesis: true },
  { year: '2012', value: 1.08, isThesis: true },
  { year: '2013', value: 1.41, isThesis: true },
  { year: '2014', value: 2.02, isThesis: true },
  { year: '2015', value: 3.48, isThesis: true },
  { year: '2016', value: 3.75, isThesis: true },
  { year: '2017', value: 4.41, isThesis: true },
  { year: '2018', value: 4.50, isThesis: true },
  { year: '2019', value: 4.81, isThesis: true },
  { year: '2020', value: 0.74, isThesis: true },
  { year: '2021', value: 0.12, isThesis: true },
];

// Biểu đồ 3.5: Tổng chi tiêu du lịch (Nội địa + Quốc tế) tại TP. Kyoto (tỷ Yên)
// Đã lùi trục năm 2014–2020 về đúng 2013–2019; 2011–2012 không có ước tính do đổi phương pháp
export const kyotoSpendData = [
  { year: '2008', value: 649.1, isThesis: true },
  { year: '2009', value: 655.9, isThesis: true },
  { year: '2010', value: 608.1, isThesis: true },
  { year: '2013', value: 699.4, isThesis: true },
  { year: '2014', value: 761.7, isThesis: true },
  { year: '2015', value: 970.4, isThesis: true },
  { year: '2016', value: 1085.5, isThesis: true },
  { year: '2017', value: 1126.4, isThesis: true },
  { year: '2018', value: 1308.2, isThesis: true },
  { year: '2019', value: 1236.7, isThesis: true },
];

// Biểu đồ 3.6: Tổng chi tiêu du lịch (Nội địa + Quốc tế) tại TP. Nara (2013 - 2022, Tỷ Yên)
// Đã chia 10 toàn bộ chuỗi để quy đổi đúng từ 億円 sang Tỷ Yên
export const naraSpendData = [
  { year: '2013', value: 87.26, isThesis: true },
  { year: '2014', value: 89.24, isThesis: true },
  { year: '2015', value: 99.46, isThesis: true },
  { year: '2016', value: 103.59, isThesis: true },
  { year: '2017', value: 112.86, isThesis: true },
  { year: '2018', value: 120.8, isThesis: true },
  { year: '2019', value: 114.7, isThesis: true },
  { year: '2020', value: 50.64, isThesis: true },
  { year: '2021', value: 42.8, isThesis: true },
  { year: '2022', value: 59.83, isThesis: true },
];

// So sánh tổng chi tiêu khu vực TP. Kyoto & TP. Nara (Tỷ Yên, 2013–2019)
export const spendRegionalComparisonData = [
  { year: '2013', kyoto: 699.4, nara: 87.26 },
  { year: '2014', kyoto: 761.7, nara: 89.24 },
  { year: '2015', kyoto: 970.4, nara: 99.46 },
  { year: '2016', kyoto: 1085.5, nara: 103.59 },
  { year: '2017', kyoto: 1126.4, nara: 112.86 },
  { year: '2018', kyoto: 1308.2, nara: 120.8 },
  { year: '2019', kyoto: 1236.7, nara: 114.7 },
];

// Tỷ trọng đóng góp GDP & Doanh thu du lịch trực tiếp (Nguồn: METI / WTTC)
export const gdpShareData = [
  { year: '2000', gdpShare: 2.2, directRevenue: 12.5 },
  { year: '2010', gdpShare: 4.1, directRevenue: 24.1 },
  { year: '2015', gdpShare: 5.8, directRevenue: 32.8 },
  { year: '2019', gdpShare: 7.5, directRevenue: 41.94 },
  { year: '2023', gdpShare: 7.2, directRevenue: 53.06 },
  { year: '2024', gdpShare: 8.4, directRevenue: 68.20 }
];

// HỒ SƠ PHÁT HIỆN VẤN ĐỀ & KIỂM ĐỊNH DỮ LIỆU (DATA AUDIT & ANOMALIES)
// Dành cho vai trò Data Analyst: chứng minh tư duy phản biện và khả năng kiểm định dữ liệu

export interface DataAuditFinding {
  id: string;
  chartId: string;
  titleVi: string;
  titleEn: string;
  severity: 'high' | 'medium' | 'insight';
  summaryVi: string;
  summaryEn: string;
  originalInDoc: string;
  auditExplanationVi: string;
  auditExplanationEn: string;
  suggestedActionVi: string;
  suggestedActionEn: string;
}

export const DATA_AUDIT_FINDINGS: DataAuditFinding[] = [
  {
    id: 'audit-kyoto-shift',
    chartId: '3.2 & 3.5',
    titleVi: 'Hiệu chỉnh Lệch Trục Năm (+1 năm) & Đứt Gãy Phương Pháp Thống Kê R1/2019 tại TP. Kyoto',
    titleEn: 'Year-Axis Shift (+1 Year) Correction & R1/2019 Methodological Break in Kyoto City',
    severity: 'high',
    summaryVi: 'Trục năm của Biểu đồ 3.2 (từ 2012) và Biểu đồ 3.5 (2014–2020) bị đẩy tiến +1 năm so với báo cáo gốc của TP. Kyoto, đồng thời nối liền qua mốc đổi phương pháp khảo sát R1/2019.',
    summaryEn: 'The year axis in Chart 3.2 (from 2012) and Chart 3.5 (2014–2020) was shifted forward by +1 year, and connected linearly across the R1/2019 survey methodology revision.',
    originalInDoc: 'Biểu đồ 3.2 & 3.5 (trang 31, 33): Ghi đỉnh khách 4.503,3k và đỉnh chi tiêu 1.308,1 tỷ ¥ vào năm 2019; ghi năm 2020 là 3.799k khách và 1.236,2 tỷ ¥.',
    auditExplanationVi: 'Đối chiếu với báo cáo gốc TP. Kyoto (京都観光総合調査), mức đỉnh 4.503,3 nghìn khách lưu trú nước ngoài và 1.308,2 tỷ Yên tổng chi tiêu thực chất thuộc về năm 2018 (tăng +299,3% khách và +87,0% chi tiêu so với năm 2013). Năm 2019 (Reiwa 1), TP. Kyoto đổi phương pháp ước tính (ghi nhận 3.799,0 nghìn khách và 1.236,7 tỷ Yên), còn cú rơi COVID-19 năm 2020 là 448,8 nghìn khách.',
    auditExplanationEn: 'Cross-checking with Kyoto City official reports (京都観光総合調査) confirms that the 4,503.3k foreign overnight guests and ¥1,308.2B total expenditure peaks occurred in 2018 (+299.3% guests and +87.0% spend vs. 2013). In 2019 (Reiwa 1), Kyoto revised its estimation methodology (3,799.0k guests and ¥1,236.7B), while the 2020 COVID plunge was 448.8k guests.',
    suggestedActionVi: 'Lùi trục năm -1 về đúng niên độ 2012–2022 (khách) và 2013–2019 (chi tiêu), đổi tên chỉ số thành "Khách lưu trú nước ngoài thực tế" và vẽ đường nét đứt tại mốc đổi phương pháp R1/2019.',
    suggestedActionEn: 'Shift the year axis back by -1 year to match official reporting years, rename the metric to "Actual Foreign Overnight Guests", and render a dashed line for the R1/2019 methodology break.'
  },
  {
    id: 'audit-nara-unit',
    chartId: '3.3 & 3.6',
    titleVi: 'Chuẩn Hóa Đơn Vị Đo Lường: Quy Đổi 億円 (Chi Tiêu Nara) và 万人 (Khách Nara 2020)',
    titleEn: 'Unit Normalization: Converting 億円 (Nara Spend) and 万人 (Nara 2020 Visitors)',
    severity: 'high',
    summaryVi: 'Tổng chi tiêu TP. Nara bị phóng đại ×10 lần do dịch nhầm 億円 thành tỷ Yên (đỉnh 1.208 tỷ thay vì 120,8 tỷ ¥), còn khách Nara 2020 bị chia nhỏ ×10 lần (28,9 nghìn thay vì 289 nghìn).',
    summaryEn: 'Nara total spending was inflated 10x by translating 億円 as Billion JPY (1,208B instead of 120.8B JPY), while 2020 visitors were understated 10x (28.9k instead of 289k from 28.9 万人).',
    originalInDoc: 'Biểu đồ 3.3 (trang 31): Năm 2020 ghi 28,9 nghìn người. Biểu đồ 3.6 (trang 34): Ghi đơn vị "tỷ yên" với đỉnh năm 2018 là 1.208 và năm 2020 là 402,2.',
    auditExplanationVi: 'Báo cáo gốc TP. Nara công bố tổng chi tiêu du lịch (Nội địa + Quốc tế) theo đơn vị 億円 (trăm triệu Yên = 0,1 tỷ Yên) và lượng khách theo 万人 (vạn người = 10 nghìn người). Khi chia 10 chuỗi chi tiêu về đúng đơn vị Tỷ Yên, đỉnh năm 2018 của TP. Nara là 120,8 tỷ Yên (bằng khoảng 1/11 quy mô 1.308,2 tỷ Yên của TP. Kyoto) và năm 2020 là 50,64 tỷ Yên; còn khách quốc tế năm 2020 là 28,9 万人 = 289 nghìn lượt.',
    auditExplanationEn: 'Nara City official reports publish total tourism expenditure (Domestic + International) in 億円 (100M JPY = 0.1B JPY) and visitor volume in 万人 (10,000 persons). Dividing the spending series by 10 yields Nara’s true 2018 peak of ¥120.8B (~1/11 of Kyoto’s ¥1,308.2B) and ¥50.64B in 2020, while 2020 foreign arrivals equal 28.9 万人 = 289k visitors.',
    suggestedActionVi: 'Chia 10 toàn bộ chuỗi chi tiêu Nara về đúng Tỷ Yên, sửa mốc khách Nara 2020 thành 289 nghìn và ghi rõ nhãn phạm vi "Tổng chi tiêu du lịch (Nội địa + Quốc tế)".',
    suggestedActionEn: 'Divide the entire Nara expenditure series by 10 to true Billion JPY, update 2020 Nara visitors to 289k, and label the scope as "Total Tourism Expenditure (Domestic + International)".'
  },
  {
    id: 'audit-daytripper-paradox',
    chartId: '3.3 vs 3.6',
    titleVi: 'Phát Hiện Thực Nghiệm: Lệch Pha Giữa Lượng Khách và Tổng Chi Tiêu tại TP. Nara (2018–2019)',
    titleEn: 'Empirical Discovery: Visitor Volume vs. Total Expenditure Divergence in Nara (2018–2019)',
    severity: 'insight',
    summaryVi: 'Khách quốc tế đến Nara tăng +662,8% giai đoạn 2013–2019 (đạt đỉnh 3.318 nghìn), nhưng tổng chi tiêu du lịch đạt đỉnh từ 2018 (120,8 tỷ ¥) rồi giảm -5,0% năm 2019 (114,7 tỷ ¥).',
    summaryEn: 'International visitors to Nara grew +662.8% from 2013 to 2019 (peaking at 3,318k), yet total tourism expenditure peaked in 2018 (¥120.8B) and dipped -5.0% in 2019 (¥114.7B).',
    originalInDoc: 'Niên luận so sánh lượng khách và doanh thu Nara nhưng chưa tách biệt phạm vi chi tiêu quốc tế với tổng chi tiêu địa phương.',
    auditExplanationVi: 'Do Nara chỉ cách Kyoto và Osaka khoảng 45 phút đi tàu, phần lớn khách quốc tế tăng thêm trong năm 2019 đi về trong ngày (day-trip) mà không lưu trú qua đêm. Quy mô tổng chi tiêu du lịch Nara (120,8 tỷ Yên năm 2018) chỉ bằng ~1/11 của Kyoto (1.308,2 tỷ Yên), lý giải vì sao tỉnh Nara phải ưu tiên trợ cấp mở khách sạn cao cấp (JW Marriott, Fufu Nara).',
    auditExplanationEn: 'Located 45 minutes by train from Kyoto and Osaka, most incremental foreign arrivals in 2019 visited Nara on day-trips without staying overnight. Nara’s total tourism spend (¥120.8B in 2018) was roughly 1/11 of Kyoto’s (¥1,308.2B), explaining Nara’s policy push for luxury overnight hotels (JW Marriott, Fufu Nara).',
    suggestedActionVi: 'Biểu diễn trên Biểu đồ kết hợp 2 trục (Cột = Lượng khách | Đường = Tổng chi tiêu) kèm chú thích tách biệt phạm vi đo lường.',
    suggestedActionEn: 'Visualize on a Dual-Axis Combo Chart (Bars = Visitors | Line = Total Spend) with an explicit measurement-scope callout.'
  }
];

// MA TRẬN ĐÁNH GIÁ HIỆU QUẢ CHÍNH SÁCH (POLICY EFFECTIVENESS MATRIX)

export interface PolicyEvaluationItem {
  id: string;
  pillarVi: string;
  pillarEn: string;
  actionVi: string;
  actionEn: string;
  quantEvidenceVi: string;
  quantEvidenceEn: string;
  impactScore: number; // 1 to 5
  unintendedCostVi: string;
  unintendedCostEn: string;
}

export const POLICY_EVALUATION_MATRIX: PolicyEvaluationItem[] = [
  {
    id: 'policy-1',
    pillarVi: '1. Nới lỏng Visa & Hàng không Giá rẻ (LCC)',
    pillarEn: '1. Visa Deregulation & Low-Cost Carriers (LCC)',
    actionVi: 'Miễn visa ngắn hạn cho ASEAN (Thái Lan, Malaysia, Việt Nam, Philippines), cấp thị thực nhập cảnh nhiều lần, mở rộng slot bay giá rẻ tại Haneda & Kansai.',
    actionEn: 'Visa waivers for ASEAN, multiple-entry visas, expanded low-cost carrier slots at Kansai & Haneda airports.',
    quantEvidenceVi: 'Khách quốc tế tăng từ 10.4M (2013) lên 31.9M (2019), tốc độ tăng trưởng kép CAGR đạt 20.6%/năm (mức tăng nhanh nhất lịch sử du lịch OECD).',
    quantEvidenceEn: 'Foreign arrivals expanded from 10.4M (2013) to 31.9M (2019), a CAGR of 20.6%/yr (among the fastest in OECD tourism history).',
    impactScore: 5,
    unintendedCostVi: 'Tăng trưởng vượt quá ngưỡng chịu tải (Carrying Capacity) của các phương tiện công cộng tại Kyoto.',
    unintendedCostEn: 'Pushed tourist density far beyond the carrying capacity of municipal bus grids in Kyoto.'
  },
  {
    id: 'policy-2',
    pillarVi: '2. Miễn Thuế Mua Sắm & Thanh Toán Không Tiền Mặt',
    pillarEn: '2. Consumption Tax Exemption & Cashless Infrastructure',
    actionVi: 'Mở rộng diện miễn thuế 8%–10% sang mỹ phẩm, thực phẩm, bánh kẹo; thúc đẩy hạ tầng thanh toán thẻ và di động.',
    actionEn: 'Expanded consumption tax refund from durables to consumables (cosmetics, snacks, food); cashless rollout.',
    quantEvidenceVi: 'Tổng chi tiêu của du khách nhảy vọt từ 1.41 nghìn tỷ Yên (2013) lên 4.81 nghìn tỷ Yên (2019, x3.4 lần) và đạt 8.14 nghìn tỷ Yên (2024).',
    quantEvidenceEn: 'Total inbound expenditure surged from ¥1.41T (2013) to ¥4.81T (2019, x3.4x) and hit a historic ¥8.14T in 2024.',
    impactScore: 5,
    unintendedCostVi: 'Thương mại hóa thái quá tại các tuyến phố di sản (Gion, Higashiyama), lấn át các cửa hàng thủ công truyền thống.',
    unintendedCostEn: 'Over-commercialization around heritage streets, displacing authentic craft workshops with mass souvenir shops.'
  },
  {
    id: 'policy-3',
    pillarVi: '3. Dự Án "Japan Heritage" (日本遺産 - 2015)',
    pillarEn: '3. "Japan Heritage" Project (Storytelling Model - 2015)',
    actionVi: 'Chứng nhận các câu chuyện văn hóa liên kết chuỗi di tích vùng miền thay vì bảo tồn đơn lẻ từng bảo vật theo kiểu đóng băng.',
    actionEn: 'Certified thematic cultural narratives across regional networks rather than isolated monument preservation.',
    quantEvidenceVi: 'Công nhận hơn 104 câu chuyện di sản, kích hoạt du lịch tại các tỉnh ngoại vi (Wakayama, Gifu, Akita), giảm bớt sự dồn ứ cục bộ.',
    quantEvidenceEn: 'Over 104 designated storylines revitalized regional economies (Wakayama, Gifu, Akita), easing golden-route congestion.',
    impactScore: 4,
    unintendedCostVi: 'Nhiều địa phương thiếu ngân sách tiếp thị số, dẫn đến sự phân hóa lớn giữa các điểm đến nổi tiếng và vùng sâu.',
    unintendedCostEn: 'Smaller prefectures lacked digital marketing budgets, widening the gap with top-tier destinations.'
  },
  {
    id: 'policy-4',
    pillarVi: '4. Luật Bảo Vệ Di Sản 1950 (Sửa đổi 2004 - 4 Chế Độ)',
    pillarEn: '4. Law for the Protection of Cultural Properties (2004 Revision)',
    actionVi: 'Thiết lập 4 tầng bảo vệ: Di sản vật thể, Di tích danh thắng, Cảnh quan văn hóa (文化的景観), Quần thể kiến trúc truyền thống.',
    actionEn: 'Established 4 conservation tiers: Tangible assets, Monuments/Places of Scenic Beauty, Cultural Landscapes, Historic Groups of Buildings.',
    quantEvidenceVi: 'Bảo toàn vẹn nguyên hiện trạng 25 Di sản Thế giới UNESCO mà không có di sản nào bị đưa vào danh sách nguy cấp.',
    quantEvidenceEn: 'Zero UNESCO sites in Japan were placed on the "In Danger" list, successfully safeguarding architectural integrity.',
    impactScore: 5,
    unintendedCostVi: 'Quy trình xét duyệt trùng tu nghiêm ngặt khiến chi phí bảo dưỡng đắt đỏ, đòi hỏi phải tìm kiếm nguồn thu từ thuế du lịch.',
    unintendedCostEn: 'Strict restoration mandates drove up maintenance costs, necessitating dedicated tourism conservation levies.'
  }
];

// DỮ LIỆU ĐỐI CHỨNG PHẢN THỰC TẾ (COUNTERFACTUAL ANALYSIS DATA)
// Baseline: Kéo dài xu hướng tăng trưởng 2003-2012 (CAGR 5.1%) so với Thực tế 2013-2019

export const COUNTERFACTUAL_SUMMARY = {
  baselineCagr: 0.051,       // 5.1% tăng trưởng thường niên giai đoạn 2003 - 2012
  actualPolicyCagr: 0.206,   // 20.6% tăng trưởng bùng nổ giai đoạn 2013 - 2019
  growthMultiplier: 4.04,    // Tốc độ tăng trưởng sau chính sách gấp hơn 4 lần
  policyDividend2019: 19.8,  // Thặng dư du khách năm 2019: 31.9M thực tế vs 12.1M nếu giữ xu hướng cũ (+19.8 triệu khách)
  cumulativeSurplus: 63.4,   // Tổng lượng khách thặng dư tích lũy (2013 - 2019): +63.4 triệu lượt
  correlationVisitorsSpend: 0.982 // Hệ số tương quan Pearson giữa lượng khách và doanh thu chi tiêu
};

export interface UnescoSiteItem {
  id: number;
  nameVi: string;
  nameJa: string;
  type: 'Văn hóa' | 'Thiên nhiên';
  year: number;
  prefecture: string;
  highlight: string;
}

export const UNESCO_SITES_JAPAN: UnescoSiteItem[] = [
  { id: 1, nameVi: 'Quần thể kiến trúc Phật giáo khu vực chùa Horyuji', nameJa: '法隆寺地域の仏教建造物', type: 'Văn hóa', year: 1993, prefecture: 'Nara', highlight: 'Công trình kiến trúc bằng gỗ cổ nhất thế giới còn tồn tại (thế kỷ thứ 7).' },
  { id: 2, nameVi: 'Lâu đài Himeji', nameJa: '姫路城', type: 'Văn hóa', year: 1993, prefecture: 'Hyogo', highlight: 'Kiệt tác kiến trúc thành quách bằng gỗ trát vôi trắng tinh xảo ("Lâu đài Hạc Trắng").' },
  { id: 3, nameVi: 'Dãy núi Shirakami-Sanchi', nameJa: '白神山地', type: 'Thiên nhiên', year: 1993, prefecture: 'Aomori/Akita', highlight: 'Rừng sồi nguyên sinh nguyên thủy lớn nhất còn sót lại ở Đông Á.' },
  { id: 4, nameVi: 'Đảo Yakushima', nameJa: '屋久島', type: 'Thiên nhiên', year: 1993, prefecture: 'Kagoshima', highlight: 'Hệ sinh thái rừng mưa ôn đới độc đáo với những cây tuyết tùng ngàn năm (Jomon Sugi).' },
  { id: 5, nameVi: 'Quần thể di tích lịch sử Cố đô Kyoto', nameJa: '古都京都の文化財', type: 'Văn hóa', year: 1994, prefecture: 'Kyoto/Shiga', highlight: '17 đền chùa và lâu đài Nijo đại diện cho 1.000 năm lịch sử văn hóa Nhật Bản.' },
  { id: 6, nameVi: 'Làng lịch sử Shirakawa-go và Gokayama', nameJa: '白川郷・五箇山の合掌造り集落', type: 'Văn hóa', year: 1995, prefecture: 'Gifu/Toyama', highlight: 'Nhà tranh mái dốc kiểu chắp tay Gassho-zukuri thích ứng khí hậu tuyết dày.' },
  { id: 7, nameVi: 'Khu tưởng niệm hòa bình Hiroshima (Mái vòm Bom nguyên tử)', nameJa: '原爆ドーム', type: 'Văn hóa', year: 1996, prefecture: 'Hiroshima', highlight: 'Biểu tượng lịch sử nhắc nhở nhân loại về khát vọng hòa bình và xóa bỏ vũ khí hạt nhân.' },
  { id: 8, nameVi: 'Đền thần Itsukushima (Đảo Miyajima)', nameJa: '厳島神社', type: 'Văn hóa', year: 1996, prefecture: 'Hiroshima', highlight: 'Cổng Torii nổi trên biển và kiến trúc Shinden-zukuri thế kỷ 12 kỳ vĩ.' },
  { id: 9, nameVi: 'Quần thể di tích lịch sử Cố đô Nara', nameJa: '古都奈良の文化財', type: 'Văn hóa', year: 1998, prefecture: 'Nara', highlight: 'Chùa Todaiji với tượng Đại Phật bằng đồng lớn nhất, đền Kasuga Taisha và công viên hươu thần.' },
  { id: 10, nameVi: 'Đền chùa vùng Nikko', nameJa: '日光の社寺', type: 'Văn hóa', year: 1999, prefecture: 'Tochigi', highlight: 'Đền Nikko Toshogu lộng lẫy, nơi an nghỉ của Shogun Tokugawa Ieyasu giữa rừng thông cổ thụ.' },
  { id: 11, nameVi: 'Các di chỉ Gusuku và di sản liên quan của Vương quốc Ryukyu', nameJa: '琉球王国のグスク及び関連遺産群', type: 'Văn hóa', year: 2000, prefecture: 'Okinawa', highlight: 'Lâu đài Shuri và văn hóa giao lưu hàng hải Đông Á độc đáo của người Ryukyu.' },
  { id: 12, nameVi: 'Các địa điểm linh thiêng và đường hành hương dãy núi Kii', nameJa: '紀伊山地の霊場と参詣道', type: 'Văn hóa', year: 2004, prefecture: 'Wakayama/Nara/Mie', highlight: 'Đường hành hương Kumano Kodo linh thiêng hòa quyện Thần đạo và Phật giáo.' },
  { id: 13, nameVi: 'Bán đảo Shiretoko', nameJa: '知床', type: 'Thiên nhiên', year: 2005, prefecture: 'Hokkaido', highlight: 'Hệ sinh thái biển - đất liền nguyên sinh cận cực Bắc với hiện tượng băng trôi kỳ thú.' },
  { id: 14, nameVi: 'Mỏ bạc Iwami Ginzan và cảnh quan văn hóa', nameJa: '石見銀山遺跡とその文化的景観', type: 'Văn hóa', year: 2007, prefecture: 'Shimane', highlight: 'Trung tâm khai thác và xuất khẩu bạc lớn bậc nhất thế giới thế kỷ 16–17 hòa quyện thiên nhiên.' },
  { id: 15, nameVi: 'Hiraizumi - Các đền thờ, hoa viên và di chỉ khảo cổ Phật giáo Tịnh độ', nameJa: '平泉', type: 'Văn hóa', year: 2011, prefecture: 'Iwate', highlight: 'Khái niệm Phật giáo Tịnh Độ tôn nghiêm thế kỷ 12 với Chùa Chusonji Kim Sắc Đường.' },
  { id: 16, nameVi: 'Quần đảo Ogasawara', nameJa: '小笠原諸島', type: 'Thiên nhiên', year: 2011, prefecture: 'Tokyo', highlight: 'Hòn đảo biệt lập trên Thái Bình Dương với hệ sinh vật tiến hóa độc hữu ví như Galapagos phương Đông.' },
  { id: 17, nameVi: 'Núi Phú Sĩ (Fujisan) - Địa điểm linh thiêng và nguồn cảm hứng nghệ thuật', nameJa: '富士山', type: 'Văn hóa', year: 2013, prefecture: 'Shizuoka/Yamanashi', highlight: 'Đỉnh núi linh thiêng của Thần đạo và cội nguồn bất tận của hội họa truyền thống Ukiyo-e.' },
  { id: 18, nameVi: 'Nhà máy tơ lụa Tomioka và các địa điểm liên quan', nameJa: '富岡製糸場と絹産業遺産群', type: 'Văn hóa', year: 2014, prefecture: 'Gunma', highlight: 'Cột mốc hiện đại hóa công nghiệp dệt may thời kỳ Minh Trị duy tân.' },
  { id: 19, nameVi: 'Các địa điểm của cuộc Cách mạng Công nghiệp thời kỳ Minh Trị', nameJa: '明治日本の産業革命遺産', type: 'Văn hóa', year: 2015, prefecture: 'Kyushu/Yamaguchi', highlight: 'Mạng lưới luyện kim, đóng tàu và khai thác than đá (đảo Hashima / Gunkanjima).' },
  { id: 20, nameVi: 'Tác phẩm kiến trúc của Le Corbusier (Bảo tàng Nghệ thuật Phương Tây)', nameJa: 'ル・コルビュジエの建築作品', type: 'Văn hóa', year: 2016, prefecture: 'Tokyo', highlight: 'Đóng góp xuất sắc cho phong trào Kiến trúc Hiện đại thế kỷ 20 tại công viên Ueno.' },
  { id: 21, nameVi: 'Đảo linh thiêng Okinoshima và các địa điểm liên quan ở Munakata', nameJa: '「神宿る島」宗像・沖ノ島と関連遺産群', type: 'Văn hóa', year: 2017, prefecture: 'Fukuoka', highlight: 'Hòn đảo cấm kỵ nơi cử hành các nghi thức tế thần hàng hải cổ xưa không thay đổi.' },
  { id: 22, nameVi: 'Các địa điểm Kitô giáo tiềm ẩn tại vùng Nagasaki và Amakusa', nameJa: '長崎と天草地方の潜伏キリシタン関連遺産', type: 'Văn hóa', year: 2018, prefecture: 'Nagasaki/Kumamoto', highlight: 'Bằng chứng sinh động về truyền thống tín ngưỡng Kitô giáo bí mật vượt qua 250 năm cấm đạo.' },
  { id: 23, nameVi: 'Nhóm lăng mộ cổ Mozu-Furuichi (Kofun)', nameJa: '百舌鳥・古市古墳群', type: 'Văn hóa', year: 2019, prefecture: 'Osaka', highlight: '49 ngôi mộ hình lỗ khóa khổng lồ từ thế kỷ 4–5 của các Thiên hoàng thời kỳ Kofun.' },
  { id: 24, nameVi: 'Đảo Amami-Oshima, Tokunoshima, phía Bắc đảo Okinawa và đảo Iriomote', nameJa: '奄美大島、徳之島、沖縄島北部及び西表島', type: 'Thiên nhiên', year: 2021, prefecture: 'Kagoshima/Okinawa', highlight: 'Khu hệ sinh vật á nhiệt đới đa dạng với thỏ Amami và mèo rừng Iriomote cực kỳ quý hiếm.' },
  { id: 25, nameVi: 'Các địa điểm thời tiền sử Jomon ở miền Bắc Nhật Bản', nameJa: '北海道・北東北の縄文遺跡群', type: 'Văn hóa', year: 2021, prefecture: 'Hokkaido/Aomori/Iwate/Akita', highlight: '17 di chỉ khảo cổ minh chứng cho xã hội săn bắt hái lượm định cư kéo dài hơn 10.000 năm.' }
];

export interface ReferenceItem {
  id: number;
  title: string;
  language: 'vi' | 'en' | 'ja';
  url?: string;
}

export const REFERENCES_DATA: ReferenceItem[] = [
  { id: 1, title: 'Nguyễn Phúc Lưu (2021), Phát triển du lịch văn hóa theo hướng bền vững: Kinh nghiệm quốc tế và hàm ý với Việt Nam, Luận án Tiến sĩ Kinh tế quốc tế, Trường Đại học Kinh tế (ĐHQGHN), Hà Nội', language: 'vi', url: '' },
  { id: 2, title: 'Trần Thị Hoa (2007), Quản lý di sản với phát triển du lịch của địa phương, nghiên cứu trường hợp di sản vịnh Hạ Long, Trường Đại học Khoa Học Xã Hội và Nhân Văn, (ĐHQGHN), Hà Nội', language: 'vi', url: '' },
  { id: 3, title: 'Đỗ Hà Phương (2016), Nghiên cứu luật bảo tồn di sản văn hóa Nhật Bản, Luận văn thạc sĩ, Trường Đại học Khoa Học Xã Hội và Nhân Văn (ĐHQG Hà Nội), Hà Nội', language: 'vi', url: '' },
  { id: 4, title: 'Nguyễn Phúc Lưu, Kinh nghiệm phát triển bền vững du lịch di sản văn hóa của Nhật Bản và một số khuyến nghị cho Việt Nam', language: 'vi', url: 'https://www.quanlynhanuoc.vn/2020/10/27/kinh-nghiem-phat-trien-ben-vung-du-lich-di-san-van-hoa-cua-nhat-ban-va-mot-so-khuyen-nghi-cho-viet-nam/' },
  { id: 5, title: 'Chiến lược phát triển du lịch Nhật Bản', language: 'vi', url: 'https://bvhttdl.gov.vn/chien-luoc-phat-trien-du-lich-nhat-ban-20190512081540578.html' },
  { id: 6, title: 'Phạm Thị Thu Hà, Phát triển du lịch bền vững của Nhật Bản và một số gợi ý cho Việt Nam', language: 'vi', url: 'https://tapchicongthuong.vn/bai-viet/phat-trien-du-lich-ben-vung-cua-nhat-ban-va-mot-so-goi-y-cho-viet-nam-77353.htm' },
  { id: 7, title: 'Nhật Bản “đau đầu” vì... du lịch phát triển mạnh', language: 'vi', url: 'https://baoquocte.vn/nhat-ban-dau-dau-vi-du-lich-phat-trien-manh-96524.html' },
  { id: 8, title: '4th UNWTO/UNESCO World Conference on Tourism and Culture. Kyoto (Japan), December (2019), "Preserving cultural indentities for the furture of tourism".', language: 'en', url: 'https://www.unwto.org/preserving-cultural-identities-for-the-future-of-tourism' },
  { id: 9, title: 'GVR Report coverHeritage Tourism Market Size, Share & Trends Report Heritage Tourism Market Size, Share & Trends Analysis Report By Type (Cultural, Natural, Intangible), By End-user (30 & Under, 31 To 50, 51 To 70, 71 And Above), By Booking Channel, By Region, And Segment Forecasts, 2022 - 2030', language: 'en', url: 'https://www.grandviewresearch.com/industry-analysis/heritage-tourism-market-report' },
  { id: 10, title: 'https://www.researchgate.net Concept of cultural heritage tourism, 4th January, 2019', language: 'en', url: 'https://www.researchgate.net/publication/330140226_Concept_of_cultural_heritage_tourism' },
  { id: 11, title: 'OECD Tourism Trends and Policies 2020, Japan', language: 'en', url: 'https://www.oecd-ilibrary.org/sites/85e3c6a2-en/index.html?itemId=/content/component/85e3c6a2-en' },
  { id: 12, title: 'OECD Tourism Trends and Policies 2022, Japan', language: 'en', url: 'https://www.oecd-ilibrary.org/sites/01136652-en/index.html?itemId=/content/component/01136652-en' },
  { id: 13, title: 'World Heritage Site', language: 'en', url: 'https://en.wikipedia.org/wiki/World_Heritage_Site' },
  { id: 14, title: 'World Heritage Sites by country', language: 'en', url: 'https://en.wikipedia.org/wiki/World_Heritage_Sites_by_country' },
  { id: 15, title: '観光立国実現に向けたアクション・プログラム', language: 'ja', url: 'https://www.mlit.go.jp/common/001000830.pdf' },
  { id: 16, title: '文化遺産保護制度', language: 'ja', url: 'https://ja.wikipedia.org/wiki/%E6%96%87%E5%8C%96%E9%81%BA%E7%94%A3%E4%BF%9D%E8%AD%B7%E5%88%B6%E5%BA%A6' },
  { id: 17, title: '観光立国推進基本法', language: 'ja', url: 'https://www.mlit.go.jp/kankocho/kankorikkoku/index.html' },
  { id: 18, title: '日本の世界遺産　観光客数ランキング', language: 'ja', url: 'https://nihon-sekaiisan.com/column/kankokyaku-ranking-2017/' },
  { id: 19, title: '日本の世界遺産', language: 'ja', url: 'https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E4%B8%96%E7%95%8C%E9%81%BA%E7%94%A3' },
  { id: 20, title: '国土交通白書 2022, 第1節 観光をめぐる動向', language: 'ja', url: 'https://www.mlit.go.jp/hakusyo/mlit/r03/hakusho/r04/html/n2312000.html' },
  { id: 21, title: '外国人宿泊客数内訳表', language: 'ja', url: 'https://www.pref.kyoto.jp/kanko/news/2019/6/documents/sankou2.pdf' },
  { id: 22, title: 'ならの観光力向上課/観光プロモーション課/MICE推進室 , 観光統計調査 , 外国人訪問客数', language: 'ja', url: 'https://www.pref.nara.jp/44291.htm' },
  { id: 23, title: '2021年の訪日外国人旅行消費額発表', language: 'ja', url: 'https://honichi.com/news/2022/04/26/inboundshohi2021/' },
  { id: 24, title: '観光統計調査', language: 'ja', url: 'https://www.pref.nara.jp/20640.htm' },
  { id: 25, title: '奈良県観光総合戦略', language: 'ja', url: 'https://www.pref.nara.jp/secure/250854/naraken_kanko_sogosenryaku.pdf' },
  { id: 26, title: '統計 , 経済解析室トップページ , 経済解析室ひと言解説集 , 訪日外国人旅行消費の蒸発の影響試算', language: 'ja', url: 'https://www.meti.go.jp/statistics/toppage/report/minikaisetsu/hitokoto_kako/20200804hitokoto.html' },
  { id: 27, title: '京都に観光客殺到でオーバーツーリズムの恐怖、JR東海が打ち出す「仏頼み」の奇策とは？', language: 'ja', url: 'https://diamond.jp/articles/-/323789?page=2' },
  { id: 28, title: '観光収入の分かりやすい還元について', language: 'ja', url: 'https://www.city.kyoto.lg.jp/sogo/page/0000316682.html#:~:text=%E3%81%BE%E3%81%9F%E3%80%81%E8%A6%B3%E5%85%89%E3%81%AB%E3%82%88%E3%82%8B%E5%8A%B9%E6%9E%9C%E3%81%AF,%E4%B8%80%E3%81%A4%E3%81%A8%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%80%82' },
  { id: 29, title: '観光か生活か、それが問題だ　, 激突！京都市長選挙', language: 'ja', url: 'https://www.nhk.or.jp/politics/articles/feature/29643.html' },
  { id: 30, title: '居住者の3000倍の観光客殺到した「白川郷」、コロナ後を見据えた新たな観光スタイルとは？', language: 'ja', url: 'https://honichi.com/news/2020/12/08/shirakawagomisshon/' },
  { id: 31, title: '宮島に「入島税」？　観光客増で新市長「１人１００円」', language: 'ja', url: 'https://www.asahi.com/articles/ASMBP3DFGMBPPITB002.html' },
  { id: 32, title: '白川郷ライトアップは今年から完全予約制に！新体制でのライトアップイベント開催日程を発表', language: 'ja', url: 'https://www.nikkan.co.jp/releases/view/53076' },
  { id: 33, title: '富士山の「登山鉄道」構想が再び浮上　オーバーツーリズム対策というけど…環境保全の実効性は？', language: 'ja', url: 'https://www.tokyo-np.co.jp/article/283368' },
  { id: 34, title: '「京都観光快適度マップ」におけるライブカメラ映像の配信箇所の拡充及び機能充実について', language: 'ja', url: 'https://www.kyokanko.or.jp/news/20220329/' },
  { id: 35, title: '京都市の観光行政を戦略部長に聞いてきた、「量より質」への転換で解決すべき5つの課題', language: 'ja', url: 'https://www.travelvoice.jp/20160323-62441' },
  { id: 36, title: '富士山世界遺産センター', language: 'ja', url: 'https://mtfuji-whc.jp/' },
  { id: 37, title: '産業・観光・雇用振興部 観光局, ならの観光力向上課/観光プロモーション課/MICE推進室, 旅館業・住宅宿泊事業について, 住宅宿泊事業（民泊）について', language: 'ja', url: 'https://www.pref.nara.jp/item/192784.htm' },
  { id: 38, title: '観光公害の現状と対策 ― 京都で何が起こっているのか', language: 'ja', url: 'https://koumu.in/articles/200707' },
  { id: 39, title: '京都・嵐山地区のオーバーツーリズムの実態は？　ゴミ問題から現地の温度差まで取材した', language: 'ja', url: 'https://www.travelvoice.jp/20181018-118844' },
  { id: 40, title: '奈良の鹿 - かわいいだけでは済まされない?!', language: 'ja', url: 'https://www.nara-wu.ac.jp/gp2007/gakusei/tenkai/2008/narakouen/index.html' },
  { id: 41, title: '富士山の入山料・富士山保全協力金', language: 'ja', url: 'https://www.fujisan-net.jp/post_detail/2001417' },
  { id: 42, title: '日本政府観光局（JNTO）(2025), 訪日外客統計（2024年12月および年間推計値・確定値：年間3,687万人）', language: 'ja', url: 'https://www.jnto.go.jp/statistics/data/visitors-statistics/' },
  { id: 43, title: '観光庁 (2025), 訪日外国人消費動向調査（2024年暦年確報値：年間8.14兆円）', language: 'ja', url: 'https://www.mlit.go.jp/kankocho/tokei_hakusyo/shohidoko.html' },
  { id: 44, title: '京都市産業観光局 / 公益社団法人 京都市観光協会（DMO KYOTO）(2025), 京都観光総合調査（令和6年・2024年データ：外国人宿泊客821万人）', language: 'ja', url: 'https://www.city.kyoto.lg.jp/sankan/page/0000354591.html' },
  { id: 45, title: '奈良県観光局 / 観光データポータル「みるなら」(2025), 奈良県観光統計調査（令和6年・2024年推計確報：外国人訪問客314万人・消費額2,060億円）', language: 'ja', url: 'https://nara-tourism-data.pref.nara.jp/' }
];
