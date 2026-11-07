import type { RunSpec } from "#testbed/run";

export function hashRunSpec(spec: RunSpec) {
  const stageIds = Object.values(spec.stages)
    .map((stage) => stage.id)
    .sort();

  return new Bun.CryptoHasher("md5")
    .update(spec.dataset.name)
    .update(spec.dataset.version)
    .update(spec.split)
    .update(JSON.stringify(stageIds))
    .digest("hex");
}
