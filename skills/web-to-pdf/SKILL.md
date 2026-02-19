---
name: web-to-pdf
description: "Render web pages and Markdown to PDF and generate PDF reports. Use when user mentions 'convert to PDF', 'save as PDF', 'generate a PDF report', 'summarize into PDF', 'print to PDF', 'export PDF', 'Markdown to PDF', 'HTML to PDF', or 'render page to PDF'. Supports Markdown beautification with built-in templates (default/github/magazine) and direct HTML/URL printing."
---

# PagePress — PDF

CLI tool to convert Markdown, HTML, or URL into PDF documents.

## Installation

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

## Core Strategy

PagePress provides two PDF generation modes:
1. **Markdown Beautification**: input Markdown and use built-in templates (default/github/magazine) for layout and styling.
2. **HTML/URL Print As-is**: input HTML or a URL and print directly without extra styles. The Agent should finish the HTML layout first.
If the user asks to summarize or generate a report, the Agent should first create the Markdown content, then render it to PDF.

## Scenario Routing Table

| Scenario | Trigger Phrases | Input Method | Template/Options |
|---|---|---|---|
| **Markdown to document** | "convert to PDF", "save as PDF", "export PDF", "generate a PDF report", "summarize into PDF", "convert Markdown to PDF" | `-i file.md` | `--template default` (or other templates) |
| **Web page print** | "print web page", "print to PDF", "save page as PDF", "export page to PDF", "render this page to PDF" | `-i https://...` | Default (no template) |
| **HTML print** | "print HTML", "render HTML to PDF", "HTML to PDF" | `-i file.html` | Default (no template) |

## Supported Templates (Markdown only)

- `default` - Apple style, clean and elegant
- `github` - GitHub style
- `magazine` - VOGUE/WIRED magazine layout

## Options

```bash
pagepress pdf -i input.md -o output.pdf --template default
```

- `-i, --input <path>` - input Markdown or HTML file
- `-o, --output <path>` - output PDF path
- `-t, --template <name>` - template (default: default)
- `--wait-until <state>` - navigation waitUntil: load, domcontentloaded, networkidle
- `--timeout <ms>` - navigation timeout in milliseconds
- `--safe` - disable external network requests and JavaScript execution

**Safe mode notes**:
- Remote URL input is not allowed.
- External network requests and JavaScript execution are disabled.

## Examples

```bash
# Generate a PDF report from Markdown
pagepress pdf -i report.md -o report.pdf --template default

# Print a web page to PDF
pagepress pdf -i https://example.com -o page.pdf

# Render HTML to PDF
pagepress pdf -i layout.html -o output.pdf
```
