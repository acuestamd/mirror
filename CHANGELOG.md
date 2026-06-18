# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] — 2026-06-17

### Added

- Initial release: consent-locked self-screening web app (Next.js App Router).
- X OAuth 2.0 (Authorization Code + PKCE, confidential client): `/api/login`, `/api/callback`,
  `/api/logout`.
- `/api/screen` — reads the authenticated user's **own** timeline and returns DSM-5 symptom-domain
  signals via the Claude screening engine (tool-use / structured output).
- Landing page and client-rendered result page with screening signals, candidate screening
  directions, a "what the text cannot establish" column, and crisis resources.
- Project hygiene: README, ETHICS, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CI, issue/PR templates.

[Unreleased]: https://github.com/acuestamd/mirror/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/acuestamd/mirror/releases/tag/v0.1.0
