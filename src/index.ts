import { parseArgs } from "node:util";
import { Pipeline } from "~/pipeline";
import { dummyExtraction } from "~/pipeline/extraction/dummy";
import { dummyAssociation } from "~/pipeline/association/dummy";
import { dummyExecution } from "~/pipeline/execution/dummy";
import { dummyComparison } from "~/pipeline/comparison/dummy";
import { dummyReporting } from "~/pipeline/reporting/dummy";
import { loadManifest } from "~/input/manifest";

const { values } = parseArgs({
  options: {
    manifest: { type: "string", default: "./manifest.json" },
    case: { type: "string", multiple: true },
  },
});

const manifest = await loadManifest(values.manifest).catch((e) => {
  console.error(e.message);
  process.exit(1);
});

const selected = values.case ?? manifest.cases.map((c) => c.id);
const unknown = selected.filter(
  (id) => !manifest.cases.some((c) => c.id === id),
);
if (unknown.length > 0) {
  console.error(`Unknown case id(s): ${unknown.join(", ")}`);
  process.exit(1);
}
const cases = manifest.cases.filter((c) => selected.includes(c.id));

const pipeline = Pipeline.pipe(dummyExtraction)
  .pipe(dummyAssociation)
  .pipe(dummyExecution)
  .pipe(dummyComparison)
  .pipe(dummyReporting)
  .build();

for (const c of cases) {
  try {
    const report = await pipeline(c);
    console.log(`[${c.id}] done`, report);
  } catch (e) {
    console.error(`[${c.id}] failed:`, e);
  }
}
