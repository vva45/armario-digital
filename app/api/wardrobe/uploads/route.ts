import { NextResponse } from "next/server.js";
import { BUCKET, requireAuth, validateImageMetadata, type UploadedImage } from "../helpers.ts";
import { reserveCleanup, uploadManifest } from "../../../../data/wardrobe-operations.ts";
import { cleanupOrReport } from "../helpers.ts";

type Authorization = { garment_id: string; operation_id: string; images: UploadedImage[] };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function authorizeUploads(auth: NonNullable<Awaited<ReturnType<typeof requireAuth>>["auth"]>, body: Record<string, unknown>) {
  const operationId = typeof body.operationId === "string" ? body.operationId : "";
  const garmentId = typeof body.garmentId === "string" ? body.garmentId : null;
  const metadata = Array.isArray(body.images)
    ? body.images.map((item) => ({ ...(item as object), path: "" })) as UploadedImage[]
    : body.images;
  if (!UUID.test(operationId) || (garmentId !== null && !UUID.test(garmentId))) throw new Error("La operación no es válida.");
  validateImageMetadata(metadata);

  const response = await auth.request("/rest/v1/rpc/wardrobe_authorize_upload", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ p_operation_id: operationId, p_garment_id: garmentId, p_images: uploadManifest(metadata) }),
  });
  if (!response.ok) throw new Error(response.status === 404 ? "La prenda no está autorizada." : "No se pudo autorizar la subida.");
  const authorization = await response.json() as Authorization;
  const uploads = [];
  for (const image of authorization.images) {
    const signed = await auth.request(`/storage/v1/object/upload/sign/${BUCKET}/${image.path}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
    });
    if (!signed.ok) throw new Error("No se pudo autorizar la subida privada.");
    const data = await signed.json() as { token: string; url?: string; signedURL?: string };
    const relative = data.url ?? data.signedURL;
    if (!data.token || !relative) throw new Error("Storage no devolvió una autorización válida.");
    uploads.push({ ...image, token: data.token, signedUrl: relative.startsWith("http") ? relative : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1${relative}` });
  }
  return { operationId: authorization.operation_id, garmentId: authorization.garment_id, uploads };
}

export async function handleUploadAuthorization(request: Request, authenticate: typeof requireAuth = requireAuth) {
  const result = await authenticate(); if (result.error) return result.error;
  try { return NextResponse.json(await authorizeUploads(result.auth, await request.json() as Record<string, unknown>)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo autorizar la subida." }, { status: 400 }); }
}
export async function POST(request: Request) { return handleUploadAuthorization(request); }

export async function DELETE(request: Request) {
  const result = await requireAuth(); if (result.error) return result.error;
  try {
    const body = await request.json() as Record<string, unknown>;
    const operationId = String(body.operationId ?? ""); const garmentId = String(body.garmentId ?? "");
    if (!UUID.test(operationId) || !UUID.test(garmentId)) throw new Error("La operación no es válida.");
    const paths = await reserveCleanup(result.auth, operationId, garmentId);
    const cleanupIssue = await cleanupOrReport(result.auth, paths);
    return NextResponse.json({ abandoned: true, cleanupIssue }, { status: cleanupIssue ? 202 : 200 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo cancelar la subida." }, { status: 400 }); }
}
