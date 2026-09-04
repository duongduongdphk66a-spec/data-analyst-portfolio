export const libraryBusMarkdownContent = `
# Phân tích Chuyên sâu: Hệ thống Library Bus Management System

![Dashboard View](/library_bus_dashboard.webp)

## Phần 1: Tóm tắt Dự án & Tầm nhìn (Executive Summary)

Dự án **Library Bus Management System** (Hệ thống Quản lý Thư viện Lưu động) ra đời nhằm giải quyết bài toán vận hành logistics phức tạp của một thư viện không cố định. Khác với thư viện truyền thống, hệ thống này phải đối mặt với các thách thức:
1. **Theo dõi vị trí Real-time:** Hàng chục đầu xe bus di chuyển liên tục trên các lộ trình khác nhau.
2. **Quản lý Tồn kho Động:** Sách được mượn ở xe A nhưng có thể trả ở xe B.
3. **High Concurrency:** Nhu cầu đặt trước (Reservation) tăng đột biến khi xe dừng ở các trường học, khu dân cư đông đúc.

Để đáp ứng điều đó, tôi đã xây dựng một nền tảng Backend vững chắc, tối ưu hóa cho mức tải **50,000 Users** và **500 Concurrent Connections**, sử dụng các công nghệ tiên tiến như **Django**, **Redis**, **Celery** và **MySQL**.

---

## Phần 2: Kiến trúc Hệ thống (System Architecture)

Thay vì một ứng dụng Monolithic truyền thống xử lý đồng bộ mọi thứ, hệ thống được thiết kế theo hướng **Asynchronous Worker Pattern** để giải phóng Main Thread của server.

\`\`\`mermaid
graph TD
    Client[Client App/Browser] -->|HTTP/HTTPS| Nginx[Nginx Load Balancer]
    
    subgraph Web_Layer [Web Layer]
        Nginx --> Gunicorn1[Gunicorn Worker 1]
        Nginx --> Gunicorn2[Gunicorn Worker 2]
        Gunicorn1 --> Django[Django Application]
        Gunicorn2 --> Django
    end

    subgraph Data_Layer [Data & Cache Layer]
        Django <-->|SQL Queries| MySQL[(MySQL Database - Connection Pool)]
        Django <-->|Session / Cache| Redis[(Redis - Cache & Session)]
    end

    subgraph Async_Layer [Background Processing]
        Django -->|Task Publish| CeleryBroker[Celery Broker (Redis)]
        CeleryBroker --> CeleryWorker[Celery Worker Processes]
        CeleryWorker <--> MySQL
        CeleryWorker <--> Redis
        CeleryBeat[Celery Beat Cron] --> CeleryBroker
    end
\`\`\`

**Lý do chọn Tech Stack:**
- **Django:** Môi trường ORM mạnh mẽ giúp định nghĩa Database Schema phức tạp một cách an toàn.
- **MySQL:** Sự lựa chọn hoàn hảo cho hệ thống quản lý giao dịch (ACID compliance), kết hợp Connection Pooling để không bị quá tải kết nối.
- **Redis:** Đảm nhận 3 vai trò: (1) Lưu trữ Cache phân tán để tránh Hit Database, (2) Lưu trữ Session người dùng siêu tốc, (3) Làm Message Broker cho Celery.
- **Celery:** Trì hoãn các tác vụ nặng (như gửi email, quét dữ liệu quá hạn, xử lý ảnh avatar) ra khỏi luồng Request-Response của người dùng.

---

## Phần 3: Thiết kế Database & Tính toàn vẹn (Database Design & Integrity)

Mọi hệ thống lớn đều bắt đầu từ một schema vững chắc. Tại tầng Database, tôi đã thiết lập hàng loạt Ràng buộc (Constraints) để đảm bảo dữ liệu không bao giờ bị sai lệch (Data Inconsistency).

Một ví dụ điển hình trong \`transactions/models.py\`:

\`\`\`python
class BorrowRecord(SoftDeleteModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey('inventory.Book', on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'book'], 
                condition=Q(return_date__isnull=True), 
                name='unique_active_borrow'
            )
        ]
\`\`\`
**Phân tích kỹ thuật:** \`UniqueConstraint\` kết hợp với \`Q(return_date__isnull=True)\` là một chiêu thức bảo vệ cấp độ Database (Database-level protection). Nó đảm bảo rằng: Một người dùng không thể mượn cùng một cuốn sách hai lần nếu họ chưa trả cuốn trước đó. Bất kể Backend có bị Race Condition thế nào, Database sẽ chặn lại.

---

## Phần 4: Trải nghiệm Người dùng (Mobile App UI)

![Mobile App View](/library_bus_mobile_app.webp)
*Hình 1: Đề xuất Giao diện Mobile App cho độc giả - Tích hợp thẻ thư viện số.*

---

## Phần 5: Kỹ Thuật Tối Ưu Hóa Hiệu Năng (Performance Optimization)

Đây là điểm nhấn quan trọng nhất của hệ thống. Tôi đã xử lý triệt để bài toán **N+1 Queries** và quá tải tính toán.

### 5.1. Kỹ thuật Denormalization (Lưu trữ phi chuẩn hóa)

Khi hiển thị danh sách các xe Bus, hệ thống cần biết "Xe này đang chứa bao nhiêu quyển sách có sẵn?". Nếu dùng hàm \`COUNT()\` của SQL lên bảng Book cho mỗi xe, Database sẽ sập khi lượng truy cập lớn.
Tôi đã áp dụng kỹ thuật lưu sẵn kết quả (\`_book_count\`) kết hợp với Cache:

\`\`\`python
# Trích xuất từ inventory/models.py
class LibraryBus(TimestampedModel):
    # Denormalized fields
    _book_count = models.PositiveIntegerField(default=0, verbose_name="Số sách hiện tại")
    
    @property
    def current_book_count(self):
        """Sử dụng cache và denormalized field để tối ưu query cực hạn"""
        cache_key = self.CACHE_KEY_BOOK_COUNT.format(self.id)
        count = cache.get(cache_key) # Truy vấn O(1) từ Redis
        
        if count is None:
            # Chỉ khi Cache Miss (do hết hạn hoặc bị xóa), mới đụng đến Database
            count = self.books_on_bus.filter(status='available').count()
            cache.set(cache_key, count, self.CACHE_TIMEOUT)
            
            # Cập nhật trường lưu trữ phi chuẩn hóa
            if self._book_count != count:
                self._book_count = count
                self.save(update_fields=['_book_count', '_last_book_update'])
        
        return count
\`\`\`

### 5.2. Prefetching & Custom QuerySets

Thay vì dùng ORM mặc định, mọi Model đều có Custom QuerySet để chuẩn bị sẵn dữ liệu qua JOIN (select_related) hoặc Subqueries (prefetch_related).

\`\`\`python
class BookQuerySet(BaseQuerySet):
    def with_relations(self):
        """Prefetch các relationship thường dùng trong 1 query duy nhất"""
        return self.select_related('category', 'location').prefetch_related(
            Prefetch('status_history', queryset=BookStatusHistory.objects.select_related('changed_by'))
        )
\`\`\`

---

## Phần 6: Data Analytics & Background Jobs (Celery)

![Analytics Dashboard](/library_bus_analytics.webp)
*Hình 2: Màn hình Analytics Dashboard - Thống kê lượng mượn sách và hoạt động của Library Bus.*

### 6.1. Xử lý thuật toán bằng Cron Jobs

Tôi đã định nghĩa \`popularity_score\` (Điểm phổ biến) cho sách. Thuật toán này cần duyệt qua toàn bộ bảng tính (Lượt mượn 70% + Rating 30%). Do tính toán quá nặng, nó được đưa vào **Celery Beat** để chạy ngầm lúc 2h sáng:

\`\`\`python
    def calculate_popularity_score(self):
        """Tính điểm phổ biến dựa trên rating và lượt mượn"""
        rating_weight = 0.3
        borrow_weight = 0.7
        
        normalized_rating = (self._average_rating / 5) * 100 if self._average_rating else 0
        normalized_borrows = min(self._total_borrows / 100, 1) * 100  # Cap at 100 borrows
        
        return (normalized_rating * rating_weight) + (normalized_borrows * borrow_weight)
\`\`\`

### 6.2. Hàng đợi Đặt trước (Reservation Queue)

Hệ thống có cơ chế "Hàng đợi" (Queue). Khi sách đã hết, User A, B, C có thể đặt trước. Khi sách về, hệ thống tự động:
1. Gán trạng thái \`is_fulfilled = True\` cho người đầu tiên.
2. Dịch chuyển (Reorder) vị trí \`queue_position\` của những người sau lên 1 bậc bằng hàm SQL update cấp thấp \`update(queue_position=F('queue_position') - 1)\` để đảm bảo Atomicity (không bị lỗi Race Condition).

---

## Phần 7: Bảo mật & Phân quyền (Security & ACL)

Hệ thống sở hữu một kiến trúc **Role-Based Access Control (RBAC)** tùy biến rất mạnh mẽ vượt ngoài giới hạn của Django Groups mặc định:

\`\`\`python
class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    scope = models.JSONField()  # Ví dụ: {'library_bus': [1,2], 'permissions': ['can_issue_fine']}
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField(null=True, blank=True)
\`\`\`
Bằng cách dùng \`JSONField\` cho \`scope\`, ta có thể cấp quyền siêu chi tiết: Ví dụ một Thủ thư (Librarian) chỉ được quyền quản lý sách trên xe bus số 1 và 2, và quyền hạn này sẽ tự động hết hạn (\`valid_to\`) sau thời gian thực tập.

Ngoài ra, \`LoginHistory\` tracking toàn bộ IP và User Agent để phát hiện bất thường:
\`\`\`python
class LoginHistory(TimestampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    is_successful = models.BooleanField(default=True)
\`\`\`

---

## Tổng kết (Conclusion)

**Library Bus Management System** không chỉ đơn thuần là một ứng dụng CRUD. Nó là một bài thực hành toàn diện về **System Design, Database Optimization, Caching, Asynchronous Task Queue và Bảo mật**. 

Thông qua dự án này, tôi tự tin vào khả năng giải quyết các vấn đề liên quan đến độ trễ hệ thống (Latency), tính toàn vẹn của dữ liệu (Data Integrity) và kiến trúc ứng dụng (Software Architecture) trong các môi trường doanh nghiệp quy mô lớn.
`;

