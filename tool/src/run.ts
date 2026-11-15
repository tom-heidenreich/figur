import {
  runPipeline,
  type Case,
  type Logger,
  type StageName,
  type Stages,
} from "@figur/core";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { writeJson, serializeTrace } from "#testbed/store"

export type CaseStatus = "ok" | "failed" | "timeout";

export type CaseResult = {
  caseId: string;
  status: CaseStatus;
  failedStage?: StageName;
  error?: string;
  durationMs: number;
};

type CaseRunOptions = {
  input: Case;
  stages: Stages;
  outDir: string;
  logger: Logger;
  timeoutMs?: number;
};

export async function runCase({
  input,
  stages,
  outDir,
  logger,
  timeoutMs,
}: CaseRunOptions): Promise<CaseResult> {
  await mkdir(outDir, { recursive: true });

  const signal = timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined;
  const start = performance.now();
  const res = await runPipeline(input, stages, { logger, signal });
  const durationMs = performance.now() - start;

  await writeJson(
    join(outDir, `trace-${input.id}.json`),
    serializeTrace(res.trace),
  );

  if (res.ok) return { caseId: input.id, status: "ok", durationMs };

  const record = res.trace[res.failedStage];
  return {
    caseId: input.id,
    status: signal?.aborted ? "timeout" : "failed",
    failedStage: res.failedStage,
    error: record && "error" in record ? record.error.message : undefined,
    durationMs,
  };
}
