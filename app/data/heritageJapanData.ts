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
    { year: '2011', value: 6.2, note: 'Động đất sóng thần Tohoku' },
    { year: '2012', value: 8.4 },
    { year: '2013', value: 10.4, note: 'Mốc kích cầu 06/2013' },
    { year: '2014', value: 13.4 },
    { year: '2015', value: 19.7 },
    { year: '2016', value: 24.0 },
    { year: '2017', value: 28.7 },
    { year: '2018', value: 31.2 },
    { year: '2019', value: 31.9, note: 'Đỉnh lịch sử trước dịch' },
    { year: '2020', value: 4.1, note: 'Đại dịch COVID-19' },
    { year: '2021', value: 0.2 },
    { year: '2022', value: 3.4 },
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
    { year: '2020', value: 0.70 },
    { year: '2021', value: 0.10 },
  ] as TimeSeriesPoint[],

  // Chart 3: Chỉ số hóa tốc độ tăng trưởng khách quốc tế (2013 = 100)
  indexedGrowth2013To2019: [
    { year: '2013', japan: 100, kyoto: 100, nara: 100 },
    { year: '2014', japan: 128.8, kyoto: 133.5, nara: 144.8 },
    { year: '2015', japan: 189.4, kyoto: 216.4, nara: 224.1 },
    { year: '2016', japan: 230.8, kyoto: 373.8, nara: 362.3 },
    { year: '2017', japan: 276.0, kyoto: 376.9, nara: 457.5 },
    { year: '2018', japan: 300.0, kyoto: 417.5, nara: 609.4 },
    { year: '2019', japan: 306.7, kyoto: 533.0, nara: 762.8 },
  ],

  // Chart 4: Quy mô thị trường toàn cầu & vị thế Nhật Bản
  globalBenchmarks: [
    { label: 'Mỹ & Top dẫn đầu (Tham chiếu)', value: 556.96, unit: 'Tỷ USD (Thị trường Di sản 2021)' },
    { label: 'Dự báo Du lịch Di sản Toàn cầu (2030)', value: 778.07, unit: 'Tỷ USD (CAGR 3,8%/năm)' },
    { label: 'Quy mô Du lịch Nhật Bản (2019 - Hạng 3 TG)', value: 375.4, unit: 'Tỷ USD (41,94 nghìn tỷ Yên)' },
    { label: 'Quy mô Du lịch Đức (2019 - Hạng 4 TG)', value: 344.8, unit: 'Tỷ USD' },
  ],

  // Chart 5: Biểu đồ 3.2 - Khách quốc tế đến Kyoto (2008 - 2023, Nghìn người)
  kyotoVisitors: [
    { year: '2008', value: 926.8 },
    { year: '2009', value: 937.2 },
    { year: '2010', value: 783.8 },
    { year: '2011', value: 983.9 },
    { year: '2012', value: 515.4 },
    { year: '2013', value: 844.9 },
    { year: '2014', value: 1127.9 },
    { year: '2015', value: 1828.6 },
    { year: '2016', value: 3158.6 },
    { year: '2017', value: 3184.8 },
    { year: '2018', value: 3527.8 },
    { year: '2019', value: 4503.3 },
    { year: '2020', value: 3799.0 },
    { year: '2021', value: 448.8 },
    { year: '2022', value: 54.4 },
    { year: '2023', value: 576.1 },
  ] as TimeSeriesPoint[],

  // Chart 6: Biểu đồ 3.3 - Khách quốc tế đến Cố đô Nara (2009 - 2020, Nghìn người)
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
    { year: '2020', value: 28.9 },
  ] as TimeSeriesPoint[],

  // Chart 7: Biểu đồ 3.5 & 3.6 - Chi tiêu du lịch tại Kyoto & Nara (Tỷ Yên)
  kyotoSpending: [
    { year: '2008', value: 649.1 },
    { year: '2009', value: 655.9 },
    { year: '2010', value: 608.1 },
    { year: '2011', value: 648.8 },
    { year: '2014', value: 699.4 },
    { year: '2015', value: 761.7 },
    { year: '2016', value: 970.1 },
    { year: '2017', value: 1085.5 },
    { year: '2018', value: 1126.4 },
    { year: '2019', value: 1308.1 },
    { year: '2020', value: 1236.2 },
  ] as TimeSeriesPoint[],

  naraSpending: [
    { year: '2013', value: 872.6 },
    { year: '2014', value: 892.4 },
    { year: '2015', value: 994.6 },
    { year: '2016', value: 1035.9 },
    { year: '2017', value: 1128.6 },
    { year: '2018', value: 1208.0 },
    { year: '2019', value: 1147.2 },
    { year: '2020', value: 402.2 },
    { year: '2021', value: 428.0 },
    { year: '2022', value: 598.0 },
  ] as TimeSeriesPoint[],

  // Chart 8: Cơ cấu khách Nội địa vs Quốc tế năm 2017 (Triệu lượt)
  visitorMix2017: [
    { site: 'Cố đô Kyoto', domestic: 53.62, international: 3.53, intlShare: 6.2 },
    { site: 'Cố đô Nara', domestic: 16.31, international: 1.99, intlShare: 10.9 },
    { site: 'Núi Phú Sĩ (Fuji)', domestic: 6.40, international: 2.00, intlShare: 23.8 },
  ],

  // Chart 9: Độ lệch Cung - Cầu lưu trú tại Kyoto (2014 vs 2019)
  kyotoSupplyDemandMismatch: {
    visitors2014: 1.13, // Triệu khách quốc tế
    visitors2019: 4.50, // Triệu khách quốc tế (+299%)
    rooms2014: 30.0, // Nghìn phòng (<30.000)
    rooms2019: 53.0, // Nghìn phòng (+76.7%)
  },

  // Chart 10: Tác động kinh tế đa chiều tại Kyoto & Toàn quốc (2019)
  economicShareComparison: [
    { metric: 'Đóng góp GDP Nhật Bản (2000)', share: 2.2 },
    { metric: 'Đóng góp GDP Nhật Bản (2019)', share: 7.5 },
    { metric: 'Tỷ trọng việc làm toàn quốc (2019 - >4M việc)', share: 6.9 },
    { metric: 'Đóng góp GDP TP. Kyoto (2014)', share: 7.0 },
    { metric: 'Đóng góp GDP TP. Kyoto (2019)', share: 12.0 },
    { metric: 'Đóng góp Thuế TP. Kyoto (39 tỷ Yên)', share: 12.8 },
    { metric: 'Đóng góp Lao động TP. Kyoto (153.000 người)', share: 12.4 },
  ],

  // Chart 11: Cường độ quá tải tại các điểm di sản nhạy cảm (2019)
  overtourismHotspots: [
    { site: 'Núi Phú Sĩ (2019 vs 2012: gấp 2,2x)', visitorsMillion: 5.06, benchmarkMillion: 2.3 },
    { site: 'Đảo Miyajima - Đền Itsukushima (2019)', visitorsMillion: 4.60, benchmarkMillion: 2.0 },
    { site: 'Cố đô Kyoto - Khách quốc tế (2019)', visitorsMillion: 4.50, benchmarkMillion: 1.13 },
    { site: 'Cố đô Nara - Khách quốc tế (2019)', visitorsMillion: 3.32, benchmarkMillion: 0.63 },
    { site: 'Làng cổ Shirakawa-go (Chỉ có 600 cư dân)', visitorsMillion: 1.80, benchmarkMillion: 0.5 },
  ],

  // Chart 12: Ma trận điểm áp lực vs. mức độ can thiệp chính sách (Thang 100)
  sustainabilityScores: [
    { site: 'Cố đô Kyoto', crowdingPressure: 95, commercialization: 90, ecoWasteRisk: 85, policyResponse: 92 },
    { site: 'Cố đô Nara', crowdingPressure: 80, commercialization: 78, ecoWasteRisk: 88, policyResponse: 82 },
    { site: 'Núi Phú Sĩ', crowdingPressure: 88, commercialization: 75, ecoWasteRisk: 82, policyResponse: 86 },
    { site: 'Làng Shirakawa-go', crowdingPressure: 98, commercialization: 65, ecoWasteRisk: 78, policyResponse: 88 },
    { site: 'Đền Itsukushima', crowdingPressure: 84, commercialization: 70, ecoWasteRisk: 75, policyResponse: 85 },
  ],

  // Ma trận 5 Case Studies ở Chương 3.2
  caseStudies: [
    {
      site: 'Cố đô Kyoto',
      prefecture: 'Phủ Kyoto',
      type: 'Di sản Văn hóa (1994)',
      pressureMetric: '4,5M khách quốc tế (2019) | Thiếu lưu trú (53k phòng)',
      coreIssue:
        'Tắc nghẽn xe buýt tại Gion và Kinkakuji; du khách thuê chung cư dân sinh gây ồn; rác thải tại Arashiyama.',
      intervention:
        'Lắp camera trực tiếp báo tắc nghẽn thời gian thực; phân tán khách ra 6 vùng ven; mở khách sạn cao cấp (Park Hyatt, Aman).',
      status: 'Đang vận hành hiệu quả',
    },
    {
      site: 'Cố đô Nara',
      prefecture: 'Tỉnh Nara',
      type: 'Di sản Văn hóa (1998)',
      pressureMetric: '3,318M khách quốc tế (2019) | Doanh thu giảm năm 2019',
      coreIssue:
        'Thiếu khách sạn lưu trú qua đêm; rác nhựa do du khách cho hươu ăn gây hại đàn hươu và nông nghiệp.',
      intervention:
        'Trợ cấp vị trí xây cơ sở lưu trú; mở JW Marriott, Fufu Nara; cho phép cải tạo tài sản văn hóa làm nơi lưu trú.',
      status: 'Đang mở rộng lưu trú',
    },
    {
      site: 'Núi Phú Sĩ (Fuji)',
      prefecture: 'Yamanashi & Shizuoka',
      type: 'Di sản Văn hóa (2013)',
      pressureMetric: '5,06M khách (2019, gấp 2,2 lần năm 2012)',
      coreIssue:
        'Quá tải leo núi theo mùa, rủi ro an toàn và xả rác trên các cung đường mòn.',
      intervention:
        'Lập Quỹ hợp tác bảo tồn (2014); mở Trung tâm Di sản Thế giới leo núi ảo VR (2017); đề xuất đường sắt leo núi.',
      status: 'Quỹ và Trung tâm VR vận hành tốt; Đường sắt đang thảo luận',
    },
    {
      site: 'Làng cổ Shirakawa-go & Gokayama',
      prefecture: 'Gifu & Toyama',
      type: 'Di sản Văn hóa (1995)',
      pressureMetric: '1,8M khách/năm trên 600 dân bản địa (3.000:1)',
      coreIssue:
        'Vượt sức chứa hạ tầng dịp Lễ hội ánh sáng mùa đông; tiếng ồn và rác thải ảnh hưởng sinh hoạt cộng đồng.',
      intervention:
        'Bắt buộc đặt chỗ trước 100% đêm thắp sáng, tăng giá vé, giới hạn bãi đỗ xe và lối lên đài quan sát.',
      status: 'Đã kiểm soát tốt mùa cao điểm',
    },
    {
      site: 'Đền Itsukushima (Đảo Miyajima)',
      prefecture: 'Hiroshima',
      type: 'Di sản Văn hóa (1996)',
      pressureMetric: '4,6M lượt khách lên đảo (2019)',
      coreIssue:
        'Lượng khách lớn gây áp lực lên công trình tôn giáo cổ và môi trường biển đảo.',
      intervention:
        'Thu thuế du khách lên đảo (100 Yên/người) để tạo quỹ tài chính trực tiếp cho bảo tồn di sản.',
      status: 'Đã áp dụng thu phí bảo tồn',
    },
  ] as CaseStudyMatrixItem[],

  // Phần thừa nhận thiếu sót của bài niên luận gốc
  thesisLimitations: [
    {
      id: 'LIM-01',
      category: 'Độ lệch biến đại diện (Proxy Metric Bias)',
      severity: 'Cao',
      flawInThesis:
        'Thống kê Nhật Bản không tách riêng mã ngành du lịch di sản. Niên luận dùng tổng khách quốc tế và số liệu Kyoto, Nara làm proxy.',
      portfolioFix:
        'Minh bạch giả định proxy; bổ sung cơ cấu khách quốc tế/nội địa (2017) để bóc tách tỷ trọng thực tế.',
    },
    {
      id: 'LIM-02',
      category: 'Phạm vi khảo sát hẹp so với tên đề tài',
      severity: 'Cao',
      flawInThesis:
        'Đề tài khảo sát 25 di sản UNESCO nhưng chuỗi dữ liệu định lượng Chương 3.1 chỉ tập trung vào Kyoto và Nara.',
      portfolioFix:
        'Mở rộng số liệu điểm nóng sang Núi Phú Sĩ (5,06M khách), Itsukushima (4,6M) và Shirakawa-go (1,8M).',
    },
    {
      id: 'LIM-03',
      category: 'Chưa kiểm định quan hệ nhân quả',
      severity: 'Trung bình',
      flawInThesis:
        'Niên luận quy tăng trưởng sau 2013 cho chính sách, chưa bóc tách tác động của tỷ giá Yên thấp (Abenomics) và vé máy bay giá rẻ.',
      portfolioFix:
        'Bổ sung biểu đồ chỉ số hóa (2013 = 100) so sánh Kyoto/Nara với cả nước để chứng minh sức hút riêng của di sản.',
    },
    {
      id: 'LIM-04',
      category: 'Sai sót chế bản và mốc thời gian',
      severity: 'Đã hiệu đính',
      flawInThesis:
        'Mục 3.1.2 ghi nhầm chi tiêu đạt 4,81 nghìn tỷ Yên năm 2020 (thực tế là 2019; năm 2020 giảm còn 0,7 nghìn tỷ do COVID-19).',
      portfolioFix:
        'Hiệu đính chính xác mốc đỉnh 2019 trên toàn bộ biểu đồ, thẻ KPI và tài liệu hiển thị.',
    },
    {
      id: 'LIM-05',
      category: 'Độ chuẩn hóa nguồn tài liệu',
      severity: 'Trung bình',
      flawInThesis:
        'Niên luận sử dụng 4 liên kết Wikipedia ([13], [14], [16], [19]) thay vì toàn bộ nguồn thống kê gốc.',
      portfolioFix:
        'Lọc bỏ nguồn Wikipedia; chuẩn hóa 100% dữ liệu theo UNWTO, OECD, JNTO/MLIT và số liệu thống kê cấp tỉnh.',
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
    nameVi: 'Số lượng khách du lịch nước ngoài đến Kyoto (2008 – 2023)',
    nameEn: 'International Visitors to Kyoto (2008 – 2023)',
    imageSrc: '/heritage-japan/thesis-chart-3-2.png',
    unitVi: 'Nghìn người',
    unitEn: 'Thousand visitors',
    pageInDoc: 31,
  },
  {
    stt: 3,
    chartId: '3.3',
    nameVi: 'Số lượng khách du lịch nước ngoài đến Cố đô Nara (2009 – 2020)',
    nameEn: 'International Visitors to Nara (2009 – 2020)',
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
    nameVi: 'Chi tiêu du lịch tại Thành phố Kyoto (2008 – 2020)',
    nameEn: 'Tourism Expenditure in Kyoto City (2008 – 2020)',
    imageSrc: '/heritage-japan/thesis-chart-3-5.png',
    unitVi: 'Tỷ Yên',
    unitEn: 'Billion JPY',
    pageInDoc: 33,
  },
  {
    stt: 6,
    chartId: '3.6',
    nameVi: 'Chi tiêu du lịch tại Nara (2013 – 2022)',
    nameEn: 'Tourism Expenditure in Nara (2013 – 2022)',
    imageSrc: '/heritage-japan/thesis-chart-3-6.png',
    unitVi: 'Tỷ Yên (theo niên luận: nghi vấn, xem kiểm định)',
    unitEn: 'Billion JPY (as labelled: disputed, see audit)',
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
  { year: '2022', value: 3.4, isThesis: true, counterfactual: 14.1 },  // Bắt đầu mở cửa lại cuối 2022
  { year: '2023', value: 25.1, isThesis: false, counterfactual: 14.9, source: 'JNTO (25.07M)' },
  { year: '2024', value: 36.9, isThesis: false, counterfactual: 15.7, source: 'JNTO (36.87M kỷ lục mới)' },
  { year: '2025', value: 42.7, isThesis: false, counterfactual: 16.5, source: 'JNTO (42.68M kỷ lục lịch sử)' }
];

// Biểu đồ 3.2: Khách nước ngoài đến Kyoto (nghìn người)
// Niên luận: Cục Du lịch Kyoto / DMO KYOTO (2008 - 2023)
// LƯU Ý KIỂM ĐỊNH DATA: Năm 2020 trong đồ thị gốc của Niên luận ghi 3799k (lỗi đánh máy thiếu dấu phẩy: 379.9k).
export const kyotoVisitorsData = [
  { year: '2008', value: 926.8, thesisRawValue: 926.8, isThesis: true },
  { year: '2009', value: 937.2, thesisRawValue: 937.2, isThesis: true },
  { year: '2010', value: 783.8, thesisRawValue: 783.8, isThesis: true },
  { year: '2011', value: 983.9, thesisRawValue: 983.9, isThesis: true },
  { year: '2012', value: 515.4, thesisRawValue: 515.4, isThesis: true },
  { year: '2013', value: 844.9, thesisRawValue: 844.9, isThesis: true },
  { year: '2014', value: 1127.9, thesisRawValue: 1127.9, isThesis: true },
  { year: '2015', value: 1828.6, thesisRawValue: 1828.6, isThesis: true },
  { year: '2016', value: 3158.6, thesisRawValue: 3158.6, isThesis: true },
  { year: '2017', value: 3184.8, thesisRawValue: 3184.8, isThesis: true },
  { year: '2018', value: 3527.8, thesisRawValue: 3527.8, isThesis: true },
  { year: '2019', value: 4503.3, thesisRawValue: 4503.3, isThesis: true },
  // 2020: Niên luận ghi 3799 (3.799k) - Đã kiểm định và chuẩn hóa thành 379.9k
  { year: '2020', value: 379.9, thesisRawValue: 3799.0, isThesis: true, hasAnomaly: true, auditNote: 'Lỗi gõ phím trong đồ thị gốc: ghi 3799 thay vì 379.9k' },
  { year: '2021', value: 448.8, thesisRawValue: 448.8, isThesis: true },
  { year: '2022', value: 54.4, thesisRawValue: 54.4, isThesis: true },
  { year: '2023', value: 576.1, thesisRawValue: 576.1, isThesis: true },
  { year: '2024', value: 8210.0, isThesis: false, source: 'DMO KYOTO 2024' }
];

// Biểu đồ 3.3: Khách nước ngoài đến Cố đô Nara (nghìn người)
// Niên luận: Cục Du lịch Tỉnh Nara (2009 - 2020)
export const naraVisitorsData = [
  { year: '2009', value: 407.0, isThesis: true },
  { year: '2010', value: 629.0, isThesis: true },
  { year: '2011', value: 174.0, isThesis: true }, // Tác động động đất Tohoku
  { year: '2012', value: 267.0, isThesis: true },
  { year: '2013', value: 435.0, isThesis: true },
  { year: '2014', value: 630.0, isThesis: true },
  { year: '2015', value: 975.0, isThesis: true },
  { year: '2016', value: 1576.0, isThesis: true },
  { year: '2017', value: 1990.0, isThesis: true },
  { year: '2018', value: 2651.0, isThesis: true },
  { year: '2019', value: 3318.0, isThesis: true }, // Đỉnh cao 3.32 triệu khách
  { year: '2020', value: 28.9, isThesis: true },   // Rơi tự do -99.1%
  { year: '2021', value: 456.3, isThesis: false, source: 'Cục Thống kê Nara' },
  { year: '2022', value: 663.5, isThesis: false, source: 'Cục Thống kê Nara' },
  { year: '2023', value: 2581.7, isThesis: false, source: 'Cục Thống kê Nara' },
  { year: '2024', value: 3140.0, isThesis: false, source: 'Cục Thống kê Nara (Ước tính)' }
];

// So sánh Kyoto vs Nara (nghìn người)
export const kyotoNaraVisitorsData = [
  { year: '2009', kyoto: 937.2, nara: 407.0 },
  { year: '2010', kyoto: 783.8, nara: 629.0 },
  { year: '2011', kyoto: 983.9, nara: 174.0 },
  { year: '2012', kyoto: 515.4, nara: 267.0 },
  { year: '2013', kyoto: 844.9, nara: 435.0 },
  { year: '2014', kyoto: 1127.9, nara: 630.0 },
  { year: '2015', kyoto: 1828.6, nara: 975.0 },
  { year: '2016', kyoto: 3158.6, nara: 1576.0 },
  { year: '2017', kyoto: 3184.8, nara: 1990.0 },
  { year: '2018', kyoto: 3527.8, nara: 2651.0 },
  { year: '2019', kyoto: 4503.3, nara: 3318.0 },
  { year: '2020', kyoto: 379.9, nara: 28.9 },
  { year: '2021', kyoto: 448.8, nara: 456.3 },
  { year: '2022', kyoto: 54.4, nara: 663.5 },
  { year: '2023', kyoto: 576.1, nara: 2581.7 },
  { year: '2024', kyoto: 8210.0, nara: 3140.0 },
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
  { year: '2020', value: 0.70, isThesis: true },
  { year: '2021', value: 0.10, isThesis: true },
  { year: '2022', value: 0.75, isThesis: false, source: 'JTA (0.75T)' },
  { year: '2023', value: 5.31, isThesis: false, source: 'JTA (5.31T)' },
  { year: '2024', value: 8.14, isThesis: false, source: 'JTA (8.14T kỷ lục)' },
  { year: '2025', value: 9.46, isThesis: false, source: 'JTA (9.46T sơ bộ)' }
];

// Biểu đồ 3.5: Chi tiêu tại Kyoto (tỷ Yên)
// Niên luận: Kyoto City Tourism Survey (2008 - 2020)
export const kyotoSpendData = [
  { year: '2008', value: 649.1, isThesis: true },
  { year: '2009', value: 655.9, isThesis: true },
  { year: '2010', value: 608.1, isThesis: true },
  { year: '2011', value: 648.8, isThesis: true },
  { year: '2014', value: 699.4, isThesis: true },
  { year: '2015', value: 761.7, isThesis: true },
  { year: '2016', value: 970.1, isThesis: true },
  { year: '2017', value: 1085.5, isThesis: true },
  { year: '2018', value: 1126.4, isThesis: true },
  { year: '2019', value: 1308.1, isThesis: true },
  { year: '2020', value: 1236.2, isThesis: true },
  { year: '2021', value: 671.0, isThesis: false, source: 'DMO KYOTO' },
  { year: '2022', value: 980.0, isThesis: false, source: 'DMO KYOTO' },
  { year: '2023', value: 1536.6, isThesis: false, source: 'DMO KYOTO' },
  { year: '2024', value: 1907.5, isThesis: false, source: 'DMO KYOTO' }
];

// Biểu đồ 3.6: Chi tiêu tại Nara (2013 - 2022)
// LƯU Ý KIỂM ĐỊNH: Tiêu đề biểu đồ ghi "tỷ yên", nhưng các con số (872.6, 1208...) phản ánh
// số liệu tổng chi tiêu gồm cả khách nội địa hoặc đơn vị trăm triệu Yên (億円).
export const naraSpendData = [
  { year: '2013', value: 872.6, isThesis: true },
  { year: '2014', value: 892.4, isThesis: true },
  { year: '2015', value: 994.6, isThesis: true },
  { year: '2016', value: 1035.9, isThesis: true },
  { year: '2017', value: 1128.6, isThesis: true },
  { year: '2018', value: 1208.0, isThesis: true },
  { year: '2019', value: 1147.2, isThesis: true },
  { year: '2020', value: 402.2, isThesis: true },
  { year: '2021', value: 428.0, isThesis: true },
  { year: '2022', value: 598.0, isThesis: true },
  { year: '2023', value: 1807.0, isThesis: false, source: 'Nara Tourism Portal' },
  { year: '2024', value: 2060.0, isThesis: false, source: 'Nara Tourism Portal' }
];

// So sánh chi tiêu khu vực Kyoto & Nara
export const spendRegionalComparisonData = [
  { year: '2013', kyoto: 648.8, nara: 872.6 },
  { year: '2014', kyoto: 699.4, nara: 892.4 },
  { year: '2015', kyoto: 761.7, nara: 994.6 },
  { year: '2016', kyoto: 970.1, nara: 1035.9 },
  { year: '2017', kyoto: 1085.5, nara: 1128.6 },
  { year: '2018', kyoto: 1126.4, nara: 1208.0 },
  { year: '2019', kyoto: 1308.1, nara: 1147.2 },
  { year: '2020', kyoto: 1236.2, nara: 402.2 },
  { year: '2021', kyoto: 671.0, nara: 428.0 },
  { year: '2022', kyoto: 980.0, nara: 598.0 },
  { year: '2023', kyoto: 1536.6, nara: 1807.0 },
  { year: '2024', kyoto: 1907.5, nara: 2060.0 }
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
    id: 'audit-kyoto-2020',
    chartId: '3.2',
    titleVi: 'Phát hiện Lỗi Nhập Liệu Điểm Dị Biệt (Outlier Typo) tại Kyoto 2020',
    titleEn: 'Data Typo & Outlier Detection: Kyoto 2020 Inbound Visitors',
    severity: 'high',
    summaryVi: 'Cột năm 2020 trong đồ thị gốc ghi nhận 3,799 nghìn khách, mâu thuẫn hoàn toàn với thực tế toàn quốc mùa dịch.',
    summaryEn: 'The 2020 bar in the original chart reads 3,799k visitors, a major logical contradiction during global lockdown.',
    originalInDoc: 'Biểu đồ 3.2 (trang 31): Giá trị cột năm 2020 vẽ cao chạm mốc 3,800 nghìn người (nhãn số: 3799).',
    auditExplanationVi: 'Năm 2020, đại dịch COVID-19 bùng phát khiến toàn bộ Nhật Bản chỉ đón 4.1 triệu khách quốc tế (giảm 87%). Một thành phố như Kyoto không thể đón tới 3.8 triệu khách (chiếm 92% toàn quốc). Thực tế theo DMO Kyoto (京都観光総合調査), số lượng khách lưu trú quốc tế năm 2020 là 379.9 nghìn khách. Tác giả niên luận đã gõ nhầm dấu chấm thập phân (3799 thay vì 379.9), khiến đồ thị Excel tự động vẽ cột cao bất thường.',
    auditExplanationEn: 'In 2020, nationwide inbound visitors plunged to 4.12M due to COVID border closures. Kyoto alone could not possibly account for 3.8M foreign visitors (92% of the national total). Official Kyoto DMO reports record 379.9 thousand international overnight visitors. The author evidently missed a decimal separator (3799 instead of 379.9), which skewed the Excel chart bar.',
    suggestedActionVi: 'Chuẩn hóa số liệu thành 379.9k trong biểu đồ tương tác, đồng thời cung cấp nút chuyển đổi xem "Đồ thị nguyên bản" để đối chiếu minh bạch.',
    suggestedActionEn: 'Normalize the clean time-series to 379.9k while providing a toggle to view the authentic unedited thesis graph.'
  },
  {
    id: 'audit-nara-unit',
    chartId: '3.6',
    titleVi: 'Phát hiện Nhập Nhằng Đơn Vị Đo Lường: Doanh Thu Nara (Tỷ Yên vs Trăm Triệu Yên)',
    titleEn: 'Measurement Unit Discrepancy: Nara Tourism Expenditure',
    severity: 'medium',
    summaryVi: 'Biểu đồ ghi đơn vị "tỷ yên" với quy mô 1,208 tỷ Yên, gần bằng Kyoto dù lượng khách chỉ bằng một phần ba.',
    summaryEn: 'Chart 3.6 is labelled "Billion JPY" with a peak of 1,208B, rivaling Kyoto despite having 1/3 the tourists.',
    originalInDoc: 'Biểu đồ 3.6 (trang 34): "Chi tiêu du lịch tại Thành phố Nara giai đoạn 2013 - 2022 (đơn vị: tỷ yên)". Giá trị đỉnh năm 2018 là 1208.',
    auditExplanationVi: 'Trong thống kê địa phương của Nhật Bản (奈良県観光統計調査), số liệu chi tiêu cấp tỉnh thường được công bố theo đơn vị 億円 (trăm triệu Yên / 100M JPY). Nếu đơn vị là 億円 thì 1,208 億円 tương đương khoảng 120.8 tỷ Yên. Nếu hiểu theo "tỷ Yên" thì 1,208 tỷ Yên là quy mô quá lớn đối với một tỉnh nhỏ như Nara (gần bằng toàn bộ doanh thu du lịch Kyoto 1,308 tỷ Yên). Việc nhầm lẫn giữa 億円 và 10億円 (tỷ Yên) là sai sót phổ biến khi dịch thuật tài liệu kinh tế Nhật Bản sang tiếng Việt.',
    auditExplanationEn: 'Japanese prefectural reports typically report spending in 億円 (100 million JPY). If 1,208 represents 億円, total spending was ~120.8B JPY. If interpreted literally as billions of JPY, 1,208B JPY for Nara would implausibly rival Kyoto (1,308B JPY) despite Nara being primarily a day-trip destination with far lower hotel capacity.',
    suggestedActionVi: 'Thêm chú thích cảnh báo kiểm định dữ liệu cho người đọc và giải thích bối cảnh kinh tế đằng sau.',
    suggestedActionEn: 'Add an analytical auditing caveat and explain the economic context of day-tripper economics.'
  },
  {
    id: 'audit-daytripper-paradox',
    chartId: '3.3 vs 3.5',
    titleVi: 'Phát hiện Bản Chất: Nghịch Lý Khách Đi Trong Ngày (Day-Tripper Paradox) tại Nara',
    titleEn: 'Analytical Discovery: The Day-Tripper Paradox in Nara Prefecture',
    severity: 'insight',
    summaryVi: 'Lượng khách đến Nara tăng 7.6 lần (2011–2019) nhưng tỷ trọng lưu trú qua đêm dưới 15%, gây áp lực hạ tầng nhưng thu ngân sách thấp.',
    summaryEn: 'Inbound visitors to Nara grew 7.6x (2011–2019), but overnight stay share was <15%, creating high strain but low local spend.',
    originalInDoc: 'Niên luận so sánh số lượng khách Nara (3.3M năm 2019) và Kyoto (4.5M) nhưng chưa phân rã cơ cấu lưu trú.',
    auditExplanationVi: 'Nara cách Kyoto và Osaka chỉ 45 phút đi tàu nhanh Kintetsu/JR. Du khách thường lưu trú tại Osaka hoặc Kyoto rồi ghé công viên Nara ngắm hươu trong 3–4 tiếng rồi quay về. Hệ quả: Nara chịu toàn bộ ngoại ứng tiêu cực (rác thải, kẹt xe, ô nhiễm) nhưng không thu được thuế lưu trú hay chi tiêu khách sạn. Đây chính là lý do Tỉnh Nara ban hành Pháp lệnh lưu trú cao cấp (2020) để thu hút các chuỗi khách sạn sang (JW Marriott, Fufu Nara).',
    auditExplanationEn: 'Nara is only 45 minutes by rapid train from Osaka and Kyoto. Over 85% of foreign visitors are day-trippers who feed the sacred deer for 3 hours and return to Osaka/Kyoto hotels. Nara absorbs municipal maintenance and trash costs without capturing lodging taxes, leading to the 2020 Luxury Accommodation Ordinance.',
    suggestedActionVi: 'Trình bày mô hình đối sánh cấu trúc chi tiêu và thời gian lưu trú giữa Kyoto và Nara.',
    suggestedActionEn: 'Present a comparative structural analysis of stay duration and expenditure per visitor.'
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
