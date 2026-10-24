import type {
  ReportingInput,
  ReportingOutput,
  ReportingStep,
} from "~/pipeline/reporting";

export const dummyReporting: ReportingStep = async (
  input: ReportingInput,
): Promise<ReportingOutput> => ({});
