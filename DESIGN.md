# Design Brief

## Direction

Institutional Clarity — Premium admin dashboard for fee management that balances sophistication with operational clarity, earning institutional trust through refined surface hierarchy and intentional data presentation.

## Tone

Refined minimalism with administrative authority — editorial-like data layout that feels credible yet approachable, never austere.

## Differentiation

Intentional structural zone separation with card-based surface treatments — data tables designed for scannability with subtle depth through consistent shadow hierarchy.

## Color Palette

| Token          | OKLCH           | Role                           |
| -------------- | --------------- | ------------------------------ |
| background     | 0.98 0.006 230  | Light off-white, spacious      |
| foreground     | 0.16 0.012 240  | Deep blue-grey text            |
| card           | 1.0 0.003 230   | Pure white content surface     |
| primary        | 0.45 0.18 240   | Deep ocean blue, trustworthy   |
| accent         | 0.72 0.18 70    | Warm amber, success/highlights |
| muted          | 0.92 0.008 230  | Light grey, inactive states    |
| destructive    | 0.55 0.22 25    | Red, warnings/deletions        |

## Typography

- Display: Space Grotesk — confident, modern headings and section titles
- Body: General Sans — clean, institutional UI labels and table copy
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-4xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Consistent shadow hierarchy: card (0.06 opacity, subtle), elevated (0.08 opacity, depth). Only applied to cards and floating elements — never on page sections.

## Structural Zones

| Zone    | Background                    | Border                  | Notes                                      |
| ------- | ----------------------------- | ----------------------- | ------------------------------------------ |
| Header  | primary (0.45 L 240 H) card   | none                    | Dark blue header, white text, logo left    |
| Sidebar | sidebar (0.95 L 230 H)        | sidebar-border (subtle) | Navigation with primary accent on active   |
| Content | background (0.98 L 230 H)     | —                       | Light spacious background                  |
| Cards   | card (1.0 L pure white)       | border (0.89 L)         | White surfaces with subtle top/bottom edge |
| Footer  | background (0.98 L 230 H)     | border-t (0.89 L)       | Light grey border, left-aligned text       |

## Spacing & Rhythm

Large section gaps (2rem–3rem) create visual breathing room between fee management zones. Content groups within sections use 1.5rem–2rem. Micro-spacing (0.5rem–1rem) clusters related UI elements.

## Component Patterns

- Buttons: rounded-lg, primary blue bg, white text; hover darkens (0.35 L), active state uses ring
- Cards: rounded-lg, white bg (1.0 L), shadow-card, subtle border-bottom (0.89 L border)
- Tables: border-collapse, striped rows (alt: bg-muted/30), header bold with text-label, footer summary row
- Badges: rounded-full for success (amber 0.72 L), muted for inactive, destructive (red 0.55 L) for overdue

## Motion

Entrance: card fade-in (0.3s ease-out) on page load. Hover: buttons + interactive elements use transition-smooth (0.3s cubic-bezier). Decorative: none (productivity context).

## Constraints

- No full-page gradients or decorative elements
- Data density prioritized — maximize table row height and column width for readability
- Shadow applied only to floating/card elements, never page sections
- Charts use chart-1 through chart-5 tokens for consistency

## Signature Detail

Blue-amber duality: deep professional blue for authority and action (buttons, headers, primary) paired with warm amber for human elements (success states, highlights) — reflecting institutional precision tempered by institutional care for students.
