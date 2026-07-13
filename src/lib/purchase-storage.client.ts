'use client';

const KEY = 'travelog-purchases';

type PurchaseMap = Record<string, string>; // posterId -> orderId

function read(): PurchaseMap {
    if (typeof window === 'undefined') return {};
    try {
        return JSON.parse(window.localStorage.getItem(KEY) ?? '{}');
    } catch {
        return {};
    }
}

export function getStoredOrderId(posterId: string): string | null {
    return read()[posterId] ?? null;
}

export function rememberPurchase(posterId: string, orderId: string) {
    if (typeof window === 'undefined') return;
    const map = read();
    map[posterId] = orderId;
    window.localStorage.setItem(KEY, JSON.stringify(map));
}
