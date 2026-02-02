---
title: PagePress 样例文档
---

# PagePress 样例文档

这是一份用于展示 PagePress PDF 渲染效果的样例文档。

## 特性概览

PagePress 支持以下功能：

- **Markdown 转 PDF**：支持完整的 GFM 语法
- **代码高亮**：自动识别语言并高亮
- **多种模板**：default、github、magazine

## 代码示例

```typescript
import { render } from './pdf/renderer.ts';

const result = await render({
  input: 'document.md',
  output: 'document.pdf',
  template: 'default',
});

console.log('PDF generated:', result.pdfPath);
```

## 表格示例

| 模板 | 风格 | 适用场景 |
|------|------|----------|
| default | Apple 风格 | 技术文档 |
| github | GitHub 风格 | 开源项目 |
| magazine | 杂志排版 | 营销材料 |

## 引用示例

> 好的设计是尽可能少的设计。
> — Dieter Rams

## 列表示例

1. 第一步：安装 PagePress
2. 第二步：安装 Playwright 浏览器
3. 第三步：运行命令生成 PDF

---

*由 PagePress 生成*
