import type { ComparedFigurePair, Figure } from "~/domain/figure";
import type { PipelineStep } from "~/pipeline";

export type ComparisonInput = {
  extractedFigures: Figure[];
  generatedFigures: Figure[];
};
export type ComparisonOutput = ComparedFigurePair[];

export type ComparisonStep = PipelineStep<ComparisonInput, ComparisonOutput>;
