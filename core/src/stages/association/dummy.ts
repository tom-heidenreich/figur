import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

export const dummyAssociation = defineVariant({
  id: "association/dummy",
  params: z.object({ abc: z.number() }),
  create:
    ({ abc }) =>
    async ({ s1 }) =>
      s1.extractedFigures.map((figure) => ({ figure, codeSlice: {} })),
});
