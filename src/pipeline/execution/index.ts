import type { FigureCodePair, FigurePair } from "~/domain/figure";
import type { PipelineStep } from "~/pipeline";

export type ExecutionInput = FigureCodePair[];
export type ExecutionOutput = FigurePair[];

export type ExecutionStep = PipelineStep<ExecutionInput, ExecutionOutput>;
