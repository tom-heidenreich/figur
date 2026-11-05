import type { ComparedFigurePair, FigurePair } from "~/domain/figure";
import type { ExecutionInput } from "~/stages/execution";
import type { Stage } from "~/stages";

export type ComparisonInput = ExecutionInput & {
  s3: FigurePair[];
};
export type ComparisonOutput = ComparedFigurePair[];

export type ComparisonStage = Stage<ComparisonInput, ComparisonOutput>;
