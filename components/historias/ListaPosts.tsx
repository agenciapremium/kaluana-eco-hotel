"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CategoriaPost } from "@/lib/content-schema";
import { motion as motionTokens } from "@/lib/tokens";

type Item = { slug: string; categoria: CategoriaPost; node: ReactNode };

/**
 * Listagem com filtro por categoria (5.21): os chips filtram sem recarregar. Um chip ativo
 * por vez; clicar de novo mostra tudo. Sem JavaScript os chips somem e a lista inteira fica
 * visível, já paginada pelo servidor.
 */
export function ListaPosts({
  items,
  categorias,
  rotulos,
}: {
  items: Item[];
  categorias: CategoriaPost[];
  rotulos: Record<CategoriaPost, string>;
}) {
  const [ativa, setAtiva] = useState<CategoriaPost | null>(null);
  const [fading, setFading] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const escolher = (c: CategoriaPost) => {
    const próxima = ativa === c ? null : c;
    if (timer.current) window.clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAtiva(próxima);
      return;
    }
    setFading(true);
    timer.current = window.setTimeout(() => {
      setAtiva(próxima);
      setFading(false);
    }, motionTokens.duration.filter / 2);
  };

  const visiveis = items.filter((i) => (ativa ? i.categoria === ativa : true));

  return (
    <div>
      <div className="filtro-chips mb-10" role="group" aria-label="Filtrar por assunto">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={ativa === c}
            onClick={() => escolher(c)}
          >
            {rotulos[c]}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {ativa ? `Mostrando: ${rotulos[ativa]}` : "Mostrando todos os assuntos"}
        {`, ${visiveis.length} post${visiveis.length === 1 ? "" : "s"}`}
      </p>
      <ul className="lista-posts" data-fading={fading ? "true" : undefined}>
        {items.map((i) => (
          <li key={i.slug} hidden={ativa ? i.categoria !== ativa : false}>
            {i.node}
          </li>
        ))}
      </ul>
      {visiveis.length === 0 ? (
        <p className="mt-8 text-lg">Nenhum post neste assunto por enquanto.</p>
      ) : null}
    </div>
  );
}
