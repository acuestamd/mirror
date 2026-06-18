# Security Policy

Mirror handles an OAuth session and reads a user's own social-media data, so we take security
reports seriously.

## Reporting a vulnerability

**Please do not open a public issue for security problems.** Instead, use GitHub's private
[**Report a vulnerability**](https://github.com/acuestamd/mirror/security/advisories/new) flow
(Security → Advisories). Include steps to reproduce and the impact. We aim to acknowledge within a
few days.

Please report anything that could:

- expose another user's tweets, identity, or session,
- leak the `ANTHROPIC_API_KEY`, X client secret, or a user's access token,
- break the consent lock (cause the server to read an account other than the authenticated user's),
- enable CSRF/session-fixation on the OAuth flow, or
- allow injection into the rendered report.

## Design notes (what the app already does)

- OAuth 2.0 **Authorization Code + PKCE** with a `state` parameter (CSRF protection).
- Access token stored in an **httpOnly, Secure, SameSite=Lax** cookie; never exposed to client JS.
- Secrets (`ANTHROPIC_API_KEY`, `X_CLIENT_SECRET`) are read only in server (`nodejs`) routes.
- The server reads **only** `/2/users/me` and that user's own tweets; no third-party lookups.
- No database — tweets are processed in-memory for a single request and discarded.

## Supported versions

This is a young project; only `main` is supported. Please run a current deployment.
