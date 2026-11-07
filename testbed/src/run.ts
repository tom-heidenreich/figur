import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import {
  runPipeline,
  type Logger,
  type StageName,
  type Stages,
} from "@figur/core";
import type { Dataset, Sample, Split } from "#testbed/dataset";
import { consoleLogger, prefixed } from "#testbed/logger";
import { serializeTrace, writeJson } from "#testbed/store";
import { hashRunSpec } from "#testbed/utils/hash";

export type RunSpec = {
  dataset: Dataset;
  split: Split;
  stages: Stages;
};

export type RunOptions = {
  outDir: string; // the run is stored in `<outDir>/<hash>`
  concurrency?: number;
  caseTimeoutMs?: number; // aborts ctx.signal; stages have to honor it
  logger?: Logger;
};

export type CaseStatus = "ok" | "failed" | "timeout";

export type CaseResult = {
  caseId: string;
  status: CaseStatus;
  failedStage?: StageName;
  error?: string;
  durationMs: number;
};

export type RunResult = {
  runDir: string;
  cases: CaseResult[];
};

export async function runConfig(
  spec: RunSpec,
  opts: RunOptions,
): Promise<RunResult> {
  const logger = opts.logger ?? consoleLogger;

  const hash = hashRunSpec(spec);
  const runDir = join(opts.outDir, hash);

  const results: CaseResult[] = [];

  const samples = spec.dataset.samples(spec.split);
  for await (const sample of samples) {
    const result = await runCase({
      sample,
      stages: spec.stages,
      logger,
      runDir,
    });
    results.push(result);
    logger.info(`[${sample.id}] ${result.status}`);
  }

  return { runDir, cases: results };
}

type CaseRunOptions = {
  sample: Sample;
  stages: Stages;
  runDir: string;
  logger: Logger;
  timeoutMs?: number;
};

async function runCase({
  sample,
  stages,
  runDir,
  logger,
  timeoutMs,
}: CaseRunOptions): Promise<CaseResult> {
  const dir = join(runDir, "cases", sample.id);
  await rm(dir, { recursive: true, force: true }); // cleanup

  const outputDir = join(dir, "output");
  await mkdir(outputDir, { recursive: true });

  const signal = timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined;
  const start = performance.now();
  const res = await runPipeline(
    {
      id: sample.id,
      document: sample.document,
      artifact: sample.artifact,
      outputDir,
    },
    stages,
    { logger: prefixed(logger, sample.id), signal },
  );
  const durationMs = performance.now() - start;
  await writeJson(join(dir, "trace.json"), serializeTrace(res.trace));

  if (res.ok) return { caseId: sample.id, status: "ok", durationMs };

  const record = res.trace[res.failedStage];
  return {
    caseId: sample.id,
    status: signal?.aborted ? "timeout" : "failed",
    failedStage: res.failedStage,
    error: record && "error" in record ? record.error.message : undefined,
    durationMs,
  };
}
