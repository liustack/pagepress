import test from "node:test";
import assert from "node:assert/strict";

import { resolveCaptureOptions, normalizeInput } from "./converter.js";

test("preset og 采用固定 viewport 且 fullPage=false", () => {
  const result = resolveCaptureOptions("og");
  assert.deepEqual(result.viewport, { width: 1200, height: 630 });
  assert.equal(result.fullPage, false);
  assert.equal(result.injectCss, true);
});

test("默认行为为 screenshot", () => {
  const result = resolveCaptureOptions();
  assert.deepEqual(result.viewport, { width: 1280, height: 720 });
  assert.equal(result.fullPage, true);
  assert.equal(result.injectCss, false);
});

test("preset infographic 使用宽度 1080 且 fullPage=true", () => {
  const result = resolveCaptureOptions("infographic");
  assert.deepEqual(result.viewport, { width: 1080, height: 800 });
  assert.equal(result.fullPage, true);
  assert.equal(result.injectCss, false);
});

test("normalizeInput 拒绝 content 和非 html 格式", () => {
  assert.throws(() => normalizeInput({ content: "x" }), /不支持 content/);
  assert.throws(() => normalizeInput({ format: "markdown" }), /仅支持 html 格式/);
});

test("normalizeInput 需要 input 或 url", () => {
  assert.throws(() => normalizeInput({}), /必须提供/);
});
