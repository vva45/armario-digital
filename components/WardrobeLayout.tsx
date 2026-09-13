"use client";

import { useMemo, useState } from "react";
import { useLabels, type Garment, type WardrobeUse } from "../domain/wardrobe";
import { AddGarmentDialog } from "./AddGarmentDialog";
import { GarmentCard } from "./GarmentCard";
import { InternalHeader } from "./InternalHeader";

const tabs = ["Armario", "Recomendaciones", "Preview"] as const;

export function WardrobeLayout({ use }: { use: WardrobeUse }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Armario");
  const [garments, setGarments] = useState<Garment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const visible = garments.filter((garment) => garment.uses.includes(use));
  const categories = useMemo(() => [...new Set(garments.map((garment) => garment.category))], [garments]);
  const selected = garments.find((garment) => garment.id === selectedId);

  return <main className={`wardrobe wardrobe--${use}`}>
    <InternalHeader title={useLabels[use]} activeUse={use} />
    <div className="wardrobe-actions"><p><strong>{visible.length}</strong> {visible.length === 1 ? "prenda" : "prendas"} en {useLabels[use]}</p><button className="button" onClick={() => setDialogOpen(true)}>＋ Añadir prenda</button></div>
    <div className="mobile-tabs" role="tablist" aria-label="Vista del armario">{tabs.map((item) => <button role="tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
    <section className="wardrobe-grid">
      <aside className={`panel categories ${tab === "Armario" ? "is-active" : ""}`}><span className="panel-number">01</span><h2>Categorías</h2>{categories.length ? <ul>{categories.map((category) => <li key={category}>{category}<span>{visible.filter((garment) => garment.category === category).length}</span></li>)}</ul> : <SmallEmpty icon="＋" text="Las categorías aparecerán al añadir tu primera prenda." />}</aside>
      <section className={`panel garments ${tab === "Armario" ? "is-active" : ""}`}><span className="panel-number">02</span><h2>Mis prendas</h2>{visible.length ? <div className="garment-list">{visible.map((garment) => <GarmentCard key={garment.id} garment={garment} categories={categories} selected={selectedId === garment.id} onSelect={() => setSelectedId(selectedId === garment.id ? undefined : garment.id)} onFavorite={() => setGarments((current) => current.map((item) => item.id === garment.id ? { ...item, favorite: !item.favorite } : item))} onCategory={(category) => setGarments((current) => current.map((item) => item.id === garment.id ? { ...item, category } : item))} />)}</div> : <div className="empty"><span aria-hidden="true">◇</span><h3>Aún no hay prendas para {useLabels[use]}</h3><p>Añade una prenda con foto, categoría y usos autorizados para empezar.</p><button className="button button--secondary" onClick={() => setDialogOpen(true)}>Añadir la primera</button></div>}</section>
      <section className={`panel recommendations ${tab === "Recomendaciones" ? "is-active" : ""}`}><span className="panel-number">03</span><h2>Combina con…</h2><SmallEmpty icon="↗" text={selected ? "Las recomendaciones se activarán cuando se conecte el motor de combinaciones." : "Selecciona una prenda para preparar sus recomendaciones."} /></section>
      <section className={`panel preview ${tab === "Preview" ? "is-active" : ""}`}><span className="panel-number">04</span><h2>Vista previa</h2>{selected ? <><div className="preview-image" style={{ backgroundImage: `url(${selected.images[0].reference})` }} role="img" aria-label={`Vista previa de ${selected.title}`} /><h3>{selected.title}</h3><p>Preview individual. La composición de conjuntos llegará en una fase posterior.</p></> : <><div className="preview-outline" aria-hidden="true" /><p>Selecciona una tarjeta para preparar la vista previa.</p></>}</section>
    </section>
    <AddGarmentDialog open={dialogOpen} initialUse={use} categories={categories} onClose={() => setDialogOpen(false)} onAdd={(garment) => setGarments((current) => [...current, garment])} />
  </main>;
}

function SmallEmpty({ icon, text }: { icon: string; text: string }) { return <div className="small-empty"><span aria-hidden="true">{icon}</span><p>{text}</p></div>; }
