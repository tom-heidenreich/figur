import type { PipelineStep } from "~/pipeline";
import type { ComparedFigurePair } from "~/domain/figure";
import type { Report } from "~/domain/report";

export type ReportingInput = ComparedFigurePair[];
export type ReportingOutput = Report;

export type ReportingStep = PipelineStep<ReportingInput, ReportingOutput>;
