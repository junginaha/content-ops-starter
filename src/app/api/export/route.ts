import { NextRequest, NextResponse } from "next/server";

// Phase 4 implementation placeholder — PDF + EPUB export engine.
// Puppeteer + Paged.js (PDF) and epub-gen-memory (EPUB) are wired here.
export async function POST(_req: NextRequest) {
    return NextResponse.json(
        { error: "Export endpoint is implemented in Phase 4." },
        { status: 501 }
    );
}
