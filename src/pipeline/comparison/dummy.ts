import type {
  ComparisonInput,
  ComparisonOutput,
  ComparisonStep,
} from "~/pipeline/comparison";

export const dummyComparison: ComparisonStep = async (
  input: ComparisonInput,
): Promise<ComparisonOutput> => [];
