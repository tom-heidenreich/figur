import type { GuessDepVersionsQueryResult } from "@eagleoutice/flowr/queries/catalog/guess-dep-versions-query/guess-dep-versions-query-format";

export type CodeSlice = {
  content: string;
  dependencyVersions: GuessDepVersionsQueryResult;
  inputFilePaths: string[];
};