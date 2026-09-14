import { NextResponse } from "next/server";
import { requireAuth } from "../helpers";

export async function GET() {
  const result = await requireAuth();
  if (result.error) return result.error;
  const response = await result.auth.request("/rest/v1/rpc/wardrobe_storage_summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  if (!response.ok) return NextResponse.json({ error: "No se pudo calcular el espacio del armario." }, { status: response.status });
  return NextResponse.json(await response.json(), { headers: { "Cache-Control": "private, no-store" } });
}
