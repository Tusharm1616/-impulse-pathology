import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ONLY = ["/admin", "/admin/" , "/admin/dashboard", "/admin/patients", "/admin/reports", "/admin/messages", "/admin/profile"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname.startsWith("/admin/login");
    const cookieName = process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE || "impulse_admin_session";
    const session = req.cookies.get(cookieName)?.value;
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    const hasBearer = !!(authHeader && authHeader.toLowerCase().startsWith("bearer "));
    if (!session && !isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      if (!hasBearer) return NextResponse.redirect(url);
    }
    if (session && isLogin) {
      // already logged in; go to dashboard
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
