import type { ComparedFigurePair, FigurePair } from "#core/domain/figure";
import type { ExecutionInput } from "#core/stages/execution";
import type { Stage } from "#core/stages";

export type ComparisonInput = ExecutionInput & {
  s3: FigurePair[];
};
export type ComparisonOutput = ComparedFigurePair[];

export type ComparisonStage = Stage<ComparisonInput, ComparisonOutput>;
