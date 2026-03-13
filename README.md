# PagePress

A CLI toolkit for AI agents to render local HTML files into high-quality PDF documents.

中文说明请见：[README.zh-CN.md](README.zh-CN.md)

## Features

- PDF-only command surface (`pagepress`)
- Local HTML file input only (`.html`)
- Deterministic output via Playwright + Chromium print engine

## Installation

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

Or run with `npx`:

```bash
npx @liustack/pagepress [options]
```

## Usage

```bash
# Local HTML to PDF
pagepress -i page.html -o output.pdf
```

## Options

- `-i, --input <path>` input HTML file path
- `-o, --output <path>` output PDF file path
- `--wait-until <state>` `load | domcontentloaded | networkidle`
- `--timeout <ms>` timeout in milliseconds
- `--safe` disable external network requests and JavaScript execution

## AI Agent Skill

- [pagepress/SKILL.md](skills/pagepress/SKILL.md)

## License

MIT
