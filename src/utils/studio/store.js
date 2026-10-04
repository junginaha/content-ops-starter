import { useCallback, useEffect, useState } from 'react';
import { makeId } from './id';

const NAMESPACE = 'question-studio:v1:';

function readStorage(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = window.localStorage.getItem(NAMESPACE + key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

function writeStorage(key, value) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
    } catch (e) {
        // storage unavailable, ignore
    }
}

/**
 * Generic localStorage-backed collection. Seeds on first read, persists on change.
 */
export function useCollection(key, seed) {
    const [items, setItems] = useState(() => seed || []);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setItems(readStorage(key, seed || []));
        setHydrated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => {
        if (hydrated) writeStorage(key, items);
    }, [key, items, hydrated]);

    const add = useCallback((item) => {
        const withId = { id: item.id || makeId(key), ...item };
        setItems((prev) => [withId, ...prev]);
        return withId;
    }, [key]);

    const update = useCallback((id, patch) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...(typeof patch === 'function' ? patch(it) : patch) } : it)));
    }, []);

    const remove = useCallback((id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }, []);

    const get = useCallback((id) => items.find((it) => it.id === id), [items]);

    return { items, hydrated, add, update, remove, get, setItems };
}

export function useProjects() {
    return useCollection('projects', []);
}

export function useBooksStore(seed) {
    return useCollection('books', seed);
}

export function useTrendsStore(seed) {
    return useCollection('trends', seed);
}

export function useQuestionsStore(seed) {
    return useCollection('questions', seed);
}

export function usePromptsStore(seed) {
    return useCollection('prompts', seed);
}

export function useSettings(defaults) {
    const [settings, setSettings] = useState(defaults);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setSettings(readStorage('settings', defaults));
        setHydrated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (hydrated) writeStorage('settings', settings);
    }, [settings, hydrated]);

    const update = useCallback((patch) => {
        setSettings((prev) => ({ ...prev, ...patch }));
    }, []);

    return { settings, update, hydrated };
}
