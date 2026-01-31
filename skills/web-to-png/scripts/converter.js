#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const DEFAULT_SCREENSHOT_VIEWPORT = { width: 1280, height: 720 };

const PRESETS = {
  og: { width: 1200, height: 630 },
  post: { width: 1080, height: 1080 },
  infographic: { width: 1080, height: 1350 },
  poster: { width: 1200, height: 1500 },
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

export function resolveCaptureOptions(preset) {
  if (preset) {
    const size = PRESETS[preset];
    if (!size) {
      throw new Error(`不支持的 preset: ${preset}`);
    }
    return {
      viewport: { width: size.width, height: size.height },
      fullPage: false,
      injectCss: true,
    };
  }
  return {
    viewport: { ...DEFAULT_SCREENSHOT_VIEWPORT },
    fullPage: true,
    injectCss: false,
  };
}

export function normalizeInput({ inputPath, url, content, format }) {
  if (content) {
    throw new Error("不支持 content，请使用 HTML 文件或 URL。");
  }
  if (format && format !== "html") {
    throw new Error("仅支持 html 格式。请使用 HTML 文件或 URL。");
  }
  if (!inputPath && !url) {
    throw new Error("必须提供 input 或 url 之一");
  }
  if (inputPath && url) {
    throw new Error("不能同时使用 input 和 url，请二选一");
  }
  return { inputPath, url };
}

async function renderPngWithPlaywright({
  inputPath,
  url,
  pngPath,
  capture,
  allowScripts,
  networkWhitelist,
  waitUntil,
  timeoutMs,
  deviceScaleFactor,
}) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (err) {
    return null;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: capture.viewport,
    deviceScaleFactor,
  });

  if (Array.isArray(networkWhitelist) && networkWhitelist.length > 0) {
    await page.route("**/*", (route) => {
      const requestUrl = route.request().url();
      if (networkWhitelist.some((prefix) => requestUrl.startsWith(prefix))) {
        route.continue();
      } else {
        route.abort();
      }
    });
  }

  if (url) {
    await page.goto(url, { waitUntil, timeout: timeoutMs });
  } else {
    const fileUrl = pathToFileURL(path.resolve(inputPath)).href;
    await page.goto(fileUrl, { waitUntil, timeout: timeoutMs });
  }

  if (!allowScripts) {
    await page.addScriptTag({
      content: "document.querySelectorAll('script').forEach(s=>s.remove())",
    });
  }

  if (capture.injectCss) {
    const { width, height } = capture.viewport;
    const fixedCss = `
html, body {
  width: ${width}px;
  height: ${height}px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
`;
    await page.addStyleTag({ content: fixedCss });
  }

  await page.evaluate("document.fonts && document.fonts.ready");

  await page.screenshot({
    path: pngPath,
    type: "png",
    fullPage: capture.fullPage,
  });

  const version = browser.version();
  const viewport = page.viewportSize() || capture.viewport;
  await browser.close();
  return { version, viewport };
}

export async function toPng({
  inputPath,
  content,
  url,
  outputPath,
  allowScripts = false,
  networkWhitelist,
  options = {},
}) {
  normalizeInput({ inputPath, url, content, format: options.format });

  if (!outputPath) {
    throw new Error("必须提供 outputPath");
  }

  const waitUntil = options.wait_until || "networkidle";
  const timeoutMs = Number(options.timeout_ms || 30000);
  const deviceScaleFactor = Number(options.device_scale_factor || 2);

  const capture = resolveCaptureOptions(options.preset || null);
  const outputPng = path.resolve(outputPath);

  const rawContent = inputPath ? readText(inputPath) : String(url || "");

  const result = await renderPngWithPlaywright({
    inputPath,
    url,
    pngPath: outputPng,
    capture,
    allowScripts,
    networkWhitelist,
    waitUntil,
    timeoutMs,
    deviceScaleFactor,
  });

  if (!result?.version) {
    throw new Error("无法渲染 PNG。请安装 Playwright 并执行 playwright install chromium。");
  }

  const meta = {
    engine: `chromium:${result.version}`,
    generatedAt: new Date().toISOString(),
    preset: options.preset || null,
    width: result.viewport.width,
    height: result.viewport.height,
    fullPage: capture.fullPage,
    deviceScaleFactor,
    inputHash: sha256(rawContent),
  };

  const writeMeta = Boolean(options.write_meta || options.meta_path);
  const metaPath = writeMeta
    ? path.resolve(options.meta_path || outputPng.replace(/\.png$/i, "") + ".meta.json")
    : null;
  if (metaPath) {
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");
  }

  return {
    pngPath: outputPng,
    meta,
    metaPath,
  };
}

function parseArgs(argv) {
  const args = {
    input: null,
    url: null,
    output: null,
    preset: null,
    writeMeta: false,
    metaPath: null,
    deviceScaleFactor: 2,
    allowScripts: false,
    allowNet: [],
    waitUntil: "networkidle",
    timeoutMs: 30000,
    autoCleanup: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--input") args.input = argv[++i];
    else if (a === "--url") args.url = argv[++i];
    else if (a === "--output") args.output = argv[++i];
    else if (a === "--preset") args.preset = argv[++i];
    else if (a === "--meta") {
      args.writeMeta = true;
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args.metaPath = next;
        i += 1;
      }
    } else if (a === "--device-scale-factor") args.deviceScaleFactor = Number(argv[++i]);
    else if (a === "--allow-scripts") args.allowScripts = true;
    else if (a === "--allow-net") args.allowNet.push(argv[++i]);
    else if (a === "--wait-until") args.waitUntil = argv[++i];
    else if (a === "--timeout-ms") args.timeoutMs = Number(argv[++i]);
    else if (a === "--auto-cleanup") args.autoCleanup = true;
    else if (["--content", "--format", "--style", "--watermark", "--css"].includes(a)) {
      throw new Error("该参数已移除，仅支持 HTML 文件或 URL 输入。");
    } else if (["--width", "--height", "--clip", "--full-page"].includes(a)) {
      throw new Error("不支持该参数，请使用 --preset 或默认长图模式。");
    } else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!args.output) {
    throw new Error("必须提供 --output");
  }

  normalizeInput({ inputPath: args.input, url: args.url });

  if (args.preset && args.preset !== "infographic" && !PRESETS[args.preset]) {
    throw new Error(`不支持的 preset: ${args.preset}`);
  }

  return args;
}

function printHelp() {
  console.log(`web-to-png converter

Usage:
  node scripts/converter.js --input <file.html> --output <file.png> [options]
  node scripts/converter.js --url <url> --output <file.png> [options]

Options:
  --preset <og|post|infographic|poster|banner>
  --meta [path]
  --device-scale-factor <number>
  --allow-scripts
  --allow-net <prefix> (can be repeated)
  --wait-until <load|domcontentloaded|networkidle>
  --timeout-ms <number>
  --auto-cleanup (delete input file after processing)
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await toPng({
    inputPath: args.input,
    url: args.url,
    outputPath: args.output,
    allowScripts: args.allowScripts,
    networkWhitelist: args.allowNet,
    options: {
      preset: args.preset,
      write_meta: args.writeMeta,
      meta_path: args.metaPath,
      device_scale_factor: args.deviceScaleFactor,
      wait_until: args.waitUntil,
      timeout_ms: args.timeoutMs,
    },
  });
  console.log(JSON.stringify(result, null, 2));

  // Auto-cleanup: delete input file if requested
  if (args.autoCleanup && args.input) {
    try {
      fs.unlinkSync(args.input);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  });
}
