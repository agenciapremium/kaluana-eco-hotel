"use client";

import { SiteLink as Link } from "@/components/ui/SiteLink";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Logotipo } from "@/components/brand/Logotipo";
import { Simbolo } from "@/components/brand/Simbolo";
import { Arrow } from "@/components/ui/Arrow";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { mainNav, phase, reservasUrl, site } from "@/lib/site";

/**
 * Cabeçalho: logo à esquerda, menu conforme a fase, Reservar à direita.
 * Some ao rolar para baixo e volta ao rolar para cima. No mobile, menu em tela cheia
 * sobre bege com os itens entrando em cascata (Parte 3.3).
 */
export function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 120 && y > last + 4) setHidden(true);
        else if (y < last - 4 || y <= 120) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const full = phase === "full";

  return (
    <header
      className="site-header"
      data-hidden={hidden && !open ? "true" : undefined}
      data-open={open ? "true" : undefined}
    >
      <div className="container-site flex items-center justify-between gap-6 py-4 lg:py-5">
        <Link
          href="/"
          className="text-cafe flex items-center gap-3"
          aria-label={`${site.name}, início`}
        >
          <Simbolo className="h-9 w-9 flex-none sm:h-10 sm:w-10" />
          <Logotipo className="h-7 w-auto sm:h-8" />
        </Link>

        {full ? (
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          {full ? (
            <>
              <Link href="/contato" className="nav-icon hidden md:inline-flex" aria-label="Contato">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </Link>
              <TrackedLink
                href={reservasUrl}
                event="reservar_click"
                params={{ origem: "cabecalho" }}
                className="btn btn-primary hidden sm:inline-flex"
              >
                Reservar
                <Arrow />
              </TrackedLink>
              <button
                type="button"
                className="nav-icon lg:hidden"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </>
          ) : (
            <a href="#avisamos" className="btn btn-primary">
              Quero ser avisado
              <Arrow />
            </a>
          )}
        </div>
      </div>

      {full ? (
        <div
          id={menuId}
          className="mobile-menu lg:hidden"
          hidden={!open}
          data-open={open ? "true" : undefined}
        >
          <nav
            aria-label="Principal, celular"
            className="container-site flex h-full flex-col justify-center py-24"
          >
            <ul className="flex flex-col gap-2">
              {mainNav.map((item, i) => (
                <li
                  key={item.href}
                  className="mobile-menu-item"
                  style={{ "--i": i } as CSSProperties}
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={item.href}
                    className="font-display text-cafe text-4xl"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li
                className="mobile-menu-item mt-6"
                style={{ "--i": mainNav.length } as CSSProperties}
              >
                <TrackedLink
                  href={reservasUrl}
                  event="reservar_click"
                  params={{ origem: "menu" }}
                  className="btn btn-primary"
                >
                  Reservar
                  <Arrow />
                </TrackedLink>
              </li>
              <li
                className="mobile-menu-item mt-2"
                style={{ "--i": mainNav.length + 1 } as CSSProperties}
              >
                <Link
                  href="/contato"
                  className="text-base underline-offset-4 hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
