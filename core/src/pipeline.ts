import type {
  FinalResult,
  RawInput,
  Stage,
  StageContext,
  StageName,
  Stages,
} from "#core/stages";
import { timed, type StageOutputs, type Trace } from "#core/utils/trace";

type PipelineResult<O> = (
  | {
      ok: true;
      output: O;
    }
  | {
      ok: false;
      failedStage: StageName;
    }
) & { trace: Trace };

export async function runStage<I, K extends StageName>(
  stage: Stage<I, StageOutputs[K]>,
  input: I,
  ctx: StageContext,
  trace?: Trace,
): Promise<PipelineResult<StageOutputs[K]>> {
  if (!trace) trace = {};
  const stageName = stage.id.split("/")[0] as K;
  try {
    ctx.signal?.throwIfAborted();
    const output = await timed(trace, stageName, () => stage.run(input, ctx));
    return { ok: true, output: output as StageOutputs[K], trace };
  } catch (e) {
    return { ok: false, failedStage: stageName, trace };
  }
}

export async function runPipeline(
  input: RawInput,
  st: Stages,
  ctx: StageContext,
): Promise<PipelineResult<FinalResult>> {
  const trace: Trace = {};
  const s1 = await runStage(st.extraction, { input }, ctx, trace);
  if (!s1.ok) return s1;

  const s2 = await runStage(st.execution, { input, s1: s1.output }, ctx, trace);
  if (!s2.ok) return s2;

  const s3 = await runStage(
    st.association,
    { input, s1: s1.output, s2: s2.output },
    ctx,
    trace,
  );
  if (!s3.ok) return s3;

  const s4 = await runStage(
    st.comparison,
    { input, s1: s1.output, s2: s2.output, s3: s3.output },
    ctx,
    trace,
  );
  return s4;
}
