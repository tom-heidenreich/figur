import { join } from "node:path";
import {
  type Stage,
  type StageName,
  type StageOutputs,
  type Stages,
} from "@figur/core";
import {
  runConfig,
  type Dataset,
  type RunOptions,
  type RunResult,
  type Split,
} from "@figur/testbed";

export type Experiment<V, G> = {
  name: string;
  dataset: Dataset<V, G>;
  split: Split;
  variants: Record<string, Stage<V, StageOutputs[StageName]>>;
};

export function defineExperiment<V, G>(def: {
  name: string;
  dataset: Dataset<V, G>;
  split: Split;
  base: Stage<V, StageOutputs[StageName]>;
  variants: Record<string, Partial<Stage<V, StageOutputs[StageName]>>>;
}): Experiment<V, G> {
  return {
    ...def,
    variants: Object.fromEntries(
      Object.entries(def.variants).map(([key, variantOverride]) => [
        key,
        {
          ...def.base,
          ...variantOverride,
        },
      ]),
    ),
  };
}

type ExperimentOptions = { runsDir: string } & Omit<RunOptions, "outDir">;

export async function runExperiment<V, G, O>(
  exp: Experiment<V, G>,
  { runsDir, ...runOptions }: ExperimentOptions,
): Promise<Record<string, RunResult>> {
  const results: Record<string, RunResult> = {};
  for (const [label, stage] of Object.entries(exp.variants)) {
    // TODO: concurrency
    results[label] = await runConfig(
      { dataset: exp.dataset, split: exp.split, stage },
      { ...runOptions, outDir: join(runsDir, exp.name, label) },
    );
  }
  return results;
}

export function summarize(results: Record<string, RunResult>) {
  return Object.entries(results).map(([label, { cases }]) => ({
    variant: label,
    // run: manifest.hash,
    cases: cases.length,
    ok: cases.filter((c) => c.status === "ok").length,
    failed: cases.filter((c) => c.status === "failed").length,
    timeout: cases.filter((c) => c.status === "timeout").length,
    meanMs: +(
      cases.reduce((sum, c) => sum + c.durationMs, 0) / (cases.length || 1)
    ).toFixed(2),
  }));
}
