# Ethics & Responsible Use

Mirror works with mental-health-adjacent inferences, so its design choices are
ethical choices. This document states them plainly.

## The consent lock is the whole point

Mirror **only ever analyzes the timeline of the person who is logged in.** Server-side it
calls only `GET /2/users/me` and reads *that* user's own tweets. There is:

- no input field for another account,
- no code path that fetches another account's timeline,
- no stored data — tweets are analyzed for a single request and discarded.

Signing in **is** the consent. This is not an accident or an oversight to be "fixed."

## What we will not accept

A tool that ingested an arbitrary, identifiable, non-consenting person's posts and emitted
a presumed psychiatric diagnosis would be a defamation and harassment engine. It is also
clinically invalid: a DSM-5 diagnosis requires a clinician to assess duration, pervasiveness,
functional impairment, and rule out substance/medical/bereavement causes — none of which short
public posts can establish. The American Psychiatric Association's **Goldwater Rule** prohibits
exactly this (offering a professional opinion about someone you have not examined and who has
not consented).

**Pull requests or forks that remove the consent lock — e.g. accepting a third-party handle,
resolving `users/by/username/:handle`, or otherwise screening non-consenting people — are out
of scope and will be rejected.** Doing it in a fork is your legal and moral risk, not ours, and
may violate defamation, privacy, and data-protection law (incl. GDPR special-category data).

## What Mirror is, and is not

- **Screening signals, not a diagnosis.** Outputs are population-level *correlates* of validated
  screening scales, shown alongside what the text *cannot* establish. A screen is not a diagnosis.
- **Not a medical device.** Not affiliated with X, the APA, or any health authority.
- **Educational and self-directed.** If anything it surfaces resonates, the right next step is a
  validated self-screener and a clinician — not this app.

## Safety

If a user's posts contain acute-risk language, the result leads with crisis resources. If you are
struggling: in the US, call or text **988** (Suicide & Crisis Lifeline). Elsewhere, contact your
local emergency number or a crisis line.

## Doing this as real research

The legitimate way to study symptom signals in real social text is a **consented cohort** or a
**de-identified, IRB-governed corpus** (e.g. the CLPsych and eRisk shared-task datasets) — never
by attaching inferences to an identifiable, non-consenting individual.
