import { screen, crisisFlag } from "../lib/screen.ts";

const dep = [
  "weeks of just feeling empty, nothing lands anymore",
  "used to love studio sundays, can't make myself go",
  "awake at 4am again, then dragging through the day exhausted",
  "cancelled on everyone, don't have it in me to see people",
];
const ctrl = [
  "great ramen spot near the office, going back",
  "shipped the feature today, team crushed it",
  "river run then espresso, good monday",
];

for (const [name, posts] of [["depressive", dep], ["control", ctrl]] as const) {
  const r = await screen(posts);
  console.log(`\n${name}: ${r.domains.length} domains, ${r.screening_directions.length} directions, crisis=${crisisFlag(posts)}`);
  for (const d of r.domains) console.log(`   - ${d.name} (${d.signal}, ${d.confidence}) → ${d.screener}`);
  console.log(`   caveat: ${(r.caveat || "").slice(0, 120)}`);
}
