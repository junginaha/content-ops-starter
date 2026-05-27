import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const SaveSchema = z.object({
    projectId: z.string().cuid().optional(),
    title: z.string().min(1).max(255),
    content: z.record(z.unknown()),
});

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = SaveSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid payload", issues: parsed.error.issues },
            { status: 400 }
        );
    }

    const { projectId, title, content } = parsed.data;
    // Prisma requires InputJsonValue; the Zod schema guarantees a plain object
    const jsonContent = content as Prisma.InputJsonValue;

    if (projectId) {
        // Verify ownership before updating
        const existing = await prisma.project.findFirst({
            where: { id: projectId, userId: session.user.id },
            select: { id: true },
        });
        if (!existing) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        const project = await prisma.project.update({
            where: { id: projectId },
            data: { title, content: jsonContent },
            select: { id: true, title: true, updatedAt: true },
        });
        return NextResponse.json({ project });
    }

    const project = await prisma.project.create({
        data: { userId: session.user.id, title, content: jsonContent },
        select: { id: true, title: true, updatedAt: true },
    });
    return NextResponse.json({ project }, { status: 201 });
}
