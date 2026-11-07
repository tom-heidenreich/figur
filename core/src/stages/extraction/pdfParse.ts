import { defineVariant } from "#core/stages/variant";
import z from "zod";
import { PDFParse } from "pdf-parse";
import { pathToFileURL } from "node:url";
import type { Figure } from "#core/domain/figure";

export const pdfParseExtraction = defineVariant({
  id: "extraction/pdf-parse",
  params: z.object({
    skipFirstPage: z.boolean(),
    imageThreshold: z.number().positive(),
  }),
  create:
    ({ skipFirstPage, imageThreshold }) =>
    async ({ input }) => {
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
          imageThreshold,
        });

        const figures: Figure[] = result.pages.flatMap((page) => {
          // remove all images from page one for now as they are very likely decorative
          if (skipFirstPage && page.pageNumber) return [];
          return page.images.map((image) => ({
            name: `${image.name}-p${page.pageNumber}`,
            data: image.data,
          }));
        });

        return {
          extractedFigures: figures,
        };
      } finally {
        await parser.destroy();
      }
    },
});
