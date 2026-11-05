import type { PaperArtifact, PaperDocument } from "~/domain/paper";

export type Case = {
  id: string;
  document: PaperDocument;
  artifact: PaperArtifact;
  outputDir: string;
};
