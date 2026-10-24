import type {
  ExecutionInput,
  ExecutionOutput,
  ExecutionStep,
} from "~/pipeline/execution";

export const dummyExecution: ExecutionStep = async (
  input: ExecutionInput,
): Promise<ExecutionOutput> => [];
