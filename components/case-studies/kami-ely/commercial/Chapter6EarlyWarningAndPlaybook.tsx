'use client';

import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Radio, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { V2 } from './kamiOutlineV2Metrics';

interface Props {
  lang: 'vi' | 'en';
}

const BA_PROCESS_DIFF = [
  {
    stepVi: '1. Chuyển mùa SKU',
    stepEn: '1. Seasonal SKU Switch',
    asIsVi: 'Chỉ nhập & mở bán mã Thu Đông sau khi doanh thu Hè đã rơi sâu (AT06 mở bán 09/09, trễ ~1 tháng).',
    asIsEn: 'Launches autumn hero SKUs only after summer revenue crashes (AT06 launched Sep 09, ~1 month late).',
    toBeVi: 'Khi MA7 < MA28 sau đỉnh Hè (cảnh báo tự động), kích hoạt seeding mã giao mùa đầu T8 và bật bán giữa T8.',
    toBeEn: 'When post-peak MA7 < MA28 fires automatically, trigger transitional seeding in early Aug and launch mid-Aug.',
  },
  {
    stepVi: '2. Sàng lọc KOC mẫu',
    stepEn: '2. KOC Sample Screening',
    asIsVi: 'Gửi mẫu tràn lan hoặc cắt toàn bộ KOC 0đ sau 3 phiên (rủi ro mất 51 người tạo 304,9 Tr từ phiên 4+).',
    asIsEn: 'Blanket sample seeding or hard 3-session cutoff (risks losing 51 late converters worth 304.9M VND).',
    toBeVi: 'Quy tắc 2 tầng: dừng chi phí mẫu/booking nếu 3 phiên đầu 0đ & dưới ngưỡng view, nhưng giữ link affiliate mở.',
    toBeEn: '2-tier gate: pause paid samples/bookings after 3 zero-GMV sub-view sessions while keeping open affiliate links.',
  },
  {
    stepVi: '3. Phân bổ ca Live >8h',
    stepEn: '3. >8h Live Scheduling',
    asIsVi: 'Kéo dài phiên >10h cả mùa thấp điểm (T7: 1,43 Tr/h; T8: 0,73 Tr/h), đốt chi phí host/studio.',
    asIsEn: 'Runs >10h marathons in off-peak troughs (Jul: 1.43M/hr; Aug: 0.73M/hr), burning host/studio margin.',
    toBeVi: 'Cổng Stop-Loss theo giờ: chỉ mở ca ≥8h ngày sale/hero đạt ngưỡng; dừng sớm nếu GMV/h thấp hơn điểm hòa vốn.',
    toBeEn: 'Hourly stop-loss gate: reserve ≥8h shifts for promo/hero peaks; cut shift early if hourly GMV falls below break-even.',
  },
  {
    stepVi: '4. Duyệt chạy Spark Ads',
    stepEn: '4. Spark Ads Whitelisting',
    asIsVi: 'Đẩy Ads trên clip chưa kiểm chứng (GPM Ads = 0,84× Organic; 0,73× trong cùng 192 KOC).',
    asIsEn: 'Boosts unvalidated video clips (Ads GPM = 0.84x Organic; 0.73x within the same 192 KOCs).',
    toBeVi: 'Khóa điều khoản cấp sẵn mã Spark Ads khi gửi mẫu và chỉ mở khóa ngân sách cho clip đã có đơn tự nhiên.',
    toBeEn: 'Require upfront Spark Ads codes on sample briefs and unlock ad spend only for clips with proven organic orders.',
  },
];

const KAMI_USER_STORIES = [
  {
    id: 'US-KE-01',
    signal: 'MA7 < MA28 · SKU Share > 50%',
    storyVi: 'Là Merchandising Lead, tôi muốn nhận cảnh báo tự động khi MA7 cắt dưới MA28 hoặc 1 SKU vượt 50% GMV tháng để đẩy lịch seeding giao mùa và gắn combo bán chéo kịp thời.',
    storyEn: 'As Merchandising Lead, I want automated alerts when MA7 crosses below MA28 or a single SKU exceeds 50% of monthly GMV so I can advance seasonal seeding and cross-sell bundles on time.',
    acVi: 'Given hệ thống chốt GMV ngày lúc 07:00, When MA7 < MA28 liên tiếp 3 ngày sau đỉnh hoặc tỷ trọng 1 SKU > 50% (như AT06 = 80,5% T10), Then bảng điều khiển bật thẻ đỏ kèm danh sách SKU thay thế và gửi thông báo tới nhóm Merchandising.',
    acEn: 'Given daily GMV closes at 07:00, When MA7 < MA28 for 3 consecutive post-peak days or any single SKU exceeds 50% share (e.g., AT06 at 80.5% in Oct), Then the console flags a high-priority alert with bundle candidates to Merchandising.',
  },
  {
    id: 'US-KE-02',
    signal: '3 phiên 0đ · 94 vs. 51 KOC',
    storyVi: 'Là Affiliate Lead, tôi muốn hệ thống phân loại tự động KOC theo luật 2 tầng sau 3 phiên 0đ để cắt chi phí mẫu rỗng mà không khóa link của nhóm nổ đơn muộn.',
    storyEn: 'As Affiliate Lead, I want automated 2-tier KOC classification after 3 zero-GMV sessions so I cut wasted sample spend without cutting off late-converting creators.',
    acVi: 'Given KOC ngoài đã chạy đủ 3 phiên Live với GMV = 0đ, When lượt xem trung bình dưới ngưỡng tối thiểu, Then hệ thống chuyển trạng thái sang "Dừng gửi mẫu trả phí" nhưng giữ nguyên "Link Affiliate mở" (chi phí 0đ) và tự động thăng hạng nếu phát sinh đơn từ phiên thứ 4+.',
    acEn: 'Given an external KOC logs 3 consecutive 0-GMV live sessions, When average views fall below threshold, Then status updates to "Pause Paid Samples" while keeping "Open Affiliate Link" active, auto-promoting upon any session 4+ order.',
  },
  {
    id: 'US-KE-03',
    signal: 'Live GMV/h vs. Nền 2,81 Tr/h',
    storyVi: 'Là Livestream Ops, tôi muốn theo dõi GMV/giờ theo thời gian thực so với ngưỡng hòa vốn ca live để quyết định kéo dài hay rút gọn phiên ≥8h.',
    storyEn: 'As Livestream Ops, I want live hourly GMV compared against shift break-even thresholds so I can decide whether to extend or stop ≥8h sessions early.',
    acVi: 'Given phiên Live nội bộ đã chạy qua giờ thứ 4, When GMV/giờ trượt 2 giờ gần nhất rơi dưới ngưỡng hòa vốn (hoặc < 1,8 Tr/h ngày thường) và số SKU ghim < 50, Then hệ thống gửi cảnh báo cắt lỗ/xoay kệ cho trưởng phòng Live.',
    acEn: 'Given an in-house live session passes hour 4, When trailing 2-hour GMV/hr drops below break-even (or < 1.8M/hr on regular days) with < 50 pinned SKUs, Then the console alerts the Live lead to rotate catalog or end the shift.',
  },
  {
    id: 'US-KE-04',
    signal: 'Video Organic GPM > Ads (0,84×)',
    storyVi: 'Là Performance Marketer, tôi muốn cổng lọc Spark Ads chỉ mở khóa ngân sách cho clip đã có đơn tự nhiên và mã ủy quyền sẵn để không đốt ngân sách vào clip GPM thấp.',
    storyEn: 'As a Performance Marketer, I want a Spark Ads approval gate that unlocks ad spend only for clips with proven organic orders and pre-authorized ad codes.',
    acVi: 'Given clip KOC được đồng bộ về danh sách duyệt Ads, When clip có ≥ 1 đơn tự nhiên, GPM đạt mức trung vị Organic và có sẵn mã Spark Ads, Then clip hiện nút "Đủ điều kiện đẩy Ads"; ngược lại bị khóa nút duyệt kèm lý do thiếu mã hoặc chưa có chuyển đổi tự nhiên.',
    acEn: 'Given KOC videos sync into the ad review queue, When a clip has ≥ 1 organic order, GPM at/above Organic median, and a valid Spark Ads code, Then "Eligible to Boost" unlocks; otherwise boosting is blocked with the exact missing condition.',
  },
];

