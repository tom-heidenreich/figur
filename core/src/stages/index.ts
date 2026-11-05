import type { Logger } from "#core/utils/logger";
import type { ExtractionStage } from "#core/stages/extraction";
import type { AssociationStage } from "#core/stages/association";
import type { ExecutionStage } from "#core/stages/execution";
import type { ComparisonStage } from "#core/stages/comparison";
import type { ReportingStage } from "#core/stages/reporting";
import type { Case } from "#core/domain/case";
import type { Report } from "#core/domain/report";

export type StageContext = {
  logger: Logger;
  signal?: AbortSignal;
};

export type Stage<I, O> = {
  readonly id: string; // "step2/variantA"
  run(input: I, ctx: StageContext): Promise<O>;
};

export type RawInput = Case;
export type FinalResult = Report;

export type Stages = {
  extraction: ExtractionStage;
  association: AssociationStage;
  execution: ExecutionStage;
  comparison: ComparisonStage;
  reporting: ReportingStage;
};

export type StageName = keyof Stages;
