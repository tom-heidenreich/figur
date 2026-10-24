import type { ExtractionInput, ExtractionOutput } from "~/pipeline/extraction";

export const dummyExtraction = async (
  input: ExtractionInput,
): Promise<ExtractionOutput> => ({
  extractedFigures: [],
  artifact: {},
});
