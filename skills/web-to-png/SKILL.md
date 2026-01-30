---
name: web-to-png
description: "将 HTML/Markdown/URL 渲染为高质量 PNG（适合社交分享卡片）。"
---

# Web-to-PNG Skill

将 HTML（本地或 URL）与 Markdown（本地）渲染为高质量 PNG。

- **只截图 `#card-container`**（找不到直接失败）
- 支持固定尺寸预设 + 1080 宽度的自适应高度
- 5 种精心设计的主题风格
- 可选水印（默认不显示）

## 依赖

**Node.js（建议 18+）**

在项目根目录安装依赖：

```bash
cd /path/to/web-printer
npm install
```

**本技能需要的 npm 依赖包（必需）**：

```bash
npm i playwright markdown-it markdown-it-footnote markdown-it-anchor markdown-it-toc-done-right
```

**可选依赖（按需）**：

- `Playwright Chromium`（截图渲染必须有浏览器可用）
- 系统字体（影响最终视觉效果；未安装会回退系统字体）

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
> 若输入为 **Markdown（本地文件）**，可使用内置主题排版：
> - `default` - 极简专业（默认）
> - `sketch` - 手绘笔记风格
> - `magazine` - 杂志排版风格
> - `bold` - 深色醒目风格
> - `poster` - 梦幻海报风格
>
> ### 模式二：HTML/URL 截图（可控性最高）
> 若输入为 **HTML 文件或 URL**：
> - 建议由 Agent 自行完成排版与样式
> - 本 skill 主要负责渲染与截图

**默认策略**：只截图 `#card-container`，未找到则返回失败。

## 自定义 HTML 编写指南

> [!IMPORTANT]
> **AI Agent 编写自定义 HTML 时必须遵循以下规则**
>
> ### 1. 尺寸设置
> **固定尺寸**：`<html>` 和 `<body>` 必须设置固定宽高，与目标预设一致：
>
> ```css
> html, body { width: 1080px; height: 1920px; } /* story 预设 */
> ```
>
> | 预设 | 宽高 |
> |------|------|
> | `og` | 1200×630 |
> | `square` | 1080×1080 |
> | `story` | 1080×1920 |
> | `portrait` | 1200×1500 |
> | `banner` | 1600×900 |
>
> **自适应高度模式（不传 preset）**：仅需设置 `width: 1080px; height: auto;`。
>
> ### 2. 必须包含 `#card-container`
> **推荐结构**：内容放入 `#card-container`，由渲染器截图：
> ```css
> #card-container { width: 1200px; height: 630px; overflow: hidden; }
> .content-container {
>   padding: 60px;
>   display: flex;
>   flex-direction: column;
>   justify-content: center;  /* 垂直居中 */
>   gap: 40px;
> }
> ```
>
> ### 3. 背景与装饰
> - 背景渐变、光晕等效果应直接设置在 `body` 上
> - 伪元素 `::before` / `::after` 可用于光晕特效
>
> ### 4. 截图注意事项
> - 必须包含 `#card-container`，否则截图失败
> - 不支持 `--clip` / `--full-page`
>
> ### 5. 完整示例
> ```html
> <!DOCTYPE html>
> <html lang="zh-CN">
> <head>
>   <style>
>     * { box-sizing: border-box; margin: 0; padding: 0; }
>     html, body { width: 1080px; height: 1920px; }
>     #card-container { width: 1200px; height: 630px; overflow: hidden; }
>     .content-container { padding: 60px; height: 100%; }
>     body {
>       background: linear-gradient(135deg, #667eea, #764ba2);
>       color: #fff;
>       padding: 60px;
>       display: flex;
>       flex-direction: column;
>       justify-content: center;
>       gap: 40px;
>     }
>   </style>
> </head>
> <body>
>   <section id="card-container">
>     <div class="content-container">
>       <h1>标题</h1>
>       <p>内容...</p>
>     </div>
>   </section>
> </body>
> </html>
> ```

## 输入方式

| 方式 | 美化能力 | 适用场景 | CLI 用法 |
|------|----------|----------|----------|
| **Markdown（本地）** | ✅ 主题排版 | 内容生成型 | `--input file.md --style bold` |
| **HTML 文件（本地）** | ✅ 可选主题包裹 | Agent 自己排版 | `--input file.html --format html` |
| **URL** | ❌ 纯渲染 | 直接截网页 | `--url https://example.com` |

