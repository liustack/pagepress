---
name: pagepress
description: "Render Markdown and HTML to PDF with built-in templates and Mermaid diagram support. Use when the user wants to convert Markdown or HTML to PDF, generate a report, export documentation, create a formatted document, or produce print-ready output. Trigger phrases include 'convert to PDF', 'save as PDF', 'generate report', 'export as PDF', 'Markdown to PDF', 'HTML to PDF', 'print to PDF', '转PDF', '导出PDF', '生成报告'. Also use when the user asks to summarize content into a document, create a weekly/monthly report, or format notes for sharing. Only local file input is supported — remote URLs are not accepted."
---

# PagePress — PDF

CLI tool to convert local Markdown and HTML files into PDF documents, with built-in templates, syntax highlighting, and Mermaid diagram rendering.

## Installation

```bash
npm install -g @liustack/pagepress@latest
npx playwright install chromium
```

> **Version check**: Before generating PDFs, run `pagepress --version`. If the command is not found or the version is outdated, re-run the install command above.

## Decision Tree

When the user asks for PDF output, follow this flow:

1. **User has a `.md` file** → render directly with a template
2. **User has a `.html` file** → print as-is (no template applied)
3. **User has no file, but wants a report/document** → write the Markdown content first (into `$ASSETS_DIR`), then render it
4. **User has raw data or code to summarize** → create a Markdown report with headings, tables, and code blocks, then render it

> **Security**: Remote URL inputs are not supported. Only local `.md` and `.html` files are accepted.

## Template Selection Guide

Pick the template based on the document's purpose:

| Template | Style | Best For |
|----------|-------|----------|
| `default` | Clean minimalist, generous whitespace | Technical docs, reports, notes |
| `github` | GitHub-flavored markdown | README-style docs, developer docs |
| `magazine` | Premium editorial with serif fonts | Presentations, whitepapers, polished deliverables |

If the user doesn't specify a template, use `default`. If they ask for something "fancy" or "polished", use `magazine`. If they want it to look like GitHub, use `github`.

## Frontmatter

Markdown files support YAML frontmatter. The `title` field sets the document's `<title>`:

```markdown
---
title: Q1 Performance Report
---

# Q1 Performance Report
...
```

If no frontmatter is present, the title defaults to "Document".

## Mermaid Diagrams

PagePress has built-in Mermaid rendering — no preprocessing needed. Standard ` ```mermaid ` code blocks in Markdown are automatically rendered into SVG graphics in the PDF. This works with all templates.

Supported diagram types include flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, Gantt charts, and more.

```markdown
## Architecture

` ```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Service]
` ```
```

## Assets Directory

- Ask the user where generated PDFs should be stored.
- Remember the answer as `$ASSETS_DIR` for the session.
- If the user does not reply or accepts the default, use `${workspaceRoot}/assets`.

## Options

```bash
pagepress -i input.md -o output.pdf --template default
```

- `-i, --input <path>` — input Markdown or HTML file (remote URLs not supported)
- `-o, --output <path>` — output PDF path
- `-t, --template <name>` — template: `default`, `github`, or `magazine`
- `--safe` — disable external network requests and JavaScript execution
- `--wait-until <state>` — navigation waitUntil: `load`, `domcontentloaded`, `networkidle`
- `--timeout <ms>` — navigation timeout in milliseconds

### When to use `--safe`

Use `--safe` when rendering untrusted HTML files or Markdown that may contain embedded scripts. It blocks all external network requests and disables JavaScript execution in the Chromium renderer. Not needed for normal Markdown-to-PDF workflows.

## Temporary Files

> [!CAUTION]
> **NEVER scatter generated Markdown or HTML files across the user's project.** All intermediate files must go into `$ASSETS_DIR` (the same directory where output PDFs are stored).

This matters because writing temp files elsewhere triggers permission prompts and clutters the project. Keep everything in one place:

1. **Write temp files to `$ASSETS_DIR`** — avoids permission prompts and keeps files co-located
2. **Clean up after render** — delete the temp file immediately after a successful `pagepress` run
3. **Keep only if asked** — if the user explicitly asks to keep the source file, leave it in `$ASSETS_DIR` and report its path

## Examples

```bash
# Markdown report with default template
pagepress -i report.md -o report.pdf --template default

# Developer docs with GitHub style
pagepress -i api-docs.md -o api-docs.pdf --template github

# Polished whitepaper with magazine layout
pagepress -i whitepaper.md -o whitepaper.pdf --template magazine

# Print HTML as-is
pagepress -i layout.html -o output.pdf

# Render untrusted content safely
pagepress -i untrusted.html -o output.pdf --safe
```
