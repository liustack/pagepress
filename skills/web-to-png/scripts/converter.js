#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";
import anchor from "markdown-it-anchor";
import toc from "markdown-it-toc-done-right";

const __filename = fileURLToPath(import.meta.url);
const SCRIPTS = path.dirname(__filename);
const ROOT = path.dirname(SCRIPTS);
const TEMPLATES = path.join(ROOT, "templates");

const DEFAULT_WIDTH = 1080;
const DEFAULT_VIEWPORT_HEIGHT = 800;

const PRESETS = {
  og: { width: 1200, height: 630 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  portrait: { width: 1200, height: 1500 },
  banner: { width: 1600, height: 900 },
};

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`找不到文件: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf-8").digest("hex");
}

function sanitizeHtml(html, allowScripts = false) {
  if (allowScripts) return html;
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}

function markdownToHtml(md) {
  const mdIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str) => {
      const escaped = mdIt.utils.escapeHtml(str);
      return `<pre><code>${escaped}</code></pre>`;
    },
  });

  mdIt.use(footnote);
  mdIt.use(anchor, {
    slugify: (s) =>
      encodeURIComponent(
        String(s)
          .trim()
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\- ]+/g, "")
          .replace(/\s+/g, "-")
      ),
  });
  mdIt.use(toc, {
    level: [1, 2, 3, 4],
    listType: "ul",
    markerPattern: /^\[TOC\]$/i,
  });

  return mdIt.render(md);
}

function renderTemplate(title, bodyHtml, style, customCss, watermark, modeClass) {
  const templatePath = path.join(TEMPLATES, `${style}.html`);
  let html = readText(templatePath)
    .replace(/{{title}}/g, title)
    .replace(/{{body}}/g, bodyHtml)
    .replace(/{{modeClass}}/g, modeClass || "");

  // 处理水印
  if (watermark) {
    html = html.replace(/{{watermark}}/g, watermark);
    // 显示水印元素
    html = html.replace('class="watermark"', 'class="watermark visible"');
  } else {
    html = html.replace(/{{watermark}}/g, "");
  }

  const customStyleBlock = customCss ? `<style>${customCss}</style>` : "";
  if (html.includes("{{styles}}")) {
    html = html.replace("{{styles}}", customStyleBlock);
  } else if (customCss) {
    html = html.replace("</head>", `${customStyleBlock}</head>`);
  }

  return html;
}

function resolveViewport({ preset }) {
  if (preset) {
    const size = PRESETS[preset];
    if (!size) {
      throw new Error(`不支持的 preset: ${preset}`);
    }
    return { width: size.width, height: size.height };
  }
  return { width: DEFAULT_WIDTH, height: DEFAULT_VIEWPORT_HEIGHT };
}

async function renderPngWithPlaywright(
  htmlOrUrl,
  pngPath,
  viewport,
  options,
  waitUntil,
  timeoutMs,
  allowScripts,
  networkWhitelist
) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (err) {
    return null;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: options.deviceScaleFactor ?? 2,
  });

  if (Array.isArray(networkWhitelist) && networkWhitelist.length > 0) {
    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (networkWhitelist.some((prefix) => url.startsWith(prefix))) {
        route.continue();
      } else {
        route.abort();
      }
    });
  }

  if (/^https?:\/\//i.test(htmlOrUrl) || /^file:\/\//i.test(htmlOrUrl)) {
    await page.goto(htmlOrUrl, { waitUntil, timeout: timeoutMs });
  } else {
    await page.setContent(htmlOrUrl, { waitUntil, timeout: timeoutMs });
  }

  if (!allowScripts) {
    await page.addScriptTag({
      content: "document.querySelectorAll('script').forEach(s=>s.remove())",
    });
  }

  await page.evaluate("document.fonts && document.fonts.ready");

  if (options.mode === "fixed" && options.presetSize) {
    const { width, height } = options.presetSize;
    const fixedCss = `
#card-container { width: ${width}px; height: ${height}px; overflow: hidden; }
#card-container * { max-width: 100%; }
`;
    await page.addStyleTag({ content: fixedCss });
  }

  const card = await page.$("#card-container");
  if (!card) {
    await browser.close();
    throw new Error("未找到 #card-container，无法截图。");
  }

  if (options.mode === "auto") {
    const box = await card.boundingBox();
    const height = Math.ceil(box?.height || 0);
    if (!height) {
      await browser.close();
      throw new Error("无法获取 #card-container 高度。");
    }
    await page.setViewportSize({ width: viewport.width, height });
  }

  await card.screenshot({ path: pngPath, type: "png" });
  const finalViewport = page.viewportSize() || viewport;

  const version = browser.version();
  await browser.close();
  return { version, mode: options.mode, viewport: finalViewport };
}

export async function toPng({
  inputPath,
  content,
  url,
  outputPath,
  style = "default",
  customCssPath,
  keepHtml = true,
  allowScripts = false,
  networkWhitelist,
  watermark = null,
  options = {},
}) {
  if (content) {
    throw new Error("不支持 content，请使用 Markdown 文件或 HTML/URL。");
  }

  if (options.format === "text") {
    throw new Error("不支持 text 格式，请使用 Markdown 文件或 HTML/URL。");
  }

  if (!inputPath && !url) {
    throw new Error("必须提供 input_path 或 url 之一");
  }

  const waitUntil = options.wait_until || "networkidle";
  const timeoutMs = Number(options.timeout_ms || 30000);
  let rawContent = "";
  if (inputPath) rawContent = readText(inputPath);

  const customCss = customCssPath ? readText(customCssPath) : null;

  let html = "";
  const presetSize = options.preset ? PRESETS[options.preset] : null;
  const modeClass = options.preset ? "mode-fixed" : "mode-auto";
  const modeCss = options.preset
    ? `
#card-container { width: ${presetSize.width}px; height: ${presetSize.height}px; overflow: hidden; }
.content-container { width: 100%; height: 100%; overflow: hidden; position: relative; }
#card-container * { max-width: 100%; }
#card-container h1,
#card-container h2,
#card-container h3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
#card-container p,
#card-container li,
#card-container blockquote {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
  text-overflow: ellipsis;
}
#card-container h1::first-letter {
  font-size: 1em;
}
#card-container pre {
  max-height: 200px;
  overflow: hidden;
  position: relative;
}
#card-container pre::after {
  content: "…";
  position: absolute;
  right: 16px;
  bottom: 12px;
  color: currentColor;
  opacity: 0.6;
}
`
    : `
