import type { FigureCodePair, FigurePair } from "#core/domain/figure";
import type { AssociationInput } from "#core/stages/association";
import type { Stage } from "#core/stages";

export type ExecutionInput = AssociationInput & {
  s2: FigureCodePair[];
};
export type ExecutionOutput = FigurePair[];

export type ExecutionStage = Stage<ExecutionInput, ExecutionOutput>;
