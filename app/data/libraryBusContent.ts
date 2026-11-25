/**
 * Library Bus: project summary in Markdown aligned with the actual 229-file Django 5.2 + MySQL 8.0 + Redis 7 + Celery codebase.
 */
export const libraryBusMarkdownContent = `
# Library Bus: Phân tích nghiệp vụ (BA), Kiến trúc Telemetry (MySQL 8.0 / Redis / Celery) & UX/UI

Library Bus là hệ thống số hóa mạng lưới xe buýt thư viện lưu động được phát triển trên **Django 5.2 (7 phân hệ, 36 model dữ liệu + 3 base model/mixin, 97 HTML template, 171 unit test tự động)**, hệ quản trị cơ sở dữ liệu **MySQL 8.0**, bộ nhớ đệm **Redis 7** và **9 tác vụ định kỳ Celery Beat**.

## 01. Bài toán Nghiệp vụ & 4 Quy tắc cốt lõi (BR-01..04)
- **BR-01 (Hạn mức mượn & Chống tranh chấp tồn kho):** Hạn mượn mặc định 14 ngày (giao tận nơi \`ShippingRequest\` 21 ngày), hạn mức theo hạng thẻ (\`basic: 3\`, \`premium: 5\`, \`vip: 10\`). Sử dụng khóa bi quan \`select_for_update()\` trên cả \`Book\` và \`User\` trong \`transaction.atomic()\` để chặn lỗi TOCTOU Race Condition.
- **BR-02 (Hàng đợi Đặt trước FIFO & Giải phóng tự động):** Chỉ mở khi \`not is_available\`, cấp \`queue_position\`, giữ chỗ tối đa 7 ngày (\`expires_date\`), tự động dồn hàng \`F('queue_position') - 1\` và quét định kỳ mỗi 30 phút qua Celery Beat.
- **BR-03 (Điều kiện Gia hạn - Renewal Gate):** Gia hạn +14 ngày, tối đa 2 lần (\`renewal_count < 2\`); chặn nếu quá hạn (\`is_overdue\`) hoặc có người đang xếp hàng đặt trước.
- **BR-04 (Biểu phí phạt lũy tiến 3 bậc):** Ngày 1–7: \`5.000đ/ngày\` → Ngày 8–30: \`10.000đ/ngày\` → Ngày 31+: \`15.000đ/ngày\` (\`TransactionService.calculate_fine\`), quét tự động lúc 06:00 và nhắc hạn lúc 08:00 hàng ngày.

## 02. Kiến trúc Dữ liệu (MySQL 8.0 + Redis 7 + Celery) & Hệ thống Telemetry (\`analytics\` app)
- **Kiến trúc 5 lớp:** 7 Django Apps (\`users\`, \`inventory\`, \`transactions\`, \`analytics\`, \`notifications\`, \`blog\`, \`core\`) → Service Layer khóa bi quan → MySQL 8.0 chuẩn UUIDv4 (\`TimestampedModel\`, \`SoftDeleteModel\`, \`AuditMixin\`) → Redis 7 Cache Versioning (\`CacheMixin\`) → Celery Worker/Beat (9 cron jobs).
- **Công thức Telemetry thực tế:**
  - \`UserActivity\`: Ghi nhận sự kiện (\`borrow\`, \`return\`, \`review\`, \`reputation_gained\`, \`level_up\`, \`login\`, \`view_book\`, \`bus_visit\`) kèm \`JSONField metadata\`, lưu trữ lạnh sang \`ArchivedUserActivity\` sau 90 ngày.
  - \`BookAnalytics\`: \`60% lượt mượn + 30% đánh giá + 10% lượt xem + 20đ thưởng mới mượn trong 30 ngày\`.
  - \`BusAnalytics\`: \`efficiency_score = min((total_borrows / total_visits) * 100, 100)\`.
  - \`BookRecommendation\` & \`UserReadingStats\`: Đo lường phễu \`is_clicked\` → \`is_borrowed\` (Click Rate & Borrow Rate cho 5 thuật toán gợi ý) và điểm uy tín \`0–1.000\` phân 5 hạng từ Đồng đến Kim cương.

## 03. Khung Master–Detail 11 cặp màn hình cốt lõi & Hệ thống Thiết kế
- Khung Master–Detail đối chiếu 11 cặp màn hình cốt lõi (Wireframe vs UI trên Desktop 1440px & Mobile 390px) gắn liền dấu vết API/Rule nghiệp vụ.
- Hệ thống thiết kế Neo-Bakery 6-Tone (\`#4E0705\` Molasses → \`#FDE971\` Butter), cặp phông chữ \`Lora\` + \`Outfit\`, lưới 12 cột và chuyển động GSAP 60 FPS.
`;
