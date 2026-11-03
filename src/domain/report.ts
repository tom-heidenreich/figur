export type ReportEntry = {
  // paths relative to the case's output dir
  publishedFigure: string;
  generatedFigure: string;
  mse: number;
};

export type Report = {
  pairs: ReportEntry[];
};
