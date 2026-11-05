import type {
  FinalResult,
  RawInput,
  StageContext,
  StageName,
  Stages,
} from "~/stages";
import { timed, type Trace } from "~/utils/trace";

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

export async function runPipeline(
  input: RawInput,
  st: Stages,
  ctx: StageContext,
): Promise<PipelineResult<FinalResult>> {
  const trace: Trace = {};
  let currentStage: StageName = "extraction";
  try {
    const s1 = await timed(trace, currentStage, () =>
      st.extraction.run({ input }, ctx),
    );

    currentStage = "association";
    const s2 = await timed(trace, currentStage, () =>
      st.association.run({ input, s1 }, ctx),
    );

    currentStage = "execution";
    const s3 = await timed(trace, currentStage, () =>
      st.execution.run({ input, s1, s2 }, ctx),
    );

    currentStage = "comparison";
    const s4 = await timed(trace, currentStage, () =>
      st.comparison.run({ input, s1, s2, s3 }, ctx),
    );

    currentStage = "reporting";
    const s5 = await timed(trace, currentStage, () =>
      st.reporting.run({ input, s1, s2, s3, s4 }, ctx),
    );

    return { ok: true, output: s5, trace };
  } catch (e) {
    return { ok: false, failedStage: currentStage, trace };
  }
}
