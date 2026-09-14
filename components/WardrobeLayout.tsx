"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLabels, type Garment, type WardrobeUse } from "../domain/wardrobe";
import { getWardrobePersistence, type GarmentDraft } from "../data/wardrobe-repository";
import { AddGarmentDialog } from "./AddGarmentDialog";
import { GarmentCard } from "./GarmentCard";
import { InternalHeader } from "./InternalHeader";
import { WardrobeState, type WardrobeStatus } from "./WardrobeState";
import { formatBytes } from "../data/image-optimization";

const tabs = ["Armario", "Recomendaciones", "Preview"] as const;
type Filter = "todas" | "favoritas" | string;
const wardrobePersistence = getWardrobePersistence();

export function WardrobeLayout({ use }: { use: WardrobeUse }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Armario");
  const [garments, setGarments] = useState<Garment[]>([]);
  const [status, setStatus] = useState<WardrobeStatus>("loading");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Garment>();
  const [selectedId, setSelectedId] = useState<string>();
  const [filter, setFilter] = useState<Filter>("todas");
  const [space, setSpace] = useState<{ bytes: number; images: number }>();
  const persistence = wardrobePersistence;
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | undefined>(undefined);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setGarments([]);
    setError("");
    if (!persistence.available) { setStatus("unconfigured"); return; }
    setStatus("loading");
    try {
      const sessionResponse = await fetch("/api/auth/session", { cache: "no-store", signal: controller.signal });
      if (!sessionResponse.ok) throw new Error("No se pudo comprobar la sesión.");
      const session = await sessionResponse.json();
      if (requestId !== requestRef.current) return;
      if (session.state === "unconfigured") { setStatus("unconfigured"); return; }
      if (session.state !== "authenticated") { setStatus("anonymous"); return; }
      const next = await persistence.repository.listByUse(use, controller.signal);
      if (requestId !== requestRef.current) return;
      setGarments(next);
      const usage = await fetch("/api/wardrobe/space", { cache: "no-store", signal: controller.signal });
      if (usage.ok) setSpace(await usage.json());
      setStatus("ready");
    } catch (reason) {
      if (controller.signal.aborted || requestId !== requestRef.current) return;
      setError(reason instanceof Error ? reason.message : "No se pudo cargar el armario.");
      setStatus("error");
    }
  }, [persistence, use]);

  useEffect(() => {
    void Promise.resolve().then(load);
    return () => abortRef.current?.abort();
  }, [load]);

  const categories = useMemo(() => [...new Set(garments.map((garment) => garment.category))], [garments]);
  const visible = garments.filter((garment) => filter === "todas" || filter === "favoritas" ? filter === "todas" || garment.favorite : garment.category === filter);
  const selected = garments.find((garment) => garment.id === selectedId);
  async function save(draft: GarmentDraft) { if (!persistence.available) throw new Error("Conexión pendiente"); if (editing) await persistence.repository.update(editing.id, draft); else await persistence.repository.create(draft); await load(); setEditing(undefined); }
  async function favorite(garment: Garment) { if (!persistence.available) return; try { await persistence.repository.update(garment.id, { favorite: !garment.favorite }); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo guardar el favorito."); } }
  async function remove(garment: Garment) { if (!persistence.available || !confirm(`¿Eliminar «${garment.title}» y sus fotografías?`)) return; try { await persistence.repository.remove(garment.id); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo eliminar."); } }

  return <main className={`wardrobe wardrobe--${use}`}><InternalHeader title={useLabels[use]} activeUse={use}/><div className="wardrobe-actions"><p>{status === "ready" && <><strong>{garments.length}</strong> {garments.length === 1 ? "prenda" : "prendas"}{space && <span className="space-estimate"><br/>Estimación de fotos del armario: {formatBytes(space.bytes)} · {space.images} archivos</span>}</>}</p><div>{status === "ready" && <button className="button" onClick={() => { setEditing(undefined); setDialogOpen(true); }}>＋ Añadir prenda</button>}<SessionButton status={status}/></div></div>{error && <p className="form-error" role="alert">{error}</p>}{status === "ready" && <div className="mobile-tabs" role="tablist">{tabs.map((item) => <button role="tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>}{status !== "ready" ? <WardrobeState status={status} retry={load}/> : <section className="wardrobe-grid"><aside className={`panel categories ${tab === "Armario" ? "is-active" : ""}`}><span className="panel-number">01</span><h2>Filtrar</h2><div className="category-filters"><button aria-pressed={filter === "todas"} onClick={() => setFilter("todas")}>Todas <span>{garments.length}</span></button><button aria-pressed={filter === "favoritas"} onClick={() => setFilter("favoritas")}>Favoritas <span>{garments.filter((garment) => garment.favorite).length}</span></button>{categories.map((category) => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category} <span>{garments.filter((garment) => garment.category === category).length}</span></button>)}</div></aside><section className={`panel garments ${tab === "Armario" ? "is-active" : ""}`}><span className="panel-number">02</span><h2>Mis prendas</h2>{visible.length ? <div className="garment-list">{visible.map((garment) => <GarmentCard key={garment.id} garment={garment} selected={selectedId === garment.id} onSelect={() => setSelectedId(selectedId === garment.id ? undefined : garment.id)} onFavorite={() => void favorite(garment)} onEdit={() => { setEditing(garment); setDialogOpen(true); }} onDelete={() => void remove(garment)}/>)}</div> : <div className="empty"><h3>{garments.length ? "No hay prendas con este filtro" : "Aún no hay prendas"}</h3><p>{garments.length ? "Prueba con Todas u otra categoría." : "Añade tu primera prenda para guardarla de forma privada."}</p></div>}</section><section className={`panel recommendations ${tab === "Recomendaciones" ? "is-active" : ""}`}><span className="panel-number">03</span><h2>Combina con…</h2><p>Las recomendaciones no forman parte de esta fase.</p></section><section className={`panel preview ${tab === "Preview" ? "is-active" : ""}`}><span className="panel-number">04</span><h2>Vista previa</h2>{selected ? <><div className="preview-image" style={{ backgroundImage: `url(${selected.images[0].reference})` }}/><h3>{selected.title}</h3></> : <p>Selecciona una prenda.</p>}</section></section>}<AddGarmentDialog open={dialogOpen} initialUse={use} categories={categories} garment={editing} onClose={() => { setDialogOpen(false); setEditing(undefined); }} onSave={save}/></main>;
}

function SessionButton({ status }: { status: WardrobeStatus }) { const router = useRouter(); async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/acceso"); } return status === "ready" ? <button className="button button--ghost" onClick={logout}>Cerrar sesión</button> : null; }
