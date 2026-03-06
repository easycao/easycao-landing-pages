import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes: login page + login/logout API
  if (
    pathname === "/admin" ||
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout"
  ) {
    return NextResponse.next();
  }

  // All other /admin/* and /api/admin/* require session cookie
  const session = request.cookies.get("session")?.value;

  if (!session) {
    // API routes: return 401 JSON
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Page routes: redirect to login
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Cookie exists — let the request through.
  // Full session verification happens in route handlers/layouts via verifySession()
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path*"],
};
