import type { StageName, Stages } from "~/stages";

export interface StepRecord<O> {
  output?: O;
  error?: Error;
  durationMs: number;
}

export type StageOutputs = {
  [K in StageName]: Awaited<ReturnType<Stages[K]["run"]>>;
};

export type Trace = { [K in StageName]?: StepRecord<StageOutputs[K]> };

export async function timed<K extends StageName>(
  trace: { [P in K]?: StepRecord<StageOutputs[P]> }, // can't be Trace directly as correlated unions are a limitation of typescript
  step: K,
  fn: () => Promise<StageOutputs[K]>,
): Promise<StageOutputs[K]> {
  const start = performance.now();
  try {
    const output = await fn();
    trace[step] = { output, durationMs: performance.now() - start };
    return output;
  } catch (err) {
    trace[step] = {
      error: err instanceof Error ? err : Error(String(err)),
      durationMs: performance.now() - start,
    };
    throw err;
  }
}
