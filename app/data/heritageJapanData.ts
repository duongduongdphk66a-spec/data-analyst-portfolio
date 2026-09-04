/**
 * Heritage Japan Tourism — Academic Thesis Data & Research Telemetry
 * Source: Ma Van Hung (2024), Academic Thesis, Faculty of Oriental Studies (USSH - VNU Hanoi)
 * Supervisor: Dr. Vo Minh Vu
 */

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

export interface AcronymItem {
  stt: number;
  abbr: string;
  meaningEn: string;
  meaningVi: string;
}

export const ACRONYMS: AcronymItem[] = [
  { stt: 1, abbr: 'CAGR', meaningEn: 'Compounded Annual Growth Rate', meaningVi: 'Tốc độ tăng trưởng kép hàng năm' },
  { stt: 2, abbr: 'JNTO', meaningEn: 'Japan National Tourism Organization', meaningVi: 'Cơ quan Xúc tiến Du lịch Nhật Bản' },
  { stt: 3, abbr: 'MICE', meaningEn: 'Meeting Incentives Conventions Exhibitions', meaningVi: 'Du lịch kết hợp hội nghị, hội thảo, triển lãm' },
  { stt: 4, abbr: 'UNESCO', meaningEn: 'United Nations Educational, Scientific and Cultural Organization', meaningVi: 'Tổ chức Giáo dục, Khoa học và Văn hóa LHQ' },
  { stt: 5, abbr: 'UNWTO', meaningEn: 'United Nations World Tourism Organization', meaningVi: 'Tổ chức Du lịch Thế giới' },
  { stt: 6, abbr: 'VR', meaningEn: 'Virtual Reality', meaningVi: 'Công nghệ Thực tế ảo' },
];

export interface ChartCatalogItem {
  stt: number;
  chartId: string;
  nameVi: string;
  nameEn: string;
  unitVi: string;
  unitEn: string;
  imageSrc: string;
  pageInDoc: number;
}

export const THESIS_CHARTS_CATALOG: ChartCatalogItem[] = [
  {
    stt: 1,
    chartId: '3.1',
    nameVi: 'Số lượng khách du lịch nước ngoài đến Nhật Bản (2003 – 2022)',
    nameEn: 'International Visitors to Japan (2003 – 2022)',
    unitVi: 'Triệu người',
    unitEn: 'Million visitors',
    imageSrc: '/heritage_japan/image1.png',
    pageInDoc: 30,
  },
  {
    stt: 2,
    chartId: '3.2',
    nameVi: 'Số lượng khách du lịch nước ngoài đến Thành phố Kyoto (2008 – 2023)',
    nameEn: 'International Inbound Visitors to Kyoto City (2008 – 2023)',
    unitVi: 'Nghìn người',
    unitEn: 'Thousand visitors',
    imageSrc: '/heritage_japan/image2.png',
    pageInDoc: 31,
  },
  {
    stt: 3,
    chartId: '3.3',
    nameVi: 'Số lượng khách du lịch nước ngoài đến Cố đô Nara (2011 – 2020)',
    nameEn: 'International Inbound Visitors to Nara Prefecture (2011 – 2020)',
    unitVi: 'Nghìn người',
    unitEn: 'Thousand visitors',
    imageSrc: '/heritage_japan/image3.png',
    pageInDoc: 31,
  },
  {
    stt: 4,
    chartId: '3.4',
    nameVi: 'Chi tiêu du lịch của khách quốc tế tại Nhật Bản (2010 – 2021)',
    nameEn: 'Inbound Tourism Expenditure in Japan (2010 – 2021)',
    unitVi: 'Nghìn tỷ Yên',
    unitEn: 'Trillion JPY',
    imageSrc: '/heritage_japan/image4.png',
    pageInDoc: 33,
  },
  {
    stt: 5,
    chartId: '3.5',
    nameVi: 'Chi tiêu du lịch tại Thành phố Kyoto (2008 – 2020)',
    nameEn: 'Tourism Expenditure in Kyoto City (2008 – 2020)',
    unitVi: 'Tỷ Yên',
    unitEn: 'Billion JPY',
    imageSrc: '/heritage_japan/image5.png',
    pageInDoc: 33,
  },
  {
    stt: 6,
    chartId: '3.6',
    nameVi: 'Chi tiêu du lịch tại Tỉnh Nara (2013 – 2022)',
    nameEn: 'Tourism Expenditure in Nara Prefecture (2013 – 2022)',
    unitVi: 'Tỷ Yên',
    unitEn: 'Billion JPY',
    imageSrc: '/heritage_japan/image6.png',
    pageInDoc: 34,
  },
];