// ---- Static content data arrays (extracted from LibraryBusProject.tsx) ----

export const DJANGO_APPS = [
  { app: 'core', desc: 'CacheMixin, audit base models, common utilities' },
  { app: 'users', desc: 'Custom user model, authentication, profiles' },
  { app: 'inventory', desc: 'Quản lý sách, danh mục và đội xe LibraryBus' },
  { app: 'transactions', desc: 'Mượn/trả, đặt trước sách, giao nhận, tiền phạt' },
  { app: 'notifications', desc: 'Thông báo quá hạn, nhắc lịch xe bus, email' },
  { app: 'blog', desc: 'Tin tức khuyến đọc, bài viết giới thiệu sách' },
  { app: 'analytics', desc: 'UserReadingStats, BookAnalytics, BusAnalytics' },
  { app: 'celery_tasks', desc: 'Celery Beat cron jobs, async worker pipelines' },
];

export const PIPELINE_STOPS = [
  {
    stop: '1',
    title: 'Sự kiện gốc: mượn / trả / xem / đánh giá',
    desc: 'Mỗi hành động của người dùng ghi ra một dòng UserActivity: bảng log trung tâm có compound index theo (user, created_at) để truy vấn lịch sử cá nhân nhanh, và index theo activity_type cho báo cáo tổng hợp.',
    tag: 'model : UserActivity'
  },
  {
    stop: '2',
    title: 'Xử lý bất đồng bộ bằng Celery, không chặn request',
    desc: 'View chỉ đẩy job vào hàng đợi (.delay()) rồi trả response ngay. Việc cộng dồn điểm uy tín, tính lại độ phổ biến sách hay hiệu suất xe bus diễn ra trong Celery worker, bọc trong transaction.atomic() và dùng F() expression để chống race condition.',
    tag: 'tasks.py : update_analytics_on_borrow_task'
  },
  {
    stop: '3',
    title: 'Ba tầng thống kê được tính riêng biệt',
    desc: 'UserReadingStats (điểm uy tín, chuỗi đọc, 5 cấp thành viên) · BookAnalytics (điểm phổ biến sách) · BusAnalytics (hiệu suất từng xe bus). Tách riêng để mỗi loại có nhịp cập nhật và thời gian cache độc lập.',
    tag: 'models : UserReadingStats · BookAnalytics · BusAnalytics'
  },
  {
    stop: '4',
    title: 'Cache theo version, không xoá key thủ công',
    desc: 'Thay vì dò quét xoá từng cache key khi dữ liệu đổi, mỗi model có một "version" riêng trong Redis; key thực tế sinh ra gồm cả version đó. Chỉ cần tăng version lên 1 là toàn bộ cache cũ tự động hết hạn mà không cần biết danh sách key.',
    tag: 'core/models.py : CacheMixin'
  },
  {
    stop: '5',
    title: 'Job định kỳ tổng hợp lại theo ngày',
    desc: 'Celery Beat chạy generate_daily_stats_task mỗi đêm để chốt số liệu của app DailyStats (tổng user, active user, lượt mượn/trả, người dùng mới, lượt xem, review), là nguồn dữ liệu cho biểu đồ xu hướng tuần/tháng.',
    tag: 'DailyStats.generate_daily_stats()'
  },
  {
    stop: '6',
    title: 'Hiển thị: Dashboard cá nhân & Dashboard vận hành',
    desc: 'Độc giả theo dõi hạng, chuỗi ngày đọc và gợi ý sách. Quản trị viên theo dõi sách phổ biến, độc giả dẫn đầu, phân bố cấp độ, xe bus hiệu quả nhất và biểu đồ xu hướng kèm xuất PDF/Excel.',
    tag: 'templates/analytics/*.html · Recharts / Chart.js'
  }
];

