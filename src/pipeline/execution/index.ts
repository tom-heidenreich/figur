import type { CodeSlice, Figure } from "~/domain/figure";
import type { PipelineStep } from "~/pipeline";

export type ExecutionInput = {
  extractedFigures: Figure[];
  codeSlice: CodeSlice;
};
export type ExecutionOutput = {
  extractedFigures: Figure[];
  generatedFigures: Figure[];
};

export type ExecutionStep = PipelineStep<ExecutionInput, ExecutionOutput>;
