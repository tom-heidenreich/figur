import type { PaperArtifact, PaperDocument } from "@figur/core";

export type Split = "dev" | "eval";

export type GroundTruth = {};

export interface Sample {
  id: string;
  document: PaperDocument;
  artifact: PaperArtifact;
  groundTruth: GroundTruth;
}

export interface Dataset {
  name: string;
  version: string;
  samples(split: Split): AsyncIterable<Sample>;
}
