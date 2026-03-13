import { describe, it, expect, afterEach } from 'vitest';
import { render } from '../src/renderer.ts';
import * as fs from 'fs';
import * as path from 'path';

const fixtures = path.resolve(__dirname, 'fixtures');
const outDir = path.resolve(__dirname, 'output');

function outPath(name: string): string {
    return path.join(outDir, name);
}

describe('render', () => {
    afterEach(() => {
        // Clean up output files
        if (fs.existsSync(outDir)) {
            for (const f of fs.readdirSync(outDir)) {
                fs.unlinkSync(path.join(outDir, f));
            }
            fs.rmdirSync(outDir);
        }
    });

    it('renders HTML to PDF', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('basic-html.pdf');
        const result = await render({
            input: path.join(fixtures, 'basic.html'),
            output: out,
        });

        expect(result.pdfPath).toBe(out);
        expect(fs.existsSync(out)).toBe(true);
        expect(fs.statSync(out).size).toBeGreaterThan(0);
    });

    it('rejects remote URLs', async () => {
        await expect(
            render({ input: 'https://example.com', output: 'out.pdf' })
        ).rejects.toThrow(/Remote URL inputs are not supported/);
    });

    it('rejects unsupported file formats', async () => {
        await expect(
            render({ input: 'file.txt', output: 'out.pdf' })
        ).rejects.toThrow(/Unsupported input format/);
    });

    it('rejects Markdown files', async () => {
        await expect(
            render({ input: 'doc.md', output: 'out.pdf' })
        ).rejects.toThrow(/Unsupported input format/);
    });

    it('result includes generatedAt timestamp', async () => {
        fs.mkdirSync(outDir, { recursive: true });
        const out = outPath('timestamp.pdf');
        const before = new Date().toISOString();
        const result = await render({
            input: path.join(fixtures, 'basic.html'),
            output: out,
        });
        const after = new Date().toISOString();

        expect(result.meta.generatedAt >= before).toBe(true);
        expect(result.meta.generatedAt <= after).toBe(true);
    });
});
