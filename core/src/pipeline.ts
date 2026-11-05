import type { RawInput, StageContext, StageName, Stages } from "~/stages";
import { timed, type Trace } from "~/utils/trace";

export async function runPipeline(
  input: RawInput,
  st: Stages,
  ctx: StageContext,
) {
  const trace: Trace = {};
  const s1 = await timed(trace, "extraction", () =>
    st.extraction.run({ input }, ctx),
  );
  const s2 = await timed(trace, "association", () =>
    st.association.run({ input, s1 }, ctx),
  );
  const s3 = await timed(trace, "execution", () =>
    st.execution.run({ input, s1, s2 }, ctx),
  );
  const s4 = await timed(trace, "comparison", () =>
    st.comparison.run({ input, s1, s2, s3 }, ctx),
  );
  const s5 = await timed(trace, "reporting", () =>
    st.reporting.run({ input, s1, s2, s3, s4 }, ctx),
  );
  return { output: s5, trace };
}
