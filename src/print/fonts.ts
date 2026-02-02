/**
 * 本地字体 CSS 注入模块
 * 使用 Fontsource npm 包替代 Google Fonts CDN
 */

import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';

const require = createRequire(import.meta.url);

// Magazine 模板使用的字体
const MAGAZINE_FONTS = [
    '@fontsource/bebas-neue/400.css',
    '@fontsource/cormorant-garamond/400.css',
    '@fontsource/cormorant-garamond/400-italic.css',
    '@fontsource/cormorant-garamond/600.css',
    '@fontsource/inter/300.css',
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
];

/**
 * 获取指定模板的字体 CSS（含内联的 woff2 base64）
 */
export function getFontCSS(template: string): string {
    if (template !== 'magazine') {
        return ''; // 其他模板使用系统字体
    }

    const cssChunks: string[] = [];

    for (const fontPath of MAGAZINE_FONTS) {
        try {
            const cssFilePath = require.resolve(fontPath);
            let css = fs.readFileSync(cssFilePath, 'utf-8');

            // 将相对路径的 woff2 文件转为 base64 内联
            const cssDir = path.dirname(cssFilePath);
            css = css.replace(/url\(\.\/files\/([^)]+)\)/g, (match, filename) => {
                const fontFilePath = path.join(cssDir, 'files', filename);
                if (fs.existsSync(fontFilePath)) {
                    const fontData = fs.readFileSync(fontFilePath);
                    const base64 = fontData.toString('base64');
                    const ext = path.extname(filename).slice(1);
                    const mimeType = ext === 'woff2' ? 'font/woff2' : `font/${ext}`;
                    return `url(data:${mimeType};base64,${base64})`;
                }
                return match;
            });

            cssChunks.push(css);
        } catch (e) {
            console.warn(`Warning: Could not load font ${fontPath}:`, e);
        }
    }

    return cssChunks.join('\n');
}
