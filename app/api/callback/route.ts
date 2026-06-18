import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/twitter";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("oauth_state")?.value;
  const verifier = req.cookies.get("pkce_verifier")?.value;

  // CSRF + integrity checks
  if (!code || !state || !cookieState || state !== cookieState || !verifier) {
    return NextResponse.redirect(new URL("/?error=auth", req.url));
  }

  let token;
  try {
    token = await exchangeCode(code, verifier);
  } catch {
    return NextResponse.redirect(new URL("/?error=token", req.url));
  }

  const res = NextResponse.redirect(new URL("/screen", req.url));
  res.cookies.set("x_token", token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: token.expires_in ?? 7200,
  });
  res.cookies.delete("pkce_verifier");
  res.cookies.delete("oauth_state");
  return res;
}
