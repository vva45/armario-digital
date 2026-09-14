import { NextResponse } from "next/server.js";
import { authenticatedSupabase } from "../../../data/supabase/server.ts";
import { validateUses } from "../../../domain/wardrobe.ts";
import { removeStoredFiles, verifyStoredUploads, type UploadedImage } from "../../../data/storage-operations.ts";
export type { UploadedImage } from "../../../data/storage-operations.ts";
export const BUCKET = "wardrobe-private";
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export type Auth = Awaited<ReturnType<typeof authenticatedSupabase>> & { state: "authenticated" };

export async function requireAuth() { const auth = await authenticatedSupabase(); if (auth.state !== "authenticated") return { error: NextResponse.json({ error: auth.state === "unconfigured" ? "Conexión pendiente" : "Inicia sesión" }, { status: auth.state === "unconfigured" ? 503 : 401 }) }; return { auth }; }
export function validateFields(values: Record<string, unknown>, partial = false) { const title = typeof values.title === "string" ? values.title.trim() : undefined; const category = typeof values.category === "string" ? values.category.trim() : undefined; const uses = Array.isArray(values.uses) ? values.uses : undefined; if (!partial && (!title || !category || !uses)) throw new Error("Completa título, categoría y usos."); if (title !== undefined && (!title || title.length > 80)) throw new Error("El título no es válido."); if (category !== undefined && (!category || category.length > 50)) throw new Error("La categoría no es válida."); if (uses) { const result = validateUses(uses.map(String)); if (!result.valid) throw new Error(result.error); } return { title, category, uses, note: values.note === null ? null : typeof values.note === "string" ? values.note.trim() || null : undefined, favorite: typeof values.favorite === "boolean" ? values.favorite : undefined }; }

export function validateImageMetadata(value: unknown): asserts value is UploadedImage[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 2) throw new Error("Las fotografías no son válidas.");
  const sides = new Set<string>();
  for (const image of value) {
    if (!image || typeof image !== "object") throw new Error("Las fotografías no son válidas.");
    const item = image as Partial<UploadedImage>;
    if (!(["frontal", "trasera"] as unknown[]).includes(item.side) || sides.has(item.side!)) throw new Error("El lado de la fotografía no es válido.");
    if (!(["image/jpeg", "image/png", "image/webp"] as unknown[]).includes(item.type) || !Number.isInteger(item.size) || Number(item.size) < 1 || Number(item.size) > MAX_IMAGE_BYTES) throw new Error("Cada fotografía debe ser JPEG, PNG o WebP y ocupar como máximo 8 MB.");
    if (typeof item.path !== "string") throw new Error("La ruta de fotografía no es válida.");
    sides.add(item.side!);
  }
}

export async function verifyUploads(auth: Auth, garmentId: string, operationId: string, images: UploadedImage[], requireFront: boolean) {
  validateImageMetadata(images);
  await verifyStoredUploads(auth, garmentId, operationId, images, requireFront);
}

export async function removeFiles(auth: Auth, paths: string[]) {
  if (!paths.length) return;
  await removeStoredFiles(auth, paths);
}

export async function cleanupOrReport(auth: Auth, paths: string[]) { try { await removeFiles(auth, paths); return undefined; } catch { console.error("Incidencia recuperable al limpiar fotografías privadas", { count: paths.length }); return "No se pudieron limpiar algunas fotografías; vuelve a intentarlo más tarde."; } }
