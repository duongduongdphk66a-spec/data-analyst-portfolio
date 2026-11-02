# -*- coding: utf-8 -*-
import re

path = 'components/case-studies/kami-ely/commercial/Tier3EngineeringAppendix.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. State and toggling
old_decl = """export default function Tier3EngineeringAppendix({ onOpenNotebook }: Tier3EngineeringAppendixProps) {
  const { L, isEn } = usePlaybookLang();
  const [activeTab, setActiveTab] = useState<AppendixSection>('a-quality');
  const [sqlIdx, setSqlIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);"""

new_decl = """export default function Tier3EngineeringAppendix({ onOpenNotebook }: Tier3EngineeringAppendixProps) {
  const { L, isEn } = usePlaybookLang();
  const [openSection, setOpenSection] = useState<AppendixSection | null>(null);
  const [sqlIdx, setSqlIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    const handleOpen = () => setOpenSection('a-quality');
    const el = document.getElementById('sec-appendix');
    if (el) {
      el.addEventListener('kami-open-appendix', handleOpen);
      return () => el.removeEventListener('kami-open-appendix', handleOpen);
    }
  }, []);

  const toggleSection = (id: AppendixSection) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };"""

assert old_decl in text, "old_decl not found"
text = text.replace(old_decl, new_decl)

# 2. Add ChevronDown and ChevronUp import if needed
if 'ChevronDown' not in text:
    text = text.replace(
        "import {\n  ShieldCheck,",
        "import {\n  ChevronDown,\n  ChevronUp,\n  ShieldCheck,"
    )

# 3. Update rawToCleanRows Shop LIVE note
old_shop_live_note = """      noteVi: 'Khử trùng lặp theo session_id + row_hash. Con số 7.367 ở bản thảo cũ là số đếm trung gian trước khi deduplicate theo ca Live. 231 ngày gồm: 595 ca chính chủ + 261 ca vệ tinh @koc_sat01 + 7.499 ca 301 KOC khác.',
      noteEn: 'Deduplicated on session_id + row_hash. The 7,367 count in legacy drafts was an intermediate sum before session deduplication. 231d total: 595 official + 261 @koc_sat01 + 7,499 external lives.',"""

new_shop_live_note = """      noteVi: 'Khử trùng lặp theo session_id + row_hash. Dữ liệu thô FastMoss có 8.355 dòng; sau khử trùng lặp theo phiên vắt qua nhiều SKU còn đúng 7.046 phiên độc lập toàn shop (kỳ Hè) và 8.355 ca trong toàn bộ chu kỳ 231 ngày (595 ca chính chủ + 261 ca vệ tinh @koc_sat01 + 7.499 ca affiliate khác). Bảng kami_store_daily_overview ghi nhận tổng cộng 8.403 ca Live do cộng dồn delta hằng ngày của nền tảng (chênh 48 ca cập nhật sau phiên).',
      noteEn: 'Deduplicated on session_id + row_hash. Raw exports hold 8,355 rows; session deduplication yields 7,046 summer sessions and 8,355 full-period lives (595 official + 261 satellite + 7,499 external). Store daily overview logs 8,403 cumulative daily delta increments (48 platform delay delta).',"""

assert old_shop_live_note in text, "old_shop_live_note not found"
text = text.replace(old_shop_live_note, new_shop_live_note)

# 4. Update Table A1 column widths
old_table_headers = """                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-bold rounded-tl-xl">{L('Nguồn dữ liệu', 'Source entity')}</th>
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">{L('Dòng thô (Raw)', 'Raw count')}</th>
                  <th className="py-2.5 px-3 font-bold whitespace-nowrap">{L('Sau làm sạch (Cleaned)', 'Cleaned count')}</th>
                  <th className="py-2.5 px-3 font-bold rounded-tr-xl">{L('Ghi chú xử lý & đối soát', 'Reconciliation notes')}</th>
                </tr>"""

