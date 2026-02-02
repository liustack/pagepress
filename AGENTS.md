# 项目概览（给 AI Agent）

## 目标
提供 `pagepress` CLI 工具，将 Markdown / HTML / URL 渲染成一致、漂亮的 Web 文档，再导出为 **PDF 或 PNG**。

## 技术路线
- **Playwright + Chromium** 作为渲染与导出引擎
- **PNG**：使用 `page.screenshot`，只截图 `#card-container`（缺失即失败）
- **PDF**：使用浏览器打印引擎（`Page.printToPDF`），支持 `-webkit-print-color-adjust: exact`
- **主题设计**：整体以 **留白、呼吸感** 为主，避免拥挤排版

```bash
cd /path/to/web-printer
pnpm install
pnpm exec playwright install chromium
```

> [!NOTE]
> **Mermaid 图表**：已内置支持，无需预处理。Markdown 中的 ` ```mermaid ` 代码块会自动渲染为苹果风格的 SVG 图形。

## 代码组织（Domain 驱动 / Go 风格）

采用**按领域（domain）组织**的目录结构，而非按技术层分类：

```
src/
├── cli.ts              # 入口
├── print/              # Print (PDF) 领域
│   ├── renderer.ts     # PDF 渲染逻辑
│   ├── templates.ts    # 模板定义
│   ├── fonts.ts        # 字体注入
│   └── templates/      # HTML 模板文件
└── snap/               # Snap (PNG) 领域
    ├── renderer.ts     # 截图逻辑
    └── presets.ts      # 尺寸预设
```

**原则**：
- 每个 domain 文件夹**自包含**，包含该领域的所有代码（逻辑、类型、资源）
- **避免跨领域依赖**，共享代码放入 `shared/` 或提升到父级
- 新增功能先确定属于哪个 domain，再在该目录下扩展

## 技能目录
```
skills/
└── pagepress/SKILL.md    # 唯一的 skill，详见该文件
```

主程序源码位于 `src/`，通过 `dist/cli.js` 暴露命令行接口。

## CLI 用法

```bash
# PDF 打印
pagepress print -i document.md -o output.pdf --template default
pagepress print -i page.html -o output.pdf
pagepress print -i https://example.com -o webpage.pdf

# PNG 快照
pagepress snap -i card.html -o og.png --preset og
pagepress snap -i https://example.com -o screenshot.png
```

## Git 提交规范

### Conventional Commits
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**常用 type**：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 格式调整（不影响逻辑）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链

### 原子化提交（Atomic Commits）

> [!IMPORTANT]
> **一个提交只做一件事**。每个 commit 应该是独立的、可回滚的最小变更单元。

**原则**：
1. **单一职责**：一个 commit 只解决一个问题或实现一个功能
2. **可独立测试**：每个 commit 后项目应能正常构建/运行
3. **可独立回滚**：需要撤销时，只影响该单一变更

**反模式**（避免）：
```bash
# ❌ 混合多种变更
git commit -m "feat: add PDF export, fix CSS bug, update README"

# ❌ 提交不完整的功能（会导致构建失败）
git commit -m "feat: half of the new feature"
```

**正确示例**：
```bash
# ✅ 分步提交
git commit -m "feat(pdf): add magazine template"
git commit -m "fix(pdf): correct margin calculation"
git commit -m "docs: update template options in README"
```

## .gitignore 必须包含
- `node_modules/`
- `dist/`
- `skills/**/outputs/`
- 常规日志/缓存/系统文件
