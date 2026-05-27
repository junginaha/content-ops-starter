import { NextRequest, NextResponse } from "next/server";

// Phase 5 implementation placeholder — Stripe webhook handler.
// Subscription and credit upserts via prisma are wired here.
export async function POST(_req: NextRequest) {
    return NextResponse.json(
        { error: "Stripe webhook is implemented in Phase 5." },
        { status: 501 }
    );
}
