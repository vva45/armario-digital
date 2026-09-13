import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCategory } from "../domain/wardrobe.ts";

test("reutiliza categorías ignorando mayúsculas y espacios", () => {
  assert.equal(normalizeCategory("  CAMISETAS "), "Camisetas");
});
test("normaliza singular, plural, sinónimos y acentos", () => {
  assert.equal(normalizeCategory("camisa"), "Camisas");
  assert.equal(normalizeCategory("cinturón"), "Cinturones");
  assert.equal(normalizeCategory("shorts"), "Pantalones cortos");
});
test("conserva una categoría nueva limpia", () => {
  assert.equal(normalizeCategory("  ropa   deportiva "), "Ropa deportiva");
});
