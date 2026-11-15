import type { Figure, FigurePair } from "#core/domain/figure";
import type { Stage } from "#core/stages";
import type { ExecutionInput } from "../execution";

export type AssociationInput = ExecutionInput & {
  s2: {
    generatedFigures: Figure[];
  };
};

export type AssociationOutput = FigurePair[];

export type AssociationStage = Stage<AssociationInput, AssociationOutput>;
