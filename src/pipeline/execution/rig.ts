import type {
  GuessDepVersionsQueryResult,
  GuessedDependency,
} from "@eagleoutice/flowr/queries/catalog/guess-dep-versions-query/guess-dep-versions-query-format";
import { mkdtemp, readdir, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import type { CodeSlice, Figure } from "~/domain/figure";
import type {
  ExecutionInput,
  ExecutionOutput,
  ExecutionStep,
} from "~/pipeline/execution";

const toConstraint = (dep: GuessedDependency): string =>
  [
    dep.minVersion && `>= ${dep.minVersion}`,
    dep.maxVersion && `<= ${dep.maxVersion}`,
  ]
    .filter(Boolean)
    .join(", ") || "*";

// Pin R version to newest, so rig doesn't pick an ancient one.
const toRConstraint = (dep: GuessedDependency): string => {
  const releaseLine = dep.maxVersion?.split(".").slice(0, 2).join(".");
  return releaseLine ?? toConstraint(dep);
};

/**
 * Add the inline dependencies block for rig.
 * @param code
 * @param dependencies
 * @param cutoffDate ISO day (YYYY-MM-DD), e.g. flowR's dateCutoff
 * @returns
 */
const wrapWithDependencies = (
  code: string,
  dependencies: GuessDepVersionsQueryResult,
  cutoffDate?: string,
): string => {
  const metadata = [
    "[dependencies]",
    ...dependencies.dependencies
      // the other base packages ship with R, their version is the R version
      .filter((dep) => !dep.base || dep.package === "base")
      .map((dep) =>
        dep.package === "base"
          ? `R = "${toRConstraint(dep)}"`
          : `${dep.package} = "${toConstraint(dep)}"`,
      ),
    `ggmirt = { git = "https://github.com/masurp/ggmirt.git" }`, // TODO: github dependencies aren't detected automatically yet
    ...(cutoffDate
      ? ["", "[tool.rig]", `exclude-newer = "${cutoffDate}"`]
      : []),
  ];
  return `
# /// script
${metadata.map((line) => `# ${line}`.trimEnd()).join("\n")}
# ///
${code}
`;
};

// every device the script opens (implicitly or explicitly) writes pngs into outDir,
// each device gets its own prefix so a dev.off() followed by a new plot doesn't overwrite earlier files
const wrapWithDevice = (code: string, outDir: string): string => `
library("ggplot2")
local({
  .figur_device_count <- 0
  .figur_device <- function(...) {
    .figur_device_count <<- .figur_device_count + 1
    grDevices::png(
      filename = file.path(${JSON.stringify(outDir)}, sprintf("plot-%02d-%%03d.png", .figur_device_count)),
      width = 7, height = 7, units = "in", res = 150
    )
  }
  options(device = .figur_device)
})

${code}

graphics.off()
`;

const executeSlice = async (slice: CodeSlice): Promise<Figure[]> => {
  const outDir = await mkdtemp(join(tmpdir(), "figur-"));
  const scriptPath = join(outDir, "script.R");
  await Bun.write(
    scriptPath,
    wrapWithDependencies(
      wrapWithDevice(slice.content, outDir),
      slice.dependencyVersions,
      slice.dependencyVersions.dateCutoff,
    ),
  );

  // link input files to temp dir
  await Promise.all(
    slice.inputFilePaths.map((path) =>
      symlink(path, join(outDir, basename(path))),
    ),
  );

  // state the required dependency versions:
  console.log(
    "Following dependencies must be installed: ",
    slice.dependencyVersions.dependencies.map(
      (dependency) => `${dependency.package} ${dependency.range}`,
    ),
  );

  const proc = Bun.spawn(["rig", "run", scriptPath], {
    cwd: outDir,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stderr] = await Promise.all([
    proc.exited,
    new Response(proc.stderr).text(),
  ]);
  if (exitCode !== 0) {
    throw new Error(
      `Rscript failed (${exitCode}) for ${scriptPath}:\n${stderr}`,
    );
  }

  const pngs = (await readdir(outDir)).filter((f) => f.endsWith(".png")).sort();
  return Promise.all(
    pngs.map(async (name) => ({
      pageNumber: 0,
      name,
      data: await Bun.file(join(outDir, name)).bytes(),
    })),
  );
};

export const rigExecution: ExecutionStep = async (
  input: ExecutionInput,
): Promise<ExecutionOutput> => {
  const generatedFigures = await executeSlice(input.codeSlice);
  console.log(generatedFigures.map((value) => value.name));
  return { extractedFigures: input.extractedFigures, generatedFigures };
};
