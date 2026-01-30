import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { toPng } from "../converter.js";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(path.dirname(__filename));

const outputs = path.join(ROOT, "outputs");
const examples = path.join(ROOT, "examples");

fs.mkdirSync(outputs, { recursive: true });

const markdownInput = path.join(examples, "summary.md");
const htmlInput = path.join(examples, "card.html");

const tasks = [
  {
    inputPath: markdownInput,
    outputPath: path.join(outputs, "og-card-bold.png"),
    style: "card-bold",
    options: { preset: "og", format: "markdown", title: "OG Card" },
  },
  {
    inputPath: markdownInput,
    outputPath: path.join(outputs, "square-card-clean.png"),
    style: "card-clean",
    options: { preset: "square", format: "markdown", title: "Square Card" },
  },
  {
    inputPath: htmlInput,
    outputPath: path.join(outputs, "story-card-poster.png"),
    style: "card-poster",
    options: { preset: "story", format: "html", title: "Story Card" },
  },
];

for (const task of tasks) {
  // eslint-disable-next-line no-await-in-loop
  await toPng({
    ...task,
    keepHtml: false,
  });
}

console.log(`Smoke outputs written to ${outputs}`);
