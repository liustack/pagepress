# Design Principles for Visual Assets

> [!IMPORTANT]
> These principles guide the AI Agent in producing high-quality visual assets. Apply them alongside **color-theory.md** for a complete design foundation.

## Typographic Scale

### Modular Scale Ratios

Choose a ratio based on the design context:

| Ratio | Name | Best For |
|-------|------|----------|
| **1.200** | Minor Third | Compact layouts, infographics, data-dense content |
| **1.250** | Major Second | Body-heavy content, reports, readable documents |
| **1.333** | Perfect Fourth | General purpose, balanced hierarchy |
| **1.618** | Golden Ratio | Hero sections, posters, banners with dramatic contrast |

Given a base size (e.g., 16px), multiply up for headings and divide down for small text:

```css
:root {
  --scale-ratio: 1.333;
  --text-xs: calc(1rem / var(--scale-ratio));                                   /* ~12px */
  --text-sm: calc(1rem / sqrt(var(--scale-ratio)));                             /* ~14px */
  --text-base: 1rem;                                                            /* 16px */
  --text-lg: calc(1rem * var(--scale-ratio));                                   /* ~21px */
  --text-xl: calc(1rem * var(--scale-ratio) * var(--scale-ratio));              /* ~28px */
  --text-2xl: calc(1rem * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio)); /* ~38px */
}
```

### Typography Rules

| Property | Body Text | Headings | Captions / Labels |
|----------|-----------|----------|-------------------|
| **Line height** | 1.5 - 1.75 | 1.1 - 1.3 | 1.3 - 1.5 |
| **Line width** | 45-75 characters (CJK: 25-35) | No limit | Short, single-line |
| **Font weight** | Regular (400) | Bold (700) or Semibold (600) | Regular or Medium (500) |
| **Letter spacing** | Normal | -0.01em to -0.02em (tighten) | +0.02em to +0.05em (widen) |

### Constraints

> [!CAUTION]
> - **Maximum 2 font families** per design (one for headings, one for body; or a single family for both)
> - **Maximum 3 font weights** (e.g., Regular, Semibold, Bold)
> - Paragraph spacing should equal or exceed the line height

## Visual Hierarchy & Gestalt Principles

### Hierarchy Tools

The eye is drawn to elements in this priority order:

| Priority | Tool | How to Apply |
|----------|------|-------------|
| 1 | **Size** | Primary heading >= 2x body text size |
| 2 | **Color / Contrast** | Key elements use the accent color; muted elements use neutral |
| 3 | **Weight** | Bold for emphasis; avoid overuse (if everything is bold, nothing is) |
| 4 | **Spacing** | More whitespace around important elements isolates and elevates them |
| 5 | **Position** | Top-left (LTR) or top-center gets seen first |

### Scanning Patterns

| Pattern | Shape | When to Use |
|---------|-------|-------------|
| **F-pattern** | Two horizontal sweeps then vertical scan down left | Information-dense layouts: infographics, data tables, article-style content |
| **Z-pattern** | Top-left → top-right → bottom-left → bottom-right | Minimal layouts: OG cards, posters, banners, landing sections |

Place the most important content (headline, key stat) at the first fixation point of the applicable pattern.

### Gestalt Principles

| Principle | Description | Design Application |
|-----------|-------------|-------------------|
| **Proximity** | Elements close together are perceived as a group | Group related items with tight spacing; separate unrelated items with wide gaps |
| **Similarity** | Elements sharing visual traits (color, shape, size) are perceived as related | Use consistent styling for items of the same category |
| **Continuity** | The eye follows smooth lines and curves | Align elements along a clear axis or path; use grid lines |
| **Closure** | The mind completes incomplete shapes | Implied containers work without visible borders |
| **Figure-Ground** | The eye separates foreground from background | Ensure clear contrast between content (figure) and background (ground) |
| **Common Fate** | Elements moving or pointing in the same direction are grouped | Arrows, gradients, and directional cues unify sections |
| **Symmetry** | Symmetrical elements are perceived as unified wholes | Center-aligned layouts feel stable and formal; asymmetry creates energy |

