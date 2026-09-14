import type { Garment, WardrobeUse } from "../domain/wardrobe";

export type GarmentDraft = Pick<Garment, "title" | "category" | "uses" | "note"> & { front?: File; back?: File };
type UploadSide = "frontal" | "trasera";
type UploadGrant = { operationId: string; garmentId: string; uploads: { side: UploadSide; path: string; token: string; signedUrl: string }[] };

export interface WardrobeRepository {
  listByUse(use: WardrobeUse, signal?: AbortSignal): Promise<Garment[]>;
  create(draft: GarmentDraft): Promise<Garment | null>;
  update(id: string, changes: Partial<GarmentDraft & Pick<Garment, "favorite">>): Promise<void>;
  remove(id: string): Promise<void>;
}

async function response<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const result = await fetch(input, { ...init, cache: "no-store" });
  const data = await result.json().catch(() => ({}));
  if (!result.ok && result.status !== 202) throw new Error(data.error || "No se pudo consultar el armario.");
  return data as T;
}

function imageMetadata(draft: { front?: File; back?: File }) {
  return ([draft.front && { side: "frontal", type: draft.front.type, size: draft.front.size }, draft.back && { side: "trasera", type: draft.back.type, size: draft.back.size }] as const).filter(Boolean);
}

async function uploadDirect(grant: UploadGrant, draft: { front?: File; back?: File }) {
  for (const item of grant.uploads) {
    const file = item.side === "frontal" ? draft.front : draft.back;
    if (!file) throw new Error("Falta la fotografía autorizada.");
    const uploadResponse = await fetch(item.signedUrl, { method: "PUT", headers: { "Content-Type": file.type, "x-upsert": "false" }, body: file });
    if (!uploadResponse.ok) throw new Error(`No se pudo subir la foto ${item.side}.`);
  }
}

class ApiWardrobeRepository implements WardrobeRepository {
  listByUse(use: WardrobeUse, signal?: AbortSignal) { return response<Garment[]>(`/api/wardrobe?use=${use}`, { signal }); }
  async create(draft: GarmentDraft) {
    if (!draft.front) throw new Error("Añade una foto delantera.");
    let grant = pendingUploads.get(draft.front);
    if (!grant) { const operationId = crypto.randomUUID(); grant = await response<UploadGrant>("/api/wardrobe/uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operationId, images: imageMetadata(draft) }) }); await uploadDirect(grant, draft); pendingUploads.set(draft.front, grant); }
    const result = await response<{ garment?: Garment; saved: boolean; visualizationPending?: boolean }>("/api/wardrobe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operationId: grant.operationId, garmentId: grant.garmentId, title: draft.title, category: draft.category, uses: draft.uses, note: draft.note, images: grant.uploads.map((item) => { const file = item.side === "frontal" ? draft.front! : draft.back!; return { side: item.side, path: item.path, type: file.type, size: file.size }; }) }) });
    pendingUploads.delete(draft.front); return result.garment ?? null;
  }
  async update(id: string, changes: Partial<GarmentDraft & Pick<Garment, "favorite">>) {
    let grant: UploadGrant | undefined;
    if (changes.front || changes.back) {
      const operationId = crypto.randomUUID();
      grant = await response<UploadGrant>("/api/wardrobe/uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operationId, garmentId: id, images: imageMetadata(changes) }) });
      await uploadDirect(grant, changes);
    }
    await response(`/api/wardrobe/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...changes, front: undefined, back: undefined, operationId: grant?.operationId, images: grant?.uploads.map((item) => { const file = item.side === "frontal" ? changes.front : changes.back; return { side: item.side, path: item.path, type: file!.type, size: file!.size }; }) }) });
  }
  async remove(id: string) { await response(`/api/wardrobe/${id}`, { method: "DELETE" }); }
}

const pendingUploads = new WeakMap<File, UploadGrant>();

export type PersistenceStatus = { available: false; reason: "missing-private-configuration" } | { available: true; repository: WardrobeRepository };
const apiRepository = new ApiWardrobeRepository();
const availablePersistence: PersistenceStatus = { available: true, repository: apiRepository };
const unavailablePersistence: PersistenceStatus = { available: false, reason: "missing-private-configuration" };
export function getWardrobePersistence(): PersistenceStatus {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? availablePersistence : unavailablePersistence;
}
