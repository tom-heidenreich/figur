import type { PipelineStep } from "~/pipeline";
import type { FigurePair } from "~/domain/figure";
import type { Report } from "~/domain/report";

export type ReportingInput = FigurePair[];
export type ReportingOutput = Report;

export type ReportingStep = PipelineStep<ReportingInput, ReportingOutput>;
