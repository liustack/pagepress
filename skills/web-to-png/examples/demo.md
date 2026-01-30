# Web-to-PNG 完整指南

将 Markdown、HTML 或网页 URL 渲染为高质量 PNG 图片。

## 核心特性

- **5 种精美主题**：Default、Sketch、Magazine、Bold、Poster
- **高度自适应**：内容多长就截多长，永不截断
- **2x Retina 输出**：清晰锐利，适合各种屏幕
- **可选水印**：品牌标识轻松添加

## 使用示例

```bash
node converter.js \
  --input article.md \
  --style bold \
  --output card.png
```

## 技术栈

本工具基于 Playwright 渲染引擎，支持完整的 CSS3 和现代 Web 特性。

> 💡 **提示**：所有渲染均在本地完成，无需联网，数据安全有保障。
