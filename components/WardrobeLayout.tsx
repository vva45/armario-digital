"use client";

import Link from "next/link";
import { useState } from "react";
import type { WardrobeUse } from "../domain/wardrobe";

const labels: Record<WardrobeUse, string> = { trabajo: "Trabajo", salir: "Salir", casa: "Casa", dormir: "Dormir" };
const tabs = ["Armario", "Recomendaciones", "Preview"] as const;

export function WardrobeLayout({ use }: { use: WardrobeUse }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Armario");
  return <main className={`wardrobe wardrobe--${use}`}>
    <header className="toolbar"><Link href="/" className="back">← Inicio</Link><div><p className="eyebrow">Mi armario</p><h1>{labels[use]}</h1></div><nav aria-label="Cambiar de uso">{Object.entries(labels).map(([key, label]) => <Link aria-current={key === use ? "page" : undefined} href={`/armario/${key}`} key={key}>{label}</Link>)}</nav></header>
    <div className="mobile-tabs" role="tablist" aria-label="Vista del armario">{tabs.map((item) => <button role="tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
    <section className="wardrobe-grid">
      <aside className={`panel categories ${tab === "Armario" ? "is-active" : ""}`}><span className="panel-number">01</span><h2>Categorías</h2><p>Aparecerán cuando conectes tu inventario.</p></aside>
      <section className={`panel garments ${tab === "Armario" ? "is-active" : ""}`}><span className="panel-number">02</span><h2>Mis prendas</h2><EmptyState /></section>
      <section className={`panel recommendations ${tab === "Recomendaciones" ? "is-active" : ""}`}><span className="panel-number">03</span><h2>Combina con…</h2><p>Las recomendaciones estarán disponibles cuando haya prendas reales.</p></section>
      <section className={`panel preview ${tab === "Preview" ? "is-active" : ""}`}><span className="panel-number">04</span><h2>Vista previa</h2><div className="preview-outline" aria-hidden="true" /><p>Selecciona prendas para construir un conjunto.</p></section>
    </section>
  </main>;
}

function EmptyState() { return <div className="empty"><span aria-hidden="true">◇</span><h3>Tu inventario está pendiente de conexión</h3><p>La conexión privada con Supabase y la subida de prendas llegarán en una próxima etapa.</p></div>; }
