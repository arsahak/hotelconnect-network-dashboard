import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { canAccess, isUserRole } from "./config/access";

// Static files + NextAuth's own session/csrf/callback routes are never gated,
// or sign-in itself breaks.
const EXCLUDED_PATHS = ["/_next/", "/favicon.ico", "/icon.svg", "/api/auth/"];
const PUBLIC_PATHS = ["/sign-in"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    EXCLUDED_PATHS.some((path) => pathname.startsWith(path)) ||
    /\/[^/]+\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const toSignIn = () => {
    const signInUrl = new URL("/sign-in", request.url);
    if (pathname !== "/") signInUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  };

  try {
    const session = await auth();
    const role = session?.user?.role;
    // Auth.js checks this signed session cookie locally. The backend checks
    // the token and the account again on every API call.
    const signedIn = Boolean(session?.user?.accessToken && isUserRole(role));

    if (pathname === "/") {
      return NextResponse.redirect(new URL(signedIn ? "/dashboard" : "/sign-in", request.url));
    }

    if (PUBLIC_PATHS.includes(pathname)) {
      return signedIn
        ? NextResponse.redirect(new URL("/dashboard", request.url))
        : NextResponse.next();
    }

    if (!signedIn || !isUserRole(role)) return toSignIn();

    // Signed in, but this page isn't for their role.
    if (!canAccess(pathname, role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // A broken/expired session cookie must not take every page down —
    // treat the visitor as signed out instead.
    console.error("[proxy] Unexpected error:", error);
    return PUBLIC_PATHS.includes(pathname) ? NextResponse.next() : toSignIn();
  }
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|icon.svg).*)"],
};

export default proxy;
