import type { Garment, WardrobeUse } from "../domain/wardrobe";

export type GarmentDraft = Pick<Garment, "title" | "category" | "uses" | "note"> & { front?: File; back?: File };
export interface WardrobeRepository {
  listByUse(use: WardrobeUse): Promise<Garment[]>;
  create(draft: GarmentDraft): Promise<Garment>;
  update(id: string, changes: Partial<GarmentDraft & Pick<Garment, "favorite">>): Promise<Garment>;
  remove(id: string): Promise<void>;
}
class ApiWardrobeRepository implements WardrobeRepository {
  async response<T>(input: RequestInfo, init?: RequestInit): Promise<T> { const response = await fetch(input, { ...init, cache: "no-store" }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "No se pudo consultar el armario."); return data; }
  listByUse(use: WardrobeUse) { return this.response<Garment[]>(`/api/wardrobe?use=${use}`); }
  create(draft: GarmentDraft) { const body = draftForm(draft); return this.response<Garment>("/api/wardrobe", { method: "POST", body }); }
  update(id: string, changes: Partial<GarmentDraft & Pick<Garment, "favorite">>) { const body = draftForm(changes); return this.response<Garment>(`/api/wardrobe/${id}`, { method: "PATCH", body }); }
  async remove(id: string) { await this.response(`/api/wardrobe/${id}`, { method: "DELETE" }); }
}
function draftForm(values: Partial<GarmentDraft & Pick<Garment, "favorite">>) { const data = new FormData(); for (const [key, value] of Object.entries(values)) { if (value === undefined) continue; data.set(key, Array.isArray(value) ? JSON.stringify(value) : value instanceof File ? value : String(value)); } return data; }
export type PersistenceStatus = { available: false; reason: "missing-private-configuration" } | { available: true; repository: WardrobeRepository };
export function getWardrobePersistence(): PersistenceStatus { return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? { available: true, repository: new ApiWardrobeRepository() } : { available: false, reason: "missing-private-configuration" }; }
