import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:3001";
const SESSION_COOKIE = process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE || "impulse_admin_session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Proxy login to Express backend
    const backendRes = await fetch(`${BACKEND}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || "Invalid credentials" },
        { status: backendRes.status }
      );
    }

    // Only allow admin role
    if (data.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    // Build response
    const res = NextResponse.json({ ok: true, user: data.user });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    // 1. Session cookie — checked by Next.js middleware to protect /admin/* routes
    res.cookies.set(SESSION_COOKIE, data.token, cookieOpts);

    // 2. Token cookie — read by backend's protect middleware as req.cookies.token
    res.cookies.set("token", data.token, cookieOpts);

    return res;
  } catch (err) {
    console.error("Admin login proxy error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
