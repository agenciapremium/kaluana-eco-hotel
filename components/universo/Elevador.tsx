"use client";

import { useEffect, useState } from "react";

export type ParadaElevador = { id: string; ordinal: string; nome: string; accent: string };

/**
 * Indicador do elevador (5.11, movimento): no desktop é um trilho lateral que acompanha a
 * rolagem de 1º a 4º andar; no celular vira uma faixa de abas fixa no topo. Os links são
 * âncoras comuns, então funcionam sem JavaScript; o destaque do andar atual depende dele.
 */
export function Elevador({ paradas }: { paradas: ParadaElevador[] }) {
  const [atual, setAtual] = useState(paradas[0]?.id ?? "");

  useEffect(() => {
    const secoes = paradas
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (secoes.length === 0) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setAtual(visivel.target.id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -20% 0px" },
    );
    for (const s of secoes) observer.observe(s);
    return () => observer.disconnect();
  }, [paradas]);

  return (
    <nav className="elevador" aria-label="Andares">
      <ol className="elevador-lista">
        {paradas.map((p) => (
          <li key={p.id}>
            <a
              href={`#${p.id}`}
              className="elevador-parada"
              aria-current={atual === p.id ? "true" : undefined}
              style={{ ["--accent" as string]: p.accent }}
            >
              <span className="elevador-ordinal">{p.ordinal}</span>
              <span className="elevador-nome">{p.nome}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
