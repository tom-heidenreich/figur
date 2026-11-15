export type PaperFormat = "pdf" | "html";

export type PaperDocument = {
  path: string;
  format: PaperFormat;
};

export type PaperArtifact = {
  path: string;
};
