"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { perfilLabel, perfis, type Perfil } from "@/lib/acomodacoes";
import { motion as motionTokens } from "@/lib/tokens";

type Item = { id: string; perfis: Perfil[]; node: ReactNode };

/**
 * Filtro por perfil do hub de Acomodações (5.3): três chips, um ativo por vez (clicar de novo
 * mostra tudo). A grade cruza em fade de 300 ms (token `filter`). Sem JavaScript os chips
 * não aparecem e todas as categorias ficam visíveis. Nada muda na URL nem na rolagem.
 */
export function FiltroPerfil({ items, heading }: { items: Item[]; heading?: ReactNode }) {
  const [ativo, setAtivo] = useState<Perfil | null>(null);
  const [fading, setFading] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const escolher = (p: Perfil) => {
    const next = ativo === p ? null : p;
    if (timer.current) window.clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAtivo(next);
      return;
    }
    setFading(true);
    timer.current = window.setTimeout(() => {
      setAtivo(next);
      setFading(false);
    }, motionTokens.duration.filter / 2);
  };

  return (
    <div>
      <div className="filtro-chips" role="group" aria-label="Filtrar por perfil">
        {perfis.map((p) => (
          <button
            key={p}
            type="button"
            className="chip"
            aria-pressed={ativo === p}
            onClick={() => escolher(p)}
          >
            {perfilLabel[p]}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {ativo ? `Mostrando: ${perfilLabel[ativo]}` : "Mostrando todas as categorias"}
      </p>
      {heading}
      <ul className="categorias" data-fading={fading ? "true" : undefined}>
        {items.map((it) => (
          <li
            key={it.id}
            className="categoria-card"
            hidden={ativo ? !it.perfis.includes(ativo) : false}
          >
            {it.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
