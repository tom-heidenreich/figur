import type { ComparedFigurePair, FigurePair } from "#core/domain/figure";
import type { Stage } from "#core/stages";
import type { AssociationInput } from "../association";

export type ComparisonInput = AssociationInput & {
  s3: FigurePair[];
};
export type ComparisonOutput = ComparedFigurePair[];

export type ComparisonStage = Stage<ComparisonInput, ComparisonOutput>;
