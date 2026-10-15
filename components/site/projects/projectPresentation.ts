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
      title: isEn ? (proj.titleEn || 'Multi-Channel Resource Allocation: Kami Ely Case Study') : proj.title,
      value: isEn ? '31.6B VND' : '31.6 Tỷ VNĐ',
      sub: isEn ? '52.7% affiliate GMV from nano-creators' : '52.7% GMV affiliate từ nano-creator',
      desc: isEn 
        ? (proj.descEn || 'Analyzed 238.4k orders and 31.6B VND in cumulative GMV since store launch. Compared revenue performance between shoppable short videos and livestreams. A 180-day time series models the daily broadcast saturation threshold.')
        : proj.desc,
      problem: isEn
        ? (proj.problemEn || 'Livestreams consumed most broadcast hours but delivered only 30.2k VND per thousand views. Short videos generated 135.2k VND GPM per thousand views. Late summer revenue dropped, requiring root cause attribution between seasonality and execution.')
        : (proj.problem || 'Kênh Live chiếm phần lớn thời gian nhưng chỉ đạt GPM 30,2k đồng. Ngược lại, video ngắn mang lại GPM 135,2k đồng trên mỗi nghìn lượt xem. Doanh số tháng 8 và 9 sụt giảm, cần tìm nguyên nhân do mùa vụ hay vận hành.'),
      method: isEn
        ? (proj.methodEn || 'Conducted statistical hypothesis tests comparing 551 videos against 470 livestreams. Modeled diminishing marginal returns to pinpoint a 3.1-hour daily saturation threshold. Decomposed the 180-day time series into trend, seasonal, and residual components.')
        : (proj.method || 'So sánh kiểm định thống kê giữa 551 video và 470 phiên live. Mô hình hồi quy xác định ngưỡng bão hòa phiên live ở mức 3,1 giờ mỗi ngày. Phân rã chuỗi thời gian 180 ngày thành ba phần: xu hướng, mùa vụ và nhiễu.'),
      insight: isEn
        ? (proj.insightEn || 'Shoppable videos generated 4.48 times higher revenue velocity than livestreams (p < 0.0001). Summer vacation seasonality explained 85% of the post-July sales slump. Cutting excess broadcast hours beyond 3.1 hours recovered operational efficiency.')
        : (proj.insight || 'Video ngắn đạt hiệu quả doanh thu cao gấp 4,48 lần so với live (p < 0,0001). Mùa du lịch hè giải thích 85% mức giảm doanh số sau tháng 7. Shop cần cắt giảm giờ live vượt ngưỡng 3,1 giờ và gắn giỏ hàng vào toàn bộ video.'),
      metrics: proj.metrics || [],
      tools: proj.tools || [],
    };
  }

  if (proj.id === 'proj-heritage-japan') {
    return {
      kicker: 'TIME-SERIES · MACRO ANALYTICS',
      title: isEn ? (proj.titleEn || 'Heritage Tourism Growth in Japan: A Time-Series Analysis') : proj.title,
      value: isEn ? '31.88M Visitors' : '31.88 Triệu Lượt',
      sub: isEn ? '4,810B JPY spending · Peak recovery post-2023' : '4.810 Tỷ Yên chi tiêu · Phục hồi đỉnh cao sau 2023',
      desc: isEn
        ? (proj.descEn || 'Analyzed international visitor inflows and average tourist spending in Japan since 2013. Evaluated national inbound policies and measured post-disruption recovery across regional heritage destinations.')
        : proj.desc,
      problem: isEn
        ? (proj.problemEn || 'Needed to quantify post-pandemic recovery speeds for traditional cultural centers like Kyoto and Nara. Evaluated inbound border reopening impacts against actual inbound tourist spending patterns.')
        : (proj.problem || 'Cần đo lường mức độ phục hồi của các điểm di sản Kyoto và Nara sau biến động. Nghiên cứu đánh giá định lượng tác động của chính sách mở cửa đến mức chi tiêu thực tế.'),
      method: isEn
        ? (proj.methodEn || 'Extracted and standardized 20-year official records from the Japan National Tourism Organization. Applied time-series econometric modeling to evaluate visitor volume and regional spending disparities.')
        : (proj.method || 'Thu thập và chuẩn hóa dữ liệu từ Cơ quan Xúc tiến Du lịch Nhật Bản. Áp dụng mô hình chuỗi thời gian 20 năm để theo dõi lượng khách và mức chi tiêu.'),
      insight: isEn
        ? (proj.insightEn || 'Total tourist expenditure reached 4.81 trillion Yen, growing 318% during peak expansion. Cultural heritage travelers spent 3.2 times more per trip than general tourists. Post-pandemic recovery reached a projected 88.4% across traditional destination centers.')
        : (proj.insight || 'Tổng chi tiêu du lịch chạm mức 4,81 nghìn tỷ Yên trong giai đoạn tăng trưởng cao. Khách tham quan di sản chi tiêu cao gấp 3,2 lần so với du khách thông thường. Tỷ lệ phục hồi dự báo đạt 88,4% tại các trung tâm văn hóa truyền thống.'),
      metrics: proj.metrics || [],
      tools: proj.tools || [],
    };
  }

  if (proj.id === 'proj-library-bus') {
    return {
      kicker: 'SYSTEM ARCHITECTURE · DATA MODELING',
      title: isEn ? (proj.titleEn || 'Library Bus Management System: Logistics & Architecture') : proj.title,
      value: isEn ? '28ms Latency' : '28ms Độ Trễ',
      sub: isEn ? '93.7% faster queries · 0% booking race conditions' : 'Giảm 93.7% thời gian truy vấn · 0% xung đột đặt sách',
      desc: isEn
        ? (proj.descEn || 'Architected a relational database and asynchronous pipeline for a multi-stop mobile library. The platform supports 50,000 active patrons with 500 concurrent requests per second.')
        : proj.desc,
      problem: isEn
        ? (proj.problemEn || 'Distributed mobile buses encountered inventory discrepancies across municipal scheduled pickup stops. Simultaneous book hold requests caused database transaction race conditions and booking collisions.')
        : (proj.problem || 'Các trạm xe buýt lưu động thường gặp lỗi lệch số lượng sách giữa các điểm dừng. Nhiều người cùng đặt mượn một cuốn sách gây ra lỗi xung đột giao dịch dữ liệu.'),
      method: isEn
        ? (proj.methodEn || 'Normalized relational schemas to 3NF and enforced strict ACID transaction row locks. Implemented Redis caching layers with Celery background workers to offload server CPU.')
        : (proj.method || 'Chuẩn hóa bảng dữ liệu 3NF với các ràng buộc giao dịch ACID để khóa dòng an toàn. Hệ thống sử dụng Redis đệm truy vấn và dùng Celery xử lý tác vụ chạy ngầm.'),
      insight: isEn
        ? (proj.insightEn || 'Query latency dropped from 450ms to 28ms, yielding a 93.7% performance improvement. The system sustained 500 concurrent connections while eliminating double-borrowing errors entirely.')
        : (proj.insight || 'Độ trễ truy vấn giảm từ 450ms xuống 28ms, tương đương mức cải thiện 93,7%. Hệ thống vận hành ổn định 500 kết nối đồng thời và ngăn chặn hoàn toàn việc mượn trùng sách.'),
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
