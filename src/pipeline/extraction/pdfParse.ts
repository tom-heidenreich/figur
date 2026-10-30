import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";
import type { Figure } from "~/domain/figure";
import type {
  ExtractionInput,
  ExtractionOutput,
  ExtractionStep,
} from "~/pipeline/extraction";

export const pdfParseExtraction: ExtractionStep = async (
  input: ExtractionInput,
): Promise<ExtractionOutput> => {
  if (input.document.format !== "pdf") {
    throw new Error("Document format not supported yet!");
  }

  const parser = new PDFParse({
    url: pathToFileURL(input.document.path).href,
  });

  try {
    const result = await parser.getImage({
      imageBuffer: true,
      imageDataUrl: false,
      imageThreshold: 80,
    });

    const figures: Figure[] = result.pages
      .flatMap((page) =>
        page.images.map((image) => ({
          pageNumber: page.pageNumber,
          name: image.name,
          data: image.data,
        })),
      )
      // remove all images from page one for now as they are very likely decorative
      .filter((figure) => figure.pageNumber !== 1);

    return {
      extractedFigures: figures,
      artifact: input.artifact,
    };
  } finally {
    await parser.destroy();
  }
};
