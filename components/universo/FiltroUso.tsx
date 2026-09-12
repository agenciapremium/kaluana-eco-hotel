"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion as motionTokens } from "@/lib/tokens";
import { usosDeArvore, type UsoArvore } from "@/lib/usos";

type Item = { id: string; usos: UsoArvore[]; node: ReactNode };

/**
 * Filtro por uso do Andar das Árvores (5.14): madeira, óleo, fruta, sombra. A grade se
 * reorganiza com transição de 400 ms. Sem JavaScript os chips somem e a grade mostra tudo.
 */
export function FiltroUso({ items }: { items: Item[] }) {
  const [ativo, setAtivo] = useState<UsoArvore | null>(null);
  const [fading, setFading] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const escolher = (u: UsoArvore) => {
    const next = ativo === u ? null : u;
    if (timer.current) window.clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAtivo(next);
      return;
    }
    setFading(true);
    timer.current = window.setTimeout(() => {
      setAtivo(next);
      setFading(false);
    }, motionTokens.duration.filterGrid / 2);
  };

  return (
    <div>
      <div className="filtro-chips mb-10" role="group" aria-label="Filtrar por uso">
        {usosDeArvore.map((u) => (
          <button
            key={u.id}
            type="button"
            className="chip"
            aria-pressed={ativo === u.id}
            onClick={() => escolher(u.id)}
          >
            {u.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {ativo
          ? `Mostrando: ${usosDeArvore.find((u) => u.id === ativo)?.label}`
          : "Mostrando todas as árvores"}
      </p>
      <ul className="grade-elementos grade-arvores" data-fading={fading ? "true" : undefined}>
        {items.map((it) => (
          <li key={it.id} hidden={ativo ? !it.usos.includes(ativo) : false}>
            {it.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
