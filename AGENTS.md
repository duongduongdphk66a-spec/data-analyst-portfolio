# AGENTS Guidelines for Data Analyst Portfolio

This repository uses the **Humanizer** writing standards (based on [blader/humanizer](https://github.com/blader/humanizer) and Wikipedia's *Signs of AI Writing*).

When generating, editing, or reviewing prose in this repository (documentation, README, case studies, commit messages, PR descriptions, or UI text), adhere to the following rules:

## Core Writing Rules

1. **State facts directly without staging**:
   - Avoid "Not X but Y" / "It's not just X, it's Y" contrasts (§1).
   - Cut dramatic one-line closers and restatements like "Let that sink in" or "That is the real win" (§2).
   - Eliminate faux-philosophical aphorisms like "At its core", "fundamentally", or "X is the language of Y" (§3).
   - Remove staged run-ups like "Let's dive in", "Here's what you need to know", or "Honestly?" (§4).
   - Do not answer unraised objections or fake alternative approaches (§5).

2. **Rhythm and Natural Punctuation**:
   - Do not force lists or examples into groups of three (triads) unless the facts genuinely require three items (§6).
   - Avoid excessive em dashes (`—`) or en dashes (`–`). Use periods, commas, colons, or parentheses (§8).
   - Use active voice and name actors when helpful (§11).

3. **Avoid Buzzwords & Inflated Claims**:
   - Avoid AI stock words: *delve*, *testament*, *landscape*, *pivotal*, *showcase*, *robust*, *tapestry*, *intricate*, *underscores* (§12).
   - State what happened without declaring it a "pivotal milestone" or predicting "a bright future" (§13).
   - Avoid promotional/marketing fluff: *nestled*, *groundbreaking*, *breathtaking*, *stunning*, *world-class* (§16).
   - Use simple verbs (*is*, *are*, *has*) instead of *serves as*, *boasts*, or *features* (§18).

4. **Clean Formatting**:
   - Do not apply bold as routine decoration on every list item or word (§19).
   - Avoid decorative emojis on every heading or bullet point (§20).
   - Use sentence case for section headings where appropriate.

5. **Preserve Integrity**:
   - Keep all factual data, metrics, code blocks, URLs, schema fields, and technical names exact and unmodified.

## UI/UX Pro Max & Visual Standards

When implementing or refining interfaces, follow `ui-ux-pro-max` guidelines and the official 4-color palette:

1. **4-Color Palette Foundation**:
   - Primary Cyan: `#9BE7FA` (hero accents, primary actions, active tabs)
   - Ice Light Tint: `#C8EEF7` (card borders, badge backgrounds, surface tint)
   - Soft Butter Gold: `#FFE485` (soft KPI highlights, secondary badges)
   - Amber Gold: `#FFD14C` (status indicators, spinners, key focal callouts)

2. **Semantic Metric & Data Indicators**:
   - **Positive Figures (Tích cực, tăng trưởng, dương)**: Use semantic green/emerald (`text-emerald-600 dark:text-emerald-400`, `bg-emerald-500/10`) or Cyan (`#0D7287` / `#9BE7FA`) to highlight upward deltas (e.g. `+24%`, growth, targets met).
   - **Negative Figures (Tiêu cực, sụt giảm, âm)**: Use semantic red/rose (`text-rose-600 dark:text-rose-400`, `bg-rose-500/10`, `fill-rose-500`) to highlight drops, deficits, and alerts (e.g. `-18%`, churn, pandemic troughs).
   - **Neutral / Baseline Figures**: Use Slates (`text-slate-900 dark:text-white` or `text-slate-500 dark:text-slate-400`).

3. **Data Visualization & Chart Color Harmony**:
   - Charts (Recharts, SVG sparklines, multi-series bar/line/area charts, heatmaps) may use categorical and comparative color palettes beyond the 4 core colors (e.g. Emerald, Rose, Indigo, Teal, Amber, Violet) to clearly distinguish distinct data categories and series.
   - Maintain visual harmony with the portfolio base palette: avoid harsh neon or muddy clashes, balance saturation and lightness, and maintain at least 4.5:1 text/element contrast (WCAG AA).

4. **UI/UX Pro Max Checklist**:
   - Strictly SVG icons (Lucide React), never raw emojis as UI icons.
   - Clickable targets meet 44×44px minimum touch size with `cursor-pointer`.
   - Text contrast maintains 4.5:1 minimum (WCAG AA).
   - Smooth 150-300ms transitions with easing.
   - Responsive layouts without horizontal scrolling (375px to 1440px).

## Taste & Anti-Slop Art Direction

Follow design standards to eliminate generic AI styling patterns:

1. **Anti-Slop Visual Rules**:
   - Do not use decorative index numbering (`01`, `02`, `03`) as filler ornament.
   - Do not add uppercase tracking-spaced kicker labels ("EYEBROW / PRETITLE") above headings unless semantically required.
   - Avoid generic indigo/violet AI gradient fills and gradient text (`bg-clip-text`). Use solid brand tones.
   - Avoid resting shadows on flat surfaces (`shadow-sm`, `shadow-xl`). Rest elements on clean surfaces; reserve elevation for floating overlays (drawers, modals, sticky headers).
   - Prefer whitespace and tonal surfaces over 1px hairline divider borders (`<hr>`, `border-t`, `divide-y`).
   - Limit backdrop blurs to one sticky bar at most; avoid glassmorphism cards.

2. **Typography & Layout**:
   - Headlines need presence and intentional scale with tight tracking (`tracking-tight`) and balanced wrap (`text-wrap: balance`).
   - Use tabular numbers (`tabular-nums`) for metrics, data points, and tables.
   - Restrict paragraph width to readable bounds (`max-w-prose` or ~65 characters).
   - Use viewport-safe mobile sizing (`min-h-[100dvh]` or `100svh`, avoiding `100vh`).
   - Target properties explicitly in transitions (e.g. `transition-transform transition-opacity`) rather than blanket `transition-all`.

