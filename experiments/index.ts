import { join } from "node:path";
import { parseArgs } from "node:util";
import { runExperiment, summarize } from "#experiments/experiment";
import { experiments } from "#experiments/experiments";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  allowPositionals: true,
  options: {
    concurrency: { type: "string", default: "4" },
    timeout: { type: "string" }, // per case, in seconds
  },
});

const exp = experiments.find((e) => e.name === positionals[0]);
if (!exp) {
  console.error(
    "usage: bun run index.ts <experiment> [--eval] [--concurrency n] [--timeout s]\n" +
      `experiments: ${experiments.map((e) => e.name).join(", ")}`,
  );
  process.exit(1);
}

const results = await runExperiment(exp, {
  runsDir: join(import.meta.dir, "runs"),
  concurrency: Number(values.concurrency),
  caseTimeoutMs: values.timeout ? Number(values.timeout) * 1000 : undefined,
});
console.table(summarize(results));