**HTML/URL 必须包含 `#card-container`，否则截图失败。**

**不支持纯文本输入**（如需文本请先整理为 Markdown 文件或 HTML）。  

## 尺寸

- **默认模式（无 preset）**：宽度 1080px，高度自适应  
- **固定模式（有 preset）**：使用预设尺寸，内容超出会被隐藏并可显示省略号

固定模式下会强制注入 `#card-container` 的尺寸与 `overflow: hidden`（对 HTML/URL 同样生效）。

**预设尺寸**：
- `og` 1200×630  
- `square` 1080×1080  
- `story` 1080×1920  
- `portrait` 1200×1500  
- `banner` 1600×900  

## 输出

- `pngPath`（必需）
- `htmlPath`（默认保留，`--no-html` 可关闭）
- `meta.json`（包含 Chromium 版本、尺寸、preset（auto/预设名）、输入摘要 hash、截图模式）

## 主题样式

| 主题 | 风格 | 适用场景 |
|------|------|----------|
| `default` | 极简专业，柔和渐变背景 | 技术分享、日常笔记 |
| `sketch` | 手绘笔记，横线纸张效果 | 创意内容、学习笔记 |
| `magazine` | 杂志排版，衬线字体 | 正式文章、长文推广 |
| `bold` | 深色背景，金色青色光晕 | 产品发布、技术公告 |
| `poster` | 梦幻海报，紫粉蓝渐变 | 社交分享、营销海报 |

## 水印

水印**默认不显示**。调用者可通过 `--watermark` 参数添加：

```bash
# 添加水印
node scripts/converter.js --input doc.md --style bold --watermark "Leon's Blog" --output out.png

# 无水印（默认）
node scripts/converter.js --input doc.md --style bold --output out.png
```

## API（Node.js 示例）

```js
import { toPng } from "./scripts/converter.js";

toPng({
  inputPath: "examples/summary.md",
  outputPath: "output.png",
  style: "bold",
  watermark: "Leon's Blog",  // 可选
  options: {
    preset: "og",
    format: "markdown",
    device_scale_factor: 2
  }
});
```

## CLI 使用

```bash
# Markdown（默认主题）
node scripts/converter.js --input doc.md --output out.png

# 指定主题
node scripts/converter.js --input doc.md --style poster --preset og --output out.png

# 带水印
node scripts/converter.js --input doc.md --style bold --watermark "My Brand" --output out.png

# HTML 文件
node scripts/converter.js --input page.html --format html --output out.png

# 直接渲染 URL
node scripts/converter.js --url https://example.com --preset banner --output out.png

```

**完整参数**：

| 参数 | 说明 |
|------|------|
| `--input` | 输入文件路径（md/html） |
| `--url` | 直接渲染 URL |
| `--output` | 输出 PNG 路径（必需） |
| `--style` | 主题：`default` / `sketch` / `magazine` / `bold` / `poster` |
| `--format` | 输入格式：`markdown` / `html` |
| `--preset` | 预设尺寸：`og` / `square` / `story` / `portrait` / `banner` |
| `--device-scale-factor` | 像素密度（默认 2） |
| `--no-html` | 不保留中间 HTML 文件 |
| `--allow-scripts` | 允许执行脚本 |
| `--css` | 追加自定义 CSS |
| `--title` | HTML 标题 |
| `--watermark` | 水印文字（默认不显示） |
| `--allow-net` | 网络白名单前缀（可重复） |
| `--wait-until` | `load`/`domcontentloaded`/`networkidle` |
| `--timeout-ms` | 超时（毫秒） |

## 目录结构

```
web-to-png/
  SKILL.md
  scripts/
    converter.js   # 核心转换器
  templates/
    default.html
    sketch.html
    magazine.html
    bold.html
    poster.html
  examples/
    demo.md
    example-*.png
```

## 渲染引擎

- Playwright + Chromium
- PNG 使用 `page.screenshot` 导出
- 支持 viewport / deviceScaleFactor

## 一致性保障

- 相同输入 + 主题 + Chromium 版本 ⇒ 输出稳定
- 打印前等待：`document.fonts.ready` + `waitUntil(networkidle)`
- 默认剥离 `<script>`（除非显式 `--allow-scripts`）

## 安全

- 可配置网络访问白名单（`--allow-net`）
- 默认禁用脚本执行
