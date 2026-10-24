import type {
  AssociationInput,
  AssociationOutput,
  AssociationStep,
} from "~/pipeline/association";

export const dummyAssociation: AssociationStep = async (
  input: AssociationInput,
): Promise<AssociationOutput> => [];
