import z from "zod";
import { defineVariant } from "../variant";
import type { Figure } from "#core/domain/figure";

/**
 * Requires the artifact to be in the format of the ssoc-data projects and requires the
 * application to be executed in the eagleoutice/r-run-script docker container.
 */
export const ssocExecution = defineVariant({
  id: "execution/run",
  params: z.object({
    script: z.number().int().nonnegative().default(1),
    scriptOverwrite: z.string().default(""),
  }),
  create:
    ({ script, scriptOverwrite }) =>
    async ({ input }, { logger, signal }) => {
      let execProcess: Bun.Subprocess<"ignore", "pipe", "pipe">;
      try {
        execProcess = Bun.spawn(
          [
            "bash",
            "/usr/local/src/run_script_in.sh",
            input.artifact.path,
            script.toString(),
            scriptOverwrite,
          ],
          { stdin: "ignore", stdout: "pipe", stderr: "pipe", signal },
        );
      } catch (err) {
        throw new Error(`failed to spawn R script runner for ${input.id}`, {
          cause: err,
        });
      }

      const generatedFigures: Figure[] = [];

      for await (const output of execProcess.stdout
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new LineSplitter())
        .pipeThrough(new AnalyzerOutputParser())) {
        logger.debug(
          "output",
          output.scriptId,
          output.outputId,
          output.output.slice(0, 20),
        );

        const figureName = `${output.scriptId}_${output.outputId}`;
        const imageData = Buffer.from(output.output, "hex");
        if (imageData[0] !== 0xff || imageData[1] !== 0xd8) {
          logger.info(
            `${output.scriptId}_${output.outputId} is not a JPEG, skipping.`,
          );
          continue;
        }

        generatedFigures.push({
          name: figureName,
          data: imageData,
        });
      }

      const stderr = await execProcess.stderr.text();
      logger.debug("stderr:\n", stderr);

      if (generatedFigures.length === 0) {
        logger.warn("no figures generated!");
      }

      return {
        generatedFigures,
      };
    },
});

class LineSplitter extends TransformStream<string, string> {
  constructor() {
    let buffer = "";
    super({
      transform(chunk, controller) {
        buffer += chunk;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop()!; // last element is an incomplete line (or "")
        for (const line of lines) controller.enqueue(line);
      },
      flush(controller) {
        if (buffer.length > 0) controller.enqueue(buffer);
      },
    });
  }
}

type AnalyzerOutput = {
  scriptId: number;
  outputId: number;
  output: string;
};

class AnalyzerOutputParser extends TransformStream<string, AnalyzerOutput> {
  constructor() {
    super({
      transform(line, controller) {
        const m = /^\[(\d+)\] "\\n\\nanalyzer out (\d+): (.*)"$/.exec(line);
        if (!m) return; // skip non-matching lines
        controller.enqueue({
          scriptId: Number(m[1]),
          outputId: Number(m[2]),
          output: m[3]!,
        });
      },
    });
  }
}
