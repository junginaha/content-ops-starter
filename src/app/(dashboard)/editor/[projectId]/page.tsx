import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MainCanvas } from "@/components/layout/main-canvas";
import type { JSONContent } from "@tiptap/react";

interface EditorPageProps {
    params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: EditorPageProps) {
    const { projectId } = await params;
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { title: true },
    });
    return { title: project ? `${project.title} — AI Publisher` : "Editor — AI Publisher" };
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { projectId } = await params;
    const session = await auth();

    if (!session?.user?.id) redirect("/login");

    const project = await prisma.project.findFirst({
        where: { id: projectId, userId: session.user.id },
    });

    if (!project) notFound();

    return (
        <MainCanvas
            projectId={project.id}
            initialTitle={project.title}
            initialContent={project.content as JSONContent}
        />
    );
}
