"use client";

import { useEffect } from "react";

/** Parte da tela que os painéis precisam cobrir para o encaixe ligar. */
const COBERTURA = 0.6;

/** Gestos que devolvem o encaixe depois da navegação por teclado. */
const GESTOS = ["pointerdown", "wheel", "touchstart"] as const;

/**
 * Liga o encaixe da rolagem (scroll snap) dos painéis de andar só enquanto eles cobrem a maior
 * parte da tela. Com o encaixe ligado na página inteira, o navegador prende a rolagem no ponto
 * de encaixe mais próximo mesmo longe dos painéis. O script só troca uma classe no html: quem
 * rola e encaixa é o navegador, com mouse, trackpad ou dedo. Com movimento reduzido, não liga.
 *
 * Navegação por teclado (decisão 120): o Tab desliga o encaixe antes de o foco mudar, e ele só
 * volta no próximo gesto de mouse, trackpad ou toque. Desligar no evento de foco não bastava: a
 * troca do tipo de encaixe no meio da rolagem até o elemento focado interrompia essa rolagem, e o
 * botão do hero ficava fora da tela ao voltar com Shift+Tab (WCAG 2.4.11).
 */
export function EncaixePaineis() {
  useEffect(() => {
    const paineis = document.querySelector<HTMLElement>(".panels");
    if (!paineis) return;
    const raiz = document.documentElement;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    let quadro = 0;
    let teclado = false;

    const atualizar = () => {
      quadro = 0;
      const r = paineis.getBoundingClientRect();
      const visivel = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
      raiz.classList.toggle(
        "encaixe-paineis",
        !reduzido.matches && !teclado && visivel >= window.innerHeight * COBERTURA,
      );
    };
    const agendar = () => {
      if (!quadro) quadro = window.requestAnimationFrame(atualizar);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || teclado) return;
      teclado = true;
      if (quadro) window.cancelAnimationFrame(quadro);
      atualizar();
    };
    const aoGesto = () => {
      if (!teclado) return;
      teclado = false;
      agendar();
    };

    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    reduzido.addEventListener("change", agendar);
    window.addEventListener("keydown", aoTeclar, true);
    GESTOS.forEach((g) => window.addEventListener(g, aoGesto, { capture: true, passive: true }));
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      reduzido.removeEventListener("change", agendar);
      window.removeEventListener("keydown", aoTeclar, true);
      GESTOS.forEach((g) => window.removeEventListener(g, aoGesto, true));
      if (quadro) window.cancelAnimationFrame(quadro);
      raiz.classList.remove("encaixe-paineis");
    };
  }, []);

  return null;
}
