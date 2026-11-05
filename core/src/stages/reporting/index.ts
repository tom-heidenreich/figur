import type { ComparedFigurePair } from "~/domain/figure";
import type { Report } from "~/domain/report";
import type { ComparisonInput } from "~/stages/comparison";
import type { Stage } from "~/stages";

export type ReportingInput = ComparisonInput & {
  s4: ComparedFigurePair[];
};
export type ReportingOutput = Report;

export type ReportingStage = Stage<ReportingInput, ReportingOutput>;
