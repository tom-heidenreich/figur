import type { Figure, FigureCodePair } from "#core/domain/figure";
import type { PaperArtifact } from "#core/domain/paper";
import type { Stage } from "#core/stages";
import type { ExtractionInput } from "#core/stages/extraction";

export type AssociationInput = ExtractionInput & {
  s1: {
    extractedFigures: Figure[];
    artifact: PaperArtifact;
  };
};

export type AssociationOutput = FigureCodePair[];

export type AssociationStage = Stage<AssociationInput, AssociationOutput>;
