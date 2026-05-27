import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import type { ProjectSummary } from "@/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const [projects, aiCredit] = await Promise.all([
        prisma.project.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
            take: 50,
        }),
        prisma.aiCredit.findUnique({ where: { userId: session.user.id } }),
    ]);

    const projectSummaries: ProjectSummary[] = projects.map((p) => ({
        id: p.id,
        title: p.title,
        updatedAt: p.updatedAt,
    }));

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <TopNavbar
                userName={session.user.name}
                userEmail={session.user.email}
                userImage={session.user.image}
                creditBalance={aiCredit?.balance ?? 0}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar projects={projectSummaries} />
                <main className="flex-1 overflow-hidden">{children}</main>
            </div>
        </div>
    );
}
