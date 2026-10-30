import type { GuessDepVersionsQueryResult } from "@eagleoutice/flowr/queries/catalog/guess-dep-versions-query/guess-dep-versions-query-format";

export type Figure = {
  pageNumber: number;
  name: string;
  data: Uint8Array<ArrayBufferLike>;
};

export type CodeSlice = {
  content: string;
  dependencyVersions: GuessDepVersionsQueryResult;
  inputFilePaths: string[];
};

export type FigureCodePair = {
  figure: Figure;
  codeSlice: CodeSlice;
};

export type FigurePair = {
  publishedFigure: Figure;
  generatedFigure: Figure;
};

export type ComparedFigurePair = FigurePair & { similarityScore: number };