// Biểu đồ 3.1: Toàn quốc 2003 - 2022 (triệu người)
export const touristsData = [
  { year: '2003', value: 5.2 }, { year: '2004', value: 6.1 }, { year: '2005', value: 6.7 },
  { year: '2006', value: 7.3 }, { year: '2007', value: 8.3 }, { year: '2008', value: 8.4 },
  { year: '2009', value: 6.8 }, { year: '2010', value: 8.6 }, { year: '2011', value: 6.2 },
  { year: '2012', value: 8.4 }, { year: '2013', value: 10.4 }, { year: '2014', value: 13.4 },
  { year: '2015', value: 19.7 }, { year: '2016', value: 24.0 }, { year: '2017', value: 28.7 },
  { year: '2018', value: 31.2 }, { year: '2019', value: 31.9 }, { year: '2020', value: 4.1 },
  { year: '2021', value: 0.2 }, { year: '2022', value: 3.4 }, { year: '2023', value: 25.1 }
];

// Biểu đồ 3.2: Khách nước ngoài đến Kyoto 2008 - 2023 (nghìn người)
export const kyotoVisitorsData = [
  { year: '2008', value: 938.0 },
  { year: '2009', value: 941.2 },
  { year: '2010', value: 792.8 },
  { year: '2011', value: 1013.0 },
  { year: '2012', value: 513.4 },
  { year: '2013', value: 844.9 },
  { year: '2014', value: 1127.9 },
  { year: '2015', value: 1828.6 },
  { year: '2016', value: 3158.6 },
  { year: '2017', value: 3184.8 },
  { year: '2018', value: 3527.8 },
  { year: '2019', value: 4503.3 },
  { year: '2020', value: 3799.0 },
  { year: '2021', value: 448.6 },
  { year: '2022', value: 54.4 },
  { year: '2023', value: 978.1 }
];

// Biểu đồ 3.3: Khách nước ngoài đến Cố đô Nara 2011 - 2020 (nghìn người)
export const naraVisitorsData = [
  { year: '2011', value: 174.0 },
  { year: '2012', value: 267.0 },
  { year: '2013', value: 435.0 },
  { year: '2014', value: 630.0 },
  { year: '2015', value: 975.0 },
  { year: '2016', value: 1576.0 },
  { year: '2017', value: 1990.0 },
  { year: '2018', value: 2651.0 },
  { year: '2019', value: 3318.0 },
  { year: '2020', value: 28.9 }
];

// Dữ liệu so sánh Kyoto & Nara (nghìn người)
export const kyotoNaraVisitorsData = [
  { year: '2009', kyoto: 941.2, nara: 407.0 },
  { year: '2010', kyoto: 792.8, nara: 629.0 },
  { year: '2011', kyoto: 1013.0, nara: 174.0 },
  { year: '2012', kyoto: 513.4, nara: 267.0 },
  { year: '2013', kyoto: 844.9, nara: 435.0 },
  { year: '2014', kyoto: 1127.9, nara: 630.0 },
  { year: '2015', kyoto: 1828.6, nara: 975.0 },
  { year: '2016', kyoto: 3158.6, nara: 1576.0 },
  { year: '2017', kyoto: 3184.8, nara: 1990.0 },
  { year: '2018', kyoto: 3527.8, nara: 2651.0 },
  { year: '2019', kyoto: 4503.3, nara: 3318.0 },
  { year: '2020', kyoto: 3799.0, nara: 28.9 },
  { year: '2021', kyoto: 448.6, nara: null },
  { year: '2022', kyoto: 54.4, nara: null },
  { year: '2023', kyoto: 978.1, nara: null },
];

