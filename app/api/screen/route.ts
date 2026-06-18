import { NextRequest, NextResponse } from "next/server";
import { getMe, getOwnTweets } from "@/lib/twitter";
import { screen, crisisFlag } from "@/lib/screen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("x_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }
  try {
    // Consent lock: we only ever resolve the AUTHENTICATED user, and only read
    // their OWN tweets. There is no input for another account.
    const me = await getMe(token);
    const tweets = await getOwnTweets(token, me.id, 120);
    const posts = tweets.map((t) => (t.text || "").trim()).filter(Boolean);
    const crisis = crisisFlag(posts);
    const result = await screen(posts);
    // Nothing is stored: tweets live only for this request.
    return NextResponse.json({ username: me.username, count: posts.length, crisis, result });
  } catch (e: any) {
    return NextResponse.json({ error: "screen_failed", detail: String(e?.message || e) }, { status: 500 });
  }
}
