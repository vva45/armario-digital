"use client";

import { useState } from "react";
import type { Garment } from "../domain/wardrobe";
import { defaultCategories, useLabels } from "../domain/wardrobe";

export function GarmentCard({ garment, selected, categories, onSelect, onFavorite, onCategory }: { garment: Garment; selected: boolean; categories: string[]; onSelect: () => void; onFavorite: () => void; onCategory: (category: string) => void }) {
  const [showBack, setShowBack] = useState(false);
  const front = garment.images.find((image) => image.side === "frontal")!;
  const back = garment.images.find((image) => image.side === "trasera");
  return <article className={`garment-card${selected ? " is-selected" : ""}`}>
    <button className="garment-card__select" onClick={onSelect} aria-pressed={selected} aria-label={`${selected ? "Quitar de" : "Añadir a"} la vista previa: ${garment.title}`}>
      <span className="garment-card__image garment-card__image--front" style={{ backgroundImage: `url(${front.reference})` }} role="img" aria-label={`Foto delantera de ${garment.title}`} />
      {back && <span className={`garment-card__image garment-card__image--back${showBack ? " is-visible" : ""}`} style={{ backgroundImage: `url(${back.reference})` }} role="img" aria-label={`Foto trasera de ${garment.title}`} />}
    </button>
    <div className="garment-card__body">
      <div className="garment-card__heading"><div><h3>{garment.title}</h3><p>{garment.category}</p></div>
        <button className="favorite" onClick={onFavorite} aria-pressed={garment.favorite} aria-label={`${garment.favorite ? "Quitar" : "Marcar"} ${garment.title} como favorita`}>{garment.favorite ? "★" : "☆"}</button>
      </div>
      <div className="tag-list">{garment.uses.map((use) => <span key={use}>{useLabels[use]}</span>)}</div>
      {garment.note && <p className="garment-note">{garment.note}</p>}
      <label className="card-category">Categoría<select value={garment.category} onChange={(event) => onCategory(event.target.value)}>{[...new Set([...defaultCategories, ...categories])].map((category) => <option key={category}>{category}</option>)}</select></label>
      {back && <button className="flip-control" type="button" onClick={() => setShowBack((current) => !current)}>{showBack ? "Ver delante" : "Ver detrás"}</button>}
      {selected && <span className="selected-label">Seleccionada para preview</span>}
    </div>
  </article>;
}
