// AI-generated
import { stat } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { z } from "zod";
import type { Case } from "~/domain/case";
import type { PaperFormat } from "~/domain/paper";

const CaseSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9._-]+$/, "must match [a-z0-9._-]+"),
  paper: z.strictObject({
    path: z.string().min(1),
    format: z.enum(["pdf", "html"]).optional(),
  }),
  artifact: z.strictObject({
    path: z.string().min(1),
  }),
  output: z.string().min(1).optional(),
});

export const ManifestSchema = z.strictObject({
  version: z.literal(1),
  output: z.string().min(1),
  work: z.string().min(1).optional(),
  cases: z.array(CaseSchema).min(1),
});

export type Manifest = {
  path: string;
  workDir: string;
  cases: Case[];
};

export class ManifestError extends Error {
  constructor(
    readonly manifestPath: string,
    readonly problems: string[],
  ) {
    super(
      `Invalid manifest ${manifestPath}:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
    );
    this.name = "ManifestError";
  }
}

const FORMAT_BY_EXTENSION: Record<string, PaperFormat> = {
  ".pdf": "pdf",
  ".html": "html",
  ".htm": "html",
};

const kindOf = async (path: string): Promise<"file" | "dir" | undefined> => {
  try {
    const s = await stat(path);
    return s.isDirectory() ? "dir" : s.isFile() ? "file" : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Reads and validates a manifest. Relative paths are resolved against the
 * manifest's directory. All problems are collected and thrown together as a
 * ManifestError.
 */
export const loadManifest = async (manifestPath: string): Promise<Manifest> => {
  const path = resolve(manifestPath);
  const baseDir = dirname(path);
  const fail = (problems: string[]) => new ManifestError(path, problems);

  let raw: unknown;
  try {
    raw = await Bun.file(path).json();
  } catch (e) {
    throw fail([`cannot read as JSON: ${(e as Error).message}`]);
  }

  const parsed = ManifestSchema.safeParse(raw);
  if (!parsed.success) {
    throw fail(
      parsed.error.issues.map(
        (issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`,
      ),
    );
  }
  const spec = parsed.data;

  const outputRoot = resolve(baseDir, spec.output);

  const checked = await Promise.all(
    spec.cases.map(async (c): Promise<{ case: Case; problems: string[] }> => {
      const at = `case "${c.id}"`;
      const problems: string[] = [];

      const paperPath = resolve(baseDir, c.paper.path);
      const format =
        c.paper.format ?? FORMAT_BY_EXTENSION[extname(paperPath).toLowerCase()];
      if (!format) {
        problems.push(
          `${at}: cannot infer paper format from "${c.paper.path}", set paper.format`,
        );
      }
      if ((await kindOf(paperPath)) !== "file") {
        problems.push(`${at}: paper file not found at ${paperPath}`);
      }

      const artifactPath = resolve(baseDir, c.artifact.path);
      if ((await kindOf(artifactPath)) !== "dir") {
        problems.push(`${at}: artifact directory not found at ${artifactPath}`);
      }

      return {
        case: {
          id: c.id,
          document: { path: paperPath, format: format ?? "pdf" },
          artifact: { path: artifactPath },
          outputDir: c.output
            ? resolve(baseDir, c.output)
            : join(outputRoot, c.id),
        },
        problems,
      };
    }),
  );

  const problems = checked.flatMap((c) => c.problems);
  const cases = checked.map((c) => c.case);

  const seenIds = new Set<string>();
  const outputOwners = new Map<string, string>();
  for (const c of cases) {
    if (seenIds.has(c.id)) {
      problems.push(`duplicate case id "${c.id}"`);
      continue;
    }
    seenIds.add(c.id);

    const owner = outputOwners.get(c.outputDir);
    if (owner) {
      problems.push(
        `case "${c.id}": output dir ${c.outputDir} already used by case "${owner}"`,
      );
    }
    outputOwners.set(c.outputDir, c.id);
  }

  if (problems.length > 0) throw fail(problems);

  return {
    path,
    workDir: spec.work ? resolve(baseDir, spec.work) : join(tmpdir(), "figur"),
    cases,
  };
};