#card-container { width: ${DEFAULT_WIDTH}px; height: auto; }
.content-container { width: 100%; height: auto; overflow: visible; position: relative; }
`;
  const mergedCss = [modeCss, customCss].filter(Boolean).join("\n");

  if (url) {
    html = url;
  } else {
    // 检查是否为完整 HTML 文档
    const isFullHtml = options.format === "html" && /^\s*(<!DOCTYPE|<html)/i.test(rawContent);

    if (isFullHtml) {
      html = rawContent;
      if (mergedCss) {
        if (html.includes("</head>")) {
          html = html.replace("</head>", `<style>${mergedCss}</style></head>`);
        } else {
          html = `<style>${mergedCss}</style>${html}`;
        }
      }
    } else {
      if (options.format === "html") {
        html = rawContent;
      } else {
        html = markdownToHtml(rawContent);
      }
      html = sanitizeHtml(html, allowScripts);
      html = renderTemplate(
        options.title || "Web-to-PNG",
        html,
        style,
        mergedCss,
        watermark,
        modeClass
      );
    }
  }

  const outputPng = path.resolve(outputPath || "output.png");
  const outputHtml = outputPng.replace(/\.png$/i, "") + ".html";

  if (keepHtml && !url) {
    fs.writeFileSync(outputHtml, html, "utf-8");
  }

  const viewport = resolveViewport({
    preset: options.preset || "auto",
  });

  let chromiumVersion = null;
  let screenshotMode = null;
  let resultViewport = null;

  if (url) {
    const result = await renderPngWithPlaywright(
      url,
      outputPng,
      viewport,
      {
        mode: options.preset ? "fixed" : "auto",
        presetSize: options.preset ? PRESETS[options.preset] : null,
        deviceScaleFactor: options.device_scale_factor ?? 2,
      },
      waitUntil,
      timeoutMs,
      allowScripts,
      networkWhitelist
    );
    chromiumVersion = result?.version || null;
    screenshotMode = result?.mode || null;
    resultViewport = result?.viewport || null;
  } else {
    fs.writeFileSync(outputHtml, html, "utf-8");
    const fileUrl = `file://${outputHtml}`;
    const result = await renderPngWithPlaywright(
      fileUrl,
      outputPng,
      viewport,
      {
        mode: options.preset ? "fixed" : "auto",
        presetSize: options.preset ? PRESETS[options.preset] : null,
        deviceScaleFactor: options.device_scale_factor ?? 2,
      },
      waitUntil,
      timeoutMs,
      allowScripts,
      networkWhitelist
    );
    chromiumVersion = result?.version || null;
    screenshotMode = result?.mode || null;
    resultViewport = result?.viewport || null;
  }

  if (!chromiumVersion) {
    throw new Error("无法渲染 PNG。请安装 Playwright（推荐）");
  }

  if (!keepHtml && fs.existsSync(outputHtml)) {
    fs.unlinkSync(outputHtml);
  }

  const meta = {
    engine: `chromium:${chromiumVersion}`,
    generatedAt: new Date().toISOString(),
    preset: options.preset || null,
    width: resultViewport?.width || viewport.width,
    height: resultViewport?.height || viewport.height,
    deviceScaleFactor: options.device_scale_factor ?? 2,
    style,
    screenshotMode,
    inputHash: sha256(rawContent || url || ""),
  };
  const metaPath = outputPng.replace(/\.png$/i, "") + ".meta.json";
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");

  return {
    pngPath: outputPng,
    htmlPath: keepHtml ? outputHtml : null,
    meta,
    metaPath,
  };
}

