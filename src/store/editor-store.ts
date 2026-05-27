"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { JSONContent } from "@tiptap/react";

interface EditorState {
    projectId: string | null;
    title: string;
    content: JSONContent;
    isDirty: boolean;
    isSaving: boolean;
    lastSavedAt: string | null; // ISO string for serialisation
    setProjectId: (id: string | null) => void;
    setTitle: (title: string) => void;
    setContent: (content: JSONContent) => void;
    setIsDirty: (dirty: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setLastSavedAt: (date: string | null) => void;
    markSaved: () => void;
    reset: () => void;
}

const defaultContent: JSONContent = {
    type: "doc",
    content: [
        {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Untitled Project" }],
        },
        {
            type: "paragraph",
            content: [{ type: "text", text: "Start writing your story…" }],
        },
    ],
};

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            projectId: null,
            title: "Untitled Project",
            content: defaultContent,
            isDirty: false,
            isSaving: false,
            lastSavedAt: null,
            setProjectId: (id) => set({ projectId: id }),
            setTitle: (title) => set({ title, isDirty: true }),
            setContent: (content) => set({ content, isDirty: true }),
            setIsDirty: (isDirty) => set({ isDirty }),
            setIsSaving: (isSaving) => set({ isSaving }),
            setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
            markSaved: () =>
                set({ isDirty: false, isSaving: false, lastSavedAt: new Date().toISOString() }),
            reset: () =>
                set({
                    projectId: null,
                    title: "Untitled Project",
                    content: defaultContent,
                    isDirty: false,
                    isSaving: false,
                    lastSavedAt: null,
                }),
        }),
        {
            name: "ai-publisher-draft",
            storage: createJSONStorage(() => localStorage),
            // Only persist the document state — not loading flags
            partialize: (state) => ({
                projectId: state.projectId,
                title: state.title,
                content: state.content,
            }),
        }
    )
);
