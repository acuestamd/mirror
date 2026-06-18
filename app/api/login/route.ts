import { NextResponse } from "next/server";
import { randomString, challengeFromVerifier } from "@/lib/pkce";
import { authorizeUrl } from "@/lib/twitter";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.X_CLIENT_ID || !process.env.X_REDIRECT_URI) {
    return NextResponse.redirect(new URL("/?error=config", process.env.X_REDIRECT_URI || "http://127.0.0.1:3000"));
  }
  const verifier = randomString(48);
  const state = randomString(16);
  const challenge = challengeFromVerifier(verifier);

  const res = NextResponse.redirect(authorizeUrl(state, challenge));
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
  res.cookies.set("pkce_verifier", verifier, opts);
  res.cookies.set("oauth_state", state, opts);
  return res;
}
