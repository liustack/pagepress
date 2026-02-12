# Project Overview (for AI Agent)

## Goal
Provide the `pagepress` CLI tool to render Markdown / HTML / URL into consistent, polished web documents, then export them as **PDF or PNG**.

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
└── pagepress/SKILL.md    # the only skill; see that file for details
```

The main program source lives in `src/`, and the CLI is exposed via `dist/cli.js`.

## CLI Usage

```bash
# PDF rendering
pagepress pdf -i document.md -o output.pdf --template default
pagepress pdf -i page.html -o output.pdf
pagepress pdf -i https://example.com -o webpage.pdf

# PNG shots
pagepress shot -i card.html -o og.png --preset og
pagepress shot -i https://example.com -o screenshot.png
```

## Git Commit Conventions

### Commit Message Format
```
<type>[optional scope]: <imperative summary>

[optional body]

[optional footer(s)]
```

Guidelines:
- Keep the summary concise (recommended <= 72 characters)
- Use imperative mood (for example: `add`, `fix`, `update`)
- Avoid ending the summary with a period
- Use scope only when it adds clarity (for example: `auth`, `api`, `ui`, `docs`)
- Mark breaking changes with `!` (for example: `feat!:`) or a `BREAKING CHANGE:` footer

### Recommended Types
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation update
- `style`: formatting (no logic changes)
- `refactor`: code restructuring without behavior changes
- `perf`: performance improvements
- `test`: testing related
- `build`: build system or dependency changes
- `ci`: CI/CD changes
- `chore`: maintenance tasks
- `revert`: revert a previous commit

### Atomic Commits

> [!IMPORTANT]
> **One commit does one thing.** Each commit should be the smallest independent change that can be reverted.

Rules:
1. Single responsibility: one commit solves one problem or delivers one coherent change
2. Independently testable: the repository should stay buildable/runnable after each commit
3. Independently reversible: rollback should only affect that specific change
4. Include related tests in the same commit when behavior changes
5. Do not mix refactoring/formatting-only changes with behavior changes

Anti-patterns (avoid):
```bash
# ❌ Mixed changes
git commit -m "feat: add search and fix login bug"

# ❌ Vague and non-actionable message
git commit -m "chore: WIP"
```

Good examples:
```bash
git commit -m "feat(auth): add password reset endpoint"
git commit -m "fix(api): validate empty slug input"
git commit -m "docs: document deployment prerequisites"
```

### Pre-Commit Checklist
- Commit message follows the format and uses a clear type
- Staged files are related to one change only
- Relevant tests/lint checks are updated and passing
- No unrelated generated or temporary files are included

## .gitignore must include
- `node_modules/`
- `dist/`
- `skills/**/outputs/`
- common logs/cache/system files
