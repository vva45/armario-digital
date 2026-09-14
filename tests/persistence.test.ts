import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("la migración protege todas las tablas y el bucket por identidad", () => {
  const sql = readFileSync("data/migrations/002_secure_private_wardrobe.sql", "utf8");
  for (const table of ["wardrobe_categories", "wardrobe_garments", "wardrobe_garment_uses", "wardrobe_images"]) assert.match(sql, new RegExp(`alter table ${table} enable row level security`));
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /'wardrobe-private','wardrobe-private',false,8388608/);
  assert.match(sql, /storage\.foldername\(name\)/);
  assert.match(sql, /Trabajo es exclusivo/);
});

test("el inventario usa API persistente y no crea identificadores o blobs locales", () => {
  const repository = readFileSync("data/wardrobe-repository.ts", "utf8");
  const layout = readFileSync("components/WardrobeLayout.tsx", "utf8");
  assert.match(repository, /\/api\/wardrobe/);
  assert.doesNotMatch(layout, /crypto\.randomUUID|URL\.createObjectURL/);
});
