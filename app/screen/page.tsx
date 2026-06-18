"use client";
import { useEffect, useState } from "react";

type Domain = { name: string; signal: number; evidence: string[]; screener: string; dsm5_area: string; confidence: string };
type Direction = { condition: string; why_it_overlaps: string; screener: string; what_text_cannot_show: string };
type Result = { domains: Domain[]; screening_directions: Direction[]; caveat: string };
type Resp = { username: string; count: number; crisis: boolean; result: Result };

function barColor(s: number) { return s >= 0.66 ? "#c0492f" : s >= 0.33 ? "#d98a2b" : "#2e7d52"; }

export default function ScreenPage() {
  const [state, setState] = useState<"loading" | "ok" | "unauth" | "error">("loading");
  const [data, setData] = useState<Resp | null>(null);
  const [detail, setDetail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/screen", { cache: "no-store" });
        if (r.status === 401) { setState("unauth"); return; }
        if (!r.ok) { const j = await r.json().catch(() => ({})); setDetail(j.detail || `HTTP ${r.status}`); setState("error"); return; }
        setData(await r.json());
        setState("ok");
      } catch (e: any) { setDetail(String(e?.message || e)); setState("error"); }
    })();
  }, []);

  if (state === "loading")
    return <main className="wrap"><h1>Mirror</h1><p className="sub" style={{ marginTop: 24 }}><span className="spin" />Reading your timeline and reflecting…</p></main>;

  if (state === "unauth")
    return <main className="wrap"><h1>Mirror</h1><p className="sub" style={{ marginTop: 20 }}>You’re not connected — Mirror only runs on your own account.</p><a className="btn" href="/api/login">Connect your X account →</a></main>;

  if (state === "error")
    return <main className="wrap"><h1>Mirror</h1><div className="err" style={{ marginTop: 20 }}>Couldn’t complete the screen. {detail}</div><a className="btn ghost" href="/">Back</a></main>;

  const { username, count, crisis, result } = data!;
  return (
    <main className="wrap">
      <h1>Self-screening</h1>
      <p className="sub">Symptom-domain signals from your last {count} posts as @{username}.</p>
      <p className="sub"><b>Screening signals, not a diagnosis.</b> A screen is not a diagnosis; this cannot assess you.</p>
      <span className="tag">your own account · consented · not stored · non-diagnostic</span>

      {crisis && (
        <div className="crisis">
          Some posts touch on being in a hard place. If you’re thinking about harming yourself, please
          reach out now — in the US call or text <b>988</b>. You deserve real support.
        </div>
      )}

      <section>
        <h2>Symptom-domain signals</h2>
        {result.domains.length === 0 ? (
          <p className="none">No clear DSM-5 symptom domain detected in your recent posts — the engine stayed quiet, which is the expected result for an ordinary timeline.</p>
        ) : result.domains.map((d, i) => (
          <div className="dom" key={i}>
            <div className="dom-h"><span className="dn">{d.name}</span><span className={`conf ${d.confidence}`}>{d.confidence} confidence</span></div>
            <div className="track"><div className="fill" style={{ width: `${Math.round(Math.max(0, Math.min(1, d.signal)) * 100)}%`, background: barColor(d.signal) }} /></div>
            <div className="meta">screener: <b>{d.screener}</b> · DSM-5: {d.dsm5_area}</div>
            <div className="ev">{(d.evidence || []).slice(0, 2).map((x) => `“${x}”`).join(" · ")}</div>
          </div>
        ))}
      </section>

      <section>
        <h2>Candidate screening directions</h2>
        {result.screening_directions.length === 0 ? (
          <p className="none">None.</p>
        ) : (
          <table>
            <thead><tr><th>Screening direction</th><th>Why the language overlaps</th><th>What the text <em>cannot</em> establish</th></tr></thead>
            <tbody>
              {result.screening_directions.map((s, i) => (
                <tr key={i}>
                  <td className="cond">{s.condition}</td>
                  <td>{s.why_it_overlaps}<div className="scr">screen: {s.screener}</div></td>
                  <td className="cant">{s.what_text_cannot_show}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {result.caveat && <p className="caveat">{result.caveat}</p>}
      </section>

      <a className="btn ghost" href="/api/logout">Disconnect &amp; clear session</a>

      <footer>
        <b>Why this is not a diagnosis.</b> DSM-5 requires clinician-assessed duration, pervasiveness,
        functional impairment, and rule-out of substance/medical/bereavement causes — none of which short
        public posts can establish. The signals above are population-level <em>correlates</em> of screening
        scales, not facts about you.<br /><br />
        <b>Your data.</b> Analyzed for this one request and not stored. If anything here resonates, the
        right next step is a validated self-screener and a conversation with a clinician — not this page.
        <br /><br />If you’re struggling: in the US, call or text <b>988</b>.
      </footer>
    </main>
  );
}
