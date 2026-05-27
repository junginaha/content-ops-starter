"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
    provider: "google" | "github";
    children: React.ReactNode;
    className?: string;
}

export function SignInButton({ provider, children, className }: SignInButtonProps) {
    return (
        <Button
            variant="outline"
            className={className}
            onClick={() => signIn(provider, { callbackUrl: "/editor" })}
        >
            {children}
        </Button>
    );
}
