import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

export const dummyComparison = defineVariant({
  id: "comparison/dummy",
  params: z.object({ score: z.number().min(0).max(1).default(1) }),
  create:
    ({ score }) =>
    async ({ s3 }) =>
      s3.map((pair) => ({ ...pair, similarityScore: score })),
});
