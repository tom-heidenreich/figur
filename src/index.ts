import { Pipeline } from "~/pipeline";
import { dummyExtraction } from "~/pipeline/extraction/dummy";
import { dummyAssociation } from "~/pipeline/association/dummy";
import { dummyExecution } from "~/pipeline/execution/dummy";
import { dummyReporting } from "~/pipeline/reporting/dummy";
import type { PaperArtifact, PaperDocument } from "~/domain/paper";

const pipeline = Pipeline.pipe(dummyExtraction)
  .pipe(dummyAssociation)
  .pipe(dummyExecution)
  .pipe(dummyReporting)
  .build();

const dummyDocument: PaperDocument = {};
const dummyArtifact: PaperArtifact = {};

const report = await pipeline({
  document: dummyDocument,
  artifact: dummyArtifact,
});
