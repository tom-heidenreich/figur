import { mkdir } from "node:fs/promises";
import { dirname} from "node:path";
import { type Trace } from "@figur/core";

export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await Bun.write(path, JSON.stringify(value, null, 2) + "\n");
}

// Error objects don't survive JSON.stringify
export function serializeTrace(trace: Trace): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [stage, record] of Object.entries(trace)) {
    if ("error" in record) {
      const { name, message, stack } = record.error;
      out[stage] = { ...record, error: { name, message, stack } };
    } else {
      out[stage] = record;
    }
  }
  return out;
}
