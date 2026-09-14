import { NextResponse } from "next/server";
import { cleanupOrReport, requireAuth, validateFields, verifyUploads, type UploadedImage } from "../helpers";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await requireAuth(); if (result.error) return result.error;
  const { id } = await params; let images: UploadedImage[] = []; let confirmed = false;
  try {
    const body = await request.json() as Record<string, unknown>; const fields = validateFields(body, true);
    images = Array.isArray(body.images) ? body.images as UploadedImage[] : [];
    const operationId = typeof body.operationId === "string" ? body.operationId : undefined;
    if (images.length) { if (!operationId || !/^[0-9a-f-]{36}$/i.test(operationId)) throw new Error("La operación no es válida."); await verifyUploads(result.auth, id, operationId, images, false); }
    const front = images.find((image) => image.side === "frontal"); const back = images.find((image) => image.side === "trasera");
    const response = await result.auth.request("/rest/v1/rpc/wardrobe_update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ p_garment_id: id, p_operation_id: operationId ?? null, p_garment_title: fields.title ?? null, p_category_name: fields.category ?? null, p_garment_uses: fields.uses ?? null, p_garment_note: fields.note === null ? "__ARMARIO_NULL__" : fields.note ?? null, p_garment_favorite: fields.favorite ?? null, p_new_front_path: front?.path ?? null, p_new_back_path: back?.path ?? null, p_front_type: front?.type ?? null, p_front_size: front?.size ?? null, p_back_type: back?.type ?? null, p_back_size: back?.size ?? null }) });
    if (!response.ok) throw new Error("No se pudo editar la prenda.");
    confirmed = true; const data = await response.json() as { obsolete_paths?: string[] };
    const cleanupIssue = await cleanupOrReport(result.auth, (data.obsolete_paths ?? []).filter(Boolean));
    return NextResponse.json({ saved: true, cleanupIssue }, { status: cleanupIssue ? 202 : 200 });
  } catch (reason) {
    const cleanupIssue = !confirmed && images.length ? await cleanupOrReport(result.auth, images.map((image) => image.path).filter(Boolean)) : undefined;
    return NextResponse.json({ saved: false, error: reason instanceof Error ? reason.message : "No se pudo editar la prenda.", cleanupIssue }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const result = await requireAuth(); if (result.error) return result.error; const { id } = await params; const response = await result.auth.request("/rest/v1/rpc/wardrobe_delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ p_garment_id: id }) }); if (!response.ok) return NextResponse.json({ error: "No se pudo eliminar la prenda." }, { status: response.status }); const paths = await response.json() as string[]; const cleanupIssue = await cleanupOrReport(result.auth, paths); return NextResponse.json({ ok: true, cleanupIssue }, { status: cleanupIssue ? 202 : 200 }); }
