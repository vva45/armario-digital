import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("los cinco accesos y sus destinos están declarados", () => {
  const source = readFileSync("components/OrbNavigation.tsx", "utf8");
  for (const route of ["/armario/trabajo", "/armario/salir", "/armario/casa", "/armario/dormir", "/conjuntos"]) assert.match(source, new RegExp(route));
  assert.equal(existsSync("app/armario/[use]/page.tsx"), true);
  assert.equal(existsSync("app/conjuntos/page.tsx"), true);
});
