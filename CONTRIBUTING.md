# Contributing to Mirror

Thanks for your interest! Mirror is a small, deliberately-scoped project. A few things up front.

## The one hard boundary

Mirror only ever screens the **authenticated user's own** timeline. Contributions that weaken or
remove this consent lock — accepting a third-party handle, resolving `users/by/username/:handle`,
batch-profiling, or otherwise inferring mental-health information about non-consenting people — are
**out of scope and will be closed**. See [ETHICS.md](./ETHICS.md). Everything else is fair game.

## Development setup

```bash
npm install
cp .env.example .env.local   # add your X OAuth 2.0 app + Anthropic key
npm run dev                  # http://127.0.0.1:3000
npm run build                # typecheck + production build (what CI runs)
```

You can exercise the screening engine without the OAuth round-trip:

```bash
ANTHROPIC_API_KEY=sk-... node --experimental-strip-types scripts/test-engine.ts
```

## Pull requests

1. Fork and branch from `main` (`feat/…`, `fix/…`, `docs/…`).
2. Keep changes focused; update the README/docs if behavior changes.
3. Ensure `npm run build` passes (CI runs it on every PR).
4. Open a PR using the template; describe the change and the why.

## Style

- TypeScript, App Router, server-only secrets. Never read `ANTHROPIC_API_KEY` or token cookies in a
  client component.
- Match the existing minimal, type-led UI. No heavy dependencies without discussion.
- Keep user-facing copy honest: signals, not diagnoses.

## Good first issues

UI/accessibility polish, a timezone/locale option, additional validated screeners, i18n, a richer
result visualization, tests for the OAuth helpers. Open an issue to discuss anything larger.
