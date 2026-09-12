"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type Props = { children: ReactNode; label: string; className?: string };

/**
 * Faixa horizontal com rolagem nativa (snap, toque, teclado) e arraste com o mouse
 * (5.4, "galeria em faixa horizontal com rolagem arrastável"). Nada rola sozinho.
 */
export function DragScroller({ children, label, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.dataset.dragging = "true";
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const d = drag.current;
    if (!el || !d) return;
    el.scrollLeft = d.left - (e.clientX - d.x);
  };
  const end = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !drag.current) return;
    drag.current = null;
    delete el.dataset.dragging;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={ref}
      className={["galeria", className].filter(Boolean).join(" ")}
      role="region"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerLeave={end}
    >
      {children}
    </div>
  );
}
