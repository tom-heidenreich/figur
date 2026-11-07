import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

export const dummyReporting = defineVariant({
  id: "reporting/dummy",
  params: z.object({}),
  create: () => async () => ({}),
});
