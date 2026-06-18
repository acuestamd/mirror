# 🪞 Mirror

**A consent-locked self-screening companion.** Connect your *own* X account and Mirror privately
surfaces the symptom-domain **signals** in your own posts — mapped to validated screeners (PHQ-9,
GAD-7, ISI, …) and the DSM-5 criteria they relate to, alongside exactly what the text *cannot*
establish.

> **Screening signals, not a diagnosis.** A screen is not a diagnosis, and short public posts cannot
> establish DSM-5 duration, pervasiveness, impairment, or rule-outs. Mirror is an educational,
> non-clinical tool.

## The consent lock (why this is safe)

Mirror **can only ever screen the person who is logged in.** Server-side it calls only
`GET /2/users/me` and reads *that* user's own tweets — there is no code path, and no input field,
that can fetch another account's timeline. Signing in *is* the consent. This is deliberate: a tool
that screened arbitrary, non-consenting people would be a defamation and harassment engine, so it
doesn't exist here.

- No "type a username" box — you authenticate your own account.
- Tweets are analyzed for one request and **never stored** (no database, no profile, no sharing).
- The Anthropic key is server-only and never reaches the browser.

## Stack

Next.js (App Router) · X OAuth 2.0 (Authorization Code + PKCE, confidential client) · Claude
(`claude-opus-4-8`) for the screening engine. Deploys on Vercel.

## Setup

1. **Create an X OAuth 2.0 app** at <https://developer.x.com> → *Projects & Apps*.
   - App type: **Web App / Confidential client**, OAuth 2.0 enabled.
   - Scopes: `tweet.read users.read offline.access`.
   - Callback URL: your deployment's `…/api/callback` (and `http://127.0.0.1:3000/api/callback` for dev).
   - Note: reading user tweets requires a paid X API tier (Basic or pay-per-use).
2. **Set environment variables** (see [`.env.example`](./.env.example)): `X_CLIENT_ID`,
   `X_CLIENT_SECRET`, `X_REDIRECT_URI`, `ANTHROPIC_API_KEY`.
3. **Run / deploy:**
   ```bash
   npm install
   npm run dev            # http://127.0.0.1:3000
   # or deploy to Vercel and add the same env vars in the project settings
   ```

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing — explains the tool and the consent lock; "Connect your X account" |
| `/api/login` | Starts OAuth 2.0 (PKCE + state) |
| `/api/callback` | Verifies state, exchanges the code, sets an httpOnly session cookie |
| `/api/screen` | Reads **your own** timeline and returns the screening signals |
| `/screen` | Renders your result |
| `/api/logout` | Clears the session |

## Scope & limitations

- Public timelines are curated and incomplete — **absence of signal is not evidence of wellbeing.**
- The linguistic signals are population-level correlates, **not** valid indicators about any individual.
- Not affiliated with X, the APA, or any health authority. Not a medical device.

If you’re struggling: in the US, call or text **988** (Suicide & Crisis Lifeline).

## License

MIT.
