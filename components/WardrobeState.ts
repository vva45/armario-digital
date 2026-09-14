import { createElement } from "react";

export type WardrobeStatus = "loading" | "ready" | "anonymous" | "unconfigured" | "error";
export function WardrobeState({ status, retry }: { status: WardrobeStatus; retry: () => void }) {
  const content = status === "unconfigured" ? ["Conexión pendiente", "Configura Supabase para acceder al inventario privado."] : status === "anonymous" ? ["Inicia sesión", "Necesitas una sesión válida para ver o modificar prendas."] : status === "error" ? ["No se pudo cargar", "Revisa la conexión y vuelve a intentarlo."] : ["Cargando armario…", "Comprobando tu sesión privada."];
  const action = status === "anonymous" ? createElement("a", { className: "button", href: "/acceso" }, "Iniciar sesión") : (status === "error" || status === "unconfigured") ? createElement("button", { className: "button", onClick: retry }, "Reintentar") : null;
  return createElement("section", { className: "state-panel" }, createElement("h2", null, content[0]), createElement("p", null, content[1]), action);
}
