"use client";

import { useEffect } from "react";

/** Marca o hero como rolado (data-scrolled) para o véu subir e o vídeo perder opacidade. */
export function HeroScroll() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (saveData) {
      hero.querySelector("video")?.remove();
    }
    let ticking = false;
    const update = () => {
      hero.dataset.scrolled = window.scrollY > 40 ? "true" : "false";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