new_table_headers = """                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-bold w-[20%] rounded-tl-xl">{L('Nguồn dữ liệu', 'Source entity')}</th>
                  <th className="py-2.5 px-3 font-bold w-[12%] whitespace-nowrap">{L('Dòng thô (Raw)', 'Raw count')}</th>
                  <th className="py-2.5 px-3 font-bold w-[16%] whitespace-nowrap">{L('Sau làm sạch (Cleaned)', 'Cleaned count')}</th>
                  <th className="py-2.5 px-3 font-bold w-[52%] min-w-[320px] rounded-tr-xl">{L('Ghi chú xử lý & đối soát', 'Reconciliation notes')}</th>
                </tr>"""

assert old_table_headers in text, "old_table_headers not found"
text = text.replace(old_table_headers, new_table_headers)

# 5. Update Dead Cross limitation and 4-crossover audit
old_dead_cross = """    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Giao cắt Dead Cross (26/06) chỉ xảy ra 1 lần, nhạy với điểm ngoại lai ngày 16/06 (315,0 Tr đ).',
      limitEn: 'Dead Cross (26/06) occurred once and followed the 16/06 outlier spike (315.0M VND).',
      impactVi: 'Có thể phản ánh hiện tượng rơi kỹ thuật sau một ca Live đột biến hơn là chu kỳ gãy cầu.',
      impactEn: 'May reflect technical post-outlier decay rather than a genuine demand collapse.',
      solutionVi: 'Kiểm chứng Winsorize ở P99/P95 (vẫn giữ ngày 26/06) và chỉ dùng làm tín hiệu theo dõi.',
      solutionEn: 'Winsorize at P99/P95 (date holds at 26/06) and track as a monitoring signal.',
    },"""

new_dead_cross = """    {
      groupVi: 'Phương pháp',
      groupEn: 'Method',
      limitVi: 'Giao cắt MA7 cắt xuống MA28 xuất hiện 4 lần trong 231 ngày (29/04, 04/06, 26/06, 22/10). Hai lần đầu là báo động giả; ngày 26/06 là tín hiệu thật dẫn trước đợt sụt đáy T8 18 ngày.',
      limitEn: 'MA7 crossed below MA28 four times across 231d (29/04, 04/06, 26/06, 22/10). The first two were false alarms; 26/06 was the true signal preceding the August collapse by 18 days.',
      impactVi: 'Tín hiệu kỹ thuật chưa qua backtest đa chu kỳ năm (chỉ có 1 mùa hè 2026), có thể phát tín hiệu sai trong giai đoạn shop đang mở rộng.',
      impactEn: 'Lacks multi-year backtesting (single 2026 season observed), producing false positives during rapid expansion phases.',
      solutionVi: 'Trình bày bảng kiểm định 4 lần giao cắt (C1.1); chỉ dùng làm tín hiệu cảnh báo vận hành, không làm căn cứ ra quyết định tự động.',
      solutionEn: 'Present the 4-crossover audit table (C1.1); treat as an operational alert rather than an automated decision rule.',
    },"""

assert old_dead_cross in text, "old_dead_cross not found"
text = text.replace(old_dead_cross, new_dead_cross)

# 6. Update Legal citation to Decree 356/2025/ND-CP
old_legal = """    {
      groupVi: 'Pháp lý',
      groupEn: 'Legal',
      limitVi: 'Handle của KOC là định danh công khai trên TikTok; băm Salted SHA-256 là giả danh hóa (Pseudonymization).',
      limitEn: 'Creator handles are public TikTok identifiers; Salted SHA-256 hashing is pseudonymization, not absolute anonymization.',
      impactVi: 'Nếu có dữ liệu đối chiếu chéo công khai vẫn có xác suất suy luận ngược danh tính.',
      impactEn: 'Indirect re-identification remains possible via public cross-referencing.',
      solutionVi: 'Dùng mã ẩn nhất quán (@koc_sat01, @koc_ext02), lưu khóa muối cục bộ, tuân thủ NĐ 13/2023/NĐ-CP.',
      solutionEn: 'Use deterministic aliases, isolate cryptographic salts, and align with Decree 13/2023.',
    },"""

