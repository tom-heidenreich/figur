import type { ComparedFigurePair, Figure, FigureCodePair, FigurePair } from "~/domain/figure";
import type { PaperArtifact } from "~/domain/paper";
import type { PipelineStep } from "~/pipeline";

export type ComparisonInput = FigurePair[];
export type ComparisonOutput = ComparedFigurePair[];

export type ComparisonStep = PipelineStep<ComparisonInput, ComparisonOutput>;
