"use client";

import { animate } from "motion/mini";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion as tokens } from "@/lib/tokens";

/**
 * Transição de página em cortina bege: cobre a tela em 400 ms, revela a próxima em 500 ms.
 * Intercepta cliques em links internos; com movimento reduzido vira um fade. Sem JavaScript,
 * os links funcionam normalmente. Usa o `animate` mini do motion (WAAPI, sem o runtime React).
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const lastPath = useRef(pathname);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seconds = (ms: number) => ms / 1000;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const target = e.target as Element | null;
      const a = target?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.dataset.noTransition !== undefined
      )
        return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname === window.location.pathname) return;
      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      covering.current = true;
      const wait = reduced() ? tokens.duration.reduced : tokens.duration.curtainIn;
      if (reduced()) {
        el.style.transform = "translateY(0%)";
        animate(el, { opacity: [0, 1] }, { duration: seconds(tokens.duration.reduced) });
      } else {
        animate(
          el,
          { transform: ["translateY(100%)", "translateY(0%)"] },
          { duration: seconds(tokens.duration.curtainIn), ease: [...tokens.ease.standard] },
        );
      }
      window.setTimeout(() => router.push(href), wait);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    const el = ref.current;
    if (!el || !covering.current) return;
    covering.current = false;
    const reset = () => {
      el.style.transform = "translateY(100%)";
      el.style.opacity = "1";
    };
    if (reduced()) {
      animate(el, { opacity: [1, 0] }, { duration: seconds(tokens.duration.reduced) }).then(reset);
    } else {
      animate(
        el,
        { transform: ["translateY(0%)", "translateY(-100%)"] },
        { duration: seconds(tokens.duration.curtainOut), ease: [...tokens.ease.standard] },
      ).then(reset);
    }
  }, [pathname]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="page-curtain bg-bege pointer-events-none fixed inset-0 z-[60]"
      style={{ transform: "translateY(100%)" }}
    />
  );
}