new_legal = """    {
      groupVi: 'Pháp lý',
      groupEn: 'Legal',
      limitVi: 'Handle của KOC là định danh công khai trên TikTok; băm Salted SHA-256 là giả danh hóa (Pseudonymization).',
      limitEn: 'Creator handles are public TikTok identifiers; Salted SHA-256 hashing is pseudonymization, not absolute anonymization.',
      impactVi: 'Nếu có dữ liệu đối chiếu chéo công khai vẫn có xác suất suy luận ngược danh tính.',
      impactEn: 'Indirect re-identification remains possible via public cross-referencing.',
      solutionVi: 'Dùng mã ẩn nhất quán (@koc_sat01, @koc_vid01), lưu muối cục bộ, tuân thủ Nghị định 356/2025/NĐ-CP (có hiệu lực 01/01/2026 thay thế NĐ 13/2023).',
      solutionEn: 'Deterministic aliases, isolated salt, aligned with Decree 356/2025/ND-CP (effective Jan 1, 2026, replacing Decree 13/2023).',
    },"""

assert old_legal in text, "old_legal not found"
text = text.replace(old_legal, new_legal)

# 7. Add 4-crossover audit data to Appendix C
audit_table_code = """
        {/* C1.1. Bảng kiểm chứng 4 lần giao cắt MA7 < MA28 */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {L('C1.1. Bảng kiểm chứng 4 lần giao cắt MA7 < MA28 trong chuỗi 231 ngày', 'C1.1. Audit of four MA7 < MA28 crossover events across 231 days')}
            </h4>
            <Chip tone="amber">{L('2 Báo động giả + 1 Tín hiệu thật + 1 Cuối kỳ', '2 False + 1 True + 1 End-of-window')}</Chip>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                  <th className="py-2.5 px-3 font-bold rounded-tl-xl">{L('Ngày giao cắt', 'Crossover date')}</th>
                  <th className="py-2.5 px-3 font-bold">{L('MA7 (Tr đ)', 'MA7 (M VND)')}</th>
                  <th className="py-2.5 px-3 font-bold">{L('MA28 (Tr đ)', 'MA28 (M VND)')}</th>
                  <th className="py-2.5 px-3 font-bold">{L('Phân loại tín hiệu', 'Signal class')}</th>
                  <th className="py-2.5 px-3 font-bold rounded-tr-xl">{L('Bối cảnh & Kiểm chứng thực tế', 'Context & Validation')}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                <tr className="border-t border-slate-100 dark:border-slate-800/60">
                  <td className="py-2.5 px-3 font-bold font-mono text-slate-900 dark:text-white">29/04/2026</td>
                  <td className="py-2.5 px-3">82,4 Tr</td>
                  <td className="py-2.5 px-3">83,1 Tr</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                      {L('Báo động giả (False alarm)', 'False alarm')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {L('Rung lắc ngắn trước kỳ nghỉ lễ 30/04; doanh thu hồi phục ngay sau đó và tăng tốc vào mùa hè.', 'Short pre-holiday dip; GMV recovered immediately and accelerated into summer.')}
                  </td>
                </tr>
                <tr className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-bold font-mono text-slate-900 dark:text-white">04/06/2026</td>
                  <td className="py-2.5 px-3">114,2 Tr</td>
                  <td className="py-2.5 px-3">115,0 Tr</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                      {L('Báo động giả (False alarm)', 'False alarm')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {L('Khoảng nghỉ kỹ thuật 4 ngày trước đợt Mega Sale hè; ngày đỉnh toàn shop 16/06 (315,0 Tr đ) xuất hiện sau đó 12 ngày.', 'Brief 4-day pause before summer mega sale; shop all-time peak (315M) followed 12 days later.')}
                  </td>
                </tr>
                <tr className="border-t border-slate-100 dark:border-slate-800/60 bg-emerald-50/20 dark:bg-emerald-950/15">
                  <td className="py-2.5 px-3 font-bold font-mono text-emerald-700 dark:text-emerald-300">26/06/2026</td>
                  <td className="py-2.5 px-3 font-bold text-rose-600">136,8 Tr</td>
                  <td className="py-2.5 px-3 font-bold">138,2 Tr</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                      {L('Tín hiệu thật (True signal)', 'True signal')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {L('MA7 tụt dốc liên tục sau đỉnh 16/06; phát tín hiệu sớm 18 ngày trước khi GMV lao dốc về đáy tháng 8 (-83%). Giữ vững khi Winsorize P99/P95.', 'MA7 decayed continuously post-peak; led the steep slide to August trough (-83%) by 18 days. Robust to P99/P95 winsorization.')}
                  </td>
                </tr>
                <tr className="border-t border-slate-100 dark:border-slate-800/60">
                  <td className="py-2.5 px-3 font-bold font-mono text-slate-900 dark:text-white">22/10/2026</td>
                  <td className="py-2.5 px-3">58,1 Tr</td>
                  <td className="py-2.5 px-3">59,4 Tr</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {L('Hết Mega Sale 10.10', 'Post 10.10 Sale')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {L('Hạ nhiệt tự nhiên sau đợt sale 10-15/10 (chiếm 41% GMV tháng 10); nằm sát ngày cuối cửa sổ quan sát (25/10).', 'Natural cooldown following the 10-15 Oct campaign (41% of Oct GMV); near the 25/10 cutoff.')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
"""

