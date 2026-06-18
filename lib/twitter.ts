// Thin X (Twitter) API v2 OAuth 2.0 client.
//
// The ONLY user data this app ever reads is the authenticated user's own
// identity (/2/users/me) and their own tweets. There is no code path that can
// fetch another account's timeline — that is the structural consent lock.

const AUTHORIZE = "https://twitter.com/i/oauth2/authorize";
const TOKEN = "https://api.twitter.com/2/oauth2/token";
const API = "https://api.twitter.com/2";
const SCOPES = ["tweet.read", "users.read", "offline.access"];

export function authorizeUrl(state: string, challenge: string): string {
  const p = new URLSearchParams({
    response_type: "code",
    client_id: process.env.X_CLIENT_ID || "",
    redirect_uri: process.env.X_REDIRECT_URI || "",
    scope: SCOPES.join(" "),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return `${AUTHORIZE}?${p.toString()}`;
}

export async function exchangeCode(code: string, verifier: string): Promise<{ access_token: string; expires_in?: number }> {
  const basic = Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.X_REDIRECT_URI || "",
    code_verifier: verifier,
  });
  const r = await fetch(TOKEN, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) throw new Error(`token exchange failed: ${r.status} ${await r.text()}`);
  return r.json();
}

export async function getMe(token: string): Promise<{ id: string; username: string }> {
  const r = await fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`users/me failed: ${r.status}`);
  const j = await r.json();
  return j.data;
}

// Fetch up to `limit` of the AUTHENTICATED user's own original tweets.
export async function getOwnTweets(token: string, userId: string, limit = 120): Promise<{ text: string; created_at?: string }[]> {
  const out: { text: string; created_at?: string }[] = [];
  let pageToken: string | undefined;
  while (out.length < limit) {
    const p = new URLSearchParams({
      max_results: String(Math.min(100, Math.max(5, limit - out.length))),
      exclude: "retweets",
      "tweet.fields": "created_at",
    });
    if (pageToken) p.set("pagination_token", pageToken);
    const r = await fetch(`${API}/users/${userId}/tweets?${p.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error(`tweets failed: ${r.status} ${await r.text()}`);
    const j = await r.json();
    for (const t of j.data || []) out.push({ text: t.text || "", created_at: t.created_at });
    pageToken = j.meta?.next_token;
    if (!pageToken || !(j.data?.length)) break;
  }
  return out;
}