// Biểu đồ 3.4: Chi tiêu quốc tế toàn Nhật Bản 2010 - 2021 (nghìn tỷ Yên)
export const spendNationalData = [
  { year: '2010', value: 1.15 }, { year: '2011', value: 0.81 }, { year: '2012', value: 1.08 },
  { year: '2013', value: 1.41 }, { year: '2014', value: 2.02 }, { year: '2015', value: 3.48 },
  { year: '2016', value: 3.75 }, { year: '2017', value: 4.41 }, { year: '2018', value: 4.50 },
  { year: '2019', value: 4.81 }, { year: '2020', value: 0.70 }, { year: '2021', value: 0.10 },
];

// Biểu đồ 3.5: Chi tiêu tại Kyoto 2008 - 2020 (tỷ Yên)
export const kyotoSpendData = [
  { year: '2008', value: 601.2 }, { year: '2009', value: 582.4 }, { year: '2010', value: 594.1 },
  { year: '2011', value: 571.8 }, { year: '2012', value: 612.3 }, { year: '2013', value: 646.9 },
  { year: '2014', value: 699.4 }, { year: '2015', value: 761.7 }, { year: '2016', value: 970.1 },
  { year: '2017', value: 1085.5 }, { year: '2018', value: 1128.4 }, { year: '2019', value: 1308.1 },
  { year: '2020', value: 1238.2 }
];

// Biểu đồ 3.6: Chi tiêu tại Nara 2013 - 2022 (tỷ Yên)
export const naraSpendData = [
  { year: '2013', value: 872.0 },
  { year: '2014', value: 892.4 },
  { year: '2015', value: 994.6 },
  { year: '2016', value: 1035.9 },
  { year: '2017', value: 1128.6 },
  { year: '2018', value: 1208.0 },
  { year: '2019', value: 1147.2 },
  { year: '2020', value: 402.2 },
  { year: '2021', value: 428.0 },
  { year: '2022', value: 598.0 }
];

// Dữ liệu so sánh chi tiêu Kyoto & Nara (tỷ Yên)
export const spendRegionalComparisonData = [
  { year: '2013', kyoto: 646.9, nara: 872.0 },
  { year: '2014', kyoto: 699.4, nara: 892.4 },
  { year: '2015', kyoto: 761.7, nara: 994.6 },
  { year: '2016', kyoto: 970.1, nara: 1035.9 },
  { year: '2017', kyoto: 1085.5, nara: 1128.6 },
  { year: '2018', kyoto: 1128.4, nara: 1208.0 },
  { year: '2019', kyoto: 1308.1, nara: 1147.2 },
  { year: '2020', kyoto: 1238.2, nara: 402.2 },
  { year: '2021', kyoto: null, nara: 428.0 },
  { year: '2022', kyoto: null, nara: 598.0 },
];

// Đóng góp vĩ mô GDP & Doanh thu du lịch
export const gdpShareData = [
  { year: '2000', gdpShare: 2.2, directRevenue: 12.5 },
  { year: '2010', gdpShare: 4.1, directRevenue: 24.1 },
  { year: '2015', gdpShare: 5.8, directRevenue: 32.8 },
  { year: '2019', gdpShare: 7.5, directRevenue: 41.94 },
];

// Danh sách 25 Di sản Thế giới UNESCO tại Nhật Bản
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
  { id: 41, title: '富士山の入山料・富士山保全協力金', language: 'ja', url: 'https://www.fujisan-net.jp/post_detail/2001417' }
];
