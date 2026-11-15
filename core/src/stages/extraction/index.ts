import type { Figure } from "#core/domain/figure";
import type { RawInput, Stage } from "#core/stages";

export type ExtractionInput = { input: RawInput };

export type ExtractionOutput = {
  extractedFigures: Figure[];
};

export type ExtractionStage = Stage<ExtractionInput, ExtractionOutput>;
