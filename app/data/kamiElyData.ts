/**
 * Kami Ely TikTok Shop — Chart & Table Data
 * Extracted from KamiElyProject.tsx for separation of concerns.
 */

// 90-day trajectory data
export const shopTrendData = [
  { date: '22/05', units: 600, gmv: 96 }, { date: '28/05', units: 950, gmv: 152 }, { date: '03/06', units: 650, gmv: 104 },
  { date: '09/06', units: 900, gmv: 144 }, { date: '15/06', units: 1950, gmv: 390 }, { date: '21/06', units: 650, gmv: 104 },
  { date: '27/06', units: 1150, gmv: 184 }, { date: '03/07', units: 600, gmv: 96 }, { date: '09/07', units: 550, gmv: 88 },
  { date: '15/07', units: 500, gmv: 80 }, { date: '21/07', units: 450, gmv: 72 }, { date: '27/07', units: 400, gmv: 64 },
  { date: '02/08', units: 350, gmv: 56 }, { date: '08/08', units: 500, gmv: 80 }, { date: '14/08', units: 250, gmv: 40 }
];

// Top SKUs extracted from _ product data_20260820_025116.xlsx
export const topSKUData = [
  { code: 'CV11', name: 'Chân Váy Ngắn Chữ A (Nỉ 2 Da)', price: 65000, units: 6752, gmv: 842.5, commission: 8 },
  { code: 'H36', name: 'Set Bikini 2 Mảnh Kẻ Sọc Áo Yếm', price: 153790, units: 5250, gmv: 1008.1, commission: 8 },
  { code: 'H32', name: 'Set Bikini 2 Mảnh Xanh Rêu', price: 75000, units: 3264, gmv: 496.2, commission: 8 },
  { code: 'M18', name: 'Bikini 1 Mảnh Bodysuit Đen/Xanh', price: 99000, units: 2891, gmv: 594.2, commission: 8 },
  { code: 'SW01', name: 'Đồ Bơi 1 Mảnh Tay Dài Khóa Kéo', price: 199000, units: 2110, gmv: 504.6, commission: 10 },
];

// Top Creators Performance extracted from _Creators_20260820_025252.xlsx
export const topCreatorsList = [
  { id: 'girlstyle.vn', name: 'Girl Style', type: 'Nano Affiliate', followers: 3187, units: 6318, gmv: 140.0, liveGpm: '121.4k', videoGpm: '57.1k' },
  { id: 'nuocloc7mau', name: 'Nước lọc 7 màu', type: 'Micro Creator', followers: 188105, units: 3100, gmv: 91.0, liveGpm: '87.2k', videoGpm: '176.4k' },
  { id: '_lela3107', name: 'Vân là Lã Na', type: 'Micro Creator', followers: 57374, units: 390, gmv: 75.3, liveGpm: '52.1k', videoGpm: '142.0k' },
  { id: 'sinhtonthuc', name: 'sinh tồn...', type: 'Micro Creator', followers: 82492, units: 800, gmv: 74.5, liveGpm: '175.8k', videoGpm: '160.5k' },
  { id: 'thuducloset', name: 'Thư Dụ Closet', type: 'Nano Affiliate', followers: 1680, units: 1000, gmv: 45.7, liveGpm: '100.0k', videoGpm: '50.0k' },
];

// Top Live Sessions from _shop LIVE_20260820_025451.xlsx
export const topLiveStreams = [
  { date: '16/06', title: 'Sale KamiELy', duration: '16.9h', viewers: 25535, units: 1850, gmv: 272.1 },
  { date: '05/06', title: 'Chào mừng bạn đến với phiên...', duration: '18.3h', viewers: 32166, units: 1795, gmv: 245.3 },
  { date: '12/06', title: 'Sale KamiEly', duration: '16.4h', viewers: 23096, units: 1672, gmv: 216.8 },
];

export const getChannelData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Self-Operated Store' : 'Kênh Tự Vận Hành', value: 39.6 },
    { name: isEn ? 'Creator Affiliates' : 'Mạng Lưới Affiliate', value: 60.4 }
  ],
  gmv: [
    { name: isEn ? 'Self-Operated Store' : 'Kênh Tự Vận Hành', value: 63.8 },
    { name: isEn ? 'Creator Affiliates' : 'Mạng Lưới Affiliate', value: 36.2 }
  ]
});

export const getContentData = (isEn: boolean) => ({
  units: [
    { name: isEn ? 'Livestream Shopping' : 'Livestream (LIVE)', value: 82.0 }, 
    { name: isEn ? 'Short Shoppable Videos' : 'Video Có Giỏ Hàng', value: 8.0 }, 
    { name: isEn ? 'Other' : 'Kênh khác', value: 10.0 }
  ],
  gmv: [
    { name: isEn ? 'Livestream Shopping' : 'Livestream (LIVE)', value: 73.5 }, 
    { name: isEn ? 'Short Shoppable Videos' : 'Video Có Giỏ Hàng', value: 3.2 }, 
    { name: isEn ? 'Other' : 'Kênh khác', value: 23.3 }
  ]
});

export const affFollowerData = {
  units: [
    { name: '>100k', value: 3400 }, { name: '50k-100k', value: 3800 }, { name: '10k-50k', value: 8900 },
    { name: '5k-10k', value: 2100 }, { name: '1k-5k', value: 21800 }, { name: '<=1k', value: 16100 }
  ],
  gmv: [
    { name: '>100k', value: 615.4 }, { name: '50k-100k', value: 665.8 }, { name: '10k-50k', value: 1300.0 },
    { name: '5k-10k', value: 323.1 }, { name: '1k-5k', value: 3300.0 }, { name: '<=1k', value: 2000.0 }
  ],
  count: [
    { name: '>100k', value: 42 }, { name: '50k-100k', value: 37 }, { name: '10k-50k', value: 161 },
    { name: '5k-10k', value: 110 }, { name: '1k-5k', value: 527 }, { name: '<=1k', value: 210 }
  ]
};

export const PALETTE = ['#0D7287', '#9BE7FA', '#FFD14C', '#FFE485', '#C8EEF7', '#E5B830'];
