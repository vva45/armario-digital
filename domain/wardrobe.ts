export const wardrobeUses = ["trabajo", "salir", "casa", "dormir"] as const;
export type WardrobeUse = (typeof wardrobeUses)[number];
export type MainSection = WardrobeUse | "conjuntos";
export type GarmentImage = { side: "frontal" | "trasera"; reference: string };
export type Garment = {
  id: string;
  title: string;
  categoryId: string;
  uses: WardrobeUse[];
  images: [GarmentImage, ...GarmentImage[]];
};

export type UseValidation = { valid: true; uses: WardrobeUse[] } | { valid: false; error: string };

export function validateUses(values: readonly string[]): UseValidation {
  if (values.length === 0) return { valid: false, error: "Selecciona al menos un uso." };
  const unique = [...new Set(values)];
  if (unique.some((value) => !wardrobeUses.includes(value as WardrobeUse))) {
    return { valid: false, error: "La asignación contiene un uso desconocido." };
  }
  if (unique.includes("trabajo") && unique.length > 1) {
    return { valid: false, error: "Trabajo no puede combinarse con otros usos." };
  }
  if (unique.length > 1 && !(unique.length === 2 && unique.includes("casa") && unique.includes("dormir"))) {
    return { valid: false, error: "Solo Casa y Dormir pueden compartirse expresamente." };
  }
  return { valid: true, uses: unique as WardrobeUse[] };
}
