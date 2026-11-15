import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

export const dummyAssociation = defineVariant({
  id: "association/dummy",
  params: z.object({ abc: z.number() }),
  create:
    ({ abc }) =>
    async ({ s1, s2 }) =>
      s1.extractedFigures.flatMap((publishedFigure) =>
        s2.generatedFigures.map((generatedFigure) => ({
          publishedFigure,
          generatedFigure,
        })),
      ),
});
