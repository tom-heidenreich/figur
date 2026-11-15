import { dummyExtraction } from "#core/stages/extraction/dummy";
import { dummyDataset } from "#testbed/index";
import { defineExperiment } from "#experiments/experiment";

export const dummyExperiment = defineExperiment({
  name: "dummy",
  dataset: dummyDataset({ size: 9 }),
  split: "dev",
  base: dummyExtraction.create({ figures: 10 }),
  variants: {
    baseline: {},
    "more figures": dummyExtraction.create({ figures: 20 }),
    "even more figures": dummyExtraction.create({ figures: 40 }),
  },
});
