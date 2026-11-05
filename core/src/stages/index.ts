import type { Logger } from "~/utils/logger";
import type { ExtractionStage } from "~/stages/extraction";
import type { AssociationStage } from "~/stages/association";
import type { ExecutionStage } from "~/stages/execution";
import type { ComparisonStage } from "~/stages/comparison";
import type { ReportingStage } from "~/stages/reporting";
import type { Case } from "~/domain/case";
import type { Report } from "~/domain/report";

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
