import type { RunSpec } from "#testbed/run";

export function hashRunSpec<V, G>(spec: RunSpec<V, G>) {
  return new Bun.CryptoHasher("md5")
    .update(spec.dataset.name)
    .update(spec.dataset.version)
    .update(spec.split)
    .update(spec.stage.id)
    .digest("hex");
}
