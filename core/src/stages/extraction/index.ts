import type { Figure } from "~/domain/figure";
import type { PaperArtifact } from "~/domain/paper";
import type { RawInput, Stage } from "~/stages";

export type ExtractionInput = { input: RawInput };

export type ExtractionOutput = {
  extractedFigures: Figure[];
  artifact: PaperArtifact;
};

export type ExtractionStage = Stage<ExtractionInput, ExtractionOutput>;
