"use client";

import { useEffect } from "react";

/**
 * Liga o traço do mapa ao card do rio (5.12): passar o mouse em um destaca o outro.
 * Feito por atributo de dado, para o mapa e a grade continuarem renderizados no servidor.
 * Sem JavaScript, o mapa e os cards seguem funcionando como links normais.
 */
export function DestaqueRio() {
  useEffect(() => {
    const alvos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-rio], [data-rio-link], [data-rio-card]"),
    );
    const marcar = (id: string | null) => {
      for (const el of alvos) {
        const meu = el.dataset.rio ?? el.dataset.rioLink ?? el.dataset.rioCard ?? "";
        if (id && meu === id) el.setAttribute("data-destaque", "true");
        else el.removeAttribute("data-destaque");
      }
    };
    const entrar = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      marcar(el.dataset.rio ?? el.dataset.rioLink ?? el.dataset.rioCard ?? null);
    };
    const sair = () => marcar(null);
    for (const el of alvos) {
      el.addEventListener("pointerenter", entrar);
      el.addEventListener("focusin", entrar);
      el.addEventListener("pointerleave", sair);
      el.addEventListener("focusout", sair);
    }
    return () => {
      for (const el of alvos) {
        el.removeEventListener("pointerenter", entrar);
        el.removeEventListener("focusin", entrar);
        el.removeEventListener("pointerleave", sair);
        el.removeEventListener("focusout", sair);
      }
    };
  }, []);
  return null;
}