export const SCHEMA_MODELS = [
  { name: 'UserReadingStats', role: 'Hồ sơ đọc & Gamification của từng user', feat: 'Có total_points, completion_rate, reading_velocity tính động qua property' },
  { name: 'BookAnalytics', role: 'Thống kê & điểm phổ biến từng đầu sách', feat: 'Có classmethod get_trending_books() lọc theo cửa sổ thời gian, cache 15 phút' },
  { name: 'BusAnalytics', role: 'Thống kê & hiệu suất từng xe bus', feat: 'Liên kết 1-1 với inventory.LibraryBus, cache Redis 30 phút' },
  { name: 'UserActivity', role: 'Log sự kiện trung tâm kiêm audit trail', feat: 'Trường metadata dạng JSONField để mở rộng linh hoạt không cần migration' },
  { name: 'BookRecommendation', role: 'Gợi ý sách theo 5 thuật toán', feat: 'popular, similar_users, same_category, trending, personalized' },
  { name: 'DailyStats', role: 'Tổng hợp theo ngày cho biểu đồ xu hướng', feat: 'Sinh tự động mỗi đêm qua Celery Beat, unique constraint theo ngày' },
  { name: 'ArchivedUserActivity', role: 'Lưu trữ hoạt động >90 ngày', feat: 'Soft-delete pattern dọn nhẹ bảng chính nhưng không mất dữ liệu' },
];

