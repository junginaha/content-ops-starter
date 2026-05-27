import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = {
    type: "doc",
    content: [
        {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "My First Publication" }],
        },
        {
            type: "paragraph",
            content: [
                {
                    type: "text",
                    text: "Start writing your story here. Use the toolbar to format text, add images, or let AI assist you.",
                },
            ],
        },
    ],
};

export default async function EditorIndexPage() {
    const session = await auth();

    if (!session?.user?.id) redirect("/login");

    // Try to find the most recently updated project
    const latest = await prisma.project.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        select: { id: true },
    });

    if (latest) {
        redirect(`/editor/${latest.id}`);
    }

    // First-time user: create a starter project and bootstrap AI credits
    const [newProject] = await prisma.$transaction([
        prisma.project.create({
            data: {
                userId: session.user.id,
                title: "My First Publication",
                content: DEFAULT_CONTENT,
            },
        }),
        prisma.aiCredit.upsert({
            where: { userId: session.user.id },
            create: { userId: session.user.id, balance: 10 },
            update: {},
        }),
    ]);

    redirect(`/editor/${newProject.id}`);
}
