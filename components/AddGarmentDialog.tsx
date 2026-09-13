"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { defaultCategories, normalizeCategory, useLabels, validateUses, wardrobeUses, type Garment, type WardrobeUse } from "../domain/wardrobe";

export function AddGarmentDialog({ open, initialUse, categories, onClose, onAdd }: { open: boolean; initialUse: WardrobeUse; categories: string[]; onClose: () => void; onAdd: (garment: Garment) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  useEffect(() => { const dialog = dialogRef.current; if (open && !dialog?.open) dialog?.showModal(); if (!open && dialog?.open) dialog.close(); }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const front = data.get("front") as File;
    const back = data.get("back") as File;
    const uses = data.getAll("uses").map(String);
    const validation = validateUses(uses);
    if (!front?.size) return setError("Añade una foto delantera.");
    if (!validation.valid) return setError(validation.error);
    const title = String(data.get("title") ?? "").trim();
    if (!title) return setError("Escribe un título para la prenda.");
    const selectedCategory = String(data.get("category") ?? "");
    const customCategory = String(data.get("customCategory") ?? "");
    const category = normalizeCategory(selectedCategory === "nueva" ? customCategory : selectedCategory, categories);
    if (!category) return setError("Selecciona o crea una categoría.");
    const images: Garment["images"] = [{ side: "frontal", reference: URL.createObjectURL(front) }];
    if (back?.size) images.push({ side: "trasera", reference: URL.createObjectURL(back) });
    onAdd({ id: crypto.randomUUID(), title, category, uses: validation.uses, note: String(data.get("note") ?? "").trim() || undefined, favorite: false, pinned: false, images });
    form.reset(); setError(""); onClose();
  }

  return <dialog ref={dialogRef} className="garment-dialog" onCancel={onClose} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">Nueva entrada</p><h2>Añadir prenda</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar">×</button></div>
    <p className="session-notice">Esta versión conserva los cambios solo durante esta visita. La persistencia privada aún no está conectada.</p>
    <form onSubmit={submit}>
      <div className="image-fields"><label>Foto delantera <strong>Obligatoria</strong><input name="front" type="file" accept="image/*" required /></label><label>Foto trasera <span>Opcional</span><input name="back" type="file" accept="image/*" /></label></div>
      <label>Título<input name="title" required maxLength={80} placeholder="Ej. Camisa azul" /></label>
      <label>Categoría<select name="category" required defaultValue=""><option value="" disabled>Selecciona una categoría</option>{[...new Set([...defaultCategories, ...categories])].map((category) => <option key={category}>{category}</option>)}<option value="nueva">Crear una categoría…</option></select></label>
      <label className="custom-category">Nueva categoría <span>Rellénala solo si ninguna categoría encaja</span><input name="customCategory" maxLength={50} placeholder="Nombre sin duplicados" /></label>
      <fieldset><legend>Uso o usos autorizados</legend><p>Trabajo es exclusivo. Los demás usos pueden convivir si los seleccionas expresamente.</p><div className="check-grid">{wardrobeUses.map((use) => <label key={use}><input type="checkbox" name="uses" value={use} defaultChecked={use === initialUse} />{useLabels[use]}</label>)}</div></fieldset>
      <label>Tejido, temperatura o comodidad <span>Opcional</span><textarea name="note" maxLength={180} placeholder="Ej. Fresca, tejido grueso…" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button className="button" type="submit">Añadir al armario</button></div>
    </form>
  </dialog>;
}
