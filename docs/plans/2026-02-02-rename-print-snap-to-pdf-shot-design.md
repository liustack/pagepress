# Design: rename print/snap to pdf/shot

## Context
The CLI currently exposes `print` (PDF) and `snap` (PNG). We want naming that scales to future formats (e.g., Word), so commands should be `pdf`, `shot`, and later `word`.

## Decision
Perform a hard rename (breaking change):
- `pagepress print` -> `pagepress pdf`
- `pagepress snap` -> `pagepress shot`
- Domain folders `src/print` -> `src/pdf`, `src/snap` -> `src/shot`

## Goals
- Consistent subcommand naming aligned with output types.
- Domain names match subcommands.
- Update docs, examples, and skills to reflect the new commands.

## Non-goals
- Compatibility aliases for `print`/`snap`.
- Adding the `word` command itself.

## Changes
- CLI command names and descriptions updated.
- Directory and import paths updated.
- Template discovery paths updated to `src/pdf/templates`.
- Documentation and examples updated to `pdf/shot`.

## Risks
- Breaking change for existing scripts and users.

## Testing
- Manual: run `pagepress pdf` and `pagepress shot` for a local HTML/Markdown input.
- Manual: verify help output and docs reflect new commands.
