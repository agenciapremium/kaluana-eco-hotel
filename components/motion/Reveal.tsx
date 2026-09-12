"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { motion as motionTokens } from "@/lib/tokens";

export type RevealVariant = "up" | "fade" | "mask" | "draw";

type Props = {
  as?: ElementType;
  variant?: RevealVariant;
  /** Atraso em ms (escalonamento entre itens de uma grade). */
  delay?: number;
  amount?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
};

/**
 * Entrada por interseção, uma vez só. O componente só marca data-inview;
 * a animação está em app/globals.css e depende de html.js.
 */
export function Reveal({ as, variant = "up", delay = 0, amount, className, style, id, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: amount ?? motionTokens.inViewAmount });
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant}
      data-inview={inView ? "true" : undefined}
      className={className}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