function parseArgs(argv) {
  const args = {
    input: null,
    url: null,
    output: null,
    style: "default",
    format: "markdown",
    preset: null,
    deviceScaleFactor: 2,
    noHtml: false,
    allowScripts: false,
    customCss: null,
    title: null,
    watermark: null,
    allowNet: [],
    waitUntil: "networkidle",
    timeoutMs: 30000,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--input") args.input = argv[++i];
    else if (a === "--content") {
      throw new Error("不支持 --content，请使用 Markdown 文件或 HTML/URL。");
    }
    else if (a === "--url") args.url = argv[++i];
    else if (a === "--output") args.output = argv[++i];
    else if (a === "--style") args.style = argv[++i];
    else if (a === "--format") args.format = argv[++i];
    else if (a === "--preset") args.preset = argv[++i];
    else if (a === "--width" || a === "--height") {
      throw new Error("不支持 --width/--height，请使用 --preset 或默认自适应高度。");
    }
    else if (a === "--device-scale-factor") args.deviceScaleFactor = Number(argv[++i]);
    else if (a === "--full-page" || a === "--clip") {
      throw new Error("不支持 --full-page/--clip，仅截图 #card-container。");
    }
    else if (a === "--no-html") args.noHtml = true;
    else if (a === "--allow-scripts") args.allowScripts = true;
    else if (a === "--css") args.customCss = argv[++i];
    else if (a === "--title") args.title = argv[++i];
    else if (a === "--watermark") args.watermark = argv[++i];
    else if (a === "--allow-net") args.allowNet.push(argv[++i]);
    else if (a === "--wait-until") args.waitUntil = argv[++i];
    else if (a === "--timeout-ms") args.timeoutMs = Number(argv[++i]);
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!args.output) {
    throw new Error("必须提供 --output");
  }

  if (!["markdown", "html"].includes(args.format)) {
    throw new Error("不支持该格式，仅支持 markdown 或 html");
  }

  if (args.preset && !PRESETS[args.preset]) {
    throw new Error(`不支持的 preset: ${args.preset}`);
  }

  return args;
}

function printHelp() {
  console.log(`web-to-png converter

Usage:
  node converter.js --input <file> --output <file.png> [options]
  node converter.js --url <url> --output <file.png> [options]

Options:
  --style <default|sketch|magazine|bold|poster>
  --format <markdown|html>
  --preset <og|square|story|portrait|banner>   (不传则宽 1080，高度自适应)
  --device-scale-factor <number>
  --no-html
  --allow-scripts
  --css <path>
  --title <title>
  --watermark <text>  (optional watermark text)
  --allow-net <prefix> (can be repeated)
  --wait-until <load|domcontentloaded|networkidle>
  --timeout-ms <number>
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await toPng({
    inputPath: args.input,
    url: args.url,
    outputPath: args.output,
    style: args.style,
    customCssPath: args.customCss,
    keepHtml: !args.noHtml,
    allowScripts: args.allowScripts,
    networkWhitelist: args.allowNet,
    watermark: args.watermark,
    options: {
      format: args.format,
      preset: args.preset,
      device_scale_factor: args.deviceScaleFactor,
      title: args.title,
      wait_until: args.waitUntil,
      timeout_ms: args.timeoutMs,
    },
  });
  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  });
}
