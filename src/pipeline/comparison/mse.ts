import sharp from "sharp";
import type { Figure } from "~/domain/figure";
import type {
  ComparisonInput,
  ComparisonOutput,
  ComparisonStep,
} from "~/pipeline/comparison";

// both figures are scaled to the same size (ignoring the aspect ratio), so pixels can be compared one to one
const SIZE = 256;

// transparent areas become white
const toPixels = (figure: Figure): Promise<Buffer> =>
  sharp(figure.data)
    .flatten({ background: "#ffffff" })
    .resize(SIZE, SIZE, { fit: "fill" })
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

export const mseComparison: ComparisonStep = async (
  input: ComparisonInput,
): Promise<ComparisonOutput> => {
  // decode every figure once, as each one is part of several pairs
  const decode = (figures: Figure[]) =>
    Promise.all(
      figures.map(async (figure) => ({ figure, pixels: await toPixels(figure) })),
    );
  const [extracted, generated] = await Promise.all([
    decode(input.extractedFigures),
    decode(input.generatedFigures),
  ]);

  // no association between single figures yet, so compare every extracted figure with every generated one
  return extracted.flatMap((published) =>
    generated.map((output) => ({
      publishedFigure: published.figure,
      generatedFigure: output.figure,
      similarityScore: meanSquaredError(published.pixels, output.pixels),
    })),
  );
};