old_c1_block = """        {/* C1. Bảng 13 hạn chế */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {L('C1. Bảng ma trận 13 hạn chế dữ liệu & phương pháp', 'C1. Matrix of 13 data and methodological limitations')}
          </h4>"""

new_c1_block = audit_table_code + """
        {/* C1. Bảng 13 hạn chế */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {L('C1.2. Bảng ma trận 13 hạn chế dữ liệu & phương pháp', 'C1.2. Matrix of 13 data and methodological limitations')}
          </h4>"""

assert old_c1_block in text, "old_c1_block not found"
text = text.replace(old_c1_block, new_c1_block)

# 8. Accordion wrapper: convert section rendering to check openSection === 'a-quality' / 'b-sql' / 'c-limits'
old_sec_a_start = '<section id="sec-appendix-a" className="scroll-mt-28 space-y-6 pt-2">'
new_sec_a_start = '''<div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('a-quality')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA]">
                {L('Phụ lục A', 'Appendix A')}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                {L('Hồ sơ dữ liệu và chất lượng (A1 · A2 · A3 · A4)', 'Data profiling and quality audit (A1 · A2 · A3 · A4)')}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="emerald">{L('9/9 Cổng đạt', '9/9 Gates passed')}</Chip>
            {openSection === 'a-quality' ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </div>
        </button>
        {openSection === 'a-quality' && (
          <section id="sec-appendix-a" className="scroll-mt-28 space-y-6 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800">'''

assert old_sec_a_start in text, "old_sec_a_start not found"
text = text.replace(old_sec_a_start, new_sec_a_start)
text = text.replace("      </section>\n\n      {/* ========================================================================= */}\n      {/* PHỤ LỤC B:", "          </section>\n        )}\n      </div>\n\n      {/* ========================================================================= */}\n      {/* PHỤ LỤC B:")

old_sec_b_start = '<section id="sec-appendix-b" className="scroll-mt-28 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">'
new_sec_b_start = '''<div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('b-sql')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950">
              <Code2 className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA]">
                {L('Phụ lục B', 'Appendix B')}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                {L('Thư viện SQL theo chương & Kiến trúc Pipeline', 'Chapter SQL library & Pipeline architecture')}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">{L('6 Truy vấn chuẩn', '6 Standard queries')}</Chip>
            {openSection === 'b-sql' ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </div>
        </button>
        {openSection === 'b-sql' && (
          <section id="sec-appendix-b" className="scroll-mt-28 space-y-4 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800">'''

