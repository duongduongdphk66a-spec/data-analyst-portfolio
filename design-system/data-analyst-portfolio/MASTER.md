# Design System Master File: Data Analyst Portfolio

> **SOURCE OF TRUTH**: This document defines the design tokens, color hierarchy, typography, components, and UX heuristics for the Data Analyst Portfolio, synthesized according to the **UI/UX Pro Max** framework ([github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)).
> Page-specific overrides can be defined in `design-system/data-analyst-portfolio/pages/[page-name].md`.

---

## 1. Brand Identity & Color System (60-30-10 Rule)

The design system is grounded in the curated 4-color palette provided for this portfolio, with **`#9BE7FA` as the Dominant Primary Color**, supplemented with rigorous accessibility contrast anchors (WCAG 2.2 AA compliant).

### Official 4-Color Palette

| Role | Color Name | Hex Code | Purpose & Semantic Application |
|---|---|---|---|
| **Dominant Primary** | **Sky Blue Vivid** | `#9BE7FA` | Primary brand identity, Primary CTA buttons (`.btn-primary`), Bento card active borders, progress indicators, Recharts Series 1, tag pills, active tab border, focus rings (`:focus-visible`). |
| **Surface Wash & Secondary** | **Soft Ice Blue** | `#C8EEF7` | Card surface tint, KPI proof box background, subtle borders, hover highlights, table alternating rows, modal backdrop tints. |
| **Accent 1 (Pastel)** | **Pastel Sunlight** | `#FFE485` | Warm gold balance, string syntax in SQL runner, secondary chart series, tooltip highlights, subtle progress tags. |
| **Accent 2 (Vibrant Amber)** | **Honey Gold Accent** | `#FFD14C` | Secondary accent buttons (`.btn-primary-gold`), metric stars, active indicator pulse, key conversion actions. |

### Supporting Contrast & Base Colors (WCAG 2.2 AA Anchors)

| Role | Hex Code | Light Mode Usage | Dark Mode Usage |
|---|---|---|---|
| **Deep Contrast Anchor** | `#074553` / `#0D7287` | Interactive text links, icon emphasis, high-contrast borders | Mapped to `#9BE7FA` for dark mode visibility |
| **Canvas / Ground** | `#FAFDFE` / `#0B0F17` | Clean ice-white backdrop | Deep obsidian night backdrop |
| **Surface / Card** | `#FFFFFF` / `#131E2E` | Pure crisp card backdrop | Deep slate-navy surface |
| **Ink / Primary Text** | `#0F172A` / `#F8FAFC` | High-contrast dark slate body (14:1) | Crisp silver white (15:1) |
| **Ink Secondary** | `#475569` / `#CBD5E1` | Muted descriptions (7:1) | Soft slate secondary (8:1) |
| **Border Subtle** | `#E2F1F8` / `#1E2B3E` | 1px hairline card borders | 1px dark slate borders |

### Strict Contrast Rules (No White Text on Pastels)
- **CRITICAL**: Never place white text on `#9BE7FA`, `#C8EEF7`, `#FFE485`, or `#FFD14C`.
- Always use dark slate ink (`#0F172A` / `text-slate-950`) on buttons and badges styled with `#9BE7FA`, `#FFD14C`, or `#FFE485`.

---

## 2. Typography & Tabular Figures

- **UI / Headings**: `Plus Jakarta Sans` / `Inter`, geometric, modern, tracking `-0.02em` for tight visual authority.
- **Data & Numbers**: `JetBrains Mono` / `Fira Code` with `font-variant-numeric: tabular-nums lining-nums` (`.tabular-data`) ensuring all numeric figures in KPI cards, tables, and charts align precisely without jitter.
- **Code & SQL**: `JetBrains Mono` with syntax highlighting (Cyan `#9BE7FA` keywords, Gold `#FFD14C` functions, Cream `#FFE485` strings).

---

## 3. Layout Architecture: Bento Box Grid

