import { Simbolo } from "@/components/brand/Simbolo";
import { Reveal } from "./Reveal";

/** Símbolo da marca desenhado em traço ao entrar na tela e depois preenchido (Parte 2.4). */
export function StrokeSymbol({ className, title }: { className?: string; title?: string }) {
  return (
    <Reveal as="span" variant="draw" className={["inline-block", className].filter(Boolean).join(" ")}>
      <Simbolo draw title={title} className="h-full w-full" />
    </Reveal>
  );
}
