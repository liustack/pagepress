# Color Theory for Visual Assets

> [!IMPORTANT]
> **Always apply this guide** to every visual asset. When workspace brand colors exist, use them as the starting palette but still follow the rules below (60-30-10 ratio, 4-hue limit, harmony methods). When no brand colors exist, select from the Ready-to-Use Palettes.

## Core Constraint

> [!CAUTION]
> **Maximum 4 dominant hues** in any single design. Every color must serve a clear functional role. Colors without a purpose are noise.

## The 60-30-10 Rule

The classic proportion rule, originating from interior design:

| Proportion | Role | Usage |
|-----------|------|-------|
| **60%** | Dominant | Backgrounds, large surfaces |
| **30%** | Secondary | Cards, sections, supporting areas |
| **10%** | Accent | CTAs, highlights, key data points |

CSS custom properties example:

```css
:root {
  --color-dominant: hsl(220, 15%, 96%);   /* 60% - background */
  --color-secondary: hsl(220, 60%, 50%);  /* 30% - sections, cards */
  --color-accent: hsl(350, 80%, 55%);     /* 10% - highlights */
  --color-neutral: hsl(220, 10%, 30%);    /* text, borders */
}
```

## Color Roles

| Role | Purpose | Example |
|------|---------|---------|
| **Primary** | Brand identity, main actions | Hero backgrounds, primary buttons |
| **Secondary** | Supporting areas, contrast | Cards, sidebars, secondary buttons |
| **Accent** | Emphasis, call-to-action | CTA buttons, links, key stats |
| **Neutral** | Text, borders, subtle backgrounds | Body text, dividers, muted areas |
| **Semantic** | Status communication | Success (green), error (red), warning (amber), info (blue) |

Primary, Secondary, and Accent are the "dominant hues" subject to the 4-hue limit. Neutral and Semantic colors are functional and do not count toward this limit.

## Design Type Quick Reference

| Design Type | Recommended Hues | Flexibility | Core Strategy |
|-------------|-----------------|-------------|---------------|
| **Web / OG / Social Card** | 2-4 | Low | Brand consistency, high contrast in safe area |
| **Poster** | 1-4 | High | Visual impact, bold color usage |
| **Infographic** | 3-4 | Medium | Data readability, neutral color support |
| **Banner** | 2-3 | Medium | Large background + text contrast |

## Color Harmony Methods

Use HSL color space for predictable harmony relationships:

| Method | Hue Relationship | Best For |
|--------|-----------------|----------|
| **Analogous** | Base hue +/- 30 degrees | Calm, cohesive designs (banners, OG cards) |
| **Complementary** | Base hue + 180 degrees | High contrast, energetic designs (posters, CTAs) |
| **Triadic** | Base hue, +120, +240 degrees | Balanced variety (infographics with 3 categories) |
| **Split-complementary** | Base hue, +150, +210 degrees | Contrast with less tension than complementary |

Example - analogous scheme starting from blue:

```css
:root {
  --hue-base: 220;
  --color-primary: hsl(var(--hue-base), 60%, 50%);              /* blue */
  --color-secondary: hsl(calc(var(--hue-base) - 30), 50%, 55%); /* blue-violet */
  --color-accent: hsl(calc(var(--hue-base) + 30), 55%, 50%);    /* cyan-blue */
}
```

## Infographic & Data Visualization

Infographics encode data through color. Follow these principles:

- **Sequential data** (low to high): use lightness variations of a single hue (e.g., light blue to dark blue)
- **Categorical data** (distinct groups): use different hues with similar saturation and lightness, max 4 categories before using labels
- **Diverging data** (positive/negative): two hues at endpoints with a neutral midpoint (e.g., blue - gray - red)
- **Neutral background**: always use a neutral (white, light gray, or dark) background so data colors stand out
- **Annotation color**: reserve one muted neutral for labels, axis lines, and annotations

Reference: ColorBrewer (Cynthia Brewer) provides rigorously tested palettes for these three data-color types.

## Theoretical Foundations

