import { z } from "zod";
import { defineVariant } from "#core/stages/variant";
import type { Figure } from "#core/domain/figure";
import sharp from "sharp";

// transparent areas become white
const toPixels = (figure: Figure, size: number): Promise<Buffer> =>
  sharp(figure.data)
    .flatten({ background: "#ffffff" })
    .resize(size, size, { fit: "fill" }) // ignored aspect ratio, probably not great
    .removeAlpha()
    .raw()
    .toBuffer();

// mean squared error over all RGB channels, with values scaled to [0, 1]: 0 means identical
const meanSquaredError = (a: Buffer, b: Buffer): number => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = (a[i]! - b[i]!) / 255;
    sum += diff * diff;
  }
  return sum / a.length;
};

export const dummyComparison = defineVariant({
  id: "comparison/mse",
  params: z.object({ scaleTo: z.number().int().positive().default(256) }),
  create:
    ({ scaleTo }) =>
    async ({ s3 }) =>
      Promise.all(
        s3.map(async ({ publishedFigure, generatedFigure }) => ({
          publishedFigure,
          generatedFigure,
          similarityScore: meanSquaredError(
            await toPixels(publishedFigure, scaleTo),
            await toPixels(generatedFigure, scaleTo),
          ),
        })),
      ),
});
