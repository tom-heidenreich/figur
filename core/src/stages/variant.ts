import { z } from "zod";
import { type StageName, type Stages } from "#core/stages";

export type Variant<K extends StageName, S extends Record<string, unknown>> = {
  readonly id: `${K}/${string}`;
  create(params: S): Stages[K];
};

export function defineVariant<
  K extends StageName,
  S extends z.ZodType<Record<string, unknown>>,
>(def: {
  id: `${K}/${string}`;
  params: S;
  create(params: z.output<S>): Stages[K]["run"];
}): Variant<K, z.output<S>> {
  return {
    id: def.id,
    create: (params) =>
      ({
        id: def.id,
        run: def.create(def.params.parse(params ?? {})),
      }) as Stages[K],
  };
}
