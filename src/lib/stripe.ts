import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
});

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;
export const STRIPE_CREDITS_50_PRICE_ID = process.env.STRIPE_CREDITS_50_PRICE_ID!;
export const STRIPE_CREDITS_200_PRICE_ID = process.env.STRIPE_CREDITS_200_PRICE_ID!;

export async function getOrCreateStripeCustomer(
    userId: string,
    email: string,
    name?: string | null
): Promise<string> {
    const customer = await stripe.customers.create({
        email,
        name: name ?? undefined,
        metadata: { userId },
    });
    return customer.id;
}
