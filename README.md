# PagePress

A web content rendering toolkit (CLI) designed for **AI Agents**, converting local HTML and Markdown files into high-quality **PDF** or **PNG** images.

中文说明请见：[README.zh-CN.md](README.zh-CN.md)

## ✨ Features

- **Unified CLI**: One tool (`pagepress`) for both PDF and image generation
- **AI Agent friendly**: Includes a detailed SKILL.md guide with scenario routing
- **Local files only**: Accepts local HTML and Markdown files (remote URLs are not supported for security)
- **Rich templates**:
  - **PDF**: Apple style, GitHub style, magazine layout (Magazine)
  - **Image**: 8 presets — OG cards, infographics, posters, banners, Twitter/X cards, YouTube thumbnails, Xiaohongshu covers, WeChat covers
- **Brand-aware visuals**: OG / poster / banner outputs are generated based on workspace visual & brand assets (commonly in `assets/`, `public/`, `src/assets/`)
- **Consistency guarantees**: Deterministic rendering, font waiting, network idle detection, syntax highlighting

## 📦 Installation

```bash
# Global install
npm install -g @liustack/pagepress

# Install browsers (Playwright)
npx playwright install chromium
```

Or use `npx` directly:

```bash
npx @liustack/pagepress <command> [options]
```

## 🚀 Usage

### 1. Generate PDF

Convert HTML/Markdown into PDF documents. Supports syntax highlighting.

```bash
# Markdown to PDF (Apple style template)
pagepress pdf -i document.md -o output.pdf --template default

# Local HTML file to PDF
pagepress pdf -i page.html -o output.pdf

```

**Supported templates**:
- `default` - Apple style, clean and elegant
- `github` - GitHub style
- `magazine` - VOGUE/WIRED magazine layout

### 2. Generate Images

Render local HTML into PNG images, suitable for social share cards, posters, and infographics.

For OG cards, posters, and banners, the visuals should be generated based on workspace brand assets (logo, colors, fonts, imagery), commonly located in `assets/`, `public/`, or `src/assets/`.

**Recommended brand assets layout**:

```text
assets/
  brand/
    logo.svg
    palette.json
    fonts/
      YourBrand-Regular.woff2
    imagery/
      hero.jpg
```

```bash
# Generate an OG card (1200x630)
pagepress shot -i card.html -o og.png --preset og

# Generate a long infographic
pagepress shot -i stats.html -o infographic.png --preset infographic

```

**Supported presets**:
- `og` (1200x630) - Social card
- `infographic` (1080x1350) - Infographic
- `poster` (1200x1500) - Poster
- `banner` (1600x900) - Banner
- `twitter` (1200x675) - Twitter/X card
- `youtube` (1280x720) - YouTube thumbnail
- `xiaohongshu` (1080x1440) - Xiaohongshu / RedNote cover
- `wechat` (900x383) - WeChat Official Account cover

## 🖼️ Examples

### Image Presets

| OG Card (1200×630) | Infographic (1080×1350) |
|:---:|:---:|
| ![OG Card](examples/shot-og.png) | ![Infographic](examples/shot-infographic.png) |

| Poster (1200×1500) | Banner (1600×900) |
|:---:|:---:|
| ![Poster](examples/shot-poster.png) | ![Banner](examples/shot-banner.png) |

| Twitter/X Card (1200×675) | YouTube Thumbnail (1280×720) |
|:---:|:---:|
| ![Twitter Card](examples/shot-twitter.png) | ![YouTube Thumbnail](examples/shot-youtube.png) |

| Xiaohongshu Cover (1080×1440) | WeChat Cover (900×383) |
|:---:|:---:|
| ![Xiaohongshu Cover](examples/shot-xiaohongshu.png) | ![WeChat Cover](examples/shot-wechat.png) |

## 🤖 AI Agent Integration

This project includes two skill guides for AI Agents (such as Claude, ChatGPT):

- [web-to-pdf/SKILL.md](skills/web-to-pdf/SKILL.md) — PDF generation (Markdown beautification, templates, HTML printing)
- [web-to-png/SKILL.md](skills/web-to-png/SKILL.md) — PNG generation (OG cards, infographics, posters, banners, social cards)

Agents can automatically choose the appropriate commands and parameters based on natural language instructions (for example, "generate a poster" or "convert this document to PDF").

## 📄 License

MIT
