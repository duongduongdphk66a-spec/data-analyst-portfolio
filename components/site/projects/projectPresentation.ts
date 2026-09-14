import { ProjectData } from '@/app/types';

export interface ProjectPresentationMeta {
  kicker: string;
  title: string;
  value: string;
  sub: string;
  desc: string;
  problem: string;
  method: string;
  insight: string;
  metrics: { label: string; value: string; change?: string; isPositive?: boolean }[];
  tools: string[];
}

export function getProjectPresentation(proj: ProjectData, isEn: boolean): ProjectPresentationMeta {
  if (proj.id === 'proj-kami-ely') {
    return {
      kicker: 'TIKTOK SHOP · CREATOR ANALYTICS',
      title: isEn ? 'Kami Ely: TikTok Shop & Creator Analytics' : 'Kami Ely: Phân Tích TikTok Shop & Creator Telemetry',
      value: isEn ? '31.6B VND' : '31.6 Tỷ VNĐ',
      sub: isEn ? '52.7% affiliate GMV from nano-creators' : '52.7% GMV affiliate từ nano-creator',
      desc: isEn 
        ? 'E-commerce telemetry & creator performance matrix across 338 products and 5,700 affiliates.'
        : 'Hệ thống phân tích hiệu suất bán hàng TikTok Shop và ma trận chuyển đổi 5.700 nhà sáng tạo nội dung.',
      problem: isEn
        ? 'Optimizing commercial synergy between brand LIVE streams and external affiliate tiers.'
        : 'Tối ưu hóa doanh thu giữa kênh LIVE thương hiệu và mạng lưới affiliate đa tầng.',
      method: isEn
        ? 'Compare 551 video vs 470 live sessions, model saturation curves at ~3.1h/day, decompose 180-day time series (Trend + Seasonality + Residual).'
        : 'So sánh 551 video vs 470 phiên live, mô hình hóa đường cong bão hòa ~3.1h/ngày, phân rã chuỗi thời gian 180 ngày (Xu hướng + Mùa vụ + Nhiễu).',
      insight: isEn
        ? 'Video outperforms Live by 4.48x GPM (p<0.0001). Summer seasonality explains 85% of the post-July drop. Cutting 50% excess live hours optimizes cash flow.'
        : 'Video vượt trội Live 4.48 lần GPM (p<0.0001). Chu kỳ mùa vụ hè lý giải 85% sụt giảm sau tháng 7. Cắt giảm 50% giờ live dư thừa tối ưu dòng tiền.',
      metrics: proj.metrics || [],
      tools: proj.tools || [],
    };
  }

  if (proj.id === 'proj-heritage-japan') {
    return {
      kicker: 'TIME-SERIES · MACRO ANALYTICS',
      title: isEn ? 'Inbound Tourism in Japan: Time-Series Analysis' : 'Phát Triển Du Lịch Di Sản Nhật Bản: Time-Series Analysis',
      value: isEn ? '31.88M Visitors' : '31.88 Triệu Lượt',
      sub: isEn ? '4,810B JPY spending · Peak recovery post-2023' : '4.810 Tỷ Yên chi tiêu · Phục hồi đỉnh cao sau 2023',
      desc: isEn
        ? '20-year longitudinal econometric analysis on inbound tourism recovery, visitor spend concentration, and regional dispersion.'
        : 'Phân tích kinh tế lượng 20 năm phục hồi du lịch quốc tế, mức độ tập trung chi tiêu và chiến lược giảm tải điểm đến di sản.',
      problem: isEn
        ? 'Overtourism in the Golden Route (Tokyo-Kyoto-Osaka) vs under-monetized regional heritage sites.'
        : 'Quá tải du lịch tại Cung đường Vàng (Tokyo-Kyoto-Osaka) đối lập tình trạng phân tán nguồn thu di sản địa phương.',
      method: isEn
        ? 'Indexed growth modeling (2000-2024), seasonal decomposition across 5 key source markets, visitor expenditure clustering.'
        : 'Mô hình hóa tăng trưởng cơ sở (2000-2024), phân rã mùa vụ 5 thị trường gửi khách trọng điểm, phân cụm chi tiêu bình quân.',
      insight: isEn
        ? 'Long-haul Western visitors spend 2.8x more per day on cultural experiences but have 4x lower repeat rates. Cultural heritage diversification unlocks regional economic balance.'
        : 'Khách đường dài Âu-Mỹ chi tiêu gấp 2.8 lần cho trải nghiệm văn hóa nhưng tỷ lệ quay lại thấp hơn 4 lần. Đa dạng hóa di sản là đòn bẩy kinh tế địa phương.',
      metrics: proj.metrics || [],
      tools: proj.tools || [],
    };
  }

  if (proj.id === 'proj-library-bus') {
    return {
      kicker: 'SYSTEM ARCHITECTURE · DATA MODELING',
      title: isEn ? 'Mobile Library System: 3NF Database & Architecture' : 'Hệ Thống Thư Viện Lưu Động: CSDL Quan Hệ 3NF & Tối Ưu',
      value: isEn ? '28ms Latency' : '28ms Độ Trễ',
      sub: isEn ? '93.7% faster queries · 0% booking race conditions' : 'Giảm 93.7% thời gian truy vấn · 0% xung đột đặt sách',
      desc: isEn
        ? 'Relational database architecture, Redis caching layer, and async Celery pipeline for mobile library operations across 50,000+ patrons.'
        : 'Thiết kế hệ thống CSDL quan hệ chuẩn 3NF, tầng đệm Redis và kiến trúc bất đồng bộ Celery phục vụ 50.000+ độc giả lưu động.',
      problem: isEn
        ? 'Data anomalies in mobile bus routing, concurrency collisions during simultaneous book borrowing, and report latency spikes.'
        : 'Bất nhất lộ trình xe buýt, xung đột đồng thời khi nhiều bạn đọc mượn cùng một đầu sách, độ trễ báo cáo vượt ngưỡng.',
      method: isEn
        ? '3NF entity-relationship normalization (7 apps, 22 models), pessimistic DB locking (`select_for_update`), multi-tier indexing.'
        : 'Chuẩn hóa quan hệ 3NF (7 phân hệ, 22 bảng), cơ chế khóa dòng bi quan (`select_for_update`), lập chỉ mục đa tầng.',
      insight: isEn
        ? 'Composite indexing on (patron_id, borrow_date) dropped scan rows by 94%. Pessimistic locks eliminated 100% of double-reservation edge cases under simulated 500 CCU load.'
        : 'Chỉ mục kép (patron_id, borrow_date) giảm 94% số dòng quét ổ đĩa. Khóa bi quan triệt tiêu hoàn toàn lỗi đặt trùng sách ở tải 500 CCU đồng thời.',
      metrics: proj.metrics || [],
      tools: proj.tools || [],
    };
  }

  return {
    kicker: 'DATA ANALYTICS · CASE STUDY',
    title: proj.title,
    value: isEn ? 'Analytics Project' : 'Dự Án Phân Tích',
    sub: proj.desc?.slice(0, 50) || '',
    desc: proj.desc,
    problem: proj.problem || (isEn ? 'Optimizing data pipelines and reporting efficiency.' : 'Tối ưu hóa pipeline dữ liệu và nâng cao hiệu suất báo cáo.'),
    method: proj.method || (isEn ? 'Data collection, cleaning, statistical analysis, and visual storytelling.' : 'Thu thập, chuẩn hóa, phân tích thống kê và trực quan hóa dữ liệu.'),
    insight: proj.insight || (isEn ? 'Data-driven insights revealing actionable business recommendations.' : 'Insight dựa trên dữ liệu giúp đưa ra khuyến nghị kinh doanh hành động.'),
    metrics: proj.metrics || [],
    tools: proj.tools || [],
  };
}
