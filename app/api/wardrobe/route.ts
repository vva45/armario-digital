import { NextResponse } from "next/server";
import { wardrobeUses, type Garment, type WardrobeUse } from "../../../domain/wardrobe";
import { BUCKET, cleanupOrReport, requireAuth, validateFields, verifyUploads, type UploadedImage } from "./helpers";
import { confirmWithRecovery, reserveCleanup } from "../../../data/wardrobe-operations";

type DbGarment = Omit<Garment, "images"> & { images: { side: "frontal" | "trasera"; reference: string }[] };
async function signed(auth: NonNullable<Awaited<ReturnType<typeof requireAuth>>["auth"]>, garment: DbGarment): Promise<Garment> { const images = await Promise.all(garment.images.map(async image => { const response = await auth.request(`/storage/v1/object/sign/${BUCKET}/${image.reference}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expiresIn: 900 }) }); if (!response.ok) throw new Error("No se pudo abrir una fotografía privada."); const { signedURL } = await response.json(); return { side: image.side, reference: signedURL.startsWith("http") ? signedURL : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1${signedURL}` }; })); return { ...garment, images: images as Garment["images"] }; }
export async function GET(request: Request) { const result = await requireAuth(); if (result.error) return result.error; const use = new URL(request.url).searchParams.get("use") as WardrobeUse; if (!wardrobeUses.includes(use)) return NextResponse.json({ error: "Uso no válido." }, { status: 400 }); const response = await result.auth.request(`/rest/v1/rpc/wardrobe_list`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requested_use: use }) }); if (!response.ok) return NextResponse.json({ error: "No se pudo cargar el armario." }, { status: response.status }); try { return NextResponse.json(await Promise.all(((await response.json()) as DbGarment[]).map(item => signed(result.auth, item))), { headers: { "Cache-Control": "private, no-store" } }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo cargar el armario." }, { status: 502 }); } }
export async function POST(request: Request) {
  const result = await requireAuth(); if (result.error) return result.error;
  let images: UploadedImage[] = []; let authorized = false; let garmentId = ""; let operationId = "";
  try {
    const body = await request.json() as Record<string, unknown>;
    const fields = validateFields(body); garmentId = String(body.garmentId ?? ""); operationId = String(body.operationId ?? "");
    images = body.images as UploadedImage[];
    if (!/^[0-9a-f-]{36}$/i.test(garmentId) || !/^[0-9a-f-]{36}$/i.test(operationId)) throw new Error("La operación no es válida.");
    await verifyUploads(result.auth, garmentId, operationId, images, true); authorized = true;
    const front = images.find((image) => image.side === "frontal")!; const back = images.find((image) => image.side === "trasera");
    const confirmation = await confirmWithRecovery<DbGarment>(result.auth, "wardrobe_create", { p_garment_id: garmentId, p_operation_id: operationId, p_garment_title: fields.title, p_category_name: fields.category, p_garment_uses: fields.uses, p_garment_note: fields.note, p_front_path: front.path, p_back_path: back?.path ?? null, p_front_type: front.type, p_front_size: front.size, p_back_type: back?.type ?? null, p_back_size: back?.size ?? null }, operationId, garmentId);
    if (confirmation.state === "unknown") return NextResponse.json({ saved: null, recoverable: true, garmentId, operationId, error: confirmation.error }, { status: 202 });
    if (confirmation.state === "rejected") throw new Error("No se pudo confirmar la prenda.");
    const garment = confirmation.result;
    try { return NextResponse.json({ saved: true, garment: await signed(result.auth, garment) }); }
    catch { return NextResponse.json({ saved: true, garmentId, visualizationPending: true, message: "La prenda está guardada; vuelve a cargar para recuperar sus fotografías." }, { status: 202 }); }
  } catch (reason) {
    let cleanupIssue: string | undefined;
    if (authorized && garmentId && operationId) {
      try { cleanupIssue = await cleanupOrReport(result.auth, await reserveCleanup(result.auth, operationId, garmentId)); }
      catch { cleanupIssue = "No se pudo reservar la limpieza; las fotografías se conservan de forma segura."; }
    }
    return NextResponse.json({ saved: false, error: reason instanceof Error ? reason.message : "No se pudo guardar la prenda.", cleanupIssue }, { status: 400 });
  }
}
