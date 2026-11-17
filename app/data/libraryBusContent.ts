/**
 * Library Bus: project summary in Markdown.
 * The project is a UX/UI design project. Books, buses, routes and users in the
 * interface are sample data used to illustrate layouts.
 */
export const libraryBusMarkdownContent = `
# Library Bus: Phân tích nghiệp vụ (BA), UX/UI & Kiến trúc hệ thống xe thư viện lưu động

Library Bus là dự án đặc tả nghiệp vụ (BA), thiết kế UX/UI và kiến trúc ứng dụng web Django cho dịch vụ xe thư viện lưu động. Độc giả tra cứu tồn kho sách theo từng xe buýt, xem lộ trình điểm đón trên bản đồ và đặt giữ sách trước. Thủ thư quản lý mượn trả, xử lý quá hạn, duyệt sách quyên góp và theo dõi báo cáo phân tích. Các con số hiển thị trên giao diện là dữ liệu hạt giống (seed data) phục vụ kiểm thử luồng.

## 01. Phân tích nghiệp vụ (BA) và nghiên cứu UX
- Về dự án: bài toán tiếp cận thư viện cố định, phạm vi sản phẩm và ý nghĩa thương hiệu.
- Chân dung người dùng mục tiêu (Persona), trọng số ưu tiên tính năng MVP, sơ đồ trang web (Sitemap) và lưu đồ quyết định mượn sách.
- Quy tắc nghiệp vụ cốt lõi (BR-01..BR-04) và tiêu chí nghiệm thu (Given / When / Then).

## 02. Logo và thành phần giao diện
- Ý tưởng, ý nghĩa, cấu trúc tỷ lệ X và khoảng cách an toàn của logo.
- Typography (Lora và Outfit) và bảng màu 6 tông ấm Neo-Bakery từ Molasses Ink đến Butter Cream.
- Nút bấm, ô nhập liệu, bộ icon 24 x 24 px, header và thanh điều hướng.

## 03. Thiết kế website (11 cặp màn hình cốt lõi)
- Hệ thống lưới 12 cột cho Desktop (1440px) và bố cục 1 cột tối ưu chạm cho Mobile (390px).
- 11 cặp màn hình cốt lõi trên cả Desktop và Mobile (44 bản thiết kế), đối chiếu trực tiếp từng cặp Wireframe và UI Design.

## 04. Logic Backend, Lược đồ CSDL và Chỉ số vận hành
- Kiểm soát đồng thời PostgreSQL ACID với khóa dòng select_for_update() và hàng đợi bất đồng bộ Celery + Redis.
- Lược đồ cơ sở dữ liệu quan hệ (6 bảng cốt lõi) và từ điển chỉ số vận hành (Overdue Rate, Fleet Turnover, Bayesian Rating, Cosine Similarity).
`;
