'use client';

import React from 'react';
import {
  pipelineMeta,
  sqlSnippets,
} from '../playbook/playbookData';
import {
  UnifiedSection,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import Stage1BusinessAndDataArchitecture from './Stage1BusinessAndDataArchitecture';
import Stage2ProfileAndCleanUpgrade from './Stage2ProfileAndCleanUpgrade';
import Stage3TimeSeriesAndSeasonality from './Stage3TimeSeriesAndSeasonality';
import Stage4CreatorCohortsAndLtv from './Stage4CreatorCohortsAndLtv';
import Stage5FunnelsAndMarketingChannels from './Stage5FunnelsAndMarketingChannels';
import Stage6TextAndAnomalies from './Stage6TextAndAnomalies';
import Stage7EtlAutomationAndPii from './Stage7EtlAutomationAndPii';
import type { KamiElyDataPayload } from '@/app/types/caseStudies';

export interface KamiElyCommercialTabProps {
  isEn?: boolean;
  onOpenProofModal?: (_screenshotId?: string) => void;
  copyDeepLink?: (_id: string) => void;
  telemetryData?: KamiElyDataPayload | null;
}

export default function KamiElyCommercialTab(_props: KamiElyCommercialTabProps) {
  const { L, n } = usePlaybookLang();

  return (
    <div className="w-full space-y-12">
      {/* Giai đoạn 1: Xác định Bài toán Kinh doanh & Kiến trúc Luồng Dữ liệu */}
      <UnifiedSection
        id="sec-stage-1-architecture"
        badge="1"
        title={L(
          'Mục 1: Bài toán Kinh doanh & Kiến trúc Luồng Dữ liệu',
          'Section 1: Business Problem Definition & Data Flow Architecture',
        )}
        takeaway={L(
          `Thương hiệu thời trang đồ bơi Kami Ely đạt doanh thu lũy kế 31,6 tỷ VNĐ (14,84 tỷ VNĐ trong 226 ngày liên tục T3–T10/2026), tăng trưởng từ 0,95 tỷ (T3) lên đỉnh 3,77 tỷ (T6), hạ nhiệt trong T8-T9 (0,64-0,70 tỷ) và phục hồi mạnh mẽ trong T10 (1,45 tỷ/20 ngày). Dự án giải quyết câu hỏi trọng tâm về nguồn gốc doanh thu và các tín hiệu cảnh báo rủi ro chuyển mùa thông qua kho dữ liệu 3 lớp (raw, staging, mart) từ ${pipelineMeta.tables} bảng nguồn hợp nhất (${n(pipelineMeta.rows)} dòng SSOT).`,
          `Cumulative revenue reaches 31.6B VND (14.84B in 226 continuous days Mar-Oct 2026), peaking at 3.77B (June), troughing in Aug-Sep (0.64-0.70B), and rebounding in Oct (1.45B/20 days). Resolves core commercial inquiries and seasonal transition risk signals via 3-tier warehouse architecture across ${pipelineMeta.tables} unified tables (${n(pipelineMeta.rows)} SSOT records).`,
        )}
        kpis={[
          {
            value: L('31,6 Tỷ đ', '31.6B VND'),
            label: L('doanh thu lũy kế toàn shop', 'cumulative total GMV'),
            sub: L('14,84 Tỷ đ trong 226 ngày phân tích SSOT (T3–T10/2026)', '14.84B VND across 226-day continuous SSOT window'),
          },
          {
            value: `${pipelineMeta.tables} ${L('bảng dữ liệu', 'unified tables')}`,
            label: L('nguồn dữ liệu second-party', 'second-party source tables'),
            sub: L(`${n(pipelineMeta.rows)} dòng phân theo 5 mức chi tiết (data grains)`, `${n(pipelineMeta.rows)} rows mapped across 5 data grains`),
          },
          {
            value: L('5 câu hỏi con', '5 sub-questions'),
            label: L('phục vụ quyết định của chủ shop', 'driving tactical owner decisions'),
            sub: L('Phát hiện & đối soát 2 điểm lệch thực tế giữa các nguồn', 'Detects & reconciles 2 empirical cross-source variances'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Dữ liệu hiện có ở mức tổng hợp (snapshots), không có mã khách hàng cá nhân hay giá vốn nội bộ (COGS), do đó câu hỏi về retention vi mô được chủ động loại bỏ để bảo toàn tính chuẩn xác.',
          'Exports exist as aggregated snapshots lacking customer_id or internal COGS; micro retention inquiries were intentionally omitted to maintain analytical rigor.',
        )}
        action={L(
          'Xây dựng quy trình nạp tự động qua Python, phân tầng kho 3 lớp (raw, staging, mart) và chuẩn hóa khóa định danh để sẵn sàng tích hợp với ERP nội bộ.',
          'Deploy Python ingestion with 3-tier schemas (raw, staging, mart) and unified entity keys to ensure future-ready internal ERP integration.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 1)', 'SQL (Stage 1)'), code: sqlSnippets.s1 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage1BusinessAndDataArchitecture />
        </div>
      </UnifiedSection>

      {/* Giai đoạn 2: Khám phá, Lập hồ sơ & Làm sạch Dữ liệu Gian hàng */}
      <UnifiedSection
        id="sec-stage-2-profile-clean"
        badge="2"
        title={L(
          'Khám phá, Lập hồ sơ & Làm sạch Dữ liệu Gian hàng',
          'Explore, Profile Distributions & Clean Store Data',
        )}
        takeaway={L(
          'Chạy kiểm thử thực tế trên 8 file nguồn phát hiện 197/331 SKU không có đơn, giải mã toán học triệt để chênh lệch 475 vs 470 phiên (+13 giờ múi giờ & 91.000 đ), xác lập 7 quy tắc làm sạch chuẩn hóa và đính chính 2 sai lệch nghiêm trọng từ báo cáo cũ (tăng trưởng T3→T4 là 98,5% thay vì 158,9%; bác bỏ ngụy biện KOC <5k follower).',
          'Direct verification across 8 raw xlsx files reveals 197/331 zero-sale SKUs, mathematically solves the 475 vs 470 session variance (+13h lag & 91k VND delta), establishes 7 production cleaning standards, and corrects 2 critical legacy reporting flaws (March-April daily growth was 98.5% not 158.9%; debunks <5k follower KOC myth).',
        )}
        kpis={[
          {
            value: '134/331 SKU',
            label: L('mã sản phẩm có phát sinh doanh số', 'active catalog SKUs with GMV > 0'),
            sub: L('197 mã 0 đơn (59,5%) · Top 5 sản phẩm gánh 44,9% GMV', '197 dead SKUs (59.5%) · Top 5 SKUs generate 44.9% GMV'),
          },
          {
            value: L('+13 Giờ Múi giờ', '+13h Timezone'),
            label: L('giải mã khớp 470/470 phiên Shop LIVE', 'solves 470/470 Shop LIVE sessions'),
            sub: L('190k đ (lệch phiên 06/05) − 99k đ (phiên 07/03) = 91k đ khớp 100%', '190k VND (May 06 delta) − 99k VND (Mar 07 session) = 91k VND exact math'),
          },
          {
            value: '+98,5% (vs 158,9%)',
            label: L('tăng trưởng thực tế ngày T3 → T4', 'true day-normalized March → April growth'),
            sub: L('T3 chỉ có 23 ngày quan sát (41,3 Tr/ngày vs 82,0 Tr/ngày)', 'March tracked only 23 active days (41.3M/day vs 82.0M/day)'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Báo cáo cũ mắc 2 sai lệch nghiêm trọng: tính tăng trưởng tháng tổng thổi phồng T3→T4 lên 158,9% (thực chất 98,5%) và nhận định sai lầm "KOC <5k follower gánh shop" do tài khoản đồng vận hành girlstyle.vn (3.215 follower) chiếm tới 79% nhóm này.',
          'Legacy reports harbored 2 critical flaws: total-month growth inflated March-April to 158.9% (actually 98.5% day-normalized) and falsely claimed nano KOCs drove sales, masking that in-house co-op girlstyle.vn (3,215 followers) generated 79% of the 1k-5k tier.',
        )}
        action={L(
          'Áp dụng 7 chuẩn làm sạch: chuẩn hóa UTC+7 (+13h cho Live, -1h cho UTC+8), unnest dải giá, gán cờ is_orphan, is_partial_month và tách bạch 3 nhóm kênh: Tự vận hành (63,9%), Nội bộ affiliate (15,5%) và KOC ngoài (20,6%).',
          'Deploy 7 cleaning standards: normalize UTC+7 (+13h for Live, -1h for UTC+8), unnest price ranges, flag is_orphan & is_partial_month, and partition channels into Own Brand (63.9%), In-house Affiliate (15.5%), and External KOCs (20.6%).',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 2)', 'SQL (Stage 2)'), code: sqlSnippets.s2 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage2ProfileAndCleanUpgrade />
        </div>
      </UnifiedSection>

      {/* Giai đoạn 3: Phân tích Chuỗi thời gian: Xu hướng Doanh số & Lập lịch Khuyến mãi */}
      <UnifiedSection
        id="sec-stage-3-timeseries"
        badge="3"
        title={L(
          'Mục 3: Chuỗi Thời Gian & Mùa Vụ (Xu Hướng, Đỉnh & Điểm Gãy)',
          'Section 3: Time-Series & Seasonality Analysis (Trends, Peak & Structural Breaks)',
        )}
        takeaway={L(
          'Chuỗi 180 ngày ghi nhận đỉnh doanh thu ngày 16/06 (315,0 Tr đ), đỉnh tuần W25 (1,06 Tỷ đ) và đỉnh tháng T6 (3,77 Tỷ đ). Tín hiệu cảnh báo sớm Giao cắt tử thần (MA7 cắt xuống MA28) xuất hiện ngày 26/06 (sớm 18 ngày trước khi GMV rơi thủng mức Tháng 4). Phân rã mức sụt giảm 82,9% giữa T6 và T8 chứng minh cả hai hiệu ứng tác động tương đương: số lượng phiên Live giảm 59% (góp 71,1% mức giảm) và hiệu suất GMV/ca Live rơi 58% (góp 70,3% mức giảm).',
          '180-day series records peak day on Jun 16 (315.0M VND), peak week W25 (1.06B VND), and peak month June (3.77B VND). Early Warning Dead Cross (MA7 crossing below MA28) triggered on Jun 26 (18 days before GMV breached April floor). Decomposing the 82.9% drop between June and August proves dual causality: live volume fell 59% (71.1% of drop) and GMV per live plunged 58% (70.3% of drop).',
        )}
        kpis={[
          {
            value: '315,0 Tr đ',
            label: L('ngày đỉnh cao nhất 16/06/2026', 'absolute peak day Jun 16'),
            sub: L('1.936 sp · 7 ngày quanh đỉnh gánh 1,09 Tỷ đ (8,6% GMV)', '1,936 units · 7 days around peak = 1.09B VND (8.6% GMV)'),
          },
          {
            value: '26/06/2026',
            label: L('tín hiệu Dead Cross (MA7 < MA28)', 'early Dead Cross signal'),
            sub: L('Cảnh báo sớm 18 ngày trước khi thủng ngưỡng T4', 'Warned 18 days before breaching April baseline'),
            tone: 'amber',
          },
          {
            value: '-82,9% GMV',
            label: L('phân rã sụt giảm giữa T6 và T8', 'decomposed drop between Jun & Aug'),
            sub: L('71,1% do giảm ca Live · 70,3% do giảm GMV/ca', '71.1% volume drop · 70.3% efficiency drop'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Doanh thu và số phiên Live có tương quan thuận mạnh (r = 0,55, p < 0,001), đạt đỉnh tương quan chéo ở chu kỳ tuần. Tuy nhiên, sụt giảm tháng 8 không đơn thuần do thiếu nỗ lực livestream mà do hiệu suất mỗi phiên cũng rơi tự do (từ 2,42M xuống 1,01M/ca) do tính mùa vụ đồ bơi hạ nhiệt.',
          'GMV and Live sessions strongly correlate (r = 0.55, p < 0.001), peaking cyclically at 7-day lag. However, August collapse was not merely reduced streaming effort; conversion per stream plummeted from 2.42M to 1.01M due to waning seasonal swimwear demand.',
        )}
        action={L(
          'Thiết lập hệ thống cảnh báo sớm dựa trên giao cắt MA7/MA28: ngay khi MA7 cắt xuống cuối tháng 6, lập tức ngừng ký cam kết booking KOC số lượng lớn và chuyển dịch danh mục sang thời trang thu đông từ giữa tháng 7.',
          'Deploy early warning system based on MA7/MA28 crossover: once MA7 cross occurs in late June, immediately freeze bulk KOC commitments and pivot catalog toward autumn lines by mid-July.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 3)', 'SQL (Stage 3)'), code: sqlSnippets.s3 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage3TimeSeriesAndSeasonality />
        </div>
      </UnifiedSection>

      {/* Giai đoạn 4: Cohort Creator, Retention và Giá Trị Vòng Đời */}
      <UnifiedSection
        id="sec-stage-4-creator-cohorts"
        badge="4"
        title={L(
          'Mục 4: Cohort Creator, Retention & Giá Trị Vòng Đời (Affiliate Lifecycle)',
          'Section 4: Creator Cohorts, Retention & Lifecycle Value (Affiliate Dynamics)',
        )}
        takeaway={L(
          'Chuyển thể bài toán cohort từ khách hàng sang creator affiliate trên 250 nhà sáng tạo (6.571 phiên Live): Tỷ lệ giữ chân M+1 suy giảm liên tục từ 71,2% (Cohort T3) xuống 28,6% (Cohort T7), nguồn tuyển mới cạn dần từ T5 (80 → 37 → 30 → 14 người). 56,0% creator chưa từng bán được đơn nào. Tài khoản nội bộ girl style chi phối 56,1% GMV Live affiliate (1,26 Tỷ đ), khiến GMV Cohort T5 bị thổi phồng từ 207 Tr lên 1,46 Tỷ đ. Kích hoạt sớm 3 phiên đầu là yếu tố sống còn: creator có đơn ở phiên đầu sống thọ trung vị 59 ngày (gấp gần 6 lần nhóm 0 đơn).',
          'Adapted cohort analysis from customers to creators across 250 affiliate streamers (6,571 sessions): M+1 retention eroded steadily from 71.2% (March) to 28.6% (July), while new recruits tapered off after April (80 → 37 → 30 → 14). 56.0% never generated a sale. In-house channel girl style commands 56.1% of affiliate live GMV (1.26B VND), artificially inflating Cohort May from 207M to 1.46B VND. First-3-session onboarding is decisive: creators with sales in session 1 boast a median lifespan of 59 days (nearly 6x longer than zero-sale peers).',
        )}
        kpis={[
          {
            value: '250 creator',
            label: L('affiliate LIVE phân tích (6.571 phiên)', 'affiliate LIVE creators analyzed (6,571 sessions)'),
            sub: L('110 creator từng có đơn (44%) · 140 creator 0 đơn (56%)', '110 active sellers (44%) · 140 zero-sale creators (56%)'),
          },
          {
            value: '14,0 ngày',
            label: L('trung vị khoảng cách phiên đầu đến cuối', 'median lifespan between first and last live'),
            sub: L('22,8% chỉ live đúng 1 phiên · Chỉ 36,4% sống ≥ 30 ngày', '22.8% 1-session dropouts · Only 36.4% survive ≥ 30 days'),
          },
          {
            value: '56,1% GMV',
            label: L("doanh số affiliate tập trung ở 'girl style'", "affiliate GMV concentrated in 'girl style'"),
            sub: L('1,26 / 2,24 Tỷ đ GMV affiliate · 98 ngày phát sóng trên 101 ngày tồn tại', '1.26 / 2.24B VND affiliate GMV · 98 streaming days over 101-day life'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Mạng lưới KOC không hề phân tán bền vững: 56,1% GMV phụ thuộc vào đúng 1 kênh nội bộ girl style. Khi loại bỏ Girl Style, GMV các cohort giảm dần đều theo thời gian (T3: 439M, T4: 224M, T5: 207M, T6: 109M, T7: 3,1M). Tỷ lệ giữ chân M+1 rơi từ 71% xuống 29% phản ánh sự cạn kiệt hiệu ứng KOC hữu cơ và suy giảm chất lượng các đợt tuyển sau.',
          'The KOC network is not organically resilient: 56.1% of GMV hinges on a single internal channel (girl style). Excluding Girl Style reveals monotonic cohort decay (T3: 439M, T4: 224M, T5: 207M, T6: 109M, T7: 3.1M). M+1 retention cratering from 71% to 29% exposes drying recruitment pipelines and degrading cohort quality.',
        )}
        action={L(
          'Thiết lập "Quy tắc 3 phiên đầu": tập trung tài nguyên đẩy traffic và trợ giá voucher cho creator mới trong 3 phiên live đầu để kích hoạt đơn hàng sớm (giúp nâng thời gian sống từ 10 ngày lên 59 ngày); song song đó nhân bản mô hình phòng live nội bộ vệ tinh thay vì phụ thuộc vào việc tìm kiếm KOC bên ngoài.',
          'Implement the "First-3-Sessions Rule": allocate promotional traffic and vouchers during a creator\'s first 3 livestreams to unlock early sales (extending median lifespan from 10 to 59 days); simultaneously replicate in-house satellite studio channels rather than relying on external KOC discovery.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 4)', 'SQL (Stage 4)'), code: sqlSnippets.s4 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage4CreatorCohortsAndLtv />
        </div>
      </UnifiedSection>

      {/* Giai đoạn 5: Phễu Nội Dung, Hiệu Suất Kênh & So Sánh Quảng Cáo vs Organic */}
      <UnifiedSection
        id="sec-stage-5-funnels-channels"
        badge="5"
        title={L(
          'Mục 5: Phễu Nội Dung, Hiệu Suất Kênh & So Sánh Quảng Cáo vs Organic',
          'Section 5: Content Funnel, Channel Efficiency & Ads vs Organic Comparison',
        )}
        takeaway={L(
          'Chuyển thể từ phễu TMĐT truyền thống sang phễu nội dung: Live chính chủ đạt 96,4% ca có đơn và GMV/lượt xem cao gấp 34,3 lần affiliate (2.155 đ vs 63 đ). Phân tích 4.417 video giỏ hàng chứng minh Ads = YES tăng xác suất có đơn gấp 5,0 lần (26,2% vs 5,2%, Odds Ratio = 6,41, p < 0,001) và duy trì ưu thế +10,40% trong cùng creator; tuy nhiên GMV/1.000 lượt xem của Ads không cao hơn Organic trên toàn mẫu (71k vs 81k đ) do lệch cửa sổ 90 ngày của video cũ. Giải mã nghịch lý khung tối: GMV/view thấp (1.137 đ) do hoàn toàn thiếu vắng các ca live >8h (vốn đạt 3.103 đ/view nhờ thuật toán TikTok).',
          'Adapted from e-com to content funnels: Own-brand Live delivers 96.4% converting sessions with 34.3x higher GMV per viewer than affiliates (2,155 vs 63 VND). Analyzing 4,417 shoppable videos confirms Ads = YES lifts order conversion 5.0x (26.2% vs 5.2%, Odds Ratio = 6.41, p < 0.001) and retains a +10.40% paired within-creator edge; however, Ads GMV per 1k views is not superior across the 180d sample (71k vs 81k VND) due to 90-day window truncation on older posts. Decodes evening anomaly: low conversion (1,137 VND/view) stems from zero >8h sessions (which average 3,103 VND/view via TikTok algorithmic boost).',
        )}
        kpis={[
          {
            value: '96,4% vs 26,1%',
            label: L('tỷ lệ có đơn (Live Chính chủ vs Affiliate)', 'order rate (Own-brand vs Affiliate Live)'),
            sub: L('Chính chủ 470 ca (7,02B) · Affiliate 6.576 ca (2,24B)', 'Own-brand 470 ses (7.02B) · Affiliate 6,576 ses (2.24B)'),
          },
          {
            value: '2.155 đ vs 63 đ',
            label: L('GMV / lượt xem (gấp 34,3 lần)', 'GMV / viewer (34.3x higher in Own-brand)'),
            sub: L('Affiliate gánh 91,6% lượt xem nhưng chỉ 24,2% GMV', 'Affiliate drives 91.6% views but only 24.2% GMV'),
          },
          {
            value: '26,2% vs 5,2%',
            label: L('tỷ lệ video có đơn (Ads vs Organic)', 'video order conversion (Ads vs Organic)'),
            sub: L('Odds Ratio = 6,41 · Chênh lệch trong cùng creator +10,40%', 'Odds Ratio = 6.41 · Within-creator paired uplift +10.40%'),
            tone: 'amber',
          },
        ]}
        finding={L(
          'Affiliate đóng vai trò phễu mở đầu (nhận diện, 91,6% lượt xem), nhưng phòng Live chính chủ mới là cỗ máy chuyển đổi dòng tiền (89% GMV toàn shop). Quảng cáo (Ads = YES) hiệu quả trong việc phá băng đơn hàng và đẩy phân phối cho video (Odds Ratio = 2,68 sau khi kiểm soát lượt xem), nhưng không làm tăng giá trị đơn vị trên mỗi lượt xem nếu nội dung không đủ hấp dẫn.',
          'Affiliates serve as top-of-funnel reach (91.6% views), whereas the own-brand live room acts as the primary monetization engine (89% GMV). Ads break conversion inertia and expand distribution (OR = 2.68 controlling for views), but do not enhance unit monetization per view without compelling organic creative quality.',
        )}
        action={L(
          'Định vị lại ngân sách: Dồn ngân sách live cho các ca kéo dài >8h vào khung sáng (06h–12h) và chiều (12h–18h) để tận dụng lực đẩy thuật toán (đạt 2.800–3.800 đ/view); đối với Video, chỉ kích hoạt chạy Ads cho các video đã chứng minh được đà chuyển đổi tự nhiên (organic traction) nhằm tối ưu chi phí phân phối.',
          'Strategic Budget Allocation: Concentrate streaming hours into >8h mega-sessions during morning (06h-12h) and afternoon (12h-18h) to maximize algorithmic boost (2,800-3,800 VND/view); for video, restrict paid ad boosts strictly to creative assets with proven organic traction to prevent unrecovered ad spend.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 5)', 'SQL (Stage 5)'), code: sqlSnippets.s5 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage5FunnelsAndMarketingChannels />
        </div>
      </UnifiedSection>

      {/* Giai đoạn 6: Phân Tích Văn Bản & Phát Hiện Bất Thường */}
      <UnifiedSection
        id="sec-stage-6-anomalies"
        badge="6"
        title={L(
          'Mục 6: Phân Tích Văn Bản & Phát Hiện Bất Thường (Content Tags & Anomalies)',
          'Section 6: Text Mining & Anomaly Detection (Content Tags & Outliers)',
        )}
        takeaway={L(
          'Phân loại 4.417 tiêu đề video bằng regex xác nhận nhóm Bikini chiếm áp đảo 61,0% GMV và có tỷ lệ ra đơn cao nhất (26,1%). Hashtag sản phẩm (#bikini, #chanvay) mang lại tỷ lệ có đơn 28,6% so với 16,4% của hashtag chung (#xuhuong, #fyp). Kiểm tra bất thường chuỗi GMV ngày ghi nhận duy nhất ngày 16/06 vượt z > 3 (z = 5,57; MAD robust z = 5,61; GMV 315,0 Tr đ), nguyên nhân gốc rễ do 1 phiên Live chính chủ lớn (194,9 Tr) kết hợp 90 ca affiliate (77,3 Tr). Bác bỏ 2 ngụy biện cũ: Shoppable không có "spike view tháng 8" (thực tế chạm đáy ~333k view), và GMV/phiên của Girl Style (4,93 Tr) thấp hơn P99 toàn mạng (12,07 Tr) do P99 bị kéo lệch bởi KOC 1 phiên.',
          'Regex classification on 4,417 shoppable video titles confirms Bikini commands 61.0% GMV with peak 26.1% order conversion. Product hashtags deliver 28.6% conversion vs 16.4% for generic tags. Time-series anomaly detection flags Jun 16 as the sole day exceeding z > 3 (z = 5.57, MAD robust z = 5.61, 315M GMV), driven by 1 mega brand live (194.9M) + 90 affiliate streams (77.3M). Debunks 2 legacy myths: August views did not spike (hit floor at ~333k), and Girl Style GMV/session (4.93M) sits below unclipped network P99 (12.07M) distorted by 1-session outliers.',
        )}
        kpis={[
          {
            value: '61,0% GMV',
            label: L('danh mục Bikini từ tiêu đề video', 'Bikini category video GMV share'),
            sub: L('1.590 video · 26,1% có đơn (1,32 Tỷ đ)', '1,590 videos · 26.1% conversion (1.32B VND)'),
          },
          {
            value: 'z = 5,57 (16/06)',
            label: L('ngày bất thường duy nhất vượt z > 3', 'sole outlier day exceeding z > 3'),
            sub: L('MAD robust z = 5,61 · Live gánh 86,4% GMV ngày', 'MAD robust z = 5.61 · Live drove 86.4% daily GMV'),
            tone: 'amber',
          },
          {
            value: '28,6% vs 16,4%',
            label: L('tỷ lệ có đơn (Tag Sản phẩm vs Chung)', 'order rate (Product vs Generic Tag)'),
            sub: L('#bikini, #chanvay vượt xa #xuhuong, #fyp', 'Specific tags beat generic viral hooks'),
          },
        ]}
        finding={L(
          'Bất thường GMV ngày không đến từ đột biến số lượng KOC mà bắt nguồn từ 1 đến 2 phiên Live chính chủ lớn (ví dụ 16/06 đạt 315M với phiên chính chủ 194,9M; 19/06 đạt 171M dù chỉ có 4 KOC tham gia). Về creator, Girl Style chiếm 56,1% GMV Live affiliate nhưng GMV/phiên (4,93M) xếp hạng 5, thấp hơn P99 do P99 bị bóp méo bởi các KOC chỉ phát 1 phiên duy nhất. Kỹ thuật Winsorize tại P99 giúp kéo trung bình GMV/phiên từ 727k về 325k phản ánh đúng thực tế.',
          'Daily GMV spikes originate from 1-2 massive own-brand live streams rather than surges in KOC headcount (e.g., Jun 16 hit 315M via a 194.9M brand stream; Jun 19 reached 171M with only 4 KOCs). While Girl Style commands 56.1% of affiliate Live GMV, its 4.93M/session ranks 5th, falling below raw P99 due to 1-session extreme outliers. Winsorizing at P99 compresses mean GMV/session from 727k to 325k.',
        )}
        action={L(
          'Áp dụng Z-score theo cửa sổ trượt 28 ngày thay vì toàn kỳ để loại bỏ nhiễu xu hướng; phân tầng đánh giá creator tối thiểu từ 20 phiên trở lên và áp dụng Winsorize P99 cho các phân phối lệch nặng; ưu tiên gắn hashtag đặc thù sản phẩm cho nội dung video thay vì chỉ dùng hashtag generic.',
          'Deploy 28-day centered rolling Z-scores instead of global metrics to remove trend artifacts; enforce a >=20 session threshold for creator rankings with P99 Winsorization on skewed metrics; mandate specific product hashtags across video metadata.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 6)', 'SQL (Stage 6)'), code: sqlSnippets.s6 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage6TextAndAnomalies />
        </div>
      </UnifiedSection>

      {/* Giai đoạn 7: Kiến Trúc ETL, Tự Động Hóa & Tuân Thủ PII */}
      <UnifiedSection
        id="sec-stage-7-etl-pii"
        badge="7"
        title={L(
          'Mục 7: Kiến Trúc ETL, Tự Động Hóa & Tuân Thủ PII (ETL Pipeline & Data Governance)',
          'Section 7: ETL Architecture, Automation & PII Compliance (Data Governance)',
        )}
        takeaway={L(
          'Thiết kế pipeline ETL 3 lớp (raw → staging → mart) có khả năng tái lập tự động từ 8 tệp xlsx của FastMoss qua một lệnh duy nhất. Hệ thống thiết lập 8 cổng kiểm tra chất lượng dữ liệu (Data Quality Gates) với mức cảnh báo error/warn nghiêm ngặt, tự động đối soát chuỗi 180 ngày và khớp 100% doanh số 12,735 tỷ đ. Tuân thủ nghiêm ngặt Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 356/2025/NĐ-CP (có hiệu lực từ 01/01/2026): áp dụng thuật toán Salted SHA-256 bí danh hóa creator_id, làm tròn dải GMV/follower cho bản công khai, và thiết lập vùng cách ly PII riêng biệt.',
          'Engineered reproducible 3-tier ETL pipeline (raw → staging → mart) executing across 8 FastMoss xlsx exports via a single automated runner. Implemented 8 rigorous Data Quality Gates (error/warn severity) verifying 180 continuous days and matching 100% of 12.735B VND GMV. Full compliance with Vietnam Personal Data Protection Law 2025 and Decree 356/2025/NĐ-CP (effective Jan 1, 2026): applies Salted SHA-256 pseudonymization on creator handles, bucketizes GMV/followers for public release, and enforces air-gapped PII isolation.',
        )}
        kpis={[
          {
            value: '8/8 Cổng Đạt',
            label: L('cổng kiểm tra chất lượng tự động', 'automated quality gates passed'),
            sub: L('5 cổng error (chặn) + 3 cổng warn (cảnh báo)', '5 error gates (halt) + 3 warn gates (alert)'),
          },
          {
            value: 'Salted SHA-256',
            label: L('chuẩn bí danh hóa PII creator', 'creator handle pseudonymization'),
            sub: L('Luật BV Dữ liệu cá nhân & NĐ 356/2025/NĐ-CP', 'Vietnam PDP Law & Decree 356/2025/NĐ-CP'),
            tone: 'amber',
          },
          {
            value: '100% Tự Động Hóa',
            label: L('tái lập trọn vẹn từ tệp thô', 'reproducible from raw xlsx'),
            sub: L('Không can thiệp thủ công (Zero manual touch)', 'Zero manual spreadsheet overrides'),
          },
        ]}
        finding={L(
          'Dữ liệu nguồn xuất từ FastMoss không chứa thông tin người mua (P2C) nhưng chứa thông tin định danh cá nhân của 5.713 creator (username, handle, follower, doanh số cá nhân). Mọi con số trong báo cáo đều được biên dịch tự động qua script Python/SQL với mã truy vấn định danh rõ ràng, loại bỏ hoàn toàn các sai số chủ quan từ việc đọc màn hình dashboard cũ.',
          'Raw FastMoss exports lack consumer PII (P2C) but contain personal identifiers for 5,713 creators (usernames, handles, follower counts, individual GMV). Every analytical metric is generated deterministically via auditable Python/SQL pipelines with query signatures, eliminating subjective manual dashboard transcription errors.',
        )}
        action={L(
          'Tách biệt hai phiên bản đầu ra: Bản riêng (Private Enterprise) lưu trữ nội bộ và bản công khai (Public Portfolio) đã qua quy trình bí danh hóa SHA-256 + băm dải doanh thu/follower; commit .gitignore loại trừ toàn bộ file xlsx gốc và bảo mật chuỗi Salt ngoài môi trường code.',
          'Enforce strict dual-artifact release: Private Enterprise version for internal shop records and an Anonymized Public Portfolio with Salted SHA-256 handles and bucketized stats; commit .gitignore exclusion for raw xlsx files and keep cryptographic salts in secure environment variables.',
        )}
        codePeek={{ label: L('SQL (Giai đoạn 7)', 'SQL (Stage 7)'), code: sqlSnippets.s7 }}
      >
        <div className="lg:col-span-2 w-full">
          <Stage7EtlAutomationAndPii />
        </div>
      </UnifiedSection>
    </div>
  );
}
