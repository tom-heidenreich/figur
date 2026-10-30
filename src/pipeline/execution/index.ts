import type {
  CodeSlice,
  Figure,
  FigureCodePair,
  FigurePair,
} from "~/domain/figure";
import type { PipelineStep } from "~/pipeline";

export type ExecutionInput = {
  extractedFigures: Figure[];
  codeSlice: CodeSlice;
};
export type ExecutionOutput = FigurePair[];

export type ExecutionStep = PipelineStep<ExecutionInput, ExecutionOutput>;
