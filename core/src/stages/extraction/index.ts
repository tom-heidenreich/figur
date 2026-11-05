import type { Figure } from "#core/domain/figure";
import type { PaperArtifact } from "#core/domain/paper";
import type { RawInput, Stage } from "#core/stages";

export type ExtractionInput = { input: RawInput };

export type ExtractionOutput = {
  extractedFigures: Figure[];
  artifact: PaperArtifact;
};

export type ExtractionStage = Stage<ExtractionInput, ExtractionOutput>;
