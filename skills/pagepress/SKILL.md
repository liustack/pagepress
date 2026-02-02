---
name: pagepress
description: "Print web pages, export PDF, generate document reports, screenshot web pages, generate OG images, social cards, posters, infographics. Use when user mentions 'export PDF', 'print to PDF', 'generate report', 'convert to document', 'screenshot', 'capture', 'OG image', 'social card', 'poster', 'infographic', 'cheat sheet', 'web to image'. Supports beautiful Markdown formatting and visual assets."
---

# PagePress

将 HTML/Markdown 转换为 PDF 文档或 PNG 图像的 CLI 工具。

## 安装

```bash
npm install -g pagepress
npx playwright install chromium
```

## PDF 输出

```bash
pagepress print -i input.md -o output.pdf --template default
```

### 核心策略 (Core Strategy)

PagePress 提供两种 PDF 生成模式：
1. **Markdown 格式化** (Beautification): 输入 Markdown，使用内置模板 (default/github/magazine) 进行排版美化。
2. **HTML/URL 打印** (Print As-is): 输入 HTML 或 URL，直接打印，不添加额外样式。Agent 应先完成 HTML 布局。

### 场景路由表 (PDF)

| 场景 | 触发词 (Trigger Phrases) | 输入方法 | 模板/选项 |
|---|---|---|---|
| **Markdown 转文档** | "export PDF", "generate report", "save as PDF", "convert to document" | `-i file.md` | `--template default` (或其他模板) |
| **网页打印** | "print web page", "print to PDF", "save page as PDF" | `-i https://...` | 默认 (无模板) |
| **HTML 打印** | "print HTML", "render HTML to PDF" | `-i file.html` | 默认 (无模板) |

**支持的模板 (Markdown Only)**:
- `default` - Apple 风格，简洁优雅
- `github` - GitHub 风格
- `magazine` - VOGUE/WIRED 杂志排版

**选项**:
- `-i, --input <path>` - 输入 Markdown 或 HTML 文件
- `-o, --output <path>` - 输出 PDF 路径
- `-t, --template <name>` - 模板 (默认: default)
- `--no-toc` - 禁用目录

## 图像输出

```bash
pagepress snap -i input.html -o output.png --preset og
```

### 场景路由表 (AI Agent 决策指南)

| 场景 | 触发词 (Trigger Phrases) | 参数参数 | 布局准则 |
|---|---|---|---|
| **screenshot (默认)** | "screenshot this page", "capture the webpage", "截图" | **无 preset** | 保持原网页布局 |
| **og (社交卡片)** | "OG image", "social preview", "share card", "链接预览图" | `--preset og` | 1200×630; 安全边距 ≥120px |
| **infographic (信息图)** | "cheat sheet", "quick reference", "data card", "信息图", "长图" | `--preset infographic` | 1080×1350; 高信息密度 |
| **poster (海报)** | "poster", "vertical promo", "event poster", "海报" | `--preset poster` | 1200×1500; 极简文字，极致视觉 |
| **banner (横幅)** | "header", "cover image", "hero", "横幅", "封面" | `--preset banner` | 1600×900; 横向布局 |

### 预设规格与设计指南 (AI Agent 参考)

> 这些指南帮助 AI Agent 生成高质量的 HTML。请复用用户项目的品牌资产（颜色、字体、Logo）。

#### 1. og (1200×630) - 链接预览图
- **场景**: 社交媒体分享链接时的预览图。
- **核心原则**:
  - **小尺寸可读性**: 标题在 400px 宽度下必须清晰可见
  - **单一焦点**: 只传达一个核心信息
  - **安全区**: 内容保持距边缘 **120px** 以上

#### 3. infographic (1080×1350) - 信息图/作弊表
- **场景**: 结构化的复杂信息展示，甚至代码片段。
- **核心原则**: **高信息密度**
  - **结构化**: 使用网格、分块、列表、序号
  - **层级分明**: 标题 > 副标题 > 正文 > 标注
  - **适度留白**: **100px+** 边距避免拥挤

#### 4. poster (1200×1500) - 海报
- **场景**: 移动端竖屏视觉冲击图（活动、发布会）。
- **核心原则**: **极少文字，极致视觉**
  - 文字：仅 1 个主标题 + 1 个副标题
  - 主视觉占 50%+
  - **120px+** 边距

#### 5. banner (1600×900) - 横幅
- **场景**: 博客封面、Twitter/LinkedIn 顶部背景。
- **布局**: 横向构图，内容居中或左文右图。

### 选项
- `-i, --input <path>` - 输入 HTML 文件或 URL
- `-o, --output <path>` - 输出 PNG 路径
- `--preset <name>` - 预设: `og`, `infographic`, `poster`, `banner`
- `--width <px>` - 自定义宽度
- `--height <px>` - 自定义高度
- `--scale <n>` - 设备缩放比 (默认: 2)
- `--auto-cleanup` - 转换后自动删除输入文件

## 图像设计指南

> [!CAUTION]
> **禁止交互元素** — 生成的是**静态视觉资产**，不是网页。
>
> **禁止使用**: 导航菜单、按钮、链接、表单、汉堡图标等暗示可点击的元素。
>
> **应该使用**: 标题、标语、装饰图形、图标、统计数据、品牌标识。

## 示例

```bash
# 生成 OG 图像
pagepress snap -i card.html -o og.png --preset og

# 生成 PDF 报告
pagepress print -i report.md -o report.pdf --template github
```
