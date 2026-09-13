import assert from "node:assert/strict";
import test from "node:test";
import { validateUses } from "../domain/wardrobe.ts";

test("acepta cada uso individual", () => {
  for (const use of ["trabajo", "salir", "casa", "dormir"]) assert.equal(validateUses([use]).valid, true);
});
test("acepta Casa y Dormir expresamente", () => assert.deepEqual(validateUses(["casa", "dormir"]), { valid: true, uses: ["casa", "dormir"] }));
test("Trabajo es exclusivo", () => assert.equal(validateUses(["trabajo", "salir"]).valid, false));
test("rechaza vacío y desconocidos", () => {
  assert.equal(validateUses([]).valid, false);
  assert.equal(validateUses(["deporte"]).valid, false);
});
