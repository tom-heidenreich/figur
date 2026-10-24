import type { ExecutionInput, ExecutionOutput } from "~/pipeline/execution";

export const dummyExecution = async (
  input: ExecutionInput,
): Promise<ExecutionOutput> => [];
