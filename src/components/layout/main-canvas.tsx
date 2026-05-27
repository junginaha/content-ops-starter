"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editor-store";
import type { JSONContent } from "@tiptap/react";

interface MainCanvasProps {
    projectId: string;
    initialTitle: string;
    initialContent: JSONContent;
    onSavingChange?: (isSaving: boolean) => void;
    onLastSavedAtChange?: (date: string | null) => void;
}

export function MainCanvas({
    projectId,
    initialTitle,
    initialContent,
    onSavingChange,
    onLastSavedAtChange,
}: MainCanvasProps) {
    const {
        setProjectId,
        title,
        setTitle,
        setContent,
        isDirty,
        isSaving,
        setIsSaving,
        setIsDirty,
        lastSavedAt,
        setLastSavedAt,
        markSaved,
    } = useEditorStore();

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialisedRef = useRef(false);

    // Hydrate store from server props on first mount
    useEffect(() => {
        if (isInitialisedRef.current) return;
        isInitialisedRef.current = true;
        setProjectId(projectId);
        setTitle(initialTitle);
        setContent(initialContent);
        setIsDirty(false);
    }, [projectId, initialTitle, initialContent, setProjectId, setTitle, setContent, setIsDirty]);

    const save = useCallback(async () => {
        const { projectId: pid, title: t, content: c, isDirty: dirty, isSaving: saving } =
            useEditorStore.getState();
        if (!dirty || saving) return;

        setIsSaving(true);
        onSavingChange?.(true);
        try {
            const res = await fetch("/api/projects/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId: pid, title: t, content: c }),
            });
            if (res.ok) {
                markSaved();
                onLastSavedAtChange?.(new Date().toISOString());
            }
        } catch {
            // swallow — will retry on next auto-save cycle
        } finally {
            setIsSaving(false);
            onSavingChange?.(false);
        }
    }, [setIsSaving, markSaved, onSavingChange, onLastSavedAtChange]);

    // Auto-save 30 s after last change
    useEffect(() => {
        if (!isDirty) return;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(save, 30_000);
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [isDirty, save]);

    // Ctrl/Cmd+S manual save
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [save]);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Editable project title */}
            <div className="border-b bg-background px-8 py-3 flex items-center gap-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project title…"
                    className="flex-1 text-lg font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground"
                />
                {isDirty && !isSaving && (
                    <span className="text-xs text-muted-foreground">Unsaved changes</span>
                )}
            </div>

            {/* Paper canvas */}
            <div className="flex-1 overflow-auto bg-muted/30 py-12 px-6">
                <div
                    className="mx-auto bg-white shadow-md rounded-sm"
                    style={{
                        width: "148mm",          // A5 width
                        minHeight: "210mm",      // A5 height
                        padding: "20mm",
                        fontFamily: "serif",
                        fontSize: "11pt",
                        lineHeight: "1.6",
                    }}
                >
                    {/*
                     * Tiptap editor mounts here in Phase 2.
                     * For Phase 1 this is a static content preview.
                     */}
                    <div className="prose prose-sm max-w-none">
                        <h1>{title}</h1>
                        <p className="text-muted-foreground text-sm mt-4">
                            The full block editor (Tiptap) is wired in Phase 2.
                            Your content is already being persisted to the database.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
