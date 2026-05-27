import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.auth;

    // Protect all dashboard routes
    const isProtected =
        pathname.startsWith("/editor") ||
        pathname.startsWith("/settings");

    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login
    if (pathname === "/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/editor", req.url));
    }

    return NextResponse.next();
});

export const config = {
    // Skip Next.js internals and static assets
    matcher: ["/((?!_next/static|_next/image|favicon.ico|images|public).*)"],
};
