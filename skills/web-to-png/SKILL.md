---
name: web-to-png
description: "将 HTML/Markdown/文本/URL 渲染为高质量 PNG（适合社交分享卡片）。"
---

# Web-to-PNG Skill

将 HTML、Markdown、文本与网页 URL 转换为高质量 PNG。

- **默认截图 `.card` 容器**（找不到则尝试 `.container`，再退回全页）
- 支持常见社交分享卡尺寸 + 自定义尺寸
- 文档主题 + 卡片主题并存（适合长文或社媒卡片）

## 依赖

**Node.js（建议 18+）**

在技能目录安装依赖：

```bash
cd /path/to/web-to-png
npm install
```

**本技能需要的 npm 依赖包（必需）**：

```bash
npm i playwright markdown-it markdown-it-footnote markdown-it-anchor markdown-it-toc-done-right
```

**推荐：全局安装 Playwright（避免重复下载）**：

```bash
npm i -g playwright
playwright install chromium
```

**仅本项目安装（可选）**：

```bash
npx playwright install chromium
```

**复用 Playwright 浏览器缓存（避免重复下载）**：

```bash
# macOS 默认缓存目录
export PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright

# Linux 常见目录
# export PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright
```

可选：安装依赖时跳过浏览器下载，避免重复拉取（需在 `npm install` 前设置）：

```bash
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

## 核心策略

> [!IMPORTANT]
> **AI Agent 使用指南**
>
> 本 skill 有两种使用模式：
>
> ### 模式一：Markdown 排版（有美化能力）
> 若输入为 **Markdown / text**，可使用内置主题排版：
> - 文档主题：`default` / `github` / `academic` / `sketch` / `magazine`
> - 卡片主题：`card-clean` / `card-bold` / `card-poster`
>
> ### 模式二：HTML/URL 截图（可控性最高）
> 若输入为 **HTML 文件或 URL**：
> - 建议由 Agent 自行完成排版与样式
> - 本 skill 主要负责渲染与截图

**默认策略**：优先截图 `.card` 容器，不存在则 `.container`，再退回全页。

## 输入方式

| 方式 | 美化能力 | 适用场景 | CLI 用法 |
|------|----------|----------|----------|
| **Markdown** | ✅ 主题排版 | 内容生成型 | `--input file.md --style card-clean` |
| **Text** | ✅ 主题排版 | 纯文本转换 | `--content "..." --format text` |
| **HTML 文件** | ✅ 可选主题包裹 | Agent 自己排版 | `--input file.html --format html` |
| **URL** | ❌ 纯渲染 | 直接截网页 | `--url https://example.com` |

## 预设尺寸

- `og` 1200×630（横版分享卡）
- `square` 1080×1080（方形）
- `story` 1080×1920（竖版）
- `portrait` 1200×1500（竖版）
- `banner` 1600×900（横版）

也可用 `--width` + `--height` 自定义尺寸。

## 输出

- `pngPath`（必需）
- `htmlPath`（默认保留，`--no-html` 可关闭）
- `meta.json`（包含 Chromium 版本、尺寸、preset、输入摘要 hash、截图模式）

## 主题样式

**文档主题（适合长文）**：
- `default` / `github` / `academic` / `sketch` / `magazine`

**卡片主题（适合社媒）**：
- `card-clean`（极简）
- `card-bold`（大标题强对比）
- `card-poster`（海报感）

## API（Node.js 示例）

```js
import { toPng } from "./converter.js";

toPng({
  inputPath: "examples/summary.md",
  outputPath: "output.png",
  style: "card-bold",
  options: {
    preset: "og",
    format: "markdown",
    device_scale_factor: 2
  }
});
```

## CLI 使用

```bash
# Markdown（默认）
node converter.js --input doc.md --style card-clean --preset og --output out.png

# Text
node converter.js --content "Hello" --format text --style card-bold --output out.png

# HTML 文件
node converter.js --input page.html --format html --style default --output out.png

# 直接渲染 URL
node converter.js --url https://example.com --preset banner --output out.png

# 自定义尺寸
node converter.js --input doc.md --width 1400 --height 800 --output out.png
```

**完整参数**：

| 参数 | 说明 |
|------|------|
| `--input` | 输入文件路径（md/html） |
| `--content` | 直接传入文本内容 |
| `--url` | 直接渲染 URL |
| `--output` | 输出 PNG 路径（必需） |
| `--style` | 主题：文档主题或卡片主题 |
| `--format` | 输入格式：`markdown` / `html` / `text` |
| `--preset` | 预设尺寸：`og` / `square` / `story` / `portrait` / `banner` |
| `--width` / `--height` | 自定义尺寸（需成对） |
| `--device-scale-factor` | 像素密度（默认 2） |
| `--full-page` | 直接截全页 |
| `--clip` | 指定裁剪区域 `x,y,w,h` |
| `--no-html` | 不保留中间 HTML 文件 |
| `--allow-scripts` | 允许执行脚本 |
| `--css` | 追加自定义 CSS |
| `--title` | HTML 标题 |
| `--allow-net` | 网络白名单前缀（可重复） |
| `--wait-until` | `load`/`domcontentloaded`/`networkidle` |
| `--timeout-ms` | 超时（毫秒） |

## 目录结构

```
web-to-png/
  SKILL.md
  converter.js
  package.json
  templates/
    default.html
    github.html
    academic.html
    sketch.html
    magazine.html
    card-clean.html
    card-bold.html
    card-poster.html
  examples/
    summary.md
    card.html
  scripts/
    smoke.js
```

## 渲染引擎

- Playwright + Chromium
- PNG 使用 `page.screenshot` 导出
- 支持 viewport / fullPage / clip / deviceScaleFactor

## 一致性保障

- 相同输入 + 主题 + Chromium 版本 ⇒ 输出稳定
- 打印前等待：`document.fonts.ready` + `waitUntil(networkidle)`
- 默认剥离 `<script>`（除非显式 `--allow-scripts`）

## 安全

- 可配置网络访问白名单（`--allow-net`）
- 默认禁用脚本执行
