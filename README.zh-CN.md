# PagePress

面向 AI Agent 的 PDF 渲染 CLI，可将本地 HTML 文件输出为高质量 PDF。

## 特性

- 专注 PDF 输出（仅 `pagepress`）
- 仅支持本地 HTML 文件输入（`.html`）
- 基于 Playwright + Chromium 的稳定打印引擎

## 安装

```bash
npm install -g @liustack/pagepress
npx playwright install chromium
```

或使用 `npx`：

```bash
npx @liustack/pagepress [options]
```

## 用法

```bash
# 本地 HTML 转 PDF
pagepress -i page.html -o output.pdf
```

## 参数

- `-i, --input <path>` 输入 HTML 路径
- `-o, --output <path>` 输出 PDF 路径
- `--wait-until <state>` `load | domcontentloaded | networkidle`
- `--timeout <ms>` 超时时间（毫秒）
- `--safe` 禁用外部网络请求和 JavaScript 执行

## AI Agent Skill

- [pagepress/SKILL.md](skills/pagepress/SKILL.md)

## License

MIT
