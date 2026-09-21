import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE || "impulse_admin_session";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const clearOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };

  // Clear both cookies set during login
  res.cookies.set(SESSION_COOKIE, "", clearOpts);
  res.cookies.set("token", "", clearOpts);

  return res;
}
