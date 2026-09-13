import Link from "next/link";
import type { WardrobeUse } from "../domain/wardrobe";
import { useLabels } from "../domain/wardrobe";

export function InternalHeader({ title, activeUse }: { title: string; activeUse?: WardrobeUse }) {
  return <header className="internal-header">
    <div className="internal-header__top">
      <Link href="/" className="back" aria-label="Volver al inicio"><span aria-hidden="true">←</span> Inicio</Link>
      <p className="wordmark">Mi armario</p>
    </div>
    <div className="internal-header__main">
      <div><p className="eyebrow">Armario digital</p><h1>{title}</h1></div>
      {activeUse && <nav aria-label="Cambiar de uso">{Object.entries(useLabels).map(([key, label]) => <Link aria-current={key === activeUse ? "page" : undefined} href={`/armario/${key}`} key={key}>{label}</Link>)}</nav>}
    </div>
  </header>;
}
