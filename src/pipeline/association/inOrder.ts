import { FlowrAnalyzerBuilder } from "@eagleoutice/flowr";
import { FlowrAnalyzerRmdFilePlugin } from "@eagleoutice/flowr/project/plugins/file-plugins/notebooks/flowr-analyzer-rmd-file-plugin";
import { FlowrAnalyzerDefaultProjectDiscoveryPlugin } from "@eagleoutice/flowr/project/plugins/project-discovery/flowr-analyzer-project-discovery-plugin";
import type { StaticSliceQueryResult } from "@eagleoutice/flowr/queries/catalog/static-slice-query/static-slice-query-format";
import type {
  AssociationInput,
  AssociationOutput,
  AssociationStep,
} from "~/pipeline/association";
import { join } from "node:path";
import { archiveBuiltIns } from "./flowrBuiltIns";

const analyzer = await new FlowrAnalyzerBuilder()
  .amendConfig((config) => {
    config.semantics.environment.overwriteBuiltIns.definitions.push(
      ...archiveBuiltIns,
    );
  })
  .setEngine("tree-sitter")
  .registerPlugins(
    new FlowrAnalyzerDefaultProjectDiscoveryPlugin(),
    new FlowrAnalyzerRmdFilePlugin(),
  )
  .build();

const sliceCode = (slicingResults: StaticSliceQueryResult): string =>
  Object.values(slicingResults.results)
    .flatMap((result) => {
      if (!("reconstruct" in result)) return [];
      const code = result.reconstruct.code;
      return Array.isArray(code) ? code : [code];
    })
    .join("\n");

export const inOrderAssociation: AssociationStep = async (
  input: AssociationInput,
): Promise<AssociationOutput> => {
  analyzer.addRequest({ request: "project", content: input.artifact.path });
  const queryResults = await analyzer.query([{ type: "dependencies" }]);
  const visualizations = queryResults.dependencies.visualize;
  console.log("\n\n######### Visualizations ##########");
  console.log(visualizations);

  const visualizationNodeIds = visualizations
    .map((value) => value.nodeId)
    .filter((nodeId) => nodeId !== undefined);

  const sliceResult = await analyzer.query([
    {
      type: "static-slice",
      criteria: visualizationNodeIds.map((nodeId) => `$${nodeId}` as const),
    },
  ]);
  const slice = sliceCode(sliceResult["static-slice"]);

  analyzer.reset();
  analyzer.addRequest({ request: "text", content: slice });

  const sliceQueryResults = await analyzer.query([
    { type: "dependencies" },
    { type: "guess-dep-versions", date: input.cutoffDate },
  ]);
  const inputFilePaths = sliceQueryResults.dependencies.read.flatMap((read) =>
    read.value !== undefined && read.value !== "unknown"
      ? [join(input.artifact.path, read.value)]
      : [],
  );

  console.log("\n\n######### Reads ##########");
  console.log(sliceQueryResults.dependencies.read);

  analyzer.reset();

  return {
    extractedFigures: input.extractedFigures,
    codeSlice: {
      content: slice,
      dependencyVersions: sliceQueryResults["guess-dep-versions"],
      inputFilePaths,
    },
  };
};
