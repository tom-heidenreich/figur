import type { ComparedFigurePair } from "#core/domain/figure";
import type { Report } from "#core/domain/report";
import type { ComparisonInput } from "#core/stages/comparison";
import type { Stage } from "#core/stages";

export type ReportingInput = ComparisonInput & {
  s4: ComparedFigurePair[];
};
export type ReportingOutput = Report;

export type ReportingStage = Stage<ReportingInput, ReportingOutput>;
