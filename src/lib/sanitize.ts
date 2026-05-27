import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

// Server-side DOMPurify wrapper — JSDOM provides the browser-like environment
// that DOMPurify requires. Called before ANY HTML is passed to Puppeteer or epub-gen.
export function sanitizeHtml(dirty: string): string {
    const window = new JSDOM("").window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const purify = DOMPurify(window as any);
    return purify.sanitize(dirty, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
        ALLOW_DATA_ATTR: false,
    });
}
