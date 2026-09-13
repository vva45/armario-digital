import type { Garment, WardrobeUse } from "../domain/wardrobe";

/** Contrato de persistencia. La UI no lo suplanta con localStorage: una
 * implementación privada deberá identificar a la persona autenticada. */
export interface WardrobeRepository {
  listByUse(use: WardrobeUse): Promise<Garment[]>;
  create(garment: Omit<Garment, "id">): Promise<Garment>;
  update(id: string, changes: Partial<Pick<Garment, "title" | "category" | "uses" | "note" | "favorite">>): Promise<Garment>;
}

export type PersistenceStatus =
  | { available: false; reason: "missing-private-configuration" }
  | { available: true; repository: WardrobeRepository };

export function getWardrobePersistence(): PersistenceStatus {
  return { available: false, reason: "missing-private-configuration" };
}
