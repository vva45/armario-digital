/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { defaultCategories, normalizeCategory, useLabels, validateUses, wardrobeUses, type Garment, type WardrobeUse } from "../domain/wardrobe";
import type { GarmentDraft } from "../data/wardrobe-repository";
import { createOptimizedCopy, formatBytes, inspectImage, type ImageVersion } from "../data/image-optimization";

type Side = "front" | "back";
type Prepared = { original: ImageVersion; optimized?: ImageVersion; originalUrl: string; optimizedUrl?: string; error?: string };

export function AddGarmentDialog({ open, initialUse, categories, garment, onClose, onSave }: { open: boolean; initialUse: WardrobeUse; categories: string[]; garment?: Garment; onClose: () => void; onSave: (draft: GarmentDraft) => Promise<void> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [mode, setMode] = useState<"original" | "optimized">("original");
  const [prepared, setPrepared] = useState<Partial<Record<Side, Prepared>>>({});
  const preparedRef = useRef(prepared);

  useEffect(() => { const dialog = dialogRef.current; if (open && !dialog?.open) dialog?.showModal(); if (!open && dialog?.open) dialog.close(); }, [open]);
  useEffect(() => { preparedRef.current = prepared; }, [prepared]);
  useEffect(() => () => { Object.values(preparedRef.current).forEach((item) => { if (item) { URL.revokeObjectURL(item.originalUrl); if (item.optimizedUrl) URL.revokeObjectURL(item.optimizedUrl); } }); }, []);

  async function prepare(side: Side, file?: File) {
    setPreparing(true);
    try {
      const next = file?.size ? { original: await inspectImage(file), originalUrl: URL.createObjectURL(file) } as Prepared : undefined;
      if (next) {
        try { next.optimized = await createOptimizedCopy(file!); next.optimizedUrl = URL.createObjectURL(next.optimized.file); }
        catch (reason) { next.error = reason instanceof Error ? reason.message : "No se pudo optimizar."; }
      }
      setPrepared((current) => { const previous = current[side]; if (previous) { URL.revokeObjectURL(previous.originalUrl); if (previous.optimizedUrl) URL.revokeObjectURL(previous.optimizedUrl); } return { ...current, [side]: next }; });
    } catch { setError("No se pudo leer la imagen. Elige un archivo JPEG, PNG o WebP válido."); }
    finally { setPreparing(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selected = (side: Side) => mode === "optimized" ? prepared[side]?.optimized?.file : prepared[side]?.original.file;
    const front = selected("front"); const back = selected("back");
    const validation = validateUses(data.getAll("uses").map(String));
    if (!garment && !front?.size) return setError("Añade una foto delantera.");
    if (!validation.valid) return setError(validation.error);
    const title = String(data.get("title") || "").trim(); if (!title) return setError("Escribe un título para la prenda.");
    const chosen = String(data.get("category") || "");
    const category = normalizeCategory(chosen === "nueva" ? String(data.get("customCategory") || "") : chosen, categories);
    if (!category) return setError("Selecciona o crea una categoría.");
    if (chosen === "nueva" && !confirm(`¿Crear la categoría «${category}»?`)) return;
    setSaving(true); setError("");
    try {
      await onSave({ title, category, uses: validation.uses, note: String(data.get("note") || "").trim() || undefined, front, back });
      form.reset(); setPrepared({}); setMode("original"); onClose();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo guardar."); }
    finally { setSaving(false); }
  }

  return <dialog ref={dialogRef} className="garment-dialog" onCancel={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">Inventario privado</p><h2>{garment ? "Editar prenda" : "Añadir prenda"}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">×</button></div>
    <form onSubmit={submit}>
      <p className="upload-help">No necesitas renombrar las fotos ni crear carpetas. Elige la delantera y añade la trasera si la prenda la necesita.</p>
      <div className="image-fields">
        <ImageField side="front" label="Delantera" required={!garment} prepared={prepared.front} mode={mode} onChange={prepare}/>
        <ImageField side="back" label="Trasera" required={false} prepared={prepared.back} mode={mode} onChange={prepare}/>
      </div>
      {(prepared.front || prepared.back) && <fieldset className="optimization-choice"><legend>Archivo que se subirá</legend>
        <label><input type="radio" checked={mode === "original"} onChange={() => setMode("original")}/> Conservar el archivo de origen admitido</label>
        <label><input type="radio" checked={mode === "optimized"} disabled={Object.values(prepared).some((item) => item && !item.optimized)} onChange={() => setMode("optimized")}/> Subir la copia optimizada revisada</label>
        {mode === "optimized" && <p>La copia no es idéntica al original. Conserva el original aparte en tu móvil u ordenador; la aplicación nunca lo borra.</p>}
      </fieldset>}
      <label>Título<input name="title" required maxLength={80} defaultValue={garment?.title}/></label>
      <label>Categoría<select name="category" required defaultValue={garment?.category || ""}><option value="" disabled>Selecciona</option>{[...new Set([...defaultCategories, ...categories])].map((category) => <option key={category}>{category}</option>)}<option value="nueva">Crear una categoría…</option></select></label>
      <label className="custom-category">Nueva categoría<input name="customCategory" maxLength={50}/></label>
      <fieldset><legend>Usos autorizados</legend><p>Trabajo es exclusivo.</p><div className="check-grid">{wardrobeUses.map((item) => <label key={item}><input type="checkbox" name="uses" value={item} defaultChecked={garment ? garment.uses.includes(item) : item === initialUse}/>{useLabels[item]}</label>)}</div></fieldset>
      <label>Nota <span>Opcional</span><textarea name="note" maxLength={180} defaultValue={garment?.note}/></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button className="button" disabled={saving || preparing}>{preparing ? "Preparando fotos…" : saving ? "Guardando…" : "Guardar"}</button></div>
    </form>
  </dialog>;
}

function ImageField({ side, label, required, prepared, mode, onChange }: { side: Side; label: string; required: boolean; prepared?: Prepared; mode: "original" | "optimized"; onChange: (side: Side, file?: File) => void }) {
  const displayed = mode === "optimized" && prepared?.optimized ? prepared.optimized : prepared?.original;
  const url = mode === "optimized" && prepared?.optimizedUrl ? prepared.optimizedUrl : prepared?.originalUrl;
  return <label>{label} <strong>{required ? "Obligatoria" : "Opcional"}</strong>
    <input name={side} type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={(event) => void onChange(side, event.target.files?.[0])}/>
    {url && displayed && <><img className="upload-preview" src={url} alt={`Previsualización ${label.toLocaleLowerCase("es")}`}/><span className="image-details">{formatBytes(displayed.file.size)} · {displayed.width} × {displayed.height} px</span></>}
    {prepared?.optimized && <span className="image-comparison">Original: {formatBytes(prepared.original.file.size)} · copia: {formatBytes(prepared.optimized.file.size)}</span>}
    {prepared?.error && <span className="form-error">{prepared.error} Puedes subir el original.</span>}
  </label>;
}
