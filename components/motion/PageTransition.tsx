"use client";

import { LazyMotion, m, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion as tokens } from "@/lib/tokens";

type State = "idle" | "covering" | "revealing";

/** Motor de animação carregado sob demanda, fora do bundle inicial. */
const loadFeatures = () => import("motion/react").then((mod) => mod.domAnimation);

/**
 * Transição de página em cortina bege: cobre a tela em 400 ms, revela a próxima em 500 ms.
 * Intercepta cliques em links internos; com movimento reduzido vira um fade. Sem JavaScript,
 * os links funcionam normalmente.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [state, setState] = useState<State>("idle");
  const lastPath = useRef(pathname);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const a = target?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname === window.location.pathname) return;
      e.preventDefault();
      setState("covering");
      const wait = reduced ? tokens.duration.reduced : tokens.duration.curtainIn;
      window.setTimeout(() => router.push(href), wait);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, reduced]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    setState((s) => (s === "covering" ? "revealing" : s));
  }, [pathname]);

  useEffect(() => {
    if (state !== "revealing") return;
    const wait = reduced ? tokens.duration.reduced : tokens.duration.curtainOut;
    const t = window.setTimeout(() => setState("idle"), wait);
    return () => window.clearTimeout(t);
  }, [state, reduced]);

  const y = state === "covering" ? "0%" : state === "revealing" ? "-100%" : "100%";
  const seconds = (ms: number) => ms / 1000;

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
      aria-hidden="true"
      className="page-curtain pointer-events-none fixed inset-0 z-[60] bg-bege"
      initial={false}
      animate={
        reduced
          ? { y: "0%", opacity: state === "covering" ? 1 : 0 }
          : { y, opacity: 1 }
      }
      transition={
        state === "idle"
          ? { duration: 0 }
          : {
              duration: seconds(
                reduced
                  ? tokens.duration.reduced
                  : state === "covering"
                    ? tokens.duration.curtainIn
                    : tokens.duration.curtainOut,
              ),
              ease: state === "covering" ? [...tokens.ease.standard] : [...tokens.ease.standard],
            }
      }
      style={reduced && state === "idle" ? { display: "none" } : undefined}
      />
    </LazyMotion>
  );
}
