import { dummyExtraction } from "#core/stages/extraction/dummy";
import { dummyAssociation } from "#core/stages/association/dummy";
import { dummyExecution } from "#core/stages/execution/dummy";
import { dummyComparison } from "#core/stages/comparison/dummy";
import { dummyReporting } from "#core/stages/reporting/dummy";
import { dummyDataset } from "#testbed/index";
import { defineExperiment } from "#experiments/experiment";

export const dummyExperiment = defineExperiment({
  name: "dummy",
  dataset: dummyDataset({ size: 9 }),
  split: "dev",
  base: {
    extraction: dummyExtraction.create({ figures: 10 }),
    association: dummyAssociation.create({ abc: 123 }),
    execution: dummyExecution.create({ failOn: [] }),
    comparison: dummyComparison.create({ score: 0.7 }),
    reporting: dummyReporting.create({}),
  },
  variants: {
    baseline: {},
    "more figures": { extraction: dummyExtraction.create({ figures: 20 }) },
    "low score": { comparison: dummyComparison.create({ score: 0.2 }) },
  },
});
