import type { Experiment } from "#experiments/experiment";
import { dummyExperiment } from "#experiments/experiments/dummy";

export const experiments = [dummyExperiment] as const;
