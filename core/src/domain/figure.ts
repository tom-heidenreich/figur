export type Figure = {
  name: string;
  data: Uint8Array<ArrayBufferLike>;
};

export type FigurePair = {
  publishedFigure: Figure;
  generatedFigure: Figure;
};

export type ComparedFigurePair = FigurePair & { similarityScore: number };
