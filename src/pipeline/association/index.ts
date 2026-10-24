import type { Figure, FigureCodePair } from "~/domain/figure";
import type { PaperArtifact } from "~/domain/paper";
import type { PipelineStep } from "~/pipeline";

export type AssociationInput = {
  extractedFigures: Figure[];
  artifact: PaperArtifact;
};
export type AssociationOutput = FigureCodePair[];

export type AssociationStep = PipelineStep<AssociationInput, AssociationOutput>;
