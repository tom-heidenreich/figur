import type { Figure } from "#core/domain/figure";
import type { Stage } from "#core/stages";
import type { ExtractionInput } from "#core/stages/extraction";

export type ExecutionInput = ExtractionInput & {
  s1: {
    extractedFigures: Figure[];
  };
};

export type ExecutionOutput = { generatedFigures: Figure[] };

export type ExecutionStage = Stage<ExecutionInput, ExecutionOutput>;
