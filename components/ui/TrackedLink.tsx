"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type EventName, type EventParams } from "@/lib/analytics";
import { isBuilt } from "@/lib/routes";

type Props = {
  href: string;
  event: EventName;
  params?: EventParams;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

/** Link que registra um evento na camada de dados ao ser clicado. Sem JavaScript é um link comum. */
export function TrackedLink({ href, event, params, className, children, ariaLabel }: Props) {
  const external = /^https?:\/\//.test(href);
  const onClick = () => track(event, params);
  if (external) {
    return (
      <a href={href} className={className} onClick={onClick} aria-label={ariaLabel} rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={isBuilt(href) ? undefined : false} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