| Theory | Core Insight | Design Implication |
|--------|-------------|-------------------|
| **Cognitive Load Theory** | Excessive visual elements increase extraneous cognitive load | Fewer colors = easier information processing |
| **Miller's Law (7 +/- 2)** | Working memory holds ~7 items | Color categories should stay well below this limit |
| **Gestalt Similarity Principle** | Same-colored elements are perceived as a group | Consistent color = consistent meaning; too many colors weaken grouping |
| **Tufte's Data-Ink Ratio** | Maximize data ink, minimize non-data ink | Colors should encode information, not decorate |
| **Healey (1996)** | Pre-attentive color discrimination works reliably for 5-8 hues | Upper bound for distinguishable colors without labels |
| **Color Harmony Theory** | Complementary, analogous, and triadic schemes create visual balance | Use established harmony methods rather than arbitrary color picks |

## AI Agent Decision Flow

```
1. Determine base colors:
   - Brand palette exists? -> Start from brand colors
   - User specified colors? -> Start from user colors
   - Neither? -> Pick a palette from Ready-to-Use Palettes below

2. Apply color theory (ALWAYS, regardless of step 1):
   a. Identify design type: og / poster / infographic / banner
   b. Pick hue count from Design Type Quick Reference
   c. Choose harmony method (analogous for calm, complementary for bold)
   d. Apply 60-30-10 ratio
   e. Verify: total dominant hues <= 4
```

## Ready-to-Use Palettes

> Curated from Dribbble trending shots, Awwwards-winning sites, and 2025-2026 design trend research.

### 1. Royal Noir — Black & Gold Luxury

Inspired by Clubroom Contrast trend and luxury branding (Awwwards). Complementary harmony.
Best for: posters, premium OG cards, event visuals.

```css
:root {
  --color-dominant: #0D0D0D;    /* rich black */
  --color-secondary: #1A1A1A;   /* charcoal */
  --color-accent: #D9B648;      /* antique gold */
  --color-neutral: #F7EBA5;     /* soft champagne text */
}
```

### 2. Luminous Tech — Neon on Dark

Inspired by Dribbble AI/SaaS dashboard trends and ProDesignSchool "Luminous Tech Neon". Complementary harmony (warm cyan vs deep violet).
Best for: tech OG cards, banners, SaaS visuals.

```css
:root {
  --color-dominant: #101014;    /* near-black */
  --color-secondary: #8A00FF;   /* electric violet */
  --color-accent: #00E8FF;      /* neon cyan */
  --color-neutral: #3B3B3D;     /* graphite text */
}
```

### 3. Elegant Green — Refined & Grounded

From Steph Corrigan's luxury branding palette #2. Analogous harmony (green-gold-cream).
Best for: business posters, brand banners, editorial.

```css
:root {
  --color-dominant: #192231;    /* midnight blue-black */
  --color-secondary: #404A42;   /* forest slate */
  --color-accent: #C0B283;      /* muted gold */
  --color-neutral: #F4F4F4;     /* cloud white text */
}
```

### 4. Earthbound Warmth — Organic & Natural

From ProDesignSchool 2026 trends and Dribbble nature aesthetics. Analogous harmony (terracotta-sage-linen).
Best for: infographics, lifestyle content, wellness.

```css
:root {
  --color-dominant: #F4EBD2;    /* warm linen */
  --color-secondary: #C18A63;   /* terracotta */
  --color-accent: #7E9C76;      /* sage green */
  --color-neutral: #4A3F36;     /* espresso text */
}
```

### 5. Arctic Frost — Minimal & Crisp

Inspired by Swiss minimalism and Pantone 2026 Cloud Dancer trend. Monochromatic + single accent.
Best for: infographics, reports, clean OG cards.

```css
:root {
  --color-dominant: #F0EEE9;    /* cloud base */
  --color-secondary: #819FA7;   /* steel blue */
  --color-accent: #0A1A3C;      /* deep navy */
  --color-neutral: #5B6E74;     /* slate text */
}
```

### 6. Galaxy Purple — Cosmic Depth

From Dribbble creative tech shots and ProDesignSchool "Galaxy Purple Depth". Analogous harmony (violet spectrum).
Best for: posters, event visuals, creative tech.

```css
:root {
  --color-dominant: #3B1C63;    /* deep cosmos */
  --color-secondary: #7A3DE2;   /* vivid violet */
  --color-accent: #A885FF;      /* soft lavender */
  --color-neutral: #2F2A68;     /* midnight indigo text */
}
```
