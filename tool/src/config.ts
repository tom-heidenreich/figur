import type { Stages } from "@figur/core";
// import { pdfParseExtraction } from "#core/stages/extraction/pdfParse";
import { dummyExtraction } from "#core/stages/extraction/dummy";
import { dummyExecution } from "#core/stages/execution/dummy";
import { ssocExecution } from "#core/stages/execution/ssoc";
import { dummyAssociation } from "#core/stages/association/dummy";
import { dummyComparison } from "#core/stages/comparison/dummy";

export const defaultPipelineConfig: Stages = {
  // extraction: pdfParseExtraction.create({
  //   skipFirstPage: true,
  //   imageThreshold: 80,
  // }),
  extraction: dummyExtraction.create({ figures: 10 }),
  // execution: dummyExecution.create({ failOn: [] }),
  execution: ssocExecution.create({ script: 1, scriptOverwrite: "" }),
  association: dummyAssociation.create({ abc: 123 }),
  comparison: dummyComparison.create({ score: 0.7 }),
};
