---
name: web-to-png
description: "Use PagePress CLI to render HTML into PNG screenshots with preset dimensions (OG 1200x630, infographic 1080x1350, poster 1200x1500, banner 1600x900). Use when user wants to convert HTML to image, take a webpage screenshot, or generate a PNG from an HTML template. Trigger phrases: 'pagepress shot', 'HTML to PNG', 'HTML to image', 'screenshot this page', 'capture webpage', 'render HTML as image'. NOT for AI-generated illustrations — this tool screenshots existing HTML, it does not create images from text prompts."
---

# PagePress — PNG

CLI tool to capture HTML or URL as PNG images with preset dimensions.

## Installation

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

## Design References

> [!IMPORTANT]
> **Read before generating any visual asset (PNG).** These references are mandatory, not optional.

- **references/color-theory.md** — Color palette selection, 60-30-10 rule, 4-hue limit, harmony methods, ready-to-use palettes. **Always apply**, regardless of whether brand colors exist.
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

## Options

- `-i, --input <path>` - input HTML file or URL
- `-o, --output <path>` - output PNG path
- `-p, --preset <name>` - preset: `og`, `infographic`, `poster`, `banner`
- `--width <px>` - custom width
- `--height <px>` - custom height
- `--scale <n>` - device scale factor (default: 2)
- `--wait-until <state>` - navigation waitUntil: load, domcontentloaded, networkidle
- `--timeout <ms>` - navigation timeout in milliseconds
- `--safe` - disable external network requests and JavaScript execution

## Image Design Guidelines

> [!CAUTION]
> **No interactive elements** — the output is a **static visual asset**, not a web page.
>
> **Do not use**: navigation menus, buttons, links, forms, hamburger icons, or any elements that imply clickability.
>
> **Should use**: titles, taglines, decorative graphics, icons, statistics, brand marks.

## Examples

```bash
# Generate an OG image
pagepress shot -i card.html -o og.png --preset og

# Capture a full-page screenshot
pagepress shot -i https://example.com -o screenshot.png

# Generate a poster
pagepress shot -i poster.html -o poster.png --preset poster
```
