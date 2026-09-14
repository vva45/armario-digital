import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WardrobeState, type WardrobeStatus } from "../components/WardrobeState.ts";
import { getWardrobePersistence } from "../data/wardrobe-repository.ts";
import { removeStoredFiles, verifyStoredUploads, type StorageAuth } from "../data/storage-operations.ts";

test("los estados bloqueantes se renderizan con acciones controladas", () => {
  const cases: Array<[WardrobeStatus, string]> = [["loading", "Cargando armario"], ["unconfigured", "Conexión pendiente"], ["anonymous", "Inicia sesión"], ["error", "No se pudo cargar"]];
  for (const [status, text] of cases) assert.match(renderToStaticMarkup(createElement(WardrobeState, { status, retry: () => undefined })), new RegExp(text));
  assert.match(renderToStaticMarkup(createElement(WardrobeState, { status: "anonymous", retry: () => undefined })), /href="\/acceso"/);
  assert.match(renderToStaticMarkup(createElement(WardrobeState, { status: "error", retry: () => undefined })), /Reintentar/);
});

test("el CSS móvil oculta solo paneles de pestañas y mantiene visible el estado", () => {
  const css = readFileSync("app/globals.css", "utf8");
  assert.match(css, /\.wardrobe-grid>\.panel\{display:none\}/);
  assert.doesNotMatch(css, /(?<!wardrobe-grid>)\.panel\{display:none\}/);
  assert.match(css, /\.state-panel\{display:block/);
});

test("la persistencia conserva la misma referencia entre renders", () => {
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; const oldKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid"; process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publica";
  assert.equal(getWardrobePersistence(), getWardrobePersistence());
  if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
  if (oldKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = oldKey;
});

function fakeAuth(handler: (path: string, init?: RequestInit) => Promise<Response>): StorageAuth { return { user: { id: "owner" }, request: handler }; }

test("removeFiles informa un fallo de Storage en vez de afirmar la limpieza", async () => {
  const auth = fakeAuth(async () => new Response(null, { status: 503 }));
  await assert.rejects(removeStoredFiles(auth, ["owner/garment/op/frontal"]), /No se pudieron limpiar/);
});

test("la confirmación rechaza rutas ajenas y valida el archivo realmente subido", async () => {
  let requests = 0;
  const auth = fakeAuth(async () => { requests++; return new Response(new Uint8Array([0xff, 0xd8, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0]), { status: 206, headers: { "content-type": "image/jpeg", "content-range": "bytes 0-11/12" } }); });
  await verifyStoredUploads(auth, "garment", "operation", [{ side: "frontal", path: "owner/garment/operation/frontal", type: "image/jpeg", size: 12 }], true);
  assert.equal(requests, 1);
  await assert.rejects(verifyStoredUploads(auth, "garment", "operation", [{ side: "frontal", path: "other/garment/operation/frontal", type: "image/jpeg", size: 12 }], true), /no está autorizada/);
  assert.equal(requests, 1);
});

test("las rutas separan confirmación, firma y limpieza para no borrar tras guardar", () => {
  const createRoute = readFileSync("app/api/wardrobe/route.ts", "utf8");
  const updateRoute = readFileSync("app/api/wardrobe/[id]/route.ts", "utf8");
  assert.match(createRoute, /confirmed = true;[\s\S]*visualizationPending: true/);
  assert.match(createRoute, /!confirmed && images\.length/);
  assert.match(updateRoute, /confirmed = true;[\s\S]*obsolete_paths/);
  assert.match(updateRoute, /cleanupIssue[\s\S]*status: cleanupIssue \? 202 : 200/);
});
