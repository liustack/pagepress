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

