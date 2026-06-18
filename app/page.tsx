const ERRORS: Record<string, string> = {
  auth: "Login could not be verified (state mismatch). Please try connecting again.",
  token: "Could not complete sign-in with X. Please try again.",
  config: "This deployment is missing its X OAuth configuration (see README).",
};

export default async function Home({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="wrap">
      <h1>Mirror</h1>
      <p className="sub">A private, consent-locked self-screening companion.</p>
      <p className="lead">
        Connect your own X account and Mirror will privately surface the symptom-domain
        <em> signals</em> in your own posts — mapped to the validated screeners and DSM-5 criteria they
        relate to. It is a mirror, not a verdict.
      </p>

      {error && <div className="err">{ERRORS[error] || "Something went wrong. Please try again."}</div>}

      <div className="lock">
        <b>You can only ever screen yourself.</b> Sign-in <em>is</em> the consent: Mirror reads only the
        timeline of the account you authenticate with. There is no box to type someone else’s name —
        by design, you cannot run this on another person.
      </div>

      <a className="btn" href="/api/login">Connect your X account →</a>

      <section>
        <h2>What it is — and isn’t</h2>
        <p className="sub">
          <b>Screening signals, not a diagnosis.</b> A DSM-5 diagnosis requires a clinician to assess
          duration, pervasiveness, functional impairment, and rule out substance/medical/bereavement
          causes — none of which short public posts can establish. What you’ll see are population-level
          <em> correlates</em> of screening scales, shown alongside exactly what the text <em>cannot</em>
          establish. A screen is not a diagnosis, and this cannot assess you.
        </p>
        <p className="sub" style={{ marginTop: 12 }}>
          <b>Nothing is stored.</b> Your tweets are analyzed for one request and then discarded. There’s
          no database, no profile, no sharing.
        </p>
      </section>

      <footer>
        Mirror is an educational, non-clinical tool. If anything it surfaces resonates, the right next
        step is a validated self-screener and a conversation with a clinician — not this page.
        <br /><br />
        If you’re struggling: in the US, call or text <b>988</b> (Suicide &amp; Crisis Lifeline).
        <br /><br />
        <span className="muted">Open source · consent-locked · not affiliated with X or any health authority.</span>
      </footer>
    </main>
  );
}
