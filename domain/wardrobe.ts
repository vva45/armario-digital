export const wardrobeUses = ["trabajo", "salir", "casa", "dormir"] as const;
export type WardrobeUse = (typeof wardrobeUses)[number];
export type MainSection = WardrobeUse | "conjuntos";

export const useLabels: Record<WardrobeUse, string> = {
  trabajo: "Trabajo",
  salir: "Salir",
  casa: "Casa",
  dormir: "Dormir",
};

export const defaultCategories = [
  "Camisas",
  "Camisetas",
  "Pantalones largos",
  "Pantalones cortos",
  "Zapatos",
  "Cinturones",
  "Accesorios",
  "Pijamas",
] as const;

export type GarmentImage = { side: "frontal" | "trasera"; reference: string; byteSize?: number };
export type Garment = {
  id: string;
  title: string;
  category: string;
  uses: WardrobeUse[];
  note?: string;
  favorite: boolean;
  pinned: boolean;
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
    return { valid: false, error: "Trabajo es exclusivo y no puede combinarse con otros usos." };
  }
  return { valid: true, uses: unique as WardrobeUse[] };
}

const categoryAliases: Record<string, string> = {
  camisa: "Camisas",
  camisas: "Camisas",
  camiseta: "Camisetas",
  camisetas: "Camisetas",
  pantalon: "Pantalones largos",
  pantalones: "Pantalones largos",
  "pantalon largo": "Pantalones largos",
  "pantalones largos": "Pantalones largos",
  "pantalon corto": "Pantalones cortos",
  "pantalones cortos": "Pantalones cortos",
  short: "Pantalones cortos",
  shorts: "Pantalones cortos",
  zapato: "Zapatos",
  zapatos: "Zapatos",
  calzado: "Zapatos",
  cinturon: "Cinturones",
  cinturones: "Cinturones",
  accesorio: "Accesorios",
  accesorios: "Accesorios",
  pijama: "Pijamas",
  pijamas: "Pijamas",
};

function comparable(value: string) {
  return value.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
}

export function normalizeCategory(value: string, existing: readonly string[] = defaultCategories): string {
  const clean = value.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const key = comparable(clean);
  const known = existing.find((category) => comparable(category) === key);
  if (known) return known;
  const alias = categoryAliases[key];
  if (alias) return existing.find((category) => comparable(category) === comparable(alias)) ?? alias;
  return clean.charAt(0).toLocaleUpperCase("es") + clean.slice(1).toLocaleLowerCase("es");
}
