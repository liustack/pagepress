---
name: web-to-png
description: "Generate OG images, social cards, posters, banners, infographics, Twitter/X cards, YouTube thumbnails, WeChat covers, and webpage screenshots as PNG using PagePress CLI. The workflow is: write HTML layout → render to PNG via pagepress shot. Use when user mentions 'OG image', 'social card', 'poster', 'banner', 'infographic', 'cheat sheet', 'cover image', 'screenshot', 'capture webpage', 'Twitter card', 'YouTube thumbnail', 'video thumbnail', '公众号封面', '微信封面', 'WeChat cover', 'pagepress shot', 'HTML to PNG', or 'HTML to image'. Priority: if an image generation model or dedicated image-gen skill is available, prefer that for visual assets; fall back to this HTML-screenshot approach only when no image-gen capability exists."
---

# PagePress — PNG

CLI tool to capture HTML or URL as PNG images with preset dimensions.

## Installation

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

## Design References & Visual Rules

> [!IMPORTANT]
> **Read before generating any visual asset (PNG).** These rules are mandatory, not optional.
>
> **Priority**: If the user provides their own color palette, design guidelines, or style references, **use the user's** and skip the built-in references below. The built-in references are defaults, not overrides.

> [!CAUTION]
> **The output is a static visual asset** — a poster or card, **not a web page**.
>
> **Do not use**: navigation menus, buttons, links, forms, hamburger icons, badges/chips/pills/tags, or any elements that imply clickability or look like a web UI component.
>
> **Should use**: titles, taglines, decorative graphics, SVG illustrations, icons, statistics, brand marks.

- **references/color-theory.md** — Color theory rules (60-30-10 ratio, 4-hue limit, harmony methods) **always apply** to every design. Ready-to-use palettes are provided as **fallback only** — use them when no workspace brand colors exist. When brand colors exist, use them as the starting palette and apply the color theory rules on top.
- **references/design-principles.md** — Typography scale, visual hierarchy, Gestalt principles, Japanese aesthetics, Apple HIG. Apply to every layout decision.

## Usage

```bash
pagepress shot -i input.html -o output.png --preset og
```

> PNG output requires a `#container` element. Rendering fails if it is missing.

## Assets Directory (AI Agent Guidance)

- Ask the user where generated assets should be stored.
- Remember the answer as `$ASSETS_DIR` for the session.
- If the user does not reply or accepts the default, use `${workspaceRoot}/assets` (workspace root `assets/`).

## Workspace Visual & Brand Resources (AI Agent Guidance)

- For OG cards, posters, and banners, **always** base the design on workspace visual/brand resources.
- Check the workspace for existing assets such as logos, color tokens, fonts, and brand imagery (commonly in `assets/`, `public/`, `src/assets/`, `docs/`, or any `brand/`-named folders).
- Also inspect project stylesheets and font usage (e.g., `*.css`, `*.scss`, `*.tailwind.css`) to infer the color palette and visual style when explicit brand assets are incomplete.
- If no brand resources are available, ask the user to provide them (logo, font preference) before generating visuals.

## Temporary HTML Cleanup (AI Agent Guidance)

- If the AI Agent generates temporary HTML for rendering, use the system temporary directory:
  - If the agent provides its own session temp directory, prefer that.
  - Otherwise, use `$TMPDIR`; if unavailable, use `/tmp`.
  - Create a session subdirectory like `$TMPDIR/pagepress-$SESSION_ID/`.
- After a successful render, delete only the temporary HTML it generated.
- If the user asks to keep inputs for debugging or reuse, copy the file into `$ASSETS_DIR` and report its path.

## Scenario Routing Table (AI Agent Decision Guide)