- **Modular Asymmetry**: Cards structured in 1x1, 2x1, and 2x2 spans with `gap-6` (24px) spacing.
- **Corner Radii**: Consistent `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for inner controls and inputs, `rounded-full` for chips and pills.
- **Depth & Shadows**: Subtle ambient multi-stop shadows (`0 4px 20px -2px rgba(15, 23, 42, 0.05)`) with 1px border (`border-[#9BE7FA]/30` on hover).
- **Hover Micro-interactions**: Smooth scale lift (`hover:scale-[1.015]`), transition duration 200–250ms with `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 4. Component Design Specifications

### Dominant Primary CTA Button (`.btn-primary`)
```css
background-color: #9BE7FA;
color: #0F172A; /* Slate 950 for 12:1 contrast */
```
font-weight: 700;
border-radius: 0.75rem; /* 12px */
padding: 0.75rem 1.5rem;
box-shadow: 0 2px 8px rgba(255, 209, 76, 0.25);
transition: transform 160ms var(--ease-out), background-color 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
```
*Hover state: `background-color: #FFE485; transform: translateY(-1px);`*
*Active state: `transform: scale(0.97);`*

### Secondary / Ghost Button
```css
border: 1px solid #C8EEF7;
color: #0F172A;
background: rgba(255, 255, 255, 0.8);
```
*Dark mode: `border-color: #1E2B3E; color: #F8FAFC; background: rgba(19, 30, 46, 0.8);`*

### Tag Pills & Badges
- **Cyan Tag**: `background: rgba(200, 238, 247, 0.5); border: 1px solid rgba(155, 231, 250, 0.8); color: #0D7287; font-weight: 600;`
- **Gold Star Badge**: `background: #FFD14C; color: #020617; font-weight: 700;`

### Interactive SQL Runner Panel
- **Frame**: Deep navy/slate background (`#0F172A`), 1px border (`#9BE7FA`/30).
- **Header**: Action bar with scenario selector and Run button (`#FFD14C`).
- **Code Area**: JetBrains Mono with cyan keywords (`#9BE7FA`), white identifiers (`#F8FAFC`), and gold strings (`#FFE485`).

### Recharts Visualization Palette
- **Series 1 (Primary Flow / Inbound / Revenue)**: `#9BE7FA`
- **Series 2 (Secondary / Profit / Paid Channels)**: `#FFD14C`
- **Series 3 (Tertiary / Referrals / Targets)**: `#FFE485`

---

## 5. Motion & Accessibility Checklist

- [x] No emoji icons used for system controls (Lucide SVG vector icons exclusively with 1.5–2px stroke).
- [x] `cursor-pointer` explicitly added to all clickable elements.
- [x] Text contrast >= 4.5:1 on body text; >= 3:1 on large text and UI borders.
- [x] `prefers-reduced-motion` media query respected across GSAP timelines and CSS animations.
- [x] Visible focus rings (`outline: 2px solid #9BE7FA; outline-offset: 2px`) for keyboard navigation.
- [x] Fluid responsiveness tested from 375px (mobile) to 1440px (desktop).

---

## 6. Taste Skill Anti-Slop Frontend Framework Integration

Integrated from **Taste Skill** ([github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)) as a persistent agent skill at `.agents/skills/taste-skill/SKILL.md`.

### A. Design Read (Brief Inference)
> *"Reading this as: Data Analyst & BI Portfolio for hiring managers, recruiters, and leadership, with an evidence-based, clean Linear/Bento aesthetic, leaning toward Tailwind v4 utilities + Plus Jakarta Sans + JetBrains Mono tabular figures + restrained purposeful motion."*

### B. The Three Dials
- **`DESIGN_VARIANCE: 6`**: Structured, balanced asymmetry via Bento Grid without chaotic layout churn.
- **`MOTION_INTENSITY: 5`**: Purposeful micro-interactions with immediate visual feedback (`active:scale-[0.98]`) and full `prefers-reduced-motion` compliance.
- **`VISUAL_DENSITY: 4`**: Spacious, breathable layout allowing dense telemetry tables, interactive SQL query editors, and Recharts charts to be digested effortlessly.

### C. Anti-Tells & Hard Constraints
1. **Rule 9.G (Strict Em-Dash Ban)**: Zero em-dashes (`—`) in user-facing copy, headers, metadata, or tooltips. Replaced with colons, parentheses, periods, or standard hyphens (` - `).
2. **Rule 4.7 (Eyebrow Restraint)**: Maximum 1 eyebrow per 3 sections. Generic AI-generated tags (e.g., uppercase `ABOUT`, `EXPERIENCE`) removed above headlines.
3. **Rule 4.4 (Shape Consistency Lock)**: Strict radius hierarchy (`rounded-2xl` for container cards, `rounded-xl` for interactive buttons/inputs, `rounded-full` for chips/pills).
4. **Rule 4.5 & 4.7 (CTA Button Behavior & Viewport)**: Single-line CTA text on desktop, `:active` push-down (`scale-[0.97]`), and top padding capped at `py-16 md:py-24`.
5. **Rule 4.1 (Contrast & Color Anchoring)**: Preservation of the 4 brand colors (`#9BE7FA`, `#C8EEF7`, `#FFE485`, `#FFD14C`) paired with dark slate ink (`#0F172A`) for complete WCAG 2.2 AA compliance.

---

## 7. Emil Kowalski Design Engineering & Motion Standards (`emilkowalski/skills`)

Dự án áp dụng trọn vẹn triết lý **Design Engineering** và bộ quy chuẩn hoạt cảnh từ [emilkowalski/skills](https://github.com/emilkowalski/skills), định hướng bởi nguyên lý *"Unseen details compound into software that feels right"*.

### A. Bộ Kỹ Năng Đã Tích Hợp (`.agents/skills/`)
- **`emil-design-eng`**: Triết lý thiết kế kỹ thuật, kỷ luật chi tiết vô hình, bảng review Before/After bắt buộc.
- **`animate`**: Xây dựng chuyển động web từ đầu với Framer Motion / CSS / WAAPI, thứ tự quyết định chuẩn xác.
- **`review-animations`**: Bộ tiêu chuẩn thẩm định chuyển động (`STANDARDS.md`).
- **`improve-animations`**: Quy trình audit toàn diện chuyển động trong codebase.
- **`find-animation-opportunities`**: Tìm kiếm cơ hội chuyển động đắt giá, loại bỏ hiệu ứng rác/thừa.
- **`apple-design`**: Chuyển động vật lý, spring dynamics, tính nhất quán không gian chuẩn Apple trên nền web.
- **`ask-sonner`**: Tiêu chuẩn thiết kế toast notification (13M+ weekly downloads).
- **`animation-vocabulary`**, **`pick-ui-library`**, **`prototype`**.

### B. Motion Tokens & Easing Vật Lý (`globals.css`)
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* Strong ease-out for UI interactions */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* Strong ease-in-out for on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer curve */
```

### C. Bộ Quy Tắc Chuyển Động Cốt Lõi (Core Motion Heuristics)
1. **Never Animate Keyboard Actions**:
   - `CommandPalette` (`Ctrl+K`) và các hành động phím tắt không có animation trễ (0ms instant display - tiêu chuẩn Raycast).
2. **Sub-300ms Duration Rule**:
   - Mọi hoạt cảnh UI (`fadeInUp`, `fadeIn`, dropdowns, sheets) khống chế dưới 300ms (chuẩn 200–240ms với `--ease-out`).
   - Dịch chuyển tinh tế (10px–12px thay vì 24px–32px), bắt đầu từ `scale(0.98)` kết hợp opacity.
3. **Physical Entry & Scale Discipline**:
   - Tuyệt đối không dùng `scale(0)`. Mọi modal dialog (`AdminEditorModal`) bắt đầu từ `scale(0.95)` với `opacity: 0` và `origin-center`.
4. **Interactive Button Active Feedback**:
   - Phản hồi bấm tức thì: `:active { transform: scale(0.97); }` với `transition: transform 160ms var(--ease-out)`.
5. **No `transition: all`**:
   - Loại bỏ `transition: all` trên các phần tử tương tác quan trọng, chỉ áp dụng chuyển đổi trên các thuộc tính GPU-accelerated: `transform`, `opacity`, `background-color`, `box-shadow`, `border-color`.
6. **Stagger Interval Discipline**:
   - Thời gian chờ giữa các phần tử danh sách/timeline được rút ngắn xuống 40–50ms (không bao giờ vượt quá 80ms).
7. **Touch Screen Hover Isolation**:
   - Các hiệu ứng hover nâng bề mặt (`translateY(-1px)`, box-shadow lift) được cô lập trong `@media (hover: hover) and (pointer: fine)` để chống kẹt trạng thái trên thiết bị cảm ứng.
8. **Reduced Motion Accessibility**:
   - Triệt tiêu toàn bộ dịch chuyển không gian khi người dùng bật `prefers-reduced-motion: reduce`, chỉ duy trì fade mờ nhạt tối giản.


