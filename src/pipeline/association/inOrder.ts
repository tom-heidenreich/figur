import { FlowrAnalyzerBuilder } from "@eagleoutice/flowr";
import { FlowrAnalyzerRmdFilePlugin } from "@eagleoutice/flowr/project/plugins/file-plugins/notebooks/flowr-analyzer-rmd-file-plugin";
import { FlowrAnalyzerDefaultProjectDiscoveryPlugin } from "@eagleoutice/flowr/project/plugins/project-discovery/flowr-analyzer-project-discovery-plugin";
import type { StaticSliceQueryResult } from "@eagleoutice/flowr/queries/catalog/static-slice-query/static-slice-query-format";
import { highlight } from "cli-highlight";
import type {
  AssociationInput,
  AssociationOutput,
  AssociationStep,
} from "~/pipeline/association";
import { join } from "node:path";

const analyzer = await new FlowrAnalyzerBuilder()
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
    { type: "guess-dep-versions" },
  ]);
  const inputFilePaths = sliceQueryResults.dependencies.read
    .map((read) => read.value && join(input.artifact.path, read.value))
    .filter((value) => value !== undefined);

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
