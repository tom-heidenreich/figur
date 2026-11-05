import type { FigureCodePair, FigurePair } from "~/domain/figure";
import type { AssociationInput } from "~/stages/association";
import type { Stage } from "~/stages";

export type ExecutionInput = AssociationInput & {
  s2: FigureCodePair[];
};
export type ExecutionOutput = FigurePair[];

export type ExecutionStage = Stage<ExecutionInput, ExecutionOutput>;
