import { chromium, Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type WaitUntilState = 'load' | 'domcontentloaded' | 'networkidle';

const WAIT_UNTIL_STATES = new Set<WaitUntilState>(['load', 'domcontentloaded', 'networkidle']);

function normalizeWaitUntil(value?: string): WaitUntilState {
    if (!value) return 'networkidle';
    if (WAIT_UNTIL_STATES.has(value as WaitUntilState)) {
        return value as WaitUntilState;
    }
    throw new Error(`Invalid waitUntil: ${value}. Allowed: load, domcontentloaded, networkidle.`);
}

function normalizeTimeout(value?: number): number {
    if (value === undefined) return 30000;
    if (!Number.isFinite(value) || value < 0) {
        throw new Error('Invalid timeout. Use a non-negative number of milliseconds.');
    }
    return value;
}

export interface Options {
    input: string;
    output: string;
    safe?: boolean;
    waitUntil?: string;
    timeout?: number;
}

export interface Result {
    pdfPath: string;
    meta: {
        generatedAt: string;
    };
}

export async function render(options: Options): Promise<Result> {
    const safeMode = options.safe ?? false;
    const waitUntil = normalizeWaitUntil(options.waitUntil);
    const timeout = normalizeTimeout(options.timeout);

    if (options.input.startsWith('http://') || options.input.startsWith('https://')) {
        throw new Error('Remote URL inputs are not supported. Please provide a local HTML file path.');
    }

    if (!options.input.endsWith('.html')) {
        throw new Error(`Unsupported input format: ${options.input}. Only HTML (.html) files are supported.`);
    }

    const inputPath = path.resolve(options.input);
    const htmlContent = fs.readFileSync(inputPath, 'utf-8');

    let browser: Browser | null = null;

    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ javaScriptEnabled: !safeMode });
        if (safeMode) {
            await context.route('**/*', (route) => {
                const url = route.request().url();
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    return route.abort();
                }
                return route.continue();
            });
        }
        const page = await context.newPage();

        // Anchor page URL to the input file location so relative local assets resolve correctly.
        await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'domcontentloaded', timeout });
        await page.setContent(htmlContent, { waitUntil, timeout });

        await page.waitForTimeout(200);

        const outputPath = path.resolve(options.output);
        await page.pdf({
            path: outputPath,
            format: 'A4',
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            printBackground: true,
        });

        return {
            pdfPath: outputPath,
            meta: {
                generatedAt: new Date().toISOString(),
            },
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