const KAMI_FIVE_WHYS = [
  {
    level: 'Why 1',
    qVi: 'Vì sao GMV tháng 8 rơi -83,1% so với đỉnh tháng 6 (4,06 → 0,68 tỷ đ)?',
    qEn: 'Why did August GMV fall -83.1% from June peak (4.06B → 0.68B VND)?',
    aVi: '6 mã đồ bơi chủ lực tụt -89,3% (1,57 → 0,17 tỷ đ), đóng góp 44,8% tổng mức sụt giảm toàn shop.',
    aEn: '6 summer swimwear hero SKUs plunged -89.3% (1.57B → 0.17B VND), driving 44.8% of total store contraction.',
  },
  {
    level: 'Why 2',
    qVi: 'Vì sao danh mục còn lại không bù đắp được khoảng trống sau đồ bơi?',
    qEn: 'Why did the remaining catalog fail to offset the swimwear trough?',
    aVi: 'SKU Thu Đông chủ lực (AT06) đến 09/09 mới mở bán, chậm hơn mốc giao cắt W36 (31/08) và trễ ~1 tháng sau khi đồ bơi gãy đà.',
    aEn: 'Hero autumn SKU (AT06) did not launch until Sep 09, trailing the W36 (Aug 31) inflection and missing the August bridge window.',
  },
  {
    level: 'Why 3',
    qVi: 'Vì sao doanh thu kênh Live (chiếm 84,5% nội bộ) cũng suy yếu sâu cùng lúc?',
    qEn: 'Why did in-house Live (84.5% of Live GMV) collapse simultaneously?',
    aVi: 'Vận hành tiếp tục kéo ca >10h trong tháng 7–8 khi cầu yếu (hiệu suất rơi 8,48 → 1,43 → 0,73 Tr/h) trong khi nguồn phiên Live ngoài đã giảm -29,2% ngay từ T4→T5.',
    aEn: 'Ops kept running >10h shifts during low demand (8.48 → 1.43 → 0.73M/hr) while external live sessions had already dropped -29.2% in Apr→May.',
  },
  {
    level: 'Why 4',
    qVi: 'Vì sao lượng KOC mới và nguồn Video không kịp gánh kênh Live?',
    qEn: 'Why could new KOC recruitment and shoppable Videos not cushion Live?',
    aVi: 'Tuyển mới KOC tụt -53,7% (T4→T5), trung vị tồn tại KOC chỉ 13 ngày, còn Video đẩy Ads chưa lọc clip chuyển đổi tự nhiên nên GPM thấp hơn Organic (0,84×).',
    aEn: 'New KOC onboarding fell -53.7% (Apr→May), median KOC lifespan sat at 13 days, and boosted videos lacked organic pre-validation (0.84x Organic GPM).',
  },
  {
    level: 'Why 5 (Root)',
    qVi: 'Nguyên nhân gốc ở tầng quy trình & quản trị là gì?',
    qEn: 'What is the systemic process & governance root cause?',
    aVi: 'Thiếu 4 cổng cảnh báo sớm tự động gắn trách nhiệm RACI: giao cắt MA7 < MA28 (báo từ 26/06), ngưỡng Stop-Loss ca Live, luật sàng lọc KOC 2 tầng và cổng duyệt Spark Ads.',
    aEn: 'Absence of 4 automated early-warning gates with RACI ownership: MA7 < MA28 trigger (Jun 26), Live stop-loss, 2-tier KOC screening, and Spark Ads gate.',
  },
];

