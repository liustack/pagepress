---
name: pagepress
description: "Render HTML to PDF. Use when the user wants to convert HTML to PDF, print a web page to PDF, or produce print-ready output from HTML. Trigger phrases include 'HTML to PDF', 'print to PDF', 'convert to PDF', 'save as PDF', '转PDF', '导出PDF'. Only local HTML file input is supported — remote URLs are not accepted."
---

# PagePress — PDF

CLI tool to convert local HTML files into PDF documents.

## Installation

```bash
npm install -g @liustack/pagepress@latest
npx playwright install chromium
```

> **Version check**: Before generating PDFs, run `pagepress --version`. If the command is not found or the version is outdated, re-run the install command above.

## Decision Tree

When the user asks for PDF output, follow this flow:

1. **User has a `.html` file** → render directly
2. **User has no file, but wants a PDF** → write the HTML content first (into `$ASSETS_DIR`), then render it

> **Security**: Remote URL inputs are not supported. Only local `.html` files are accepted.

## Assets Directory

- Ask the user where generated PDFs should be stored.
- Remember the answer as `$ASSETS_DIR` for the session.
- If the user does not reply or accepts the default, use `${workspaceRoot}/assets`.

## Options

```bash
pagepress -i input.html -o output.pdf
```

- `-i, --input <path>` — input HTML file (remote URLs not supported)
- `-o, --output <path>` — output PDF path
- `--safe` — disable external network requests and JavaScript execution
- `--wait-until <state>` — navigation waitUntil: `load`, `domcontentloaded`, `networkidle`
- `--timeout <ms>` — navigation timeout in milliseconds

### When to use `--safe`

Use `--safe` when rendering untrusted HTML files. It blocks all external network requests and disables JavaScript execution in the Chromium renderer.

## Temporary Files

> [!CAUTION]
> **NEVER scatter generated HTML files across the user's project.** All intermediate files must go into `$ASSETS_DIR` (the same directory where output PDFs are stored).

This matters because writing temp files elsewhere triggers permission prompts and clutters the project. Keep everything in one place:

1. **Write temp files to `$ASSETS_DIR`** — avoids permission prompts and keeps files co-located
2. **Clean up after render** — delete the temp file immediately after a successful `pagepress` run
3. **Keep only if asked** — if the user explicitly asks to keep the source file, leave it in `$ASSETS_DIR` and report its path

## Examples

```bash
# Print HTML to PDF
pagepress -i layout.html -o output.pdf

# Render untrusted content safely
pagepress -i untrusted.html -o output.pdf --safe
```
