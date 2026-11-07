import type { Dataset } from "#testbed/dataset";

// in-memory dataset of fake papers; every `evalEvery`-th sample goes to the eval split
export function dummyDataset({ size = 6, evalEvery = 3 } = {}): Dataset {
  return {
    name: "dummy",
    version: `v1-n${size}-e${evalEvery}`,
    async *samples(split) {
      for (let i = 0; i < size; i++) {
        const isEval = i % evalEvery === evalEvery - 1;
        if ((split === "eval") !== isEval) continue;
        const id = `paper-${String(i).padStart(3, "0")}`;
        yield {
          id,
          document: { path: `dummy/${id}.pdf`, format: "pdf" },
          artifact: { path: `dummy/${id}` },
          groundTruth: {},
        };
      }
    },
  };
}
