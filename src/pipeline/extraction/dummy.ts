import type {
  ExtractionInput,
  ExtractionOutput,
  ExtractionStep,
} from "~/pipeline/extraction";

export const dummyExtraction: ExtractionStep = async (
  input: ExtractionInput,
): Promise<ExtractionOutput> => ({
  extractedFigures: [],
  artifact: input.artifact,
});
