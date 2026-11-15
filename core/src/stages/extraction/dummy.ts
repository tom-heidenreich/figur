import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

export const dummyExtraction = defineVariant({
  id: "extraction/dummy",
  params: z.object({ figures: z.number().int().min(0).default(2) }),
  create:
    ({ figures }) =>
    async ({ input }) => ({
      extractedFigures: Array.from({ length: figures }, (i) => ({
        name: `figure-${i}`,
        data: new Uint8Array(),
      })),
    }),
});
