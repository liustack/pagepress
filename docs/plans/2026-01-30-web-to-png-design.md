# Web-to-PNG Skill Design

Date: 2026-01-30

## Goals
- Provide a self-contained skill to render Markdown/HTML/text/URL to PNG via Playwright.
- Support common share-card sizes (og, square, story, portrait, banner) and custom width/height.
- Support document themes (default/github/academic/sketch/magazine) plus card themes (card-clean/card-bold/card-poster).
- Default to capturing a .card container; allow fullPage and clip.
- Keep the skill fully independent from other skills for easy copy/install.

## Non-goals
- No shared core module across skills.
- No server/API layer.
- No heavy test framework.

## Inputs/Outputs
- Inputs: file path, raw content, or URL.
- Formats: markdown/html/text (text is wrapped as markdown paragraphs).
- Output: PNG path + meta json.
- Optional: keep intermediate HTML.

## Rendering Pipeline
1. Parse args and validate inputs/output.
2. Load content from input/content/url.
3. If markdown/text: render to HTML via markdown-it (footnote/anchor/toc); if HTML: sanitize.
4. Apply selected template (doc or card theme).
5. Write temp HTML (or keep if requested).
6. Playwright loads HTML or URL; wait for networkidle + fonts.ready.
7. Screenshot the .card bounding box by default; fallback to full page if missing.
8. Write meta with chromium version, size, preset, and input hash.

## Playwright Settings
- viewport is set from preset or width/height.
- deviceScaleFactor defaults to 2.
- screenshot options: png, clip or fullPage.

## Error Handling
- Validate required output path.
- Validate mutually exclusive inputs.
- Friendly errors for missing Playwright/Chromium.
- Optional network whitelist; block non-allowed requests.

## Directory Layout
skills/web-to-png/
  SKILL.md
  package.json
  converter.js
  scripts/
  templates/
  examples/

## Smoke Checks
- A script generates outputs for 3 presets and 2 themes into outputs/.
