/**
 * Structured, privacy-safe event logger. Never pass raw user text, IPs, or other
 * identifying values into `details` — only non-identifying metadata (counts, enums, status codes).
 */
export function logEvent(name: string, details: Record<string, string | number | boolean | undefined> = {}): void {
    const safeDetails = Object.fromEntries(Object.entries(details).filter(([, value]) => value !== undefined));
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ event: name, ts: new Date().toISOString(), ...safeDetails }));
}
