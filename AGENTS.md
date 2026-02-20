# Project Overview (for AI Agent)

## Goal
Provide the `pagepress` CLI tool to render local Markdown / HTML files into consistent, polished web documents, then export them as **PDF or PNG**. Remote URLs are not supported for security reasons.

## Technical Approach
- **Playwright + Chromium** as the rendering and export engine
- **PNG**: use `page.screenshot`, capture only `#container` (fail if missing)
- **PDF**: use the browser print engine (`Page.printToPDF`), with `-webkit-print-color-adjust: exact`
- **Theme design**: emphasize whitespace and breathing room; avoid cramped layout

```bash
cd /path/to/web-printer
pnpm install
pnpm exec playwright install chromium
```

> [!NOTE]
> **Mermaid diagrams**: built-in support, no preprocessing needed. The ` ```mermaid ` code block in Markdown will automatically render into Apple-style SVG graphics.

## Code Organization (Domain-driven / Go Style)

Use a **domain-based** directory structure rather than technical layers:

```
src/
├── cli.ts              # entry
├── pdf/                # PDF domain
│   ├── renderer.ts     # PDF rendering logic
│   ├── templates.ts    # template definitions
│   ├── fonts.ts        # font injection
│   └── templates/      # HTML template files
└── shot/               # Shot (PNG) domain
    ├── renderer.ts     # screenshot logic
    └── presets.ts      # size presets
```

**Principles**:
- Each domain folder is **self-contained**, including all code for that domain (logic, types, resources)
- **Avoid cross-domain dependencies**; shared code should go in `shared/` or be lifted to the parent level
- When adding features, first determine the domain, then extend within that directory

## Skills Directory
```
skills/
├── web-to-pdf/
│   └── SKILL.md                 # PDF generation (commands, templates, options)
└── web-to-png/
    ├── SKILL.md                 # PNG generation (presets, scenarios, design guidelines)
    └── references/
        ├── color-theory.md      # color palette guidance
        └── design-principles.md # typography, visual hierarchy, Gestalt, Japanese aesthetics, Apple HIG
```

The main program source lives in `src/`, and the CLI is exposed via `dist/cli.js`.

## CLI Usage

```bash
# PDF rendering
pagepress pdf -i document.md -o output.pdf --template default
pagepress pdf -i page.html -o output.pdf

# PNG shots
pagepress shot -i card.html -o og.png --preset og
```

## Operational Docs (`docs/`)

1. Operational docs use front-matter metadata (`summary`, `read_when`).
2. Before creating a new doc, run `pnpm docs:list` to review the existing index.
3. Before coding, check the `read_when` hints and read relevant docs as needed.
4. Existing docs: `commit`,  `testing`.

## .gitignore must include
- `node_modules/`
- `dist/`
- `skills/**/outputs/`
- common logs/cache/system files
