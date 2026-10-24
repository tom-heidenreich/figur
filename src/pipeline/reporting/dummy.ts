import type { ReportingInput, ReportingOutput } from "~/pipeline/reporting";

export const dummyReporting = async (
  input: ReportingInput,
): Promise<ReportingOutput> => ({});
