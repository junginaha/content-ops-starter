'use client';

declare global {
    interface Window {
        TossPayments?: (clientKey: string) => {
            requestPayment: (method: string, options: Record<string, unknown>) => Promise<void>;
        };
    }
}

const SDK_URL = 'https://js.tosspayments.com/v1/payment';
let loadPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
        if (window.TossPayments) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = SDK_URL;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Toss Payments SDK'));
        document.head.appendChild(script);
    });
    return loadPromise;
}

export async function requestTossPayment(clientKey: string, options: { amount: number; orderId: string; orderName: string; successUrl: string; failUrl: string }) {
    await loadScript();
    if (!window.TossPayments) throw new Error('Toss Payments SDK unavailable');
    const tossPayments = window.TossPayments(clientKey);
    await tossPayments.requestPayment('CARD', {
        amount: options.amount,
        orderId: options.orderId,
        orderName: options.orderName,
        successUrl: options.successUrl,
        failUrl: options.failUrl
    });
}
