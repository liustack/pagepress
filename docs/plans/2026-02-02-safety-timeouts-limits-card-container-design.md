# Design: safety mode, navigation controls, limits, and card container enforcement

## Context
We need to reduce SSRF/data exfiltration risk, avoid hangs on long-lived connections, and enforce output constraints for PNG rendering. We also want consistent CLI ergonomics for presets.

## Goals
- Add `--safe` to disable external network requests and JavaScript execution.
- Make navigation `waitUntil` and `timeout` configurable for print and snap.
- Enforce reasonable bounds on snap `width`, `height`, and `scale` with clear errors.
- Require `#card-container` for PNG output and fail fast if missing.
- Add `-p` shorthand for `--preset` to align with `-t/--template`.

## Non-goals
- Implement TOC generation; `--no-toc` has been removed.
- Build an interactive prompt flow for asset outputs.

## Changes
- **CLI**
  - Print: `--safe`, `--wait-until <state>`, `--timeout <ms>`.
  - Snap: `-p, --preset <name>`, `--safe`, `--wait-until <state>`, `--timeout <ms>`.
- **Safety mode**
  - If `--safe` and input is a remote URL, return an error.
  - Disable JS via `javaScriptEnabled: false`.
  - Block `http://` and `https://` requests via route interception.
- **Navigation controls**
  - Default `waitUntil=networkidle`, `timeout=30000`.
  - Accept only `load|domcontentloaded|networkidle`.
- **Snap constraints**
  - Enforce `width/height` in [100, 5000] and `scale` in [1, 4].
- **PNG container enforcement**
  - Require `#card-container` and use its bounding box for screenshot.

## Testing
- Manual: verify `--safe` blocks URL input and external requests.
- Manual: verify waitUntil/timeout changes navigation behavior.
- Manual: confirm dimension validation errors for out-of-range values.
- Manual: confirm missing `#card-container` throws a clear error.
