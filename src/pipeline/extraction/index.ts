import type { Figure } from "~/domain/figure";
import type { PaperArtifact, PaperDocument } from "~/domain/paper";
import type { PipelineStep } from "~/pipeline";

export type ExtractionInput = {
  document: PaperDocument;
  artifact: PaperArtifact;
};

export type ExtractionOutput = {
  extractedFigures: Figure[];
  artifact: PaperArtifact;
};

export type ExtractionStep = PipelineStep<ExtractionInput, ExtractionOutput>;
