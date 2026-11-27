/**
 * Library Bus: project summary in Markdown aligned with the pre-launch Technical BA spec and Django/MySQL prototype.
 */
export const libraryBusMarkdownContent = `
# Library Bus: Phân tích nghiệp vụ (Technical BA), Mô hình dữ liệu lõi & Tracking Plan

Library Bus là hồ sơ Technical BA trước Go-Live cho mạng lưới xe thư viện lưu động (đối chiếu với bản mẫu đồ án **Django 5.2 · MySQL 8.0 · Redis 7 · Celery Beat · 171 unit tests**).

## 01. Bài toán Nghiệp vụ & 4 Quy tắc cốt lõi (BR-01..04)
- **BR-01 (Hạn mức mượn theo hạng & Chống trùng tồn kho):** Hạn mượn chuẩn tại xe 14 ngày (giao tận nơi ngoài phạm vi GĐ 1); hạn mức theo 3 hạng thẻ (\`basic: 3\`, \`premium: 5\`, \`vip: 10\`). Khóa bi quan \`select_for_update()\` trên \`User\` và \`BusBookInventory\` trong \`transaction.atomic()\` chặn lỗi TOCTOU.
- **BR-02 (Hàng đợi Đặt trước FIFO & Giữ chỗ 7 ngày tại trạm):** Chỉ mở khi sách hết bản; cửa sổ giữ chỗ 7 ngày tính từ lúc sách về trạm và gửi thông báo nhận; tự cộng bù nếu xe hủy chuyến do thời tiết/bảo trì; Celery Beat quét 30 phút/lần.
- **BR-03 (Cổng kiểm tra Gia hạn):** Gia hạn +14 ngày, tối đa 2 lần (\`renewal_count < 2\`), chỉ mở trong 3 ngày cuối trước hạn trả; chặn nếu quá hạn, có nợ phạt ở phiếu khác hoặc có người xếp hàng đặt trước.
- **BR-04 (Biểu phí phạt 3 bậc & Trần giá thay thế):** Ngày 1–7: \`5.000đ/ngày\` → Ngày 8–30: \`10.000đ/ngày\` → Ngày 31+: \`15.000đ/ngày\`, **áp trần cứng 100% giá thay thế sách**; tạm dừng phạt ngày hủy chuyến; miễn giảm \`≤50%\` thủ thư duyệt, \`>50%\` Ban quản lý duyệt qua \`AuditMixin\`.

## 02. Mô hình Dữ liệu Lõi (ERD 7 bảng) & Tracking Plan 8 Sự kiện
- **ERD lõi 7 thực thể:** Tách lọc từ 36 models của bản mẫu thành \`User & Profile\`, \`LibraryBus & RouteStop\`, \`BookTitle\`, \`BusBookInventory\`, \`BorrowRecord\`, \`BookReservation\`, \`FinePayment\` + bảng log \`UserActivity\` (chuyển kho lạnh sau 90 ngày).
- **Tracking Plan 8 sự kiện cốt lõi MVP:** \`view_book\`, \`bus_visit\`, \`reserve_created\`, \`reserve_fulfilled\`, \`borrow\`, \`renew\`, \`return\`, \`fine_applied\`.
- **Chuẩn hóa chỉ số vận hành:** Thay công thức bão hòa trần \`min((borrows/visits)*100, 100)\` bằng \`borrows_per_visit\` không chặn trần; lọc cohort đặt trước đủ 7 ngày chín để tránh right-censoring; tách gợi ý 5 thuật toán và Gemini AI ISBN sang GĐ 2 (Could-Have).
- **Khung Pilot 4 tuần (2 tuyến xe):** 5 ngưỡng Go/Tune cho Double-Booking (\`0%\`), Matured 7d Pickup (\`≥70%\`), On-Time Return (\`≥80%\`), Stockout View (\`<15%\`) và Offline Sync Conflict (\`<1%\`).

## 03. Khung Master–Detail 11 cặp màn hình cốt lõi
- Đối chiếu 11 cặp màn hình cốt lõi (Wireframe vs UI trên Desktop 1440px & Mobile 390px) gắn liền dấu vết quy tắc BR-01..04 và sự kiện Telemetry.
`;
