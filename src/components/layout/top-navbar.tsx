"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, LogOut, Settings, Zap, BookOpen } from "lucide-react";
import Link from "next/link";

interface TopNavbarProps {
    userName?: string | null;
    userEmail?: string | null;
    userImage?: string | null;
    creditBalance: number;
    onExport?: () => void;
    onUpgrade?: () => void;
    isSaving?: boolean;
    lastSavedAt?: string | null;
}

export function TopNavbar({
    userName,
    userEmail,
    userImage,
    creditBalance,
    onExport,
    onUpgrade,
    isSaving,
    lastSavedAt,
}: TopNavbarProps) {
    const initials = userName
        ? userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <header className="h-14 border-b bg-background flex items-center justify-between px-4 gap-4 shrink-0 z-10">
            {/* Brand */}
            <Link href="/editor" className="flex items-center gap-2 font-semibold text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>AI Publisher</span>
            </Link>

            {/* Save status */}
            <div className="flex-1 flex justify-center">
                {isSaving && (
                    <span className="text-xs text-muted-foreground animate-pulse">Saving…</span>
                )}
                {!isSaving && lastSavedAt && (
                    <span className="text-xs text-muted-foreground">
                        Saved {new Date(lastSavedAt).toLocaleTimeString()}
                    </span>
                )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={onUpgrade}>
                    <Zap className="h-3 w-3" />
                    {creditBalance} credits
                </Badge>

                <Button variant="outline" size="sm" onClick={onUpgrade}>
                    Upgrade to Pro
                </Button>

                <Button size="sm" onClick={onExport} className="gap-1.5">
                    <Download className="h-4 w-4" />
                    Export
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-ring transition-all">
                            <AvatarImage src={userImage ?? undefined} alt={userName ?? "User"} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{userName ?? "User"}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {userEmail}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="cursor-pointer">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