assert old_sec_b_start in text, "old_sec_b_start not found"
text = text.replace(old_sec_b_start, new_sec_b_start)
text = text.replace("      </section>\n\n      {/* ========================================================================= */}\n      {/* PHỤ LỤC C:", "          </section>\n        )}\n      </div>\n\n      {/* ========================================================================= */}\n      {/* PHỤ LỤC C:")

old_sec_c_start = '<section id="sec-appendix-c" className="scroll-mt-28 space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">'
new_sec_c_start = '''<div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('c-limits')}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {L('Phụ lục C', 'Appendix C')}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">
                {L('Hạn chế & giả định phương pháp luận', 'Methodological limitations & assumptions')}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="amber">{L('13 Hạn chế', '13 Limits')}</Chip>
            {openSection === 'c-limits' ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </div>
        </button>
        {openSection === 'c-limits' && (
          <section id="sec-appendix-c" className="scroll-mt-28 space-y-6 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800">'''

assert old_sec_c_start in text, "old_sec_c_start not found"
text = text.replace(old_sec_c_start, new_sec_c_start)
text = text.replace("      </section>\n    </section>", "          </section>\n        )}\n      </div>\n    </section>")

# 9. In Appendix B, add Pipeline architecture and pseudonymization box right above SQL library
pipeline_arch_code = """
        {/* Kiến trúc Pipeline 3 tầng & Bảo mật dữ liệu cá nhân NĐ 356/2025/NĐ-CP */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-black uppercase text-[#074553] dark:text-[#9BE7FA]">
                {L('Kiến trúc Pipeline ELT & Giả danh hóa KOC', 'ELT Pipeline Architecture & KOC Pseudonymization')}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {L('Quy trình 3 tầng: Dữ liệu thô FastMoss -> Staging chuẩn hóa -> Mart phân tích', '3-Tier Flow: Raw FastMoss -> Staging -> Business Marts')}
              </h4>
            </div>
            <a
              href="https://lsvn.vn/mot-so-thay-doi-can-luu-y-trong-xu-ly-du-lieu-ca-nhan-tu-01-01-2026-a167892.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D7287] hover:underline dark:text-[#9BE7FA]"
            >
              <span>Nghị định 356/2025/NĐ-CP</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">{L('Tầng 1: Raw Ingestion', 'Tier 1: Raw Ingestion')}</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {L('9 tệp Excel FastMoss (21.574 dòng thô). Lưu trữ bất biến (Immutable), giữ nguyên dấu thời gian và mã gốc.', '9 raw Excel files (21,574 rows). Stored immutably with raw UTC timestamps.')}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-[#9BE7FA]/60 bg-[#C8EEF7]/20 dark:border-slate-800 dark:bg-slate-900 space-y-1">
              <div className="font-bold text-[#074553] dark:text-[#9BE7FA]">{L('Tầng 2: Cleaned Staging', 'Tier 2: Cleaned Staging')}</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {L('Đồng bộ +13h về UTC+7; khử trùng khóa phức hợp; băm Salted SHA-256 handle KOC; dán nhãn is_partial_month.', 'Shifted +13h to UTC+7; composite deduping; Salted SHA-256 creator hashing.')}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">{L('Tầng 3: Business Marts', 'Tier 3: Business Marts')}</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {L('Bảng tổng hợp Mart SKU, Cohort KOC M0-M7, Time-Series 231 ngày; cấp dữ liệu cho Dashboard và mô hình OLS.', 'Marts for SKU Pareto, KOC Cohorts M0-M7, and Daily Time-Series serving frontend & OLS.')}
              </p>
            </div>
          </div>
        </div>
"""

old_b_desc = """        <div className="border-l-4 border-[#0D7287] pl-3.5 space-y-1">
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
        </div>"""

new_b_desc = old_b_desc + "\n" + pipeline_arch_code
assert old_b_desc in text, "old_b_desc not found"
text = text.replace(old_b_desc, new_b_desc)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully patched Tier3EngineeringAppendix.tsx")

