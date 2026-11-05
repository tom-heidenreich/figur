import type { Figure, FigureCodePair } from "~/domain/figure";
import type { PaperArtifact } from "~/domain/paper";
import type { Stage } from "~/stages";
import type { ExtractionInput } from "~/stages/extraction";

export type AssociationInput = ExtractionInput & {
  s1: {
    extractedFigures: Figure[];
    artifact: PaperArtifact;
  };
};

export type AssociationOutput = FigureCodePair[];

export type AssociationStage = Stage<AssociationInput, AssociationOutput>;
