import { NextRequest, NextResponse } from "next/server";

// Phase 3 implementation placeholder — returns 501 until Phase 3 is complete.
// Rate limiting, credit deduction, and OpenAI Structured Outputs are wired here.
export async function POST(_req: NextRequest) {
    return NextResponse.json(
        { error: "AI modify endpoint is implemented in Phase 3." },
        { status: 501 }
    );
}
