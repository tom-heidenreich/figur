import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

export const dummyExecution = defineVariant({
  id: "execution/dummy",
  params: z.object({
    // case ids to throw on, to exercise failure handling
    failOn: z.array(z.string()).default([]),
  }),
  create:
    ({ failOn }) =>
    async ({ input, s2 }) => {
      if (failOn.includes(input.id)) {
        throw new Error(`dummy execution failure for ${input.id}`);
      }
      return s2.map(({ figure }) => ({
        publishedFigure: figure,
        generatedFigure: {},
      }));
    },
});
