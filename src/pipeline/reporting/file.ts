import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { Figure } from "~/domain/figure";
import type { Report } from "~/domain/report";
import type {
  ReportingInput,
  ReportingOutput,
  ReportingStep,
} from "~/pipeline/reporting";

// extracted image names (e.g. img_p0_1) repeat across pages and have no extension
const publishedPath = (figure: Figure) =>
  join("extracted", `page-${figure.pageNumber}-${figure.name}.png`);
const generatedPath = (figure: Figure) => join("generated", figure.name);

// only for readability of the report, the comparison keeps the full precision
const round = (value: number) => Math.round(value * 10_000) / 10_000;

const writeFigures = (
  outputDir: string,
  figures: Figure[],
  pathOf: (figure: Figure) => string,
) =>
  Promise.all(
    [...new Set(figures)].map((figure) =>
      Bun.write(join(outputDir, pathOf(figure)), figure.data),
    ),
  );

// writes all compared figures and a report.json with the mse of every pair into outputDir
export const fileReporting =
  (outputDir: string): ReportingStep =>
  async (input: ReportingInput): Promise<ReportingOutput> => {
    await mkdir(outputDir, { recursive: true });
    await writeFigures(
      outputDir,
      input.map((pair) => pair.publishedFigure),
      publishedPath,
    );
    await writeFigures(
      outputDir,
      input.map((pair) => pair.generatedFigure),
      generatedPath,
    );

    const report: Report = {
      pairs: input.map((pair) => ({
        publishedFigure: publishedPath(pair.publishedFigure),
        generatedFigure: generatedPath(pair.generatedFigure),
        mse: pair.similarityScore,
      })),
    };
    await Bun.write(
      join(outputDir, "report.json"),
      JSON.stringify(report, null, 2),
    );
    return report;
  };