const KAMI_FISHBONE = [
  {
    branchVi: '1. Sản phẩm & Mùa vụ (Product)',
    branchEn: '1. Product & Seasonality',
    itemsVi: ['6 mã đồ bơi rơi -89,3% (T6→T8)', 'AT06 lên kệ trễ (09/09) và T10 lại lệ thuộc 80,5% vào 1 mã', '206/339 link (60,8%) phát sinh 0đ trong 90 ngày'],
    itemsEn: ['6 swimwear SKUs fell -89.3% (Jun→Aug)', 'AT06 launched late (Sep 09) then took 80.5% Oct share alone', '206/339 listings (60.8%) logged 0đ in trailing 90 days'],
  },
  {
    branchVi: '2. Kênh Live & Ca phát (Channel)',
    branchEn: '2. Live Channel & Shifts',
    itemsVi: ['84,5% GMV Live phụ thuộc 2 kênh nội bộ', 'Ca >10h không có Stop-Loss (T8 chỉ còn 0,73 Tr/h)', 'Số phiên Live giảm -29,2% sớm từ T4→T5'],
    itemsEn: ['84.5% of Live GMV relies on 2 in-house handles', 'No hourly stop-loss on >10h shifts (Aug dropped to 0.73M/hr)', 'Live volume dropped -29.2% early in Apr→May'],
  },
  {
    branchVi: '3. Mạng lưới KOC & Ads (Creator)',
    branchEn: '3. KOC Network & Ads',
    itemsVi: ['Tuyển mới KOC rơi -53,7% từ T4→T5', '94/145 KOC 0đ sau 3 phiên không ra đơn nhưng 51 người nổ muộn (304,9 Tr)', 'GPM Video Ads = 0,84× Organic (0,73× trong 192 KOC)'],
    itemsEn: ['New KOC onboarding fell -53.7% in Apr→May', '94/145 zero-start KOCs never convert vs. 51 late converters (304.9M)', 'Ads Video GPM trailed Organic (0.84x overall; 0.73x within 192 KOCs)'],
  },
  {
    branchVi: '4. Dữ liệu & Vận hành (Process)',
    branchEn: '4. Data & Ops Process',
    itemsVi: ['Cộng thô CrLive + AffLive gây phồng ảo +7,59 tỷ đ', 'Chưa kích hoạt hành động khi MA7 < MA28 ngày 26/06', 'Thiếu dữ liệu giá vốn & chi phí mẫu gắn với ROAS thực'],
    itemsEn: ['Naive CrLive + AffLive sum double-counts +7.59B VND', 'No operational playbook fired on Jun 26 MA7 < MA28 crossover', 'COGS & sample spend unlinked from third-party FastMoss exports'],
  },
];

const KAMI_RACI = [
  { taskVi: 'Cảnh báo chuyển mùa MA7 < MA28 & Mở bán SKU (US-KE-01)', taskEn: 'MA7 < MA28 Alert & Seasonal SKU Launch (US-KE-01)', ops: 'A', merch: 'R', live: 'C', aff: 'I', bi: 'C' },
  { taskVi: 'Sàng lọc KOC 2 tầng & Cấp link mở (US-KE-02)', taskEn: '2-Tier KOC Screening & Open Link Rule (US-KE-02)', ops: 'A', merch: 'I', live: 'I', aff: 'R', bi: 'C' },
  { taskVi: 'Điều phối ca Live ≥8h & Ngưỡng Stop-Loss (US-KE-03)', taskEn: '≥8h Live Scheduling & Stop-Loss Gate (US-KE-03)', ops: 'A', merch: 'C', live: 'R', aff: 'I', bi: 'C' },
  { taskVi: 'Duyệt ngân sách Spark Ads clip tự nhiên (US-KE-04)', taskEn: 'Spark Ads Budget Approval Gate (US-KE-04)', ops: 'A', merch: 'I', live: 'I', aff: 'R', bi: 'C' },
  { taskVi: 'Đối soát 10 bảng & Kiểm tra 9 Cổng QA ngày', taskEn: 'Daily 10-Table Reconciliation & 9 QA Gates', ops: 'I', merch: 'I', live: 'I', aff: 'I', bi: 'R / A' },
];

const KAMI_UAT_CASES = [
  {
    id: 'UAT-KE-01',
    us: 'US-KE-01',
    scenarioVi: 'Kích hoạt cảnh báo chuyển mùa MA7 < MA28',
    scenarioEn: 'Trigger post-peak MA7 < MA28 seasonal alert',
    inputVi: 'Chuỗi GMV chốt 07:00 có MA7 < MA28 3 ngày liên tiếp sau đỉnh (mốc kiểm thử: 26–28/06).',
    inputEn: '07:00 closed GMV feed where MA7 < MA28 for 3 consecutive post-peak days (test: Jun 26–28).',
    expectedVi: 'Banner cảnh báo đỏ bật trên Console, gắn cờ Merchandising và liệt kê top SKU giao mùa cần seeding.',
    expectedEn: 'Red alert banner renders on Console, notifies Merchandising, and lists transitional SKUs for seeding.',
  },
  {
    id: 'UAT-KE-02',
    us: 'US-KE-01',
    scenarioVi: 'Cảnh báo vượt trần tập trung 1 SKU (>50% GMV tháng)',
    scenarioEn: 'Single-SKU concentration breach (>50% monthly GMV)',
    inputVi: 'Dữ liệu tháng 10 có AT06 đạt 1,30 / 1,62 tỷ đ (80,5% GMV toàn shop).',
    inputEn: 'October feed with AT06 at 1.30B / 1.62B VND (80.5% of store GMV).',
    expectedVi: 'Hệ thống gắn nhãn cảnh báo tập trung SKU và mở danh sách gợi ý bán chéo combo (CV11 / CV02).',
    expectedEn: 'Flags SKU concentration warning and displays cross-sell bundle candidates (CV11 / CV02).',
  },
  {
    id: 'UAT-KE-03',
    us: 'US-KE-02',
    scenarioVi: 'Phân loại KOC 2 tầng sau 3 phiên đầu 0đ',
    scenarioEn: '2-tier classification after 3 zero-GMV live sessions',
    inputVi: 'KOC ngoài hoàn tất phiên thứ 3 với tổng GMV = 0đ và lượt xem TB dưới ngưỡng tối thiểu.',
    inputEn: 'External KOC finishes session 3 with 0đ GMV and sub-threshold average views.',
    expectedVi: 'Trạng thái đổi sang "Dừng gửi mẫu trả phí"; trạng thái "Link Affiliate mở" vẫn giữ Active (không khóa quyền gắn giỏ).',
    expectedEn: 'Status switches to "Pause Paid Samples"; "Open Affiliate Link" remains Active (cart link preserved).',
  },
  {
    id: 'UAT-KE-04',
    us: 'US-KE-02',
    scenarioVi: 'Tự động khôi phục quyền nhận mẫu cho nhóm nổ đơn muộn',
    scenarioEn: 'Auto-reinstatement for session 4+ late converters',
    inputVi: 'KOC đang ở trạng thái "Dừng mẫu trả phí" phát sinh đơn đầu tiên hợp lệ ở phiên thứ 4.',
    inputEn: 'KOC in "Pause Paid Samples" generates first verified order on session 4.',
    expectedVi: 'Tự động nâng lại nhóm "Đủ điều kiện nhận mẫu mới" và ghi nhận vào KPI bảo toàn doanh thu nổ muộn.',
    expectedEn: 'Auto-promotes back to "Eligible for Samples" and logs attribution to late-converter revenue KPI.',
  },
  {
    id: 'UAT-KE-05',
    us: 'US-KE-03',
    scenarioVi: 'Cổng Stop-Loss ca Live nội bộ ≥8h',
    scenarioEn: 'In-house ≥8h live shift hourly stop-loss trigger',
    inputVi: 'Ca Live chạy đến giờ thứ 5 ngày thường, GMV trượt 2 giờ đạt 0,73 Tr/h (< ngưỡng 1,8 Tr/h) và ghim 32 SKU.',
    inputEn: 'Regular-day shift hits hour 5 with 2h trailing GMV at 0.73M/hr (< 1.8M/hr threshold) and 32 pinned SKUs.',
    expectedVi: 'Console bật cảnh báo dừng ca sớm / bổ sung đủ ≥50 SKU ghim trước khi tiếp tục phát.',
    expectedEn: 'Console fires early-stop alert / requires adding to ≥50 pinned SKUs before extending shift.',
  },
  {
    id: 'UAT-KE-06',
    us: 'US-KE-04',
    scenarioVi: 'Chặn chạy Spark Ads clip chưa có đơn tự nhiên hoặc thiếu mã',
    scenarioEn: 'Block Spark Ads spend on unvalidated or uncoded clip',
    inputVi: 'Marketer chọn đẩy Ads cho video KOC có 0 đơn tự nhiên hoặc trường ad_code = NULL.',
    inputEn: 'Marketer attempts to boost a KOC video with 0 organic orders or NULL ad_code.',
    expectedVi: 'Nút "Duyệt đẩy Ads" bị khóa kèm thông báo lỗi tường minh; chỉ mở khóa khi đủ cả đơn tự nhiên và mã ủy quyền.',
    expectedEn: '"Approve Boost" stays disabled with explicit blocking reason; unlocks only when both order and ad_code pass.',
  },
];

