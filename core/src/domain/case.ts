import type { PaperArtifact, PaperDocument } from "#core/domain/paper";

export type Case = {
  id: string;
  document: PaperDocument;
  artifact: PaperArtifact;
  outputDir: string;
};
