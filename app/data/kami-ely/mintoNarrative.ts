/**
 * Minto Pyramid Restructured Content & 22-Chart Manifest for Kami Ely Case Study.
 * Concise narrative (~760 words) with bilingual support (VI/EN).
 */

export interface MintoSectionContent {
  title: { vi: string; en: string };
  insight: { vi: string; en: string };
  charts: { id: number; label: { vi: string; en: string } }[];
}

export const MINTO_NARRATIVE = {
  header: {
    projectTitle: {
      vi: 'Phân tích Toàn diện TikTok Shop & Creator Kami Ely: Từ Vận hành Thương mại đến Tối ưu hóa Thống kê',
      en: 'Comprehensive TikTok Shop & Creator Analysis for Kami Ely: From Commercial Operations to Statistical Optimization'
    },
    context: {
      vi: 'Đánh giá hiệu suất tạo doanh thu (GMV), hành vi chuyển đổi nội dung (Video vs. Livestream) và cấu trúc danh mục sản phẩm (SKU) của thương hiệu Kami Ely trên TikTok Shop để tìm ra đòn bẩy tăng trưởng bền vững.',
      en: 'Evaluate GMV generation, content conversion behavior (Video vs. Livestream), and product SKU architecture for the Kami Ely brand on TikTok Shop to identify sustainable growth levers.'
    },
    conclusion: {
      vi: 'Doanh thu phụ thuộc mạnh vào các phiên bùng nổ ngắn hạn và nhóm SKU chủ lực (Pareto 80/20); kênh Video ngắn duy trì hiệu suất chuyển đổi ổn định hơn Livestream, trong khi mô hình tối ưu hóa danh mục giúp cải thiện biên độ GMV kỳ vọng mà không cần tăng tương ứng tần suất đăng bài.',
      en: 'Revenue relies heavily on short-term campaign surges and core Pareto 80/20 SKUs. Short-form video maintains more stable conversion efficiency than Livestream, while portfolio optimization improves expected GMV without proportionally increasing posting cadence.'
    },
    proofCta: {
      vi: 'Xem 19 ảnh bằng chứng FastMoss & Đối soát dữ liệu',
      en: 'View 19 FastMoss Proof Screenshots & Reconciliation Telemetry'
    },
    kpiStrip: [
      {
        id: 'gmv',
        label: { vi: 'Tổng GMV (180 Ngày)', en: 'Total Net GMV (180d)' },
        value: '12,74 Tỉ VNĐ',
        sub: { vi: '85.500 sản phẩm đã bán', en: '85,500 units sold' },
        change: { vi: 'All-time 31,6 Tỉ', en: 'All-time 31.6B' }
      },
      {
        id: 'orders',
        label: { vi: 'Tổng Đơn Hàng', en: 'Total Orders' },
        value: '85.500 SP',
        sub: { vi: 'Bình quân 475 SP/ngày', en: 'Avg 475 units/day' },
        change: { vi: 'Đỉnh 1.936 SP/ngày', en: 'Peak 1,936 units/day' }
      },
      {
        id: 'aov',
        label: { vi: 'Giá Trị Đơn Trung Bình (AOV)', en: 'Average Order Value (AOV)' },
        value: '~149.000 VNĐ',
        sub: { vi: 'Xu hướng mua gộp combo', en: 'Combo bundle tendency' },
        change: { vi: 'Biến động theo chiến dịch', en: 'Campaign dependent' }
      },
      {
        id: 'cvr',
        label: { vi: 'Tỷ Lệ Chuyển Đổi Trung Bình', en: 'Average Conversion Rate' },
        value: '~1,85%',
        sub: { vi: 'GPM Video 4,5x vs. LIVE', en: 'Video GPM 4.5x vs. LIVE' },
        change: { vi: '135,2k vs. 30,2k đ/1k views', en: '135.2k vs. 30.2k / 1k views' }
      }
    ],
    telemetry: {
      title: { vi: 'Độ Tin Cậy Dữ Liệu & Đối Soát Telemetry', en: 'Data Integrity & Telemetry Reconciliation' },
      verifiedRate: '100% AUDITED',
      tablesCount: '8 bảng cơ sở dữ liệu',
      rowsCount: '18.778 bản ghi SSOT',
      description: {
        vi: 'Khớp 100% dữ liệu tài chính giữa hệ thống phân tích nội bộ và báo cáo gốc FastMoss / TikTok Seller Center qua mã băm kiểm định.',
        en: '100% match between internal analytics pipelines and original FastMoss / TikTok Seller Center telemetry via cryptographic audit verification.'
      }
    }
  },

  tab1: {
    navTitle: { vi: '1. Hiệu Suất Thương Mại & Nội Dung', en: '1. Commercial & Content Performance' },
    navSubtitle: { vi: 'Doanh thu • Livestream vs. Video • Phân khúc SKU • Mạng lưới KOC', en: 'Revenue • Live vs. Video • SKU Strategy • KOC Network' },
    navBadge: '10 Biểu đồ • Phễu 4 Bước',
    sec1_1: {
      badge: '1.1',
      title: { vi: 'Bức tranh Doanh thu & Tăng trưởng', en: 'Revenue Trajectory & Growth Cycles' },
      insight: {
        vi: 'GMV tăng trưởng theo chu kỳ chiến dịch rõ rệt thay vì phân bổ đều theo ngày. Sự dịch chuyển của AOV cho thấy khách hàng có xu hướng mua gộp combo vào các ngày khuyến mãi lớn, tạo ra các đỉnh doanh thu cục bộ.',
        en: 'GMV expands in pronounced campaign cycles rather than distributing evenly by day. Shifts in AOV show shoppers bundle combos on major promo dates, creating concentrated localized revenue peaks.'
      },
      chart3: { vi: 'Biểu đồ #3: Biểu đồ kết hợp (Line + Bar): Diễn biến GMV và Số lượng đơn hàng theo thời gian', en: 'Chart #3: Combined Line + Bar: GMV and Order Volume Trajectory Over Time' },
      chart4: { vi: 'Biểu đồ #4: Biểu đồ cơ cấu (Donut/Stacked Bar): Tỷ trọng doanh thu theo nguồn tạo đơn (Tự nhiên, Quảng cáo, Affiliate)', en: 'Chart #4: Composition Donut: Revenue Breakdown by Order Source (Organic, Paid Ads, Affiliate)' }
    },
    sec1_2: {
      badge: '1.2',
      title: { vi: 'Chuyển đổi Nội dung: Video ngắn vs. Livestream', en: 'Content Conversion: Short-Video vs. Livestream' },
      insight: {
        vi: 'Video ngắn đóng vai trò là phễu thu hút lưu lượng và tạo đơn tự nhiên ổn định dài hạn, trong khi Livestream tạo ra xung lực chốt đơn tức thời theo khung giờ vàng nhưng biến động mạnh theo tần suất lên sóng của Creator.',
        en: 'Short-form video serves as an organic top-of-funnel traffic driver with sustained conversion, whereas Livestream drives immediate checkout momentum during prime hours but fluctuates sharply with host on-air frequency.'
      },
      chart5: { vi: 'Biểu đồ #5: Biểu đồ so sánh song song: Đóng góp GMV và Tỷ lệ chuyển đổi (CVR) giữa Livestream và Video ngắn', en: 'Chart #5: Side-by-Side Comparison: GMV Contribution and Conversion Rate (CVR) Between Livestream and Short-Video' },
      chart6: { vi: 'Biểu đồ #6: Biểu đồ phân tán (Scatter Plot): Tương quan giữa Lượt xem video (Views), Tương tác (Engagement) và Doanh số tạo ra', en: 'Chart #6: Scatter Plot: Correlation Between Views, Engagement, and Generated Sales' },
      chart7: { vi: 'Biểu đồ #7: Bản đồ nhiệt (Activity Heatmap): Tần suất đăng tải nội dung/lên sóng và khung giờ mang lại hiệu suất cao nhất', en: 'Chart #7: Activity Heatmap: Posting Cadence and Peak-Performance Broadcast Windows' }
    },
    sec1_3: {
      badge: '1.3',
      title: { vi: 'Chiến lược Danh mục SKU & Định giá', en: 'SKU Portfolio Strategy & Pricing Architecture' },
      insight: {
        vi: 'Doanh số tập trung cao ở nhóm sản phẩm mồi câu ở phân khúc giá dễ tiếp cận, giúp kéo lượt mua đầu tiên trước khi điều hướng khách hàng sang các mã SKU có giá trị cao hơn.',
        en: 'Sales volume concentrates heavily in accessible lead-in entry price tiers, securing initial purchases before steering customers toward higher-ticket SKU variants.'
      },
      chart8: { vi: 'Biểu đồ #8: Biểu đồ Pareto (Bar + Cumulative Line): Top SKU đóng góp 80% tổng doanh thu cửa hàng', en: 'Chart #8: Pareto Analysis: Top SKUs Contributing 80% of Total Store Revenue' },
      chart9: { vi: 'Biểu đồ #9: Biểu đồ phân bổ dải giá (Price Tier Distribution): Số lượng đơn hàng và doanh thu theo từng phân khúc giá', en: 'Chart #9: Price Tier Distribution: Order Volume and Net Revenue Across Price Brackets' }
    },
    sec1_4: {
      badge: '1.4',
      title: { vi: 'Mạng lưới Affiliate & Chân dung Khán giả', en: 'Affiliate Network & Audience Demographics' },
      insight: {
        vi: 'Doanh thu liên kết tập trung vào nhóm KOC hạt nhân có tệp người xem trùng khớp cao với chân dung khách hàng mục tiêu (nữ giới, nhóm tuổi trẻ có hành vi mua sắm giải trí).',
        en: 'Affiliate revenue concentrates within a core group of KOCs whose audience demographics tightly align with target shoppers: young females engaging in shoppertainment.'
      },
      chart10: { vi: 'Biểu đồ #10: Biểu đồ xếp hạng: Hiệu quả tạo GMV theo phân nhóm nhà sáng tạo liên kết (Affiliate Tiers)', en: 'Chart #10: Tier Ranking: GMV Productivity by Affiliate Creator Tier' },
      chart11: { vi: 'Biểu đồ #11: Biểu đồ tháp/cột: Phân bổ Độ tuổi & Giới tính tệp người theo dõi', en: 'Chart #11: Demographic Pyramid: Follower Age & Gender Distribution' },
      chart12: { vi: 'Biểu đồ #12: Biểu đồ Radar/Bar: Chỉ số sức khỏe kênh Creator và mức độ quan tâm theo chủ đề', en: 'Chart #12: Radar & Metric Grid: Channel Operational Health and Category Affinity' }
    }
  },

  tab2: {
    navTitle: { vi: '2. Thống Kê Kiểm Định & Tối Ưu Hóa', en: '2. Statistical Testing & Optimization' },
    navSubtitle: { vi: 'EDA & Tương quan • Kiểm định Giả thuyết • Mô phỏng What-If', en: 'EDA & Correlation • Hypothesis Testing • What-If Simulator' },
    navBadge: '6 Biểu đồ • p < 0.05',
    sec2_1: {
      badge: '2.1',
      title: { vi: 'Phân tích Khám phá (EDA) & Tương quan Đa biến', en: 'Exploratory Data Analysis (EDA) & Multivariate Correlation' },
      insight: {
        vi: 'Phân phối doanh thu trên mỗi video và đơn hàng lệch phải mạnh (Right-skewed) với sự xuất hiện của các phiên viral đột biến. Ma trận tương quan xác nhận tỷ lệ nhấp vào giỏ hàng và thời lượng xem có mối liên hệ chặt với GMV hơn tổng lượt xem thuần túy.',
        en: 'Revenue distribution per video and order exhibits strong right-skewness driven by episodic viral breakouts. The correlation matrix confirms cart click-through rate and watch duration correlate more strongly with GMV than aggregate raw views alone.'
      },
      chart13: { vi: 'Biểu đồ #13: Biểu đồ Phân phối & Hộp (Histogram + Boxplot từ eda.ts): Độ lệch phân phối GMV và phát hiện giá trị ngoại lai (Outliers)', en: 'Chart #13: Distribution & Boxplot (from eda.ts): Revenue Skewness and Outlier Detection' },
      chart14: { vi: 'Biểu đồ #14: Ma trận Nhiệt Tương quan (Correlation Heatmap từ correlation.ts): Hệ số tương quan Pearson/Spearman giữa các biến số vận hành', en: 'Chart #14: Correlation Heatmap (from correlation.ts): Pearson/Spearman Coefficients Across Operational Variables' }
    },
    sec2_2: {
      badge: '2.2',
      title: { vi: 'Kiểm định Giả thuyết & Chuỗi Thời gian', en: 'Hypothesis Testing & Time-Series Decomposition' },
      insight: {
        vi: 'Kiểm định thống kê (p-value < 0.05) bác bỏ giả thuyết ngẫu nhiên, khẳng định sự khác biệt có ý nghĩa thống kê về hiệu suất chuyển đổi giữa các định dạng nội dung và khung thời gian chiến dịch.',
        en: 'Statistical testing (p-value < 0.05) rejects the null hypothesis, demonstrating statistically significant differences in conversion efficiency across content formats and campaign windows.'
      },
      chart15: { vi: 'Biểu đồ #15: Biểu đồ Kiểm định Giả thuyết (hypothesis.ts): So sánh khoảng tin cậy 95% và phân phối kiểm định giữa các nhóm thử nghiệm', en: 'Chart #15: Hypothesis Testing Chart (hypothesis.ts): 95% Confidence Interval Comparison and Test Distributions' },
      chart16: { vi: 'Biểu đồ #16: Biểu đồ Phân rã Chuỗi thời gian (timeSeries.ts): Tách biệt đường Xu hướng dài hạn (Trend), Tính mùa vụ (Seasonality) và Nhiễu (Residuals)', en: 'Chart #16: Time-Series Decomposition (timeSeries.ts): Isolating Long-Term Trend, Seasonality, and Residual Noise' }
    },
    sec2_3: {
      badge: '2.3',
      title: { vi: 'Ma trận Phân nhóm SKU & Mô phỏng Tối ưu', en: 'SKU Portfolio Matrix & Optimization Simulation' },
      insight: {
        vi: 'Phân loại danh mục thành 4 góc phần tư giúp tái phân bổ nguồn lực nội dung và ngân sách sang nhóm SKU có biên lợi nhuận và tốc độ vòng quay cao nhất.',
        en: 'Categorizing the catalog into a 4-quadrant portfolio matrix enables reallocating content and ad budget toward SKUs with highest margin contributions and inventory velocity.'
      },
      chart17: { vi: 'Biểu đồ #17: Ma trận 4 góc phần tư (skuMatrix.ts): Phân nhóm SKU theo Tốc độ bán (Velocity) và Giá trị mang lại (Margin/GMV)', en: 'Chart #17: 4-Quadrant Matrix (skuMatrix.ts): Segmenting SKUs by Sales Velocity and Margin Contribution' },
      chart18: { vi: 'Biểu đồ #18: Biểu đồ Mô phỏng Tối ưu hóa (ScienceOptimizerSection.tsx): Dự phóng mức tăng trưởng GMV khi tái cơ cấu tỷ trọng SKU và tần suất nội dung', en: 'Chart #18: Optimization Simulation (ScienceOptimizerSection.tsx): Projected GMV Growth via SKU Mix Rebalancing and Content Frequency Cadence' },
      notebookCta: {
        vi: 'Xem toàn bộ Jupyter Notebook & Code Python',
        en: 'View Full Jupyter Notebook & Python Source Code'
      }
    }
  },

  tab3: {
    navTitle: { vi: '3. Kỹ Thuật Dữ Liệu & Phòng Lab SQL', en: '3. Data Engineering & SQL Lab' },
    navSubtitle: { vi: 'ETL Pipeline • Cohort Retain • Phễu SQL • Lab tương tác', en: 'ETL Pipeline • Cohort Retention • SQL Funnels • Interactive Lab' },
    navBadge: '4 Biểu đồ • SQL Lab',
    architectureInsight: {
      vi: 'Kiến trúc & Làm sạch Dữ liệu (Stage 1 + 2 + 7): Dữ liệu thô từ TikTok Shop và FastMoss được chuẩn hóa qua pipeline ETL, loại bỏ bản ghi trùng lặp, xử lý giá trị khuyết thiếu và ẩn danh hóa thông tin định danh cá nhân (PII Masking) trước khi đưa vào bảng phân tích.',
      en: 'Data Architecture & Cleansing (Stage 1 + 2 + 7): Raw feeds from TikTok Shop and FastMoss are standardized through an ETL pipeline, eliminating duplicate records, handling missing values, and masking PII prior to analytical modeling.'
    },
    queryInsight: {
      vi: 'Truy vấn Hành vi Chuyên sâu (Stage 3 đến 6): Ứng dụng Window Functions và CTEs để bóc tách phễu mua hàng, theo dõi tỷ lệ giữ chân khách hàng theo tháng (Cohort) và tự động gắn cờ các phiên có biến động doanh thu bất thường (Z-Score Anomaly Detection).',
      en: 'Deep Behavioral Querying (Stage 3 to 6): Window functions and CTEs decompose the checkout funnel, track month-over-month customer cohort retention, and flag revenue anomalies via Z-Score detection.'
    },
    chart19: { vi: 'Biểu đồ #19: Sơ đồ Kiến trúc & Lược đồ Bảng (Stage1Architecture.tsx + KamiElyDataScopeMatrix.tsx): Luồng ETL và quan hệ giữa các bảng dữ liệu', en: 'Chart #19: Architecture & Schema Diagram (Stage1Architecture.tsx + KamiElyDataScopeMatrix.tsx): ETL Pipeline Flow and Relational Data Models' },
    chart20: { vi: 'Biểu đồ #20: Biểu đồ Phễu Chuyển đổi (Stage5Funnels.tsx): Tỷ lệ rơi rụng từ Lượt hiển thị → Nhấp sản phẩm → Thêm giỏ hàng → Thanh toán thành công', en: 'Chart #20: Funnel Conversion Chart (Stage5Funnels.tsx): Drop-off from Impressions → Product Clicks → Add to Cart → Successful Checkout' },
    chart21: { vi: 'Biểu đồ #21: Ma trận Giữ chân Khách hàng (Stage4Cohorts.tsx): Tỷ lệ mua lặp lại theo nhóm khách hàng qua từng chu kỳ', en: 'Chart #21: Customer Cohort Retention Matrix (Stage4Cohorts.tsx): Repeat Purchase Rates Across Cycles' },
    chart22: { vi: 'Biểu đồ #22: Biểu đồ Phát hiện Dị biệt bằng SQL (Stage6Anomalies.tsx gộp Stage3TimeSeries.tsx): Đánh dấu các điểm tăng/giảm đột biến vượt ngưỡng chuẩn', en: 'Chart #22: SQL Anomaly Detection Chart (Stage6Anomalies.tsx + Stage3TimeSeries.tsx): Flagging Statistical Outliers Beyond Thresholds' },
    sqlLabTitle: { vi: 'Phòng Lab Thực Thi SQL Trực Tiếp', en: 'Interactive SQL Query Workbench' }
  }
} as const;
