'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Code2,
  AlertTriangle,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Chip, usePlaybookLang } from '../playbook/PlaybookUi';
import {
  UNIFIED_9_QUALITY_GATES,
  CLEAN_SQL_LIBRARY,
} from './kamiElyVerified231d';

export interface Tier3EngineeringAppendixProps {
  onOpenNotebook?: () => void;
}

type AppendixSection = 'a-quality' | 'b-sql' | 'c-limits';

export default function Tier3EngineeringAppendix({ onOpenNotebook }: Tier3EngineeringAppendixProps) {
  const { L, isEn } = usePlaybookLang();
  const [activeTab, setActiveTab] = useState<AppendixSection>('a-quality');
  const [sqlIdx, setSqlIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopySql = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const navItems: { id: AppendixSection; anchor: string; labelVi: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'a-quality',
      anchor: 'sec-appendix-a',
      labelVi: 'A. Hồ sơ dữ liệu & 9 cổng chất lượng',
      labelEn: 'A. Data profiling & 9 quality gates',
      icon: <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'b-sql',
      anchor: 'sec-appendix-b',
      labelVi: 'B. Thư viện SQL theo chương',
      labelEn: 'B. Chapter SQL library',
      icon: <Code2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'c-limits',
      anchor: 'sec-appendix-c',
      labelVi: 'C. Hạn chế & giả định phương pháp',
      labelEn: 'C. Limitations & assumptions',
      icon: <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
  ];

  const rawToCleanRows = [
    {
      sourceVi: 'Shop LIVE (toàn shop)',
      sourceEn: 'Shop LIVE (store-wide)',
      rawVi: '8.355 dòng',
      rawEn: '8,355 rows',
      cleanVi: '8.355 ca (kỳ Hè: 7.046 phiên)',
      cleanEn: '8,355 lives (Summer: 7,046 sessions)',
      noteVi: 'Khử trùng lặp theo session_id + row_hash. Con số 7.367 ở bản thảo cũ là số đếm trung gian trước khi deduplicate theo ca Live. 231 ngày gồm: 595 ca chính chủ + 261 ca vệ tinh @koc_sat01 + 7.499 ca 301 KOC khác.',
      noteEn: 'Deduplicated on session_id + row_hash. The 7,367 count in legacy drafts was an intermediate sum before session deduplication. 231d total: 595 official + 261 @koc_sat01 + 7,499 external lives.',
    },
    {
      sourceVi: 'Creator Live List (chính chủ)',
      sourceEn: 'Creator Live List (official)',
      rawVi: '600 dòng',
      rawEn: '600 rows',
      cleanVi: '595 phiên (kỳ Hè: 470 phiên)',
      cleanEn: '595 sessions (Summer: 470 sessions)',
      noteVi: 'Lý do lọc: Dấu thời gian gốc lệch -13 giờ so với giờ Việt Nam; sau khi dịch +13 giờ, loại 5 ca ngày 07-08/03/2026 nằm ngoài cửa sổ quan sát 231 ngày (bắt đầu từ 09/03). Kỳ Hè (đến 04/09) gồm 470 ca.',
      noteEn: 'Filtering reason: Raw timestamps lagged -13h behind VN UTC+7; shifted +13h, 5 pre-09/03 sessions were excluded from the 231d window. Summer window (to Sep 04) holds 470 sessions.',
    },
    {
      sourceVi: 'Shoppable Videos',
      sourceEn: 'Shoppable Videos',
      rawVi: '4.797 dòng',
      rawEn: '4,797 rows',
      cleanVi: '4.796 clip (kỳ Hè: 4.417 clip)',
      cleanEn: '4,796 clips (Summer: 4,417 clips)',
      noteVi: 'Lý do lọc: Khử 1 dòng trùng khóa phức hợp (koc_hash + tiêu đề + giờ đăng). Kỳ Hè 180 ngày có 4.417 clip (960 clip ra đơn). Toàn kỳ 231 ngày có 4.796 clip (doanh số ghi nhận cửa sổ trượt 90 ngày).',
      noteEn: 'Filtering reason: Deduplicated 1 composite-key row. Summer 180d slice had 4,417 clips (960 converting). Full 231d table holds 4,796 clips with rolling 90d sales.',
    },
    {
      sourceVi: 'Creator (affiliate)',
      sourceEn: 'Creator (affiliate directory)',
      rawVi: '6.086 dòng',
      rawEn: '6,086 rows',
      cleanVi: '6.085 creator (kỳ Hè: 5.712 creator)',
      cleanEn: '6,085 creators (Summer: 5,712 creators)',
      noteVi: 'Lý do lọc: Tách 1 tài khoản chính chủ shop khỏi danh bạ liên kết; 1 creator ID rỗng được gắn cờ followers_unknown; có 328 creator phát sinh đơn trong 90 ngày. Kỳ Hè có 5.712 creator.',
      noteEn: 'Filtering reason: Separated 1 official store account from affiliates; 1 empty ID flagged followers_unknown; 328 creators sold orders in 90d. Summer slice had 5,712 creators.',
    },
    {
      sourceVi: 'Goods for Sale (2 snapshot)',
      sourceEn: 'Goods for Sale (dual snapshot)',
      rawVi: '787 dòng',
      rawEn: '787 rows',
      cleanVi: '787 dòng sạch',
      cleanEn: '787 clean rows',
      noteVi: 'Phân vùng multi-snapshot: 392 dòng kỳ Hè (04/09) + 395 dòng kỳ Thu (20/10), bảo toàn khóa phân vùng snapshot_id, không ghi đè lịch sử giá và sản lượng.',
      noteEn: 'Partitioned cleanly: 392 Summer rows (Sep 04) + 395 Autumn rows (Oct 20), preserving historical prices without overwriting.',
    },
    {
      sourceVi: 'Catalog SKU / Store Detail',
      sourceEn: 'Catalog SKU / Store Detail',
      rawVi: '339 SKU / 231 ngày',
      rawEn: '339 SKUs / 231 days',
      cleanVi: '339 SKU (kỳ Hè: 331 SKU) / 231 ngày',
      cleanEn: '339 SKUs (Summer: 331 SKUs) / 231 days',
      noteVi: 'Lý do 339 vs 331: Bản chụp kỳ Hè có 331 SKU (134 có đơn, 197 không đơn); sang tháng 10 bổ sung 8 SKU Thu Đông (có mã AT06) nâng lên 339 SKU (133 có đơn, 206 không đơn). Chuỗi ngày đủ 231/231 ngày liên tục.',
      noteEn: '339 vs 331 reason: Summer snapshot listed 331 SKUs (134 active, 197 zero-sale); October added 8 autumn SKUs (including hero AT06) to reach 339 SKUs (133 active, 206 zero-sale). Store daily has 231/231 continuous days.',
    },
  ];

  const rules = [
    {
      num: 1,
      titleVi: 'Chuẩn hóa tiền tệ',
      titleEn: 'Currency normalization',
      descVi: 'Loại bỏ ký tự đ, k, Tr, Tỉ; phân rã dải giá niêm yết thành price_min và price_max; dùng trung điểm (midpoint) để tính đơn giá tham chiếu.',
      descEn: 'Strips currency suffixes; splits price ranges into price_min and price_max, calculating midpoint reference unit prices.',
    },
    {
      num: 2,
      titleVi: 'Đồng bộ múi giờ UTC+7',
      titleEn: 'UTC+7 timezone alignment',
      descVi: 'Dấu thời gian bảng Creator Livestreams cộng +13 giờ để khớp giờ Việt Nam; bảng Shoppable Videos từ UTC+8 lùi -1 giờ về UTC+7.',
      descEn: 'Shifts Creator Livestreams +13h to align with Vietnam time; adjusts Shoppable Videos from UTC+8 by -1h to UTC+7.',
    },
    {
      num: 3,
      titleVi: 'Quy đổi lượt xem rút gọn',
      titleEn: 'Abbreviated views conversion',
      descVi: 'Chuỗi viết tắt "1.6k" quy đổi thành 1.600, "1.2m" quy đổi thành 1.200.000; ghi chú rõ giá trị này là số xấp xỉ do nền tảng FastMoss làm tròn.',
      descEn: 'Parses "1.6k" to 1,600 and "1.2m" to 1,200,000, noting that values represent FastMoss rounded approximations.',
    },
    {
      num: 4,
      titleVi: 'Khử trùng lặp khóa tự nhiên',
      titleEn: 'Natural composite-key deduplication',
      descVi: 'Với bảng Video, khóa phức hợp gồm (koc_hash, clean_title, publish_time_vn); giữ lại bản ghi có doanh số ghi nhận cao nhất và loại 1 dòng trùng.',
      descEn: 'Deduplicates videos on composite key (koc_hash, clean_title, publish_time_vn), retaining the highest-revenue record (1 duplicate removed).',
    },
    {
      num: 5,
      titleVi: 'Gán cờ thay vì xóa bản ghi',
      titleEn: 'Flagging over dropping records',
      descVi: 'Tạo các cờ nhị phân is_orphan (thiếu hồ sơ creator), is_outlier_duration (thời lượng = 0 hoặc > 24h), followers_unknown để kiểm soát phân tích mà không mất dữ liệu thô.',
      descEn: 'Applies binary audit flags (is_orphan, is_outlier_duration, followers_unknown) rather than hard-deleting records.',
    },
    {
      num: 6,
      titleVi: 'Cờ tháng thiếu (Partial month)',
      titleEn: 'Partial month audit flags',
      descVi: 'Đánh dấu is_partial_month cho Tháng 3/2026 (23 ngày, từ 09/03) và Tháng 10/2026 (25 ngày, đến 25/10); các so sánh theo tháng phải dùng GMV/ngày.',
      descEn: 'Marks is_partial_month for March (23 days) and October (25 days); monthly comparisons normalize by GMV/day.',
    },
    {
      num: 7,
      titleVi: 'Bảng tra cứu channel_group',
      titleEn: 'Channel group lookup table',
      descVi: 'Phân loại kênh bằng bảng tra cứu tách biệt, không hard-code trong SQL; sử dụng bí danh giả danh hóa (kenh_chu_shop, @koc_sat01, @koc_ext02) trên bản công khai.',
      descEn: 'Maps channels via standalone lookup tables without hardcoded SQL handles, using pseudonyms on public assets.',
    },
  ];

  const profilingFindings = [
    {
      metric: '69,2%',
      descVi: 'Tỷ lệ ca Live có GMV = 0 (phần lớn KOC trong mạng lưới phát sóng mà không chuyển đổi được đơn hàng nào).',
      descEn: 'Live sessions with zero GMV (the majority of affiliate creators stream without converting orders).',
    },
    {
      metric: '15 & 69 ca',
      descVi: '15 ca Live dài hơn 24 giờ (treo live), và 69 ca có thời lượng 0 (lỗi ngắt kết nối nền tảng được gắn cờ is_outlier_duration).',
      descEn: '15 sessions longer than 24 hours (hung live) and 69 sessions with 0 duration (network drops flagged).',
    },
    {
      metric: '46 creator',
      descVi: 'Có số follower <= 0 trên bảng danh bạ KOL (tài khoản clone hoặc lỗi đồng bộ API FastMoss được gắn cờ followers_unknown).',
      descEn: 'Creators with <= 0 followers in the directory (clone accounts or API sync artifacts flagged).',
    },
    {
      metric: '21,7% -> 30,3%',
      descVi: 'Tỷ lệ video phát sinh đơn đạt 21,7% trong kỳ Hè; trên toàn chu kỳ, video gắn cờ Ads đạt 30,3% so với 10,2% ở video tự nhiên.',
      descEn: 'Shoppable video order conversion: 21.7% in summer; full-period Ads-tagged clips convert at 30.3% vs. 10.2% organic.',
    },
  ];

  const limitations = [
    {
      groupVi: 'Dữ liệu',
      groupEn: 'Data',
      limitVi: 'Số ước tính của bên thứ ba (FastMoss), lượt xem làm tròn, độ trễ cuốn chiếu 90 ngày.',
      limitEn: 'Third-party FastMoss estimates, rounded views, rolling 90-day window latency.',
      impactVi: 'Số tuyệt đối có thể sai lệch so với báo cáo tài chính nội bộ.',
      impactEn: 'Absolute values may deviate from internal accounting audits.',
      solutionVi: 'Ưu tiên so sánh tương đối (% đóng góp, GPM, tỷ lệ chuyển đổi) hơn là con số tuyệt đối.',
      solutionEn: 'Rely on relative metrics (share %, GPM, conversion rate) over absolute totals.',
    },
    {
      groupVi: 'Dữ liệu',
      groupEn: 'Data',
      limitVi: 'Không có mã đơn hàng (order_id) và mã khách hàng cuối (customer_id).',
      limitEn: 'Missing order_id and end-customer IDs.',
      impactVi: 'Không tính được giá trị trung bình mỗi đơn (AOV thật), giỏ hàng mua kèm hay CLV khách hàng.',
      impactEn: 'Cannot measure basket AOV, multi-item checkouts, or customer lifetime value.',
      solutionVi: 'Dùng đơn giá sản phẩm trung bình ASP (GMV / sản phẩm = 147,3k đ) làm mốc tham chiếu.',
      solutionEn: 'Use Average Selling Price (ASP = 147.3k VND/unit) as the pricing benchmark.',
    },
    {
      groupVi: 'Dữ liệu',
      groupEn: 'Data',
      limitVi: 'Không có giá vốn (COGS), chi phí quảng cáo (Ad spend), số dư kho ERP và tỷ lệ hủy hoàn COD.',
      limitEn: 'Missing COGS, ad spend, warehouse ERP stock, and COD return rates.',
      impactVi: 'Không kết luận được biên lợi nhuận ròng, ROI quảng cáo hay hàng tồn chết gây đọng vốn.',
      impactEn: 'Cannot conclude net margins, ad ROAS, or true capital-locking dead inventory.',
      solutionVi: 'Kiến nghị bổ sung bảng giá vốn và chi phí TikTok Ads trước khi ra quyết định kinh doanh.',
      solutionEn: 'Recommend joining internal COGS and ad spend tables before budget decisions.',
    },
    {
      groupVi: 'Dữ liệu',
      groupEn: 'Data',
      limitVi: 'Chỉ quan sát 1 chu kỳ mùa vụ trong năm 2026 (chưa có dữ liệu cùng kỳ YoY).',
      limitEn: 'Only one seasonal cycle observed in 2026 (no YoY baseline).',
      impactVi: 'Không tách bạch được mùa vụ thời tiết lặp lại hằng năm khỏi biến động vận hành riêng của shop.',
      impactEn: 'Cannot isolate recurring weather seasonality from store operational variance.',
      solutionVi: 'Trình bày mô hình và tín hiệu giao cắt MA7 < MA28 ở mức độ mô tả (Chương 3), không ngoại suy đa năm.',
      solutionEn: 'Present MA7 < MA28 crossover strictly as descriptive monitoring (Chapter 3).',
    },
    {
      groupVi: 'Dữ liệu',
      groupEn: 'Data',
      limitVi: 'Khung quan sát khác nhau (231 ngày toàn shop, 180 ngày kỳ Hè, 90 ngày cho SKU/Video/KOL).',
      limitEn: 'Mixed observation windows (231d store series, 180d summer slice, 90d rolling snapshots).',
      impactVi: 'Dễ nhầm lẫn khi đối chiếu chéo tổng số đếm giữa các bảng.',
      impactEn: 'Cross-table total comparisons can be easily misinterpreted.',
      solutionVi: 'Quy chuẩn theo GMV/ngày, dán nhãn rõ cửa sổ ghi nhận trên mọi bảng và biểu đồ.',
      solutionEn: 'Normalize by GMV/day and explicitly label observation windows on every chart.',
    },
    {
      groupVi: 'Dữ liệu',
      groupEn: 'Data',
      limitVi: 'Tỷ lệ thiếu tiêu đề (Video 5,0%, Live 14,4%) và 4/251 creator mồ côi (1,59%).',
      limitEn: 'Missing titles (5.0% video, 14.4% live) and 4/251 orphan creators (1.59%).',
      impactVi: 'Tạo nhóm "Khác" trong phân loại văn bản và sai số nối bảng nhỏ.',
      impactEn: 'Expands the "Unclassified" text bucket and creates minor join slippage.',
      solutionVi: 'Gán nhãn Khác và gắn cờ is_orphan; sai số nằm dưới ngưỡng chấp nhận kiểm định (A2).',
      solutionEn: 'Grouped under "Unclassified" and flagged is_orphan, well below warning thresholds.',
    },
    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'So sánh Ads vs Organic là dữ liệu quan sát thị trường, không phải thử nghiệm ngẫu nhiên (A/B testing).',
      limitEn: 'Ads vs. Organic comparison is observational, not a randomized controlled trial (RCT).',
      impactVi: 'Clip bật Ads có thể do KOC chủ động chọn lọc nội dung hay hoặc có sẵn tệp người xem.',
      impactEn: 'Ads-authorized clips may reflect creator self-selection or existing audience reach.',
      solutionVi: 'Dùng từ "gắn với" / "đi kèm với", không khẳng định quan hệ nhân quả "do quảng cáo" (Chương 5).',
      solutionEn: 'Use "associated with" rather than causal "due to ads" claims (Chapter 5).',
    },
    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Giao cắt Dead Cross (26/06) chỉ xảy ra 1 lần, nhạy với điểm ngoại lai ngày 16/06 (315,0 Tr đ).',
      limitEn: 'Dead Cross (26/06) occurred once and followed the 16/06 outlier spike (315.0M VND).',
      impactVi: 'Có thể phản ánh hiện tượng rơi kỹ thuật sau một ca Live đột biến hơn là chu kỳ gãy cầu.',
      impactEn: 'May reflect technical post-outlier decay rather than a genuine demand collapse.',
      solutionVi: 'Kiểm chứng Winsorize ở P99/P95 (vẫn giữ ngày 26/06) và chỉ dùng làm tín hiệu theo dõi.',
      solutionEn: 'Winsorize at P99/P95 (date holds at 26/06) and track as a monitoring signal.',
    },
    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Phân rã biến thiên T6 -> T8 là phân rã kế toán toán học trên đồng nhất thức.',
      limitEn: 'June-to-August decomposition is an accounting mathematical identity.',
      impactVi: 'Không chứng minh được việc giảm ca Live trực tiếp gây ra giảm GMV/ca hay ngược lại.',
      impactEn: 'Does not prove whether fewer sessions caused lower rate or vice versa.',
      solutionVi: 'Giải thích đúng bản chất phân rã thành phần: Lượng, Hiệu suất và Tác động chéo (Chương 3).',
      solutionEn: 'Present strictly as an exact 3-term decomposition: Volume, Rate, and Interaction.',
    },
    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Cỡ mẫu nhỏ ở một số ô khung giờ Live (như ca đêm 00h - 06h chỉ có 2 - 6 ca).',
      limitEn: 'Small sample sizes in select Live slots (e.g. overnight 00:00 - 06:00 has 2 - 6 lives).',
      impactVi: 'Trung bình GMV/ca ở các ô ít phiên có độ nhiễu cao.',
      impactEn: 'Mean GMV in sparsely populated slots carries high variance.',
      solutionVi: 'Làm mờ giao diện các ô có n < 10 ca và ghi rõ số ca thực tế trong từng ô (Chương 5).',
      solutionEn: 'Visually dim cells with n < 10 and display exact sample size per cell.',
    },
    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Phân loại chủ đề video bằng Regex từ khóa; nhóm "Khác" chiếm 26,0% GMV (1.272 clip).',
      limitEn: 'Regex keyword classification leaves 26.0% of Video GMV (1,272 clips) under "Unclassified".',
      impactVi: 'Không phân loại được các video chỉ viết caption ngắn, cảm thán hoặc chỉ gắn hashtag trend.',
      impactEn: 'Clips with brief emoji captions or generic trending hashtags lack explicit nouns.',
      solutionVi: 'Báo cáo minh bạch độ phủ từ khóa đạt 73,5% số clip; không gán nhãn bừa bãi khi thiếu dữ liệu.',
      solutionEn: 'Transparently report 73.5% regex recall without forcing labels on ambiguous titles.',
    },
    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Định nghĩa "SKU 0 đơn trong 90 ngày" (206/339 SKU) có thể lẫn hàng mới ra mắt hoặc hết hàng tạm thời.',
      limitEn: '"90-day zero-sale SKUs" (206/339) may mix newly launched, seasonal, or temporarily stocked-out items.',
      impactVi: 'Nếu đánh đồng toàn bộ nhóm này là "hàng tồn chết" sẽ dẫn tới quyết định gỡ kệ sai lầm.',
      impactEn: 'Labeling all 206 as "dead stock" risks delisting viable seasonal or new items.',
      solutionVi: 'Yêu cầu đối chiếu tồn kho thực tế và ngày mở bán trước khi quyết định thanh lý (Chương 2, 7).',
      solutionEn: 'Require audits against physical warehouse stock and launch dates before delisting.',
    },
    {
      groupVi: 'Pháp lý',
      groupEn: 'Legal',
      limitVi: 'Handle của KOC là định danh công khai trên TikTok; băm Salted SHA-256 là giả danh hóa (Pseudonymization).',
      limitEn: 'Creator handles are public TikTok identifiers; Salted SHA-256 hashing is pseudonymization, not absolute anonymization.',
      impactVi: 'Nếu có dữ liệu đối chiếu chéo công khai vẫn có xác suất suy luận ngược danh tính.',
      impactEn: 'Indirect re-identification remains possible via public cross-referencing.',
      solutionVi: 'Dùng mã ẩn nhất quán (@koc_sat01, @koc_ext02), lưu khóa muối cục bộ, tuân thủ NĐ 13/2023/NĐ-CP.',
      solutionEn: 'Use deterministic aliases, isolate cryptographic salts, and align with Decree 13/2023.',
    },
  ];

  const definitions = [
    { termVi: 'GMV (Gross Merchandise Value)', termEn: 'GMV', defVi: 'Tổng giá trị hàng hóa được nền tảng TikTok Shop ghi nhận qua hệ thống tracking FastMoss; chưa biết có khấu trừ các đơn hủy trước giao hoặc đơn hoàn COD sau giao hay không.', defEn: 'Platform-recorded gross merchandise value tracked via FastMoss; unconfirmed whether pre-delivery cancellations or post-delivery COD returns are netted out.' },
    { termVi: 'Đơn vị đo lường', termEn: 'Unit of measurement', defVi: 'Sản phẩm bán ra (units), không phải số lượng đơn hàng (order_id không có trong nguồn dữ liệu bên thứ ba).', defEn: 'Units sold, not unique order transactions (order IDs are unobserved in third-party telemetry).' },
    { termVi: 'Ra đơn / Có đơn', termEn: 'Converting / With orders', defVi: 'Bản ghi (ca Live, clip Video hoặc mã SKU) ghi nhận doanh số GMV > 0 đ.', defEn: 'A session, clip, or SKU generating strictly GMV > 0 VND.' },
    { termVi: 'Cohort Creator', termEn: 'Creator Cohort', defVi: 'Tập hợp các nhà sáng tạo nội dung có phiên phát sóng Live gắn giỏ hàng đầu tiên trong cùng một tháng dương lịch.', defEn: 'The group of affiliate creators broadcasting their first shoppable Live session within the same calendar month.' },
    { termVi: 'Giữ chân (Retention M+n)', termEn: 'Retention (M+n)', defVi: 'Tỷ lệ % creator trong cùng một Cohort vẫn tiếp tục phát sinh ít nhất 1 phiên Live ở tháng thứ n sau tháng gia nhập đầu tiên (M0).', defEn: 'The percentage of creators within a cohort continuing to host at least one Live session in month M+n.' },
    { termVi: 'Rời bỏ (Churn)', termEn: 'Creator Churn', defVi: 'Trạng thái creator không phát sinh bất kỳ phiên Live gắn giỏ hàng nào trong vòng 30 ngày liên tục.', defEn: 'A creator logging zero shoppable Live broadcasts for 30 consecutive calendar days.' },
    { termVi: 'CLV Creator (Doanh thu vòng đời)', termEn: 'Creator Life GMV', defVi: 'Tổng GMV lũy kế mà một creator đem về cho gian hàng trong toàn bộ thời gian quan sát (đây là doanh thu bán lẻ gộp, không phải lợi nhuận ròng của shop).', defEn: 'Cumulative gross GMV generated by a creator over the entire window (gross volume, not net shop margin).' },
    { termVi: 'Dead Cross', termEn: 'Dead Cross', defVi: 'Giao cắt kỹ thuật khi đường trung bình trượt ngắn hạn MA7 (7 ngày) cắt xuống dưới đường trung bình trượt dài hạn MA28 (28 ngày), xác nhận động lượng suy yếu.', defEn: 'Technical crossover where short-term 7-day MA falls below long-term 28-day MA, confirming decelerating momentum.' },
    { termVi: 'Bất thường (Anomaly)', termEn: 'Statistical Anomaly', defVi: 'Ngày có độ lệch |z| > 3,0 so với đường trung bình trượt 28 ngày; áp dụng kỹ thuật Winsorize ở phân vị P99 (176,6 Tr đ) để kiểm tra độ nhạy khi so sánh.', defEn: 'A day exceeding |z| > 3.0 from the 28-day rolling mean; winsorized at P99 (176.6M VND) for sensitivity tests.' },
    { termVi: 'Nhóm kênh (Channel Group)', termEn: 'Channel Group', defVi: 'Dựa trên bảng tra cứu channel_group (A3, quy tắc 7), phân tách rõ Kênh tự vận hành chính chủ, Kênh vệ tinh nội bộ (@koc_sat01) và 301 Affiliate độc lập khác.', defEn: 'Mapped via a standalone lookup table separating Official in-house, Satellite (@koc_sat01), and 301 Other Affiliates.' },
  ];

  const currentSql = CLEAN_SQL_LIBRARY[sqlIdx] || CLEAN_SQL_LIBRARY[0];

  const scrollToAnchor = (anchorId: string, tabId: AppendixSection) => {
    setActiveTab(tabId);
    const el = document.getElementById(anchorId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="sec-appendix"
      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900/90 space-y-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-[#FFE485] px-2.5 py-0.5 text-xs font-black text-slate-950">
              {L('Phương pháp & Phụ lục kỹ thuật', 'Methodology & Technical Appendix')}
            </span>
            <Chip tone="emerald">{L('9/9 Cổng kiểm định đạt', '9/9 Quality gates passed')}</Chip>
            <Chip tone="cyan">{L('13 Giới hạn đo lường', '13 Documented limits')}</Chip>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {L(
              'Hồ sơ dữ liệu thô đến sạch, thư viện SQL và bảng hạn chế phương pháp',
              'Data profiling, chapter SQL repository, and methodological limitations'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {L(
              'Trang phụ lục kỹ thuật tập trung toàn bộ cơ sở đối soát, quy tắc làm sạch, truy vấn SQL và giả định đo lường để người đánh giá kỹ thuật tự kiểm tra độc lập mà không làm loãng luồng đọc chính của các chương bên trên.',
              'A dedicated technical annex housing data profiling, cleaning rules, SQL queries, and methodological limits for independent auditing.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenNotebook && (
            <button
              type="button"
              onClick={onOpenNotebook}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7] cursor-pointer transition-colors"
            >
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <span>{L('Mở Sổ tay Python', 'Open Python Notebook')}</span>
            </button>
          )}
          <a
            href="https://github.com/mvhung17/data-analyst-portfolio/tree/main/scripts/kami"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
            <span>GitHub (scripts/kami)</span>
          </a>
        </div>
      </header>

      {/* Thanh neo nhanh 3 mục Phụ lục A · B · C */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={L('Các mục Phụ lục', 'Appendix sections')}>
        {navItems.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => scrollToAnchor(item.anchor, item.id)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{isEn ? item.labelEn : item.labelVi}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PHỤ LỤC A: HỒ SƠ DỮ LIỆU VÀ CHẤT LƯỢNG                                      */}
      {/* ========================================================================= */}
      <section id="sec-appendix-a" className="scroll-mt-28 space-y-6 pt-2">
        <div className="border-l-4 border-[#0D7287] pl-3.5 space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA]">
            {L('Phụ lục A', 'Appendix A')}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
            {L('Hồ sơ dữ liệu và chất lượng (A1 · A2 · A3 · A4)', 'Data profiling and quality audit (A1 · A2 · A3 · A4)')}
          </h3>
        </div>

        {/* A1. Từ dữ liệu thô đến dữ liệu sạch */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {L('A1. Từ dữ liệu thô đến dữ liệu sạch (Bảng đối soát sửa lỗi số đếm)', 'A1. Raw to cleaned data reconciliation (Resolving unlabelled counts)')}
            </h4>
            <Chip tone="cyan">{L('Giải trình rõ các mốc 7.046 · 470 · 4.417 · 5.712 · 331', 'Reconciles 7,046 · 470 · 4,417 · 5,712 · 331')}</Chip>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-bold rounded-tl-xl">{L('Nguồn dữ liệu', 'Source entity')}</th>
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">{L('Dòng thô (Raw)', 'Raw count')}</th>
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">{L('Sau làm sạch (Cleaned)', 'Cleaned count')}</th>
                  <th className="py-2.5 px-3 font-bold rounded-tr-xl">{L('Ghi chú xử lý & đối soát', 'Reconciliation notes')}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {rawToCleanRows.map((r, idx) => (
                  <tr key={r.sourceEn} className={idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-950/40' : ''}>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap">
                      {isEn ? r.sourceEn : r.sourceVi}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums whitespace-nowrap text-slate-500">{isEn ? r.rawEn : r.rawVi}</td>
                    <td className="py-2.5 px-3 tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">
                      {isEn ? r.cleanEn : r.cleanVi}
                    </td>
                    <td className="py-2.5 px-3 leading-relaxed text-slate-600 dark:text-slate-400">
                      {isEn ? r.noteEn : r.noteVi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* A2. Chín cổng kiểm tra chất lượng */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {L('A2. Chín cổng kiểm tra chất lượng tự động (6 Chặn + 3 Cảnh báo)', 'A2. Nine automated quality gates (6 Blocking + 3 Warnings)')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {L(
                  'Cả 9 cổng đều đạt. 3 đối soát sai khác ở mục 2.3 xuất phát từ định nghĩa nguồn khác nhau và đã được giải trình toán học.',
                  'All 9 gates passed. 3 external cross-checks reflect distinct source definitions and are mathematically reconciled.'
                )}
              </p>
            </div>
            <Chip tone="emerald">{L('9/9 Cổng đạt chuẩn', '9/9 Gates passed')}</Chip>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                  <th className="py-2 px-2.5 font-bold rounded-tl-xl">#</th>
                  <th className="py-2 px-3 font-bold">{L('Tên cổng kiểm tra', 'Quality gate')}</th>
                  <th className="py-2 px-3 font-bold">{L('Phạm vi áp dụng', 'Target table')}</th>
                  <th className="py-2 px-3 font-bold">{L('Kết quả thực tế', 'Actual observed')}</th>
                  <th className="py-2 px-2.5 font-bold text-center rounded-tr-xl">{L('Cấp độ', 'Level')}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {UNIFIED_9_QUALITY_GATES.map((g, idx) => (
                  <tr key={g.id} className={idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-950/40' : ''}>
                    <td className="py-2 px-2.5 font-bold text-slate-400">G{g.id}</td>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white font-sans">{isEn ? g.gateEn : g.gateVi}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">{g.scope}</td>
                    <td className="py-2 px-3 font-semibold text-emerald-700 dark:text-emerald-400">{g.actual}</td>
                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-black ${
                          g.level === 'ERROR'
                            ? 'bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]'
                            : 'bg-[#FFE485]/60 text-amber-950 dark:bg-[#FFD14C]/15 dark:text-[#FFE485]'
                        }`}
                      >
                        {g.level === 'ERROR' ? L('Chặn', 'Block') : L('Cảnh báo', 'Warn')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span>{L('Giải trình 3 đối soát sai khác do định nghĩa nguồn:', 'Explanation of 3 definition-based reconciliation deltas:')}</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-400">
              <li>
                <strong>{L('Số phiên Live (7.014 vs 7.046 ca kỳ Hè):', 'Live session count (7,014 vs. 7,046 summer):')}</strong>{' '}
                {L('Lệch 0,45% (32 ca) do các phiên vắt qua nửa đêm được cắt theo ngày lịch hay gán trọn về ngày bắt đầu phiên.', '0.45% delta (32 lives) stems from midnight-spanning broadcasts assigned to calendar day vs. start timestamp.')}
              </li>
              <li>
                <strong>{L('Số video (2.443 / 4.417 / 4.796 clip):', 'Video count (2,443 / 4,417 / 4,796):')}</strong>{' '}
                {L('2.443 là video tự nhiên kỳ Hè; 4.417 là tổng video kỳ Hè; 4.796 là tổng video làm sạch toàn chu kỳ 231 ngày.', '2,443 is organic summer videos; 4,417 is total summer videos; 4,796 is full 231d deduplicated videos.')}
              </li>
              <li>
                <strong>{L('Khử trùng lặp 8.355 dòng Live:', 'Deduplication across 8,355 Live rows:')}</strong>{' '}
                {L('Dữ liệu thô FastMoss lặp dòng khi cùng một phiên Live gắn nhiều sản phẩm; sau làm sạch gộp đúng 8.355 ca duy nhất.', 'Raw exports duplicated rows across multi-product taggings, normalized to unique sessions.')}
              </li>
            </ul>
          </div>
        </div>

        {/* A3. Bảy quy tắc làm sạch */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {L('A3. Bảy quy tắc làm sạch dữ liệu chuẩn hóa (Data Cleaning Rules)', 'A3. Seven standardized data cleaning rules')}
          </h4>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => (
              <div
                key={rule.num}
                className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1"
              >
                <div className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {rule.num}. {isEn ? rule.titleEn : rule.titleVi}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn ? rule.descEn : rule.descVi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* A4. Bốn phát hiện từ profiling */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {L('A4. Bốn phát hiện chính từ bước Data Profiling (1 dòng mỗi ý)', 'A4. Four core findings from data profiling (one line each)')}
          </h4>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {profilingFindings.map((f) => (
              <div
                key={f.metric}
                className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1"
              >
                <div className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
                  {f.metric}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn ? f.descEn : f.descVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHỤ LỤC B: TRUY VẤN SQL THEO CHƯƠNG                                        */}
      {/* ========================================================================= */}
      <section id="sec-appendix-b" className="scroll-mt-28 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="border-l-4 border-[#0D7287] pl-3.5 space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA]">
            {L('Phụ lục B', 'Appendix B')}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
            {L('Thư viện SQL chuẩn hóa theo chương (Chỉ lưu một nơi duy nhất)', 'Chapter-organized SQL repository (Single source of truth)')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {L(
              'Các truy vấn tiêu biểu trong repo sql/01_staging.sql ... 07_marts.sql. Tiêu đề chuẩn hóa 4 dòng: Mục đích · Bảng đầu vào · Bảng đầu ra · Giả định.',
              'Representative SQL queries from repo sql/01_staging.sql ... 07_marts.sql with standard 4-line headers.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {CLEAN_SQL_LIBRARY.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSqlIdx(idx)}
                className={`min-h-[44px] rounded-xl px-3.5 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                  sqlIdx === idx
                    ? 'bg-[#9BE7FA] text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {isEn ? item.titleEn : item.titleVi}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleCopySql(currentSql.code)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? L('Đã sao chép', 'Copied') : L('Sao chép SQL', 'Copy SQL')}
          </button>
        </div>

        <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-[#C8EEF7] border border-slate-800 font-mono">
          <code>{currentSql.code}</code>
        </pre>
      </section>

      {/* ========================================================================= */}
      {/* PHỤ LỤC C: HẠN CHẾ VÀ GIẢ ĐỊNH (MỘT TRANG DUY NHẤT)                        */}
      {/* ========================================================================= */}
      <section id="sec-appendix-c" className="scroll-mt-28 space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="border-l-4 border-amber-500 pl-3.5 space-y-1">
          <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {L('Phụ lục C', 'Appendix C')}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
            {L('Hạn chế và giả định phương pháp luận (Một nơi duy nhất)', 'Consolidated limitations and methodological assumptions')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {L(
              'Tập trung toàn bộ 13 hạn chế và 10 định nghĩa nền tảng; thay thế hoàn toàn các khối hạn chế phân mảnh ở từng chương.',
              'Houses all 13 methodological limitations and 10 core definitions, replacing fragmented bullet points.'
            )}
          </p>
        </div>

        {/* C1. Bảng 13 hạn chế */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {L('C1. Bảng ma trận 13 hạn chế dữ liệu & phương pháp', 'C1. Matrix of 13 data and methodological limitations')}
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-bold rounded-tl-xl whitespace-nowrap">{L('Nhóm', 'Group')}</th>
                  <th className="py-2.5 px-3 font-bold">{L('Hạn chế đo lường', 'Limitation')}</th>
                  <th className="py-2.5 px-3 font-bold">{L('Ảnh hưởng phân tích', 'Analytical impact')}</th>
                  <th className="py-2.5 px-3 font-bold rounded-tr-xl">{L('Cách xử lý trong báo cáo', 'Handling in report')}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {limitations.map((item, idx) => (
                  <tr key={item.limitEn} className={idx % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-950/40' : ''}>
                    <td className="py-2.5 px-3 font-bold whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          item.groupVi === 'Dữ liệu'
                            ? 'bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]'
                            : item.groupVi === 'Phương pháp'
                              ? 'bg-[#FFE485]/60 text-amber-950 dark:bg-[#FFD14C]/15 dark:text-[#FFE485]'
                              : 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300'
                        }`}
                      >
                        {isEn ? item.groupEn : item.groupVi}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {isEn ? item.limitEn : item.limitVi}
                    </td>
                    <td className="py-2.5 px-3 leading-relaxed text-slate-600 dark:text-slate-400">
                      {isEn ? item.impactEn : item.impactVi}
                    </td>
                    <td className="py-2.5 px-3 leading-relaxed text-emerald-800 dark:text-emerald-300">
                      {isEn ? item.solutionEn : item.solutionVi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* C2. Mười định nghĩa và giả định chính */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {L('C2. Mười định nghĩa và giả định phân tích cốt lõi', 'C2. Ten foundational definitions and analytical assumptions')}
          </h4>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {definitions.map((d) => (
              <div
                key={d.termEn}
                className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-1"
              >
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {isEn ? d.termEn : d.termVi}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn ? d.defEn : d.defVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