export function Chapter6EarlyWarningAndPlaybook({ lang }: Props) {
  const isVi = lang === 'vi';
  const [activeSubTab, setActiveSubTab] = useState<'playbook' | 'root-cause' | 'ba-spec' | 'wireframe'>('playbook');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showBacktestAccordion, setShowBacktestAccordion] = useState(false);

  const playbookRows = [
    {
      id: 'p0-koc',
      priority: 'P0 · Quick Win',
      priorityClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10',
      owner: 'Affiliate Lead',
      effortVi: '1 tuần',
      effortEn: '1 wk',
      titleVi: 'Luật sàng lọc KOC 2 tầng sau 3 phiên 0đ & xin sẵn mã Spark Ads cho Video',
      titleEn: '2-tier KOC screening after 3 zero sessions & upfront Spark Ads codes',
      kpiVi: '≥90% clip mẫu cấp sẵn mã · Chỉ đẩy Ads clip đã có đơn tự nhiên',
      kpiEn: '≥90% pre-authorized sample clips · Boost organically converting clips only',
      impactVi: 'Bảo toàn 304,9 Tr GMV từ 51 KOC ra đơn muộn; giảm mẫu rỗng trên 94 KOC không chuyển đổi (~38 KOC/quý)',
      impactEn: 'Protects 304.9M GMV from 51 late converters; trims wasted samples on 94 non-converters (~38/qtr)',
      evidenceVi:
        'Trong 145 KOC đủ ≥3 phiên có 3 phiên đầu 0đ, 94 KOC (64,8%) không bao giờ ra đơn nhưng 51 KOC (35,2%) ra đơn từ phiên 4+ và tạo 304,9 Tr (18,8% GMV Live độc lập). Về Video, KOC ngoài tạo 58,4% (1,28 tỷ); clip Ads đạt 547,7k/clip nhưng GPM thấp hơn Organic (0,84×; trong cùng 192 KOC là 0,73×).',
      evidenceEn:
        'Of 145 KOCs with ≥3 sessions and 0đ in sessions 1–3, 94 (64.8%) never converted while 51 (35.2%) converted at session 4+ for 304.9M VND (18.8% of independent Live GMV). External KOCs drove 58.4% of Video GMV (1.28B), and Ad clips trailed Organic on GPM (0.84x; 0.73x within 192 dual KOCs).',
      actionVi:
        'Áp luật 2 tầng: dừng gửi mẫu miễn phí/booking trả phí nếu 3 phiên đầu vừa 0đ vừa dưới ngưỡng lượt xem tối thiểu (cần đối chiếu chi phí mẫu nội bộ do FastMoss không ghi), nhưng vẫn giữ link affiliate mở (chi phí 0đ). Với Video, gắn điều khoản cấp mã Spark Ads và chỉ rót ngân sách vào clip có đơn tự nhiên đạt ROAS biên.',
      actionEn:
        'Apply a 2-tier rule: stop paid sample seeding if sessions 1–3 have 0đ and sub-threshold views (verify actual seeding logs internally), while keeping open affiliate links active (zero cost). Require upfront Spark Ads codes on sample briefs and boost only organically converting clips.',
    },
    {
      id: 'p1-seasonal',
      priority: 'P1 · Doanh thu lõi',
      priorityClass: 'text-[#0D7287] dark:text-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/15',
      owner: 'Merchandising + E-Com',
      effortVi: '4 tuần',
      effortEn: '4 wks',
      titleVi: 'Đẩy sớm lịch seeding & lên kệ mã Thu Đông chủ lực (AT06) sớm 3–4 tuần',
      titleEn: 'Advance autumn hero SKU (AT06) seeding & launch by 3–4 weeks',
      kpiVi: 'Giữ nền GMV T8 ≥ 40–45 Tr/ngày (vs. đáy 20,5 Tr/ngày)',
      kpiEn: 'Hold Aug floor ≥ 40–45M VND/day (vs. 20.5M/day trough)',
      impactVi: 'Thu hẹp vùng trũng giao mùa T8 (minh họa ~400–600 Tr GMV/tháng, cần kiểm chứng COGS/Ads)',
      impactEn: 'Narrows Aug chasm (illustrative ~400–600M GMV/mo, pending COGS/ad-spend audit)',
      evidenceVi:
        '6 mã đồ bơi Hè rơi -89,3% từ 1,57 tỷ (T6) về 0,17 tỷ (T8, giải thích ~45% cú giảm T6→T8), ngay cả chân váy CV11/CV02 bán từ đầu T5 cũng giảm -41% T7→T8 trong khi AT06 mở bán muộn 09/09.',
      evidenceEn:
        'The 6 summer swimwear SKUs fell -89.3% from 1.57B (Jun) to 0.17B (Aug, ~45% of Jun→Aug drop); even year-round skirts CV11/CV02 (live since May) fell -41% Jul→Aug while AT06 launched late on Sep 09.',
      actionVi:
        'Ngay khi MA7 cắt dưới MA28 hậu đỉnh Hè (quanh cuối T6–T7), kích hoạt lịch chuẩn bị hàng giao mùa mới và gửi mẫu test nhóm áo thu nhẹ (tương tự AT06) từ đầu T8 để bật bán giữa–cuối T8; đồng thời kiểm tra lại ngân sách Ads và tồn kho T7–T8 nội bộ.',
      actionEn:
        'Once post-peak MA7 < MA28 triggers (late Jun–Jul), start transitional assortment prep and seed autumn hero samples (like AT06) in early August to launch mid–late August, paired with an internal ad-spend and stockout review.',
    },
    {
      id: 'p1-at06',
      priority: 'P1 · Giảm rủi ro',
      priorityClass: 'text-rose-700 dark:text-rose-400 bg-rose-500/10',
      owner: 'Merchandising + Ops',
      effortVi: '2 tuần',
      effortEn: '2 wks',
      titleVi: 'Bán chéo combo giảm lệ thuộc AT06 (80,5% T10) & rà soát 204 SKU cũ',
      titleEn: 'Bundle AT06 (80.5% Oct share) & audit 204 zero-sale legacy SKUs',
      kpiVi: 'Tỷ trọng 1 SKU đơn lẻ ≤ 50% GMV tháng · Tỷ lệ SKU active ≥ 65%',
      kpiEn: 'Cap single-SKU share ≤ 50% monthly GMV · Active SKU ratio ≥ 65%',
      impactVi: 'Giảm rủi ro đứt hàng Q4 (đặc biệt khi MA7 đã cắt dưới MA28 ngày 22/10)',
      impactEn: 'Reduces Q4 stockout exposure (notably after MA7 < MA28 triggered Oct 22)',
      evidenceVi:
        'Tháng 10 riêng mã AT06 chiếm 80,5% doanh thu toàn shop (1,30 / 1,62 tỷ), AG01 đã tắt doanh số sau 05/10, và 206/339 SKU (60,8%) có doanh thu 0đ trong 90 ngày gần nhất.',
      evidenceEn:
        'In October, AT06 alone drove 80.5% of store GMV (1.30B / 1.62B), AG01 stopped selling after Oct 05, and 206 of 339 SKUs (60.8%) had zero sales in the trailing 90 days.',
      actionVi:
        'Ghim combo AT06 kèm chân váy còn sức bán (CV11, CV02) và 1–2 mã Thu Đông mới trong cùng phiên live; đối chiếu tồn kho ERP và lượng tìm kiếm tự nhiên trước khi ẩn 204 SKU cũ (trước 2026) và gộp link trùng H30.',
      actionEn:
        'Bundle AT06 with active skirts (CV11, CV02) and 1–2 new Q4 hero candidates; verify ERP stock and organic search traffic before archiving 204 pre-2026 zero-sale SKUs and merging duplicate H30 links.',
    },
    {
      id: 'p2-live',
      priority: 'P2 · Pilot Test',
      priorityClass: 'text-amber-800 dark:text-[#FFE485] bg-[#FFE485]/45 dark:bg-[#FFD14C]/15',
      owner: 'Livestream Ops',
      effortVi: '2 tuần',
      effortEn: '2 wks',
      titleVi: 'Thí điểm ca Live ≥8h theo mùa vụ với ngưỡng cắt lỗ theo giờ & xoay kệ >50 SKU',
      titleEn: 'Season-calibrated ≥8h Live pilot with hourly stop-loss & >50 pinned SKUs',
      kpiVi: 'Ngày thường ≥ 1,8–2,8 Tr/giờ (nền T10) · Ngày sale ≥ 4,5+ Tr/giờ & lãi gộp > chi phí host',
      kpiEn: 'Regular days ≥ 1.8–2.8M/hr (Oct baseline) · Promo days ≥ 4.5M+/hr with positive net contribution',
      impactVi: 'Tránh đốt chi phí ca dài trong mùa thấp điểm (T7: 1,43 Tr/h · T8: 0,73 Tr/h)',
      impactEn: 'Prevents off-peak overtime burn (Jul: 1.43M/hr · Aug: 0.73M/hr)',
      evidenceVi:
        'Phân tầng theo tháng cho thấy 67 ca >10h đạt 8,48 Tr/h ở T6 (68,7% GMV) nhưng rơi về 1,43 Tr/h ở T7 và 0,73 Tr/h ở T8 (thấp hơn ca <2h). Tháng 10 bình quân toàn kênh chính chủ đạt 2,81 Tr/h.',
      evidenceEn:
        'Monthly stratification reveals 67 >10h shifts hit 8.48M/hr in Jun (68.7% of GMV) but fell to 1.43M/hr in Jul and 0.73M/hr in Aug (below <2h). October official live average stood at 2.81M/hr.',
      actionVi:
        'Chỉ mở rộng ca ≥8h vào ngày sale hoặc khi nhu cầu sản phẩm chủ lực đạt ngưỡng; thiết kế pilot đối chứng ngày sale vs. ngày thường với 2–3 host xoay ca, ghim >50 mã (ρ = +0,339) và dừng sớm nếu GMV/giờ rơi dưới điểm hòa vốn host + studio.',
      actionEn:
        'Reserve ≥8h shifts for promo days or validated hero demand; run a promo vs. regular-day pilot with 2–3 rotating hosts, >50 pinned SKUs (ρ = +0.339), and hard stop-loss rules whenever hourly GMV falls below host + studio break-even.',
    },
  ];

  return (
    <section id="sec-warning" className="scroll-mt-28 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isVi
              ? 'Kế hoạch hành động & Đặc tả BA từ dữ liệu (To-Be, User Stories & Wireframe)'
              : 'Action Plan & Data-Driven BA Spec (To-Be Flow, User Stories & Wireframe)'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            {isVi
              ? 'Khép kín vòng lặp DA → BA: phân tích nguyên nhân gốc (5 Whys & Fishbone), lộ trình ưu tiên, As-Is/To-Be, RACI, 4 User Stories, wireframe và 6 UAT Test Cases.'
              : 'Closes the DA → BA loop: Root Cause (5 Whys & Fishbone), prioritized playbook, As-Is/To-Be, RACI, 4 User Stories, wireframe, and 6 UAT Test Cases.'}
          </p>
        </div>

        {/* 4-TAB DA-BA SOLUTION SWITCHER */}
        <div
          role="tablist"
          aria-label={isVi ? 'Nhóm giải pháp DA và BA' : 'DA and BA Solution Tabs'}
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0"
        >
          {(
            [
              { id: 'playbook', vi: '1. Action Plan', en: '1. Action Plan' },
              { id: 'root-cause', vi: '2. 5 Whys & Fishbone', en: '2. 5 Whys & Fishbone' },
              { id: 'ba-spec', vi: '3. To-Be, RACI & US', en: '3. To-Be, RACI & US' },
              { id: 'wireframe', vi: '4. Wireframe & UAT', en: '4. Wireframe & UAT' },
            ] as const
          ).map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveSubTab(tab.id)}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/70 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {isVi ? tab.vi : tab.en}
              </button>
            );
          })}
        </div>
      </div>

      {activeSubTab === 'playbook' && (
        <div className="space-y-4">
      {/* Unified Prioritized Playbook Table */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-slate-50/90 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">{isVi ? 'Ưu tiên' : 'Priority'}</th>
                <th className="py-2.5 px-3 font-semibold">{isVi ? 'Sáng kiến & Phụ trách' : 'Initiative & Owner'}</th>
                <th className="py-2.5 px-3 font-semibold">{isVi ? 'KPI mục tiêu' : 'Target KPI'}</th>
                <th className="py-2.5 px-3 font-semibold">{isVi ? 'Tác động dự kiến (giả định)' : 'Illustrative Impact'}</th>
                <th className="py-2.5 px-4 font-semibold text-right whitespace-nowrap">{isVi ? 'Chi tiết' : 'Detail'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
              {playbookRows.map((row) => {
                const isOpen = expandedRow === row.id;
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => setExpandedRow(isOpen ? null : row.id)}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${row.priorityClass}`}>
                          {row.priority}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {isVi ? row.effortVi : row.effortEn}
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top">
                        <p className="font-bold text-slate-900 dark:text-white leading-snug">
                          {isVi ? row.titleVi : row.titleEn}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{row.owner}</p>
                      </td>
                      <td className="py-3 px-3 align-top font-semibold text-[#074553] dark:text-[#9BE7FA] leading-snug">
                        {isVi ? row.kpiVi : row.kpiEn}
                      </td>
                      <td className="py-3 px-3 align-top leading-snug">
                        {isVi ? row.impactVi : row.impactEn}
                      </td>
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRow(isOpen ? null : row.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-[#0D7287] cursor-pointer"
                        >
                          <span>{isOpen ? (isVi ? 'Ẩn' : 'Hide') : (isVi ? 'Mở' : 'View')}</span>
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-[#F0F9FB]/60 dark:bg-slate-950/60">
                        <td colSpan={5} className="px-4 py-3.5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                            <div>
                              <strong className="text-slate-900 dark:text-white">
                                {isVi ? 'Bằng chứng dữ liệu: ' : 'Data Evidence: '}
                              </strong>
                              <span>{isVi ? row.evidenceVi : row.evidenceEn}</span>
                            </div>
                            <div>
                              <strong className="text-[#0D7287] dark:text-[#9BE7FA]">
                                {isVi ? 'Cách triển khai: ' : 'Rollout Steps: '}
                              </strong>
                              <span>{isVi ? row.actionVi : row.actionEn}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsible Accordion for Backtest & Early Warning Signals (-40% height reduction) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowBacktestAccordion((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>
            {showBacktestAccordion
              ? isVi
                ? 'Thu gọn bảng Backtest 4 tín hiệu cảnh báo sớm & Giao cắt MA7/MA28'
                : 'Collapse 4-Signal Early Warning Backtest & MA7/MA28 Crossovers'
              : isVi
              ? 'Xem bảng Backtest 4 tín hiệu cảnh báo sớm (Giao cắt MA7 < MA28 ngày 29/04, 04/06, 26/06, 22/10)'
              : 'View 4-Signal Early Warning Backtest Table (MA7 < MA28 Crossovers on Apr 29, Jun 04, Jun 26, Oct 22)'}
          </span>
          {showBacktestAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showBacktestAccordion && (
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">{isVi ? 'Tín hiệu' : 'Signal'}</th>
                  <th className="py-2 px-2 font-semibold text-right">{isVi ? 'Số lần báo' : 'Triggers'}</th>
                  <th className="py-2 px-2 font-semibold text-right">{isVi ? 'Độ trễ vs 16/06' : 'Lead vs Jun 16'}</th>
                  <th className="py-2 px-2 font-semibold text-right">{isVi ? 'Báo giả' : 'False Alarms'}</th>
                  <th className="py-2 pl-2 font-semibold">{isVi ? 'Đánh giá kiểm định' : 'Audit Verdict'}</th>
                </tr>
              </thead>
              <tbody>
                {V2.ch6.backtestRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="py-2 pr-3 font-semibold text-slate-900 dark:text-white">
                      {isVi ? row.signalVi : row.signalEn}
                    </td>
                    <td className="py-2 px-2 text-right font-bold">{row.triggers}</td>
                    <td className="py-2 px-2 text-right font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                      {row.leadDaysVsPeak > 0 ? `+${row.leadDaysVsPeak}d` : `${row.leadDaysVsPeak}d`}
                    </td>
                    <td className="py-2 px-2 text-right">{row.falseAlarms}</td>
                    <td className="py-2 pl-2 text-slate-600 dark:text-slate-300">
                      {isVi ? row.verdictVi : row.verdictEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </div>
      )}

      {/* TAB 2: ROOT CAUSE ANALYSIS (5 WHYS & FISHBONE 4M) */}
      {activeSubTab === 'root-cause' && (
        <div className="space-y-4 text-xs tabular-nums">
          <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isVi
                  ? 'A. Truy vết nguyên nhân gốc 5 Whys — Cú rơi doanh thu -83,1% (Tháng 6 → Tháng 8)'
                  : 'A. 5 Whys Root Cause Chain — Why GMV Fell -83.1% (Jun → Aug)'}
              </p>
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                4,06 tỷ → 0,68 tỷ đ
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {KAMI_FIVE_WHYS.map((w, idx) => (
                <div key={w.level} className="p-3.5 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                  <div className="md:col-span-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                        idx === KAMI_FIVE_WHYS.length - 1
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          : 'bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]'
                      }`}
                    >
                      {w.level}
                    </span>
                  </div>
                  <p className="md:col-span-5 font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {isVi ? w.qVi : w.qEn}
                  </p>
                  <p className="md:col-span-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {isVi ? w.aVi : w.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isVi
                  ? 'B. Sơ đồ xương cá (Fishbone 4M) — 4 nhóm nguyên nhân có chứng cứ định lượng'
                  : 'B. Fishbone (Ishikawa 4M) — 4 Quantified Cause Branches'}
              </p>
              <span className="text-[11px] font-mono text-slate-500">Product · Channel · Creator · Process</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KAMI_FISHBONE.map((b) => (
                <div key={b.branchEn} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-3.5 space-y-2">
                  <p className="font-bold text-[#074553] dark:text-[#9BE7FA]">{isVi ? b.branchVi : b.branchEn}</p>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4 leading-relaxed">
                    {(isVi ? b.itemsVi : b.itemsEn).map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AS-IS -> TO-BE PROCESS, RACI & 4 USER STORIES (GIVEN-WHEN-THEN) */}
      {activeSubTab === 'ba-spec' && (
        <div className="space-y-4 text-xs tabular-nums">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isVi
                  ? 'A. Chuyển đổi quy trình vận hành (As-Is → To-Be) gắn trực tiếp với nút thắt dữ liệu'
                  : 'A. Operational Workflow Shift (As-Is → To-Be) Linked Directly to DA Bottlenecks'}
              </p>
              <span className="text-[11px] font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                {isVi ? '4 điểm nghẽn → 4 cổng kiểm soát tự động' : '4 Bottlenecks → 4 Automated Gates'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">{isVi ? 'Luồng nghiệp vụ' : 'Process'}</th>
                    <th className="py-2.5 px-3 font-semibold">{isVi ? 'Hiện trạng (As-Is)' : 'Current State (As-Is)'}</th>
                    <th className="py-2.5 px-4 font-semibold">{isVi ? 'Quy trình đề xuất (To-Be)' : 'Target State (To-Be)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                  {BA_PROCESS_DIFF.map((p) => (
                    <tr key={p.stepEn}>
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {isVi ? p.stepVi : p.stepEn}
                      </td>
                      <td className="py-2.5 px-3 text-rose-700 dark:text-rose-300/90 leading-relaxed">
                        {isVi ? p.asIsVi : p.asIsEn}
                      </td>
                      <td className="py-2.5 px-4 leading-relaxed">
                        <span className="inline-flex items-start gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{isVi ? p.toBeVi : p.toBeEn}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isVi
                  ? 'B. 4 User Stories & Tiêu chí nghiệm thu (Given–When–Then) cho đội BI / Vận hành'
                  : 'B. 4 User Stories & Acceptance Criteria (Given–When–Then) for BI / Ops Engineering'}
              </p>
              <span className="text-[11px] font-mono text-slate-500">US-KE-01..04</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">ID / Trigger</th>
                    <th className="py-2.5 px-3 font-semibold min-w-[200px]">User Story</th>
                    <th className="py-2.5 px-4 font-semibold min-w-[280px]">{isVi ? 'Tiêu chí nghiệm thu (Acceptance Criteria)' : 'Acceptance Criteria'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                  {KAMI_USER_STORIES.map((us) => (
                    <tr key={us.id}>
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold text-[11px]">
                          {us.id}
                        </span>
                        <div className="text-[11px] font-mono text-slate-500 mt-1">{us.signal}</div>
                      </td>
                      <td className="py-3 px-3 align-top leading-relaxed font-medium text-slate-900 dark:text-white">
                        {isVi ? us.storyVi : us.storyEn}
                      </td>
                      <td className="py-3 px-4 align-top leading-relaxed">
                        {isVi ? us.acVi : us.acEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* C. RACI GOVERNANCE MATRIX */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isVi
                  ? 'C. Ma trận Phân vai Trách nhiệm (RACI Matrix) cho 5 luồng vận hành To-Be'
                  : 'C. RACI Responsibility Matrix Across 5 To-Be Operational Workflows'}
              </p>
              <span className="text-[11px] font-mono text-slate-500">R: Responsible · A: Accountable · C: Consulted · I: Informed</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-4 font-semibold">{isVi ? 'Quy trình / Cổng kiểm soát' : 'Workflow / Control Gate'}</th>
                    <th className="py-2.5 px-2 font-semibold text-center">Store Ops</th>
                    <th className="py-2.5 px-2 font-semibold text-center">Merch</th>
                    <th className="py-2.5 px-2 font-semibold text-center">Live Ops</th>
                    <th className="py-2.5 px-2 font-semibold text-center">Affiliate</th>
                    <th className="py-2.5 px-3 font-semibold text-center">DA / BI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                  {KAMI_RACI.map((row) => (
                    <tr key={row.taskEn}>
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                        {isVi ? row.taskVi : row.taskEn}
                      </td>
                      {[row.ops, row.merch, row.live, row.aff, row.bi].map((role, rIdx) => (
                        <td key={rIdx} className="py-2.5 px-2 text-center font-mono font-bold">
                          <span
                            className={`inline-block min-w-[24px] px-1.5 py-0.5 rounded text-[11px] ${
                              role.includes('R')
                                ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                                : role === 'A'
                                ? 'bg-[#FFE485]/80 text-amber-950 dark:bg-[#FFD14C]/25 dark:text-[#FFE485]'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {role}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOW-FIDELITY OPS ALERT WIREFRAME & UAT TEST CASES */}
      {activeSubTab === 'wireframe' && (
        <div className="space-y-4">
        <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 space-y-4 tabular-nums">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {isVi
                  ? 'WIREFRAME MÀN HÌNH ĐIỀU HÀNH · KAMI ELY OPS ALERT & KOC GATE (LO-FI SPEC)'
                  : 'OPS CONSOLE WIREFRAME · KAMI ELY ALERT & KOC SCREENING GATE (LO-FI SPEC)'}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              {isVi ? 'Bám sát US-KE-01..04 & Star Schema 4 Fact' : 'Mapped to US-KE-01..04 & 4-Fact Star Schema'}
            </span>
          </div>

          {/* Wireframe Row 1: Top Alert Banner (US-KE-01) */}
          <div className="rounded-xl border border-rose-300 dark:border-rose-800/70 bg-rose-500/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                <strong>[US-KE-01]</strong>{' '}
                {isVi
                  ? 'Cảnh báo chuyển mùa (22/10): MA7 < MA28 & SKU AT06 chiếm 80,5% GMV T10 (vượt trần 50%) → Đề xuất ghim combo CV11 / CV02.'
                  : 'Seasonal Trigger (Oct 22): MA7 < MA28 & AT06 at 80.5% Oct GMV (> 50% cap) → Recommend bundling CV11 / CV02.'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-md border border-rose-400/60 bg-white/80 dark:bg-slate-900 font-mono text-[11px] font-bold text-rose-700 dark:text-rose-300">
              {isVi ? 'Mở kế hoạch Combo' : 'Open Bundle Plan'}
            </span>
          </div>

          {/* Wireframe Row 2: 2-Column Interactive Spec Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
            {/* Left (7 cols): 2-Tier KOC Screening Queue (US-KE-02) */}
            <div className="lg:col-span-7 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isVi ? '[US-KE-02] Hàng đợi sàng lọc KOC 2 tầng (3 phiên đầu = 0đ)' : '[US-KE-02] 2-Tier KOC Screening Queue (3 Zero-GMV Sessions)'}
                </p>
                <span className="font-mono text-[11px] text-[#0D7287] dark:text-[#9BE7FA]">n = 145 KOC</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isVi ? 'Nhóm dưới ngưỡng view (94 KOC · 64,8% không ra đơn)' : 'Sub-threshold views (94 KOCs · 64.8% never convert)'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isVi ? 'Hành động tự động: Dừng gửi mẫu miễn phí / booking trả phí' : 'Auto action: Pause paid sample seeding / fixed fees'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-[#FFE485] font-bold text-[11px]">
                    {isVi ? 'Giữ Link Mở (0đ)' : 'Keep Open Link (0đ)'}
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-300/70 dark:border-emerald-800/60 bg-emerald-500/5 p-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isVi ? 'Nhóm bật đơn từ phiên 4+ (51 KOC · 304,9 Tr GMV)' : 'Session 4+ converters (51 KOCs · 304.9M GMV)'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isVi ? 'Tự động khôi phục quyền nhận mẫu mới khi phát sinh đơn đầu tiên' : 'Auto-restores sample eligibility upon first verified order'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    <span>{isVi ? 'Bảo toàn 18,8% Live ngoài' : 'Protects 18.8% Ext Live'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right (5 cols): Live Stop-Loss Monitor (US-KE-03) + Spark Ads Gate (US-KE-04) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Radio className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
                    <span>{isVi ? '[US-KE-03] Cổng Stop-Loss Ca Live' : '[US-KE-03] Live Shift Stop-Loss'}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">{isVi ? 'Nền T10: 2,81 Tr/h' : 'Oct Base: 2.81M/hr'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full w-[64%] bg-[#0D7287] dark:bg-[#9BE7FA]" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isVi
                    ? 'Cảnh báo cắt ca nếu 2 giờ trượt < 1,8 Tr/h (ngày thường) hoặc ghim < 50 SKU (tránh lặp lại mức 0,73 Tr/h tháng 8).'
                    : 'Triggers early-stop alert if trailing 2h < 1.8M/hr (regular day) or < 50 pinned SKUs (preventing Aug 0.73M/hr burn).'}
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>{isVi ? '[US-KE-04] Cổng duyệt Spark Ads' : '[US-KE-04] Spark Ads Approval Gate'}</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">GPM ≥ Organic</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold">
                    {isVi ? '✓ Có đơn tự nhiên' : '✓ Organic Order'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold">
                    {isVi ? '✓ Đã cấp mã Spark' : '✓ Ad Code Ready'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold">
                    {isVi ? '✕ Chặn clip 0 đơn' : '✕ Block 0-Order Clip'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UAT TEST CASES (UAT-KE-01..06) */}
        <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden text-xs tabular-nums">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-slate-900 dark:text-white">
              {isVi
                ? 'Kịch bản Kiểm thử Nghiệm thu (UAT Test Cases — UAT-KE-01..06)'
                : 'User Acceptance Testing Cases (UAT-KE-01..06)'}
            </p>
            <span className="text-[11px] font-mono text-[#0D7287] dark:text-[#9BE7FA]">Mapped to US-KE-01..04</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Test ID</th>
                  <th className="py-2.5 px-3 font-semibold">{isVi ? 'Kịch bản kiểm thử' : 'Test Scenario'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isVi ? 'Dữ liệu đầu vào / Điều kiện' : 'Input / Precondition'}</th>
                  <th className="py-2.5 px-4 font-semibold">{isVi ? 'Kết quả kỳ vọng (Tiêu chí Pass)' : 'Expected Result (Pass Criteria)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {KAMI_UAT_CASES.map((tc) => (
                  <tr key={tc.id}>
                    <td className="py-2.5 px-4 align-top whitespace-nowrap">
                      <span className="font-mono font-bold text-[#074553] dark:text-[#9BE7FA]">{tc.id}</span>
                      <div className="text-[11px] font-mono text-slate-500">{tc.us}</div>
                    </td>
                    <td className="py-2.5 px-3 align-top font-semibold text-slate-900 dark:text-white">
                      {isVi ? tc.scenarioVi : tc.scenarioEn}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isVi ? tc.inputVi : tc.inputEn}
                    </td>
                    <td className="py-2.5 px-4 align-top leading-relaxed">
                      {isVi ? tc.expectedVi : tc.expectedEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}
    </section>
  );
}
