"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    BookOpen,
    ChevronRight,
    FileText,
    Layout,
    Palette,
    Plus,
    Sparkles,
} from "lucide-react";
import type { ProjectSummary } from "@/types";

interface SidebarProps {
    projects: ProjectSummary[];
}

const THEMES = [
    { id: "classic", name: "Classic", description: "Traditional book layout" },
    { id: "modern", name: "Modern", description: "Clean contemporary design" },
    { id: "minimal", name: "Minimal", description: "Distraction-free writing" },
];

export function Sidebar({ projects }: SidebarProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={300}>
            <aside className="w-60 border-r bg-background flex flex-col shrink-0">
                {/* New project button */}
                <div className="p-3 pt-4">
                    <Button asChild size="sm" className="w-full gap-2">
                        <Link href="/editor/new">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-2 pb-4 space-y-1">
                        {/* Projects section */}
                        <div className="px-2 pt-2 pb-1">
                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                <FileText className="h-3 w-3" />
                                Projects
                            </span>
                        </div>

                        {projects.length === 0 ? (
                            <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                                <Sparkles className="h-4 w-4 mx-auto mb-1 opacity-50" />
                                No projects yet
                            </div>
                        ) : (
                            projects.map((project) => {
                                const isActive = pathname === `/editor/${project.id}`;
                                return (
                                    <Tooltip key={project.id}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={`/editor/${project.id}`}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                                    isActive &&
                                                        "bg-accent text-accent-foreground font-medium"
                                                )}
                                            >
                                                <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                <span className="truncate">{project.title}</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{project.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(project.updatedAt).toLocaleDateString()}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })
                        )}

                        <Separator className="my-3" />

                        {/* Themes section */}
                        <div className="px-2 pt-1 pb-1">
                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                <Palette className="h-3 w-3" />
                                Themes
                            </span>
                        </div>

                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                className="flex items-center justify-between w-full rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <Layout className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span>{theme.name}</span>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </aside>
        </TooltipProvider>
    );
}