## Japanese Design Aesthetics

### Ma (間) — Meaningful Emptiness

Whitespace is not "nothing" — it is an active compositional element that gives content room to breathe and meaning to emerge.

- **Spacing as content**: treat margins and padding as deliberate design choices, not leftovers
- **Generous margins**: outer margins >= 10% of the canvas width
- **Element isolation**: key elements surrounded by empty space gain visual weight without needing to be larger

Best for: posters, banners, OG cards — any design where a single message needs to land.

### Wabi-sabi — The Beauty of Restraint

Embrace imperfection and incompleteness. Resist the urge to fill every pixel.

- **Fewer elements, stronger impact**: remove until it breaks, then add one thing back
- **Subtle texture over flat color**: a slight noise or grain feels more human than pure flat
- **Asymmetric balance**: off-center placement creates visual interest without chaos

Best for: posters, brand visuals, editorial aesthetics.

### Hara's White (白) — White as Possibility

Kenya Hara's concept of "white" as a vessel that holds all potential. White is not empty — it is full of possibility.

- **White (or very light neutral) as the dominant surface**: let content define the visual, not the background
- **Minimal decoration**: the fewer decorative elements, the more the content itself becomes the design
- **Quietness over loudness**: if the design "shouts", it has too many elements

Best for: infographics, clean reports, minimal OG cards.

### Practical Rules

| Rule | Guideline |
|------|-----------|
| Minimum margin | >= 10% of canvas width on each side |
| Element count | Reduce until removing anything more would lose meaning |
| Background treatment | Prefer white / near-white / single muted tone |
| Decoration | Only if it serves comprehension, never for fill |

## Apple Design Philosophy (HIG Core)

### Three Pillars

| Pillar | Meaning | Application |
|--------|---------|-------------|
| **Clarity** | Text is readable, icons are precise, adornments are subtle and functional | Every element must be immediately understandable |
| **Deference** | Content is the priority; UI and decoration step back | Avoid heavy borders, gradients, or chrome that competes with content |
| **Depth** | Visual layers communicate hierarchy and context | Use subtle shadows, layering, or transparency to show relationships |

### Accessibility & Contrast

| Element | Minimum Contrast Ratio (WCAG 2.1 AA) |
|---------|--------------------------------------|
| Body text (< 18px / 14px bold) | **4.5 : 1** |
| Large text (>= 18px / 14px bold) | **3 : 1** |
| UI components and graphical objects | **3 : 1** |

### Whitespace

- Padding around content blocks should be **>= the size of the content's line height**
- Group spacing (between sections) should be **2-3x** the item spacing (within sections)
- When in doubt, add more space — overcrowded layouts feel low-quality

### Consistency

- Same visual treatment for same semantic role (all headings look alike, all captions look alike)
- Alignment to a single grid throughout the entire design
- One visual language: do not mix rounded and sharp corners, thick and thin borders, serif and sans-serif arbitrarily

## Design Checklist (AI Agent Self-Review)

Before finalizing any visual asset, verify:

| # | Check | Source |
|---|-------|--------|
| 1 | Heading is >= 2x body text size? | Visual Hierarchy |
| 2 | Maximum 2 font families, 3 weights? | Typographic Scale |
| 3 | Line width 45-75 characters (CJK 25-35)? | Typographic Scale |
| 4 | Text contrast >= 4.5:1 (body) / 3:1 (large)? | Apple HIG / WCAG |
| 5 | Whitespace >= element line height as padding? | Apple HIG |
| 6 | Content follows F or Z scanning pattern? | Gestalt |
| 7 | Related items grouped by proximity? | Gestalt Proximity |
| 8 | Margins >= 10% of canvas width? | Japanese Aesthetics |
| 9 | Every visual element serves a function? | Wabi-sabi |
| 10 | One consistent visual language throughout? | Apple Consistency |
