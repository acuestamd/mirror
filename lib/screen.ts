// Screening engine: maps a person's OWN timeline language to DSM-5 symptom
// DOMAINS, validated screeners, and the criteria a screen CANNOT establish.
// It outputs screening SIGNALS, never a diagnosis.
import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.MIRROR_MODEL || "claude-opus-4-8";

export type Domain = {
  name: string; signal: number; evidence: string[];
  screener: string; dsm5_area: string; confidence: "low" | "moderate" | "high";
};
export type Direction = { condition: string; why_it_overlaps: string; screener: string; what_text_cannot_show: string };
export type ScreenResult = { domains: Domain[]; screening_directions: Direction[]; caveat: string };

const SYSTEM = `You are a research instrument helping a person privately review THEIR OWN consented \
social-media timeline. The posts are this person's own; they asked to see what symptom-domain \
signals, if any, their language contains.

1) Identify the most salient DSM-5 symptom DOMAINS reflected in the language (up to 5), or none. \
For each: signal 0.0-1.0, 1-2 short quoted evidence phrases, the validated SCREENING instrument \
(PHQ-9, GAD-7, ISI, MDQ, AUDIT-C, C-SSRS...), the DSM-5 criterion area, and confidence.
2) If one or more domains are present, list candidate SCREENING DIRECTIONS — conditions a clinician \
might screen for — each with the DSM-5 requirements the text CANNOT establish (duration, pervasiveness, \
functional impairment, rule-out of substance/medical/bereavement causes). If nothing clear is present, \
return empty arrays and say so in the caveat.

These are SCREENING SIGNALS about the person's own posts, NOT a diagnosis. Never say they "have", \
"are", or "likely have" any condition. A real timeline of an ordinary person will often show few or \
no clear domains — DO NOT manufacture signal. Return via the report_signals tool.`;

const SCHEMA = {
  type: "object",
  properties: {
    domains: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          signal: { type: "number" },
          evidence: { type: "array", items: { type: "string" } },
          screener: { type: "string" },
          dsm5_area: { type: "string" },
          confidence: { type: "string", enum: ["low", "moderate", "high"] },
        },
        required: ["name", "signal", "evidence", "screener", "dsm5_area", "confidence"],
      },
    },
    screening_directions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          condition: { type: "string" },
          why_it_overlaps: { type: "string" },
          screener: { type: "string" },
          what_text_cannot_show: { type: "string" },
        },
        required: ["condition", "why_it_overlaps", "screener", "what_text_cannot_show"],
      },
    },
    caveat: { type: "string" },
  },
  required: ["domains", "screening_directions", "caveat"],
} as const;

const CRISIS = [/\bsuicid/i, /\bkill(ing)? myself\b/i, /\bwant to die\b/i, /\bend my life\b/i,
  /\bself[\s-]?harm\b/i, /\bhurt myself\b/i, /\bdon'?t want to be here\b/i];

export function crisisFlag(posts: string[]): boolean {
  const blob = posts.join(" ");
  return CRISIS.some((re) => re.test(blob));
}

export async function screen(posts: string[]): Promise<ScreenResult> {
  const empty: ScreenResult = { domains: [], screening_directions: [], caveat: "" };
  if (!posts.length) return empty;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system: SYSTEM,
    tools: [{ name: "report_signals", description: "Return DSM-5 symptom-domain screening signals (not diagnoses).", input_schema: SCHEMA as any }],
    tool_choice: { type: "tool", name: "report_signals" },
    messages: [{
      role: "user",
      content: "These are my own posts (consented self-review). Show me what, if anything, the language signals — gently and honestly.\n\n- " + posts.join("\n- "),
    }],
  });
  for (const block of msg.content) {
    if (block.type === "tool_use") return block.input as ScreenResult;
  }
  return empty;
}
