import { parseArgs } from "node:util";
import { runCase } from "./src/run";
import { consoleLogger } from "./src/logger";
import { defaultPipelineConfig } from "./src/config";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  allowPositionals: true,
  options: {
    "document-path": { type: "string", short: "d" },
    "artifact-path": { type: "string", short: "a" },
    out: { type: "string", default: "./out" },
    timeout: { type: "string" },
  },
});

if (!values["document-path"] || !values["artifact-path"]) {
  console.error(
    "usage: bun run index.ts --document-path <path-to-paper> --artifact-path <path-to-artifact-dir>",
  );
  process.exit(1);
}

const result = await runCase({
  input: {
    id: Bun.randomUUIDv7(),
    outputDir: values.out,
    document: { path: values["document-path"], format: "pdf" },
    artifact: { path: values["artifact-path"] },
  },
  outDir: values.out,
  logger: consoleLogger,
  stages: defaultPipelineConfig,
  timeoutMs: values.timeout ? Number(values.timeout) * 1000 : undefined,
});

consoleLogger.info(
  `${result.caseId} -> ${result.status} in ${Math.round(result.durationMs)}ms`,
);