| Scenario | Trigger Phrases | Parameters | Layout Guidelines |
|---|---|---|---|
| **screenshot (default)** | "screenshot", "take a screenshot", "capture webpage", "webpage screenshot" | **no preset** | Preserve the original web layout |
| **og (social card)** | "OG image", "social preview", "link preview", "share card", "social card" | `--preset og` | 1200x630; safe margin >=120px |
| **infographic** | "infographic", "long-form image", "cheat sheet", "quick reference", "data card" | `--preset infographic` | 1080x1350; high information density |
| **poster** | "poster", "event poster", "promo poster", "vertical promo" | `--preset poster` | 1200x1500; minimal text, strong visual impact |
| **banner** | "banner", "cover image", "header image", "hero image", "cover" | `--preset banner` | 1600x900; horizontal layout |
| **twitter** | "Twitter card", "X card", "tweet image", "Twitter preview" | `--preset twitter` | 1200x675; 16:9; readable at 400px width; text stroke for contrast |
| **youtube** | "YouTube thumbnail", "video thumbnail", "YT thumbnail" | `--preset youtube` | 1280x720; 16:9; ultra-bold text; readable at 168x94 |
| **xiaohongshu** | "xiaohongshu", "小红书", "小红书封面", "RedNote cover" | `--preset xiaohongshu` | 1080x1440; 3:4 vertical; bold headline impact |
| **wechat** | "公众号封面", "微信封面", "WeChat cover", "公众号头图" | `--preset wechat` | 900x383; 2.35:1; safe zone center 383x383 square |

## Preset Specs and Design Guidelines (AI Agent Reference)

> These guidelines help the AI Agent generate high-quality HTML. Reuse the user's brand assets (colors, fonts, logo).

#### 1. og (1200x630) - Link Preview Image
- **Scenario**: Preview image when sharing links on social media.
- **Core principles**:
  - **Small-size readability**: the headline must be clearly legible at 400px width
  - **Single focus**: convey only one core message
  - **Safe area**: keep content at least **120px** from the edges

#### 3. infographic (1080x1350) - Infographic/Cheat Sheet
- **Scenario**: Structured presentation of complex information, even code snippets.
- **Core principle**: **High information density**
  - **Structured**: use grids, blocks, lists, numbering
  - **Clear hierarchy**: title > subtitle > body > annotation
  - **Moderate whitespace**: **100px+** margins to avoid crowding

#### 4. poster (1200x1500) - Poster
- **Scenario**: Vertical mobile visual impact (events, launches).
- **Core principle**: **Minimal text, maximum visual**
  - Text: only 1 main title + 1 subtitle
  - Main visual occupies 50%+
  - **120px+** margins

#### 5. banner (1600x900) - Banner
- **Scenario**: Blog covers, Twitter/LinkedIn header backgrounds.
- **Layout**: horizontal composition, content centered or left-text-right-image.

#### 6. twitter (1200x675) - Twitter/X Card
- **Scenario**: Preview image for tweets and X posts with `summary_large_image` card type.
- **Core principles**:
  - **Small-size readability**: headline must be legible when the card is displayed at ~400px width in the timeline
  - **Single focus**: one core message per card, details belong in the tweet text
  - **Safe area**: keep content at least **120px** from all edges (Twitter applies round corners and may crop top/bottom)
  - **Z-pattern layout**: top-left → top-right → bottom-left → bottom-right scanning path
- **HTML advantages to leverage**:
  - Precise CSS typography with custom fonts (`@font-face`), gradients, `backdrop-filter`
  - Dynamic text injection for programmatic batch generation (blog posts, release notes)
  - Pixel-perfect brand consistency via CSS variables
