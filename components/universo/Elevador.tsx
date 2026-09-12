"use client";

import { useEffect, useRef, useState } from "react";

export type ParadaElevador = { id: string; ordinal: string; nome: string; accent: string };

/**
 * Indicador do elevador (5.11, movimento): no desktop é um trilho lateral que acompanha a
 * rolagem de 1º a 4º andar; no celular vira uma faixa de abas fixa no topo. Os links são
 * âncoras comuns, então funcionam sem JavaScript; o destaque do andar atual depende dele.
 *
 * No desktop o trilho é fixo. Fora da sequência de andares ele sai de cena (data-fora), para
 * o texto bege não passar sobre as seções claras e o rodapé (etapa 6).
 */
export function Elevador({ paradas }: { paradas: ParadaElevador[] }) {
  const [atual, setAtual] = useState(paradas[0]?.id ?? "");
  const [fora, setFora] = useState(false);
  const nav = useRef<HTMLElement>(null);

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

  useEffect(() => {
    // A faixa do meio da tela, onde o trilho fica, precisa estar sobre os andares.
    const sequencia = secoesDe(paradas);
    if (sequencia.length === 0) return;
    const visiveis = new Set<Element>();
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visiveis.add(e.target);
          else visiveis.delete(e.target);
        }
        setFora(visiveis.size === 0);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const s of sequencia) observer.observe(s);
    return () => observer.disconnect();
  }, [paradas]);

  return (
    <nav ref={nav} className="elevador" aria-label="Andares" data-fora={fora ? "true" : undefined}>
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

function secoesDe(paradas: ParadaElevador[]): HTMLElement[] {
  return paradas
    .map((p) => document.getElementById(p.id))
    .filter((el): el is HTMLElement => Boolean(el));
}
