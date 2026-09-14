import assert from "node:assert/strict";
import test from "node:test";
import { NextResponse } from "next/server.js";
import { authorizeUploads, handleUploadAuthorization } from "../app/api/wardrobe/uploads/route.ts";
import { confirmWithRecovery, reserveCleanup } from "../data/wardrobe-operations.ts";
import type { StorageAuth } from "../data/storage-operations.ts";
import { readFile } from "node:fs/promises";

const owner = "11111111-1111-4111-8111-111111111111";
const operation = "22222222-2222-4222-8222-222222222222";
const garment = "33333333-3333-4333-8333-333333333333";
const metadata = [{ side: "frontal", type: "image/jpeg", size: 12 }];
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://project.invalid";
function request(body: unknown) { return new Request("http://local/api/wardrobe/uploads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); }
function auth(handler: StorageAuth["request"]): StorageAuth & { state: "authenticated"; user: { id: string } } { return { state: "authenticated", user: { id: owner }, request: handler }; }

test("el controlador responde sin configuración, sin sesión y ante una petición inválida", async () => {
  const unavailable = async () => ({ error: NextResponse.json({ error: "Conexión pendiente" }, { status: 503 }) });
  assert.equal((await handleUploadAuthorization(request({}), unavailable as never)).status, 503);
  const anonymous = async () => ({ error: NextResponse.json({ error: "Inicia sesión" }, { status: 401 }) });
  assert.equal((await handleUploadAuthorization(request({}), anonymous as never)).status, 401);
  const authenticated = async () => ({ auth: auth(async () => { throw new Error("no debe llamar"); }) });
  assert.equal((await handleUploadAuthorization(request({ operationId: "arbitrario", images: metadata }), authenticated as never)).status, 400);
});

test("la migración limita las transiciones elevadas y ata la confirmación al manifiesto", async () => {
  const sql = await readFile(new URL("../data/migrations/005_secure_operation_transitions.sql", import.meta.url), "utf8");
  assert.match(sql, /wardrobe_authorize_upload[\s\S]*security definer/);
  assert.match(sql, /where owner_id=auth\.uid\(\) and id=p_operation_id and garment_id=p_garment_id[\s\S]*for update/);
  assert.match(sql, /p_front_path<>auth\.uid\(\)::text[\s\S]*Confirmación incompatible/);
  assert.match(sql, /revoke all on function wardrobe_create[\s\S]*from public,anon/);
  assert.doesNotMatch(sql, /grant (insert|update|delete).*wardrobe_operations/i);
});

test("la autorización real enlaza RPC, ruta privada y autorización firmada", async () => {
  const calls: string[] = [];
  const result = await authorizeUploads(auth(async (path, init) => {
    calls.push(`${init?.method ?? "GET"} ${path}`);
    if (path.includes("wardrobe_authorize_upload")) return Response.json({ operation_id: operation, garment_id: garment, images: [{ ...metadata[0], path: `${owner}/${garment}/${operation}/frontal` }] });
    return Response.json({ url: `/object/upload/sign/wardrobe-private/${owner}/${garment}/${operation}/frontal?token=token-publicable` });
  }) as never, { operationId: operation, images: metadata });
  assert.equal(result.garmentId, garment);
  assert.match(result.uploads[0].signedUrl, /\/storage\/v1\/object\/upload\/sign\//);
  assert.deepEqual(calls, ["POST /rest/v1/rpc/wardrobe_authorize_upload", `POST /storage/v1/object/upload/sign/wardrobe-private/${owner}/${garment}/${operation}/frontal`]);
});

test("repetir la autorización conserva prenda, operación y rutas", async () => {
  let rpcCalls = 0;
  const fake = auth(async (path) => {
    if (path.includes("wardrobe_authorize_upload")) { rpcCalls++; return Response.json({ operation_id: operation, garment_id: garment, images: [{ ...metadata[0], path: `${owner}/${garment}/${operation}/frontal` }] }); }
    return Response.json({ url: `/object/upload/sign/wardrobe-private/${owner}/${garment}/${operation}/frontal?token=token-${rpcCalls}` });
  });
  const first = await authorizeUploads(fake as never, { operationId: operation, images: metadata });
  const second = await authorizeUploads(fake as never, { operationId: operation, images: metadata });
  assert.equal(first.garmentId, second.garmentId); assert.equal(first.uploads[0].path, second.uploads[0].path);
});

test("extrae el token de la URL HTTP oficial y rechaza orígenes o rutas manipulados", async () => {
  const authorization = { operation_id: operation, garment_id: garment, images: [{ ...metadata[0], path: `${owner}/${garment}/${operation}/frontal` }] };
  for (const url of [
    `https://otro.invalid/storage/v1/object/upload/sign/wardrobe-private/${owner}/${garment}/${operation}/frontal?token=x`,
    `/object/upload/sign/wardrobe-private/${owner}/${garment}/${operation}/trasera?token=x`,
    `/object/upload/sign/wardrobe-private/${owner}/${garment}/${operation}/frontal`,
  ]) {
    let call = 0;
    await assert.rejects(authorizeUploads(auth(async () => Response.json(call++ ? { url } : authorization)) as never,
      { operationId: operation, images: metadata }), /autorización válida/);
  }
});

test("rechaza una edición de otra propietaria antes de firmar Storage", async () => {
  let storage = false;
  await assert.rejects(authorizeUploads(auth(async (path) => { if (path.includes("/storage/")) storage = true; return new Response(null, { status: 404 }); }) as never,
    { operationId: operation, garmentId: garment, images: metadata }), /no está autorizada/);
  assert.equal(storage, false);
});

test("recupera un guardado cuya respuesta se perdió y no crea otro resultado", async () => {
  let calls = 0;
  const result = await confirmWithRecovery<{ id: string }>(auth(async (path) => {
    calls++; if (path.includes("wardrobe_create")) throw new TypeError("corte");
    return Response.json({ state: "confirmed", result: { id: garment } });
  }), "wardrobe_create", {}, operation, garment);
  assert.deepEqual(result, { state: "confirmed", result: { id: garment } }); assert.equal(calls, 2);
});

test("un resultado imposible de comprobar queda recuperable y no reserva borrado", async () => {
  let cleanup = 0;
  const fake = auth(async (path) => { if (path.includes("abandon")) cleanup++; throw new TypeError("sin red"); });
  const result = await confirmWithRecovery(fake, "wardrobe_update", {}, operation, garment);
  assert.equal(result.state, "unknown"); assert.equal(cleanup, 0);
});

test("un fallo confirmado permite solo la limpieza reservada por la RPC", async () => {
  const paths = [`${owner}/${garment}/${operation}/frontal`];
  const fake = auth(async (path) => path.includes("wardrobe_create") ? new Response(null, { status: 400 }) : Response.json(paths));
  assert.equal((await confirmWithRecovery(fake, "wardrobe_create", {}, operation, garment)).state, "rejected");
  assert.deepEqual(await reserveCleanup(fake, operation, garment), paths);
});

test("una subida frontal correcta y trasera fallida abandona la operación autorizada", async () => {
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; const oldKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.invalid"; process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publicable";
  const { getWardrobePersistence } = await import("../data/wardrobe-repository.ts");
  const persistence = getWardrobePersistence(); assert.equal(persistence.available, true); if (!persistence.available) return;
  const originalFetch = globalThis.fetch; const calls: string[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input); calls.push(`${init?.method ?? "GET"} ${url}`);
    if (url === "/api/wardrobe/uploads" && init?.method === "POST") return Response.json({ operationId: operation, garmentId: garment, uploads: [
      { side: "frontal", path: `${owner}/${garment}/${operation}/frontal`, token: "a", signedUrl: "https://upload/front" },
      { side: "trasera", path: `${owner}/${garment}/${operation}/trasera`, token: "b", signedUrl: "https://upload/back" },
    ] });
    if (url === "https://upload/front") return new Response(null, { status: 200 });
    if (url === "https://upload/back") return new Response(null, { status: 503 });
    if (url === "/api/wardrobe/uploads" && init?.method === "DELETE") return Response.json({ abandoned: true });
    throw new Error(`Petición inesperada: ${url}`);
  };
  try {
    const front = new File([new Uint8Array(12)], "front.jpg", { type: "image/jpeg" });
    const back = new File([new Uint8Array(12)], "back.jpg", { type: "image/jpeg" });
    await assert.rejects(persistence.repository.create({ title: "Prenda", category: "Camisas", uses: ["casa"], note: undefined, front, back }), /trasera/);
    assert.equal(calls.filter((call) => call === "DELETE /api/wardrobe/uploads").length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = oldKey;
  }
});
