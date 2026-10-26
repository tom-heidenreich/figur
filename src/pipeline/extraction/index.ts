import type { Case } from "~/domain/case";
import type { Figure } from "~/domain/figure";
import type { PaperArtifact } from "~/domain/paper";
import type { PipelineStep } from "~/pipeline";

export type ExtractionInput = Case;

export type ExtractionOutput = {
  extractedFigures: Figure[];
  artifact: PaperArtifact;
};

export type ExtractionStep = PipelineStep<ExtractionInput, ExtractionOutput>;
