"use client";

import { useEffect } from "react";

/**
 * Acende o ponto do mapa conforme a rolagem passa pelo bloco correspondente (5.20).
 * Liga as duas coisas por atributo de dado, para o mapa e os blocos continuarem
 * renderizados no servidor. Sem JavaScript, os pontos ficam todos visíveis e parados.
 */
export function PontosAtivos() {
  useEffect(() => {
    const pontos = Array.from(document.querySelectorAll<SVGGElement>("[data-ponto]"));
    if (pontos.length === 0) return;
    const secoes = pontos
      .map((p) => document.getElementById(p.dataset.ponto ?? ""))
      .filter((el): el is HTMLElement => Boolean(el));
    if (secoes.length === 0) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visivel) return;
        for (const p of pontos) {
          if (p.dataset.ponto === visivel.target.id) p.setAttribute("data-ativo", "true");
          else p.removeAttribute("data-ativo");
        }
      },
      { threshold: [0.2, 0.5], rootMargin: "-25% 0px -25% 0px" },
    );
    for (const s of secoes) observer.observe(s);
    return () => observer.disconnect();
  }, []);
  return null;
}
