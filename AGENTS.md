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

2. **UI/UX Pro Max Checklist**:
   - Strictly SVG icons (Lucide React), never raw emojis as UI icons.
   - Clickable targets meet 44×44px minimum touch size with `cursor-pointer`.
   - Text contrast maintains 4.5:1 minimum (WCAG AA).
   - Smooth 150-300ms transitions with easing.
   - Responsive layouts without horizontal scrolling (375px to 1440px).

