import type { GuessDepVersionsQueryResult } from "@eagleoutice/flowr/queries/catalog/guess-dep-versions-query/guess-dep-versions-query-format";
import { mkdtemp, readdir, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import type { CodeSlice, Figure } from "~/domain/figure";
import type {
  ExecutionInput,
  ExecutionOutput,
  ExecutionStep,
} from "~/pipeline/execution";

const wrapWithDependencies = (
  code: string,
  dependencies: GuessDepVersionsQueryResult,
): string => `
# /// script
# [dependencies]
${dependencies.dependencies.map((dep) => `# ${dep.package === "base" ? "R" : dep.package} = "${dep.range.replace(" ", ", ")}"`).join("\n")}
# ///
${code}
`;

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

  const procLock = Bun.spawn(
    ["rig", "proj", "lock", "--script", scriptPath, "--no-cache"],
    {
      cwd: outDir,
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  await Promise.all([procLock.exited, new Response(procLock.stderr).text()]);

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

export const simpleExecution: ExecutionStep = async (
  input: ExecutionInput,
): Promise<ExecutionOutput> => {
  const output: ExecutionOutput = [];
  const generated = await executeSlice(input.codeSlice);
  console.log(generated.map((value) => value.name));
  return output;
};
