import type { JSONContent } from "@tiptap/react";

export type { JSONContent };

export interface ProjectSummary {
    id: string;
    title: string;
    updatedAt: Date;
}

export interface UserCredits {
    balance: number;
}

export type SubscriptionTier = "FREE" | "PRO" | "ENTERPRISE";

export interface UserSubscription {
    tier: SubscriptionTier;
    status: string;
    currentPeriodEnd?: Date | null;
}

// Extends next-auth Session user with our custom fields
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
