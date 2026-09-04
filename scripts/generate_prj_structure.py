import os
import sys

content = """# 📚 Báo Cáo Cấu Trúc Dự Án — Tủ Sách Lưu Động (Library Bus System)
> **Phiên bản:** 2.0.0  
> **Kiến trúc:** Django High-Performance Modular Monolith  
> **Đường dẫn dự án:** `C:\\Users\\ADMIN\\Documents\\prj`  
> **Ngày tạo:** 2026-09-03  

---

## 📑 Mục Lục
1. [Tổng Quan Dự Án & Tech Stack](#1-tổng-quan-dự-án--tech-stack)
2. [Cây Cấu Trúc Thư Mục Toàn Diện](#2-cây-cấu-trúc-thư-mục-toàn-diện)
3. [Phân Tích Chi Tiết 7 Module Nghiệp Vụ (Django Apps)](#3-phân-tích-chi-tiết-7-module-nghiệp-vụ-django-apps)
4. [Sơ Đồ Kiến Trúc & Quan Hệ Dữ Liệu (Mermaid ERD)](#4-sơ-đồ-kiến-trúc--quan-hệ-dữ-liệu-mermaid-erd)
5. [Hệ Thống Giao Diện & Design System (Neo-Bakery & GSAP)](#5-hệ-thống-giao-diện--design-system-neo-bakery--gsap)
6. [Hạ Tầng, Container & Tác Vụ Bất Đồng Bộ (DevOps & Celery)](#6-hạ-tầng-container--tác-vụ-bất-đồng-bộ-devops--celery)
7. [Kịch Bản Quản Trị & Kiểm Thử Tự Động (Scripts & Testing)](#7-kịch-bản-quản-trị--kiểm-thử-tự-động-scripts--testing)

---

## 1. Tổng Quan Dự Án & Tech Stack

Dự án **Tủ Sách Lưu Động (Library Bus System)** là nền tảng quản lý, điều phối và phân phối sách thông qua mạng lưới các xe buýt thư viện lưu động kết hợp công nghệ số hóa. Hệ thống phục vụ độc giả tại các trường học, khu dân cư, đồng thời cung cấp cổng quản trị cho thủ thư, tình nguyện viên và nhà quyên góp sách.

### Thông Số Kỹ Thuật Chính:
- **Backend Framework:** Django 5.2.4 (Python 3.11 / 3.12)
- **Cơ Sở Dữ Liệu:** MySQL 8.0 (kết nối qua `mysqlclient==2.2.7`)
- **Bộ Nhớ Đệm (Cache):** Redis 7 (sử dụng `django-redis==6.0.0` với `hiredis` C-accelerated parser)
- **Xử Lý Bất Đồng Bộ & Định Kỳ:** Celery 5.5.3 + Celery Beat + Redis Broker
- **Tích Hợp Trí Tuệ Nhân Tạo:** Google Gemini AI (`google-generativeai==0.8.5`) phục vụ trích xuất metadata và gợi ý sách
- **Bảo Mật Xác Thực:** Mã hóa mật khẩu chuẩn Argon2 (`argon2-cffi==25.1.0`)
- **Giao Diện & Chuyển Động:** Django Templates + CSS Tokens Neo-Bakery + GSAP 3.x (GreenSock Animation Platform)
- **Container & Điều Phối:** Docker & Docker Compose 5 dịch vụ (`web`, `db`, `redis`, `celery_worker`, `celery_beat`)

---

## 2. Cây Cấu Trúc Thư Mục Toàn Diện

Dưới đây là sơ đồ phân cấp thư mục hoàn chỉnh của dự án tại `C:\\Users\\ADMIN\\Documents\\prj`:

```text
C:\\Users\\ADMIN\\Documents\\prj/
│
├── .agents/                                # Định nghĩa năng lực & Agentic Skill của hệ thống
│   └── skills/
│       ├── gsap/                           # Hướng dẫn & chuẩn mực hoạt cảnh GreenSock
│       └── impeccable/                     # Nguyên lý thiết kế Impeccable Design System
│
├── .github/
│   └── workflows/
│       └── ci.yml                          # CI Pipeline kiểm tra chất lượng, linting & test tự động
│
├── library_bus_project/                    # THƯ MỤC MÃ NGUỒN CHÍNH (DJANGO PROJECT ROOT)
│   │
│   ├── analytics/                          # [APP] Thống kê, phân tích thói quen đọc & đề xuất AI
│   │   ├── migrations/                     # Lịch sử lược đồ CSDL
│   │   ├── admin.py                        # Cấu hình giao diện Django Admin cho analytics
│   │   ├── apps.py                         # Khai báo AppConfig Analytics
│   │   ├── models.py                       # Models: UserReadingStats, BookAnalytics, BusAnalytics, etc.
│   │   ├── tasks.py                        # Celery tasks: Tổng hợp dữ liệu định kỳ, dọn log
│   │   ├── tests.py                        # Test cases cho analytics
│   │   ├── urls.py                         # Routing: Dashboard, Leaderboard, Export báo cáo
│   │   └── views.py                        # Views render biểu đồ & API endpoints thống kê
│   │
│   ├── blog/                               # [APP] Cổng thông tin, tin tức, đánh giá sách & sự kiện
│   │   ├── migrations/                     # 7 file migrations
│   │   ├── admin.py                        # Quản lý bài viết, danh mục, bình luận, báo cáo
│   │   ├── apps.py                         # Khai báo AppConfig Blog
│   │   ├── forms.py                        # Forms bình luận, đánh giá, đăng ký newsletter
│   │   ├── models.py                       # Models: Post, BlogCategory, BlogTag, PostRating, Comment...
│   │   ├── signals.py                      # Django signals tự động đếm view, tính rating trung bình
│   │   ├── tasks.py                        # Celery tasks gửi newsletter qua email
│   │   ├── tests.py                        # Bộ test suite cho blog
│   │   ├── urls.py                         # Routing: Danh sách bài viết, chi tiết, danh mục, tag
│   │   └── views.py                        # Views hiển thị tin tức, tìm kiếm & tương tác
│   │
│   ├── core/                               # [APP] Tầng cốt lõi dùng chung (Shared Infrastructure)
│   │   ├── admin.py                        # Base admin cấu hình
│   │   ├── apps.py                         # Khai báo AppConfig Core
│   │   ├── models.py                       # Base Models: TimestampedModel, SoftDeleteModel, AuditMixin
│   │   ├── tasks.py                        # Tác vụ nền dọn dẹp hệ thống
│   │   ├── tests.py                        # Kiểm thử các Mixin và Base QuerySet
│   │   └── views.py                        # Base error handlers (400, 403, 404, 500)
│   │
│   ├── inventory/                          # [APP] Quản lý kho sách, đội xe buýt & trạm dừng GPS
│   │   ├── migrations/                     # 7 file migrations
│   │   ├── admin.py                        # Quản lý kho sách, xe buýt, lộ trình trạm dừng
│   │   ├── apps.py                         # Khai báo AppConfig Inventory
│   │   ├── forms.py                        # Form quyên góp sách, bộ lọc nâng cao
│   │   ├── models.py                       # Models: LibraryBus, BusRoute, Category, Book, BookDonation...
│   │   ├── tests.py                        # Test suite kiểm kê kho & route
│   │   ├── urls.py                         # Routing: Catalog, tra cứu xe bus, lộ trình, đọc PDF
│   │   └── views.py                        # Views danh mục sách, chi tiết sách, bản đồ trạm xe
│   │
│   ├── library_bus_project/                # [CONFIG] Cấu hình trung tâm Django Project
│   │   ├── __init__.py                     # Nạp Celery app khi khởi động Django
│   │   ├── asgi.py                         # Cổng kết nối ASGI cho WebSocket/Async
│   │   ├── celery.py                       # Thiết lập Celery instance, broker, beat schedule
│   │   ├── settings.py                     # Toàn bộ cấu hình: Database, Cache, Apps, Middleware, Auth
│   │   ├── urls.py                         # Root URL routing tổng thể toàn dự án
│   │   └── wsgi.py                         # Cổng WSGI cho Gunicorn/Waitress production
│   │
│   ├── notifications/                      # [APP] Hệ thống thông báo đa kênh (In-app & Email)
│   │   ├── migrations/                     # 3 file migrations
│   │   ├── admin.py                        # Quản lý thông báo người dùng
│   │   ├── apps.py                         # Khai báo AppConfig Notifications
│   │   ├── context_processors.py           # Tiêm badge đếm thông báo chưa đọc vào mọi Template
│   │   ├── models.py                       # Model: UserNotification (thông báo trả sách, sự kiện)
│   │   ├── tasks.py                        # Celery tasks gửi mail thông báo trễ hạn, xác nhận mượn
│   │   ├── tests.py                        # Kiểm thử hệ thống gửi thông báo
│   │   ├── urls.py                         # Routing: Danh sách thông báo, đánh dấu đã đọc
│   │   └── views.py                        # Views & API cập nhật trạng thái thông báo
│   │
│   ├── transactions/                       # [APP] Nghiệp vụ mượn/trả, hàng đợi đặt trước & phạt trễ
│   │   ├── migrations/                     # 2 file migrations
│   │   ├── admin.py                        # Quản lý phiếu mượn, yêu cầu giao sách, xử lý nộp phạt
│   │   ├── apps.py                         # Khai báo AppConfig Transactions
│   │   ├── forms.py                        # Form mượn sách, form đặt trước, thanh toán phạt
│   │   ├── models.py                       # Models: BorrowRecord, BookReservation, ShippingRequest, FinePayment
│   │   ├── services.py                     # Chứa Service Layer: Xử lý khóa bi quan, chống race-condition
│   │   ├── tasks.py                        # Celery tasks quét sách quá hạn hàng ngày, tính tiền phạt
│   │   ├── tests.py                        # Test suite nghiệp vụ mượn trả & giao nhận
│   │   ├── urls.py                         # Routing: Lịch sử mượn, tạo phiếu, gia hạn, hủy đặt trước
│   │   └── views.py                        # Views thao tác mượn trả, checkout, queue
│   │
│   ├── users/                              # [APP] Định danh, phân quyền & hồ sơ độc giả
│   │   ├── migrations/                     # 4 file migrations
│   │   ├── templatetags/                   # Custom template filters cho avatar & role
│   │   ├── admin.py                        # Quản lý người dùng, phân cấp thẻ hội viên, phân quyền
│   │   ├── apps.py                         # Khai báo AppConfig Users
│   │   ├── forms.py                        # Forms đăng ký, đăng nhập, đổi mật khẩu, cập nhật hồ sơ
│   │   ├── models.py                       # Models: Profile, UserInterest, LoginHistory, UserPreference
│   │   ├── tests.py                        # Test suite kiểm tra xác thực Argon2 & phân quyền
│   │   ├── urls.py                         # Routing: Auth, Profile, Membership upgrade, Activity log
│   │   ├── utils.py                        # Tiện ích tạo token, kiểm tra bảo mật, định dạng sđt
│   │   └── views.py                        # Views đăng ký, hồ sơ cá nhân, nâng cấp VIP
│   │
│   ├── logs/                               # Thư mục ghi log vận hành hệ thống
│   │   ├── app.log                         # Log ứng dụng chi tiết
│   │   └── celery.log                      # Log tác vụ nền Celery
│   │
│   ├── media/                              # Tệp tin người dùng tải lên (User Uploads)
│   │   ├── avatars/                        # Ảnh đại diện độc giả
│   │   ├── book_covers/                    # Hơn 270 ảnh bìa sách trong kho
│   │   └── book_pdfs/                      # Tệp tài liệu & sách điện tử PDF
│   │
│   ├── scripts/                            # Kịch bản bảo trì, kiểm định & gieo dữ liệu (Seed)
│   │   ├── deep_template_audit.py          # Kiểm toán cấu trúc toàn bộ giao diện HTML
│   │   ├── optimize_images.py              # Nén và tối ưu hóa ảnh bìa sách
│   │   ├── populate_books.py               # Gieo dữ liệu sách phong phú
│   │   ├── seed_routes.py                  # Khởi tạo tọa độ GPS các tuyến xe và trạm dừng
│   │   ├── taste_preflight_check.py        # Kiểm định chuẩn thiết kế Neo-Bakery Design Tokens
│   │   └── test_race_condition.py          # Kiểm thử đồng thời chống tranh chấp mượn sách
│   │
│   ├── static/                             # Tài nguyên tĩnh (CSS, JS, Fonts, Images)
│   │   ├── css/
│   │   │   ├── admin_premium.css           # Tùy biến giao diện Django Admin cao cấp
│   │   │   ├── animations.css              # Hiệu ứng chuyển động Keyframe CSS
│   │   │   ├── base.css                    # Bố cục cơ sở, reset và cấu trúc lưới
│   │   │   ├── components.css              # Thư viện component: Button, Modal, Card, Input...
│   │   │   └── tokens.css                  # Bảng mã màu 6 tông Neo-Bakery & biến CSS
│   │   ├── js/
│   │   │   └── animations.js               # Khởi tạo GSAP ScrollTrigger & 3D micro-tilt physics
│   │   ├── analytics/                      # CSS & JS riêng cho bảng điều khiển phân tích
│   │   ├── blog/                           # CSS & JS cho cổng blog
│   │   └── img/                            # Hình ảnh logo, icon, placeholder
│   │
│   ├── template/                           # Hệ thống 70+ Giao diện HTML (Django Templates)
│   │   ├── analytics/                      # 11 templates bảng thống kê, biểu đồ, leaderboard
│   │   ├── blog/                           # 14 templates bài viết, danh mục, bình luận, emails
│   │   ├── inventory/                      # 22 templates catalog, chi tiết sách, lộ trình xe bus
│   │   ├── notifications/                  # 3 templates danh sách và chi tiết thông báo
│   │   ├── pages/                          # 6 templates tĩnh: Trang chủ, Giới thiệu, FAQ, Điều khoản
│   │   ├── partials/                       # Các component tái sử dụng (Phân trang, Header, Footer)
│   │   ├── transactions/                   # 10 templates phiếu mượn, hàng đợi, nộp phạt
│   │   └── users/                          # 14 templates đăng nhập, hồ sơ cá nhân, nâng cấp thẻ
│   │
│   ├── .env                                # Biến môi trường cục bộ (Database, API keys, Secret)
│   ├── .env.example                        # Mẫu biến môi trường chuẩn mẫu
│   ├── functional_test.py                  # Kiểm thử chức năng toàn diện
│   ├── generate_blog_data.py               # Tạo dữ liệu giả lập cho bài viết Blog
│   ├── generate_test_data.py               # Tạo dữ liệu kiểm thử hệ thống
│   ├── manage.py                           # Điểm điều khiển CLI của Django
│   ├── run_server.py                       # Script tiện ích khởi động server nhanh
│   └── seed_books.py                       # Kịch bản nạp sách mẫu ban đầu
│
├── .dockerignore                           # Danh sách loại trừ khi đóng gói Docker Image
├── .gitignore                              # Danh sách bỏ qua phiên bản Git
├── DESIGN.md                               # Đặc tả Design Tokens Neo-Bakery (Bảng màu, Font, Shadows)
├── docker-compose.yml                      # Điều phối 5 Container: Web, MySQL, Redis, Worker, Beat
├── Dockerfile                              # Quy trình đóng gói ứng dụng Python/Django vào container
├── PRODUCT.md                              # Đặc tả sản phẩm, chân dung người dùng & triết lý thương hiệu
├── pyproject.toml                          # Cấu hình Metadata dự án theo chuẩn PEP 518/621
├── README.md                               # Tài liệu giới thiệu dự án, kiến trúc & hướng dẫn cài đặt
├── requirements.txt                        # Danh sách thư viện Python Production cố định phiên bản
├── requirements-dev.txt                    # Danh sách thư viện phục vụ môi trường phát triển & kiểm thử
└── website.pdf                             # Tài liệu giới thiệu / Portfolio thiết kế website
```

---

## 3. Phân Tích Chi Tiết 7 Module Nghiệp Vụ (Django Apps)

Mỗi module trong thư mục `library_bus_project/` đảm nhiệm một miền nghiệp vụ riêng biệt theo mô hình **Modular Monolith**:

| Tên Module | Trọng Trách Chính | Các Models Nổi Bật | Tác Vụ Bất Đồng Bộ (Celery) |
| :--- | :--- | :--- | :--- |
| **`core`** | Nền tảng hạ tầng dùng chung, cung cấp các Abstract Base Models và Mixins. | `AuditMixin`, `BaseQuerySet`, `TimestampedModel`, `SoftDeleteModel` | Quét dọn file tạm, dọn log hệ thống |
| **`users`** | Quản lý độc giả, nhân viên, cơ chế thẻ hội viên và theo dõi lịch sử bảo mật. | `Profile`, `UserInterest`, `LoginHistory`, `UserPreference`, `UserRole` | Gửi email kích hoạt tài khoản, cấp lại mật khẩu |
| **`inventory`** | Quản lý đội xe buýt lưu động, trạm dừng, kho sách giấy & tài liệu điện tử. | `LibraryBus`, `BusRoute`, `Category`, `Book`, `BookStatusHistory`, `BookDonation` | Trích xuất thông tin sách tự động bằng Gemini AI |
| **`transactions`** | Mượn sách, trả sách, gia hạn, đặt trước (FIFO queue), và xử lý tiền phạt trễ hạn. | `BorrowRecord`, `BookReservation`, `ShippingRequest`, `FinePayment`, `BulkTransaction` | Quét sách quá hạn lúc nửa đêm, tính toán nợ phạt |
| **`analytics`** | Tổng hợp số liệu đọc sách, bảng vàng độc giả, hiệu suất lộ trình xe buýt. | `UserReadingStats`, `BookAnalytics`, `BusAnalytics`, `UserActivity`, `BookRecommendation` | Tổng hợp bảng xếp hạng tuần/tháng, huấn luyện gợi ý sách |
| **`notifications`** | Gửi thông báo đẩy nội bộ (In-app badges) và email nhắc hẹn trả sách. | `UserNotification` | Gửi email hàng loạt thông báo sự kiện xe buýt ghé trạm |
| **`blog`** | Cổng truyền thông lan tỏa văn hóa đọc, đánh giá sách, tương tác cộng đồng. | `Post`, `BlogCategory`, `BlogTag`, `PostRating`, `PostLike`, `Comment`, `Newsletter` | Gửi bản tin định kỳ (Newsletter) cho độc giả |

---

## 4. Sơ Đồ Kiến Trúc & Quan Hệ Dữ Liệu (Mermaid ERD)

### 4.1. Kiến Trúc Phân Tầng (Layered Architecture)

```mermaid
graph TD
    subgraph Presentation_Layer ["Tầng Giao Diện (Presentation)"]
        UI_Web["Django Templates + Neo-Bakery CSS"]
        GSAP_Anim["GSAP Animations (60 FPS, 3D Physics)"]
        Admin_Panel["Django Jazzmin Admin Dashboard"]
    end

    subgraph Service_Layer ["Tầng Dịch Vụ & Nghiệp Vụ (Business Logic)"]
        TransService["Transaction Service (Pessimistic Lock)"]
        AIService["Gemini AI Service (Metadata & Recommender)"]
        QueueService["FIFO Reservation Queue Manager"]
    end

    subgraph Async_Layer ["Tầng Xử Lý Nền (Background Tasks)"]
        CeleryWorker["Celery Worker (Concurrency = 4)"]
        CeleryBeat["Celery Beat (Daily Overdue Checker)"]
    end

    subgraph Data_Layer ["Tầng Lưu Trữ & Đệm (Storage & Cache)"]
        MySQL_DB[("MySQL 8.0 Primary Database")]
        Redis_Cache[("Redis 7 (Cache & Celery Broker)")]
    end

    Presentation_Layer --> Service_Layer
    Service_Layer --> Data_Layer
    Service_Layer -.-> Async_Layer
    Async_Layer --> Data_Layer
```

### 4.2. Sơ Đồ Thực Thể Quan Hệ Trọng Yếu (Entity Relationship Diagram)

```mermaid
erDiagram
    USER ||--|| PROFILE : "mở rộng hồ sơ"
    PROFILE ||--o{ BORROW_RECORD : "thực hiện mượn"
    PROFILE ||--o{ BOOK_RESERVATION : "đặt trước"
    PROFILE ||--o{ USER_NOTIFICATION : "nhận"
    
    LIBRARY_BUS ||--o{ BUS_ROUTE : "di chuyển theo"
    LIBRARY_BUS ||--o{ BOOK : "chứa sách trên xe"
    
    CATEGORY ||--o{ BOOK : "phân loại"
    BOOK ||--o{ BORROW_RECORD : "được mượn"
    BOOK ||--o{ BOOK_RESERVATION : "được đặt"
    BOOK ||--o{ BOOK_STATUS_HISTORY : "ghi vết trạng thái"
    
    BORROW_RECORD ||--o| FINE_PAYMENT : "phát sinh phạt trễ"
    BORROW_RECORD ||--o| SHIPPING_REQUEST : "giao tận nơi"
```

---

## 5. Hệ Thống Giao Diện & Design System (Neo-Bakery & GSAP)

Dự án áp dụng ngôn ngữ thiết kế **Neo-Bakery & Classic Library** dựa trên tài liệu `DESIGN.md` và `PRODUCT.md`:

### 5.1. Bảng Màu 6 Sắc Thái Cốt Lõi (6-Tone Palette):
1. **Molasses (`#4E0705`):** Màu mực gỗ gụ sẫm, dùng cho chữ hiển thị chính và nền tối.
2. **Well-Browned (`#812203`):** Màu hạt dẻ nướng, dùng cho trạng thái Hover tương tác.
3. **Roast (`#BD5705`):** Màu caramel đồng, màu nhận diện nút hành động chính (Primary CTA).
4. **Toasty (`#ED9040`):** Màu hổ phách ấm, dùng cho viền Active và điểm nhấn.
5. **Greasey (`#FFC270`):** Màu bơ mật ong vàng, dùng cho nền huy hiệu (Badge) và thẻ nổi bật.
6. **Butter (`#FDE971`):** Màu bánh nướng vàng dịu, dùng để làm sáng chữ trên nền tối.

### 5.2. Công Nghệ Chuyển Động Chuẩn Hiệu Năng Cao (GSAP 3.x):
- **Compositor-Only Animations:** 100% hoạt cảnh dùng thuộc tính `transform` và `autoAlpha`, đảm bảo mượt mà 60 FPS trên mọi thiết bị.
- **ScrollTrigger.batch():** Gom nhóm các thẻ sách và tin tức để xuất hiện mượt mà khi cuộn trang mà không giật khung hình.
- **3D Micro-Tilt Physics:** Hiệu ứng nghiêng 3D phản hồi theo con trỏ chuột khi rê qua sách tiêu biểu.
- **Tương Thích Khả Năng Tiếp Cận (A11y):** Tự động ngắt hoạt cảnh khi người dùng bật `prefers-reduced-motion`.

---

## 6. Hạ Tầng, Container & Tác Vụ Bất Đồng Bộ (DevOps & Celery)

Hệ thống được thiết kế để triển khai bằng **Docker Compose** với 5 dịch vụ biệt lập:

1. **`db` (MySQL 8.0):** CSDL chính lưu trữ dữ liệu bền vững, tự động kiểm tra trạng thái sức khỏe qua `mysqladmin ping`.
2. **`redis` (Redis 7 Alpine):** Đảm nhiệm vai trò kép: Bộ nhớ đệm tốc độ cao và Broker lưu hàng đợi tin nhắn cho Celery.
3. **`web` (Django Web Application):** Chạy ứng dụng qua Gunicorn/Waitress, phục vụ file tĩnh qua WhiteNoise.
4. **`celery_worker`:** Đội ngũ 4 tiến trình con xử lý ngầm các tác vụ nặng: gửi email, phân tích AI, trích xuất metadata.
5. **`celery_beat`:** Bộ lập lịch tác vụ định kỳ tự động chạy mỗi nửa đêm để quét sách quá hạn và cập nhật tiền phạt.

---

## 7. Kịch Bản Quản Trị & Kiểm Thử Tự Động (Scripts & Testing)

Dự án cung cấp bộ kịch bản tự động hóa mạnh mẽ trong thư mục `library_bus_project/scripts/`:

- **`deep_template_audit.py`:** Quét toàn bộ hơn 70 templates để phát hiện lỗi cú pháp Django, thẻ chưa đóng hoặc sai lệch design tokens.
- **`taste_preflight_check.py`:** Kiểm định nghiêm ngặt việc tuân thủ các quy tắc cấm (Anti-References) như cấm màu xám thuần, cấm gradient generic.
- **`test_race_condition.py`:** Mô phỏng hàng trăm yêu cầu mượn cùng 1 quyển sách tại cùng 1 phần nghìn giây để chứng minh cơ chế khóa bi quan `select_for_update` hoạt động tuyệt đối an toàn.
- **`seed_routes.py` & `populate_books.py`:** Nạp nhanh danh mục sách đầy đủ kèm tọa độ định vị GPS các điểm dừng xe thư viện lưu động trên địa bàn.
- **`optimize_images.py`:** Tự động nén WebP và điều chỉnh kích thước ảnh bìa sách trong thư mục `media/book_covers/`.

---
*Tài liệu cấu trúc này được trích xuất và hệ thống hóa tự động cho dự án `library_bus_project`.*
"""

# Write to target in C:\Users\ADMIN\Documents\prj\PROJECT_STRUCTURE.md
target_path = r'C:\Users\ADMIN\Documents\prj\PROJECT_STRUCTURE.md'
with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully written to:', target_path)
print('File size in bytes:', os.path.getsize(target_path))

# Also write a copy to the workspace so it can be referenced directly
local_copy_path = r'c:\Users\ADMIN\Documents\data-analyst-portfolio\PRJ_STRUCTURE.md'
with open(local_copy_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Local copy written to:', local_copy_path)