export const CELERY_TASKS = [
  { time: '00:00', task: 'Bảo trì hệ thống & tính DailyStats', tag: 'daily_maintenance' },
  { time: 'CN · 03:00', task: 'Tính lại điểm phổ biến toàn bộ sách', tag: 'recalculate_popularity_scores_task' },
  { time: '05:00', task: 'Làm nóng cache (top sách, top độc giả, tuần)', tag: 'cache_warmup_task' },
  { time: '06:00', task: 'Quét sách quá hạn trả', tag: 'check_overdue_books' },
  { time: '08:00', task: 'Gửi thông báo nhắc hạn trả sách', tag: 'send_due_reminders' },
  { time: 'Mỗi 30 phút', task: 'Xử lý hàng đợi đặt trước sách', tag: 'process_reservation_queue' },
];

export const TECH_STACK = [
  { name: 'Django 5', role: 'Web Framework' },
  { name: 'MySQL', role: 'Relational Database' },
  { name: 'Redis + django-redis', role: 'Cache Layer' },
  { name: 'Celery + Celery Beat', role: 'Async Queue & Scheduled Tasks' },
  { name: 'WhiteNoise', role: 'Static Files Compression' },
  { name: 'Jazzmin', role: 'Admin Interface' },
  { name: 'Argon2', role: 'Password Hashing' },
  { name: 'Recharts / Chart.js', role: 'Interactive Telemetry' },
  { name: 'i18n', role: 'Asia/Ho_Chi_Minh Timezone' },
];