- **Pitfalls to avoid**:
  - No interactive elements (buttons, links) — this is a static image
  - Do not place critical content near corners (Twitter's round-corner clipping)
  - Avoid pure white backgrounds (blends with Twitter's light-mode chrome)
  - Do not use transparent PNG backgrounds (Twitter renders white or dark behind transparency)
  - Headline font-size >= **48px** (recommended 56-72px), max 2 font families, 3 weights
  - Keep PNG file size < **500 KB** for fast loading
- **Common patterns**: solid/gradient background + large title + brand logo; left-text-right-visual split; dark theme (stands out in feed)

#### 7. youtube (1280x720) - YouTube Thumbnail
- **Scenario**: Video thumbnail for YouTube, optimized for high click-through rate.
- **Core principles**:
  - **168px-test**: the thumbnail must be recognizable when scaled down to 168x94px (sidebar/mobile size)
  - **3-5 words max**: ultra-concise text; video title handles the details
  - **Ultra-bold typography**: font-size 120-200px, Extra Bold / Black weight, with **text-stroke** (3-6px) for contrast
  - **High-contrast colors**: red, yellow, orange, cyan stand out against YouTube's gray interface; avoid pure white/gray backgrounds
- **Safe area**:
  - **Right-bottom exclusion zone** (~120x60px): YouTube overlays the video duration badge here
  - **Bottom edge**: red progress bar may appear on rewatched videos
  - Keep all critical content within the **center 70%** of the canvas
  - **90px+** margins on top/left/right, **100px+** bottom margin
- **HTML advantages to leverage**:
  - CSS `text-stroke` and `text-shadow` for the bold outlined text style YouTube thumbnails demand
  - Consistent series branding via CSS variables (same layout, swapping title/colors per video)
  - Gradient backgrounds and `mix-blend-mode` for visual depth without Photoshop
  - SVG icons and geometric shapes for decorative elements
- **Pitfalls to avoid**:
  - Cannot render photographic faces/emotions (the highest-CTR element) — HTML excels at text-heavy thumbnails, not portrait photography
  - Avoid decorative/script fonts — use only sans-serif bold families (Montserrat, Oswald, Anton, Bebas Neue)
  - Do not exceed 3 dominant colors; apply 60-30-10 rule
  - Avoid small text — anything below 75px on the 1280x720 canvas becomes unreadable at thumbnail sizes
  - Do not use CSS animations or transitions (static output only)
- **Common patterns**: bold text + gradient background; number/statistic callout; before-after split; color-blocked sections with icons

#### 8. wechat (900x383) - WeChat Official Account Cover
- **Scenario**: WeChat Official Account (公众号) article cover image for headline position.
- **Core principles**:
  - **Center safe zone**: all critical content must fit within the **center 383×383px square** — WeChat crops to 1:1 when shared to Moments or chat
  - **2-6 keywords only**: extract key phrases from the article title; this is not a document, it's a billboard
  - **Avoid pure white backgrounds**: blends with WeChat's white interface and loses boundary
  - **Strong contrast**: text-to-background contrast >= 4.5:1; bold, high-weight sans-serif fonts
- **Safe area**:
  - **Center 383×383px** is the critical safe zone (1:1 crop for sharing)
  - Left/right ~259px bands are decorative/supplementary — they may be cropped
  - Title font-size >= **40px** (recommended 48-72px)
- **HTML advantages to leverage**:
  - CSS precise layout for the center safe zone with `flexbox` centering
  - Dynamic title/author injection for batch generation across article series
  - Brand consistency via CSS variables (logo, colors, fonts)
  - Gradient and color-block backgrounds that extend to full 900px width for the uncropped view
- **Pitfalls to avoid**:
  - Do not place critical text or logos outside the center 383×383 safe zone
  - Do not use transparent PNG backgrounds (WeChat fills with white/black)
  - Do not use small text — must be readable at thumbnail sizes in subscription list
  - Avoid complex photo backgrounds without a semi-transparent overlay for text readability
  - Keep PNG file size < **500 KB**
- **Common patterns**: solid/gradient background + bold keywords centered; brand color blocks + logo + title; left-right symmetric decorative elements with centered text

#### 9. xiaohongshu (1080x1440) - Xiaohongshu / RedNote Cover
- **Scenario**: Xiaohongshu note cover, knowledge card, vertical mobile content.
- **Core principle**: **Bold headline + 3-second rule**
  - Headline font-size >= 80px, occupying 40-60% of the canvas
  - Highlight keywords with color/size contrast
  - Convey "high information density" to entice clicks
  - **90px+** side margins, **80px+** top/bottom padding

## Options

- `-i, --input <path>` - input HTML file or URL
- `-o, --output <path>` - output PNG path
- `-p, --preset <name>` - preset: `og`, `infographic`, `poster`, `banner`, `twitter`, `youtube`, `xiaohongshu`, `wechat`
- `--width <px>` - custom width
- `--height <px>` - custom height
- `--scale <n>` - device scale factor (default: 2)
- `--wait-until <state>` - navigation waitUntil: load, domcontentloaded, networkidle
- `--timeout <ms>` - navigation timeout in milliseconds
- `--safe` - disable external network requests and JavaScript execution

## Examples

```bash
# Generate an OG image
pagepress shot -i card.html -o og.png --preset og

# Capture a full-page screenshot
pagepress shot -i https://example.com -o screenshot.png

# Generate a poster
pagepress shot -i poster.html -o poster.png --preset poster
```
