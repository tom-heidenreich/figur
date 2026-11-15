export type Split = "dev" | "eval";

export type Sample<V, G> = { id: string, value: V, groundTruth: G }

export interface Dataset<V, G> {
  name: string;
  version: string;
  samples(split: Split): AsyncIterable<Sample<V, G>>;
}
