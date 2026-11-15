import type { Logger } from "#core/utils/logger";
import type { ExtractionStage } from "#core/stages/extraction";
import type { AssociationStage } from "#core/stages/association";
import type { ExecutionStage } from "#core/stages/execution";
import type { ComparisonStage } from "#core/stages/comparison";
import type { Case } from "#core/domain/case";
import type { Report } from "#core/domain/report";

export type StageContext = {
  logger: Logger;
  signal?: AbortSignal;
};

export type Stage<I, O> = {
  readonly id: `${StageName}/${string}`
  run(input: I, ctx: StageContext): Promise<O>;
};

export type RawInput = Case;
export type FinalResult = Report;

export type Stages = {
  extraction: ExtractionStage;
  execution: ExecutionStage;
  association: AssociationStage;
  comparison: ComparisonStage;
};

export type StageName = keyof Stages;
