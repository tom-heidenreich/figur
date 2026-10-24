import type {
  AssociationInput,
  AssociationOutput,
} from "~/pipeline/association";

export const dummyAssociation = async (
  input: AssociationInput,
): Promise<AssociationOutput> => [];
