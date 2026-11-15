import { z } from "zod";
import { defineVariant } from "#core/stages/variant";

/**
 * Associate each extracted figure with the generated figure, in the order of how they were extracted/generated.
 * If no counterpart could be found for a figure, the figure is skipped.
 */
export const inOrderAssociation = defineVariant({
  id: "association/in-order",
  params: z.object({}),
  create:
    ({}) =>
    async ({ s1, s2 }, { logger }) => {
      // print warnings for generated figures not being associated
      s2.generatedFigures
        .slice(s1.extractedFigures.length, s2.generatedFigures.length)
        .map((figure) => {
          logger.warn(`no counterpart for generated figure ${figure.name}`);
        });

      return s1.extractedFigures.flatMap((publishedFigure, i) => {
        const generatedFigure = s2.generatedFigures[i];
        if (!generatedFigure) {
          logger.warn(
            `no counterpart for extracted figure ${publishedFigure.name}`,
          );
          return [];
        }
        return {
          publishedFigure,
          generatedFigure,
        };
      });
    },
});
