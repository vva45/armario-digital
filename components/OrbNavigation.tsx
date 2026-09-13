"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const destinations = [
  { label: "Trabajo", detail: "Funcional y sobrio", href: "/armario/trabajo", tone: "work" },
  { label: "Salir", detail: "Ciudad y ocasiones", href: "/armario/salir", tone: "going-out" },
  { label: "Casa", detail: "Cómodo y acogedor", href: "/armario/casa", tone: "home" },
  { label: "Dormir", detail: "Calma nocturna", href: "/armario/dormir", tone: "sleep" },
  { label: "Conjuntos", detail: "Tus combinaciones", href: "/conjuntos", tone: "outfits" },
] as const;

export function OrbNavigation() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let isIntersecting = false;
    const update = () => setActive(isIntersecting && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      update();
    });

    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return <nav ref={ref} className="orbits" aria-label="Secciones principales" data-animated={active}>
    {destinations.map((item, index) => <Link className={`orb-link orb-link--${item.tone}`} href={item.href} key={item.href} style={{ "--delay": `${index * -4.7}s` } as React.CSSProperties}>
      <span className="orb-stage" aria-hidden="true">
        <span className="orb">
          <span className="orb__interior">
            <span className="orb__ambient" />
            <span className="orb__cloud orb__cloud--one" />
            <span className="orb__cloud orb__cloud--two" />
            <span className="orb__cloud orb__cloud--three" />
            <span className="orb__energy" />
            <span className="orb__current" />
          </span>
        </span>
      </span>
      <strong>{item.label}</strong>
      <small>{item.detail}</small>
    </Link>)}
  </nav>;
}
