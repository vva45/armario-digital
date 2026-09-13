import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("los cinco accesos y sus destinos están declarados", () => {
  const source = readFileSync("components/OrbNavigation.tsx", "utf8");
  for (const route of ["/armario/trabajo", "/armario/salir", "/armario/casa", "/armario/dormir", "/conjuntos"]) assert.match(source, new RegExp(route));
  assert.equal(existsSync("app/armario/[use]/page.tsx"), true);
  assert.equal(existsSync("app/conjuntos/page.tsx"), true);
});

test("los orbes contienen capas de energía con colores CSS válidos", () => {
  const component = readFileSync("components/OrbNavigation.tsx", "utf8");
  const styles = readFileSync("app/globals.css", "utf8");

  for (const layer of ["orb__ambient", "orb__cloud", "orb__energy", "orb__current"]) {
    assert.match(component, new RegExp(layer));
    assert.match(styles, new RegExp(`\\.${layer}`));
  }
  assert.doesNotMatch(styles, /var\(--[abc]\)(?:55|99)/);
  assert.match(styles, /\.orb__energy\s*\{[^}]*background:\s*conic-gradient/s);
  assert.match(styles, /color-mix\(in srgb,\s*var\(--[abc]\)/);
});
