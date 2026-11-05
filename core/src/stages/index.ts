import type { Logger } from "~/utils/logger";
import type { ExtractionStage } from "~/stages/extraction";
import type { AssociationStage } from "~/stages/association";
import type { ExecutionStage } from "~/stages/execution";
import type { ComparisonStage } from "~/stages/comparison";
import type { ReportingStage } from "~/stages/reporting";
import type { Case } from "~/domain/case";
import type z from "zod";

export type StageContext = {
  logger: Logger;
  signal?: AbortSignal;
};

export type Stage<I, O, C = {}> = {
  readonly id: string; // "step2/variantA"
  config: z.ZodType<C>;
  run(input: I, ctx: StageContext, config: C): Promise<O>;
};

export type RawInput = Case;

export type Stages = {
  extraction: ExtractionStage;
  association: AssociationStage;
  execution: ExecutionStage;
  comparison: ComparisonStage;
  reporting: ReportingStage;
};

export type StageName = keyof Stages;
