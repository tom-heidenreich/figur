import type { RawInput, StageContext, StageName, Stages } from "~/stages";
import { timed, type Trace } from "~/utils/trace";

export type Config = { [K in StageName]: Parameters<Stages[K]["run"]>[2] };

export async function runPipeline(
  input: RawInput,
  st: Stages,
  ctx: StageContext,
  config: Config,
) {
  const trace: Trace = {};
  const s1 = await timed(trace, "extraction", () =>
    st.extraction.run(
      { input },
      ctx,
      st.extraction.config.parse(config.extraction),
    ),
  );
  const s2 = await timed(trace, "association", () =>
    st.association.run(
      { input, s1 },
      ctx,
      st.association.config.parse(config.association),
    ),
  );
  const s3 = await timed(trace, "execution", () =>
    st.execution.run(
      { input, s1, s2 },
      ctx,
      st.execution.config.parse(config.execution),
    ),
  );
  const s4 = await timed(trace, "comparison", () =>
    st.comparison.run(
      { input, s1, s2, s3 },
      ctx,
      st.comparison.config.parse(config.comparison),
    ),
  );
  const s5 = await timed(trace, "reporting", () =>
    st.reporting.run(
      { input, s1, s2, s3, s4 },
      ctx,
      st.reporting.config.parse(config.reporting),
    ),
  );
  return { output: s5, trace };
}
